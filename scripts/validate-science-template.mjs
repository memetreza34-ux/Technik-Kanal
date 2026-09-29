#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {assertElectricalProjectStructure} from './lib/electrical-project-structure.mjs';

const reelsRoot = path.join(process.cwd(), 'channels/science/reels');
if (!fs.existsSync(reelsRoot)) throw new Error(`Reels-Ordner fehlt: ${reelsRoot}`);
const weekPattern = /^\d{4}-\d{2}-\d{2}_bis_\d{4}-\d{2}-\d{2}$/;
const reelPattern = /^\d{2}_[A-Za-z0-9ÄÖÜäöüß][A-Za-z0-9ÄÖÜäöüß_-]*$/;
let count = 0;
for (const week of fs.readdirSync(reelsRoot, {withFileTypes: true}).filter((entry) => entry.isDirectory())) {
  if (!weekPattern.test(week.name)) throw new Error(`Ungültiger Wochenordner: ${week.name}`);
  const weekDir = path.join(reelsRoot, week.name);
  for (const reel of fs.readdirSync(weekDir, {withFileTypes: true}).filter((entry) => entry.isDirectory())) {
    if (!reelPattern.test(reel.name)) throw new Error(`Ungültiger Reel-Ordner: ${week.name}/${reel.name}`);
    assertElectricalProjectStructure(path.join(weekDir, reel.name));
    count += 1;
  }
}
if (!count) throw new Error('Kein vollständiger Science-Reel-Ordner gefunden.');
console.log(`✓ ${count} Science-Reel-Ordner entsprechen dem Produktionsvertrag.`);
