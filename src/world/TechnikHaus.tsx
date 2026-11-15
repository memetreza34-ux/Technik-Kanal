import React, {useMemo} from 'react';
import * as THREE from 'three';
import {Model} from './assets';
import {COLORS, Tube} from './parts';
import {Sicherungskasten} from './devices';
import {type Shot, type V3} from './kit';
import {repeat, tex} from './textures';

// Das Technik-Haus: wiederkehrende 3D-Welt des Kanals (Maße in Metern).
// Querschnitt-Diorama: Vorderseite offen, Keller im Erdreich sichtbar.

const H = 2.8; // Geschosshöhe
const BASE = -2.6; // Kellerboden
const T = 0.2; // Wandstärke
const RIDGE = 5.0;
const EAVE = 2.95;
const ROOF_ANGLE = Math.atan2(RIDGE - EAVE, 3.8);

/** Kamerapunkte für Flüge durch die Welt. */
export const HAUS_SPOTS: Record<string, Shot> = {
  aussen: {pos: [8, 7.5, 17], target: [0.5, 0.4, -0.5], fov: 42},
  dach: {pos: [0, 9, 14], target: [0, 4, 0], fov: 40},
  wohnzimmer: {pos: [2.6, 1.9, 5.2], target: [2.4, 0.8, -1.4], fov: 42},
  kueche: {pos: [-2.4, 1.9, 5.2], target: [-2.5, 0.9, -1.4], fov: 42},
  keller: {pos: [0.3, -0.8, 8.5], target: [0.3, -1.5, -1.8], fov: 46},
  sicherungskasten: {pos: [3.62, -1.1, -2.2], target: [3.6, -1.22, -3.25], fov: 40},
  waermepumpe: {pos: [9.2, 1.7, 3.2], target: [6.6, 0.55, -1.8], fov: 40},
};

/** Orte, an denen Detail-Szenen andocken (Oberfläche, auf der etwas steht). */
export const HAUS_ANCHORS: Record<string, V3> = {
  couchtisch: [1.9, 0.39, -1.2],
  arbeitsplatte: [-2.2, 0.92, -2.95],
  waermepumpe: [6.6, 0.1, -1.8],
  sicherungskasten: [3.6, -1.22, -3.24],
};

type BoxProps = {p: V3; s: V3; children: React.ReactNode; cast?: boolean};
const Box: React.FC<BoxProps> = ({p, s, children, cast = true}) => (
  <mesh position={p} castShadow={cast} receiveShadow>
    <boxGeometry args={s} />
    {children}
  </mesh>
);

const Plaster: React.FC<{w: number; h: number; color?: string}> = ({w, h, color = '#f2e6d6'}) => {
  const map = useMemo(() => repeat(tex.plaster(), w / 2, h / 2), [w, h]);
  return <meshStandardMaterial map={map} color={color} roughness={0.92} />;
};
const Concrete: React.FC<{w: number; h: number}> = ({w, h}) => {
  const map = useMemo(() => repeat(tex.concrete(), w / 3, h / 3), [w, h]);
  return <meshStandardMaterial map={map} roughness={0.95} />;
};

/** Wand entlang x bei z, optional mit Fenster [x0, x1, y0, y1]. */
const WallX: React.FC<{x0: number; x1: number; y0: number; y1: number; z: number; win?: [number, number, number, number]; concrete?: boolean}> = ({x0, x1, y0, y1, z, win, concrete}) => {
  const M = concrete ? Concrete : Plaster;
  const piece = (a: number, b: number, c: number, d: number, k: string) =>
    b - a > 0.001 && d - c > 0.001 ? (
      <Box key={k} p={[(a + b) / 2, (c + d) / 2, z]} s={[b - a, d - c, T]}>
        <M w={b - a} h={d - c} />
      </Box>
    ) : null;
  if (!win) return piece(x0, x1, y0, y1, 'w');
  const [a, b, c, d] = win;
  return (
    <group>
      {piece(x0, a, y0, y1, 'l')}
      {piece(b, x1, y0, y1, 'r')}
      {piece(a, b, y0, c, 'u')}
      {piece(a, b, d, y1, 'o')}
      <mesh position={[(a + b) / 2, (c + d) / 2, z - T * 0.3]}>
        <planeGeometry args={[b - a, d - c]} />
        <meshStandardMaterial color="#cfe8ff" emissive="#bfe0ff" emissiveIntensity={0.9} roughness={0.05} />
      </mesh>
      {[
        [(a + b) / 2, c, b - a + 0.08, 0.06],
        [(a + b) / 2, d, b - a + 0.08, 0.06],
        [a, (c + d) / 2, 0.06, d - c],
        [b, (c + d) / 2, 0.06, d - c],
        [(a + b) / 2, (c + d) / 2, 0.04, d - c],
      ].map(([x, y, w, h], i) => (
        <Box key={'f' + i} p={[x, y, z + T * 0.1]} s={[w, h, T * 0.6]}>
          <meshStandardMaterial color="#f4f4f2" roughness={0.4} />
        </Box>
      ))}
    </group>
  );
};

/** Wand entlang z bei x, optional mit Durchgang [z0, z1, Höhe]. */
const WallZ: React.FC<{z0: number; z1: number; y0: number; y1: number; x: number; door?: [number, number, number]; concrete?: boolean}> = ({z0, z1, y0, y1, x, door, concrete}) => {
  const M = concrete ? Concrete : Plaster;
  const piece = (a: number, b: number, c: number, d: number, k: string) =>
    b - a > 0.001 && d - c > 0.001 ? (
      <Box key={k} p={[x, (c + d) / 2, (a + b) / 2]} s={[T, d - c, b - a]}>
        <M w={b - a} h={d - c} />
      </Box>
    ) : null;
  if (!door) return piece(z0, z1, y0, y1, 'w');
  const [a, b, h] = door;
  return (
    <group>
      {piece(z0, a, y0, y1, 'v')}
      {piece(b, z1, y0, y1, 'h')}
      {piece(a, b, y0 + h, y1, 'o')}
    </group>
  );
};

const Earth: React.FC = () => {
  const mats = useMemo(() => {
    const soil = (w: number) => new THREE.MeshStandardMaterial({map: repeat(tex.soil(), w / 4, 1), roughness: 1});
    const grass = (w: number, d: number) => new THREE.MeshStandardMaterial({map: repeat(tex.grass(), w / 3, d / 3), roughness: 1});
    return (w: number, d: number) => [soil(d), soil(d), grass(w, d), soil(w), soil(w), soil(w)];
  }, []);
  const parts: [V3, V3][] = [
    [[-9, -1.7, -3.75], [8, 3.4, 14.5]],
    [[9, -1.7, -3.75], [8, 3.4, 14.5]],
    [[0, -1.7, -7.25], [10, 3.4, 7.5]],
    [[0, -3.1, 0], [10, 0.6, 7]],
  ];
  return (
    <group>
      {parts.map(([p, s], i) => (
        <mesh key={i} position={p} material={mats(s[0], s[2])} receiveShadow>
          <boxGeometry args={s} />
        </mesh>
      ))}
    </group>
  );
};

const Tree: React.FC<{p: V3; s?: number}> = ({p, s = 1}) => (
  <group position={p} scale={s}>
    <mesh position={[0, 1.1, 0]} castShadow>
      <cylinderGeometry args={[0.12, 0.18, 2.2, 10]} />
      <meshStandardMaterial color="#5b4030" roughness={0.9} />
    </mesh>
    {[
      [0, 2.6, 0, 1.3],
      [0.5, 2.2, 0.3, 0.9],
      [-0.5, 2.3, -0.2, 0.95],
      [0, 3.3, 0, 0.85],
    ].map(([x, y, z, r], i) => (
      <mesh key={i} position={[x, y, z]} castShadow>
        <icosahedronGeometry args={[r, 1]} />
        <meshStandardMaterial color={i % 2 ? '#3f6b2c' : '#4b7a33'} roughness={0.9} flatShading />
      </mesh>
    ))}
  </group>
);

const Roof: React.FC = () => {
  const mats = useMemo(() => {
    const tiles = new THREE.MeshStandardMaterial({map: repeat(tex.roof(), 5, 2.4), roughness: 0.85});
    const wood = new THREE.MeshStandardMaterial({color: '#8a6a4a', roughness: 0.8});
    return [wood, wood, tiles, wood, wood, wood];
  }, []);
  const len = 3.8 / Math.cos(ROOF_ANGLE) + 0.5;
  const yMid = (RIDGE + EAVE) / 2;
  return (
    <group>
      {[1, -1].map((side) => (
        <group key={side} position={[0, yMid, side * 1.9]} rotation-x={side * ROOF_ANGLE}>
          <mesh material={mats} castShadow receiveShadow>
            <boxGeometry args={[11, 0.18, len]} />
          </mesh>
          {side === 1
            ? [-2.6, -1.3, 0, 1.3].map((x) =>
                [-0.8, 0.95].map((z) => (
                  <group key={x + ':' + z} position={[x + 0.7, 0.13, z]}>
                    <mesh castShadow>
                      <boxGeometry args={[1.18, 0.05, 1.7]} />
                      <meshStandardMaterial color="#d7dbe0" metalness={0.8} roughness={0.35} />
                    </mesh>
                    <mesh position={[0, 0.03, 0]}>
                      <boxGeometry args={[1.1, 0.02, 1.62]} />
                      <meshStandardMaterial color="#132a4a" metalness={0.6} roughness={0.15} />
                    </mesh>
                  </group>
                )),
              )
            : null}
        </group>
      ))}
      {[-4.9, 4.9].map((x) => (
        <mesh key={x} position={[x, 0, 0]} rotation-y={Math.PI / 2} castShadow receiveShadow>
          <extrudeGeometry
            args={[
              new THREE.Shape([new THREE.Vector2(-3.5, H + 0.2), new THREE.Vector2(3.5, H + 0.2), new THREE.Vector2(0, RIDGE - 0.1)]),
              {depth: T, bevelEnabled: false},
            ]}
          />
          <Plaster w={7} h={2} />
        </mesh>
      ))}
    </group>
  );
};

const Floors: React.FC = () => {
  const planks = useMemo(() => repeat(tex.planks(), 2.5, 3.5), []);
  const tiles = useMemo(() => repeat(tex.tiles(), 4, 5.8), []);
  return (
    <group>
      <Box p={[0, -0.1, 0]} s={[10, 0.2, 7]}>
        <Concrete w={10} h={7} />
      </Box>
      <mesh position={[2.45, 0.002, 0]} rotation-x={-Math.PI / 2} receiveShadow>
        <planeGeometry args={[4.9, 7]} />
        <meshStandardMaterial map={planks} roughness={0.55} />
      </mesh>
      <mesh position={[-2.45, 0.002, 0]} rotation-x={-Math.PI / 2} receiveShadow>
        <planeGeometry args={[4.9, 7]} />
        <meshStandardMaterial map={tiles} roughness={0.35} />
      </mesh>
      <Box p={[0, BASE - 0.1, 0]} s={[10, 0.2, 7]}>
        <Concrete w={10} h={7} />
      </Box>
      <Box p={[0, H + 0.1, 0]} s={[10, 0.2, 7]}>
        <Plaster w={10} h={7} color="#f3f0ea" />
      </Box>
    </group>
  );
};

const Walls: React.FC = () => (
  <group>
    {/* Erdgeschoss */}
    <WallX x0={-5} x1={0} y0={0} y1={H} z={-3.4} win={[-3.4, -2.0, 1.25, 2.2]} />
    <WallX x0={0} x1={5} y0={0} y1={H} z={-3.4} win={[1.2, 2.6, 0.95, 2.2]} />
    <WallZ z0={-3.5} z1={3.5} y0={0} y1={H} x={-4.9} />
    <WallZ z0={-3.5} z1={3.5} y0={0} y1={H} x={4.9} />
    <WallZ z0={-3.3} z1={2.4} y0={0} y1={H} x={0} door={[-0.4, 0.55, 2.1]} />
    {/* Keller */}
    <WallX x0={-5} x1={5} y0={BASE} y1={0} z={-3.4} concrete />
    <WallZ z0={-3.5} z1={3.5} y0={BASE} y1={0} x={-4.9} concrete />
    <WallZ z0={-3.5} z1={3.5} y0={BASE} y1={0} x={4.9} concrete />
  </group>
);

const Wohnzimmer: React.FC = () => (
  <group>
    <mesh position={[1.9, 0.004, -1.2]} rotation-x={-Math.PI / 2} receiveShadow>
      <planeGeometry args={[2.0, 2.6]} />
      <meshStandardMaterial color="#6e5f53" roughness={1} />
    </mesh>
    <Model id="sofa_02" position={[0.62, 0, -1.2]} rotationY={Math.PI / 2} />
    <Model id="modern_coffee_table_01" position={[1.9, 0, -1.2]} />
    <Box p={[4.55, 0.25, -1.2]} s={[0.45, 0.5, 1.6]}>
      <meshStandardMaterial color="#3d3a37" roughness={0.6} />
    </Box>
    <Model id="Television_01" height={0.5} position={[4.55, 0.5, -1.2]} rotationY={-Math.PI / 2} />
    <Model id="Shelf_01" height={2.0} position={[3.6, 0, -3.15]} />
    <Model id="potted_plant_01" height={1.2} position={[4.45, 0, -2.85]} />
    <Model id="modern_ceiling_lamp_01" height={0.9} position={[1.9, H - 0.9, -1.2]} />
    <pointLight position={[2.2, 2.3, -1.0]} intensity={2.2} distance={7} decay={2} color="#ffd9a8" />
  </group>
);

const Kueche: React.FC<{omit: string[]}> = ({omit}) => {
  const oak = useMemo(() => repeat(tex.planks(), 1.6, 0.3), []);
  const subway = useMemo(() => repeat(tex.subway(), 5, 1), []);
  const SAGE = '#7c917a';
  return (
    <group>
      {/* Unterschränke + Arbeitsplatte aus Eiche */}
      <Box p={[-2.45, 0.43, -3.0]} s={[3.1, 0.86, 0.6]}>
        <meshStandardMaterial color={SAGE} roughness={0.55} />
      </Box>
      {[-3.6, -2.85, -2.1, -1.35].map((x) => (
        <Box key={x} p={[x, 0.62, -2.695]} s={[0.22, 0.018, 0.015]}>
          <meshStandardMaterial color="#c9a46a" metalness={0.8} roughness={0.3} />
        </Box>
      ))}
      <Box p={[-2.45, 0.885, -2.98]} s={[3.16, 0.05, 0.66]}>
        <meshStandardMaterial map={oak} roughness={0.5} />
      </Box>
      {/* Fliesenspiegel */}
      <mesh position={[-2.6, 1.2, -3.295]} receiveShadow>
        <planeGeometry args={[4.3, 0.58]} />
        <meshStandardMaterial map={subway} roughness={0.25} />
      </mesh>
      {/* Hängeschränke mit LED-Leiste */}
      {[
        [-4.15, 1.2],
        [-1.05, 1.7],
      ].map(([x, w]) => (
        <group key={x}>
          <Box p={[x, 1.92, -3.12]} s={[w, 0.72, 0.36]}>
            <meshStandardMaterial color={SAGE} roughness={0.55} />
          </Box>
          <mesh position={[x, 1.555, -3.05]}>
            <boxGeometry args={[w - 0.1, 0.012, 0.03]} />
            <meshBasicMaterial color="#ffd7a0" toneMapped={false} />
          </mesh>
          <pointLight position={[x, 1.45, -2.95]} intensity={0.9} distance={1.6} decay={2} color="#ffcf91" />
        </group>
      ))}
      {/* Fensterbank mit Pflanze */}
      <Box p={[-2.7, 1.235, -3.2]} s={[1.5, 0.03, 0.2]}>
        <meshStandardMaterial color="#efe9e0" roughness={0.4} />
      </Box>
      <Model id="potted_plant_01" height={0.3} position={[-3.15, 1.25, -3.2]} />
      {/* Steckdose für den Wasserkocher */}
      <Box p={[-2.62, 1.06, -3.285]} s={[0.08, 0.08, 0.012]}>
        <meshStandardMaterial color="#f4f2ee" roughness={0.4} />
      </Box>
      <Model id="electric_stove" height={0.9} position={[-4.4, 0, -3.0]} />
      {omit.includes('microwave') ? null : <Model id="vintage_microwave" height={0.33} position={[-1.55, 0.91, -3.0]} />}
      {omit.includes('kettle') ? null : <Model id="vintage_electric_kettle" height={0.24} position={[-2.9, 0.91, -2.95]} />}
      <Model id="dining_table" height={0.76} position={[-2.5, 0, 0.6]} />
      <Model id="dining_chair_02" height={0.95} position={[-3.0, 0, -0.25]} />
      <Model id="dining_chair_02" height={0.95} position={[-2.0, 0, -0.25]} />
      <pointLight position={[-2.5, 2.4, -0.8]} intensity={3} distance={7} decay={2} color="#ffd9a8" />
    </group>
  );
};

const Keller: React.FC = () => (
  <group>
    <Model id="steel_frame_shelves_01" height={1.9} position={[-3.4, BASE, -2.95]} />
    <Model id="metal_toolbox" height={0.2} position={[-1.6, BASE, -2.95]} />
    <Model id="retro_multimeter" height={0.18} position={[-1.1, BASE, -2.85]} />
    {/* Pufferspeicher mit Vor- und Rücklauf zur Wärmepumpe */}
    <mesh position={[1.7, BASE + 0.9, -2.75]} castShadow receiveShadow>
      <cylinderGeometry args={[0.33, 0.33, 1.8, 40]} />
      <meshStandardMaterial color="#e9ecee" roughness={0.4} />
    </mesh>
    <Tube points={[[1.62, -0.85, -2.75], [1.62, -0.42, -2.75], [1.9, -0.3, -3.05], [4.85, -0.3, -3.05]]} radius={0.045} color={COLORS.hot} roughness={0.35} />
    <Tube points={[[1.82, -0.85, -2.75], [1.82, -0.55, -2.75], [2.1, -0.46, -3.18], [4.85, -0.46, -3.18]]} radius={0.045} color={COLORS.cold} roughness={0.35} />
    {/* Sicherungskasten (Unterverteilung) */}
    <group position={[3.6, -1.22, -3.24]}>
      <Sicherungskasten />
    </group>
    <Tube points={[[3.5, -0.9, -3.27], [3.5, -0.5, -3.27], [3.5, -0.02, -3.27]]} radius={0.022} color="#5d6066" />
    <Tube points={[[3.7, -0.9, -3.27], [3.7, -0.5, -3.27], [3.7, -0.02, -3.27]]} radius={0.016} color="#5d6066" />
    {/* Glühbirne */}
    <Tube points={[[0, -0.01, -0.6], [0, -0.2, -0.6], [0, -0.42, -0.6]]} radius={0.008} color="#222" />
    <group position={[0, -0.42, -0.6]} rotation-x={Math.PI}>
      <Model id="lightbulb_led" height={0.11} />
    </group>
    <mesh position={[0, -0.49, -0.6]}>
      <sphereGeometry args={[0.035, 16, 16]} />
      <meshBasicMaterial color="#fff1d0" toneMapped={false} />
    </mesh>
    <pointLight position={[0, -0.6, -0.6]} intensity={2.4} distance={8} decay={2} color="#ffd59a" />
  </group>
);

const Garten: React.FC = () => (
  <group>
    <Box p={[6.6, 0.05, -1.8]} s={[1.2, 0.1, 0.7]}>
      <Concrete w={1.2} h={0.7} />
    </Box>
    <Model id="exterior_aircon_unit" height={0.93} position={[6.6, 0.1, -1.8]} hide={['exterior_aircon_unit_rusted']} />
    <Tree p={[-9.5, 0, -7]} />
    <Tree p={[10, 0, -8]} s={1.15} />
    <Tree p={[-11, 0, 1.5]} s={0.8} />
    {[
      [-6.5, -2.5, 0.55],
      [-7.2, -1.6, 0.4],
      [7.8, 1.2, 0.5],
      [6.2, 2.4, 0.35],
    ].map(([x, z, r], i) => (
      <mesh key={i} position={[x, r * 0.6, z]} castShadow>
        <icosahedronGeometry args={[r, 1]} />
        <meshStandardMaterial color="#3f6b2c" roughness={0.9} flatShading />
      </mesh>
    ))}
  </group>
);

/** Die komplette Welt. Statisch – Animation passiert in den Detail-Szenen. */
/** omit: Teile weglassen, die eine Szene selbst steuert (z. B. 'kettle'). */
export const TechnikHaus: React.FC<{omit?: string[]}> = React.memo(({omit = []}) => (
  <group>
    <Earth />
    <Floors />
    <Walls />
    <Roof />
    <Wohnzimmer />
    <Kueche omit={omit} />
    <Keller />
    <Garten />
  </group>
));
