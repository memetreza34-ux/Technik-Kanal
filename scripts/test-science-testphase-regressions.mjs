#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const read = (relative) => fs.readFileSync(path.join(root, relative), 'utf8');
const json = (relative) => JSON.parse(read(relative));
const errors = [];

const pkg = json('package.json');
const config = json('channels/science/engine/config/science-v1.json');
const visibleLock = read('scripts/science-visible-text-lock.mjs');
const safeFlowBuilder = read('scripts/build-google-flow-master-prompt-safe.mjs');
const projectStructure = read('scripts/lib/electrical-project-structure.mjs');
const flowWorkflow = read('channels/science/gehirn/FLOW-WORKFLOW.md');
const imageWorld = read('channels/science/gehirn/BILDWELT.md');

if (pkg.scripts?.['science:flow-master'] !== 'node scripts/build-google-flow-master-prompt-safe.mjs') {
  errors.push('science:flow-master muss immer den Safe-Builder mit Visible-Text-Lock verwenden.');
}

for (const required of [
  'SCENE METADATA IS NEVER IMAGE CONTENT',
  'Never render scene numbers',
  'Never carry a thumbnail headline into a normal scene',
  'If a scene prompt requests no visible text, the image must contain zero text',
  'REJECT that image and regenerate it before continuing',
]) {
  if (!visibleLock.includes(required)) errors.push(`Visible-Text-Lock fehlt: ${required}`);
}

// Beispielwörter wie „10-MECHANISM“ im Lock haben das Bildmodell eher angestoßen als abgehalten
// (Stahlschiff-Video: „27 — MECHANISM“, „36 • DEEPENING“). Sie dürfen nicht zurückkommen;
// stattdessen prüft das OCR-Text-Gate die fertigen Bilder.
for (const forbiddenExample of ['Szene 10', 'Scene 10', 'Beat 10', '10-MECHANISM', 'Bildschritt 3', '01-hook-final']) {
  if (visibleLock.includes(forbiddenExample)) errors.push(`Metadaten-Beispielwort im Lock lädt zum Abschreiben ein: ${forbiddenExample}`);
}
const imageTextGate = read('scripts/science-image-text-qa.mjs');
if (!imageTextGate.includes('ocrImageWords') || !imageTextGate.includes('analyzeSceneText')) errors.push('OCR-Text-Gate prüft die finalen Szenenbilder nicht.');
if (!read('scripts/science-readiness.mjs').includes('science-image-text-qa.mjs')) errors.push('science:ready führt das OCR-Text-Gate nicht aus.');
if (!read('scripts/render_science_reel.mjs').includes('science-image-text-qa.mjs')) errors.push('science:render führt das OCR-Text-Gate nicht aus.');

if (!safeFlowBuilder.includes('enforceScenePromptLocks')) errors.push('Safe-Builder schützt Einzelprompts nicht.');
if (!safeFlowBuilder.includes('enforceMasterVisibleTextLock')) errors.push('Safe-Builder schützt Masterprompt nicht.');

if (projectStructure.includes("'03-caption'")) errors.push('03-caption darf nicht wieder als Produktionsordner eingeführt werden.');
if (!projectStructure.includes("captionsDir: path.join(root, '06-projektdateien')")) errors.push('Caption-/Timing-Dateien liegen intern in 06-projektdateien (seit dem flachen YouTube-Export).');

const budget = config.visuals?.informationBudget;
if (budget?.normalScenePreferredLabelsMax !== 1 || budget?.normalSceneHardLabelsMax !== 2) errors.push('Density-Lock für normale Labels wurde gelockert.');
if (budget?.normalScenePrimaryObjectsMax !== 3) errors.push('Normale Szene darf höchstens 3 wichtige visuelle Elemente planen.');
if (budget?.largeSceneHeadlineAllowed !== false || budget?.fullSentenceTextAllowed !== false) errors.push('Große Szenenüberschrift/Textsatz darf nicht wieder erlaubt werden.');
if (budget?.splitBeatWhenBudgetExceeded !== true) errors.push('Zu dichte Beats müssen weiterhin geteilt werden.');

const diversity = config.visuals?.diversity;
if (diversity?.sameCompositionMaxConsecutive !== 1) errors.push('Direkt wiederholte Hauptkomposition muss verboten bleiben.');
if (diversity?.minimumDistinctVisualTypesPerVideo < 5) errors.push('Visuelle Vielfalt wurde unter 5 Darstellungsformen abgesenkt.');
if (diversity?.thumbnailReferenceScope !== 'quality-and-illustration-style-only-not-layout-or-palette') errors.push('Thumbnail darf nicht wieder Layout-/Paletten-Schablone werden.');

if (!/keine eingebrannten Untertitel/i.test(flowWorkflow)) errors.push('Flow-Workflow muss eingebrannte Untertitel verbieten.');
if (!/visuelle Vielfalt/i.test(flowWorkflow)) errors.push('Flow-Workflow muss visuelle Vielfalt verlangen.');
if (!/so wenig Information wie möglich, so viel wie nötig/i.test(imageWorld)) errors.push('Bildwelt-Leitregel zur Informationsdichte fehlt.');

if (errors.length) {
  throw new Error(`Testphasen-Regression fehlgeschlagen:\n- ${errors.join('\n- ')}`);
}

console.log('✓ Testphasen-Regressionsschutz aktiv: Metadaten/Text-Leaks, Überladung, Wiederholung, Caption-Ordner und unsicherer Flow-Builder bleiben blockiert.');
