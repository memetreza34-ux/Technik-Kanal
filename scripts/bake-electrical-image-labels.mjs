#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import {ScenePlan} from './lib/electrical-contracts.mjs';
import {electricalProjectPaths} from './lib/electrical-project-structure.mjs';
import {findMedia, imageExtensions} from './lib/electrical-project.mjs';

const [projectArg] = process.argv.slice(2).filter((arg) => !arg.startsWith('--'));
if (!projectArg) throw new Error('Nutzung: node scripts/bake-electrical-image-labels.mjs <reel-ordner>');
const root = path.resolve(projectArg);
const paths = electricalProjectPaths(root);
const plan = ScenePlan.parse(JSON.parse(fs.readFileSync(paths.scenePlan,'utf8')));
const outputDir = path.join(paths.imageDir,'final-labeled');
fs.rmSync(outputDir,{recursive:true,force:true});
fs.mkdirSync(outputDir,{recursive:true});

const selectImage = (dir) => {
  const images = findMedia(dir,imageExtensions).filter((file)=>!path.basename(file).startsWith('.generated-'));
  return images.find((file)=>/(?:final|approved|freigabe)/i.test(path.basename(file))) ?? images[0];
};
const escapeXml = (value) => String(value).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&apos;');
const wrap = (text,max=26) => {
  const forced = String(text).split('|').map((part)=>part.trim()).filter(Boolean);
  if (forced.length > 1) return forced;
  const words = String(text).split(/\s+/).filter(Boolean);
  const lines=[];let current='';
  for (const word of words) {
    const candidate=current?`${current} ${word}`:word;
    if (candidate.length>max && current) {lines.push(current);current=word;} else current=candidate;
  }
  if (current) lines.push(current);
  return lines.slice(0,3);
};
const accentFor = (id) => id.includes('fehler')||id.includes('abschaltung')?'#ff5a67':id.includes('pe-vs-n')?'#43c8ff':'#d9e82e';
const svgFor = ({label,cover=false,id=''}) => {
  const lines=wrap(label,cover?23:30);
  const fontSize=cover?84:48;
  const lineHeight=fontSize*1.08;
  const y=cover?205:235;
  const accent=cover?'#d9e82e':accentFor(id);
  const text=lines.map((line,index)=>`<text x="${cover?540:92}" y="${y+index*lineHeight}" text-anchor="${cover?'middle':'start'}" font-family="Arial,Helvetica,sans-serif" font-size="${fontSize}" font-weight="900" fill="#ffffff">${escapeXml(line)}</text>`).join('');
  return Buffer.from(`<svg width="1080" height="1920" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#020914" stop-opacity="0.82"/><stop offset="1" stop-color="#020914" stop-opacity="0"/></linearGradient><filter id="s"><feDropShadow dx="0" dy="4" stdDeviation="6" flood-color="#000000" flood-opacity="0.9"/></filter></defs><rect x="0" y="0" width="1080" height="520" fill="url(#g)"/>${cover?`<rect x="360" y="86" width="360" height="8" rx="4" fill="${accent}"/>`:`<rect x="72" y="142" width="8" height="${Math.max(76,lines.length*lineHeight)}" rx="4" fill="${accent}"/>`}<g filter="url(#s)">${text}</g></svg>`);
};

const items=[{id:'00-cover',label:plan.coverText,dir:path.join(paths.imageDir,'00-cover'),cover:true},...plan.scenes.filter((scene)=>scene.renderMode!=='mechanism-only').map((scene)=>({id:scene.id,label:scene.imageLabel??scene.headline??scene.title,dir:path.resolve(root,scene.imageDir),cover:false}))];
const manifest=[];
for (const item of items) {
  const source=selectImage(item.dir);
  if (!source) throw new Error(`Basisbild fehlt für ${item.id}: ${item.dir}`);
  const output=path.join(outputDir,`${item.id}.png`);
  await sharp(source).resize(1080,1920,{fit:'cover',position:'centre'}).composite([{input:svgFor(item),top:0,left:0}]).png({quality:96}).toFile(output);
  manifest.push({id:item.id,label:item.label,source:path.relative(root,source).split(path.sep).join('/'),output:path.relative(root,output).split(path.sep).join('/')});
  console.log(`✓ ${item.id}: ${output}`);
}
fs.writeFileSync(path.join(outputDir,'manifest.json'),`${JSON.stringify({version:'visual-v5',generatedAt:new Date().toISOString(),items:manifest},null,2)}\n`);
console.log(`✓ ${manifest.length} final beschriftete PNGs erstellt. Die deutsche Schrift ist jetzt im Bild eingebrannt.`);
