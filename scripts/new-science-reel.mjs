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
const sceneCount=Number(opt('scenes')??20);
const imageProductionSteps=5;

if(!week||!slot||!title) throw new Error('Pflicht: --week --slot --title');
if(!hook.endsWith('?')) throw new Error('Hook muss eine direkte Frage sein.');
if(!Number.isInteger(sceneCount)||sceneCount<12||sceneCount>28) throw new Error('Visuelle Beats für youtube-2min-v1: 12–28.');

const slug=title.normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/ß/g,'ss').replace(/[^a-zA-Z0-9]+/g,'-').replace(/^-+|-+$/g,'').toLowerCase();
const folderTitle=title.normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/ß/g,'ss').replace(/[^a-zA-Z0-9ÄÖÜäöüß]+/g,'-').replace(/^-+|-+$/g,'');
const root=path.join(process.cwd(),'channels/science/reels',week,`${String(Number(slot)).padStart(2,'0')}_${folderTitle}`);
if(fs.existsSync(root)) throw new Error(`Video existiert bereits: ${root}`);
for(const rel of ELECTRICAL_REEL_DIRECTORIES) fs.mkdirSync(path.join(root,rel),{recursive:true});

const plan=createElectricalScenePlanTemplate({slug,title,hook,compositionId:'ScienceReel',sceneCount});
const write=(rel,data)=>{const file=path.join(root,rel);fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,data);};
const json=(rel,value)=>write(rel,`${JSON.stringify(value,null,2)}\n`);

const stepSizes=Array(imageProductionSteps).fill(Math.floor(plan.scenes.length/imageProductionSteps));
for(let i=0;i<plan.scenes.length%imageProductionSteps;i+=1) stepSizes[i]+=1;
let cursor=0;
const imageSteps=stepSizes.map((size,index)=>{
  const sceneIds=plan.scenes.slice(cursor,cursor+size).map((scene)=>scene.id);
  cursor+=size;
  return {step:index+1,sceneIds};
});
const imageStepById=new Map(imageSteps.flatMap((group)=>group.sceneIds.map((id)=>[id,group.step])));

const flowPlan={
  version:'science-flow-image-v1',
  productionProfile:'youtube-2min-v1',
  workflow:'thumbnail-first-then-five-image-steps-no-intermediate-stops',
  imageOnly:true,
  imageProductionSteps,
  pauseAfterEachImageStep:false,
  continueAutomaticallyBetweenImageSteps:true,
  finalReportAfterAllImageSteps:true,
  diversityRequired:true,
  steps:imageSteps,
  scenes:plan.scenes.map((scene)=>({
    id:scene.id,
    output:'image',
    imageStep:imageStepById.get(scene.id),
    visualType:'UNGEPLANT',
    primaryMotif:'UNGEPLANT'
  }))
};

write('README.md',`# ${title}\n\nProfil: **youtube-2min-v1** · 16:9 · ca. 2 Minuten\n\nZentrale Frage: ${hook}\n\nSkriptstruktur: Hook → Kontext → Grundlage → Mechanismus → Vertiefung → Payoff.\n\nBildwelt: **Scientific Scene Explainer v1**. Vor Bildproduktion muss das Skript auf visuelle Wiederholungsgefahr geprüft werden. Mindestens fünf unterschiedliche Darstellungsformen; keine Kette fast identischer Bilder.\n\nGoogle Flow: nur statische Bilder. Erst drei Thumbnails → STOPP/Auswahl → genau fünf Bildschritte. Nach der Cover-Auswahl **keine Zwischenstopps**; Bildschritt 1 bis 5 automatisch vollständig abarbeiten und erst danach Gesamtabschluss melden.\n\nFinales Video: **keine eingebrannten Untertitel/Captions**.\n`);
write('01-script-audio/script.md',`# Sprechtext\n\n## Hook\n${hook}\n\n## Kontext\n\n## Grundlage\n\n## Mechanismus\n\n## Vertiefung\n\n## Payoff\n`);
write('01-script-audio/script-fliesstext.txt',`${hook} Vollständigen 2-Minuten-Sprechtext nach LONGFORM.md ergänzen.\n`);
write('01-script-audio/voiceover.txt',`${hook} Vollständigen finalen Voice-over-Text ergänzen.\n`);
write('01-script-audio/audio/00_AUDIO_HIER_EINFUEGEN.md','# Audio erst nach bestandenem Preflight einfügen.\n');
write('01-script-audio/sfx/README.md','# Optionale, sparsame SFX.\n');
write('02-bilder/bildprompts.md','# Scientific Scene Explainer · YouTube 16:9\n\nVor Prompts zuerst Visual-Diversity planen: unterschiedliche Umgebungen, Objekt-/Messbilder, Cutaways, Materialansichten, Vergleiche und reale Anwendungen abwechseln. Keine große Überschrift in normalen Szenen; bevorzugt 0–2 Labels. Keine gesichtslosen sichtbaren Köpfe.\n');
write('02-bilder/images/00_BILDER_HIER_EINFUEGEN.md','# Für jeden Beat genau ein finales statisches 16:9-Bild. Keine KI-Videoclips. Nach Cover-Auswahl alle fünf Bildschritte ohne Zwischenstopp vollständig abarbeiten.\n');
write('02-bilder/thumbnail/README.md','# Thumbnail\n\nDrei 1280×720-Kandidaten → STOPP → Nutzerauswahl. Das gewählte Thumbnail ist nur Qualitäts-/Illustrationsreferenz, keine Farb- oder Layoutvorlage für alle Szenen. Nach der Auswahl keine weiteren Freigaben bis alle fünf Bildschritte fertig sind.\n');
write('02-bilder/GOOGLE-FLOW-MASTER-PROMPT.txt','# NOCH NICHT FINAL\n\nErst Skript, Visual-Diversity, Beats, Einzelprompts und flow-plan.json finalisieren. Dabei `visualType` und `primaryMotif` für jeden Beat konkret eintragen. Dann:\n\nnpm run science:flow-master -- "<video-ordner>"\n');
write('03-caption/social-caption.md',`# YouTube-Beschreibung\n\n${title}\n\nHinweis: Dieser Ordner enthält keine eingebrannten Video-Untertitel.\n`);
write('04-pdf/inhalt.md',`# Lernzettel – ${title}\n`);
write('05-export/README.md','# Export nach Readiness und QA.\n');
write('05-export/video/README.md','# Finales 1920×1080-Video ohne eingebrannte Untertitel\n');
write('06-projektdateien/motion-design.md','# Static Image + Remotion Contract\n\n- 1920×1080 / 16:9\n- nur finale statische Bilder\n- fünf Bildschritte nach Cover-Auswahl\n- keine Zwischenstopps zwischen Bildschritt 1–5\n- visuelle Vielfalt ist Pflicht\n- keine KI-Videoclips / kein Image-to-Video\n- keine Kamerabewegung / Animation\n- keine eingebrannten Untertitel\n- harte Schnitte\n');
write('06-projektdateien/sources.md','# Quellen\n');
write('06-projektdateien/storyboard.md','# Storyboard\n\nStory zuerst. Danach Visual-Diversity planen. Jeder Beat erhält in `flow-plan.json` einen konkreten `visualType` und ein `primaryMotif`. Drei benachbarte fast identische Bildideen sind ein Skriptfehler und müssen vor der Produktion umgeschrieben werden. Nach der Cover-Auswahl werden die fünf Bildschritte ohne Zwischenfreigaben komplett abgearbeitet.\n');
json('06-projektdateien/scene-plan.json',plan);
json('06-projektdateien/flow-plan.json',flowPlan);
json('06-projektdateien/prompt-manifest.json',createElectricalPromptManifestTemplate(plan));
json('06-projektdateien/visual-policy.json',{version:'science-static-v1',productionProfile:'youtube-2min-v1',productionMode:'flow-image-only',brandVisualStyleDefined:true,styleId:'scientific-scene-explainer-v1',generatedImageTextPolicy:'controlled-german-only',visibleImageLanguage:'de',width:1920,height:1080,thumbnailRequired:true,thumbnailCandidateCount:3,imageOnly:true,imageProductionSteps:5,pauseAfterEachImageStep:false,continueAutomaticallyBetweenImageSteps:true,finalReportAfterAllImageSteps:true,visualDiversityRequired:true,blankOrFeaturelessVisibleFacesForbidden:true,burnedInCaptions:false,flowAiVideoAllowed:false,remotionAnimationAllowed:false,transitionPolicy:'hard-cut'});
json('06-projektdateien/production-status.json',createElectricalStatusTemplate(plan));
json('06-projektdateien/asset-manifest.json',{version:'science-v1',slug,assets:[]});

console.log(`✓ YouTube-Science-Video angelegt: ${root}`);
console.log('Vor Bildproduktion: Skript-Diversity prüfen, visualType/primaryMotif planen und science:flow-master ausführen.');
