#!/usr/bin/env node
import {runCommand} from './lib/run-command.mjs';

const forbidden = new Set(['main', 'master']);
const branch = runCommand('git', ['branch', '--show-current'], {capture: true});
if (forbidden.has(branch)) {
  throw new Error('Neue Reel-Struktur nicht direkt auf main/master erzeugen. Zuerst einen Arbeitsbranch erstellen.');
}
const args = process.argv.slice(2);
runCommand(process.execPath, ['scripts/new-electrical-week-reel.mjs', ...args]);
runCommand(process.execPath, ['scripts/upgrade-electrical-prompt-style.mjs', ...args]);
