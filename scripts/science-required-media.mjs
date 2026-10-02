#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {ScenePlan} from './lib/electrical-contracts.mjs';
import {electricalProjectPaths} from './lib/electrical-project-structure.mjs';
import {findMedia, findVoiceFiles, imageExtensions, audioExtensions, imageMetadata} from './lib/electrical-project.mjs';
import {loadElectricalConfig} from './lib/load-electrical-config.mjs';

const [projectArg] = process.argv.slice(2).filter((arg) => !arg.startsWith('--'));
if (!projectArg) throw new Error('Nutzung: npm run science:ready -- <video-ordner>');
const root = path.resolve(projectArg);
const paths = electricalProjectPaths(root);
const config = loadElectricalConfig();
const errors = [];
const warnings = [];
const plan = ScenePlan.parse(JSON.parse(fs.readFileSync(paths.scenePlan, 'utf8')));
const voice = findVoiceFiles(paths.audioDir);
if (!voice.raw && !voice.final) errors.push(`Keine Roh- oder Finalaufnahme in ${paths.audioDir}.`);

const seen = new Map();
const selectedImages = [];
const approvedPattern = /(?:final|approved|freigabe)/i;

const digestFor=(file)=>createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const validateSceneImage = (file, label) => {
  const metadata = imageMetadata(file);
  if (metadata.width < config.imageAnalysis.minimumWidth || metadata.height < config.imageAnalysis.minimumHeight) errors.push(`${label}: Bild zu klein (${metadata.width}×${metadata.height}).`);
  const aspect = metadata.width / metadata.height;
  if (aspect < config.imageAnalysis.landscapeAspectMin || aspect > config.imageAnalysis.landscapeAspectMax) errors.push(`${label}: Seitenverhältnis ${aspect.toFixed(3)} ist nicht 16:9-tauglich.`);
  const digest = digestFor(file);
  if (seen.has(digest)) errors.push(`Doppeltes Bild in ${label} und ${seen.get(digest)}.`);
  seen.set(digest, label);
};

for (const scene of plan.scenes) {
  const dir = path.resolve(root, scene.imageDir);
  const images = findMedia(dir, imageExtensions).filter((file) => !path.basename(file).startsWith('.generated-'));
  if (!images.length) {
    errors.push(`Szenenbild fehlt: ${scene.id} (${scene.imageDir})`);
    continue;
  }

  const approved = images.filter((file) => approvedPattern.test(path.basename(file)));
  let selected;
  if (images.length === 1) selected = images[0];
  else if (approved.length === 1) selected = approved[0];
  else if (approved.length === 0) {
    errors.push(`${scene.id}: ${images.length} Bildkandidaten vorhanden, aber keiner ist als final/approved/freigabe markiert.`);
    continue;
  } else {
    errors.push(`${scene.id}: ${approved.length} Bilder sind als final/approved/freigabe markiert; genau eines ist erlaubt.`);
    continue;
  }

  validateSceneImage(selected, scene.id);
  selectedImages.push({sceneId: scene.id, file: path.relative(root, selected).split(path.sep).join('/'), candidateCount: images.length});
}

if (selectedImages.length !== plan.scenes.length && errors.length === 0) errors.push('Nicht für jeden visuellen Beat wurde genau ein finales Bild ausgewählt.');

const thumbnailImages=findMedia(paths.thumbnailDir,imageExtensions).filter((file)=>!path.basename(file).startsWith('.generated-'));
const thumbnailApproved=thumbnailImages.filter((file)=>approvedPattern.test(path.basename(file)));
let selectedThumbnail=null;
if(thumbnailImages.length<config.visuals.thumbnail.candidateCount) errors.push(`Thumbnail: mindestens ${config.visuals.thumbnail.candidateCount} Kandidaten erforderlich; gefunden ${thumbnailImages.length}.`);
if(thumbnailApproved.length!==1) errors.push(`Thumbnail: genau ein Kandidat muss als final/approved/freigabe markiert sein; gefunden ${thumbnailApproved.length}.`);
else {
  const file=thumbnailApproved[0];
  const metadata=imageMetadata(file);
  const aspect=metadata.width/metadata.height;
  if(metadata.width<config.visuals.thumbnail.width||metadata.height<config.visuals.thumbnail.height) errors.push(`Thumbnail zu klein (${metadata.width}×${metadata.height}); mindestens ${config.visuals.thumbnail.width}×${config.visuals.thumbnail.height}.`);
  if(aspect<1.7||aspect>1.85) errors.push(`Thumbnail-Seitenverhältnis ${aspect.toFixed(3)} ist nicht 16:9-tauglich.`);
  const digest=digestFor(file);
  if(seen.has(digest)) errors.push(`Thumbnail darf nicht identisch mit Szenenbild ${seen.get(digest)} sein.`);
  selectedThumbnail={file:path.relative(root,file).split(path.sep).join('/'),candidateCount:thumbnailImages.length,width:metadata.width,height:metadata.height};
}

const invalidSfx = findMedia(paths.sfxDir, new Set([...audioExtensions])).filter((file) => fs.statSync(file).size === 0);
invalidSfx.forEach((file) => warnings.push(`Leere SFX-Datei: ${file}`));

const report = {
  version: 'youtube-2min-media-v1',
  productionProfile: config.productionProfile,
  generatedAt: new Date().toISOString(),
  passed: errors.length === 0,
  productionMode: 'youtube-static-longform',
  requiredSceneImages: plan.scenes.length,
  selectedImages,
  separateThumbnailRequired: true,
  selectedThumbnail,
  errors,
  warnings,
};
fs.writeFileSync(path.join(paths.projectDir, 'required-media-report.json'), `${JSON.stringify(report, null, 2)}\n`);

if (errors.length) {
  console.error('Science-Pflichtmedien nicht bereit:');
  errors.forEach((error)=>console.error(`- ${error}`));
  process.exit(1);
}
console.log(`✓ Pflichtmedien vollständig: Voice-over + ${selectedImages.length} 16:9-Szenenbilder + separates Thumbnail.`);
warnings.forEach((warning)=>console.warn(`⚠ ${warning}`));
