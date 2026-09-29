#!/usr/bin/env node
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {createElectricalScenePlanTemplate} from './lib/create-electrical-scene-plan-template.mjs';
import {ELECTRICAL_REEL_DIRECTORIES, checkElectricalProjectStructure} from './lib/electrical-project-structure.mjs';

const root = fs.mkdtempSync(path.join(os.tmpdir(), 'science-scaffold-'));
try {
  for (const relative of ELECTRICAL_REEL_DIRECTORIES) fs.mkdirSync(path.join(root, relative), {recursive: true});
  const plan = createElectricalScenePlanTemplate({slug: 'science-scaffold-test', sceneCount: 8});
  if (plan.scenes.length !== 8) throw new Error('Science-Template hat nicht acht Testszenen.');
  if (plan.visualPolicyVersion !== 'science-static-v1') throw new Error('Science-Static-Policy fehlt im Scaffold.');
  if (plan.compositionId !== 'ScienceReel') throw new Error('ScienceReel fehlt im Scaffold.');
  if (plan.scenes.some((scene) => scene.renderMode !== 'image-only' || scene.motionLevel !== 'none')) {
    throw new Error('Scaffold erzeugt unerlaubte bewegte oder nicht bildgeführte Szenen.');
  }
  const structure = checkElectricalProjectStructure(root, {requireContent: false});
  if (!structure.ok) throw new Error(`Scaffold-Struktur unvollständig: ${structure.missingDirectories.join(', ')}`);
  console.log('✓ Science-Scaffold erzeugt den vollständigen statischen Produktionsordnervertrag.');
} finally {
  fs.rmSync(root, {recursive: true, force: true});
}
