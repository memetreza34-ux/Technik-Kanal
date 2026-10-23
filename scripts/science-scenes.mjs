#!/usr/bin/env node
// Szenenzahl eines Videos an sein Script anpassen.
//   npm run science:scenes -- "<video-ordner>" --anzahl=72   Gerüst für 72 Szenen (vor dem Füllen)
//   npm run science:scenes -- "<video-ordner>" --neu-verteilen   nach manuellem Hinzufügen/Löschen
import {projectPaths} from './lib/electrical-project.mjs';
import {rebalanceScienceImageSteps, setScienceSceneCount} from './lib/science-scenes.mjs';

const args = process.argv.slice(2);
const projectArg = args.find((arg) => !arg.startsWith('--'));
const countArg = args.find((arg) => arg.startsWith('--anzahl='))?.slice('--anzahl='.length);
const rebalance = args.includes('--neu-verteilen');
if (!projectArg || (!countArg && !rebalance)) {
  console.error('Nutzung: npm run science:scenes -- "<video-ordner>" --anzahl=<N>  oder  --neu-verteilen');
  process.exit(1);
}
try {
  const {root} = projectPaths(projectArg);
  const result = rebalance ? rebalanceScienceImageSteps({root}) : setScienceSceneCount({root, count: Number(countArg)});
  console.log(`✓ ${result.count} Szenen, Flow-Bildschritte: ${result.steps.join(' / ')} Bilder.`);
} catch (error) {
  console.error(`✗ ${error.message}`);
  process.exit(1);
}
