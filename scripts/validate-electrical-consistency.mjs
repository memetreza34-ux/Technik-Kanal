#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {loadElectricalConfig} from './lib/load-electrical-config.mjs';

const root = process.cwd();
const config = loadElectricalConfig();
const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
const claude = fs.readFileSync(path.join(root, 'channels/elektrotechnik/CLAUDE.md'), 'utf8');
const voice = JSON.parse(fs.readFileSync(path.join(root, 'channels/elektrotechnik/engine/config/voice-v1.json'), 'utf8'));
const errors = [];

if (config.voice.speed !== 1.1 || voice.speed !== 1.1) errors.push('Voice-Geschwindigkeit muss in beiden Konfigurationen exakt 1.10 sein.');
if (!claude.includes('1.10x')) errors.push('CLAUDE.md enthält die verbindliche 1.10x-Regel nicht.');
if (!claude.includes('whisper.cpp')) errors.push('CLAUDE.md enthält die lokale Transkriptionsregel nicht.');
if (!claude.includes('electrical:preflight')) errors.push('CLAUDE.md enthält das Preproduction-Gate nicht.');
for (const command of ['electrical:new', 'electrical:preflight', 'electrical:assets', 'electrical:script-qa', 'electrical:creative-qa', 'electrical:ready', 'electrical:render', 'electrical:finish', 'electrical:system-test']) {
  if (!pkg.scripts?.[command]) errors.push(`package.json fehlt Befehl ${command}.`);
}
if (!pkg.dependencies?.sharp) errors.push('sharp fehlt für Bildanalyse.');
if (!pkg.dependencies?.zod) errors.push('zod fehlt für Datenverträge.');
if (!pkg.devDependencies?.vitest) errors.push('vitest fehlt für Systemtests.');
if (config.captions.highlightColor !== null || config.captions.backgroundBox !== false) errors.push('Untertitel müssen weiß ohne Hervorhebung und ohne Box bleiben.');
if (config.visuals.cta.defaultEnabled !== false) errors.push('CTA darf nicht standardmäßig aktiv sein.');
if (config.visuals.policyVersion !== 'visual-v2') errors.push('Aktuelle Visual-Policy muss visual-v2 sein.');
if (config.visuals.generatedImageTextPolicy !== 'none') errors.push('Generierte Bilder müssen textfrei bleiben.');
if (config.visuals.mechanismAnimations.maximum > 4) errors.push('Es dürfen höchstens vier Vollanimationen zugelassen sein.');
if (config.script.hook.firstFrameAnimationAllowed !== false) errors.push('Hook darf keine Vollanimation erlauben.');
if (config.visuals.beats.max > 10) errors.push('Neue Reels dürfen höchstens zehn Szenen erhalten.');

if (errors.length) {
  console.error('Konsistenzprüfung fehlgeschlagen:');
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}
console.log('✓ Konfiguration, Preflight, Codex-Regeln und Befehle sind konsistent.');
