#!/usr/bin/env node
import assert from 'node:assert/strict';
import {loadElectricalConfig} from './lib/load-electrical-config.mjs';
import {evaluateElectricalVisualPolicy} from './lib/electrical-visual-policy.mjs';

const config = loadElectricalConfig();
const scene = (index, overrides = {}) => ({
  id: `${String(index + 1).padStart(2, '0')}-szene`,
  title: `Szene ${index + 1}`,
  headline: index === 0 ? 'Was macht ein Schutzgerät?' : `Klare Aussage ${index + 1}`,
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
  visualPolicyVersion: 'visual-v2',
  generatedImageTextPolicy: 'none',
  animationBudget: {maximum: 4, fullMechanismScenes: [goodScenes[2].id, goodScenes[5].id]},
  scenes: goodScenes,
};
const goodPrompt = 'One dominant subject in a simple dark technical scene. Keep the center clear for a Remotion mechanism canvas. No visible text, labels, numbers, units, UI, logos or watermark. Vertical 9:16, top 18 percent and bottom 25 percent clear.';
const goodPrompts = Object.fromEntries(goodScenes.map((entry) => [entry.id, goodPrompt]));
const good = evaluateElectricalVisualPolicy({
  plan: goodPlan,
  config,
  promptFiles: goodPrompts,
  promptManifest: {generatedImageTextPolicy: 'none'},
});
assert.equal(good.passed, true, good.errors.join('\n'));

const badScenes = Array.from({length: 8}, (_, index) => scene(index, {
  headline: index === 0 ? 'Der unsichtbare Wächter des Stroms' : `Szene ${index + 1}`,
  voiceText: index === 0 ? 'Der elektrische Detektiv findet verlorenen Strom.' : 'Erklärung.',
  layout: 'image-mechanism',
  renderMode: 'image-with-overlay',
  motionLevel: 'full',
  mechanism: `mechanism-${index}`,
  overlayJustification: '',
}));
const bad = evaluateElectricalVisualPolicy({
  plan: {visualPolicyVersion: 'visual-v2', generatedImageTextPolicy: 'none', animationBudget: {maximum: 8, fullMechanismScenes: badScenes.map((entry) => entry.id)}, scenes: badScenes},
  config,
  promptFiles: Object.fromEntries(badScenes.map((entry) => [entry.id, 'Show the word WARNING with the label CURRENT.'])),
  promptManifest: {generatedImageTextPolicy: 'generated'},
});
assert.equal(bad.passed, false);
assert.ok(bad.errors.some((error) => error.includes('Hook')));
assert.ok(bad.errors.some((error) => error.includes('Vollanimationen')));
assert.ok(bad.errors.some((error) => error.includes('sichtbaren Text') || error.includes('no visible text')));

console.log('✓ Visual-Policy blockiert Hook-, Text- und Animationsfehler.');
