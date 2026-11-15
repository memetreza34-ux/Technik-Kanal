import React, {useLayoutEffect, useRef} from 'react';
import * as THREE from 'three';
import {useThree} from '@react-three/fiber';

/** Teile, die keine Bauplan-Linien bekommen (Partikel, Dampf, Drehteller …): group mit userData={NO_BP}. */
export const NO_BP = {noBp: true};

const collect = (o: THREE.Object3D, out: THREE.Mesh[]) => {
  if (o.userData?.noBp) return;
  const m = o as THREE.Mesh;
  if (m.isMesh && !(m.material instanceof THREE.MeshBasicMaterial)) out.push(m);
  for (const c of o.children) collect(c, out);
};

/**
 * Markenzeichen „Bauplan“: Das Objekt erscheint als leuchtende Strichzeichnung (lines 0–1)
 * und füllt sich von unten nach oben (build 0–1). height = Höhe des Objekts in m.
 */
export const Blueprint: React.FC<{build: number; lines: number; height: number; color?: string; children: React.ReactNode}> = ({build, lines, height, color = '#FFD23F', children}) => {
  const root = useRef<THREE.Group>(null);
  const edges = useRef<THREE.Group>(null);
  const gl = useThree((s) => s.gl);
  const plane = useRef(new THREE.Plane(new THREE.Vector3(0, -1, 0), 1e6));
  const mat = useRef(new THREE.LineBasicMaterial({color: new THREE.Color(color).multiplyScalar(2.2), transparent: true, toneMapped: false, depthWrite: false}));

  useLayoutEffect(() => {
    gl.localClippingEnabled = true;
    const g = root.current!, e = edges.current!;
    g.updateWorldMatrix(true, true);
    const inv = new THREE.Matrix4().copy(g.matrixWorld).invert();
    const meshes: THREE.Mesh[] = [];
    collect(g, meshes);
    for (const m of meshes) {
      const ls = new THREE.LineSegments(new THREE.EdgesGeometry(m.geometry, 28), mat.current);
      ls.matrixAutoUpdate = false;
      ls.matrix.copy(inv).multiply(m.matrixWorld);
      e.add(ls);
      for (const mt of Array.isArray(m.material) ? m.material : [m.material]) {
        mt.clippingPlanes = [plane.current];
        mt.needsUpdate = true;
      }
    }
    return () => {
      for (const c of [...e.children]) (c as THREE.LineSegments).geometry.dispose();
      e.clear();
    };
  }, [gl]);

  // jeden Frame: Füllhöhe und Linienstärke setzen
  useLayoutEffect(() => {
    const g = root.current!;
    g.updateWorldMatrix(true, false);
    const y0 = new THREE.Vector3().setFromMatrixPosition(g.matrixWorld).y;
    plane.current.constant = build >= 0.999 ? 1e6 : y0 - 0.003 + build * (height + 0.006);
    mat.current.opacity = Math.min(1, lines);
    edges.current!.visible = lines > 0.005;
  });

  return (
    <group>
      <group ref={root}>{children}</group>
      <group ref={edges} />
    </group>
  );
};
