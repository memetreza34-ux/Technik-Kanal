#!/usr/bin/env node
import path from 'node:path';
import {repositoryRoot, run} from './lib/electrical-project.mjs';

const [projectArg] = process.argv.slice(2).filter((arg) => !arg.startsWith('--'));
if (!projectArg) {
  console.error('Nutzung: node scripts/check-electrical-production-readiness.mjs <reel-ordner>');
  process.exit(1);
}

const project = path.resolve(projectArg);
run(process.execPath, ['scripts/check-electrical-preproduction.mjs', project], {cwd: repositoryRoot});
run(process.execPath, ['scripts/check-electrical-required-media.mjs', project], {cwd: repositoryRoot});
run(process.execPath, ['scripts/check-electrical-readiness.mjs', project], {cwd: repositoryRoot});
console.log('✓ Preflight, Pflichtmedien und Readiness vollständig bestanden.');
