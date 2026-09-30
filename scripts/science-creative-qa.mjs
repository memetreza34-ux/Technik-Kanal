#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {ScenePlan} from './lib/electrical-contracts.mjs';
import {electricalProjectPaths} from './lib/electrical-project-structure.mjs';
import {loadElectricalConfig} from './lib/load-electrical-config.mjs';
import {evaluateScienceVisualPolicy} from './lib/science-visual-policy.mjs';

const [projectArg] = process.argv.slice(2).filter((arg) => !arg.startsWith('--'));
if (!projectArg) throw new Error('Nutzung: npm run science:creative-qa -- <reel-ordner>');

const paths = electricalProjectPaths(path.resolve(projectArg));
const config = loadElectricalConfig();
const plan = ScenePlan.parse(JSON.parse(fs.readFileSync(paths.scenePlan,'utf8')));
const errors = [];
const warnings = [];
const layouts = new Set();

for (const scene of plan.scenes) {
  if (scene.layout) layouts.add(scene.layout);
  const headlineWords = (scene.headline ?? scene.title).trim().split(/\s+/).filter(Boolean).length;
  if (headlineWords > config.textQuality.headlineWordsMax) errors.push(`${scene.id}: Headline zu lang.`);
  if (!scene.voiceText.trim()) errors.push(`${scene.id}: Voice-Text fehlt.`);
  if (!scene.imageDir.trim()) errors.push(`${scene.id}: Bildzuordnung fehlt.`);
  const labels = scene.imageAnnotations ?? [];
  if (labels.length > config.visuals.controlledLabels.maximumPerScene) errors.push(`${scene.id}: zu viele kontrollierte Labels.`);
  for (const label of labels) {
    const words = String(label.text ?? '').trim().split(/\s+/).filter(Boolean).length;
    if (words > config.visuals.controlledLabels.maximumWordsPerLabel) errors.push(`${scene.id}: Label "${label.text}" ist zu lang.`);
  }
}

const promptFiles = {};
for (const scene of plan.scenes) {
  const file = path.join(paths.promptDir,`${scene.id}.txt`);
  if (!fs.existsSync(file)) {
    errors.push(`${scene.id}: Einzelprompt fehlt.`);
    continue;
  }
  const prompt = fs.readFileSync(file,'utf8');
  promptFiles[scene.id] = prompt;
  if (/\[GENAUE|\[AUSSAGE|ERGÄNZEN|PLACEHOLDER/i.test(prompt)) errors.push(`${scene.id}: Prompt enthält noch Platzhalter.`);
  if (!/scientific cutaway 3d explainer/i.test(prompt)) errors.push(`${scene.id}: verbindliche Scientific-Cutaway-Bildwelt fehlt im Prompt.`);
  if (!/no visible text/i.test(prompt)) errors.push(`${scene.id}: textfreie Basisbildregel fehlt im Prompt.`);
  if (!/cause-and-effect|internal structure|cutaway|cross-section|macro|micro|real object/i.test(prompt)) warnings.push(`${scene.id}: Prompt beschreibt die Erklärdarstellung noch zu schwach.`);
}

const promptManifest = fs.existsSync(paths.promptManifest) ? JSON.parse(fs.readFileSync(paths.promptManifest,'utf8')) : null;
const policy = evaluateScienceVisualPolicy({plan,config,promptFiles,promptManifest});
errors.push(...policy.errors);
warnings.push(...policy.warnings);

const coverFile = path.join(paths.promptDir,'00-cover.txt');
let coverPrompt = '';
if (!fs.existsSync(coverFile)) errors.push('Cover-/Bild-01-Prompt fehlt.');
else {
  coverPrompt = fs.readFileSync(coverFile,'utf8');
  const normalized = coverPrompt.toLowerCase();
  if (!normalized.includes('scientific cutaway 3d explainer')) errors.push('Coverprompt verwendet nicht die verbindliche Scientific-Cutaway-Bildwelt.');
  if (!normalized.includes('no visible text')) errors.push('Coverprompt muss sichtbaren KI-Text verbieten.');
  if (!normalized.includes('edge-to-edge')) errors.push('Coverprompt muss 9:16 edge-to-edge verlangen.');
  if (!/three distinct composition candidates|drei.*kandid/i.test(coverPrompt)) errors.push('Bild 01 muss drei Cover-Kandidaten vorsehen.');
}

const combinedFile = path.join(paths.root,'02-bilder','ALLE-BILDPROMPTS-MIT-COVER.txt');
if (!fs.existsSync(combinedFile)) errors.push('ALLE-BILDPROMPTS-MIT-COVER.txt fehlt.');
else {
  const combined = fs.readFileSync(combinedFile,'utf8');
  const normalize = (value) => String(value).replace(/\s+/g,' ').trim().toLowerCase();
  if (coverPrompt && !normalize(combined).includes(normalize(coverPrompt))) errors.push('Vollständiger Coverprompt fehlt in der Gesamtdatei.');
  for (const scene of plan.scenes) {
    if (promptFiles[scene.id] && !normalize(combined).includes(normalize(promptFiles[scene.id]))) errors.push(`${scene.id}: Prompt fehlt in der Gesamtdatei.`);
  }
  if (!combined.includes(plan.coverText)) errors.push('Gesamtdatei nennt den kontrollierten deutschen Covertext nicht.');
}

const report = {
  version:'science-static-v1',
  styleId:config.visuals.styleId,
  generatedAt:new Date().toISOString(),
  passed:errors.length===0,
  sceneCount:plan.scenes.length,
  imageScenes:plan.scenes.length,
  layouts:[...layouts],
  backgroundFamilies:[...new Set(plan.scenes.map((scene)=>scene.backgroundFamily).filter(Boolean))],
  shotTypes:[...new Set(plan.scenes.map((scene)=>scene.shotType).filter(Boolean))],
  visualPolicyVersion:plan.visualPolicyVersion,
  generatedImageTextPolicy:plan.generatedImageTextPolicy,
  errors,
  warnings
};
fs.writeFileSync(path.join(paths.projectDir,'creative-qa-report.json'),`${JSON.stringify(report,null,2)}\n`);

if (errors.length) {
  console.error('Science-Creative-QA fehlgeschlagen:');
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}
console.log(`✓ Science-Creative-QA bestanden: ${plan.scenes.length} statische Scientific-Cutaway-3D-Erklärszenen.`);
warnings.forEach((warning)=>console.warn(`⚠ ${warning}`));
