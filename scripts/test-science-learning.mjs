#!/usr/bin/env node
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {initializeScienceLearning,generateScienceLearningReport,validateScienceAnalytics} from './lib/science-learning.mjs';

const scratch=fs.mkdtempSync(path.join(os.tmpdir(),'wissonaut-learning-'));
const channelDir=path.join(scratch,'channels/science');
const save=(file,content)=>{fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,typeof content==='string'?content:JSON.stringify(content,null,2));};
const load=file=>JSON.parse(fs.readFileSync(file,'utf8'));
const project=(name,profile='youtube-6to7min-v1')=>{
  const dir=path.join(channelDir,'YouTube/2026-10-01_bis_2026-10-07',name);
  save(path.join(dir,'06-projektdateien/scene-plan.json'),{slug:name,productionProfile:profile});
  return dir;
};
const fill=(dir,metric)=>{
  const file=path.join(dir,'06-projektdateien/youtube-analytics.json');
  const data=load(file);data.publishedAt='2026-10-01T12:00:00Z';
  Object.assign(data.snapshots.find(s=>s.afterHours===168),{capturedAt:'2026-10-08T12:00:00Z',impressions:1000,views:400,ctrPercent:metric,retention30Percent:65,averagePercentageViewed:44,subscribersGained:8});
  save(file,data);
};
try{
  save(path.join(channelDir,'learning/active-lessons.json'),{version:1,lessons:[{id:'test',priority:1,status:'active',action:'Hook prüfen'}]});
  const peers=['01-a','02-b','03-c'].map(name=>project(name));
  for(const dir of peers){initializeScienceLearning(dir,{channelDir});fill(dir,8);}
  const target=project('04-d');
  const paths=initializeScienceLearning(target,{channelDir});
  assert.equal(load(paths.brief).permanentLessons.length,1);
  assert.equal(load(paths.analytics).snapshots.length,4);
  assert.ok(fs.existsSync(paths.editorial));
  assert.ok(fs.existsSync(paths.editorialDecisions),'Review-Entscheidungen werden pro Video angelegt.');
  const decisions=load(paths.editorialDecisions);
  assert.equal(decisions.editorApproved,false,'Keine automatische Freigabe ohne Videoanalyse.');
  decisions.editorApproved=true;
  decisions.reviewer='Video Editor';
  decisions.reviewedAt='2026-10-15T13:00:00Z';
  decisions.improvements=[{
    evidenceType:'visual-review',
    observation:'Technische Zeichnungen erklären wichtige Stellen zu wenig.',
    nextVideoChange:'Mindestens drei gezielte beschriftete Schemata einsetzen.',
    testMetric:'Zuschauerbindung im Abschnitt mit technischen Grafiken'
  }];
  save(paths.editorialDecisions,decisions);
  save(paths.brief,{...load(paths.brief),thisVideoHypothesis:'Test wird nicht überschrieben'});
  initializeScienceLearning(target,{channelDir});
  assert.equal(load(paths.brief).thisVideoHypothesis,'Test wird nicht überschrieben');
  let noData=generateScienceLearningReport(target,{channelDir}).report;
  assert.equal(noData.status,'not-published');
  assert.equal(noData.recommendedTests.length,0);
  fill(target,4);
  const report=generateScienceLearningReport(target,{channelDir}).report;
  assert.equal(report.status,'comparable-data');
  assert.equal(report.comparisons.ctrPercent.peerMedian,8);
  assert.ok(report.recommendedTests.some(x=>x.area==='thumbnail-title'));
  assert.ok(fs.existsSync(path.join(target,'06-projektdateien/learning-report.json')));
  const next=project('05-e');
  const nextPaths=initializeScienceLearning(next,{channelDir});
  assert.ok(load(nextPaths.brief).inheritedTests.some(x=>x.area==='thumbnail-title'));
  assert.ok(load(nextPaths.brief).inheritedEditorialActions.some(x=>x.nextVideoChange.includes('Schemata')),
    'Freigegebene qualitative Verbesserung muss im nächsten Video ankommen.');
  assert.equal(load(nextPaths.brief).inheritedEditorialActions[0].sourceVideo,'04-d');
  assert.throws(()=>validateScienceAnalytics({version:1,snapshots:[{afterHours:168,ctrPercent:110}]}));
  assert.throws(()=>validateScienceAnalytics({version:1,snapshots:[{afterHours:24},{afterHours:24}]}));
  console.log('✓ Wissonaut Learning: Start, echte Daten, Peer-Baseline, Testvererbung, Idempotenz und ungültige Messwerte geprüft.');
}finally{fs.rmSync(scratch,{recursive:true,force:true});}
