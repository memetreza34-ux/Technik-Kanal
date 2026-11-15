#!/usr/bin/env node
// Kopiert Szenenplan, Untertitel und Voice-over nach public/shorts/<slug>/,
// damit Remotion Studio und Render darauf zugreifen können.
import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';

export function stageShort(folder) {
  const dir = path.resolve(folder);
  const slug = path.basename(dir);
  const target = path.resolve('public', 'shorts', slug);
  fs.mkdirSync(target, {recursive: true});
  const files = [
    [path.join(dir, 'short.json'), 'short.json', true],
    [path.join(dir, 'audio', 'captions.json'), 'captions.json', false],
    [path.join(dir, 'audio', 'voiceover.wav'), 'voiceover.wav', false],
  ];
  for (const [src, name, required] of files) {
    if (fs.existsSync(src)) fs.copyFileSync(src, path.join(target, name));
    else if (required) throw new Error('Fehlt: ' + src);
    else console.warn('⚠ Fehlt (optional): ' + path.relative(process.cwd(), src));
  }
  return {slug, target, hasAudio: fs.existsSync(path.join(target, 'voiceover.wav'))};
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const folder = process.argv[2];
  if (!folder) throw new Error('Nutzung: npm run short:stage -- shorts/YYYY-MM-DD_thema');
  const {slug} = stageShort(folder);
  console.log(`✓ Bereit für Studio: Composition "TechnikShort", slug "${slug}"`);
}
