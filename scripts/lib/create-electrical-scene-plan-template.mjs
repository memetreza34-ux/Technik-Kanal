export const createElectricalScenePlanTemplate = ({slug, compositionId = 'ElectricalReel', sceneCount = 8}) => ({
  version: 'electrical-v1',
  slug,
  compositionId,
  fps: 30,
  width: 1080,
  height: 1920,
  minimumWordMatchRatio: 0.82,
  scenes: Array.from({length: sceneCount}, (_, index) => {
    const number = String(index + 1).padStart(2, '0');
    const id = index === 0 ? `${number}-hook` : index === sceneCount - 1 ? `${number}-payoff` : `${number}-erklaerung`;
    return {
      id,
      title: index === 0 ? 'Hook' : index === sceneCount - 1 ? 'Payoff' : `Erklärung ${index}`,
      kicker: index === 0 ? 'Elektrotechnik klar' : 'Erklärung',
      headline: 'Überschrift ergänzen',
      voiceText: 'Sprechtext für diese Szene ergänzen.',
      imageDir: `02-bilder/images/${id}`,
      layout: index === 0 ? 'image-full' : index === sceneCount - 1 ? 'payoff' : 'image-mechanism',
      sourceIds: [],
    };
  }),
});

export const createElectricalPromptManifestTemplate = (scenePlan) => ({
  version: 'electrical-v1',
  slug: scenePlan.slug,
  generatedAt: new Date().toISOString(),
  prompts: scenePlan.scenes.map((scene) => ({
    id: scene.id,
    file: `02-bilder/prompts/${scene.id}.txt`,
    imageDir: scene.imageDir,
    status: 'offen',
  })),
});

export const createElectricalStatusTemplate = (scenePlan) => ({
  status: 'inhalt-vorbereiten',
  slug: scenePlan.slug,
  completed: ['folder-structure', 'scene-plan-template'],
  open: ['script', 'prompts', 'sources', 'images', 'voiceover', 'captions', 'render', 'qa'],
});
