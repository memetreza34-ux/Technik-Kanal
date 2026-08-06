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
  const manifest = AssetManifest.parse({version: 'electrical-v2', slug: plan.slug, generatedAt: new Date().toISOString(), assets: []});
  if (!checkElectricalProjectStructure(root, {requireContent: false}).ok) throw new Error('Ordnervertrag fehlgeschlagen.');
  if (status.status !== 'preproduction-blocked-until-gates-pass') throw new Error('Statusvertrag schützt die Preproduction nicht.');
  if (manifest.slug !== plan.slug) throw new Error('Manifest und Szenenplan widersprechen sich.');
  if (plan.visualPolicyVersion !== 'visual-v2') throw new Error('Visual-Policy fehlt im Scaffold.');
  if (plan.generatedImageTextPolicy !== 'none') throw new Error('Textfreie Bildregel fehlt im Scaffold.');
  if (plan.animationBudget.fullMechanismScenes.length > plan.animationBudget.maximum) throw new Error('Animationsbudget ist ungültig.');
  if (plan.scenes.some((scene) => !scene.imageDir.startsWith('02-bilder/images/'))) throw new Error('Szenenbildpfade sind ungültig.');
  if (plan.scenes[0].motionLevel === 'full') throw new Error('Hook darf keine Vollanimation erhalten.');
  console.log('✓ E2E-Vertrag: Scaffold → Visual-Policy → Szenenplan → Status → Manifest ist konsistent.');
} finally {
  fs.rmSync(root, {recursive: true, force: true});
}
