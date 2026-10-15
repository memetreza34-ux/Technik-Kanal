#!/usr/bin/env node
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {buildScienceSimpleHandoff} from './lib/science-simple-handoff.mjs';

const args=process.argv.slice(2);
const projectArg=args.find(s=>!s.startsWith('--'));
if(!projectArg)throw Error('Nutzung: node scripts/science-phase1-handoff.mjs <video-ordner> [--ref=branch] [--repo=owner/repo]');
const arg=name=>args.find(s=>s.startsWith('--'+name+'='))?.slice(name.length+3);
const repoRoot=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const result=buildScienceSimpleHandoff({
  projectDir:path.resolve(projectArg),repoRoot,
  repository:arg('repo')??process.env.GITHUB_REPOSITORY??'memetreza34-ux/Technik-Kanal',
  ref:arg('ref')??process.env.SCIENCE_GITHUB_REF??'science-channel-v1'
});
console.log('✓ PHASE 1: Ein Fließtext, ein Coverprompt, fünf Flow-Pakete und ein Datei-Ablageordner für '+result.sceneCount+' Bilder.');
console.log('START-HIER-Ordner: '+result.folder);
console.log('LINK NACH COMMIT/PUSH DEM NUTZER SENDEN: '+result.url);
console.log('Hinweis: Nur eine bereits auf GitHub gespeicherte Kopiermappe ist über den Link erreichbar.');
