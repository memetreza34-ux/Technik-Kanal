import type {Caption} from '@remotion/captions';

export type Tone = 'good' | 'bad' | 'neutral';
/** Ein Messwert: value wird hochgezählt; format 'mmss' zeigt Sekunden als m:ss. */
export type Row = {label: string; sub?: string; value: number; decimals?: number; unit?: string; tone?: Tone; format?: 'mmss'};
export type ChipSpec = {icon?: 'warn' | 'info' | 'plus'; text: string; top?: number; delay?: number};
export type Overlay =
  | {type: 'title'; line1: string; line2: string; options?: string[]; chip?: ChipSpec}
  | {type: 'meter'; title?: string; rows: Row[]; note?: string; chip?: ChipSpec}
  | {type: 'bars'; title?: string; rows: Row[]; note?: string; highlight?: {text: string; sub?: string}; chip?: ChipSpec}
  | {type: 'chip'; chip: ChipSpec}
  | {type: 'end'; line?: string}
  /** Datenkarte: Chips oder Wert → Ergebnis-Pille; jedes Teil erscheint beim gesprochenen Wort. */
  | {type: 'facts'; label?: string; chips?: Fact[]; value?: Fact; sub?: string; result?: Fact & {tone?: Tone}; source?: string; tone?: Tone; colors?: Record<string, string>}
  | {type: 'checklist'; title?: string; items: (Fact & {ok: boolean})[]};
/** Text, der beim Wort `word` (in der eigenen Szene) erscheint. */
export type Fact = {text: string; word?: string};

/** heading: Überschrift oben, [eckige Klammern] = Akzentfarbe. */
export type ShortScene = {id: string; text: string; chapter?: string; heading?: string; overlay?: Overlay};

/** Vergleichskarte: Spalten füllen sich nacheinander (reveal = Szene + optional Wort). */
export type ScoreboardSpec = {
  title: string;
  from: string;
  until: string;
  columns: {label: string; color: string; value: number; unit: string; decimals: number; sub?: string; reveal: {scene: string; word?: string}}[];
  notes?: {scene: string; text: string; tone?: Tone; word?: string}[];
};

/** Zeitraffer-Rennen: Bahnen mit Zielzeit (s); keys koppeln die Uhr an Szenen/Wörter. */
export type RaceSpec = {
  title?: string;
  from: number;
  to: number;
  unit: string;
  lanes: {label: string; finish: number; tone?: Tone}[];
  keys: {scene: string; word?: string; at?: number; seconds: number}[];
  dockAfter: string; // ab dieser Szene wandert die Anzeige nach oben
  until: string; // ab dieser Szene verschwindet sie
};
export type ShortSpec = {
  format: 'short-9x16';
  title: string;
  status?: 'draft' | 'ready';
  scene: string; // Name der 3D-Szene in src/short/scenes
  highlight?: string[]; // Schlüsselwörter, die in den Untertiteln gelb erscheinen
  overlays?: boolean; // Zahlen-Ebene, Kanalname und Abdunkelung einblenden
  race?: RaceSpec;
  /** 'clean' = Milchglas-Look mit Vergleichskarte; 'night' = dunkle Bühne, Kopfzeile, Datenkarten; Standard = Messgeräte-Look */
  style?: 'instrument' | 'clean' | 'night' | 'frame';
  /** nur für style 'frame': helle oder dunkle Bühne */
  theme?: 'dark' | 'light';
  scoreboard?: ScoreboardSpec;
  /** Röntgen-Moment: Etikett „Blick ins Innere“ ab diesem Wort */
  scan?: {scene: string; word?: string};
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
