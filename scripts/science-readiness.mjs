#!/usr/bin/env node
import path from 'node:path';
import {repositoryRoot, run} from './lib/electrical-project.mjs';

const [projectArg] = process.argv.slice(2).filter((arg) => !arg.startsWith('--'));
if (!projectArg) {
  console.error('Nutzung: npm run science:ready -- <video-ordner>');
  process.exit(1);
}
const project = path.resolve(projectArg);

run(process.execPath, ['scripts/science-preflight.mjs', project], {cwd: repositoryRoot});
run(process.execPath, ['scripts/science-required-media.mjs', project], {cwd: repositoryRoot});
run(process.execPath, ['scripts/science-image-qa.mjs', project], {cwd: repositoryRoot});
run(process.execPath, ['scripts/science-runtime-readiness.mjs', project], {cwd: repositoryRoot});
console.log('✓ Science-Readiness bestanden: Preflight, Voice, alle finalen 16:9-Szenenbilder, separates Thumbnail und Bild-QA sind bereit.');
