#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import {ScenePlan} from './lib/electrical-contracts.mjs';
import {electricalProjectPaths} from './lib/electrical-project-structure.mjs';
import {findMedia, imageExtensions} from './lib/electrical-project.mjs';
import {loadElectricalConfig} from './lib/load-electrical-config.mjs';

const [projectArg] = process.argv.slice(2).filter((arg) => !arg.startsWith('--'));
if (!projectArg) {
  console.error('Nutzung: node scripts/check-electrical-image-appearance.mjs <reel-ordner>');
  process.exit(1);
}

const root = path.resolve(projectArg);
const paths = electricalProjectPaths(root);
const plan = ScenePlan.parse(JSON.parse(fs.readFileSync(paths.scenePlan, 'utf8')));
const config = loadElectricalConfig();
const errors = [];
const warnings = [];
const analyses = [];

const selectImage = (dir) => {
  const images = findMedia(dir, imageExtensions).filter((file) => !path.basename(file).startsWith('.generated-'));
  return images.find((file) => /(?:final|approved|freigabe)/i.test(path.basename(file))) ?? images[0];
};

const analyze = async (file, label) => {
  const {data, info} = await sharp(file)
    .resize({width: 96, height: 171, fit: 'fill'})
    .removeAlpha()
    .raw()
    .toBuffer({resolveWithObject: true});
  const channels = info.channels;
  const pixels = [];
  for (let y = 0; y < info.height; y += 1) {
    for (let x = 0; x < info.width; x += 1) {
      const offset = (y * info.width + x) * channels;
      pixels.push({x, y, r: data[offset], g: data[offset + 1], b: data[offset + 2]});
    }
  }
  const topHeight = Math.max(1, Math.round(info.height * 0.12));
  const sideWidth = Math.max(1, Math.round(info.width * 0.08));
  const region = (predicate) => pixels.filter(predicate);
  const whiteRatio = (items) => items.filter(({r, g, b}) => r > 232 && g > 232 && b > 232 && Math.max(r, g, b) - Math.min(r, g, b) < 18).length / Math.max(1, items.length);
  const stats = (items) => {
    const values = items.flatMap(({r, g, b}) => [r, g, b]);
    const mean = values.reduce((sum, value) => sum + value, 0) / Math.max(1, values.length);
    const variance = values.reduce((sum, value) => sum + ((value - mean) ** 2), 0) / Math.max(1, values.length);
    return {mean, stdDev: Math.sqrt(variance)};
  };
  const top = region(({y}) => y < topHeight);
  const bottom = region(({y}) => y >= info.height - topHeight);
  const edges = region(({x, y}) => x < sideWidth || x >= info.width - sideWidth || y < topHeight || y >= info.height - topHeight);
  const edgeColor = edges.reduce((acc, {r, g, b}) => ({r: acc.r + r, g: acc.g + g, b: acc.b + b}), {r: 0, g: 0, b: 0});
  edgeColor.r /= Math.max(1, edges.length);
  edgeColor.g /= Math.max(1, edges.length);
  edgeColor.b /= Math.max(1, edges.length);
  const topWhite = whiteRatio(top);
  const bottomWhite = whiteRatio(bottom);
  const fullWhite = whiteRatio(pixels);
  const topStats = stats(top);
  const bottomStats = stats(bottom);
  const threshold = config.imageAnalysis.whiteBandMaximumRatio ?? 0.34;
  if (topWhite > threshold) errors.push(`${label}: weißer/hellgrauer Balken oben erkannt (${Math.round(topWhite * 100)} %).`);
  if (bottomWhite > threshold) errors.push(`${label}: weißer/hellgrauer Balken unten erkannt (${Math.round(bottomWhite * 100)} %).`);
  if (fullWhite > (config.imageAnalysis.fullImageWhiteMaximumRatio ?? 0.16)) errors.push(`${label}: zu großer weißer oder hellgrauer Flächenanteil (${Math.round(fullWhite * 100)} %).`);
  if (topStats.mean > 220 && topStats.stdDev < 12) errors.push(`${label}: leere helle Titelkarte oben erkannt.`);
  if (bottomStats.mean > 220 && bottomStats.stdDev < 12) errors.push(`${label}: leere helle Fläche unten erkannt.`);
  analyses.push({label, file: path.relative(root, file).split(path.sep).join('/'), topWhiteRatio: Number(topWhite.toFixed(3)), bottomWhiteRatio: Number(bottomWhite.toFixed(3)), fullWhiteRatio: Number(fullWhite.toFixed(3)), edgeColor});
};

const cover = selectImage(path.join(paths.imageDir, '00-cover'));
if (cover) await analyze(cover, 'Cover');
for (const scene of plan.scenes.filter((item) => item.renderMode !== 'mechanism-only')) {
  const file = selectImage(path.resolve(root, scene.imageDir));
  if (file) await analyze(file, scene.id);
}

const distance = (a, b) => Math.hypot(a.r - b.r, a.g - b.g, a.b - b.b);
const clusters = [];
for (const item of analyses) {
  const existing = clusters.find((cluster) => distance(cluster.center, item.edgeColor) < (config.imageAnalysis.backgroundClusterDistance ?? 28));
  if (existing) {
    existing.items.push(item.label);
    const n = existing.items.length;
    existing.center = {r: ((existing.center.r * (n - 1)) + item.edgeColor.r) / n, g: ((existing.center.g * (n - 1)) + item.edgeColor.g) / n, b: ((existing.center.b * (n - 1)) + item.edgeColor.b) / n};
  } else clusters.push({center: {...item.edgeColor}, items: [item.label]});
}
const minimumClusters = Math.min(config.imageAnalysis.minimumBackgroundClusters ?? 4, Math.max(1, analyses.length));
if (analyses.length >= 4 && clusters.length < minimumClusters) errors.push(`Hintergründe sind zu ähnlich: ${clusters.length} erkennbare Farbfamilien; mindestens ${minimumClusters} erforderlich.`);
if (clusters.some((cluster) => cluster.items.length >= Math.ceil(analyses.length * 0.65))) warnings.push('Mehr als 65 % der Bilder verwenden eine sehr ähnliche Rand-/Hintergrundfarbe.');

const report = {
  version: 'electrical-v4-image-appearance',
  generatedAt: new Date().toISOString(),
  passed: errors.length === 0,
  analyzedImages: analyses.length,
  backgroundClusters: clusters.map((cluster) => ({items: cluster.items, center: Object.fromEntries(Object.entries(cluster.center).map(([key, value]) => [key, Number(value.toFixed(1))]))})),
  manualGermanLabelReviewRequired: true,
  manualReview: 'Prüfe bei jedem Bild die exakt vorgegebene deutsche Beschriftung. Falsch geschriebene, englische oder zusätzliche Texte müssen neu generiert werden.',
  analyses,
  errors,
  warnings,
};
fs.writeFileSync(path.join(paths.projectDir, 'image-appearance-report.json'), `${JSON.stringify(report, null, 2)}\n`);
if (errors.length) {
  console.error('Bilddarstellungs-QA fehlgeschlagen:');
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}
console.log(`✓ Bilddarstellungs-QA bestanden: keine weißen Balken und ${clusters.length} Hintergrundfamilien.`);
warnings.forEach((warning) => console.warn(`⚠ ${warning}`));
