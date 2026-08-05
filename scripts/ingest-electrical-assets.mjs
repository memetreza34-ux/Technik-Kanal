#!/usr/bin/env node
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import {AssetManifest, ScenePlan} from './lib/electrical-contracts.mjs';
import {electricalProjectPaths, normalizeProjectPath} from './lib/electrical-project-structure.mjs';
import {loadElectricalConfig} from './lib/load-electrical-config.mjs';

const [projectArg] = process.argv.slice(2).filter((arg) => !arg.startsWith('--'));
if (!projectArg) {
  console.error('Nutzung: node scripts/ingest-electrical-assets.mjs <reel-ordner>');
  process.exit(1);
}

const root = path.resolve(projectArg);
const paths = electricalProjectPaths(root);
const config = loadElectricalConfig();
const plan = ScenePlan.parse(JSON.parse(fs.readFileSync(paths.scenePlan, 'utf8')));
const imageExt = new Set(['.png', '.jpg', '.jpeg', '.webp', '.avif']);
const audioExt = new Set(['.wav', '.mp3', '.m4a', '.aac', '.flac', '.ogg']);
const captionExt = new Set(['.srt', '.vtt']);

const walk = (dir) => {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, {withFileTypes: true}).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
};

const files = [
  ...walk(paths.audioDir),
  ...walk(paths.sfxDir),
  ...walk(paths.imageDir),
  ...walk(paths.captionsDir),
].filter((file) => !file.endsWith('.DS_Store'));

const sha256 = (file) => createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const mediaDuration = (file) => {
  try {
    return Number(execFileSync('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'default=noprint_wrappers=1:nokey=1', file], {encoding: 'utf8'}).trim());
  } catch {
    return undefined;
  }
};
const idFor = (relative) => relative
  .replace(/\.[^.]+$/, '')
  .replace(/[^a-zA-Z0-9äöüÄÖÜß]+/g, '-')
  .replace(/^-+|-+$/g, '')
  .toLowerCase();

const analyseImage = async (file) => {
  const metadata = await sharp(file).metadata();
  const stats = await sharp(file).stats();
  const channels = stats.channels.slice(0, Math.min(3, stats.channels.length));
  const brightness = channels.length ? channels.reduce((sum, channel) => sum + channel.mean, 0) / channels.length / 255 : 0.5;
  const entropy = Number.isFinite(stats.entropy) ? stats.entropy : 0;
  const {data, info} = await sharp(file).resize(90, 160, {fit: 'cover'}).greyscale().raw().toBuffer({resolveWithObject: true});
  const zoneRows = Math.max(1, Math.round(info.height * config.imageAnalysis.safeZoneHeightRatio));
  const deviation = (start, end) => {
    const values = [];
    for (let y = start; y < end; y += 1) for (let x = 0; x < info.width; x += 1) values.push(data[y * info.width + x]);
    const mean = values.reduce((sum, value) => sum + value, 0) / Math.max(1, values.length);
    const variance = values.reduce((sum, value) => sum + (value - mean) ** 2, 0) / Math.max(1, values.length);
    return Math.sqrt(variance);
  };
  const topStdDev = deviation(0, zoneRows);
  const bottomStdDev = deviation(info.height - zoneRows, info.height);
  const aspect = metadata.width && metadata.height ? metadata.width / metadata.height : 0;
  return {
    width: metadata.width,
    height: metadata.height,
    imageAnalysis: {
      brightness: Number(brightness.toFixed(4)),
      entropy: Number(entropy.toFixed(4)),
      visualDensity: entropy < config.imageAnalysis.lowDensityEntropy ? 'low' : entropy > config.imageAnalysis.highDensityEntropy ? 'high' : 'medium',
      portraitReady: aspect >= config.imageAnalysis.portraitAspectMin && aspect <= config.imageAnalysis.portraitAspectMax,
      safeTop: topStdDev <= config.imageAnalysis.safeZoneMaximumStdDev,
      safeBottom: bottomStdDev <= config.imageAnalysis.safeZoneMaximumStdDev,
      topStdDev: Number(topStdDev.toFixed(2)),
      bottomStdDev: Number(bottomStdDev.toFixed(2)),
    },
  };
};

const assets = [];
for (const file of files) {
  const relative = normalizeProjectPath(path.relative(root, file));
  const extension = path.extname(file).toLowerCase();
  if (['.md', '.txt'].includes(extension)) continue;
  let kind = 'other';
  let role = 'other';
  if (imageExt.has(extension)) {
    kind = 'image';
    role = relative.includes('/00-cover/') ? 'cover' : 'scene-image';
  } else if (audioExt.has(extension)) {
    kind = 'audio';
    role = relative.includes('/sfx/') ? 'sfx' : /final/i.test(path.basename(file)) ? 'voiceover-final' : 'voiceover-raw';
  } else if (captionExt.has(extension) || relative.includes('caption')) {
    kind = 'captions';
    role = 'word-timestamps';
  } else if (extension === '.json') {
    kind = 'data';
    role = 'data';
  }
  const stat = fs.statSync(file);
  const asset = {id: idFor(relative), kind, role, file: relative, extension, bytes: stat.size, sha256: sha256(file)};
  if (kind === 'image') Object.assign(asset, await analyseImage(file));
  if (kind === 'audio') {
    const durationSeconds = mediaDuration(file);
    if (Number.isFinite(durationSeconds) && durationSeconds > 0) asset.durationSeconds = Number(durationSeconds.toFixed(3));
  }
  assets.push(asset);
}
assets.sort((a, b) => a.file.localeCompare(b.file, 'de'));

const manifest = AssetManifest.parse({
  version: 'electrical-v1',
  slug: plan.slug,
  root: normalizeProjectPath(path.relative(process.cwd(), root) || '.'),
  generatedAt: new Date().toISOString(),
  assets,
});
fs.writeFileSync(paths.manifest, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`✓ ${assets.length} Assets erfasst → ${paths.manifest}`);
console.log(assets.reduce((result, asset) => ({...result, [asset.kind]: (result[asset.kind] ?? 0) + 1}), {}));
