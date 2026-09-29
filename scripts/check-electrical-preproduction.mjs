#!/usr/bin/env node
import {spawnSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import {electricalProjectPaths, assertElectricalProjectStructure} from './lib/electrical-project-structure.mjs';

const [projectArg] = process.argv.slice(2).filter((arg) => !arg.startsWith('--'));
if (!projectArg) {
  console.error('Nutzung: npm run science:preflight -- <reel-ordner>');
  process.exit(1);
}

const root = path.resolve(projectArg);
assertElectricalProjectStructure(root);
const paths = electricalProjectPaths(root);
const checks = [
  ['script-qa', 'scripts/run-electrical-script-qa.mjs'],
  ['creative-qa', 'scripts/run-electrical-creative-qa.mjs'],
  ['static-visual-policy', 'scripts/check-electrical-remotion-quality.mjs'],
  ['static-overlay-qa', 'scripts/check-electrical-callouts.mjs'],
  ['content-package', 'scripts/check-electrical-content-package.mjs'],
];
const results = [];

for (const [id, script] of checks) {
  const result = spawnSync(process.execPath, [script, root], {cwd: process.cwd(), stdio: 'inherit'});
  results.push({id, passed: result.status === 0, exitCode: result.status ?? 1});
}

const passed = results.every((result) => result.passed);
const report = {
  version: 'science-v1',
  visualPolicyVersion: 'science-static-v1',
  generatedAt: new Date().toISOString(),
  passed,
  phase: passed ? 'science-assets-may-be-created' : 'blocked-before-assets',
  results,
  rule: 'Recherche, Skript, Quellen, Bilddramaturgie und Science-Static-Regeln müssen bestehen, bevor finale Bilder und Voice produziert werden.',
};
fs.writeFileSync(path.join(paths.projectDir, 'preproduction-report.json'), `${JSON.stringify(report, null, 2)}\n`);

if (!passed) {
  console.error('Science-Preflight fehlgeschlagen. Finale Bilder und Voice noch nicht produzieren.');
  process.exit(1);
}
console.log('✓ Science-Preflight bestanden. Statische Szenenbilder und Voice dürfen jetzt produziert werden.');
