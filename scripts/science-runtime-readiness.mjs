#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {ScenePlan, ProductionStatus} from './lib/electrical-contracts.mjs';
import {electricalProjectPaths, assertElectricalProjectStructure} from './lib/electrical-project-structure.mjs';
import {loadElectricalConfig} from './lib/load-electrical-config.mjs';
import {findVoiceFiles} from './lib/electrical-project.mjs';

const [projectArg] = process.argv.slice(2).filter((arg) => !arg.startsWith('--'));
if (!projectArg) {
  console.error('Nutzung: node scripts/science-runtime-readiness.mjs <video-ordner>');
  process.exit(1);
}

const root = path.resolve(projectArg);
assertElectricalProjectStructure(root);
const paths = electricalProjectPaths(root);
const config = loadElectricalConfig();
const errors = [];
const warnings = [];
const readJson = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));

let plan;
try { plan = ScenePlan.parse(readJson(paths.scenePlan)); }
catch (error) { errors.push(`Szenenplan ungültig: ${error.message}`); }
try { ProductionStatus.parse(readJson(paths.status)); }
catch (error) { errors.push(`Produktionsstatus ungültig: ${error.message}`); }

let flowPlan;
if (!fs.existsSync(paths.flowPlan)) errors.push('flow-plan.json fehlt.');
else {
  try { flowPlan = readJson(paths.flowPlan); }
  catch (error) { errors.push(`flow-plan.json ungültig: ${error.message}`); }
}
if (!fs.existsSync(paths.flowMaster)) errors.push('GOOGLE-FLOW-MASTER-PROMPT.txt fehlt.');

const voices = findVoiceFiles(paths.audioDir);
if (!voices.raw && !voices.final) errors.push('Voice-over fehlt.');
if (!fs.existsSync(paths.wordTimestamps)) warnings.push('Wort-Zeitstempel fehlen noch und werden bei science:finish lokal erzeugt.');
if (!fs.existsSync(paths.captionsFinal)) warnings.push('Finale Caption-JSON fehlt noch.');

if (plan) {
  if (plan.productionProfile !== config.productionProfile) errors.push(`Produktionsprofil muss ${config.productionProfile} sein.`);
  if (plan.width !== config.format.width || plan.height !== config.format.height || plan.fps !== config.format.fps) errors.push(`Format im Szenenplan muss ${config.format.width}×${config.format.height} bei ${config.format.fps} FPS sein.`);
  if (plan.visualPolicyVersion !== 'science-static-v1') errors.push('Remotion-Static-Policy muss science-static-v1 sein.');
  if (plan.compositionId !== 'ScienceReel') errors.push('Kompatibilitäts-Composition muss ScienceReel sein.');
  if (plan.runtimeFile !== 'science-runtime.json') errors.push('Runtime muss science-runtime.json sein.');
  if (plan.scenes.length < config.visuals.beats.min || plan.scenes.length > config.visuals.beats.max) errors.push(`Szenenzahl ${plan.scenes.length} liegt außerhalb ${config.visuals.beats.min}–${config.visuals.beats.max}.`);
  if (plan.scenes[0]?.section !== 'hook') errors.push('Erster visueller Beat muss Hook sein.');
  if (plan.scenes.at(-1)?.section !== 'payoff') errors.push('Letzter visueller Beat muss Payoff sein.');
  const ids = new Set();
  for (const scene of plan.scenes) {
    if (ids.has(scene.id)) errors.push(`Doppelte Szenen-ID: ${scene.id}`);
    ids.add(scene.id);
    if (!scene.voiceText.trim()) errors.push(`Leerer Sprechtext in ${scene.id}.`);
    if (!scene.imageDir.trim()) errors.push(`imageDir fehlt in ${scene.id}.`);
    if (!scene.section) errors.push(`Dramaturgie-Abschnitt fehlt in ${scene.id}.`);
    if (scene.renderMode !== 'image-only') errors.push(`${scene.id}: Scene-Plan-Basis muss image-only bleiben; Flow-Clips werden separat eingebunden.`);
    if (scene.motionLevel !== 'none') errors.push(`${scene.id}: Remotion motionLevel muss none sein.`);
  }
}

if (plan && flowPlan) {
  const entries = Array.isArray(flowPlan.scenes) ? flowPlan.scenes : [];
  if (entries.length !== plan.scenes.length) errors.push(`flow-plan.json muss ${plan.scenes.length} Beats enthalten.`);
  const byId = new Map(entries.map((entry)=>[entry.id,entry]));
  let videoCount = 0;
  for (const scene of plan.scenes) {
    const entry = byId.get(scene.id);
    if (!entry) { errors.push(`${scene.id}: Flow-Plan-Eintrag fehlt.`); continue; }
    if (!['image','image-to-video'].includes(entry.output)) errors.push(`${scene.id}: Flow-output ist nicht final.`);
    if (entry.output === 'image-to-video') {
      videoCount += 1;
      if (!String(entry.motionPrompt ?? '').trim()) errors.push(`${scene.id}: motionPrompt fehlt.`);
      if (!(Number(entry.clipSeconds) > 0 && Number(entry.clipSeconds) <= config.visuals.flow.clipSecondsMax)) errors.push(`${scene.id}: clipSeconds muss 1–${config.visuals.flow.clipSecondsMax} sein.`);
    }
  }
  if (videoCount === 0) errors.push('Kein Google-Flow-KI-Clip geplant.');
}

for (const name of ['script-qa-report.json','creative-qa-report.json','content-package-report.json','preproduction-report.json','required-media-report.json','image-appearance-report.json']) {
  const file = path.join(paths.projectDir, name);
  if (!fs.existsSync(file)) { errors.push(`${name} fehlt.`); continue; }
  const report = readJson(file);
  if (report.passed === false) errors.push(`${name} meldet Fehler.`);
}

const ready = errors.length === 0;
const report = {version:'science-v1',productionProfile:config.productionProfile,productionMode:config.visuals.productionMode,generatedAt:new Date().toISOString(),ready,phase:ready?'ready-for-prepare-and-render':'blocked',errors,warnings,nextCommand:ready?`npm run science:finish -- "${root}"`:null};
fs.writeFileSync(paths.readyReport, `${JSON.stringify(report, null, 2)}\n`);
if (!ready) {
  console.error('Science-Readiness-Gate fehlgeschlagen:');
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}
console.log('✓ YouTube-Science-Video ist mit Ausgangsbildern und geplanten Flow-Clips für Prepare und Render bereit.');
warnings.forEach((warning) => console.warn(`⚠ ${warning}`));
