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

test('Short-Untertitel: Skriptwörter bekommen Whisper-Zeiten, Lücken werden interpoliert',async()=>{
 const {alignScriptToTimestamps}=await import('./lib/align-words.mjs');
 const timed=[{text:'Dein',startMs:0,endMs:200},{text:'Handy',startMs:250,endMs:500},{text:'ladet',startMs:550,endMs:800},{text:'ohne',startMs:850,endMs:1000},{text:'Kabel',startMs:1050,endMs:1400}];
 const {words,matchRatio}=alignScriptToTimestamps(['Dein','Handy','lädt','ohne','Kabel.'],timed);
 assert.equal(words.length,5);
 assert.equal(words[0].text,'Dein');assert.equal(words[4].text,' Kabel.');
 assert.equal(words[1].startMs,250);
 assert.ok(words[2].startMs>=500&&words[2].endMs<=850,'Lücke liegt zwischen den Nachbarn');
 assert.equal(matchRatio,0.8);
 assert.ok(words.every((w,i)=>i===0||w.startMs>=words[i-1].startMs),'Zeiten steigen monoton');
});

test('3D-Asset-Manifest: nur Poly-Haven-IDs, Download-Skript und Ignorieren vorhanden',()=>{
 const m=JSON.parse(fs.readFileSync('assets/3d-manifest.json','utf8'));
 assert.ok(Object.keys(m.models).length>=10);assert.ok(Object.keys(m.hdris).length>=1);
 for(const id of [...Object.keys(m.models),...Object.keys(m.hdris)]) assert.match(id,/^[A-Za-z0-9_]+$/);
 assert.match(fs.readFileSync('.gitignore','utf8'),/public\/3d\//);
 const pkg=JSON.parse(fs.readFileSync('package.json','utf8'));assert.ok(pkg.scripts['assets:fetch']);
});
test('Technik-Welt: jeder Short-Szene-Anker existiert im Haus',()=>{
 const haus=fs.readFileSync('src/world/TechnikHaus.tsx','utf8');
 for(const used of fs.readFileSync('src/short/scenes/WirelessCharging.tsx','utf8').matchAll(/HAUS_ANCHORS\.(\w+)/g)) assert.match(haus,new RegExp('\\b'+used[1]+':'));
});
