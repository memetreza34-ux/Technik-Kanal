#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import {ScenePlan} from './lib/electrical-contracts.mjs';
import {electricalProjectPaths} from './lib/electrical-project-structure.mjs';
import {findMedia,imageExtensions} from './lib/electrical-project.mjs';
import {loadElectricalConfig} from './lib/load-electrical-config.mjs';

const [projectArg]=process.argv.slice(2).filter((arg)=>!arg.startsWith('--'));
if(!projectArg) throw new Error('Nutzung: npm run science:image-qa -- <video-ordner>');
const root=path.resolve(projectArg);
const paths=electricalProjectPaths(root);
const plan=ScenePlan.parse(JSON.parse(fs.readFileSync(paths.scenePlan,'utf8')));
const config=loadElectricalConfig(plan.productionProfile);
const errors=[];
const warnings=[];
const analyses=[];

const selectImage=(dir)=>{
  const images=findMedia(dir,imageExtensions).filter((file)=>!path.basename(file).startsWith('.generated-'));
  const approved=images.filter((file)=>/(?:final|approved|freigabe)/i.test(path.basename(file)));
  if(images.length===1) return images[0];
  if(approved.length===1) return approved[0];
  return undefined;
};

const analyze=async(file,label)=>{
  const metadata=await sharp(file).metadata();
  const width=metadata.width??0;const height=metadata.height??0;const aspect=height?width/height:0;
  if(width<(config.imageAnalysis.minimumWidth??1280)||height<(config.imageAnalysis.minimumHeight??720)) errors.push(`${label}: Bildauflösung ${width}×${height} ist zu klein.`);
  if(aspect<(config.imageAnalysis.landscapeAspectMin??1.7)||aspect>(config.imageAnalysis.landscapeAspectMax??1.85)) errors.push(`${label}: Bildformat ist nicht 16:9-nah genug (${aspect.toFixed(3)}).`);

  const {data,info}=await sharp(file).resize({width:171,height:96,fit:'fill'}).removeAlpha().raw().toBuffer({resolveWithObject:true});
  const channels=info.channels;const pixels=[];
  for(let y=0;y<info.height;y+=1) for(let x=0;x<info.width;x+=1){const offset=(y*info.width+x)*channels;pixels.push({x,y,r:data[offset],g:data[offset+1],b:data[offset+2]});}
  const topHeight=Math.max(1,Math.round(info.height*0.12));const sideWidth=Math.max(1,Math.round(info.width*0.08));const region=(predicate)=>pixels.filter(predicate);
  const whiteRatio=(items)=>items.filter(({r,g,b})=>r>232&&g>232&&b>232&&Math.max(r,g,b)-Math.min(r,g,b)<18).length/Math.max(1,items.length);
  const stats=(items)=>{const values=items.flatMap(({r,g,b})=>[r,g,b]);const mean=values.reduce((sum,value)=>sum+value,0)/Math.max(1,values.length);const variance=values.reduce((sum,value)=>sum+((value-mean)**2),0)/Math.max(1,values.length);return{mean,stdDev:Math.sqrt(variance)};};
  const top=region(({y})=>y<topHeight);const bottom=region(({y})=>y>=info.height-topHeight);const edges=region(({x,y})=>x<sideWidth||x>=info.width-sideWidth||y<topHeight||y>=info.height-topHeight);
  const whiteThreshold=config.imageAnalysis.whiteBandMaximumRatio??0.34;
  const topWhite=whiteRatio(top);const bottomWhite=whiteRatio(bottom);const fullWhite=whiteRatio(pixels);const topStats=stats(top);const bottomStats=stats(bottom);
  if(topWhite>whiteThreshold) warnings.push(`${label}: großer heller Bereich oben; prüfen, ob er fachlich/gestalterisch gewollt ist.`);
  if(bottomWhite>whiteThreshold) warnings.push(`${label}: großer heller Bereich unten; prüfen, ob er fachlich/gestalterisch gewollt ist.`);
  if(fullWhite>(config.imageAnalysis.fullImageWhiteMaximumRatio??0.16)) warnings.push(`${label}: hoher weißer Flächenanteil; nur akzeptieren, wenn der helle Stil bewusst gewählt wurde.`);
  if(topStats.mean>220&&topStats.stdDev<12) warnings.push(`${label}: sehr ruhige helle Fläche oben erkannt.`);
  if(bottomStats.mean>220&&bottomStats.stdDev<12) warnings.push(`${label}: sehr ruhige helle Fläche unten erkannt.`);
  const edgeColor=edges.reduce((acc,{r,g,b})=>({r:acc.r+r,g:acc.g+g,b:acc.b+b}),{r:0,g:0,b:0});edgeColor.r/=Math.max(1,edges.length);edgeColor.g/=Math.max(1,edges.length);edgeColor.b/=Math.max(1,edges.length);
  analyses.push({label,file:path.relative(root,file).split(path.sep).join('/'),width,height,aspectRatio:Number(aspect.toFixed(3)),topWhiteRatio:Number(topWhite.toFixed(3)),bottomWhiteRatio:Number(bottomWhite.toFixed(3)),fullWhiteRatio:Number(fullWhite.toFixed(3)),edgeColor});
};

for(const scene of plan.scenes){
  const file=selectImage(path.resolve(root,scene.imageDir));
  if(!file){errors.push(`${scene.id}: kein eindeutig freigegebenes Bild für Bild-QA gefunden.`);continue;}
  await analyze(file,scene.id);
}

const distance=(a,b)=>Math.hypot(a.r-b.r,a.g-b.g,a.b-b.b);const clusters=[];
for(const item of analyses){const existing=clusters.find((cluster)=>distance(cluster.center,item.edgeColor)<(config.imageAnalysis.backgroundClusterDistance??28));if(existing){existing.items.push(item.label);const n=existing.items.length;existing.center={r:((existing.center.r*(n-1))+item.edgeColor.r)/n,g:((existing.center.g*(n-1))+item.edgeColor.g)/n,b:((existing.center.b*(n-1))+item.edgeColor.b)/n};}else clusters.push({center:{...item.edgeColor},items:[item.label]});}
const minimumClusters=Math.min(config.imageAnalysis.minimumBackgroundClusters??2,Math.max(1,analyses.length));
if(analyses.length>=6&&clusters.length<minimumClusters) warnings.push(`Bildserie nutzt nur ${clusters.length} Farbfamilien; prüfen, ob die Wiederholung inhaltlich sinnvoll oder zu monoton ist.`);

const report={version:'science-static-image-appearance-v2',productionProfile:config.productionProfile,generatedAt:new Date().toISOString(),passed:errors.length===0,visualPolicyVersion:plan.visualPolicyVersion,analyzedImages:analyses.length,backgroundClusters:clusters.map((cluster)=>({items:cluster.items,center:Object.fromEntries(Object.entries(cluster.center).map(([key,value])=>[key,Number(value.toFixed(1))]))})),generatedImagesMustBeTextFree:false,visibleTextPolicy:'controlled-german-only',manualReview:'Prüfe fachliche Plausibilität, Anti-KI-Look, Serienkontinuität, klare Ein-Aussage-Komposition sowie sichtbaren Bildtext: nur Deutsch, korrekt geschrieben, fachlich richtig, keine Logos/Wasserzeichen.',analyses,errors,warnings};
fs.writeFileSync(path.join(paths.projectDir,'image-appearance-report.json'),`${JSON.stringify(report,null,2)}\n`);
if(errors.length){console.error('Science-Bilddarstellungs-QA fehlgeschlagen:');errors.forEach((error)=>console.error(`- ${error}`));process.exit(1);}
console.log(`✓ 16:9-Bild-QA bestanden: ${analyses.length} Bilder.`);
warnings.forEach((warning)=>console.warn(`⚠ ${warning}`));
