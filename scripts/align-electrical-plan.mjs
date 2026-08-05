#!/usr/bin/env node
import path from 'node:path';
import {runCommand} from './lib/run-command.mjs';

const [projectArg] = process.argv.slice(2).filter((arg) => !arg.startsWith('--'));
if (!projectArg) {
  console.error('Nutzung: npm run electrical:align -- <reel-ordner>');
  process.exit(1);
}

const root = process.cwd();
const project = path.resolve(projectArg);
runCommand(process.execPath, ['scripts/check-electrical-project-folder.mjs', project], {cwd: root});
runCommand(process.execPath, ['scripts/prepare_electrical_reel.mjs', project, '--force-transcribe'], {cwd: root});
console.log('✓ Szenenplan semantisch am lokalen Worttranskript ausgerichtet.');
