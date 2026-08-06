#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const required = [
  '.claude/settings.json',
  'channels/elektrotechnik/CLAUDE.md',
  'channels/elektrotechnik/brand/brand.ts',
  'channels/elektrotechnik/engine/VISUAL-QUALITY-GATE.md',
  'channels/elektrotechnik/engine/config/electrical-v1.json',
  'channels/elektrotechnik/gehirn/BILDSTIL.md',
  'channels/elektrotechnik/gehirn/MASTER-STYLE-PROMPT.md',
  'channels/elektrotechnik/gehirn/IMAGE-PROMPT-TEMPLATE.md',
  'channels/elektrotechnik/remotion.config.ts',
  'channels/elektrotechnik/src/index.ts',
  'channels/elektrotechnik/src/engine/contracts.ts',
  'channels/elektrotechnik/src/engine/index.ts',
  'core/brand-kit/index.ts',
  'core/lib/audio.ts',
  'core/lib/schemas.ts',
  'scripts/lib/electrical-contracts.mjs',
  'scripts/lib/electrical-project-structure.mjs',
  'scripts/lib/electrical-visual-policy.mjs',
  'scripts/check-electrical-preproduction.mjs',
  'scripts/check-electrical-production-readiness.mjs',
  'scripts/check-electrical-project-folder.mjs',
  'scripts/check-electrical-readiness.mjs',
  'scripts/check-electrical-required-media.mjs',
  'scripts/materialize-electrical-mechanism-canvases.mjs',
  'scripts/cleanup-electrical-mechanism-canvases.mjs',
  'scripts/ingest-electrical-assets.mjs',
  'scripts/render_electrical_reel.mjs',
  'scripts/test-electrical-visual-policy.mjs'
];
const missing = required.filter((relative) => !fs.existsSync(path.join(root, relative)));
if (missing.length) {
  console.error('Elektrotechnik-System unvollständig:');
  missing.forEach((file) => console.error(`- ${file}`));
  process.exit(1);
}
console.log(`✓ Systemstruktur vollständig (${required.length} Kernpfade).`);
