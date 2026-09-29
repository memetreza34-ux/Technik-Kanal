#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {loadElectricalConfig} from './lib/load-electrical-config.mjs';

const root = process.cwd();
const config = loadElectricalConfig();
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
const claude = fs.readFileSync(path.join(root, 'channels/elektrotechnik/CLAUDE.md'), 'utf8');
const voice = JSON.parse(fs.readFileSync(path.join(root, 'channels/elektrotechnik/engine/config/voice-v1.json'), 'utf8'));
const scienceReel = fs.readFileSync(path.join(root, 'channels/elektrotechnik/src/ScienceReel.tsx'), 'utf8');
const template = fs.readFileSync(path.join(root, 'scripts/lib/create-electrical-scene-plan-template.mjs'), 'utf8');
const processVoice = fs.readFileSync(path.join(root, 'scripts/process_voiceover.mjs'), 'utf8');
const renderQa = fs.readFileSync(path.join(root, 'scripts/qa_electrical_render.mjs'), 'utf8');
const errors = [];

if (config.version !== 'science-v1') errors.push('Aktive Konfiguration muss science-v1 sein.');
if (config.voice.speed !== 1.1 || voice.speed !== 1.1) errors.push('Voice-Geschwindigkeit muss in beiden Konfigurationen exakt 1.10 sein.');
if (voice.processing?.loudness?.targetIntegratedLufs !== -16 || voice.processing?.loudness?.targetTruePeakDb !== -1.5) errors.push('Voice-Konfiguration muss -16 LUFS und -1.5 dBTP als Verarbeitungsziel dokumentieren.');
if (!/1[,.]10[×x]/i.test(claude)) errors.push('CLAUDE.md enthält die verbindliche 1,10×-Regel nicht.');
if (!claude.includes('whisper.cpp')) errors.push('CLAUDE.md enthält die lokale Transkriptionsregel nicht.');

for (const command of ['science:new', 'science:preflight', 'science:ready', 'science:prepare', 'science:render', 'science:finish', 'science:system-test']) {
  if (!pkg.scripts?.[command]) errors.push(`package.json fehlt Befehl ${command}.`);
}

if (!pkg.dependencies?.sharp) errors.push('sharp fehlt für Bildanalyse.');
if (!pkg.dependencies?.zod) errors.push('zod fehlt für Datenverträge.');
if (!pkg.devDependencies?.vitest) errors.push('vitest fehlt für Systemtests.');

if (config.captions.highlightColor !== null || config.captions.backgroundBox !== false) errors.push('Untertitel müssen weiß ohne Hervorhebung und ohne Box bleiben.');
if (config.captions.animated !== false) errors.push('Untertitel dürfen nicht animiert werden.');
if (config.visuals.policyVersion !== 'science-static-v1') errors.push('Aktuelle Visual-Policy muss science-static-v1 sein.');
if (config.visuals.productionMode !== 'image-first-static') errors.push('Produktionsmodus muss image-first-static sein.');
if (config.visuals.generatedImageTextPolicy !== 'none') errors.push('Generierte Bilder müssen textfrei bleiben.');
if (config.visuals.animationAllowed !== false) errors.push('Animationen müssen global deaktiviert sein.');
if (config.visuals.cameraMotionAllowed !== false) errors.push('Kamerabewegung muss global deaktiviert sein.');
if (config.visuals.transitionPolicy !== 'hard-cut') errors.push('Szenenübergänge müssen standardmäßig harte Schnitte sein.');
if (config.visuals.mechanismAnimations.maximum !== 0) errors.push('Mechanismus-Animationen müssen auf 0 begrenzt sein.');
if (config.script.hook.firstFrameAnimationAllowed !== false) errors.push('Hook darf keine Animation erlauben.');
if (config.visuals.beats.max > 16) errors.push('Science-Reels dürfen höchstens 16 geplante visuelle Beats verwenden.');
if (config.visuals.coverUsesFirstScene !== true || config.visuals.separateThumbnailForbidden !== true) errors.push('Bild 01 muss Coverquelle sein; separates Thumbnail-System ist nicht erlaubt.');

if (!scienceReel.includes("./generated/science-runtime.json")) errors.push('ScienceReel muss die eigene science-runtime.json laden.');
if (scienceReel.includes("./generated/reel-runtime.json")) errors.push('ScienceReel darf nicht an der Legacy-Runtime hängen.');
if (!template.includes("runtimeFile:'science-runtime.json'")) errors.push('Neue Science-Scaffolds müssen science-runtime.json verwenden.');
if (!processVoice.includes('loudnorm=I=')) errors.push('Voice-Verarbeitung enthält keine Loudness-Normalisierung.');
if (!renderQa.includes('blackdetect') || !renderQa.includes('silencedetect')) errors.push('Render-QA muss Schwarzbild- und Randstille-Prüfung enthalten.');
if (!renderQa.includes('freezeDetectionEnabled: false')) errors.push('Science Static muss Freeze Detection ausdrücklich als Fehlalarm deaktivieren.');

if (errors.length) {
  console.error('Konsistenzprüfung fehlgeschlagen:');
  errors.forEach((error)=>console.error(`- ${error}`));
  process.exit(1);
}
console.log('✓ Science-v1, getrennte Runtime, statische Bildwelt, harte Schnitte, Audio-Regeln und QA sind konsistent.');
