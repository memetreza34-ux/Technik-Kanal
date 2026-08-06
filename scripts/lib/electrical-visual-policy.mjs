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
  if (mode === 'mechanism-only' || mode === 'image-with-overlay') return 'full';
  return 'subtle';
};

const promptContainsSafeZone = (text, percent, area) => {
  const normalized = lower(text);
  const number = String(percent);
  return normalized.includes(`${area} ${number} percent`) || normalized.includes(`${area} ${number}%`);
};

const looksLikeOneClearSubject = (text, scene) => {
  const normalized = lower(text);
  if (scene.layout === 'comparison' || scene.imageRole === 'comparison') {
    return /side by side|clear comparison|two .* on the same/.test(normalized);
  }
  return /one dominant|single dominant|one clear|single clear|large and centered|one .* centered|the only dominant/.test(normalized);
};

const hasQuotedViewerText = (text) => /["“”][^"“”]{1,80}["“”]/.test(String(text));

export const evaluateElectricalVisualPolicy = ({plan, config, promptFiles = {}, promptManifest = null}) => {
  const errors = [];
  const warnings = [];
  const strict = plan.visualPolicyVersion === config.visuals.policyVersion;
  const scenes = plan.scenes ?? [];
  const firstScene = scenes[0];

  if (!strict) {
    warnings.push(`Szenenplan verwendet noch nicht ${config.visuals.policyVersion}; neue Reels müssen diese Version verwenden.`);
  }

  if (scenes.length < config.visuals.beats.min || scenes.length > config.visuals.beats.max) {
    errors.push(`Szenenzahl ${scenes.length} liegt außerhalb ${config.visuals.beats.min}–${config.visuals.beats.max}.`);
  }

  if (firstScene) {
    const hook = firstScene.headline ?? firstScene.title;
    const hookVoice = firstScene.voiceText ?? '';
    const hookConfig = config.script.hook;
    if (hookConfig.mustContainQuestionMark && !hook.trim().endsWith('?')) {
      errors.push('Hook muss eine direkte Frage sein und mit einem Fragezeichen enden.');
    }
    if (wordCount(hook) > hookConfig.headlineWordsMax) {
      errors.push(`Hook-Headline hat ${wordCount(hook)} Wörter; maximal ${hookConfig.headlineWordsMax}.`);
    }
    if (wordCount(hookVoice) > hookConfig.voiceWordsMax) {
      errors.push(`Erste Voice-Szene hat ${wordCount(hookVoice)} Wörter; maximal ${hookConfig.voiceWordsMax}.`);
    }
    if (!hookVoice.includes('?')) errors.push('Der gesprochene Hook muss die zentrale Frage ausdrücklich stellen.');
    const combined = lower(`${hook} ${hookVoice}`);
    for (const phrase of hookConfig.forbiddenMetaphors) {
      if (combined.includes(lower(phrase))) errors.push(`Künstliche Hook-Metapher verboten: "${phrase}".`);
    }
  }

  const fullScenes = scenes.filter((scene) => resolveElectricalMotionLevel(scene) === 'full');
  const overlayScenes = scenes.filter((scene) => resolveElectricalRenderMode(scene) === 'image-with-overlay');
  const budget = config.visuals.mechanismAnimations;

  if (fullScenes.length > budget.maximum) {
    errors.push(`${fullScenes.length} Vollanimationen; maximal ${budget.maximum}.`);
  }
  if (firstScene && resolveElectricalMotionLevel(firstScene) === 'full' && !budget.firstSceneAllowed) {
    errors.push('Die Hook-Szene darf keine vollständige Mechanismus-Animation enthalten.');
  }
  if (overlayScenes.length > budget.maximumOverlayMechanisms) {
    errors.push(`${overlayScenes.length} Bild-plus-Mechanismus-Overlays; maximal ${budget.maximumOverlayMechanisms}.`);
  }

  for (let index = 1; index < scenes.length; index += 1) {
    if (resolveElectricalMotionLevel(scenes[index - 1]) === 'full' && resolveElectricalMotionLevel(scenes[index]) === 'full') {
      errors.push(`Vollanimationen dürfen nicht direkt aufeinander folgen: ${scenes[index - 1].id} → ${scenes[index].id}.`);
    }
  }

  for (const scene of scenes) {
    const mode = resolveElectricalRenderMode(scene);
    const motion = resolveElectricalMotionLevel(scene);
    if (motion === 'full' && !scene.mechanism) errors.push(`${scene.id}: Vollanimation ohne mechanism-Bezeichner.`);
    if (mode === 'image-only' && scene.mechanism) errors.push(`${scene.id}: image-only darf keinen Mechanismus rendern.`);
    if (mode === 'image-with-overlay' && budget.overlayRequiresJustification && wordCount(scene.overlayJustification) < 5) {
      errors.push(`${scene.id}: Bild-plus-Mechanismus benötigt eine konkrete overlayJustification.`);
    }
    if (mode === 'mechanism-only' && motion !== 'full') errors.push(`${scene.id}: mechanism-only muss motionLevel "full" verwenden.`);
  }

  if (plan.animationBudget) {
    if (plan.animationBudget.maximum > budget.maximum) {
      errors.push(`animationBudget.maximum ist ${plan.animationBudget.maximum}; erlaubt sind höchstens ${budget.maximum}.`);
    }
    const actualIds = fullScenes.map((scene) => scene.id).sort();
    const declaredIds = [...plan.animationBudget.fullMechanismScenes].sort();
    if (JSON.stringify(actualIds) !== JSON.stringify(declaredIds)) {
      errors.push('animationBudget.fullMechanismScenes stimmt nicht mit renderMode/motionLevel der Szenen überein.');
    }
  } else if (strict) {
    errors.push('animationBudget fehlt im Szenenplan.');
  }

  if (strict && plan.generatedImageTextPolicy !== 'none') {
    errors.push('generatedImageTextPolicy muss "none" sein.');
  }
  if (promptManifest && promptManifest.generatedImageTextPolicy !== 'none') {
    errors.push('Prompt-Manifest muss generatedImageTextPolicy "none" setzen.');
  }

  for (const scene of scenes) {
    const prompt = promptFiles[scene.id];
    if (!prompt) {
      errors.push(`${scene.id}: Einzelprompt fehlt.`);
      continue;
    }
    const normalized = lower(prompt);
    if (config.visuals.imagePrompt.mustStateNoVisibleText && !normalized.includes('no visible text')) {
      errors.push(`${scene.id}: Prompt muss "no visible text" ausdrücklich enthalten.`);
    }
    if (config.visuals.imagePrompt.mustStateOneClearIdea && !looksLikeOneClearSubject(prompt, scene)) {
      errors.push(`${scene.id}: Prompt braucht ein klares dominantes Hauptmotiv oder einen klaren Zweiervergleich.`);
    }
    if (!promptContainsSafeZone(prompt, config.visuals.imagePrompt.mustReserveTopPercent, 'top')) {
      errors.push(`${scene.id}: obere ${config.visuals.imagePrompt.mustReserveTopPercent}% Sicherheitszone fehlt im Prompt.`);
    }
    if (!promptContainsSafeZone(prompt, config.visuals.imagePrompt.mustReserveBottomPercent, 'bottom')) {
      errors.push(`${scene.id}: untere ${config.visuals.imagePrompt.mustReserveBottomPercent}% Sicherheitszone fehlt im Prompt.`);
    }
    if (!config.visuals.imagePrompt.quotationMarksAllowed && hasQuotedViewerText(prompt)) {
      errors.push(`${scene.id}: Prompt enthält Anführungszeichen und könnte sichtbaren KI-Text anfordern.`);
    }
    for (const phrase of config.visuals.imagePrompt.forbiddenPositiveTextRequests) {
      if (normalized.includes(lower(phrase))) errors.push(`${scene.id}: Prompt fordert sichtbaren Text an: "${phrase}".`);
    }
    if (resolveElectricalRenderMode(scene) === 'mechanism-only' && !/remotion|mechanism canvas|keep .* clear|simple .* plate/.test(normalized)) {
      errors.push(`${scene.id}: Mechanismus-Szene braucht eine ausdrücklich einfache, overlay-sichere Bildfläche.`);
    }
  }

  if (fullScenes.length < budget.recommended.min) {
    warnings.push('Keine oder sehr wenige Mechanismus-Animationen. Das ist erlaubt, sollte aber bewusst entschieden sein.');
  }
  if (fullScenes.length > budget.recommended.max) {
    warnings.push(`${fullScenes.length} Vollanimationen liegen über dem empfohlenen Maximum ${budget.recommended.max}.`);
  }

  return {
    passed: errors.length === 0,
    strict,
    fullMechanismSceneIds: fullScenes.map((scene) => scene.id),
    overlaySceneIds: overlayScenes.map((scene) => scene.id),
    errors,
    warnings,
  };
};
