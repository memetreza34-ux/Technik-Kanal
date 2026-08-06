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
  if (scene.renderMode === 'mechanism-only') textOnlyScenes += 1;
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
  if (fs.existsSync(direct)) {
    const prompt = fs.readFileSync(direct, 'utf8');
    promptFiles[scene.id] = prompt;
    if (/\[GENAUE AUSSAGE|\[AUSSAGE|MASTER STYLE PROMPT ANHÄNGEN|PROMPT ERGÄNZEN/i.test(prompt)) errors.push(`${scene.id}: Einzelprompt enthält noch einen Platzhalter.`);
  }
}
const promptManifest = fs.existsSync(paths.promptManifest) ? JSON.parse(fs.readFileSync(paths.promptManifest, 'utf8')) : null;
const policy = evaluateElectricalVisualPolicy({plan, config, promptFiles, promptManifest});
errors.push(...policy.errors);
warnings.push(...policy.warnings);

const coverRelative = promptManifest?.cover?.prompt ?? '02-bilder/prompts/00-cover.txt';
const coverFile = path.join(paths.root, coverRelative);
let coverPrompt = '';
if (!fs.existsSync(coverFile)) {
  errors.push('Coverprompt fehlt.');
} else {
  coverPrompt = fs.readFileSync(coverFile, 'utf8');
  const normalized = coverPrompt.toLowerCase();
  if (!normalized.includes('no visible text')) errors.push('Coverprompt muss sichtbaren KI-Text ausdrücklich verbieten.');
  if (!normalized.includes('semi-photorealistic technical cgi') || !normalized.includes('real-world proportions')) errors.push('Coverprompt muss realistische technische CGI und reale Proportionen verlangen.');
  if (!/(top 18 percent|top 18%)/.test(normalized)) errors.push('Coverprompt reserviert die oberen 18% nicht.');
  if (!/(bottom 25 percent|bottom 25%)/.test(normalized)) errors.push('Coverprompt reserviert die unteren 25% nicht.');
  if (/["“”][^"“”]{1,80}["“”]/.test(coverPrompt)) errors.push('Coverprompt enthält Anführungszeichen und könnte KI-Schrift erzeugen.');
}

const firstHook = plan.scenes[0]?.headline ?? plan.scenes[0]?.title ?? '';
if (!plan.coverText?.trim()) errors.push('Deutscher Covertext fehlt im Szenenplan.');
else if (plan.coverText.trim() !== firstHook.trim()) errors.push('Der deutsche Covertext muss exakt dem Hook entsprechen.');

const combinedFile = path.join(paths.imageDir, 'ALLE-BILDPROMPTS-MIT-COVER.txt');
if (!fs.existsSync(combinedFile)) {
  errors.push('ALLE-BILDPROMPTS-MIT-COVER.txt fehlt.');
} else {
  const combined = fs.readFileSync(combinedFile, 'utf8');
  const normalize = (value) => String(value).replace(/\s+/g, ' ').trim().toLowerCase();
  const normalizedCombined = normalize(combined);
  if (!normalizedCombined.includes(normalize(coverPrompt))) errors.push('Der vollständige Coverprompt fehlt in ALLE-BILDPROMPTS-MIT-COVER.txt.');
  for (const scene of plan.scenes) {
    const prompt = promptFiles[scene.id];
    if (prompt && !normalizedCombined.includes(normalize(prompt))) errors.push(`${scene.id}: vollständiger Einzelprompt fehlt in ALLE-BILDPROMPTS-MIT-COVER.txt.`);
  }
  if (!/final(?:e|er)? cover.*remotion.*hook|cover.*hook.*remotion/i.test(combined)) errors.push('Gesamtdatei erklärt nicht, dass der fertige Cover-Still den deutschen Hook per Remotion enthalten muss.');
}

const report = {
  version: 'electrical-v3-realistic',
  generatedAt: new Date().toISOString(),
  passed: errors.length === 0,
  sceneCount: plan.scenes.length,
  imageScenes,
  mechanismOnlyScenes: textOnlyScenes,
  layouts: [...layouts],
  visualPolicyVersion: plan.visualPolicyVersion ?? null,
  fullMechanismSceneIds: policy.fullMechanismSceneIds,
  overlaySceneIds: policy.overlaySceneIds,
  coverText: plan.coverText ?? null,
  coverPromptPassed: !errors.some((error) => error.startsWith('Coverprompt')),
  combinedPromptFileComplete: !errors.some((error) => error.includes('ALLE-BILDPROMPTS')),
  errors,
  warnings,
};
fs.writeFileSync(path.join(paths.projectDir, 'creative-qa-report.json'), `${JSON.stringify(report, null, 2)}\n`);
if (errors.length) {
  console.error('Creative-QA fehlgeschlagen:');
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}
console.log(`✓ Creative-QA bestanden: realistische Bildsprache, ${policy.fullMechanismSceneIds.length} Vollanimationen, ${imageScenes} sichtbare Bildszenen.`);
warnings.forEach((warning) => console.warn(`⚠ ${warning}`));
