const wordCount = (value) => String(value ?? '').trim().split(/\s+/).filter(Boolean).length;

export const evaluateScienceVisualPolicy = ({plan, config, promptFiles = {}, promptManifest = null}) => {
  const errors = [];
  const warnings = [];
  const scenes = plan.scenes ?? [];
  const firstScene = scenes[0];

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

  for (const scene of scenes) {
    if (!scene.imageDir?.trim()) errors.push(`${scene.id}: imageDir fehlt.`);
    if (!promptFiles[scene.id]) errors.push(`${scene.id}: Einzelprompt fehlt.`);
  }

  if (plan.generatedImageTextPolicy !== config.visuals.generatedImageTextPolicy) {
    errors.push(`Scene-Plan nutzt ${plan.generatedImageTextPolicy}; erwartet ${config.visuals.generatedImageTextPolicy}.`);
  }

  if (!promptManifest) errors.push('Prompt-Manifest fehlt.');
  else {
    if (promptManifest.requiredVisibleSceneImages !== scenes.length) {
      errors.push(`Prompt-Manifest fordert ${promptManifest.requiredVisibleSceneImages} Bilder; erwartet ${scenes.length}.`);
    }
    if (promptManifest.cover?.sourceSceneId !== firstScene?.id) errors.push('Cover muss aus Bild 01 / der ersten Szene stammen.');
    if (promptManifest.cover?.candidateCount !== 3) errors.push('Bild 01 muss drei Cover-Kandidaten vorsehen.');
    if (promptManifest.generatedImageTextPolicy !== config.visuals.generatedImageTextPolicy) {
      errors.push(`Prompt-Manifest muss ${config.visuals.generatedImageTextPolicy} verwenden.`);
    }
    if (config.visuals.generatedImageTextPolicy === 'controlled-german-only' && promptManifest.visibleImageLanguage !== 'de') {
      errors.push('Prompt-Manifest muss sichtbaren Bildtext auf Deutsch festlegen.');
    }
    if (config.visuals.brandVisualStyleDefined === true && promptManifest.styleId !== config.visuals.styleId) {
      errors.push(`Prompt-Manifest muss styleId ${config.visuals.styleId} verwenden.`);
    }
  }

  return {
    passed: errors.length === 0,
    productionMode: 'science-static',
    imageSceneIds: scenes.map((scene) => scene.id),
    errors,
    warnings,
  };
};
