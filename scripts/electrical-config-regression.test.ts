import {describe, expect, it} from 'vitest';
import {loadElectricalConfig} from './lib/load-electrical-config.mjs';

describe('electrical config regression', () => {
  it('keeps the binding production rules', () => {
    const config = loadElectricalConfig();
    expect(config.voice.speed).toBe(1.1);
    expect(config.format).toMatchObject({width: 1080, height: 1920, fps: 30});
    expect(config.captions.backgroundBox).toBe(false);
    expect(config.captions.highlightColor).toBeNull();
    expect(config.visuals.cta.defaultEnabled).toBe(false);
    expect(config.alignment.minimumWordMatchRatio).toBeGreaterThanOrEqual(0.8);
    expect(config.electricalSafety.noLiveWorkInstructions).toBe(true);
  });
});
