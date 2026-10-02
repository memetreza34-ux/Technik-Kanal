#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {ScenePlan} from './lib/electrical-contracts.mjs';
import {electricalProjectPaths} from './lib/electrical-project-structure.mjs';

const [projectArg] = process.argv.slice(2).filter((arg) => !arg.startsWith('--'));
if (!projectArg) {
  console.error('Nutzung: npm run science:preflight -- <video-ordner>');
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
  ['Google-Flow-Masterprompt', paths.flowMaster],
  ['Flow-Plan', paths.flowPlan],
  ['YouTube-Beschreibung / Caption', paths.socialCaption],
  ['Lernzettel', paths.learningSheet],
  ['Quellen', paths.sources],
  ['Storyboard', paths.storyboard],
  ['Montagevertrag', paths.motionDesign],
]) {
  if (!read(file)) errors.push(`${label} fehlt oder ist leer: ${file}`);
}

if (/NOCH NICHT FINAL|PLACEHOLDER|ERGÄNZEN/i.test(read(paths.flowMaster))) errors.push('Google-Flow-Masterprompt ist noch nicht final.');

let plan;
try {
  plan = ScenePlan.parse(JSON.parse(read(paths.scenePlan)));
} catch (error) {
  errors.push(`Szenenplan ungültig: ${error.message}`);
}

let flowPlan;
try {
  flowPlan = JSON.parse(read(paths.flowPlan));
} catch (error) {
  errors.push(`Flow-Plan ungültig: ${error.message}`);
}

if (plan) {
  const promptFiles = fs.existsSync(paths.promptDir)
    ? fs.readdirSync(paths.promptDir).filter((name) => name.endsWith('.txt'))
    : [];
  if (promptFiles.length < plan.scenes.length + 1) {
    errors.push(`Zu wenige Einzelprompts: ${promptFiles.length}; erwartet ${plan.scenes.length} Szenen plus einen separaten Thumbnail-Prompt.`);
  }
  if (!promptFiles.includes('00-thumbnail.txt')) errors.push('Separater Thumbnail-Prompt 00-thumbnail.txt fehlt.');

  const sourceText = read(paths.sources).toLowerCase();
  for (const scene of plan.scenes) {
    if (scene.factClaim && (!scene.sourceIds || scene.sourceIds.length === 0)) errors.push(`Szene ${scene.id} enthält eine Faktenaussage ohne sourceIds.`);
    for (const sourceId of scene.sourceIds ?? []) {
      if (!sourceText.includes(sourceId.toLowerCase())) errors.push(`Quellen-ID ${sourceId} aus Szene ${scene.id} fehlt in sources.md.`);
    }
  }

  if (plan.visualPolicyVersion === 'science-static-v1') {
    if (!fs.existsSync(paths.visualPolicy)) errors.push('visual-policy.json fehlt für die Remotion-Static-Grenze.');
    if (plan.generatedImageTextPolicy !== 'controlled-german-only') errors.push('Szenenplan muss kontrollierten deutschen Bildtext erlauben.');
    if (plan.productionProfile !== 'youtube-2min-v1') errors.push('Szenenplan muss youtube-2min-v1 verwenden.');
    if (plan.width !== 1920 || plan.height !== 1080) errors.push('Szenenplan muss 1920×1080 / 16:9 verwenden.');
    if (plan.compositionId !== 'ScienceReel') errors.push('Aktuelle Kompatibilitäts-Composition muss ScienceReel bleiben.');
    if (plan.runtimeFile !== 'science-runtime.json') errors.push('Science Runtime muss science-runtime.json verwenden.');
    if (plan.scenes.some((scene) => scene.renderMode !== 'image-only')) errors.push('Scene-Plan-Basis bleibt image-only; fertige Flow-Clips werden separat über flow-plan.json eingebunden.');
    if (plan.scenes.some((scene) => scene.motionLevel !== 'none')) errors.push('Remotion-Szenenbewegung bleibt deaktiviert.');
    if (plan.scenes.some((scene) => scene.visualRecipe?.motion !== 'none')) errors.push('Visual-Rezept darf keine Remotion-Motion anfordern.');

    const manifest = read(paths.promptManifest) ? JSON.parse(read(paths.promptManifest)) : null;
    if (!manifest) errors.push('Prompt-Manifest fehlt.');
    else {
      if (manifest.generatedImageTextPolicy !== 'controlled-german-only') errors.push('Prompt-Manifest muss controlled-german-only verwenden.');
      if (manifest.visualPolicyVersion !== 'science-static-v1') errors.push('Prompt-Manifest verwendet nicht die Remotion-Static-Policy science-static-v1.');
      if (manifest.requiredVisibleSceneImages !== plan.scenes.length) errors.push('Prompt-Manifest muss für jeden visuellen Beat ein Ausgangsbild verlangen.');
      if (manifest.cover?.imageRequired !== false) errors.push('Bild 01 darf nicht mehr als verpflichtendes Cover/Thumbnail gelten.');
      if (manifest.cover?.separateThumbnailForbidden !== false) errors.push('Separates Thumbnail muss erlaubt sein.');
      if (manifest.thumbnail?.required !== true) errors.push('Thumbnail muss im Manifest verpflichtend sein.');
      if (manifest.thumbnail?.candidateCount !== 3) errors.push('Für das Thumbnail müssen drei Kandidaten vorgesehen sein.');
      if (manifest.thumbnail?.width !== 1280 || manifest.thumbnail?.height !== 720) errors.push('Thumbnail muss 1280×720 geplant sein.');
    }
  }
}

if (plan && flowPlan) {
  const entries = Array.isArray(flowPlan.scenes) ? flowPlan.scenes : [];
  if (entries.length !== plan.scenes.length) errors.push(`Flow-Plan muss ${plan.scenes.length} Beat-Einträge enthalten.`);
  const ids = new Set(plan.scenes.map((scene)=>scene.id));
  let flowVideoCount = 0;
  for (const entry of entries) {
    if (!ids.has(entry.id)) errors.push(`Flow-Plan enthält unbekannte Beat-ID ${entry.id}.`);
    if (!['image','image-to-video'].includes(entry.output)) errors.push(`${entry.id}: output ist noch nicht final.`);
    if (entry.output === 'image-to-video') {
      flowVideoCount += 1;
      if (!String(entry.motionPrompt ?? '').trim()) errors.push(`${entry.id}: motionPrompt fehlt.`);
      if (!(Number(entry.clipSeconds) > 0 && Number(entry.clipSeconds) <= 10)) errors.push(`${entry.id}: clipSeconds muss 1–10 sein.`);
    }
  }
  if (flowVideoCount === 0) errors.push('Flow-Plan enthält keine KI-Video-Beats; die aktive Medienpipeline ist gemischt.');
}

const report = {
  version: 'science-v1',
  productionProfile: plan?.productionProfile ?? null,
  productionMode: 'flow-mixed-assets',
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
console.log('✓ YouTube-Science-Inhaltspaket vollständig: Story, Prompts, Flow-Plan und Google-Flow-Masterprompt sind vorhanden.');
warnings.forEach((warning) => console.warn(`⚠ ${warning}`));
