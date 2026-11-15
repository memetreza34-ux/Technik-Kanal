import React, {useMemo} from 'react';
import * as THREE from 'three';
import {RoundedBox} from '@react-three/drei';
import {ThreeCanvas} from '@remotion/three';
import {spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {CameraRig} from '../../world/CameraRig';
import {WorldLook} from '../../world/Look';
import {HAUS_ANCHORS, HAUS_SPOTS, TechnikHaus} from '../../world/TechnikHaus';
import {COLORS, Coil, FieldLines, HeatShimmer, Tube} from '../../world/parts';
import {type Beats, type Shot, type V3, lerp, placeShot, ramp} from '../../world/kit';

// Kabelloses Laden – spielt auf dem Couchtisch im Technik-Haus.
// Lokale Maße in cm (Gruppe mit Faktor 0,01 auf den Tisch gesetzt).

const ANCHOR = HAUS_ANCHORS.couchtisch;
const CM = 0.01;
const PAD_R = 4;
const PAD_TOP = 1.03;
const COIL_Y = 0.8;
const PHONE = {w: 7.4, h: 0.8, l: 15.4};
const PHONE_COIL_Z = 1.6; // Empfangsspule sitzt etwas unterhalb der Handymitte
const PHONE_REST_Y = PAD_TOP + PHONE.h / 2;
const PHONE_REST_Z = -PHONE_COIL_Z;
const MAGNET_R = 2.85;

const LOCAL_SHOTS: Record<string, Shot> = {
  hook: {pos: [3, 18.5, 15.5], target: [0, 0.6, -0.8], fov: 40, dur: 1.4},
  'reveal-coil': {pos: [4.5, 10.5, 10.5], target: [0, 1.2, 0], fov: 40},
  field: {pos: [0.5, 6.5, 12.5], target: [0, 1.4, 0], fov: 40},
  'phone-coil': {pos: [7, 5.2, 9], target: [0, 2.6, -0.8], fov: 40},
  induction: {pos: [7.5, 3.1, 6], target: [0, 1.5, -0.4], fov: 40},
  misalign: {pos: [0.8, 15, 7.5], target: [1.3, 1, -0.8], fov: 40},
  qi2: {pos: [-3.5, 11.5, 10.5], target: [0.4, 1.2, -0.8], fov: 40},
};
const ORDER = ['intro', 'hook', 'reveal-coil', 'field', 'phone-coil', 'induction', 'misalign', 'qi2', 'end'];
const SHOTS: Record<string, Shot> = {
  intro: HAUS_SPOTS.wohnzimmer,
  ...Object.fromEntries(Object.entries(LOCAL_SHOTS).map(([k, s]) => [k, placeShot(s, ANCHOR, CM)])),
  end: {...HAUS_SPOTS.wohnzimmer, dur: 1.8},
};

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

const MagnetRing: React.FC<{y: number; rise: (i: number) => number; flash: number; opacity?: number}> = ({y, rise, flash, opacity = 1}) => (
  <group>
    {Array.from({length: 18}).map((_, i) => {
      const a = (i / 18) * Math.PI * 2;
      const p = rise(i);
      if (p <= 0.001) return null;
      return (
        <mesh key={i} position={[MAGNET_R * Math.cos(a), y - (1 - p) * 0.45, MAGNET_R * Math.sin(a)]} rotation={[0, -a, 0]} scale={[1, p, 1]} castShadow>
          <boxGeometry args={[0.32, 0.22, 0.78]} />
          <meshStandardMaterial color="#c9ced4" metalness={0.55} roughness={0.3} emissive={COLORS.cyan} emissiveIntensity={flash * 1.2} transparent opacity={opacity} />
        </mesh>
      );
    })}
  </group>
);

/** Produktlicht über dem Tisch für knackige Schatten in Nahaufnahmen. */
const TableSpot: React.FC = () => {
  const target = useMemo(() => {
    const o = new THREE.Object3D();
    o.position.set(...ANCHOR);
    return o;
  }, []);
  return (
    <>
      <primitive object={target} />
      <spotLight
        position={[ANCHOR[0] + 0.5, ANCHOR[1] + 1.3, ANCHOR[2] + 0.7]}
        target={target}
        angle={0.32}
        penumbra={1}
        intensity={2.2}
        decay={0}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.0001}
        shadow-camera-near={0.3}
        shadow-camera-far={3}
      />
    </>
  );
};

const CABLE: V3[] = [[-PAD_R + 0.1, 0.35, 0], [-12, 0.25, 2], [-27, 0.3, 4], [-31, -4, 5], [-33, -38.5, 7], [-45, -38.7, 12]];

const ChargingSet: React.FC<{beats: Beats}> = ({beats}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = f / fps;
  const sec = (s: number) => Math.round(s * fps);
  const B = (id: string) => beats[id];
  const screenTex = useScreenTexture();
  const ghostEdges = useMemo(() => new THREE.EdgesGeometry(new THREE.BoxGeometry(PHONE.w - 0.1, PHONE.h - 0.05, PHONE.l - 0.1)), []);

  // --- Ablauf ---
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
  const screenOn = ramp(f, sec(1.0), sec(0.4));
  const battery = lerp(0.22, 0.9, ramp(f, B('induction'), B('end') - B('induction')));

  const s = Math.sin(2 * Math.PI * 0.75 * t);
  const receiverGlow = induct * Math.abs(s) * (1 - 0.8 * offset);

  const phoneY = lerp(lerp(lerp(lerp(PHONE_REST_Y, 8.5, lift), 4.2, hover), 2.3, lower), PHONE_REST_Y, settle);
  const phoneZ = PHONE_REST_Z - 5 * lift * (1 - hover);
  const phoneX = offset * 2.7;
  const phoneRot = offset * 0.22;
  const bodyOpacity = 1 - 0.9 * xray;
  const screenOpacity = 1 - xray;

  return (
    <group position={ANCHOR} scale={CM}>
      <Tube points={CABLE} radius={0.22} color="#e9ecef" />

      {/* Ladepad: Schale, Ferrit, Sendespule, Deckel */}
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
        <meshBasicMaterial color={COLORS.cyan} toneMapped={false} transparent opacity={screenOn} />
      </mesh>

      <FieldLines t={t} on={field} y={COIL_Y} />
      <HeatShimmer t={t} amount={heat} center={[0, COIL_Y + 0.3, 0]} />

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
                  const u = (t * 0.9 + k / 4) % 1;
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
    </group>
  );
};

export const WirelessChargingScene: React.FC<{beats: Beats; width: number; height: number}> = ({beats, width, height}) => {
  const {fps} = useVideoConfig();
  const all: Beats = {...beats, intro: 0, hook: Math.round(0.1 * fps)};
  return (
    <ThreeCanvas width={width} height={height} shadows camera={{fov: 42, position: HAUS_SPOTS.wohnzimmer.pos, near: 0.004, far: 200}} gl={{antialias: true}}>
      <CameraRig beats={all} shots={SHOTS} order={ORDER} />
      <WorldLook>
        <TechnikHaus />
        <TableSpot />
        <ChargingSet beats={beats} />
      </WorldLook>
    </ThreeCanvas>
  );
};
