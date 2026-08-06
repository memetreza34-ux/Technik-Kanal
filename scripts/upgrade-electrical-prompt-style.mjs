#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {upgradeElectricalPromptText} from './lib/electrical-realistic-image-style.mjs';

const args = process.argv.slice(2);
const option = (name) => args.find((arg) => arg.startsWith(`--${name}=`))?.slice(name.length + 3);
const week = option('week');
const slot = option('slot');
const title = option('title');
const hook = option('hook') ?? title;
if (!week || !slot || !title) throw new Error('Prompt-Stil-Upgrade benötigt --week, --slot und --title.');

const folderTitle = title
  .normalize('NFKD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/ß/g, 'ss')
  .replace(/[^a-zA-Z0-9ÄÖÜäöüß]+/g, '-')
  .replace(/^-+|-+$/g, '');
const root = path.join(process.cwd(), 'channels/elektrotechnik/reels', week, `${String(Number(slot)).padStart(2, '0')}_${folderTitle}`);
if (!fs.existsSync(root)) throw new Error(`Reel-Ordner für Prompt-Stil-Upgrade fehlt: ${root}`);

const files = [];
const walk = (dir) => {
  for (const entry of fs.readdirSync(dir, {withFileTypes: true})) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (/\.(txt|md)$/i.test(entry.name) && full.includes(`${path.sep}02-bilder${path.sep}`)) files.push(full);
  }
};
walk(root);

for (const file of files) {
  let content = upgradeElectricalPromptText(fs.readFileSync(file, 'utf8'));
  if (path.basename(file) === 'ALLE-BILDPROMPTS-MIT-COVER.txt' && !/final(?:e|er)? cover.*remotion.*hook|cover.*hook.*remotion/i.test(content)) {
    content = content.replace(
      /## Covertext\s+>[^\n]+/i,
      (match) => `${match}\n\nDer KI-Coverhintergrund bleibt textfrei. Der finale Cover-Still enthält den exakten deutschen Hook ${hook} als kontrolliertes Remotion-Overlay.`,
    );
  }
  fs.writeFileSync(file, content);
}

console.log(`✓ Prompt-Standard auf semi-fotorealistische technische CGI aktualisiert: ${root}`);
