#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
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

const seen = new Map();
for (const scene of plan.scenes) {
  const dir = path.resolve(root, scene.imageDir);
  const images = findMedia(dir, imageExtensions);
  if (!images.length) {
    errors.push(`Szenenbild fehlt: ${scene.id} (${scene.imageDir})`);
    continue;
  }
  const final = images.find((file) => /(?:final|approved|freigabe)/i.test(path.basename(file))) ?? images[0];
  const metadata = imageMetadata(final);
  if (metadata.width < config.imageAnalysis.minimumWidth || metadata.height < config.imageAnalysis.minimumHeight) {
    errors.push(`${scene.id}: Bild zu klein (${metadata.width}×${metadata.height}).`);
  }
  const aspect = metadata.width / metadata.height;
  if (aspect < config.imageAnalysis.portraitAspectMin || aspect > config.imageAnalysis.portraitAspectMax) {
    errors.push(`${scene.id}: Seitenverhältnis ${aspect.toFixed(3)} liegt außerhalb ${config.imageAnalysis.portraitAspectMin}–${config.imageAnalysis.portraitAspectMax}.`);
  }
  const bytes = fs.readFileSync(final);
  const digest = Buffer.from(bytes).toString('base64').slice(0, 96);
  if (seen.has(digest)) errors.push(`Doppeltes Bild in ${scene.id} und ${seen.get(digest)}.`);
  seen.set(digest, scene.id);
  if (images.length > 1 && !images.some((file) => /(?:final|approved|freigabe)/i.test(path.basename(file)))) {
    warnings.push(`${scene.id}: mehrere Bilder, aber keines als final/freigabe markiert.`);
  }
}

const invalidSfx = findMedia(paths.sfxDir, new Set([...audioExtensions])).filter((file) => fs.statSync(file).size === 0);
invalidSfx.forEach((file) => warnings.push(`Leere SFX-Datei: ${file}`));

const report = {version: 'electrical-v1', generatedAt: new Date().toISOString(), passed: errors.length === 0, errors, warnings};
fs.writeFileSync(path.join(paths.projectDir, 'required-media-report.json'), `${JSON.stringify(report, null, 2)}\n`);

if (errors.length) {
  console.error('Pflichtmedien nicht bereit:');
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}
console.log(`✓ Pflichtmedien vollständig: ${plan.scenes.length} Szenenbilder und Voice-over vorhanden.`);
warnings.forEach((warning) => console.warn(`⚠ ${warning}`));
