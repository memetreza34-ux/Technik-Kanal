import React, {useMemo} from 'react';
import * as THREE from 'three';
import {ThreeCanvas} from '@remotion/three';
import {useThree} from '@react-three/fiber';
import {Environment, RoundedBox} from '@react-three/drei';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {Bloom, EffectComposer, ToneMapping} from '@react-three/postprocessing';
import {ToneMappingMode} from 'postprocessing';
import {CaptionSlot, Heading, Mark, Shade} from '../frame/Frame';
import {HeatShimmer} from '../world/parts';
import {hdriUrl} from '../world/assets';
import {type V3, mix3, rand} from '../world/kit';

// Demo 3 – Blick ins Innere: Wie kühlt ein Kühlschrank? Helle Knet-Welt, offener Kühlschrank, Kältekreislauf sichtbar.

const cl = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};
const BLUE = '#3D9BFF';
const RED = '#FF5A3C';
const hot = (hex: string, k: number) => new THREE.Color(hex).multiplyScalar(k);

// ---------- Kältekreislauf (Kühlschrank-Koordinaten, Rückseite bei z = -0.3) ----------
const EVAP: V3[] = [[-0.24, 1.52, -0.25], [0.24, 1.52, -0.25], [0.25, 1.495, -0.25], [0.24, 1.47, -0.25], [-0.24, 1.47, -0.25], [-0.25, 1.445, -0.25], [-0.24, 1.42, -0.25], [0.24, 1.42, -0.25], [0.26, 1.42, -0.36]];
const SUCTION: V3[] = [[0.26, 1.42, -0.36], [0.22, 1.0, -0.37], [0.18, 0.4, -0.37], [0.15, 0.2, -0.4]];
const COND: V3[] = (() => {
  const pts: V3[] = [[0.15, 0.2, -0.4], [0.1, 0.32, -0.36]];
  const xs = [0.1, 0.02, -0.06, -0.14, -0.22];
  xs.forEach((x, i) => {
    const [a, b] = i % 2 === 0 ? [0.34, 1.3] : [1.3, 0.34];
    pts.push([x, a, -0.36], [x, b, -0.36]);
  });
  return pts.slice(0, -1).concat([[-0.22, 1.3, -0.36]]);
})();
const CAPILLARY: V3[] = [[-0.22, 1.3, -0.36], [-0.26, 1.44, -0.36], [-0.26, 1.52, -0.31], [-0.24, 1.52, -0.25]];

const curveOf = (pts: V3[]) => new THREE.CatmullRomCurve3(pts.map((p) => new THREE.Vector3(...p)), false, 'centripetal');

/** Rohr mit fließenden Teilchen; v = Geschwindigkeit in m/s. */
const Pipe: React.FC<{pts: V3[]; color: string; dot: string; t: number; v: number; radius?: number; on: number}> = ({pts, color, dot, t, v, radius = 0.014, on}) => {
  const curve = useMemo(() => curveOf(pts), [pts]);
  const geo = useMemo(() => new THREE.TubeGeometry(curve, 160, radius, 12), [curve, radius]);
  const dotGeo = useMemo(() => new THREE.SphereGeometry(radius * 1.25, 12, 12), [radius]);
  const len = useMemo(() => curve.getLength(), [curve]);
  const n = Math.max(3, Math.round(len / 0.07));
  return (
    <group>
      <mesh geometry={geo} castShadow>
        <meshStandardMaterial color={color} roughness={0.35} metalness={0.3} />
      </mesh>
      {on > 0.01
        ? Array.from({length: n}).map((_, i) => {
            const u = (((t * v) / len + i / n) % 1 + 1) % 1;
            return (
              <mesh key={i} geometry={dotGeo} position={curve.getPointAt(u)}>
                <meshBasicMaterial color={hot(dot, 1.6)} toneMapped={false} transparent opacity={on} />
              </mesh>
            );
          })
        : null}
    </group>
  );
};

/** Wärme aus dem Essen wandert zum Verdampfer (kleine orange Punkte, die blau werden). */
const HeatToEvap: React.FC<{from: V3; t: number; on: number; seed: number}> = ({from, t, on, seed}) => {
  const geo = useMemo(() => new THREE.SphereGeometry(0.009, 10, 10), []);
  if (on <= 0.01) return null;
  const to: V3 = [(rand(seed) - 0.5) * 0.3, 1.45, -0.22];
  return (
    <group>
      {Array.from({length: 7}).map((_, i) => {
        const ph = ((t * 0.55 + i / 7 + rand(seed + i)) % 1 + 1) % 1;
        const p = mix3(from, to, ph);
        p[0] += Math.sin(ph * 6 + i) * 0.02;
        const c = new THREE.Color('#ff8a3d').lerp(new THREE.Color('#6fc0ff'), ph);
        return (
          <mesh key={i} geometry={geo} position={p}>
            <meshBasicMaterial color={c.multiplyScalar(1.6)} toneMapped={false} transparent opacity={on * Math.sin(ph * Math.PI)} />
          </mesh>
        );
      })}
    </group>
  );
};

const Fridge: React.FC<{t: number; on: number}> = ({t, on}) => {
  const W = 0.6, H = 1.6, D = 0.6, th = 0.035;
  const shell = {color: '#FBFBFA', roughness: 0.45};
  const inner = {color: '#E6EEF4', roughness: 0.6};
  const buzz = Math.sin(t * 60) * 0.0015 * on;
  return (
    <group>
      {/* Gehäuse ohne Tür */}
      <RoundedBox args={[W, H, th]} radius={0.012} position={[0, H / 2 + 0.05, -D / 2 + th / 2]} castShadow receiveShadow><meshStandardMaterial {...shell} /></RoundedBox>
      <RoundedBox args={[th, H, D]} radius={0.012} position={[-W / 2 + th / 2, H / 2 + 0.05, 0]} castShadow receiveShadow><meshStandardMaterial {...shell} /></RoundedBox>
      <RoundedBox args={[th, H, D]} radius={0.012} position={[W / 2 - th / 2, H / 2 + 0.05, 0]} castShadow receiveShadow><meshStandardMaterial {...shell} /></RoundedBox>
      <RoundedBox args={[W, th, D]} radius={0.012} position={[0, H + 0.05 - th / 2, 0]} castShadow receiveShadow><meshStandardMaterial {...shell} /></RoundedBox>
      <RoundedBox args={[W, th * 2, D]} radius={0.012} position={[0, 0.05 + th, 0]} castShadow receiveShadow><meshStandardMaterial {...shell} /></RoundedBox>
      {/* Innenverkleidung */}
      <mesh position={[0, H / 2 + 0.05, -D / 2 + th + 0.001]}><planeGeometry args={[W - 2 * th, H - 2 * th]} /><meshStandardMaterial {...inner} /></mesh>
      {/* Glasböden */}
      {[0.5, 0.86, 1.2].map((y) => (
        <mesh key={y} position={[0, y, 0.0]}>
          <boxGeometry args={[W - 2 * th, 0.008, D - th]} />
          <meshStandardMaterial color="#cfe6f5" transparent opacity={0.45} roughness={0.1} />
        </mesh>
      ))}
      {/* Essen */}
      <mesh position={[-0.13, 0.62, 0.02]} castShadow><cylinderGeometry args={[0.035, 0.035, 0.22, 24]} /><meshStandardMaterial color="#5fbf7a" roughness={0.3} /></mesh>
      <RoundedBox args={[0.16, 0.09, 0.12]} radius={0.02} position={[0.1, 0.55, 0.0]} castShadow><meshStandardMaterial color="#FFD86B" roughness={0.6} /></RoundedBox>
      <RoundedBox args={[0.2, 0.08, 0.14]} radius={0.02} position={[0.02, 0.91, 0.02]} castShadow><meshStandardMaterial color="#FF9A7A" roughness={0.6} /></RoundedBox>
      <mesh position={[0.15, 1.26, 0.03]} castShadow><sphereGeometry args={[0.05, 24, 24]} /><meshStandardMaterial color="#E85D5D" roughness={0.5} /></mesh>
      {/* kühles Innenlicht */}
      <pointLight position={[0, 1.3, 0.1]} intensity={0.35 + on * 0.25} distance={1.2} decay={2} color="#bfe3ff" />
      {/* Füße */}
      {[[-0.25, 0.22], [0.25, 0.22], [-0.25, -0.22], [0.25, -0.22]].map(([x, z]) => (
        <mesh key={x + ',' + z} position={[x, 0.025, z]}><cylinderGeometry args={[0.02, 0.02, 0.05, 16]} /><meshStandardMaterial color="#9aa1a8" /></mesh>
      ))}
      {/* Kompressor */}
      <mesh position={[0.15 + buzz, 0.13, -0.42]} scale={[1.2, 1, 1]} castShadow>
        <sphereGeometry args={[0.1, 32, 24]} />
        <meshStandardMaterial color="#2f3439" roughness={0.45} metalness={0.3} />
      </mesh>
      {/* Kreislauf */}
      <Pipe pts={EVAP} color="#9ccfff" dot={BLUE} t={t} v={0.22} on={on} />
      <Pipe pts={SUCTION} color="#bcdcff" dot="#7fc0ff" t={t} v={0.22} on={on} />
      <Pipe pts={COND} color="#ffb199" dot={RED} t={t} v={0.22} on={on} />
      <Pipe pts={CAPILLARY} color="#ffd2b3" dot="#ff9a52" t={t} v={0.22} radius={0.008} on={on} />
    </group>
  );
};

// ---------- Kamera ----------
type Key = {f: number; pos: V3; target: V3};
const KEYS: Key[] = [
  {f: 0, pos: [3.4, 2.4, 7.4], target: [0, 0.15, 0]},
  {f: 86, pos: [3.0, 2.2, 6.6], target: [0, 0.15, 0]},
  {f: 110, pos: [0.75, 1.75, 1.6], target: [0, 1.31, -0.2]},
  {f: 165, pos: [0.65, 1.72, 1.42], target: [0, 1.31, -0.2]},
  {f: 188, pos: [5.5, 2.0, -0.8], target: [0, 0.3, -0.35]},
  {f: 204, pos: [3.0, 1.7, -6.6], target: [0.05, 0.22, -0.4]},
  {f: 240, pos: [2.7, 1.6, -6.0], target: [0.05, 0.22, -0.4]},
  {f: 262, pos: [1.6, 2.0, -7.2], target: [0, 0.25, -0.35]},
  {f: 300, pos: [1.7, 2.1, -7.8], target: [0, 0.25, -0.35]},
];
const ease = Easing.inOut(Easing.cubic);
const camAt = (f: number) => {
  let i = 0;
  while (i < KEYS.length - 2 && f >= KEYS[i + 1].f) i++;
  const a = KEYS[i], b = KEYS[i + 1];
  const u = ease(interpolate(f, [a.f, b.f], [0, 1], cl));
  return {pos: mix3(a.pos, b.pos, u), target: mix3(a.target, b.target, u)};
};
const Rig: React.FC<{pos: V3; target: V3}> = ({pos, target}) => {
  const camera = useThree((s) => s.camera);
  camera.position.set(...pos);
  camera.lookAt(...target);
  return null;
};

export const Kuehlschrank: React.FC = () => {
  const f = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();
  const t = f / fps;
  const on = interpolate(f, [20, 40], [0, 1], cl);
  const cam = camAt(f);
  const sub = interpolate(f, [34, 46], [0, 1], cl);
  return (
    <AbsoluteFill style={{background: '#EDE6DA'}}>
      <ThreeCanvas width={width} height={height} shadows camera={{fov: 36, position: KEYS[0].pos, near: 0.02, far: 40}} gl={{antialias: true}}>
        <Rig {...cam} />
        <color attach="background" args={['#EDE6DA']} />
        <fog attach="fog" args={['#EDE6DA', 13, 32]} />
        <Environment files={hdriUrl('brown_photostudio_02')} environmentIntensity={0.4} />
        <hemisphereLight args={['#ffffff', '#c9b79e', 0.45]} />
        <directionalLight position={[2.5, 4, 3]} intensity={2.4} color="#fff1dc" castShadow shadow-mapSize={[2048, 2048]} shadow-camera-left={-2} shadow-camera-right={2} shadow-camera-top={2.5} shadow-camera-bottom={-1} shadow-bias={-0.0003} shadow-normalBias={0.02} />
        <directionalLight position={[-2, 2.5, -3]} intensity={1.5} color="#fff4e6" />
        <mesh rotation-x={-Math.PI / 2} receiveShadow>
          <planeGeometry args={[20, 20]} />
          <meshStandardMaterial color="#D9CBB6" roughness={0.9} />
        </mesh>
        <mesh position={[0, 2, -1.3]} receiveShadow>
          <planeGeometry args={[20, 4]} />
          <meshStandardMaterial color="#E3D6C3" roughness={0.95} />
        </mesh>
        <Fridge t={t} on={on} />
        {[[-0.13, 0.75, 0.02], [0.1, 0.62, 0.0], [0.02, 0.97, 0.02], [0.15, 1.3, 0.03]].map((p, i) => (
          <HeatToEvap key={i} from={p as V3} t={t} on={on * interpolate(f, [90, 110, 175, 185], [0.25, 1, 1, 0.25], cl)} seed={i * 11 + 3} />
        ))}
        <HeatShimmer t={t} amount={on * interpolate(f, [180, 230], [0.3, 1], cl)} center={[-0.05, 0.35, -0.5]} radius={0.22} rise={1.2} size={0.012} />
        <EffectComposer multisampling={4}>
          <Bloom mipmapBlur luminanceThreshold={0.95} luminanceSmoothing={0.2} intensity={0.6} />
          <ToneMapping mode={ToneMappingMode.NEUTRAL} />
        </EffectComposer>
      </ThreeCanvas>

      <Shade theme="light" />
      {f < 100 ? <Heading theme="light" text="Woher kommt die [Kälte?]" /> : f < 186 ? <Heading theme="light" text="1 · Innen: [Wärme rein]" from={100} /> : f < 252 ? <Heading theme="light" text="2 · Kompressor: [heiß]" from={186} /> : <Heading theme="light" text="3 · Hinten: [Wärme raus]" from={252} />}

      <CaptionSlot theme="light" show={30} hide={98}>
        Er <Mark theme="light">schiebt Wärme raus.</Mark>
      </CaptionSlot>
      <CaptionSlot theme="light" show={110} hide={184}>Kältemittel schluckt Wärme.</CaptionSlot>
      <CaptionSlot theme="light" show={194} hide={250}>Gepresst wird es heiß.</CaptionSlot>
      <CaptionSlot theme="light" show={258} hide={330}>Wärme geht in die Küche.</CaptionSlot>
    </AbsoluteFill>
  );
};
