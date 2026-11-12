import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useVideoConfig, type CalculateMetadataFunction} from 'remotion';
import type {Caption} from '@remotion/captions';
import {Captions} from './Captions';
import {WirelessChargingScene} from './scenes/WirelessCharging';
import type {Beats} from './scenes/kit';
import {SHORT_FPS, sceneTimings, type ShortProps, type ShortSpec} from './types';

const msToFrame = (ms: number, fps: number) => Math.round((ms / 1000) * fps);

type SceneComp = React.FC<{beats: Beats; width: number; height: number}>;
const SCENES: Record<string, SceneComp> = {
  'wireless-charging': WirelessChargingScene,
};

// Dezente Geräusche an Schlüsselmomenten (Beat-ID, Versatz in s, Datei, Lautstärke).
const SFX: Record<string, [string, number, string, number][]> = {
  'wireless-charging': [
    ['hook', 0.25, 'https://remotion.media/switch.wav', 0.25],
    ['reveal-coil', 0.0, 'https://remotion.media/whoosh.wav', 0.3],
    ['phone-coil', 0.0, 'https://remotion.media/whoosh.wav', 0.2],
    ['misalign', 0.3, 'https://remotion.media/whoosh.wav', 0.2],
    ['qi2', 1.5, 'https://remotion.media/mouse-click.wav', 0.5],
  ],
};

export const ShortVideo: React.FC<ShortProps> = ({slug, spec, captions, hasAudio}) => {
  const {fps, width, height} = useVideoConfig();
  if (!spec) return <AbsoluteFill style={{background: '#0c0e11'}} />;
  const timings = sceneTimings(spec, captions);
  const beats: Beats = Object.fromEntries(timings.map((t) => [t.scene.id, msToFrame(t.startMs, fps)]));
  const Scene = SCENES[spec.scene];
  return (
    <AbsoluteFill style={{background: '#0c0e11'}}>
      {Scene ? <Scene beats={beats} width={width} height={height} /> : null}
      {hasAudio ? <Audio src={staticFile(`shorts/${slug}/voiceover.wav`)} /> : null}
      {(SFX[spec.scene] ?? []).map(([id, off, src, vol], i) =>
        beats[id] === undefined ? null : (
          <Sequence key={i} from={beats[id] + Math.round(off * fps)} layout="none">
            <Audio src={src} volume={vol} />
          </Sequence>
        ),
      )}
      {captions ? <Captions captions={captions} highlight={spec.highlight} /> : null}
    </AbsoluteFill>
  );
};

const fetchJson = async <T,>(file: string): Promise<T | null> => {
  const res = await fetch(staticFile(file));
  return res.ok ? ((await res.json()) as T) : null;
};

// Lädt Szenenplan und Untertitel aus public/shorts/<slug>/ (befüllt von scripts/short-stage.mjs).
export const calculateShortMetadata: CalculateMetadataFunction<ShortProps> = async ({props}) => {
  const spec = props.spec ?? (await fetchJson<ShortSpec>(`shorts/${props.slug}/short.json`));
  const captions = props.captions ?? (await fetchJson<Caption[]>(`shorts/${props.slug}/captions.json`));
  if (!spec) return {durationInFrames: SHORT_FPS * 3, props: {...props, spec: null, captions: null}};
  const t = sceneTimings(spec, captions);
  return {durationInFrames: msToFrame(t[t.length - 1].endMs, SHORT_FPS), props: {...props, spec, captions}};
};
