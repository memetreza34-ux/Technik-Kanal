#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {ScenePlan} from './lib/electrical-contracts.mjs';
import {electricalProjectPaths} from './lib/electrical-project-structure.mjs';

const [projectArg]=process.argv.slice(2).filter((arg)=>!arg.startsWith('--'));
if(!projectArg) throw new Error('Nutzung: node scripts/science-static-quality.mjs <reel-ordner>');

const root=path.resolve(projectArg);
const paths=electricalProjectPaths(root);
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
  if(scene.renderMode!=='image-only') errors.push(`${scene.id}: nur image-only erlaubt.`);
  if(scene.motionLevel!=='none') errors.push(`${scene.id}: Bewegung ist nicht erlaubt.`);
}

const report={
  version:'science-static-quality-v1',
  generatedAt:new Date().toISOString(),
  passed:errors.length===0,
  sceneCount:scenes.length,
  imageSceneCount:scenes.length,
  animatedSceneCount:0,
  brandVisualStyleChecked:false,
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
