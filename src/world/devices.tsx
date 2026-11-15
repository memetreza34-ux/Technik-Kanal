import React from 'react';

// Selbst gebaute Geräte (Maße in Metern), wo es kein passendes freies Modell gibt.

const TE = 0.0175; // Teilungseinheit eines Reiheneinbaugeräts (17,5 mm)

/** Reiheneinbaugerät (LS, FI, Hauptschalter). on=1 Hebel oben, on=0 unten (ausgelöst). */
const Module: React.FC<{x: number; width: number; on: number; kind: 'ls' | 'fi' | 'main'}> = ({x, width, on, kind}) => {
  const lever = -0.6 + 1.2 * on; // Hebelwinkel
  return (
    <group position={[x + width / 2, 0, 0]}>
      <mesh castShadow>
        <boxGeometry args={[width - 0.0012, 0.088, 0.055]} />
        <meshStandardMaterial color="#f3f3ef" roughness={0.45} />
      </mesh>
      <mesh position={[0, 0, 0.03]}>
        <boxGeometry args={[width - 0.004, 0.045, 0.01]} />
        <meshStandardMaterial color="#e6e6e0" roughness={0.5} />
      </mesh>
      <group position={[0, 0, 0.036]} rotation-x={-lever}>
        <mesh position={[0, 0.012, 0.004]}>
          <boxGeometry args={[Math.min(width - 0.006, kind === 'ls' ? 0.011 : 0.03), 0.026, 0.008]} />
          <meshStandardMaterial color={kind === 'main' ? '#c9302c' : kind === 'fi' ? '#2f5d9e' : '#3a3f45'} roughness={0.4} />
        </mesh>
      </group>
      {kind === 'fi' ? (
        <mesh position={[width / 2 - 0.009, -0.03, 0.034]} rotation-x={Math.PI / 2}>
          <cylinderGeometry args={[0.004, 0.004, 0.006, 16]} />
          <meshStandardMaterial color="#e8c13a" roughness={0.4} />
        </mesh>
      ) : null}
      <mesh position={[0, -0.036, 0.0281]}>
        <planeGeometry args={[width - 0.004, 0.008]} />
        <meshStandardMaterial color={on > 0.5 ? '#c9302c' : '#2e9e4f'} roughness={0.5} />
      </mesh>
    </group>
  );
};

/** Unterverteilung mit Hauptschalter, FI-Schalter und LS-Schaltern auf Hutschienen. */
export const Sicherungskasten: React.FC<{door?: number; ls?: number[]; fi?: number}> = ({door = 1, ls = Array(17).fill(1), fi = 1}) => {
  const W = 0.3, Hh = 0.52, D = 0.12;
  const rail = (y: number) => (
    <mesh position={[0, y, -D / 2 + 0.02]}>
      <boxGeometry args={[W - 0.06, 0.035, 0.008]} />
      <meshStandardMaterial color="#b9bec4" metalness={0.8} roughness={0.35} />
    </mesh>
  );
  const x0 = -6 * TE;
  return (
    <group>
      {/* Gehäuse */}
      <mesh position={[0, 0, -D / 2]} castShadow receiveShadow>
        <boxGeometry args={[W, Hh, 0.01]} />
        <meshStandardMaterial color="#e4e4df" roughness={0.6} />
      </mesh>
      {[
        [0, Hh / 2, W, 0.01],
        [0, -Hh / 2, W, 0.01],
      ].map(([x, y, w, h], i) => (
        <mesh key={'h' + i} position={[x, y, 0]} castShadow>
          <boxGeometry args={[w, h, D]} />
          <meshStandardMaterial color="#e4e4df" roughness={0.6} />
        </mesh>
      ))}
      {[-W / 2, W / 2].map((x, i) => (
        <mesh key={'v' + i} position={[x, 0, 0]} castShadow>
          <boxGeometry args={[0.01, Hh, D]} />
          <meshStandardMaterial color="#e4e4df" roughness={0.6} />
        </mesh>
      ))}
      {/* Reihe 1: Hauptschalter + FI */}
      <group position={[0, 0.14, 0]}>
        {rail(0)}
        <Module x={x0} width={3 * TE} on={1} kind="main" />
        <Module x={x0 + 3 * TE} width={4 * TE} on={fi} kind="fi" />
        {ls.slice(0, 5).map((on, i) => (
          <Module key={i} x={x0 + (7 + i) * TE} width={TE} on={on} kind="ls" />
        ))}
      </group>
      {/* Reihe 2: weitere LS-Schalter */}
      <group position={[0, -0.01, 0]}>
        {rail(0)}
        {ls.slice(5, 17).map((on, i) => (
          <Module key={i} x={x0 + i * TE} width={TE} on={on} kind="ls" />
        ))}
      </group>
      {/* Reihe 3: Abdeckung mit Beschriftungsfeld */}
      <mesh position={[0, -0.16, 0.0]}>
        <boxGeometry args={[12 * TE, 0.09, 0.05]} />
        <meshStandardMaterial color="#efefea" roughness={0.6} />
      </mesh>
      {/* Tür (scharniert links) */}
      <group position={[-W / 2, 0, D / 2]} rotation-y={-door * 1.9}>
        <mesh position={[W / 2, 0, 0.006]} castShadow>
          <boxGeometry args={[W, Hh, 0.012]} />
          <meshStandardMaterial color="#ebebe6" roughness={0.55} />
        </mesh>
      </group>
    </group>
  );
};
