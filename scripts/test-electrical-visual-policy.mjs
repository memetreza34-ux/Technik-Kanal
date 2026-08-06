#!/usr/bin/env node
import assert from 'node:assert/strict';
import {loadElectricalConfig} from './lib/load-electrical-config.mjs';
import {evaluateElectricalVisualPolicy} from './lib/electrical-visual-policy.mjs';

const config = loadElectricalConfig();
const backgrounds = ['warm-workshop','cool-workshop','terminal-box','charcoal-lab','slate-lab','distribution-board','control-cabinet','workbench'];
const scene = (index, overrides = {}) => ({
  id: `${String(index + 1).padStart(2, '0')}-szene`,
  title: index === 0 ? 'Was macht ein Schutzgerät?' : `Szene ${index + 1}`,
  headline: index === 0 ? 'Was macht ein Schutzgerät?' : `Klare Aussage ${index + 1}`,
  imageLabel: index === 0 ? 'Was macht ein Schutzgerät?' : `Deutsche Aussage ${index + 1}`,
  backgroundFamily: backgrounds[index],
  voiceText: index === 0 ? 'Was macht ein Schutzgerät? Es erkennt einen klar erklärten Fehler.' : 'Diese Szene erklärt genau eine technische Aussage verständlich.',
  imageDir: `02-bilder/images/${String(index + 1).padStart(2, '0')}-szene`,
  layout: 'image-full',
  renderMode: 'image-only',
  motionLevel: 'subtle',
  imageRole: 'hero',
  ...overrides,
});

const goodScenes = Array.from({length: 8}, (_, index) => scene(index));
goodScenes[2] = scene(2, {layout: 'image-mechanism', renderMode: 'mechanism-only', motionLevel: 'full', imageRole: 'mechanism-plate', mechanism: 'current-flow'});
goodScenes[5] = scene(5, {layout: 'image-mechanism', renderMode: 'mechanism-only', motionLevel: 'full', imageRole: 'mechanism-plate', mechanism: 'contact-trip'});
const goodPlan = {
  visualPolicyVersion: 'visual-v4',
  generatedImageTextPolicy: 'exact-german-short-labels',
  coverText: goodScenes[0].headline,
  animationBudget: {maximum: 4, fullMechanismScenes: [goodScenes[2].id, goodScenes[5].id]},
  scenes: goodScenes,
};
const promptFor = (entry) => `${entry.renderMode === 'mechanism-only' ? 'REFERENCE BRIEF ONLY for a Remotion mechanism canvas. ' : ''}Create one real dominant semi-photorealistic technical CGI object with real-world proportions. Render exactly the German label "${entry.imageLabel}". Full-bleed vertical 9:16 edge-to-edge image, no white or gray bands, no letterboxing, bottom 25 percent calm.`;
const goodPrompts = Object.fromEntries(goodScenes.map((entry) => [entry.id, promptFor(entry)]));
const good = evaluateElectricalVisualPolicy({plan: goodPlan, config, promptFiles: goodPrompts, promptManifest: {generatedImageTextPolicy: 'exact-german-short-labels'}});
assert.equal(good.passed, true, good.errors.join('\n'));

const badScenes = Array.from({length: 8}, (_, index) => scene(index, {
  headline: index === 0 ? 'Der unsichtbare Wächter des Stroms' : `Szene ${index + 1}`,
  voiceText: index === 0 ? 'Der elektrische Detektiv findet verlorenen Strom.' : 'Erklärung.',
  layout: 'image-mechanism',
  renderMode: 'image-with-overlay',
  motionLevel: 'full',
  mechanism: `mechanism-${index}`,
  overlayJustification: '',
  backgroundFamily: 'same-dark-blue',
}));
const bad = evaluateElectricalVisualPolicy({
  plan: {visualPolicyVersion: 'visual-v4', generatedImageTextPolicy: 'none', coverText: 'Falscher Hook', animationBudget: {maximum: 8, fullMechanismScenes: badScenes.map((entry) => entry.id)}, scenes: badScenes},
  config,
  promptFiles: Object.fromEntries(badScenes.map((entry) => [entry.id, 'Premium stylized 3D image with a white title panel and English text WARNING.'])),
  promptManifest: {generatedImageTextPolicy: 'none'},
});
assert.equal(bad.passed, false);
assert.ok(bad.errors.some((error) => error.includes('Hook') || error.includes('coverText')));
assert.ok(bad.errors.some((error) => error.includes('Vollanimationen')));
assert.ok(bad.errors.some((error) => error.includes('deutsche Bildbeschriftung') || error.includes('Full-bleed')));
assert.ok(bad.errors.some((error) => error.includes('Hintergrundfamilien')));

console.log('✓ Visual-v4 blockiert falsche Hooks, fehlende deutsche Labels, weiße Balken, gleiche Hintergründe und zu viele Animationen.');
