import {spawnSync} from 'node:child_process';
import {SECTION_WORDS} from './science-flow-prompt.mjs';

// OCR-Prüfung der fertigen Szenenbilder vor dem Rendern.
// Fängt genau die Fehler ab, die bisher im fertigen Video landeten:
// Szenen-Metadaten („27 — MECHANISM“, „36 • DEEPENING“) und nicht verlangte
// große Überschriften („WOHER KOMMT STROM?“).

export const PRODUCTION_WORDS = ['szene', 'scene', 'beat', 'bildschritt', 'bild', 'output', 'prompt', 'motif', 'thumbnail', 'final'];
const METADATA_WORDS = new Set([...SECTION_WORDS, ...PRODUCTION_WORDS]);

export const OCR_LIMITS = {
  minimumConfidence: 80,
  metadataMinimumConfidence: 60,
  largeTextHeightRatio: 0.04,
  textFreeWordConfidence: 85,
  textFreeWordMinimumLetters: 4,
};

export const foldText = (value) => String(value ?? '')
  .toLocaleLowerCase('de-DE')
  .replace(/ß/g, 'ss')
  .normalize('NFKD')
  .replace(/[̀-ͯ]/g, '');

export const cleanToken = (value) => foldText(value).replace(/^[^a-z0-9]+|[^a-z0-9]+$/g, '');
const letters = (token) => token.replace(/[^a-z]/g, '');
// Echte Wörter enthalten fast immer einen Vokal; OCR-Rauschen aus Texturen („RSS“, „LN“, „ZZ“) meist nicht.
const looksLikeWord = (token) => letters(token).length >= 3 && /[aeiouy]/.test(token);

export const parseTesseractTsv = (tsv) => {
  const rows = String(tsv ?? '').split(/\r?\n/);
  const header = (rows.shift() ?? '').split('\t');
  const index = Object.fromEntries(header.map((name, position) => [name, position]));
  const words = [];
  for (const row of rows) {
    const cells = row.split('\t');
    if (Number(cells[index.level]) !== 5) continue;
    const text = String(cells[index.text] ?? '').trim();
    if (!text) continue;
    words.push({
      text,
      conf: Number(cells[index.conf]),
      left: Number(cells[index.left]),
      top: Number(cells[index.top]),
      width: Number(cells[index.width]),
      height: Number(cells[index.height]),
      line: `${cells[index.block_num]}-${cells[index.par_num]}-${cells[index.line_num]}`,
    });
  }
  return words;
};

export const tesseractAvailable = () => spawnSync('tesseract', ['--version'], {encoding: 'utf8'}).status === 0;

export const tesseractLanguages = () => {
  const result = spawnSync('tesseract', ['--list-langs'], {encoding: 'utf8'});
  if (result.status !== 0) return [];
  return `${result.stdout}\n${result.stderr}`.split(/\r?\n/).map((line) => line.trim()).filter((line) => /^[a-z_]{3,}$/.test(line));
};

export const preferredOcrLanguage = (available = tesseractLanguages()) => {
  const wanted = ['deu', 'eng'].filter((lang) => available.includes(lang));
  return wanted.length ? wanted.join('+') : 'eng';
};

// Zwei Durchläufe: psm 3 findet Überschriften zuverlässiger, psm 11 verstreute kleine Labels.
export const ocrImageWords = (file, {lang = preferredOcrLanguage()} = {}) => {
  const merged = [];
  for (const psm of ['3', '11']) {
    const result = spawnSync('tesseract', [file, 'stdout', '-l', lang, '--psm', psm, 'tsv'], {encoding: 'utf8', maxBuffer: 32 * 1024 * 1024});
    if (result.status !== 0) throw new Error(`tesseract konnte ${file} nicht lesen: ${result.stderr || result.error?.message || 'unbekannter Fehler'}`);
    for (const word of parseTesseractTsv(result.stdout)) {
      const token = cleanToken(word.text);
      const twin = merged.find((other) => cleanToken(other.text) === token && Math.abs(other.left - word.left) < 24 && Math.abs(other.top - word.top) < 24);
      if (!twin) merged.push(word);
      else if (word.conf > twin.conf) Object.assign(twin, word);
    }
  }
  return merged;
};

const allowedTokens = (labels) => new Set(labels.flatMap((label) => String(label).split(/[\s/–—-]+/)).map(cleanToken).filter(Boolean));

export const analyzeSceneText = ({words, imageHeight, allowedLabels = [], sceneIds = [], sectionNames = [], limits = OCR_LIMITS}) => {
  const errors = [];
  const warnings = [];
  const allowed = allowedTokens(allowedLabels);
  const idTokens = new Set(sceneIds.map(cleanToken).filter(Boolean));
  const sections = new Set(sectionNames.map(cleanToken).filter(Boolean));
  const detected = [];
  const unrequestedSmall = [];
  const largeByLine = new Map();

  for (const word of words) {
    const token = cleanToken(word.text);
    if (!token) continue;
    if (word.conf >= limits.metadataMinimumConfidence) detected.push(word.text);
    const isMetadata = METADATA_WORDS.has(token) || sections.has(token) || idTokens.has(token) || /^\d{1,2}-[a-z]{3,}$/.test(token);
    if (isMetadata && !allowed.has(token) && word.conf >= limits.metadataMinimumConfidence) {
      errors.push(`Produktions-Metadaten im Bild: „${word.text}“`);
      continue;
    }
    if (word.conf < limits.minimumConfidence || !looksLikeWord(token) || allowed.has(token)) continue;
    if (word.height >= imageHeight * limits.largeTextHeightRatio) largeByLine.set(word.line, [...(largeByLine.get(word.line) ?? []), word.text]);
    else unrequestedSmall.push(word);
  }
  for (const texts of largeByLine.values()) errors.push(`Große, nicht verlangte Schrift im Bild: „${texts.join(' ')}“`);

  const confidentSmall = unrequestedSmall.filter((word) => word.conf >= limits.textFreeWordConfidence && letters(cleanToken(word.text)).length >= limits.textFreeWordMinimumLetters);
  if (!allowedLabels.length && confidentSmall.length >= 2) errors.push(`Bild soll textfrei sein, OCR findet Text: ${confidentSmall.map((word) => `„${word.text}“`).join(', ')}`);
  else if (unrequestedSmall.length) warnings.push(`Nicht verlangter kleiner Text (OCR, bitte prüfen): ${unrequestedSmall.map((word) => `„${word.text}“`).join(', ')}`);

  const found = new Set(words.filter((word) => word.conf >= limits.metadataMinimumConfidence).map((word) => cleanToken(word.text)));
  for (const label of allowedLabels) {
    const parts = String(label).split(/\s+/).map(cleanToken).filter((part) => letters(part).length >= 3);
    if (parts.length && !parts.some((part) => found.has(part))) warnings.push(`Verlangtes Label „${label}“ von OCR nicht gefunden – Schreibweise im Bild prüfen.`);
  }

  return {errors: [...new Set(errors)], warnings: [...new Set(warnings)], detected};
};
