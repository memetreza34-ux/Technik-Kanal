// Titel-Check gegen die echte YouTube-Konkurrenz (qualitaet-v2).
//
// Beobachtung 18.10.2026: Für „Wie kommt der Strom in die Steckdose“ besetzen Die Maus,
// simpleclub, Woozle Goozle und E.ON die ersten Plätze (138.000–318.000 Aufrufe);
// Wissonaut stand mit wortgleichem Titel bei 106 Aufrufen. Für „Warum schwimmt ein Schiff
// aus Stahl“ lagen reine Physik-Erklärer bei 66–308 Aufrufen, Story-Videos bei 10.000–40.000.

export const STRONG_CHANNELS = ['die maus', 'woozle goozle', 'simpleclub', 'physik - simpleclub', 'terra x', 'terra x nature', 'terra x lesch & co', 'kurzgesagt', 'dinge erklärt – kurzgesagt', 'lehrerschmidt', 'mrwissen2go', 'breaking lab', 'doktor whatson', 'quarks', 'e.on energie deutschland', 'galileo', 'planet schule'];
export const STRONG_VIEWS = 100000;
const STOP_WORDS = new Set(['der', 'die', 'das', 'ein', 'eine', 'einen', 'und', 'oder', 'in', 'im', 'ins', 'aus', 'zu', 'zum', 'zur', 'von', 'vom', 'mit', 'nicht', 'wie', 'warum', 'was', 'wieso', 'weshalb', 'ist', 'sind', 'eigentlich', 'deine', 'dein', 'unser', 'unsere', 'so', 'es', 'sich', 'kommt', 'den', 'dem', 'des', 'erklärt', 'einfach', 'shorts']);

export const contentWords = (text) => new Set(String(text ?? '')
  .toLocaleLowerCase('de-DE')
  .replace(/[^\p{L}\d\s-]/gu, ' ')
  .split(/\s+/)
  .map((word) => word.replace(/^-+|-+$/g, ''))
  .filter((word) => word.length >= 3 && !STOP_WORDS.has(word)));

export const titleSimilarity = (a, b) => {
  const left = contentWords(a);
  const right = contentWords(b);
  if (!left.size || !right.size) return 0;
  // Wortstämme grob vergleichen (Schiff/Schiffe, schwimmt/schwimmen, Steckdose/Steckdosen).
  const sameStem = (a, b) => {
    if (a === b) return true;
    let prefix = 0;
    while (prefix < Math.min(a.length, b.length) && a[prefix] === b[prefix]) prefix += 1;
    return prefix >= 4 && prefix >= 0.7 * Math.min(a.length, b.length);
  };
  const shared = [...left].filter((word) => [...right].some((other) => sameStem(word, other))).length;
  return shared / left.size;
};

export const parseViewCount = (text) => {
  const value = String(text ?? '').toLocaleLowerCase('de-DE');
  const match = value.match(/([\d.,]+)\s*(mio|million|tsd|k)?/);
  if (!match) return null;
  const number = Number(match[1].replace(/\./g, '').replace(',', '.'));
  if (!Number.isFinite(number)) return null;
  if (match[2] && /mio|million/.test(match[2])) return Math.round(number * 1_000_000);
  if (match[2] && /tsd|k/.test(match[2])) return Math.round(number * 1000);
  return Math.round(number);
};

export const parseYouTubeSearchHtml = (html) => {
  const match = String(html ?? '').match(/var ytInitialData = (\{.*?\});<\/script>/s);
  if (!match) return [];
  const data = JSON.parse(match[1]);
  const results = [];
  const walk = (node) => {
    if (Array.isArray(node)) { node.forEach(walk); return; }
    if (!node || typeof node !== 'object') return;
    if (node.videoRenderer) {
      const video = node.videoRenderer;
      const runs = (value) => (value?.runs ?? []).map((run) => run.text).join('');
      const viewsText = video.viewCountText?.simpleText ?? runs(video.viewCountText);
      results.push({
        title: runs(video.title),
        channel: runs(video.ownerText) || runs(video.longBylineText),
        views: parseViewCount(viewsText),
        viewsText,
        length: video.lengthText?.simpleText ?? null,
        published: video.publishedTimeText?.simpleText ?? null,
        videoId: video.videoId ?? null,
      });
    }
    Object.values(node).forEach(walk);
  };
  walk(data);
  return results.filter((item) => item.title);
};

export const assessTitle = ({title, results, top = 15}) => {
  const ranked = results.slice(0, top).map((item, index) => ({...item, rank: index + 1, similarity: Number(titleSimilarity(title, item.title).toFixed(2))}));
  const similar = ranked.filter((item) => item.similarity >= 0.5);
  const isStrong = (item) => (item.views ?? 0) >= STRONG_VIEWS || STRONG_CHANNELS.includes(String(item.channel ?? '').toLocaleLowerCase('de-DE'));
  const strongCompetitors = similar.filter(isStrong);
  const verdict = similar.length >= 3 && strongCompetitors.length >= 1 ? 'besetzt' : similar.length >= 3 ? 'umkämpft' : 'offen';
  const best = [...ranked].sort((a, b) => (b.views ?? 0) - (a.views ?? 0)).slice(0, 5);
  return {verdict, similarCount: similar.length, strongCompetitors, topByViews: best, results: ranked};
};

export const titleSuggestions = ({title, hookAnchor}) => {
  const anchor = String(hookAnchor?.text ?? '').trim();
  const nouns = String(title ?? '').split(/\s+/).slice(1).map((word) => word.replace(/[^\p{L}-]/gu, '')).filter((word) => /^\p{Lu}/u.test(word));
  const topic = nouns.length ? nouns.join(' und ') : '[Thema]';
  return [
    {formula: 'Zahl + Widerspruch', example: `${anchor || '[belegte Zahl + Einheit, z. B. „über 200.000 Tonnen Ladung“]'} – und trotzdem …`},
    {formula: 'Konkretes Ereignis', example: `[Bekanntes Ereignis oder Ort]: Was ${topic} damit zu tun hat`},
    {formula: 'Irrtum aufdecken', example: `Das glauben fast alle falsch über ${topic}`},
    // Konkurrenzanalyse 23.10.2026: „Das echte U-Boot aus «Das Boot» – 5 Dinge, die der Film nicht erzählt“
    // holte 70.805 Aufrufe bei 518 Abos; das Video desselben Kanals ohne Bezug 4.430.
    {formula: 'Bekannter Bezug', example: `[Film, Marke oder berühmtes Objekt]: Was über ${topic} kaum jemand weiß`},
    {formula: 'Listen-Versprechen', example: `5 Dinge über ${topic}, die dir niemand erklärt`},
  ];
};
