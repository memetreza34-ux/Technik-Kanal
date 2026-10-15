#!/usr/bin/env node
import {spawnSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import {
  channelRoot,
  ensureDirectory,
  ffprobe,
  projectPaths,
  readJson,
  repositoryRoot,
  run,
  writeJson,
} from './lib/electrical-project.mjs';
import {loadElectricalConfig} from './lib/load-electrical-config.mjs';

const args = process.argv.slice(2);
const projectArg = args.find((arg) => !arg.startsWith('--'));
const videoArg = args.find((arg) => arg.startsWith('--video='));
if (!projectArg) {
  console.error('Nutzung: npm run science:render-qa -- <video-ordner> [--video=video.mp4]');
  process.exit(1);
}

const paths = projectPaths(projectArg);
const sourcePlan = readJson(paths.scenePlan);
const config = loadElectricalConfig(sourcePlan.productionProfile);
const thresholds = config.renderQa;
const runtimeFile = path.join(paths.projectFilesDir, 'reel-runtime.json');
if (!fs.existsSync(runtimeFile)) throw new Error('Kompatibilitäts-Runtime reel-runtime.json fehlt. Zuerst science:prepare oder science:render ausführen.');
const runtime = readJson(runtimeFile);
const defaultVideo = path.join(paths.exportDir, 'video.mp4');
const legacyVideo = path.join(paths.exportDir, `${runtime.slug}.mp4`);
const video = path.resolve(videoArg ? videoArg.slice('--video='.length) : (fs.existsSync(defaultVideo) ? defaultVideo : legacyVideo));
if (!fs.existsSync(video)) throw new Error(`Gerendertes Video fehlt: ${video}`);

const info = ffprobe(video);
const videoStream = info.streams?.find((stream) => stream.codec_type === 'video');
const audioStream = info.streams?.find((stream) => stream.codec_type === 'audio');
const duration = Number(info.format?.duration ?? videoStream?.duration);
const errors = [];
const warnings = [];

if (Number(runtime.width) !== config.format.width || Number(runtime.height) !== config.format.height) errors.push(`Runtime ist nicht ${config.format.width}×${config.format.height}.`);
if (Number(videoStream?.width) !== Number(runtime.width)) errors.push(`Breite ${videoStream?.width}; erwartet ${runtime.width}.`);
if (Number(videoStream?.height) !== Number(runtime.height)) errors.push(`Höhe ${videoStream?.height}; erwartet ${runtime.height}.`);
if (!audioStream) errors.push('Das Video enthält keine Audiospur.');
if (!Number.isFinite(duration)) errors.push('Videodauer konnte nicht gelesen werden.');
else {
  if (Math.abs(duration - runtime.durationSeconds) > 0.20) errors.push(`Videodauer ${duration.toFixed(3)} s weicht von der Voice-Zeit ${runtime.durationSeconds.toFixed(3)} s ab.`);
  if (duration < config.format.durationSeconds.min || duration > config.format.durationSeconds.max) errors.push(`Videodauer ${duration.toFixed(1)} s liegt außerhalb ${config.format.durationSeconds.min}–${config.format.durationSeconds.max} s.`);
}

const fpsParts = String(videoStream?.avg_frame_rate ?? '').split('/').map(Number);
const actualFps = fpsParts.length === 2 && fpsParts[1] ? fpsParts[0] / fpsParts[1] : Number(videoStream?.avg_frame_rate);
if (!Number.isFinite(actualFps) || Math.abs(actualFps - runtime.fps) > 0.01) errors.push(`FPS ${actualFps}; erwartet ${runtime.fps}.`);

const ffmpegCapture = (extraArgs) => {
  const result = spawnSync('ffmpeg', extraArgs, {encoding: 'utf8'});
  if (result.error?.code === 'ENOENT') throw new Error('FFmpeg ist nicht im PATH verfügbar.');
  return `${result.stdout ?? ''}\n${result.stderr ?? ''}`;
};

const blackOutput = ffmpegCapture([
  '-hide_banner', '-i', video,
  '-vf', `blackdetect=d=${thresholds.blackMinimumDurationSeconds}:pix_th=0.02`,
  '-an', '-f', 'null', '-',
]);
const blackDurations = [...blackOutput.matchAll(/black_duration:([0-9.]+)/g)].map((match) => Number(match[1]));
if (blackDurations.some((value) => value >= thresholds.blackMinimumDurationSeconds)) errors.push(`Schwarze Videopassage ab ${thresholds.blackMinimumDurationSeconds}s erkannt.`);

let silenceMetrics = null;
let loudnessMetrics = null;
if (audioStream && Number.isFinite(duration)) {
  const silenceOutput = ffmpegCapture([
    '-hide_banner', '-i', video,
    '-af', `silencedetect=n=-45dB:d=${Math.min(thresholds.maximumInitialSilenceSeconds, thresholds.maximumEndSilenceSeconds)}`,
    '-vn', '-f', 'null', '-',
  ]);
  const silenceStarts = [...silenceOutput.matchAll(/silence_start:\s*([0-9.]+)/g)].map((match) => Number(match[1]));
  const silenceEnds = [...silenceOutput.matchAll(/silence_end:\s*([0-9.]+)\s*\|\s*silence_duration:\s*([0-9.]+)/g)]
    .map((match) => ({end: Number(match[1]), duration: Number(match[2])}));
  const initial = silenceStarts.length && silenceStarts[0] <= 0.05 && silenceEnds.length ? silenceEnds[0].duration : 0;
  const finalSilence = silenceEnds.filter((item) => Math.abs(item.end - duration) <= 0.25).at(-1)?.duration ?? 0;
  silenceMetrics = {initialSeconds: Number(initial.toFixed(3)), endSeconds: Number(finalSilence.toFixed(3))};
  if (initial > thresholds.maximumInitialSilenceSeconds) errors.push(`Anfangsstille ${initial.toFixed(2)}s; maximal ${thresholds.maximumInitialSilenceSeconds}s.`);
  if (finalSilence > thresholds.maximumEndSilenceSeconds) errors.push(`Endstille ${finalSilence.toFixed(2)}s; maximal ${thresholds.maximumEndSilenceSeconds}s.`);

  const loudnessOutput = ffmpegCapture([
    '-hide_banner', '-i', video,
    '-af', 'loudnorm=I=-16:TP=-1.5:LRA=11:print_format=json',
    '-vn', '-f', 'null', '-',
  ]);
  const jsonMatch = loudnessOutput.match(/\{\s*"input_i"[\s\S]*?\}/);
  if (jsonMatch) {
    try {
      const measured = JSON.parse(jsonMatch[0]);
      const integratedLufs = Number(measured.input_i);
      const truePeakDb = Number(measured.input_tp);
      const loudnessRange = Number(measured.input_lra);
      loudnessMetrics = {
        integratedLufs: Number.isFinite(integratedLufs) ? integratedLufs : null,
        truePeakDb: Number.isFinite(truePeakDb) ? truePeakDb : null,
        loudnessRange: Number.isFinite(loudnessRange) ? loudnessRange : null,
      };
      if (Number.isFinite(integratedLufs) && (integratedLufs < thresholds.integratedLufsMin || integratedLufs > thresholds.integratedLufsMax)) errors.push(`Lautheit ${integratedLufs.toFixed(1)} LUFS; erlaubt ${thresholds.integratedLufsMin} bis ${thresholds.integratedLufsMax} LUFS.`);
      if (Number.isFinite(truePeakDb) && truePeakDb > thresholds.truePeakMaximumDb) errors.push(`True Peak ${truePeakDb.toFixed(1)} dBTP; maximal ${thresholds.truePeakMaximumDb} dBTP.`);
    } catch (error) {
      warnings.push(`Loudness-Messung konnte nicht gelesen werden: ${error.message}`);
    }
  } else warnings.push('FFmpeg hat keine auswertbaren Loudness-Messwerte geliefert.');
}

const qaRoot = path.join(paths.renderDir, `${runtime.slug}-qa`);
const stillsDir = path.join(qaRoot, 'stills');
fs.rmSync(qaRoot, {recursive: true, force: true});
ensureDirectory(stillsDir);
const npx = process.platform === 'win32' ? 'npx.cmd' : 'npx';
const stillFiles = [];
for (let index = 0; index < runtime.scenes.length; index += 1) {
  const scene = runtime.scenes[index];
  const midpoint = Math.max(scene.fromFrame, Math.min(scene.toFrame - 1, Math.round((scene.fromFrame + scene.toFrame) / 2)));
  const file = path.join(stillsDir, `${String(index + 1).padStart(2, '0')}-${scene.id}.png`);
  run(npx, ['remotion', 'still', 'src/index.ts', runtime.compositionId, file, `--frame=${midpoint}`], {cwd: channelRoot});
  stillFiles.push(file);
}

if (stillFiles.length) {
  const columns = 2;
  const rows = Math.ceil(stillFiles.length / columns);
  const contactSheet = path.join(qaRoot, 'contact-sheet.png');
  const pattern = path.join(stillsDir, '*.png');
  try {
    run('ffmpeg', [
      '-y',
      '-pattern_type', 'glob',
      '-i', pattern,
      '-vf', `scale=480:270:force_original_aspect_ratio=decrease,pad=480:270:(ow-iw)/2:(oh-ih)/2,tile=${columns}x${rows}:padding=8:margin=8`,
      '-frames:v', '1',
      contactSheet,
    ]);
  } catch (error) {
    warnings.push(`Kontaktbogen konnte nicht erstellt werden: ${error.message}`);
  }
}

const report = {
  version: 'science-render-qa-v2',
  productionProfile: config.productionProfile,
  slug: runtime.slug,
  generatedAt: new Date().toISOString(),
  passed: errors.length === 0,
  video: path.relative(repositoryRoot, video).split(path.sep).join('/'),
  expected: {
    width: runtime.width,
    height: runtime.height,
    fps: runtime.fps,
    durationSeconds: runtime.durationSeconds,
    durationRangeSeconds: [config.format.durationSeconds.min, config.format.durationSeconds.max],
    sceneCount: runtime.scenes.length,
    integratedLufsRange: [thresholds.integratedLufsMin, thresholds.integratedLufsMax],
    truePeakMaximumDb: thresholds.truePeakMaximumDb,
    maximumInitialSilenceSeconds: thresholds.maximumInitialSilenceSeconds,
    maximumEndSilenceSeconds: thresholds.maximumEndSilenceSeconds,
  },
  actual: {
    width: Number(videoStream?.width ?? 0),
    height: Number(videoStream?.height ?? 0),
    fps: Number.isFinite(actualFps) ? Number(actualFps.toFixed(3)) : null,
    durationSeconds: Number.isFinite(duration) ? Number(duration.toFixed(3)) : null,
    hasAudio: Boolean(audioStream),
    blackPassages: blackDurations,
    silence: silenceMetrics,
    loudness: loudnessMetrics,
  },
  staticPolicy: {
    freezeDetectionEnabled: false,
    reason: 'Science Static verwendet absichtlich unbewegte Szenenbilder; Freeze Detection wäre hier ein Fehlalarm.',
  },
  stills: stillFiles.map((file) => path.relative(paths.root, file).split(path.sep).join('/')),
  errors,
  warnings,
  humanReviewRequired: [
    '16:9-Kontaktbogen und alle Szenen-Stills visuell prüfen.',
    'Finales MP4 vollständig mit Ton ansehen.',
    'Fachliche Bildaussage, Lesbarkeit, harte Schnitte, Untertitel und SFX-Lautstärke bestätigen.',
    'Sichtbaren Bildtext auf Deutsch, Rechtschreibung und fachliche Richtigkeit prüfen.',
    'Finales separates Thumbnail gegen Titel und Hook prüfen.',
  ],
};
writeJson(path.join(qaRoot, 'qa-report.json'), report);
writeJson(path.join(paths.projectFilesDir, 'qa-report.json'), report);

if (errors.length) {
  console.error('Science-Render-QA fehlgeschlagen:');
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log('✓ Technische 16:9-Science-Render-QA bestanden.');
console.log(`  Kontrollbilder: ${stillsDir}`);
console.log(`  Kontaktbogen: ${path.join(qaRoot, 'contact-sheet.png')}`);
console.log('  Letzter Schritt: Kontaktbogen, Einzelbilder, Thumbnail und vollständiges MP4 fachlich und visuell prüfen.');
