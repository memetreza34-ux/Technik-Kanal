#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {channelRoot, findVoiceFiles, projectPaths, readJson, repositoryRoot, run} from './lib/electrical-project.mjs';
import {loadElectricalConfig} from './lib/load-electrical-config.mjs';
import {assignCameraMoves} from './lib/science-camera-motion.mjs';
import {assertMusicSource, buildMusicBed, findMusic, measureLoudness} from './lib/science-music-bed.mjs';

const args = process.argv.slice(2);
const projectArg = args.find((arg) => !arg.startsWith('--'));
if (!projectArg) {
  console.error('Nutzung: npm run science:prepare -- <reel-ordner> [--force-transcribe]');
  process.exit(1);
}

const paths = projectPaths(projectArg);

// PHASE-3-HARD-GUARD:
// Antigravity/Codex/der Montage-Agent darf keine visuellen Assets erzeugen oder ersetzen.
// Vor jeder Vorbereitung werden daher IMMER die vom Nutzer in Phase 2 abgelegten Dateien geprüft.
// Diese Prüfung darf auch mit --readiness-passed nicht übersprungen werden.
run(process.execPath, ['scripts/science-required-media.mjs', paths.root], {cwd: repositoryRoot});
run(process.execPath, ['scripts/science-asset-review.mjs', 'check', paths.root], {cwd: repositoryRoot});

if (!args.includes('--readiness-passed')) run(process.execPath, ['scripts/science-readiness.mjs', paths.root], {cwd: repositoryRoot});

const config = loadElectricalConfig(readJson(paths.scenePlan).productionProfile);
const musicSettings = config.sound?.musicBed ?? {};
const music = config.sound?.musicBedAllowed ? findMusic(paths.root) : null;
if (music) assertMusicSource(music, musicSettings);

const voices = findVoiceFiles(paths.audioDir);
let finalVoice = voices.final;
const rawIsNewer = Boolean(voices.raw && finalVoice && fs.statSync(voices.raw).mtimeMs > fs.statSync(finalVoice).mtimeMs);
if (!finalVoice || rawIsNewer) {
  if (!voices.raw) throw new Error(`Keine Roh-Voice gefunden. Lege voiceover-raw.wav in ${paths.audioDir}.`);
  const rawStem = path.basename(voices.raw, path.extname(voices.raw));
  const finalStem = /raw|roh|original/i.test(rawStem) ? rawStem.replace(/raw|roh|original/i, 'final') : 'voiceover-final';
  finalVoice = path.join(paths.audioDir, `${finalStem}.wav`);
  run(process.execPath, ['scripts/process_voiceover.mjs', voices.raw, finalVoice], {cwd: repositoryRoot});
}

// Der bewährte Alignment-Kern schreibt temporär reel-runtime.json; nach dem Lauf bleibt nur science-runtime.json bestehen.
// Er arbeitet ausschließlich mit den zuvor geprüften Phase-2-Dateien und erzeugt keine Szenenbilder.
const temporaryRuntimePath = path.join(channelRoot, 'src/generated/reel-runtime.json');
const scienceRuntimePath = path.join(channelRoot, 'src/generated/science-runtime.json');
const previousTemporaryRuntime = fs.existsSync(temporaryRuntimePath) ? fs.readFileSync(temporaryRuntimePath) : null;

try {
  const forward = ['scripts/prepare_electrical_reel.mjs', paths.root];
  if (args.includes('--force-transcribe')) forward.push('--force-transcribe');
  run(process.execPath, forward, {cwd: repositoryRoot});

  const projectRuntime = path.join(paths.projectFilesDir, 'reel-runtime.json');
  if (!fs.existsSync(projectRuntime)) throw new Error(`Science-Runtime wurde nicht erzeugt: ${projectRuntime}`);
  const runtime = readJson(projectRuntime);
  // Dezente virtuelle Kamera pro Standbild (Zoom/Schwenk im Wechsel; cameraMove: "none" schaltet sie pro Szene ab).
  const cameraMotion = config.visuals?.cameraMotionAllowed ? config.visuals.cameraMotion : {enabled: false};
  runtime.scenes = assignCameraMoves(runtime.scenes, cameraMotion);
  // Leiser Musikteppich unter der Stimme (optional, nur mit Quellenangabe).
  delete runtime.musicPath;
  if (music) {
    const relative = `reels/${runtime.slug}/audio/music-bed.wav`;
    const bed = buildMusicBed({input: music.file, output: path.join(channelRoot, 'public', relative), durationSeconds: runtime.durationSeconds, settings: musicSettings});
    runtime.musicPath = relative;
    runtime.music = {source: music.source, file: path.basename(music.file), targetLufs: musicSettings.targetLufs ?? null, measuredLufs: measureLoudness(bed)};
    console.log(`✓ Musikteppich: ${path.basename(music.file)} → ${runtime.music.measuredLufs ?? '?'} LUFS (Stimme ≈ ${config.voice?.loudness?.integratedLufs ?? -16} LUFS).`);
  } else if (config.sound?.musicBedAllowed) {
    console.warn(`⚠ Kein Musikteppich: Musikdatei plus QUELLE.txt in 01-script-audio/musik/ legen (empfohlen: YouTube Audio Library).`);
  }
  fs.writeFileSync(projectRuntime, `${JSON.stringify(runtime, null, 2)}\n`);
  fs.mkdirSync(path.dirname(scienceRuntimePath), {recursive: true});
  fs.copyFileSync(projectRuntime, scienceRuntimePath);
  console.log(`✓ Science-Runtime aktualisiert: ${scienceRuntimePath} (${runtime.scenes.filter((scene) => scene.cameraMove?.type !== 'none').length} Szenen mit dezenter Kamerabewegung)`);
} finally {
  if (previousTemporaryRuntime) fs.writeFileSync(temporaryRuntimePath, previousTemporaryRuntime);
  else fs.rmSync(temporaryRuntimePath, {force: true});
}
