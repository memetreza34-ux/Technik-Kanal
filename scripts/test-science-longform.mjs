#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {ScenePlan} from './lib/electrical-contracts.mjs';
import {loadElectricalConfig} from './lib/load-electrical-config.mjs';
import {createElectricalScenePlanTemplate} from './lib/create-electrical-scene-plan-template.mjs';

const root = path.resolve('channels/science/reels/2026-10-05_bis_2026-10-11/01_Wie-kommt-Strom-in-deine-Steckdose');
const json = file => JSON.parse(fs.readFileSync(path.join(root,file),'utf8'));
const plan = ScenePlan.parse(json('06-projektdateien/scene-plan.json'));
const flow = json('06-projektdateien/flow-plan.json');
const profile = loadElectricalConfig(plan.productionProfile);
const words = plan.scenes.map(s=>s.voiceText).join(' ').trim().split(/\s+/).length;
const exportText = fs.readFileSync(path.join(root,'05-export/skript-mit-zeitstempeln.txt'),'utf8');
const youtube = fs.readFileSync(path.join(root,'05-export/youtube-caption.txt'),'utf8');
const master = fs.readFileSync(path.join(root,'02-bilder/GOOGLE-FLOW-MASTER-PROMPT.txt'),'utf8');
const errors = [];
if(plan.productionProfile!=='youtube-6to7min-v1') errors.push('Profil ist nicht lang.');
if(plan.scenes.length<34 || plan.scenes.length>50) errors.push('Langvideo-Szenenzahl außerhalb des Profils.');
if(words<profile.script.words.min||words>profile.script.words.max) errors.push('Sprechtext nicht im Wortbudget.');
if(flow.scenes.length!==plan.scenes.length) errors.push('Flow-Beats stimmen nicht mit Skript.');
if(flow.steps.length!==5||flow.steps.flatMap(x=>x.sceneIds).join()!==plan.scenes.map(s=>s.id).join()) errors.push('Fünf Bildschritte falsch.');
if(new Set(flow.scenes.map(s=>s.visualType)).size<7) errors.push('Nicht genug Visual-Typen.');
if(!flow.imageOnly||flow.phase3MayGenerateVisualAssets!==false) errors.push('Images-only Phase-3-Lock fehlt.');
if(!youtube.includes('Titel:')||!youtube.includes('Beschreibung:')) errors.push('Einheitliche Caption-Datei unvollständig.');
const transcriptLines=exportText.split('\n').filter(s=>/^\d{2}:\d{2}–\d{2}:\d{2}: /.test(s));
if(transcriptLines.length!==plan.scenes.length) errors.push('Zeitgestempeltes Skript nicht vollständig.');
for(let i=0;i<plan.scenes.length;i++){
  const s=plan.scenes[i];
  if(!transcriptLines[i]?.endsWith(s.voiceText)) errors.push('Gesprochener Text unvollständig bei '+s.id);
  const p=fs.readFileSync(path.join(root,'02-bilder/prompts',s.id+'.txt'),'utf8');
  if(!p.includes('Technical Editorial Explainer 2.5D')||!p.includes('VISIBLE TEXT LOCK')) errors.push('Prompt-Lock fehlt bei '+s.id);
}
if(flow.coverNeverUsedAsVideoFrame!==true||flow.scene01IndependentFromCover!==true||flow.coverExportDir!=='05-export/cover') errors.push('Cover-Szenentrennung fehlt.');
if(plan.scenes[0].visualRecipe?.stage==='cover-continuation') errors.push('Hook darf Cover-Motiv nicht fortsetzen.');
if(!master.includes('05-export/cover')) errors.push('Separater Cover-Export fehlt im Master.');
if(!master.includes('THREE')&&!master.includes('three')) errors.push('Thumbnail-Wahl fehlt im Master.');
if(!master.includes('NO')&&!master.includes('NEVER')) errors.push('Bildmetadatenverbot fehlt.');
const sample = ScenePlan.parse(createElectricalScenePlanTemplate({slug:'longform-test',sceneCount:42,productionProfile:'youtube-6to7min-v1'}));
if(sample.scenes.length!==42||sample.productionProfile!=='youtube-6to7min-v1') errors.push('Neuer Langvideo-Scaffold ungültig.');
if(errors.length){errors.forEach(e=>console.error('FAIL '+e));process.exit(1);}
console.log('✓ 6–7-Minuten-Profil: '+words+' Wörter, '+plan.scenes.length+' Szenen, alle Prompts und Export-Zeitfenster geprüft.');
