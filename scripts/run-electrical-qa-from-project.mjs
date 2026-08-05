#!/usr/bin/env node
import path from 'node:path';
import {runCommand} from './lib/run-command.mjs';

const [projectArg] = process.argv.slice(2).filter((arg) => !arg.startsWith('--'));
if (!projectArg) {
  console.error('Nutzung: node scripts/run-electrical-qa-from-project.mjs <reel-ordner>');
  process.exit(1);
}

const root = process.cwd();
const project = path.resolve(projectArg);
for (const script of [
  'scripts/check-electrical-project-folder.mjs',
  'scripts/run-electrical-script-qa.mjs',
  'scripts/run-electrical-creative-qa.mjs',
  'scripts/check-electrical-content-package.mjs',
  'scripts/check-electrical-social-caption.mjs',
]) {
  runCommand(process.execPath, [script, project], {cwd: root});
}
console.log('✓ Vollständige Inhalts- und Kreativ-QA bestanden.');
