#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import {ScenePlan} from './lib/electrical-contracts.mjs';
import {electricalProjectPaths} from './lib/electrical-project-structure.mjs';
import {loadElectricalConfig} from './lib/load-electrical-config.mjs';

const [projectArg]=process.argv.slice(2).filter((arg)=>!arg.startsWith('--'));
if(!projectArg)throw new Error('Nutzung: npm run electrical:public-media -- <reel-ordner>');
const root=path.resolve(projectArg);const paths=electricalProjectPaths(root);const config=loadElectricalConfig();const manifestPath=path.join(root,'02-public-media/public-assets.json');
if(!fs.existsSync(manifestPath)){console.log('✓ Keine öffentlichen Bilder geplant.');process.exit(0);}
const manifest=JSON.parse(fs.readFileSync(manifestPath,'utf8'));const plan=ScenePlan.parse(JSON.parse(fs.readFileSync(paths.scenePlan,'utf8')));const assets=Array.isArray(manifest.assets)?manifest.assets:[];const allowed=new Set(config.visuals.publicMedia.allowedLicenses);const errors=[];const attributions=[];
const downloadsDir=path.join(root,'02-public-media/downloads');fs.mkdirSync(downloadsDir,{recursive:true});
const cropBox=(width,height,focus={x:.5,y:.5})=>{const target=1080/1920;const source=width/height;if(source>target){const cropWidth=Math.max(1,Math.round(height*target));const left=Math.max(0,Math.min(width-cropWidth,Math.round(width*focus.x-cropWidth/2)));return{left,top:0,width:cropWidth,height};}const cropHeight=Math.max(1,Math.round(width/target));const top=Math.max(0,Math.min(height-cropHeight,Math.round(height*focus.y-cropHeight/2)));return{left:0,top,width,height:cropHeight};};
for(const asset of assets){
  if(!asset.id||!asset.sceneId||!asset.sourcePage||!asset.fileUrl||!asset.license||!asset.filename){errors.push(`Unvollständiger Public-Media-Eintrag: ${JSON.stringify(asset)}`);continue;}
  if(!allowed.has(asset.license)){errors.push(`${asset.id}: Lizenz ${asset.license} nicht erlaubt.`);continue;}
  if(asset.licenseVerified!==true||asset.sourceVerified!==true||asset.visualReviewed!==true){errors.push(`${asset.id}: Lizenz, Source-Page und Bildinhalt müssen ausdrücklich geprüft sein.`);continue;}
  if(asset.containsPeople!==false||asset.containsLogos!==false||asset.containsThirdPartyArtwork!==false){errors.push(`${asset.id}: Standardprozess erlaubt keine ungeklärten Personen-, Logo- oder Kunstwerkrechte.`);continue;}
  if(!String(asset.sourcePage).startsWith('https://')||!String(asset.fileUrl).startsWith('https://')){errors.push(`${asset.id}: nur HTTPS erlaubt.`);continue;}
  if(asset.license.startsWith('CC-BY')&&(!asset.author||!asset.attribution||!asset.licenseUrl)){errors.push(`${asset.id}: CC BY benötigt Autor, Attribution und Lizenzlink.`);continue;}
  const scene=plan.scenes.find((candidate)=>candidate.id===asset.sceneId);if(!scene){errors.push(`${asset.id}: unbekannte Szene ${asset.sceneId}.`);continue;}
  if((scene.renderMode??'mechanism-only')==='mechanism-only'){errors.push(`${asset.id}: Szene ${asset.sceneId} ist weiterhin Remotion-only.`);continue;}
  const rawDestination=path.join(downloadsDir,asset.filename);
  if(!fs.existsSync(rawDestination)){const response=await fetch(asset.fileUrl,{headers:{'User-Agent':'Elektrotechnik-Kanal/2.0 public-media-fetcher'}});if(!response.ok){errors.push(`${asset.id}: Download fehlgeschlagen (${response.status}).`);continue;}const contentType=response.headers.get('content-type')??'';if(!contentType.startsWith('image/')){errors.push(`${asset.id}: URL liefert kein Bild (${contentType}).`);continue;}fs.writeFileSync(rawDestination,Buffer.from(await response.arrayBuffer()));}
  try{
    const meta=await sharp(rawDestination).metadata();const width=Number(meta.width)||0;const height=Number(meta.height)||0;const pixels=width*height;const shortEdge=Math.min(width,height);
    if(pixels<config.visuals.publicMedia.minimumSourcePixels||shortEdge<config.visuals.publicMedia.minimumSourceShortEdge){errors.push(`${asset.id}: Quelle zu klein (${width}×${height}).`);continue;}
    const focus=scene.publicMedia?.cropFocus??{x:.5,y:.5};const box=cropBox(width,height,focus);const destinationDir=path.resolve(root,scene.imageDir);fs.mkdirSync(destinationDir,{recursive:true});
    for(const existing of fs.readdirSync(destinationDir).filter((name)=>name.startsWith('public-')))fs.rmSync(path.join(destinationDir,existing),{force:true});
    const destination=path.join(destinationDir,`public-${asset.id}.jpg`);
    await sharp(rawDestination).extract(box).resize(1080,1920,{fit:'fill'}).jpeg({quality:92,mozjpeg:true}).toFile(destination);
    attributions.push({id:asset.id,sceneId:asset.sceneId,sourceProvider:asset.sourceProvider??'',sourcePage:asset.sourcePage,license:asset.license,licenseUrl:asset.licenseUrl??'',author:asset.author??'',attribution:asset.attribution??`Quelle: ${asset.sourcePage}`,modifications:asset.modificationsPlanned??'9:16 crop und Remotion-Grading',sourceWidth:width,sourceHeight:height,stagedWidth:1080,stagedHeight:1920,cropFocus:focus});
    console.log(`✓ Öffentliches Asset geladen und auf 1080×1920 vorbereitet: ${asset.id} → ${scene.id}`);
  }catch(error){errors.push(`${asset.id}: Bilddatei konnte nicht validiert werden: ${error.message}`);}
}
fs.mkdirSync(paths.exportDir,{recursive:true});const lines=attributions.map((item)=>`${item.id}: ${item.attribution} | ${item.license}${item.licenseUrl?` | ${item.licenseUrl}`:''} | ${item.sourcePage} | Änderungen: ${item.modifications}`);fs.writeFileSync(path.join(paths.exportDir,'public-media-attribution.txt'),lines.join('\n')+(lines.length?'\n':''));fs.writeFileSync(path.join(paths.projectDir,'public-media-report.json'),`${JSON.stringify({version:3,generatedAt:new Date().toISOString(),passed:errors.length===0,assets:attributions,errors,legalNote:'Lizenzmetadaten ersetzen keine individuelle Rechtsprüfung; Source-Page und sonstige Rechte wurden im Freigabeschritt dokumentiert.'},null,2)}\n`);if(errors.length){console.error('Public-Media-Prüfung fehlgeschlagen:');errors.forEach((error)=>console.error(`- ${error}`));process.exit(1);}console.log(`✓ ${attributions.length} öffentliche Assets geprüft, dokumentiert und reel-tauglich gecroppt.`);
