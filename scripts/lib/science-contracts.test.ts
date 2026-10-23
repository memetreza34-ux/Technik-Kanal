import {describe, expect, it} from 'vitest';
import {AssetManifest, ScenePlan, normalizeWords} from './electrical-contracts.mjs';

const scene = (id: string, section: 'hook'|'context'|'foundation'|'mechanism'|'deepening'|'payoff' = 'mechanism') => ({
  id,
  title: id,
  section,
  voiceText: 'Eine klare wissenschaftliche Aussage.',
  imageDir: `02-bilder/images/${id}`,
  visualRecipe: {
    stage: 'passend zur konkreten visuellen Aussage wählen',
    camera: 'passend zur verständlichsten Darstellung wählen',
    subject: 'wissenschaftliches Hauptmotiv',
    focus: 'eine visuelle Hauptaussage',
    motion: 'none' as const,
    callouts: [],
  },
  renderMode: 'image-only' as const,
  motionLevel: 'none' as const,
});

describe('science contracts', () => {
  it('parses a static 16:9 YouTube scene plan', () => {
    const plan = ScenePlan.parse({
      version: 'science-v1',
      productionProfile: 'youtube-2min-v1',
      slug: 'test',
      compositionId: 'ScienceReel',
      runtimeFile: 'science-runtime.json',
      visualPolicyVersion: 'science-static-v1',
      generatedImageTextPolicy: 'controlled-german-only',
      fps: 30,
      width: 1920,
      height: 1080,
      scenes: [scene('01-hook','hook'), scene('02-payoff','payoff')],
    });
    expect(plan.minimumWordMatchRatio).toBe(0.82);
    expect(plan.generatedImageTextPolicy).toBe('controlled-german-only');
    expect(plan.width).toBe(1920);
    expect(plan.height).toBe(1080);
    expect(plan.scenes.every((entry) => entry.renderMode === 'image-only' && entry.motionLevel === 'none')).toBe(true);
  });

  it('rejects legacy animation modes', () => {
    const result = ScenePlan.safeParse({
      version: 'science-v1',
      productionProfile: 'youtube-2min-v1',
      slug: 'test',
      compositionId: 'ScienceReel',
      runtimeFile: 'science-runtime.json',
      visualPolicyVersion: 'science-static-v1',
      generatedImageTextPolicy: 'controlled-german-only',
      fps: 30,
      width: 1920,
      height: 1080,
      scenes: [{...scene('01-hook','hook'), renderMode: 'mechanism-only'}, scene('02-payoff','payoff')],
    });
    expect(result.success).toBe(false);
  });

  it('allows up to 28 visual beats', () => {
    const scenes = Array.from({length: 28}, (_, index) => scene(`s${index+1}`, index===0?'hook':index===27?'payoff':'mechanism'));
    const result = ScenePlan.safeParse({
      version:'science-v1',productionProfile:'youtube-2min-v1',slug:'longform',compositionId:'ScienceReel',runtimeFile:'science-runtime.json',visualPolicyVersion:'science-static-v1',generatedImageTextPolicy:'controlled-german-only',fps:30,width:1920,height:1080,scenes
    });
    expect(result.success).toBe(true);
  });

  it('normalizes German terms', () => {
    expect(normalizeWords('Überlast und Atmosphäre!')).toEqual(['uberlast', 'und', 'atmosphare']);
  });

  it('accepts an empty pre-production asset manifest', () => {
    const manifest = AssetManifest.parse({version: 'science-v1', slug: 'test', generatedAt: new Date().toISOString(), assets: []});
    expect(manifest.assets).toHaveLength(0);
  });
});
