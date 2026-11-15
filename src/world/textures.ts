import * as THREE from 'three';
import {rand} from './kit';

// Prozedurale Texturen (keine Downloads nötig), einmal erzeugt und dann geteilt.
const cache = new Map<string, THREE.CanvasTexture>();

function make(key: string, w: number, h: number, draw: (g: CanvasRenderingContext2D) => void) {
  const hit = cache.get(key);
  if (hit) return hit;
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  draw(c.getContext('2d')!);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.anisotropy = 8;
  cache.set(key, t);
  return t;
}

/** Kopie mit eigener Wiederholung (teilt das Bild). */
export const repeat = (t: THREE.Texture, x: number, y: number) => {
  const c = t.clone();
  c.repeat.set(x, y);
  c.needsUpdate = true;
  return c;
};

const noise = (g: CanvasRenderingContext2D, w: number, h: number, n: number, alpha: number, seed: number, light = false) => {
  for (let i = 0; i < n; i++) {
    const v = light ? 255 : 0;
    g.fillStyle = `rgba(${v},${v},${v},${alpha * rand(seed + i * 3)})`;
    g.fillRect(rand(seed + i) * w, rand(seed + i * 7) * h, 1 + rand(i + seed * 2) * 3, 1 + rand(i * 5 + seed) * 3);
  }
};

export const tex = {
  /** Eichendielen, 1 Kachel ≈ 2 × 2 m */
  planks: () =>
    make('planks', 1024, 1024, (g) => {
      const rows = 10;
      for (let r = 0; r < rows; r++) {
        let x = -rand(r) * 400;
        while (x < 1024) {
          const len = 380 + rand(r * 31 + x) * 420;
          const tone = 150 + rand(r * 7 + x) * 40;
          g.fillStyle = `rgb(${tone},${tone * 0.72},${tone * 0.47})`;
          g.fillRect(x, (r * 1024) / rows, len, 1024 / rows);
          for (let k = 0; k < 7; k++) {
            g.strokeStyle = `rgba(90,55,30,${0.08 + rand(k + r * 13 + x) * 0.12})`;
            g.lineWidth = 1 + rand(k + x) * 2;
            const y = (r * 1024) / rows + rand(k * 9 + r + x) * (1024 / rows);
            g.beginPath();
            g.moveTo(x, y);
            g.bezierCurveTo(x + len / 3, y + 4, x + (2 * len) / 3, y - 4, x + len, y);
            g.stroke();
          }
          g.fillStyle = 'rgba(40,25,15,0.55)';
          g.fillRect(x, (r * 1024) / rows, 3, 1024 / rows);
          x += len;
        }
        g.fillStyle = 'rgba(40,25,15,0.5)';
        g.fillRect(0, (r * 1024) / rows, 1024, 3);
      }
    }),
  /** Fliesen 30 cm, 1 Kachel ≈ 1,2 m */
  tiles: () =>
    make('tiles', 512, 512, (g) => {
      g.fillStyle = '#9da3a8';
      g.fillRect(0, 0, 512, 512);
      for (let i = 0; i < 4; i++)
        for (let j = 0; j < 4; j++) {
          const tone = 205 + rand(i * 4 + j) * 20;
          g.fillStyle = `rgb(${tone},${tone},${tone - 4})`;
          g.fillRect(i * 128 + 3, j * 128 + 3, 122, 122);
        }
      noise(g, 512, 512, 1500, 0.05, 3);
    }),
  grass: () =>
    make('grass', 512, 512, (g) => {
      g.fillStyle = '#4e7a35';
      g.fillRect(0, 0, 512, 512);
      for (let i = 0; i < 9000; i++) {
        const tone = rand(i);
        g.fillStyle = tone > 0.5 ? `rgba(120,160,70,${0.35 * rand(i + 1)})` : `rgba(30,60,20,${0.35 * rand(i + 2)})`;
        g.fillRect(rand(i + 3) * 512, rand(i + 4) * 512, 2, 4);
      }
    }),
  /** Erdschnitt mit Schichten (oben Mutterboden) */
  soil: () =>
    make('soil', 512, 512, (g) => {
      const grad = g.createLinearGradient(0, 0, 0, 512);
      grad.addColorStop(0, '#3a2a1c');
      grad.addColorStop(0.12, '#4a3523');
      grad.addColorStop(0.5, '#6b4f33');
      grad.addColorStop(1, '#7d6447');
      g.fillStyle = grad;
      g.fillRect(0, 0, 512, 512);
      for (let i = 0; i < 260; i++) {
        g.fillStyle = `rgba(${150 + rand(i) * 60},${130 + rand(i + 1) * 50},${110 + rand(i + 2) * 40},0.5)`;
        g.beginPath();
        g.ellipse(rand(i + 5) * 512, 60 + rand(i + 6) * 452, 2 + rand(i + 7) * 7, 2 + rand(i + 8) * 5, rand(i) * 3, 0, Math.PI * 2);
        g.fill();
      }
      noise(g, 512, 512, 3000, 0.12, 9);
    }),
  roof: () =>
    make('roof', 512, 512, (g) => {
      g.fillStyle = '#5a2a1e';
      g.fillRect(0, 0, 512, 512);
      for (let r = 0; r < 8; r++)
        for (let c = 0; c < 8; c++) {
          const tone = 120 + rand(r * 8 + c) * 40;
          g.fillStyle = `rgb(${tone},${tone * 0.45},${tone * 0.32})`;
          g.fillRect(c * 64 + (r % 2) * 32 + 2, r * 64 + 2, 60, 56);
          g.fillStyle = 'rgba(0,0,0,0.25)';
          g.fillRect(c * 64 + (r % 2) * 32 + 2, r * 64 + 52, 60, 6);
        }
    }),
  concrete: () =>
    make('concrete', 512, 512, (g) => {
      g.fillStyle = '#8d8c87';
      g.fillRect(0, 0, 512, 512);
      noise(g, 512, 512, 6000, 0.12, 21);
      noise(g, 512, 512, 2500, 0.1, 37, true);
    }),
  /** Metro-Fliesen (Fliesenspiegel), 1 Kachel ≈ 0,6 × 0,6 m */
  subway: () =>
    make('subway', 512, 512, (g) => {
      g.fillStyle = '#cfc6b8';
      g.fillRect(0, 0, 512, 512);
      for (let r = 0; r < 8; r++)
        for (let c = -1; c < 4; c++) {
          const tone = 236 + rand(r * 9 + c) * 12;
          const x = c * 128 + (r % 2) * 64 + 3, y = r * 64 + 3;
          const grad = g.createLinearGradient(0, y, 0, y + 58);
          grad.addColorStop(0, `rgb(${tone},${tone - 4},${tone - 12})`);
          grad.addColorStop(1, `rgb(${tone - 14},${tone - 18},${tone - 26})`);
          g.fillStyle = grad;
          g.fillRect(x, y, 122, 58);
        }
    }),
  plaster: () =>
    make('plaster', 256, 256, (g) => {
      g.fillStyle = '#ebe6dd';
      g.fillRect(0, 0, 256, 256);
      noise(g, 256, 256, 2500, 0.04, 51);
    }),
};
