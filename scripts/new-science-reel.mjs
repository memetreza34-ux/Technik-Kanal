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

if(!week||!slot||!title) throw new Error('Pflicht: --week --slot --title');
if(!hook.endsWith('?')) throw new Error('Hook muss eine direkte Frage sein.');
if(!Number.isInteger(sceneCount)||sceneCount<12||sceneCount>28) throw new Error('Visuelle Beats für youtube-2min-v1: 12–28.');

const slug=title.normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/ß/g,'ss').replace(/[^a-zA-Z0-9]+/g,'-').replace(/^-+|-+$/g,'').toLowerCase();
const folderTitle=title.normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/ß/g,'ss').replace(/[^a-zA-Z0-9ÄÖÜäöüß]+/g,'-').replace(/^-+|-+$/g,'');
// Der Ordnername `reels` bleibt vorerst aus Rückwärtskompatibilität bestehen; das aktive Profil ist normales 16:9-YouTube-Longform.
const root=path.join(process.cwd(),'channels/science/reels',week,`${String(Number(slot)).padStart(2,'0')}_${folderTitle}`);
if(fs.existsSync(root)) throw new Error(`Video existiert bereits: ${root}`);
for(const rel of ELECTRICAL_REEL_DIRECTORIES) fs.mkdirSync(path.join(root,rel),{recursive:true});

const plan=createElectricalScenePlanTemplate({slug,title,hook,compositionId:'ScienceReel',sceneCount});
const write=(rel,data)=>{const file=path.join(root,rel);fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,data);};
const json=(rel,value)=>write(rel,`${JSON.stringify(value,null,2)}\n`);

const flowPlan={
  version:'science-flow-plan-v1',
  productionProfile:'youtube-2min-v1',
  workflow:'thumbnail-first-then-sequential-scenes',
  clipSecondsMax:10,
  targetVideoRatio:{min:0.4,ideal:0.5,max:0.6},
  scenes:plan.scenes.map((scene)=>({
    id:scene.id,
    output:'decide',
    clipSeconds:null,
    videoDir:`02-bilder/videos/${scene.id}`,
    motionPrompt:''
  }))
};

write('README.md',`# ${title}\n\nProfil: **youtube-2min-v1** · 16:9 · ca. 2 Minuten\n\nZentrale Frage: ${hook}\n\nSkriptstruktur: Hook → Kontext → Grundlage → Mechanismus → Vertiefung → Payoff.\n\nBildwelt: **Scientific Scene Explainer v1**. Visuelle Beats nach Verständnis planen, nicht automatisch einen Satz pro Bild.\n\nMedienworkflow: **Google Flow gemischt aus Bildern und Image-to-Video-Clips**. Erst drei Thumbnails, Nutzer wählt eines, danach Szenen streng einzeln nacheinander.\n`);
write('01-script-audio/script.md',`# Sprechtext\n\n## Hook\n${hook}\n\n## Kontext\n\n## Grundlage\n\n## Mechanismus\n\n## Vertiefung\n\n## Payoff\n`);
write('01-script-audio/script-fliesstext.txt',`${hook} Vollständigen 2-Minuten-Sprechtext nach LONGFORM.md ergänzen.\n`);
write('01-script-audio/voiceover.txt',`${hook} Vollständigen finalen Voice-over-Text ergänzen.\n`);
write('01-script-audio/audio/00_AUDIO_HIER_EINFUEGEN.md','# Audio erst nach bestandenem Preflight einfügen.\n');
write('01-script-audio/sfx/README.md','# Optionale, sparsame SFX.\n');
write('02-bilder/bildprompts.md','# Scientific Scene Explainer · YouTube 16:9\n\nJeden visuellen Beat aus der fertigen Aussage ableiten. Nicht Satzgrenzen kopieren. Volle Umgebung nutzen, wenn sie hilft. Illustration, Cutaway, Vergleich oder Detailansicht nur nach Erklärnutzen. Sichtbarer Bildtext ausschließlich Deutsch. So wenig Information wie möglich, so viel wie nötig.\n');
write('02-bilder/images/00_BILDER_HIER_EINFUEGEN.md','# Für jeden Beat zuerst ein finales 16:9-Ausgangsbild erzeugen. Auch Video-Beats benötigen dieses Ausgangsbild.\n');
write('02-bilder/videos/README.md','# Google-Flow-KI-Clips\n\nNur Beats mit output=image-to-video in flow-plan.json bekommen hier einen finalen Clip. Maximal 10 Sekunden, 16:9, kein gesprochenes Dialog-Audio.\n');
write('02-bilder/thumbnail/README.md','# Thumbnail\n\nZuerst drei 1280×720-Kandidaten erzeugen. Danach STOPP und Nutzerauswahl abwarten. Erst danach Szenen erzeugen. Thumbnail ist separat von Bild 01.\n');
write('02-bilder/GOOGLE-FLOW-MASTER-PROMPT.txt','# NOCH NICHT FINAL\n\nErst Skript, Beats, Einzelprompts und flow-plan.json finalisieren. Dann ausführen:\n\nnpm run science:flow-master -- "<video-ordner>"\n');
write('03-caption/social-caption.md',`# YouTube-Beschreibung / Caption\n\n${title}\n`);
write('04-pdf/inhalt.md',`# Lernzettel – ${title}\n`);
write('05-export/README.md','# Export nach Readiness und QA.\n');
write('05-export/video/README.md','# Finales 1920×1080-Video\n');
write('06-projektdateien/motion-design.md','# Mixed Flow + Remotion Contract\n\n- 1920×1080 / 16:9\n- Google Flow erzeugt finale Bilder und ausgewählte Image-to-Video-Clips\n- jeder Video-Beat beginnt mit einem freigegebenen Ausgangsbild\n- Clips maximal 10 Sekunden\n- Remotion spielt fertige Bilder/Clips ab, erzeugt aber keine eigene Kamerabewegung oder wissenschaftliche Animation\n- harte Schnitte\n- Bildwechsel nach visueller Aussage, nicht nach Satzzeichen\n');
write('06-projektdateien/sources.md','# Quellen\n');
write('06-projektdateien/storyboard.md','# Storyboard\n\nStory-Struktur zuerst festlegen. Danach jeden visuellen Beat aus dem fertigen Skript entwickeln, nach `gehirn/BILDWELT.md` visualisieren und in `flow-plan.json` bewusst als Bild oder Image-to-Video festlegen.\n');
json('06-projektdateien/scene-plan.json',plan);
json('06-projektdateien/flow-plan.json',flowPlan);
json('06-projektdateien/prompt-manifest.json',createElectricalPromptManifestTemplate(plan));
json('06-projektdateien/visual-policy.json',{version:'science-static-v1',productionProfile:'youtube-2min-v1',productionMode:'flow-mixed-assets',brandVisualStyleDefined:true,styleId:'scientific-scene-explainer-v1',generatedImageTextPolicy:'controlled-german-only',visibleImageLanguage:'de',width:1920,height:1080,thumbnailRequired:true,thumbnailCandidateCount:3,flowAiVideoAllowed:true,flowClipSecondsMax:10,remotionAnimationAllowed:false,transitionPolicy:'hard-cut'});
json('06-projektdateien/production-status.json',createElectricalStatusTemplate(plan));
json('06-projektdateien/asset-manifest.json',{version:'science-v1',slug,assets:[]});

console.log(`✓ YouTube-Science-Video angelegt: ${root}`);
console.log('Profil: youtube-2min-v1 · 1920×1080 · Scientific Scene Explainer v1 · Google Flow Mixed Assets.');
console.log('Vor Medienproduktion: flow-plan.json finalisieren und science:flow-master ausführen.');
