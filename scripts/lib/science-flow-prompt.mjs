// Gemeinsame Bausteine für den Google-Flow-Masterprompt (Version 2).
//
// Hintergrund: Im Stahlschiff-Video standen „27 — MECHANISM“ und „36 • DEEPENING“
// im fertigen Bild. Ursache war, dass jede Szene im Prompt mit ihrer Szenen-ID
// („27-mechanism — OUTPUT=IMAGE / …“) begann und der Stilblock 46-mal wiederholt
// wurde. Bildmodelle setzen Wörter um, die im Prompt stehen – auch wenn daneben
// steht, dass sie nicht erscheinen sollen. Version 2 gibt Google Flow deshalb pro
// Szene nur einen neutralen Bildauftrag ohne IDs, Abschnittsnamen oder Sprechtext.

export const FLOW_PROMPT_VERSION = 'flow-master-v2-ohne-szenen-ids';

export const STYLE_LOCK_HEADING = 'STYLE LOCK — Technical Editorial Explainer 2.5D';

export const STYLE_LOCK = `${STYLE_LOCK_HEADING}
Keep the exact same visual language across the entire video: clean modern 2D/2.5D vector-like technical editorial illustration, simplified but believable proportions, matte materials, clean edges, subtle gradients, soft controlled shadows, consistent line weight, moderate depth, adult professional educational design. Use warm off-white, graphite and muted industrial neutrals as the base family; use copper, blue, orange/red, green or yellow only as meaningful technical accents. Do not use photorealism, real-photo aesthetics, hyperrealistic environments, generic AI art, white textbook infographic layouts, Pixar/cartoon styling, sci-fi HUDs or neon-heavy effects. Scene type, perspective and environment may change, but rendering language, material simplification, line quality, typography and callout design must remain consistent. Visible text only in German and only when explicitly requested. Google Flow prompt instructions are written in English. This STYLE LOCK applies to every image below and overrides any older style wording.`;

export const DENSITY_LOCK_HEADING = 'DENSITY LOCK — MINIMUM NECESSARY INFORMATION';

export const DENSITY_LOCK = `${DENSITY_LOCK_HEADING}
Keep every scene visually sparse and immediately readable. One dominant explanatory idea only. In a normal scene prefer one main object and never exceed three important visual elements. Prefer zero or one short German label; never exceed two labels in a normal scene. Use at most two arrows and at most two panels. No large scene headline, no full-sentence text, no floating info boxes, no secondary mini-diagrams and no decorative technical clutter. Comparison/diagram/summary scenes may use at most four important visual elements and three short German labels, but still only one central message. Make the main idea legible in under two seconds and physically plausible.`;

// Wörter, die nur Produktionsmetadaten sind und nie im Bild stehen dürfen.
export const SECTION_WORDS = ['hook', 'context', 'foundation', 'mechanism', 'deepening', 'payoff'];

const PLACEHOLDER = /ungeplant|tbd|placeholder|platzhalter|ergänzen/i;

const collapse = (value) => String(value ?? '').replace(/\s+/g, ' ').trim();
const escapeRegExp = (value) => String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const unique = (values) => {
  const seen = new Set();
  const out = [];
  for (const value of values) {
    const text = collapse(value);
    const key = text.toLocaleLowerCase('de-DE');
    if (!text || seen.has(key)) continue;
    seen.add(key);
    out.push(text);
  }
  return out;
};

const quoted = (value) => [...String(value).matchAll(/["„“”']([^"„“”']{1,48})["“”']/g)].map((match) => match[1]);

// Liest die ausdrücklich angeforderten sichtbaren deutschen Labels einer Szene.
// Unterstützt das aktuelle Promptformat („Request visible German labels: …“)
// und das ältere Format („Visual design: … label 'Ortsnetzstation'“).
export const flowSceneLabels = (promptText, scene = {}) => {
  const text = String(promptText ?? '');
  const labels = [];
  const request = text.match(/Request visible German labels?:\s*([^\n]*?)(?:\.\s+If no labels|\.\s*(?:\n|$)|\n|$)/i);
  if (request && !/^\s*none\b/i.test(request[1])) labels.push(...quoted(request[1]));
  if (!request) {
    for (const match of text.matchAll(/\blabels?\s+((?:["„“'][^"„“”']{1,48}["“”'](?:\s*(?:,|and|und|&)\s*)?)+)/gi)) labels.push(...quoted(match[1]));
  }
  for (const callout of scene.visualRecipe?.callouts ?? []) labels.push(callout);
  for (const annotation of scene.imageAnnotations ?? []) labels.push(annotation?.text);
  if (scene.imageLabel) labels.push(scene.imageLabel);
  return unique(labels);
};

// Der reine Bildauftrag einer Szene – ohne Szenen-ID, Abschnitt, Dateiname oder Sprechtext.
// Er ist zugleich der Fingerabdruck, mit dem die Übergabe prüft, ob der Masterprompt aktuell ist.
export const flowSceneBrief = (promptText, scene = {}) => {
  const text = String(promptText ?? '');
  const exact = text.match(/EXACT VISUAL BRIEF\s*[—–-]\s*([^\n]+)/i);
  if (exact) return collapse(exact[1]);
  const design = text.match(/^Visual design:\s*([^\n]+)/im);
  if (design) return collapse(design[1]);
  const subject = collapse(scene.visualRecipe?.subject);
  if (subject && !PLACEHOLDER.test(subject)) return subject;
  // Altformat ohne erkennbaren Bildauftrag: ganzer Prompt als Fingerabdruck (alte Master enthalten ihn wörtlich).
  return text.trim();
};

export const flowFileNumber = (position, total) => String(position).padStart(Math.max(2, String(total).length), '0');

export const flowSceneBlock = ({position, total, scene, entry = {}, promptText}) => {
  const brief = flowSceneBrief(promptText, scene);
  const labels = flowSceneLabels(promptText, scene);
  const budget = entry.informationBudget ?? {};
  const presentation = collapse(entry.visualType);
  const textRule = labels.length
    ? `Visible German text: exactly ${labels.map((label) => `"${label}"`).join(' and ')} as ${labels.length === 1 ? 'one small supporting label' : 'small supporting labels'}, spelled exactly, nothing else.`
    : 'Visible text: none. The image contains no letters, words or numbers.';
  const lines = [
    `BILD ${position} VON ${total}`,
    `Bildauftrag: ${brief}`,
    presentation ? `Presentation: ${presentation}.` : null,
    textRule,
    `Budget: max ${budget.maxPrimaryObjects ?? 3} important elements, max ${budget.maxLabels ?? labels.length} labels, max ${budget.maxPanels ?? 1} panels, max ${budget.maxArrows ?? 2} arrows, no headline.`,
    `Speichern als ${flowFileNumber(position, total)}.png (Dateiname und Nummer niemals ins Bild schreiben).`,
  ];
  return lines.filter(Boolean).join('\n');
};

// Sucht Dinge im fertigen Masterprompt, die erfahrungsgemäß als Bildtext landen.
export const findFlowPromptLeaks = (masterText, plan = {}) => {
  const text = String(masterText ?? '');
  const issues = [];
  for (const scene of plan.scenes ?? []) {
    const id = String(scene.id ?? '').trim();
    if (id && new RegExp(`(^|[^a-z0-9-])${escapeRegExp(id)}(?![a-z0-9])`, 'i').test(text)) issues.push(`Szenen-ID „${id}“ steht im Flow-Prompt.`);
    const voice = collapse(scene.voiceText);
    if (voice.length >= 30 && text.includes(voice.slice(0, 60))) issues.push(`${id}: Sprechtext steht wörtlich im Flow-Prompt.`);
  }
  if (/OUTPUT\s*=\s*IMAGE|VISUAL\s*=|MOTIF\s*=|Scene ID\b/i.test(text)) issues.push('Technische Kopfzeilen (OUTPUT=, VISUAL=, MOTIF=, Scene ID) stehen im Flow-Prompt.');
  const styleLocks = text.split(STYLE_LOCK_HEADING).length - 1;
  if (styleLocks !== 1) issues.push(`Stilblock steht ${styleLocks}-mal im Flow-Prompt; erwartet genau einmal.`);
  const densityLocks = text.split(DENSITY_LOCK_HEADING).length - 1;
  if (densityLocks !== 1) issues.push(`Density-Block steht ${densityLocks}-mal im Flow-Prompt; erwartet genau einmal.`);
  return issues;
};
