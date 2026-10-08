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
const config = loadElectricalConfig(JSON.parse(fs.readFileSync(paths.scenePlan, 'utf8')).productionProfile);
const errors = [];
const warnings = [];
const readJson = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));

let plan;
try { plan = ScenePlan.parse(readJson(paths.scenePlan)); }
catch (error) { errors.push(`Szenenplan ungültig: ${error.message}`); }
try { ProductionStatus.parse(readJson(paths.status)); }
catch (error) { errors.push(`Produktionsstatus ungültig: ${error.message}`); }

const voices = findVoiceFiles(paths.audioDir);
if (!voices.raw && !voices.final) errors.push('Voice-over fehlt.');
if (!fs.existsSync(paths.wordTimestamps)) warnings.push('Wort-Zeitstempel fehlen noch und werden bei science:finish lokal erzeugt.');
if (!fs.existsSync(paths.captionsFinal)) warnings.push('Finale Caption-JSON fehlt noch.');

if (plan) {
  if (plan.productionProfile !== config.productionProfile) errors.push(`Produktionsprofil muss ${config.productionProfile} sein.`);
  if (plan.width !== config.format.width || plan.height !== config.format.height || plan.fps !== config.format.fps) errors.push(`Format im Szenenplan muss ${config.format.width}×${config.format.height} bei ${config.format.fps} FPS sein.`);
  if (plan.visualPolicyVersion !== 'science-static-v1') errors.push('Visual-Policy muss science-static-v1 sein.');
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
    if (scene.renderMode !== 'image-only') errors.push(`${scene.id}: nur image-only ist erlaubt.`);
    if (scene.motionLevel !== 'none') errors.push(`${scene.id}: motionLevel muss none sein.`);
  }
}

for (const name of ['script-qa-report.json','creative-qa-report.json','content-package-report.json','preproduction-report.json','required-media-report.json','image-appearance-report.json']) {
  const file = path.join(paths.projectDir, name);
  if (!fs.existsSync(file)) { errors.push(`${name} fehlt.`); continue; }
  const report = readJson(file);
  if (report.passed === false) errors.push(`${name} meldet Fehler.`);
}

const ready = errors.length === 0;
const report = {version:'science-v1',productionProfile:config.productionProfile,generatedAt:new Date().toISOString(),ready,phase:ready?'ready-for-prepare-and-render':'blocked',errors,warnings,nextCommand:ready?`npm run science:finish -- "${root}"`:null};
fs.writeFileSync(paths.readyReport, `${JSON.stringify(report, null, 2)}\n`);
if (!ready) {
  console.error('Science-Readiness-Gate fehlgeschlagen:');
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}
console.log('✓ YouTube-Science-Video ist für Prepare und Render bereit.');
warnings.forEach((warning) => console.warn(`⚠ ${warning}`));
