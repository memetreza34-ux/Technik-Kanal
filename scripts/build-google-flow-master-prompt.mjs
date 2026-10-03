#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {electricalProjectPaths} from './lib/electrical-project-structure.mjs';
import {loadElectricalConfig} from './lib/load-electrical-config.mjs';

const [projectArg] = process.argv.slice(2).filter((arg) => !arg.startsWith('--'));
if (!projectArg) throw new Error('Nutzung: npm run science:flow-master -- <video-ordner>');

const root = path.resolve(projectArg);
const paths = electricalProjectPaths(root);
const config = loadElectricalConfig();
const read = (file) => fs.readFileSync(file, 'utf8').trim();
const readJson = (file) => JSON.parse(read(file));
const normalize = (value) => String(value ?? '').trim().toLowerCase();

const STYLE_LOCK = `STYLE LOCK — Technical Editorial Explainer 2.5D
Keep the exact same visual language across the entire video: clean modern 2D/2.5D vector-like technical editorial illustration, simplified but believable proportions, matte materials, clean edges, subtle gradients, soft controlled shadows, consistent line weight, moderate depth, adult professional educational design. Use warm off-white, graphite and muted industrial neutrals as the base family; use copper, blue, orange/red, green or yellow only as meaningful technical accents. Do not use photorealism, real-photo aesthetics, hyperrealistic environments, generic AI art, white textbook infographic layouts, Pixar/cartoon styling, sci-fi HUDs or neon-heavy effects. Scene type, perspective and environment may change, but rendering language, material simplification, line quality, typography and callout design must remain consistent. Visible text only in German and only when explicitly requested. Google Flow prompt instructions are written in English. This STYLE LOCK overrides any older style wording inside scene-specific prompt text.`;

if (!fs.existsSync(paths.scenePlan)) throw new Error('scene-plan.json fehlt.');
if (!fs.existsSync(paths.flowPlan)) throw new Error('flow-plan.json fehlt.');
const thumbnailFile = path.join(paths.promptDir, '00-thumbnail.txt');
if (!fs.existsSync(thumbnailFile)) throw new Error('00-thumbnail.txt fehlt.');

const plan = readJson(paths.scenePlan);
const flowPlan = readJson(paths.flowPlan);
const scenes = Array.isArray(plan.scenes) ? plan.scenes : [];
const flowScenes = Array.isArray(flowPlan.scenes) ? flowPlan.scenes : [];
const stepCount = Number(config.visuals?.flow?.imageProductionSteps ?? 5);
const diversity = config.visuals?.diversity ?? {};
if (!scenes.length) throw new Error('Szenenplan enthält keine Beats.');
if (flowPlan.imageOnly !== true) throw new Error('flow-plan.json muss imageOnly=true setzen.');
if (flowPlan.imageProductionSteps !== stepCount) throw new Error(`flow-plan.json muss imageProductionSteps=${stepCount} setzen.`);
if (flowPlan.pauseAfterEachImageStep !== false) throw new Error('flow-plan.json muss pauseAfterEachImageStep=false setzen.');
if (flowPlan.continueAutomaticallyBetweenImageSteps !== true) throw new Error('flow-plan.json muss continueAutomaticallyBetweenImageSteps=true setzen.');
if (flowPlan.deleteUnselectedThumbnailCandidatesAfterSelection !== true) throw new Error('flow-plan.json muss die zwei nicht gewählten Cover nach Auswahl entfernen.');
if (flowPlan.selectedThumbnailFinalName !== '00-thumbnail-final') throw new Error('flow-plan.json muss selectedThumbnailFinalName=00-thumbnail-final setzen.');
if (flowPlan.finalFlowCollectionRequired !== true || flowPlan.singleFinalFlowCollectionPerVideo !== true) throw new Error('flow-plan.json muss genau eine finale Flow-Sammlung pro Video verlangen.');
if (flowPlan.removeRejectedVariantsBeforeCompletion !== true || flowPlan.renameFinalAssetsBeforeCompletion !== true || flowPlan.finalCollectionContainsFinalAssetsOnly !== true) throw new Error('flow-plan.json muss die finale Asset-Bereinigung vollständig aktivieren.');
if (!String(flowPlan.finalCollectionName ?? '').trim()) throw new Error('flow-plan.json muss finalCollectionName setzen.');
if (flowScenes.length !== scenes.length) throw new Error(`flow-plan.json muss ${scenes.length} Beat-Einträge enthalten.`);

const byId = new Map(flowScenes.map((entry) => [entry.id, entry]));
const groupedScenes = Array.from({length: stepCount}, () => []);
const visualTypes = new Set();
const motifCounts = new Map();
let previousVisualType = null;
let handOnObjectCount = 0;

for (const scene of scenes) {
  const entry = byId.get(scene.id);
  if (!entry) throw new Error(`Flow-Plan fehlt für ${scene.id}.`);
  if (entry.output !== 'image') throw new Error(`${scene.id}: Nur output=image ist erlaubt.`);
  if (entry.clipSeconds != null || String(entry.motionPrompt ?? '').trim() || String(entry.videoDir ?? '').trim()) throw new Error(`${scene.id}: Video-/Motion-Felder sind nicht erlaubt.`);

  const imageStep = Number(entry.imageStep);
  if (!Number.isInteger(imageStep) || imageStep < 1 || imageStep > stepCount) throw new Error(`${scene.id}: imageStep muss 1–${stepCount} sein.`);

  const visualType = normalize(entry.visualType);
  const primaryMotif = normalize(entry.primaryMotif);
  if (!visualType || /ungeplant|tbd|placeholder/.test(visualType)) throw new Error(`${scene.id}: visualType ist noch nicht final geplant.`);
  if (!primaryMotif || /ungeplant|tbd|placeholder/.test(primaryMotif)) throw new Error(`${scene.id}: primaryMotif ist noch nicht final geplant.`);
  if (previousVisualType && previousVisualType === visualType) throw new Error(`${scene.id}: derselbe visualType darf nicht direkt hintereinander dominieren.`);
  previousVisualType = visualType;
  visualTypes.add(visualType);
  motifCounts.set(primaryMotif,(motifCounts.get(primaryMotif)??0)+1);
  if (/hand.*(gegenstand|kontakt|material|object)|hand-contact|hand-on-object/.test(primaryMotif)) handOnObjectCount += 1;

  groupedScenes[imageStep - 1].push({scene,entry});
  const promptFile = path.join(paths.promptDir, `${scene.id}.txt`);
  if (!fs.existsSync(promptFile)) throw new Error(`${scene.id}: Einzelprompt fehlt.`);
}

for (let index=0;index<groupedScenes.length;index+=1) {
  if (!groupedScenes[index].length) throw new Error(`Bildschritt ${index+1} enthält keine Bilder.`);
  const types = new Set(groupedScenes[index].map(({entry})=>normalize(entry.visualType)));
  const required = Math.min(groupedScenes[index].length,Number(diversity.minimumDistinctVisualTypesPerImageStepPreferred ?? 3));
  if (types.size < required) throw new Error(`Bildschritt ${index+1}: zu wenig visuelle Vielfalt (${types.size}/${required}).`);
}

const flattened = groupedScenes.flat().map(({scene}) => scene.id);
const expectedOrder = scenes.map((scene) => scene.id);
if (flattened.join('|') !== expectedOrder.join('|')) throw new Error('Die fünf Bildschritte müssen zusammenhängend und in Szenenreihenfolge angeordnet sein.');
const sizes = groupedScenes.map((group) => group.length);
if (Math.max(...sizes)-Math.min(...sizes)>1) throw new Error(`Die ${stepCount} Bildschritte müssen möglichst gleichmäßig verteilt sein. Aktuell: ${sizes.join(', ')}.`);
if (visualTypes.size < Number(diversity.minimumDistinctVisualTypesPerVideo ?? 5)) throw new Error(`Mindestens ${diversity.minimumDistinctVisualTypesPerVideo ?? 5} unterschiedliche Visual-Typen erforderlich.`);
for (const [motif,count] of motifCounts) if (count > Number(diversity.samePrimaryMotifMaxPerVideo ?? 3)) throw new Error(`Primärmotiv „${motif}“ kommt ${count}-mal vor; zu häufig.`);
if (handOnObjectCount > Number(diversity.handOnObjectPrimaryMotifMaxPerVideo ?? 3)) throw new Error(`Hand-auf-Gegenstand-Motiv kommt ${handOnObjectCount}-mal vor; zu häufig.`);

const lines = [];
lines.push('GOOGLE FLOW MASTER PROMPT — IMAGE ONLY');
lines.push('======================================');
lines.push('');
lines.push(`Video: ${plan.title ?? plan.slug}`);
lines.push(`Format: ${plan.width}×${plan.height}, 16:9`);
lines.push('Active visual world: Technical Editorial Explainer 2.5D');
lines.push('Legacy internal style id: Scientific Scene Explainer v1 — compatibility only, old visual execution retired.');
lines.push(`Final Flow collection: ${flowPlan.finalCollectionName}`);
lines.push('');
lines.push(STYLE_LOCK);
lines.push('');
lines.push('BINDING WORKFLOW');
lines.push('----------------');
lines.push('1. First create ONLY the three thumbnail candidates.');
lines.push('2. Then STOP and wait for the explicit user selection. Do not create scene images yet.');
lines.push('3. Keep the selected cover as 00-thumbnail-final and delete/remove the TWO rejected covers from the final Flow collection.');
lines.push('4. Use the selected thumbnail only as a quality and illustration-language reference, never as a fixed palette, layout, perspective or background template.');
lines.push(`5. After the cover selection, create all scene images in exactly ${stepCount} image steps.`);
lines.push('6. Within each step generate images strictly one by one, inspect, choose the best, rename correctly and save. Do not keep rejected variants in the final collection.');
lines.push('7. KEINE WEITEREN STOPPS ODER RÜCKFRAGEN after the cover selection: automatically complete image steps 1 through 5.');
lines.push('8. After step 5, gather all final assets into exactly ONE final Google Flow collection/folder.');
lines.push('9. Remove failed attempts, intermediate versions, duplicates, rejected variants and the two unselected covers before completion.');
lines.push('10. Final collection contains ONLY 00-thumbnail-final plus correctly named final scene images.');
lines.push('11. Report completion only after cleanup.');
lines.push('12. VISUELLE VIELFALT IST PFLICHT: vary composition, scene type and perspective while NEVER leaving the STYLE LOCK.');
lines.push('13. Normal scenes should usually have 0–2 short German labels; technical diagrams may use a few more when essential. No large generated scene headline.');
lines.push('14. If a head is visible, show complete natural stylized facial features. No blank or faceless visible heads.');
lines.push('15. Exactly one final static 16:9 image per beat.');
lines.push('16. No AI video clips, no image-to-video and no animation.');
lines.push('17. Visible image text only in German. Prompt instructions in English.');
lines.push('');
lines.push('THUMBNAIL — PHASE 1');
lines.push('-------------------');
lines.push(STYLE_LOCK);
lines.push('');
lines.push(read(thumbnailFile));
lines.push('');
lines.push('STOP AFTER THE THREE THUMBNAILS. WAIT FOR USER SELECTION.');
lines.push('After selection: selected cover = 00-thumbnail-final; remove the other two covers; then continue through all five image steps without another question.');
lines.push('');
lines.push(`SCENE IMAGES — PHASE 2 · EXACTLY ${stepCount} IMAGE STEPS · NO INTERMEDIATE STOPS`);
lines.push('--------------------------------------------------------------------------');

for (let stepIndex=0;stepIndex<groupedScenes.length;stepIndex+=1) {
  const stepNumber = stepIndex + 1;
  const group = groupedScenes[stepIndex];
  const first = group[0]?.scene.id;
  const last = group.at(-1)?.scene.id;
  lines.push('');
  lines.push(`IMAGE STEP ${stepNumber}/${stepCount} · ${first} TO ${last}`);
  lines.push('='.repeat(52));
  lines.push(`Create only the ${group.length} images in this step. Keep their scene types visibly different while preserving the exact same STYLE LOCK.`);

  for (const {scene,entry} of group) {
    const promptFile = path.join(paths.promptDir, `${scene.id}.txt`);
    lines.push('');
    lines.push(`${scene.id.toUpperCase()} · OUTPUT=IMAGE · VISUAL=${entry.visualType} · MOTIF=${entry.primaryMotif}`);
    lines.push('='.repeat(Math.min(80,scene.id.length+40)));
    lines.push(STYLE_LOCK);
    lines.push('');
    lines.push(read(promptFile));
    lines.push('');
    lines.push(`Create exactly one final static image for ${scene.id}. The STYLE LOCK has priority over any conflicting style wording. After selection rename it immediately to ${scene.id}-final. No animation, no video clip, no large headline, no faceless visible heads.`);
  }

  lines.push('');
  if (stepNumber < stepCount) lines.push(`IMAGE STEP ${stepNumber} COMPLETE → CONTINUE DIRECTLY WITH IMAGE STEP ${stepNumber+1}, NO STOP.`);
  else lines.push(`IMAGE STEP ${stepNumber} COMPLETE. Do NOT report completion yet; clean the final collection first.`);
}

lines.push('');
lines.push('PHASE 3 — FINAL ASSET CLEANUP');
lines.push('-----------------------------');
lines.push(`1. Use exactly one final Google Flow collection/folder named “${flowPlan.finalCollectionName}”.`);
lines.push('2. Move/collect 00-thumbnail-final and all final scene images there.');
lines.push('3. Remove both rejected covers, intermediate versions, failed attempts, duplicates and rejected variants.');
lines.push('4. Verify correct scene order and -final names.');
lines.push('5. Report completion only when the collection contains final assets only.');

fs.writeFileSync(paths.flowMaster, `${lines.join('\n')}\n`);
console.log(`✓ Google-Flow-Masterprompt gebaut: ${paths.flowMaster}`);
console.log(`  ${scenes.length} statische Bilder · ${visualTypes.size} Visual-Typen · ${stepCount} Schritte ohne Zwischenstopps · 0 Clips.`);
console.log('  Bildwelt: Technical Editorial Explainer 2.5D · Style-Lock in jedem Prompt.');
console.log(`  Finale Flow-Sammlung: ${flowPlan.finalCollectionName}`);
console.log(`  Verteilung: ${sizes.join(' / ')} Bilder.`);
