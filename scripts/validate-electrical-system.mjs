#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const required = [
  '.claude/settings.json',
  'channels/elektrotechnik/CLAUDE.md',
  'channels/elektrotechnik/engine/VISUAL-QUALITY-GATE.md',
  'channels/elektrotechnik/engine/config/science-v1.json',
  'channels/elektrotechnik/engine/config/voice-v1.json',
  'channels/elektrotechnik/engine/topic-history.json',
  'channels/elektrotechnik/gehirn/KANAL.md',
  'channels/elektrotechnik/gehirn/REELS.md',
  'channels/elektrotechnik/gehirn/BILDSTIL.md',
  'channels/elektrotechnik/gehirn/SCIENCE-VISUAL-GRAMMAR.md',
  'channels/elektrotechnik/gehirn/MASTER-STYLE-PROMPT.md',
  'channels/elektrotechnik/gehirn/IMAGE-PROMPT-TEMPLATE.md',
  'channels/elektrotechnik/remotion.config.ts',
  'channels/elektrotechnik/public/ASSETS.md',
  'channels/elektrotechnik/public/smoke/science-static-smoke.svg',
  'channels/elektrotechnik/src/index.ts',
  'channels/elektrotechnik/src/ScienceRoot.tsx',
  'channels/elektrotechnik/src/ScienceReel.tsx',
  'channels/elektrotechnik/src/generated/science-runtime.json',
  'channels/elektrotechnik/src/engine/ScienceSceneHeader.tsx',
  'channels/elektrotechnik/src/engine/science-contracts.ts',
  'core/brand-kit/index.ts',
  'core/brand-kit/tokens.ts',
  'core/brand-kit/components/Captions.tsx',
  'core/brand-kit/components/Sound.tsx',
  'scripts/lib/electrical-contracts.mjs',
  'scripts/lib/electrical-project-structure.mjs',
  'scripts/lib/electrical-visual-policy.mjs',
  'scripts/lib/create-electrical-scene-plan-template.mjs',
  'scripts/prepare_science_reel.mjs',
  'scripts/process_voiceover.mjs',
  'scripts/check-electrical-preproduction.mjs',
  'scripts/check-electrical-production-readiness.mjs',
  'scripts/check-electrical-required-media.mjs',
  'scripts/check-electrical-image-appearance.mjs',
  'scripts/check-electrical-remotion-quality.mjs',
  'scripts/check-electrical-callouts.mjs',
  'scripts/render_electrical_reel.mjs',
  'scripts/qa_electrical_render.mjs',
  'scripts/test-electrical-visual-policy.mjs',
  'scripts/test-electrical-e2e.mjs'
];

const forbiddenLegacyPaths = [
  'channels/elektrotechnik/src/animation-library',
  'channels/elektrotechnik/src/visual-kit',
  'channels/elektrotechnik/src/visuals',
  'channels/elektrotechnik/src/SicherungsReel.tsx',
  'channels/elektrotechnik/src/FiSchalterReel.tsx',
  'channels/elektrotechnik/src/SchutzleiterReel.tsx',
  'channels/elektrotechnik/src/LeitungsschutzschalterReel.tsx',
  'channels/elektrotechnik/engine/config/electrical-v1.json',
  'channels/elektrotechnik/reels/2026-08-03_bis_2026-08-09'
];

const missing = required.filter((relative) => !fs.existsSync(path.join(root, relative)));
const legacy = forbiddenLegacyPaths.filter((relative) => fs.existsSync(path.join(root, relative)));

if (missing.length || legacy.length) {
  if (missing.length) {
    console.error('Science-System unvollständig:');
    missing.forEach((file) => console.error(`- fehlt: ${file}`));
  }
  if (legacy.length) {
    console.error('Legacy-Bestand ist wieder im aktiven Repo aufgetaucht:');
    legacy.forEach((file) => console.error(`- entfernen: ${file}`));
  }
  process.exit(1);
}

console.log(`✓ Schlanke Science-Static-Systemstruktur vollständig (${required.length} Kernpfade, kein aktiver Elektro-Legacy-Bestand).`);
