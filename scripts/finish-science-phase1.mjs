#!/usr/bin/env node
import path from 'node:path';
import {repositoryRoot,run} from './lib/electrical-project.mjs';

const args=process.argv.slice(2);
const projectArg=args.find(value=>!value.startsWith('--'));
if(!projectArg)throw Error('Nutzung: npm run science:phase1 -- <video-ordner>');
const root=path.resolve(projectArg);

// Ein Abschlussbefehl: Einzelprompts absichern, Masterprompt synchronisieren,
// Phase-1-Qualitätsprüfungen ausführen und kopierfertige GitHub-Startseite bauen.
run(process.execPath,['scripts/build-google-flow-master-prompt-safe.mjs',root],{cwd:repositoryRoot});
run(process.execPath,['scripts/science-preflight.mjs',root],{cwd:repositoryRoot});
console.log('✓ Phase-1-Abschluss abgeschlossen. Jetzt ALLE finalen Skript- und Promptdateien sowie PHASE-1-START-HIER.md auf GitHub committen/pushen und dem Nutzer den ausgegebenen Direktlink senden.');
