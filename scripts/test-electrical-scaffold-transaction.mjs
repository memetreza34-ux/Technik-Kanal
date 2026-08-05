#!/usr/bin/env node
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {createElectricalScenePlanTemplate} from './lib/create-electrical-scene-plan-template.mjs';
import {ELECTRICAL_REEL_DIRECTORIES, checkElectricalProjectStructure} from './lib/electrical-project-structure.mjs';

const root = fs.mkdtempSync(path.join(os.tmpdir(), 'electrical-scaffold-'));
try {
  for (const relative of ELECTRICAL_REEL_DIRECTORIES) fs.mkdirSync(path.join(root, relative), {recursive: true});
  const plan = createElectricalScenePlanTemplate({slug: 'scaffold-test', sceneCount: 8});
  if (plan.scenes.length !== 8) throw new Error('Template hat nicht acht Szenen.');
  const structure = checkElectricalProjectStructure(root, {requireContent: false});
  if (!structure.ok) throw new Error(`Scaffold-Struktur unvollständig: ${structure.missingDirectories.join(', ')}`);
  console.log('✓ Scaffold-Transaktion erzeugt alle FinanzNeo-kompatiblen Produktionsordner.');
} finally {
  fs.rmSync(root, {recursive: true, force: true});
}
