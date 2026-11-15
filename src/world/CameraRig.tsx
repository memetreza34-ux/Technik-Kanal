import * as THREE from 'three';
import {useThree} from '@react-three/fiber';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {type Beats, type Shot, cameraAt} from './kit';

/** Setzt die Kamera in jedem Frame aus Shot-Liste und Beat-Zeiten. */
export const CameraRig: React.FC<{beats: Beats; shots: Record<string, Shot>; order: string[]}> = ({beats, shots, order}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const camera = useThree((s) => s.camera) as THREE.PerspectiveCamera;
  const {pos, target, fov} = cameraAt(f, fps, beats, shots, order);
  camera.position.set(...pos);
  camera.lookAt(...target);
  if (camera.fov !== fov) {
    camera.fov = fov;
    camera.updateProjectionMatrix();
  }
  return null;
};
