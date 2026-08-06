#!/usr/bin/env node
import assert from 'node:assert/strict';
import {loadElectricalConfig} from './lib/load-electrical-config.mjs';
import {evaluateElectricalVisualPolicy} from './lib/electrical-visual-policy.mjs';

const config = loadElectricalConfig();
const shots = ['hero-three-quarter','environmental-medium','macro-detail','controlled-cutaway','cabinet-medium','symmetric-comparison','environmental-wide','macro-detail'];
const sets = ['warm-motor-workshop','warm-motor-workshop','warm-motor-workshop','dark-mechanism-lab','cool-switchgear-cabinet','cool-switchgear-cabinet','daylight-safety-workbench','cool-switchgear-cabinet'];
const scenes = Array.from({length:8},(_,index)=>({
  id:`${String(index+1).padStart(2,'0')}-scene`,
  title:index===0?'Was macht ein Schutzgerät?':`Szene ${index+1}`,
  headline:index===0?'Was macht ein Schutzgerät?':`Klare Aussage ${index+1}`,
  voiceText:index===0?'Was macht ein Schutzgerät? Es schützt bei einem klar erklärten Fehler.':'Diese Szene erklärt genau eine technische Aussage.',
  imageDir:`02-bilder/images/${index+1}`,
  imageLabel:index===0?'Was macht ein Schutzgerät?':`Interne Szene ${index+1}`,
  imageAnnotations:index===1?[{text:'Schutzleiter (PE)',labelX:0.05,labelY:0.3,targetX:0.5,targetY:0.55,accent:'pe'}]:[],
  backgroundFamily:sets[index],
  shotType:shots[index],
  referenceGroup:index<4?'anchor-a':'anchor-b',
  layout:'image-full',
  renderMode:'image-only',
  motionLevel:'subtle',
  imageRole:'hero',
}));
scenes[3]={...scenes[3],renderMode:'mechanism-only',motionLevel:'full',layout:'image-mechanism',imageRole:'mechanism-plate',mechanism:'current-flow',referenceGroup:'mechanism-reference',imageAnnotations:[]};

const plan={
  visualPolicyVersion:'visual-v6-callouts',
  generatedImageTextPolicy:'controlled-german-callouts',
  coverText:'Was macht ein Schutzgerät?',
  animationBudget:{maximum:4,fullMechanismScenes:[scenes[3].id]},
  scenes,
};
const prompt='Use the same uploaded series reference. Create one real dominant subject as cinematic industrial editorial photography with a consistent teal-shadow and warm-highlight color grade. This is not a catalog shot. Full-bleed vertical 9:16 edge-to-edge. No white or gray bars, no letterboxing. No visible text, no labels, no logos or watermark. Top 20 percent calm for the Remotion headline and bottom 25 percent calm for subtitles.';
const prompts=Object.fromEntries(scenes.map((scene)=>[scene.id,scene.renderMode==='mechanism-only'?`REFERENCE BRIEF ONLY for a Remotion mechanism canvas. ${prompt}`:prompt]));
const good=evaluateElectricalVisualPolicy({plan,config,promptFiles:prompts,promptManifest:{generatedImageTextPolicy:'controlled-german-callouts'}});
assert.equal(good.passed,true,good.errors.join('\n'));

const bad=evaluateElectricalVisualPolicy({
  plan:{...plan,generatedImageTextPolicy:'exact-german-short-labels'},
  config,
  promptFiles:Object.fromEntries(scenes.map((scene)=>[scene.id,'Render the exact German headline "WARNUNG" on an isolated product on a blank studio background.'])),
  promptManifest:{generatedImageTextPolicy:'exact-german-short-labels'},
});
assert.equal(bad.passed,false);
assert.ok(bad.errors.some((error)=>error.includes('KI-Schrift')||error.includes('no visible text')||error.includes('Text')));
console.log('✓ Visual-v6 trennt Remotion-Headlines von technischen Bild-Callouts und blockiert KI-Schrift.');
