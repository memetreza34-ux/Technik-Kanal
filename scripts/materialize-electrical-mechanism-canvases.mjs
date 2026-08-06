#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import {ScenePlan} from './lib/electrical-contracts.mjs';
import {electricalProjectPaths} from './lib/electrical-project-structure.mjs';
import {findMedia, imageExtensions} from './lib/electrical-project.mjs';

const [projectArg] = process.argv.slice(2).filter((arg) => !arg.startsWith('--'));
if (!projectArg) {
  console.error('Nutzung: node scripts/materialize-electrical-mechanism-canvases.mjs <reel-ordner>');
  process.exit(1);
}

const root = path.resolve(projectArg);
const paths = electricalProjectPaths(root);
const plan = ScenePlan.parse(JSON.parse(fs.readFileSync(paths.scenePlan, 'utf8')));
const generatedFiles = [];

for (const scene of plan.scenes.filter((entry) => entry.renderMode === 'mechanism-only')) {
  const directory = path.resolve(root, scene.imageDir);
  fs.mkdirSync(directory, {recursive: true});
  if (findMedia(directory, imageExtensions).length) continue;

  const file = path.join(directory, '.generated-mechanism-canvas.png');
  await sharp({
    create: {
      width: plan.width,
      height: plan.height,
      channels: 4,
      background: {r: 3, g: 16, b: 31, alpha: 1},
    },
  }).png().toFile(file);
  generatedFiles.push(file);
}

fs.mkdirSync(paths.workDir, {recursive: true});
const report = path.join(paths.workDir, 'generated-mechanism-canvases.json');
fs.writeFileSync(report, `${JSON.stringify({generatedAt: new Date().toISOString(), files: generatedFiles}, null, 2)}\n`);
console.log(`✓ ${generatedFiles.length} interne Mechanismus-Flächen erzeugt. Keine Nutzerbilder erforderlich.`);
