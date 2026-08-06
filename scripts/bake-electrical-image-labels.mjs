#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import {ScenePlan} from './lib/electrical-contracts.mjs';
import {electricalProjectPaths} from './lib/electrical-project-structure.mjs';
import {findMedia, imageExtensions} from './lib/electrical-project.mjs';

const [projectArg] = process.argv.slice(2).filter((arg) => !arg.startsWith('--'));
if (!projectArg) throw new Error('Nutzung: node scripts/bake-electrical-image-labels.mjs <reel-ordner>');

const root = path.resolve(projectArg);
const paths = electricalProjectPaths(root);
const plan = ScenePlan.parse(JSON.parse(fs.readFileSync(paths.scenePlan, 'utf8')));
const outputDir = path.join(paths.imageDir, 'final-labeled');
fs.rmSync(outputDir, {recursive: true, force: true});
fs.mkdirSync(outputDir, {recursive: true});

const generatedNames = new Set(['generated-final-labeled.png', 'generated-final-callouts.png']);
const selectImage = (dir) => {
  const images = findMedia(dir, imageExtensions).filter((file) => !generatedNames.has(path.basename(file)));
  return images.find((file) => /(?:approved|freigabe)/i.test(path.basename(file)))
    ?? images.find((file) => /(?:final)/i.test(path.basename(file)))
    ?? images[0];
};

const escapeXml = (value) => String(value)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&apos;');

const wrap = (text, max = 27, maximumLines = 2) => {
  const forced = String(text).split('|').map((part) => part.trim()).filter(Boolean);
  if (forced.length > 1) return forced.slice(0, maximumLines);
  const words = String(text).split(/\s+/).filter(Boolean);
  const lines = [];
  let current = '';
  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (candidate.length > max && current) {
      lines.push(current);
      current = word;
    } else {
      current = candidate;
    }
  }
  if (current) lines.push(current);
  return lines.slice(0, maximumLines);
};

const accentColors = {
  pe: '#d9e82e',
  neutral: '#43c8ff',
  fault: '#ff5a67',
  protection: '#63e6be',
  warning: '#ffb347',
  current: '#8edcff',
};

const renderCallout = (annotation, index) => {
  const accent = accentColors[annotation.accent ?? 'protection'] ?? accentColors.protection;
  const x = Math.round(annotation.labelX * 1080);
  const y = Math.round(annotation.labelY * 1920);
  const targetX = Math.round(annotation.targetX * 1080);
  const targetY = Math.round(annotation.targetY * 1920);
  const width = annotation.width ?? 330;
  const lines = wrap(annotation.text, Math.max(18, Math.floor(width / 15)), 2);
  const fontSize = 32;
  const lineHeight = 37;
  const boxHeight = 30 + lines.length * lineHeight;
  const boxCenterX = x + width / 2;
  const startX = targetX >= boxCenterX ? x + width : x;
  const startY = Math.max(y + 20, Math.min(y + boxHeight - 20, targetY));
  const elbowX = Math.round(startX + (targetX - startX) * 0.48);
  const textElements = lines.map((line, lineIndex) => (
    `<text x="${x + 22}" y="${y + 44 + lineIndex * lineHeight}" font-family="Arial,Helvetica,sans-serif" font-size="${fontSize}" font-weight="800" fill="#ffffff">${escapeXml(line)}</text>`
  )).join('');
  return `
    <g id="callout-${index}">
      <path d="M ${startX} ${startY} L ${elbowX} ${startY} L ${targetX} ${targetY}" fill="none" stroke="${accent}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="${targetX}" cy="${targetY}" r="13" fill="#06121f" stroke="${accent}" stroke-width="6"/>
      <rect x="${x}" y="${y}" width="${width}" height="${boxHeight}" rx="18" fill="#06121f" fill-opacity="0.90" stroke="${accent}" stroke-width="3"/>
      <rect x="${x}" y="${y}" width="9" height="${boxHeight}" rx="4.5" fill="${accent}"/>
      <g filter="url(#shadow)">${textElements}</g>
    </g>`;
};

const svgFor = (annotations) => Buffer.from(`
  <svg width="1080" height="1920" viewBox="0 0 1080 1920" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <filter id="shadow"><feDropShadow dx="0" dy="3" stdDeviation="5" flood-color="#000000" flood-opacity="0.92"/></filter>
    </defs>
    ${annotations.map(renderCallout).join('')}
  </svg>
`);

const items = plan.scenes
  .filter((scene) => scene.renderMode !== 'mechanism-only')
  .map((scene) => ({
    id: scene.id,
    dir: path.resolve(root, scene.imageDir),
    annotations: scene.imageAnnotations ?? [],
  }));

const manifest = [];
for (const item of items) {
  const source = selectImage(item.dir);
  if (!source) throw new Error(`Basisbild fehlt für ${item.id}: ${item.dir}`);
  const output = path.join(outputDir, `${item.id}.png`);
  const sceneGenerated = path.join(item.dir, 'generated-final-callouts.png');
  const pipeline = sharp(source).resize(1080, 1920, {fit: 'cover', position: 'centre'});
  if (item.annotations.length > 0) {
    pipeline.composite([{input: svgFor(item.annotations), top: 0, left: 0}]);
  }
  await pipeline.png({quality: 96}).toFile(output);
  fs.copyFileSync(output, sceneGenerated);
  manifest.push({
    id: item.id,
    annotations: item.annotations.map((annotation) => annotation.text),
    source: path.relative(root, source).split(path.sep).join('/'),
    output: path.relative(root, output).split(path.sep).join('/'),
    sceneCopy: path.relative(root, sceneGenerated).split(path.sep).join('/'),
  });
  console.log(`✓ ${item.id}: ${item.annotations.length} technische Callout(s), keine Szenenüberschrift im Bild.`);
}

fs.writeFileSync(
  path.join(outputDir, 'manifest.json'),
  `${JSON.stringify({
    version: 'visual-v6-technical-callouts',
    generatedAt: new Date().toISOString(),
    policy: 'Nur konkrete Bauteile, Leiter, Fehlerstellen oder Prozesspunkte werden im Bild markiert. Cover-Hook und Szenenüberschriften kommen aus Remotion.',
    items: manifest,
  }, null, 2)}\n`,
);
console.log(`✓ ${manifest.length} finale Szenen-PNGs erstellt.`);
console.log('✓ Cover-Hook und Szenenüberschriften bleiben ausschließlich Remotion-Texte.');
