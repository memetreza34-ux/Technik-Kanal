#!/usr/bin/env node
import assert from 'node:assert/strict';
import {loadElectricalConfig} from './lib/load-electrical-config.mjs';
import {evaluateElectricalVisualPolicy} from './lib/electrical-visual-policy.mjs';

const config=loadElectricalConfig();
const stages=['industrial-dark','workbench','diagram','warning','diagram','switchgear','comparison','workbench','warning'];
const cameras=['hero','macro','side','cutaway','side','hero','comparison','macro','wide'];
const scenes=Array.from({length:9},(_,index)=>({
  id:`${String(index+1).padStart(2,'0')}-scene`,
  title:index===0?'Was macht ein Schutzgerät?':`Szene ${index+1}`,
  headline:index===0?'Was macht ein Schutzgerät?':`Klare Aussage ${index+1}`,
  voiceText:index===0?'Was macht ein Schutzgerät? Es schützt bei einem klar erklärten Fehler.':'Diese Szene erklärt genau eine technische Aussage.',
  imageDir:`02-bilder/images/${index+1}`,
  backgroundFamily:`remotion-${stages[index]}`,
  shotType:cameras[index],
  referenceGroup:'remotion-system',
  visualRecipe:{stage:stages[index],camera:cameras[index],subject:`technisches Hauptmotiv ${index+1}`,focus:'eine klare technische Aussage',motion:[2,4,6].includes(index)?'process':'subtle',callouts:[]},
  layout:'image-mechanism',
  renderMode:'mechanism-only',
  motionLevel:[2,4,6].includes(index)?'full':'subtle',
  mechanism:`visual-${index+1}`,
  imageRole:'mechanism-plate',
}));
const plan={visualPolicyVersion:'remotion-first-v2',generatedImageTextPolicy:'none',coverText:'Was macht ein Schutzgerät?',animationBudget:{maximum:4,fullMechanismScenes:scenes.filter((scene)=>scene.motionLevel==='full').map((scene)=>scene.id)},scenes};
const good=evaluateElectricalVisualPolicy({plan,config,promptFiles:{},promptManifest:{requiredVisibleSceneImages:0}});
assert.equal(good.passed,true,good.errors.join('\n'));
const badScenes=scenes.map((scene,index)=>index<5?{...scene,renderMode:'image-only',motionLevel:'subtle'}:scene);
const bad=evaluateElectricalVisualPolicy({plan:{...plan,scenes:badScenes},config,promptFiles:{},promptManifest:{requiredVisibleSceneImages:5}});
assert.equal(bad.passed,false);
assert.ok(bad.errors.some((error)=>error.includes('externe Bildszenen')||error.includes('Remotion-Szenen')));
console.log('✓ Remotion-first v2 erzwingt überwiegend codebasierte Szenen und begrenzt öffentliche Bilder.');
