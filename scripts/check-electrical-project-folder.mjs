#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {assertElectricalProjectStructure} from './lib/electrical-project-structure.mjs';

const [projectArg] = process.argv.slice(2).filter((arg) => !arg.startsWith('--'));
if (!projectArg) {
  console.error('Nutzung: node scripts/check-electrical-project-folder.mjs <reel-ordner>');
  process.exit(1);
}

const root = path.resolve(projectArg);
if (!fs.existsSync(root) || !fs.statSync(root).isDirectory()) throw new Error(`Reel-Ordner nicht gefunden: ${root}`);
const report = assertElectricalProjectStructure(root);
console.log(`✓ FinanzNeo-kompatible Reel-Struktur: ${root}`);
console.log(`  Pflichtordner: ${report.missingDirectories.length === 0 ? 'vollständig' : 'unvollständig'}`);
console.log(`  Pflichtdateien: ${report.missingFiles.length === 0 ? 'vollständig' : 'unvollständig'}`);
