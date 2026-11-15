// Ordnet die Wörter aus dem Skript den Whisper-Zeitstempeln zu.
// Ergebnis: genau ein Caption pro Skriptwort, Schreibweise immer aus dem Skript.

export const normalizeWord = (w) =>
  w.toLowerCase().replace(/ß/g, 'ss').replace(/[^\p{L}\p{N}]/gu, '');

export const scriptWords = (text) => text.split(/\s+/).map((w) => w.trim()).filter(Boolean);

export function alignScriptToTimestamps(script, timed) {
  const a = script.map(normalizeWord);
  const b = timed.map((t) => normalizeWord(t.text));
  const n = a.length, m = b.length;
  const dp = Array.from({length: n + 1}, () => new Int32Array(m + 1));
  for (let i = n - 1; i >= 0; i--)
    for (let j = m - 1; j >= 0; j--)
      dp[i][j] = a[i] && a[i] === b[j] ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);

  const match = new Array(n).fill(-1);
  for (let i = 0, j = 0; i < n && j < m; ) {
    if (a[i] && a[i] === b[j]) { match[i] = j; i++; j++; }
    else if (dp[i + 1][j] >= dp[i][j + 1]) i++;
    else j++;
  }

  const out = script.map((text, i) => {
    const j = match[i];
    return j >= 0 ? {text, startMs: timed[j].startMs, endMs: timed[j].endMs, matched: true} : {text, startMs: NaN, endMs: NaN, matched: false};
  });

  // Nicht erkannte Wörter zwischen bekannten Nachbarn gleichmäßig verteilen.
  const lastEnd = timed.length ? timed[timed.length - 1].endMs : 0;
  for (let i = 0; i < n; ) {
    if (out[i].matched) { i++; continue; }
    let k = i;
    while (k < n && !out[k].matched) k++;
    const from = i > 0 ? out[i - 1].endMs : 0;
    const to = k < n ? out[k].startMs : lastEnd;
    const step = Math.max(0, to - from) / (k - i);
    for (let x = i; x < k; x++) {
      out[x].startMs = Math.round(from + step * (x - i));
      out[x].endMs = Math.round(from + step * (x - i + 1));
    }
    i = k;
  }

  const matchedCount = out.filter((w) => w.matched).length;
  return {
    words: out.map((w, i) => ({
      text: (i === 0 ? '' : ' ') + w.text,
      startMs: w.startMs,
      endMs: Math.max(w.endMs, w.startMs + 1),
      timestampMs: Math.round((w.startMs + w.endMs) / 2),
      confidence: w.matched ? 1 : 0,
    })),
    matchRatio: n ? matchedCount / n : 1,
  };
}
