const sectionForIndex=(index,sceneCount)=>{
  if(index===0) return 'hook';
  if(index===sceneCount-1) return 'payoff';
  const progress=index/(sceneCount-1);
  if(progress<0.16) return 'context';
  if(progress<0.32) return 'foundation';
  if(progress<0.72) return 'mechanism';
  return 'deepening';
};

export const createElectricalScenePlanTemplate=({slug,title='Wissenschaftsthema',hook='Warum passiert das?',compositionId='ScienceReel',sceneCount=46,productionProfile='youtube-6to7min-v1'})=>{
  const scenes=Array.from({length:sceneCount},(_,index)=>{
    const number=String(index+1).padStart(2,'0');
    const section=sectionForIndex(index,sceneCount);
    const isHook=section==='hook';
    const isPayoff=section==='payoff';
    const id=isHook?`${number}-hook`:isPayoff?`${number}-payoff`:`${number}-${section}`;
    const subject=isHook?'Eigenständiges Erklärbild zur gesprochenen Hook-Aussage, keine Cover-Fortsetzung':isPayoff?'visuelle Kernerkenntnis':`fachliche Kernaussage des Beats ${index+1}`;
    return {
      id,
      section,
      title:isHook?hook:isPayoff?'Fachlicher Payoff':`${section} ${index+1}`,
      // headline/kicker absichtlich nicht vorbelegen: Text im Bild oder als Remotion-Overlay ist optional.
      backgroundFamily:'content-driven',
      shotType:'beat-driven',
      referenceGroup:'scientific-scene-explainer',
      visualRecipe:{
        stage:'passend zur konkreten visuellen Aussage wählen',
        camera:'passend zur verständlichsten Darstellung wählen',
        subject,
        focus:'genau eine visuelle Hauptaussage',
        motion:'none',
        callouts:[]
      },
      voiceText:isHook?`${hook} Direkte Einordnung ohne langes Intro ergänzen.`:'Voice-Text für diesen inhaltlichen Abschnitt ergänzen; ein Beat kann mehrere Sätze tragen.',
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
    productionProfile,
    visualPolicyVersion:'science-static-v1',
    generatedImageTextPolicy:'controlled-german-only',
    slug,
    title,
    compositionId,
    runtimeFile:'science-runtime.json',
    fps:30,
    width:1920,
    height:1080,
    minimumWordMatchRatio:.82,
    scenes
  };
};

export const createElectricalPromptManifestTemplate=(scenePlan)=>({
  version:'science-v1',
  productionProfile:scenePlan.productionProfile,
  visualPolicyVersion:'science-static-v1',
  styleId:'scientific-scene-explainer-v1',
  slug:scenePlan.slug,
  generatedAt:new Date().toISOString(),
  generatedImageTextPolicy:'controlled-german-only',
  visibleImageLanguage:'de',
  requiredVisibleSceneImages:scenePlan.scenes.length,
  cover:{
    imageRequired:false,
    sourceSceneId:null,
    candidateCount:0,
    separateThumbnailForbidden:false,
    exportDir:'05-export/cover',
    neverUsedAsVideoFrame:true
  },
  thumbnail:{
    required:true,
    separateFromVideoScenes:true,
    width:1280,
    height:720,
    candidateCount:3,
    approved:false
  },
  scenes:scenePlan.scenes.map((scene)=>({
    id:scene.id,
    imageRequired:true,
    renderMode:'image-only',
    motionLevel:'none',
    visualSource:'generated-image',
    approved:false
  }))
});

export const createElectricalStatusTemplate=(scenePlan)=>({
  status:'preproduction-blocked-until-gates-pass',
  slug:scenePlan.slug,
  productionProfile:scenePlan.productionProfile,
  completed:['folder-structure','science-static-v1-template','scientific-scene-explainer-v1'],
  open:['research','story-structure','script','sources','image-plan','thumbnail-plan','preflight','images','thumbnail','voiceover','captions','render','qa'],
  requiredVisibleSceneImages:scenePlan.scenes.length,
  nextCommand:'npm run science:preflight -- "<video-ordner>"'
});
