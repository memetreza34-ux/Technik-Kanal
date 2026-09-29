#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import {ScenePlan} from './lib/electrical-contracts.mjs';
import {electricalProjectPaths} from './lib/electrical-project-structure.mjs';
import {findMedia,imageExtensions} from './lib/electrical-project.mjs';
import {loadElectricalConfig} from './lib/load-electrical-config.mjs';

const [projectArg]=process.argv.slice(2).filter((arg)=>!arg.startsWith('--'));
if(!projectArg) throw new Error('Nutzung: npm run science:image-qa -- <reel-ordner>');
const root=path.resolve(projectArg);const paths=electricalProjectPaths(root);const plan=ScenePlan.parse(JSON.parse(fs.readFileSync(paths.scenePlan,'utf8')));const config=loadElectricalConfig();const errors=[];const warnings=[];const analyses=[];
const scienceStatic=plan.visualPolicyVersion===config.visuals.policyVersion;
const selectImage=(dir)=>{const images=findMedia(dir,imageExtensions).filter((file)=>!path.basename(file).startsWith('.generated-'));return images.find((file)=>/(?:final|approved|freigabe)/i.test(path.basename(file)))??images[0];};
const analyze=async(file,label)=>{
  const {data,info}=await sharp(file).resize({width:96,height:171,fit:'fill'}).removeAlpha().raw().toBuffer({resolveWithObject:true});
  const channels=info.channels;const pixels=[];
  for(let y=0;y<info.height;y+=1) for(let x=0;x<info.width;x+=1){const offset=(y*info.width+x)*channels;pixels.push({x,y,r:data[offset],g:data[offset+1],b:data[offset+2]});}
  const topHeight=Math.max(1,Math.round(info.height*0.12));const sideWidth=Math.max(1,Math.round(info.width*0.08));const region=(predicate)=>pixels.filter(predicate);
  const whiteRatio=(items)=>items.filter(({r,g,b})=>r>232&&g>232&&b>232&&Math.max(r,g,b)-Math.min(r,g,b)<18).length/Math.max(1,items.length);
  const stats=(items)=>{const values=items.flatMap(({r,g,b})=>[r,g,b]);const mean=values.reduce((sum,value)=>sum+value,0)/Math.max(1,values.length);const variance=values.reduce((sum,value)=>sum+((value-mean)**2),0)/Math.max(1,values.length);return{mean,stdDev:Math.sqrt(variance)};};
  const top=region(({y})=>y<topHeight);const bottom=region(({y})=>y>=info.height-topHeight);const edges=region(({x,y})=>x<sideWidth||x>=info.width-sideWidth||y<topHeight||y>=info.height-topHeight);
  const edgeColor=edges.reduce((acc,{r,g,b})=>({r:acc.r+r,g:acc.g+g,b:acc.b+b}),{r:0,g:0,b:0});edgeColor.r/=Math.max(1,edges.length);edgeColor.g/=Math.max(1,edges.length);edgeColor.b/=Math.max(1,edges.length);
  const topWhite=whiteRatio(top);const bottomWhite=whiteRatio(bottom);const fullWhite=whiteRatio(pixels);const topStats=stats(top);const bottomStats=stats(bottom);const threshold=config.imageAnalysis.whiteBandMaximumRatio??0.34;
  if(topWhite>threshold) errors.push(`${label}: weißer/hellgrauer Balken oben erkannt.`);
  if(bottomWhite>threshold) errors.push(`${label}: weißer/hellgrauer Balken unten erkannt.`);
  if(fullWhite>(config.imageAnalysis.fullImageWhiteMaximumRatio??0.16)) errors.push(`${label}: zu großer weißer Flächenanteil.`);
  if(topStats.mean>220&&topStats.stdDev<12) errors.push(`${label}: leere helle Titelkartenfläche oben erkannt.`);
  if(bottomStats.mean>220&&bottomStats.stdDev<12) errors.push(`${label}: leere helle Fläche unten erkannt.`);
  analyses.push({label,file:path.relative(root,file).split(path.sep).join('/'),topWhiteRatio:Number(topWhite.toFixed(3)),bottomWhiteRatio:Number(bottomWhite.toFixed(3)),fullWhiteRatio:Number(fullWhite.toFixed(3)),edgeColor});
};

// Science Static besitzt kein separates Coverbild. Bild 01 wird genau wie jede andere
// Szene einmal geprüft und ist zugleich die Coverquelle.
if(!scienceStatic){const cover=selectImage(path.join(paths.imageDir,'00-cover'));if(cover) await analyze(cover,'Legacy-Cover');}
for(const scene of plan.scenes.filter((item)=>(item.renderMode??'image-only')==='image-only')){const file=selectImage(path.resolve(root,scene.imageDir));if(file) await analyze(file,scene.id);}

const distance=(a,b)=>Math.hypot(a.r-b.r,a.g-b.g,a.b-b.b);const clusters=[];
for(const item of analyses){const existing=clusters.find((cluster)=>distance(cluster.center,item.edgeColor)<(config.imageAnalysis.backgroundClusterDistance??28));if(existing){existing.items.push(item.label);const n=existing.items.length;existing.center={r:((existing.center.r*(n-1))+item.edgeColor.r)/n,g:((existing.center.g*(n-1))+item.edgeColor.g)/n,b:((existing.center.b*(n-1))+item.edgeColor.b)/n};}else clusters.push({center:{...item.edgeColor},items:[item.label]});}
const minimumClusters=Math.min(config.imageAnalysis.minimumBackgroundClusters??2,Math.max(1,analyses.length));if(analyses.length>=4&&clusters.length<minimumClusters) errors.push(`Bildserie ist farblich zu monoton: ${clusters.length} Farbfamilien; mindestens ${minimumClusters}.`);
if(clusters.some((cluster)=>cluster.items.length>=Math.ceil(analyses.length*0.7))) warnings.push('Mehr als 70 % der Szenenbilder verwenden eine sehr ähnliche Randfarbe; fachliche Kohärenz prüfen, aber keine künstliche Variation erzwingen.');

const report={version:'science-static-image-appearance-v1',generatedAt:new Date().toISOString(),passed:errors.length===0,visualPolicyVersion:plan.visualPolicyVersion,analyzedImages:analyses.length,coverSourceScene:scienceStatic?plan.scenes[0]?.id??null:null,backgroundClusters:clusters.map((cluster)=>({items:cluster.items,center:Object.fromEntries(Object.entries(cluster.center).map(([key,value])=>[key,Number(value.toFixed(1))]))})),generatedImagesMustBeTextFree:true,separateCoverRequired:false,manualReview:'Prüfe fachliche Plausibilität, Anti-KI-Look, Serienkontinuität, klare Ein-Aussage-Komposition und unerwünschte Schrift/Logos. Bild 01 muss zusätzlich als Cover funktionieren.',analyses,errors,warnings};
fs.writeFileSync(path.join(paths.projectDir,'image-appearance-report.json'),`${JSON.stringify(report,null,2)}\n`);
if(errors.length){console.error('Science-Bilddarstellungs-QA fehlgeschlagen:');errors.forEach((error)=>console.error(`- ${error}`));process.exit(1);}
console.log(`✓ Science-Bilddarstellungs-QA bestanden: ${analyses.length} Bilder, keine weißen Balken, ${clusters.length} Farbfamilien.`);
warnings.forEach((warning)=>console.warn(`⚠ ${warning}`));
