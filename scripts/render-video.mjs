import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawnSync,execFileSync} from 'node:child_process';
import {validateVideo} from './check-video.mjs';
const folder=process.argv[2];
if(!folder)throw new Error('Nutzung: npm run youtube:render -- videos/YYYY-MM-DD_thema');
const dir=path.resolve(folder);
if(path.basename(dir)==='_vorlage')throw new Error('Vorlage nicht renderbar');
const v=validateVideo(dir);
if(v.errors.length)throw new Error('Video nicht freigegeben:\n'+v.errors.join('\n'));
const slug=path.basename(dir),audio=path.join(dir,'audio','voiceover.wav');
const audioInfo=JSON.parse(execFileSync('ffprobe',['-v','error','-show_format','-of','json',audio],{encoding:'utf8'}));
const actualSeconds=Number(audioInfo.format?.duration);
if(!Number.isFinite(actualSeconds)||Math.abs(actualSeconds-v.seconds)>2)throw new Error('Audio ('+actualSeconds+'s) und Kapitelplan ('+v.seconds+'s) unterscheiden sich. Timing zuerst abstimmen.');
const staged=path.resolve('public/render-input',slug+'.wav'),exportDir=path.join(dir,'export');
fs.mkdirSync(path.dirname(staged),{recursive:true});fs.mkdirSync(exportDir,{recursive:true});fs.copyFileSync(audio,staged);
const spec={...v.spec,previewOnly:false,voiceoverPath:'render-input/'+slug+'.wav'};
const props=path.join(os.tmpdir(),'technik-'+process.pid+'-'+Date.now()+'.json');
fs.writeFileSync(props,JSON.stringify({spec}));
const out=path.join(exportDir,'video.mp4');
const run=(command,args)=>{const result=spawnSync(command,args,{stdio:'inherit',shell:process.platform==='win32'});if(result.status!==0)throw new Error(command+' fehlgeschlagen: '+result.status);};
try{
  run('npx',['remotion','render','src/index.ts','TechnikVideo',out,'--props='+props,'--codec=h264','--audio-codec=aac','--audio-bitrate=192k','--pixel-format=yuv420p','--crf=18']);
  run(process.execPath,['scripts/verify-render.mjs',out,String(v.seconds)]);
  console.log('✓ Technischer Render geprüft: '+out);
  console.log('Vor Veröffentlichung vollständiges MP4 mit Ton fachlich und visuell prüfen.');
}finally{fs.rmSync(props,{force:true});fs.rmSync(staged,{force:true});}
