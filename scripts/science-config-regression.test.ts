import {describe, expect, it} from 'vitest';
import {loadElectricalConfig} from './lib/load-electrical-config.mjs';

describe('science config regression', () => {
  it('keeps the binding production rules', () => {
    const config = loadElectricalConfig();
    expect(config.version).toBe('science-v1');
    expect(config.productionProfile).toBe('youtube-2min-v1');
    expect(config.voice.speed).toBe(1.1);
    expect(config.format).toMatchObject({width:1920,height:1080,fps:30,aspectRatio:'16:9'});
    expect(config.format.durationSeconds).toEqual({min:90,ideal:120,max:150});
    expect(config.script.words).toEqual({min:230,ideal:300,max:370});
    expect(config.script.narrativeStructure).toEqual(['hook','context','foundation','mechanism','deepening','payoff']);
    expect(config.script.rewriteWhenThreeAdjacentBeatsWouldLookSimilar).toBe(true);
    expect(config.visuals.beats).toEqual({min:12,ideal:20,max:28});
    expect(config.topicScope.identity).toBe('alltagswissenschaft-und-technik');
    expect(config.topicScope.audience).toBe('jugendliche-und-junge-erwachsene');
    expect(config.topicScope.biologyAllowed).toBe(false);
    expect(config.topicScope.medicineAllowed).toBe(false);
    expect(config.visuals.policyVersion).toBe('science-static-v1');
    expect(config.visuals.productionMode).toBe('flow-image-only');
    expect(config.visuals.animationAllowed).toBe(false);
    expect(config.visuals.cameraMotionAllowed).toBe(false);
    expect(config.visuals.styleId).toBe('scientific-scene-explainer-v1');
    expect(config.visuals.generatedImageTextPolicy).toBe('controlled-german-only');
    expect(config.visuals.visibleImageLanguage).toBe('de');
    expect(config.visuals.thumbnail).toEqual({required:true,width:1280,height:720,candidateCount:3});
    expect(config.visuals.diversity).toMatchObject({
      minimumDistinctVisualTypesPerVideo:5,
      sameCompositionMaxConsecutive:1,
      samePrimaryMotifMaxPerVideo:3,
      handOnObjectPrimaryMotifMaxPerVideo:3,
      minimumDistinctVisualTypesPerImageStepPreferred:3,
      largeGeneratedHeadlineInSceneImagesAllowed:false,
      preferredLabelsMax:2,
      blankOrFeaturelessVisibleFacesForbidden:true,
      thumbnailReferenceScope:'quality-and-illustration-style-only-not-layout-or-palette',
    });
    expect(config.visuals.flow).toMatchObject({
      masterPromptRequired:true,
      planRequired:true,
      thumbnailFirst:true,
      pauseAfterThumbnailCandidates:true,
      imageProductionSteps:5,
      balancedImageStepGrouping:true,
      pauseAfterEachImageProductionStep:true,
      sequentialSceneGenerationRequired:true,
      oneImagePerBeatRequired:true,
      imageOnly:true,
      aiVideoAllowed:false,
      clipsAllowed:false,
      remotionMayPlayFlowClips:false,
      remotionMayGenerateMotion:false,
    });
    expect(config.captions.enabled).toBe(false);
    expect(config.captions.burnedIn).toBe(false);
    expect(config.captions.internalTimingAllowed).toBe(true);
    expect(config.captions.animated).toBe(false);
    expect(config.alignment.minimumWordMatchRatio).toBeGreaterThanOrEqual(0.8);
    expect(config.safety.hazardousTopicDisclaimerRequired).toBe(true);
    expect(config.electricalSafety).toBeUndefined();
  });
});
