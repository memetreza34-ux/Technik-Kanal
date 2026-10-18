import {describe, expect, it} from 'vitest';
import {loadElectricalConfig} from './lib/load-electrical-config.mjs';

describe('science config regression', () => {
  it('supports the 6–7-minute profile without changing the short profile', () => {
    const short = loadElectricalConfig('youtube-2min-v1');
    const long = loadElectricalConfig('youtube-6to7min-v1');
    expect(short.format.durationSeconds).toEqual({min:90,ideal:120,max:150});
    expect(long.productionProfile).toBe('youtube-6to7min-v1');
    expect(long.format.durationSeconds).toEqual({min:360,ideal:390,max:420});
    expect(long.script.words).toEqual({min:850,ideal:975,max:1075});
    expect(long.visuals.beats).toEqual({min:34,ideal:46,max:50});
    expect(long.visuals.policyVersion).toBe('science-static-v1');
    expect(() => loadElectricalConfig('unknown-profile')).toThrow();
  });

  it('loads the 6–7-minute profile by default', () => {
    const config = loadElectricalConfig();
    expect(config.productionProfile).toBe('youtube-6to7min-v1');
    expect(config.format.durationSeconds).toEqual({min:360,ideal:390,max:420});
    expect(config.script.words).toEqual({min:850,ideal:975,max:1075});
    expect(config.visuals.beats).toEqual({min:34,ideal:46,max:50});
    expect(config.visuals.diversity.minimumDistinctVisualTypesPerVideo).toBe(7);
  });

  it('keeps the binding production rules (base values of the archived 2-minute profile)', () => {
    const config = loadElectricalConfig('youtube-2min-v1');
    expect(config.version).toBe('science-v1');
    expect(config.productionProfile).toBe('youtube-2min-v1');
    expect(config.voice.speed).toBe(1.1);
    expect(config.format).toMatchObject({width:1920,height:1080,fps:30,aspectRatio:'16:9'});
    expect(config.format.durationSeconds).toEqual({min:90,ideal:120,max:150});
    expect(config.script.words).toEqual({min:230,ideal:300,max:370});
    expect(config.script.narrativeStructure).toEqual(['hook','context','foundation','mechanism','deepening','payoff']);
    expect(config.script.rewriteWhenThreeAdjacentBeatsWouldLookSimilar).toBe(true);
    expect(config.script.splitBeatWhenImageBudgetWouldBeExceeded).toBe(true);
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
    expect(config.visuals.informationDensityPolicy).toBe('strict-minimum-necessary');
    expect(config.visuals.informationBudget).toMatchObject({
      oneDominantIdeaRequired:true,
      normalScenePreferredLabelsMax:1,
      normalSceneHardLabelsMax:2,
      diagramComparisonSummaryLabelsMax:3,
      normalScenePrimaryObjectsMax:3,
      diagramComparisonSummaryPrimaryObjectsMax:4,
      panelsMax:2,
      arrowsMax:2,
      annotationSystemsMax:1,
      fullSentenceTextAllowed:false,
      largeSceneHeadlineAllowed:false,
      floatingInfoBoxesPreferredMax:0,
      splitBeatWhenBudgetExceeded:true,
      coverExemptFromSceneDensityBudget:true,
    });
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
      deleteUnselectedThumbnailCandidatesAfterSelection:true,
      selectedThumbnailFinalName:'00-thumbnail-final',
      imageProductionSteps:5,
      balancedImageStepGrouping:true,
      pauseAfterEachImageProductionStep:false,
      continueAutomaticallyBetweenImageSteps:true,
      finalReportAfterAllImageSteps:true,
      sequentialSceneGenerationRequired:true,
      oneImagePerBeatRequired:true,
      finalFlowCollectionRequired:true,
      singleFinalFlowCollectionPerVideo:true,
      removeRejectedVariantsBeforeCompletion:true,
      renameFinalAssetsBeforeCompletion:true,
      finalCollectionContainsFinalAssetsOnly:true,
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
