#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {channelRoot, ensureDirectory, projectPaths, readJson, repositoryRoot, run} from './lib/electrical-project.mjs';

const args = process.argv.slice(2);
const projectArg = args.find((arg) => !arg.startsWith('--'));
if (!projectArg) {
  console.error('Nutzung: npm run science:render -- <video-ordner> [--force-transcribe]');
  process.exit(1);
}

const paths = projectPaths(projectArg);
const sourcePlan = readJson(paths.scenePlan);
if (sourcePlan.productionProfile !== 'youtube-2min-v1') throw new Error('Aktiver Renderer erwartet youtube-2min-v1.');
if (Number(sourcePlan.width) !== 1920 || Number(sourcePlan.height) !== 1080) throw new Error('Aktiver Renderer erwartet 1920×1080 / 16:9.');
if (sourcePlan.visualPolicyVersion !== 'science-static-v1') throw new Error('Nur science-static-v1 wird vom aktiven Renderer unterstützt.');
if (sourcePlan.compositionId !== 'ScienceReel') throw new Error('Aktive Kompatibilitäts-Composition muss ScienceReel sein.');
if (sourcePlan.runtimeFile !== 'science-runtime.json') throw new Error('Science-Videos müssen science-runtime.json verwenden.');

if (!args.includes('--preflight-passed')) {
  run(process.execPath, ['scripts/science-readiness.mjs', paths.root], {cwd: repositoryRoot});
} else {
  run(process.execPath, ['scripts/science-required-media.mjs', paths.root], {cwd: repositoryRoot});
  run(process.execPath, ['scripts/science-image-qa.mjs', paths.root], {cwd: repositoryRoot});
  run(process.execPath, ['scripts/science-runtime-readiness.mjs', paths.root], {cwd: repositoryRoot});
}

const prepareArgs = ['scripts/prepare_science_reel.mjs', paths.root, '--readiness-passed'];
if (args.includes('--force-transcribe')) prepareArgs.push('--force-transcribe');
run(process.execPath, prepareArgs, {cwd: repositoryRoot});

const runtime = readJson(path.join(paths.projectFilesDir, 'reel-runtime.json'));
if (runtime.compositionId !== 'ScienceReel') throw new Error('Erzeugte Runtime verwendet nicht ScienceReel.');
if (Number(runtime.width) !== 1920 || Number(runtime.height) !== 1080) throw new Error('Erzeugte Runtime ist nicht 1920×1080.');
const scienceRuntimePath = path.join(channelRoot, 'src/generated/science-runtime.json');
if (!fs.existsSync(scienceRuntimePath)) throw new Error(`Science-Runtime fehlt: ${scienceRuntimePath}`);

run('npm', ['run', 'check'], {cwd: repositoryRoot});
ensureDirectory(paths.exportDir);
const output = path.join(paths.exportDir, `${runtime.slug}.mp4`);
const npx = process.platform === 'win32' ? 'npx.cmd' : 'npx';
run(npx, ['remotion','render','src/index.ts','ScienceReel',output,'--codec=h264','--audio-codec=aac','--audio-bitrate=192k','--pixel-format=yuv420p','--crf=18'], {cwd: channelRoot});

if (!fs.existsSync(output)) throw new Error(`Render wurde nicht erzeugt: ${output}`);
run(process.execPath, ['scripts/qa_science_render.mjs', paths.root, `--video=${output}`], {cwd: repositoryRoot});
console.log(`✓ Finaler 1920×1080-Science-Arbeitsrender: ${output}`);
