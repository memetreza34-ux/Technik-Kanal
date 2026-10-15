#!/usr/bin/env node
import path from 'node:path';
import {initializeScienceAssetReview,checkScienceAssetReview,checkScienceLearningBrief} from './lib/science-quality-gates.mjs';

const args=process.argv.slice(2).filter(x=>x!=='--');
const [cmd,folder]=args;
if(!folder||!['init','check','learning'].includes(cmd)){
 console.error('Nutzung: npm run science:asset-review -- init|check|learning <video-ordner>');
 process.exit(1);
}
const dir=path.resolve(folder);
if(cmd==='init'){
 const r=initializeScienceAssetReview(dir);
 console.log('✓ Review-Vorlage für '+r.output.scenes.length+' Bilder erstellt: '+r.file);
 console.log('Alle Qualitätsfelder sind standardmäßig OFFEN. Bitte echte Bilder visuell prüfen und pro Szene dokumentieren.');
}else{
 const r=cmd==='learning'?checkScienceLearningBrief(dir):checkScienceAssetReview(dir);
 if(!r.passed){
  console.error('✗ '+(cmd==='learning'?'Lernplan':'Bildfreigabe')+' blockiert.');
  r.errors.forEach(e=>console.error('- '+e));
  process.exit(1);
 }
 console.log('✓ '+(cmd==='learning'?'Redaktioneller Lernplan':'Freigaben aller Szenenbilder')+' geprüft: '+r.file);
}
