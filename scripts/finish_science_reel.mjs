#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {projectPaths, repositoryRoot, run} from './lib/electrical-project.mjs';
import {generateScienceLearningReport} from './lib/science-learning.mjs';
import {importScienceDrop} from './lib/science-simple-import.mjs';
import {flattenScienceExport,migrateLegacyLocalReels} from './lib/science-export-cleanup.mjs';

const args = process.argv.slice(2);
const projectArg = args.find((arg) => !arg.startsWith('--'));
if (!projectArg) {
  console.error('Nutzung: npm run science:finish -- <video-ordner>');
  process.exit(1);
}

migrateLegacyLocalReels(repositoryRoot);
const paths = projectPaths(projectArg);
// Altbestände in cover/ und video/ sicher in den flachen Export verschieben.
flattenScienceExport(paths.root);
// Nutzer legt alle Bild- und Sprachdateien in EINEN START-HIER-Ablageordner.
// Vor der technischen Readiness sicher und ohne Überschreiben in den Renderer importieren.
const scenePlan=JSON.parse(fs.readFileSync(paths.scenePlan,'utf8'));
const dropPath=path.join(repositoryRoot,'START-HIER',scenePlan.slug);
if(fs.existsSync(path.join(dropPath,'DATEIEN-HIER-REIN'))){
  const imported=importScienceDrop({repoRoot:repositoryRoot,projectDir:paths.root,packageDir:dropPath});
  console.log('✓ Einfacher Medienimport: '+imported.copied.length+' neue Dateien, '+imported.missing.length+' ausstehende Szenenbilder.');
}
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
// Technische QA ist erst der Anfang: redaktionelle und spätere datenbasierte Reviews bereitstellen.
const learning = generateScienceLearningReport(paths.root);
console.log('\n=== SCIENCE-YOUTUBE-PRODUKTION ABGESCHLOSSEN ===');
console.log(`Video-Ordner: ${paths.root}`);
console.log('Kontaktbogen, Szenen-Stills, finales Thumbnail und vollständiges MP4 fachlich und visuell prüfen.');
console.log(`PRIORITÄT 1: POST-VIDEO-REVIEW.md ausfüllen, nach Veröffentlichung Studio-Daten erfassen und science:learn -- report wiederholen. Lernbericht: ${learning.target}`);
