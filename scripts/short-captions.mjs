#!/usr/bin/env node
// Erzeugt wortgenaue Untertitel für einen Short: Whisper.cpp liefert die Zeiten,
// der Text kommt 1:1 aus script-fliesstext.txt.
import {execFileSync} from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {downloadWhisperModel, installWhisperCpp, transcribe} from '@remotion/install-whisper-cpp';
import {alignScriptToTimestamps, scriptWords} from './lib/align-words.mjs';

const folder = process.argv[2];
if (!folder) throw new Error('Nutzung: npm run short:captions -- shorts/YYYY-MM-DD_thema');
const dir = path.resolve(folder);
const audio = path.join(dir, 'audio', 'voiceover.wav');
if (!fs.existsSync(audio)) throw new Error('Voice-over fehlt: ' + audio + ' (zuerst npm run voice:youtube -- --dir ' + folder + ')');

const WHISPER_DIR = path.join(os.homedir(), '.cache', 'remotion-whisper');
const VERSION = '1.5.5';
const MODEL = process.env.WHISPER_MODEL || 'medium';

await installWhisperCpp({to: WHISPER_DIR, version: VERSION, printOutput: false});
await downloadWhisperModel({model: MODEL, folder: WHISPER_DIR, printOutput: false});

const tmpWav = path.join(os.tmpdir(), 'short-' + process.pid + '.wav');
execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', audio, '-ar', '16000', '-ac', '1', tmpWav]);
let out;
try {
  out = await transcribe({
    model: MODEL, whisperPath: WHISPER_DIR, whisperCppVersion: VERSION,
    inputPath: tmpWav, tokenLevelTimestamps: true, language: 'de', printOutput: false,
  });
} finally {
  fs.rmSync(tmpWav, {force: true});
}

// Whisper-Tokens zu Wörtern zusammensetzen (neues Wort beginnt mit Leerzeichen).
const timed = [];
for (const seg of out.transcription) {
  for (const tok of seg.tokens) {
    if (/^\[_|^\[/.test(tok.text)) continue;
    const startsWord = tok.text.startsWith(' ') || timed.length === 0;
    if (startsWord) timed.push({text: tok.text.trim(), startMs: tok.offsets.from, endMs: tok.offsets.to});
    else { const last = timed[timed.length - 1]; last.text += tok.text; last.endMs = tok.offsets.to; }
  }
}

const script = fs.readFileSync(path.join(dir, 'script-fliesstext.txt'), 'utf8');
const {words, matchRatio} = alignScriptToTimestamps(scriptWords(script), timed.filter((t) => t.text));
const target = path.join(dir, 'audio', 'captions.json');
fs.writeFileSync(target, JSON.stringify(words, null, 1) + '\n');
console.log(`✓ ${words.length} Wörter, ${(matchRatio * 100).toFixed(0)} % direkt erkannt → ${path.relative(process.cwd(), target)}`);
if (matchRatio < 0.8) console.warn('⚠ Weniger als 80 % erkannt – Timing im Studio prüfen.');
