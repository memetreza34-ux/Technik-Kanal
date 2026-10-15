#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

export const VISIBLE_TEXT_LOCK_MARKER = 'VISIBLE TEXT LOCK — SCENE METADATA IS NEVER IMAGE CONTENT';

export const VISIBLE_TEXT_LOCK = `${VISIBLE_TEXT_LOCK_MARKER}
For SCENE IMAGES, production metadata is NEVER visual content. Never render scene numbers, beat numbers, scene IDs, section names, filenames, image-step labels, final asset names or production instructions inside the image. Forbidden examples include “Szene 10”, “Scene 10”, “Beat 10”, “10-MECHANISM”, “Bildschritt 3” and “01-hook-final”.

Only render visible scene text that is explicitly requested inside the scene prompt. Do not invent extra titles, headings, labels or explanatory text. Never carry a thumbnail headline into a normal scene unless that exact text is explicitly requested for that scene. If a scene prompt requests no visible text, the image must contain zero text.

Requested labels, concise explanatory callouts, formulas and legends may be prominent enough to read comfortably on a phone, while remaining subordinate to the actual technical illustration. Diagram annotations must be clear and scientifically correct, not decorative. Keep all requested text comfortably inside the 16:9 safe area; never crop it at the top, bottom or sides. Every requested label must be exact, complete and readable. If text is misspelled, blank, corrupted, cropped, substituted or turned into a large headline, REJECT that image and regenerate it before continuing.

FINAL IMAGE SELECTION LOCK: compare every newly generated scene image with all already accepted final images from the same video. If it repeats essentially the same dominant composition, object angle, arrow pattern or full-scene layout without a genuinely different explanatory form, REJECT it and regenerate with a clearly different composition. A different camera angle alone is not enough. The payoff may return to the hook idea, but it must not simply duplicate the hook image.

THUMBNAIL EXCEPTION: thumbnail prompts may use the explicitly requested thumbnail headline. This exception applies only to the thumbnail phase and never carries into scene images.`;

export const applySceneVisibleTextLock = (text) => {
  const value = String(text ?? '').trimEnd();
  if (value.includes(VISIBLE_TEXT_LOCK_MARKER)) return `${value}\n`;
  return `${value}\n\n${VISIBLE_TEXT_LOCK}\n`;
};

export const applyMasterVisibleTextLock = (text) => {
  const value = String(text ?? '').trimEnd();
  if (value.includes(VISIBLE_TEXT_LOCK_MARKER)) return `${value}\n`;
  return `${VISIBLE_TEXT_LOCK}\n\n${value}\n`;
};

export const enforceScenePromptLocks = (root) => {
  const promptDir = path.join(root, '02-bilder', 'prompts');
  if (!fs.existsSync(promptDir)) throw new Error(`Prompt-Ordner fehlt: ${promptDir}`);
  const files = fs.readdirSync(promptDir)
    .filter((name) => name.endsWith('.txt') && name !== '00-thumbnail.txt')
    .sort();
  if (!files.length) throw new Error('Keine Szenen-Promptdateien gefunden.');
  for (const name of files) {
    const file = path.join(promptDir, name);
    fs.writeFileSync(file, applySceneVisibleTextLock(fs.readFileSync(file, 'utf8')));
  }
  return files.length;
};

export const enforceMasterVisibleTextLock = (root) => {
  const file = path.join(root, '02-bilder', 'GOOGLE-FLOW-MASTER-PROMPT.txt');
  if (!fs.existsSync(file)) throw new Error(`Google-Flow-Masterprompt fehlt: ${file}`);
  fs.writeFileSync(file, applyMasterVisibleTextLock(fs.readFileSync(file, 'utf8')));
  return file;
};

const isCli = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isCli) {
  const args = process.argv.slice(2);
  const projectArg = args.find((arg) => !arg.startsWith('--'));
  if (!projectArg) throw new Error('Nutzung: node scripts/science-visible-text-lock.mjs <video-ordner> [--prompts-only|--master-only]');
  const root = path.resolve(projectArg);
  const promptsOnly = args.includes('--prompts-only');
  const masterOnly = args.includes('--master-only');
  if (promptsOnly && masterOnly) throw new Error('Nur --prompts-only ODER --master-only verwenden.');

  if (!masterOnly) {
    const count = enforceScenePromptLocks(root);
    console.log(`✓ Visible-Text-Lock in ${count} Szenen-Prompts verankert.`);
  }
  if (!promptsOnly) {
    enforceMasterVisibleTextLock(root);
    console.log('✓ Visible-Text-Lock im Google-Flow-Masterprompt verankert.');
  }
}
