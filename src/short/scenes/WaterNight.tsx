import React, {useMemo} from 'react';
import * as THREE from 'three';
import {ThreeCanvas} from '@remotion/three';
import {useThree} from '@react-three/fiber';
import {RoundedBox} from '@react-three/drei';
import {Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {NightLook} from '../../world/Look';
import {HeatShimmer} from '../../world/parts';
import {type Beats, type V3, lerp, mix3, rand, ramp} from '../../world/kit';
import {Bubbles, Steam} from './WaterBoiling';
import {Blueprint, NO_BP} from '../../world/Blueprint';

// 1 Liter Wasser kochen – dunkle Küchenbühne: drei moderne Geräte, je eine warme Lichtinsel.
// Maße in Metern, Arbeitsplatte bei y = 0, Blick von vorne (+z).

const KETTLE: V3 = [0, 0, 0];
const JUG: V3 = [-0.36, 0, 0.12];
const HOB: V3 = [0.64, 0, -0.02];
const MICRO: V3 = [1.38, 0, -0.08];

const hot = (hex: string, k: number) => new THREE.Color(hex).multiplyScalar(k);

// ---------- Kamera: harte Schnitte an Beats, dazwischen langsame Fahrt ----------
type Cam = {pos: V3; target: V3; fov: number};
type CutShot = {id: string; a: Cam; b?: Cam};

const SHOTS: CutShot[] = [
  {id: 'frage', a: {pos: [-0.9, 0.5, 0.5], target: [0.75, 0.0, -0.1], fov: 40}, b: {pos: [-0.8, 0.46, 0.45], target: [0.75, 0.0, -0.1], fov: 40}},
  {id: 'frage.k', a: {pos: [0.192, 0.328, 1.277], target: [0.0, -0.03, 0.0], fov: 36}, b: {pos: [0.153, 0.302, 1.174], target: [0.0, -0.03, 0.0], fov: 36}},
  {id: 'frage.h', a: {pos: [0.64, 0.799, 1.537], target: [0.64, -0.07, -0.02], fov: 36}, b: {pos: [0.64, 0.747, 1.41], target: [0.64, -0.07, -0.02], fov: 36}},
  {id: 'frage.m', a: {pos: [1.33, 0.378, 2.321], target: [1.33, -0.03, -0.08], fov: 36}, b: {pos: [1.33, 0.353, 2.129], target: [1.33, -0.03, -0.08], fov: 36}},
  {id: 'frage.w', a: {pos: [2.3, 0.55, 0.55], target: [0.6, 0.0, -0.1], fov: 40}, b: {pos: [2.2, 0.52, 0.5], target: [0.6, 0.0, -0.1], fov: 40}},
  {id: 'rechnen', a: {pos: [2.3, 0.55, 0.55], target: [0.6, 0.0, -0.1], fov: 40}, b: {pos: [2.15, 0.5, 0.48], target: [0.6, 0.0, -0.1], fov: 40}},
  {id: 'rechnen.b', a: {pos: [-0.321, 0.25, 1.116], target: [-0.36, -0.03, 0.12], fov: 36}, b: {pos: [-0.335, 0.225, 0.962], target: [-0.36, -0.03, 0.12], fov: 36}},
  {id: 'kettle', a: {pos: [0.192, 0.328, 1.353], target: [0.0, -0.03, 0.0], fov: 36}, b: {pos: [0.153, 0.302, 1.2], target: [0.0, -0.03, 0.0], fov: 36}},
  {id: 'kettle.b', a: {pos: [0.0, 0.202, 1.067], target: [0.0, -0.02, 0.0], fov: 36}, b: {pos: [0.0, 0.187, 0.934], target: [0.0, -0.02, 0.0], fov: 36}},
  {id: 'kettle.c', a: {pos: [-0.383, 0.464, 1.149], target: [0.0, 0.03, 0.0], fov: 36}, b: {pos: [-0.332, 0.438, 1.047], target: [0.0, 0.03, 0.0], fov: 36}},
  {id: 'herd', a: {pos: [0.64, 0.957, 1.41], target: [0.64, -0.09, -0.02], fov: 36}, b: {pos: [0.64, 0.88, 1.282], target: [0.64, -0.09, -0.02], fov: 36}},
  {id: 'herd.b', a: {pos: [1.163, 0.373, 1.473], target: [0.64, -0.01, -0.02], fov: 36}, b: {pos: [1.099, 0.348, 1.346], target: [0.64, -0.01, -0.02], fov: 36}},
  {id: 'mikro', a: {pos: [1.33, 0.378, 2.385], target: [1.33, -0.03, -0.08], fov: 36}, b: {pos: [1.33, 0.353, 2.167], target: [1.33, -0.03, -0.08], fov: 36}},
  {id: 'mikro.b', a: {pos: [1.275, 0.245, 1.656], target: [1.3, -0.01, -0.08], fov: 36}, b: {pos: [1.275, 0.233, 1.491], target: [1.3, -0.01, -0.08], fov: 36}},
  {id: 'jahr', a: {pos: [2.3, 0.55, 0.55], target: [0.6, 0.0, -0.1], fov: 40}, b: {pos: [2.2, 0.52, 0.5], target: [0.6, 0.0, -0.1], fov: 40}},
  {id: 'tipp', a: {pos: [-0.255, 0.378, 1.277], target: [0.0, -0.03, 0.0], fov: 36}, b: {pos: [-0.204, 0.353, 1.149], target: [0.0, -0.03, 0.0], fov: 36}},
  {id: 'ende', a: {pos: [0.5, 0.9, 2.4], target: [0.6, 0.1, -0.1], fov: 40}, b: {pos: [0.5, 1.0, 2.7], target: [0.6, 0.1, -0.1], fov: 40}},
];

/** Sub-Shots hängen an gesprochenen Wörtern (Beats "<szene>@<wort>"). */
const ALIAS: Record<string, string> = {'frage.k': 'frage@wasserkocher', 'frage.h': 'frage@herd', 'frage.m': 'frage@mikrowelle', 'frage.w': 'frage@was', 'rechnen.b': 'rechnen@liter', 'kettle.b': 'kettle@blick', 'kettle.c': 'kettle@kosten', 'herd.b': 'herd@wärme', 'mikro.b': 'mikro@zwölf'};

const smooth = Easing.inOut(Easing.sin);
export function nightCamera(f: number, beats: Beats, end: number): Cam {
  const at = (id: string) => beats[id] ?? (ALIAS[id] ? beats[ALIAS[id]] : undefined);
  let idx = 0;
  for (let i = 0; i < SHOTS.length; i++) {
    const b = at(SHOTS[i].id);
    if (b !== undefined && f >= b) idx = i;
  }
  const s = SHOTS[idx];
  const start = at(s.id) ?? 0;
  const stop = SHOTS.slice(idx + 1).map((x) => at(x.id)).find((x) => x !== undefined) ?? end;
  const u = smooth(interpolate(f, [start, Math.max(start + 1, stop)], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));
  const b = s.b ?? s.a;
  return {pos: mix3(s.a.pos, b.pos, u), target: mix3(s.a.target, b.target, u), fov: lerp(s.a.fov, b.fov, u)};
}

const Rig: React.FC<{cam: Cam}> = ({cam}) => {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  camera.position.set(...cam.pos);
  camera.lookAt(...cam.target);
  if (camera.fov !== cam.fov) {
    camera.fov = cam.fov;
    camera.updateProjectionMatrix();
  }
  return null;
};

// ---------- Küche ----------
const Kitchen: React.FC = React.memo(() => (
  <group>
    {/* Arbeitsplatte, Unterschränke, Rückwand, Oberschrank mit LED-Leiste */}
    <mesh position={[0.5, -0.02, 0]} receiveShadow>
      <boxGeometry args={[4.2, 0.04, 0.72]} />
      <meshStandardMaterial color="#4a3a2e" roughness={0.5} />
    </mesh>
    <mesh position={[0.5, -0.47, 0.0]}>
      <boxGeometry args={[4.2, 0.86, 0.68]} />
      <meshStandardMaterial color="#23262c" roughness={0.65} />
    </mesh>
    {[-0.9, -0.3, 0.3, 0.9, 1.5, 2.1].map((x) => (
      <group key={x}>
        <mesh position={[x, -0.47, 0.342]}>
          <boxGeometry args={[0.006, 0.84, 0.004]} />
          <meshStandardMaterial color="#0c1018" />
        </mesh>
        <mesh position={[x + 0.3, -0.09, 0.352]}>
          <boxGeometry args={[0.22, 0.012, 0.014]} />
          <meshStandardMaterial color="#9aa3ad" metalness={0.9} roughness={0.3} />
        </mesh>
      </group>
    ))}
    <mesh position={[0.5, 0.65, -0.37]} receiveShadow>
      <planeGeometry args={[4.2, 1.5]} />
      <meshStandardMaterial color="#1a1c21" roughness={0.85} />
    </mesh>
    <mesh position={[0.5, 0.86, -0.2]}>
      <boxGeometry args={[4.2, 0.5, 0.34]} />
      <meshStandardMaterial color="#23262c" roughness={0.65} />
    </mesh>
    <mesh position={[0.5, 0.606, -0.06]}>
      <boxGeometry args={[4.0, 0.006, 0.014]} />
      <meshBasicMaterial color={hot('#ffb867', 4)} toneMapped={false} />
    </mesh>
  </group>
));

// ---------- Wasserkocher (modern, weiß) ----------
const KETTLE_PROFILE: [number, number][] = [[0, 0], [0.071, 0], [0.076, 0.012], [0.078, 0.05], [0.074, 0.14], [0.066, 0.188], [0.062, 0.195]];

const Kettle: React.FC<{t: number; on: number; xray: number; steam: number; boil: number; scan: number}> = ({t, on, xray, steam, boil, scan}) => {
  const body = useMemo(() => new THREE.LatheGeometry(KETTLE_PROFILE.map(([r, y]) => new THREE.Vector2(r, y)), 64), []);
  const op = 1 - 0.85 * xray;
  const shell = {transparent: xray > 0.01, opacity: op, depthWrite: xray < 0.3};
  return (
    <group position={KETTLE}>
      {/* Sockel */}
      <mesh position={[0, 0.009, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.083, 0.088, 0.018, 64]} />
        <meshStandardMaterial color="#23272e" roughness={0.4} {...shell} />
      </mesh>
      <group position={[0, 0.02, 0]}>
        <mesh geometry={body} castShadow>
          <meshStandardMaterial color="#dfe3e7" roughness={0.42} side={THREE.DoubleSide} {...shell} />
        </mesh>
        {/* Deckel + Knopf */}
        <mesh position={[0, 0.198, 0]}>
          <cylinderGeometry args={[0.063, 0.063, 0.01, 64]} />
          <meshStandardMaterial color="#d9dde1" roughness={0.3} {...shell} />
        </mesh>
        <mesh position={[0.02, 0.207, 0]}>
          <boxGeometry args={[0.03, 0.01, 0.016]} />
          <meshStandardMaterial color="#2b3038" roughness={0.4} {...shell} />
        </mesh>
        {/* Griff */}
        <RoundedBox args={[0.026, 0.15, 0.036]} radius={0.011} position={[0.112, 0.105, 0]} castShadow>
          <meshStandardMaterial color="#2b3038" roughness={0.45} {...shell} />
        </RoundedBox>
        {[0.172, 0.04].map((y) => (
          <mesh key={y} position={[0.092, y, 0]}>
            <boxGeometry args={[0.036, 0.022, 0.03]} />
            <meshStandardMaterial color="#2b3038" roughness={0.45} {...shell} />
          </mesh>
        ))}
        {/* Ausguss */}
        <mesh position={[-0.072, 0.178, 0]} rotation={[0, 0, 0.75]}>
          <cylinderGeometry args={[0.012, 0.026, 0.05, 32, 1, true]} />
          <meshStandardMaterial color="#eef0f2" roughness={0.32} side={THREE.DoubleSide} {...shell} />
        </mesh>
        {/* Wasserstand-Fenster */}
        <mesh position={[0, 0.095, 0.0765]}>
          <boxGeometry args={[0.022, 0.1, 0.004]} />
          <meshStandardMaterial color={'#1b2b3c'} emissive={'#4fb6ff'} emissiveIntensity={0.25 + on * 1.4} roughness={0.15} {...shell} />
        </mesh>
        {/* Leuchtring unten */}
        <mesh position={[0, 0.012, 0]} rotation-x={Math.PI / 2}>
          <torusGeometry args={[0.0775, 0.0028, 12, 96]} />
          <meshBasicMaterial color={hot('#4fc3ff', 0.35 + on * 4)} toneMapped={false} />
        </mesh>
        {/* Röntgenblick: Heizelement direkt unter dem Wasser, Wärme steigt ins Wasser */}
        {xray > 0.01 ? (
          <group userData={NO_BP}>
            <mesh position={[0, 0.075, 0]}>
              <cylinderGeometry args={[0.068, 0.072, 0.13, 48]} />
              <meshStandardMaterial color="#3c9be8" transparent opacity={0.42 * xray} roughness={0.1} depthWrite={false} />
            </mesh>
            <mesh position={[0, 0.008, 0]}>
              <cylinderGeometry args={[0.072, 0.072, 0.006, 48]} />
              <meshStandardMaterial color="#2a2a2a" emissive="#ff5a1f" emissiveIntensity={3 * xray} />
            </mesh>
            <HeatShimmer t={t} amount={xray} center={[0, 0.012, 0]} radius={0.062} rise={0.12} size={0.0045} />
          </group>
        ) : null}
        <group position={[0, 0.012, 0]} userData={NO_BP}>
          <Bubbles t={t} on={xray * boil} radius={0.066} height={0.125} />
        </group>
      </group>
      <group userData={NO_BP}>
        <Steam t={t} on={steam * 0.6} at={[-0.1, 0.205, 0]} scale={0.38} />
        {/* Röntgen-Scan: gelber Ring fährt von oben nach unten durchs Gerät */}
        {scan > 0.001 && scan < 0.999 ? (
          <group position={[0, 0.245 - scan * 0.245, 0]}>
            <mesh rotation-x={Math.PI / 2}>
              <torusGeometry args={[0.1, 0.0022, 10, 96]} />
              <meshBasicMaterial color={hot('#FFD23F', 4)} toneMapped={false} />
            </mesh>
            <mesh rotation-x={-Math.PI / 2}>
              <circleGeometry args={[0.1, 64]} />
              <meshBasicMaterial color={hot('#FFD23F', 1.2)} transparent opacity={0.22} toneMapped={false} depthWrite={false} side={THREE.DoubleSide} />
            </mesh>
          </group>
        ) : null}
      </group>
    </group>
  );
};

// ---------- Messbecher mit 1 Liter ----------
const Jug: React.FC = React.memo(() => {
  const glass = useMemo(() => new THREE.LatheGeometry([[0, 0], [0.058, 0], [0.06, 0.005], [0.064, 0.17]].map(([r, y]) => new THREE.Vector2(r, y)), 64), []);
  return (
    <group position={JUG}>
      <mesh geometry={glass}>
        <meshStandardMaterial color="#cfe8ff" transparent opacity={0.22} roughness={0.05} metalness={0.1} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      <mesh position={[0, 0.066, 0]}>
        <cylinderGeometry args={[0.06, 0.056, 0.124, 48]} />
        <meshStandardMaterial color="#3c9be8" transparent opacity={0.55} roughness={0.08} depthWrite={false} />
      </mesh>
      {[0.04, 0.085, 0.128].map((y, i) => (
        <mesh key={y} position={[0.02, y, 0.061]}>
          <boxGeometry args={[i === 2 ? 0.04 : 0.022, 0.003, 0.002]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
      ))}
      <mesh position={[0.07, 0.1, 0]}>
        <torusGeometry args={[0.035, 0.007, 12, 32, Math.PI]} />
        <meshStandardMaterial color="#cfe8ff" transparent opacity={0.35} roughness={0.05} />
      </mesh>
    </group>
  );
});

// ---------- Herd: klassische Gusskochplatte mit Topf ----------
const PLATE_R = 0.095;
const Hob: React.FC<{t: number; heat: number; loss: number; steam: number}> = ({t, heat, loss, steam}) => {
  const pot = useMemo(() => new THREE.LatheGeometry([[0, 0], [0.1, 0], [0.103, 0.004], [0.104, 0.125], [0.11, 0.13]].map(([r, y]) => new THREE.Vector2(r, y)), 64), []);
  const particles = useMemo(() => new THREE.SphereGeometry(0.005, 8, 8), []);
  return (
    <group position={HOB}>
      {/* Edelstahl-Mulde */}
      <mesh position={[0.06, 0.004, 0]} receiveShadow>
        <boxGeometry args={[0.6, 0.008, 0.52]} />
        <meshStandardMaterial color="#8f969d" metalness={0.85} roughness={0.32} />
      </mesh>
      {[
        [0, 0, PLATE_R, heat],
        [0.22, -0.13, 0.072, 0],
        [0.22, 0.13, 0.072, 0],
      ].map(([x, z, r, h], i) => (
        <group key={i} position={[x, 0.008, z]}>
          <mesh position={[0, 0.007, 0]}>
            <cylinderGeometry args={[r, r, 0.014, 64]} />
            <meshStandardMaterial color="#1b1c1f" roughness={0.55} emissive="#ff3a12" emissiveIntensity={h * 0.9} />
          </mesh>
          <mesh position={[0, 0.012, 0]} rotation-x={Math.PI / 2}>
            <torusGeometry args={[r + 0.005, 0.0035, 10, 96]} />
            <meshStandardMaterial color="#c7ccd1" metalness={0.9} roughness={0.25} />
          </mesh>
          {/* glühender Rand, wo die Platte über den Topf hinaus heizt */}
          {h > 0.01 ? (
            <mesh position={[0, 0.0145, 0]} rotation-x={-Math.PI / 2}>
              <ringGeometry args={[r * 0.82, r, 64]} />
              <meshBasicMaterial color={hot('#ff4a1a', 2.2)} transparent opacity={h * 0.8} toneMapped={false} />
            </mesh>
          ) : null}
        </group>
      ))}
      {/* Topf mit Wasser */}
      <group position={[0, 0.023, 0]}>
        <mesh geometry={pot} castShadow>
          <meshStandardMaterial color="#cdd2d7" metalness={0.92} roughness={0.22} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0, 0.098, 0]} rotation-x={-Math.PI / 2}>
          <circleGeometry args={[0.102, 64]} />
          <meshStandardMaterial color="#3c9be8" roughness={0.05} metalness={0.1} transparent opacity={0.9} />
        </mesh>
        {[-1, 1].map((s) => (
          <RoundedBox key={s} args={[0.05, 0.014, 0.03]} radius={0.006} position={[s * 0.128, 0.11, 0]}>
            <meshStandardMaterial color="#23272e" roughness={0.5} />
          </RoundedBox>
        ))}
        <group userData={NO_BP}>
          <Steam t={t} on={steam * 0.6} at={[0, 0.13, 0]} scale={0.45} />
        </group>
      </group>
      {/* Wärme, die neben dem Topf in die Küche geht */}
      {loss > 0.01 ? (
        <group userData={NO_BP}>
          {Array.from({length: 46}).map((_, i) => {
            const period = 1.4 + rand(i) * 1.1;
            const ph = ((t + rand(i + 31) * period) % period) / period;
            const a = rand(i + 7) * Math.PI * 2;
            const r = PLATE_R + 0.004 + ph * (0.05 + rand(i + 13) * 0.1);
            return (
              <mesh key={i} geometry={particles} position={[r * Math.cos(a), 0.02 + ph * (0.1 + rand(i + 3) * 0.16), r * Math.sin(a)]} scale={1.2 - ph * 0.6}>
                <meshBasicMaterial color={hot('#ff8a3d', 2.5)} transparent opacity={loss * Math.min(1, ph * 5) * (1 - ph)} toneMapped={false} depthWrite={false} blending={THREE.AdditiveBlending} />
              </mesh>
            );
          })}
        </group>
      ) : null}
    </group>
  );
};

// ---------- Mikrowelle: Innenraum sichtbar, Drehteller, Wellen ----------
const WAVE = (() => {
  const pts = Array.from({length: 40}, (_, i) => new THREE.Vector3(-i * 0.003, Math.sin(i * 0.55) * 0.008, 0));
  return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 80, 0.0018, 6);
})();

const Microwave: React.FC<{t: number; on: number}> = ({t, on}) => {
  const hum = 0.85 + 0.15 * Math.sin(t * 11);
  const dark = {color: '#262b33', roughness: 0.45, metalness: 0.35};
  const cav = {color: '#d8d2c4', roughness: 0.7, emissive: '#ffb24d', emissiveIntensity: on * 0.2 * hum};
  return (
    <group position={MICRO}>
      {/* Gehäuse aus Platten, damit der Garraum durch die Tür sichtbar ist */}
      <mesh position={[0, 0.296, 0]} castShadow><boxGeometry args={[0.5, 0.012, 0.38]} /><meshStandardMaterial {...dark} /></mesh>
      <mesh position={[0, 0.01, 0]}><boxGeometry args={[0.5, 0.02, 0.38]} /><meshStandardMaterial {...dark} /></mesh>
      <mesh position={[-0.244, 0.15, 0]}><boxGeometry args={[0.012, 0.3, 0.38]} /><meshStandardMaterial {...dark} /></mesh>
      <mesh position={[0.19, 0.15, 0]} castShadow><boxGeometry args={[0.12, 0.3, 0.38]} /><meshStandardMaterial {...dark} /></mesh>
      <mesh position={[0, 0.15, -0.184]}><boxGeometry args={[0.5, 0.3, 0.012]} /><meshStandardMaterial {...dark} /></mesh>
      {/* Garraum innen */}
      <mesh position={[-0.054, 0.155, -0.176]}><planeGeometry args={[0.37, 0.27]} /><meshStandardMaterial {...cav} /></mesh>
      <mesh position={[-0.054, 0.021, 0]} rotation-x={-Math.PI / 2}><planeGeometry args={[0.37, 0.36]} /><meshStandardMaterial {...cav} /></mesh>
      <mesh position={[-0.054, 0.289, 0]} rotation-x={Math.PI / 2}><planeGeometry args={[0.37, 0.36]} /><meshStandardMaterial {...cav} /></mesh>
      <mesh position={[0.129, 0.155, 0]} rotation-y={-Math.PI / 2}><planeGeometry args={[0.36, 0.27]} /><meshStandardMaterial {...cav} /></mesh>
      <mesh position={[-0.237, 0.155, 0]} rotation-y={Math.PI / 2}><planeGeometry args={[0.36, 0.27]} /><meshStandardMaterial {...cav} /></mesh>
      {/* Drehteller mit Wasserkrug */}
      <group position={[-0.054, 0.026, 0]} userData={NO_BP} rotation-y={t * 0.7 * Math.min(1, on * 3)}>
        <mesh><cylinderGeometry args={[0.13, 0.13, 0.006, 64]} /><meshStandardMaterial color="#e6f2ff" transparent opacity={0.45} roughness={0.05} /></mesh>
        <group position={[0.03, 0.003, 0]}>
          <mesh position={[0, 0.06, 0]}><cylinderGeometry args={[0.058, 0.054, 0.12, 48]} /><meshStandardMaterial color="#3c9be8" transparent opacity={0.7} roughness={0.08} /></mesh>
          <mesh position={[0, 0.07, 0]}><cylinderGeometry args={[0.062, 0.058, 0.14, 48, 1, true]} /><meshStandardMaterial color="#e6f2ff" transparent opacity={0.25} roughness={0.05} side={THREE.DoubleSide} depthWrite={false} /></mesh>
        </group>
      </group>
      {/* Mikrowellen: von der rechten Wand zum Wasser */}
      {on > 0.01
        ? [0.08, 0.13, 0.18].map((y, k) =>
            [0, 1, 2].map((j) => {
              const ph = (t * 0.9 + j / 3 + k * 0.17) % 1;
              return (
                <mesh key={k + '-' + j} geometry={WAVE} position={[0.125 - ph * 0.1, y, 0.02 * (k - 1)]}>
                  <meshBasicMaterial color={hot('#8fe7ff', 2)} transparent opacity={on * Math.sin(ph * Math.PI) * 0.9} toneMapped={false} depthWrite={false} />
                </mesh>
              );
            }),
          )
        : null}
      <pointLight position={[-0.054, 0.2, 0.0]} intensity={on * 0.12 * hum} distance={0.8} decay={2} color="#ffb347" />
      {/* Tür: dunkles Glas mit Rahmen */}
      <mesh position={[-0.054, 0.155, 0.192]}>
        <planeGeometry args={[0.37, 0.27]} />
        <meshStandardMaterial color="#0b0e12" transparent opacity={0.42} roughness={0.08} metalness={0.4} depthWrite={false} />
      </mesh>
      {[
        [-0.054, 0.296 - 0.012, 0.42, 0.024],
        [-0.054, 0.024, 0.42, 0.024],
      ].map(([x, y, w, h], i) => (
        <mesh key={i} position={[x, y, 0.193]}><boxGeometry args={[w, h, 0.006]} /><meshStandardMaterial {...dark} /></mesh>
      ))}
      <mesh position={[-0.255 + 0.012, 0.155, 0.193]}><boxGeometry args={[0.024, 0.27, 0.006]} /><meshStandardMaterial {...dark} /></mesh>
      {/* Bedienfeld: Anzeige + Drehknopf */}
      <mesh position={[0.19, 0.245, 0.191]}>
        <boxGeometry args={[0.075, 0.026, 0.004]} />
        <meshBasicMaterial color={hot('#5ff0c8', 0.25 + on * 2.2)} toneMapped={false} />
      </mesh>
      <mesh position={[0.19, 0.13, 0.198]} rotation-x={Math.PI / 2}>
        <cylinderGeometry args={[0.026, 0.026, 0.016, 32]} />
        <meshStandardMaterial color="#9aa3ad" metalness={0.8} roughness={0.3} />
      </mesh>
    </group>
  );
};

// ---------- Szene ----------
const Stage: React.FC<{beats: Beats}> = ({beats}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = f / fps;
  const sec = (s: number) => Math.round(s * fps);
  const B = (id: string) => beats[id] ?? (ALIAS[id] ? beats[ALIAS[id]] : undefined) ?? Infinity;

  // Hook: jedes Gerät bekommt Licht, wenn es genannt wird
  const named = (word: string) => ramp(f, B('frage@' + word) - 2, sec(0.25)) * (1 - ramp(f, B('rechnen'), sec(0.2)));
  const hlK = named('wasserkocher'), hlH = named('herd'), hlM = named('mikrowelle');

  // Zeitraffer-Rennen: alle drei starten gleichzeitig, jedes Gerät hört bei seiner Zielzeit auf
  const start = beats['race:start'] ?? B('rechnen');
  const kDone = beats['done:Wasserkocher'] ?? B('kettle') + sec(2);
  const hDone = beats['done:Herdplatte'] ?? B('mikro');
  const mDone = beats['done:Mikrowelle'] ?? B('jahr');
  const kettleOn = ramp(f, start + sec(0.25), sec(0.25)) * (1 - ramp(f, kDone, sec(0.3))) + ramp(f, B('tipp') + sec(0.2), sec(0.3));
  const scan = interpolate(f, [B('kettle.b'), B('kettle.b') + sec(0.7)], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const xray = ramp(f, B('kettle.b') + sec(0.05), sec(0.6)) * (1 - ramp(f, B('kettle.c'), sec(0.35)));
  const kettleSteam = ramp(f, kDone - sec(0.2), sec(0.7)) * (1 - ramp(f, B('herd'), 2)) + ramp(f, B('tipp'), sec(0.6));
  const hobHeat = ramp(f, start + sec(0.2), sec(0.8)) * (1 - ramp(f, B('ende'), sec(0.6)));
  const loss = hobHeat * (0.35 + 0.65 * ramp(f, B('herd.b') - sec(0.3), sec(0.5)));
  const potSteam = ramp(f, hDone - sec(0.3), sec(1.0)) * (1 - ramp(f, B('ende'), sec(0.6)));
  const microOn = ramp(f, start + sec(0.2), sec(0.3)) * (1 - ramp(f, mDone, sec(0.3)));

  // Bauplan: Strichzeichnung → füllt sich, sobald das Gerät genannt wird
  const build = (at: number) => ramp(f, at - 2, sec(0.55));
  const lines = (at: number) => 1 - ramp(f, at + sec(0.5), sec(0.45));
  const kAt = B('frage@wasserkocher'), hAt = B('frage@herd'), mAt = B('frage@mikrowelle'), jAt = B('rechnen.b') - 3;

  return (
    <group>
      <Kitchen />
      {/* Grundlicht: warme LED unter dem Oberschrank, kühles Kantenlicht von hinten */}
      {[-0.5, 0.25, 1.0, 1.75].map((x) => (
        <pointLight key={x} position={[x, 0.55, -0.12]} intensity={0.55} distance={1.3} decay={2} color="#ffb46b" />
      ))}
      <directionalLight position={[-2.5, 2.2, -2.5]} intensity={0.5} color="#c9d3e6" />
      <directionalLight
        position={[1.8, 2.6, 2.6]}
        intensity={0.4}
        color="#ffd6a8"
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0003}
        shadow-normalBias={0.02}
        shadow-camera-left={-1.2}
        shadow-camera-right={2.2}
        shadow-camera-top={1.2}
        shadow-camera-bottom={-1.2}
      />
      {/* Lichtinseln über den Geräten */}
      <pointLight position={[KETTLE[0] + 0.05, 0.42, 0.18]} intensity={0.18 + hlK * 0.45 + kettleOn * 0.1} distance={0.9} decay={2} color="#ffd2a1" />
      <pointLight position={[HOB[0], 0.45, 0.2]} intensity={0.3 + hlH * 0.6} distance={0.9} decay={2} color="#ffd2a1" />
      <pointLight position={[HOB[0], 0.06, 0.05]} intensity={hobHeat * 0.35} distance={0.5} decay={2} color="#ff5a1f" />
      <pointLight position={[MICRO[0] - 0.05, 0.5, 0.35]} intensity={0.35 + hlM * 0.6} distance={1.0} decay={2} color="#ffd2a1" />
      <pointLight position={[JUG[0], 0.32, 0.3]} intensity={0.25} distance={0.6} decay={2} color="#cfe3ff" />

      <Blueprint build={build(kAt)} lines={Math.max(lines(kAt), xray * 0.85)} height={0.25}>
        <Kettle t={t} on={Math.min(1, kettleOn)} xray={xray} steam={Math.min(1, kettleSteam)} boil={xray} scan={scan} />
      </Blueprint>
      <Blueprint build={build(jAt)} lines={lines(jAt)} height={0.18}>
        <Jug />
      </Blueprint>
      <Blueprint build={build(hAt)} lines={lines(hAt)} height={0.17}>
        <Hob t={t} heat={hobHeat} loss={loss} steam={potSteam} />
      </Blueprint>
      <Blueprint build={build(mAt)} lines={lines(mAt)} height={0.31}>
        <Microwave t={t} on={microOn} />
      </Blueprint>
    </group>
  );
};

export const WaterNightScene: React.FC<{beats: Beats; width: number; height: number}> = ({beats, width, height}) => {
  const f = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const cam = nightCamera(f, beats, durationInFrames);
  const d = Math.hypot(cam.pos[0] - cam.target[0], cam.pos[1] - cam.target[1], cam.pos[2] - cam.target[2]);
  return (
    <ThreeCanvas width={width} height={height} shadows camera={{fov: 40, position: SHOTS[0].a.pos, near: 0.01, far: 50}} gl={{antialias: true}}>
      <Rig cam={cam} />
      <NightLook focus={{distance: d, range: Math.max(0.12, d * 0.4), bokeh: 3.5}} fog={[d + 0.4, d + 3.2]}>
        <Stage beats={beats} />
      </NightLook>
    </ThreeCanvas>
  );
};
