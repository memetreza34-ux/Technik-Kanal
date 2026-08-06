#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {ScenePlan} from './lib/electrical-contracts.mjs';
import {electricalProjectPaths} from './lib/electrical-project-structure.mjs';
import {loadElectricalConfig} from './lib/load-electrical-config.mjs';

const [projectArg] = process.argv.slice(2).filter((arg) => !arg.startsWith('--'));
if (!projectArg) {
  console.error('Nutzung: node scripts/run-electrical-script-qa.mjs <reel-ordner>');
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

if (words.length < config.script.words.min) errors.push(`Skript zu kurz: ${words.length} Wörter; Minimum ${config.script.words.min}.`);
if (words.length > config.script.words.max) errors.push(`Skript zu lang: ${words.length} Wörter; Maximum ${config.script.words.max}.`);
for (const phrase of config.electricalSafety.riskyPhrases) {
  if (lowerText.includes(phrase.toLowerCase())) errors.push(`Unsichere Formulierung: "${phrase}".`);
}
for (const phrase of config.textQuality.vaguePhrases) {
  if (lowerText.includes(phrase.toLowerCase())) warnings.push(`Vage Standardphrase vermeiden: "${phrase}".`);
}

const firstScene = plan.scenes[0];
const hookHeadline = firstScene.headline ?? firstScene.title;
const hookVoiceWords = firstScene.voiceText.split(/\s+/).filter(Boolean).length;
if (!hookHeadline.trim().endsWith('?')) errors.push('Hook-Headline muss eine direkte Frage sein.');
if (!firstScene.voiceText.includes('?')) errors.push('Der gesprochene Hook muss die zentrale Frage stellen.');
if (plan.coverText && plan.coverText.trim() !== hookHeadline.trim()) errors.push('Covertext und Hook-Headline müssen identisch sein.');
if (hookVoiceWords > config.script.hook.voiceWordsMax) {
  errors.push(`Hook ist mit ${hookVoiceWords} Wörtern zu lang; maximal ${config.script.hook.voiceWordsMax}.`);
}
for (const phrase of config.script.hook.forbiddenMetaphors) {
  if (`${hookHeadline} ${firstScene.voiceText}`.toLowerCase().includes(phrase.toLowerCase())) {
    errors.push(`Künstliche Hook-Metapher verboten: "${phrase}".`);
  }
}

if (!/(merke|merksatz|wichtig|unterschied|deshalb|nicht verwechseln|prüfen lassen)/i.test(fullText)) {
  warnings.push('Kein klarer Merksatz oder fachlicher Payoff erkannt.');
}
if (/(din vde|dguv|norm|grenzwert|prüffrist)/i.test(fullText)) {
  const sourceText = fs.existsSync(paths.sources) ? fs.readFileSync(paths.sources, 'utf8').trim() : '';
  if (!sourceText) errors.push('Norm- oder Grenzwertaussage ohne Quelleninhalt.');
}

const report = {
  version: 'electrical-v2',
  generatedAt: new Date().toISOString(),
  passed: errors.length === 0,
  wordCount: words.length,
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
console.log(`✓ Skript-QA bestanden (${words.length} Wörter; Hook ${hookVoiceWords} Wörter).`);
warnings.forEach((warning) => console.warn(`⚠ ${warning}`));
