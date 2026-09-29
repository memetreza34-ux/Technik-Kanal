#!/usr/bin/env node
import {runCommand} from './lib/run-command.mjs';

const forbidden = new Set(['main', 'master']);
const branch = runCommand('git', ['branch', '--show-current'], {capture: true});
if (forbidden.has(branch)) {
  throw new Error('Neue Science-Reel-Struktur nicht direkt auf main/master erzeugen. Zuerst einen Arbeitsbranch verwenden.');
}

runCommand(process.execPath, ['scripts/new-science-reel.mjs', ...process.argv.slice(2)]);
