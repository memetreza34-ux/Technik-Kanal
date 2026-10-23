#!/usr/bin/env node
import path from 'node:path';
import {runCommand} from './lib/run-command.mjs';

const root = process.cwd();
const npx = process.platform === 'win32' ? 'npx.cmd' : 'npx';

runCommand(npx, ['tsc', '--noEmit', '-p', path.join(root, 'channels/science/tsconfig.json')], {cwd: root});
runCommand(npx, [
  'tsc', '--noEmit',
  '--target', 'ES2020',
  '--module', 'ESNext',
  '--moduleResolution', 'Bundler',
  '--jsx', 'react-jsx',
  '--strict',
  '--esModuleInterop',
  '--skipLibCheck',
  'core/brand-kit/index.ts',
], {cwd: root});

console.log('✓ TypeScript-Prüfung für Science-Renderer und minimalen Core bestanden.');
