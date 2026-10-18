#!/usr/bin/env node
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {checkScienceAssetReview,initializeScienceAssetReview,checkScienceLearningBrief,checkSciencePlanText,checkSciencePromptMetadata} from './lib/science-quality-gates.mjs';

const dir=fs.mkdtempSync(path.join(os.tmpdir(),'wissonaut-gate-'));
const save=(name,text)=>{const p=path.join(dir,name);fs.mkdirSync(path.dirname(p),{recursive:true});fs.writeFileSync(p,typeof text==='string'?text:JSON.stringify(text,null,2));return p;};
const load=name=>JSON.parse(fs.readFileSync(path.join(dir,name),'utf8'));
try{
 const scenes=[{id:'01-hook',imageDir:'02-bilder/images/01-hook',voiceText:'Warum schwimmt ein Schiff?'},{id:'02-deepening',imageDir:'02-bilder/images/02-deepening',voiceText:'Durch das verdrängte Wasser.'}];
 save('06-projektdateien/scene-plan.json',{slug:'test-ship',scenes});
 const prompt='Create a technical diagram, VISIBLE TEXT LOCK. Visible text only in German, no metadata.';
 for(const s of scenes){save(s.imageDir+'/'+s.id+'-final.png','IMAGE-'+s.id);save('02-bilder/prompts/'+s.id+'.txt',prompt)}
 let result=checkScienceAssetReview(dir);
 assert.equal(result.passed,false);
 assert.match(result.errors.join(' '),/asset-review\.json fehlt/);
 const original=initializeScienceAssetReview(dir);
 assert.equal(original.output.scenes.length,2);
 assert.equal(checkScienceAssetReview(dir).passed,false,'No automatic approval');
 const review=load('06-projektdateien/asset-review.json');
 for(const scene of review.scenes){scene.checks=Object.fromEntries(Object.keys(scene.checks).map(k=>[k,true]));scene.reviewer='Editor Wissonaut';scene.reviewedAt='2026-10-15T12:00:00Z';scene.status='approved';scene.notes='Bild und Textrichtigkeit visuell geprüft.';}
 save('06-projektdateien/asset-review.json',review);
 assert.equal(checkScienceAssetReview(dir).passed,true,'Approved images should pass');
 save(scenes[0].imageDir+'/'+scenes[0].id+'-final.png','REPLACED WITHOUT REVIEW');
 assert.equal(checkScienceAssetReview(dir).passed,false,'Changed image must invalidate its approval');
 initializeScienceAssetReview(dir);
 assert.equal(load('06-projektdateien/asset-review.json').scenes[0].status,'pending','Changed image must reset status');
 assert.equal(load('06-projektdateien/asset-review.json').scenes[1].status,'approved','Unchanged image retains approval');
 assert.ok(checkSciencePlanText({scenes:[{id:'35-deepening',headline:'35 | DEEPENING'}]}).length);
 save('02-bilder/prompts/02-deepening.txt',prompt+'\nvisible text: "35 | DEEPENING"');
 assert.match(checkSciencePromptMetadata(dir,{scenes}).join(' '),/Produktionsmetadaten/);
 const channel=path.join(dir,'channel');
 save('channel/learning/active-lessons.json',{lessons:[{id:'qa-003',status:'active'}]});
 save('06-projektdateien/learning-brief.json',{permanentLessons:[{id:'qa-003'}],thisVideoHypothesis:'Mehr technische Diagramme verbessern den Wissensgewinn.',oneControlledChange:'Mehr Kraftpfeile auf Querschnitten.',primarySuccessMetric:'Retention nach 30 Sekunden',editorApproved:true});
 assert.equal(checkScienceLearningBrief(dir,{channelDir:channel}).passed,true);
 // Jedes zuvor tatsächlich fertig gerenderte Video braucht ein freigegebenes
 // Review, sonst darf die Folgeproduktion nicht mit bloßen Hypothesen starten.
 const last=path.join(channel,'YouTube/2026-10-01_bis_2026-10-07/01-Vorher');
 save('channel/YouTube/2026-10-01_bis_2026-10-07/01-Vorher/05-export/video.mp4','previous-video');
 assert.equal(checkScienceLearningBrief(dir,{channelDir:channel}).passed,true,
   'Der aktuelle Testordner ohne gültigen YouTube-Wochenpfad gilt nicht als Folgevideoproduktion.');

 const b=load('06-projektdateien/learning-brief.json');b.editorApproved=false;save('06-projektdateien/learning-brief.json',b);
 assert.equal(checkScienceLearningBrief(dir,{channelDir:channel}).passed,false);
 // Prüfung mit richtigem nächsten Pfad und tatsächlichem gerenderten Vorgänger:
 const nextVideo=path.join(channel,'YouTube/2026-10-08_bis_2026-10-14/02-Folge');
 fs.mkdirSync(path.join(nextVideo,'06-projektdateien'),{recursive:true});
 fs.writeFileSync(path.join(nextVideo,'06-projektdateien/learning-brief.json'),JSON.stringify({
   permanentLessons:[{id:'qa-003'}],thisVideoHypothesis:'Technische Diagramme verbessern Verstehen.',
   oneControlledChange:'Mehr deutsche Fachlabels.',primarySuccessMetric:'Retention',
   editorApproved:true,inheritedEditorialActions:[]
 }));
 assert.match(checkScienceLearningBrief(nextVideo,{channelDir:channel}).errors.join(' '),/noch nicht redaktionell ausgewertet/);
 fs.mkdirSync(path.join(last,'06-projektdateien'),{recursive:true});
 fs.writeFileSync(path.join(last,'06-projektdateien/editorial-decisions.json'),JSON.stringify({
   version:1,slug:'previous-video',editorApproved:true,reviewer:'Editor',
   reviewedAt:'2026-10-15T12:00:00Z',
   improvements:[{evidenceType:'visual-review',observation:'Querschnitte erklären den Sachverhalt unklar.',
     nextVideoChange:'Große lesbare Fachlabels in Diagrammen verwenden.',testMetric:'Retention'}]
 }));
 assert.match(checkScienceLearningBrief(nextVideo,{channelDir:channel}).errors.join(' '),/fehlt im nächsten Lernbrief/);
 const follow=JSON.parse(fs.readFileSync(path.join(nextVideo,'06-projektdateien/learning-brief.json')));
 follow.inheritedEditorialActions=[{sourceVideo:'previous-video'}];
 fs.writeFileSync(path.join(nextVideo,'06-projektdateien/learning-brief.json'),JSON.stringify(follow));
 assert.equal(checkScienceLearningBrief(nextVideo,{channelDir:channel}).passed,true,
   'Abgenommenes Vorvideo und übertragene Erkenntnis müssen Folgevideo freischalten.');

 const component=fs.readFileSync(path.resolve('channels/science/src/ScienceReel.tsx'),'utf8');
 assert.ok(!component.includes('ScienceSceneHeader'),'Renderer darf keine SceneHeader-Overlay-Komponente verwenden.');
 for(const file of ['scripts/science-readiness.mjs','scripts/prepare_science_reel.mjs','scripts/render_science_reel.mjs']){
   const src=fs.readFileSync(path.resolve(file),'utf8');
   assert.ok(src.includes('science-asset-review.mjs'),'Asset-Freigabe fehlt in '+file);
 }
 console.log('✓ 8 Qualitätsprüfungen: blockiert ohne Review, prüft alle Szenen, Hash-Invalidierung, kein Overlay, Prompt-Metadaten, Lernplan-Freigabe.');
}finally{fs.rmSync(dir,{recursive:true,force:true});}
