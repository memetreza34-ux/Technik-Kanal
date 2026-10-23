#!/usr/bin/env node
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {createHash} from 'node:crypto';
import sharp from 'sharp';
import {electricalProjectPaths} from './lib/electrical-project-structure.mjs';
import {findMedia,imageExtensions} from './lib/electrical-project.mjs';
import {flowSceneLabels} from './lib/science-flow-prompt.mjs';
import {analyzeSceneText,ocrImageWords,preferredOcrLanguage,tesseractAvailable,tesseractLanguages} from './lib/science-image-text.mjs';

// OCR-Gate vor dem Rendern: liest den sichtbaren Text jedes finalen Szenenbilds und blockiert
// Szenen-Metadaten sowie nicht verlangte große Schrift. Nur ein Mensch kann einzelne Szenen
// nach Sichtprüfung mit --accept=<id>,<id> freigeben. Die Freigabe gilt nur für genau diese
// Bilddatei (SHA-256); wird das Bild ersetzt, prüft das Gate wieder streng.

const args=process.argv.slice(2);
const projectArg=args.find((arg)=>!arg.startsWith('--'));
if(!projectArg){console.error('Nutzung: npm run science:image-text-qa -- <video-ordner> [--accept=szene-id,szene-id]');process.exit(1);}
const acceptNow=new Set((args.find((arg)=>arg.startsWith('--accept='))?.slice(9)??'').split(',').map((id)=>id.trim()).filter(Boolean));
const root=path.resolve(projectArg);
const paths=electricalProjectPaths(root);
const plan=JSON.parse(fs.readFileSync(paths.scenePlan,'utf8'));
const scenes=Array.isArray(plan.scenes)?plan.scenes:[];
const acceptanceFile=path.join(paths.projectDir,'image-text-acceptances.json');
const acceptances=fs.existsSync(acceptanceFile)?JSON.parse(fs.readFileSync(acceptanceFile,'utf8')):{};
const sha256=(file)=>createHash('sha256').update(fs.readFileSync(file)).digest('hex');

if(!tesseractAvailable()){
  console.error('OCR-Text-Gate: tesseract fehlt. Installation auf dem Mac: brew install tesseract tesseract-lang');
  process.exit(1);
}
const languages=tesseractLanguages();
const lang=preferredOcrLanguage(languages);
const warnings=[];
if(!languages.includes('deu'))warnings.push('Deutsches OCR-Paket fehlt (brew install tesseract-lang). Umlaute in Labels werden schlechter erkannt.');

const selectImage=(dir)=>{
  const images=findMedia(dir,imageExtensions).filter((file)=>!path.basename(file).startsWith('.generated-'));
  const approved=images.filter((file)=>/(?:final|approved|freigabe)/i.test(path.basename(file)));
  if(images.length===1) return images[0];
  if(approved.length===1) return approved[0];
  return undefined;
};

const sceneIds=scenes.map((scene)=>scene.id);
const sectionNames=[...new Set(scenes.map((scene)=>scene.section).filter(Boolean))];
const errors=[];
const results=[];
const tempDir=fs.mkdtempSync(path.join(os.tmpdir(),'science-ocr-'));
process.on('exit',()=>fs.rmSync(tempDir,{recursive:true,force:true}));
for(const scene of scenes){
  const file=selectImage(path.resolve(root,scene.imageDir??''));
  if(!file){errors.push(`${scene.id}: kein eindeutiges finales Bild für die OCR-Prüfung gefunden.`);continue;}
  const promptFile=path.join(paths.promptDir,`${scene.id}.txt`);
  const promptText=fs.existsSync(promptFile)?fs.readFileSync(promptFile,'utf8'):'';
  const allowedLabels=flowSceneLabels(promptText,scene);
  // Google Flow liefert oft nur ~1376×768; kleine Metadaten wären dann ~14 px hoch und für OCR zu klein.
  const {width=1920}=await sharp(file).metadata();
  const scale=width<2400?2:1;
  const ocrFile=path.join(tempDir,`${scene.id}.png`);
  const info=await sharp(file).resize({width:Math.round(width*scale)}).grayscale().png().toFile(ocrFile);
  const words=ocrImageWords(ocrFile,{lang});
  const analysis=analyzeSceneText({words,imageHeight:info.height,allowedLabels,sceneIds,sectionNames});
  const hash=sha256(file);
  if(acceptNow.has(scene.id))acceptances[scene.id]={sha256:hash,acceptedAt:new Date().toISOString(),errorsAtAcceptance:analysis.errors};
  const acceptedManually=analysis.errors.length>0&&acceptances[scene.id]?.sha256===hash;
  results.push({id:scene.id,file:path.relative(root,file).split(path.sep).join('/'),allowedLabels,detectedText:analysis.detected,errors:analysis.errors,warnings:analysis.warnings,acceptedManually});
  for(const error of analysis.errors)(acceptedManually?warnings:errors).push(`${scene.id}: ${error}${acceptedManually?' (manuell freigegeben)':''}`);
  for(const warning of analysis.warnings)warnings.push(`${scene.id}: ${warning}`);
}
for(const id of acceptNow)if(!sceneIds.includes(id))errors.push(`--accept nennt unbekannte Szene: ${id}`);

fs.mkdirSync(paths.projectDir,{recursive:true});
if(acceptNow.size)fs.writeFileSync(acceptanceFile,`${JSON.stringify(acceptances,null,2)}\n`);
const report={version:'science-image-text-qa-v1',generatedAt:new Date().toISOString(),passed:errors.length===0,ocrLanguage:lang,checkedImages:results.length,manuallyAccepted:results.filter((item)=>item.acceptedManually).map((item)=>item.id),rule:'Szenenbilder enthalten nur ausdrücklich verlangte deutsche Labels. Szenen-IDs, Abschnittsnamen, Dateinamen und nicht verlangte große Schrift blockieren das Rendern.',scenes:results,errors,warnings};
fs.writeFileSync(path.join(paths.projectDir,'image-text-qa-report.json'),`${JSON.stringify(report,null,2)}\n`);
if(errors.length){
  console.error('OCR-Text-Gate fehlgeschlagen – betroffene Bilder in Google Flow neu erzeugen:');
  errors.forEach((error)=>console.error(`- ${error}`));
  console.error('Nur nach eigener Sichtprüfung freigeben: npm run science:image-text-qa -- "<video-ordner>" --accept=<szene-id>');
  process.exit(1);
}
console.log(`✓ OCR-Text-Gate bestanden: ${results.length} Szenenbilder ohne Metadaten oder nicht verlangte große Schrift (${lang}).`);
warnings.forEach((warning)=>console.warn(`⚠ ${warning}`));
