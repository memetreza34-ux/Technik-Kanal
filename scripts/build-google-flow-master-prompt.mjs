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
lines.push('GOOGLE FLOW MASTER PROMPT – NUR BILDER');
lines.push('======================================');
lines.push('');
lines.push(`Video: ${plan.title ?? plan.slug}`);
lines.push(`Format: ${plan.width}×${plan.height}, 16:9`);
lines.push('Bildwelt: Scientific Scene Explainer v1');
lines.push('');
lines.push('VERBINDLICHER ABLAUF');
lines.push('---------------------');
lines.push('1. Zuerst NUR die drei Thumbnail-Kandidaten erzeugen.');
lines.push('2. Danach STOPPEN und auf die ausdrückliche Auswahl des Nutzers warten. Noch keine Szenenbilder erzeugen.');
lines.push('3. Das gewählte Thumbnail nur als Referenz für Qualitätsniveau und Illustrationssprache verwenden. Es ist KEINE Farb-, Layout-, Perspektiv- oder Hintergrundvorlage für alle Szenen.');
lines.push(`4. Nach der Cover-Auswahl die Szenenbilder in genau ${stepCount} Bildschritten erzeugen.`);
lines.push('5. Innerhalb jedes Bildschritts Bilder streng einzeln nacheinander erzeugen, prüfen, auswählen und speichern.');
lines.push('6. NACH DER COVER-AUSWAHL KEINE WEITEREN STOPPS ODER RÜCKFRAGEN: Bildschritt 1 bis 5 automatisch vollständig nacheinander abarbeiten.');
lines.push('7. Erst nach Abschluss von Bildschritt 5 melden, dass alle Bilder fertig sind.');
lines.push('8. VISUELLE VIELFALT IST PFLICHT: nicht immer dieselbe Hand, denselben Materialblock, denselben Split-Screen oder denselben türkis/weißen Hintergrund verwenden.');
lines.push('9. Normale Szenen haben keine große generierte Überschrift; bevorzugt 0–2 kurze deutsche Labels. Große Titel gehören primär ins Thumbnail.');
lines.push('10. Bei sichtbaren Köpfen vollständige natürliche stilisierte Gesichtszüge zeigen. Keine gesichtslosen oder leeren Gesichter. Wenn kein Gesicht gebraucht wird, Kopf vollständig außerhalb des Frames lassen.');
lines.push('11. Für jeden Beat genau EIN finales statisches 16:9-Bild erzeugen.');
lines.push('12. KEINE KI-Videoclips, KEINE Image-to-Video-Ausgabe und KEINE Animationen erzeugen.');
lines.push('13. Sichtbarer Text ausschließlich Deutsch. Keine Logos, Wasserzeichen oder zufällige KI-Schrift.');
lines.push('');
lines.push('THUMBNAIL – PHASE 1');
lines.push('-------------------');
lines.push(read(thumbnailFile));
lines.push('');
lines.push('STOPP NACH DEN DREI THUMBNAILS. AUF AUSWAHL DES NUTZERS WARTEN.');
lines.push('');
lines.push(`SZENENBILDER – PHASE 2 · GENAU ${stepCount} BILDSCHRITTE · OHNE ZWISCHENSTOPPS`);
lines.push('---------------------------------------------------------------------');

for (let stepIndex=0;stepIndex<groupedScenes.length;stepIndex+=1) {
  const stepNumber = stepIndex + 1;
  const group = groupedScenes[stepIndex];
  const first = group[0]?.scene.id;
  const last = group.at(-1)?.scene.id;
  lines.push('');
  lines.push(`BILDSCHRITT ${stepNumber}/${stepCount} · ${first} BIS ${last}`);
  lines.push('='.repeat(52));
  lines.push(`Erzeuge ausschließlich die ${group.length} Bilder dieses Schritts. Die Visual-Typen in diesem Schritt müssen sichtbar unterschiedlich bleiben.`);

  for (const {scene,entry} of group) {
    const promptFile = path.join(paths.promptDir, `${scene.id}.txt`);
    lines.push('');
    lines.push(`${scene.id.toUpperCase()} · OUTPUT=IMAGE · VISUAL=${entry.visualType} · MOTIV=${entry.primaryMotif}`);
    lines.push('='.repeat(Math.min(80,scene.id.length+40)));
    lines.push(read(promptFile));
    lines.push('');
    lines.push(`Nur ein finales statisches Bild für ${scene.id}. Keine Animation, kein Videoclip, keine große Überschrift, keine gesichtslosen sichtbaren Köpfe.`);
  }

  lines.push('');
  if (stepNumber < stepCount) lines.push(`BILDSCHRITT ${stepNumber} ABGESCHLOSSEN → OHNE STOPP DIREKT MIT BILDSCHRITT ${stepNumber+1} FORTFAHREN.`);
  else lines.push(`BILDSCHRITT ${stepNumber} ABGESCHLOSSEN. Jetzt erst Gesamtabschluss melden: alle fünf Bildschritte und alle Szenenbilder sind fertig.`);
}

fs.writeFileSync(paths.flowMaster, `${lines.join('\n')}\n`);
console.log(`✓ Google-Flow-Masterprompt gebaut: ${paths.flowMaster}`);
console.log(`  ${scenes.length} statische Bilder · ${visualTypes.size} Visual-Typen · ${stepCount} Schritte ohne Zwischenstopps · 0 Clips.`);
console.log(`  Verteilung: ${sizes.join(' / ')} Bilder.`);
