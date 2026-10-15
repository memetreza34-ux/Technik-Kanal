#!/usr/bin/env node
import {spawnSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import {electricalProjectPaths,assertElectricalProjectStructure} from './lib/electrical-project-structure.mjs';
import {buildScienceSimpleHandoff} from './lib/science-simple-handoff.mjs';
import {checkScienceLearningBrief} from './lib/science-quality-gates.mjs';

const [projectArg]=process.argv.slice(2).filter((arg)=>!arg.startsWith('--'));
if(!projectArg){console.error('Nutzung: npm run science:preflight -- <reel-ordner>');process.exit(1);}
const root=path.resolve(projectArg);
assertElectricalProjectStructure(root);
const paths=electricalProjectPaths(root);
const learning=checkScienceLearningBrief(root);
if(!learning.passed){console.error('Verbesserungspflicht vor jeder Produktion nicht erfüllt:');learning.errors.forEach(e=>console.error('- '+e));process.exit(1);}
const checks=[
  ['script-qa','scripts/science-script-qa.mjs'],
  ['creative-qa','scripts/science-creative-qa.mjs'],
  ['static-quality','scripts/science-static-quality.mjs'],
  ['overlay-qa','scripts/science-overlay-qa.mjs'],
  ['content-package','scripts/science-content-package.mjs']
];
const results=[];
for(const [id,script] of checks){
  const result=spawnSync(process.execPath,[script,root],{cwd:process.cwd(),stdio:'inherit'});
  results.push({id,passed:result.status===0,exitCode:result.status??1});
}
const passed=results.every((result)=>result.passed);
const report={version:'science-v1',generatedAt:new Date().toISOString(),passed,phase:passed?'assets-may-be-created':'blocked-before-assets',results,rule:'Keine Bilder oder Audio produzieren, bevor Skript, Quellen, statische Bilddramaturgie und Inhalt geprüft sind.'};
fs.writeFileSync(path.join(paths.projectDir,'preproduction-report.json'),`${JSON.stringify(report,null,2)}\n`);
if(!passed){console.error('Science-Preflight fehlgeschlagen. Produktion noch nicht starten.');process.exit(1);}
try{
  const handoff=buildScienceSimpleHandoff({
    projectDir:root,
    repoRoot:path.resolve(process.cwd()),
    repository:process.env.GITHUB_REPOSITORY??'memetreza34-ux/Technik-Kanal',
    ref:process.env.SCIENCE_GITHUB_REF??'science-channel-v1'
  });
  console.log('✓ Science-Preflight und Phase 1 bestanden. Bilder und Voice dürfen jetzt produziert werden.');
  console.log('✓ Einfacher START-HIER-Ordner: ein Fließtext, EIN Google-Flow-Prompt mit Cover und allen Szenen sowie DATEIEN-HIER-REIN: '+handoff.folder);
  console.log('✓ NACH COMMIT/PUSH DEN DIREKTLINK SENDEN: '+handoff.url);
  console.log('  Wichtig: Dieser Link funktioniert erst, nachdem die Datei im GitHub-Branch gespeichert wurde.');
}catch(error){
  report.passed=false;
  report.phase='blocked-before-assets';
  report.results.push({id:'phase1-handoff',passed:false,error:error.message});
  fs.writeFileSync(path.join(paths.projectDir,'preproduction-report.json'),`${JSON.stringify(report,null,2)}\n`);
  console.error('Phase-1-Übergabe fehlgeschlagen: '+error.message);
  process.exit(1);
}
