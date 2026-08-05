#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {ScenePlan} from './lib/electrical-contracts.mjs';
import {electricalProjectPaths} from './lib/electrical-project-structure.mjs';

const [projectArg] = process.argv.slice(2).filter((arg) => !arg.startsWith('--'));
if (!projectArg) {
  console.error('Nutzung: node scripts/check-electrical-content-package.mjs <reel-ordner>');
  process.exit(1);
}

const root = path.resolve(projectArg);
const paths = electricalProjectPaths(root);
const errors = [];
const warnings = [];
const read = (file) => fs.existsSync(file) ? fs.readFileSync(file, 'utf8').trim() : '';

for (const [label, file] of [
  ['Skript', paths.script],
  ['Fließtext', paths.scriptPlain],
  ['Voice-over-Text', paths.voiceoverText],
  ['Bildprompts', paths.prompts],
  ['Social Caption', paths.socialCaption],
  ['Lernzettel', paths.learningSheet],
  ['Quellen', paths.sources],
  ['Storyboard', paths.storyboard],
  ['Motion Design', paths.motionDesign],
]) {
  if (!read(file)) errors.push(`${label} fehlt oder ist leer: ${file}`);
}

let plan;
try {
  plan = ScenePlan.parse(JSON.parse(read(paths.scenePlan)));
} catch (error) {
  errors.push(`Szenenplan ungültig: ${error.message}`);
}

if (plan) {
  const promptFiles = fs.existsSync(paths.promptDir)
    ? fs.readdirSync(paths.promptDir).filter((name) => name.endsWith('.txt'))
    : [];
  if (promptFiles.length < plan.scenes.length) {
    errors.push(`Zu wenige Einzelprompts: ${promptFiles.length}; erwartet mindestens ${plan.scenes.length}.`);
  }
  const sourceText = read(paths.sources).toLowerCase();
  for (const scene of plan.scenes) {
    if (scene.factClaim && (!scene.sourceIds || scene.sourceIds.length === 0)) {
      errors.push(`Szene ${scene.id} enthält eine Faktenaussage ohne sourceIds.`);
    }
    for (const sourceId of scene.sourceIds ?? []) {
      if (!sourceText.includes(sourceId.toLowerCase())) warnings.push(`Quellen-ID ${sourceId} aus Szene ${scene.id} steht nicht sichtbar in sources.md.`);
    }
  }
}

const report = {
  version: 'electrical-v1',
  generatedAt: new Date().toISOString(),
  passed: errors.length === 0,
  errors,
  warnings,
};
fs.writeFileSync(paths.contentReport, `${JSON.stringify(report, null, 2)}\n`);

if (errors.length) {
  console.error('Content-Paket unvollständig:');
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}
console.log('✓ Inhaltspaket vollständig.');
warnings.forEach((warning) => console.warn(`⚠ ${warning}`));
