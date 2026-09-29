#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {runCommand} from './lib/run-command.mjs';

const root = process.cwd();
const walk = (dir) => fs.readdirSync(dir, {withFileTypes: true}).flatMap((entry) => {
  const full = path.join(dir, entry.name);
  return entry.isDirectory() ? walk(full) : [full];
});
const files = walk(path.join(root, 'scripts')).filter((file) => file.endsWith('.mjs'));
for (const file of files) runCommand(process.execPath, ['--check', file], {cwd: root});
console.log(`✓ Syntax von ${files.length} Node-Skripten geprüft.`);
