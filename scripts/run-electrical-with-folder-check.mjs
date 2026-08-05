#!/usr/bin/env node
import path from 'node:path';
import {runCommand} from './lib/run-command.mjs';

const [scriptArg, projectArg, ...rest] = process.argv.slice(2);
if (!scriptArg || !projectArg) {
  console.error('Nutzung: node scripts/run-electrical-with-folder-check.mjs <skript> <reel-ordner> [...args]');
  process.exit(1);
}

const root = process.cwd();
const project = path.resolve(projectArg);
runCommand(process.execPath, ['scripts/check-electrical-project-folder.mjs', project], {cwd: root});
runCommand(process.execPath, [scriptArg, project, ...rest], {cwd: root});
