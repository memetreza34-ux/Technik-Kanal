#!/usr/bin/env node
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {enforceScenePromptLocks, enforceMasterVisibleTextLock} from './science-visible-text-lock.mjs';

const args = process.argv.slice(2);
const projectArg = args.find((arg) => !arg.startsWith('--'));
if (!projectArg) throw new Error('Nutzung: npm run science:flow-master -- <video-ordner>');

const root = path.resolve(projectArg);
const promptCount = enforceScenePromptLocks(root);
console.log(`✓ ${promptCount} Szenen-Prompts vor dem Masterprompt mit Visible-Text-Lock abgesichert.`);

const result = spawnSync(process.execPath, ['scripts/build-google-flow-master-prompt.mjs', projectArg], {
  cwd: process.cwd(),
  stdio: 'inherit',
});
if (result.error) throw result.error;
if (result.status !== 0) process.exit(result.status ?? 1);

enforceMasterVisibleTextLock(root);
console.log('✓ Google-Flow-Masterprompt zusätzlich global gegen sichtbare Szenen-/Beat-Metadaten abgesichert.');
