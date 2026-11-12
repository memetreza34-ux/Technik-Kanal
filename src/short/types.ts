import type {Caption} from '@remotion/captions';

export type ShortScene = {id: string; text: string};
export type ShortSpec = {
  format: 'short-9x16';
  title: string;
  status?: 'draft' | 'ready';
  scene: string; // Name der 3D-Szene in src/short/scenes
  highlight?: string[]; // Schlüsselwörter, die in den Untertiteln gelb erscheinen
  scenes: ShortScene[];
};

export type ShortProps = {
  slug: string;
  spec: ShortSpec | null;
  captions: Caption[] | null;
  hasAudio: boolean;
};

export const SHORT_WIDTH = 1080;
export const SHORT_HEIGHT = 1920;
export const SHORT_FPS = 30;
export const TAIL_MS = 900;
const FALLBACK_MS_PER_WORD = 420;

export const wordCount = (s: string) => s.split(/\s+/).filter(Boolean).length;

export type SceneTiming = {scene: ShortScene; startMs: number; endMs: number};

// Szenengrenzen = Startzeit des ersten gesprochenen Wortes jeder Szene.
export function sceneTimings(spec: ShortSpec, captions: Caption[] | null): SceneTiming[] {
  const counts = spec.scenes.map((s) => wordCount(s.text));
  const total = counts.reduce((a, b) => a + b, 0);
  const usable = captions && captions.length === total;
  let idx = 0;
  const starts = spec.scenes.map((_, i) => {
    const ms = i === 0 ? 0 : usable ? captions![idx].startMs : idx * FALLBACK_MS_PER_WORD;
    idx += counts[i];
    return ms;
  });
  const end = (usable ? captions![total - 1].endMs : total * FALLBACK_MS_PER_WORD) + TAIL_MS;
  return spec.scenes.map((scene, i) => ({scene, startMs: starts[i], endMs: i + 1 < starts.length ? starts[i + 1] : end}));
}
