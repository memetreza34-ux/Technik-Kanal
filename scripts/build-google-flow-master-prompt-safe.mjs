#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {enforceScenePromptLocks, enforceMasterVisibleTextLock} from './science-visible-text-lock.mjs';
import {findFlowPromptLeaks} from './lib/science-flow-prompt.mjs';

const args = process.argv.slice(2);
const projectArg = args.find((arg) => !arg.startsWith('--'));
if (!projectArg) throw new Error('Nutzung: npm run science:flow-master -- <video-ordner>');

const root = path.resolve(projectArg);
const promptCount = enforceScenePromptLocks(root);
console.log(`✓ ${promptCount} interne Szenen-Prompts mit Visible-Text-Lock abgesichert.`);

const result = spawnSync(process.execPath, ['scripts/build-google-flow-master-prompt.mjs', projectArg], {
  cwd: process.cwd(),
  stdio: 'inherit',
});
if (result.error) throw result.error;
if (result.status !== 0) process.exit(result.status ?? 1);

const masterFile = enforceMasterVisibleTextLock(root);
const plan = JSON.parse(fs.readFileSync(path.join(root, '06-projektdateien', 'scene-plan.json'), 'utf8'));
const leaks = findFlowPromptLeaks(fs.readFileSync(masterFile, 'utf8'), plan);
if (leaks.length) throw new Error(`Flow-Masterprompt enthält nach dem Text-Lock Metadaten:\n- ${leaks.join('\n- ')}`);
console.log('✓ Google-Flow-Masterprompt einmal global gegen sichtbare Szenen-/Beat-Metadaten abgesichert und geprüft.');
