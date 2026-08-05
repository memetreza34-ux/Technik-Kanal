#!/usr/bin/env node
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

const args = process.argv.slice(2);
const projectArg = args.find((arg) => !arg.startsWith('--'));
const videoArg = args.find((arg) => arg.startsWith('--video='));
if (!projectArg) {
  console.error('Nutzung: npm run elektro:qa -- <reel-ordner> [--video=video.mp4]');
  process.exit(1);
}

const paths = projectPaths(projectArg);
const runtimeFile = path.join(paths.projectFilesDir, 'reel-runtime.json');
if (!fs.existsSync(runtimeFile)) throw new Error('reel-runtime.json fehlt. Zuerst elektro:prepare oder elektro:render ausführen.');
const runtime = readJson(runtimeFile);
const video = path.resolve(videoArg ? videoArg.slice('--video='.length) : path.join(paths.exportDir, `${runtime.slug}.mp4`));
if (!fs.existsSync(video)) throw new Error(`Gerendertes Video fehlt: ${video}`);

const info = ffprobe(video);
const videoStream = info.streams?.find((stream) => stream.codec_type === 'video');
const audioStream = info.streams?.find((stream) => stream.codec_type === 'audio');
const duration = Number(info.format?.duration ?? videoStream?.duration);
const errors = [];
const warnings = [];

if (Number(videoStream?.width) !== Number(runtime.width)) errors.push(`Breite ${videoStream?.width}; erwartet ${runtime.width}.`);
if (Number(videoStream?.height) !== Number(runtime.height)) errors.push(`Höhe ${videoStream?.height}; erwartet ${runtime.height}.`);
if (!audioStream) errors.push('Das Video enthält keine Audiospur.');
if (!Number.isFinite(duration)) errors.push('Videodauer konnte nicht gelesen werden.');
else if (Math.abs(duration - runtime.durationSeconds) > 0.20) {
  errors.push(`Videodauer ${duration.toFixed(3)} s weicht von der Voice-Zeit ${runtime.durationSeconds.toFixed(3)} s ab.`);
}

const fpsParts = String(videoStream?.avg_frame_rate ?? '').split('/').map(Number);
const actualFps = fpsParts.length === 2 && fpsParts[1] ? fpsParts[0] / fpsParts[1] : Number(videoStream?.avg_frame_rate);
if (!Number.isFinite(actualFps) || Math.abs(actualFps - runtime.fps) > 0.01) errors.push(`FPS ${actualFps}; erwartet ${runtime.fps}.`);

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
  const rows = Math.ceil(stillFiles.length / 2);
  const contactSheet = path.join(qaRoot, 'contact-sheet.png');
  const pattern = path.join(stillsDir, '*.png');
  try {
    run('ffmpeg', [
      '-y',
      '-pattern_type', 'glob',
      '-i', pattern,
      '-vf', `scale=270:480:force_original_aspect_ratio=decrease,pad=270:480:(ow-iw)/2:(oh-ih)/2,tile=2x${rows}:padding=8:margin=8`,
      '-frames:v', '1',
      contactSheet,
    ]);
  } catch (error) {
    warnings.push(`Kontaktbogen konnte nicht erstellt werden: ${error.message}`);
  }
}

const report = {
  version: 1,
  slug: runtime.slug,
  generatedAt: new Date().toISOString(),
  passed: errors.length === 0,
  video: path.relative(repositoryRoot, video).split(path.sep).join('/'),
  expected: {
    width: runtime.width,
    height: runtime.height,
    fps: runtime.fps,
    durationSeconds: runtime.durationSeconds,
    sceneCount: runtime.scenes.length,
  },
  actual: {
    width: Number(videoStream?.width ?? 0),
    height: Number(videoStream?.height ?? 0),
    fps: Number.isFinite(actualFps) ? Number(actualFps.toFixed(3)) : null,
    durationSeconds: Number.isFinite(duration) ? Number(duration.toFixed(3)) : null,
    hasAudio: Boolean(audioStream),
  },
  stills: stillFiles.map((file) => path.relative(paths.root, file).split(path.sep).join('/')),
  errors,
  warnings,
  humanReviewRequired: [
    'Kontaktbogen und alle Szenen-Stills visuell prüfen.',
    'Finales MP4 vollständig mit Ton ansehen.',
    'Lesbarkeit, Bildaussage, Übergänge, SFX-Lautstärke und fachliche Richtigkeit bestätigen.',
  ],
};
writeJson(path.join(qaRoot, 'qa-report.json'), report);
writeJson(path.join(paths.projectFilesDir, 'qa-report.json'), report);

if (errors.length) {
  console.error('Render-QA fehlgeschlagen:');
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log('✓ Technische Render-QA bestanden.');
console.log(`  Kontrollbilder: ${stillsDir}`);
console.log(`  Kontaktbogen: ${path.join(qaRoot, 'contact-sheet.png')}`);
console.log('  Letzter Schritt: Codex prüft Kontaktbogen, Einzelbilder und das vollständige MP4 visuell und korrigiert bei Bedarf.');
