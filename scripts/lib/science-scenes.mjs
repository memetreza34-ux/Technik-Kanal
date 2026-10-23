// Szenenzahl pro Video individuell festlegen (keine feste Bildzahl).
//
// Jedes Video bekommt so viele Bilder, wie sein Script sichtbare Aussagen hat – auch über 100
// oder deutlich weniger. `setScienceSceneCount` baut das Gerüst für N Szenen neu, solange noch
// keine Szene gefüllt ist. `rebalanceScienceImageSteps` verteilt nach manuellem Hinzufügen oder
// Löschen einzelner Szenen die fünf Flow-Bildschritte und die Manifeste neu.
import fs from 'node:fs';
import path from 'node:path';
import {createElectricalPromptManifestTemplate, createElectricalScenePlanTemplate, createScienceFlowPlanTemplate, distributeScienceImageSteps} from './create-electrical-scene-plan-template.mjs';

// Technische Grenzen, keine Zielwerte: mindestens 7 verschiedene Bildtypen brauchen 7 Szenen.
export const SCENE_COUNT_LIMITS = {min: 7, max: 400};

const PLACEHOLDER_VOICE = /(ergänzen|UNGEPLANT)/i;
const filesOf = (root) => ({
  plan: path.join(root, '06-projektdateien/scene-plan.json'),
  flow: path.join(root, '06-projektdateien/flow-plan.json'),
  manifest: path.join(root, '06-projektdateien/prompt-manifest.json'),
  status: path.join(root, '06-projektdateien/production-status.json'),
});
const readJson = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const writeJson = (file, value) => fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
const hasFiles = (dir) => fs.existsSync(dir) && fs.readdirSync(dir).some((name) => !name.startsWith('.') && !/^(00_|README)/i.test(name));

export const filledScienceScenes = (root, plan) => plan.scenes.filter((scene) =>
  !PLACEHOLDER_VOICE.test(String(scene.voiceText ?? ''))
  || fs.existsSync(path.join(root, '02-bilder/prompts', `${scene.id}.txt`))
  || hasFiles(path.join(root, scene.imageDir ?? `02-bilder/images/${scene.id}`)));

export const setScienceSceneCount = ({root, count}) => {
  if (!Number.isInteger(count) || count < SCENE_COUNT_LIMITS.min || count > SCENE_COUNT_LIMITS.max) throw new Error(`Szenenzahl muss eine ganze Zahl von ${SCENE_COUNT_LIMITS.min} bis ${SCENE_COUNT_LIMITS.max} sein.`);
  const files = filesOf(root);
  const plan = readJson(files.plan);
  const filled = filledScienceScenes(root, plan);
  if (filled.length) throw new Error(`Schon gefüllte Szenen (${filled.map((scene) => scene.id).join(', ')}): Gerüst wird nicht neu gebaut. Einzelne Szenen von Hand in scene-plan.json und flow-plan.json ergänzen oder löschen, dann --neu-verteilen.`);
  const hook = String(plan.scenes[0]?.title ?? plan.title);
  const template = createElectricalScenePlanTemplate({slug: plan.slug, title: plan.title, hook, compositionId: plan.compositionId, sceneCount: count, productionProfile: plan.productionProfile});
  const nextPlan = {...plan, scenes: template.scenes};
  const previousFlow = fs.existsSync(files.flow) ? readJson(files.flow) : {};
  const flow = createScienceFlowPlanTemplate({plan: nextPlan, imageProductionSteps: previousFlow.imageProductionSteps ?? 5});
  writeJson(files.plan, nextPlan);
  writeJson(files.flow, flow);
  writeJson(files.manifest, createElectricalPromptManifestTemplate(nextPlan));
  if (fs.existsSync(files.status)) writeJson(files.status, {...readJson(files.status), requiredVisibleSceneImages: count});
  return {count, steps: flow.steps.map((step) => step.sceneIds.length)};
};

export const rebalanceScienceImageSteps = ({root}) => {
  const files = filesOf(root);
  const plan = readJson(files.plan);
  const flow = readJson(files.flow);
  const ids = plan.scenes.map((scene) => scene.id);
  if (new Set(ids).size !== ids.length) throw new Error('Szenen-IDs in scene-plan.json sind nicht eindeutig.');
  if (ids.length < SCENE_COUNT_LIMITS.min || ids.length > SCENE_COUNT_LIMITS.max) throw new Error(`Szenenzahl ${ids.length} liegt außerhalb der technischen Grenzen ${SCENE_COUNT_LIMITS.min}–${SCENE_COUNT_LIMITS.max}.`);
  const byId = new Map((flow.scenes ?? []).map((entry) => [entry.id, entry]));
  const missing = ids.filter((id) => !byId.has(id));
  const extra = [...byId.keys()].filter((id) => !ids.includes(id));
  if (missing.length || extra.length) throw new Error(`flow-plan.json passt nicht zu scene-plan.json.${missing.length ? ` Fehlt: ${missing.join(', ')}.` : ''}${extra.length ? ` Überzählig: ${extra.join(', ')}.` : ''}`);
  const steps = distributeScienceImageSteps(ids, flow.imageProductionSteps ?? 5);
  const stepById = new Map(steps.flatMap((group) => group.sceneIds.map((id) => [id, group.step])));
  writeJson(files.flow, {...flow, steps, scenes: ids.map((id) => ({...byId.get(id), imageStep: stepById.get(id)}))});
  if (fs.existsSync(files.manifest)) {
    const manifest = readJson(files.manifest);
    const fresh = createElectricalPromptManifestTemplate(plan);
    const previous = new Map((manifest.scenes ?? []).map((entry) => [entry.id ?? entry.sceneId, entry]));
    writeJson(files.manifest, {...manifest, requiredVisibleSceneImages: ids.length, scenes: fresh.scenes.map((entry) => previous.get(entry.id ?? entry.sceneId) ?? entry)});
  }
  if (fs.existsSync(files.status)) writeJson(files.status, {...readJson(files.status), requiredVisibleSceneImages: ids.length});
  return {count: ids.length, steps: steps.map((step) => step.sceneIds.length)};
};
