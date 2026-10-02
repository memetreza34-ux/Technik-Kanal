#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {ScenePlan} from './lib/electrical-contracts.mjs';
import {electricalProjectPaths} from './lib/electrical-project-structure.mjs';
import {loadElectricalConfig} from './lib/load-electrical-config.mjs';

const [projectArg] = process.argv.slice(2).filter((arg) => !arg.startsWith('--'));
if (!projectArg) {
  console.error('Nutzung: npm run science:script-qa -- <video-ordner>');
  process.exit(1);
}

const paths = electricalProjectPaths(path.resolve(projectArg));
const config = loadElectricalConfig();
const plan = ScenePlan.parse(JSON.parse(fs.readFileSync(paths.scenePlan, 'utf8')));
const fullText = plan.scenes.map((scene) => scene.voiceText).join(' ');
const words = fullText.trim().split(/\s+/).filter(Boolean);
const lowerText = fullText.toLowerCase();
const errors = [];
const warnings = [];

if (plan.productionProfile !== config.productionProfile) errors.push(`Szenenplan nutzt nicht das aktive Profil ${config.productionProfile}.`);
if (plan.width !== config.format.width || plan.height !== config.format.height) errors.push(`Szenenplan muss ${config.format.width}×${config.format.height} verwenden.`);
if (words.length < config.script.words.min) errors.push(`Skript zu kurz: ${words.length} Wörter; Minimum ${config.script.words.min}.`);
if (words.length > config.script.words.max) errors.push(`Skript zu lang: ${words.length} Wörter; Maximum ${config.script.words.max}.`);

for (const phrase of config.safety.riskyPhrases) {
  if (lowerText.includes(phrase.toLowerCase())) errors.push(`Unsichere Formulierung: "${phrase}".`);
}
for (const phrase of config.textQuality.vaguePhrases) {
  if (lowerText.includes(phrase.toLowerCase())) warnings.push(`Vage Standardphrase vermeiden: "${phrase}".`);
}
for (const phrase of [
  'sprechtext für diese szene ergänzen',
  'voice-text für diesen inhaltlichen abschnitt ergänzen',
  'direkte einordnung ohne langes intro ergänzen',
  'vollständigen 2-minuten-sprechtext',
  'finalen durchgehenden sprechtext hier einfügen',
  'fachliche kernaussage ergänzen',
  '[platzhalter]',
]) {
  if (lowerText.includes(phrase)) errors.push(`Unbearbeiteter Skript-Platzhalter: "${phrase}".`);
}

const requiredSections = config.script.narrativeStructure ?? [];
const sections = plan.scenes.map((scene) => scene.section).filter(Boolean);
for (const section of requiredSections) {
  if (!sections.includes(section)) errors.push(`Dramaturgie-Abschnitt fehlt: ${section}.`);
}
if (plan.scenes[0]?.section !== 'hook') errors.push('Erster Beat muss section=hook sein.');
if (plan.scenes.at(-1)?.section !== 'payoff') errors.push('Letzter Beat muss section=payoff sein.');

const firstScene = plan.scenes[0];
const hookHeadline = firstScene.headline ?? firstScene.title;
const hookVoiceWords = firstScene.voiceText.split(/\s+/).filter(Boolean).length;
if (!hookHeadline.trim().endsWith('?')) errors.push('Hook-Headline muss eine direkte Frage sein.');
if (!firstScene.voiceText.includes('?')) errors.push('Der gesprochene Hook muss die zentrale Frage stellen.');
if (hookVoiceWords > config.script.hook.voiceWordsMax) errors.push(`Hook ist mit ${hookVoiceWords} Wörtern zu lang; maximal ${config.script.hook.voiceWordsMax}.`);
for (const phrase of config.script.hook.forbiddenMetaphors) {
  if (`${hookHeadline} ${firstScene.voiceText}`.toLowerCase().includes(phrase.toLowerCase())) errors.push(`Künstliche Hook-Metapher verboten: "${phrase}".`);
}

if (/(heute (schauen|gucken|sehen) wir|in diesem video zeige ich|willkommen zu)/i.test(fullText)) warnings.push('Einleitung beginnt möglicherweise mit unnötigem Vorgeplänkel statt direkt mit der Erklärung.');
if (!/(deshalb|dadurch|weil|führt dazu|entsteht|bewirkt|sorgt dafür)/i.test(fullText)) warnings.push('Zu wenig erkennbare Ursache-Wirkung im Skript; Hauptteil auf Mechanismus prüfen.');
if (!/(merke|merksatz|deshalb|also|entscheidend|darum)/i.test(plan.scenes.at(-1)?.voiceText ?? '')) warnings.push('Payoff beantwortet die Ausgangsfrage möglicherweise nicht klar genug.');
if (/(din vde|dguv|norm|grenzwert|prüffrist|gesetz|aktuell|heute)/i.test(fullText)) {
  const sourceText = fs.existsSync(paths.sources) ? fs.readFileSync(paths.sources, 'utf8').trim() : '';
  if (!sourceText) errors.push('Zeit-, Norm- oder Grenzwertaussage ohne Quelleninhalt.');
}

const report = {
  version: 'science-v1',
  productionProfile: config.productionProfile,
  generatedAt: new Date().toISOString(),
  passed: errors.length === 0,
  wordCount: words.length,
  targetWords: config.script.words,
  sceneCount: plan.scenes.length,
  sections: [...new Set(sections)],
  hookHeadline,
  hookVoiceWords,
  errors,
  warnings,
};
fs.writeFileSync(path.join(paths.projectDir, 'script-qa-report.json'), `${JSON.stringify(report, null, 2)}\n`);
if (errors.length) {
  console.error('Skript-QA fehlgeschlagen:');
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}
console.log(`✓ YouTube-Skript-QA bestanden (${words.length} Wörter; ${plan.scenes.length} visuelle Beats).`);
warnings.forEach((warning) => console.warn(`⚠ ${warning}`));
