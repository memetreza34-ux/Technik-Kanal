import {describe, expect, it} from 'vitest';
import {AssetManifest, ScenePlan, normalizeWords} from './electrical-contracts.mjs';

const scene = (id: string) => ({
  id,
  title: id,
  voiceText: 'Eine klare wissenschaftliche Aussage.',
  imageDir: `02-bilder/images/${id}`,
  visualRecipe: {
    stage: 'passend zum konkreten Skriptsatz wählen',
    camera: 'passend zur verständlichsten Darstellung wählen',
    subject: 'wissenschaftliches Hauptmotiv',
    focus: 'eine Aussage',
    motion: 'none' as const,
    callouts: [],
  },
  renderMode: 'image-only' as const,
  motionLevel: 'none' as const,
});

describe('science contracts', () => {
  it('parses a static ScienceReel scene plan', () => {
    const plan = ScenePlan.parse({
      version: 'science-v1',
      slug: 'test',
      compositionId: 'ScienceReel',
      runtimeFile: 'science-runtime.json',
      visualPolicyVersion: 'science-static-v1',
      generatedImageTextPolicy: 'controlled-german-only',
      fps: 30,
      width: 1080,
      height: 1920,
      scenes: [scene('01-hook'), scene('02-payoff')],
    });
    expect(plan.minimumWordMatchRatio).toBe(0.82);
    expect(plan.generatedImageTextPolicy).toBe('controlled-german-only');
    expect(plan.scenes.every((entry) => entry.renderMode === 'image-only' && entry.motionLevel === 'none')).toBe(true);
  });

  it('rejects legacy animation modes', () => {
    const result = ScenePlan.safeParse({
      version: 'science-v1',
      slug: 'test',
      compositionId: 'ScienceReel',
      runtimeFile: 'science-runtime.json',
      visualPolicyVersion: 'science-static-v1',
      generatedImageTextPolicy: 'controlled-german-only',
      fps: 30,
      width: 1080,
      height: 1920,
      scenes: [{...scene('01-hook'), renderMode: 'mechanism-only'}, scene('02-payoff')],
    });
    expect(result.success).toBe(false);
  });

  it('normalizes German terms', () => {
    expect(normalizeWords('Überlast und Atmosphäre!')).toEqual(['uberlast', 'und', 'atmosphare']);
  });

  it('accepts an empty pre-production asset manifest', () => {
    const manifest = AssetManifest.parse({version: 'science-v1', slug: 'test', generatedAt: new Date().toISOString(), assets: []});
    expect(manifest.assets).toHaveLength(0);
  });
});
