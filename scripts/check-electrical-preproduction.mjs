#!/usr/bin/env node
import {spawnSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import {electricalProjectPaths, assertElectricalProjectStructure} from './lib/electrical-project-structure.mjs';

const [projectArg] = process.argv.slice(2).filter((arg) => !arg.startsWith('--'));
if (!projectArg) {
  console.error('Nutzung: node scripts/check-electrical-preproduction.mjs <reel-ordner>');
  process.exit(1);
}

const root = path.resolve(projectArg);
assertElectricalProjectStructure(root);
const paths = electricalProjectPaths(root);
const checks = [
  ['script-qa', 'scripts/run-electrical-script-qa.mjs'],
  ['creative-qa', 'scripts/run-electrical-creative-qa.mjs'],
  ['callout-qa', 'scripts/check-electrical-callouts.mjs'],
  ['content-package', 'scripts/check-electrical-content-package.mjs'],
];
const results = [];

for (const [id, script] of checks) {
  const result = spawnSync(process.execPath, [script, root], {cwd: process.cwd(), stdio: 'inherit'});
  results.push({id, passed: result.status === 0, exitCode: result.status ?? 1});
}

const passed = results.every((result) => result.passed);
const report = {
  version: 'electrical-v3',
  generatedAt: new Date().toISOString(),
  passed,
  phase: passed ? 'assets-may-be-created' : 'blocked-before-assets',
  results,
  rule: 'Keine Bilder, Audioaufnahme oder Remotion-Vollproduktion beginnen, bevor Skript, Visuals, technische Callouts und Inhalt geprüft sind.',
};
fs.writeFileSync(path.join(paths.projectDir, 'preproduction-report.json'), `${JSON.stringify(report, null, 2)}\n`);

if (!passed) {
  console.error('Preproduction-Gate fehlgeschlagen. Bilder und Audio noch nicht erzeugen.');
  process.exit(1);
}
console.log('✓ Preproduction-Gate bestanden. Bilder und Audio dürfen jetzt erzeugt werden.');
