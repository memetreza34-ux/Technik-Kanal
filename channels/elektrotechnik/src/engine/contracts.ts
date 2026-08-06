export type ElectricalRuntimeCaption = {fromFrame:number;toFrame:number;text:string};
export type ElectricalRuntimeSfx = {id:string;path:string;fromFrame:number;volume:number};
export type ElectricalRuntimeScene = {
  id:string;
  title:string;
  kicker?:string;
  headline?:string;
  imageLabel?:string;
  backgroundFamily?:string;
  shotType?:string;
  referenceGroup?:string;
  fromFrame:number;
  toFrame:number;
  imagePath?:string;
  layout?:'image-full'|'image-mechanism'|'comparison'|'warning'|'payoff';
  renderMode?:'image-only'|'mechanism-only'|'image-with-overlay'|'static-overlay';
  motionLevel?:'none'|'subtle'|'full';
  imageRole?:'hero'|'mechanism-plate'|'comparison'|'safety'|'payoff';
  mechanism?:string;
  overlayJustification?:string;
  accent?:'current'|'explanation'|'overload'|'fault'|'success';
};
export type ElectricalReelRuntime = {version:number;slug:string;compositionId:string;fps:number;width:number;height:number;totalFrames:number;durationSeconds:number;voiceoverPath?:string;coverText?:string;visualPolicyVersion?:string;scenes:ElectricalRuntimeScene[];captions:ElectricalRuntimeCaption[];sfx:ElectricalRuntimeSfx[]};
export const assertElectricalRuntime = (runtime:ElectricalReelRuntime) => {
  if (!runtime.slug || !runtime.compositionId) throw new Error('Runtime benötigt slug und compositionId.');
  if (runtime.width !== 1080 || runtime.height !== 1920 || runtime.fps !== 30) throw new Error('Elektrotechnik-Runtime muss 1080×1920 bei 30 FPS verwenden.');
  if (!runtime.scenes.length) throw new Error('Runtime enthält keine Szenen.');
  let lastFrame = 0;
  for (const scene of runtime.scenes) {
    if (scene.fromFrame !== lastFrame) throw new Error(`Szenenlücke oder Überlappung vor ${scene.id}.`);
    if (scene.toFrame <= scene.fromFrame) throw new Error(`Ungültige Dauer in ${scene.id}.`);
    lastFrame = scene.toFrame;
  }
  if (lastFrame !== runtime.totalFrames) throw new Error('Letzte Szene endet nicht am Runtime-Ende.');
  return runtime;
};
