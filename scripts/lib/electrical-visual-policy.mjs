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
  return normalized.includes(`${area} ${percent} percent`) || normalized.includes(`${area} ${percent}%`);
};

const looksLikeOneClearSubject = (text, scene) => {
  const normalized = lower(text);
  if (scene.layout === 'comparison' || scene.imageRole === 'comparison') return /side by side|comparison|on the left.*on the right/.test(normalized);
  return /one real|one dominant|large and centered|large on a realistic|one physically correct/.test(normalized);
};

const hasProfessionalRealism = (text) => {
  const normalized = lower(text);
  return normalized.includes('semi-photorealistic technical cgi') && normalized.includes('real-world proportions');
};

const positiveToyStyle = (text) => [
  /premium stylized 3d/,
  /stylized 3d editorial/,
  /simplified credible geometry/,
  /pixar[- ]style/,
  /cartoon(?:ish)? (?:style|aesthetic|render)/,
  /toy[- ]like (?:style|aesthetic|render)/,
].some((pattern) => pattern.test(lower(text)));

const containsExactLabel = (prompt, label) => {
  if (!label?.trim()) return false;
  const labels = label.split('|').map((value) => value.trim()).filter(Boolean);
  return labels.every((entry) => prompt.includes(`"${entry}"`) || prompt.includes(`“${entry}”`) || prompt.includes(entry));
};

const hasFullBleedRules = (prompt) => {
  const normalized = lower(prompt);
  return normalized.includes('full-bleed')
    && normalized.includes('edge-to-edge')
    && /no white or gray (?:bands|bars)/.test(normalized)
    && normalized.includes('no letterboxing');
};

export const evaluateElectricalVisualPolicy = ({plan, config, promptFiles = {}, promptManifest = null}) => {
  const errors = [];
  const warnings = [];
  const strict = plan.visualPolicyVersion === config.visuals.policyVersion;
  const scenes = plan.scenes ?? [];
  const firstScene = scenes[0];

  if (!strict) warnings.push(`Szenenplan verwendet noch nicht ${config.visuals.policyVersion}; neue Reels müssen diese Version verwenden.`);
  if (scenes.length < config.visuals.beats.min || scenes.length > config.visuals.beats.max) errors.push(`Szenenzahl ${scenes.length} liegt außerhalb ${config.visuals.beats.min}–${config.visuals.beats.max}.`);

  if (firstScene) {
    const hook = firstScene.headline ?? firstScene.title;
    const hookVoice = firstScene.voiceText ?? '';
    const hookConfig = config.script.hook;
    if (hookConfig.mustContainQuestionMark && !hook.trim().endsWith('?')) errors.push('Hook muss eine direkte Frage sein und mit einem Fragezeichen enden.');
    if (wordCount(hook) > hookConfig.headlineWordsMax) errors.push(`Hook-Headline hat ${wordCount(hook)} Wörter; maximal ${hookConfig.headlineWordsMax}.`);
    if (wordCount(hookVoice) > hookConfig.voiceWordsMax) errors.push(`Erste Voice-Szene hat ${wordCount(hookVoice)} Wörter; maximal ${hookConfig.voiceWordsMax}.`);
    if (!hookVoice.includes('?')) errors.push('Der gesprochene Hook muss die zentrale Frage ausdrücklich stellen.');
    const combined = lower(`${hook} ${hookVoice}`);
    for (const phrase of hookConfig.forbiddenMetaphors) if (combined.includes(lower(phrase))) errors.push(`Künstliche Hook-Metapher verboten: "${phrase}".`);
    if (!plan.coverText?.trim()) errors.push('coverText fehlt.');
    else if (plan.coverText.trim() !== hook.trim()) errors.push('coverText und Hook-Headline müssen identisch sein.');
  }

  const fullScenes = scenes.filter((scene) => resolveElectricalMotionLevel(scene) === 'full');
  const overlayScenes = scenes.filter((scene) => resolveElectricalRenderMode(scene) === 'image-with-overlay');
  const budget = config.visuals.mechanismAnimations;
  if (fullScenes.length > budget.maximum) errors.push(`${fullScenes.length} Vollanimationen; maximal ${budget.maximum}.`);
  if (firstScene && resolveElectricalMotionLevel(firstScene) === 'full' && !budget.firstSceneAllowed) errors.push('Die Hook-Szene darf keine vollständige Mechanismus-Animation enthalten.');
  if (overlayScenes.length > budget.maximumOverlayMechanisms) errors.push(`${overlayScenes.length} Bild-plus-Mechanismus-Overlays; maximal ${budget.maximumOverlayMechanisms}.`);
  for (let index = 1; index < scenes.length; index += 1) {
    if (resolveElectricalMotionLevel(scenes[index - 1]) === 'full' && resolveElectricalMotionLevel(scenes[index]) === 'full') errors.push(`Vollanimationen dürfen nicht direkt aufeinander folgen: ${scenes[index - 1].id} → ${scenes[index].id}.`);
  }

  for (const scene of scenes) {
    const mode = resolveElectricalRenderMode(scene);
    const motion = resolveElectricalMotionLevel(scene);
    if (motion === 'full' && !scene.mechanism) errors.push(`${scene.id}: Vollanimation ohne mechanism-Bezeichner.`);
    if (mode === 'image-only' && scene.mechanism) errors.push(`${scene.id}: image-only darf keinen Mechanismus rendern.`);
    if (mode === 'image-with-overlay' && budget.overlayRequiresJustification && wordCount(scene.overlayJustification) < 5) errors.push(`${scene.id}: Bild-plus-Mechanismus benötigt eine konkrete overlayJustification.`);
    if (mode === 'mechanism-only' && motion !== 'full') errors.push(`${scene.id}: mechanism-only muss motionLevel "full" verwenden.`);
    if (!scene.imageLabel?.trim()) errors.push(`${scene.id}: imageLabel fehlt.`);
    if (!scene.backgroundFamily?.trim()) errors.push(`${scene.id}: backgroundFamily fehlt.`);
  }

  if (plan.animationBudget) {
    if (plan.animationBudget.maximum > budget.maximum) errors.push(`animationBudget.maximum ist ${plan.animationBudget.maximum}; erlaubt sind höchstens ${budget.maximum}.`);
    const actualIds = fullScenes.map((scene) => scene.id).sort();
    const declaredIds = [...plan.animationBudget.fullMechanismScenes].sort();
    if (JSON.stringify(actualIds) !== JSON.stringify(declaredIds)) errors.push('animationBudget.fullMechanismScenes stimmt nicht mit den Szenen überein.');
  } else if (strict) errors.push('animationBudget fehlt im Szenenplan.');

  const requiredTextPolicy = config.visuals.generatedImageTextPolicy;
  if (strict && plan.generatedImageTextPolicy !== requiredTextPolicy) errors.push(`generatedImageTextPolicy muss "${requiredTextPolicy}" sein.`);
  if (promptManifest && promptManifest.generatedImageTextPolicy !== requiredTextPolicy) errors.push(`Prompt-Manifest muss generatedImageTextPolicy "${requiredTextPolicy}" setzen.`);

  const visibleScenes = scenes.filter((scene) => resolveElectricalRenderMode(scene) !== 'mechanism-only');
  const backgroundFamilies = new Set(visibleScenes.map((scene) => scene.backgroundFamily).filter(Boolean));
  if (backgroundFamilies.size < config.visuals.minimumBackgroundFamilies) errors.push(`Nur ${backgroundFamilies.size} Hintergrundfamilien; mindestens ${config.visuals.minimumBackgroundFamilies}.`);

  for (const scene of scenes) {
    const prompt = promptFiles[scene.id];
    if (!prompt) {
      errors.push(`${scene.id}: Einzelprompt fehlt.`);
      continue;
    }
    const normalized = lower(prompt);
    if (!looksLikeOneClearSubject(prompt, scene)) errors.push(`${scene.id}: Prompt braucht ein klares Hauptmotiv oder einen klaren Zweiervergleich.`);
    if (!promptContainsSafeZone(prompt, config.visuals.imagePrompt.mustReserveBottomPercent, 'bottom')) errors.push(`${scene.id}: untere Sicherheitszone fehlt.`);
    if (!containsExactLabel(prompt, scene.imageLabel)) errors.push(`${scene.id}: exakte deutsche Bildbeschriftung fehlt im Prompt: ${scene.imageLabel}`);
    if (!hasFullBleedRules(prompt)) errors.push(`${scene.id}: Full-bleed-Regeln gegen weiße Balken oder Letterboxing fehlen.`);
    if (!hasProfessionalRealism(prompt)) errors.push(`${scene.id}: Prompt muss semi-photorealistische technische CGI und reale Proportionen festlegen.`);
    if (positiveToyStyle(prompt)) errors.push(`${scene.id}: Prompt enthält weiterhin einen spielzeugartigen oder stilisierten 3D-Stil.`);
    if (/render exactly.*\b(?:on|off|warning|current|return|earth|fault)\b/i.test(prompt)) errors.push(`${scene.id}: sichtbare englische Beschriftung angefordert.`);
    if (resolveElectricalRenderMode(scene) === 'mechanism-only' && !/remotion|reference brief only|mechanism canvas/.test(normalized)) errors.push(`${scene.id}: Mechanismus-Szene braucht ein Remotion-Referenzbriefing.`);
  }

  if (fullScenes.length < budget.recommended.min) warnings.push('Keine oder sehr wenige Mechanismus-Animationen.');
  if (fullScenes.length > budget.recommended.max) warnings.push(`${fullScenes.length} Vollanimationen liegen über dem empfohlenen Maximum ${budget.recommended.max}.`);

  return {passed: errors.length === 0, strict, fullMechanismSceneIds: fullScenes.map((scene) => scene.id), overlaySceneIds: overlayScenes.map((scene) => scene.id), errors, warnings};
};
