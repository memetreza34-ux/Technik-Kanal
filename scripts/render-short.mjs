#!/usr/bin/env node
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawnSync, execFileSync} from 'node:child_process';
import {stageShort} from './short-stage.mjs';

const folder = process.argv[2];
if (!folder) throw new Error('Nutzung: npm run short:render -- shorts/YYYY-MM-DD_thema');
const dir = path.resolve(folder);
for (const f of ['short.json', 'audio/voiceover.wav', 'audio/captions.json'])
  if (!fs.existsSync(path.join(dir, f))) throw new Error('Fehlt: ' + path.join(folder, f));

const {slug, hasAudio} = stageShort(folder);
const exportDir = path.join(dir, 'export');
fs.mkdirSync(exportDir, {recursive: true});
const out = path.join(exportDir, 'short.mp4');
const props = path.join(os.tmpdir(), 'short-' + process.pid + '.json');
fs.writeFileSync(props, JSON.stringify({slug, spec: null, captions: null, hasAudio}));
try {
  const r = spawnSync('npx', ['remotion', 'render', 'src/index.ts', 'TechnikShort', out, '--props=' + props,
    '--gl=angle', '--codec=h264', '--audio-codec=aac', '--audio-bitrate=192k', '--pixel-format=yuv420p', '--crf=18'], {stdio: 'inherit'});
  if (r.status !== 0) throw new Error('Render fehlgeschlagen');
} finally {
  fs.rmSync(props, {force: true});
}

const info = JSON.parse(execFileSync('ffprobe', ['-v', 'error', '-show_streams', '-show_format', '-of', 'json', out], {encoding: 'utf8'}));
const v = info.streams.find((s) => s.codec_type === 'video');
const a = info.streams.find((s) => s.codec_type === 'audio');
const sec = Number(info.format.duration);
const errors = [];
if (v?.width !== 1080 || v?.height !== 1920) errors.push(`Format ${v?.width}x${v?.height} statt 1080x1920`);
if (!a) errors.push('Keine Audiospur');
if (!(sec > 5 && sec <= 180)) errors.push(`Laufzeit ${sec}s außerhalb 5–180 s`);
if (errors.length) throw new Error(errors.join('\n'));
console.log(`✓ ${path.relative(process.cwd(), out)} – 1080x1920, ${sec.toFixed(1)} s, mit Ton`);
console.log('Vor Veröffentlichung komplett mit Ton ansehen und Quellen prüfen.');
