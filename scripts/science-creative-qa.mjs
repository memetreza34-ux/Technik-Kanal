#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {ScenePlan} from './lib/electrical-contracts.mjs';
import {electricalProjectPaths} from './lib/electrical-project-structure.mjs';
import {loadElectricalConfig} from './lib/load-electrical-config.mjs';
import {evaluateScienceVisualPolicy} from './lib/science-visual-policy.mjs';

const [projectArg] = process.argv.slice(2).filter((arg) => !arg.startsWith('--'));
if (!projectArg) throw new Error('Nutzung: npm run science:creative-qa -- <video-ordner>');

const paths = electricalProjectPaths(path.resolve(projectArg));
const config = loadElectricalConfig(JSON.parse(fs.readFileSync(paths.scenePlan, 'utf8')).productionProfile);
const plan = ScenePlan.parse(JSON.parse(fs.readFileSync(paths.scenePlan,'utf8')));
const errors = [];
const warnings = [];
const layouts = new Set();
const normalize = (value) => String(value ?? '').replace(/\s+/g,' ').trim().toLowerCase();

for (const scene of plan.scenes) {
  if (scene.layout) layouts.add(scene.layout);
  const headlineWords = (scene.headline ?? scene.title).trim().split(/\s+/).filter(Boolean).length;
  if (headlineWords > config.textQuality.headlineWordsMax) errors.push(`${scene.id}: Headline zu lang.`);
  if (!scene.voiceText.trim()) errors.push(`${scene.id}: Voice-Text fehlt.`);
  if (!scene.imageDir.trim()) errors.push(`${scene.id}: Bildzuordnung fehlt.`);
  if (!scene.section) errors.push(`${scene.id}: Dramaturgie-Abschnitt fehlt.`);
}

const promptFiles = {};
for (const scene of plan.scenes) {
  const file = path.join(paths.promptDir,`${scene.id}.txt`);
  if (!fs.existsSync(file)) {
    errors.push(`${scene.id}: Einzelprompt fehlt.`);
    continue;
  }
  const prompt = fs.readFileSync(file,'utf8');
  promptFiles[scene.id] = prompt;
  if (/\[GENAUE|\[AUSSAGE|ERGÄNZEN|PLACEHOLDER|NEUE BILDWELT/i.test(prompt)) errors.push(`${scene.id}: Prompt ist noch nicht final.`);
  if (!/(16:9|1920.?1080|landscape)/i.test(prompt)) warnings.push(`${scene.id}: 16:9 sollte im Prompt ausdrücklich festgelegt sein.`);
  if (!/(Deutsch|German|deutsche Beschrift|deutscher Text|kein englischer Text|no English text)/i.test(prompt)) warnings.push(`${scene.id}: Deutsch-only für sichtbaren Text ausdrücklich festlegen.`);
  if (!/(eine Hauptaussage|one main idea|visuelle Hauptidee|genau.*Aussage)/i.test(prompt)) warnings.push(`${scene.id}: eine visuelle Hauptaussage klar priorisieren.`);
  if (!/(keine große Überschrift|keine grosse Überschrift|no large headline|no large scene headings|no large scene headline|no boxes[^.]*large scene headings|keinen großen Titel|keinen grossen Titel)/i.test(prompt)) errors.push(`${scene.id}: Szenenprompt muss große generierte Überschriften ausdrücklich ausschließen.`);
  if (!/(keine gesichtslosen|keine leeren Gesichter|sichtbarer Kopf.*Gesicht|visible head.*face|no people|Kopf.*außerhalb|Kopf.*ausserhalb)/i.test(prompt)) errors.push(`${scene.id}: Prompt muss die Regel gegen gesichtslose sichtbare Köpfe enthalten.`);
}

const promptManifest = fs.existsSync(paths.promptManifest) ? JSON.parse(fs.readFileSync(paths.promptManifest,'utf8')) : null;
const policy = evaluateScienceVisualPolicy({plan,config,promptFiles,promptManifest});
errors.push(...policy.errors);
warnings.push(...policy.warnings);

const thumbnailFile = path.join(paths.promptDir,'00-thumbnail.txt');
let thumbnailPrompt = '';
if (!fs.existsSync(thumbnailFile)) errors.push('Separater Thumbnail-Prompt 00-thumbnail.txt fehlt.');
else {
  thumbnailPrompt = fs.readFileSync(thumbnailFile,'utf8');
  if (/platzhalter|ergänzen/i.test(thumbnailPrompt)) errors.push('Thumbnail-Prompt ist noch nicht final.');
  if (!/(16:9|1280.?720)/i.test(thumbnailPrompt)) warnings.push('Thumbnail-Prompt sollte 16:9 / 1280×720 ausdrücklich verlangen.');
  if (!/(3|drei).*(Kandidat|Variante)|candidate/i.test(thumbnailPrompt)) warnings.push('Thumbnail-Prompt sollte drei Kandidaten/Varianten vorsehen.');
}

let flowPlan = null;
if (!fs.existsSync(paths.flowPlan)) errors.push('flow-plan.json fehlt.');
else {
  try { flowPlan = JSON.parse(fs.readFileSync(paths.flowPlan,'utf8')); }
  catch (error) { errors.push(`flow-plan.json ist ungültig: ${error.message}`); }
}

const flowEntries = Array.isArray(flowPlan?.scenes) ? flowPlan.scenes : [];
const stepCount = Number(config.visuals?.flow?.imageProductionSteps ?? 5);
const diversity = config.visuals?.diversity ?? {};
let distinctVisualTypes = new Set();
let motifCounts = new Map();
let handOnObjectCount = 0;

if (flowPlan) {
  if (flowPlan.imageOnly !== true) errors.push('flow-plan.json muss imageOnly=true setzen.');
  if (flowPlan.imageProductionSteps !== stepCount) errors.push(`flow-plan.json muss imageProductionSteps=${stepCount} setzen.`);
  if (flowPlan.pauseAfterEachImageStep !== false) errors.push('flow-plan.json muss pauseAfterEachImageStep=false setzen.');
  if (flowPlan.continueAutomaticallyBetweenImageSteps !== true) errors.push('flow-plan.json muss continueAutomaticallyBetweenImageSteps=true setzen.');
  if (flowPlan.finalReportAfterAllImageSteps !== true) errors.push('flow-plan.json muss finalReportAfterAllImageSteps=true setzen.');
  if (flowPlan.deleteUnselectedThumbnailCandidatesAfterSelection !== true) errors.push('flow-plan.json muss die zwei nicht gewählten Cover nach Auswahl entfernen.');
  if (flowPlan.selectedThumbnailFinalName !== '00-thumbnail-final') errors.push('flow-plan.json muss selectedThumbnailFinalName=00-thumbnail-final setzen.');
  if (flowPlan.finalFlowCollectionRequired !== true || flowPlan.singleFinalFlowCollectionPerVideo !== true) errors.push('flow-plan.json muss genau eine finale Flow-Sammlung pro Video verlangen.');
  if (!String(flowPlan.finalCollectionName ?? '').trim()) errors.push('flow-plan.json muss finalCollectionName setzen.');
  if (flowPlan.removeRejectedVariantsBeforeCompletion !== true) errors.push('flow-plan.json muss verworfene Varianten vor Abschluss entfernen.');
  if (flowPlan.renameFinalAssetsBeforeCompletion !== true) errors.push('flow-plan.json muss finale Assets vor Abschluss korrekt benennen.');
  if (flowPlan.finalCollectionContainsFinalAssetsOnly !== true) errors.push('flow-plan.json muss die finale Sammlung auf finale Assets beschränken.');
  if (flowEntries.length !== plan.scenes.length) errors.push(`flow-plan.json enthält ${flowEntries.length} Beats; erwartet ${plan.scenes.length}.`);

  const byId = new Map(flowEntries.map((entry)=>[entry.id,entry]));
  const grouped = Array.from({length:stepCount},()=>[]);
  let previousVisualType = null;

  for (const scene of plan.scenes) {
    const entry = byId.get(scene.id);
    if (!entry) { errors.push(`${scene.id}: Eintrag im flow-plan.json fehlt.`); continue; }
    if (entry.output !== 'image') errors.push(`${scene.id}: Nur output=image ist erlaubt.`);
    if (entry.clipSeconds != null || String(entry.motionPrompt ?? '').trim() || String(entry.videoDir ?? '').trim()) errors.push(`${scene.id}: Video-/Motion-Felder sind nicht erlaubt.`);

    const imageStep = Number(entry.imageStep);
    if (!Number.isInteger(imageStep) || imageStep < 1 || imageStep > stepCount) errors.push(`${scene.id}: imageStep muss 1–${stepCount} sein.`);
    else grouped[imageStep-1].push(entry);

    const visualType = normalize(entry.visualType);
    const primaryMotif = normalize(entry.primaryMotif);
    if (!visualType || /ungeplant|tbd|placeholder/.test(visualType)) errors.push(`${scene.id}: visualType muss vor Produktion konkret geplant sein.`);
    if (!primaryMotif || /ungeplant|tbd|placeholder/.test(primaryMotif)) errors.push(`${scene.id}: primaryMotif muss vor Produktion konkret geplant sein.`);
    if (visualType) distinctVisualTypes.add(visualType);
    if (primaryMotif) motifCounts.set(primaryMotif,(motifCounts.get(primaryMotif)??0)+1);
    if (/hand.*(gegenstand|kontakt|material|object)|hand-contact|hand-on-object/.test(primaryMotif)) handOnObjectCount += 1;
    if (previousVisualType && visualType && visualType === previousVisualType) errors.push(`${scene.id}: derselbe visualType darf nicht direkt hintereinander dominieren.`);
    if (visualType) previousVisualType = visualType;
  }

  if (grouped.some((group)=>group.length===0)) errors.push(`Alle ${stepCount} Bildschritte müssen mindestens ein Bild enthalten.`);
  const flattened = grouped.flat().map((entry)=>entry.id);
  const expected = plan.scenes.map((scene)=>scene.id);
  if (flattened.join('|') !== expected.join('|')) errors.push(`Die ${stepCount} Bildschritte müssen zusammenhängend und in Szenenreihenfolge angeordnet sein.`);
  const sizes = grouped.map((group)=>group.length);
  if (sizes.length && Math.max(...sizes)-Math.min(...sizes)>1) errors.push(`Die ${stepCount} Bildschritte müssen möglichst gleichmäßig verteilt sein. Aktuell: ${sizes.join(', ')}.`);

  if (distinctVisualTypes.size < Number(diversity.minimumDistinctVisualTypesPerVideo ?? 5)) errors.push(`Zu wenig visuelle Vielfalt: ${distinctVisualTypes.size} Visual-Typen; mindestens ${diversity.minimumDistinctVisualTypesPerVideo ?? 5}.`);
  for (const [motif,count] of motifCounts) {
    if (count > Number(diversity.samePrimaryMotifMaxPerVideo ?? 3)) errors.push(`Primärmotiv „${motif}“ kommt ${count}-mal vor; maximal ${diversity.samePrimaryMotifMaxPerVideo ?? 3}.`);
  }
  if (handOnObjectCount > Number(diversity.handOnObjectPrimaryMotifMaxPerVideo ?? 3)) errors.push(`Hand-auf-Gegenstand-Motiv kommt ${handOnObjectCount}-mal vor; maximal ${diversity.handOnObjectPrimaryMotifMaxPerVideo ?? 3}.`);

  for (let index=0;index<grouped.length;index+=1) {
    const types = new Set(grouped[index].map((entry)=>normalize(entry.visualType)).filter(Boolean));
    const required = Math.min(grouped[index].length,Number(diversity.minimumDistinctVisualTypesPerImageStepPreferred ?? 3));
    if (types.size < required) errors.push(`Bildschritt ${index+1}: nur ${types.size} Visual-Typen für ${grouped[index].length} Bilder; erwartet mindestens ${required}.`);
  }
}

const flowMaster = fs.existsSync(paths.flowMaster) ? fs.readFileSync(paths.flowMaster,'utf8') : '';
const finalizationFile = path.join(path.dirname(paths.flowMaster),'FLOW-FINALISIERUNG.txt');
const flowFinalization = fs.existsSync(finalizationFile) ? fs.readFileSync(finalizationFile,'utf8') : '';
const cleanupText = `${flowMaster}\n${flowFinalization}`;
if (!flowMaster) errors.push('GOOGLE-FLOW-MASTER-PROMPT.txt fehlt.');
else {
  if (/NOCH NICHT FINAL|PLACEHOLDER|ERGÄNZEN/i.test(flowMaster)) errors.push('Google-Flow-Masterprompt ist noch nicht final.');
  if (!/(drei|3).*thumbnail/i.test(flowMaster)) errors.push('Flow-Masterprompt muss zuerst drei Thumbnail-Kandidaten verlangen.');
  if (!/(stopp|stop).*auswahl|auswahl.*warten/i.test(flowMaster)) errors.push('Flow-Masterprompt muss nach den Thumbnails auf die Nutzerauswahl warten.');
  if (!/(keine Farb|nicht.*Farbpalette|keine.*Layoutvorlage|nicht.*Layout)/i.test(flowMaster)) errors.push('Flow-Masterprompt muss verbieten, Thumbnail-Palette oder Layout auf alle Szenen zu kopieren.');
  if (!/(visuelle Vielfalt|unterschiedliche Darstellungsformen|Diversity)/i.test(flowMaster)) errors.push('Flow-Masterprompt muss die visuelle Vielfalt ausdrücklich verlangen.');
  if (!/(keine gesichtslosen|keine leeren Gesichter|sichtbarer Kopf.*Gesicht)/i.test(flowMaster)) errors.push('Flow-Masterprompt muss gesichtslose sichtbare Köpfe verbieten.');
  if (!/(nur bilder|ausschließlich.*bilder|keine ki-videoclips)/i.test(flowMaster)) errors.push('Flow-Masterprompt muss den reinen Bild-Workflow festlegen.');
  if (/OUTPUT\s*=\s*IMAGE-TO-VIDEO|KI-VIDEO-ANIMATION/i.test(flowMaster)) errors.push('Flow-Masterprompt enthält verbotene Video-/Animationsschritte.');
  for (let step=1;step<=stepCount;step+=1) if (!new RegExp(`BILDSCHRITT\\s+${step}(?:\\/${stepCount})?`,'i').test(flowMaster)) errors.push(`Flow-Masterprompt enthält Bildschritt ${step} nicht.`);
  if (/STOPP NACH BILDSCHRITT\s+[1-4]/i.test(flowMaster)) errors.push('Flow-Masterprompt darf nach der Cover-Auswahl keine Zwischenstopps zwischen Bildschritt 1–5 enthalten.');
  if (!/(ohne zwischenstopp|keine weiteren stopps|keine zwischenstopps|direkt mit bildschritt)/i.test(flowMaster)) errors.push('Flow-Masterprompt muss die automatische Fortsetzung zwischen allen fünf Bildschritten ausdrücklich verlangen.');
  if (!/(erst nach.*bildschritt 5|nach abschluss von bildschritt 5|gesamtabschluss)/i.test(flowMaster)) errors.push('Flow-Masterprompt muss den Gesamtabschluss erst nach Bildschritt 5 vorsehen.');
  if (thumbnailPrompt && !normalize(flowMaster).includes(normalize(thumbnailPrompt))) errors.push('Thumbnail-Prompt fehlt im Masterprompt.');
  for (const scene of plan.scenes) if (promptFiles[scene.id] && !normalize(flowMaster).includes(normalize(promptFiles[scene.id]))) errors.push(`${scene.id}: Bildprompt fehlt im Masterprompt.`);
}

if (!/(00-thumbnail-final)/i.test(cleanupText)) errors.push('Flow-Cleanup muss das ausgewählte Cover als 00-thumbnail-final benennen.');
if (!/(zwei nicht gewählten.*cover|zwei verworfenen.*cover|2 nicht gewählten.*cover)/i.test(cleanupText)) errors.push('Flow-Cleanup muss die zwei nicht gewählten Cover entfernen.');
if (!/(finale.*google-flow-sammlung|finalen.*google-flow.*ordner|finale flow-sammlung)/i.test(cleanupText)) errors.push('Flow-Cleanup muss genau eine finale Google-Flow-Sammlung / einen finalen Ordner verlangen.');
if (!/(fehlversuche|zwischenversionen|zwischenstände)/i.test(cleanupText)) errors.push('Flow-Cleanup muss Fehlversuche und Zwischenstände entfernen.');
if (!/(nur.*finale assets|finale sammlung.*nur|nur enthalten)/i.test(cleanupText)) errors.push('Flow-Cleanup muss die finale Sammlung auf finale Assets beschränken.');

const report = {
  version:'science-flow-images-v5-final-collection',
  productionProfile:config.productionProfile,
  productionMode:config.visuals.productionMode,
  imageProductionSteps:stepCount,
  pauseAfterEachImageStep:false,
  continueAutomaticallyBetweenImageSteps:true,
  finalFlowCollectionRequired:true,
  styleId:config.visuals.styleId,
  generatedAt:new Date().toISOString(),
  passed:errors.length===0,
  sceneCount:plan.scenes.length,
  staticImageCount:plan.scenes.length,
  flowVideoCount:0,
  distinctVisualTypeCount:distinctVisualTypes.size,
  handOnObjectCount,
  layouts:[...layouts],
  errors,
  warnings
};
fs.writeFileSync(path.join(paths.projectDir,'creative-qa-report.json'),`${JSON.stringify(report,null,2)}\n`);

if (errors.length) {
  console.error('Science-Creative-QA fehlgeschlagen:');
  errors.forEach((error)=>console.error(`- ${error}`));
  process.exit(1);
}
console.log(`✓ Creative-QA bestanden: ${plan.scenes.length} statische Bilder, ${distinctVisualTypes.size} Visual-Typen, ${stepCount} Bildschritte ohne Zwischenstopps, Cover-Cleanup und finale Flow-Sammlung, 0 Clips.`);
warnings.forEach((warning)=>console.warn(`⚠ ${warning}`));
