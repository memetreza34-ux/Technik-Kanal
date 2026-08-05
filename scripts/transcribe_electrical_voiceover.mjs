#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {
  ensureDirectory,
  findVoiceFiles,
  mediaDurationSeconds,
  normalizeWord,
  parseTimestampMs,
  projectPaths,
  readJson,
  repositoryRoot,
  run,
  validateProjectStructure,
  writeJson,
} from './lib/electrical-project.mjs';

const [projectArg] = process.argv.slice(2).filter((arg) => !arg.startsWith('--'));
if (!projectArg) {
  console.error('Nutzung: npm run elektro:transcribe -- <reel-ordner>');
  process.exit(1);
}

const paths = projectPaths(projectArg);
validateProjectStructure(paths);
ensureDirectory(paths.workDir);

const voices = findVoiceFiles(paths.audioDir);
if (!voices.final) {
  throw new Error(`Finales Voice-over fehlt in ${paths.audioDir}. Erwartet wird eine Datei mit "final" im Namen.`);
}

const toolsRoot = path.join(repositoryRoot, '.tools/whisper.cpp');
const binaryCandidates = [
  process.env.WHISPER_CPP_BIN,
  path.join(toolsRoot, 'build/bin/whisper-cli'),
  path.join(toolsRoot, 'build/bin/Release/whisper-cli'),
  path.join(toolsRoot, 'build/bin/Release/whisper-cli.exe'),
].filter(Boolean);
const whisperBinary = binaryCandidates.find((candidate) => fs.existsSync(candidate));
const modelName = process.env.WHISPER_CPP_MODEL_NAME || 'small';
const modelPath = process.env.WHISPER_CPP_MODEL || path.join(toolsRoot, `models/ggml-${modelName}.bin`);

if (!whisperBinary || !fs.existsSync(modelPath)) {
  throw new Error('Lokale Whisper-Installation fehlt. Zuerst ausführen: npm run elektro:setup-local');
}

const inputWav = path.join(paths.workDir, 'voiceover-transcription-input.wav');
const outputBase = path.join(paths.workDir, 'whisper-word-timestamps');
const outputJson = `${outputBase}.json`;

run('ffmpeg', [
  '-y', '-i', voices.final,
  '-ar', '16000',
  '-ac', '1',
  '-c:a', 'pcm_s16le',
  inputWav,
]);

run(whisperBinary, [
  '-m', modelPath,
  '-f', inputWav,
  '-l', 'de',
  '-ml', '1',
  '-ojf',
  '-of', outputBase,
  '-np',
]);

if (!fs.existsSync(outputJson)) throw new Error(`Whisper-Ausgabe fehlt: ${outputJson}`);
const raw = readJson(outputJson);
const entries = Array.isArray(raw.transcription) ? raw.transcription : [];
if (!entries.length) throw new Error('Whisper hat keine Transkriptionssegmente geliefert.');

const timestampFrom = (entry, edge) => {
  const offset = entry?.offsets?.[edge];
  if (Number.isFinite(offset)) return Number(offset);
  const parsed = parseTimestampMs(entry?.timestamps?.[edge]);
  if (Number.isFinite(parsed)) return parsed;
  return undefined;
};

const confidenceFrom = (entry) => {
  const tokens = Array.isArray(entry.tokens) ? entry.tokens : [];
  const probabilities = tokens
    .map((token) => Number(token?.p ?? token?.probability ?? token?.prob))
    .filter((value) => Number.isFinite(value) && value >= 0 && value <= 1);
  if (!probabilities.length) return undefined;
  return probabilities.reduce((sum, value) => sum + value, 0) / probabilities.length;
};

const words = [];
for (const entry of entries) {
  const text = String(entry?.text ?? '').trim();
  if (!text || /^\[[^\]]+\]$/.test(text)) continue;
  const pieces = text.split(/\s+/).filter((piece) => normalizeWord(piece));
  if (!pieces.length) continue;
  const startMs = timestampFrom(entry, 'from');
  const endMs = timestampFrom(entry, 'to');
  if (!Number.isFinite(startMs) || !Number.isFinite(endMs) || endMs <= startMs) continue;
  const span = endMs - startMs;
  const confidence = confidenceFrom(entry);
  pieces.forEach((piece, index) => {
    const start = startMs + (span * index) / pieces.length;
    const end = startMs + (span * (index + 1)) / pieces.length;
    words.push({
      text: piece,
      normalized: normalizeWord(piece),
      startMs: Math.round(start),
      endMs: Math.round(end),
      ...(confidence === undefined ? {} : {confidence: Number(confidence.toFixed(4))}),
    });
  });
}

if (words.length < 5) throw new Error(`Zu wenige Wörter mit Zeitstempeln erkannt: ${words.length}`);

const durationSeconds = mediaDurationSeconds(voices.final);
const lowConfidenceWords = words.filter((word) => word.confidence !== undefined && word.confidence < 0.25);
const result = {
  version: 1,
  provider: 'local-whisper.cpp',
  model: modelName,
  language: raw.result?.language ?? raw.language ?? 'de',
  sourceAudio: path.relative(paths.root, voices.final).split(path.sep).join('/'),
  durationSeconds: Number(durationSeconds.toFixed(3)),
  generatedAt: new Date().toISOString(),
  text: words.map((word) => word.text).join(' ').replace(/\s+([,.;:!?])/g, '$1'),
  words,
  quality: {
    wordCount: words.length,
    lowConfidenceWordCount: lowConfidenceWords.length,
    lowConfidenceRatio: Number((lowConfidenceWords.length / words.length).toFixed(4)),
  },
};

writeJson(paths.wordTimestamps, result);
fs.writeFileSync(path.join(paths.captionsDir, 'transcript-final.txt'), `${result.text}\n`);
console.log(`✓ Lokales Worttranskript erstellt: ${paths.wordTimestamps}`);
console.log(`  Wörter: ${words.length}`);
console.log(`  Dauer: ${durationSeconds.toFixed(3)} s`);
