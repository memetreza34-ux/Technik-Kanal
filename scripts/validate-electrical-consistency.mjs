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
for (const command of ['electrical:new', 'electrical:assets', 'electrical:script-qa', 'electrical:creative-qa', 'electrical:ready', 'electrical:render', 'electrical:finish', 'electrical:system-test']) {
  if (!pkg.scripts?.[command]) errors.push(`package.json fehlt Befehl ${command}.`);
}
if (!pkg.dependencies?.sharp) errors.push('sharp fehlt für Bildanalyse.');
if (!pkg.dependencies?.zod) errors.push('zod fehlt für Datenverträge.');
if (!pkg.devDependencies?.vitest) errors.push('vitest fehlt für Systemtests.');
if (config.captions.highlightColor !== null || config.captions.backgroundBox !== false) errors.push('Untertitel müssen weiß ohne Hervorhebung und ohne Box bleiben.');
if (config.visuals.cta.defaultEnabled !== false) errors.push('CTA darf nach aktuellem Referenzsystem nicht standardmäßig aktiv sein.');

if (errors.length) {
  console.error('Konsistenzprüfung fehlgeschlagen:');
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}
console.log('✓ Konfiguration, Codex-Regeln und Befehle sind konsistent.');
