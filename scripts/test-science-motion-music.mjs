#!/usr/bin/env node
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {assignCameraMoves, cameraMoveFor, cameraMoveIsSafe, CAMERA_MOVE_TYPES} from './lib/science-camera-motion.mjs';
import {assertMusicSource, buildMusicBed, findMusic, measureLoudness, MUSIC_FOLDER} from './lib/science-music-bed.mjs';
import {importScienceDrop} from './lib/science-simple-import.mjs';
import {loadElectricalConfig} from './lib/load-electrical-config.mjs';

const config = loadElectricalConfig();

// ---------- 1. Dezente Kamera ----------
const scenes = Array.from({length: 6}, (_, index) => ({id: `s${index + 1}`}));
const moved = assignCameraMoves(scenes, config.visuals.cameraMotion);
assert.deepEqual(moved.map((scene) => scene.cameraMove.type), ['zoom-in', 'pan-right', 'zoom-out', 'pan-left', 'zoom-in', 'pan-right'], 'Bewegungen wechseln sich ab');
assert.ok(moved.every((scene) => cameraMoveIsSafe(scene.cameraMove)), 'nie ein leerer Bildrand');
assert.ok(moved.every((scene) => Math.max(scene.cameraMove.fromScale, scene.cameraMove.toScale) <= 1.04 + 1e-9), 'Zoom höchstens 4 %');
assert.equal(assignCameraMoves([{id: 'a', cameraMove: 'none'}], config.visuals.cameraMotion)[0].cameraMove.type, 'none', 'pro Szene abschaltbar');
assert.ok(assignCameraMoves(scenes, {enabled: false}).every((scene) => scene.cameraMove.type === 'none'), 'global abschaltbar');
for (const type of [...CAMERA_MOVE_TYPES, 'none']) assert.ok(cameraMoveIsSafe(cameraMoveFor(type, {maxScale: 1.3, panPercent: 20})), `${type} bleibt auch bei falscher Konfiguration sicher`);
assert.throws(() => cameraMoveFor('spin'), /Unbekannte Kamerabewegung/);

// Renderer und Vorbereitung nutzen die Bewegung und den Musikteppich wirklich.
const reel = fs.readFileSync('channels/science/src/ScienceReel.tsx', 'utf8');
assert.ok(reel.includes('cameraMove') && reel.includes('transform') && reel.includes('musicPath'));
const prepare = fs.readFileSync('scripts/prepare_science_reel.mjs', 'utf8');
assert.ok(prepare.includes('assignCameraMoves') && prepare.includes('buildMusicBed') && prepare.includes('assertMusicSource'));

// ---------- 2. Musik nur mit Quellenangabe ----------
const root = fs.mkdtempSync(path.join(os.tmpdir(), 'science-musik-'));
try {
  const project = path.join(root, 'video');
  const musicDir = path.join(project, MUSIC_FOLDER);
  fs.mkdirSync(musicDir, {recursive: true});
  assert.equal(findMusic(project), null, 'ohne Musik kein Musikteppich');
  const hasFfmpeg = spawnSync('ffmpeg', ['-version']).status === 0;
  const track = path.join(musicDir, 'musik.wav');
  if (hasFfmpeg) spawnSync('ffmpeg', ['-v', 'error', '-y', '-f', 'lavfi', '-i', 'sine=frequency=220:duration=3', track]);
  else fs.writeFileSync(track, 'kein-echtes-audio');
  assert.throws(() => assertMusicSource(findMusic(project), config.sound.musicBed), /Musikquelle fehlt/);
  fs.writeFileSync(path.join(musicDir, 'QUELLE.txt'), 'YouTube Audio Library – Testtitel – Testkünstler – keine Namensnennung erforderlich');
  assertMusicSource(findMusic(project), config.sound.musicBed);
  fs.writeFileSync(path.join(musicDir, 'zweite.mp3'), 'x');
  assert.throws(() => findMusic(project), /Mehr als eine Musikdatei/);
  fs.unlinkSync(path.join(musicDir, 'zweite.mp3'));

  if (hasFfmpeg) {
    const bed = buildMusicBed({input: track, output: path.join(root, 'bed.wav'), durationSeconds: 7, settings: config.sound.musicBed});
    const duration = Number(spawnSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', bed], {encoding: 'utf8'}).stdout);
    assert.ok(Math.abs(duration - 7) < 0.1, `Musikteppich auf Videolänge geschleift (${duration} s)`);
    const lufs = measureLoudness(bed);
    assert.ok(lufs <= -27 && lufs >= -35, `Musikteppich leise unter der Stimme (${lufs} LUFS)`);
  }

  // ---------- 3. Import aus DATEIEN-HIER-REIN ----------
  const repoRoot = path.join(root, 'repo');
  const videoDir = path.join(repoRoot, 'channels/science/YouTube/2026-10-19_bis_2026-10-25/01_Test');
  const drop = path.join(repoRoot, 'START-HIER/test-video/DATEIEN-HIER-REIN');
  fs.mkdirSync(path.join(videoDir, '06-projektdateien'), {recursive: true});
  fs.mkdirSync(drop, {recursive: true});
  fs.writeFileSync(path.join(videoDir, '06-projektdateien/scene-plan.json'), JSON.stringify({slug: 'test-video', scenes: [{id: '01-hook', voiceText: 'Test.', imageDir: '02-bilder/images/01-hook'}]}));
  fs.writeFileSync(path.join(drop, 'voiceover-raw.wav'), 'stimme');
  fs.writeFileSync(path.join(drop, 'musik.mp3'), 'musik');
  assert.throws(() => importScienceDrop({repoRoot, packageDir: path.dirname(drop), projectDir: videoDir}), /Musik ohne musik-quelle\.txt/);
  fs.writeFileSync(path.join(drop, 'musik-quelle.txt'), 'YouTube Audio Library – Titel – Künstler');
  const imported = importScienceDrop({repoRoot, packageDir: path.dirname(drop), projectDir: videoDir});
  assert.ok(imported.hasMusic && imported.hasVoice);
  assert.equal(fs.readFileSync(path.join(videoDir, '01-script-audio/musik/musik.mp3'), 'utf8'), 'musik');
  assert.ok(fs.existsSync(path.join(videoDir, '01-script-audio/musik/QUELLE.txt')));
  assert.equal(fs.readFileSync(path.join(videoDir, '01-script-audio/audio/voiceover-raw.wav'), 'utf8'), 'stimme', 'Musik wird nicht als Stimme übernommen');
} finally {
  fs.rmSync(root, {recursive: true, force: true});
}

console.log('✓ Bewegung & Musik: dezente Kamera im Wechsel ohne leeren Rand, Abschaltung pro Szene, Musik nur mit Quelle, Schleife auf Videolänge, leise Lautheit und Import aus DATEIEN-HIER-REIN geprüft.');
