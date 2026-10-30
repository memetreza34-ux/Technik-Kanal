import fs from 'node:fs';
import path from 'node:path';
export function validateVideo(dir,{requireAudio=true}={}){
  const errors=[],file=path.join(dir,'video.json');
  if(!fs.existsSync(file))return {errors:['video.json fehlt']};
  let spec;
  try{spec=JSON.parse(fs.readFileSync(file,'utf8'));}catch(e){return {errors:['Ungültiges JSON: '+e.message]};}
  if(spec.format!=='youtube-16x9')errors.push('format muss youtube-16x9 sein');
  if(spec.status!=='ready')errors.push('status muss ready sein – erst fachlich freigeben');
  if(typeof spec.title!=='string'||spec.title.trim().length<10||spec.title.includes('['))errors.push('Aussagekräftiger Titel fehlt');
  if(!Array.isArray(spec.chapters)||spec.chapters.length<3)errors.push('Mindestens drei Kapitel erforderlich');
  const kinds=new Set(['hero','diagram','comparison','mechanism','conclusion']),ids=new Set();
  let seconds=0,words=0;
  for(const c of Array.isArray(spec.chapters)?spec.chapters:[]){
    if(!c.id||ids.has(c.id))errors.push('Kapitel-ID fehlt oder doppelt: '+c.id);ids.add(c.id);
    if(!c.heading||c.heading.includes('['))errors.push('Überschrift ist Platzhalter: '+c.id);
    if(!c.detail||c.detail.length<30||c.detail.includes('['))errors.push('Visual-Beschreibung unvollständig: '+c.id);
    if(!kinds.has(c.visual))errors.push('Visual-Typ ungültig: '+c.id);
    if(!Number.isFinite(c.seconds)||c.seconds<=0)errors.push('Kapitelzeit ungültig: '+c.id);
    else seconds+=c.seconds;
    const script=typeof c.script==='string'?c.script.trim():'';
    const wc=script.split(/\s+/).filter(Boolean).length;words+=wc;
    if(wc<35||script.includes('['))errors.push('Vollständiger Sprechertext fehlt: '+c.id);
  }
  if(seconds<240)errors.push('Unter vier Minuten – nur Langvideos geplant');
  if(seconds>3600)errors.push('Mehr als 60 Minuten – manuell prüfen und ggf. aufteilen');
  if(words<seconds*1.3)errors.push('Sprechertext für geplante Laufzeit zu kurz: '+words+' Wörter');
  if(requireAudio){
    const audio=path.join(dir,'audio','voiceover.wav');
    if(!fs.existsSync(audio)||fs.statSync(audio).size===0)errors.push('audio/voiceover.wav fehlt');
  }
  if(!fs.existsSync(path.join(dir,'quellen.md')))errors.push('quellen.md fehlt');
  return {errors,seconds,words,spec};
}
if(process.argv[1]&&process.argv[1].endsWith('check-video.mjs')){
  if(!process.argv[2]){console.error('Nutzung: npm run youtube:check -- videos/YYYY-MM-DD_thema');process.exit(1);}
  const result=validateVideo(path.resolve(process.argv[2]));
  if(result.errors.length){result.errors.forEach(e=>console.error('✗ '+e));process.exit(1);}
  console.log('✓ Video-Preflight: '+result.words+' Wörter, '+result.seconds+' Sekunden. Fachliche Sichtprüfung weiterhin nötig.');
}
