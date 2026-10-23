#!/usr/bin/env node
import {spawnSync} from 'node:child_process';
import path from 'node:path';
import {assertElectricalProjectStructure} from './lib/electrical-project-structure.mjs';
import {SCIENCE_CONTENT_CHECKS} from './lib/science-content-checks.mjs';

// CI-Prüfung eines bereits produzierten Referenzvideos: dieselben Inhaltsprüfungen wie der Preflight.
// Das Lernbrief-Gate (Freigabe des Verbesserungsplans, Auswertung des Vorgängervideos) gilt nur für
// neue Produktionen und ist in validate:science-learning / validate:science-guardrails abgedeckt.
const [projectArg] = process.argv.slice(2).filter((arg) => !arg.startsWith('--'));
if (!projectArg) {
  console.error('Nutzung: npm run science:reference-qa -- <video-ordner>');
  process.exit(1);
}
const root = path.resolve(projectArg);
assertElectricalProjectStructure(root);
const failed = [];
for (const [id, script] of SCIENCE_CONTENT_CHECKS) {
  const result = spawnSync(process.execPath, [script, root], {cwd: process.cwd(), stdio: 'inherit'});
  if (result.status !== 0) failed.push(id);
}
if (failed.length) {
  console.error(`Referenzvideo-Prüfung fehlgeschlagen: ${failed.join(', ')}`);
  process.exit(1);
}
console.log(`✓ Referenzvideo erfüllt alle ${SCIENCE_CONTENT_CHECKS.length} Inhaltsprüfungen: ${path.basename(root)}`);
