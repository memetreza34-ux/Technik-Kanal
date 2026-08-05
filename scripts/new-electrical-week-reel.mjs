#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {
  createElectricalPromptManifestTemplate,
  createElectricalScenePlanTemplate,
  createElectricalStatusTemplate,
} from './lib/create-electrical-scene-plan-template.mjs';
import {ELECTRICAL_REEL_DIRECTORIES} from './lib/electrical-project-structure.mjs';

const args = process.argv.slice(2);
const option = (name) => args.find((arg) => arg.startsWith(`--${name}=`))?.slice(name.length + 3);
const week = option('week');
const slot = option('slot');
const title = option('title');
const sceneCount = Number(option('scenes') ?? 8);
if (!week || !slot || !title) {
  console.error('Nutzung: npm run electrical:new -- --week=2026-08-10_bis_2026-08-16 --slot=01 --title="Was macht ein FI?" [--scenes=8]');
  process.exit(1);
}
if (!/^\d{4}-\d{2}-\d{2}_bis_\d{4}-\d{2}-\d{2}$/.test(week)) throw new Error(`Ungültiger Wochenname: ${week}`);
if (!/^\d{1,2}$/.test(slot)) throw new Error(`Ungültiger Slot: ${slot}`);
if (!Number.isInteger(sceneCount) || sceneCount < 8 || sceneCount > 14) throw new Error('Szenenzahl muss zwischen 8 und 14 liegen.');

const slug = title
  .normalize('NFKD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/ß/g, 'ss')
  .replace(/[^a-zA-Z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '')
  .toLowerCase();
const folderTitle = title
  .normalize('NFKD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/ß/g, 'ss')
  .replace(/[^a-zA-Z0-9ÄÖÜäöüß]+/g, '-')
  .replace(/^-+|-+$/g, '');
const slotName = String(Number(slot)).padStart(2, '0');
const root = path.join(process.cwd(), 'channels/elektrotechnik/reels', week, `${slotName}_${folderTitle}`);
if (fs.existsSync(root)) throw new Error(`Reel-Ordner existiert bereits: ${root}`);

for (const relative of ELECTRICAL_REEL_DIRECTORIES) fs.mkdirSync(path.join(root, relative), {recursive: true});
const plan = createElectricalScenePlanTemplate({slug, compositionId: 'ElectricalReel', sceneCount});
const write = (relative, content) => fs.writeFileSync(path.join(root, relative), content);
const writeJson = (relative, value) => write(relative, `${JSON.stringify(value, null, 2)}\n`);

write('README.md', `# ${title}\n\n## Start\n\n1. Skript und Quellen ausfüllen.\n2. Bildprompts erzeugen.\n3. Audio und Bilder einfügen.\n4. \`npm run electrical:finish -- "${path.relative(process.cwd(), root)}"\` ausführen.\n`);
write('01-script-audio/script.md', `# Sprechtext – ${title}\n\nSzenen und Betonungen ergänzen.\n`);
write('01-script-audio/script-fliesstext.txt', 'Finalen durchgehenden Sprechtext hier einfügen.\n');
write('01-script-audio/voiceover.txt', 'Finalen durchgehenden Sprechtext hier einfügen.\n');
write('01-script-audio/audio/00_AUDIO_HIER_EINFUEGEN.md', '# Audio hier einfügen\n\nRohaufnahme als `voiceover-raw.wav` ablegen.\n');
write('01-script-audio/sfx/README.md', '# Optionale SFX\n\nWAV, 48 kHz.\n');
write('02-bilder/bildprompts.md', `# Bildprompts – ${title}\n\nAlle Szenenprompts gesammelt.\n`);
write('02-bilder/images/00_BILDER_HIER_EINFUEGEN.md', '# Bilder hier einfügen\n\nPro Szenenordner genau ein finales vertikales Bild.\n');
for (const scene of plan.scenes) {
  fs.mkdirSync(path.join(root, scene.imageDir), {recursive: true});
  write(`02-bilder/prompts/${scene.id}.txt`, `The viewer must immediately understand: [AUSSAGE FÜR ${scene.id}].\n\n[MASTER STYLE PROMPT ANHÄNGEN]\n`);
}
write('03-caption/00_CAPTION_INFO.md', '# Caption\n\nWortzeiten werden aus dem finalen Audio erzeugt.\n');
write('03-caption/social-caption.md', `# Social Caption\n\n${title}\n`);
write('04-pdf/inhalt.md', `# Lernzettel – ${title}\n\nNur erstellen, wenn der Reel einen echten Lernzettel verspricht.\n`);
write('05-export/README.md', '# Export\n\nFinale Dateien werden automatisch erzeugt.\n');
write('05-export/video/README.md', '# Finales Video\n');
write('06-projektdateien/motion-design.md', '# Motion Design\n\nMechanismen, Übergänge und Bibliothekskomponenten pro Szene dokumentieren.\n');
write('06-projektdateien/sources.md', '# Quellen\n\nFachliche Quellen mit stabilen IDs dokumentieren.\n');
write('06-projektdateien/storyboard.md', `# Storyboard – ${title}\n\n| Szene | Bild | Voice | Animation |\n|---|---|---|---|\n`);
writeJson('06-projektdateien/scene-plan.json', plan);
writeJson('06-projektdateien/prompt-manifest.json', createElectricalPromptManifestTemplate(plan));
writeJson('06-projektdateien/production-status.json', createElectricalStatusTemplate(plan));
writeJson('06-projektdateien/asset-manifest.json', {version: 'electrical-v1', slug, generatedAt: new Date().toISOString(), assets: []});
writeJson('06-projektdateien/content-package-report.json', {version: 'electrical-v1', passed: false, status: 'noch-nicht-geprueft'});
writeJson('06-projektdateien/qa-report.json', {version: 'electrical-v1', passed: false, status: 'noch-nicht-gerendert'});
writeJson('06-projektdateien/ready-report.json', {version: 'electrical-v1', ready: false, status: 'in-vorbereitung'});
write('06-projektdateien/render/README.md', '# Arbeitsrender und Kontrollbilder\n');

console.log(`✓ Neuer FinanzNeo-kompatibler Elektrotechnik-Reel: ${root}`);
