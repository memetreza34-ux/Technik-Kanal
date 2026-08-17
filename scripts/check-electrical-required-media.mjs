#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {ScenePlan} from './lib/electrical-contracts.mjs';
import {electricalProjectPaths} from './lib/electrical-project-structure.mjs';
import {findMedia, findVoiceFiles, imageExtensions, audioExtensions, imageMetadata} from './lib/electrical-project.mjs';
import {loadElectricalConfig} from './lib/load-electrical-config.mjs';

const [projectArg] = process.argv.slice(2).filter((arg) => !arg.startsWith('--'));
if (!projectArg) throw new Error('Nutzung: node scripts/check-electrical-required-media.mjs <reel-ordner>');
const root = path.resolve(projectArg);
const paths = electricalProjectPaths(root);
const config = loadElectricalConfig();
const errors = [];
const warnings = [];
const plan = ScenePlan.parse(JSON.parse(fs.readFileSync(paths.scenePlan, 'utf8')));
const voice = findVoiceFiles(paths.audioDir);
if (!voice.raw && !voice.final) errors.push(`Keine Roh- oder Finalaufnahme in ${paths.audioDir}.`);

const imageScenes = plan.scenes.filter((scene) => scene.renderMode !== 'mechanism-only');
const remotionScenes = plan.scenes.filter((scene) => scene.renderMode === 'mechanism-only');
const seen = new Map();
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
  if (!images.length) { errors.push(`Externes Bild fehlt: ${scene.id} (${scene.imageDir})`); continue; }
  const selected = images.find((file) => /(?:final|approved|freigabe|public)/i.test(path.basename(file))) ?? images[0];
  validateImage(selected, scene.id);
}

const remotionFirst = plan.visualPolicyVersion === 'remotion-first-v1';
if (!remotionFirst) {
  const coverDir = path.join(paths.imageDir, '00-cover');
  const coverImages = findMedia(coverDir, imageExtensions).filter((file) => !path.basename(file).startsWith('.generated-'));
  if (!coverImages.length) errors.push('Coverbild fehlt: 02-bilder/images/00-cover');
  else validateImage(coverImages[0], 'Cover');
}

const invalidSfx = findMedia(paths.sfxDir, new Set([...audioExtensions])).filter((file) => fs.statSync(file).size === 0);
invalidSfx.forEach((file) => warnings.push(`Leere SFX-Datei: ${file}`));
const report = {version:'electrical-v7',generatedAt:new Date().toISOString(),passed:errors.length===0,productionMode:remotionFirst?'remotion-first':'legacy-image',requiredExternalSceneImages:imageScenes.length,remotionScenes:remotionScenes.map((scene)=>scene.id),coverRequired:!remotionFirst,errors,warnings};
fs.writeFileSync(path.join(paths.projectDir, 'required-media-report.json'), `${JSON.stringify(report, null, 2)}\n`);
if (errors.length) { console.error('Pflichtmedien nicht bereit:'); errors.forEach((error)=>console.error(`- ${error}`)); process.exit(1); }
console.log(`✓ Pflichtmedien vollständig: Voice-over + ${imageScenes.length} externe Bilder; ${remotionScenes.length} Szenen werden direkt in Remotion gebaut.`);
