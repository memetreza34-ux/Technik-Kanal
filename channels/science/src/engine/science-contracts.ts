export type ScienceRuntimeCaption = {
  fromFrame: number;
  toFrame: number;
  text: string;
};

export type ScienceRuntimeSfx = {
  id: string;
  path: string;
  fromFrame: number;
  volume?: number;
};

export type ScienceRuntimeScene = {
  id: string;
  title: string;
  kicker?: string;
  headline?: string;
  fromFrame: number;
  toFrame: number;
  imagePath?: string;
  videoPath?: string;
  mediaType?: 'image' | 'video';
  videoDurationSeconds?: number;
};

export type ScienceReelRuntime = {
  version: number;
  slug: string;
  compositionId: 'ScienceReel';
  fps: number;
  width: number;
  height: number;
  totalFrames: number;
  durationSeconds: number;
  voiceoverPath?: string;
  scenes: ScienceRuntimeScene[];
  captions: ScienceRuntimeCaption[];
  sfx: ScienceRuntimeSfx[];
};

export const assertScienceRuntime = (runtime: ScienceReelRuntime) => {
  if (!runtime.slug || runtime.compositionId !== 'ScienceReel') throw new Error('Science-Runtime benötigt slug und compositionId ScienceReel.');
  if (runtime.width !== 1920 || runtime.height !== 1080 || runtime.fps !== 30) throw new Error('Science-Runtime muss 1920×1080 bei 30 FPS verwenden.');
  if (!runtime.scenes.length) throw new Error('Science-Runtime enthält keine Szenen.');
  let lastFrame = 0;
  for (const scene of runtime.scenes) {
    if (scene.fromFrame !== lastFrame) throw new Error(`Szenenlücke oder Überlappung vor ${scene.id}.`);
    if (scene.toFrame <= scene.fromFrame) throw new Error(`Ungültige Dauer in ${scene.id}.`);
    if (!scene.imagePath && !scene.videoPath) throw new Error(`Szene ${scene.id} benötigt Bild oder Flow-Video.`);
    if (scene.mediaType === 'video' && !scene.videoPath) throw new Error(`Video-Szene ${scene.id} benötigt videoPath.`);
    lastFrame = scene.toFrame;
  }
  if (lastFrame !== runtime.totalFrames) throw new Error('Letzte Szene endet nicht am Runtime-Ende.');
  return runtime;
};
