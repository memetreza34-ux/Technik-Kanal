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
if (!fs.existsSync(paths.flowPlan)) errors.push('flow-plan.json fehlt. Jedes aktive Video benötigt eine bewusste Bild/Video-Entscheidung pro Beat.');
else {
  try { flowPlan = JSON.parse(fs.readFileSync(paths.flowPlan,'utf8')); }
  catch (error) { errors.push(`flow-plan.json ist ungültig: ${error.message}`); }
}

const flowEntries = Array.isArray(flowPlan?.scenes) ? flowPlan.scenes : [];
const flowById = new Map(flowEntries.map((entry)=>[entry.id,entry]));
let videoCount = 0;
if (flowPlan) {
  if (flowEntries.length !== plan.scenes.length) errors.push(`flow-plan.json enthält ${flowEntries.length} Beats; erwartet ${plan.scenes.length}.`);
  for (const scene of plan.scenes) {
    const entry = flowById.get(scene.id);
    if (!entry) { errors.push(`${scene.id}: Eintrag im flow-plan.json fehlt.`); continue; }
    if (!['image','image-to-video'].includes(entry.output)) {
      errors.push(`${scene.id}: Flow-output muss final als image oder image-to-video festgelegt sein.`);
      continue;
    }
    if (entry.output === 'image-to-video') {
      videoCount += 1;
      if (!String(entry.motionPrompt ?? '').trim()) errors.push(`${scene.id}: motionPrompt für Image-to-Video fehlt.`);
      const seconds = Number(entry.clipSeconds ?? 0);
      if (!Number.isFinite(seconds) || seconds <= 0 || seconds > config.visuals.flow.clipSecondsMax) errors.push(`${scene.id}: clipSeconds muss 1–${config.visuals.flow.clipSecondsMax} sein.`);
      if (!String(entry.videoDir ?? '').trim()) errors.push(`${scene.id}: videoDir fehlt.`);
    }
  }
  if (videoCount === 0) errors.push('Flow-Plan enthält keinen einzigen KI-Video-Beat. Die aktive Pipeline ist bewusst gemischt aus Bildern und Flow-Clips.');
  const ratio = plan.scenes.length ? videoCount / plan.scenes.length : 0;
  const target = config.visuals.flow.targetVideoRatio;
  if (ratio < target.min || ratio > target.max) warnings.push(`KI-Video-Anteil ${(ratio*100).toFixed(0)} % liegt außerhalb des Richtwerts ${(target.min*100).toFixed(0)}–${(target.max*100).toFixed(0)} %. Inhaltliche Klarheit darf die Quote überstimmen.`);
}

const flowMaster = fs.existsSync(paths.flowMaster) ? fs.readFileSync(paths.flowMaster,'utf8') : '';
if (!flowMaster) errors.push('GOOGLE-FLOW-MASTER-PROMPT.txt fehlt.');
else {
  if (/NOCH NICHT FINAL|PLACEHOLDER|ERGÄNZEN/i.test(flowMaster)) errors.push('Google-Flow-Masterprompt ist noch nicht final.');
  if (!/(drei|3).*thumbnail/i.test(flowMaster)) errors.push('Flow-Masterprompt muss zuerst drei Thumbnail-Kandidaten verlangen.');
  if (!/(stopp|stop).*auswahl|auswahl.*warten/i.test(flowMaster)) errors.push('Flow-Masterprompt muss nach den drei Thumbnails auf die Nutzerauswahl warten.');
  if (!/(nacheinander|streng einzeln|beat 01.*beat 02)/is.test(flowMaster)) errors.push('Flow-Masterprompt muss Szenen strikt nacheinander erzeugen lassen.');
  if (!/(image-to-video|ki-clip|flow-clip)/i.test(flowMaster)) errors.push('Flow-Masterprompt dokumentiert die KI-Video-Schritte nicht.');
  if (thumbnailPrompt && !normalize(flowMaster).includes(normalize(thumbnailPrompt))) errors.push('Thumbnail-Prompt fehlt im Google-Flow-Masterprompt.');
  for (const scene of plan.scenes) {
    if (promptFiles[scene.id] && !normalize(flowMaster).includes(normalize(promptFiles[scene.id]))) errors.push(`${scene.id}: Bildprompt fehlt im Google-Flow-Masterprompt.`);
    const entry = flowById.get(scene.id);
    if (entry?.output === 'image-to-video' && !normalize(flowMaster).includes(normalize(entry.motionPrompt))) errors.push(`${scene.id}: Motion-Prompt fehlt im Google-Flow-Masterprompt.`);
  }
}

const combinedFile = path.join(paths.root,'02-bilder','ALLE-BILDPROMPTS-MIT-THUMBNAIL.txt');
if (fs.existsSync(combinedFile)) {
  const combined = fs.readFileSync(combinedFile,'utf8');
  if (thumbnailPrompt && !normalize(combined).includes(normalize(thumbnailPrompt))) warnings.push('Legacy-Gesamtprompt enthält den Thumbnail-Prompt nicht vollständig. Maßgeblich ist GOOGLE-FLOW-MASTER-PROMPT.txt.');
}

const report = {
  version:'science-flow-mixed-v1',
  productionProfile:config.productionProfile,
  productionMode:config.visuals.productionMode,
  styleId:config.visuals.styleId,
  brandVisualStyleDefined:config.visuals.brandVisualStyleDefined === true,
  generatedImageTextPolicy:config.visuals.generatedImageTextPolicy,
  generatedAt:new Date().toISOString(),
  passed:errors.length===0,
  sceneCount:plan.scenes.length,
  flowVideoCount:videoCount,
  staticImageCount:Math.max(0,plan.scenes.length-videoCount),
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
console.log(`✓ Creative-QA bestanden: ${plan.scenes.length} Ausgangsbilder, ${videoCount} Google-Flow-KI-Clips geplant, separates Thumbnail und ein Masterprompt.`);
warnings.forEach((warning)=>console.warn(`⚠ ${warning}`));
