#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {findVoiceFiles, projectPaths, repositoryRoot, run} from './lib/electrical-project.mjs';

const args = process.argv.slice(2);
const projectArg = args.find((arg) => !arg.startsWith('--'));
if (!projectArg) {
  console.error('Nutzung: npm run science:prepare -- <reel-ordner> [--force-transcribe]');
  process.exit(1);
}

const paths = projectPaths(projectArg);
const voices = findVoiceFiles(paths.audioDir);
let finalVoice = voices.final;
const rawIsNewer = Boolean(
  voices.raw && finalVoice && fs.statSync(voices.raw).mtimeMs > fs.statSync(finalVoice).mtimeMs,
);

if (!finalVoice || rawIsNewer) {
  if (!voices.raw) {
    throw new Error(`Keine Roh-Voice gefunden. Lege voiceover-raw.wav in ${paths.audioDir}.`);
  }
  const rawStem = path.basename(voices.raw, path.extname(voices.raw));
  const finalStem = /raw|roh|original/i.test(rawStem)
    ? rawStem.replace(/raw|roh|original/i, 'final')
    : 'voiceover-final';
  finalVoice = path.join(paths.audioDir, `${finalStem}.wav`);
  run(process.execPath, ['scripts/process_voiceover.mjs', voices.raw, finalVoice], {cwd: repositoryRoot});
}

const forward = ['scripts/prepare_electrical_reel.mjs', paths.root];
if (args.includes('--force-transcribe')) forward.push('--force-transcribe');
run(process.execPath, forward, {cwd: repositoryRoot});
