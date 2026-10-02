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
const config = loadElectricalConfig();
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
  if (!/(Deutsch|German|deutsche Beschrift|deutscher Text|kein englischer Text|no English text)/i.test(prompt)) warnings.push(`${scene.id}: Bei sichtbarem Bildtext Deutsch-only ausdrücklich festlegen.`);
  if (!/(eine Hauptaussage|one main idea|one scientific statement|genau.*Aussage|exact idea|exact statement|visuelle Hauptidee)/i.test(prompt)) warnings.push(`${scene.id}: Prompt sollte die eine visuelle Kernaussage des Beats klar priorisieren.`);
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
if (!fs.existsSync(paths.flowPlan)) errors.push('flow-plan.json fehlt. Jedes aktive Video benötigt einen expliziten Bild-Plan.');
else {
  try { flowPlan = JSON.parse(fs.readFileSync(paths.flowPlan,'utf8')); }
  catch (error) { errors.push(`flow-plan.json ist ungültig: ${error.message}`); }
}

const flowEntries = Array.isArray(flowPlan?.scenes) ? flowPlan.scenes : [];
const stepCount = Number(config.visuals?.flow?.imageProductionSteps ?? 5);
if (flowPlan) {
  if (flowPlan.imageOnly !== true) errors.push('flow-plan.json muss imageOnly=true setzen.');
  if (flowPlan.imageProductionSteps !== stepCount) errors.push(`flow-plan.json muss imageProductionSteps=${stepCount} setzen.`);
  if (flowPlan.pauseAfterEachImageStep !== true) errors.push('flow-plan.json muss pauseAfterEachImageStep=true setzen.');
  if (flowEntries.length !== plan.scenes.length) errors.push(`flow-plan.json enthält ${flowEntries.length} Beats; erwartet ${plan.scenes.length}.`);
  const byId = new Map(flowEntries.map((entry)=>[entry.id,entry]));
  const groupedIds = Array.from({length:stepCount},()=>[]);
  for (const scene of plan.scenes) {
    const entry = byId.get(scene.id);
    if (!entry) { errors.push(`${scene.id}: Eintrag im flow-plan.json fehlt.`); continue; }
    if (entry.output !== 'image') errors.push(`${scene.id}: Nur output=image ist erlaubt. KI-Videoclips sind nicht Teil dieses Kanals.`);
    if (entry.clipSeconds != null) errors.push(`${scene.id}: clipSeconds ist im reinen Bild-Workflow nicht erlaubt.`);
    if (String(entry.motionPrompt ?? '').trim()) errors.push(`${scene.id}: motionPrompt ist im reinen Bild-Workflow nicht erlaubt.`);
    if (String(entry.videoDir ?? '').trim()) errors.push(`${scene.id}: videoDir ist im reinen Bild-Workflow nicht erlaubt.`);
    const imageStep = Number(entry.imageStep);
    if (!Number.isInteger(imageStep) || imageStep < 1 || imageStep > stepCount) errors.push(`${scene.id}: imageStep muss 1–${stepCount} sein.`);
    else groupedIds[imageStep-1].push(scene.id);
  }
  if (groupedIds.some((group)=>group.length===0)) errors.push(`Alle ${stepCount} Bildschritte müssen mindestens ein Bild enthalten.`);
  const flattened = groupedIds.flat();
  const expected = plan.scenes.map((scene)=>scene.id);
  if (flattened.join('|') !== expected.join('|')) errors.push(`Die ${stepCount} Bildschritte müssen zusammenhängend und in Szenenreihenfolge angeordnet sein.`);
  const sizes = groupedIds.map((group)=>group.length);
  if (sizes.length && Math.max(...sizes)-Math.min(...sizes)>1) errors.push(`Die ${stepCount} Bildschritte müssen möglichst gleichmäßig verteilt sein. Aktuell: ${sizes.join(', ')}.`);
}

const flowMaster = fs.existsSync(paths.flowMaster) ? fs.readFileSync(paths.flowMaster,'utf8') : '';
if (!flowMaster) errors.push('GOOGLE-FLOW-MASTER-PROMPT.txt fehlt.');
else {
  if (/NOCH NICHT FINAL|PLACEHOLDER|ERGÄNZEN/i.test(flowMaster)) errors.push('Google-Flow-Masterprompt ist noch nicht final.');
  if (!/(drei|3).*thumbnail/i.test(flowMaster)) errors.push('Flow-Masterprompt muss zuerst drei Thumbnail-Kandidaten verlangen.');
  if (!/(stopp|stop).*auswahl|auswahl.*warten/i.test(flowMaster)) errors.push('Flow-Masterprompt muss nach den drei Thumbnails auf die Nutzerauswahl warten.');
  if (!/(nur bilder|ausschließlich.*bilder|keine ki-videoclips)/i.test(flowMaster)) errors.push('Flow-Masterprompt muss den reinen Bild-Workflow ausdrücklich festlegen.');
  if (/OUTPUT\s*=\s*IMAGE-TO-VIDEO|IMAGE-TO-VIDEO\s+[0-9]|KI-VIDEO-ANIMATION/i.test(flowMaster)) errors.push('Flow-Masterprompt enthält verbotene Video-/Animationsschritte.');
  for (let step=1;step<=stepCount;step+=1) {
    if (!new RegExp(`BILDSCHRITT\\s+${step}(?:\\/${stepCount})?`,'i').test(flowMaster)) errors.push(`Flow-Masterprompt enthält Bildschritt ${step} nicht ausdrücklich.`);
  }
  if (!/STOPP NACH BILDSCHRITT/i.test(flowMaster)) errors.push('Flow-Masterprompt muss zwischen den Bildschritten stoppen und auf Freigabe warten.');
  if (thumbnailPrompt && !normalize(flowMaster).includes(normalize(thumbnailPrompt))) errors.push('Thumbnail-Prompt fehlt im Google-Flow-Masterprompt.');
  for (const scene of plan.scenes) {
    if (promptFiles[scene.id] && !normalize(flowMaster).includes(normalize(promptFiles[scene.id]))) errors.push(`${scene.id}: Bildprompt fehlt im Google-Flow-Masterprompt.`);
  }
}

const report = {
  version:'science-flow-images-v2-five-steps',
  productionProfile:config.productionProfile,
  productionMode:config.visuals.productionMode,
  imageProductionSteps:stepCount,
  styleId:config.visuals.styleId,
  brandVisualStyleDefined:config.visuals.brandVisualStyleDefined === true,
  generatedImageTextPolicy:config.visuals.generatedImageTextPolicy,
  generatedAt:new Date().toISOString(),
  passed:errors.length===0,
  sceneCount:plan.scenes.length,
  staticImageCount:plan.scenes.length,
  flowVideoCount:0,
  layouts:[...layouts],
  visualPolicyVersion:plan.visualPolicyVersion,
  errors,
  warnings
};
fs.writeFileSync(path.join(paths.projectDir,'creative-qa-report.json'),`${JSON.stringify(report,null,2)}\n`);

if (errors.length) {
  console.error('Science-Creative-QA fehlgeschlagen:');
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}
console.log(`✓ Creative-QA bestanden: ${plan.scenes.length} statische Szenenbilder in genau ${stepCount} Bildschritten, 0 KI-Videoclips.`);
warnings.forEach((warning)=>console.warn(`⚠ ${warning}`));
