// YouTube-Kapitelmarken aus dem Szenenplan (`chapterTitle`) und den echten Render-Zeiten.
//
// Konkurrenzanalyse 23.10.2026: Die erfolgreichen Kanäle setzen 3–19 Kapitel pro Video;
// unsere Captions hatten bisher nur den Platzhalter „Kapitel … ergänzen wir später“.
// YouTube zeigt Kapitel nur, wenn das erste bei 0:00 beginnt, es mindestens 3 gibt und jedes
// mindestens 10 Sekunden lang ist.

export const CHAPTER_RULES = {minChapters: 3, minSeconds: 10, maxTitleLength: 60};
export const CHAPTER_PLACEHOLDER = /^Kapitel mit exakten Zeitstempeln.*$/m;

export const formatTimestamp = (totalSeconds) => {
  const seconds = Math.max(0, Math.floor(totalSeconds));
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = String(seconds % 60).padStart(2, '0');
  return h ? `${h}:${String(m).padStart(2, '0')}:${s}` : `${m}:${s}`;
};

export const buildYouTubeChapters = ({planScenes = [], runtimeScenes = [], fps = 30, durationSeconds, rules = CHAPTER_RULES}) => {
  const problems = [];
  const startById = new Map(runtimeScenes.map((scene) => [scene.id, scene.fromFrame / fps]));
  const end = durationSeconds ?? Math.max(0, ...runtimeScenes.map((scene) => scene.toFrame / fps));
  const chapters = [];
  planScenes.forEach((scene, index) => {
    const title = String(scene.chapterTitle ?? '').trim();
    if (!title) return;
    if (!startById.has(scene.id)) return problems.push(`${scene.id}: Kapitel „${title}“ hat keine Render-Zeit.`);
    if (title.length > rules.maxTitleLength) problems.push(`${scene.id}: Kapiteltitel länger als ${rules.maxTitleLength} Zeichen.`);
    chapters.push({sceneId: scene.id, title, start: index === 0 ? 0 : startById.get(scene.id)});
  });
  if (!chapters.length) return {lines: [], chapters, problems: ['Kein `chapterTitle` im Szenenplan: an der ersten Szene jedes Abschnitts einen kurzen Kapiteltitel eintragen.']};
  if (chapters[0].start !== 0) problems.push(`Das erste Kapitel muss bei 0:00 beginnen; ${chapters[0].sceneId} startet bei ${formatTimestamp(chapters[0].start)}. Die erste Szene braucht einen chapterTitle.`);
  if (chapters.length < rules.minChapters) problems.push(`Nur ${chapters.length} Kapitel; YouTube zeigt Kapitel erst ab ${rules.minChapters}.`);
  chapters.forEach((chapter, index) => {
    const next = chapters[index + 1]?.start ?? end;
    if (next - chapter.start < rules.minSeconds) problems.push(`Kapitel „${chapter.title}“ ist nur ${Math.round(next - chapter.start)} s lang; mindestens ${rules.minSeconds} s.`);
  });
  return {lines: chapters.map((chapter) => `${formatTimestamp(chapter.start)} ${chapter.title}`), chapters, problems};
};

// Ersetzt den Platzhalter oder einen vorhandenen Kapitelblock; sonst vor den Hashtags einfügen.
export const insertChaptersIntoCaption = (caption, lines) => {
  const block = `Kapitel:\n${lines.join('\n')}`;
  if (CHAPTER_PLACEHOLDER.test(caption)) return caption.replace(CHAPTER_PLACEHOLDER, block);
  const existing = /^Kapitel:\n(?:\d+:\d{2}(?::\d{2})? .*(?:\n|$))+/m;
  if (existing.test(caption)) return caption.replace(existing, `${block}\n`);
  const hashtags = caption.search(/^#/m);
  if (hashtags >= 0) return `${caption.slice(0, hashtags)}${block}\n\n${caption.slice(hashtags)}`;
  return `${caption.trimEnd()}\n\n${block}\n`;
};
