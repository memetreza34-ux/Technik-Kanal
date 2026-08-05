#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {AssetManifest, ProductionStatus, ScenePlan} from './lib/electrical-contracts.mjs';
import {assertElectricalProjectStructure, electricalProjectPaths} from './lib/electrical-project-structure.mjs';

const [projectArg] = process.argv.slice(2).filter((arg) => !arg.startsWith('--'));
if (!projectArg) {
  console.error('Nutzung: node scripts/validate-electrical-project.mjs <reel-ordner>');
  process.exit(1);
}

const root = path.resolve(projectArg);
assertElectricalProjectStructure(root);
const paths = electricalProjectPaths(root);
const parse = (file, schema) => schema.parse(JSON.parse(fs.readFileSync(file, 'utf8')));
const plan = parse(paths.scenePlan, ScenePlan);
const status = parse(paths.status, ProductionStatus);
if (fs.existsSync(paths.manifest)) parse(paths.manifest, AssetManifest);

const sceneIds = new Set();
for (const scene of plan.scenes) {
  if (sceneIds.has(scene.id)) throw new Error(`Doppelte Szenen-ID: ${scene.id}`);
  sceneIds.add(scene.id);
  const imageDir = path.resolve(root, scene.imageDir);
  if (!imageDir.startsWith(path.resolve(paths.imageDir))) throw new Error(`imageDir außerhalb von 02-bilder/images: ${scene.imageDir}`);
}
if (status.slug && status.slug !== plan.slug) throw new Error(`Slug-Widerspruch: scene-plan=${plan.slug}, status=${status.slug}`);

console.log(`✓ Projektvertrag gültig: ${plan.slug}`);
console.log(`  Szenen: ${plan.scenes.length}`);
console.log(`  Format: ${plan.width}×${plan.height} bei ${plan.fps} FPS`);
