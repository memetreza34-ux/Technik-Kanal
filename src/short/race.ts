import type {Caption} from '@remotion/captions';
import {type RaceSpec, type SceneTiming, wordCount} from './types';

// Zeitraffer-Rennen: eine virtuelle Uhr (Sekunden im echten Leben), gekoppelt an Stellen im Sprechtext.

const norm = (w: string) => w.toLowerCase().replace(/[^\p{L}\p{N}]/gu, '');

/** Video-ms einer Stelle: Ende eines Wortes in der Szene, sonst Anteil `at` der Szenendauer. */
export function markMs(timings: SceneTiming[], captions: Caption[] | null, scene: string, word?: string, at = 0) {
  const t = timings.find((x) => x.scene.id === scene);
  if (!t) return NaN;
  const total = timings.reduce((n, x) => n + wordCount(x.scene.text), 0);
  if (word && captions && captions.length === total) {
    let from = 0;
    for (const x of timings) {
      if (x.scene.id === scene) break;
      from += wordCount(x.scene.text);
    }
    for (let i = from; i < from + wordCount(t.scene.text); i++) if (norm(captions[i].text) === norm(word)) return captions[i].endMs;
  }
  return t.startMs + at * (t.endMs - t.startMs);
}

/** Wandelt die Schlüsselstellen in [Video-ms, virtuelle Sekunden] um – sortiert. */
export function resolveRaceKeys(race: RaceSpec, timings: SceneTiming[], captions: Caption[] | null): [number, number][] {
  const total = timings.reduce((n, t) => n + wordCount(t.scene.text), 0);
  const usable = captions && captions.length === total;
  const out: [number, number][] = [];
  let wordStart = 0;
  const firstWord: Record<string, number> = {};
  for (const t of timings) {
    firstWord[t.scene.id] = wordStart;
    wordStart += wordCount(t.scene.text);
  }
  for (const k of race.keys) {
    const t = timings.find((x) => x.scene.id === k.scene);
    if (!t) continue;
    let ms = t.startMs + (k.at ?? 0) * (t.endMs - t.startMs);
    if (k.word && usable) {
      const from = firstWord[k.scene], n = wordCount(t.scene.text);
      for (let i = from; i < from + n; i++) {
        if (norm(captions![i].text) === norm(k.word)) {
          ms = captions![i].endMs;
          break;
        }
      }
    }
    out.push([ms, k.seconds]);
  }
  return out.sort((a, b) => a[0] - b[0]);
}

/** Virtuelle Uhr zum Video-Zeitpunkt (linear zwischen den Schlüsselstellen). */
export function raceClock(keys: [number, number][], ms: number) {
  if (!keys.length || ms <= keys[0][0]) return keys[0]?.[1] ?? 0;
  for (let i = 1; i < keys.length; i++) {
    const [m0, s0] = keys[i - 1], [m1, s1] = keys[i];
    if (ms <= m1) return s0 + ((s1 - s0) * (ms - m0)) / Math.max(1, m1 - m0);
  }
  return keys[keys.length - 1][1];
}

/** Video-ms, an dem die Uhr einen Wert erreicht (für Effekte wie Dampf). */
export function raceMsAt(keys: [number, number][], seconds: number) {
  for (let i = 1; i < keys.length; i++) {
    const [m0, s0] = keys[i - 1], [m1, s1] = keys[i];
    if (seconds <= s1 && s1 > s0) return m0 + ((m1 - m0) * (seconds - s0)) / (s1 - s0);
  }
  return keys.length ? keys[keys.length - 1][0] : 0;
}

/** Video-ms, an dem ein Wort in einer Szene beginnt (erstes Vorkommen); sonst Anteil `at` der Szene. */
export function wordStartMs(timings: SceneTiming[], captions: Caption[] | null, scene: string, word?: string, at = 0.3) {
  const t = timings.find((x) => x.scene.id === scene);
  if (!t) return NaN;
  const total = timings.reduce((n, x) => n + wordCount(x.scene.text), 0);
  if (word && captions && captions.length === total) {
    let from = 0;
    for (const x of timings) {
      if (x.scene.id === scene) break;
      from += wordCount(x.scene.text);
    }
    for (let i = from; i < from + wordCount(t.scene.text); i++) if (norm(captions[i].text) === norm(word)) return captions[i].startMs;
  }
  return t.startMs + at * (t.endMs - t.startMs);
}

/** Beats für jedes gesprochene Wort: "<szene>@<wort>" → Start-ms (erstes Vorkommen je Szene). */
export function wordBeatsMs(timings: SceneTiming[], captions: Caption[] | null): Record<string, number> {
  const out: Record<string, number> = {};
  const total = timings.reduce((n, x) => n + wordCount(x.scene.text), 0);
  if (!captions || captions.length !== total) return out;
  let i = 0;
  for (const t of timings) {
    for (let k = 0; k < wordCount(t.scene.text); k++, i++) {
      const key = t.scene.id + '@' + norm(captions[i].text);
      if (!(key in out)) out[key] = captions[i].startMs;
    }
  }
  return out;
}
