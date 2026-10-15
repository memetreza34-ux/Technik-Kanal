import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';

const IMAGE_TYPES=new Set(['.png','.jpg','.jpeg','.webp','.avif']);
const hash=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const findFinal=(root,scene)=>{
  const dir=path.resolve(root,scene.imageDir);
  const files=fs.existsSync(dir)?fs.readdirSync(dir).filter(name=>IMAGE_TYPES.has(path.extname(name).toLowerCase())&&!name.startsWith('.generated-')):[];
  const final=files.filter(name=>/(final|approved|freigabe)/i.test(name));
  const picked=files.length===1?files[0]:final.length===1?final[0]:null;
  return picked?path.join(dir,picked):null;
};
const REVIEWS=['metadataAbsent','visibleGermanTextCorrect','scientificAccuracy','matchesNarration','readableOnPhone','notDuplicate'];
const forbidMeta=/\b(?:szene|scene|beat|bildschritt)\s*[#:-]?\s*\d{1,3}\b|\b\d{1,3}\s*[|:]\s*(?:HOOK|CONTEXT|FOUNDATION|MECHANISM|DEEPENING|PAYOFF|SCENE|BEAT)\b|\b(?:DEEPENING|STORYBOARD|PRODUCTION STEP)\b|\b\d{2}-[a-z]+-(?:final|approved)\b/i;
const safe=(v)=>typeof v==='string'&&v.trim().length>=4;

export function checkSciencePlanText(plan){
  const issues=[];
  for(const scene of plan.scenes??[]){
    for(const field of ['headline','kicker']){
      if(safe(scene[field]))issues.push(scene.id+': Remotion-Overlay '+field+' ist nicht erlaubt, Text muss im Bild kontrolliert sein.');
    }
    for(const a of scene.imageAnnotations??[])issues.push(scene.id+': Remotion-Overlay verboten: '+String(a.text??a));
  }
  return issues;
}

export function checkSciencePromptMetadata(root,plan){
  const errors=[];
  const folder=path.join(root,'02-bilder/prompts');
  const byId=new Map((plan.scenes??[]).map(scene=>[scene.id,scene]));
  for(const [id,scene] of byId){
    const f=path.join(folder,id+'.txt');
    if(!fs.existsSync(f)){errors.push(id+': Bildprompt fehlt.');continue;}
    const prompt=fs.readFileSync(f,'utf8');
    if(!prompt.includes('VISIBLE TEXT LOCK'))errors.push(id+': Visible-Text-Lock fehlt.');
    // Prompt-Instruktionen selbst dürfen Szenennummern benennen. Nur ausdrücklich
    // renderbare Strings werden blockiert; ein Negativbeispiel ist kein Verstoß.
    const literals=[...prompt.matchAll(/(?:visible\s*text|text\s*on\s*image|written\s*label|render\s*the\s*text|label\s*exactly)\s*[:=]\s*["“']([^"”'\n]+)["”']/gi)]
      .map(x=>x[1]);
    for(const t of literals)if(forbidMeta.test(t))errors.push(id+': Rendertext enthält Produktionsmetadaten: '+t);
    if(forbidMeta.test(String(scene.headline??''))||forbidMeta.test(String(scene.kicker??'')))errors.push(id+': Produktionsmetadaten in Szenenüberschrift.');
  }
  return errors;
}

export function initializeScienceAssetReview(projectDir){
  const root=path.resolve(projectDir);
  const plan=read(path.join(root,'06-projektdateien/scene-plan.json'));
  const file=path.join(root,'06-projektdateien/asset-review.json');
  const old=fs.existsSync(file)?read(file):{scenes:[]};
  const history=new Map((old.scenes??[]).map(item=>[item.sceneId,item]));
  const scenes=plan.scenes.map(scene=>{
    const img=findFinal(root,scene),sha256=img?hash(img):null,existing=history.get(scene.id);
    const valid=existing&&existing.sha256===sha256&&sha256;
    return {sceneId:scene.id,file:img?path.relative(root,img).split(path.sep).join('/'):null,sha256,
      checks:valid?existing.checks:Object.fromEntries(REVIEWS.map(key=>[key,false])),
      reviewer:valid?existing.reviewer:null,reviewedAt:valid?existing.reviewedAt:null,
      notes:valid?existing.notes:'',status:valid?existing.status:'pending'};
  });
  const output={version:1,slug:plan.slug,policy:'Review every final image visually. Approvals are not automated; only a reviewer who inspected it may set every check=true.',scenes};
  fs.writeFileSync(file,JSON.stringify(output,null,2)+'\n');
  return {file,output};
}

export function checkScienceAssetReview(projectDir){
  const root=path.resolve(projectDir),plan=read(path.join(root,'06-projektdateien/scene-plan.json'));
  const file=path.join(root,'06-projektdateien/asset-review.json');
  const errors=[...checkSciencePlanText(plan),...checkSciencePromptMetadata(root,plan)];
  if(!fs.existsSync(file))return {passed:false,errors:[...errors,'asset-review.json fehlt. Erst npm run science:asset-review -- init "<video-ordner>" ausführen, dann ALLE Szenen tatsächlich visuell prüfen.'],file};
  const data=read(file);
  if(data.version!==1||data.slug!==plan.slug||!Array.isArray(data.scenes))errors.push('Asset-Freigabe passt nicht zum Video.');
  const rows=new Map((data.scenes??[]).map(item=>[item.sceneId,item]));
  if(rows.size!==(data.scenes??[]).length)errors.push('Doppelte Szenenfreigaben.');
  if(rows.size!==plan.scenes.length)errors.push('Szenenzahl im Freigabeprotokoll stimmt nicht.');
  for(const scene of plan.scenes){
    const row=rows.get(scene.id),image=findFinal(root,scene);
    if(!image){errors.push(scene.id+': kein eindeutiges finales Bild.');continue;}
    if(!row){errors.push(scene.id+': keine Freigabe.');continue;}
    const relative=path.relative(root,image).split(path.sep).join('/');
    if(row.file!==relative||row.sha256!==hash(image))errors.push(scene.id+': Bild seit Prüfung geändert oder anderes Bild gewählt – Freigabe ungültig.');
    const missing=REVIEWS.filter(key=>row.checks?.[key]!==true);
    if(missing.length)errors.push(scene.id+': Qualitätsprüfung offen: '+missing.join(', '));
    if(row.status!=='approved'||!safe(row.reviewer)||!Number.isFinite(Date.parse(row.reviewedAt??'')))errors.push(scene.id+': echte dokumentierte Sichtprüfung mit Name, Datum und status=approved fehlt.');
  }
  return {passed:errors.length===0,errors,file,checked:plan.scenes.length};
}

export function checkScienceLearningBrief(projectDir,{channelDir=path.resolve('channels/science')}={}){
  const root=path.resolve(projectDir),file=path.join(root,'06-projektdateien/learning-brief.json');
  const activeFile=path.join(channelDir,'learning/active-lessons.json');
  const errors=[];
  if(!fs.existsSync(file)||!fs.existsSync(activeFile))return {passed:false,errors:['Lernbrief oder aktive Lernregeln fehlen.'],file};
  const brief=read(file),lessons=read(activeFile).lessons.filter(l=>l.status==='active');
  const included=new Set((brief.permanentLessons??[]).map(l=>l.id));
  for(const lesson of lessons)if(!included.has(lesson.id))errors.push('Aktive Lektion fehlt im Lernbrief: '+lesson.id+'. science:learn -- start synchronisiert bei neuen Videos.');
  if(!safe(brief.thisVideoHypothesis))errors.push('Verbesserungshypothese für dieses Video fehlt.');
  if(!safe(brief.oneControlledChange))errors.push('Eine konkrete kontrollierte Änderung fehlt.');
  if(!safe(brief.primarySuccessMetric))errors.push('Vorher definierte Zielmetrik fehlt.');
  if(brief.editorApproved!==true)errors.push('Redaktionelle Freigabe des Verbesserungsplans fehlt (editorApproved=true erst nach Sichtung).');
  return {passed:errors.length===0,errors,file};
}
