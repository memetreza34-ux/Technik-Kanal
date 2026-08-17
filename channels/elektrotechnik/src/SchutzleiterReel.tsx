import React from 'react';
import {AbsoluteFill} from 'remotion';
import {ElectricalProductionLayer} from './engine';
import type {ElectricalReelRuntime} from './engine';
import {SchutzleiterVisual} from './visuals/SchutzleiterVisual';
import runtimeJson from './generated/schutzleiter-runtime.json';

const runtime = runtimeJson as ElectricalReelRuntime;
export const SCHUTZLEITER_REEL_TOTAL_FRAMES = Math.max(1, runtime.totalFrames);
export const SCHUTZLEITER_REEL_FPS = runtime.fps || 30;
export const SCHUTZLEITER_REEL_WIDTH = runtime.width || 1080;
export const SCHUTZLEITER_REEL_HEIGHT = runtime.height || 1920;

export const SchutzleiterReel: React.FC = () => (
  <AbsoluteFill>
    <ElectricalProductionLayer runtime={runtime} mechanismLayer={(scene) => <SchutzleiterVisual scene={scene} />} />
  </AbsoluteFill>
);
