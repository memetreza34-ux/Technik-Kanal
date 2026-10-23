#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {loadElectricalConfig} from './lib/load-electrical-config.mjs';

const root=process.cwd();
const config=loadElectricalConfig();
const pkg=JSON.parse(fs.readFileSync(path.join(root,'package.json'),'utf8'));
const claude=fs.readFileSync(path.join(root,'channels/science/CLAUDE.md'),'utf8');
const imageWorld=fs.readFileSync(path.join(root,'channels/science/gehirn/BILDWELT.md'),'utf8');
const flowWorkflow=fs.readFileSync(path.join(root,'channels/science/gehirn/FLOW-WORKFLOW.md'),'utf8');
const agentHandoffDoc=fs.readFileSync(path.join(root,'channels/science/gehirn/AGENT-HANDOFF.md'),'utf8');
const channel=fs.readFileSync(path.join(root,'channels/science/gehirn/KANAL.md'),'utf8');
const longform=fs.readFileSync(path.join(root,'channels/science/gehirn/LONGFORM.md'),'utf8');
const voice=JSON.parse(fs.readFileSync(path.join(root,'channels/science/engine/config/voice-v1.json'),'utf8'));
const scienceReel=fs.readFileSync(path.join(root,'channels/science/src/ScienceReel.tsx'),'utf8');
const template=fs.readFileSync(path.join(root,'scripts/lib/create-electrical-scene-plan-template.mjs'),'utf8');
// Das Gerüst neuer Videos entsteht in new-science-reel.mjs plus der gemeinsamen Vorlage (auch für science:scenes).
const newVideo=['scripts/new-science-reel.mjs','scripts/lib/create-electrical-scene-plan-template.mjs'].map((file)=>fs.readFileSync(path.join(root,file),'utf8')).join('\n');
const flowBuilder=fs.readFileSync(path.join(root,'scripts/build-google-flow-master-prompt.mjs'),'utf8');
const prepareScience=fs.readFileSync(path.join(root,'scripts/prepare_science_reel.mjs'),'utf8');
const processVoice=fs.readFileSync(path.join(root,'scripts/process_voiceover.mjs'),'utf8');
const renderQa=fs.readFileSync(path.join(root,'scripts/qa_science_render.mjs'),'utf8');
const errors=[];

if(config.version!=='science-v1') errors.push('Aktive Konfiguration muss science-v1 sein.');
if(config.productionProfile!=='youtube-6to7min-v1') errors.push('Aktives Produktionsprofil muss youtube-6to7min-v1 sein.');
if(loadElectricalConfig('youtube-2min-v1').productionProfile!=='youtube-2min-v1') errors.push('Archiviertes 2-Minuten-Profil muss für alte Videos ladbar bleiben.');
if(config.format?.width!==1920||config.format?.height!==1080||config.format?.aspectRatio!=='16:9') errors.push('Aktives Videoformat muss 1920×1080 / 16:9 sein.');
if(config.format?.durationSeconds?.ideal!==390) errors.push('Ideale Videolänge muss 390 Sekunden sein.');
if(config.script?.words?.ideal!==975) errors.push('Ideale Skriptlänge muss 975 Wörter sein.');
if(JSON.stringify(config.script?.narrativeStructure)!==JSON.stringify(['hook','context','foundation','mechanism','deepening','payoff'])) errors.push('Longform-Dramaturgie ist falsch.');
if(config.script?.rewriteWhenThreeAdjacentBeatsWouldLookSimilar!==true) errors.push('Skript muss bei drei ähnlichen Nachbarbeats umgeschrieben werden.');
if(config.visuals?.beats?.individual!==true||config.visuals?.beats?.min!==7||config.visuals?.beats?.max!==400||'ideal' in (config.visuals?.beats??{})) errors.push('Bildzahl muss individuell sein (individual: true, nur technische Grenzen 7–400, kein Idealwert).');
if(config.visuals?.thumbnail?.required!==true||config.visuals?.thumbnail?.candidateCount!==3) errors.push('Drei Thumbnail-Kandidaten müssen vorgeschrieben sein.');
if(!/Aktiv ist \*\*`youtube-6to7min-v1`\*\*/i.test(longform)||!/Hook.*Kontext.*Grundlage.*Mechanismus.*Vertiefung.*Payoff/is.test(longform)) errors.push('LONGFORM.md dokumentiert Profil/Dramaturgie nicht.');
if(!/visuell abwechslungsreich/i.test(longform)||!/keine eingebrannten Untertitel/i.test(longform)) errors.push('LONGFORM.md muss Bildvielfalt und subtitle-free festhalten.');

if(config.topicScope?.identity!=='alltagswissenschaft-und-technik') errors.push('Themenprofil falsch.');
if(config.topicScope?.audience!=='jugendliche-und-junge-erwachsene') errors.push('Zielgruppe falsch.');
if(config.topicScope?.biologyAllowed!==false||config.topicScope?.medicineAllowed!==false) errors.push('Biologie/Medizin dürfen nicht regulär erlaubt sein.');
if(config.topicScope?.highlyAbstractScienceAllowed!==false) errors.push('Stark abstrakte Themen dürfen nicht regulär erlaubt sein.');
if(!/Alltagswissenschaft und Technik/i.test(channel)) errors.push('KANAL.md dokumentiert den Themenrahmen nicht.');

if(config.voice.speed!==1.1||voice.speed!==1.1) errors.push('Voice-Geschwindigkeit muss exakt 1.10 sein.');
if(voice.processing?.loudness?.targetIntegratedLufs!==-16||voice.processing?.loudness?.targetTruePeakDb!==-1.5) errors.push('Voice-Konfiguration muss -16 LUFS und -1.5 dBTP dokumentieren.');
if(!/1[,.]10[×x]/i.test(claude)) errors.push('CLAUDE.md enthält 1,10× nicht.');
if(!claude.includes('whisper.cpp')) errors.push('CLAUDE.md enthält whisper.cpp nicht.');
if(!imageWorld.includes('Scientific Scene Explainer')) errors.push('BILDWELT.md enthält die aktive Bildwelt nicht.');
if(!imageWorld.includes('so wenig Information wie möglich, so viel wie nötig')) errors.push('BILDWELT.md enthält die Informationsdichte-Regel nicht.');
if(!/gesichtslosen sichtbaren Köpfe/i.test(imageWorld)) errors.push('BILDWELT.md muss gesichtslose sichtbare Köpfe verbieten.');
if(!/mindestens \*\*7 deutlich unterschiedliche Darstellungsformen\*\* pro 6–7-Minuten-Video/i.test(imageWorld)) errors.push('BILDWELT.md muss mindestens sieben Darstellungsformen pro 6–7-Minuten-Video verlangen.');

for(const command of ['science:new','science:flow-master','science:preflight','science:ready','science:prepare','science:render','science:finish','science:system-test']) if(!pkg.scripts?.[command]) errors.push(`package.json fehlt ${command}.`);
if(Object.keys(pkg.scripts??{}).some((name)=>name.startsWith('electrical:')||name.startsWith('elektro:'))) errors.push('package.json enthält alte Elektro-Aliase.');
if(!pkg.dependencies?.sharp||!pkg.dependencies?.zod||!pkg.devDependencies?.vitest) errors.push('Pflichtabhängigkeiten fehlen.');

if(config.captions?.enabled!==false||config.captions?.burnedIn!==false) errors.push('Eingebrannte Untertitel müssen deaktiviert sein.');
if(config.captions?.internalTimingAllowed!==true) errors.push('Interne Wortzeiten müssen erlaubt bleiben.');
if(scienceReel.includes('ScienceCaptions')) errors.push('ScienceReel darf keine eingebrannten Captions rendern.');
if(config.visuals.policyVersion!=='science-static-v1'||config.visuals.productionMode!=='flow-image-only') errors.push('Visual-Policy/Produktionsmodus falsch.');
if(config.visuals.animationAllowed!==false) errors.push('Prozessanimationen müssen deaktiviert bleiben.');
if(config.visuals.cameraMotionAllowed===true&&(!(config.visuals.cameraMotion?.maxScale<=1.05)||!(config.visuals.cameraMotion?.panPercent<=2))) errors.push('Kamerabewegung muss dezent bleiben (Zoom ≤ 5 %, Schwenk ≤ 2 %).');
if(config.sound?.musicBedAllowed===true&&(config.sound.musicBed?.sourceNoteRequired!==true||!(config.sound.musicBed?.targetLufs<=-28))) errors.push('Musikteppich braucht Quellenangabe und muss leise bleiben (≤ −28 LUFS).');
if(!fs.readFileSync(path.join(root,'scripts/prepare_science_reel.mjs'),'utf8').includes('assertMusicSource')) errors.push('Vorbereitung muss die Musikquelle vor dem Rendern prüfen.');
if(config.visuals.styleId!=='scientific-scene-explainer-v1') errors.push('Aktive Bildwelt falsch.');
if(config.visuals.fixedBackgroundForbidden!==true) errors.push('Fixer Hintergrund darf nicht erzwungen werden.');

const d=config.visuals?.diversity;
if(d?.minimumDistinctVisualTypesPerVideo!==7) errors.push('Mindestens sieben Visual-Typen müssen für 6–7-Minuten-Videos konfiguriert sein.');
if(loadElectricalConfig('youtube-2min-v1').visuals?.diversity?.minimumDistinctVisualTypesPerVideo!==5) errors.push('Archiviertes 2-Minuten-Profil muss weiterhin fünf Visual-Typen verlangen.');
if(d?.sameCompositionMaxConsecutive!==1) errors.push('Gleiche Komposition darf nicht direkt wiederholt werden.');
if(d?.samePrimaryMotifMaxPerVideo!==3||d?.handOnObjectPrimaryMotifMaxPerVideo!==3) errors.push('Primärmotiv-/Handlimits falsch.');
if(d?.largeGeneratedHeadlineInSceneImagesAllowed!==false) errors.push('Große generierte Szenenüberschriften müssen deaktiviert sein.');
if(d?.preferredLabelsMax!==2) errors.push('Normale Szenen sollen max. zwei Labels bevorzugen.');
if(d?.blankOrFeaturelessVisibleFacesForbidden!==true) errors.push('Gesichtslose sichtbare Köpfe müssen verboten sein.');
if(d?.thumbnailReferenceScope!=='quality-and-illustration-style-only-not-layout-or-palette') errors.push('Thumbnail darf nur Stil-/Qualitätsreferenz sein.');

const flow=config.visuals.flow;
if(!flow?.masterPromptRequired||!flow?.planRequired) errors.push('Flow-Plan/Masterprompt müssen Pflicht sein.');
if(!flow?.thumbnailFirst||!flow?.pauseAfterThumbnailCandidates) errors.push('Thumbnail-Stop-Regel fehlt.');
if(flow?.deleteUnselectedThumbnailCandidatesAfterSelection!==true) errors.push('Zwei nicht gewählte Cover müssen nach der Auswahl entfernt werden.');
if(flow?.selectedThumbnailFinalName!=='00-thumbnail-final') errors.push('Gewähltes Cover muss 00-thumbnail-final heißen.');
if(flow?.imageProductionSteps!==5||flow?.balancedImageStepGrouping!==true) errors.push('Genau fünf Bildschritte fehlen.');
if(flow?.pauseAfterEachImageProductionStep!==false) errors.push('Zwischenstopps nach Bildschritten müssen deaktiviert sein.');
if(flow?.continueAutomaticallyBetweenImageSteps!==true) errors.push('Automatische Fortsetzung zwischen Bildschritten muss aktiv sein.');
if(flow?.finalReportAfterAllImageSteps!==true) errors.push('Gesamtabschluss darf erst nach allen fünf Bildschritten erfolgen.');
if(!flow?.sequentialSceneGenerationRequired||!flow?.oneImagePerBeatRequired) errors.push('Sequentielle Einzelbilder fehlen.');
if(flow?.finalFlowCollectionRequired!==true||flow?.singleFinalFlowCollectionPerVideo!==true) errors.push('Genau eine finale Flow-Sammlung pro Video muss Pflicht sein.');
if(flow?.removeRejectedVariantsBeforeCompletion!==true||flow?.renameFinalAssetsBeforeCompletion!==true||flow?.finalCollectionContainsFinalAssetsOnly!==true) errors.push('Finale Flow-Sammlung muss bereinigt und korrekt benannt werden.');
if(flow?.imageOnly!==true||flow?.aiVideoAllowed!==false||flow?.clipsAllowed!==false) errors.push('Flow muss bild-only sein.');
if(flow?.remotionMayPlayFlowClips!==false||flow?.remotionMayGenerateMotion!==false) errors.push('Remotion darf keine Clips/Motion erzeugen.');

const handoff=config.visuals?.agentHandoff;
if(handoff?.phase2SceneAssetRoot!=='02-bilder/images'||handoff?.phase2ThumbnailRoot!=='02-bilder/thumbnail'||handoff?.phase2VoiceRoot!=='01-script-audio/audio') errors.push('Phase-2-Handoff-Ordner sind falsch konfiguriert.');
if(handoff?.phase3AssetSource!=='phase2-project-folders-only') errors.push('Phase 3 muss ausschließlich Phase-2-Projektordner verwenden.');
if(handoff?.phase3MayGenerateVisualAssets!==false||handoff?.phase3MayRegenerateVisualAssets!==false) errors.push('Phase 3 darf keine visuellen Assets erzeugen/regenerieren.');
if(handoff?.phase3MaySearchExternalAssets!==false||handoff?.phase3MaySubstituteMissingAssets!==false||handoff?.phase3MaySkipMissingScenes!==false||handoff?.phase3MayUseGeneratedPlaceholders!==false) errors.push('Phase 3 darf keine externen/ersetzten/übersprungenen/Placeholder-Assets verwenden.');
if(handoff?.missingAssetPolicy!=='stop-and-report'||handoff?.ambiguousAssetPolicy!=='stop-and-report') errors.push('Phase 3 muss bei fehlenden/mehrdeutigen Assets stoppen und melden.');

if(!/(drei|3).*thumbnail/is.test(flowWorkflow)||!/(STOPPEN|STOPP)/.test(flowWorkflow)) errors.push('FLOW-WORKFLOW Thumbnail-Stop fehlt.');
if(!/genau 5 Bildschritte|genau fünf Bildschritte/i.test(flowWorkflow)) errors.push('FLOW-WORKFLOW fünf Schritte fehlen.');
if(!/keine weiteren Stopps|keine Zwischenstopps/i.test(flowWorkflow)) errors.push('FLOW-WORKFLOW muss Zwischenstopps nach der Cover-Auswahl verbieten.');
if(!/automatisch mit Bildschritt 2|automatisch vollständig/i.test(flowWorkflow)) errors.push('FLOW-WORKFLOW muss automatische Fortsetzung durch alle fünf Schritte verlangen.');
if(!/zwei nicht gewählten.*Cover|zwei verworfenen Cover/i.test(flowWorkflow)) errors.push('FLOW-WORKFLOW muss die zwei nicht gewählten Cover entfernen.');
if(!/genau \*\*eine finale Google-Flow-Sammlung|genau eine finale Google-Flow-Sammlung/i.test(flowWorkflow)) errors.push('FLOW-WORKFLOW muss genau eine finale Flow-Sammlung verlangen.');
if(!/Zwischenstände.*Fehlversuche|Fehlversuche.*Zwischenstände/i.test(flowWorkflow)) errors.push('FLOW-WORKFLOW muss Zwischenstände und Fehlversuche aus der finalen Sammlung entfernen.');
if(!/visuelle Vielfalt/i.test(flowWorkflow)) errors.push('FLOW-WORKFLOW Diversity fehlt.');
if(!/keine eingebrannten Untertitel/i.test(flowWorkflow)) errors.push('FLOW-WORKFLOW subtitle-free fehlt.');
if(!/Phase 3.*Antigravity|Antigravity.*Phase 3/is.test(flowWorkflow)||!/keine Bilder selbst erzeugen|keine Bilder generieren/i.test(flowWorkflow)) errors.push('FLOW-WORKFLOW muss Phase 3 auf vorhandene Phase-2-Assets begrenzen.');
if(!/Phase 3.*keine visuellen Assets selbst erzeugen/is.test(agentHandoffDoc)||!/stoppen und den fehlenden\/unklaren Dateinamen melden/i.test(agentHandoffDoc)) errors.push('AGENT-HANDOFF.md muss No-Generation und Stop-Regel dokumentieren.');
if(!/GOOGLE-FLOW-MASTER-PROMPT\.txt/i.test(claude)||!/flow-plan\.json/i.test(claude)) errors.push('CLAUDE Flow-Dateien fehlen.');
if(!/keine weitere Freigabe|keine weiteren Freigaben|keine Zwischenstopps/i.test(claude)) errors.push('CLAUDE muss Cover als einzigen Freigabepunkt festlegen.');
if(!/zwei nicht gewählten Cover|2 verworfene Cover/i.test(claude)) errors.push('CLAUDE muss verworfene Cover entfernen.');
if(!/Phase 3.*keine visuellen Assets selbst erzeugen/is.test(claude)||!/Fehlt ein Asset.*STOPP/is.test(claude)) errors.push('CLAUDE muss Phase-3-No-Generation und Stop-Regel festlegen.');
if(!flowBuilder.includes('NUR BILDER')||!flowBuilder.includes('VISUELLE VIELFALT IST PFLICHT')) errors.push('Flow-Master-Builder enthält Bild-/Diversity-Regeln nicht.');
if(!flowBuilder.includes('visualType')||!flowBuilder.includes('primaryMotif')) errors.push('Flow-Master-Builder prüft Visual-Typ/Primärmotiv nicht.');
if(!flowBuilder.includes('KEINE WEITEREN STOPPS ODER RÜCKFRAGEN')) errors.push('Flow-Master-Builder muss Zwischenstopps nach Cover-Auswahl verbieten.');
if(!flowBuilder.includes('ZWEI NICHT GEWÄHLTEN COVER')) errors.push('Flow-Master-Builder muss verworfene Cover entfernen.');
if(!flowBuilder.includes('PHASE 3 – FINALE ASSET-BEREINIGUNG')) errors.push('Flow-Master-Builder muss eine finale Asset-Bereinigung erzeugen.');
if(!flowBuilder.includes('finalCollectionName')) errors.push('Flow-Master-Builder muss eine finale Flow-Sammlung benennen.');
if(flowBuilder.includes('STOPP NACH BILDSCHRITT')) errors.push('Flow-Master-Builder darf keine Zwischenstopps nach Bildschritten erzeugen.');
if(flowBuilder.includes('image-to-video')) errors.push('Flow-Master-Builder darf kein Image-to-Video enthalten.');
if(!flowBuilder.includes('findFlowPromptLeaks')||!flowBuilder.includes('flowSceneBlock')) errors.push('Flow-Master-Builder muss Bildaufträge ohne Szenen-IDs bauen und auf Metadaten-Lecks prüfen.');
if(/STYLE_LOCK\);[\s\S]*for \(const \{scene,entry,promptText,position\} of group\)[\s\S]*STYLE_LOCK/.test(flowBuilder)) errors.push('Stilblock darf im Flow-Masterprompt nur einmal stehen, nicht pro Szene.');
// qualitaet-v2: Spannungs-, Titel- und Bild-zur-Szene-Regeln dürfen nicht stillschweigend verschwinden.
if(!template.includes("qualityRulesVersion:'qualitaet-v2'")||!template.includes("hookAnchor:{type:'UNGEPLANT'")) errors.push('Neue Videos müssen qualityRulesVersion qualitaet-v2 und einen hookAnchor-Platzhalter erhalten.');
if(!newVideo.includes("setting:'UNGEPLANT'")) errors.push('Neue Videos müssen pro Szene ein setting im Flow-Plan planen.');
if(!fs.readFileSync(path.join(root,'scripts/science-script-qa.mjs'),'utf8').includes('analyzeScriptEngagement')) errors.push('science:script-qa muss die Spannungsregeln prüfen.');
if(!fs.readFileSync(path.join(root,'scripts/science-creative-qa.mjs'),'utf8').includes('analyzeSceneImageRules')) errors.push('science:creative-qa muss die Bild-zur-Szene-Regeln prüfen.');
if(!pkg.scripts?.['science:title-check']) errors.push('package.json fehlt science:title-check.');
if(!/## Spannung – Pflicht für neue Videos/.test(longform)||!/## Titel – vor dem Skript prüfen/.test(longform)) errors.push('LONGFORM.md muss Spannungs- und Titelregeln dokumentieren.');
if(!/## Bild passt zur Szene/.test(imageWorld)) errors.push('BILDWELT.md muss die Bild-zur-Szene-Regeln dokumentieren.');
for(const [file,label] of [['scripts/science-readiness.mjs','science:ready'],['scripts/render_science_reel.mjs','science:render']]){
  if(!fs.readFileSync(path.join(root,file),'utf8').includes('science-image-text-qa.mjs')) errors.push(`${label} muss das OCR-Text-Gate vor dem Rendern ausführen.`);
}

if(!scienceReel.includes("./generated/science-runtime.json")) errors.push('ScienceReel muss science-runtime.json laden.');
if(scienceReel.includes('OffthreadVideo')||scienceReel.includes('videoPath')) errors.push('ScienceReel darf keine Videoszenen unterstützen.');
if(!template.includes("runtimeFile:'science-runtime.json'")||!template.includes("productionProfile='youtube-6to7min-v1'")||!template.includes("productionProfile:scenePlan.productionProfile")) errors.push('Scene-Template muss beide Profiltypen dynamisch unterstützen.');
if(!newVideo.includes("visualType:'UNGEPLANT'")||!newVideo.includes("primaryMotif:'UNGEPLANT'")) errors.push('Neue Videos müssen Visual-Diversity-Platzhalter anlegen.');
if(!newVideo.includes('pauseAfterEachImageStep:false')||!newVideo.includes('continueAutomaticallyBetweenImageSteps:true')) errors.push('Neue Videos müssen fünf Bildschritte ohne Zwischenstopps anlegen.');
if(!newVideo.includes('deleteUnselectedThumbnailCandidatesAfterSelection:true')||!newVideo.includes("selectedThumbnailFinalName:'00-thumbnail-final'")) errors.push('Neue Videos müssen Cover-Bereinigung anlegen.');
if(!newVideo.includes('finalFlowCollectionRequired:true')||!newVideo.includes('singleFinalFlowCollectionPerVideo:true')||!newVideo.includes('finalCollectionContainsFinalAssetsOnly:true')) errors.push('Neue Videos müssen eine bereinigte finale Flow-Sammlung anlegen.');
if(!newVideo.includes("phase3AssetSource:'phase2-project-folders-only'")||!newVideo.includes('phase3MayGenerateVisualAssets:false')||!newVideo.includes("phase3MissingAssetPolicy:'stop-and-report'")) errors.push('Neue Videos müssen Phase-3-No-Generation-Handoff verankern.');
if(newVideo.includes('02-bilder/videos')||newVideo.includes('image-to-video')) errors.push('Neue Videos dürfen keine KI-Video-Struktur anlegen.');
if(!prepareScience.includes('PHASE-3-HARD-GUARD')||!prepareScience.includes("scripts/science-required-media.mjs")) errors.push('science:prepare muss Phase-2-Assets vor jeder Phase-3-Verarbeitung hart prüfen.');
if(!processVoice.includes('loudnorm=I=')) errors.push('Voice-Loudness-Normalisierung fehlt.');
if(!renderQa.includes('blackdetect')||!renderQa.includes('silencedetect')) errors.push('Render-QA Schwarzbild/Randstille fehlt.');
if(!renderQa.includes('freezeDetectionEnabled: false')) errors.push('Freeze Detection muss deaktiviert bleiben.');

if(errors.length){
  console.error('Konsistenzprüfung fehlgeschlagen:');
  errors.forEach((error)=>console.error(`- ${error}`));
  process.exit(1);
}
console.log('✓ youtube-6to7min-v1: Bildpipeline, Phase-2-Handoff, Phase-3-No-Generation, fünf Flow-Schritte, Cover-Bereinigung und subtitle-free Rendering sind konsistent.');
