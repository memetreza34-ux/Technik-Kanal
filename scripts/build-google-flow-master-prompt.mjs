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

if (!fs.existsSync(paths.scenePlan)) throw new Error('scene-plan.json fehlt.');
if (!fs.existsSync(paths.flowPlan)) throw new Error('flow-plan.json fehlt.');
const thumbnailFile = path.join(paths.promptDir, '00-thumbnail.txt');
if (!fs.existsSync(thumbnailFile)) throw new Error('00-thumbnail.txt fehlt.');

const plan = readJson(paths.scenePlan);
const flowPlan = readJson(paths.flowPlan);
const scenes = Array.isArray(plan.scenes) ? plan.scenes : [];
const flowScenes = Array.isArray(flowPlan.scenes) ? flowPlan.scenes : [];
const stepCount = Number(config.visuals?.flow?.imageProductionSteps ?? 5);
if (!scenes.length) throw new Error('Szenenplan enthält keine Beats.');
if (flowPlan.imageOnly !== true) throw new Error('flow-plan.json muss imageOnly=true setzen.');
if (flowPlan.imageProductionSteps !== stepCount) throw new Error(`flow-plan.json muss imageProductionSteps=${stepCount} setzen.`);
if (flowScenes.length !== scenes.length) throw new Error(`flow-plan.json muss ${scenes.length} Beat-Einträge enthalten.`);

const byId = new Map(flowScenes.map((entry) => [entry.id, entry]));
const groupedScenes = Array.from({length: stepCount}, () => []);
for (const scene of scenes) {
  const entry = byId.get(scene.id);
  if (!entry) throw new Error(`Flow-Plan fehlt für ${scene.id}.`);
  if (entry.output !== 'image') throw new Error(`${scene.id}: Nur output=image ist erlaubt. KI-Videoclips sind deaktiviert.`);
  if (entry.clipSeconds != null || String(entry.motionPrompt ?? '').trim() || String(entry.videoDir ?? '').trim()) {
    throw new Error(`${scene.id}: Video-/Motion-Felder sind im Bild-Workflow nicht erlaubt.`);
  }
  const imageStep = Number(entry.imageStep);
  if (!Number.isInteger(imageStep) || imageStep < 1 || imageStep > stepCount) {
    throw new Error(`${scene.id}: imageStep muss eine Ganzzahl von 1 bis ${stepCount} sein.`);
  }
  groupedScenes[imageStep - 1].push(scene);
  const promptFile = path.join(paths.promptDir, `${scene.id}.txt`);
  if (!fs.existsSync(promptFile)) throw new Error(`${scene.id}: Einzelprompt fehlt.`);
}

for (let index = 0; index < groupedScenes.length; index += 1) {
  if (!groupedScenes[index].length) throw new Error(`Bildschritt ${index + 1} enthält keine Bilder.`);
}

const flattened = groupedScenes.flat().map((scene) => scene.id);
const expectedOrder = scenes.map((scene) => scene.id);
if (flattened.join('|') !== expectedOrder.join('|')) {
  throw new Error('Die fünf Bildschritte müssen zusammenhängend und in derselben Reihenfolge wie der Szenenplan angeordnet sein.');
}

const sizes = groupedScenes.map((group) => group.length);
if (Math.max(...sizes) - Math.min(...sizes) > 1) {
  throw new Error(`Die ${stepCount} Bildschritte müssen möglichst gleichmäßig verteilt sein. Aktuell: ${sizes.join(', ')}.`);
}

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
lines.push('3. Den gewählten Thumbnail-Kandidaten als lockere visuelle Referenz für Qualitätsniveau und Illustrationssprache verwenden. Szenen dürfen trotzdem andere Orte, Farben und Kompositionen haben.');
lines.push(`4. Nach der Cover-Auswahl die Szenenbilder in genau ${stepCount} Bildschritten erzeugen.`);
lines.push('5. Innerhalb jedes Bildschritts die Bilder streng einzeln nacheinander erzeugen, prüfen, auswählen und speichern. Niemals mehrere Beats gleichzeitig erzeugen.');
lines.push('6. Nach jedem vollständig abgeschlossenen Bildschritt STOPPEN und auf die ausdrückliche Freigabe des Nutzers warten.');
lines.push('7. Für jeden Beat genau EIN finales statisches 16:9-Bild erzeugen und auswählen.');
lines.push('8. KEINE KI-Videoclips, KEINE Image-to-Video-Ausgabe und KEINE Animationen erzeugen.');
lines.push('9. Wenn ein Vorgang Bewegung bräuchte, ihn als verständliches Standbild oder als zusätzlichen statischen Beat erklären.');
lines.push('10. Sichtbarer Text ausschließlich Deutsch. Keine Logos, Wasserzeichen oder zufällige KI-Schrift.');
lines.push('');
lines.push('THUMBNAIL – PHASE 1');
lines.push('-------------------');
lines.push(read(thumbnailFile));
lines.push('');
lines.push('STOPP NACH DEN DREI THUMBNAILS. AUF AUSWAHL DES NUTZERS WARTEN.');
lines.push('');
lines.push(`SZENENBILDER – PHASE 2 · GENAU ${stepCount} BILDSCHRITTE`);
lines.push('------------------------------------------------');

for (let stepIndex = 0; stepIndex < groupedScenes.length; stepIndex += 1) {
  const stepNumber = stepIndex + 1;
  const group = groupedScenes[stepIndex];
  const first = group[0]?.id;
  const last = group.at(-1)?.id;
  lines.push('');
  lines.push(`BILDSCHRITT ${stepNumber}/${stepCount} · ${first} BIS ${last}`);
  lines.push('='.repeat(52));
  lines.push(`Erzeuge jetzt ausschließlich die ${group.length} Bilder dieses Bildschritts. Jedes Bild einzeln fertigstellen, auswählen und speichern, bevor das nächste beginnt.`);

  for (const scene of group) {
    const promptFile = path.join(paths.promptDir, `${scene.id}.txt`);
    lines.push('');
    lines.push(`${scene.id.toUpperCase()} · OUTPUT=IMAGE`);
    lines.push('='.repeat(Math.min(80, scene.id.length + 16)));
    lines.push(read(promptFile));
    lines.push('');
    lines.push(`Nur ein finales statisches Bild für ${scene.id} erzeugen. Keine Animation und keinen Videoclip erzeugen.`);
  }

  lines.push('');
  if (stepNumber < stepCount) {
    lines.push(`STOPP NACH BILDSCHRITT ${stepNumber}. Melde die fertigen Bilder und warte auf die ausdrückliche Freigabe des Nutzers für Bildschritt ${stepNumber + 1}.`);
  } else {
    lines.push(`BILDSCHRITT ${stepNumber} ABGESCHLOSSEN. Die Szenenbild-Produktion ist vollständig.`);
  }
}

fs.writeFileSync(paths.flowMaster, `${lines.join('\n')}\n`);
console.log(`✓ Google-Flow-Masterprompt gebaut: ${paths.flowMaster}`);
console.log(`  ${scenes.length} statische Bild-Beats in ${stepCount} Bildschritten, 0 KI-Videoclips.`);
console.log(`  Verteilung: ${sizes.join(' / ')} Bilder.`);
