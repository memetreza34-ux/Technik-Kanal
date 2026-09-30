#!/usr/bin/env node
import assert from 'node:assert/strict';
import {loadElectricalConfig} from './lib/load-electrical-config.mjs';
import {evaluateScienceVisualPolicy} from './lib/science-visual-policy.mjs';

const config=loadElectricalConfig();
const scenes=Array.from({length:8},(_,index)=>({
  id:`${String(index+1).padStart(2,'0')}-scene`,
  title:index===0?'Warum passiert das?':`Szene ${index+1}`,
  headline:index===0?'Warum passiert das?':`Klare Aussage ${index+1}`,
  voiceText:index===0?'Warum passiert das? Die direkte Antwort folgt sofort.':'Diese Szene erklärt genau eine wissenschaftliche Aussage.',
  imageDir:`02-bilder/images/${index+1}`,
  backgroundFamily:'unassigned',
  shotType:'unspecified',
  referenceGroup:'visual-style-unset',
  visualRecipe:{stage:'unspecified',camera:'unspecified',subject:`wissenschaftliches Hauptmotiv ${index+1}`,focus:'eine klare wissenschaftliche Aussage',motion:'none',callouts:[]},
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
const manifest={generatedImageTextPolicy:'none',requiredVisibleSceneImages:8,cover:{sourceSceneId:'01-scene',candidateCount:3}};
const prompts=Object.fromEntries(scenes.map((scene)=>[scene.id,'Neutral image prompt. No visible text. Vertical 9:16.']));
const good=evaluateScienceVisualPolicy({plan,config,promptFiles:prompts,promptManifest:manifest});
assert.equal(good.passed,true,good.errors.join('\n'));

const bad=evaluateScienceVisualPolicy({plan,config,promptFiles:{...prompts,'04-scene':undefined},promptManifest:{...manifest,requiredVisibleSceneImages:7}});
assert.equal(bad.passed,false);
assert.ok(bad.errors.some((error)=>error.includes('Einzelprompt')||error.includes('erwartet 8')));

console.log('✓ Science Visual Policy prüft nur den statischen Bildvertrag, nicht eine feste Bildwelt.');
