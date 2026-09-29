#!/usr/bin/env node
import assert from 'node:assert/strict';
import {loadElectricalConfig} from './lib/load-electrical-config.mjs';
import {evaluateElectricalVisualPolicy} from './lib/electrical-visual-policy.mjs';

const config=loadElectricalConfig();
const stages=['scientific-dark','laboratory','micro','technical','comparison','material','space','diagram'];
const cameras=['hero','macro','micro','cutaway','comparison','wide','orbital','cross-section'];
const scenes=Array.from({length:8},(_,index)=>({
  id:`${String(index+1).padStart(2,'0')}-scene`,
  title:index===0?'Warum passiert das?':`Szene ${index+1}`,
  headline:index===0?'Warum passiert das?':`Klare Aussage ${index+1}`,
  voiceText:index===0?'Warum passiert das? Die direkte Antwort folgt sofort.':'Diese Szene erklärt genau eine wissenschaftliche Aussage.',
  imageDir:`02-bilder/images/${index+1}`,
  backgroundFamily:`science-${stages[index]}`,
  shotType:cameras[index],
  referenceGroup:'science-editorial-v1',
  visualRecipe:{stage:stages[index],camera:cameras[index],subject:`wissenschaftliches Hauptmotiv ${index+1}`,focus:'eine klare wissenschaftliche Aussage',motion:'none',callouts:[]},
  layout:'image-full',
  renderMode:'image-only',
  motionLevel:'none',
  imageRole:index===0?'hero':'concept'
}));

const plan={
  visualPolicyVersion:'science-static-v1',
  generatedImageTextPolicy:'none',
  coverText:'Warum passiert das?',
  scenes
};
const manifest={requiredVisibleSceneImages:8,cover:{sourceSceneId:'01-scene'}};
const good=evaluateElectricalVisualPolicy({plan,config,promptFiles:Object.fromEntries(scenes.map((scene)=>[scene.id,'Cinematic Scientific 3D Editorial. No visible text.'])),promptManifest:manifest});
assert.equal(good.passed,true,good.errors.join('\n'));

const badScenes=scenes.map((scene,index)=>index===3?{...scene,motionLevel:'full',renderMode:'mechanism-only',mechanism:'forbidden-animation'}:scene);
const bad=evaluateElectricalVisualPolicy({plan:{...plan,scenes:badScenes},config,promptFiles:{},promptManifest:manifest});
assert.equal(bad.passed,false);
assert.ok(bad.errors.some((error)=>error.includes('Animation')||error.includes('Mechanismus')||error.includes('image-only')));

console.log('✓ Science Static erzwingt statische Bildszenen, Bild 01 als Coverquelle und null Animation.');
