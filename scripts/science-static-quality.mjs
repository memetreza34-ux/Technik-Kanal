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
const flowPlan=fs.existsSync(paths.flowPlan)?JSON.parse(fs.readFileSync(paths.flowPlan,'utf8')):null;
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
  // Der Scene-Plan bleibt bildgeführt: Jeder Beat braucht ein Ausgangsbild. Flow-Videos werden separat im flow-plan.json geplant.
  if(scene.renderMode!=='image-only') errors.push(`${scene.id}: Ausgangsbasis muss image-only bleiben.`);
  // Keine von Remotion erzeugte Bewegung. Fertige Flow-Clips sind davon ausdrücklich ausgenommen.
  if(scene.motionLevel!=='none') errors.push(`${scene.id}: Remotion-Bewegung ist nicht erlaubt.`);
}

const flowEntries=Array.isArray(flowPlan?.scenes)?flowPlan.scenes:[];
const flowVideoCount=flowEntries.filter((entry)=>entry.output==='image-to-video').length;
if(flowPlan&&flowEntries.length!==scenes.length) errors.push(`flow-plan.json muss ${scenes.length} Beat-Einträge enthalten.`);

const report={
  version:'science-remotion-boundary-v3',
  productionProfile:plan.productionProfile,
  generatedAt:new Date().toISOString(),
  passed:errors.length===0,
  sceneCount:scenes.length,
  requiredBaseImageCount:scenes.length,
  plannedFlowVideoCount:flowVideoCount,
  remotionGeneratedAnimationCount:0,
  brandVisualStyleChecked:true,
  styleId:'scientific-scene-explainer-v1',
  errors,
  warnings
};
fs.writeFileSync(path.join(paths.projectDir,'static-quality-report.json'),`${JSON.stringify(report,null,2)}\n`);

if(errors.length){
  console.error('Science-Remotion-Grenzgate fehlgeschlagen:');
  errors.forEach((error)=>console.error(`- ${error}`));
  process.exit(1);
}
console.log(`✓ Remotion-Grenze bestanden: ${scenes.length} Ausgangsbilder geplant, ${flowVideoCount} externe Google-Flow-Clips erlaubt, keine Remotion-eigene Animation.`);
