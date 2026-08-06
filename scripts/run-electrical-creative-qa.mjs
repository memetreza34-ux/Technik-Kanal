#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {ScenePlan} from './lib/electrical-contracts.mjs';
import {electricalProjectPaths} from './lib/electrical-project-structure.mjs';
import {loadElectricalConfig} from './lib/load-electrical-config.mjs';
import {evaluateElectricalVisualPolicy} from './lib/electrical-visual-policy.mjs';

const [projectArg] = process.argv.slice(2).filter((arg) => !arg.startsWith('--'));
if (!projectArg) {
  console.error('Nutzung: node scripts/run-electrical-creative-qa.mjs <reel-ordner>');
  process.exit(1);
}

const paths = electricalProjectPaths(path.resolve(projectArg));
const config = loadElectricalConfig();
const plan = ScenePlan.parse(JSON.parse(fs.readFileSync(paths.scenePlan, 'utf8')));
const errors = [];
const warnings = [];
const layouts = new Set();
let imageScenes = 0;
let textOnlyScenes = 0;

for (const scene of plan.scenes) {
  if (scene.layout) layouts.add(scene.layout);
  if (scene.imageDir) imageScenes += 1;
  else textOnlyScenes += 1;
  const headline = scene.headline ?? scene.title;
  const headlineWords = headline.trim().split(/\s+/).filter(Boolean).length;
  if (headlineWords > config.textQuality.headlineWordsMax) {
    errors.push(`${scene.id}: Headline hat ${headlineWords} Wörter; maximal ${config.textQuality.headlineWordsMax}.`);
  }
  if (!scene.voiceText.trim()) errors.push(`${scene.id}: kein Voice-Text.`);
  if (!scene.imageDir.trim()) errors.push(`${scene.id}: keine Bildzuordnung.`);
}

if (imageScenes < config.visuals.minimumImageLedScenes) {
  errors.push(`Nur ${imageScenes} bildgeführte Szenen; mindestens ${config.visuals.minimumImageLedScenes}.`);
}
if (textOnlyScenes > config.visuals.maximumTextOnlyScenesPerReel) {
  errors.push(`${textOnlyScenes} reine Textszenen; maximal ${config.visuals.maximumTextOnlyScenesPerReel}.`);
}
if (layouts.size < config.visuals.minimumLayoutTypes) errors.push('Zu wenig Layoutvariation.');

const promptFiles = {};
for (const scene of plan.scenes) {
  const direct = path.join(paths.promptDir, `${scene.id}.txt`);
  if (fs.existsSync(direct)) promptFiles[scene.id] = fs.readFileSync(direct, 'utf8');
}
const promptManifest = fs.existsSync(paths.promptManifest)
  ? JSON.parse(fs.readFileSync(paths.promptManifest, 'utf8'))
  : null;
const policy = evaluateElectricalVisualPolicy({plan, config, promptFiles, promptManifest});
errors.push(...policy.errors);
warnings.push(...policy.warnings);

const report = {
  version: 'electrical-v2',
  generatedAt: new Date().toISOString(),
  passed: errors.length === 0,
  sceneCount: plan.scenes.length,
  imageScenes,
  textOnlyScenes,
  layouts: [...layouts],
  visualPolicyVersion: plan.visualPolicyVersion ?? null,
  fullMechanismSceneIds: policy.fullMechanismSceneIds,
  overlaySceneIds: policy.overlaySceneIds,
  errors,
  warnings,
};
fs.writeFileSync(path.join(paths.projectDir, 'creative-qa-report.json'), `${JSON.stringify(report, null, 2)}\n`);
if (errors.length) {
  console.error('Creative-QA fehlgeschlagen:');
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}
console.log(`✓ Creative-QA bestanden: ${policy.fullMechanismSceneIds.length} Vollanimationen, ${imageScenes} Bildszenen.`);
warnings.forEach((warning) => console.warn(`⚠ ${warning}`));
