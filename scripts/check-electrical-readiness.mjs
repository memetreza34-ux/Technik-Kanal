#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {ScenePlan, ProductionStatus} from './lib/electrical-contracts.mjs';
import {electricalProjectPaths, assertElectricalProjectStructure} from './lib/electrical-project-structure.mjs';
import {loadElectricalConfig} from './lib/load-electrical-config.mjs';
import {findVoiceFiles} from './lib/electrical-project.mjs';

const [projectArg] = process.argv.slice(2).filter((arg) => !arg.startsWith('--'));
if (!projectArg) {
  console.error('Nutzung: node scripts/check-electrical-readiness.mjs <reel-ordner>');
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
try {
  plan = ScenePlan.parse(readJson(paths.scenePlan));
} catch (error) {
  errors.push(`Szenenplan ungültig: ${error.message}`);
}

try {
  ProductionStatus.parse(readJson(paths.status));
} catch (error) {
  errors.push(`Produktionsstatus ungültig: ${error.message}`);
}

const voices = findVoiceFiles(paths.audioDir);
if (!voices.raw && !voices.final) errors.push('Voice-over fehlt.');
if (!fs.existsSync(paths.wordTimestamps)) warnings.push('Wort-Zeitstempel fehlen noch und werden bei electrical:finish lokal erzeugt.');
if (!fs.existsSync(paths.captionsFinal)) warnings.push('Finale Caption-JSON fehlt noch.');

for (const file of [paths.contentReport, paths.manifest]) {
  if (!fs.existsSync(file)) warnings.push(`${path.basename(file)} wurde noch nicht erzeugt.`);
}

if (plan) {
  if (plan.width !== config.format.width || plan.height !== config.format.height || plan.fps !== config.format.fps) {
    errors.push(`Format im Szenenplan muss ${config.format.width}×${config.format.height} bei ${config.format.fps} FPS sein.`);
  }
  if (plan.scenes.length < config.visuals.beats.min || plan.scenes.length > config.visuals.beats.max) {
    errors.push(`Szenenzahl ${plan.scenes.length} liegt außerhalb ${config.visuals.beats.min}–${config.visuals.beats.max}.`);
  }
  const ids = new Set();
  for (const scene of plan.scenes) {
    if (ids.has(scene.id)) errors.push(`Doppelte Szenen-ID: ${scene.id}`);
    ids.add(scene.id);
    if (!scene.voiceText.trim()) errors.push(`Leerer Sprechtext in ${scene.id}.`);
    if (!scene.imageDir.trim()) errors.push(`imageDir fehlt in ${scene.id}.`);
  }
}

const reports = [
  'content-package-report.json',
  'required-media-report.json',
  'social-caption-report.json',
].map((name) => path.join(paths.projectDir, name));
for (const file of reports) {
  if (!fs.existsSync(file)) continue;
  const report = readJson(file);
  if (report.passed === false) errors.push(`${path.basename(file)} meldet Fehler.`);
}

const ready = errors.length === 0;
const report = {
  version: 'electrical-v1',
  generatedAt: new Date().toISOString(),
  ready,
  phase: ready ? 'ready-for-prepare-and-render' : 'blocked',
  errors,
  warnings,
  nextCommand: ready ? `npm run electrical:finish -- "${root}"` : null,
};
fs.writeFileSync(paths.readyReport, `${JSON.stringify(report, null, 2)}\n`);

if (!ready) {
  console.error('Readiness-Gate fehlgeschlagen:');
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}
console.log('✓ Reel ist für die automatische Produktionspipeline bereit.');
warnings.forEach((warning) => console.warn(`⚠ ${warning}`));
