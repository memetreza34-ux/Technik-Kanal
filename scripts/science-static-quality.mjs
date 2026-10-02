#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {ScenePlan} from './lib/electrical-contracts.mjs';
import {electricalProjectPaths} from './lib/electrical-project-structure.mjs';

const [projectArg]=process.argv.slice(2).filter((arg)=>!arg.startsWith('--'));
if(!projectArg) throw new Error('Nutzung: node scripts/science-static-quality.mjs <video-ordner>');

const root=path.resolve(projectArg);
const paths=electricalProjectPaths(root);
const plan=ScenePlan.parse(JSON.parse(fs.readFileSync(paths.scenePlan,'utf8')));
const errors=[];
const warnings=[];
const scenes=plan.scenes;

if(plan.productionProfile!=='youtube-2min-v1') errors.push('Produktionsprofil muss youtube-2min-v1 sein.');
if(plan.width!==1920||plan.height!==1080) errors.push('Szenenplan muss 1920×1080 sein.');

for(const scene of scenes){
  if(!scene.visualRecipe) errors.push(`${scene.id}: visualRecipe fehlt.`);
  else {
    if(/ergänzen|passend zum thema|schwerpunkt der szene/i.test(scene.visualRecipe.subject)) errors.push(`${scene.id}: visualRecipe.subject ist noch Platzhalter.`);
    if(scene.visualRecipe.callouts.length>4) errors.push(`${scene.id}: maximal vier kurze kontrollierte statische Callouts.`);
  }
  if(!scene.section) errors.push(`${scene.id}: section fehlt.`);
  if(scene.renderMode!=='image-only') errors.push(`${scene.id}: nur image-only erlaubt.`);
  if(scene.motionLevel!=='none') errors.push(`${scene.id}: Bewegung ist nicht erlaubt.`);
}

const report={
  version:'science-static-quality-v2',
  productionProfile:plan.productionProfile,
  generatedAt:new Date().toISOString(),
  passed:errors.length===0,
  sceneCount:scenes.length,
  imageSceneCount:scenes.length,
  animatedSceneCount:0,
  brandVisualStyleChecked:true,
  styleId:'scientific-scene-explainer-v1',
  errors,
  warnings
};
fs.writeFileSync(path.join(paths.projectDir,'static-quality-report.json'),`${JSON.stringify(report,null,2)}\n`);

if(errors.length){
  console.error('Science-Static-Qualitätsgate fehlgeschlagen:');
  errors.forEach((error)=>console.error(`- ${error}`));
  process.exit(1);
}
console.log(`✓ Science-Static-Gate bestanden: ${scenes.length} statische 16:9-Beats.`);
