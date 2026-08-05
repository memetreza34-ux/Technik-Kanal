import {describe, expect, it} from 'vitest';
import {AssetManifestSchema, ElectricalScenePlanSchema, WordTimestampSchema} from './schemas';

describe('electrical schemas', () => {
  it('accepts a valid scene plan', () => {
    const parsed = ElectricalScenePlanSchema.parse({
      version: 2,
      slug: 'test-reel',
      compositionId: 'ElectricalReel',
      fps: 30,
      width: 1080,
      height: 1920,
      scenes: [
        {id: '01-hook', title: 'Hook', voiceText: 'Warum?', imageDir: '02-bilder/images/01-hook'},
        {id: '02-payoff', title: 'Payoff', voiceText: 'Darum.', imageDir: '02-bilder/images/02-payoff'},
      ],
    });
    expect(parsed.minimumWordMatchRatio).toBe(0.82);
  });

  it('rejects backwards word timestamps', () => {
    expect(() => WordTimestampSchema.parse({text: 'Strom', startMs: 500, endMs: 400})).toThrow();
  });

  it('accepts an empty pre-production asset manifest', () => {
    expect(AssetManifestSchema.parse({version: 1, slug: 'test', generatedAt: new Date().toISOString(), assets: []}).assets).toHaveLength(0);
  });
});
