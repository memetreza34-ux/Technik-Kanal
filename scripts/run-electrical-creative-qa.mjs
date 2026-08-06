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
let mechanismOnlyScenes = 0;

for (const scene of plan.scenes) {
  if (scene.layout) layouts.add(scene.layout);
  if (scene.renderMode === 'mechanism-only') mechanismOnlyScenes += 1;
  else imageScenes += 1;
  const headline = scene.headline ?? scene.title;
  const headlineWords = headline.trim().split(/\s+/).filter(Boolean).length;
  if (headlineWords > config.textQuality.headlineWordsMax) errors.push(`${scene.id}: Headline hat ${headlineWords} Wörter; maximal ${config.textQuality.headlineWordsMax}.`);
  if (!scene.voiceText.trim()) errors.push(`${scene.id}: kein Voice-Text.`);
  if (!scene.imageDir.trim()) errors.push(`${scene.id}: keine Bildzuordnung.`);
}

if (imageScenes < config.visuals.minimumImageLedScenes) errors.push(`Nur ${imageScenes} bildgeführte Szenen; mindestens ${config.visuals.minimumImageLedScenes}.`);
if (layouts.size < config.visuals.minimumLayoutTypes) errors.push('Zu wenig Layoutvariation.');

const promptFiles = {};
for (const scene of plan.scenes) {
  const direct = path.join(paths.promptDir, `${scene.id}.txt`);
  if (!fs.existsSync(direct)) continue;
  const prompt = fs.readFileSync(direct, 'utf8');
  promptFiles[scene.id] = prompt;
  if (/\[GENAUE AUSSAGE|\[AUSSAGE|MASTER STYLE PROMPT ANHÄNGEN|PROMPT ERGÄNZEN|EXAKTE DEUTSCHE/i.test(prompt)) errors.push(`${scene.id}: Einzelprompt enthält noch einen Platzhalter.`);
}

const promptManifest = fs.existsSync(paths.promptManifest) ? JSON.parse(fs.readFileSync(paths.promptManifest, 'utf8')) : null;
const policy = evaluateElectricalVisualPolicy({plan, config, promptFiles, promptManifest});
errors.push(...policy.errors);
warnings.push(...policy.warnings);

const coverRelative = promptManifest?.cover?.prompt ?? '02-bilder/prompts/00-cover.txt';
const coverFile = path.join(paths.root, coverRelative);
let coverPrompt = '';
if (!fs.existsSync(coverFile)) errors.push('Coverprompt fehlt.');
else {
  coverPrompt = fs.readFileSync(coverFile, 'utf8');
  const normalized = coverPrompt.toLowerCase();
  if (!normalized.includes('semi-photorealistic technical cgi') || !normalized.includes('real-world proportions')) errors.push('Coverprompt muss realistische technische CGI und reale Proportionen verlangen.');
  if (!normalized.includes('full-bleed') || !normalized.includes('edge-to-edge')) errors.push('Coverprompt muss den vollständigen 9:16-Rahmen füllen.');
  if (!/no white or gray (?:bands|bars)/.test(normalized) || !normalized.includes('no letterboxing')) errors.push('Coverprompt muss weiße Balken, Rahmen und Letterboxing verbieten.');
  if (!plan.coverText || !coverPrompt.includes(`"${plan.coverText}"`)) errors.push('Coverprompt enthält den exakten deutschen Hook nicht sichtbar im Bild.');
}

const firstHook = plan.scenes[0]?.headline ?? plan.scenes[0]?.title ?? '';
if (!plan.coverText?.trim()) errors.push('Deutscher Covertext fehlt im Szenenplan.');
else if (plan.coverText.trim() !== firstHook.trim()) errors.push('Der deutsche Covertext muss exakt dem Hook entsprechen.');

const combinedFile = path.join(paths.imageDir, 'ALLE-BILDPROMPTS-MIT-COVER.txt');
if (!fs.existsSync(combinedFile)) errors.push('ALLE-BILDPROMPTS-MIT-COVER.txt fehlt.');
else {
  const combined = fs.readFileSync(combinedFile, 'utf8');
  const normalize = (value) => String(value).replace(/\s+/g, ' ').trim().toLowerCase();
  const normalizedCombined = normalize(combined);
  if (!normalizedCombined.includes(normalize(coverPrompt))) errors.push('Der vollständige Coverprompt fehlt in ALLE-BILDPROMPTS-MIT-COVER.txt.');
  for (const scene of plan.scenes) {
    const prompt = promptFiles[scene.id];
    if (prompt && !normalizedCombined.includes(normalize(prompt))) errors.push(`${scene.id}: vollständiger Einzelprompt fehlt in ALLE-BILDPROMPTS-MIT-COVER.txt.`);
  }
  if (!combined.includes(plan.coverText)) errors.push('Gesamtdatei enthält den deutschen Cover-Hook nicht.');
}

const report = {
  version: 'electrical-v4-german-labels',
  generatedAt: new Date().toISOString(),
  passed: errors.length === 0,
  sceneCount: plan.scenes.length,
  imageScenes,
  mechanismOnlyScenes,
  layouts: [...layouts],
  backgroundFamilies: [...new Set(plan.scenes.map((scene) => scene.backgroundFamily).filter(Boolean))],
  visualPolicyVersion: plan.visualPolicyVersion ?? null,
  generatedImageTextPolicy: plan.generatedImageTextPolicy ?? null,
  fullMechanismSceneIds: policy.fullMechanismSceneIds,
  overlaySceneIds: policy.overlaySceneIds,
  coverText: plan.coverText ?? null,
  errors,
  warnings,
};
fs.writeFileSync(path.join(paths.projectDir, 'creative-qa-report.json'), `${JSON.stringify(report, null, 2)}\n`);
if (errors.length) {
  console.error('Creative-QA fehlgeschlagen:');
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}
console.log(`✓ Creative-QA bestanden: deutsche Labels, Full-bleed-Bilder und ${report.backgroundFamilies.length} Hintergrundfamilien.`);
warnings.forEach((warning) => console.warn(`⚠ ${warning}`));
