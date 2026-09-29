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
const scienceStatic = plan.visualPolicyVersion === 'science-static-v1';
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

  if (scienceStatic) {
    if (scene.renderMode !== 'image-only') errors.push(`${scene.id}: Science Static erlaubt nur image-only.`);
    if (scene.motionLevel !== 'none') errors.push(`${scene.id}: Science Static erlaubt keine Bewegung.`);
    if (scene.visualRecipe?.motion && scene.visualRecipe.motion !== 'none') errors.push(`${scene.id}: Visual-Rezept verlangt Bewegung.`);
    if (scene.mechanism) errors.push(`${scene.id}: Mechanismus-Animation ist in Science Static nicht erlaubt.`);
    if (annotations.length && !scene.overlayJustification) {
      errors.push(`${scene.id}: statische Textmarkierungen brauchen eine fachliche overlayJustification.`);
    }
    if (annotations.length > 2) errors.push(`${scene.id}: maximal zwei gezielte statische Markierungen erlaubt.`);
  } else if (annotations.length > 3) {
    errors.push(`${scene.id}: maximal drei Legacy-Callouts erlaubt.`);
  }

  const forbiddenSceneTexts = [scene.title, scene.headline, scene.imageLabel, plan.coverText]
    .map(normalize)
    .filter(Boolean);

  for (const annotation of annotations) {
    const text = normalize(annotation.text);
    if (wordCount(annotation.text) > 5) errors.push(`${scene.id}: Markierung zu lang: „${annotation.text}“`);
    if (/[?!.]$/.test(String(annotation.text).trim())) errors.push(`${scene.id}: Markierung darf kein vollständiger Satz sein: „${annotation.text}“`);
    if (forbiddenSceneTexts.includes(text)) errors.push(`${scene.id}: Überschrift wurde unnötig als Bildmarkierung wiederholt: „${annotation.text}“`);
  }

  if (scienceStatic && annotations.length === 0) {
    warnings.push(`${scene.id}: keine Markierungen – bevorzugter Standard, wenn das Bild allein verständlich ist.`);
  }
}

const report = {
  version: scienceStatic ? 'science-static-v1-callouts' : 'legacy-callouts',
  generatedAt: new Date().toISOString(),
  passed: errors.length === 0,
  rule: scienceStatic
    ? 'Das KI-Bild bleibt textfrei. Remotion darf nur kurze, statische und fachlich begründete Markierungen ergänzen; Animation bleibt verboten.'
    : 'Legacy-Regeln für historische Elektro-Reels.',
  errors,
  warnings,
};
fs.writeFileSync(path.join(paths.projectDir, 'callout-qa-report.json'), `${JSON.stringify(report, null, 2)}\n`);

if (errors.length) {
  console.error('Callout-QA fehlgeschlagen:');
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log('✓ Science-Static-Callout-QA bestanden.');
warnings.forEach((warning) => console.log(`Hinweis: ${warning}`));
