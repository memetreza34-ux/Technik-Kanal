import React, {useLayoutEffect, useMemo} from 'react';
import * as THREE from 'three';
import {ThreeCanvas} from '@remotion/three';
import {useThree} from '@react-three/fiber';
import {Environment, RoundedBox} from '@react-three/drei';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {Bloom, EffectComposer, ToneMapping} from '@react-three/postprocessing';
import {ToneMappingMode} from 'postprocessing';
import {hdriUrl} from '../world/assets';
import {type V3, mix3} from '../world/kit';
import {CaptionSlot, Heading, Mark, Marker} from '../frame/Frame';

// Demo – Was steckt im Drehstrommotor? Ganzer Motor → aufgeschnitten → Ständer, Käfigläufer → Drehfeld → Läufer dreht.
// Motorachse = x. Weißer Hintergrund. 15 s, ohne Ton.

const cl = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};
const PAINT = '#4F6D8A';
const STEEL = '#b9bec5';
const COPPER = '#C8743A';
const ALU = '#d9dde2';
const PH = ['#E2650F', '#3a3f46', '#1E7FD8'];
const L = 0.22; // Länge Blechpaket

// Ablauf
const CUT = 75, ROTOR = 165, FIELD = 245, SPIN = 300, OUT = 385;
const FIELD_W = (2 * Math.PI * 0.55) / 30; // Feld (Zeitlupe)
const SLIP = 0.93; // Läufer etwas langsamer

/** Ring (Rohr) entlang der x-Achse. */
const tubeGeo = (rOut: number, rIn: number, len: number, seg = 64) => {
  const shape = new THREE.Shape();
  shape.absarc(0, 0, rOut, 0, Math.PI * 2, false);
  const hole = new THREE.Path();
  hole.absarc(0, 0, rIn, 0, Math.PI * 2, true);
  shape.holes.push(hole);
  const g = new THREE.ExtrudeGeometry(shape, {depth: len, bevelEnabled: false, curveSegments: seg});
  g.translate(0, 0, -len / 2);
  g.rotateY(Math.PI / 2);
  return g;
};

const ClipOn: React.FC = () => {
  const gl = useThree((s) => s.gl);
  useLayoutEffect(() => {
    gl.localClippingEnabled = true;
  }, [gl]);
  return null;
};

const Motor: React.FC<{cut: number; t: number; fieldOn: number; spin: number; fieldAng: number; rotorAng: number; phase: number[]}> = ({cut, t, fieldOn, rotorAng, fieldAng, phase}) => {
  // Schnittebene: behält z <= c; c fährt von außen auf 0 → vordere Hälfte weg
  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 0, -1), 1), []);
  plane.constant = 0.4 - 0.4 * cut;
  const clip = [plane];
  const housing = useMemo(() => tubeGeo(0.155, 0.132, 0.3), []);
  const stack = useMemo(() => tubeGeo(0.13, 0.09, 0.009, 48), []);
  const rotorStack = useMemo(() => tubeGeo(0.084, 0.024, 0.009, 48), []);
  const shield = useMemo(() => tubeGeo(0.155, 0.03, 0.022), []);
  const gap = useMemo(() => new THREE.CylinderGeometry(0.088, 0.088, L * 0.98, 64, 1, true, 0, Math.PI / 4), []);
  const paint = {color: PAINT, roughness: 0.45, metalness: 0.25, clippingPlanes: clip, side: THREE.DoubleSide};
  void t;
  return (
    <group>
      {/* Gehäuse mit Kühlrippen */}
      <mesh geometry={housing} castShadow>
        <meshStandardMaterial {...paint} />
      </mesh>
      {Array.from({length: 28}).map((_, k) => {
        const a = (k / 28) * Math.PI * 2;
        if (Math.sin(a) < -0.8) return null; // unten keine Rippen (Füße)
        return (
          <mesh key={k} position={[0, Math.sin(a) * 0.167, Math.cos(a) * 0.167]} rotation-x={-a}>
            <boxGeometry args={[0.28, 0.006, 0.026]} />
            <meshStandardMaterial {...paint} />
          </mesh>
        );
      })}
      {/* Lagerschilde */}
      {[-0.16, 0.16].map((x) => (
        <mesh key={x} geometry={shield} position={[x, 0, 0]} castShadow>
          <meshStandardMaterial {...paint} />
        </mesh>
      ))}
      {/* Lüfterhaube hinten */}
      <mesh position={[-0.225, 0, 0]} rotation-z={Math.PI / 2}>
        <cylinderGeometry args={[0.15, 0.15, 0.11, 64, 1, true]} />
        <meshStandardMaterial {...paint} />
      </mesh>
      {[0.04, 0.08, 0.12].map((r) => (
        <mesh key={r} position={[-0.28, 0, 0]} rotation-y={Math.PI / 2}>
          <torusGeometry args={[r, 0.004, 8, 64]} />
          <meshStandardMaterial {...paint} />
        </mesh>
      ))}
      {/* Klemmkasten + Füße */}
      <RoundedBox args={[0.12, 0.06, 0.11]} radius={0.008} position={[0.02, 0.19, 0]} castShadow>
        <meshStandardMaterial {...paint} />
      </RoundedBox>
      {[-0.1, 0.1].map((x) => (
        <mesh key={x} position={[x, -0.165, 0]} castShadow>
          <boxGeometry args={[0.05, 0.03, 0.3]} />
          <meshStandardMaterial {...paint} />
        </mesh>
      ))}

      {/* Ständer: Blechpaket (einzelne Bleche) */}
      {Array.from({length: 22}).map((_, k) => (
        <mesh key={k} geometry={stack} position={[-L / 2 + (k + 0.5) * (L / 22), 0, 0]}>
          <meshStandardMaterial color="#5b6168" roughness={0.5} metalness={0.5} clippingPlanes={clip} side={THREE.DoubleSide} />
        </mesh>
      ))}
      {/* Wickelköpfe: 6 Spulengruppen je Seite, je Phase eine Farbe beim Leuchten */}
      {[-1, 1].map((side) =>
        Array.from({length: 6}).map((_, k) => {
          const ph = k % 3;
          const glow = fieldOn * Math.max(0, phase[ph]);
          return (
            <group key={side + '-' + k} position={[side * (L / 2 + 0.018), 0, 0]} rotation-x={(k / 6) * Math.PI * 2}>
              <mesh rotation-y={Math.PI / 2}>
                <torusGeometry args={[0.108, 0.02, 12, 24, Math.PI / 3.3]} />
                <meshStandardMaterial color={COPPER} roughness={0.35} metalness={0.6} emissive={PH[ph]} emissiveIntensity={glow * 1.6} clippingPlanes={clip} side={THREE.DoubleSide} />
              </mesh>
            </group>
          );
        }),
      )}

      {/* Läufer (Käfigläufer) + Welle – drehen sich */}
      <group rotation-x={rotorAng}>
        {Array.from({length: 22}).map((_, k) => (
          <mesh key={k} geometry={rotorStack} position={[-L / 2 + (k + 0.5) * (L / 22), 0, 0]}>
            <meshStandardMaterial color="#6a7078" roughness={0.5} metalness={0.5} />
          </mesh>
        ))}
        {Array.from({length: 18}).map((_, k) => {
          const a = (k / 18) * Math.PI * 2;
          return (
            <mesh key={k} position={[0, Math.sin(a) * 0.078, Math.cos(a) * 0.078]} rotation-x={-a}>
              <boxGeometry args={[L + 0.02, 0.012, 0.012]} />
              <meshStandardMaterial color={ALU} roughness={0.3} metalness={0.7} emissive="#FFD23F" emissiveIntensity={fieldOn * 0.35} />
            </mesh>
          );
        })}
        {[-1, 1].map((s) => (
          <mesh key={s} position={[s * (L / 2 + 0.012), 0, 0]} rotation-y={Math.PI / 2}>
            <torusGeometry args={[0.072, 0.012, 12, 48]} />
            <meshStandardMaterial color={ALU} roughness={0.3} metalness={0.7} />
          </mesh>
        ))}
        <mesh rotation-z={Math.PI / 2}>
          <cylinderGeometry args={[0.022, 0.022, 0.64, 32]} />
          <meshStandardMaterial color={STEEL} roughness={0.25} metalness={0.9} />
        </mesh>
        {/* Passfeder: zeigt, dass die Welle dreht */}
        <mesh position={[0.27, 0.023, 0]}>
          <boxGeometry args={[0.06, 0.008, 0.012]} />
          <meshStandardMaterial color="#8a9098" metalness={0.8} roughness={0.3} />
        </mesh>
        {/* Lüfterrad hinten */}
        {Array.from({length: 8}).map((_, k) => (
          <mesh key={k} position={[-0.225, 0, 0]} rotation-x={(k / 8) * Math.PI * 2}>
            <boxGeometry args={[0.05, 0.11, 0.006]} />
            <meshStandardMaterial color="#2b2f35" roughness={0.6} />
          </mesh>
        ))}
      </group>

      {/* Drehfeld im Luftspalt: zwei leuchtende Bänder (Nord/Süd), laufen um */}
      {fieldOn > 0.01 ? (
        <group rotation-x={fieldAng}>
          {[0, Math.PI].map((o, k) => (
            <group key={k} rotation-x={o}>
              <mesh geometry={gap} rotation-z={Math.PI / 2}>
                <meshBasicMaterial color={new THREE.Color(k === 0 ? '#FFC21A' : '#4FB6FF').multiplyScalar(1.6)} transparent opacity={0.35 * fieldOn} side={THREE.DoubleSide} toneMapped={false} depthWrite={false} />
              </mesh>
            </group>
          ))}
        </group>
      ) : null}
    </group>
  );
};

// Kamera
type Key = {f: number; pos: V3; target: V3};
const KEYS: Key[] = [
  {f: 0, pos: [1.45, 0.75, 2.1], target: [-0.03, -0.09, 0.0]},
  {f: CUT, pos: [1.2, 0.68, 2.25], target: [-0.03, -0.09, 0.0]},
  {f: ROTOR, pos: [0.8, 0.52, 2.0], target: [0.0, -0.09, 0.0]},
  {f: FIELD - 10, pos: [0.68, 0.46, 1.78], target: [0.0, -0.09, 0.0]},
  {f: FIELD + 25, pos: [1.65, 0.36, 1.0], target: [0.0, -0.1, 0.0]},
  {f: OUT, pos: [1.58, 0.38, 1.06], target: [0.0, -0.1, 0.0]},
  {f: 450, pos: [1.6, 0.8, 2.2], target: [-0.03, -0.1, 0.0]},
];
const ease = Easing.inOut(Easing.cubic);
const camAt = (f: number) => {
  let i = 0;
  while (i < KEYS.length - 2 && f >= KEYS[i + 1].f) i++;
  const a = KEYS[i], b = KEYS[i + 1];
  const u = ease(interpolate(f, [a.f, b.f], [0, 1], cl));
  return {pos: mix3(a.pos, b.pos, u), target: mix3(a.target, b.target, u)};
};
/** 3D-Punkt → Bildpunkt (für Markierungen), gleiche Kamera wie im Bild. */
const project = (p: V3, cam: {pos: V3; target: V3}): [number, number] => {
  const c = new THREE.PerspectiveCamera(30, 1080 / 1920, 0.01, 20);
  c.position.set(...cam.pos);
  c.lookAt(...cam.target);
  c.updateMatrixWorld();
  const v = new THREE.Vector3(...p).project(c);
  return [(v.x + 1) * 540, (1 - v.y) * 960];
};

const Rig: React.FC<{pos: V3; target: V3}> = ({pos, target}) => {
  const camera = useThree((s) => s.camera);
  camera.position.set(...pos);
  camera.lookAt(...target);
  return null;
};

export const Motor3D: React.FC = () => {
  const f = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();
  const t = f / fps;
  const cut = ease(interpolate(f, [CUT, CUT + 40], [0, 1], cl));
  const fieldOn = interpolate(f, [FIELD, FIELD + 15], [0, 1], cl);
  const fieldAng = Math.max(0, f - FIELD) * FIELD_W;
  // Läufer läuft an (ab SPIN) und erreicht ~93 % der Feld-Drehzahl
  let rv = 0, ra = 0;
  for (let n = SPIN; n <= f; n++) {
    rv += (FIELD_W * SLIP - rv) * 0.05;
    ra += rv;
  }
  const phase = [0, 1, 2].map((k) => Math.cos(fieldAng - (k * 2 * Math.PI) / 3));
  const cam = camAt(f);
  return (
    <AbsoluteFill style={{background: '#FFFFFF'}}>
      <ThreeCanvas width={width} height={height} shadows camera={{fov: 30, position: KEYS[0].pos, near: 0.01, far: 20}} gl={{antialias: true}}>
        <ClipOn />
        <Rig {...cam} />
        <color attach="background" args={['#FFFFFF']} />
        <Environment files={hdriUrl('brown_photostudio_02')} environmentIntensity={0.9} />
        <hemisphereLight args={['#ffffff', '#e6e8ec', 0.5]} />
        <directionalLight position={[1.5, 2.5, 2]} intensity={1.6} castShadow shadow-mapSize={[2048, 2048]} shadow-camera-left={-1} shadow-camera-right={1} shadow-camera-top={1} shadow-camera-bottom={-1} shadow-bias={-0.0003} />
        <mesh rotation-x={-Math.PI / 2} position={[0, -0.18, 0]} receiveShadow>
          <planeGeometry args={[10, 10]} />
          <shadowMaterial opacity={0.12} />
        </mesh>
        <Motor cut={cut} t={t} fieldOn={fieldOn} spin={rv} fieldAng={fieldAng} rotorAng={ra} phase={phase} />
        <EffectComposer multisampling={4}>
          <Bloom mipmapBlur luminanceThreshold={0.95} luminanceSmoothing={0.2} intensity={0.5} />
          <ToneMapping mode={ToneMappingMode.NEUTRAL} />
        </EffectComposer>
      </ThreeCanvas>

      {/* Kleine Zwischenüberschrift oben */}
      {f < CUT ? <Heading theme="light" text="Der [Drehstrommotor]" /> : f < ROTOR ? <Heading theme="light" text="1 · [Ständer]" from={CUT} /> : f < FIELD ? <Heading theme="light" text="2 · [Läufer]" from={ROTOR} /> : f < OUT ? <Heading theme="light" text="3 · [Drehfeld]" from={FIELD} /> : <Heading theme="light" text="4 · [Welle]" from={OUT} />}

      {/* Markierungen direkt am Bauteil (höchstens zwei gleichzeitig) */}
      {(() => {
        const at = (p: V3) => project(p, camAt(f));
        const [kx, ky] = at([L / 2 + 0.02, 0.105, -0.03]);
        const [bx, by] = at([-0.04, 0.12, -0.04]);
        const [sx, sy] = at([0.04, 0.078, 0.0]);
        const [rx, ry] = at([-(L / 2 + 0.012), 0.07, 0.0]);
        const [wx, wy] = at([0.29, 0, 0]);
        const [mx, my] = at([0.02, 0.22, 0]);
        return (
          <>
            <Marker theme="light" x={mx} y={my} show={20} hide={CUT - 4} side="right">Klemmkasten</Marker>
            <Marker theme="light" x={kx} y={ky} show={CUT + 40} hide={ROTOR - 4} side="right">Kupferwicklung</Marker>
            <Marker theme="light" x={bx} y={by} show={CUT + 52} hide={ROTOR - 4} side="left">Blechpaket</Marker>
            <Marker theme="light" x={sx} y={sy} show={ROTOR + 20} hide={FIELD - 4} side="right">Alu-Stab</Marker>
            <Marker theme="light" x={rx} y={ry} show={ROTOR + 32} hide={FIELD - 4} side="left">Kurzschlussring</Marker>
            <Marker theme="light" x={wx} y={wy} show={OUT + 10} hide={480} side="left">Welle</Marker>
          </>
        );
      })()}

      {/* Nur Untertitel – Wichtiges farbig betont */}
      <CaptionSlot theme="light" show={8} hide={CUT - 2}>
        Was steckt im <Mark theme="light">Motor?</Mark>
      </CaptionSlot>
      <CaptionSlot theme="light" show={CUT + 30} hide={ROTOR - 2}>
        Außen: <span style={{color: COPPER}}>Kupferwicklungen</span>
      </CaptionSlot>
      <CaptionSlot theme="light" show={ROTOR + 4} hide={FIELD - 2}>
        Innen: ein Käfig aus <Mark theme="light">Alu-Stäben</Mark>
      </CaptionSlot>
      <CaptionSlot theme="light" show={FIELD + 4} hide={SPIN + 30}>
        <span style={{color: PH[0]}}>L1</span>, <span style={{color: PH[1]}}>L2</span>, <span style={{color: PH[2]}}>L3</span> erzeugen ein <Mark theme="light">Drehfeld</Mark>
      </CaptionSlot>
      <CaptionSlot theme="light" show={SPIN + 32} hide={OUT - 2}>
        Es <Mark theme="light">zieht den Läufer</Mark> mit
      </CaptionSlot>
      <CaptionSlot theme="light" show={OUT + 2} hide={480}>
        Feld 1.500, Läufer nur <Mark theme="light">1.440 U/min</Mark>
      </CaptionSlot>
    </AbsoluteFill>
  );
};
