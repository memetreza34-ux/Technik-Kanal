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
const channel=fs.readFileSync(path.join(root,'channels/science/gehirn/KANAL.md'),'utf8');
const longform=fs.readFileSync(path.join(root,'channels/science/gehirn/LONGFORM.md'),'utf8');
const voice=JSON.parse(fs.readFileSync(path.join(root,'channels/science/engine/config/voice-v1.json'),'utf8'));
const scienceReel=fs.readFileSync(path.join(root,'channels/science/src/ScienceReel.tsx'),'utf8');
const template=fs.readFileSync(path.join(root,'scripts/lib/create-electrical-scene-plan-template.mjs'),'utf8');
const newVideo=fs.readFileSync(path.join(root,'scripts/new-science-reel.mjs'),'utf8');
const flowBuilder=fs.readFileSync(path.join(root,'scripts/build-google-flow-master-prompt.mjs'),'utf8');
const processVoice=fs.readFileSync(path.join(root,'scripts/process_voiceover.mjs'),'utf8');
const renderQa=fs.readFileSync(path.join(root,'scripts/qa_science_render.mjs'),'utf8');
const errors=[];

if(config.version!=='science-v1') errors.push('Aktive Konfiguration muss science-v1 sein.');
if(config.productionProfile!=='youtube-2min-v1') errors.push('Aktives Produktionsprofil muss youtube-2min-v1 sein.');
if(config.format?.width!==1920||config.format?.height!==1080||config.format?.aspectRatio!=='16:9') errors.push('Aktives Videoformat muss 1920×1080 / 16:9 sein.');
if(config.format?.durationSeconds?.ideal!==120) errors.push('Ideale Videolänge muss 120 Sekunden sein.');
if(config.script?.words?.ideal!==300) errors.push('Ideale Skriptlänge muss 300 Wörter sein.');
if(JSON.stringify(config.script?.narrativeStructure)!==JSON.stringify(['hook','context','foundation','mechanism','deepening','payoff'])) errors.push('Longform-Dramaturgie ist falsch.');
if(config.script?.rewriteWhenThreeAdjacentBeatsWouldLookSimilar!==true) errors.push('Skript muss bei drei ähnlichen Nachbarbeats umgeschrieben werden.');
if(config.visuals?.beats?.min!==12||config.visuals?.beats?.ideal!==20||config.visuals?.beats?.max!==28) errors.push('Visuelle Beats müssen 12/20/28 konfiguriert sein.');
if(config.visuals?.thumbnail?.required!==true||config.visuals?.thumbnail?.candidateCount!==3) errors.push('Drei Thumbnail-Kandidaten müssen vorgeschrieben sein.');
if(!/youtube-2min-v1/i.test(longform)||!/Hook.*Kontext.*Grundlage.*Mechanismus.*Vertiefung.*Payoff/is.test(longform)) errors.push('LONGFORM.md dokumentiert Profil/Dramaturgie nicht.');
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
if(!/mindestens \*\*5 deutlich unterschiedliche Darstellungsformen\*\*/i.test(imageWorld)) errors.push('BILDWELT.md muss mindestens fünf Darstellungsformen verlangen.');

for(const command of ['science:new','science:flow-master','science:preflight','science:ready','science:prepare','science:render','science:finish','science:system-test']) if(!pkg.scripts?.[command]) errors.push(`package.json fehlt ${command}.`);
if(Object.keys(pkg.scripts??{}).some((name)=>name.startsWith('electrical:')||name.startsWith('elektro:'))) errors.push('package.json enthält alte Elektro-Aliase.');
if(!pkg.dependencies?.sharp||!pkg.dependencies?.zod||!pkg.devDependencies?.vitest) errors.push('Pflichtabhängigkeiten fehlen.');

if(config.captions?.enabled!==false||config.captions?.burnedIn!==false) errors.push('Eingebrannte Untertitel müssen deaktiviert sein.');
if(config.captions?.internalTimingAllowed!==true) errors.push('Interne Wortzeiten müssen erlaubt bleiben.');
if(scienceReel.includes('ScienceCaptions')) errors.push('ScienceReel darf keine eingebrannten Captions rendern.');
if(config.visuals.policyVersion!=='science-static-v1'||config.visuals.productionMode!=='flow-image-only') errors.push('Visual-Policy/Produktionsmodus falsch.');
if(config.visuals.animationAllowed!==false||config.visuals.cameraMotionAllowed!==false) errors.push('Animation/Kamerabewegung müssen deaktiviert sein.');
if(config.visuals.styleId!=='scientific-scene-explainer-v1') errors.push('Aktive Bildwelt falsch.');
if(config.visuals.fixedBackgroundForbidden!==true) errors.push('Fixer Hintergrund darf nicht erzwungen werden.');

const d=config.visuals?.diversity;
if(d?.minimumDistinctVisualTypesPerVideo!==5) errors.push('Mindestens fünf Visual-Typen müssen konfiguriert sein.');
if(d?.sameCompositionMaxConsecutive!==1) errors.push('Gleiche Komposition darf nicht direkt wiederholt werden.');
if(d?.samePrimaryMotifMaxPerVideo!==3||d?.handOnObjectPrimaryMotifMaxPerVideo!==3) errors.push('Primärmotiv-/Handlimits falsch.');
if(d?.largeGeneratedHeadlineInSceneImagesAllowed!==false) errors.push('Große generierte Szenenüberschriften müssen deaktiviert sein.');
if(d?.preferredLabelsMax!==2) errors.push('Normale Szenen sollen max. zwei Labels bevorzugen.');
if(d?.blankOrFeaturelessVisibleFacesForbidden!==true) errors.push('Gesichtslose sichtbare Köpfe müssen verboten sein.');
if(d?.thumbnailReferenceScope!=='quality-and-illustration-style-only-not-layout-or-palette') errors.push('Thumbnail darf nur Stil-/Qualitätsreferenz sein.');

const flow=config.visuals.flow;
if(!flow?.masterPromptRequired||!flow?.planRequired) errors.push('Flow-Plan/Masterprompt müssen Pflicht sein.');
if(!flow?.thumbnailFirst||!flow?.pauseAfterThumbnailCandidates) errors.push('Thumbnail-Stop-Regel fehlt.');
if(flow?.imageProductionSteps!==5||flow?.balancedImageStepGrouping!==true) errors.push('Genau fünf Bildschritte fehlen.');
if(flow?.pauseAfterEachImageProductionStep!==false) errors.push('Zwischenstopps nach Bildschritten müssen deaktiviert sein.');
if(flow?.continueAutomaticallyBetweenImageSteps!==true) errors.push('Automatische Fortsetzung zwischen Bildschritten muss aktiv sein.');
if(flow?.finalReportAfterAllImageSteps!==true) errors.push('Gesamtabschluss darf erst nach allen fünf Bildschritten erfolgen.');
if(!flow?.sequentialSceneGenerationRequired||!flow?.oneImagePerBeatRequired) errors.push('Sequentielle Einzelbilder fehlen.');
if(flow?.imageOnly!==true||flow?.aiVideoAllowed!==false||flow?.clipsAllowed!==false) errors.push('Flow muss bild-only sein.');
if(flow?.remotionMayPlayFlowClips!==false||flow?.remotionMayGenerateMotion!==false) errors.push('Remotion darf keine Clips/Motion erzeugen.');

if(!/(drei|3).*thumbnail/is.test(flowWorkflow)||!/(STOPPEN|STOPP)/.test(flowWorkflow)) errors.push('FLOW-WORKFLOW Thumbnail-Stop fehlt.');
if(!/genau 5 Bildschritte|genau fünf Bildschritte/i.test(flowWorkflow)) errors.push('FLOW-WORKFLOW fünf Schritte fehlen.');
if(!/keine weiteren Stopps|keine Zwischenstopps/i.test(flowWorkflow)) errors.push('FLOW-WORKFLOW muss Zwischenstopps nach der Cover-Auswahl verbieten.');
if(!/automatisch mit Bildschritt 2|automatisch vollständig/i.test(flowWorkflow)) errors.push('FLOW-WORKFLOW muss automatische Fortsetzung durch alle fünf Schritte verlangen.');
if(!/visuelle Vielfalt/i.test(flowWorkflow)) errors.push('FLOW-WORKFLOW Diversity fehlt.');
if(!/keine eingebrannten Untertitel/i.test(flowWorkflow)) errors.push('FLOW-WORKFLOW subtitle-free fehlt.');
if(!/GOOGLE-FLOW-MASTER-PROMPT\.txt/i.test(claude)||!/flow-plan\.json/i.test(claude)) errors.push('CLAUDE Flow-Dateien fehlen.');
if(!/keine weitere Freigabe|keine weiteren Freigaben|keine Zwischenstopps/i.test(claude)) errors.push('CLAUDE muss Cover als einzigen Freigabepunkt festlegen.');
if(!flowBuilder.includes('NUR BILDER')||!flowBuilder.includes('VISUELLE VIELFALT IST PFLICHT')) errors.push('Flow-Master-Builder enthält Bild-/Diversity-Regeln nicht.');
if(!flowBuilder.includes('visualType')||!flowBuilder.includes('primaryMotif')) errors.push('Flow-Master-Builder prüft Visual-Typ/Primärmotiv nicht.');
if(!flowBuilder.includes('KEINE WEITEREN STOPPS ODER RÜCKFRAGEN')) errors.push('Flow-Master-Builder muss Zwischenstopps nach Cover-Auswahl verbieten.');
if(flowBuilder.includes('STOPP NACH BILDSCHRITT')) errors.push('Flow-Master-Builder darf keine Zwischenstopps nach Bildschritten erzeugen.');
if(flowBuilder.includes('image-to-video')) errors.push('Flow-Master-Builder darf kein Image-to-Video enthalten.');

if(!scienceReel.includes("./generated/science-runtime.json")) errors.push('ScienceReel muss science-runtime.json laden.');
if(scienceReel.includes('OffthreadVideo')||scienceReel.includes('videoPath')) errors.push('ScienceReel darf keine Videoszenen unterstützen.');
if(!template.includes("runtimeFile:'science-runtime.json'")||!template.includes("productionProfile:'youtube-2min-v1'")) errors.push('Scene-Template falsch.');
if(!newVideo.includes("visualType:'UNGEPLANT'")||!newVideo.includes("primaryMotif:'UNGEPLANT'")) errors.push('Neue Videos müssen Visual-Diversity-Platzhalter anlegen.');
if(!newVideo.includes('pauseAfterEachImageStep:false')||!newVideo.includes('continueAutomaticallyBetweenImageSteps:true')) errors.push('Neue Videos müssen fünf Bildschritte ohne Zwischenstopps anlegen.');
if(newVideo.includes('02-bilder/videos')||newVideo.includes('image-to-video')) errors.push('Neue Videos dürfen keine KI-Video-Struktur anlegen.');
if(!processVoice.includes('loudnorm=I=')) errors.push('Voice-Loudness-Normalisierung fehlt.');
if(!renderQa.includes('blackdetect')||!renderQa.includes('silencedetect')) errors.push('Render-QA Schwarzbild/Randstille fehlt.');
if(!renderQa.includes('freezeDetectionEnabled: false')) errors.push('Freeze Detection muss deaktiviert bleiben.');

if(errors.length){
  console.error('Konsistenzprüfung fehlgeschlagen:');
  errors.forEach((error)=>console.error(`- ${error}`));
  process.exit(1);
}
console.log('✓ youtube-2min-v1: abwechslungsreiche Bildpipeline, fünf Flow-Schritte ohne Zwischenstopps, keine eingebrannten Untertitel und Scientific Scene Explainer sind konsistent.');
