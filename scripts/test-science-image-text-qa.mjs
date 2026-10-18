#!/usr/bin/env node
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import sharp from 'sharp';
import {analyzeSceneText,parseTesseractTsv,tesseractAvailable} from './lib/science-image-text.mjs';

const word = (text, {conf = 95, height = 20, line = '1-1-1', left = 10, top = 10} = {}) => ({text, conf, height, line, left, top, width: text.length * 12});
const ids = ['27-mechanism', '36-deepening', '01-hook'];
const sections = ['hook', 'mechanism', 'deepening'];

// 1. Genau die Fehler aus dem Stahlschiff-Video werden blockiert.
const leak = analyzeSceneText({words: [word('27'), word('—'), word('MECHANISM'), word('LEER', {height: 140, line: '2-1-1'}), word('BELADEN', {height: 140, line: '2-1-1'})], imageHeight: 1536, allowedLabels: ['leer', 'beladen'], sceneIds: ids, sectionNames: sections});
assert.ok(leak.errors.some((error) => error.includes('MECHANISM')), 'Abschnittsname im Bild muss blockieren');
assert.ok(!leak.errors.some((error) => /LEER|BELADEN/.test(error)), 'verlangte Labels dürfen nicht blockieren');

const idLeak = analyzeSceneText({words: [word('28-mechanism')], imageHeight: 1536, sceneIds: ids, sectionNames: sections});
assert.ok(idLeak.errors.some((error) => error.includes('28-mechanism')), 'Szenen-ID im Bild muss blockieren');

// 2. Eingebrannte Überschrift aus dem Steckdosen-Video wird als eine Zeile gemeldet.
const headline = analyzeSceneText({words: ['WOHER', 'KOMMT', 'STROM?'].map((text) => word(text, {height: 77, line: '1-1-1'})), imageHeight: 1080});
assert.equal(headline.errors.length, 1);
assert.match(headline.errors[0], /WOHER KOMMT STROM\?/);

// 3. Saubere Bilder und OCR-Rauschen erzeugen keinen Fehler.
const clean = analyzeSceneText({words: [word('Auftrieb', {height: 22})], imageHeight: 1080, allowedLabels: ['Auftrieb']});
assert.deepEqual(clean.errors, []);
const noise = analyzeSceneText({words: [word('RSS', {conf: 88, height: 120}), word('LN', {conf: 90, height: 90}), word('Wi:', {conf: 51, height: 107})], imageHeight: 1536});
assert.deepEqual(noise.errors, [], 'Textur-Rauschen ohne Vokal darf nicht blockieren');

// 4. Kleiner, nicht verlangter Text ist nur ein Hinweis – außer ein textfreies Bild enthält eindeutig Wörter.
const smallHint = analyzeSceneText({words: [word('Speicher', {height: 30})], imageHeight: 1080, allowedLabels: ['Wechselstrom']});
assert.deepEqual(smallHint.errors, []);
assert.ok(smallHint.warnings.some((warning) => warning.includes('Speicher')));
const notTextFree = analyzeSceneText({words: [word('INDUSTRIE', {height: 30, conf: 92}), word('HAUSHALTE', {height: 30, conf: 91})], imageHeight: 1080});
assert.ok(notTextFree.errors.some((error) => error.includes('textfrei')));

// 5. Fehlendes Label wird als Hinweis gemeldet.
const missing = analyzeSceneText({words: [word('Fluss')], imageHeight: 1080, allowedLabels: ['Fluss', 'Meer']});
assert.ok(missing.warnings.some((warning) => warning.includes('Meer')));

// 6. TSV-Parser liest nur Wortzeilen.
const tsv = ['level\tpage_num\tblock_num\tpar_num\tline_num\tword_num\tleft\ttop\twidth\theight\tconf\ttext', '1\t1\t0\t0\t0\t0\t0\t0\t100\t100\t-1\t', '5\t1\t1\t1\t1\t1\t10\t12\t80\t20\t96.4\tMECHANISM'].join('\n');
assert.deepEqual(parseTesseractTsv(tsv).map(({text, conf, height, line}) => ({text, conf, height, line})), [{text: 'MECHANISM', conf: 96.4, height: 20, line: '1-1-1'}]);

// 7. Ende-zu-Ende mit echtem tesseract (lokal); in Umgebungen ohne tesseract übersprungen.
if (!tesseractAvailable()) {
  console.log('✓ OCR-Text-Gate: Regeln geprüft (tesseract nicht installiert, Ende-zu-Ende-Test übersprungen).');
  process.exit(0);
}

const root = fs.mkdtempSync(path.join(os.tmpdir(), 'science-ocr-test-'));
const svg = (body) => Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="1376" height="768"><rect width="1376" height="768" fill="#f3efe4"/><rect x="420" y="300" width="520" height="260" rx="18" fill="#4b6b85"/>${body}</svg>`);
const text = (x, y, size, value) => `<text x="${x}" y="${y}" font-family="Helvetica, Arial, sans-serif" font-size="${size}" fill="#333">${value}</text>`;
const scenes = [
  {id: '01-hook', section: 'hook', prompt: 'EXACT VISUAL BRIEF — A calm container ship.\nRequest visible German labels: none (zero visible text).', body: text(40, 52, 26, '01 — HOOK')},
  {id: '02-mechanism', section: 'mechanism', prompt: 'EXACT VISUAL BRIEF — A hull in water.\nRequest visible German labels: none (zero visible text).', body: text(250, 140, 72, 'WARUM SCHWIMMT ES?')},
  {id: '03-mechanism', section: 'mechanism', prompt: 'EXACT VISUAL BRIEF — Buoyancy arrow.\nRequest visible German labels: "Auftrieb".', body: text(560, 250, 34, 'Auftrieb')},
];
const project = path.join(root, 'video');
const writeImage = async (scene, body) => {
  const dir = path.join(project, '02-bilder/images', scene.id);
  fs.mkdirSync(dir, {recursive: true});
  await sharp(svg(body)).png().toFile(path.join(dir, `${scene.id}-final.png`));
};
try {
  fs.mkdirSync(path.join(project, '06-projektdateien'), {recursive: true});
  fs.mkdirSync(path.join(project, '02-bilder/prompts'), {recursive: true});
  fs.writeFileSync(path.join(project, '06-projektdateien/scene-plan.json'), JSON.stringify({slug: 'ocr-test', scenes: scenes.map(({id, section}) => ({id, section, voiceText: 'Test.', imageDir: `02-bilder/images/${id}`}))}));
  for (const scene of scenes) {
    fs.writeFileSync(path.join(project, '02-bilder/prompts', `${scene.id}.txt`), scene.prompt);
    await writeImage(scene, scene.body);
  }
  const gate = (...extra) => spawnSync(process.execPath, ['scripts/science-image-text-qa.mjs', project, ...extra], {cwd: process.cwd(), encoding: 'utf8'});
  const report = () => JSON.parse(fs.readFileSync(path.join(project, '06-projektdateien/image-text-qa-report.json'), 'utf8'));
  const byId = () => Object.fromEntries(report().scenes.map((scene) => [scene.id, scene]));

  let run = gate();
  assert.equal(run.status, 1, run.stdout + run.stderr);
  assert.ok(byId()['01-hook'].errors.some((error) => error.includes('HOOK')), JSON.stringify(byId()['01-hook']));
  assert.ok(byId()['02-mechanism'].errors.some((error) => error.includes('Große')), JSON.stringify(byId()['02-mechanism']));
  assert.deepEqual(byId()['03-mechanism'].errors, [], JSON.stringify(byId()['03-mechanism']));

  // Manuelle Freigabe gilt nur für genau diese Bilddatei.
  run = gate('--accept=02-mechanism');
  assert.equal(run.status, 1, 'Szene 01 blockiert weiterhin');
  await writeImage(scenes[0], '');
  run = gate();
  assert.equal(run.status, 0, run.stdout + run.stderr);
  assert.deepEqual(report().manuallyAccepted, ['02-mechanism']);
  await writeImage(scenes[1], text(250, 140, 72, 'WIE SCHWIMMT ES?'));
  run = gate();
  assert.equal(run.status, 1, 'ersetztes Bild muss erneut streng geprüft werden');
  console.log('✓ OCR-Text-Gate: Metadaten, Szenen-IDs, große Überschriften, Rauschen, Labels und bildgebundene Freigabe geprüft (inkl. echtem tesseract).');
} finally {
  fs.rmSync(root, {recursive: true, force: true});
}
