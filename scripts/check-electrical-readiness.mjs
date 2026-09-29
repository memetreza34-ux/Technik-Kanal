#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {ScenePlan, ProductionStatus} from './lib/electrical-contracts.mjs';
import {electricalProjectPaths, assertElectricalProjectStructure} from './lib/electrical-project-structure.mjs';
import {loadElectricalConfig} from './lib/load-electrical-config.mjs';
import {findVoiceFiles} from './lib/electrical-project.mjs';

const [projectArg] = process.argv.slice(2).filter((arg) => !arg.startsWith('--'));
if (!projectArg) {
  console.error('Nutzung: npm run science:ready -- <reel-ordner>');
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
if (!fs.existsSync(paths.wordTimestamps)) warnings.push('Wort-Zeitstempel fehlen noch und werden bei science:finish lokal erzeugt.');
if (!fs.existsSync(paths.captionsFinal)) warnings.push('Finale Caption-JSON fehlt noch und wird aus der finalen Voice erzeugt.');

if (plan) {
  if (plan.visualPolicyVersion !== config.visuals.policyVersion) errors.push(`Aktiver Szenenplan muss ${config.visuals.policyVersion} verwenden.`);
  if (plan.compositionId !== 'ScienceReel') errors.push('Aktive Science-Produktion muss ScienceReel verwenden.');
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
    if (scene.renderMode !== 'image-only') errors.push(`${scene.id}: nur image-only ist in Science Static erlaubt.`);
    if (scene.motionLevel !== 'none' || scene.visualRecipe?.motion !== 'none') errors.push(`${scene.id}: Bewegung ist in Science Static verboten.`);
    if (scene.mechanism) errors.push(`${scene.id}: Mechanismus-Animation ist in Science Static verboten.`);
  }
}

const requiredReports = [
  'script-qa-report.json',
  'creative-qa-report.json',
  'content-package-report.json',
  'preproduction-report.json',
  'required-media-report.json',
  'image-appearance-report.json',
];
for (const name of requiredReports) {
  const file = path.join(paths.projectDir, name);
  if (!fs.existsSync(file)) {
    errors.push(`${name} fehlt. Zuerst science:ready ausführen.`);
    continue;
  }
  const report = readJson(file);
  if (report.passed === false) errors.push(`${name} meldet Fehler.`);
}

const socialReport = path.join(paths.projectDir, 'social-caption-report.json');
if (fs.existsSync(socialReport) && readJson(socialReport).passed === false) errors.push('social-caption-report.json meldet Fehler.');

const ready = errors.length === 0;
const report = {
  version: 'science-v1',
  visualPolicyVersion: config.visuals.policyVersion,
  generatedAt: new Date().toISOString(),
  ready,
  phase: ready ? 'ready-for-prepare-and-render' : 'blocked',
  errors,
  warnings,
  nextCommand: ready ? `npm run science:finish -- "${root}"` : null,
};
fs.writeFileSync(paths.readyReport, `${JSON.stringify(report, null, 2)}\n`);

if (!ready) {
  console.error('Science-Readiness-Gate fehlgeschlagen:');
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}
console.log('✓ Science-Reel ist für Prepare, Whisper-Alignment und Render bereit.');
warnings.forEach((warning) => console.warn(`⚠ ${warning}`));
