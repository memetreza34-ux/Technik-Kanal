#!/usr/bin/env node
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {buildSciencePhase1Handoff} from './lib/science-phase1-handoff.mjs';

const repoRoot=fs.mkdtempSync(path.join(os.tmpdir(),'wissonaut-phase1-'));
const projectDir=path.join(repoRoot,'channels/science/reels/2026-10-05/01-Demo');
const save=(file,content)=>{const name=path.join(projectDir,file);fs.mkdirSync(path.dirname(name),{recursive:true});fs.writeFileSync(name,typeof content==='string'?content:JSON.stringify(content));return name;};
try{
  const scenes=Array.from({length:5},(_,i)=>({id:(i+1)+'-scene',voiceText:'Echte Erklärung Nummer '+(i+1)+'.'}));
  const cover='Create three 1280x720 thumbnail candidates for an educational video.';
  const prompts=scenes.map(s=>'ONE STATIC IMAGE '+s.id+' explain electrical physics with a 2.5D vector cutaway.');
  save('06-projektdateien/scene-plan.json',{slug:'demo',title:'Wissonaut Test',scenes});
  save('06-projektdateien/flow-plan.json',{imageOnly:true,imageProductionSteps:5,scenes:scenes.map(s=>({id:s.id})),steps:scenes.map((s,i)=>({step:i+1,sceneIds:[s.id]}))});
  save('06-projektdateien/preproduction-report.json',{passed:true,phase:'assets-may-be-created'});
  save('01-script-audio/script.md','# Echtes Testskript mit Erklärung');
  save('02-bilder/GOOGLE-FLOW-MASTER-PROMPT.txt',['Technical Editorial Explainer 2.5D','VISIBLE TEXT LOCK',cover,...prompts].join('\n\n'));
  save('02-bilder/prompts/00-thumbnail.txt',cover);
  scenes.forEach((s,i)=>save('02-bilder/prompts/'+s.id+'.txt',prompts[i]));
  const opts={projectDir,repoRoot};
  const done=buildSciencePhase1Handoff(opts);
  const text=fs.readFileSync(done.output,'utf8');
  assert.equal(done.sceneCount,5);
  assert.match(done.url,/PHASE-1-START-HIER\.md$/);
  assert.ok(text.includes('Echte Erklärung Nummer 5.'));
  assert.ok(text.includes('02-bilder/prompts/5-scene.txt'));
  assert.ok(text.includes('Technical Editorial Explainer 2.5D'));
  assert.equal(text,fs.readFileSync(buildSciencePhase1Handoff(opts).output,'utf8'));
  // A normal workflow instruction about placeholders must not be mistaken for a real placeholder.
  const masterFile='02-bilder/GOOGLE-FLOW-MASTER-PROMPT.txt';
  save(masterFile,['Technical Editorial Explainer 2.5D','VISIBLE TEXT LOCK','Never use a placeholder as a video frame.',cover,...prompts].join('\n\n'));
  buildSciencePhase1Handoff(opts);
  // But even a single changed prompt must invalidate a stale master.
  save('02-bilder/prompts/2-scene.txt',prompts[1]+' Additional verified detail.');
  assert.throws(()=>buildSciencePhase1Handoff(opts),/Masterprompt nicht aktuell/);
  save('02-bilder/prompts/2-scene.txt',prompts[1]);
  save('06-projektdateien/preproduction-report.json',{passed:false,phase:'blocked-before-assets'});
  assert.throws(()=>buildSciencePhase1Handoff(opts),/noch nicht freigegeben/);
  save('06-projektdateien/preproduction-report.json',{passed:true,phase:'assets-may-be-created'});
  fs.unlinkSync(path.join(projectDir,'02-bilder/prompts/3-scene.txt'));
  assert.throws(()=>buildSciencePhase1Handoff(opts),/Bildprompt fehlt/);
  console.log('✓ Phase-1-Übergabe: alle Prompts/Skript/Link, fünf Schritte, No-Overwrite, Preflight- und Vollständigkeitsgate.');
}finally{fs.rmSync(repoRoot,{recursive:true,force:true});}
