#!/usr/bin/env node
import assert from 'node:assert/strict';
import {buildYouTubeChapters, formatTimestamp, insertChaptersIntoCaption} from './lib/science-chapters.mjs';

assert.equal(formatTimestamp(0), '0:00');
assert.equal(formatTimestamp(75.9), '1:15');
assert.equal(formatTimestamp(3725), '1:02:05');

const fps = 30;
const runtimeScenes = [0, 12, 40, 95, 180, 300].map((second, index, all) => ({id: `s${index}`, fromFrame: second * fps, toFrame: (all[index + 1] ?? 390) * fps}));
const planScenes = [
  {id: 's0', chapterTitle: '220.000 Tonnen und ein Nagel'},
  {id: 's1'},
  {id: 's2', chapterTitle: 'Was Wasser wirklich tut'},
  {id: 's3'},
  {id: 's4', chapterTitle: 'Warum die Titanic trotzdem sank'},
  {id: 's5', chapterTitle: 'Die Antwort'},
];
const ok = buildYouTubeChapters({planScenes, runtimeScenes, fps, durationSeconds: 390});
assert.deepEqual(ok.problems, [], ok.problems.join('\n'));
assert.deepEqual(ok.lines, ['0:00 220.000 Tonnen und ein Nagel', '0:40 Was Wasser wirklich tut', '3:00 Warum die Titanic trotzdem sank', '5:00 Die Antwort']);

// YouTube-Regeln: Start bei 0:00, mindestens 3 Kapitel, je mindestens 10 s.
assert.ok(buildYouTubeChapters({planScenes: planScenes.map((scene, index) => (index === 0 ? {id: scene.id} : scene)), runtimeScenes, fps}).problems.some((problem) => /0:00/.test(problem)));
assert.ok(buildYouTubeChapters({planScenes: planScenes.slice(0, 3), runtimeScenes, fps}).problems.some((problem) => /Nur 2 Kapitel/.test(problem)));
assert.deepEqual(buildYouTubeChapters({planScenes: [{id: 's0', chapterTitle: 'A'}, {id: 's1', chapterTitle: 'B'}, {id: 's2', chapterTitle: 'C'}], runtimeScenes, fps}).problems, []);
assert.ok(buildYouTubeChapters({planScenes: [{id: 's0', chapterTitle: 'A'}, {id: 's1', chapterTitle: 'B'}, {id: 's2', chapterTitle: 'C'}], runtimeScenes: runtimeScenes.map((scene, index) => (index === 1 ? {...scene, fromFrame: 5 * fps} : scene)), fps}).problems.some((problem) => /„A“ ist nur 5 s/.test(problem)));
assert.ok(buildYouTubeChapters({planScenes: [{id: 's0'}], runtimeScenes, fps}).problems.some((problem) => /chapterTitle/.test(problem)));

// Caption: Platzhalter ersetzen, vorhandenen Block aktualisieren, sonst vor Hashtags einfügen.
const placeholder = 'Titel: X\n\nBeschreibung:\nText.\n\nKapitel mit exakten Zeitstempeln ergänzen wir erst nach dem fertigen Sprachschnitt.\n\n#Wissonaut';
const filled = insertChaptersIntoCaption(placeholder, ok.lines);
assert.ok(filled.includes('Kapitel:\n0:00 220.000 Tonnen und ein Nagel\n0:40'));
assert.ok(!filled.includes('ergänzen wir erst'));
const refreshed = insertChaptersIntoCaption(filled, ['0:00 Neu', '1:00 Zwei', '2:00 Drei']);
assert.equal((refreshed.match(/^Kapitel:/gm) ?? []).length, 1);
assert.ok(refreshed.includes('0:00 Neu') && !refreshed.includes('0:40 Was Wasser'));
assert.ok(refreshed.trimEnd().endsWith('#Wissonaut'));
const plain = insertChaptersIntoCaption('Beschreibung.\n\n#Physik', ['0:00 A', '1:00 B', '2:00 C']);
assert.ok(plain.indexOf('Kapitel:') < plain.indexOf('#Physik'));

console.log('✓ YouTube-Kapitel: Zeitstempel aus Render-Zeiten, YouTube-Regeln (0:00, ≥ 3, ≥ 10 s) und Caption-Einbau geprüft.');
