#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const required = [
  '.claude/settings.json',
  'channels/science/CLAUDE.md',
  'channels/science/engine/VISUAL-QUALITY-GATE.md',
  'channels/science/engine/config/science-v1.json',
  'channels/science/engine/config/voice-v1.json',
  'channels/science/engine/topic-history.json',
  'channels/science/gehirn/KANAL.md',
  'channels/science/gehirn/REELS.md',
  'channels/science/gehirn/BILDSTIL.md',
  'channels/science/gehirn/SCIENCE-VISUAL-GRAMMAR.md',
  'channels/science/gehirn/MASTER-STYLE-PROMPT.md',
  'channels/science/gehirn/IMAGE-PROMPT-TEMPLATE.md',
  'channels/science/public/smoke/science-static-smoke.svg',
  'channels/science/src/index.ts',
  'channels/science/src/ScienceRoot.tsx',
  'channels/science/src/ScienceReel.tsx',
  'channels/science/src/generated/science-runtime.json',
  'channels/science/src/engine/ScienceSceneHeader.tsx',
  'channels/science/src/engine/science-contracts.ts',
  'core/brand-kit/index.ts',
  'core/brand-kit/tokens.ts',
  'core/brand-kit/components/Captions.tsx',
  'core/brand-kit/components/Sound.tsx',
  'scripts/new-science-reel.mjs',
  'scripts/safe-new-science-reel.mjs',
  'scripts/science-preflight.mjs',
  'scripts/science-readiness.mjs',
  'scripts/science-runtime-readiness.mjs',
  'scripts/science-required-media.mjs',
  'scripts/science-image-qa.mjs',
  'scripts/science-static-quality.mjs',
  'scripts/science-overlay-qa.mjs',
  'scripts/science-content-package.mjs',
  'scripts/science-script-qa.mjs',
  'scripts/science-creative-qa.mjs',
  'scripts/prepare_science_reel.mjs',
  'scripts/render_science_reel.mjs',
  'scripts/finish_science_reel.mjs',
  'scripts/qa_science_render.mjs',
  'scripts/validate-science-project.mjs',
  'scripts/validate-science-syntax.mjs',
  'scripts/validate-science-system.mjs',
  'scripts/validate-science-template.mjs',
  'scripts/validate-science-consistency.mjs',
  'scripts/test-science-visual-policy.mjs',
  'scripts/test-science-e2e.mjs',
  'scripts/test-science-scaffold.mjs'
];

const forbidden = [
  'channels/elektrotechnik',
  'channels/science/src/animation-library',
  'channels/science/src/visual-kit',
  'channels/science/src/visuals',
  'channels/science/src/SicherungsReel.tsx',
  'channels/science/src/FiSchalterReel.tsx',
  'channels/science/src/SchutzleiterReel.tsx',
  'channels/science/src/LeitungsschutzschalterReel.tsx',
  'channels/science/engine/config/electrical-v1.json',
  'channels/science/reels/2026-08-03_bis_2026-08-09',
  'scripts/new-electrical-week-reel.mjs',
  'scripts/safe-new-electrical-week-reel.mjs',
  'scripts/render_electrical_reel.mjs',
  'scripts/finish_electrical_reel.mjs',
  'scripts/check-electrical-preproduction.mjs',
  'scripts/check-electrical-production-readiness.mjs',
  'scripts/check-electrical-required-media.mjs',
  'scripts/check-electrical-image-appearance.mjs',
  'scripts/check-electrical-remotion-quality.mjs',
  'scripts/check-electrical-callouts.mjs',
  'scripts/check-electrical-content-package.mjs',
  'scripts/check-electrical-readiness.mjs',
  'scripts/run-electrical-script-qa.mjs',
  'scripts/run-electrical-creative-qa.mjs',
  'scripts/qa_electrical_render.mjs',
  'scripts/validate-electrical-project.mjs',
  'scripts/validate-electrical-syntax.mjs',
  'scripts/validate-electrical-system.mjs',
  'scripts/validate-electrical-template.mjs',
  'scripts/validate-electrical-consistency.mjs',
  'scripts/test-electrical-visual-policy.mjs',
  'scripts/test-electrical-e2e.mjs',
  'scripts/test-electrical-scaffold-transaction.mjs'
];

const missing = required.filter((relative) => !fs.existsSync(path.join(root, relative)));
const legacy = forbidden.filter((relative) => fs.existsSync(path.join(root, relative)));
if (missing.length || legacy.length) {
  if (missing.length) {
    console.error('Science-System unvollständig:');
    missing.forEach((file) => console.error(`- fehlt: ${file}`));
  }
  if (legacy.length) {
    console.error('Veralteter Einstiegspunkt im Repo:');
    legacy.forEach((file) => console.error(`- entfernen: ${file}`));
  }
  process.exit(1);
}
console.log(`✓ Science-only-Systemstruktur vollständig (${required.length} Kernpfade).`);
