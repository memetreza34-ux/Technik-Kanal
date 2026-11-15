import React, {useMemo} from 'react';
import * as THREE from 'three';
import {ThreeCanvas} from '@remotion/three';
import {useThree} from '@react-three/fiber';
import {RoundedBox} from '@react-three/drei';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Bloom, EffectComposer, ToneMapping} from '@react-three/postprocessing';
import {ToneMappingMode} from 'postprocessing';
import {FONT, de} from '../short/brand';
import {CaptionSlot, CardSlot, Heading, Label, Mark, Shade, Z} from '../frame/Frame';
import {Flow, HeatShimmer, Tube} from '../world/parts';
import {type V3, mix3, ramp} from '../world/kit';

// Demo 2 – Spannung: Immer mehr Geräte an einer Mehrfachsteckdose, das Kabel wird heiß … KLACK.

const cl = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};
const RED = '#FF4B3A';
const YELLOW = '#FFD23F';
const LIMIT = 3680; // 16 A × 230 V
const KLACK = 236;
const PLUGS = [
  {x: 0.15, at: 20, w: 60, name: 'Laptop', color: '#e9ebee'},
  {x: 0.05, at: 55, w: 2000, name: 'Wasserkocher', color: '#e9ebee'},
  {x: -0.05, at: 95, w: 2000, name: 'Heizlüfter', color: '#2b2e33'},
  {x: -0.15, at: 140, w: 2000, name: 'Föhn', color: '#2b2e33'},
];
const MAX = 6500;
const hot = (hex: string, k: number) => new THREE.Color(hex).multiplyScalar(k);
const MAIN: V3[] = [[-0.215, 0.02, 0], [-0.32, 0.012, 0.03], [-0.46, 0.012, -0.12], [-0.56, 0.012, -0.38], [-0.58, 0.14, -0.53], [-0.58, 0.24, -0.535]];

const Rig: React.FC<{pos: V3; target: V3; fov: number}> = ({pos, target, fov}) => {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  camera.position.set(...pos);
  camera.lookAt(...target);
  if (camera.fov !== fov) {
    camera.fov = fov;
    camera.updateProjectionMatrix();
  }
  return null;
};

const Plug: React.FC<{x: number; drop: number; color: string}> = ({x, drop, color}) => {
  const pts = useMemo<V3[]>(() => [[0, 0.075, 0], [0, 0.15, -0.02], [x * 0.6, 0.3, -0.22], [x * 1.4, 0.6, -0.5]], [x]);
  if (drop <= 0) return null;
  return (
    <group position={[x, 0.046 + (1 - drop) * 0.35, 0]}>
      <RoundedBox args={[0.05, 0.055, 0.05]} radius={0.012} position={[0, 0.03, 0]} castShadow>
        <meshStandardMaterial color={color} roughness={0.45} />
      </RoundedBox>
      <Tube points={pts} radius={0.006} color={color} segments={40} />
    </group>
  );
};

const Scene: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = f / fps;
  const off = f >= KLACK;
  const load = PLUGS.reduce((s, p) => s + (f >= p.at + 8 ? p.w : 0), 0);
  const heat = off ? Math.max(0, 1 - (f - KLACK) / 40) * 0.6 : ramp(f, 105, 120);
  const pulse = 0.75 + 0.25 * Math.sin(t * 14);
  const lamp = off ? 0.04 : 1;
  return (
    <>
      <color attach="background" args={['#0b0c0f']} />
      <fog attach="fog" args={['#0b0c0f', 1.2, 2.6]} />
      <ambientLight intensity={0.12 * lamp + 0.03} />
      <pointLight position={[0.25, 0.9, 0.45]} intensity={2.2 * lamp} distance={3} decay={2} color="#ffd9ad" castShadow />
      <directionalLight position={[-1, 1.2, -1.5]} intensity={0.35 * lamp} color="#c9d3e6" />
      <pointLight position={[-0.45, 0.06, -0.1]} intensity={heat * 0.8 * pulse} distance={0.7} decay={2} color="#ff4a1a" />
      {/* Boden + Wand */}
      <mesh rotation-x={-Math.PI / 2} receiveShadow>
        <planeGeometry args={[4, 4]} />
        <meshStandardMaterial color="#3a2d24" roughness={0.75} />
      </mesh>
      <mesh position={[0, 1, -0.56]} receiveShadow>
        <planeGeometry args={[4, 2]} />
        <meshStandardMaterial color="#20232a" roughness={0.9} />
      </mesh>
      {/* Wandsteckdose */}
      <RoundedBox args={[0.085, 0.085, 0.02]} radius={0.01} position={[-0.58, 0.27, -0.55]}>
        <meshStandardMaterial color="#e9ebee" roughness={0.4} />
      </RoundedBox>
      {/* Steckerleiste */}
      <RoundedBox args={[0.43, 0.046, 0.09]} radius={0.016} position={[0, 0.023, 0]} castShadow receiveShadow>
        <meshStandardMaterial color="#eef0f2" roughness={0.4} emissive="#ff4a1a" emissiveIntensity={heat * 0.12 * pulse} />
      </RoundedBox>
      {PLUGS.map((p) => (
        <mesh key={p.x} position={[p.x, 0.047, 0]} rotation-x={-Math.PI / 2}>
          <circleGeometry args={[0.025, 32]} />
          <meshStandardMaterial color="#b9bdc3" roughness={0.6} />
        </mesh>
      ))}
      <mesh position={[0.195, 0.048, 0]}>
        <boxGeometry args={[0.02, 0.006, 0.03]} />
        <meshBasicMaterial color={hot('#ff3b30', off ? 0.2 : 2.5)} toneMapped={false} />
      </mesh>
      {/* Zuleitung: wird mit der Last heiß */}
      <mesh>
        <tubeGeometry args={[new THREE.CatmullRomCurve3(MAIN.map((p) => new THREE.Vector3(...p))), 80, 0.007, 10]} />
        <meshStandardMaterial color="#e9ebee" roughness={0.5} emissive="#ff3a12" emissiveIntensity={heat * 2.6 * pulse} />
      </mesh>
      <Flow points={MAIN.slice().reverse()} t={t} on={off ? 0 : Math.min(1, load / 500)} count={6 + Math.round(load / 300)} speed={0.4 + load / 3000} size={0.0055} color={hot(load > LIMIT ? '#ff8a3d' : '#7fe3ff', 2)} />
      <HeatShimmer t={t} amount={heat > 0.3 ? (heat - 0.3) * 1.4 : 0} center={[-0.42, 0.02, -0.1]} radius={0.12} rise={0.25} size={0.006} />
      {PLUGS.map((p) => (
        <Plug key={p.x} x={p.x} color={p.color} drop={spring({frame: f - p.at, fps, config: {damping: 16, mass: 0.6}})} />
      ))}
    </>
  );
};

export const Steckdose: React.FC = () => {
  const f = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();
  const off = f >= KLACK;
  const load = PLUGS.reduce((s, p) => s + (f >= p.at + 8 ? p.w : 0), 0);
  const shown = off ? 0 : Math.round(interpolate(f, [0, 30], [0, 1], cl) * load);
  // Kamera: langsam näher, kurz vor dem Klack leichtes Zittern
  const u = interpolate(f, [0, KLACK], [0, 1], cl);
  const shake = f > 190 && !off ? Math.sin(f * 2.3) * 0.002 * interpolate(f, [190, KLACK], [0, 1], cl) : 0;
  const pos = mix3([0.42, 0.26, 0.62], [0.24, 0.17, 0.42], u);
  const cam = {pos: [pos[0] + shake, pos[1] + shake, pos[2]] as V3, target: [-0.05, -0.035, -0.02] as V3, fov: 40};
  const over = load > LIMIT && !off;
  const pulse = 0.5 + 0.5 * Math.sin((f / fps) * 12);
  const klack = spring({frame: f - KLACK, fps, config: {damping: 10, mass: 0.5}});
  const barP = Math.min(1, shown / MAX);
  const limP = LIMIT / MAX;

  return (
    <AbsoluteFill style={{background: '#0b0c0f'}}>
      <ThreeCanvas width={width} height={height} shadows camera={{fov: 40, position: [0.42, 0.26, 0.62], near: 0.01, far: 20}} gl={{antialias: true}}>
        <Rig {...cam} />
        <Scene />
        <EffectComposer multisampling={4}>
          <Bloom mipmapBlur luminanceThreshold={0.8} luminanceSmoothing={0.2} intensity={1.1} />
          <ToneMapping mode={ToneMappingMode.NEUTRAL} />
        </EffectComposer>
      </ThreeCanvas>

      {/* roter Puls bei Überlast */}
      {over ? <AbsoluteFill style={{boxShadow: `inset 0 0 ${220 + pulse * 120}px rgba(255,60,40,${0.25 + pulse * 0.25})`}} /> : null}
      <Shade theme="dark" />
      {off ? <AbsoluteFill style={{background: '#000', opacity: interpolate(f, [KLACK, KLACK + 3], [0.95, 0.72], cl)}} /> : null}

      {off ? <Heading theme="dark" text="Warum [KLACK?]" from={KLACK} /> : <Heading theme="dark" text="Was passiert [gleich?]" />}

      {/* Karte: Watt-Zähler */}
      <CardSlot theme="dark" show={6} hide={KLACK} border={over ? RED : undefined}>
        <div style={{width: 1080 - 2 * Z.left - 64}}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'baseline'}}>
            <Label theme="dark">An einer Steckdose</Label>
            <span style={{fontSize: 52, fontWeight: 900, color: over ? RED : '#fff', fontVariantNumeric: 'tabular-nums'}}>{de(shown, 0)} W</span>
          </div>
          <div style={{position: 'relative', height: 18, borderRadius: 9, background: 'rgba(255,255,255,.1)', marginTop: 10}}>
            <div style={{width: `${barP * 100}%`, height: '100%', borderRadius: 9, background: over ? RED : `linear-gradient(90deg, #2DE1C2, ${YELLOW})`}} />
            <div style={{position: 'absolute', left: `${limP * 100}%`, top: -8, bottom: -8, width: 5, background: '#fff', borderRadius: 3}} />
          </div>
          <div style={{marginTop: 10, fontSize: 28, fontWeight: 700, color: over ? RED : '#9aa0aa'}}>{over ? '⚠ über der Grenze von 3.680 W (16 A)' : 'Grenze: 3.680 W (16 A)'}</div>
        </div>
      </CardSlot>

      {/* Untertitel: immer nur das neueste Gerät */}
      {PLUGS.map((p, i) => (
        <CaptionSlot key={p.name} theme="dark" show={p.at + 6} hide={PLUGS[i + 1]?.at ?? 175}>
          + {p.name} <span style={{color: p.w >= 2000 ? RED : '#9aa0aa'}}>{de(p.w, 0)} W</span>
        </CaptionSlot>
      ))}
      <CaptionSlot theme="dark" show={175} hide={KLACK}>
        <span style={{color: RED, opacity: 0.6 + 0.4 * pulse}}>Das Kabel wird heiß …</span>
      </CaptionSlot>

      <CaptionSlot theme="dark" show={KLACK + 14} hide={330}>
        Die <Mark theme="dark">Sicherung</Mark> schützt das Kabel.
      </CaptionSlot>
      {/* KLACK in der Bühne */}
      {off ? (
        <div style={{position: 'absolute', top: Z.stage[0], height: Z.stage[1] - Z.stage[0], width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT.ui, fontSize: 190, fontWeight: 900, color: YELLOW, letterSpacing: 6}}>
          <span style={{transform: `scale(${0.5 + 0.5 * klack})`}}>KLACK.</span>
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
