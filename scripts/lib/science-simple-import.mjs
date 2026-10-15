import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';

const IMAGE_EXTENSIONS=new Set(['.png','.jpg','.jpeg','.webp','.avif']);
const AUDIO_EXTENSIONS=new Set(['.wav','.mp3','.m4a','.aac','.flac','.ogg']);
const getFolders=dir=>fs.existsSync(dir)?fs.readdirSync(dir,{withFileTypes:true}).filter(x=>x.isDirectory()).map(x=>path.join(dir,x.name)):[];
const sha=file=>createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const within=(base,filename)=>{const full=path.resolve(base,filename);if(full===path.resolve(base)||!full.startsWith(path.resolve(base)+path.sep))throw Error('Pfad außerhalb des Videoordners: '+filename);return full;};

export function findScienceVideoBySlug(repoRoot,slug){
  const base=path.join(repoRoot,'channels/science/reels');
  const matches=getFolders(base).flatMap(getFolders).filter(dir=>{
    const file=path.join(dir,'06-projektdateien/scene-plan.json');
    if(!fs.existsSync(file))return false;
    try{return JSON.parse(fs.readFileSync(file,'utf8')).slug===slug;}catch{return false;}
  });
  if(matches.length!==1)throw Error('Video zum START-HIER-Ordner muss eindeutig sein: '+slug+' (Treffer: '+matches.length+').');
  return matches[0];
}

export function importScienceDrop({repoRoot,packageDir,projectDir=null,dryRun=false}){
  const inputDir=path.resolve(packageDir);
  const repo=path.resolve(repoRoot);
  const project=projectDir?path.resolve(projectDir):findScienceVideoBySlug(repo,path.basename(inputDir));
  if(!project.startsWith(repo+path.sep)||!inputDir.startsWith(repo+path.sep))throw Error('Nur Ordner innerhalb des GitHub-Repos erlaubt.');
  const target=path.join(inputDir,'DATEIEN-HIER-REIN');
  const plan=JSON.parse(fs.readFileSync(path.join(project,'06-projektdateien/scene-plan.json'),'utf8'));
  if(plan.slug!==path.basename(inputDir))throw Error('Ordner/Video stimmt nicht überein.');
  if(!fs.existsSync(target))throw Error('Ablageordner fehlt: '+target);
  const files=fs.readdirSync(target,{withFileTypes:true}).filter(item=>item.isFile()&&!item.name.startsWith('.')).map(item=>item.name);
  const numbered=new Map(plan.scenes.map((scene,index)=>[index+1,scene]));
  const selected=new Map();
  let cover=null,voice=null;
  const errors=[];
  const unknown=[];
  const hashes=new Map();
  for(const name of files){
    if(name==='HIER-ABLEGEN.txt'||name==='README.txt')continue;
    const ext=path.extname(name).toLowerCase();
    const file=path.join(target,name);
    if(IMAGE_EXTENSIONS.has(ext)){
      if(/^00[-_](?:thumbnail|cover)[-_]final\.(?:png|jpe?g|webp|avif)$/i.test(name)||/^00\.(?:png|jpe?g|webp|avif)$/i.test(name)){
        if(cover)errors.push('Mehr als ein Cover im Ablageordner.');
        else cover={file,name,ext};
        continue;
      }
      const m=name.match(/^(\d{1,2})(?:[-_][^.]*)?\.(?:png|jpe?g|webp|avif)$/i);
      if(!m){unknown.push(name);continue;}
      const number=Number(m[1]),scene=numbered.get(number);
      if(!scene){errors.push('Unbekannte Bildnummer: '+name);continue;}
      const rest=name.slice(m[1].length,-ext.length).replace(/^[-_]/,'').toLowerCase();
      if(rest&&rest!==scene.id.slice(m[1].length+1).toLowerCase()&&rest!==scene.id.slice(m[1].length+1).toLowerCase()+'-final'&&rest!=='final'){
        errors.push('Falsche Zuordnung für '+name+' (erwartet: '+scene.id+'-final oder '+String(number).padStart(2,'0')+ext+').');
        continue;
      }
      if(selected.has(scene.id)){errors.push('Mehrere Bilder für Szene '+scene.id);continue;}
      const hash=sha(file);
      if(hashes.has(hash))errors.push('Doppeltes identisches Bild: '+name+' und '+hashes.get(hash));
      else hashes.set(hash,name);
      selected.set(scene.id,{file,name,ext,scene});
    }else if(AUDIO_EXTENSIONS.has(ext)){
      if(voice)errors.push('Mehr als eine Sprachaufnahme im Ablageordner.');
      else voice={file,name,ext};
    }else{
      unknown.push(name);
    }
  }
  if(unknown.length)errors.push('Unbekannte Dateien: '+unknown.join(', '));
  if(cover&&hashes.has(sha(cover.file)))errors.push('Cover darf kein identisches Szenenbild sein.');
  const copies=[];
  for(const item of selected.values())copies.push({
    from:item.file,
    to:within(project,path.join(item.scene.imageDir,item.scene.id+'-final'+item.ext)),
    label:'Bild '+item.scene.id
  });
  if(cover)copies.push({from:cover.file,to:within(project,'05-export/cover/00-thumbnail-final'+cover.ext),label:'Cover'});
  if(voice)copies.push({from:voice.file,to:within(project,'01-script-audio/audio/voiceover-raw'+voice.ext),label:'Stimme'});
  for(const action of copies){
    if(fs.existsSync(action.to)&&sha(action.from)!==sha(action.to))errors.push(action.label+': vorhandene Datei unterscheidet sich. Nicht automatisch überschreiben: '+action.to);
  }
  const missing=plan.scenes.filter(scene=>!selected.has(scene.id)&&!fs.existsSync(path.join(project,scene.imageDir,scene.id+'-final.png'))&&!fs.existsSync(path.join(project,scene.imageDir,scene.id+'-final.jpg'))&&!fs.existsSync(path.join(project,scene.imageDir,scene.id+'-final.webp'))).map(scene=>scene.id);
  if(errors.length)throw Error('Import abgebrochen – keine Datei wurde kopiert:\n'+errors.map(x=>'- '+x).join('\n'));
  const imported=[];
  if(!dryRun)for(const item of copies){
    if(fs.existsSync(item.to))continue;
    fs.mkdirSync(path.dirname(item.to),{recursive:true});
    fs.copyFileSync(item.from,item.to);
    imported.push(item.label);
  }
  return {projectDir:project,packageDir:inputDir,sceneCount:plan.scenes.length,readyFromDrop:selected.size,missing,hasCover:Boolean(cover||fs.existsSync(path.join(project,'05-export/cover/00-thumbnail-final.png'))),hasVoice:Boolean(voice||fs.existsSync(path.join(project,'01-script-audio/audio/voiceover-raw.wav'))),copied:imported,plannedCopies:copies.length,dryRun};
}
