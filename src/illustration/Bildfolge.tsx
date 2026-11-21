import React from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {Illustration, type IllustrationProps} from './Illustration';

// Langvideo als Bildfolge: beschriftete Standbilder im Takt des Voiceovers, langsamer Zoom (Ken Burns).
// Zeiten in Sekunden. Label-/Pfeil-"in" ist relativ zum Bildbeginn.
export type BildfolgeScene = IllustrationProps & {start: number; zoom?: [number, number]; origin?: string};
export type BildfolgeProps = {audio?: string; end: number; scenes: BildfolgeScene[]};

const Szene: React.FC<{scene: BildfolgeScene; frames: number}> = ({scene, frames}) => {
  const frame = useCurrentFrame();
  const [z0, z1] = scene.zoom ?? [1, 1.03];
  const scale = interpolate(frame, [0, frames], [z0, z1], {extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{transform: `scale(${scale})`, transformOrigin: scene.origin ?? 'center'}}>
      <Illustration {...scene} />
    </AbsoluteFill>
  );
};

export const Bildfolge: React.FC<BildfolgeProps> = ({audio, end, scenes}) => {
  const {fps} = useVideoConfig();
  return (
    <AbsoluteFill style={{background: '#000'}}>
      {scenes.map((s, i) => {
        const from = Math.round(s.start * fps);
        const to = Math.round((scenes[i + 1]?.start ?? end) * fps);
        return (
          <Sequence key={i} from={from} durationInFrames={to - from}>
            <Szene scene={s} frames={to - from} />
          </Sequence>
        );
      })}
      {audio ? <Audio src={staticFile(audio)} /> : null}
    </AbsoluteFill>
  );
};

export const bildfolgeFrames = (p: BildfolgeProps, fps: number) => Math.round(p.end * fps);
