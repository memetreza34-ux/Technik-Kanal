import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';
import {ScienceCaptions, ScienceSoundLayer, SCIENCE_COLORS} from '@science/core';
import {ScienceSceneHeader} from './engine/ScienceSceneHeader';
import type {ScienceReelRuntime} from './engine/science-contracts';
import runtimeJson from './generated/science-runtime.json';

const runtime = runtimeJson as ScienceReelRuntime;

export const SCIENCE_REEL_TOTAL_FRAMES = Math.max(1, runtime.totalFrames || 1);
export const SCIENCE_REEL_FPS = runtime.fps || 30;
export const SCIENCE_REEL_WIDTH = runtime.width || 1080;
export const SCIENCE_REEL_HEIGHT = runtime.height || 1920;

export const ScienceReel: React.FC = () => {
  const frame = useCurrentFrame();
  const fallback = runtime.scenes[runtime.scenes.length - 1];
  const scene = runtime.scenes.find((candidate) => frame >= candidate.fromFrame && frame < candidate.toFrame) ?? fallback;
  if (!scene) return null;

  return (
    <AbsoluteFill style={{backgroundColor: SCIENCE_COLORS.background}}>
      <ScienceSoundLayer voiceoverPath={runtime.voiceoverPath} cues={runtime.sfx}/>
      {scene.imagePath ? (
        <AbsoluteFill>
          <Img src={staticFile(scene.imagePath)} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
        </AbsoluteFill>
      ) : null}
      {scene.headline ? <ScienceSceneHeader kicker={scene.kicker} headline={scene.headline}/> : null}
      <ScienceCaptions captions={runtime.captions}/>
    </AbsoluteFill>
  );
};
