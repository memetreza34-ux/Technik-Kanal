#!/usr/bin/env node
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {ScenePlan, AssetManifest, ProductionStatus} from './lib/electrical-contracts.mjs';
import {createElectricalScenePlanTemplate, createElectricalStatusTemplate} from './lib/create-electrical-scene-plan-template.mjs';
import {ELECTRICAL_REEL_DIRECTORIES, checkElectricalProjectStructure} from './lib/electrical-project-structure.mjs';

const root = fs.mkdtempSync(path.join(os.tmpdir(), 'electrical-e2e-'));
try {
  for (const relative of ELECTRICAL_REEL_DIRECTORIES) fs.mkdirSync(path.join(root, relative), {recursive: true});
  const plan = ScenePlan.parse(createElectricalScenePlanTemplate({slug: 'e2e-test', sceneCount: 8}));
  const status = ProductionStatus.parse(createElectricalStatusTemplate(plan));
  const manifest = AssetManifest.parse({version: 'electrical-v1', slug: plan.slug, generatedAt: new Date().toISOString(), assets: []});
  if (!checkElectricalProjectStructure(root, {requireContent: false}).ok) throw new Error('Ordnervertrag fehlgeschlagen.');
  if (status.status !== 'inhalt-vorbereiten') throw new Error('Statusvertrag fehlgeschlagen.');
  if (manifest.slug !== plan.slug) throw new Error('Manifest und Szenenplan widersprechen sich.');
  if (plan.scenes.some((scene) => !scene.imageDir.startsWith('02-bilder/images/'))) throw new Error('Szenenbildpfade sind ungültig.');
  console.log('✓ E2E-Vertrag: Scaffold → Szenenplan → Status → Asset-Manifest ist konsistent.');
} finally {
  fs.rmSync(root, {recursive: true, force: true});
}
