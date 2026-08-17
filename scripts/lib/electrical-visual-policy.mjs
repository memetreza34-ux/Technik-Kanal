const wordCount = (value) => String(value ?? '').trim().split(/\s+/).filter(Boolean).length;
const lower = (value) => String(value ?? '').toLocaleLowerCase('de-DE');
export const resolveElectricalRenderMode = (scene) => scene.renderMode ?? (scene.layout === 'image-mechanism' ? 'image-with-overlay' : scene.layout === 'payoff' ? 'static-overlay' : 'image-only');
export const resolveElectricalMotionLevel = (scene) => scene.motionLevel ?? (resolveElectricalRenderMode(scene) === 'mechanism-only' ? 'subtle' : 'subtle');

export const evaluateElectricalVisualPolicy = ({plan, config, promptFiles = {}, promptManifest = null}) => {
  const errors = [];
  const warnings = [];
  const strict = plan.visualPolicyVersion === config.visuals.policyVersion;
  const scenes = plan.scenes ?? [];
  const firstScene = scenes[0];
  if (!strict) warnings.push(`Szenenplan verwendet noch nicht ${config.visuals.policyVersion}.`);
  if (scenes.length < config.visuals.beats.min || scenes.length > config.visuals.beats.max) errors.push(`Szenenzahl ${scenes.length} liegt außerhalb ${config.visuals.beats.min}–${config.visuals.beats.max}.`);
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

  const remotionScenes = scenes.filter((scene) => resolveElectricalRenderMode(scene) === 'mechanism-only');
  const externalScenes = scenes.filter((scene) => resolveElectricalRenderMode(scene) !== 'mechanism-only');
  const fullScenes = scenes.filter((scene) => resolveElectricalMotionLevel(scene) === 'full');
  if (strict) {
    if (remotionScenes.length < config.visuals.minimumRemotionScenes) errors.push(`Nur ${remotionScenes.length} Remotion-Szenen; mindestens ${config.visuals.minimumRemotionScenes} erforderlich.`);
    if (externalScenes.length > config.visuals.maximumPublicImageScenes) errors.push(`${externalScenes.length} externe Bildszenen; maximal ${config.visuals.maximumPublicImageScenes} erlaubt.`);
    if (plan.generatedImageTextPolicy !== 'none') errors.push('Remotion-first verwendet keine generierte Bildschrift.');
  }
  if (fullScenes.length > config.visuals.mechanismAnimations.maximum) errors.push(`${fullScenes.length} volle Prozessanimationen; maximal ${config.visuals.mechanismAnimations.maximum}.`);
  for (const scene of remotionScenes) if (!scene.mechanism?.trim()) errors.push(`${scene.id}: Remotion-Szene benötigt einen visual/mechanism-Identifier.`);
  for (const scene of externalScenes) {
    const prompt = promptFiles[scene.id];
    if (!prompt && strict) warnings.push(`${scene.id}: externe Bildszene ohne Prompt. Bei öffentlichen Bildern ist das erlaubt, wenn Quelle und Lizenz dokumentiert sind.`);
  }
  for (let index = 1; index < fullScenes.length; index += 1) {
    const previousIndex = scenes.findIndex((scene)=>scene.id===fullScenes[index-1].id);
    const currentIndex = scenes.findIndex((scene)=>scene.id===fullScenes[index].id);
    if (currentIndex - previousIndex === 1 && config.visuals.mechanismAnimations.maximumConsecutive < 2) errors.push(`Volle Prozessanimationen direkt hintereinander: ${fullScenes[index-1].id} → ${fullScenes[index].id}.`);
  }
  if (strict && promptManifest?.requiredVisibleSceneImages > config.visuals.maximumPublicImageScenes) errors.push('Prompt-Manifest fordert zu viele externe Bilder für Remotion-first.');
  return {passed:errors.length===0,strict,productionMode:strict?'remotion-first':'legacy',remotionSceneIds:remotionScenes.map((scene)=>scene.id),externalSceneIds:externalScenes.map((scene)=>scene.id),fullMechanismSceneIds:fullScenes.map((scene)=>scene.id),errors,warnings};
};
