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
  const plan = ScenePlan.parse(createElectricalScenePlanTemplate({slug: 'science-e2e-test', sceneCount: 20}));
  const status = ProductionStatus.parse(createElectricalStatusTemplate(plan));
  const manifest = createElectricalPromptManifestTemplate(plan);
  const assets = AssetManifest.parse({version: 'science-v1', slug: plan.slug, generatedAt: new Date().toISOString(), assets: []});

  if (!checkElectricalProjectStructure(root, {requireContent: false}).ok) throw new Error('Ordnervertrag fehlgeschlagen.');
  if (status.status !== 'preproduction-blocked-until-gates-pass') throw new Error('Statusvertrag schützt die Preproduction nicht.');
  if (assets.slug !== plan.slug) throw new Error('Manifest und Szenenplan widersprechen sich.');
  if (plan.productionProfile !== 'youtube-2min-v1') throw new Error('Aktives Produktionsprofil fehlt im Scaffold.');
  if (plan.visualPolicyVersion !== 'science-static-v1') throw new Error('Science-Static-Visual-Policy fehlt im Scaffold.');
  if (plan.compositionId !== 'ScienceReel') throw new Error('Kompatibilitäts-Composition ScienceReel fehlt.');
  if (plan.runtimeFile !== 'science-runtime.json') throw new Error('Science-Video muss science-runtime.json verwenden.');
  if (plan.generatedImageTextPolicy !== 'controlled-german-only') throw new Error('Kontrollierte Deutsch-only-Bildtextregel fehlt.');
  if (plan.width !== 1920 || plan.height !== 1080) throw new Error('Neue Videos müssen 1920×1080 sein.');
  if (plan.scenes.length !== 20) throw new Error('Standard-Scaffold muss 20 visuelle Beats erzeugen.');
  if (plan.scenes[0]?.section !== 'hook' || plan.scenes.at(-1)?.section !== 'payoff') throw new Error('Hook/Payoff-Dramaturgie fehlt.');
  if (plan.scenes.some((scene) => scene.renderMode !== 'image-only')) throw new Error('Jede neue Szene muss image-only sein.');
  if (plan.scenes.some((scene) => scene.motionLevel !== 'none')) throw new Error('Neue Szenen dürfen keine Bewegung enthalten.');
  if (plan.scenes.some((scene) => scene.visualRecipe?.motion !== 'none')) throw new Error('Visual-Rezepte dürfen keine Bewegung verlangen.');
  if (manifest.requiredVisibleSceneImages !== plan.scenes.length) throw new Error('Jeder visuelle Beat benötigt ein sichtbares Bild.');
  if (manifest.cover?.imageRequired !== false) throw new Error('Bild 01 darf nicht als Pflicht-Thumbnail dienen.');
  if (manifest.thumbnail?.required !== true) throw new Error('Separates Thumbnail fehlt.');
  if (manifest.thumbnail?.candidateCount !== 3) throw new Error('Drei Thumbnail-Kandidaten fehlen.');
  if (manifest.thumbnail?.width !== 1280 || manifest.thumbnail?.height !== 720) throw new Error('Thumbnail muss 1280×720 sein.');

  console.log('✓ E2E-Vertrag: 2-Minuten-Longform → 16:9 → 20 Beats → separates Thumbnail → statische Runtime ist konsistent.');
} finally {
  fs.rmSync(root, {recursive: true, force: true});
}
