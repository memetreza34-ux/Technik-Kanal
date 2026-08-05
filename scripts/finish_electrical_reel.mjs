#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {projectPaths, repositoryRoot, run} from './lib/electrical-project.mjs';

const args = process.argv.slice(2);
const projectArg = args.find((arg) => !arg.startsWith('--'));
if (!projectArg) {
  console.error('Nutzung: npm run elektro:finish -- <reel-ordner>');
  process.exit(1);
}
const paths = projectPaths(projectArg);
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

run(process.execPath, ['scripts/render_electrical_reel.mjs', paths.root, '--force-transcribe'], {cwd: repositoryRoot});

console.log('\n=== PRODUKTION ABGESCHLOSSEN ===');
console.log(`Reel-Ordner: ${paths.root}`);
console.log('Codex muss jetzt den erzeugten Kontaktbogen, alle Szenen-Stills und das vollständige MP4 visuell prüfen.');
console.log('Bei einem sichtbaren Fehler: Ursache im Remotion-Code oder Asset-Mapping beheben und denselben Befehl erneut ausführen.');
