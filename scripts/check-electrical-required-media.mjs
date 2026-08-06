#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {ScenePlan} from './lib/electrical-contracts.mjs';
import {electricalProjectPaths} from './lib/electrical-project-structure.mjs';
import {findMedia, findVoiceFiles, imageExtensions, audioExtensions, imageMetadata} from './lib/electrical-project.mjs';
import {loadElectricalConfig} from './lib/load-electrical-config.mjs';

const [projectArg] = process.argv.slice(2).filter((arg) => !arg.startsWith('--'));
if (!projectArg) {
  console.error('Nutzung: node scripts/check-electrical-required-media.mjs <reel-ordner>');
  process.exit(1);
}

const root = path.resolve(projectArg);
const paths = electricalProjectPaths(root);
const config = loadElectricalConfig();
const errors = [];
const warnings = [];
const plan = ScenePlan.parse(JSON.parse(fs.readFileSync(paths.scenePlan, 'utf8')));
const voice = findVoiceFiles(paths.audioDir);

if (!voice.raw && !voice.final) errors.push(`Keine Roh- oder Finalaufnahme in ${paths.audioDir}.`);

const requiredImageScenes = plan.scenes.filter((scene) => scene.renderMode !== 'mechanism-only');
const mechanismOnlyScenes = plan.scenes.filter((scene) => scene.renderMode === 'mechanism-only');
const seen = new Map();
const validateImage = (file, label) => {
  const metadata = imageMetadata(file);
  if (metadata.width < config.imageAnalysis.minimumWidth || metadata.height < config.imageAnalysis.minimumHeight) {
    errors.push(`${label}: Bild zu klein (${metadata.width}×${metadata.height}).`);
  }
  const aspect = metadata.width / metadata.height;
  if (aspect < config.imageAnalysis.portraitAspectMin || aspect > config.imageAnalysis.portraitAspectMax) {
    errors.push(`${label}: Seitenverhältnis ${aspect.toFixed(3)} liegt außerhalb ${config.imageAnalysis.portraitAspectMin}–${config.imageAnalysis.portraitAspectMax}.`);
  }
  const digest = createHash('sha256').update(fs.readFileSync(file)).digest('hex');
  if (seen.has(digest)) errors.push(`Doppeltes Bild in ${label} und ${seen.get(digest)}.`);
  seen.set(digest, label);
};

for (const scene of requiredImageScenes) {
  const dir = path.resolve(root, scene.imageDir);
  const images = findMedia(dir, imageExtensions).filter((file) => !path.basename(file).startsWith('.generated-'));
  if (!images.length) {
    errors.push(`Szenenbild fehlt: ${scene.id} (${scene.imageDir})`);
    continue;
  }
  const final = images.find((file) => /(?:final|approved|freigabe)/i.test(path.basename(file))) ?? images[0];
  validateImage(final, scene.id);
  if (images.length > 1 && !images.some((file) => /(?:final|approved|freigabe)/i.test(path.basename(file)))) {
    warnings.push(`${scene.id}: mehrere Bilder, aber keines als final/freigabe markiert.`);
  }
}

const coverDir = path.join(paths.imageDir, '00-cover');
const coverImages = findMedia(coverDir, imageExtensions).filter((file) => !path.basename(file).startsWith('.generated-'));
if (!coverImages.length) {
  errors.push('Coverbild fehlt: 02-bilder/images/00-cover');
} else {
  const cover = coverImages.find((file) => /(?:final|approved|freigabe)/i.test(path.basename(file))) ?? coverImages[0];
  validateImage(cover, 'Cover');
}

const invalidSfx = findMedia(paths.sfxDir, new Set([...audioExtensions])).filter((file) => fs.statSync(file).size === 0);
invalidSfx.forEach((file) => warnings.push(`Leere SFX-Datei: ${file}`));

const report = {
  version: 'electrical-v2',
  generatedAt: new Date().toISOString(),
  passed: errors.length === 0,
  requiredSceneImages: requiredImageScenes.length,
  mechanismOnlyScenes: mechanismOnlyScenes.map((scene) => scene.id),
  coverRequired: true,
  errors,
  warnings,
};
fs.writeFileSync(path.join(paths.projectDir, 'required-media-report.json'), `${JSON.stringify(report, null, 2)}\n`);

if (errors.length) {
  console.error('Pflichtmedien nicht bereit:');
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}
console.log(`✓ Pflichtmedien vollständig: ${requiredImageScenes.length} sichtbare Szenenbilder, ${mechanismOnlyScenes.length} interne Mechanismus-Szenen, ein Cover und Voice-over.`);
warnings.forEach((warning) => console.warn(`⚠ ${warning}`));
