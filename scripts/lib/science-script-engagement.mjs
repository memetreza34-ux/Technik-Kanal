// Spannungsregeln für Wissonaut-Skripte (qualitaet-v2).
//
// Gemessen an den ersten beiden Langvideos (18.10.2026):
// - Stahlschiff: 932 Wörter, 0 konkrete Zahlen, 80 % der Szenen mit genau 2 Sätzen
//   → Bildwechsel wie ein Metronom alle ~8 s.
// - Steckdose: 12 Absicherungswörter („häufig“, „normalerweise“ …) und 478 Wörter
//   (~3 Minuten) ohne Frage oder Ankündigung.
// Konkurrenz: Physik-Erklärvideos zur selben Frage 66–308 Aufrufe, Videos mit Geschichte,
// Zahl oder Drama 10.000–40.000 (siehe gehirn/ANALYSE-2026-10-18.md).
// Konkurrenzanalyse 23.10.2026 (gehirn/KONKURRENZ-ANALYSE-2026-10-23.md): 10 von 11 messbaren
// Videos haben 8–29 Zahlen pro 1000 Wörter; starke Hooks stapeln 4 Zahlen in den ersten 30 s;
// Story-Kanäle halten Spannung mit Vorausdeutungen („Zu diesem Zeitpunkt ahnte niemand …“).

export const QUALITY_RULES_VERSION = 'qualitaet-v2';

export const ENGAGEMENT_LIMITS = {
  hookAnchorWithinWords: 80,
  concreteNumbersPer1000WordsMin: 6,
  hedgesPer100WordsMax: 0.8,
  numbersPer120WordsMax: 3,
  hookNumbersMax: 6,
  twoSentenceSceneShareMax: 0.6,
  curiosityGapWordsMax: 240,
  shortSentenceShareMin: 0.15,
  wordsPerSecond: 2.5,
  // Keine feste Bildzahl: Stattdessen wird jede Szene am Takt gemessen (Konkurrenz mit Standbildern: Median 5,4–5,7 s).
  sceneSecondsReview: 8,
};

export const HEDGE_WORDS = ['häufig', 'normalerweise', 'beispielsweise', 'typischerweise', 'gewöhnlich', 'in der regel', 'unter umständen', 'gewissermaßen', 'teilweise', 'meistens'];
const HEDGE_PATTERN = new RegExp(`(?<![\\p{L}])(${HEDGE_WORDS.map((word) => word.replace(/ /g, '\\s+')).join('|')})(?![\\p{L}])`, 'giu');
const NUMBER_PATTERN = /(?<![\p{L}\d])(\d[\d.,]*|[\p{L}]*(?:hundert|tausend|million|milliard)[\p{L}]*|zwanzig|dreißig|vierzig|fünfzig|sechzig|siebzig|achtzig|neunzig|zwölf|elf)(?![\p{L}\d])/giu;
const TEASER_PATTERN = /(?<![\p{L}])(gleich|später|dazu kommen wir|das klären wir|bleib dran|noch nicht alles|doch dann|stell dir vor|überraschend|das eigentlich spannende|aber warum|zu diesem zeitpunkt|niemand ahnte|ahnt(?:e|en)?\s+(?:noch\s+)?niemand|was dann (?:passierte|geschah|kam)|doch das war erst|das sollte sich ändern|plötzlich)(?![\p{L}])/iu;
const PLACEHOLDER = /^(ungeplant|tbd|todo|platzhalter|ergänzen)?$/i;

const wordsOf = (text) => String(text ?? '').split(/\s+/).filter(Boolean);
const sentencesOf = (text) => String(text ?? '').split(/(?<=[.!?])\s+/).map((sentence) => sentence.trim()).filter(Boolean);
const fold = (text) => String(text ?? '').toLocaleLowerCase('de-DE').replace(/[„“"'’.,:;!?()–—-]/g, ' ').replace(/\s+/g, ' ').trim();
export const isPlaceholder = (value) => PLACEHOLDER.test(String(value ?? '').trim());
export const countNumbers = (text) => (String(text ?? '').match(NUMBER_PATTERN) ?? []).length;

export const analyzeScriptEngagement = ({scenes = [], hookAnchor, title = '', limits = ENGAGEMENT_LIMITS}) => {
  const problems = [];
  const hints = [];
  const words = [];
  const wordScene = [];
  scenes.forEach((scene, index) => wordsOf(scene.voiceText).forEach((word) => { words.push(word); wordScene.push(index); }));
  const fullText = words.join(' ');
  const total = words.length || 1;
  const seconds = (count) => Math.round(count / limits.wordsPerSecond);
  const sceneId = (wordIndex) => scenes[wordScene[Math.min(wordIndex, wordScene.length - 1)]]?.id ?? '?';

  // 1. Hook mit konkretem Anker.
  const anchorText = String(hookAnchor?.text ?? '').trim();
  if (!hookAnchor || isPlaceholder(hookAnchor.type) || isPlaceholder(anchorText)) {
    problems.push('Hook braucht einen konkreten Anker (Zahl, Ereignis, Ort, Person oder sichtbares Paradox): hookAnchor {type, text, firstImage} im Szenenplan eintragen.');
  } else if (!fold(words.slice(0, limits.hookAnchorWithinWords).join(' ')).includes(fold(anchorText))) {
    problems.push(`Hook-Anker „${anchorText}“ kommt nicht in den ersten ${limits.hookAnchorWithinWords} Wörtern (~${seconds(limits.hookAnchorWithinWords)} s) vor.`);
  }

  // 2. Konkrete Zahlen statt nur Prinzip.
  const numbers = countNumbers(fullText);
  const numbersMin = Math.max(1, Math.round((total / 1000) * limits.concreteNumbersPer1000WordsMin));
  if (numbers < numbersMin) problems.push(`Nur ${numbers} konkrete Zahl(en) im ganzen Skript; mindestens ${numbersMin} (z. B. Masse, Größe, Rekord, Jahreszahl – mit Quelle).`);

  // 3. Keine Zahlenliste. Im Hook ist ein kurzer Zahlenstapel erlaubt („6000 Bäume, 40 km Tauwerk, 100 Kanonen …“).
  const hookWords = limits.hookAnchorWithinWords;
  const hookNumbers = countNumbers(words.slice(0, hookWords).join(' '));
  if (hookNumbers > limits.hookNumbersMax) problems.push(`Hook mit ${hookNumbers} Zahlen in den ersten ${hookWords} Wörtern; maximal ${limits.hookNumbersMax}. Die stärksten Zahlen behalten, den Rest später verteilen.`);
  for (let start = 0; start < total; start += 20) {
    const count = countNumbers(words.slice(Math.max(start, hookWords), start + 120).join(' '));
    if (count > limits.numbersPer120WordsMax) {
      problems.push(`Zahlenliste ab ${sceneId(start)}: ${count} Zahlen in 120 Wörtern; maximal ${limits.numbersPer120WordsMax}. Zahlen auf mehrere Erkenntnisse verteilen.`);
      break;
    }
  }

  // 4. Absicherungswörter.
  const hedges = fullText.match(HEDGE_PATTERN) ?? [];
  const hedgeRate = (hedges.length / total) * 100;
  if (hedgeRate > limits.hedgesPer100WordsMax) problems.push(`${hedges.length} Absicherungswörter (${hedgeRate.toFixed(2)} pro 100 Wörter; maximal ${limits.hedgesPer100WordsMax}): ${[...new Set(hedges.map((hedge) => hedge.toLowerCase()))].join(', ')}. Klar formulieren oder Einschränkung einmal begründen.`);

  // 5. Rhythmus statt Metronom.
  const twoSentenceShare = scenes.length ? scenes.filter((scene) => sentencesOf(scene.voiceText).length === 2).length / scenes.length : 0;
  if (twoSentenceShare > limits.twoSentenceSceneShareMax) problems.push(`Rhythmus wie ein Metronom: ${Math.round(twoSentenceShare * 100)} % der Szenen haben genau 2 Sätze (maximal ${Math.round(limits.twoSentenceSceneShareMax * 100)} %). Kurze Schlagsätze, längere Erklärsätze und Szenen mit 1 oder 3 Sätzen mischen.`);
  const sentenceLengths = sentencesOf(fullText).map((sentence) => wordsOf(sentence).length);
  const shortShare = sentenceLengths.length ? sentenceLengths.filter((length) => length <= 6).length / sentenceLengths.length : 0;
  if (shortShare < limits.shortSentenceShareMin) hints.push(`Nur ${Math.round(shortShare * 100)} % kurze Sätze (≤ 6 Wörter); kurze Schlagsätze erhöhen das Tempo.`);

  // 6. Offene Fragen / Ankündigungen in regelmäßigen Abständen.
  let lastMarker = 0;
  let longestGap = {words: 0, from: 0};
  sentencesOf(fullText).reduce((position, sentence) => {
    const length = wordsOf(sentence).length;
    if (sentence.includes('?') || TEASER_PATTERN.test(sentence)) {
      if (position - lastMarker > longestGap.words) longestGap = {words: position - lastMarker, from: lastMarker};
      lastMarker = position + length;
    }
    return position + length;
  }, 0);
  if (total - lastMarker > longestGap.words) longestGap = {words: total - lastMarker, from: lastMarker};
  if (longestGap.words > limits.curiosityGapWordsMax) problems.push(`Ab ${sceneId(longestGap.from)} ${longestGap.words} Wörter (~${seconds(longestGap.words)} s) ohne Frage oder Ankündigung; spätestens alle ${limits.curiosityGapWordsMax} Wörter (~${seconds(limits.curiosityGapWordsMax)} s) eine offene Frage stellen („Gleich sehen wir, warum …“).`);

  // 7. Bildtakt pro Szene (Hinweis): lange Szenen teilen, statt eine feste Bildzahl vorzugeben.
  const sceneSeconds = scenes.map((scene) => ({id: scene.id, seconds: wordsOf(scene.voiceText).length / limits.wordsPerSecond}));
  const slow = sceneSeconds.filter((scene) => scene.seconds > limits.sceneSecondsReview);
  if (slow.length) hints.push(`${slow.length} Szene(n) länger als ~${limits.sceneSecondsReview} s (${slow.slice(0, 5).map((scene) => `${scene.id} ~${Math.round(scene.seconds)} s`).join(', ')}${slow.length > 5 ? ' …' : ''}): prüfen, ob eine neue sichtbare Aussage ein eigenes Bild verdient (npm run science:scenes).`);

  // 8. Titel mit Zahl, Geschichte oder Paradox (Hinweis).
  if (/^\s*(warum|wie|was|wieso|weshalb)\b/i.test(title) && countNumbers(title) === 0) hints.push(`Titel „${title}“ ist eine reine Lexikonfrage ohne Zahl oder Geschichte. Solche Titel lagen in der Konkurrenzsuche bei 66–308 Aufrufen; npm run science:title-check ausführen.`);

  return {
    problems,
    hints,
    metrics: {words: total, concreteNumbers: numbers, hedges: hedges.length, hedgesPer100Words: Number(hedgeRate.toFixed(2)), twoSentenceSceneShare: Number(twoSentenceShare.toFixed(2)), shortSentenceShare: Number(shortShare.toFixed(2)), longestCuriosityGapWords: longestGap.words, scenes: scenes.length, sceneSecondsMedian: Number((sceneSeconds.map((scene) => scene.seconds).sort((a, b) => a - b)[Math.floor(sceneSeconds.length / 2)] ?? 0).toFixed(1)), scenesOverReview: slow.length},
  };
};
