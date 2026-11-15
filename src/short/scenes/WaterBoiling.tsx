import React, {useMemo} from 'react';
import * as THREE from 'three';
import {ThreeCanvas} from '@remotion/three';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {Model} from '../../world/assets';
import {CameraRig} from '../../world/CameraRig';
import {WorldLook} from '../../world/Look';
import {HAUS_SPOTS, TechnikHaus} from '../../world/TechnikHaus';
import {Flow, HeatShimmer, Tube} from '../../world/parts';
import {type Beats, type Shot, type V3, cameraAt, rand, ramp} from '../../world/kit';

// 1 Liter Wasser: Wasserkocher, Herd oder Mikrowelle? Spielt in der Küche des Technik-Hauses (Meter).

const COUNTER = 0.91;
const KETTLE: V3 = [-2.9, COUNTER, -2.95];
const POT: V3 = [-4.24, 0.9, -2.86];
const MICRO: V3 = [-1.55, COUNTER, -3.0];

// Haupt-Shots je Szene + Nahaufnahmen (Anteil der Szenendauer), damit alle 2–3 s ein neuer Bildausschnitt kommt.
const SUB: [string, string, string, number][] = [
  ['frage.b', 'frage', 'kettle', 0.4],
  ['kettle.b', 'kettle', 'herd', 0.3],
  ['kettle.c', 'kettle', 'herd', 0.62],
  ['herd.b', 'herd', 'mikro', 0.3],
  ['herd.c', 'herd', 'mikro', 0.62],
  ['mikro.b', 'mikro', 'ergebnis', 0.35],
  ['mikro.c', 'mikro', 'ergebnis', 0.68],
  ['ergebnis.b', 'ergebnis', 'warum', 0.45],
  ['warum.b', 'warum', 'ende', 0.45],
];
const ORDER = ['frage', 'frage.b', 'kettle', 'kettle.b', 'kettle.c', 'herd', 'herd.b', 'herd.c', 'mikro', 'mikro.b', 'mikro.c', 'ergebnis', 'ergebnis.b', 'warum', 'warum.b', 'ende'];
const SHOTS: Record<string, Shot> = {
  frage: {pos: [-0.75, 1.42, -1.55], target: [-3.2, 0.98, -3.0], fov: 48},
  'frage.b': {pos: [-1.35, 1.3, -2.0], target: [-3.3, 0.98, -3.0], fov: 46, dur: 2.6},
  kettle: {pos: [-2.58, 1.15, -2.4], target: [-2.9, 0.95, -2.95], fov: 40, dur: 0.8},
  'kettle.b': {pos: [-2.38, 1.08, -2.62], target: [-2.75, 0.9, -3.1], fov: 40, dur: 0.7},
  'kettle.c': {pos: [-2.7, 1.32, -2.45], target: [-2.9, 1.08, -2.95], fov: 42, dur: 0.7},
  herd: {pos: [-3.95, 1.4, -2.3], target: [-4.25, 0.88, -2.9], fov: 42, dur: 0.8},
  'herd.b': {pos: [-3.9, 1.08, -2.38], target: [-4.24, 0.86, -2.86], fov: 40, dur: 0.7},
  'herd.c': {pos: [-4.62, 1.16, -2.3], target: [-4.24, 0.9, -2.86], fov: 42, dur: 0.7},
  mikro: {pos: [-1.0, 1.3, -1.75], target: [-1.6, 0.97, -3.0], fov: 44, dur: 0.8},
  'mikro.b': {pos: [-1.25, 1.22, -2.12], target: [-1.55, 0.99, -3.0], fov: 42, dur: 0.7},
  'mikro.c': {pos: [-1.2, 1.42, -1.5], target: [-2.2, 0.9, -3.0], fov: 50, dur: 0.8},
  ergebnis: {pos: [-0.9, 1.55, -1.35], target: [-3.0, 0.98, -3.0], fov: 50, dur: 0.9},
  'ergebnis.b': {pos: [-1.4, 1.45, -1.8], target: [-3.0, 0.98, -3.0], fov: 48, dur: 2.2},
  warum: {pos: [-2.66, 1.13, -2.52], target: [-2.9, 1.02, -2.95], fov: 36, dur: 1.2},
  'warum.b': {pos: [-2.71, 1.1, -2.6], target: [-2.9, 1.02, -2.95], fov: 35, dur: 2.2},
  ende: {...HAUS_SPOTS.aussen, dur: 1.8},
};

/** Ergänzt die Beats um die Zeitpunkte der Nahaufnahmen. */
const withSubBeats = (beats: Beats): Beats => {
  const out = {...beats};
  for (const [id, parent, next, frac] of SUB) if (beats[parent] !== undefined && beats[next] !== undefined) out[id] = Math.round(beats[parent] + frac * (beats[next] - beats[parent]));
  return out;
};

/** Dampfwolke: weiche, wachsende, verblassende Kugeln. */
export const Steam: React.FC<{t: number; on: number; at: V3; scale?: number}> = ({t, on, at, scale = 1}) => {
  const geo = useMemo(() => new THREE.SphereGeometry(0.02, 12, 12), []);
  if (on <= 0.001) return null;
  return (
    <group position={at} scale={scale}>
      {Array.from({length: 18}).map((_, i) => {
        const period = 1.8 + rand(i) * 0.8;
        const ph = ((t + rand(i + 7) * period) % period) / period;
        const sway = Math.sin(t * 1.3 + i) * 0.03 * ph;
        return (
          <mesh key={i} geometry={geo} position={[(rand(i + 3) - 0.5) * 0.04 + sway, ph * 0.32, (rand(i + 5) - 0.5) * 0.04]} scale={1 + ph * 3.2}>
            <meshBasicMaterial color="#ffffff" transparent opacity={on * 0.22 * (1 - ph) * Math.min(1, ph * 6)} depthWrite={false} />
          </mesh>
        );
      })}
    </group>
  );
};

/** Aufsteigende Bläschen im Wasser (Röntgenblick). */
export const Bubbles: React.FC<{t: number; on: number; radius: number; height: number}> = ({t, on, radius, height}) => {
  const geo = useMemo(() => new THREE.SphereGeometry(0.0022, 8, 8), []);
  if (on <= 0.001) return null;
  return (
    <group>
      {Array.from({length: 30}).map((_, i) => {
        const period = 0.9 + rand(i) * 0.7;
        const ph = ((t + rand(i + 40) * period) % period) / period;
        const a = rand(i + 2) * Math.PI * 2, r = radius * 0.85 * Math.sqrt(rand(i + 9));
        return (
          <mesh key={i} geometry={geo} position={[r * Math.cos(a), 0.008 + ph * height, r * Math.sin(a)]} scale={0.6 + ph * 1.4}>
            <meshBasicMaterial color="#e8f7ff" transparent opacity={on * 0.85} depthWrite={false} />
          </mesh>
        );
      })}
    </group>
  );
};

const CORD: V3[] = [[-2.62, 1.03, -3.27], [-2.66, 0.95, -3.2], [-2.75, 0.918, -3.08], [-2.84, 0.918, -2.98]];

const Kitchen: React.FC<{beats: Beats}> = ({beats}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = f / fps;
  const sec = (s: number) => Math.round(s * fps);
  const B = (id: string) => beats[id];

  // Alle drei Geräte laufen ab Rennstart; Dampf kommt, wenn das jeweilige Thermometer 100 °C erreicht.
  const start = B('race:start') ?? B('frage');
  const kettleDone = B('done:Wasserkocher') ?? B('herd');
  const potDone = B('done:Herdplatte') ?? B('mikro');
  const microDone = B('done:Mikrowelle') ?? B('ergebnis');
  const kettleOn = ramp(f, start + sec(0.3), sec(0.4)) * (1 - ramp(f, kettleDone, sec(0.3)));
  const kettleSteam = ramp(f, kettleDone - sec(0.6), sec(1.0)) * (1 - ramp(f, B('ende'), sec(0.8)));
  const potHeat = ramp(f, start + sec(0.3), sec(1.0)) * (1 - ramp(f, B('ende'), sec(0.8)));
  const potLoss = ramp(f, start + sec(1.0), sec(1.0)) * (1 - ramp(f, B('ergebnis'), sec(0.8)));
  const potSteam = ramp(f, potDone - sec(0.6), sec(1.0));
  const microOn = ramp(f, start + sec(0.3), sec(0.5)) * (1 - ramp(f, microDone, sec(0.3)));
  const xray = ramp(f, B('warum'), sec(0.8)) * (1 - ramp(f, B('ende'), sec(0.6)));
  const hum = 0.75 + 0.25 * Math.sin(t * 9);

  return (
    <group>
      {/* Wasserkocher (eigenes Modell, damit er durchsichtig werden kann) */}
      <Model id="vintage_electric_kettle" height={0.24} position={KETTLE} opacity={1 - 0.82 * xray} />
      <Tube points={CORD} radius={0.0045} color="#f2f2ee" segments={40} />
      <Flow points={[...CORD].reverse()} t={t} on={kettleOn} count={6} speed={0.9} size={0.006} />
      <mesh position={[KETTLE[0], COUNTER + 0.025, KETTLE[2] + 0.085]}>
        <sphereGeometry args={[0.005, 12, 12]} />
        <meshBasicMaterial color="#ff8a3d" toneMapped={false} transparent opacity={Math.max(kettleOn, xray)} />
      </mesh>
      <Steam t={t} on={kettleSteam * (1 - xray * 0.6)} at={[KETTLE[0] + 0.02, COUNTER + 0.25, KETTLE[2]]} />

      {/* Röntgenblick: Wasser, Heizplatte direkt darunter, Wärme steigt auf */}
      {xray > 0.01 ? (
        <group position={[KETTLE[0] + 0.006, COUNTER + 0.045, KETTLE[2]]}>
          <mesh position={[0, 0.045, 0]}>
            <cylinderGeometry args={[0.05, 0.056, 0.09, 48]} />
            <meshStandardMaterial color="#4fb6ff" transparent opacity={0.38 * xray} roughness={0.1} depthWrite={false} />
          </mesh>
          <mesh position={[0, 0.002, 0]}>
            <cylinderGeometry args={[0.05, 0.05, 0.005, 48]} />
            <meshStandardMaterial color="#2a2a2a" emissive="#ff5a1f" emissiveIntensity={2.4 * xray} />
          </mesh>
          <HeatShimmer t={t} amount={xray * 0.7} center={[0, 0.008, 0]} radius={0.045} rise={0.08} size={0.004} />
          <Bubbles t={t} on={xray} radius={0.048} height={0.085} />
        </group>
      ) : null}

      {/* Topf auf der Herdplatte: Platte glüht, Wärme geht seitlich verloren */}
      <group position={POT}>
        <mesh position={[0, 0.003, 0]} rotation-x={-Math.PI / 2}>
          <ringGeometry args={[0.085, 0.112, 48]} />
          <meshStandardMaterial color="#1b1b1b" emissive="#ff3b1a" emissiveIntensity={2.2 * potHeat} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0, 0.065, 0]} castShadow>
          <cylinderGeometry args={[0.09, 0.088, 0.12, 48, 1, true]} />
          <meshStandardMaterial color="#c9ced4" metalness={0.9} roughness={0.25} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0, 0.006, 0]}>
          <cylinderGeometry args={[0.088, 0.088, 0.008, 48]} />
          <meshStandardMaterial color="#9aa1a8" metalness={0.9} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.1, 0]} rotation-x={-Math.PI / 2}>
          <circleGeometry args={[0.087, 48]} />
          <meshStandardMaterial color="#5aa9d6" roughness={0.05} metalness={0.1} transparent opacity={0.85} />
        </mesh>
        {[-1, 1].map((s) => (
          <mesh key={s} position={[s * 0.105, 0.1, 0]}>
            <boxGeometry args={[0.04, 0.012, 0.025]} />
            <meshStandardMaterial color="#2b2b2b" roughness={0.6} />
          </mesh>
        ))}
        <HeatShimmer t={t} amount={potLoss * 0.8} center={[0, 0.02, 0]} radius={0.14} rise={0.28} size={0.009} />
        <Steam t={t} on={potHeat * potSteam} at={[0, 0.13, 0]} scale={0.9} />
      </group>

      {/* Mikrowelle läuft: warmes Innenlicht, leises Pulsieren */}
      <pointLight position={[MICRO[0], MICRO[1] + 0.16, MICRO[2] + 0.3]} intensity={0.6 + microOn * hum * 2} distance={1.4} decay={2} color="#ffb347" />
      <HeatShimmer t={t} amount={microOn * 0.6} center={[MICRO[0], MICRO[1] + 0.34, MICRO[2] - 0.05]} radius={0.18} rise={0.25} size={0.012} />
    </group>
  );
};

export const WaterBoilingScene: React.FC<{beats: Beats; width: number; height: number}> = ({beats: base, width, height}) => {
  const beats = useMemo(() => withSubBeats(base), [base]);
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const {pos, target} = cameraAt(f, fps, beats, SHOTS, ORDER);
  const distance = Math.hypot(pos[0] - target[0], pos[1] - target[1], pos[2] - target[2]);
  return (
    <ThreeCanvas width={width} height={height} shadows camera={{fov: 46, position: SHOTS.frage.pos, near: 0.01, far: 200}} gl={{antialias: true}}>
      <CameraRig beats={beats} shots={SHOTS} order={ORDER} />
      <WorldLook focus={{distance, range: Math.max(0.3, distance * 0.45), bokeh: 3}}>
        <TechnikHaus omit={['kettle']} />
        <Kitchen beats={beats} />
      </WorldLook>
    </ThreeCanvas>
  );
};

