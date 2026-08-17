#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {ScenePlan} from './lib/electrical-contracts.mjs';
import {electricalProjectPaths} from './lib/electrical-project-structure.mjs';

const [projectArg] = process.argv.slice(2).filter((arg) => !arg.startsWith('--'));
if (!projectArg) throw new Error('Nutzung: npm run electrical:public-media -- <reel-ordner>');
const root = path.resolve(projectArg);
const paths = electricalProjectPaths(root);
const manifestPath = path.join(root, '02-public-media/public-assets.json');
if (!fs.existsSync(manifestPath)) { console.log('✓ Kein 02-public-media/public-assets.json vorhanden; keine öffentlichen Bilder geplant.'); process.exit(0); }
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const plan = ScenePlan.parse(JSON.parse(fs.readFileSync(paths.scenePlan, 'utf8')));
const assets = Array.isArray(manifest.assets) ? manifest.assets : [];
const allowedLicenses = new Set(['Public-Domain','CC0-1.0','CC-BY-4.0']);
const errors = [];
const attributions = [];
for (const asset of assets) {
  if (!asset.id || !asset.sceneId || !asset.sourcePage || !asset.fileUrl || !asset.license || !asset.filename) { errors.push(`Unvollständiger Public-Media-Eintrag: ${JSON.stringify(asset)}`); continue; }
  if (!allowedLicenses.has(asset.license)) { errors.push(`${asset.id}: Lizenz ${asset.license} ist im Standardprozess nicht erlaubt.`); continue; }
  if (asset.licenseVerified !== true) { errors.push(`${asset.id}: Lizenz muss vor Download mit licenseVerified=true bestätigt werden.`); continue; }
  if (!String(asset.sourcePage).startsWith('https://') || !String(asset.fileUrl).startsWith('https://')) { errors.push(`${asset.id}: nur HTTPS-Quellen erlaubt.`); continue; }
  if (asset.license === 'CC-BY-4.0' && (!asset.author || !asset.attribution)) { errors.push(`${asset.id}: CC BY 4.0 benötigt Autor und Attribution.`); continue; }
  const scene = plan.scenes.find((candidate) => candidate.id === asset.sceneId);
  if (!scene) { errors.push(`${asset.id}: unbekannte Szene ${asset.sceneId}.`); continue; }
  if (scene.renderMode === 'mechanism-only') { errors.push(`${asset.id}: ${asset.sceneId} ist Remotion-only. RenderMode zuerst bewusst auf Bildszene umstellen.`); continue; }
  const destinationDir = path.resolve(root, scene.imageDir);
  fs.mkdirSync(destinationDir, {recursive: true});
  const destination = path.join(destinationDir, `public-${asset.id}-${asset.filename}`);
  if (!fs.existsSync(destination)) {
    const response = await fetch(asset.fileUrl, {headers:{'User-Agent':'Elektrotechnik-Kanal/1.0 public-media-fetcher'}});
    if (!response.ok) { errors.push(`${asset.id}: Download fehlgeschlagen (${response.status}).`); continue; }
    fs.writeFileSync(destination, Buffer.from(await response.arrayBuffer()));
  }
  attributions.push({id:asset.id,sceneId:asset.sceneId,sourcePage:asset.sourcePage,license:asset.license,author:asset.author ?? '',attribution:asset.attribution ?? `Quelle: ${asset.sourcePage}`});
  console.log(`✓ Öffentliches Asset geladen: ${asset.id} → ${scene.id}`);
}
fs.mkdirSync(paths.exportDir, {recursive:true});
fs.writeFileSync(path.join(paths.exportDir,'public-media-attribution.txt'), attributions.map((item)=>`${item.id}: ${item.attribution} | ${item.license} | ${item.sourcePage}`).join('\n') + (attributions.length?'\n':''));
fs.writeFileSync(path.join(paths.projectDir,'public-media-report.json'), `${JSON.stringify({version:1,generatedAt:new Date().toISOString(),passed:errors.length===0,assets:attributions,errors},null,2)}\n`);
if (errors.length) { console.error('Public-Media-Prüfung fehlgeschlagen:'); errors.forEach((error)=>console.error(`- ${error}`)); process.exit(1); }
console.log(`✓ ${attributions.length} öffentliche Assets geprüft. Attribution wurde für den Export geschrieben.`);
