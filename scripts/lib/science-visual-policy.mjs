const wordCount = (value) => String(value ?? '').trim().split(/\s+/).filter(Boolean).length;

export const evaluateScienceVisualPolicy = ({plan, config, promptFiles = {}, promptManifest = null}) => {
  const errors = [];
  const warnings = [];
  const scenes = plan.scenes ?? [];
  const firstScene = scenes[0];

  if (plan.productionProfile !== config.productionProfile) errors.push(`Produktionsprofil muss ${config.productionProfile} sein.`);
  if (plan.width !== config.format.width || plan.height !== config.format.height) errors.push(`Video muss ${config.format.width}×${config.format.height} sein.`);
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
    if (promptManifest.generatedImageTextPolicy !== config.visuals.generatedImageTextPolicy) errors.push(`Prompt-Manifest muss ${config.visuals.generatedImageTextPolicy} verwenden.`);
    if (promptManifest.visibleImageLanguage !== 'de') errors.push('Prompt-Manifest muss Deutsch als sichtbare Bildsprache setzen.');
    if (promptManifest.styleId !== config.visuals.styleId) errors.push(`Prompt-Manifest muss styleId ${config.visuals.styleId} verwenden.`);
    if (promptManifest.cover?.imageRequired !== false) errors.push('Bild 01 darf nicht mehr als verpflichtendes Cover/Thumbnail verwendet werden.');
    if (promptManifest.cover?.separateThumbnailForbidden !== false) errors.push('Separates Thumbnail muss erlaubt sein.');
    if (promptManifest.thumbnail?.required !== true) errors.push('Separates YouTube-Thumbnail fehlt im Manifest.');
    if (promptManifest.thumbnail?.candidateCount !== config.visuals.thumbnail.candidateCount) errors.push(`Thumbnail muss ${config.visuals.thumbnail.candidateCount} Kandidaten vorsehen.`);
    if (promptManifest.thumbnail?.width !== config.visuals.thumbnail.width || promptManifest.thumbnail?.height !== config.visuals.thumbnail.height) errors.push('Thumbnail-Abmessungen stimmen nicht mit der Config überein.');
  }

  return {
    passed: errors.length === 0,
    productionMode: 'youtube-static-longform',
    productionProfile: config.productionProfile,
    imageSceneIds: scenes.map((scene) => scene.id),
    errors,
    warnings,
  };
};
