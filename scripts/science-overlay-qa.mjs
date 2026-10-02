#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {ScenePlan} from './lib/electrical-contracts.mjs';
import {electricalProjectPaths} from './lib/electrical-project-structure.mjs';

const [projectArg] = process.argv.slice(2).filter((arg) => !arg.startsWith('--'));
if (!projectArg) throw new Error('Nutzung: node scripts/science-overlay-qa.mjs <video-ordner>');

const root = path.resolve(projectArg);
const paths = electricalProjectPaths(root);
const plan = ScenePlan.parse(JSON.parse(fs.readFileSync(paths.scenePlan, 'utf8')));
const errors = [];
const warnings = [];

const normalize = (value) => String(value ?? '')
  .toLocaleLowerCase('de-DE')
  .replace(/[„“"'’]/g, '')
  .replace(/\s+/g, ' ')
  .trim();
const wordCount = (value) => String(value ?? '').trim().split(/\s+/).filter(Boolean).length;

for (const scene of plan.scenes) {
  const annotations = scene.imageAnnotations ?? [];
  if (annotations.length && !scene.overlayJustification) {
    errors.push(`${scene.id}: zusätzliche Remotion-Markierungen brauchen eine fachliche overlayJustification.`);
  }
  if (annotations.length > 4) errors.push(`${scene.id}: maximal vier kurze statische Remotion-Markierungen erlaubt.`);

  const forbiddenSceneTexts = [scene.title, scene.headline]
    .map(normalize)
    .filter(Boolean);

  for (const annotation of annotations) {
    const text = normalize(annotation.text);
    if (wordCount(annotation.text) > 5) errors.push(`${scene.id}: Markierung zu lang: „${annotation.text}“`);
    if (/[?!.]$/.test(String(annotation.text).trim())) warnings.push(`${scene.id}: Overlay ist ein ganzer Satz; prüfen, ob ein kurzes Label besser wäre: „${annotation.text}“`);
    if (forbiddenSceneTexts.includes(text)) errors.push(`${scene.id}: Überschrift wurde unnötig als Overlay wiederholt: „${annotation.text}“`);
  }

  if (!annotations.length) warnings.push(`${scene.id}: keine zusätzlichen Remotion-Overlays – korrekt, wenn der Bildbeat allein verständlich ist.`);
}

const report = {
  version: 'science-static-overlay-v2',
  generatedAt: new Date().toISOString(),
  passed: errors.length === 0,
  rule: 'Scientific Scene Explainer darf kontrollierten deutschen Text bereits im Bild enthalten. Remotion-Overlays sind nur zusätzliche kurze, statische und fachlich begründete Markierungen; Bewegung ist nicht erlaubt.',
  errors,
  warnings,
};
fs.writeFileSync(path.join(paths.projectDir, 'overlay-qa-report.json'), `${JSON.stringify(report, null, 2)}\n`);

if (errors.length) {
  console.error('Science-Overlay-QA fehlgeschlagen:');
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}
console.log('✓ Science-Overlay-QA bestanden.');
warnings.forEach((warning) => console.log(`Hinweis: ${warning}`));
