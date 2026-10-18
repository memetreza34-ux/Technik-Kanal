import React from 'react';
import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {ScienceSoundLayer, SCIENCE_COLORS} from '@science/core';
import type {ScienceReelRuntime} from './engine/science-contracts';
import runtimeJson from './generated/science-runtime.json';

const runtime = runtimeJson as ScienceReelRuntime;

export const SCIENCE_REEL_TOTAL_FRAMES = Math.max(1, runtime.totalFrames || 1);
export const SCIENCE_REEL_FPS = runtime.fps || 30;
export const SCIENCE_REEL_WIDTH = runtime.width || 1920;
export const SCIENCE_REEL_HEIGHT = runtime.height || 1080;

export const ScienceReel: React.FC = () => {
  const frame = useCurrentFrame();
  const fallback = runtime.scenes[runtime.scenes.length - 1];
  const scene = runtime.scenes.find((candidate) => frame >= candidate.fromFrame && frame < candidate.toFrame) ?? fallback;
  if (!scene) return null;
  const move = scene.cameraMove;
  const progress = interpolate(frame, [scene.fromFrame, Math.max(scene.fromFrame + 1, scene.toFrame - 1)], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const at = (from: number, to: number) => from + (to - from) * progress;
  const transform = move ? `translate(${at(move.fromX, move.toX)}%, ${at(move.fromY, move.toY)}%) scale(${at(move.fromScale, move.toScale)})` : undefined;

  return (
    <AbsoluteFill style={{backgroundColor: SCIENCE_COLORS.background, overflow: 'hidden'}}>
      <ScienceSoundLayer voiceoverPath={runtime.voiceoverPath} musicPath={runtime.musicPath} cues={runtime.sfx}/>
      {scene.imagePath ? (
        <AbsoluteFill>
          <Img src={staticFile(scene.imagePath)} style={{width: '100%', height: '100%', objectFit: 'cover', transform, transformOrigin: 'center center'}} />
        </AbsoluteFill>
      ) : null}
    </AbsoluteFill>
  );
};
