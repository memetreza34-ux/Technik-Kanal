#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {electricalProjectPaths} from './lib/electrical-project-structure.mjs';

const [projectArg] = process.argv.slice(2).filter((arg) => !arg.startsWith('--'));
if (!projectArg) process.exit(0);

const paths = electricalProjectPaths(path.resolve(projectArg));
const report = path.join(paths.workDir, 'generated-mechanism-canvases.json');
if (!fs.existsSync(report)) process.exit(0);

const data = JSON.parse(fs.readFileSync(report, 'utf8'));
let removed = 0;
for (const file of Array.isArray(data.files) ? data.files : []) {
  if (path.basename(file) !== '.generated-mechanism-canvas.png') continue;
  if (fs.existsSync(file)) {
    fs.unlinkSync(file);
    removed += 1;
  }
}
fs.rmSync(report, {force: true});
console.log(`✓ ${removed} interne Mechanismus-Flächen entfernt.`);
