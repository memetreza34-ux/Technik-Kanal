#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {ScenePlan} from './lib/electrical-contracts.mjs';
import {electricalProjectPaths} from './lib/electrical-project-structure.mjs';
import {loadElectricalConfig} from './lib/load-electrical-config.mjs';
import {evaluateElectricalVisualPolicy} from './lib/electrical-visual-policy.mjs';

const [projectArg] = process.argv.slice(2).filter((arg) => !arg.startsWith('--'));
if (!projectArg) throw new Error('Nutzung: npm run science:creative-qa -- <reel-ordner>');

const paths = electricalProjectPaths(path.resolve(projectArg));
const config = loadElectricalConfig();
const plan = ScenePlan.parse(JSON.parse(fs.readFileSync(paths.scenePlan,'utf8')));
const strict = plan.visualPolicyVersion === config.visuals.policyVersion;
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
  if (/\[GENAUE|\[AUSSAGE|ERGÄNZEN|PLACEHOLDER/i.test(prompt)) errors.push(`${scene.id}: Prompt enthält noch Platzhalter.`);
  if (!/cinematic scientific 3d editorial/i.test(prompt)) errors.push(`${scene.id}: verbindliche Scientific-3D-Bildwelt fehlt im Prompt.`);
  if (!/no visible text/i.test(prompt)) errors.push(`${scene.id}: textfreie Bildregel fehlt im Prompt.`);
}

const promptManifest = fs.existsSync(paths.promptManifest) ? JSON.parse(fs.readFileSync(paths.promptManifest,'utf8')) : null;
const policy = evaluateElectricalVisualPolicy({plan,config,promptFiles,promptManifest});
errors.push(...policy.errors);
warnings.push(...policy.warnings);

const coverFile = path.join(paths.promptDir,'00-cover.txt');
let coverPrompt = '';
if (!fs.existsSync(coverFile)) errors.push('Cover-/Bild-01-Prompt fehlt.');
else {
  coverPrompt = fs.readFileSync(coverFile,'utf8');
  const normalized = coverPrompt.toLowerCase();
  if (strict && !normalized.includes('cinematic scientific 3d editorial')) errors.push('Coverprompt verwendet nicht die verbindliche Scientific-3D-Bildwelt.');
  if (strict && !normalized.includes('no visible text')) errors.push('Coverprompt muss sichtbaren KI-Text verbieten.');
  if (strict && !normalized.includes('edge-to-edge')) errors.push('Coverprompt muss 9:16 edge-to-edge verlangen.');
  if (strict && !/three distinct composition candidates|drei.*kandid/i.test(coverPrompt)) errors.push('Bild 01 muss drei Cover-Kandidaten vorsehen.');
}

const firstHook = plan.scenes[0]?.headline ?? plan.scenes[0]?.title ?? '';
if (!plan.coverText?.trim() || plan.coverText.trim() !== firstHook.trim()) errors.push('Covertext und Hook müssen identisch sein.');

const combinedFile = path.join(paths.imageDir,'ALLE-BILDPROMPTS-MIT-COVER.txt');
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
  generatedAt:new Date().toISOString(),
  passed:errors.length===0,
  sceneCount:plan.scenes.length,
  imageScenes:plan.scenes.filter((scene)=>(scene.renderMode??'image-only')==='image-only').length,
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
  console.error('Creative-QA fehlgeschlagen:');
  errors.forEach((error)=>console.error(`- ${error}`));
  process.exit(1);
}
console.log(`✓ Creative-QA bestanden: ${plan.scenes.length} statische Scientific-3D-Bildszenen.`);
warnings.forEach((warning)=>console.warn(`⚠ ${warning}`));
