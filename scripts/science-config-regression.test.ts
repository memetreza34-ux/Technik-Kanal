import {describe, expect, it} from 'vitest';
import {loadElectricalConfig} from './lib/load-electrical-config.mjs';

describe('science config regression', () => {
  it('keeps the binding production rules', () => {
    const config = loadElectricalConfig();
    expect(config.version).toBe('science-v1');
    expect(config.voice.speed).toBe(1.1);
    expect(config.format).toMatchObject({width: 1080, height: 1920, fps: 30});
    expect(config.captions.backgroundBox).toBe(false);
    expect(config.captions.highlightColor).toBeNull();
    expect(config.visuals.policyVersion).toBe('science-static-v1');
    expect(config.visuals.animationAllowed).toBe(false);
    expect(config.visuals.cameraMotionAllowed).toBe(false);
    expect(config.visuals.brandVisualStyleDefined).toBe(true);
    expect(config.visuals.styleId).toBe('scientific-scene-explainer-v1');
    expect(config.visuals.generatedImageTextPolicy).toBe('controlled-german-only');
    expect(config.visuals.visibleImageLanguage).toBe('de');
    expect(config.visuals.fullFrameContextPreferredWhenUseful).toBe(true);
    expect(config.visuals.fixedBackgroundForbidden).toBe(true);
    expect(config.visuals.humanFiguresAllowedWhenExplanatory).toBe(true);
    expect(config.visuals.informationDensityPolicy).toBe('minimum-necessary');
    expect(config.alignment.minimumWordMatchRatio).toBeGreaterThanOrEqual(0.8);
    expect(config.safety.hazardousTopicDisclaimerRequired).toBe(true);
    expect(config.electricalSafety).toBeUndefined();
  });
});
