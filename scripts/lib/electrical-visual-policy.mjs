const wordCount = (value) => String(value ?? '').trim().split(/\s+/).filter(Boolean).length;
export const resolveElectricalRenderMode = (scene) => scene.renderMode ?? 'image-only';
export const resolveElectricalMotionLevel = (scene) => scene.motionLevel ?? 'none';

export const evaluateElectricalVisualPolicy = ({plan, config, promptFiles = {}, promptManifest = null}) => {
  const errors = [];
  const warnings = [];
  const strict = plan.visualPolicyVersion === config.visuals.policyVersion;
  const scenes = plan.scenes ?? [];
  const firstScene = scenes[0];

  if (!strict) warnings.push(`Szenenplan verwendet noch nicht ${config.visuals.policyVersion}.`);
  if (scenes.length < config.visuals.beats.min || scenes.length > config.visuals.beats.max) {
    errors.push(`Szenenzahl ${scenes.length} liegt außerhalb ${config.visuals.beats.min}–${config.visuals.beats.max}.`);
  }

  if (firstScene) {
    const hook = firstScene.headline ?? firstScene.title;
    const hookVoice = firstScene.voiceText ?? '';
    const hookConfig = config.script.hook;
    if (hookConfig.mustContainQuestionMark && !hook.trim().endsWith('?')) errors.push('Hook muss eine direkte Frage sein.');
    if (wordCount(hook) > hookConfig.headlineWordsMax) errors.push(`Hook-Headline hat ${wordCount(hook)} Wörter.`);
    if (wordCount(hookVoice) > hookConfig.voiceWordsMax) errors.push(`Erste Voice-Szene hat ${wordCount(hookVoice)} Wörter.`);
    if (!hookVoice.includes('?')) errors.push('Der gesprochene Hook muss die Frage stellen.');
    if (!plan.coverText?.trim() || plan.coverText.trim() !== hook.trim()) errors.push('coverText muss exakt dem Hook entsprechen.');
  }

  const imageScenes = scenes.filter((scene) => resolveElectricalRenderMode(scene) === 'image-only');
  const animatedScenes = scenes.filter((scene) => resolveElectricalMotionLevel(scene) !== 'none');
  const mechanismScenes = scenes.filter((scene) => Boolean(scene.mechanism) || resolveElectricalRenderMode(scene) === 'mechanism-only');

  if (strict) {
    if (plan.generatedImageTextPolicy !== 'none') errors.push('Science Static erlaubt keine generierte Bildschrift.');
    if (imageScenes.length !== scenes.length) errors.push('Jede Science-Static-Szene muss renderMode "image-only" verwenden.');
    if (animatedScenes.length) errors.push(`Animation ist verboten: ${animatedScenes.map((scene) => scene.id).join(', ')}.`);
    if (mechanismScenes.length) errors.push(`Mechanismus-Visuals sind im Science-Static-Modus verboten: ${mechanismScenes.map((scene) => scene.id).join(', ')}.`);

    for (const scene of scenes) {
      if (scene.visualRecipe?.motion && scene.visualRecipe.motion !== 'none') errors.push(`${scene.id}: visualRecipe.motion muss "none" sein.`);
      if (!scene.imageDir?.trim()) errors.push(`${scene.id}: imageDir fehlt.`);
    }

    if (plan.animationBudget?.fullMechanismScenes?.length) errors.push('animationBudget darf keine Vollanimationen enthalten.');
    if (promptManifest?.requiredVisibleSceneImages !== undefined && promptManifest.requiredVisibleSceneImages !== scenes.length) {
      errors.push(`Prompt-Manifest fordert ${promptManifest.requiredVisibleSceneImages} Bilder; erwartet ${scenes.length}.`);
    }
    if (promptManifest?.cover?.sourceSceneId && promptManifest.cover.sourceSceneId !== firstScene?.id) {
      errors.push('Cover muss aus Bild 01 / der ersten Szene stammen.');
    }
  }

  for (const scene of scenes) {
    if (!promptFiles[scene.id] && strict) warnings.push(`${scene.id}: Einzelprompt fehlt noch.`);
  }

  return {
    passed: errors.length === 0,
    strict,
    productionMode: strict ? 'science-static' : 'legacy',
    imageSceneIds: imageScenes.map((scene) => scene.id),
    animatedSceneIds: animatedScenes.map((scene) => scene.id),
    mechanismSceneIds: mechanismScenes.map((scene) => scene.id),
    errors,
    warnings,
  };
};
