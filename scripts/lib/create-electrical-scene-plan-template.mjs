const stages=['scientific-dark','laboratory','micro','technical','comparison','material','space','diagram','scientific-dark','laboratory','micro','technical','space','material','comparison','scientific-dark'];
const cameras=['hero','macro','micro','cutaway','comparison','wide','orbital','cross-section','side','top-down','micro','hero','wide','macro','comparison','hero'];

export const createElectricalScenePlanTemplate=({slug,title='Wissenschaftsthema',hook='Warum passiert das?',compositionId='ScienceReel',sceneCount=10})=>{
  const scenes=Array.from({length:sceneCount},(_,index)=>{
    const number=String(index+1).padStart(2,'0');
    const isHook=index===0;
    const isPayoff=index===sceneCount-1;
    const id=isHook?`${number}-hook`:isPayoff?`${number}-payoff`:`${number}-erklaerung`;
    const stage=stages[index%stages.length];
    const camera=cameras[index%cameras.length];
    const subject=isHook?'starkes wissenschaftliches Hauptmotiv zur zentralen Frage':isPayoff?'visuelle wissenschaftliche Kernerkenntnis':`wissenschaftliche Kernaussage der Szene ${index+1}`;
    return {
      id,
      title:isHook?hook:isPayoff?'Fachlicher Payoff':`Erklärung ${index}`,
      kicker:isHook?undefined:isPayoff?'Merksatz':'Wissen',
      headline:isHook?hook:isPayoff?'Klaren Merksatz ergänzen':'Kurze deutsche Aussage ergänzen',
      backgroundFamily:`science-${stage}`,
      shotType:camera,
      referenceGroup:'science-editorial-v1',
      visualRecipe:{
        stage,
        camera,
        subject,
        focus:'genau eine wissenschaftliche Aussage, sofort auf dem Smartphone verständlich',
        motion:'none',
        callouts:[]
      },
      voiceText:isHook?`${hook} Direkte Antwort in einem kurzen Satz ergänzen.`:'Sprechtext für genau eine wissenschaftliche Aussage ergänzen.',
      imageDir:`02-bilder/images/${id}`,
      layout:'image-full',
      renderMode:'image-only',
      motionLevel:'none',
      imageRole:isHook?'hero':isPayoff?'payoff':'concept',
      factClaim:'Fachliche Kernaussage ergänzen.',
      sourceIds:[]
    };
  });

  return {
    version:'science-v1',
    visualPolicyVersion:'science-static-v1',
    generatedImageTextPolicy:'none',
    slug,
    title,
    coverText:hook,
    compositionId,
    runtimeFile:'science-runtime.json',
    fps:30,
    width:1080,
    height:1920,
    minimumWordMatchRatio:.82,
    scenes
  };
};

export const createElectricalPromptManifestTemplate=(scenePlan)=>({
  version:'science-v1',
  visualPolicyVersion:'science-static-v1',
  slug:scenePlan.slug,
  generatedAt:new Date().toISOString(),
  generatedImageTextPolicy:'none',
  coverText:scenePlan.coverText,
  requiredVisibleSceneImages:scenePlan.scenes.length,
  cover:{
    imageRequired:true,
    sourceSceneId:scenePlan.scenes[0]?.id,
    candidateCount:3,
    separateThumbnailForbidden:true,
    visualSource:'generated-science-image'
  },
  scenes:scenePlan.scenes.map((scene,index)=>({
    id:scene.id,
    imageRequired:true,
    renderMode:'image-only',
    motionLevel:'none',
    visualSource:'generated-science-image',
    coverSource:index===0,
    approved:false
  }))
});

export const createElectricalStatusTemplate=(scenePlan)=>({
  status:'preproduction-blocked-until-gates-pass',
  slug:scenePlan.slug,
  completed:['folder-structure','science-static-v1-template'],
  open:['research','script','sources','image-plan','preflight','images','voiceover','captions','render','qa'],
  requiredVisibleSceneImages:scenePlan.scenes.length,
  nextCommand:'npm run science:preflight -- "<reel-ordner>"'
});
