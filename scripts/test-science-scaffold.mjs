#!/usr/bin/env node
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {createElectricalScenePlanTemplate} from './lib/create-electrical-scene-plan-template.mjs';
import {ELECTRICAL_REEL_DIRECTORIES, checkElectricalProjectStructure} from './lib/electrical-project-structure.mjs';

const root = fs.mkdtempSync(path.join(os.tmpdir(), 'science-scaffold-'));
try {
  for (const relative of ELECTRICAL_REEL_DIRECTORIES) fs.mkdirSync(path.join(root, relative), {recursive: true});
  const plan = createElectricalScenePlanTemplate({slug: 'science-scaffold-test'});
  if (plan.scenes.length !== 56) throw new Error('Science-Template hat nicht 56 Standard-Beats.');
  if (plan.productionProfile !== 'youtube-6to7min-v1') throw new Error('youtube-6to7min-v1 fehlt im Scaffold.');
  if (plan.width !== 1920 || plan.height !== 1080) throw new Error('Scaffold ist nicht 1920×1080.');
  if (plan.visualPolicyVersion !== 'science-static-v1') throw new Error('Science-Static-Policy fehlt im Scaffold.');
  if (plan.compositionId !== 'ScienceReel') throw new Error('ScienceReel fehlt im Scaffold.');
  if (plan.scenes[0]?.section !== 'hook' || plan.scenes.at(-1)?.section !== 'payoff') throw new Error('Dramaturgie-Abschnitte fehlen im Scaffold.');
  if (plan.scenes.some((scene) => scene.renderMode !== 'image-only' || scene.motionLevel !== 'none')) {
    throw new Error('Scaffold erzeugt unerlaubte bewegte oder nicht bildgeführte Szenen.');
  }
  const structure = checkElectricalProjectStructure(root, {requireContent: false});
  if (!structure.ok) throw new Error(`Scaffold-Struktur unvollständig: ${structure.missingDirectories.join(', ')}`);
  console.log('✓ Science-Scaffold erzeugt 56 statische 16:9-Beats (6–7 Minuten) plus Thumbnail-Struktur.');
} finally {
  fs.rmSync(root, {recursive: true, force: true});
}
