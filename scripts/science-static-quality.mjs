#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {ScenePlan} from './lib/electrical-contracts.mjs';
import {electricalProjectPaths} from './lib/electrical-project-structure.mjs';
import {loadElectricalConfig} from './lib/load-electrical-config.mjs';

const [projectArg]=process.argv.slice(2).filter((arg)=>!arg.startsWith('--'));
if(!projectArg) throw new Error('Nutzung: node scripts/science-static-quality.mjs <reel-ordner>');

const root=path.resolve(projectArg);
const paths=electricalProjectPaths(root);
const config=loadElectricalConfig();
const plan=ScenePlan.parse(JSON.parse(fs.readFileSync(paths.scenePlan,'utf8')));
const errors=[];
const warnings=[];
const scenes=plan.scenes;

for(const scene of scenes){
  if(!scene.visualRecipe) errors.push(`${scene.id}: visualRecipe fehlt.`);
  else {
    if(/ergänzen|passend zum thema|schwerpunkt der szene/i.test(scene.visualRecipe.subject)) errors.push(`${scene.id}: visualRecipe.subject ist noch Platzhalter.`);
    if(scene.visualRecipe.callouts.length>2) errors.push(`${scene.id}: maximal zwei kontrollierte statische Callouts.`);
  }
}

const shotTypes=new Set(scenes.map((scene)=>scene.visualRecipe?.camera??scene.shotType).filter(Boolean));
if(shotTypes.size<config.visuals.minimumShotTypes) errors.push(`Nur ${shotTypes.size} Kameratypen; mindestens ${config.visuals.minimumShotTypes} erforderlich.`);

const stages=new Set(scenes.map((scene)=>scene.visualRecipe?.stage).filter(Boolean));
if(stages.size<config.visuals.minimumStageFamilies) errors.push(`Nur ${stages.size} wissenschaftliche Set-Familien; mindestens ${config.visuals.minimumStageFamilies} erforderlich.`);

let run=1;
for(let i=1;i<scenes.length;i+=1){
  const a=scenes[i-1].visualRecipe?.stage;
  const b=scenes[i].visualRecipe?.stage;
  if(a&&a===b){
    run+=1;
    if(run>config.visuals.maximumSameStageConsecutive) errors.push(`Zu viele identische Set-Familien hintereinander bei ${scenes[i].id}.`);
  } else run=1;
}

const report={
  version:'science-static-quality-v1',
  generatedAt:new Date().toISOString(),
  passed:errors.length===0,
  sceneCount:scenes.length,
  imageSceneCount:scenes.length,
  animatedSceneCount:0,
  errors,
  warnings
};
fs.writeFileSync(path.join(paths.projectDir,'static-quality-report.json'),`${JSON.stringify(report,null,2)}\n`);

if(errors.length){
  console.error('Science-Static-Qualitätsgate fehlgeschlagen:');
  errors.forEach((error)=>console.error(`- ${error}`));
  process.exit(1);
}
console.log(`✓ Science-Static-Gate bestanden: ${scenes.length} statische Bildszenen.`);
