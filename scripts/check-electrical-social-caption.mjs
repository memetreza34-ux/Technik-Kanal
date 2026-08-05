#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {electricalProjectPaths} from './lib/electrical-project-structure.mjs';

const [projectArg] = process.argv.slice(2).filter((arg) => !arg.startsWith('--'));
if (!projectArg) {
  console.error('Nutzung: node scripts/check-electrical-social-caption.mjs <reel-ordner>');
  process.exit(1);
}

const paths = electricalProjectPaths(path.resolve(projectArg));
const text = fs.existsSync(paths.socialCaption) ? fs.readFileSync(paths.socialCaption, 'utf8').trim() : '';
const errors = [];
const warnings = [];

if (!text) errors.push('social-caption.md fehlt oder ist leer.');
if (text.length > 2200) errors.push(`Social Caption zu lang: ${text.length} Zeichen.`);
if (text && text.length < 80) warnings.push('Social Caption ist sehr kurz und erklärt den Nutzen möglicherweise nicht ausreichend.');
if (/https?:\/\//i.test(text)) warnings.push('Direkte URL in der Caption prüfen; Plattformen machen sie oft nicht klickbar.');
if (/(garantiert|100\s*%\s*sicher|niemals gefährlich)/i.test(text)) errors.push('Unzulässige absolute oder irreführende Aussage in der Caption.');
if (/(unter spannung arbeiten|überbrücken|schutzleiter entfernen)/i.test(text)) errors.push('Unsichere Handlungsanweisung in der Caption.');

const hashtags = text.match(/#[\p{L}\p{N}_]+/gu) ?? [];
if (hashtags.length > 12) warnings.push(`Viele Hashtags: ${hashtags.length}; empfohlen sind höchstens 12.`);

const report = {version: 'electrical-v1', generatedAt: new Date().toISOString(), passed: errors.length === 0, characters: text.length, hashtags: hashtags.length, errors, warnings};
fs.writeFileSync(path.join(paths.projectDir, 'social-caption-report.json'), `${JSON.stringify(report, null, 2)}\n`);

if (errors.length) {
  console.error('Social-Caption-QA fehlgeschlagen:');
  errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}
console.log('✓ Social Caption geprüft.');
warnings.forEach((warning) => console.warn(`⚠ ${warning}`));
