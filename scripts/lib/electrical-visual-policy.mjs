const wordCount = (value) => String(value ?? '').trim().split(/\s+/).filter(Boolean).length;
const lower = (value) => String(value ?? '').toLocaleLowerCase('de-DE');

export const resolveElectricalRenderMode = (scene) => {
  if (scene.renderMode) return scene.renderMode;
  if (scene.layout === 'image-mechanism') return 'image-with-overlay';
  if (scene.layout === 'payoff') return 'static-overlay';
  return 'image-only';
};

export const resolveElectricalMotionLevel = (scene) => {
  if (scene.motionLevel) return scene.motionLevel;
  const mode = resolveElectricalRenderMode(scene);
  return mode === 'mechanism-only' || mode === 'image-with-overlay' ? 'full' : 'subtle';
};

const looksLikeOneClearSubject = (text, scene) => {
  const normalized = lower(text);
  if (scene.layout === 'comparison' || scene.imageRole === 'comparison') return /comparison|on the left.*on the right|same cabinet/.test(normalized);
  return /same .* reference|one real|one dominant|single clear|same compact|one physically accurate/.test(normalized);
};

const hasCinematicSeriesStyle = (text) => {
  const normalized = lower(text);
  const cinematic = normalized.includes('cinematic industrial editorial') || normalized.includes('cinematic technical visualization');
  return cinematic && normalized.includes('consistent teal-shadow') && normalized.includes('warm-highlight color grade');
};

const hasFullBleedRules = (text) => {
  const normalized = lower(text);
  return normalized.includes('full-bleed') && normalized.includes('edge-to-edge') && normalized.includes('no white or gray bars') && normalized.includes('no letterboxing');
};

const hasNoVisibleText = (text) => {
  const normalized = lower(text);
  return normalized.includes('no visible text') && normalized.includes('no labels') && normalized.includes('no logos');
};

const requestsAiText = (text) => {
  const normalized = lower(text);
  return /render (?:the )?(?:exact )?(?:german )?(?:hook|label|text)|show the word|with the label|readable marking|typography inside/.test(normalized) || /["“”][^"“”]{2,80}["“”]/.test(String(text));
};

const positiveCatalogStyle = (text) => {
  const normalized = lower(text);
  return [
    /isolated product on/,
    /clean product catalog/,
    /amazon product photo/,
    /floating object/,
    /blank studio background/,
    /centered front view on plain/,
  ].some((pattern) => pattern.test(normalized));
};

const positiveToyStyle = (text) => [
  /premium stylized 3d/,
  /pixar[- ]style/,
  /cartoon(?:ish)?/,
  /toy[- ]like/,
  /miniature render/,
].some((pattern) => pattern.test(lower(text)));

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
    const combined = lower(`${hook} ${hookVoice}`);
    for (const phrase of hookConfig.forbiddenMetaphors) if (combined.includes(lower(phrase))) errors.push(`Künstliche Hook-Metapher verboten: ${phrase}`);
    if (!plan.coverText?.trim()) errors.push('coverText fehlt.');
    else if (plan.coverText.trim() !== hook.trim()) errors.push('coverText und Hook müssen identisch sein.');
  }

  const fullScenes = scenes.filter((scene) => resolveElectricalMotionLevel(scene) === 'full');
  const overlayScenes = scenes.filter((scene) => resolveElectricalRenderMode(scene) === 'image-with-overlay');
  const budget = config.visuals.mechanismAnimations;
  if (fullScenes.length > budget.maximum) errors.push(`${fullScenes.length} Vollanimationen; maximal ${budget.maximum}.`);
  if (firstScene && resolveElectricalMotionLevel(firstScene) === 'full') errors.push('Die Hook-Szene darf keine Vollanimation enthalten.');
  if (overlayScenes.length > budget.maximumOverlayMechanisms) errors.push('Zu viele Bild-plus-Mechanismus-Szenen.');
  for (let index = 1; index < scenes.length; index += 1) {
    if (resolveElectricalMotionLevel(scenes[index - 1]) === 'full' && resolveElectricalMotionLevel(scenes[index]) === 'full') errors.push(`Vollanimationen folgen direkt aufeinander: ${scenes[index - 1].id} → ${scenes[index].id}.`);
  }

  for (const scene of scenes) {
    const mode = resolveElectricalRenderMode(scene);
    const motion = resolveElectricalMotionLevel(scene);
    if (motion === 'full' && !scene.mechanism) errors.push(`${scene.id}: Vollanimation ohne mechanism.`);
    if (mode === 'image-only' && scene.mechanism) errors.push(`${scene.id}: image-only darf keinen Mechanismus rendern.`);
    if (mode === 'image-with-overlay' && budget.overlayRequiresJustification && wordCount(scene.overlayJustification) < 5) errors.push(`${scene.id}: overlayJustification fehlt.`);
    if (mode === 'mechanism-only' && motion !== 'full') errors.push(`${scene.id}: mechanism-only muss full sein.`);
    if (strict && !scene.imageLabel?.trim()) errors.push(`${scene.id}: imageLabel fehlt.`);
    if (strict && !scene.backgroundFamily?.trim()) errors.push(`${scene.id}: backgroundFamily fehlt.`);
    if (strict && !scene.shotType?.trim()) errors.push(`${scene.id}: shotType fehlt.`);
    if (strict && !scene.referenceGroup?.trim()) errors.push(`${scene.id}: referenceGroup fehlt.`);
  }

  if (strict) {
    const requiredPolicy = config.visuals.generatedImageTextPolicy;
    if (plan.generatedImageTextPolicy !== requiredPolicy) errors.push(`generatedImageTextPolicy muss ${requiredPolicy} sein.`);
    if (promptManifest?.generatedImageTextPolicy !== requiredPolicy) errors.push(`Prompt-Manifest muss ${requiredPolicy} verwenden.`);
    const visible = scenes.filter((scene) => resolveElectricalRenderMode(scene) !== 'mechanism-only');
    const backgrounds = new Set(visible.map((scene) => scene.backgroundFamily).filter(Boolean));
    const shots = new Set(visible.map((scene) => scene.shotType).filter(Boolean));
    const references = new Set(scenes.map((scene) => scene.referenceGroup).filter(Boolean));
    if (backgrounds.size < config.visuals.minimumBackgroundFamilies || backgrounds.size > config.visuals.maximumBackgroundFamilies) errors.push(`${backgrounds.size} Set-Familien; erlaubt sind ${config.visuals.minimumBackgroundFamilies}–${config.visuals.maximumBackgroundFamilies}.`);
    if (shots.size < config.visuals.minimumShotTypes) errors.push(`Nur ${shots.size} Kameratypen; mindestens ${config.visuals.minimumShotTypes}.`);
    if (references.size < config.visuals.minimumReferenceGroups || references.size > config.visuals.maximumReferenceGroups) errors.push(`${references.size} Referenzgruppen; erlaubt sind ${config.visuals.minimumReferenceGroups}–${config.visuals.maximumReferenceGroups}.`);
  }

  for (const scene of scenes) {
    const prompt = promptFiles[scene.id];
    if (!prompt) {
      errors.push(`${scene.id}: Einzelprompt fehlt.`);
      continue;
    }
    if (!strict) continue;
    if (!looksLikeOneClearSubject(prompt, scene)) errors.push(`${scene.id}: kein klares Motiv oder keine Serienreferenz.`);
    if (!hasCinematicSeriesStyle(prompt)) errors.push(`${scene.id}: cinematic series style oder Seriengrading fehlt.`);
    if (!hasFullBleedRules(prompt)) errors.push(`${scene.id}: Full-bleed-Regeln fehlen.`);
    if (!hasNoVisibleText(prompt)) errors.push(`${scene.id}: AI-Basisbild muss Text, Labels und Logos verbieten.`);
    if (requestsAiText(prompt)) errors.push(`${scene.id}: Prompt fordert unzuverlässige KI-Schrift an.`);
    if (!lower(prompt).includes('not a catalog shot')) errors.push(`${scene.id}: Katalogfoto muss ausdrücklich ausgeschlossen werden.`);
    if (positiveCatalogStyle(prompt)) errors.push(`${scene.id}: Prompt fordert einen Katalog-/Floating-Stil an.`);
    if (positiveToyStyle(prompt)) errors.push(`${scene.id}: spielzeugartiger Stil erkannt.`);
    if (resolveElectricalRenderMode(scene) === 'mechanism-only' && !/reference brief only|remotion mechanism canvas/.test(lower(prompt))) errors.push(`${scene.id}: Mechanismus-Szene braucht ein Remotion-Referenzbriefing.`);
  }

  if (fullScenes.length > budget.recommended.max) warnings.push(`${fullScenes.length} Vollanimationen liegen über dem empfohlenen Maximum.`);
  return {passed:errors.length===0,strict,fullMechanismSceneIds:fullScenes.map((scene)=>scene.id),overlaySceneIds:overlayScenes.map((scene)=>scene.id),errors,warnings};
};
