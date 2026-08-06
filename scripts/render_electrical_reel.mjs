#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {channelRoot, ensureDirectory, projectPaths, readJson, repositoryRoot, run} from './lib/electrical-project.mjs';

const args = process.argv.slice(2);
const projectArg = args.find((arg) => !arg.startsWith('--'));
if (!projectArg) {
  console.error('Nutzung: npm run electrical:render -- <reel-ordner> [--force-transcribe]');
  process.exit(1);
}

const paths = projectPaths(projectArg);
if (!args.includes('--preflight-passed')) {
  run(process.execPath, ['scripts/check-electrical-preproduction.mjs', paths.root], {cwd: repositoryRoot});
}

const genericRuntimePath = path.join(channelRoot, 'src/generated/reel-runtime.json');
const previousGenericRuntime = fs.existsSync(genericRuntimePath) ? fs.readFileSync(genericRuntimePath) : null;
let restoreGenericRuntime = false;

try {
  const prepareArgs = ['scripts/prepare_electrical_reel.mjs', paths.root];
  if (args.includes('--force-transcribe')) prepareArgs.push('--force-transcribe');
  run(process.execPath, prepareArgs, {cwd: repositoryRoot});

  const plan = readJson(paths.scenePlan);
  const runtime = readJson(path.join(paths.projectFilesDir, 'reel-runtime.json'));
  const runtimeFile = String(plan.runtimeFile ?? 'reel-runtime.json').trim() || 'reel-runtime.json';
  const compositionRuntimePath = path.join(channelRoot, 'src/generated', runtimeFile);
  ensureDirectory(path.dirname(compositionRuntimePath));
  fs.copyFileSync(path.join(paths.projectFilesDir, 'reel-runtime.json'), compositionRuntimePath);
  restoreGenericRuntime = runtimeFile !== 'reel-runtime.json' && Boolean(previousGenericRuntime);

  run('npm', ['run', 'check'], {cwd: repositoryRoot});
  ensureDirectory(paths.exportDir);
  const output = path.join(paths.exportDir, `${runtime.slug}.mp4`);
  const npx = process.platform === 'win32' ? 'npx.cmd' : 'npx';
  run(npx, [
    'remotion', 'render',
    'src/index.ts',
    runtime.compositionId,
    output,
    '--codec=h264',
    '--audio-codec=aac',
    '--audio-bitrate=192k',
    '--pixel-format=yuv420p',
    '--crf=18',
  ], {cwd: channelRoot});

  if (!fs.existsSync(output)) throw new Error(`Render wurde nicht erzeugt: ${output}`);
  run(process.execPath, ['scripts/qa_electrical_render.mjs', paths.root, `--video=${output}`], {cwd: repositoryRoot});
  console.log(`✓ Finaler Arbeitsrender: ${output}`);
} finally {
  if (restoreGenericRuntime && previousGenericRuntime) {
    fs.writeFileSync(genericRuntimePath, previousGenericRuntime);
  }
}
