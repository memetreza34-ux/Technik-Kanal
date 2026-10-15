#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {assertElectricalProjectStructure} from './lib/electrical-project-structure.mjs';

const youtubeRoot = path.join(process.cwd(), 'channels/science/YouTube');
if (!fs.existsSync(youtubeRoot)) throw new Error(`YouTube-Ordner fehlt: ${youtubeRoot}`);
const weekPattern = /^\d{4}-\d{2}-\d{2}_bis_\d{4}-\d{2}-\d{2}$/;
const reelPattern = /^\d{2}_[A-Za-z0-9ÄÖÜäöüß][A-Za-z0-9ÄÖÜäöüß_-]*$/;
let count = 0;
for (const week of fs.readdirSync(youtubeRoot, {withFileTypes: true}).filter((entry) => entry.isDirectory())) {
  if (!weekPattern.test(week.name)) throw new Error(`Ungültiger Wochenordner: ${week.name}`);
  const weekDir = path.join(youtubeRoot, week.name);
  for (const reel of fs.readdirSync(weekDir, {withFileTypes: true}).filter((entry) => entry.isDirectory())) {
    if (!reelPattern.test(reel.name)) throw new Error(`Ungültiger YouTube-Videoordner: ${week.name}/${reel.name}`);
    assertElectricalProjectStructure(path.join(weekDir, reel.name));
    count += 1;
  }
}
if (!count) throw new Error('Kein vollständiger Science-YouTube-Videoordner gefunden.');
console.log(`✓ ${count} Science-YouTube-Videoordner entsprechen dem Produktionsvertrag.`);
