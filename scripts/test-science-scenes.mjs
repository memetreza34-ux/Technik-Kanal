#!/usr/bin/env node
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {createElectricalPromptManifestTemplate, createElectricalScenePlanTemplate, createElectricalStatusTemplate, createScienceFlowPlanTemplate} from './lib/create-electrical-scene-plan-template.mjs';
import {rebalanceScienceImageSteps, setScienceSceneCount} from './lib/science-scenes.mjs';
import {importScienceDrop} from './lib/science-simple-import.mjs';

const writeJson = (file, value) => { fs.mkdirSync(path.dirname(file), {recursive: true}); fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`); };
const readJson = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const project = (root) => (name) => path.join(root, '06-projektdateien', name);

const root = fs.mkdtempSync(path.join(os.tmpdir(), 'science-scenes-'));
try {
  const file = project(root);
  const plan = {...createElectricalScenePlanTemplate({slug: 'blitz-test', title: 'Blitz trifft Auto', hook: 'Warum überlebst du im Auto?', sceneCount: 40}), hookAnchor: {type: 'ereignis', text: 'X', firstImage: 'Y'}};
  writeJson(file('scene-plan.json'), plan);
  writeJson(file('flow-plan.json'), createScienceFlowPlanTemplate({plan}));
  writeJson(file('prompt-manifest.json'), createElectricalPromptManifestTemplate(plan));
  writeJson(file('production-status.json'), createElectricalStatusTemplate(plan));

  // Individuell: deutlich mehr oder weniger Szenen als früher üblich.
  for (const count of [112, 18]) {
    const result = setScienceSceneCount({root, count});
    const next = readJson(file('scene-plan.json'));
    const flow = readJson(file('flow-plan.json'));
    assert.equal(next.scenes.length, count);
    assert.equal(next.title, 'Blitz trifft Auto');
    assert.equal(next.hookAnchor.type, 'ereignis', 'Felder außerhalb der Szenen bleiben erhalten');
    assert.equal(next.scenes[0].section, 'hook');
    assert.equal(next.scenes.at(-1).section, 'payoff');
    assert.equal(flow.scenes.length, count);
    assert.equal(result.steps.reduce((sum, size) => sum + size, 0), count);
    assert.ok(Math.max(...result.steps) - Math.min(...result.steps) <= 1, 'Bildschritte gleichmäßig verteilt');
    assert.equal(readJson(file('prompt-manifest.json')).requiredVisibleSceneImages, count);
    assert.equal(readJson(file('production-status.json')).requiredVisibleSceneImages, count);
  }
  assert.throws(() => setScienceSceneCount({root, count: 3}), /7 bis 400/);

  // Gefüllte Szenen werden nie überschrieben.
  const filled = readJson(file('scene-plan.json'));
  filled.scenes[2].voiceText = 'Der Blitz trifft das Dach mit 30.000 Ampere.';
  writeJson(file('scene-plan.json'), filled);
  assert.throws(() => setScienceSceneCount({root, count: 30}), /Schon gefüllte Szenen \(03-/);

  // Von Hand eine Szene einfügen und eine löschen, dann neu verteilen.
  const edited = readJson(file('scene-plan.json'));
  const flow = readJson(file('flow-plan.json'));
  const inserted = {...edited.scenes[3], id: '04b-foundation', imageDir: '02-bilder/images/04b-foundation'};
  edited.scenes.splice(4, 0, inserted);
  const removedId = edited.scenes.splice(10, 1)[0].id;
  writeJson(file('scene-plan.json'), edited);
  assert.throws(() => rebalanceScienceImageSteps({root}), /Fehlt: 04b-foundation\. Überzählig: /);
  flow.scenes = flow.scenes.filter((entry) => entry.id !== removedId);
  flow.scenes.push({...flow.scenes[3], id: '04b-foundation', setting: 'car roof in a thunderstorm'});
  writeJson(file('flow-plan.json'), flow);
  const rebalanced = rebalanceScienceImageSteps({root});
  const after = readJson(file('flow-plan.json'));
  assert.equal(rebalanced.count, 18);
  assert.deepEqual(after.scenes.map((entry) => entry.id), edited.scenes.map((scene) => scene.id), 'Flow-Plan folgt der Szenenreihenfolge');
  assert.equal(after.scenes.find((entry) => entry.id === '04b-foundation').setting, 'car roof in a thunderstorm', 'Inhalt bleibt erhalten');
  assert.deepEqual(after.steps.flatMap((step) => step.sceneIds), edited.scenes.map((scene) => scene.id));
  after.scenes.forEach((entry, index) => assert.ok(index === 0 || entry.imageStep >= after.scenes[index - 1].imageStep, 'Bildschritte zusammenhängend'));
  assert.ok(readJson(file('prompt-manifest.json')).scenes.some((entry) => entry.id === '04b-foundation'));
} finally {
  fs.rmSync(root, {recursive: true, force: true});
}

// Bild-Import bei über 100 Szenen: Flow speichert dann 001.png … 105.png.
const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'science-scenes-import-'));
try {
  const projectDir = path.join(repoRoot, 'channels/science/YouTube/2099-W/01-Gross');
  const big = createElectricalScenePlanTemplate({slug: 'gross', sceneCount: 105});
  writeJson(path.join(projectDir, '06-projektdateien/scene-plan.json'), big);
  const drop = path.join(repoRoot, 'START-HIER/gross/DATEIEN-HIER-REIN');
  fs.mkdirSync(drop, {recursive: true});
  fs.writeFileSync(path.join(drop, '001.png'), 'erstes');
  fs.writeFileSync(path.join(drop, '7.png'), 'siebtes');
  fs.writeFileSync(path.join(drop, `${big.scenes[104].id}-final.png`), 'letztes');
  fs.writeFileSync(path.join(drop, `001-${big.scenes[0].id.replace(/^\d+-/, '')}-final.png`.replace('001-', '002-')), 'falsch');
  assert.throws(() => importScienceDrop({repoRoot, packageDir: path.join(repoRoot, 'START-HIER/gross'), projectDir}), /Falsche Zuordnung für 002-hook-final\.png \(erwartet: 02-context-final oder 002\.png\)/);
  fs.unlinkSync(path.join(drop, '002-hook-final.png'));
  const imported = importScienceDrop({repoRoot, packageDir: path.join(repoRoot, 'START-HIER/gross'), projectDir});
  assert.equal(imported.copied.length, 3);
  assert.ok(fs.existsSync(path.join(projectDir, big.scenes[104].imageDir, `${big.scenes[104].id}-final.png`)));
  assert.ok(fs.existsSync(path.join(projectDir, big.scenes[0].imageDir, `${big.scenes[0].id}-final.png`)));
} finally {
  fs.rmSync(repoRoot, {recursive: true, force: true});
}

// science:new legt ein Startgerüst an, ohne an einer Profil-Bildzahl zu scheitern.
const week = '2099-01-05_bis_2099-01-11';
const weekDir = path.join('channels/science/YouTube', week);
try {
  for (const scenes of [null, 130, 12]) {
    const args = ['scripts/new-science-reel.mjs', `--week=${week}`, `--slot=${scenes ?? 1}`, '--title=Szenentest', '--hook=Warum?'];
    if (scenes) args.push(`--scenes=${scenes}`);
    const run = spawnSync(process.execPath, args, {encoding: 'utf8'});
    assert.equal(run.status, 0, run.stderr);
  }
} finally {
  fs.rmSync(weekDir, {recursive: true, force: true});
}

console.log('✓ Individuelle Szenenzahl: Gerüst für 18–112 Szenen, gleichmäßige Bildschritte, Schutz gefüllter Szenen, Neuverteilung nach Handänderung, science:new ohne feste Bildzahl.');
