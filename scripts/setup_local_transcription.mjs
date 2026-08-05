#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {ensureDirectory, repositoryRoot, requireCommands, run} from './lib/electrical-project.mjs';

const toolsRoot = path.join(repositoryRoot, '.tools');
const whisperRoot = path.join(toolsRoot, 'whisper.cpp');
const binaryCandidates = [
  process.env.WHISPER_CPP_BIN,
  path.join(whisperRoot, 'build/bin/whisper-cli'),
  path.join(whisperRoot, 'build/bin/Release/whisper-cli'),
  path.join(whisperRoot, 'build/bin/Release/whisper-cli.exe'),
].filter(Boolean);
const modelName = process.env.WHISPER_CPP_MODEL_NAME || 'small';
const modelPath = process.env.WHISPER_CPP_MODEL || path.join(whisperRoot, `models/ggml-${modelName}.bin`);

const findBinary = () => binaryCandidates.find((candidate) => fs.existsSync(candidate));

requireCommands(['git', 'cmake', 'ffmpeg', 'ffprobe']);
ensureDirectory(toolsRoot);

if (!fs.existsSync(whisperRoot)) {
  console.log('Lokale Transkription wird einmalig eingerichtet (Audio bleibt auf diesem Gerät).');
  run('git', ['clone', '--depth', '1', 'https://github.com/ggml-org/whisper.cpp.git', whisperRoot]);
}

if (!findBinary()) {
  run('cmake', ['-B', 'build', '-DCMAKE_BUILD_TYPE=Release'], {cwd: whisperRoot});
  run('cmake', ['--build', 'build', '-j', '--config', 'Release'], {cwd: whisperRoot});
}

if (!fs.existsSync(modelPath)) {
  const downloader = path.join(whisperRoot, 'models/download-ggml-model.sh');
  if (!fs.existsSync(downloader)) throw new Error(`Whisper-Modell-Downloader fehlt: ${downloader}`);
  run('bash', [downloader, modelName], {cwd: whisperRoot});
}

const binary = findBinary();
if (!binary) throw new Error('whisper-cli wurde gebaut, aber nicht gefunden.');
if (!fs.existsSync(modelPath)) throw new Error(`Whisper-Modell wurde nicht gefunden: ${modelPath}`);

console.log('✓ Lokale Worttranskription ist bereit.');
console.log(`  Binary: ${binary}`);
console.log(`  Modell: ${modelPath}`);
console.log('  Kein API-Key und kein Audio-Upload erforderlich.');
