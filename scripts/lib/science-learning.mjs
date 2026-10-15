import fs from 'node:fs';
import path from 'node:path';

const periods=[24,72,168,672];
const fields=['impressions','views','ctrPercent','retention30Percent','averageViewDurationSeconds','averagePercentageViewed','subscribersGained'];
const read=file=>fs.existsSync(file)?JSON.parse(fs.readFileSync(file,'utf8')):null;
const write=(file,obj)=>{fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,JSON.stringify(obj,null,2)+'\n');};
const projectFile=(root,name)=>path.join(root,name);
const measured=x=>typeof x==='number'&&Number.isFinite(x);
const directories=dir=>fs.existsSync(dir)?fs.readdirSync(dir,{withFileTypes:true}).filter(e=>e.isDirectory()).map(e=>path.join(dir,e.name)).sort():[];
const median=values=>{const a=[...values].sort((x,y)=>x-y);return a.length%2?a[Math.floor(a.length/2)]:(a[a.length/2-1]+a[a.length/2])/2;};
const rounded=x=>Number(x.toFixed(2));
export const listScienceProjects=channelDir=>directories(path.join(channelDir,'YouTube')).flatMap(week=>directories(week));
export const validateScienceAnalytics=data=>{
  if(data?.version!==1||!Array.isArray(data.snapshots))throw Error('Analytics: version 1 und snapshots[] erforderlich.');
  const seen=new Set();
  for(const s of data.snapshots){
    if(!periods.includes(s.afterHours)||seen.has(s.afterHours))throw Error('Ungültiges/doppeltes Analytics-Zeitfenster.');
    seen.add(s.afterHours);
    for(const key of fields){
      if(s[key]===null||s[key]===undefined)continue;
      if(!measured(s[key])||s[key]<0||(key.endsWith('Percent')&&key!=='averagePercentageViewed'&&s[key]>100))throw Error('Ungültige Kennzahl '+key);
      if(['views','impressions','subscribersGained'].includes(key)&&!Number.isInteger(s[key]))throw Error('Ganzzahl erwartet: '+key);
    }
  }
  return data;
};
const hasData=s=>fields.some(key=>measured(s[key]));
const comparable=(shot,profile,current,channelDir)=>{
  const peers=listScienceProjects(channelDir).filter(dir=>path.resolve(dir)!==path.resolve(current)).map(dir=>{
    const plan=read(projectFile(dir,'06-projektdateien/scene-plan.json'));
    const analytics=read(projectFile(dir,'06-projektdateien/youtube-analytics.json'));
    if(plan?.productionProfile!==profile||!analytics)return null;
    try{validateScienceAnalytics(analytics);}catch{return null;}
    return {dir,publishedAt:analytics.publishedAt,snapshot:analytics.snapshots.find(s=>s.afterHours===shot.afterHours)};
  }).filter(x=>x?.snapshot&&hasData(x.snapshot)).sort((a,b)=>String(b.publishedAt??b.dir).localeCompare(String(a.publishedAt??a.dir))).slice(0,5);
  const comparisons={};
  for(const key of ['ctrPercent','retention30Percent','averagePercentageViewed']){
    const valid=peers.filter(x=>measured(x.snapshot[key])&&(key==='ctrPercent'?x.snapshot.impressions>=200:x.snapshot.views>=100));
    if(valid.length<3||!measured(shot[key]))continue;
    const base=median(valid.map(x=>x.snapshot[key]));
    comparisons[key]={actual:shot[key],peerMedian:rounded(base),peerCount:valid.length,deltaPercentagePoints:rounded(shot[key]-base)};
  }
  const subRate=s=>measured(s?.subscribersGained)&&s.views>=100?1000*s.subscribersGained/s.views:null;
  const peersSubs=peers.map(x=>subRate(x.snapshot)).filter(measured);
  const actualSubs=subRate(shot);
  if(peersSubs.length>=3&&actualSubs!==null){
    const base=median(peersSubs);
    comparisons.subscribersPer1000Views={actual:rounded(actualSubs),peerMedian:rounded(base),peerCount:peersSubs.length,delta:rounded(actualSubs-base)};
  }
  return comparisons;
};
const suggestions=cmp=>{
  const candidates=[
    ['ctrPercent','thumbnail-title','Titel und Thumbnail als gemeinsames Versprechen testen; nur eine klar dokumentierte Variante ändern.'],
    ['retention30Percent','hook','Hook und erstes eigenständiges Erklärbild verdichten; Retentionskurve vor Änderung ansehen.'],
    ['averagePercentageViewed','pacing','Retention-Dips sichten und dort unnötige Wiederholungen reduzieren oder sinnvollere Bildbeats planen.'],
    ['subscribersPer1000Views','subscription','Aha-Moment und Nutzen weiterer Wissonaut-Videos klarer herausarbeiten, ohne aufdringliche CTAs.'],
  ];
  return candidates.filter(([key])=>cmp[key]&&cmp[key].peerMedian>0&&cmp[key].actual<cmp[key].peerMedian*.9)
    .slice(0,3).map(([metric,area,action])=>({area,metric,hypothesis:'Mögliche Schwäche im Vergleich ähnlicher Videos – Ursache unbewiesen.',test:action,method:'Vergleich gleiches Produktionsprofil, gleiches Veröffentlichungsalter, Median aus mindestens drei Videos.'}));
};

export function initializeScienceLearning(projectDir,{channelDir=path.resolve('channels/science')}={}){
  const plan=read(projectFile(projectDir,'06-projektdateien/scene-plan.json'));
  if(!plan?.slug)throw Error('Learning benötigt scene-plan.json.');
  const active=read(projectFile(channelDir,'learning/active-lessons.json'));
  if(!Array.isArray(active?.lessons))throw Error('Aktive Lernregeln fehlen: channels/science/learning/active-lessons.json');
  const brief=projectFile(projectDir,'06-projektdateien/learning-brief.json');
  if(!fs.existsSync(brief)){
    const latest=listScienceProjects(channelDir).filter(dir=>path.resolve(dir)!==path.resolve(projectDir)).reverse()
      .map(dir=>read(projectFile(dir,'06-projektdateien/learning-report.json')))
      .find(r=>r?.recommendedTests?.length);
    write(brief,{version:1,channel:'Wissonaut',slug:plan.slug,productionProfile:plan.productionProfile,priority:1,
      inheritedTests:(latest?.recommendedTests??[]).slice(0,3),
      permanentLessons:active.lessons.filter(x=>x.status==='active').sort((a,b)=>a.priority-b.priority).slice(0,5),
      thisVideoHypothesis:null,oneControlledChange:null,primarySuccessMetric:null,editorApproved:false,
      instruction:'Vor Skript, Titel und Thumbnail eine konkrete Verbesserung mit messbarem Erfolgskriterium festlegen.'});
  }
  const analytics=projectFile(projectDir,'06-projektdateien/youtube-analytics.json');
  if(!fs.existsSync(analytics))write(analytics,{
    version:1,channel:'Wissonaut',slug:plan.slug,productionProfile:plan.productionProfile,
    source:'YouTube Studio; echte Messwerte manuell eintragen, niemals schätzen',
    youtubeUrl:null,publishedAt:null,title:null,thumbnailVersion:null,
    snapshots:periods.map(afterHours=>({afterHours,capturedAt:null,impressions:null,views:null,ctrPercent:null,
      retention30Percent:null,averageViewDurationSeconds:null,averagePercentageViewed:null,subscribersGained:null}))
  });
  const editorial=projectFile(projectDir,'06-projektdateien/POST-VIDEO-REVIEW.md');
  if(!fs.existsSync(editorial))fs.writeFileSync(editorial,[
    '# Wissonaut – Video-Retrospektive','',
    '## Vor Veröffentlichung – redaktionelle Qualitätsprüfung',
    '- Hook/Titel/Thumbnail: ein klares, ehrliches Versprechen?',
    '- Inhalt: fachlich korrekt, verständlich, ohne Füllmaterial?',
    '- Bilder: passen exakt zum Sprechertext, ausreichend abwechslungsreich, richtige 2.5D-Bildwelt?',
    '- Fehler: falscher Text, fehlende Assets, lange Wiederholungen, Cover im Video, Audio und Schnitt?',
    '',
    '## Nach Veröffentlichung – Messdaten und Beobachtung',
    '- Kennzahlen bei 24 h, 72 h, 7 d und 28 d in 06-projektdateien/youtube-analytics.json erfassen.',
    '- Retentionskurve: konkrete Zeitstempel der Einbrüche und interessante Spitzen notieren.',
    '- CTR zusammen mit Impressionen, Traffic-Quelle und Thema betrachten.',
    '- Hypothesen und tatsächliche Beobachtungen getrennt dokumentieren.',
    '',
    '## Bis zu drei Verbesserungen für das nächste Video',
    '1. Beobachtung und Quelle:',
    '   Vermutete Ursache:',
    '   Eine konkrete Änderung:',
    '   Zielmetrik / Messzeitraum:',
    '2. Beobachtung und Quelle:',
    '   Vermutete Ursache:',
    '   Eine konkrete Änderung:',
    '   Zielmetrik / Messzeitraum:',
    '',
    '## Entscheidung und Wissensübertragung',
    '- Bewährte redaktionelle Erkenntnisse in channels/science/learning/active-lessons.json übernehmen.',
    '- Kein Erfolg und keine Kausalität ohne belastbare Vergleichsdaten behaupten.',''
  ].join('\n'));
  return {brief,analytics,editorial};
}

export function generateScienceLearningReport(projectDir,{channelDir=path.resolve('channels/science')}={}){
  initializeScienceLearning(projectDir,{channelDir});
  const plan=read(projectFile(projectDir,'06-projektdateien/scene-plan.json'));
  const data=validateScienceAnalytics(read(projectFile(projectDir,'06-projektdateien/youtube-analytics.json')));
  if(plan.slug!==data.slug||plan.productionProfile!==data.productionProfile)throw Error('Analytics passt nicht zum Szenenplan.');
  const shot=data.snapshots.filter(hasData).sort((a,b)=>b.afterHours-a.afterHours)[0]??null;
  const comparisons=shot?comparable(shot,plan.productionProfile,projectDir,channelDir):{};
  const recommendedTests=suggestions(comparisons);
  const notes=[];
  if(!data.publishedAt)notes.push('Veröffentlichungsdatum fehlt; Video möglicherweise noch nicht veröffentlicht.');
  if(!shot)notes.push('Keine echten YouTube-Messwerte vorhanden. Bitte nach Veröffentlichung eintragen.');
  if(shot&&!Object.keys(comparisons).length)notes.push('Für einen Vergleich fehlen mindestens drei vergleichbare Videos mit derselben Laufzeitklasse und demselben Messfenster.');
  if(shot&&(shot.impressions??0)<200)notes.push('Impressionen-Stichprobe klein oder unbekannt: CTR-Vergleich zurückhaltend interpretieren.');
  notes.push('Metrikabweichungen beweisen keine Ursachen. Traffic-Quellen, Themen und Zielgruppen redaktionell prüfen.');
  const report={version:1,channel:'Wissonaut',slug:plan.slug,productionProfile:plan.productionProfile,generatedAt:new Date().toISOString(),
    status:!data.publishedAt?'not-published':!shot?'awaiting-measurements':Object.keys(comparisons).length?'comparable-data':'insufficient-baseline',
    latestWindowHours:shot?.afterHours??null,metrics:shot,comparisons,recommendedTests,notes,
    nextStep:'Retrospektive dokumentieren, eine konkrete Verbesserung fürs nächste Video wählen und belastbare Regeln in active-lessons.json aktualisieren.'};
  const target=projectFile(projectDir,'06-projektdateien/learning-report.json');
  write(target,report);
  return {report,target};
}
