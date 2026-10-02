#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {loadElectricalConfig} from './lib/load-electrical-config.mjs';

const root = process.cwd();
const config = loadElectricalConfig();
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
const claude = fs.readFileSync(path.join(root, 'channels/science/CLAUDE.md'), 'utf8');
const imageWorld = fs.readFileSync(path.join(root, 'channels/science/gehirn/BILDWELT.md'), 'utf8');
const channel = fs.readFileSync(path.join(root, 'channels/science/gehirn/KANAL.md'), 'utf8');
const longform = fs.readFileSync(path.join(root, 'channels/science/gehirn/LONGFORM.md'), 'utf8');
const voice = JSON.parse(fs.readFileSync(path.join(root, 'channels/science/engine/config/voice-v1.json'), 'utf8'));
const scienceReel = fs.readFileSync(path.join(root, 'channels/science/src/ScienceReel.tsx'), 'utf8');
const template = fs.readFileSync(path.join(root, 'scripts/lib/create-electrical-scene-plan-template.mjs'), 'utf8');
const processVoice = fs.readFileSync(path.join(root, 'scripts/process_voiceover.mjs'), 'utf8');
const renderQa = fs.readFileSync(path.join(root, 'scripts/qa_science_render.mjs'), 'utf8');
const errors = [];

if (config.version !== 'science-v1') errors.push('Aktive Konfiguration muss science-v1 sein.');
if (config.productionProfile !== 'youtube-2min-v1') errors.push('Aktives Produktionsprofil muss youtube-2min-v1 sein.');
if (config.format?.width !== 1920 || config.format?.height !== 1080 || config.format?.aspectRatio !== '16:9') errors.push('Aktives Videoformat muss 1920×1080 / 16:9 sein.');
if (config.format?.durationSeconds?.ideal !== 120) errors.push('Ideale Videolänge muss 120 Sekunden sein.');
if (config.script?.words?.ideal !== 300) errors.push('Ideale Skriptlänge muss 300 Wörter sein.');
if (JSON.stringify(config.script?.narrativeStructure) !== JSON.stringify(['hook','context','foundation','mechanism','deepening','payoff'])) errors.push('Longform-Dramaturgie ist nicht korrekt konfiguriert.');
if (config.visuals?.beats?.min !== 12 || config.visuals?.beats?.ideal !== 20 || config.visuals?.beats?.max !== 28) errors.push('Visuelle Beats müssen 12/20/28 konfiguriert sein.');
if (config.visuals?.coverUsesFirstScene !== false || config.visuals?.separateThumbnailForbidden !== false) errors.push('Longform muss ein separates Thumbnail erlauben.');
if (config.visuals?.thumbnail?.required !== true || config.visuals?.thumbnail?.candidateCount !== 3) errors.push('Drei separate Thumbnail-Kandidaten müssen vorgeschrieben sein.');
if (!/youtube-2min-v1/i.test(longform) || !/Hook.*Kontext.*Grundlage.*Mechanismus.*Vertiefung.*Payoff/is.test(longform)) errors.push('LONGFORM.md dokumentiert Profil oder Dramaturgie nicht.');

if (config.topicScope?.identity !== 'alltagswissenschaft-und-technik') errors.push('Themenprofil muss Alltagswissenschaft und Technik sein.');
if (config.topicScope?.audience !== 'jugendliche-und-junge-erwachsene') errors.push('Zielgruppe muss Jugendliche und junge Erwachsene sein.');
if (config.topicScope?.biologyAllowed !== false || config.topicScope?.medicineAllowed !== false) errors.push('Biologie und Medizin duerfen nicht Teil des regulaeren Themenprofils sein.');
if (config.topicScope?.highlyAbstractScienceAllowed !== false) errors.push('Stark abstrakte Wissenschaftsthemen duerfen nicht regulaer freigegeben sein.');
if (!config.topicScope?.preferredDomains?.includes('alltagsphysik')) errors.push('Alltagsphysik fehlt im bevorzugten Themenprofil.');
if (!config.topicScope?.preferredDomains?.includes('elektrotechnik-elektronik')) errors.push('Elektrotechnik/Elektronik fehlt im bevorzugten Themenprofil.');
if (!config.topicScope?.excludedDomains?.includes('biologie')) errors.push('Biologie fehlt in excludedDomains.');
if (!/Alltagswissenschaft und Technik/i.test(channel)) errors.push('KANAL.md dokumentiert den fokussierten Themenrahmen nicht.');

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
if (!config.safety?.riskyPhrases?.length) errors.push('Fachübergreifende Safety-Regeln fehlen.');
if (config.electricalSafety) errors.push('Veraltete electricalSafety-Struktur darf nicht mehr existieren.');

if (!scienceReel.includes("./generated/science-runtime.json")) errors.push('ScienceReel muss science-runtime.json laden.');
if (scienceReel.includes("./generated/reel-runtime.json")) errors.push('ScienceReel darf nicht an einer alten Runtime hängen.');
if (!template.includes("runtimeFile:'science-runtime.json'")) errors.push('Neue Science-Scaffolds müssen science-runtime.json verwenden.');
if (!template.includes("productionProfile:'youtube-2min-v1'")) errors.push('Scene-Template muss das 2-Minuten-Profil referenzieren.');
if (!template.includes("width:1920") || !template.includes("height:1080")) errors.push('Scene-Template muss 1920×1080 erzeugen.');
if (!template.includes("referenceGroup:'scientific-scene-explainer'")) errors.push('Scene-Template muss die aktive Bildwelt referenzieren.');
if (!processVoice.includes('loudnorm=I=')) errors.push('Voice-Verarbeitung enthält keine Loudness-Normalisierung.');
if (!renderQa.includes('blackdetect') || !renderQa.includes('silencedetect')) errors.push('Render-QA muss Schwarzbild- und Randstille-Prüfung enthalten.');
if (!renderQa.includes('freezeDetectionEnabled: false')) errors.push('Science Static muss Freeze Detection ausdrücklich deaktivieren.');

if (errors.length) {
  console.error('Konsistenzprüfung fehlgeschlagen:');
  errors.forEach((error)=>console.error(`- ${error}`));
  process.exit(1);
}
console.log('✓ youtube-2min-v1, Themenprofil, 16:9-Longform, Audio und Scientific Scene Explainer sind konsistent.');
