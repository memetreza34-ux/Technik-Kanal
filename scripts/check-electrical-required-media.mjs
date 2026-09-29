#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {ScenePlan} from './lib/electrical-contracts.mjs';
import {electricalProjectPaths} from './lib/electrical-project-structure.mjs';
import {findMedia, findVoiceFiles, imageExtensions, audioExtensions, imageMetadata} from './lib/electrical-project.mjs';
import {loadElectricalConfig} from './lib/load-electrical-config.mjs';

const [projectArg] = process.argv.slice(2).filter((arg) => !arg.startsWith('--'));
if (!projectArg) throw new Error('Nutzung: npm run science:ready -- <reel-ordner>');
const root = path.resolve(projectArg);
const paths = electricalProjectPaths(root);
const config = loadElectricalConfig();
const errors = [];
const warnings = [];
const plan = ScenePlan.parse(JSON.parse(fs.readFileSync(paths.scenePlan, 'utf8')));
const voice = findVoiceFiles(paths.audioDir);
if (!voice.raw && !voice.final) errors.push(`Keine Roh- oder Finalaufnahme in ${paths.audioDir}.`);

const scienceStatic = plan.visualPolicyVersion === config.visuals.policyVersion;
const imageScenes = plan.scenes.filter((scene) => (scene.renderMode ?? 'image-only') === 'image-only');
const seen = new Map();
const selectedImages = [];
const approvedPattern = /(?:final|approved|freigabe)/i;

const validateImage = (file, label) => {
  const metadata = imageMetadata(file);
  if (metadata.width < config.imageAnalysis.minimumWidth || metadata.height < config.imageAnalysis.minimumHeight) errors.push(`${label}: Bild zu klein (${metadata.width}×${metadata.height}).`);
  const aspect = metadata.width / metadata.height;
  if (aspect < config.imageAnalysis.portraitAspectMin || aspect > config.imageAnalysis.portraitAspectMax) errors.push(`${label}: Seitenverhältnis ${aspect.toFixed(3)} ist nicht reel-tauglich.`);
  const digest = createHash('sha256').update(fs.readFileSync(file)).digest('hex');
  if (seen.has(digest)) errors.push(`Doppeltes Bild in ${label} und ${seen.get(digest)}.`);
  seen.set(digest, label);
};

for (const scene of imageScenes) {
  const dir = path.resolve(root, scene.imageDir);
  const images = findMedia(dir, imageExtensions).filter((file) => !path.basename(file).startsWith('.generated-'));
  if (!images.length) {
    errors.push(`Szenenbild fehlt: ${scene.id} (${scene.imageDir})`);
    continue;
  }

  const approved = images.filter((file) => approvedPattern.test(path.basename(file)));
  let selected;
  if (images.length === 1) {
    selected = images[0];
  } else if (approved.length === 1) {
    selected = approved[0];
  } else if (approved.length === 0) {
    errors.push(`${scene.id}: ${images.length} Bildkandidaten vorhanden, aber keiner ist als final/approved/freigabe markiert.`);
    continue;
  } else {
    errors.push(`${scene.id}: ${approved.length} Bilder sind als final/approved/freigabe markiert; genau eines ist erlaubt.`);
    continue;
  }

  validateImage(selected, scene.id);
  selectedImages.push({sceneId: scene.id, file: path.relative(root, selected).split(path.sep).join('/'), candidateCount: images.length});
}

if (scienceStatic) {
  if (imageScenes.length !== plan.scenes.length) errors.push('Science Static benötigt für jede Szene genau ein sichtbares Szenenbild.');
  if (plan.scenes[0] && !imageScenes.some((scene) => scene.id === plan.scenes[0].id)) errors.push('Bild 01 muss die erste Szene und gleichzeitig die Cover-Quelle sein.');
  if (selectedImages.length !== plan.scenes.length && errors.length === 0) errors.push('Nicht für jede Science-Szene wurde genau ein finales Bild ausgewählt.');
} else {
  warnings.push(`Legacy-Projekt ${plan.visualPolicyVersion ?? 'unbekannt'}: Science-Static-Pflichtmedienregeln werden nicht vollständig angewendet.`);
}

const invalidSfx = findMedia(paths.sfxDir, new Set([...audioExtensions])).filter((file) => fs.statSync(file).size === 0);
invalidSfx.forEach((file) => warnings.push(`Leere SFX-Datei: ${file}`));

const report = {
  version:'science-static-v1',
  generatedAt:new Date().toISOString(),
  passed:errors.length===0,
  productionMode:scienceStatic?'science-static':'legacy',
  requiredSceneImages:imageScenes.length,
  selectedImages,
  separateCoverRequired:false,
  coverSourceScene:plan.scenes[0]?.id ?? null,
  errors,
  warnings
};
fs.writeFileSync(path.join(paths.projectDir, 'required-media-report.json'), `${JSON.stringify(report, null, 2)}\n`);

if (errors.length) {
  console.error('Pflichtmedien nicht bereit:');
  errors.forEach((error)=>console.error(`- ${error}`));
  process.exit(1);
}
console.log(`✓ Pflichtmedien vollständig: Voice-over + ${selectedImages.length} eindeutig ausgewählte statische Szenenbilder; Bild 01 ist Cover-Quelle.`);
warnings.forEach((warning)=>console.warn(`⚠ ${warning}`));
