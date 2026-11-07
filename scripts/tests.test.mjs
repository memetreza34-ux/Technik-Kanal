import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { mkdir, mkdtemp, readFile, rm, stat, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {validateVideo} from './check-video.mjs';
import {
  DEFAULT_PRESET,
  VOICE_PRESETS,
  buildVoiceBoostFilter,
  formatAtempoFilter,
  loadVoicePolicy,
  normalizeGermanScriptForTts,
  parseProfileTempo,
  resolveRepoPath,
  splitScriptIntoParagraphs,
  synthesizeProjectVoiceover
} from './lib/voice-synthesis.mjs';

test('Projektvorlage kann nicht ohne echte Inhalte freigegeben werden',()=>{
 const x=validateVideo('videos/_vorlage');assert.ok(x.errors.length>0);assert.ok(x.errors.some(s=>s.includes('ready')));
});
test('Alle neuen Projekte beginnen im 16:9-Format',()=>{
 const x=JSON.parse(fs.readFileSync('videos/_vorlage/video.json','utf8'));
 assert.equal(x.format,'youtube-16x9');assert.ok(x.chapters.length>=3);
});
test('Technik-Kanal VOICE_PRESETS enthält ausschließlich stickman-user-clone (0.95x Tempo)',()=>{
 assert.deepEqual(Object.keys(VOICE_PRESETS),['stickman-user-clone']);
 assert.equal(DEFAULT_PRESET,'stickman-user-clone');
 const klon=VOICE_PRESETS['stickman-user-clone'];
 assert.equal(klon.provider,'qwen-mlx');
 assert.equal(klon.tempo,0.95);
 assert.equal(klon.rate,'-5%');
 assert.equal(klon.maxPauseSeconds,0.30);
 assert.equal(klon.preStretchMaxPauseSeconds,0.285);
 assert.equal(klon.maxWordsPerChunk,32);
 assert.equal(klon.temperature,0.7);
});
test('config/voice-policy.json und Master-Referenzdateien existieren und sind kalibriert',async()=>{
 const policy=await loadVoicePolicy();
 assert.equal(policy.defaultProfile,'stickman-user-clone');
 assert.deepEqual(Object.keys(policy.profiles),['stickman-user-clone']);
 const profile=policy.profiles['stickman-user-clone'];
 assert.equal(profile.tempo,0.95);
 assert.equal(profile.maxPauseSeconds,0.30);
 assert.equal(profile.preStretchMaxPauseSeconds,0.285);
 assert.equal(profile.maxWordsPerChunk,32);
 const wavStat=await stat(resolveRepoPath(profile.refAudio));
 assert.ok(wavStat.size>800_000);
 const refMeta=JSON.parse(await readFile(resolveRepoPath(profile.refMetadata),'utf8'));
 assert.equal(refMeta.voiceId,'stickman-user-clone');
 assert.equal(refMeta.synthesisConfig.tempo,0.95);
 assert.equal(refMeta.synthesisConfig.maxPauseSeconds,0.30);
});
test('Voice-Normalisierung, 32-Wort-Chunking und script-fliesstext.txt Dry-Run funktionieren',async()=>{
 const policy=await loadVoicePolicy();
 const filter=buildVoiceBoostFilter(policy.voiceBoost);
 assert.ok(!filter.includes('[object Object]'));
 assert.equal(formatAtempoFilter(parseProfileTempo({tempo:0.95})),'atempo=0.95');
 const norm=normalizeGermanScriptForTts('Bei 20 °C und 100 km/h fließen z. B. 50% mehr Strom.');
 assert.ok(norm.includes('20 Grad Celsius'));
 assert.ok(norm.includes('100 Kilometer pro Stunde'));
 assert.ok(norm.includes('zum Beispiel'));
 assert.ok(norm.includes('50 Prozent'));
 const longText=Array.from({length:15},(_,i)=>`Satz ${i+1} erklärt die Physik hinter Spannung und Stromfluss.`).join(' ');
 const chunks=splitScriptIntoParagraphs(longText);
 assert.ok(chunks.length>=4);
 for(const c of chunks){assert.ok(c.text.split(/\s+/).filter(Boolean).length<=32);}
 const tmpDir=await mkdtemp(path.join(os.tmpdir(),'technik-main-voice-test-'));
 try{
  await assert.rejects(synthesizeProjectVoiceover(tmpDir,{dryRun:true}),/Voice-Script fehlt/);
  await mkdir(path.join(tmpDir,'audio'),{recursive:true});
  await writeFile(path.join(tmpDir,'script-fliesstext.txt'),'Warum dreht sich ein Elektromotor?\n\nDas Magnetfeld erzeugt eine Lorentzkraft.','utf8');
  const res=await synthesizeProjectVoiceover(tmpDir,{dryRun:true});
  assert.equal(res.dryRun,true);
  assert.equal(res.config.preset,'stickman-user-clone');
  assert.equal(res.config.tempo,0.95);
  assert.ok(res.outputWav.endsWith(path.join('audio','voiceover.wav')));
 }finally{
  await rm(tmpDir,{recursive:true,force:true});
 }
});
