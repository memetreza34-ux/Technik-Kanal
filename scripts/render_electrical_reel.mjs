#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {channelRoot, ensureDirectory, projectPaths, readJson, repositoryRoot, run} from './lib/electrical-project.mjs';
import {loadElectricalConfig} from './lib/load-electrical-config.mjs';

const args = process.argv.slice(2);
const projectArg = args.find((arg) => !arg.startsWith('--'));
if (!projectArg) {
  console.error('Nutzung: npm run electrical:render -- <reel-ordner> [--force-transcribe] [--no-export]');
  process.exit(1);
}
const paths = projectPaths(projectArg);
const config = loadElectricalConfig();

for (const script of [
  'scripts/check-electrical-project-folder.mjs',
  'scripts/run-electrical-script-qa.mjs',
  'scripts/run-electrical-creative-qa.mjs',
  'scripts/check-electrical-content-package.mjs',
  'scripts/check-electrical-social-caption.mjs',
  'scripts/check-electrical-required-media.mjs',
  'scripts/ingest-electrical-assets.mjs',
  'scripts/check-electrical-readiness.mjs',
]) {
  run(process.execPath, [script, paths.root], {cwd: repositoryRoot});
}

const prepareArgs = ['scripts/prepare_electrical_reel.mjs', paths.root];
if (args.includes('--force-transcribe')) prepareArgs.push('--force-transcribe');
run(process.execPath, prepareArgs, {cwd: repositoryRoot});
run('npm', ['run', 'typecheck'], {cwd: repositoryRoot});

const runtime = readJson(path.join(paths.projectFilesDir, 'reel-runtime.json'));
ensureDirectory(paths.renderDir);
const output = path.join(paths.renderDir, `${runtime.slug}-render.mp4`);
const npx = process.platform === 'win32' ? 'npx.cmd' : 'npx';
run(npx, [
  'remotion', 'render',
  'src/index.ts',
  runtime.compositionId,
  output,
  `--codec=${config.render.codec}`,
  `--audio-codec=${config.render.audioCodec}`,
  `--audio-bitrate=${config.render.audioBitrate}`,
  `--pixel-format=${config.render.pixelFormat}`,
  `--crf=${config.render.crf}`,
  `--x264-preset=${config.render.x264Preset}`,
], {cwd: channelRoot});

if (!fs.existsSync(output)) throw new Error(`Render wurde nicht erzeugt: ${output}`);
run(process.execPath, ['scripts/qa_electrical_render.mjs', paths.root, `--video=${output}`], {cwd: repositoryRoot});
if (!args.includes('--no-export')) {
  run(process.execPath, ['scripts/export-electrical-deliverables.mjs', paths.root, `--video=${output}`], {cwd: repositoryRoot});
}
console.log(`✓ Geprüfter Arbeitsrender: ${output}`);
