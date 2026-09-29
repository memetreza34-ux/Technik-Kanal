import React from 'react';
import {AbsoluteFill, Img, staticFile, useCurrentFrame} from 'remotion';
import {ElectricalCaptions, ElectricalSoundLayer, ELECTRICAL_COLORS} from '@elektrotechnik/core';
import {ElectricalSceneHeader} from './engine/ElectricalSceneHeader';
import type {ElectricalReelRuntime} from './engine/contracts';
import runtimeJson from './generated/science-runtime.json';

const runtime = runtimeJson as ElectricalReelRuntime;

export const SCIENCE_REEL_TOTAL_FRAMES = Math.max(1, runtime.totalFrames || 1);
export const SCIENCE_REEL_FPS = runtime.fps || 30;
export const SCIENCE_REEL_WIDTH = runtime.width || 1080;
export const SCIENCE_REEL_HEIGHT = runtime.height || 1920;

export const ScienceReelView: React.FC<{runtime: ElectricalReelRuntime}> = ({runtime: activeRuntime}) => {
  const frame = useCurrentFrame();
  const fallback = activeRuntime.scenes[activeRuntime.scenes.length - 1];
  const scene = activeRuntime.scenes.find((candidate) => frame >= candidate.fromFrame && frame < candidate.toFrame) ?? fallback;
  if (!scene) return null;

  return (
    <AbsoluteFill style={{backgroundColor: ELECTRICAL_COLORS.background}}>
      <ElectricalSoundLayer voiceoverPath={activeRuntime.voiceoverPath} cues={activeRuntime.sfx}/>
      {scene.imagePath ? (
        <AbsoluteFill>
          <Img
            src={staticFile(scene.imagePath)}
            style={{width: '100%', height: '100%', objectFit: 'cover'}}
          />
        </AbsoluteFill>
      ) : null}
      {scene.headline ? <ElectricalSceneHeader kicker={scene.kicker} headline={scene.headline}/> : null}
      <ElectricalCaptions captions={activeRuntime.captions}/>
    </AbsoluteFill>
  );
};

export const ScienceReel: React.FC = () => <ScienceReelView runtime={runtime}/>;
