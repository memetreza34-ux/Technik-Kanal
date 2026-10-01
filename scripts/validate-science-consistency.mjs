#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {loadElectricalConfig} from './lib/load-electrical-config.mjs';

const root = process.cwd();
const config = loadElectricalConfig();
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
const claude = fs.readFileSync(path.join(root, 'channels/science/CLAUDE.md'), 'utf8');
const imageWorld = fs.readFileSync(path.join(root, 'channels/science/gehirn/BILDWELT.md'), 'utf8');
const voice = JSON.parse(fs.readFileSync(path.join(root, 'channels/science/engine/config/voice-v1.json'), 'utf8'));
const scienceReel = fs.readFileSync(path.join(root, 'channels/science/src/ScienceReel.tsx'), 'utf8');
const template = fs.readFileSync(path.join(root, 'scripts/lib/create-electrical-scene-plan-template.mjs'), 'utf8');
const processVoice = fs.readFileSync(path.join(root, 'scripts/process_voiceover.mjs'), 'utf8');
const renderQa = fs.readFileSync(path.join(root, 'scripts/qa_science_render.mjs'), 'utf8');
const errors = [];

if (config.version !== 'science-v1') errors.push('Aktive Konfiguration muss science-v1 sein.');
if (config.voice.speed !== 1.1 || voice.speed !== 1.1) errors.push('Voice-Geschwindigkeit muss exakt 1.10 sein.');
if (voice.processing?.loudness?.targetIntegratedLufs !== -16 || voice.processing?.loudness?.targetTruePeakDb !== -1.5) errors.push('Voice-Konfiguration muss -16 LUFS und -1.5 dBTP dokumentieren.');
if (!/1[,.]10[×x]/i.test(claude)) errors.push('CLAUDE.md enthält die verbindliche 1,10×-Regel nicht.');
if (!claude.includes('whisper.cpp')) errors.push('CLAUDE.md enthält die lokale Transkriptionsregel nicht.');
if (!imageWorld.includes('Scientific Scene Explainer')) errors.push('BILDWELT.md enthält die aktive Bildwelt nicht.');
if (!imageWorld.includes('so wenig Information wie möglich, so viel wie nötig')) errors.push('BILDWELT.md enthält die Informationsdichte-Regel nicht.');

for (const command of ['science:new', 'science:preflight', 'science:ready', 'science:prepare', 'science:render', 'science:finish', 'science:system-test']) {
  if (!pkg.scripts?.[command]) errors.push(`package.json fehlt Befehl ${command}.`);
}
if (Object.keys(pkg.scripts ?? {}).some((name) => name.startsWith('electrical:') || name.startsWith('elektro:'))) errors.push('package.json enthält alte Elektro-Befehlsaliase.');
if (!pkg.dependencies?.sharp) errors.push('sharp fehlt für Bildanalyse.');
if (!pkg.dependencies?.zod) errors.push('zod fehlt für Datenverträge.');
if (!pkg.devDependencies?.vitest) errors.push('vitest fehlt für Systemtests.');

if (config.captions.highlightColor !== null || config.captions.backgroundBox !== false) errors.push('Untertitel müssen weiß ohne Hervorhebung und ohne Box bleiben.');
if (config.captions.animated !== false) errors.push('Untertitel dürfen nicht animiert werden.');
if (config.visuals.policyVersion !== 'science-static-v1') errors.push('Visual-Policy muss science-static-v1 sein.');
if (config.visuals.productionMode !== 'image-first-static') errors.push('Produktionsmodus muss image-first-static sein.');
if (config.visuals.generatedImageTextPolicy !== 'controlled-german-only') errors.push('Generierter Bildtext muss kontrolliert und ausschließlich deutsch sein.');
if (config.visuals.visibleImageLanguage !== 'de') errors.push('Sichtbare Bildsprache muss Deutsch sein.');
if (config.visuals.animationAllowed !== false) errors.push('Animationen müssen global deaktiviert sein.');
if (config.visuals.cameraMotionAllowed !== false) errors.push('Kamerabewegung muss global deaktiviert sein.');
if (config.visuals.transitionPolicy !== 'hard-cut') errors.push('Szenenübergänge müssen harte Schnitte sein.');
if (config.visuals.brandVisualStyleDefined !== true) errors.push('Scientific Scene Explainer muss als aktive Bildwelt markiert sein.');
if (config.visuals.styleId !== 'scientific-scene-explainer-v1') errors.push('Aktive styleId muss scientific-scene-explainer-v1 sein.');
if (config.visuals.fullFrameContextPreferredWhenUseful !== true) errors.push('Volle Umgebungen müssen erlaubt und bei Nutzen bevorzugt sein.');
if (config.visuals.fixedBackgroundForbidden !== true) errors.push('Ein fixer Hintergrund für alle Szenen darf nicht erzwungen werden.');
if (config.visuals.humanFiguresAllowedWhenExplanatory !== true) errors.push('Erklärende stilisierte Menschen müssen erlaubt sein.');
if (config.visuals.informationDensityPolicy !== 'minimum-necessary') errors.push('Informationsdichte muss minimum-necessary sein.');
if (config.script.hook.firstFrameAnimationAllowed !== false) errors.push('Hook darf keine Animation erlauben.');
if (config.visuals.beats.max > 16) errors.push('Science-Reels dürfen höchstens 16 geplante visuelle Beats verwenden.');
if (config.visuals.coverUsesFirstScene !== true || config.visuals.separateThumbnailForbidden !== true) errors.push('Bild 01 muss Coverquelle sein; separates Thumbnail-System ist nicht erlaubt.');
if (!config.safety?.riskyPhrases?.length) errors.push('Fachübergreifende Safety-Regeln fehlen.');
if (config.electricalSafety) errors.push('Veraltete electricalSafety-Struktur darf nicht mehr existieren.');

if (!scienceReel.includes("./generated/science-runtime.json")) errors.push('ScienceReel muss science-runtime.json laden.');
if (scienceReel.includes("./generated/reel-runtime.json")) errors.push('ScienceReel darf nicht an einer alten Runtime hängen.');
if (!template.includes("runtimeFile:'science-runtime.json'")) errors.push('Neue Science-Scaffolds müssen science-runtime.json verwenden.');
if (!template.includes("referenceGroup:'scientific-scene-explainer'")) errors.push('Scene-Template muss die aktive Bildwelt referenzieren.');
if (!processVoice.includes('loudnorm=I=')) errors.push('Voice-Verarbeitung enthält keine Loudness-Normalisierung.');
if (!renderQa.includes('blackdetect') || !renderQa.includes('silencedetect')) errors.push('Render-QA muss Schwarzbild- und Randstille-Prüfung enthalten.');
if (!renderQa.includes('freezeDetectionEnabled: false')) errors.push('Science Static muss Freeze Detection ausdrücklich deaktivieren.');

if (errors.length) {
  console.error('Konsistenzprüfung fehlgeschlagen:');
  errors.forEach((error)=>console.error(`- ${error}`));
  process.exit(1);
}
console.log('✓ Science-v1, statische Pipeline, Audio und Scientific Scene Explainer sind konsistent.');
