#!/usr/bin/env node
import assert from 'node:assert/strict';
import {loadElectricalConfig} from './lib/load-electrical-config.mjs';
import {evaluateScienceVisualPolicy} from './lib/science-visual-policy.mjs';

const config=loadElectricalConfig();
const scenes=Array.from({length:12},(_,index)=>({
  id:`${String(index+1).padStart(2,'0')}-scene`,
  title:index===0?'Warum passiert das?':`Szene ${index+1}`,
  headline:index===0?'Warum passiert das?':`Klare Aussage ${index+1}`,
  voiceText:index===0?'Warum passiert das? Die Erklärung beginnt sofort.':'Diese Szene erklärt eine klare visuelle Aussage.',
  imageDir:`02-bilder/images/${index+1}`,
  section:index===0?'hook':index===11?'payoff':index<3?'context':index<5?'foundation':index<9?'mechanism':'deepening',
  backgroundFamily:'content-driven',
  shotType:'beat-driven',
  referenceGroup:'scientific-scene-explainer',
  visualRecipe:{stage:'passend zum visuellen Beat',camera:'passend zur verständlichsten Darstellung',subject:`wissenschaftliches Hauptmotiv ${index+1}`,focus:'eine klare visuelle Aussage',motion:'none',callouts:[]},
  layout:'image-full',
  renderMode:'image-only',
  motionLevel:'none',
  imageRole:index===0?'hero':index===11?'payoff':'concept'
}));

const plan={
  productionProfile:'youtube-2min-v1',
  visualPolicyVersion:'science-static-v1',
  generatedImageTextPolicy:'controlled-german-only',
  width:1920,
  height:1080,
  scenes
};
const manifest={
  styleId:'scientific-scene-explainer-v1',
  generatedImageTextPolicy:'controlled-german-only',
  visibleImageLanguage:'de',
  requiredVisibleSceneImages:12,
  cover:{imageRequired:false,sourceSceneId:null,candidateCount:0,separateThumbnailForbidden:false},
  thumbnail:{required:true,separateFromVideoScenes:true,width:1280,height:720,candidateCount:3}
};
const prompts=Object.fromEntries(scenes.map((scene)=>[scene.id,'Scientific Scene Explainer. Eine visuelle Hauptaussage. Sichtbarer Text nur auf Deutsch. 16:9 landscape.']));
const good=evaluateScienceVisualPolicy({plan,config,promptFiles:prompts,promptManifest:manifest});
assert.equal(good.passed,true,good.errors.join('\n'));

const bad=evaluateScienceVisualPolicy({plan,config,promptFiles:{...prompts,'04-scene':undefined},promptManifest:{...manifest,requiredVisibleSceneImages:11}});
assert.equal(bad.passed,false);
assert.ok(bad.errors.some((error)=>error.includes('Einzelprompt')||error.includes('erwartet 12')));

console.log('✓ Science Visual Policy prüft 16:9-Longform, statische Beats und separates Thumbnail.');
