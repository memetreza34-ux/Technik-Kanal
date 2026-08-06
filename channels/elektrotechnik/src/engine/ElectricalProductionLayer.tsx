import React from 'react';
import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {ElectricalCaptions, ElectricalSoundLayer, ElectricalThemeProvider, PremiumElectricalGrade, ELECTRICAL_COLORS} from '@elektrotechnik/core';
import type {ElectricalReelRuntime, ElectricalRuntimeScene} from './contracts';
import {ElectricalSceneHeader} from './ElectricalSceneHeader';

const clamp = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

const renderModeFor = (scene: ElectricalRuntimeScene) => {
  if (scene.renderMode) return scene.renderMode;
  if (scene.layout === 'image-mechanism') return 'image-with-overlay';
  if (scene.layout === 'payoff') return 'static-overlay';
  return 'image-only';
};

const SceneImage: React.FC<{scene: ElectricalRuntimeScene}> = ({scene}) => {
  const frame = useCurrentFrame();
  if (!scene.imagePath) return null;
  const progress = interpolate(frame, [scene.fromFrame, scene.toFrame], [0, 1], clamp);
  const motionEnabled = scene.motionLevel !== 'none';
  const scale = motionEnabled ? interpolate(progress, [0, 1], [1, 1.025]) : 1;
  const translateX = motionEnabled ? interpolate(progress, [0, 1], [-4, 4]) : 0;
  return (
    <AbsoluteFill>
      <Img src={staticFile(scene.imagePath)} style={{width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${scale}) translateX(${translateX}px)`}} />
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(3,16,31,.75) 0%, rgba(3,16,31,.06) 33%, rgba(3,16,31,.16) 62%, rgba(3,16,31,.72) 100%)'}} />
    </AbsoluteFill>
  );
};

const MechanismCanvas: React.FC = () => (
  <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 43%, #0b3455 0%, #03101f 52%, #010812 100%)'}}>
    <AbsoluteFill style={{backgroundImage: 'linear-gradient(rgba(42,199,255,.025) 1px, transparent 1px), linear-gradient(90deg, rgba(42,199,255,.025) 1px, transparent 1px)', backgroundSize: '90px 90px'}} />
  </AbsoluteFill>
);

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
  const fallback = runtime.scenes[runtime.scenes.length - 1];
  const scene = runtime.scenes.find((candidate) => frame >= candidate.fromFrame && frame < candidate.toFrame) ?? fallback;
  if (!scene) return null;

  const mode = renderModeFor(scene);
  const showImage = mode !== 'mechanism-only';
  const showMechanism = mode !== 'image-only' && scene.motionLevel !== 'none';

  return (
    <ElectricalThemeProvider>
      <AbsoluteFill style={{backgroundColor: ELECTRICAL_COLORS.background}}>
        <ElectricalSoundLayer voiceoverPath={runtime.voiceoverPath} cues={runtime.sfx} />
        <PremiumElectricalGrade>
          {mode === 'mechanism-only' ? <MechanismCanvas /> : null}
          {showImage ? <SceneImage scene={scene} /> : null}
          <ElectricalSceneHeader kicker={scene.kicker} headline={scene.headline ?? scene.title} accent={accentFor(scene)} />
          {showMechanism ? mechanismLayer?.(scene) : null}
          <ElectricalCaptions captions={runtime.captions} />
        </PremiumElectricalGrade>
      </AbsoluteFill>
    </ElectricalThemeProvider>
  );
};
