import React from 'react';
import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {ElectricalCaptions, ElectricalSoundLayer, ElectricalThemeProvider, PremiumElectricalGrade, ELECTRICAL_COLORS} from '@elektrotechnik/core';
import type {ElectricalReelRuntime, ElectricalRuntimeScene} from './contracts';
import {ElectricalSceneHeader} from './ElectricalSceneHeader';

const clamp = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

const SceneImage: React.FC<{scene: ElectricalRuntimeScene}> = ({scene}) => {
  const frame = useCurrentFrame();
  if (!scene.imagePath) return null;
  const progress = interpolate(frame, [scene.fromFrame, scene.toFrame], [0, 1], clamp);
  const scale = interpolate(progress, [0, 1], [1, 1.035]);
  const translateX = interpolate(progress, [0, 1], [-6, 6]);
  return (
    <AbsoluteFill>
      <Img src={staticFile(scene.imagePath)} style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${scale}) translateX(${translateX}px)`}} />
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(3,16,31,.75) 0%, rgba(3,16,31,.08) 33%, rgba(3,16,31,.18) 62%, rgba(3,16,31,.72) 100%)'}} />
    </AbsoluteFill>
  );
};

const accentFor = (scene: ElectricalRuntimeScene) => {
  if (scene.accent && scene.accent in ELECTRICAL_COLORS) return ELECTRICAL_COLORS[scene.accent];
  if (scene.layout === 'warning') return ELECTRICAL_COLORS.fault;
  if (scene.layout === 'payoff') return ELECTRICAL_COLORS.explanation;
  return ELECTRICAL_COLORS.current;
};

export const ElectricalProductionLayer: React.FC<{
  runtime: ElectricalReelRuntime;
  mechanismLayer?: (scene: ElectricalRuntimeScene) => React.ReactNode;
}> = ({runtime, mechanismLayer}) => {
  const frame = useCurrentFrame();
  const scene = runtime.scenes.find((candidate) => frame >= candidate.fromFrame && frame < candidate.toFrame) ?? runtime.scenes.at(-1);
  if (!scene) return null;

  return (
    <ElectricalThemeProvider>
      <AbsoluteFill style={{backgroundColor: ELECTRICAL_COLORS.background}}>
        <ElectricalSoundLayer voiceoverPath={runtime.voiceoverPath} cues={runtime.sfx} />
        <PremiumElectricalGrade>
          <SceneImage scene={scene} />
          <ElectricalSceneHeader kicker={scene.kicker} headline={scene.headline ?? scene.title} accent={accentFor(scene)} />
          {mechanismLayer?.(scene)}
          <ElectricalCaptions captions={runtime.captions} />
        </PremiumElectricalGrade>
      </AbsoluteFill>
    </ElectricalThemeProvider>
  );
};
