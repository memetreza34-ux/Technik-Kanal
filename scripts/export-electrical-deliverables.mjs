#!/usr/bin/env node
import {createHash} from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import {electricalProjectPaths} from './lib/electrical-project-structure.mjs';

const args = process.argv.slice(2);
const projectArg = args.find((arg) => !arg.startsWith('--'));
const videoArg = args.find((arg) => arg.startsWith('--video='));
if (!projectArg) {
  console.error('Nutzung: node scripts/export-electrical-deliverables.mjs <reel-ordner> [--video=video.mp4]');
  process.exit(1);
}

const root = path.resolve(projectArg);
const paths = electricalProjectPaths(root);
const plan = JSON.parse(fs.readFileSync(paths.scenePlan, 'utf8'));
const video = path.resolve(videoArg ? videoArg.slice('--video='.length) : path.join(paths.exportDir, `${plan.slug}.mp4`));
if (!fs.existsSync(video)) throw new Error(`Geprüftes MP4 fehlt: ${video}`);
if (!fs.existsSync(paths.qaReport)) throw new Error('qa-report.json fehlt. Export erst nach Render-QA erlaubt.');
const qa = JSON.parse(fs.readFileSync(paths.qaReport, 'utf8'));
if (qa.passed !== true) throw new Error('Render-QA ist nicht bestanden. Export gesperrt.');

fs.mkdirSync(paths.videoDir, {recursive: true});
const finalVideo = path.join(paths.videoDir, `${plan.slug}-final.mp4`);
fs.copyFileSync(video, finalVideo);

const optional = [
  paths.srt,
  paths.vtt,
  paths.captionsFinal,
  paths.socialCaption,
  paths.learningSheet,
  paths.sources,
  paths.qaReport,
];
const exported = [finalVideo];
for (const file of optional) {
  if (!fs.existsSync(file)) continue;
  const destination = path.join(paths.exportDir, path.basename(file));
  if (path.resolve(file) !== path.resolve(destination)) fs.copyFileSync(file, destination);
  exported.push(destination);
}

const digest = (file) => createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const manifest = {
  version: 'electrical-v1',
  slug: plan.slug,
  generatedAt: new Date().toISOString(),
  files: exported.map((file) => ({
    file: path.relative(paths.exportDir, file).split(path.sep).join('/'),
    bytes: fs.statSync(file).size,
    sha256: digest(file),
  })),
};
fs.writeFileSync(path.join(paths.exportDir, 'export-manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`✓ Geprüftes Exportpaket erstellt: ${paths.exportDir}`);
