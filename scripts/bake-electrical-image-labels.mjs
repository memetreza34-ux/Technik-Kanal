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

const generatedName = 'generated-final-labeled.png';
const selectImage = (dir) => {
  const images = findMedia(dir, imageExtensions).filter((file) => path.basename(file) !== generatedName);
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

const wrap = (text, max = 28, maximumLines = 3) => {
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

const mainAccentFor = (id) => {
  if (id.includes('fehler') || id.includes('abschaltung')) return accentColors.fault;
  if (id.includes('pe-vs-n')) return accentColors.neutral;
  return accentColors.pe;
};

const renderTitle = ({label, cover = false, id = ''}) => {
  const lines = wrap(label, cover ? 23 : 32, cover ? 3 : 2);
  const fontSize = cover ? 84 : 50;
  const lineHeight = fontSize * 1.08;
  const y = cover ? 196 : 176;
  const accent = cover ? accentColors.pe : mainAccentFor(id);
  const text = lines.map((line, index) => (
    `<text x="${cover ? 540 : 96}" y="${y + index * lineHeight}" text-anchor="${cover ? 'middle' : 'start'}" font-family="Arial,Helvetica,sans-serif" font-size="${fontSize}" font-weight="900" fill="#ffffff">${escapeXml(line)}</text>`
  )).join('');
  const accentElement = cover
    ? `<rect x="360" y="76" width="360" height="8" rx="4" fill="${accent}"/>`
    : `<rect x="68" y="128" width="9" height="${Math.max(72, lines.length * lineHeight)}" rx="4.5" fill="${accent}"/>`;
  return `${accentElement}<g filter="url(#shadow)">${text}</g>`;
};

const renderCallout = (annotation, index) => {
  const accent = accentColors[annotation.accent ?? 'protection'] ?? accentColors.protection;
  const x = Math.round(annotation.labelX * 1080);
  const y = Math.round(annotation.labelY * 1920);
  const targetX = Math.round(annotation.targetX * 1080);
  const targetY = Math.round(annotation.targetY * 1920);
  const width = annotation.width ?? 340;
  const lines = wrap(annotation.text, Math.max(18, Math.floor(width / 15)), 3);
  const fontSize = 34;
  const lineHeight = 39;
  const boxHeight = 34 + lines.length * lineHeight;
  const boxCenterX = x + width / 2;
  const boxCenterY = y + boxHeight / 2;
  const startX = targetX >= boxCenterX ? x + width : x;
  const startY = Math.max(y + 22, Math.min(y + boxHeight - 22, targetY));
  const elbowX = Math.round(startX + (targetX - startX) * 0.48);
  const textElements = lines.map((line, lineIndex) => (
    `<text x="${x + 24}" y="${y + 48 + lineIndex * lineHeight}" font-family="Arial,Helvetica,sans-serif" font-size="${fontSize}" font-weight="800" fill="#ffffff">${escapeXml(line)}</text>`
  )).join('');
  return `
    <g id="callout-${index}">
      <path d="M ${startX} ${startY} L ${elbowX} ${startY} L ${targetX} ${targetY}" fill="none" stroke="${accent}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round" marker-end="url(#arrow-${index})"/>
      <circle cx="${targetX}" cy="${targetY}" r="15" fill="#06121f" stroke="${accent}" stroke-width="7"/>
      <rect x="${x}" y="${y}" width="${width}" height="${boxHeight}" rx="20" fill="#06121f" fill-opacity="0.92" stroke="${accent}" stroke-width="4"/>
      <rect x="${x}" y="${y}" width="10" height="${boxHeight}" rx="5" fill="${accent}"/>
      <g filter="url(#shadow)">${textElements}</g>
    </g>
    <marker id="arrow-${index}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse"><path d="M 0 0 L 10 5 L 0 10 z" fill="${accent}"/></marker>`;
};

const svgFor = ({label, cover = false, id = '', annotations = []}) => {
  const annotationSvg = annotations.map(renderCallout).join('');
  return Buffer.from(`
    <svg width="1080" height="1920" viewBox="0 0 1080 1920" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="title-gradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#020914" stop-opacity="0.90"/>
          <stop offset="1" stop-color="#020914" stop-opacity="0"/>
        </linearGradient>
        <filter id="shadow"><feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#000000" flood-opacity="0.92"/></filter>
      </defs>
      <rect x="0" y="0" width="1080" height="500" fill="url(#title-gradient)"/>
      ${renderTitle({label, cover, id})}
      ${annotationSvg}
    </svg>
  `);
};

const items = [
  {
    id: '00-cover',
    label: plan.coverText,
    dir: path.join(paths.imageDir, '00-cover'),
    cover: true,
    annotations: [],
  },
  ...plan.scenes
    .filter((scene) => scene.renderMode !== 'mechanism-only')
    .map((scene) => ({
      id: scene.id,
      label: scene.imageLabel ?? scene.headline ?? scene.title,
      dir: path.resolve(root, scene.imageDir),
      cover: false,
      annotations: scene.imageAnnotations ?? [],
    })),
];

const manifest = [];
for (const item of items) {
  const source = selectImage(item.dir);
  if (!source) throw new Error(`Basisbild fehlt für ${item.id}: ${item.dir}`);
  const output = path.join(outputDir, `${item.id}.png`);
  const sceneGenerated = path.join(item.dir, generatedName);
  const overlay = svgFor(item);
  await sharp(source)
    .resize(1080, 1920, {fit: 'cover', position: 'centre'})
    .composite([{input: overlay, top: 0, left: 0}])
    .png({quality: 96})
    .toFile(output);
  fs.copyFileSync(output, sceneGenerated);
  manifest.push({
    id: item.id,
    label: item.label,
    annotations: item.annotations.map((annotation) => annotation.text),
    source: path.relative(root, source).split(path.sep).join('/'),
    output: path.relative(root, output).split(path.sep).join('/'),
    sceneCopy: path.relative(root, sceneGenerated).split(path.sep).join('/'),
  });
  console.log(`✓ ${item.id}: deutsche Überschrift und ${item.annotations.length} Callout(s) direkt ins Bild eingebrannt.`);
}

fs.writeFileSync(
  path.join(outputDir, 'manifest.json'),
  `${JSON.stringify({version: 'visual-v6-callouts', generatedAt: new Date().toISOString(), items: manifest}, null, 2)}\n`,
);
console.log(`✓ ${manifest.length} final beschriftete PNGs erstellt.`);
console.log('✓ Die Produktionspipeline bevorzugt automatisch die erzeugten Dateien mit "final" im Namen.');
