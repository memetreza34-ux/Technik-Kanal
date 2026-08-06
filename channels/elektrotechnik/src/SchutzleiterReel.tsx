import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {ProtectiveConductorPathAnimation} from './animation-library';
import {ElectricalProductionLayer} from './engine';
import type {ElectricalReelRuntime, ElectricalRuntimeScene} from './engine';
import runtimeJson from './generated/schutzleiter-runtime.json';

const runtime = runtimeJson as ElectricalReelRuntime;

export const SCHUTZLEITER_REEL_TOTAL_FRAMES = Math.max(1, runtime.totalFrames);
export const SCHUTZLEITER_REEL_FPS = runtime.fps || 30;
export const SCHUTZLEITER_REEL_WIDTH = runtime.width || 1080;
export const SCHUTZLEITER_REEL_HEIGHT = runtime.height || 1920;

const clamp = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};
const sceneProgress = (frame: number, scene: ElectricalRuntimeScene) => interpolate(frame, [scene.fromFrame, scene.toFrame], [0, 1], clamp);

const SchutzleiterMechanism: React.FC<{scene: ElectricalRuntimeScene}> = ({scene}) => {
  const frame = useCurrentFrame();
  const progress = sceneProgress(frame, scene);

  if (scene.id === '03-normalbetrieb') {
    return (
      <AbsoluteFill style={{display: 'grid', placeItems: 'center', paddingTop: 220}}>
        <ProtectiveConductorPathAnimation progress={progress} faultProgress={0} width={800} height={620} />
      </AbsoluteFill>
    );
  }

  if (scene.id === '05-fehlerstromweg') {
    const fault = interpolate(progress, [0.12, 0.72], [0, 1], clamp);
    return (
      <AbsoluteFill style={{display: 'grid', placeItems: 'center', paddingTop: 220}}>
        <ProtectiveConductorPathAnimation progress={progress} faultProgress={fault} width={800} height={620} />
      </AbsoluteFill>
    );
  }

  return null;
};

export const SchutzleiterReel: React.FC = () => (
  <AbsoluteFill>
    <ElectricalProductionLayer runtime={runtime} mechanismLayer={(scene) => <SchutzleiterMechanism scene={scene} />} />
  </AbsoluteFill>
);
