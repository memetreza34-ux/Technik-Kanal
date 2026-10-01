#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {createElectricalPromptManifestTemplate,createElectricalScenePlanTemplate,createElectricalStatusTemplate} from './lib/create-electrical-scene-plan-template.mjs';
import {ELECTRICAL_REEL_DIRECTORIES} from './lib/electrical-project-structure.mjs';

const args=process.argv.slice(2);
const opt=(name)=>args.find((x)=>x.startsWith(`--${name}=`))?.slice(name.length+3);
const week=opt('week');
const slot=opt('slot');
const title=opt('title');
const hook=(opt('hook')??title??'').trim();
const sceneCount=Number(opt('scenes')??10);

if(!week||!slot||!title) throw new Error('Pflicht: --week --slot --title');
if(!hook.endsWith('?')) throw new Error('Hook muss eine direkte Frage sein.');
if(!Number.isInteger(sceneCount)||sceneCount<6||sceneCount>16) throw new Error('Visuelle Beats: 6–16.');

const slug=title.normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/ß/g,'ss').replace(/[^a-zA-Z0-9]+/g,'-').replace(/^-+|-+$/g,'').toLowerCase();
const folderTitle=title.normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/ß/g,'ss').replace(/[^a-zA-Z0-9ÄÖÜäöüß]+/g,'-').replace(/^-+|-+$/g,'');
const root=path.join(process.cwd(),'channels/science/reels',week,`${String(Number(slot)).padStart(2,'0')}_${folderTitle}`);
if(fs.existsSync(root)) throw new Error(`Reel existiert bereits: ${root}`);
for(const rel of ELECTRICAL_REEL_DIRECTORIES) fs.mkdirSync(path.join(root,rel),{recursive:true});

const plan=createElectricalScenePlanTemplate({slug,title,hook,compositionId:'ScienceReel',sceneCount});
const write=(rel,data)=>{const file=path.join(root,rel);fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,data);};
const json=(rel,value)=>write(rel,`${JSON.stringify(value,null,2)}\n`);

write('README.md',`# ${title}\n\nHook: ${hook}\n\nBildwelt: **Scientific Scene Explainer v1**. Pro Beat den konkreten Skriptsatz visuell erklären; volle Umgebung nutzen, wenn sie hilft; sichtbarer Bildtext nur auf Deutsch.\n`);
write('01-script-audio/script.md',`# Sprechtext\n\n${hook}\n\nRecherche und Erklärung ergänzen.\n`);
write('01-script-audio/script-fliesstext.txt',`${hook} Erklärung ergänzen.\n`);
write('01-script-audio/voiceover.txt',`${hook} Erklärung ergänzen.\n`);
write('01-script-audio/audio/00_AUDIO_HIER_EINFUEGEN.md','# Audio nach bestandenem Preflight einfügen.\n');
write('01-script-audio/sfx/README.md','# Optionale SFX.\n');
write('02-bilder/bildprompts.md','# Scientific Scene Explainer\n\nFür jeden Skriptsatz eine eigene visuelle Hauptidee entwickeln. Umgebung/Ort nutzen, wenn sie das Verständnis verbessert. Illustration, Cutaway, Mikroansicht, Vergleich oder stilisierte Menschen nur verwenden, wenn sie für die Aussage passend sind. Kein fixer Hintergrund. Titel, Labels, Merksatz, Zahl oder Pfeile nur wenn nötig. Sichtbarer Bildtext ausschließlich auf Deutsch. So wenig Information wie möglich, so viel wie nötig.\n');
write('02-bilder/images/00_BILDER_HIER_EINFUEGEN.md','# Finale statische Szenenbilder hier einfügen. Bildtexte vor Freigabe auf deutsche Sprache, Rechtschreibung und fachliche Richtigkeit prüfen.\n');
write('03-caption/social-caption.md',`# Social Caption\n\n${title}\n`);
write('04-pdf/inhalt.md',`# Lernzettel – ${title}\n`);
write('05-export/README.md','# Export nach Readiness und QA.\n');
write('05-export/video/README.md','# Finales Video\n');
write('06-projektdateien/motion-design.md','# Static Edit Contract\n\n- statische Bilder\n- harte Schnitte\n- keine Kamerabewegung\n');
write('06-projektdateien/sources.md','# Quellen\n');
write('06-projektdateien/storyboard.md','# Storyboard\n\nJeden Beat aus dem konkreten Skriptsatz entwickeln und nach `gehirn/BILDWELT.md` visualisieren.\n');
json('06-projektdateien/scene-plan.json',plan);
json('06-projektdateien/prompt-manifest.json',createElectricalPromptManifestTemplate(plan));
json('06-projektdateien/visual-policy.json',{version:'science-static-v1',brandVisualStyleDefined:true,styleId:'scientific-scene-explainer-v1',generatedImageTextPolicy:'controlled-german-only',visibleImageLanguage:'de',animationAllowed:false,cameraMotionAllowed:false,transitionPolicy:'hard-cut'});
json('06-projektdateien/production-status.json',createElectricalStatusTemplate(plan));
json('06-projektdateien/asset-manifest.json',{version:'science-v1',slug,assets:[]});

console.log(`✓ Science-Reel angelegt: ${root}`);
console.log('Bildwelt: Scientific Scene Explainer v1.');
