#!/usr/bin/env node
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {buildGoogleFlowMasterPrompt} from './build-google-flow-master-prompt.mjs';
import {loadElectricalConfig} from './lib/load-electrical-config.mjs';
import {DENSITY_LOCK_HEADING,FLOW_PROMPT_VERSION,STYLE_LOCK_HEADING,findFlowPromptLeaks,flowSceneBrief,flowSceneLabels} from './lib/science-flow-prompt.mjs';
import {applyMasterVisibleTextLock} from './science-visible-text-lock.mjs';
import {buildSciencePhase1Handoff} from './lib/science-phase1-handoff.mjs';
import {buildScienceSimpleHandoff} from './lib/science-simple-handoff.mjs';

const config = loadElectricalConfig('youtube-6to7min-v1');
const count = (text, needle) => text.split(needle).length - 1;
const types = ['environment','cutaway','diagram','macro','comparison','process','top-down','before-after','environment','cutaway'];
const sections = ['hook','context','context','foundation','foundation','mechanism','mechanism','deepening','deepening','payoff'];
const scenes = types.map((_, index) => ({
  id: `${String(index + 1).padStart(2,'0')}-${sections[index]}`,
  section: sections[index],
  voiceText: `Das ist der gesprochene deutsche Satz Nummer ${index + 1}, der niemals im Bildprompt stehen darf.`,
  imageDir: `02-bilder/images/${String(index + 1).padStart(2,'0')}-${sections[index]}`,
}));
const labelsFor = (index) => index === 5 ? '"leer" and "beladen"' : 'none (zero visible text)';
// Einzelprompts im echten internen Format – inklusive der Metadaten, die früher in Flow landeten.
const scenePrompts = Object.fromEntries(scenes.map((scene, index) => [scene.id, [
  `ONE STATIC IMAGE ONLY, 1920x1080, landscape 16:9. This is the precise spoken beat to explain: "${scene.voiceText}"`,
  '',
  `EXACT VISUAL BRIEF — Distinct technical illustration number ${index + 1} showing one clear physical idea about ships and water.`,
  `Primary explanatory motif: motif-${index}. Visual presentation type: ${types[index]}. Request visible German labels: ${labelsFor(index)}. If no labels are requested, the image contains no text.`,
  '',
  'STYLE LOCK — Technical Editorial Explainer 2.5D: old scene-level style text.',
  '',
  `OUTPUT: precisely one static image. Scene ID ${scene.id} and final filename are production metadata ONLY. Store the accepted asset as ${scene.id}-final.`,
].join('\n')]));
const plan = {slug: 'flow-test', title: 'Warum schwimmt ein Testschiff?', productionProfile: 'youtube-6to7min-v1', width: 1920, height: 1080, scenes};
const steps = [0,1,2,3,4].map((step) => ({step: step + 1, sceneIds: scenes.slice(step * 2, step * 2 + 2).map((scene) => scene.id)}));
const flowPlan = {
  imageOnly: true, informationBudgetLocked: true, imageProductionSteps: 5, pauseAfterEachImageStep: false, continueAutomaticallyBetweenImageSteps: true,
  deleteUnselectedThumbnailCandidatesAfterSelection: true, selectedThumbnailFinalName: '00-thumbnail-final', finalFlowCollectionRequired: true,
  singleFinalFlowCollectionPerVideo: true, removeRejectedVariantsBeforeCompletion: true, renameFinalAssetsBeforeCompletion: true,
  finalCollectionContainsFinalAssetsOnly: true, finalCollectionName: 'flow-test-final', coverExportDir: '05-export/cover',
  coverNeverUsedAsVideoFrame: true, scene01IndependentFromCover: true, steps,
  scenes: scenes.map((scene, index) => ({id: scene.id, output: 'image', imageStep: Math.floor(index / 2) + 1, visualType: types[index], primaryMotif: `motif-${index}`, informationBudget: {densityClass: index === 5 ? 'complex' : 'normal', oneDominantIdea: true, maxLabels: index === 5 ? 2 : 1, maxPrimaryObjects: 3, maxPanels: index === 5 ? 2 : 1, maxArrows: 2, largeHeadlineAllowed: false, fullSentenceTextAllowed: false}})),
};
const thumbnailPrompt = 'THUMBNAIL ONLY — Create exactly THREE distinct 16:9 1280x720 thumbnail candidates with the German headline exactly "BEIDES STAHL?".';

const {text} = buildGoogleFlowMasterPrompt({plan, flowPlan, config, thumbnailPrompt, scenePrompts});

// Stil- und Density-Block genau einmal, keine Metadaten, kein Sprechtext.
assert.ok(text.includes(FLOW_PROMPT_VERSION));
assert.equal(count(text, STYLE_LOCK_HEADING), 1);
assert.equal(count(text, DENSITY_LOCK_HEADING), 1);
assert.ok(!text.includes('old scene-level style text'));
for (const scene of scenes) {
  assert.ok(!text.toLowerCase().includes(scene.id), `Szenen-ID ${scene.id} darf nicht im Flow-Prompt stehen`);
  assert.ok(!text.includes(scene.voiceText), 'Sprechtext darf nicht im Flow-Prompt stehen');
  assert.ok(text.includes(flowSceneBrief(scenePrompts[scene.id], scene)), `Bildauftrag ${scene.id} fehlt`);
}
assert.ok(!/OUTPUT\s*=\s*IMAGE|Scene ID|Primary explanatory motif|motif-\d/i.test(text));
assert.ok(text.includes('Speichern als 01.png') && text.includes('Speichern als 10.png'));
assert.ok(text.includes('Visible German text: exactly "leer" and "beladen"'));
assert.ok(text.includes('Visible text: none.'));
assert.deepEqual(flowSceneLabels(scenePrompts[scenes[5].id]), ['leer','beladen']);
assert.deepEqual(findFlowPromptLeaks(text, plan), []);

// Die Workflow-Pflichten, die science-creative-qa verlangt, bleiben erhalten.
for (const pattern of [/(drei|3).*thumbnail/i, /(stopp|stop).*auswahl|auswahl.*warten/i, /keine.*Layoutvorlage/i, /visuelle Vielfalt/i, /keine gesichtslosen/i, /nur bilder/i, /keine weiteren stopps/i, /gesamtabschluss/i, /00-thumbnail-final/i, /zwei nicht gewählten.*cover/i, /finale.*google-flow-sammlung/i]) assert.match(text, pattern);
for (let step = 1; step <= 5; step += 1) assert.ok(text.includes(`BILDSCHRITT ${step}/5`));
assert.ok(!/STOPP NACH BILDSCHRITT\s+[1-4]/i.test(text));
assert.ok(text.includes(thumbnailPrompt));

// Das alte Format wird als gefährlich erkannt.
const legacy = scenes.map((scene) => `${scene.id} — OUTPUT=IMAGE / ${types[0]}\n${STYLE_LOCK_HEADING}\n${scenePrompts[scene.id]}`).join('\n\n');
assert.ok(findFlowPromptLeaks(legacy, plan).length >= 3);

// Szenen-ID im Bildauftrag selbst wird beim Bauen abgewiesen.
assert.throws(() => buildGoogleFlowMasterPrompt({plan, flowPlan, config, thumbnailPrompt, scenePrompts: {...scenePrompts, [scenes[2].id]: `EXACT VISUAL BRIEF — Show the ${scenes[2].id} layout.`}}), /Metadaten/);

// Beide Übergaben akzeptieren den neuen Masterprompt und erkennen veraltete Bildaufträge.
const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'science-flow-test-'));
const projectDir = path.join(repoRoot, 'channels/science/reels/2026-10-19_bis_2026-10-25/01_Flow-Test');
const put = (rel, value) => { const file = path.join(projectDir, rel); fs.mkdirSync(path.dirname(file), {recursive: true}); fs.writeFileSync(file, typeof value === 'string' ? value : JSON.stringify(value)); };
try {
  put('06-projektdateien/scene-plan.json', plan);
  put('06-projektdateien/flow-plan.json', flowPlan);
  put('06-projektdateien/preproduction-report.json', {passed: true, phase: 'assets-may-be-created'});
  put('01-script-audio/voiceover.txt', `${scenes.map((scene) => scene.voiceText).join('\n\n')}\n`);
  put('01-script-audio/script.md', '# Testskript');
  put('02-bilder/prompts/00-thumbnail.txt', thumbnailPrompt);
  for (const scene of scenes) put(`02-bilder/prompts/${scene.id}.txt`, scenePrompts[scene.id]);
  put('02-bilder/GOOGLE-FLOW-MASTER-PROMPT.txt', applyMasterVisibleTextLock(text));
  const simple = buildScienceSimpleHandoff({repoRoot, projectDir});
  assert.equal(fs.readFileSync(simple.flowPrompt, 'utf8'), `${applyMasterVisibleTextLock(text).trim()}\n`);
  buildSciencePhase1Handoff({repoRoot, projectDir});
  put(`02-bilder/prompts/${scenes[3].id}.txt`, scenePrompts[scenes[3].id].replace('number 4', 'number 4 with a changed brief'));
  assert.throws(() => buildScienceSimpleHandoff({repoRoot, projectDir}), /veralteter Szenenprompt/);
  assert.throws(() => buildSciencePhase1Handoff({repoRoot, projectDir}), /Masterprompt nicht aktuell/);
} finally {
  fs.rmSync(repoRoot, {recursive: true, force: true});
}

// Echte Daten: das 45-Szenen-Stahlschiff-Video lässt sich im neuen Format bauen.
const shipDir = 'channels/science/reels/2026-10-12_bis_2026-10-18/01_Warum-sinkt-ein-riesiges-Stahlschiff-nicht';
if (fs.existsSync(path.join(shipDir, '06-projektdateien/flow-plan.json'))) {
  const read = (rel) => fs.readFileSync(path.join(shipDir, rel), 'utf8').trim();
  const shipPlan = JSON.parse(read('06-projektdateien/scene-plan.json'));
  const shipPrompts = Object.fromEntries(shipPlan.scenes.map((scene) => [scene.id, read(`02-bilder/prompts/${scene.id}.txt`)]));
  const ship = buildGoogleFlowMasterPrompt({plan: shipPlan, flowPlan: JSON.parse(read('06-projektdateien/flow-plan.json')), config: loadElectricalConfig(shipPlan.productionProfile), thumbnailPrompt: read('02-bilder/prompts/00-thumbnail.txt'), scenePrompts: shipPrompts});
  const legacySize = read('02-bilder/GOOGLE-FLOW-MASTER-PROMPT.txt').length;
  assert.deepEqual(findFlowPromptLeaks(ship.text, shipPlan), []);
  assert.ok(ship.text.length < legacySize / 2, `neuer Prompt (${ship.text.length}) soll weniger als halb so lang sein wie der alte (${legacySize})`);
  console.log(`  Stahlschiff-Daten: ${shipPlan.scenes.length} Szenen · ${Math.round(legacySize / 1000)}k → ${Math.round(ship.text.length / 1000)}k Zeichen · 0 Szenen-IDs.`);
}

console.log('✓ Flow-Prompt v2: Stilblock einmal, keine Szenen-IDs/Abschnitte/Sprechtexte, Workflow-Pflichten, Übergaben und Aktualitätsprüfung geprüft.');
