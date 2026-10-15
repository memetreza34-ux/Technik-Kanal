#!/usr/bin/env node
import path from 'node:path';
import {generateScienceLearningReport,initializeScienceLearning} from './lib/science-learning.mjs';

const [command,folder]=process.argv.slice(2).filter(arg=>arg!=='--');
if(!['start','report'].includes(command)||!folder){
  console.error('Nutzung: npm run science:learn -- start|report <video-ordner>');
  process.exit(1);
}
const projectDir=path.resolve(folder);
if(command==='start'){
  const paths=initializeScienceLearning(projectDir);
  console.log('✓ Verbesserungsbrief, YouTube-Analytics-Vorlage und redaktioneller Review angelegt (bestehende Daten bleiben erhalten).');
  console.log('  Brief: '+paths.brief);
  console.log('  Analytics: '+paths.analytics);
}else{
  const {report,target}=generateScienceLearningReport(projectDir);
  console.log('✓ Wissonaut-Lernbericht: '+target);
  console.log('  Status: '+report.status);
  console.log('  Analysiertes Zeitfenster: '+(report.latestWindowHours??'noch keines')+' Stunden');
  console.log('  Vergleichbare Kennzahlen: '+Object.keys(report.comparisons).join(', '));
  console.log('  Testideen: '+report.recommendedTests.length);
  report.notes.forEach(note=>console.log('  Hinweis: '+note));
}
