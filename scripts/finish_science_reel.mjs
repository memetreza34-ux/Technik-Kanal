#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {projectPaths, repositoryRoot, run} from './lib/electrical-project.mjs';

const args = process.argv.slice(2);
const projectArg = args.find((arg) => !arg.startsWith('--'));
if (!projectArg) {
  console.error('Nutzung: npm run science:finish -- <reel-ordner>');
  process.exit(1);
}

const paths = projectPaths(projectArg);
run(process.execPath, ['scripts/science-readiness.mjs', paths.root], {cwd: repositoryRoot});

const whisperCandidates = [
  process.env.WHISPER_CPP_BIN,
  path.join(repositoryRoot, '.tools/whisper.cpp/build/bin/whisper-cli'),
  path.join(repositoryRoot, '.tools/whisper.cpp/build/bin/Release/whisper-cli'),
  path.join(repositoryRoot, '.tools/whisper.cpp/build/bin/Release/whisper-cli.exe'),
].filter(Boolean);
const modelName = process.env.WHISPER_CPP_MODEL_NAME || 'small';
const modelPath = process.env.WHISPER_CPP_MODEL || path.join(repositoryRoot, `.tools/whisper.cpp/models/ggml-${modelName}.bin`);

if (!whisperCandidates.some((candidate) => fs.existsSync(candidate)) || !fs.existsSync(modelPath)) {
  run(process.execPath, ['scripts/setup_local_transcription.mjs'], {cwd: repositoryRoot});
}

run(process.execPath, ['scripts/render_science_reel.mjs', paths.root, '--force-transcribe', '--preflight-passed'], {cwd: repositoryRoot});
console.log('\n=== SCIENCE-PRODUKTION ABGESCHLOSSEN ===');
console.log(`Reel-Ordner: ${paths.root}`);
console.log('Kontaktbogen, Szenen-Stills und vollständiges MP4 fachlich und visuell prüfen.');
