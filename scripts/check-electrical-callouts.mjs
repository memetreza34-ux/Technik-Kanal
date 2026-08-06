#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {ScenePlan} from './lib/electrical-contracts.mjs';
import {electricalProjectPaths} from './lib/electrical-project-structure.mjs';

const [projectArg] = process.argv.slice(2).filter((arg) => !arg.startsWith('--'));
if (!projectArg) {
  console.error('Nutzung: node scripts/check-electrical-callouts.mjs <reel-ordner>');
  process.exit(1);
}

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
const genericHeadlinePatterns = [
  /was macht/,
  /warum /,
  /so funktioniert/,
  /das musst du wissen/,
  /wichtig:/,
  /merke:/,
  /einfach erklärt/,
];

for (const scene of plan.scenes) {
  const annotations = scene.imageAnnotations ?? [];
  if (scene.renderMode === 'mechanism-only' && annotations.length > 0) {
    errors.push(`${scene.id}: mechanism-only darf keine eingebrannten Bild-Callouts enthalten.`);
  }
  if (annotations.length > 3) errors.push(`${scene.id}: ${annotations.length} Callouts; maximal 3 erlaubt.`);

  const forbiddenSceneTexts = [scene.title, scene.headline, scene.imageLabel, plan.coverText]
    .map(normalize)
    .filter(Boolean);

  for (const annotation of annotations) {
    const text = normalize(annotation.text);
    if (wordCount(annotation.text) > 5) errors.push(`${scene.id}: Callout zu lang: „${annotation.text}“`);
    if (/[?!.]$/.test(String(annotation.text).trim())) errors.push(`${scene.id}: Callout darf kein vollständiger Satz sein: „${annotation.text}“`);
    if (forbiddenSceneTexts.includes(text)) errors.push(`${scene.id}: Szenenüberschrift wurde als Bild-Callout verwendet: „${annotation.text}“`);
    if (genericHeadlinePatterns.some((pattern) => pattern.test(text))) errors.push(`${scene.id}: allgemeine Überschrift statt technischer Markierung: „${annotation.text}“`);
  }

  if (scene.renderMode !== 'mechanism-only' && annotations.length === 0) {
    warnings.push(`${scene.id}: keine Callouts. Das ist erlaubt, wenn das Bild ohne Markierung eindeutig ist.`);
  }
}

const report = {
  version: 'visual-v6-callouts',
  generatedAt: new Date().toISOString(),
  passed: errors.length === 0,
  rule: 'Cover-Hook und Szenenüberschriften kommen aus Remotion. Im Bild sind nur kurze technische Callouts mit konkretem Ziel erlaubt.',
  errors,
  warnings,
};
fs.writeFileSync(path.join(paths.projectDir, 'callout-qa-report.json'), `${JSON.stringify(report, null, 2)}\n`);

if (errors.length) {
  console.error('Callout-QA fehlgeschlagen:');
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log('✓ Callout-QA bestanden: keine Cover- oder Szenenüberschriften in Bildern.');
warnings.forEach((warning) => console.log(`Hinweis: ${warning}`));
