#!/usr/bin/env node
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import assert from 'node:assert/strict';
import {buildScienceSimpleHandoff} from './lib/science-simple-handoff.mjs';
import {importScienceDrop} from './lib/science-simple-import.mjs';

const repoRoot=fs.mkdtempSync(path.join(os.tmpdir(),'technik-einfach-'));
const slug='test-video',projectDir=path.join(repoRoot,'channels/science/reels/2026-Woche/01-Test');
const put=(rel,value)=>{const p=path.join(projectDir,rel);fs.mkdirSync(path.dirname(p),{recursive:true});fs.writeFileSync(p,typeof value==='string'?value:JSON.stringify(value));};
try{
  const scenes=Array.from({length:5},(_,i)=>({id:String(i+1).padStart(2,'0')+'-context',voiceText:'Wissenschaft Nummer '+(i+1)+'.',imageDir:'02-bilder/images/'+String(i+1).padStart(2,'0')+'-context'}));
  const voice=scenes.map(s=>s.voiceText).join('\n\n');
  put('06-projektdateien/scene-plan.json',{slug,scenes});
  put('06-projektdateien/flow-plan.json',{steps:scenes.map((x,i)=>({step:i+1,sceneIds:[x.id]}))});
  put('06-projektdateien/preproduction-report.json',{passed:true,phase:'assets-may-be-created'});
  put('01-script-audio/voiceover.txt',voice+'\n');
  put('02-bilder/prompts/00-thumbnail.txt','THUMBNAIL: drei Coverkandidaten.');
  for(const s of scenes)put('02-bilder/prompts/'+s.id+'.txt','ONE STATIC IMAGE '+s.id+'\nTechnical Editorial Explainer 2.5D\nVISIBLE TEXT LOCK\n');
  const handoff=buildScienceSimpleHandoff({repoRoot,projectDir});
  assert.equal(fs.readFileSync(handoff.script,'utf8').trim(),voice);
  assert.ok(fs.existsSync(path.join(handoff.folder,'07-FLOW-BILDER-5.txt')));
  assert.equal(fs.readdirSync(handoff.folder).filter(f=>f.endsWith('.txt')).length,7);
  const drop=handoff.dropFolder;
  fs.writeFileSync(path.join(drop,'01.png'),'first-image');
  fs.writeFileSync(path.join(drop,'02-context-final.png'),'second-image');
  fs.writeFileSync(path.join(drop,'00-thumbnail-final.png'),'cover');
  fs.writeFileSync(path.join(drop,'voiceover-raw.wav'),'voice-file');
  const result=importScienceDrop({repoRoot,packageDir:handoff.folder});
  assert.equal(result.copied.length,4);
  assert.equal(result.missing.length,3);
  assert.ok(fs.existsSync(path.join(projectDir,'02-bilder/images/01-context/01-context-final.png')));
  assert.ok(fs.existsSync(path.join(projectDir,'05-export/cover/00-thumbnail-final.png')));
  assert.ok(fs.existsSync(path.join(projectDir,'01-script-audio/audio/voiceover-raw.wav')));
  assert.equal(importScienceDrop({repoRoot,packageDir:handoff.folder}).copied.length,0);
  fs.writeFileSync(path.join(drop,'01.png'),'changed-image');
  assert.throws(()=>importScienceDrop({repoRoot,packageDir:handoff.folder}),/nicht automatisch überschreiben/);
  fs.writeFileSync(path.join(drop,'01.png'),'first-image');
  fs.writeFileSync(path.join(drop,'02.png'),'second-copy');
  assert.throws(()=>importScienceDrop({repoRoot,packageDir:handoff.folder}),/Mehrere Bilder/);
  fs.unlinkSync(path.join(drop,'02.png'));
  put('06-projektdateien/preproduction-report.json',{passed:false,phase:'blocked'});
  assert.throws(()=>buildScienceSimpleHandoff({repoRoot,projectDir}),/noch nicht freigegeben/);
  console.log('✓ Technik-Kanal Ein-Ordner-Arbeitsplatz: 7 Texte, sicherer Medienimport, Idempotenz, Konflikt-/Duplikatprüfung und Preflight-Gate.');
}finally{fs.rmSync(repoRoot,{recursive:true,force:true});}
