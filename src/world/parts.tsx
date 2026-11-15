import React, {useMemo} from 'react';
import * as THREE from 'three';
import {DipoleLine, FlatSpiral, type V3, rand} from './kit';

// Wiederverwendbare Technik-Bauteile und Effekte. Alle Animationen kommen von außen (t / Fortschritt).

export const COLORS = {
  copper: '#c8773e',
  cyan: new THREE.Color('#7fe9ff'),
  heat: new THREE.Color('#ff7a1a'),
  hot: '#e2483b',
  cold: '#3b82e2',
};

/** Flache Spule aus Kupferdraht. heat = rot-orange Glühen, glow = cyan Leuchten. */
export const Coil: React.FC<{r0: number; r1: number; turns: number; wire: number; heat?: number; glow?: number; opacity?: number}> = ({r0, r1, turns, wire, heat = 0, glow = 0, opacity = 1}) => {
  const geo = useMemo(() => new THREE.TubeGeometry(new FlatSpiral(r0, r1, turns), 1400, wire, 8, false), [r0, r1, turns, wire]);
  const emissive = new THREE.Color(0, 0, 0).lerp(COLORS.heat, heat).add(COLORS.cyan.clone().multiplyScalar(glow * 0.55));
  return (
    <mesh geometry={geo} castShadow>
      <meshStandardMaterial color={COLORS.copper} metalness={1} roughness={0.32} emissive={emissive} emissiveIntensity={1 + heat * 2.5} transparent opacity={opacity} depthWrite={opacity > 0.99} />
    </mesh>
  );
};

/** Magnetfeld einer flachen Spule: Feldlinien + Teilchen, die mit dem Wechselstrom hin und her laufen. */
const DEFAULT_SIZES = [2.4, 3.8, 5.4];
export const FieldLines: React.FC<{t: number; on: number; acHz?: number; sizes?: number[]; perRing?: number; y?: number}> = ({t, on, acHz = 0.75, sizes = DEFAULT_SIZES, perRing = 10, y = 0}) => {
  const sizeKey = sizes.join(',');
  const lines = useMemo(() => {
    const out: {core: THREE.TubeGeometry; glow: THREE.TubeGeometry; curve: DipoleLine}[] = [];
    for (const L of sizes)
      for (let k = 0; k < perRing; k++) {
        const curve = new DipoleLine(L, (k / perRing) * Math.PI * 2 + L * 0.3);
        out.push({curve, core: new THREE.TubeGeometry(curve, 90, 0.028, 6), glow: new THREE.TubeGeometry(curve, 90, 0.1, 8)});
      }
    return out;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sizeKey, perRing]);
  const dot = useMemo(() => new THREE.SphereGeometry(0.09, 12, 12), []);
  if (on <= 0.001) return null;
  const s = Math.sin(2 * Math.PI * acHz * t);
  const strength = on * (0.3 + 0.7 * Math.abs(s));
  return (
    <group position={[0, y, 0]} scale={[1, Math.max(0.02, on), 1]}>
      {lines.map((l, i) => (
        <group key={i}>
          <mesh geometry={l.core}>
            <meshBasicMaterial color={COLORS.cyan} transparent opacity={0.85 * strength} toneMapped={false} depthWrite={false} />
          </mesh>
          <mesh geometry={l.glow}>
            <meshBasicMaterial color={COLORS.cyan} transparent opacity={0.1 * strength} toneMapped={false} depthWrite={false} blending={THREE.AdditiveBlending} />
          </mesh>
          {[0.3, 0.7].map((base, j) => (
            <mesh key={j} geometry={dot} position={l.curve.getPoint(Math.min(0.98, Math.max(0.02, base + 0.16 * s)))}>
              <meshBasicMaterial color="#e9fbff" transparent opacity={strength} toneMapped={false} depthWrite={false} />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  );
};

/** Aufsteigende Wärme (orange Partikel) über einem Bereich. */
export const HeatShimmer: React.FC<{t: number; amount: number; center: V3; radius?: number; rise?: number; size?: number}> = ({t, amount, center, radius = 2.8, rise = 3.2, size = 0.16}) => {
  const geo = useMemo(() => new THREE.SphereGeometry(size, 10, 10), [size]);
  if (amount <= 0.001) return null;
  return (
    <group position={center}>
      {Array.from({length: 26}).map((_, i) => {
        const period = 1.6 + rand(i) * 0.9;
        const ph = ((t + rand(i + 50) * period) % period) / period;
        const a = rand(i + 9) * Math.PI * 2, r = radius * (0.2 + rand(i + 21) * 0.8);
        return (
          <mesh key={i} geometry={geo} position={[r * Math.cos(a), ph * rise, r * Math.sin(a)]} scale={1 - ph * 0.6}>
            <meshBasicMaterial color={COLORS.heat} transparent opacity={amount * (1 - ph) * 0.55} toneMapped={false} depthWrite={false} blending={THREE.AdditiveBlending} />
          </mesh>
        );
      })}
    </group>
  );
};

/** Kabel oder Rohr entlang von Punkten. */
export const Tube: React.FC<{points: V3[]; radius: number; color: string; roughness?: number; metalness?: number; segments?: number}> = ({points, radius, color, roughness = 0.45, metalness = 0, segments = 120}) => {
  const key = JSON.stringify(points);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const geo = useMemo(() => new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(...p)), false, 'catmullrom', 0.2), segments, radius, 12), [key, radius, segments]);
  return (
    <mesh geometry={geo} castShadow receiveShadow>
      <meshStandardMaterial color={color} roughness={roughness} metalness={metalness} />
    </mesh>
  );
};

/** Leuchtende Punkte, die entlang eines Pfades fließen (Strom, Wasser, Wärme). speed in Durchläufen/s, negativ = rückwärts. */
export const Flow: React.FC<{points: V3[]; t: number; on: number; color?: string | THREE.Color; count?: number; speed?: number; size?: number}> = ({points, t, on, color = COLORS.cyan, count = 8, speed = 0.4, size = 0.05}) => {
  const key = JSON.stringify(points);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const curve = useMemo(() => new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(...p)), false, 'catmullrom', 0.2), [key]);
  const geo = useMemo(() => new THREE.SphereGeometry(size, 12, 12), [size]);
  if (on <= 0.001) return null;
  return (
    <group>
      {Array.from({length: count}).map((_, i) => {
        const u = (((t * speed + i / count) % 1) + 1) % 1;
        return (
          <mesh key={i} geometry={geo} position={curve.getPointAt(u)}>
            <meshBasicMaterial color={color} transparent opacity={on * Math.sin(u * Math.PI) ** 0.5} toneMapped={false} depthWrite={false} />
          </mesh>
        );
      })}
    </group>
  );
};
