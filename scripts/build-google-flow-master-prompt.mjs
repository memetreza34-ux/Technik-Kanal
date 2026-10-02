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
if (!scenes.length) throw new Error('Szenenplan enthält keine Beats.');
if (flowScenes.length !== scenes.length) throw new Error(`flow-plan.json muss ${scenes.length} Beat-Einträge enthalten.`);

const byId = new Map(flowScenes.map((entry) => [entry.id, entry]));
const videoEntries = [];
for (const scene of scenes) {
  const entry = byId.get(scene.id);
  if (!entry) throw new Error(`Flow-Plan fehlt für ${scene.id}.`);
  if (!['image', 'image-to-video'].includes(entry.output)) throw new Error(`${scene.id}: output muss image oder image-to-video sein.`);
  const promptFile = path.join(paths.promptDir, `${scene.id}.txt`);
  if (!fs.existsSync(promptFile)) throw new Error(`${scene.id}: Einzelprompt fehlt.`);
  if (entry.output === 'image-to-video') {
    if (!String(entry.motionPrompt ?? '').trim()) throw new Error(`${scene.id}: motionPrompt fehlt für image-to-video.`);
    const seconds = Number(entry.clipSeconds ?? 0);
    if (!Number.isFinite(seconds) || seconds <= 0 || seconds > config.visuals.flow.clipSecondsMax) {
      throw new Error(`${scene.id}: clipSeconds muss 1–${config.visuals.flow.clipSecondsMax} sein.`);
    }
    videoEntries.push(entry);
  }
}

const ratio = videoEntries.length / scenes.length;
const range = config.visuals.flow.targetVideoRatio;
const ratioWarning = ratio < range.min || ratio > range.max
  ? `WARNUNG: KI-Video-Anteil ${(ratio * 100).toFixed(0)} % liegt außerhalb des Richtwerts ${(range.min * 100).toFixed(0)}–${(range.max * 100).toFixed(0)} %. Inhaltliche Klarheit ist wichtiger als die Quote.`
  : `KI-Video-Anteil: ${(ratio * 100).toFixed(0)} % (${videoEntries.length}/${scenes.length}), im Richtwert.`;

const lines = [];
lines.push('GOOGLE FLOW MASTER PROMPT');
lines.push('=========================');
lines.push('');
lines.push(`Video: ${plan.title ?? plan.slug}`);
lines.push(`Format: ${plan.width}×${plan.height}, 16:9`);
lines.push(`Bildwelt: Scientific Scene Explainer v1`);
lines.push(ratioWarning);
lines.push('');
lines.push('VERBINDLICHER ABLAUF');
lines.push('---------------------');
lines.push('1. Zuerst NUR die drei Thumbnail-/Cover-Kandidaten erzeugen.');
lines.push('2. Danach STOPPEN und auf die ausdrückliche Auswahl des Nutzers warten. Noch keine Szenen erzeugen.');
lines.push('3. Den gewählten Thumbnail-Kandidaten anschließend als visuelle Referenz für Qualitätsniveau und Illustrationssprache verwenden, ohne alle Szenen gleich aussehen zu lassen.');
lines.push('4. Danach Beat für Beat streng nacheinander arbeiten: 01 fertigstellen, dann 02, dann 03 usw. Niemals alle Assets gleichzeitig erzeugen.');
lines.push('5. Für JEDEN Beat zuerst das finale 16:9-Ausgangsbild erzeugen und auswählen.');
lines.push('6. Nur bei output=image-to-video genau dieses ausgewählte Ausgangsbild in Google Flow animieren.');
lines.push(`7. KI-Clips maximal ${config.visuals.flow.clipSecondsMax} Sekunden, kein gesprochenes Dialog-Audio, keine Lippen-Synchronisation, keine neu erfundenen Texte während der Animation.`);
lines.push('8. Sichtbarer Text ausschließlich Deutsch. Keine Logos oder Wasserzeichen.');
lines.push('9. Statische Beats bleiben statisch. Nicht aus Gewohnheit alles animieren.');
lines.push('10. Nach jedem fertigen Beat sauber speichern/benennen, erst dann zum nächsten Beat wechseln.');
lines.push('');
lines.push('THUMBNAIL – PHASE 1');
lines.push('-------------------');
lines.push(read(thumbnailFile));
lines.push('');
lines.push('STOPP NACH DEN DREI THUMBNAILS. AUF AUSWAHL DES NUTZERS WARTEN.');
lines.push('');
lines.push('SZENEN – PHASE 2');
lines.push('----------------');

for (const scene of scenes) {
  const entry = byId.get(scene.id);
  const promptFile = path.join(paths.promptDir, `${scene.id}.txt`);
  lines.push('');
  lines.push(`${scene.id.toUpperCase()} · OUTPUT=${entry.output}`);
  lines.push('='.repeat(Math.min(80, scene.id.length + entry.output.length + 11)));
  lines.push('AUSGANGSBILD-PROMPT:');
  lines.push(read(promptFile));
  lines.push('');
  if (entry.output === 'image-to-video') {
    lines.push(`IMAGE-TO-VIDEO · ${entry.clipSeconds}s:`);
    lines.push(String(entry.motionPrompt).trim());
    lines.push('Verwende exakt das zuvor ausgewählte Ausgangsbild als Startbild. Keine neue Komposition erfinden. Kein gesprochenes Dialog-Audio. Keine neuen Texte erzeugen.');
  } else {
    lines.push('KEINE ANIMATION: Dieses finale Ausgangsbild bleibt der verwendete Szenen-Asset.');
  }
}

fs.writeFileSync(paths.flowMaster, `${lines.join('\n')}\n`);
console.log(`✓ Google-Flow-Masterprompt gebaut: ${paths.flowMaster}`);
console.log(`  ${videoEntries.length} KI-Video-Beats / ${scenes.length} Beats.`);
