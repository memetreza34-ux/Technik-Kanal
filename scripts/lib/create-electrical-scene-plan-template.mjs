const uniqueMechanismIndexes = (sceneCount) => {
  const candidates = [Math.max(1, Math.floor(sceneCount * 0.3)), Math.max(2, Math.floor(sceneCount * 0.55)), Math.max(3, Math.floor(sceneCount * 0.75))];
  return [...new Set(candidates)].filter((index) => index > 0 && index < sceneCount - 1).slice(0, 3);
};

const backgroundFamilies = [
  'warm-graphite-workshop',
  'cool-blue-gray-workshop',
  'warm-terminal-box',
  'charcoal-electrical-lab',
  'slate-test-laboratory',
  'blue-gray-distribution-board',
  'medium-gray-control-cabinet',
  'warm-brushed-aluminum-cabinet',
  'beige-gray-workbench',
];

export const createElectricalScenePlanTemplate = ({slug, title = 'Elektrotechnik-Thema', hook = 'Was erklärt dieser Reel?', compositionId = 'ElectricalReel', sceneCount = 9}) => {
  const mechanismIndexes = uniqueMechanismIndexes(sceneCount);
  const scenes = Array.from({length: sceneCount}, (_, index) => {
    const number = String(index + 1).padStart(2, '0');
    const isHook = index === 0;
    const isPayoff = index === sceneCount - 1;
    const isMechanism = mechanismIndexes.includes(index);
    const id = isHook ? `${number}-hook` : isPayoff ? `${number}-payoff` : `${number}-erklaerung`;
    return {
      id,
      title: isHook ? hook : isPayoff ? 'Fachlicher Payoff' : `Erklärung ${index}`,
      kicker: isHook ? undefined : isPayoff ? 'Merksatz' : 'Erklärung',
      headline: isHook ? hook : isPayoff ? 'Klarer Merksatz ergänzen' : 'Kurze deutsche Aussage ergänzen',
      imageLabel: isHook ? hook : '[EXAKTE DEUTSCHE KURZBESCHRIFTUNG ERGÄNZEN]',
      backgroundFamily: backgroundFamilies[index % backgroundFamilies.length],
      voiceText: isHook ? `${hook} Direkte Antwort in einem kurzen Satz ergänzen.` : 'Sprechtext für genau eine technische Aussage ergänzen.',
      imageDir: `02-bilder/images/${id}`,
      layout: isMechanism ? 'image-mechanism' : isPayoff ? 'payoff' : 'image-full',
      renderMode: isMechanism ? 'mechanism-only' : 'image-only',
      motionLevel: isMechanism ? 'full' : 'subtle',
      imageRole: isMechanism ? 'mechanism-plate' : isPayoff ? 'payoff' : 'hero',
      ...(isMechanism ? {mechanism: `mechanismus-${number}`} : {}),
      factClaim: 'Fachliche Kernaussage ergänzen.',
      sourceIds: [],
    };
  });
  return {
    version: 'electrical-v4',
    visualPolicyVersion: 'visual-v4',
    generatedImageTextPolicy: 'exact-german-short-labels',
    slug,
    title,
    coverText: hook,
    compositionId,
    fps: 30,
    width: 1080,
    height: 1920,
    minimumWordMatchRatio: 0.82,
    animationBudget: {maximum: 4, fullMechanismScenes: scenes.filter((scene) => scene.motionLevel === 'full').map((scene) => scene.id)},
    scenes,
  };
};

export const createElectricalPromptManifestTemplate = (scenePlan) => ({
  version: 'electrical-v4',
  visualPolicyVersion: 'visual-v4',
  slug: scenePlan.slug,
  generatedAt: new Date().toISOString(),
  generatedImageTextPolicy: 'exact-german-short-labels',
  coverText: scenePlan.coverText,
  minimumBackgroundFamilies: 4,
  requiredVisibleSceneImages: scenePlan.scenes.filter((scene) => scene.renderMode !== 'mechanism-only').length,
  animationBudget: {maximumFullMechanismAnimations: scenePlan.animationBudget.maximum, sceneIds: scenePlan.animationBudget.fullMechanismScenes},
  cover: {prompt: '02-bilder/prompts/00-cover.txt', imageDir: '02-bilder/images/00-cover', imageRequired: true, imageLabel: scenePlan.coverText, backgroundFamily: 'warm-graphite-workshop', approved: false},
  scenes: scenePlan.scenes.map((scene) => ({
    id: scene.id,
    prompt: `02-bilder/prompts/${scene.id}.txt`,
    imageDir: scene.imageDir,
    imageRequired: scene.renderMode !== 'mechanism-only',
    imageLabel: scene.imageLabel,
    backgroundFamily: scene.backgroundFamily,
    renderMode: scene.renderMode,
    motionLevel: scene.motionLevel,
    fullAnimation: scene.motionLevel === 'full',
    approved: false,
  })),
});

export const createElectricalStatusTemplate = (scenePlan) => ({
  status: 'preproduction-blocked-until-gates-pass',
  slug: scenePlan.slug,
  completed: ['folder-structure', 'visual-v4-scene-plan-template'],
  open: ['research', 'script', 'prompts', 'sources', 'preflight', 'images', 'voiceover', 'captions', 'render', 'qa'],
  requiredVisibleSceneImages: scenePlan.scenes.filter((scene) => scene.renderMode !== 'mechanism-only').length,
  mechanismOnlyScenesWithoutUserImages: scenePlan.scenes.filter((scene) => scene.renderMode === 'mechanism-only').map((scene) => scene.id),
  nextCommand: 'npm run electrical:preflight -- "<reel-ordner>"',
});
