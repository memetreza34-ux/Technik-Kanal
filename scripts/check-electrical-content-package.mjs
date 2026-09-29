#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {ScenePlan} from './lib/electrical-contracts.mjs';
import {electricalProjectPaths} from './lib/electrical-project-structure.mjs';

const [projectArg] = process.argv.slice(2).filter((arg) => !arg.startsWith('--'));
if (!projectArg) {
  console.error('Nutzung: npm run science:preflight -- <reel-ordner>');
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
  ['Static Edit Contract', paths.motionDesign],
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
  if (promptFiles.length < plan.scenes.length + 1) {
    errors.push(`Zu wenige Einzelprompts: ${promptFiles.length}; erwartet Cover plus ${plan.scenes.length} Szenen.`);
  }

  const sourceText = read(paths.sources).toLowerCase();
  for (const scene of plan.scenes) {
    if (scene.factClaim && (!scene.sourceIds || scene.sourceIds.length === 0)) {
      errors.push(`Szene ${scene.id} enthält eine Faktenaussage ohne sourceIds.`);
    }
    for (const sourceId of scene.sourceIds ?? []) {
      if (!sourceText.includes(sourceId.toLowerCase())) {
        errors.push(`Quellen-ID ${sourceId} aus Szene ${scene.id} fehlt in sources.md.`);
      }
    }
  }

  if (plan.visualPolicyVersion === 'science-static-v1') {
    if (!fs.existsSync(paths.visualPolicy)) errors.push('visual-policy.json fehlt für science-static-v1.');
    if (plan.generatedImageTextPolicy !== 'none') errors.push('Szenenplan muss sichtbaren KI-Text mit "none" verbieten.');
    if (plan.compositionId !== 'ScienceReel') errors.push('Science Static muss die Composition ScienceReel verwenden.');
    if (plan.runtimeFile !== 'science-runtime.json') errors.push('Science Static muss die getrennte Runtime science-runtime.json verwenden.');
    if (plan.scenes.some((scene) => scene.renderMode !== 'image-only')) errors.push('Science Static erlaubt nur image-only-Szenen.');
    if (plan.scenes.some((scene) => scene.motionLevel !== 'none')) errors.push('Science Static erlaubt keine Szenenbewegung.');
    if (plan.scenes.some((scene) => scene.visualRecipe?.motion !== 'none')) errors.push('Science Static erlaubt keine Motion-Anforderung im Visual-Rezept.');

    const manifest = read(paths.promptManifest) ? JSON.parse(read(paths.promptManifest)) : null;
    if (!manifest) errors.push('Prompt-Manifest fehlt.');
    else {
      if (manifest.generatedImageTextPolicy !== 'none') errors.push('Prompt-Manifest muss generierte Bildtexte verbieten.');
      if (manifest.visualPolicyVersion !== 'science-static-v1') errors.push('Prompt-Manifest verwendet nicht science-static-v1.');
      if (manifest.requiredVisibleSceneImages !== plan.scenes.length) errors.push('Prompt-Manifest muss für jede Szene ein sichtbares Bild verlangen.');
      if (manifest.cover?.sourceSceneId !== plan.scenes[0]?.id) errors.push('Cover muss aus Bild 01 / Szene 01 stammen.');
      if (manifest.cover?.candidateCount !== 3) errors.push('Für Bild 01 müssen drei Cover-Kandidaten vorgesehen sein.');
      if (manifest.cover?.separateThumbnailForbidden !== true) errors.push('Separates Thumbnail-System muss verboten sein.');
    }
  }
}

const report = {
  version: 'science-v1',
  generatedAt: new Date().toISOString(),
  passed: errors.length === 0,
  errors,
  warnings,
};
fs.writeFileSync(paths.contentReport, `${JSON.stringify(report, null, 2)}\n`);

if (errors.length) {
  console.error('Science-Inhaltspaket unvollständig:');
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}
console.log('✓ Science-Inhaltspaket vollständig.');
warnings.forEach((warning) => console.warn(`⚠ ${warning}`));
