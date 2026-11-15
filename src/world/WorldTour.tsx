import React from 'react';
import {ThreeCanvas} from '@remotion/three';
import {AbsoluteFill, useVideoConfig} from 'remotion';
import {CameraRig} from './CameraRig';
import {WorldLook} from './Look';
import {HAUS_SPOTS, TechnikHaus} from './TechnikHaus';
import type {Beats} from './kit';

// Rundflug durch die Technik-Welt: Vorschau aller Orte (und mögliches Kanal-Intro).
export const TOUR = ['aussen', 'wohnzimmer', 'kueche', 'keller', 'sicherungskasten', 'waermepumpe', 'dach', 'aussen'];
export const TOUR_STEP_S = 2.4;

export const WorldTour: React.FC = () => {
  const {fps, width, height} = useVideoConfig();
  const shots = Object.fromEntries(TOUR.map((id, i) => [id + i, {...HAUS_SPOTS[id], dur: 1.6}]));
  const order = TOUR.map((id, i) => id + i);
  const beats: Beats = Object.fromEntries(order.map((id, i) => [id, Math.round(i * TOUR_STEP_S * fps)]));
  return (
    <AbsoluteFill>
      <ThreeCanvas width={width} height={height} shadows camera={{fov: 40, position: [0, 4, 24], near: 0.01, far: 200}} gl={{antialias: true}}>
        <CameraRig beats={beats} shots={shots} order={order} />
        <WorldLook>
          <TechnikHaus />
        </WorldLook>
      </ThreeCanvas>
    </AbsoluteFill>
  );
};
