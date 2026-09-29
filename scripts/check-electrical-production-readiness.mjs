#!/usr/bin/env node
import path from 'node:path';
import {repositoryRoot, run} from './lib/electrical-project.mjs';

const [projectArg] = process.argv.slice(2).filter((arg) => !arg.startsWith('--'));
if (!projectArg) {
  console.error('Nutzung: npm run science:ready -- <reel-ordner>');
  process.exit(1);
}

const project = path.resolve(projectArg);

// Öffentliche Medien sind im Science-Kanal optional und werden niemals automatisch
// als Ersatz für geplante Szenenbilder heruntergeladen. Readiness prüft nur die
// tatsächlich freigegebenen Produktionsassets.
run(process.execPath, ['scripts/check-electrical-preproduction.mjs', project], {cwd: repositoryRoot});
run(process.execPath, ['scripts/check-electrical-required-media.mjs', project], {cwd: repositoryRoot});
run(process.execPath, ['scripts/check-electrical-image-appearance.mjs', project], {cwd: repositoryRoot});
run(process.execPath, ['scripts/check-electrical-readiness.mjs', project], {cwd: repositoryRoot});

console.log('✓ Science-Readiness bestanden: Preflight, Voice, alle statischen Szenenbilder, Bild-QA und Produktionsvertrag sind vollständig.');
