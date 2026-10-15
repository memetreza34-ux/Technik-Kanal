import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';

const sha=file=>createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const directory=p=>fs.existsSync(p)&&fs.statSync(p).isDirectory();
const filesIn=p=>directory(p)?fs.readdirSync(p,{withFileTypes:true}).filter(e=>e.isFile()).map(e=>e.name):[];

export function flattenScienceExport(projectDir,{dryRun=false}={}){
  const root=path.resolve(projectDir);
  const planFile=path.join(root,'06-projektdateien/scene-plan.json');
  if(!fs.existsSync(planFile))throw Error('Szenenplan fehlt: '+planFile);
  const plan=JSON.parse(fs.readFileSync(planFile,'utf8'));
  const folder=path.join(root,'05-export'),projectFiles=path.join(root,'06-projektdateien');
  fs.mkdirSync(folder,{recursive:true});
  fs.mkdirSync(projectFiles,{recursive:true});
  const moves=[];
  const conflicts=[];
  const schedule=(source,destination)=>{
    if(!fs.existsSync(source))return;
    if(fs.statSync(source).isDirectory())return;
    if(fs.existsSync(destination)){
      if(sha(source)!==sha(destination)){conflicts.push('Dateikonflikt: '+source+' → '+destination);return;}
      moves.push({source,destination,alreadyThere:true});
    }else moves.push({source,destination,alreadyThere:false});
  };
  const legacyVideo=path.join(folder,'video');
  const legacyCover=path.join(folder,'cover');
  const movie=filesIn(legacyVideo).filter(x=>/\.mp4$/i.test(x));
  if(movie.length>1)conflicts.push('Mehrere alte MP4s unter '+legacyVideo);
  else if(movie.length===1)schedule(path.join(legacyVideo,movie[0]),path.join(folder,'video.mp4'));
  const images=filesIn(legacyCover).filter(x=>/\.(?:png|jpe?g|webp|avif)$/i.test(x));
  if(images.length>1)conflicts.push('Mehrere Cover im alten Ordner '+legacyCover);
  else if(images.length===1)schedule(path.join(legacyCover,images[0]),path.join(folder,'cover'+path.extname(images[0]).toLowerCase()));
  for(const f of ['social-caption.md','youtube-analytics.json','word-timestamps.json','voiceover-final.captions.json','transcript-final.txt','voiceover-final.srt','voiceover-final.vtt','skript-mit-zeitstempeln.txt'])
    schedule(path.join(folder,f),path.join(projectFiles,f));
  schedule(path.join(folder,'youtube-caption.txt'),path.join(folder,'caption.txt'));
  if(conflicts.length)throw Error('Keine Daten wurden geändert:\n'+conflicts.join('\n'));
  if(!dryRun){
    for(const item of moves){
      fs.mkdirSync(path.dirname(item.destination),{recursive:true});
      // AlreadyThere means bit-identical. Only delete duplicate after verifying digest.
      if(item.alreadyThere)fs.unlinkSync(item.source);
      else fs.renameSync(item.source,item.destination);
    }
    for(const dir of [legacyCover,legacyVideo]){
      if(directory(dir)&&fs.readdirSync(dir).length===0)fs.rmdirSync(dir);
    }
  }
  return {slug:plan.slug,projectDir:root,migrated:moves.map(m=>path.relative(root,m.source)),dryRun};
}
export function findScienceVideoFolders(repoRoot){
 const base=path.join(path.resolve(repoRoot),'channels/science/YouTube');
 if(!directory(base))return [];
 return fs.readdirSync(base,{withFileTypes:true}).filter(e=>e.isDirectory()).flatMap(week=>{
   const root=path.join(base,week.name);
   return fs.readdirSync(root,{withFileTypes:true}).filter(e=>e.isDirectory()).map(e=>path.join(root,e.name));
 }).filter(p=>fs.existsSync(path.join(p,'06-projektdateien/scene-plan.json')));
}
