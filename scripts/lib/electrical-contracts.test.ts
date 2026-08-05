import {describe, expect, it} from 'vitest';
import {AssetManifest, ScenePlan, normalizeWords} from './electrical-contracts.mjs';

describe('electrical contracts', () => {
  it('parses a minimal scene plan', () => {
    const plan = ScenePlan.parse({
      version: 'electrical-v1',
      slug: 'test',
      compositionId: 'ElectricalReel',
      fps: 30,
      width: 1080,
      height: 1920,
      scenes: [
        {id: '01-hook', title: 'Hook', voiceText: 'Warum fließt Strom?', imageDir: '02-bilder/images/01-hook'},
        {id: '02-payoff', title: 'Payoff', voiceText: 'Weil der Stromkreis geschlossen ist.', imageDir: '02-bilder/images/02-payoff'},
      ],
    });
    expect(plan.minimumWordMatchRatio).toBe(0.82);
  });

  it('normalizes German electrical terms', () => {
    expect(normalizeWords('Überlast und Kurzschluss!')).toEqual(['uberlast', 'und', 'kurzschluss']);
  });

  it('accepts an empty pre-production manifest', () => {
    const manifest = AssetManifest.parse({version: 'electrical-v1', slug: 'test', generatedAt: new Date().toISOString(), assets: []});
    expect(manifest.assets).toHaveLength(0);
  });
});
