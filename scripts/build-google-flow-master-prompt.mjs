#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {electricalProjectPaths} from './lib/electrical-project-structure.mjs';

const [projectArg] = process.argv.slice(2).filter((arg) => !arg.startsWith('--'));
if (!projectArg) throw new Error('Nutzung: npm run science:flow-master -- <video-ordner>');

const root = path.resolve(projectArg);
const paths = electricalProjectPaths(root);
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
if (!scenes.length) throw new Error('Szenenplan enthält keine Beats.');
if (flowPlan.imageOnly !== true) throw new Error('flow-plan.json muss imageOnly=true setzen.');
if (flowScenes.length !== scenes.length) throw new Error(`flow-plan.json muss ${scenes.length} Beat-Einträge enthalten.`);

const byId = new Map(flowScenes.map((entry) => [entry.id, entry]));
for (const scene of scenes) {
  const entry = byId.get(scene.id);
  if (!entry) throw new Error(`Flow-Plan fehlt für ${scene.id}.`);
  if (entry.output !== 'image') throw new Error(`${scene.id}: Nur output=image ist erlaubt. KI-Videoclips sind deaktiviert.`);
  if (entry.clipSeconds != null || String(entry.motionPrompt ?? '').trim() || String(entry.videoDir ?? '').trim()) {
    throw new Error(`${scene.id}: Video-/Motion-Felder sind im Bild-Workflow nicht erlaubt.`);
  }
  const promptFile = path.join(paths.promptDir, `${scene.id}.txt`);
  if (!fs.existsSync(promptFile)) throw new Error(`${scene.id}: Einzelprompt fehlt.`);
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
lines.push('4. Danach Beat für Beat streng nacheinander arbeiten: 01 vollständig fertigstellen, dann 02, dann 03 usw. Niemals mehrere Beats gleichzeitig erzeugen.');
lines.push('5. Für jeden Beat genau EIN finales statisches 16:9-Bild erzeugen und auswählen.');
lines.push('6. KEINE KI-Videoclips, KEINE Image-to-Video-Ausgabe und KEINE Animationen erzeugen.');
lines.push('7. Wenn ein Vorgang Bewegung bräuchte, ihn als verständliches Standbild oder als zusätzlichen statischen Beat erklären.');
lines.push('8. Sichtbarer Text ausschließlich Deutsch. Keine Logos, Wasserzeichen oder zufällige KI-Schrift.');
lines.push('9. Nach jedem finalen Bild sauber speichern/benennen und erst dann zum nächsten Beat wechseln.');
lines.push('');
lines.push('THUMBNAIL – PHASE 1');
lines.push('-------------------');
lines.push(read(thumbnailFile));
lines.push('');
lines.push('STOPP NACH DEN DREI THUMBNAILS. AUF AUSWAHL DES NUTZERS WARTEN.');
lines.push('');
lines.push('SZENENBILDER – PHASE 2');
lines.push('----------------------');

for (const scene of scenes) {
  const promptFile = path.join(paths.promptDir, `${scene.id}.txt`);
  lines.push('');
  lines.push(`${scene.id.toUpperCase()} · OUTPUT=IMAGE`);
  lines.push('='.repeat(Math.min(80, scene.id.length + 16)));
  lines.push(read(promptFile));
  lines.push('');
  lines.push(`Nur ein finales statisches Bild für ${scene.id} erzeugen. Keine Animation und keinen Videoclip erzeugen.`);
}

fs.writeFileSync(paths.flowMaster, `${lines.join('\n')}\n`);
console.log(`✓ Google-Flow-Masterprompt gebaut: ${paths.flowMaster}`);
console.log(`  ${scenes.length} statische Bild-Beats, 0 KI-Videoclips.`);
