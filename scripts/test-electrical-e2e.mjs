#!/usr/bin/env node
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {ScenePlan, AssetManifest, ProductionStatus} from './lib/electrical-contracts.mjs';
import {createElectricalScenePlanTemplate, createElectricalStatusTemplate, createElectricalPromptManifestTemplate} from './lib/create-electrical-scene-plan-template.mjs';
import {ELECTRICAL_REEL_DIRECTORIES, checkElectricalProjectStructure} from './lib/electrical-project-structure.mjs';

const root = fs.mkdtempSync(path.join(os.tmpdir(), 'science-e2e-'));
try {
  for (const relative of ELECTRICAL_REEL_DIRECTORIES) fs.mkdirSync(path.join(root, relative), {recursive: true});
  const plan = ScenePlan.parse(createElectricalScenePlanTemplate({slug: 'science-e2e-test', sceneCount: 8}));
  const status = ProductionStatus.parse(createElectricalStatusTemplate(plan));
  const manifest = createElectricalPromptManifestTemplate(plan);
  const assets = AssetManifest.parse({version: 'science-v1', slug: plan.slug, generatedAt: new Date().toISOString(), assets: []});

  if (!checkElectricalProjectStructure(root, {requireContent: false}).ok) throw new Error('Ordnervertrag fehlgeschlagen.');
  if (status.status !== 'preproduction-blocked-until-gates-pass') throw new Error('Statusvertrag schützt die Preproduction nicht.');
  if (assets.slug !== plan.slug) throw new Error('Manifest und Szenenplan widersprechen sich.');
  if (plan.visualPolicyVersion !== 'science-static-v1') throw new Error('Science-Static-Visual-Policy fehlt im Scaffold.');
  if (plan.compositionId !== 'ScienceReel') throw new Error('Neue Reels müssen die statische ScienceReel-Komposition verwenden.');
  if (plan.generatedImageTextPolicy !== 'none') throw new Error('Textfreie Bildregel fehlt im Scaffold.');
  if (plan.scenes.some((scene) => scene.renderMode !== 'image-only')) throw new Error('Jede neue Szene muss image-only sein.');
  if (plan.scenes.some((scene) => scene.motionLevel !== 'none')) throw new Error('Neue Szenen dürfen keine Bewegung enthalten.');
  if (plan.scenes.some((scene) => scene.visualRecipe?.motion !== 'none')) throw new Error('Visual-Rezepte dürfen keine Bewegung verlangen.');
  if (plan.scenes.some((scene) => Boolean(scene.mechanism))) throw new Error('Science Static darf keine Mechanismus-Animationen anlegen.');
  if (manifest.requiredVisibleSceneImages !== plan.scenes.length) throw new Error('Jede Szene benötigt ein sichtbares Bild.');
  if (manifest.cover?.sourceSceneId !== plan.scenes[0].id) throw new Error('Cover muss aus Bild 01 stammen.');
  if (manifest.cover?.candidateCount !== 3) throw new Error('Bild 01 muss drei Cover-Kandidaten vorsehen.');

  console.log('✓ E2E-Vertrag: Science Static → Bilder → Cover aus Bild 01 → keine Animation → Status → Manifest ist konsistent.');
} finally {
  fs.rmSync(root, {recursive: true, force: true});
}
