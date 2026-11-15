import React, {useLayoutEffect, useMemo} from 'react';
import * as THREE from 'three';
import {ThreeCanvas} from '@remotion/three';
import {useThree} from '@react-three/fiber';
import {Environment, RoundedBox} from '@react-three/drei';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {Bloom, EffectComposer, ToneMapping} from '@react-three/postprocessing';
import {ToneMappingMode} from 'postprocessing';
import {hdriUrl} from '../../world/assets';
import {type Beats, type V3, mix3} from '../../world/kit';
import {Heading, Marker} from '../../frame/Frame';

// Wärmepumpe in 3D: Außengerät wird aufgeschnitten, Kältemittel kreist sichtbar
// (blau = kalt, rot = heiß) durch Verdampfer → Verdichter → Speicher → Expansionsventil.
// Weißer Hintergrund; Text: kleine Zwischenüberschrift, Markierungen am Bauteil, Untertitel.

const cl = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};
const ease = Easing.bezier(0.45, 0, 0.2, 1);
const ramp = (f: number, a: number, d = 20) => interpolate(f, [a, a + d], [0, 1], {...cl, easing: ease});

const COLD = new THREE.Color('#1f5fe0');
const COOL = new THREE.Color('#7cc8ff');
const HOT = new THREE.Color('#e5391f');
const WARM = new THREE.Color('#f29d38');
const CASE = '#e9ecef';
const DARK = '#3a3f46';
const ALU = '#cfd5db';
const COPPER = '#c8743a';
const NIGHT = '#0b1426';

/* ---------- Kältemittel-Kreislauf als Pfad ---------- */

const Z_E = -0.045;
const buildLoop = () => {
  const pts: V3[] = [];
  const mark: Record<string, number> = {};
  // Verdampfer (Schlange hinter dem Ventilator)
  for (let r = 0; r < 5; r++) {
    const y = 0.05 + r * 0.05;
    const [a, b] = r % 2 === 0 ? [-0.43, -0.28] : [-0.28, -0.43];
    pts.push([a, y, Z_E], [b, y, Z_E]);
  }
  mark.evapEnd = pts.length - 1;
  pts.push([-0.24, 0.25, Z_E], [-0.2, 0.25, 0], [-0.2, 0.19, 0]);
  mark.compIn = pts.length - 1;
  pts.push([-0.2, 0.06, 0], [-0.165, 0.06, 0]);
  mark.compOut = pts.length - 1;
  pts.push([-0.1, 0.06, 0], [-0.1, 0.46, 0], [0.2, 0.46, 0], [0.2, 0.36, 0]);
  mark.condIn = pts.length - 1;
  const turns = 5.5, n = 110;
  for (let i = 0; i <= n; i++) {
    const a = (i / n) * turns * Math.PI * 2;
    pts.push([0.2 + 0.055 * Math.cos(a), 0.34 - (i / n) * 0.28, 0.055 * Math.sin(a)]);
  }
  mark.condOut = pts.length - 1;
  pts.push([0.1, 0.03, 0], [0.04, 0.03, 0]);
  mark.valve = pts.length - 1;
  pts.push([-0.1, 0.03, 0], [-0.1, 0.03, Z_E], [-0.43, 0.03, Z_E], [-0.43, 0.05, Z_E]);
  const path = new THREE.CurvePath<THREE.Vector3>();
  for (let i = 1; i < pts.length; i++) path.add(new THREE.LineCurve3(new THREE.Vector3(...pts[i - 1]), new THREE.Vector3(...pts[i])));
  const lens = path.getCurveLengths();
  const total = path.getLength();
  const u = (idx: number) => (idx === 0 ? 0 : lens[idx - 1] / total);
  return {path, total, at: Object.fromEntries(Object.entries(mark).map(([k, v]) => [k, u(v)])) as Record<string, number>};
};

const colorAt = (u: number, at: Record<string, number>, out: THREE.Color) => {
  const seg = (a: number, b: number) => Math.min(1, Math.max(0, (u - a) / Math.max(1e-6, b - a)));
  if (u < at.evapEnd) return out.copy(COLD).lerp(COOL, seg(0, at.evapEnd));
  if (u < at.compIn) return out.copy(COOL);
  if (u < at.compOut) return out.copy(COOL).lerp(HOT, seg(at.compIn, at.compOut));
  if (u < at.condIn) return out.copy(HOT);
  if (u < at.condOut) return out.copy(HOT).lerp(WARM, seg(at.condIn, at.condOut));
  if (u < at.valve) return out.copy(WARM);
  return out.copy(WARM).lerp(COLD, seg(at.valve, at.valve + 0.03));
};

/* ---------- Bauteile ---------- */

const ClipOn: React.FC = () => {
  const gl = useThree((s) => s.gl);
  useLayoutEffect(() => {
    gl.localClippingEnabled = true;
  }, [gl]);
  return null;
};

const Rig: React.FC<{pos: V3; target: V3}> = ({pos, target}) => {
  const camera = useThree((s) => s.camera);
  camera.position.set(...pos);
  camera.lookAt(...target);
  return null;
};

const OutdoorUnit: React.FC<{cut: number; fanAng: number; compGlow: number; compShake: number}> = ({cut, fanAng, compGlow, compShake}) => {
  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 0, -1), 1), []);
  plane.constant = 0.3 - 0.32 * cut; // behält z <= constant → Front und Deckel vorne weg
  const clip = [plane];
  const front = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-0.16, -0.14); s.lineTo(0.16, -0.14); s.lineTo(0.16, 0.14); s.lineTo(-0.16, 0.14); s.lineTo(-0.16, -0.14);
    const h = new THREE.Path(); h.absarc(-0.06, 0, 0.1, 0, Math.PI * 2, true); s.holes.push(h);
    return s;
  }, []);
  const m = {color: CASE, roughness: 0.5, metalness: 0.1, clippingPlanes: clip, side: THREE.DoubleSide};
  return (
    <group>
      {/* Gehäuse: Rückwand, Deckel, Boden, Seiten, Front mit Lüfteröffnung */}
      <mesh position={[-0.3, 0.15, -0.068]} castShadow><boxGeometry args={[0.32, 0.28, 0.004]} /><meshStandardMaterial {...m} /></mesh>
      <mesh position={[-0.3, 0.29, 0]} castShadow><boxGeometry args={[0.32, 0.006, 0.14]} /><meshStandardMaterial {...m} /></mesh>
      <mesh position={[-0.3, 0.012, 0]}><boxGeometry args={[0.32, 0.006, 0.14]} /><meshStandardMaterial {...m} /></mesh>
      {[-0.459, -0.141].map((x) => (
        <mesh key={x} position={[x, 0.15, 0]} castShadow><boxGeometry args={[0.004, 0.28, 0.14]} /><meshStandardMaterial {...m} /></mesh>
      ))}
      <mesh position={[-0.3, 0.15, 0.069]}>
        <shapeGeometry args={[front]} />
        <meshStandardMaterial {...m} />
      </mesh>
      {/* Schutzgitter vor dem Lüfter */}
      {[0.03, 0.06, 0.09].map((r) => (
        <mesh key={r} position={[-0.36, 0.15, 0.074]}><torusGeometry args={[r, 0.0025, 8, 64]} /><meshStandardMaterial color="#5b6168" clippingPlanes={clip} /></mesh>
      ))}
      {/* Füße */}
      {[-0.42, -0.18].map((x) => (
        <mesh key={x} position={[x, 0.004, 0]}><boxGeometry args={[0.04, 0.008, 0.16]} /><meshStandardMaterial color={DARK} /></mesh>
      ))}

      {/* Ventilator */}
      <group position={[-0.36, 0.15, 0.045]} rotation-z={fanAng}>
        <mesh rotation-x={Math.PI / 2}><cylinderGeometry args={[0.022, 0.022, 0.03, 24]} /><meshStandardMaterial color={DARK} roughness={0.4} /></mesh>
        {[0, 1, 2].map((k) => (
          <mesh key={k} rotation-z={(k * 2 * Math.PI) / 3} position={[0, 0, 0]}>
            <mesh position={[0.05, 0, 0]} rotation-x={0.45}><boxGeometry args={[0.07, 0.04, 0.003]} /><meshStandardMaterial color="#2b2f35" roughness={0.5} /></mesh>
          </mesh>
        ))}
      </group>

      {/* Verdampfer: Alu-Lamellen */}
      {Array.from({length: 18}).map((_, k) => (
        <mesh key={k} position={[-0.44 + k * 0.0095, 0.15, Z_E]}>
          <boxGeometry args={[0.0018, 0.25, 0.03]} />
          <meshStandardMaterial color={ALU} roughness={0.35} metalness={0.6} />
        </mesh>
      ))}

      {/* Verdichter */}
      <group position={[-0.2 + compShake, 0.09, 0]}>
        <mesh castShadow><cylinderGeometry args={[0.036, 0.036, 0.12, 40]} /><meshStandardMaterial color={DARK} roughness={0.45} metalness={0.4} emissive="#ff5a1f" emissiveIntensity={compGlow * 0.18} /></mesh>
        <mesh position={[0, 0.06, 0]}><sphereGeometry args={[0.036, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshStandardMaterial color={DARK} roughness={0.45} metalness={0.4} emissive="#ff5a1f" emissiveIntensity={compGlow * 0.18} /></mesh>
      </group>
    </group>
  );
};

const Tank: React.FC<{heat: number}> = ({heat}) => {
  const water = new THREE.Color('#cfe6ff').lerp(new THREE.Color('#ffb067'), heat);
  return (
    <group position={[0.2, 0, 0]}>
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.083, 0.083, 0.38, 48, 1, true]} />
        <meshStandardMaterial color={water} transparent opacity={0.28 + 0.12 * heat} roughness={0.2} emissive="#ff8a2a" emissiveIntensity={heat * 0.25} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.088, 0.088, 0.4, 48, 1, true, Math.PI * 0.85, Math.PI * 1.3]} />
        <meshStandardMaterial color="#d4d8de" roughness={0.6} side={THREE.DoubleSide} />
      </mesh>
      {[0.0, 0.4].map((y) => (
        <mesh key={y} position={[0, y, 0]}><cylinderGeometry args={[0.09, 0.09, 0.012, 48]} /><meshStandardMaterial color="#f4f5f7" roughness={0.5} /></mesh>
      ))}
    </group>
  );
};

/* ---------- Welt: aufgeschnittenes Haus bei Nacht (Puppenhaus-Ansicht) ---------- */

const H = {x0: -0.02, x1: 0.86, zb: -0.35, zf: 0.3, floor2: 0.51, top: 0.82, ridge: 1.12};
const WALL_OUT = '#cbbfae';
const WALL_IN = '#e6d6bd';
const WOOD = '#8a6a4f';
const box = (pos: V3, size: V3, color: string, extra: Record<string, unknown> = {}) => (
  <mesh position={pos} castShadow receiveShadow>
    <boxGeometry args={size} />
    <meshStandardMaterial color={color} roughness={0.85} {...extra} />
  </mesh>
);
const pipePath = (pts: V3[]) => {
  const p = new THREE.CurvePath<THREE.Vector3>();
  for (let i = 1; i < pts.length; i++) p.add(new THREE.LineCurve3(new THREE.Vector3(...pts[i - 1]), new THREE.Vector3(...pts[i])));
  return p;
};
const SUPPLY: V3[] = [[0.2, 0.3, -0.07], [0.2, 0.3, -0.31], [0.56, 0.3, -0.31], [0.56, 0.24, -0.31]];
const RETURN: V3[] = [[0.7, 0.07, -0.31], [0.74, 0.07, -0.31], [0.74, 0.04, -0.31], [0.2, 0.04, -0.31], [0.2, 0.04, -0.07]];

const House: React.FC<{warm: number; radHeat: number; f: number; waterOn: number}> = ({warm, radHeat, f, waterOn}) => {
  const span = H.x1 - H.x0, depth = H.zf - H.zb, cx = (H.x0 + H.x1) / 2, cz = (H.zb + H.zf) / 2;
  const half = span / 2 + 0.06;
  const slope = Math.hypot(half, H.ridge - H.top);
  const ang = Math.atan2(H.ridge - H.top, half);
  const supply = useMemo(() => pipePath(SUPPLY), []);
  const ret = useMemo(() => pipePath(RETURN), []);
  const supplyGeo = useMemo(() => new THREE.TubeGeometry(supply, 80, 0.006, 8, false), [supply]);
  const retGeo = useMemo(() => new THREE.TubeGeometry(ret, 80, 0.006, 8, false), [ret]);
  const lamp = 0.6 + 0.4 * warm;
  const win = (x: number, y: number) => box([x, y, H.zb + 0.012], [0.12, 0.13, 0.004], '#1a2b4d', {emissive: '#3a5a9a', emissiveIntensity: 0.25});
  return (
    <group>
      {/* Bodenplatte, Decke, Wände (Front offen) */}
      {box([cx, -0.004, cz], [span + 0.04, 0.012, depth], WOOD)}
      {box([cx, H.floor2, cz], [span + 0.04, 0.022, depth], WOOD)}
      {box([H.x0, H.top / 2, cz], [0.02, H.top, depth], WALL_OUT)}
      {box([H.x1, H.top / 2, cz], [0.02, H.top, depth], WALL_OUT)}
      {box([cx, H.top / 2, H.zb], [span + 0.04, H.top, 0.02], WALL_IN)}
      {box([0.42, H.floor2 / 2, cz], [0.016, H.floor2, depth], WALL_IN)}
      {box([0.42, (H.floor2 + H.top) / 2, cz], [0.016, H.top - H.floor2, depth], WALL_IN)}
      {/* Giebel hinten */}
      <mesh position={[cx, H.top, H.zb]}>
        <shapeGeometry args={[useMemo(() => {
          const s = new THREE.Shape();
          s.moveTo(-span / 2, 0); s.lineTo(span / 2, 0); s.lineTo(0, H.ridge - H.top - 0.02); s.lineTo(-span / 2, 0);
          return s;
        }, [span])]} />
        <meshStandardMaterial color={WALL_IN} roughness={0.9} side={THREE.DoubleSide} />
      </mesh>
      {/* Dach mit Solarmodulen links */}
      {[-1, 1].map((s) => (
        <group key={s} position={[cx + (s * half) / 2, (H.top + H.ridge) / 2 + 0.01, cz + 0.02]} rotation-z={-s * ang}>
          {box([0, 0, 0], [slope, 0.022, depth + 0.1], '#5a4a44')}
          {s < 0 ? Array.from({length: 8}, (_, k) => (
            <mesh key={k} position={[-slope / 2 + 0.08 + (k % 4) * 0.105, 0.016, -0.15 + Math.floor(k / 4) * 0.27]}>
              <boxGeometry args={[0.095, 0.01, 0.25]} />
              <meshStandardMaterial color="#1c3560" roughness={0.25} metalness={0.4} emissive="#2a4f8f" emissiveIntensity={0.15} />
            </mesh>
          )) : null}
        </group>
      ))}
      {/* Fenster (nachtblau) */}
      {win(0.63, 0.32)}
      {win(0.2, 0.68)}
      {win(0.64, 0.68)}

      {/* Wohnzimmer: Sofa, Teppich, Stehlampe */}
      {box([0.64, 0.005, 0.02], [0.3, 0.004, 0.2], '#b5543c')}
      {box([0.62, 0.05, -0.2], [0.26, 0.08, 0.1], '#4f6d8a')}
      {box([0.62, 0.11, -0.245], [0.26, 0.08, 0.02], '#4f6d8a')}
      {box([0.8, 0.14, 0.12], [0.008, 0.28, 0.008], '#2b2f35')}
      <mesh position={[0.8, 0.29, 0.12]}><coneGeometry args={[0.04, 0.05, 24, 1, true]} /><meshStandardMaterial color="#ffe2b0" emissive="#ffb35a" emissiveIntensity={1.2 * lamp} side={THREE.DoubleSide} /></mesh>
      {/* Heizkörper an der Rückwand */}
      <group position={[0.63, 0.15, -0.315]}>
        {Array.from({length: 9}).map((_, k) => (
          <RoundedBox key={k} args={[0.014, 0.17, 0.03]} radius={0.005} position={[-0.064 + k * 0.016, 0, 0]} castShadow>
            <meshStandardMaterial color="#f2f2f2" roughness={0.4} emissive="#ff6a10" emissiveIntensity={radHeat * 0.9} />
          </RoundedBox>
        ))}
      </group>
      {/* Heizungswasser: Vorlauf (warm) und Rücklauf */}
      <mesh geometry={supplyGeo}><meshStandardMaterial color={COPPER} metalness={0.5} roughness={0.35} emissive="#ff5a1f" emissiveIntensity={waterOn * 0.9} /></mesh>
      <mesh geometry={retGeo}><meshStandardMaterial color={COPPER} metalness={0.5} roughness={0.35} emissive="#3a7bff" emissiveIntensity={waterOn * 0.35} /></mesh>
      {waterOn > 0.01 ? Array.from({length: 10}, (_, i) => {
        const p = supply.getPointAt((((i / 10 + f * 0.012) % 1) + 1) % 1);
        return <mesh key={i} position={[p.x, p.y, p.z]} scale={waterOn}><sphereGeometry args={[0.008, 10, 8]} /><meshStandardMaterial color="#ff7a2a" emissive="#ff7a2a" emissiveIntensity={1.6} /></mesh>;
      }) : null}

      {/* Obergeschoss: Schlafzimmer + Kinderzimmer */}
      {box([0.66, H.floor2 + 0.05, -0.18], [0.24, 0.07, 0.3], '#d9d4cc')}
      {box([0.66, H.floor2 + 0.09, -0.32], [0.24, 0.1, 0.02], WOOD)}
      {box([0.12, H.floor2 + 0.06, -0.26], [0.16, 0.1, 0.1], WOOD)}
      <mesh position={[0.3, H.floor2 + 0.06, -0.25]}><sphereGeometry args={[0.045, 16, 12]} /><meshStandardMaterial color="#5d8a4f" roughness={0.8} /></mesh>

      {/* warmes Raumlicht */}
      <pointLight position={[0.64, 0.4, 0.05]} color="#ffb06a" intensity={0.55 * lamp} distance={0.9} decay={2} />
      <pointLight position={[0.64, 0.74, 0.05]} color="#ffb06a" intensity={0.4 * lamp} distance={0.8} decay={2} />
      <pointLight position={[0.2, 0.74, 0.05]} color="#ffb06a" intensity={0.35 * lamp} distance={0.8} decay={2} />
      <pointLight position={[0.2, 0.44, 0.12]} color="#ffd9b0" intensity={0.12} distance={0.7} decay={2} />
    </group>
  );
};

/* Sterne + Schnee über der ganzen Welt */
const Sky: React.FC<{f: number}> = ({f}) => (
  <group>
    {Array.from({length: 90}, (_, i) => (
      <mesh key={'s' + i} position={[-3 + ((i * 97) % 100) / 100 * 6, 0.6 + ((i * 61) % 100) / 100 * 3, -3.2]}>
        <sphereGeometry args={[0.006 + (i % 3) * 0.003, 6, 4]} />
        <meshBasicMaterial color="#cfe0ff" transparent opacity={0.5 + 0.5 * Math.abs(Math.sin(i + f * 0.03))} />
      </mesh>
    ))}
    {Array.from({length: 110}, (_, i) => {
      const x = -1.4 + ((i * 53) % 100) / 100 * 2.6;
      const z = -0.9 + ((i * 31) % 100) / 100 * 1.8;
      if (x > H.x0 - 0.02 && x < H.x1 + 0.02 && z > H.zb && z < H.zf + 0.05) return null;
      const y = 1.4 - (((i * 0.41 + f * 0.0035) % 1 + 1) % 1) * 1.42;
      return (
        <mesh key={'n' + i} position={[x + Math.sin(f * 0.02 + i) * 0.02, y, z]}>
          <octahedronGeometry args={[0.006]} />
          <meshBasicMaterial color="#e6f0ff" />
        </mesh>
      );
    })}
  </group>
);

const Valve: React.FC<{pulse: number}> = ({pulse}) => (
  <group position={[0.04, 0.03, 0]}>
    <mesh><boxGeometry args={[0.03, 0.026, 0.026]} /><meshStandardMaterial color="#c9a23a" metalness={0.8} roughness={0.3} emissive="#3a7bff" emissiveIntensity={pulse * 0.8} /></mesh>
    <mesh position={[0, 0.026, 0]}><cylinderGeometry args={[0.008, 0.008, 0.03, 16]} /><meshStandardMaterial color="#c9a23a" metalness={0.8} roughness={0.3} /></mesh>
    <mesh position={[0, 0.045, 0]}><cylinderGeometry args={[0.016, 0.016, 0.01, 24]} /><meshStandardMaterial color={DARK} /></mesh>
  </group>
);

/* ---------- Kamera ---------- */

type Shot = {pos: V3; target: V3};
const SHOTS: Record<string, Shot> = {
  wide: {pos: [-2.3, 1.55, 3.5], target: [0.2, 0.42, 0]},
  unit: {pos: [-0.15, 0.32, 1.25], target: [-0.3, 0.11, 0]},
  evap: {pos: [-0.85, 0.32, 0.95], target: [-0.33, 0.1, -0.02]},
  comp: {pos: [0.1, 0.3, 0.8], target: [-0.2, 0.06, 0]},
  cond: {pos: [0.7, 0.45, 1.15], target: [0.24, 0.15, 0]},
  valve: {pos: [0.2, 0.16, 0.5], target: [0.03, 0.02, 0]},
  end: {pos: [-2.15, 1.45, 3.3], target: [0.22, 0.42, 0]},
};

const projectTo = (p: V3, cam: Shot): [number, number] => {
  const c = new THREE.PerspectiveCamera(30, 1080 / 1920, 0.01, 20);
  c.position.set(...cam.pos);
  c.lookAt(...cam.target);
  c.updateMatrixWorld();
  const v = new THREE.Vector3(...p).project(c);
  return [(v.x + 1) * 540, (1 - v.y) * 960];
};

/* ---------- Szene ---------- */

export const WaermepumpeScene: React.FC<{beats: Beats; width: number; height: number; theme?: 'dark' | 'light'}> = ({beats, width, height}) => {
  const f = useCurrentFrame();
  const b = (k: string, fb: number) => beats[k] ?? fb;
  const T = {
    frage: 0,
    kaeltemittel: b('kaeltemittel', 170),
    verdampfer: b('verdampfer', 330),
    verdichter: b('verdichter', 620),
    verfluessiger: b('verfluessiger', 800),
    ventil: b('ventil', 950),
    ende: b('ende', 1120),
  };
  const order: [number, string][] = [[T.frage, 'wide'], [T.kaeltemittel, 'unit'], [T.verdampfer, 'evap'], [T.verdichter, 'comp'], [T.verfluessiger, 'cond'], [T.ventil, 'valve'], [T.ende, 'end']];
  let cam: Shot = SHOTS.wide;
  for (let i = 1; i < order.length; i++) {
    const [t0, k] = order[i];
    if (f < t0 - 6) break;
    const p = ramp(f, t0 - 6, 26);
    const prev = cam;
    cam = {pos: mix3(prev.pos, SHOTS[k].pos, p), target: mix3(prev.target, SHOTS[k].target, p)};
  }
  // leichtes Nachziehen, damit das Bild nie steht
  const drift = Math.sin(f / 45) * 0.03;
  cam = {pos: [cam.pos[0] + drift, cam.pos[1] + drift * 0.3, cam.pos[2]], target: cam.target};

  const loop = useMemo(buildLoop, []);
  const flowOn = ramp(f, b('kaeltemittel@kreist', T.kaeltemittel + 20), 16);
  const cut = ramp(f, T.kaeltemittel, 34);
  const fanAng = -Math.max(0, f - 10) * (0.08 + 0.32 * ramp(f, T.verdampfer, 30));
  const compOn = ramp(f, b('verdichter@presst', T.verdichter + 15), 10);
  const compShake = compOn * Math.sin(f * 2.1) * 0.0012;
  const heat = ramp(f, b('verfluessiger@wärme', T.verfluessiger + 15), 50);
  const waterOn = ramp(f, b('verfluessiger@heizungswasser', T.verfluessiger + 40), 20);
  const radHeat = ramp(f, b('verfluessiger@heizungswasser', T.verfluessiger + 40) + 20, 40);
  const warm = ramp(f, T.ende, 40);
  const valvePulse = ramp(f, b('ventil@senkt', T.ventil + 25), 8) * (1 - ramp(f, b('ventil@senkt', T.ventil + 25) + 30, 20));

  // Kältemittel-Teilchen
  const N = 120;
  const speed = 0.0024; // Anteil des Kreises pro Frame
  const col = new THREE.Color();
  const parts = flowOn > 0.01
    ? Array.from({length: N}, (_, i) => {
        const u = (((i / N + (f - T.kaeltemittel) * speed) % 1) + 1) % 1;
        const p = loop.path.getPointAt(u);
        colorAt(u, loop.at, col);
        const hot = u >= loop.at.compOut && u < loop.at.condOut;
        return {p: [p.x, p.y, p.z] as V3, c: '#' + col.getHexString(), hot};
      })
    : [];
  const tube = useMemo(() => new THREE.TubeGeometry(loop.path, 900, 0.006, 8, false), [loop]);

  // Außenluft: strömt von vorn durch Lüfter und Lamellen
  const airOn = ramp(f, b('verdampfer@außenluft', T.verdampfer + 20), 14) * (1 - ramp(f, T.verdichter + 10, 16));
  const air = Array.from({length: 40}, (_, i) => {
    const ph = ((i * 0.618 + (f - T.verdampfer) * 0.012) % 1 + 1) % 1;
    const ang = i * 2.399, r = 0.02 + ((i * 37) % 70) / 1000;
    return [-0.36 + r * Math.cos(ang), 0.15 + r * Math.sin(ang), 0.32 - ph * 0.42] as V3;
  });
  // Wärme im Speicher steigt auf
  const bubbles = Array.from({length: 24}, (_, i) => {
    const ph = ((i * 0.37 + f * 0.01) % 1 + 1) % 1;
    const a = i * 2.1;
    return [0.2 + 0.065 * Math.cos(a), 0.05 + ph * 0.32, 0.065 * Math.sin(a)] as V3;
  });

  // Gerätelicht nur in den Nahaufnahmen (in der Totalen bleibt es Nacht)
  const focus = ramp(f, T.kaeltemittel - 6, 26) * (1 - ramp(f, T.ende - 6, 26));
  const at = (p: V3) => projectTo(p, cam);
  const [evx, evy] = at([-0.3, 0.26, Z_E]);
  const [fnx, fny] = at([-0.36, 0.22, 0.05]);
  const [cpx, cpy] = at([-0.2, 0.15, 0.036]);
  const [cdx, cdy] = at([0.25, 0.3, 0.05]);
  const [vlx, vly] = at([0.04, 0.05, 0.013]);
  const [hgx, hgy] = at([-0.24, 0.25, Z_E]);

  return (
    <AbsoluteFill style={{background: NIGHT}}>
      <ThreeCanvas width={width} height={height} shadows camera={{fov: 30, position: SHOTS.wide.pos, near: 0.01, far: 20}} gl={{antialias: true}}>
        <ClipOn />
        <Rig {...cam} />
        <color attach="background" args={[NIGHT]} />
        <fog attach="fog" args={[NIGHT, 3.2, 7]} />
        <Environment files={hdriUrl('brown_photostudio_02')} environmentIntensity={0.28} />
        <hemisphereLight args={['#5a78b8', '#0c1324', 0.55]} />
        {/* Mondlicht */}
        <directionalLight position={[-1.6, 2.4, 1.4]} color="#9db8ff" intensity={0.9} castShadow shadow-mapSize={[2048, 2048]} shadow-camera-left={-1.5} shadow-camera-right={1.5} shadow-camera-top={1.5} shadow-camera-bottom={-1.5} shadow-bias={-0.0003} />
        {/* Gerätelicht für die Nahaufnahmen */}
        <spotLight position={[-0.3, 0.9, 0.9]} target-position={[-0.3, 0.1, 0]} angle={0.5} penumbra={0.8} intensity={1.1 * focus} color="#ffffff" />
        <spotLight position={[0.25, 0.45, 0.7]} target-position={[0.2, 0.15, 0]} angle={0.45} penumbra={0.8} intensity={0.3 * focus} color="#fff1dd" />
        {/* verschneiter Boden */}
        <mesh rotation-x={-Math.PI / 2} position={[0, -0.011, 0]} receiveShadow>
          <circleGeometry args={[4, 64]} />
          <meshStandardMaterial color="#6f81a3" roughness={0.95} />
        </mesh>

        <Sky f={f} />
        <House warm={warm} radHeat={radHeat} f={f} waterOn={waterOn} />
        <OutdoorUnit cut={cut} fanAng={fanAng} compGlow={compOn * (0.6 + 0.4 * Math.sin(f * 0.3))} compShake={compShake} />
        <Tank heat={heat} />
        <Valve pulse={valvePulse} />

        {/* Kältemittel-Leitung */}
        <mesh geometry={tube}>
          <meshStandardMaterial color={COPPER} metalness={0.65} roughness={0.32} transparent opacity={1 - 0.45 * flowOn} />
        </mesh>
        {parts.map((q, i) => (
          <mesh key={i} position={q.p} scale={flowOn}>
            <sphereGeometry args={[q.hot ? 0.0085 : 0.0075, 12, 8]} />
            <meshStandardMaterial color={q.c} emissive={q.c} emissiveIntensity={q.hot ? 1.4 : 0.7} roughness={0.4} />
          </mesh>
        ))}

        {airOn > 0.01 ? air.map((p, i) => (
          <mesh key={i} position={p} scale={airOn} rotation-x={Math.PI / 2}>
            <capsuleGeometry args={[0.0025, 0.018, 4, 8]} />
            <meshStandardMaterial color="#9fd3ff" emissive="#9fd3ff" emissiveIntensity={0.4} transparent opacity={0.85} />
          </mesh>
        )) : null}

        {heat > 0.01 ? bubbles.map((p, i) => (
          <mesh key={i} position={p} scale={heat}>
            <sphereGeometry args={[0.006, 10, 8]} />
            <meshStandardMaterial color="#ff8a2a" emissive="#ff8a2a" emissiveIntensity={1.2} transparent opacity={0.8} />
          </mesh>
        )) : null}

        <EffectComposer multisampling={4}>
          <Bloom mipmapBlur luminanceThreshold={0.82} luminanceSmoothing={0.25} intensity={0.85} />
          <ToneMapping mode={ToneMappingMode.NEUTRAL} />
        </EffectComposer>
      </ThreeCanvas>

      {/* Kleine Zwischenüberschrift */}
      {f < T.kaeltemittel ? <Heading theme="dark" text="Die [Wärmepumpe]" /> :
        f < T.verdampfer ? <Heading theme="dark" text="1 · [Kältemittel]" from={T.kaeltemittel} /> :
        f < T.verdichter ? <Heading theme="dark" text="2 · [Verdampfer]" from={T.verdampfer} /> :
        f < T.verfluessiger ? <Heading theme="dark" text="3 · [Verdichter]" from={T.verdichter} /> :
        f < T.ventil ? <Heading theme="dark" text="4 · [Verflüssiger]" from={T.verfluessiger} /> :
        f < T.ende ? <Heading theme="dark" text="5 · [Expansionsventil]" from={T.ventil} /> :
        <Heading theme="dark" text="1 kWh Strom → [3 kWh Wärme]" from={T.ende} />}

      {/* Markierungen am Bauteil */}
      <Marker theme="dark" x={hgx} y={hgy} show={b('kaeltemittel@kältemittel', T.kaeltemittel + 30)} hide={T.verdampfer - 2} side="right">Kältemittel</Marker>
      <Marker theme="dark" x={fnx} y={fny} show={b('verdampfer@ventilator', T.verdampfer + 8)} hide={T.verdampfer + 70} side="left">Ventilator</Marker>
      <Marker theme="dark" x={evx} y={evy} show={b('verdampfer@verdampfer', T.verdampfer + 50)} hide={T.verdichter - 2} side="right">Verdampfer</Marker>
      <Marker theme="dark" x={cpx} y={cpy} show={b('verdichter@verdichter', T.verdichter + 12)} hide={T.verfluessiger - 2} side="right">Verdichter</Marker>
      <Marker theme="dark" x={cdx} y={cdy} show={b('verfluessiger@heizungswasser', T.verfluessiger + 40)} hide={T.ventil - 2} side="left">Heizungswasser</Marker>
      <Marker theme="dark" x={vlx} y={vly} show={b('ventil@expansionsventil', T.ventil + 6)} hide={T.ende - 2} side="left">Ventil</Marker>
    </AbsoluteFill>
  );
};
