import React, {useMemo} from 'react';
import * as THREE from 'three';
import {useGLTF} from '@react-three/drei';
import {staticFile} from 'remotion';

// CC0-Assets von Poly Haven, geladen per `npm run assets:fetch` nach public/3d/.
export const modelUrl = (id: string) => staticFile(`3d/models/${id}/${id}_1k.gltf`);
export const hdriUrl = (id: string) => staticFile(`3d/hdri/${id}_1k.hdr`);

type ModelProps = {
  id: string;
  /** Zielhöhe in Metern; das Modell wird gleichmäßig skaliert. Ohne Angabe: Originalgröße. */
  height?: number;
  position?: [number, number, number];
  rotationY?: number;
  /** Teile (Knotennamen) entfernen, z. B. eine zweite Variante im selben Modell. */
  hide?: string[];
  /** 0–1: macht das Modell durchsichtig (Röntgenblick). */
  opacity?: number;
};

/** Lädt ein Modell, stellt es mit der Unterseite auf y=0 (mittig in x/z) und wirft Schatten. */
export const Model: React.FC<ModelProps> = ({id, height, position = [0, 0, 0], rotationY = 0, hide, opacity = 1}) => {
  const {scene} = useGLTF(modelUrl(id));
  const hideKey = (hide ?? []).join('|');
  const fitted = useMemo(() => {
    const obj = scene.clone(true);
    for (const name of hideKey ? hideKey.split('|') : []) obj.getObjectByName(name)?.removeFromParent();
    obj.traverse((o) => {
      const m = o as THREE.Mesh;
      if (m.isMesh) {
        m.castShadow = true;
        m.receiveShadow = true;
        m.material = Array.isArray(m.material) ? m.material.map((x) => x.clone()) : m.material.clone();
      }
    });
    const box = new THREE.Box3().setFromObject(obj);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());
    const scale = height ? height / size.y : 1;
    return {obj, scale, offset: [-center.x, -box.min.y, -center.z] as [number, number, number]};
  }, [scene, height, hideKey]);
  fitted.obj.traverse((o) => {
    const m = o as THREE.Mesh;
    if (!m.isMesh) return;
    for (const mat of Array.isArray(m.material) ? m.material : [m.material]) {
      mat.transparent = opacity < 0.999;
      mat.opacity = opacity;
      mat.depthWrite = opacity >= 0.999;
    }
    m.castShadow = opacity > 0.5;
  });
  return (
    <group position={position} rotation-y={rotationY} scale={fitted.scale}>
      <primitive object={fitted.obj} position={fitted.offset} />
    </group>
  );
};
