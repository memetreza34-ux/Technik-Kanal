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
  if (/\[GENAUE|\[AUSSAGE|ERGÄNZEN|PLACEHOLDER|NEUE BILDWELT/i.test(prompt)) {
    errors.push(`${scene.id}: Prompt ist noch nicht final.`);
  }
  if (!/(Deutsch|German|deutsche Beschrift|deutscher Text|kein englischer Text|no English text)/i.test(prompt)) {
    warnings.push(`${scene.id}: Bei sichtbarem Bildtext Deutsch-only ausdrücklich festlegen.`);
  }
  if (!/(eine Hauptaussage|one main idea|one scientific statement|genau.*Satz|exact idea|exact statement)/i.test(prompt)) {
    warnings.push(`${scene.id}: Prompt sollte die eine Kernaussage der Szene klar priorisieren.`);
  }
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
  if (/neue bildwelt/i.test(coverPrompt)) errors.push('Coverprompt ist noch nicht final.');
  if (!/9:16/i.test(coverPrompt)) warnings.push('Coverprompt sollte 9:16 ausdrücklich verlangen.');
}

const combinedFile = path.join(paths.root,'02-bilder','ALLE-BILDPROMPTS-MIT-COVER.txt');
if (!fs.existsSync(combinedFile)) errors.push('Gesamt-Promptdatei fehlt.');
else {
  const combined = fs.readFileSync(combinedFile,'utf8');
  const normalize = (value) => String(value).replace(/\s+/g,' ').trim().toLowerCase();
  if (coverPrompt && !normalize(combined).includes(normalize(coverPrompt))) errors.push('Coverprompt fehlt in der Gesamtdatei.');
  for (const scene of plan.scenes) {
    if (promptFiles[scene.id] && !normalize(combined).includes(normalize(promptFiles[scene.id]))) errors.push(`${scene.id}: Prompt fehlt in der Gesamtdatei.`);
  }
}

const report = {
  version:'science-static-v1',
  styleId:config.visuals.styleId,
  brandVisualStyleDefined:config.visuals.brandVisualStyleDefined === true,
  generatedImageTextPolicy:config.visuals.generatedImageTextPolicy,
  generatedAt:new Date().toISOString(),
  passed:errors.length===0,
  sceneCount:plan.scenes.length,
  layouts:[...layouts],
  visualPolicyVersion:plan.visualPolicyVersion,
  errors,
  warnings
};
fs.writeFileSync(path.join(paths.projectDir,'creative-qa-report.json'),`${JSON.stringify(report,null,2)}\n`);

if (errors.length) {
  console.error('Science-Creative-QA fehlgeschlagen:');
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}
console.log(`✓ Science-Creative-QA bestanden: ${plan.scenes.length} statische Bildszenen.`);
warnings.forEach((warning)=>console.warn(`⚠ ${warning}`));
