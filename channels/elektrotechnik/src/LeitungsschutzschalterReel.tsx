import React from 'react';
import {AbsoluteFill} from 'remotion';
import {ElectricalProductionLayer} from './engine';
import type {ElectricalReelRuntime} from './engine';
import {LeitungsschutzschalterVisual} from './visuals/LeitungsschutzschalterVisual';
import runtimeJson from './generated/leitungsschutzschalter-runtime.json';

const runtime = runtimeJson as ElectricalReelRuntime;
export const LS_REEL_TOTAL_FRAMES = Math.max(1, runtime.totalFrames);
export const LS_REEL_FPS = runtime.fps || 30;
export const LS_REEL_WIDTH = runtime.width || 1080;
export const LS_REEL_HEIGHT = runtime.height || 1920;

export const LeitungsschutzschalterReel: React.FC = () => (
  <AbsoluteFill>
    <ElectricalProductionLayer runtime={runtime} mechanismLayer={(scene) => <LeitungsschutzschalterVisual scene={scene} />} />
  </AbsoluteFill>
);
