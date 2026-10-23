#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {electricalProjectPaths} from './lib/electrical-project-structure.mjs';
import {assessTitle,parseYouTubeSearchHtml,titleSuggestions} from './lib/science-title-check.mjs';

// Vor dem Skript: Wer besetzt diese Frage schon auf YouTube? Holt die Top-Suchergebnisse
// (öffentliche Suchseite, ohne Login), vergleicht sie mit dem geplanten Titel und schreibt
// 06-projektdateien/title-check.json. Nutzung:
//   npm run science:title-check -- "<video-ordner>" [--titel="Alternativer Titel?"]

const args=process.argv.slice(2);
const projectArg=args.find((arg)=>!arg.startsWith('--'));
if(!projectArg){console.error('Nutzung: npm run science:title-check -- <video-ordner> [--titel="..."]');process.exit(1);}
const paths=electricalProjectPaths(path.resolve(projectArg));
const plan=JSON.parse(fs.readFileSync(paths.scenePlan,'utf8'));
const title=(args.find((arg)=>arg.startsWith('--titel='))?.slice(8)??plan.title??'').trim();
if(!title){console.error('Kein Titel: plan.title setzen oder --titel="..." angeben.');process.exit(1);}

const query=title.replace(/[?!.„“"]/g,'').trim();
const url=`https://www.youtube.com/results?search_query=${encodeURIComponent(query)}&hl=de&gl=DE`;
let html;
try{
  const response=await fetch(url,{headers:{'user-agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126 Safari/537.36','accept-language':'de-DE,de;q=0.9'}});
  if(!response.ok)throw new Error(`HTTP ${response.status}`);
  html=await response.text();
}catch(error){
  console.error(`YouTube-Suche nicht erreichbar (${error.message}). Später erneut versuchen; nichts wurde geschrieben.`);
  process.exit(1);
}
const results=parseYouTubeSearchHtml(html);
if(!results.length){console.error('YouTube hat keine auswertbaren Ergebnisse geliefert (evtl. Einwilligungsseite oder Sperre). Später erneut versuchen; nichts wurde geschrieben.');process.exit(1);}

const assessment=assessTitle({title,results});
const report={version:'science-title-check-v1',checkedAt:new Date().toISOString(),title,query,source:url,verdict:assessment.verdict,similarCount:assessment.similarCount,strongCompetitors:assessment.strongCompetitors.map(({rank,title:t,channel,views,length})=>({rank,title:t,channel,views,length})),topByViews:assessment.topByViews.map(({rank,title:t,channel,views})=>({rank,title:t,channel,views})),suggestions:titleSuggestions({title,hookAnchor:plan.hookAnchor}),results:assessment.results.map(({rank,title:t,channel,views,length,published,similarity})=>({rank,title:t,channel,views,length,published,similarity}))};
fs.mkdirSync(paths.projectDir,{recursive:true});
fs.writeFileSync(path.join(paths.projectDir,'title-check.json'),`${JSON.stringify(report,null,2)}\n`);

const fmt=(views)=>views==null?'?':views.toLocaleString('de-DE');
console.log(`Titel: ${title}`);
console.log(`Ergebnis: ${assessment.verdict.toUpperCase()} – ${assessment.similarCount} der Top-${assessment.results.length} stellen fast dieselbe Frage.`);
for(const item of assessment.results.slice(0,10))console.log(`  ${String(item.rank).padStart(2)}. ${fmt(item.views).padStart(10)} · ${String(item.channel).slice(0,24).padEnd(24)} · ${item.similarity>=0.5?'≈ ':'  '}${item.title.slice(0,70)}`);
if(assessment.verdict!=='offen'){
  console.log('\nDiese Frage ist schon besetzt. Bessere Titel-Formeln (Zahl/Fakt vorher belegen):');
  for(const suggestion of report.suggestions)console.log(`  - ${suggestion.formula}: ${suggestion.example}`);
}
console.log(`\n✓ Titel-Check gespeichert: ${path.join(paths.projectDir,'title-check.json')}`);
