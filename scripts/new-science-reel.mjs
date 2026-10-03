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
  version:'science-flow-image-v5-final-collection',
  productionProfile:'youtube-2min-v1',
  workflow:'thumbnail-first-then-five-image-steps-no-intermediate-stops-final-cleanup',
  imageOnly:true,
  imageProductionSteps,
  pauseAfterEachImageStep:false,
  continueAutomaticallyBetweenImageSteps:true,
  finalReportAfterAllImageSteps:true,
  deleteUnselectedThumbnailCandidatesAfterSelection:true,
  selectedThumbnailFinalName:'00-thumbnail-final',
  finalFlowCollectionRequired:true,
  singleFinalFlowCollectionPerVideo:true,
  finalCollectionName:`${slug}-assets-final`,
  removeRejectedVariantsBeforeCompletion:true,
  renameFinalAssetsBeforeCompletion:true,
  finalCollectionContainsFinalAssetsOnly:true,
  diversityRequired:true,
  phase2SceneAssetRoot:'02-bilder/images',
  phase2ThumbnailRoot:'02-bilder/thumbnail',
  phase3AssetSource:'phase2-project-folders-only',
  phase3MayGenerateVisualAssets:false,
  phase3MayRegenerateVisualAssets:false,
  phase3MaySearchExternalAssets:false,
  phase3MaySubstituteMissingAssets:false,
  phase3MaySkipMissingScenes:false,
  phase3MissingAssetPolicy:'stop-and-report',
  steps:imageSteps,
  scenes:plan.scenes.map((scene)=>({
    id:scene.id,
    output:'image',
    imageStep:imageStepById.get(scene.id),
    visualType:'UNGEPLANT',
    primaryMotif:'UNGEPLANT'
  }))
};

write('README.md',`# ${title}\n\nProfil: **youtube-2min-v1** · 16:9 · ca. 2 Minuten\n\nZentrale Frage: ${hook}\n\nSkriptstruktur: Hook → Kontext → Grundlage → Mechanismus → Vertiefung → Payoff.\n\nBildwelt: **Technical Editorial Explainer 2.5D**. Der alte Scientific-Scene-Look ist ersetzt; der interne alte Stil-Identifier bleibt nur aus Kompatibilitätsgründen. Alle Flow-Prompts werden auf Englisch geschrieben, sichtbarer Bildtext bleibt Deutsch. Jeder Prompt muss denselben Style-Lock tragen.\n\nGoogle Flow: nur statische Bilder. Erst drei Thumbnails → STOPP/Auswahl → gewähltes Cover als \`00-thumbnail-final\` behalten und zwei verworfene Cover entfernen → genau fünf Bildschritte ohne Zwischenstopps → finale Bilder korrekt benennen → nur finale Assets in genau einer Flow-Sammlung \`${slug}-assets-final\` bündeln.\n\n**Phase-2/Phase-3-Handoff:** Der Nutzer legt die akzeptierten finalen Szenenbilder unter \`02-bilder/images/<scene-id>/\` und das finale Thumbnail unter \`02-bilder/thumbnail/\` ab. Antigravity/Codex/der Phase-3-Agent darf ausschließlich diese vorhandenen Dateien verwenden und niemals Bilder generieren, regenerieren, suchen oder ersetzen. Fehlt ein Asset: stoppen und melden.\n\nFinales Video: **keine eingebrannten Untertitel/Captions**.\n`);
write('01-script-audio/script.md',`# Sprechtext\n\n## Hook\n${hook}\n\n## Kontext\n\n## Grundlage\n\n## Mechanismus\n\n## Vertiefung\n\n## Payoff\n`);
write('01-script-audio/script-fliesstext.txt',`${hook} Vollständigen 2-Minuten-Sprechtext nach LONGFORM.md ergänzen.\n`);
write('01-script-audio/voiceover.txt',`${hook} Vollständigen finalen Voice-over-Text ergänzen.\n`);
write('01-script-audio/audio/00_AUDIO_HIER_EINFUEGEN.md','# PHASE 2 – Voice hier einfügen. Phase 3 verwendet nur vorhandene Audiodateien; fehlende Voice wird gemeldet und nicht ersetzt.\n');
write('01-script-audio/sfx/README.md','# Optionale, sparsame SFX.\n');
write('02-bilder/bildprompts.md','# Technical Editorial Explainer 2.5D · YouTube 16:9\n\nAlle Google-Flow-Prompts auf **Englisch** schreiben. Sichtbarer Text im Bild ausschließlich **Deutsch**. Jeder Prompt erbt denselben Style-Lock: clean modern 2D/2.5D vector-like technical editorial illustration, matte materials, clean edges, subtle gradients, soft controlled shadows, consistent line weight, moderate depth, adult professional educational design. Kein Fotorealismus, keine echte Fotooptik, kein weißes Schulbuch-Infografik-Template, kein Pixar, kein Sci-Fi-HUD, keine generische KI-Kunst. Unterschiedliche Darstellungsformen sind erlaubt und erwünscht, aber die Rendering-Sprache bleibt konstant.\n');
write('02-bilder/images/00_BILDER_HIER_EINFUEGEN.md','# PHASE 2 – FINALE SZENENBILDER HIER EINFÜGEN\n\nDer Nutzer legt für jeden Beat das final akzeptierte statische 16:9-Bild in den passenden Szenen-Unterordner `02-bilder/images/<scene-id>/`. Bei mehreren Dateien muss genau eine mit `final`, `approved` oder `freigabe` markiert sein.\n\nPHASE 3: Antigravity/Codex/der Montage-Agent verwendet ausschließlich diese vorhandenen Dateien. Er darf keine Bilder generieren, regenerieren, im Web suchen, durch Platzhalter ersetzen oder fehlende Szenen überspringen. Fehlt ein Asset oder ist die Auswahl mehrdeutig: STOPP und melden.\n');
write('02-bilder/thumbnail/README.md','# PHASE 2 – THUMBNAIL-HANDOFF\n\nDrei 1280×720-Kandidaten → STOPP → Nutzerauswahl. Nur das gewählte Thumbnail als `00-thumbnail-final`/final/approved/freigabe hier ablegen. Die zwei verworfenen Cover gehören nicht in den Phase-3-Input.\n\nPHASE 3: Der Montage-Agent darf kein Thumbnail erzeugen, regenerieren, suchen oder ersetzen. Fehlt die eindeutige finale Datei: STOPP und melden.\n');
write('02-bilder/GOOGLE-FLOW-MASTER-PROMPT.txt','# NOCH NICHT FINAL\n\nErst Skript, Visual-Diversity, Beats, englische Einzelprompts und flow-plan.json finalisieren. Dabei `visualType` und `primaryMotif` für jeden Beat konkret eintragen. Dann:\n\nnpm run science:flow-master -- "<video-ordner>"\n');
write('03-caption/social-caption.md',`# YouTube-Beschreibung\n\n${title}\n\nHinweis: Dieser Ordner enthält keine eingebrannten Video-Untertitel.\n`);
write('04-pdf/inhalt.md',`# Lernzettel – ${title}\n`);
write('05-export/README.md','# Export nach Readiness und QA. Phase 3 rendert ausschließlich aus vorhandenen Phase-2-Assets.\n');
write('05-export/video/README.md','# Finales 1920×1080-Video ohne eingebrannte Untertitel\n');
write('06-projektdateien/motion-design.md','# Static Image + Remotion Contract\n\n- 1920×1080 / 16:9\n- nur finale statische Bilder\n- Technical Editorial Explainer 2.5D als konstante Bildwelt\n- Google-Flow-Prompts Englisch, sichtbarer Text Deutsch\n- fünf Bildschritte nach Cover-Auswahl\n- keine Zwischenstopps zwischen Bildschritt 1–5\n- zwei verworfene Cover nach Auswahl entfernen\n- am Ende nur finale Assets in genau einer Flow-Sammlung\n- Phase 2: Nutzer legt finale Dateien in `02-bilder/images/<scene-id>/`, `02-bilder/thumbnail/` und `01-script-audio/audio/`\n- Phase 3: Agent liest ausschließlich diese Ordner; keine Bildgenerierung, keine Regenerierung, keine Web-Suche, keine Ersatzbilder\n- fehlendes/mehrdeutiges Asset = STOPP und melden\n- visuelle Vielfalt ist Pflicht\n- keine KI-Videoclips / kein Image-to-Video\n- keine Kamerabewegung / Animation\n- keine eingebrannten Untertitel\n- harte Schnitte\n');
write('06-projektdateien/AGENT-HANDOFF.md','# Phase 3 – Agent-Handoff\n\nAntigravity, Codex oder ein anderer Montage-Agent darf ausschließlich die vom Nutzer in Phase 2 abgelegten Dateien verwenden.\n\nQuellen: `02-bilder/images/<scene-id>/`, `02-bilder/thumbnail/`, `01-script-audio/audio/`.\n\nVerboten: Bilder generieren/regenerieren, Google Flow zur Neuerzeugung starten, Web-Suche für Ersatzbilder, Platzhalter, automatische Ersatzbilder, fehlende Szenen überspringen, Image-to-Video/KI-Clips.\n\nFehlt ein Asset oder ist die Auswahl mehrdeutig: STOPP und konkret melden.\n');
write('06-projektdateien/sources.md','# Quellen\n');
write('06-projektdateien/storyboard.md','# Storyboard\n\nStory zuerst. Danach Visual-Diversity planen. Jeder Beat erhält in `flow-plan.json` einen konkreten `visualType` und ein `primaryMotif`. Drei benachbarte fast identische Bildideen sind ein Skriptfehler und müssen vor der Produktion umgeschrieben werden. Die Darstellungsform darf wechseln, aber alle Bilder bleiben im Technical Editorial Explainer 2.5D Style-Lock. Nach der Cover-Auswahl werden die fünf Bildschritte ohne Zwischenfreigaben komplett abgearbeitet. Danach legt der Nutzer die finalen Assets in die vorgesehenen Phase-2-Ordner; Phase 3 montiert ausschließlich diese vorhandenen Dateien und erzeugt niemals Ersatz.\n');
json('06-projektdateien/scene-plan.json',plan);
json('06-projektdateien/flow-plan.json',flowPlan);
json('06-projektdateien/prompt-manifest.json',createElectricalPromptManifestTemplate(plan));
json('06-projektdateien/visual-policy.json',{version:'science-static-v1',productionProfile:'youtube-2min-v1',productionMode:'flow-image-only',brandVisualStyleDefined:true,styleId:'scientific-scene-explainer-v1',styleName:'Technical Editorial Explainer 2.5D',legacyStyleIdRetainedForCompatibilityOnly:true,promptLanguage:'en',styleLockRequiredInEveryFlowPrompt:true,photorealismAllowed:false,whiteTextbookInfographicAsDefaultAllowed:false,generatedImageTextPolicy:'controlled-german-only',visibleImageLanguage:'de',width:1920,height:1080,thumbnailRequired:true,thumbnailCandidateCount:3,imageOnly:true,imageProductionSteps:5,pauseAfterEachImageStep:false,continueAutomaticallyBetweenImageSteps:true,finalReportAfterAllImageSteps:true,deleteUnselectedThumbnailCandidatesAfterSelection:true,selectedThumbnailFinalName:'00-thumbnail-final',finalFlowCollectionRequired:true,singleFinalFlowCollectionPerVideo:true,removeRejectedVariantsBeforeCompletion:true,renameFinalAssetsBeforeCompletion:true,finalCollectionContainsFinalAssetsOnly:true,phase2SceneAssetRoot:'02-bilder/images',phase2ThumbnailRoot:'02-bilder/thumbnail',phase3AssetSource:'phase2-project-folders-only',phase3MayGenerateVisualAssets:false,phase3MayRegenerateVisualAssets:false,phase3MaySearchExternalAssets:false,phase3MaySubstituteMissingAssets:false,phase3MaySkipMissingScenes:false,phase3MayUseGeneratedPlaceholders:false,phase3MissingAssetPolicy:'stop-and-report',phase3AmbiguousAssetPolicy:'stop-and-report',visualDiversityRequired:true,blankOrFeaturelessVisibleFacesForbidden:true,burnedInCaptions:false,flowAiVideoAllowed:false,remotionAnimationAllowed:false,transitionPolicy:'hard-cut'});
json('06-projektdateien/production-status.json',createElectricalStatusTemplate(plan));
json('06-projektdateien/asset-manifest.json',{version:'science-v1',slug,assets:[]});

console.log(`✓ YouTube-Science-Video angelegt: ${root}`);
console.log('Vor Bildproduktion: Skript-Diversity prüfen, visualType/primaryMotif planen, englische Style-Lock-Prompts schreiben und science:flow-master ausführen. Phase 3 darf später nur die vom Nutzer abgelegten Phase-2-Dateien verwenden.');
