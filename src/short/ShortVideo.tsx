import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, useVideoConfig, type CalculateMetadataFunction} from 'remotion';
import type {Caption} from '@remotion/captions';
import {Captions} from './Captions';
import {WirelessChargingScene} from './scenes/WirelessCharging';
import {WaterBoilingScene} from './scenes/WaterBoiling';
import {WaterNightScene} from './scenes/WaterNight';
import {WendeschuetzScene} from './scenes/WendeschuetzScene';
import {WechselrichterScene} from './scenes/Wechselrichter';
import {WaermepumpeScene} from './scenes/Waermepumpe';
import {FrameSceneOverlay} from '../frame/FrameOverlay';
import {Shade, Z} from '../frame/Frame';
import {DipToDark, NightRace, NightSceneOverlay, NightShade, NightTop, XrayTag} from './overlay/Night';
import {BrandBar, SceneOverlay, Vignette} from './overlay/Overlays';
import {RacePanel} from './overlay/RacePanel';
import {markMs, raceMsAt, resolveRaceKeys, wordBeatsMs, wordStartMs} from './race';
import {CleanBrand, CleanSceneOverlay, Scoreboard} from './overlay/Clean';
import {FONT} from './brand';
import type {Beats} from '../world/kit';
import {SHORT_FPS, sceneTimings, type ShortProps, type ShortSpec} from './types';

const msToFrame = (ms: number, fps: number) => Math.round((ms / 1000) * fps);

type SceneComp = React.FC<{beats: Beats; width: number; height: number; theme?: 'dark' | 'light'}>;
const SCENES: Record<string, SceneComp> = {
  'wireless-charging': WirelessChargingScene,
  'water-boiling': WaterBoilingScene,
  'water-night': WaterNightScene,
  wendeschuetz: WendeschuetzScene,
  wechselrichter: WechselrichterScene,
  waermepumpe: WaermepumpeScene,
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
  'water-boiling': [
    ['race:start', 0.2, 'https://remotion.media/switch.wav', 0.35],
    ['done:Wasserkocher', 0.0, 'https://remotion.media/switch.wav', 0.4],
    ['herd', 0.0, 'https://remotion.media/whoosh.wav', 0.2],
    ['mikro', 0.0, 'https://remotion.media/whoosh.wav', 0.2],
    ['done:Mikrowelle', 0.0, 'https://remotion.media/ding.wav', 0.45],
    ['ergebnis', 0.0, 'https://remotion.media/whoosh.wav', 0.25],
  ],
  wendeschuetz: [
    ['rechts@s1', 0, 'https://remotion.media/mouse-click.wav', 0.5],
    ['rechts@k1', 0, 'https://remotion.media/switch.wav', 0.35],
    ['links@s0', 0, 'https://remotion.media/mouse-click.wav', 0.5],
    ['links@s0', 0.07, 'https://remotion.media/switch.wav', 0.3],
    ['links@s2', 0, 'https://remotion.media/mouse-click.wav', 0.5],
    ['links@k2', 0, 'https://remotion.media/switch.wav', 0.35],
    ['sicher@gleichzeitig', 0, 'https://remotion.media/whoosh.wav', 0.3],
  ],
  wechselrichter: [
    ['frage@steckdose', 0, 'https://remotion.media/whoosh.wav', 0.2],
    ['bruecke@vier', 0, 'https://remotion.media/whoosh.wav', 0.3],
    ['kreuz', 0.05, 'https://remotion.media/switch.wav', 0.35],
    ['kreuz@zurück', 0, 'https://remotion.media/switch.wav', 0.35],
    ['filter@steckdose', 0, 'https://remotion.media/ding.wav', 0.35],
  ],
  'water-night': [
    ['race:start', 0.1, 'https://remotion.media/switch.wav', 0.35],
    ['kettle', -0.15, 'https://remotion.media/whoosh.wav', 0.18],
    ['done:Wasserkocher', 0.0, 'https://remotion.media/switch.wav', 0.4],
    ['kettle@blick', 0.0, 'https://remotion.media/whoosh.wav', 0.35],
    ['herd', -0.15, 'https://remotion.media/whoosh.wav', 0.18],
    ['mikro', -0.15, 'https://remotion.media/whoosh.wav', 0.18],
    ['done:Mikrowelle', 0.0, 'https://remotion.media/ding.wav', 0.35],
    ['jahr', -0.15, 'https://remotion.media/whoosh.wav', 0.18],
    ['tipp', -0.15, 'https://remotion.media/whoosh.wav', 0.18],
  ],
};

export const ShortVideo: React.FC<ShortProps> = ({slug, spec, captions, hasAudio}) => {
  const {fps, width, height} = useVideoConfig();
  if (!spec) return <AbsoluteFill style={{background: '#0c0e11'}} />;
  const timings = sceneTimings(spec, captions);
  const beats: Beats = Object.fromEntries(timings.map((t) => [t.scene.id, msToFrame(t.startMs, fps)]));
  // jedes gesprochene Wort als Beat "<szene>@<wort>" – für 3D-Effekte und Geräusche
  for (const [k, ms] of Object.entries(wordBeatsMs(timings, captions))) beats[k] = msToFrame(ms, fps);
  // Rennen: Uhr an Sprechstellen koppeln; Zielzeitpunkte als Beats „done:<Bahn>“ für 3D und Sound
  const raceKeys = spec.race ? resolveRaceKeys(spec.race, timings, captions) : [];
  for (const lane of spec.race?.lanes ?? []) beats['done:' + lane.label] = msToFrame(raceMsAt(raceKeys, lane.finish), fps);
  if (spec.race) beats['race:start'] = msToFrame(raceKeys[0]?.[0] ?? 0, fps);
  const Scene = SCENES[spec.scene];
  return (
    <AbsoluteFill style={{background: '#0b0c0f'}}>
      {Scene ? <Scene beats={beats} width={width} height={height} theme={spec.theme} /> : null}
      {hasAudio ? <Audio src={staticFile(`shorts/${slug}/voiceover.wav`)} /> : null}
      {(SFX[spec.scene] ?? []).map(([id, off, src, vol], i) =>
        beats[id] === undefined ? null : (
          <Sequence key={i} from={beats[id] + Math.round(off * fps)} layout="none">
            <Audio src={src} volume={vol} />
          </Sequence>
        ),
      )}
      {spec.overlays && spec.style === 'frame' ? (
        <>
          <Shade theme={spec.theme ?? 'dark'} />
          {timings.map((t) => {
            const from = msToFrame(t.startMs, fps);
            const dur = Math.max(1, msToFrame(t.endMs, fps) - from);
            const at = (word?: string) => (word ? msToFrame(wordStartMs(timings, captions, t.scene.id, word), fps) - from : 0);
            return t.scene.overlay || t.scene.heading ? (
              <Sequence key={t.scene.id} from={from} durationInFrames={dur} layout="none">
                <FrameSceneOverlay theme={spec.theme ?? 'dark'} heading={t.scene.heading} overlay={t.scene.overlay} at={at} dur={dur} />
              </Sequence>
            ) : null;
          })}
        </>
      ) : spec.overlays && spec.style === 'night' ? (
        <>
          <NightShade />
          <DipToDark cuts={timings.slice(1).map((t) => msToFrame(t.startMs, fps))} />
          <NightTop segments={timings.map((t) => [msToFrame(t.startMs, fps), msToFrame(t.endMs, fps)])} />
          {spec.race ? <NightRace race={spec.race} keys={raceKeys} show={beats['race:start']} hide={beats[spec.race.until] ?? Infinity} /> : null}
          {spec.scan ? <XrayTag at={msToFrame(wordStartMs(timings, captions, spec.scan.scene, spec.scan.word), fps)} dur={Math.round(2.2 * fps)} /> : null}
          {timings.map((t) => {
            const from = msToFrame(t.startMs, fps);
            const dur = Math.max(1, msToFrame(t.endMs, fps) - from);
            const at = (word?: string) => (word ? msToFrame(wordStartMs(timings, captions, t.scene.id, word), fps) - from : 0);
            return t.scene.overlay || t.scene.heading ? (
              <Sequence key={t.scene.id} from={from} durationInFrames={t.scene.overlay?.type === 'end' ? dur + fps : dur} layout="none">
                <NightSceneOverlay overlay={t.scene.overlay} heading={t.scene.heading} at={at} />
              </Sequence>
            ) : null;
          })}
        </>
      ) : spec.overlays && spec.style === 'clean' ? (
        <>
          <Vignette />
          <CleanBrand />
          {timings.map((t) => {
            const from = msToFrame(t.startMs, fps);
            const dur = Math.max(1, msToFrame(t.endMs, fps) - from);
            return t.scene.overlay || t.scene.chapter ? (
              <Sequence key={t.scene.id} from={from} durationInFrames={dur} layout="none">
                <CleanSceneOverlay overlay={t.scene.overlay} chapter={t.scene.chapter} />
              </Sequence>
            ) : null;
          })}
          {spec.scoreboard ? (() => {
            const sb = spec.scoreboard;
            const reveal = sb.columns.map((c) => msToFrame(markMs(timings, captions, c.reveal.scene, c.reveal.word, 0.15), fps));
            const nowScene = (f: number) => timings.find((t) => f >= msToFrame(t.startMs, fps) && f < msToFrame(t.endMs, fps))?.scene.id;
            return (
              <ScoreboardHost sb={sb} reveal={reveal} beats={beats} nowScene={nowScene} timings={timings} captions={captions} />
            );
          })() : null}
        </>
      ) : spec.overlays ? (
        <>
          <Vignette />
          <BrandBar />
          {timings.map((t) => {
            const from = msToFrame(t.startMs, fps);
            const dur = Math.max(1, msToFrame(t.endMs, fps) - from);
            return t.scene.overlay || t.scene.chapter ? (
              <Sequence key={t.scene.id} from={from} durationInFrames={dur} layout="none">
                <SceneOverlay overlay={t.scene.overlay} chapter={t.scene.chapter} />
              </Sequence>
            ) : null;
          })}
          {spec.race ? (
            <RacePanel race={spec.race} keys={raceKeys} showFrame={beats['race:start']} dockFrame={beats[spec.race.dockAfter] ?? 0} hideFrame={beats[spec.race.until] ?? Infinity} />
          ) : null}
        </>
      ) : null}
      {captions && spec.style === 'frame' ? (
        <Captions captions={captions} top={Z.caption} fontFamily={FONT.ui} fontSize={58} stroke={false} karaoke singleLine combineMs={500} color={spec.theme === 'light' ? '#1F2328' : '#fff'} activeColor={spec.theme === 'light' ? '#C98F00' : undefined} />
      ) : captions && spec.style === 'night' ? (
        <Captions captions={captions} top={1250} fontFamily={FONT.ui} fontSize={72} stroke={false} karaoke combineMs={750} />
      ) : captions ? (
        <Captions captions={captions} highlight={spec.highlight} top={spec.overlays ? 1430 : 1180} fontFamily={spec.style === 'clean' ? FONT.ui : spec.overlays ? FONT.display : undefined} fontSize={spec.style === 'clean' ? 80 : spec.overlays ? 88 : 104} stroke={spec.style !== 'clean'} />
      ) : null}
    </AbsoluteFill>
  );
};

const ScoreboardHost: React.FC<{sb: NonNullable<ShortSpec['scoreboard']>; reveal: number[]; beats: Beats; nowScene: (f: number) => string | undefined; timings: ReturnType<typeof sceneTimings>; captions: Caption[] | null}> = ({sb, reveal, beats, nowScene, timings, captions}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const scene = nowScene(f);
  const active = sb.columns.findIndex((c) => c.reveal.scene === scene);
  const n = (sb.notes ?? []).find((x) => x.scene === scene);
  const note = n ? {text: n.text, tone: n.tone, frame: msToFrame(markMs(timings, captions, n.scene, n.word, 0.5), fps)} : undefined;
  return <Scoreboard spec={sb} reveal={reveal} active={active} note={note && f >= note.frame ? note : undefined} showFrame={beats[sb.from] ?? 0} hideFrame={beats[sb.until] ?? Infinity} />;
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
