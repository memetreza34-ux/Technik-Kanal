#!/usr/bin/env node
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {analyzeScriptEngagement, countNumbers, QUALITY_RULES_VERSION} from './lib/science-script-engagement.mjs';
import {assessTitle, parseViewCount, parseYouTubeSearchHtml, titleSimilarity} from './lib/science-title-check.mjs';
import {analyzeSceneImageRules} from './lib/science-scene-image-rules.mjs';
import {findFlowPromptLeaks, flowSceneBlock, flowSceneBrief, flowSceneLabels} from './lib/science-flow-prompt.mjs';
import {createElectricalScenePlanTemplate} from './lib/create-electrical-scene-plan-template.mjs';

const has = (list, pattern) => list.some((item) => pattern.test(item));

// ---------- 1. Spannung im Skript ----------
const goodScenes = [
  'Dieses Schiff wiegt 220.000 Tonnen. Ein Nagel geht sofort unter. Warum schwimmt es trotzdem?',
  'Die Antwort steckt im Wasser.',
  'Wasser drückt von unten gegen den Rumpf. Je tiefer der Rumpf eintaucht, desto stärker drückt es. Das nennt man Auftrieb.',
  'Gleich sehen wir, warum die Titanic trotzdem sank.',
  'Ein Würfel aus Stahl verdrängt nur wenig Wasser. Er sinkt.',
  'Der Rumpf dagegen ist fast leer. Er verdrängt riesige Mengen Wasser, rund 300.000 Kubikmeter bei den größten Frachtern. Das reicht.',
].map((voiceText, index) => ({id: `${String(index + 1).padStart(2, '0')}-szene`, voiceText}));
const good = analyzeScriptEngagement({scenes: goodScenes, hookAnchor: {type: 'zahl', text: '220.000 Tonnen', firstImage: 'steel nail sinking'}, title: '220.000 Tonnen Stahl – und es schwimmt'});
assert.deepEqual(good.problems, [], good.problems.join('\n'));
assert.equal(countNumbers('rund 300.000 Kubikmeter, zweihundertdreißig Volt und 1912'), 3);

const flat = analyzeScriptEngagement({scenes: Array.from({length: 10}, (_, index) => ({id: `s${index}`, voiceText: 'Das ist normalerweise so. Häufig passiert das beispielsweise im Alltag und gewöhnlich bleibt es so.'})), title: 'Warum ist das so?'});
assert.ok(has(flat.problems, /Hook braucht einen konkreten Anker/));
assert.ok(has(flat.problems, /konkrete Zahl/));
assert.ok(has(flat.problems, /Absicherungswörter/));
assert.ok(has(flat.problems, /Metronom/));
assert.ok(has(flat.hints, /Lexikonfrage/));

const list = analyzeScriptEngagement({scenes: [{id: 'a', voiceText: 'Hier liegen 380.000 Volt an. Dann 220.000 Volt. Danach 110.000 Volt. Später 10.000 Volt. Am Ende 400 Volt?'}], hookAnchor: {type: 'zahl', text: '380.000 Volt', firstImage: 'pylon'}});
assert.ok(has(list.problems, /Zahlenliste/));

const silent = analyzeScriptEngagement({scenes: [{id: 'a', voiceText: `${'Das Netz verteilt Energie zuverlässig im Land. '.repeat(40)}Und warum?`}], hookAnchor: {type: 'paradox', text: 'Das Netz', firstImage: 'grid'}});
assert.ok(has(silent.problems, /ohne Frage oder Ankündigung/));

// Echte Videos: genau die Schwächen aus der Analyse werden gefunden.
const videoRoot = ['YouTube', 'reels'].map((folder) => `channels/science/${folder}`).find((dir) => fs.existsSync(dir));
const load = (relative) => JSON.parse(fs.readFileSync(path.join(videoRoot, relative), 'utf8'));
if (videoRoot && fs.existsSync(path.join(videoRoot, '2026-10-12_bis_2026-10-18/01_Warum-sinkt-ein-riesiges-Stahlschiff-nicht/06-projektdateien/scene-plan.json'))) {
  const ship = load('2026-10-12_bis_2026-10-18/01_Warum-sinkt-ein-riesiges-Stahlschiff-nicht/06-projektdateien/scene-plan.json');
  const shipResult = analyzeScriptEngagement({scenes: ship.scenes, hookAnchor: ship.hookAnchor, title: ship.title});
  assert.equal(shipResult.metrics.concreteNumbers, 0);
  assert.ok(has(shipResult.problems, /Metronom/));
  const socket = load('2026-10-05_bis_2026-10-11/01_Wie-kommt-Strom-in-deine-Steckdose/06-projektdateien/scene-plan.json');
  const socketResult = analyzeScriptEngagement({scenes: socket.scenes, hookAnchor: socket.hookAnchor, title: socket.title});
  assert.ok(has(socketResult.problems, /Absicherungswörter/));
  assert.ok(has(socketResult.problems, /ohne Frage oder Ankündigung/));
}

// ---------- 2. Titel-Check ----------
assert.equal(parseViewCount('144.905 Aufrufe'), 144905);
assert.equal(parseViewCount('1,7 Mio. Aufrufe'), 1700000);
assert.ok(titleSimilarity('Wie kommt Strom in deine Steckdose?', 'Wie kommt der Strom in die Steckdose? | E.ON') >= 0.99);
assert.ok(titleSimilarity('Warum sinkt ein riesiges Stahlschiff nicht?', 'Warum sinken riesige Stahlschiffe nicht?') >= 0.99);
assert.ok(titleSimilarity('Wie kommt Strom in deine Steckdose?', 'Wie funktioniert ein Kühlschrank?') === 0);
const video = (title, channel, views) => ({videoRenderer: {videoId: title.slice(0, 5), title: {runs: [{text: title}]}, ownerText: {runs: [{text: channel}]}, viewCountText: {simpleText: `${views} Aufrufe`}}});
const html = `<script>var ytInitialData = ${JSON.stringify({contents: [video('Wie kommt der Strom in die Steckdose?', 'Woozle Goozle', '144.905'), video('Wie kommt der Strom in die Steckdose? | E.ON', 'E.ON Energie Deutschland', '138.294'), video('Wie kommt eigentlich der Strom in die Steckdose?', 'enviaM-Gruppe', '11.980'), video('Wie funktioniert ein Windrad?', 'Kanal X', '500')]})};</script>`;
const parsed = parseYouTubeSearchHtml(html);
assert.equal(parsed.length, 4);
assert.equal(parsed[0].views, 144905);
const verdict = assessTitle({title: 'Wie kommt Strom in deine Steckdose?', results: parsed});
assert.equal(verdict.verdict, 'besetzt');
assert.equal(verdict.strongCompetitors[0].channel, 'Woozle Goozle');
assert.equal(assessTitle({title: '220.000 Tonnen Stahl – und es schwimmt', results: parsed}).verdict, 'offen');

// ---------- 3. Bild passt zur Szene ----------
const prompt = (brief, labels = 'none (zero visible text)') => `EXACT VISUAL BRIEF — ${brief}\nRequest visible German labels: ${labels}. If no labels are requested, the image contains no text.`;
const imageScenes = ['01-hook', '02-a', '03-b', '04-c', '05-d', '06-e', '07-f', '08-g', '09-h', '10-i'].map((id) => ({id}));
const imagePlan = {qualityRulesVersion: QUALITY_RULES_VERSION, hookAnchor: {type: 'paradox', text: 'Stahlklotz', firstImage: 'steel block sinking next to a floating ship'}, scenes: imageScenes};
const settings = ['harbor quay', 'school lab bench', 'open sea', 'inside a ship hull', 'harbor quay', 'school lab bench', 'open sea', 'inside a ship hull', 'harbor quay', 'shipyard dry dock'];
const goodFlow = {scenes: imageScenes.map((scene, index) => ({id: scene.id, visualType: index === 2 ? 'diagram' : 'environment', setting: settings[index]}))};
const goodPrompts = Object.fromEntries(imageScenes.map((scene, index) => [scene.id, index === 0 ? prompt('A steel block sinking next to a floating ship in a harbor basin.') : index === 2 ? prompt('Hull cross-section with upward and downward force arrows.', '"Auftrieb" and "Gewicht"') : prompt(`Distinct scene ${index}.`)]));
assert.deepEqual(analyzeSceneImageRules({plan: imagePlan, flowPlan: goodFlow, scenePrompts: goodPrompts}).problems, []);

const meadow = {scenes: imageScenes.map((scene, index) => ({id: scene.id, visualType: 'environment', setting: index < 5 ? 'rolling hills with pylon' : settings[index]}))};
const meadowResult = analyzeSceneImageRules({plan: imagePlan, flowPlan: meadow, scenePrompts: goodPrompts}).problems;
assert.ok(has(meadowResult, /4-mal hintereinander/));
assert.ok(has(meadowResult, /in 5 von 10 Bildern/));

const unlabeled = analyzeSceneImageRules({plan: imagePlan, flowPlan: goodFlow, scenePrompts: {...goodPrompts, [imageScenes[2].id]: prompt('Hull cross-section with upward and downward force arrows.')}}).problems;
assert.ok(has(unlabeled, /03-b: diagram zeigt Pfeile/));

const wrongStart = analyzeSceneImageRules({plan: imagePlan, flowPlan: goodFlow, scenePrompts: {...goodPrompts, '01-hook': prompt('A calm container ship at sea.')}}).problems;
assert.ok(has(wrongStart, /Bild 1 zeigt nicht den Hook/));

const noSetting = analyzeSceneImageRules({plan: imagePlan, flowPlan: {scenes: imageScenes.map((scene) => ({id: scene.id, visualType: 'environment', setting: 'UNGEPLANT'}))}, scenePrompts: goodPrompts}).problems;
assert.ok(has(noSetting, /setting fehlt/));

assert.match(flowSceneBlock({position: 3, total: 10, scene: imageScenes[2], entry: goodFlow.scenes[2], promptText: goodPrompts['03-b']}), /Setting: open sea/);

// ---------- 4. Die Video-Automatik-Anleitung erzeugt Prompts, die alle Prüfungen verstehen ----------
const playbook = fs.readFileSync('channels/science/gehirn/VIDEO-AUTOMATIK.md', 'utf8');
const template = playbook.match(/## Schritt 7[\s\S]*?```text\n([\s\S]*?)```/)?.[1];
assert.ok(template, 'Prompt-Vorlage in VIDEO-AUTOMATIK.md (Schritt 7) fehlt');
assert.match(flowSceneBrief(template), /^Flat-bottomed model hull/, 'Bildauftrag wird aus der Vorlage gelesen');
assert.deepEqual(flowSceneLabels(template), ['Auftrieb', 'Gewicht'], 'Labels werden aus der Vorlage gelesen');
for (const [pattern, label] of [[/16:9/, '16:9'], [/German/, 'Deutsch-only'], [/One main idea/i, 'eine Hauptaussage'], [/No large headline/i, 'keine große Überschrift'], [/faceless visible heads/i, 'Gesichter-Regel'], [/Technical Editorial Explainer 2\.5D/, 'Bildwelt']]) assert.match(template, pattern, `Vorlage erfüllt Creative-QA nicht: ${label}`);
assert.deepEqual(findFlowPromptLeaks(`STYLE LOCK — x\nDENSITY LOCK — y\n${flowSceneBrief(template)}`, {scenes: [{id: '14-foundation', voiceText: 'Der Auftrieb ist genauso groß wie das Gewicht.'}]}), [], 'Vorlage enthält keine Metadaten');
for (const command of ['science:new', 'science:title-check', 'science:script-qa', 'science:creative-qa', 'science:learn -- start', 'science:learn -- review', 'science:phase1']) assert.ok(playbook.includes(command), `Anleitung nennt ${command} nicht`);
assert.ok(fs.readFileSync('.claude/skills/wissonaut-video/SKILL.md', 'utf8').includes('VIDEO-AUTOMATIK.md'), 'Claude-Skill verweist nicht auf die Anleitung');
assert.ok(fs.readFileSync('AGENTS.md', 'utf8').includes('VIDEO-AUTOMATIK.md'), 'AGENTS.md verweist nicht auf die Anleitung');

// ---------- 5. Neue Videos sind automatisch qualitaet-v2 ----------
const scaffold = createElectricalScenePlanTemplate({slug: 'neu'});
assert.equal(scaffold.qualityRulesVersion, QUALITY_RULES_VERSION);
assert.deepEqual(Object.keys(scaffold.hookAnchor), ['type', 'text', 'firstImage']);

console.log('✓ qualitaet-v2: Spannung (Hook-Anker, Zahlen, Füllwörter, Rhythmus, offene Fragen), Titel-Check, Bild-zur-Szene-Regeln und Video-Automatik-Vorlage geprüft – inkl. echter Schiff- und Steckdosen-Skripte.');
