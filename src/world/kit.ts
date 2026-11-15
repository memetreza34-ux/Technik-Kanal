import * as THREE from 'three';
import {Easing, interpolate} from 'remotion';

// Gemeinsame Bausteine für 3D-Shorts: Zeitsteuerung, Kamera-Shots, Kurven.

export type Beats = Record<string, number>; // Beat-ID → Startframe

const smooth = Easing.bezier(0.45, 0, 0.2, 1);
const cl = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

/** 0→1 zwischen start und start+dur (Frames), weich. */
export const ramp = (f: number, start: number, dur: number) => interpolate(f, [start, start + Math.max(1, dur)], [0, 1], {...cl, easing: smooth});
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const mix3 = (a: V3, b: V3, t: number): V3 => [lerp(a[0], b[0], t), lerp(a[1], b[1], t), lerp(a[2], b[2], t)];
export type V3 = [number, number, number];

/** Kameraposition; `dur` = Dauer der Fahrt dorthin in Sekunden (Standard 1,2 s). */
export type Shot = {pos: V3; target: V3; fov: number; dur?: number};

/** Rechnet einen Shot aus einem lokalen Koordinatensystem (z. B. cm auf einem Tisch) in Weltkoordinaten um. */
export const placeShot = (s: Shot, anchor: V3, scale: number): Shot => ({
  ...s,
  pos: [anchor[0] + s.pos[0] * scale, anchor[1] + s.pos[1] * scale, anchor[2] + s.pos[2] * scale],
  target: [anchor[0] + s.target[0] * scale, anchor[1] + s.target[1] * scale, anchor[2] + s.target[2] * scale],
});

/** Blendet nacheinander von Shot zu Shot; jeder Wechsel beginnt kurz vor dem Beat. */
export function cameraAt(f: number, fps: number, beats: Beats, shots: Record<string, Shot>, order: string[]) {
  let pos = shots[order[0]].pos, target = shots[order[0]].target, fov = shots[order[0]].fov;
  for (const id of order.slice(1)) {
    const t = ramp(f, beats[id] - Math.round(0.2 * fps), Math.round((shots[id].dur ?? 1.2) * fps));
    pos = mix3(pos, shots[id].pos, t);
    target = mix3(target, shots[id].target, t);
    fov = lerp(fov, shots[id].fov, t);
  }
  // leichtes Pendeln um das Ziel (±3,4°), damit das Bild nie stillsteht – summiert sich nicht auf
  const a = Math.sin((f / fps) * 0.3) * 0.06;
  const dx = pos[0] - target[0], dz = pos[2] - target[2];
  pos = [target[0] + dx * Math.cos(a) - dz * Math.sin(a), pos[1], target[2] + dx * Math.sin(a) + dz * Math.cos(a)];
  return {pos, target, fov};
}

export class FlatSpiral extends THREE.Curve<THREE.Vector3> {
  constructor(private r0: number, private r1: number, private turns: number) {
    super();
  }
  getPoint(t: number, target = new THREE.Vector3()) {
    const th = t * this.turns * Math.PI * 2;
    const r = this.r0 + (this.r1 - this.r0) * t;
    return target.set(r * Math.cos(th), 0, r * Math.sin(th));
  }
}

/** Obere Hälfte einer Dipol-Feldlinie (r = L·sin²θ) in einer senkrechten Ebene mit Winkel phi. */
export class DipoleLine extends THREE.Curve<THREE.Vector3> {
  constructor(private L: number, private phi: number) {
    super();
  }
  getPoint(t: number, target = new THREE.Vector3()) {
    const th = 0.16 + t * (Math.PI / 2 - 0.1);
    const s = Math.sin(th);
    const rho = this.L * s * s * s;
    const y = this.L * s * s * Math.cos(th);
    return target.set(rho * Math.cos(this.phi), y, rho * Math.sin(this.phi));
  }
}

/** Deterministischer Zufall (kein Math.random – sonst flackert der Render). */
export const rand = (seed: number) => {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
