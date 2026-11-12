import React, {useMemo} from 'react';
import * as THREE from 'three';
import {useThree} from '@react-three/fiber';
import {Environment, Lightformer, RoundedBox} from '@react-three/drei';
import {ThreeCanvas} from '@remotion/three';
import {spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {type Beats, type Shot, DipoleLine, FlatSpiral, cameraAt, lerp, ramp, rand} from './kit';

// Maße grob an echte Geräte angelehnt (1 Einheit ≈ 1 cm).
const PAD_R = 4;
const PAD_TOP = 1.03;
const COIL_Y = 0.8;
const PHONE = {w: 7.4, h: 0.8, l: 15.4};
const PHONE_COIL_Z = 1.6; // Empfangsspule sitzt etwas unterhalb der Handymitte
const PHONE_REST_Y = PAD_TOP + PHONE.h / 2;
const PHONE_REST_Z = -PHONE_COIL_Z;
const MAGNET_R = 2.85;

const ORDER = ['hook', 'reveal-coil', 'field', 'phone-coil', 'induction', 'misalign', 'qi2', 'end'];
const SHOTS: Record<string, Shot> = {
  hook: {pos: [3, 18.5, 15.5], target: [0, 0.6, -0.8], fov: 40},
  'reveal-coil': {pos: [4.5, 10.5, 10.5], target: [0, 1.2, 0], fov: 40},
  field: {pos: [0.5, 6.5, 12.5], target: [0, 1.4, 0], fov: 40},
  'phone-coil': {pos: [7, 5.2, 9], target: [0, 2.6, -0.8], fov: 40},
  induction: {pos: [7.5, 3.1, 6], target: [0, 1.5, -0.4], fov: 40},
  misalign: {pos: [0.8, 15, 7.5], target: [1.3, 1, -0.8], fov: 40},
  qi2: {pos: [-3.5, 11.5, 10.5], target: [0.4, 1.2, -0.8], fov: 40},
  end: {pos: [3, 18.5, 15.5], target: [0, 0.6, -0.8], fov: 40},
};

const COPPER = '#c8773e';
const CYAN = new THREE.Color('#7fe9ff');
const HEAT = new THREE.Color('#ff7a1a');

const CameraRig: React.FC<{f: number; fps: number; beats: Beats}> = ({f, fps, beats}) => {
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const {pos, target, fov} = cameraAt(f, fps, beats, SHOTS, ORDER);
  camera.position.set(...pos);
  camera.lookAt(...target);
  if (camera.fov !== fov) {
    camera.fov = fov;
    camera.updateProjectionMatrix();
  }
  return null;
};

function useWoodTexture() {
  return useMemo(() => {
    const c = document.createElement('canvas');
    c.width = 1024;
    c.height = 1024;
    const g = c.getContext('2d')!;
    g.fillStyle = '#3b2a1e';
    g.fillRect(0, 0, 1024, 1024);
    for (let i = 0; i < 260; i++) {
      const y = rand(i) * 1024;
      const tone = 30 + rand(i + 99) * 40;
      g.strokeStyle = `rgba(${tone + 40},${tone + 18},${tone},${0.18 + rand(i + 7) * 0.25})`;
      g.lineWidth = 1 + rand(i + 3) * 5;
      g.beginPath();
      for (let x = 0; x <= 1024; x += 32) g.lineTo(x, y + Math.sin(x / 140 + i) * 6 * rand(i + 11));
      g.stroke();
    }
    const t = new THREE.CanvasTexture(c);
    t.wrapS = t.wrapT = THREE.RepeatWrapping;
    t.repeat.set(3, 3);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 8;
    return t;
  }, []);
}

function useScreenTexture() {
  return useMemo(() => {
    const W = 494, H = 1066;
    const c = document.createElement('canvas');
    c.width = W;
    c.height = H;
    const g = c.getContext('2d')!;
    const bg = g.createRadialGradient(W / 2, H * 0.42, 40, W / 2, H * 0.5, H * 0.7);
    bg.addColorStop(0, '#12324a');
    bg.addColorStop(1, '#020509');
    g.fillStyle = bg;
    g.fillRect(0, 0, W, H);
    g.lineCap = 'round';
    g.strokeStyle = 'rgba(127,233,255,0.18)';
    g.lineWidth = 14;
    g.beginPath();
    g.arc(W / 2, H * 0.42, 120, 0, Math.PI * 2);
    g.stroke();
    g.strokeStyle = '#7fe9ff';
    g.beginPath();
    g.arc(W / 2, H * 0.42, 120, -Math.PI / 2, -Math.PI / 2 + Math.PI * 1.45);
    g.stroke();
    g.fillStyle = '#ffffff';
    g.beginPath();
    const cx = W / 2, cy = H * 0.42;
    g.moveTo(cx + 14, cy - 62);
    g.lineTo(cx - 34, cy + 8);
    g.lineTo(cx - 2, cy + 8);
    g.lineTo(cx - 14, cy + 62);
    g.lineTo(cx + 34, cy - 8);
    g.lineTo(cx + 2, cy - 8);
    g.closePath();
    g.fill();
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, []);
}

const Coil: React.FC<{r0: number; r1: number; turns: number; wire: number; heat?: number; glow?: number; opacity?: number}> = ({r0, r1, turns, wire, heat = 0, glow = 0, opacity = 1}) => {
  const geo = useMemo(() => new THREE.TubeGeometry(new FlatSpiral(r0, r1, turns), 1400, wire, 8, false), [r0, r1, turns, wire]);
  const emissive = new THREE.Color(0, 0, 0).lerp(HEAT, heat).add(CYAN.clone().multiplyScalar(glow * 0.55));
  return (
    <mesh geometry={geo} castShadow>
      <meshStandardMaterial color={COPPER} metalness={1} roughness={0.32} emissive={emissive} emissiveIntensity={1 + heat * 1.5} transparent opacity={opacity} depthWrite={opacity > 0.99} />
    </mesh>
  );
};

const MagnetRing: React.FC<{y: number; rise: (i: number) => number; flash: number; opacity?: number}> = ({y, rise, flash, opacity = 1}) => (
  <group>
    {Array.from({length: 18}).map((_, i) => {
      const a = (i / 18) * Math.PI * 2;
      const p = rise(i);
      if (p <= 0.001) return null;
      return (
        <mesh key={i} position={[MAGNET_R * Math.cos(a), y - (1 - p) * 0.45, MAGNET_R * Math.sin(a)]} rotation={[0, -a, 0]} scale={[1, p, 1]} castShadow>
          <boxGeometry args={[0.32, 0.22, 0.78]} />
          <meshStandardMaterial color="#c9ced4" metalness={0.55} roughness={0.3} emissive={CYAN} emissiveIntensity={flash * 1.2} transparent opacity={opacity} />
        </mesh>
      );
    })}
  </group>
);

const FieldLines: React.FC<{t: number; on: number; acHz: number}> = ({t, on, acHz}) => {
  const lines = useMemo(() => {
    const out: {core: THREE.TubeGeometry; glow: THREE.TubeGeometry; curve: DipoleLine}[] = [];
    for (const L of [2.4, 3.8, 5.4])
      for (let k = 0; k < 10; k++) {
        const curve = new DipoleLine(L, (k / 10) * Math.PI * 2 + L * 0.3);
        out.push({curve, core: new THREE.TubeGeometry(curve, 90, 0.028, 6), glow: new THREE.TubeGeometry(curve, 90, 0.1, 8)});
      }
    return out;
  }, []);
  const dot = useMemo(() => new THREE.SphereGeometry(0.09, 12, 12), []);
  if (on <= 0.001) return null;
  const s = Math.sin(2 * Math.PI * acHz * t);
  const strength = on * (0.3 + 0.7 * Math.abs(s));
  return (
    <group position={[0, COIL_Y, 0]} scale={[1, Math.max(0.02, on), 1]}>
      {lines.map((l, i) => (
        <group key={i}>
          <mesh geometry={l.core}>
            <meshBasicMaterial color={CYAN} transparent opacity={0.85 * strength} toneMapped={false} depthWrite={false} />
          </mesh>
          <mesh geometry={l.glow}>
            <meshBasicMaterial color={CYAN} transparent opacity={0.14 * strength} toneMapped={false} depthWrite={false} blending={THREE.AdditiveBlending} />
          </mesh>
          {[0.3, 0.7].map((base, j) => {
            const u = Math.min(0.98, Math.max(0.02, base + 0.16 * s));
            const p = l.curve.getPoint(u);
            return (
              <mesh key={j} geometry={dot} position={p}>
                <meshBasicMaterial color="#e9fbff" transparent opacity={strength} toneMapped={false} depthWrite={false} />
              </mesh>
            );
          })}
        </group>
      ))}
    </group>
  );
};

const HeatShimmer: React.FC<{t: number; amount: number; center: [number, number]}> = ({t, amount, center}) => {
  const geo = useMemo(() => new THREE.SphereGeometry(0.16, 10, 10), []);
  if (amount <= 0.001) return null;
  return (
    <group>
      {Array.from({length: 26}).map((_, i) => {
        const period = 1.6 + rand(i) * 0.9;
        const ph = ((t + rand(i + 50) * period) % period) / period;
        const a = rand(i + 9) * Math.PI * 2, r = 0.6 + rand(i + 21) * 2.2;
        return (
          <mesh key={i} geometry={geo} position={[center[0] + r * Math.cos(a), COIL_Y + 0.3 + ph * 3.2, center[1] + r * Math.sin(a)]} scale={1 - ph * 0.6}>
            <meshBasicMaterial color={HEAT} transparent opacity={amount * (1 - ph) * 0.55} toneMapped={false} depthWrite={false} blending={THREE.AdditiveBlending} />
          </mesh>
        );
      })}
    </group>
  );
};

const Cable: React.FC = () => {
  const geo = useMemo(() => {
    const c = new THREE.CatmullRomCurve3([new THREE.Vector3(-PAD_R + 0.1, 0.35, 0), new THREE.Vector3(-6.5, 0.2, 0.8), new THREE.Vector3(-11, 0.2, -1.5), new THREE.Vector3(-22, 0.2, -6)]);
    return new THREE.TubeGeometry(c, 80, 0.22, 10);
  }, []);
  return (
    <mesh geometry={geo} castShadow receiveShadow>
      <meshStandardMaterial color="#e9ecef" roughness={0.45} />
    </mesh>
  );
};

const Scene: React.FC<{beats: Beats}> = ({beats}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = f / fps;
  const sec = (s: number) => Math.round(s * fps);
  const B = (id: string) => beats[id];
  const wood = useWoodTexture();
  const screenTex = useScreenTexture();
  const ghostEdges = useMemo(() => new THREE.EdgesGeometry(new THREE.BoxGeometry(PHONE.w - 0.1, PHONE.h - 0.05, PHONE.l - 0.1)), []);

  // --- Ablauf ---
  const drop = spring({frame: f, fps, config: {damping: 13, mass: 0.7}});
  const lift = ramp(f, B('reveal-coil'), sec(0.9));
  const hover = ramp(f, B('phone-coil'), sec(1.0));
  const lower = ramp(f, B('induction'), sec(0.8));
  const settle = ramp(f, B('end'), sec(0.9));
  const xray = ramp(f, B('phone-coil'), sec(0.8)) * (1 - ramp(f, B('end') + sec(0.3), sec(0.8)));
  const cover = ramp(f, B('reveal-coil') + sec(0.35), sec(0.9)) * (1 - ramp(f, B('end'), sec(0.9)));
  const field = ramp(f, B('field') + sec(0.2), sec(1.3)) * (1 - ramp(f, B('end') + sec(0.4), sec(0.7)));
  const induct = ramp(f, B('induction'), sec(0.6)) * (1 - ramp(f, B('end'), sec(0.6)));
  const slide = ramp(f, B('misalign') + sec(0.3), sec(1.0));
  const snap = spring({frame: f - (B('qi2') + sec(1.5)), fps, config: {damping: 9, mass: 0.6}});
  const offset = slide * (1 - snap);
  const heat = ramp(f, B('misalign') + sec(0.9), sec(1.2)) * (1 - snap);
  const magnets = (i: number) => ramp(f, B('qi2') + sec(0.15) + i, sec(0.35));
  const flash = Math.max(0, 1 - Math.abs(f - (B('qi2') + sec(1.75))) / sec(0.35));
  const screenOn = ramp(f, sec(0.45), sec(0.4));
  const battery = lerp(0.22, 0.9, ramp(f, B('induction'), B('end') - B('induction')));

  const s = Math.sin(2 * Math.PI * 0.75 * t);
  const receiverGlow = induct * Math.abs(s) * (1 - 0.8 * offset);

  const phoneY = lerp(lerp(lerp(lerp(lerp(PHONE_REST_Y + 4, PHONE_REST_Y, drop), 8.5, lift), 4.2, hover), 2.3, lower), PHONE_REST_Y, settle);
  const phoneZ = PHONE_REST_Z - 5 * lift * (1 - hover);
  const phoneX = offset * 2.7;
  const phoneRot = offset * 0.22;
  const bodyOpacity = 1 - 0.9 * xray;
  const screenOpacity = 1 - xray;

  return (
    <>
      <CameraRig f={f} fps={fps} beats={beats} />
      <color attach="background" args={['#0c0e11']} />
      <fog attach="fog" args={['#0c0e11', 24, 60]} />
      <ambientLight intensity={0.12} />
      <spotLight position={[7, 22, 12]} angle={0.42} penumbra={0.95} intensity={2.4} decay={0} castShadow shadow-mapSize={[2048, 2048]} shadow-bias={-0.0004} />
      <directionalLight position={[-7, 6, -12]} intensity={1.1} color="#9fdcff" />
      <Environment resolution={256} environmentIntensity={0.55}>
        <Lightformer form="rect" intensity={3} position={[0, 9, -6]} scale={[14, 4, 1]} />
        <Lightformer form="rect" intensity={1.6} position={[-9, 3, 3]} rotation-y={Math.PI / 2} scale={[4, 9, 1]} />
        <Lightformer form="rect" intensity={1.1} color="#ffd8b0" position={[9, 3, 5]} rotation-y={-Math.PI / 2} scale={[4, 9, 1]} />
      </Environment>

      {/* Tisch */}
      <mesh rotation-x={-Math.PI / 2} receiveShadow>
        <planeGeometry args={[90, 90]} />
        <meshStandardMaterial map={wood} roughness={0.62} metalness={0} />
      </mesh>
      <Cable />

      {/* Ladepad: Schale, Ferrit, Sendespule, Deckel */}
      <group>
        <mesh position={[0, 0.36, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[PAD_R, PAD_R + 0.1, 0.72, 96]} />
          <meshStandardMaterial color="#dfe3e7" roughness={0.5} />
        </mesh>
        <mesh position={[0, 0.875, 0]} castShadow>
          <cylinderGeometry args={[PAD_R, PAD_R, 0.31, 96, 1, true]} />
          <meshStandardMaterial color="#dfe3e7" roughness={0.5} side={THREE.DoubleSide} />
        </mesh>
        <mesh position={[0, 0.74, 0]} receiveShadow>
          <cylinderGeometry args={[3.1, 3.1, 0.05, 64]} />
          <meshStandardMaterial color="#26292d" roughness={0.85} />
        </mesh>
        <group position={[0, COIL_Y, 0]}>
          <Coil r0={0.55} r1={2.45} turns={9} wire={0.085} heat={heat} glow={field * Math.abs(s) * 0.5} />
        </group>
        <MagnetRing y={0.86} rise={magnets} flash={flash} />
        <mesh position={[0, 0.97 + cover * 3.4, 0]} castShadow={cover < 0.5}>
          <cylinderGeometry args={[PAD_R, PAD_R, 0.12, 96]} />
          <meshStandardMaterial color="#4a5058" roughness={0.95} transparent opacity={1 - cover} depthWrite={cover < 0.01} />
        </mesh>
        <mesh position={[PAD_R * 0.72, 0.4, PAD_R * 0.7]}>
          <sphereGeometry args={[0.09, 16, 16]} />
          <meshBasicMaterial color={CYAN} toneMapped={false} transparent opacity={screenOn} />
        </mesh>
      </group>

      <FieldLines t={t} on={field} acHz={0.75} />
      <HeatShimmer t={t} amount={heat} center={[0, 0]} />

      {/* Handy */}
      <group position={[phoneX, phoneY, phoneZ]} rotation={[0, phoneRot, 0]}>
        <RoundedBox args={[PHONE.w, PHONE.h, PHONE.l]} radius={0.38} smoothness={5} castShadow={bodyOpacity > 0.5} receiveShadow>
          <meshPhysicalMaterial color="#1f242b" metalness={0.55} roughness={0.3} clearcoat={1} clearcoatRoughness={0.15} transparent opacity={bodyOpacity} depthWrite={bodyOpacity > 0.99} />
        </RoundedBox>
        <mesh position={[0, PHONE.h / 2 + 0.003, 0]} rotation-x={-Math.PI / 2}>
          <planeGeometry args={[PHONE.w - 0.5, PHONE.l - 0.5]} />
          <meshStandardMaterial map={screenTex} emissiveMap={screenTex} emissive="#ffffff" emissiveIntensity={screenOn * 0.85} color="#000000" roughness={0.12} metalness={0.1} transparent opacity={screenOpacity} depthWrite={screenOpacity > 0.99} />
        </mesh>
        {xray > 0.01 ? (
          <group>
            <lineSegments geometry={ghostEdges}>
              <lineBasicMaterial color="#bfeaff" transparent opacity={0.7 * xray} depthWrite={false} />
            </lineSegments>
            <group position={[0, -0.26, PHONE_COIL_Z]}>
              <Coil r0={0.55} r1={2.3} turns={9} wire={0.055} glow={receiverGlow * 0.9} opacity={xray} />
            </group>
            <group position={[0, 0, PHONE_COIL_Z]}>
              <MagnetRing y={-0.3} rise={(i) => Math.min(xray, magnets(i))} flash={flash} opacity={xray} />
            </group>
            <mesh position={[0, 0.02, -3.4]}>
              <boxGeometry args={[5.6, 0.26, 6.2]} />
              <meshStandardMaterial color="#8a939e" metalness={0.4} roughness={0.45} transparent opacity={0.75 * xray} depthWrite={false} />
            </mesh>
            <mesh position={[0, 0.16, -3.4 + 2.8 - 5.6 * battery * 0.5]} scale={[1, 1, battery]}>
              <boxGeometry args={[0.7, 0.03, 5.6]} />
              <meshBasicMaterial color="#5cf28a" transparent opacity={0.9 * xray} toneMapped={false} depthWrite={false} />
            </mesh>
            {induct > 0.01
              ? [0, 1, 2, 3].map((k) => {
                  const u = ((t * 0.9 + k / 4) % 1);
                  return (
                    <mesh key={k} position={[0, 0, lerp(PHONE_COIL_Z, -1.2, u)]}>
                      <sphereGeometry args={[0.16, 14, 14]} />
                      <meshBasicMaterial color="#9ff7ff" transparent opacity={induct * (1 - offset * 0.8) * Math.sin(u * Math.PI)} toneMapped={false} depthWrite={false} />
                    </mesh>
                  );
                })
              : null}
          </group>
        ) : null}
      </group>
    </>
  );
};

export const WirelessChargingScene: React.FC<{beats: Beats; width: number; height: number}> = ({beats, width, height}) => {
  return (
    <ThreeCanvas width={width} height={height} shadows camera={{fov: 36, position: [2.5, 17, 14], near: 0.1, far: 200}} gl={{antialias: true}}>
      <Scene beats={beats} />
    </ThreeCanvas>
  );
};
