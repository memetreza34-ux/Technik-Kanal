import {flowSceneBrief, flowSceneLabels} from './science-flow-prompt.mjs';
import {isPlaceholder} from './science-script-engagement.mjs';

// Bild passt zur Szene (qualitaet-v2).
// Gesehen in den ersten Langvideos:
// - Steckdose: dieselbe Hügellandschaft mit Mast in ~20 von 41 Bildern; Stromzähler,
//   LS- und FI-Schalter standen auf einer Wiese statt im Zählerschrank.
// - Stahlschiff: Auftrieb, Gewicht und verdrängtes Wasser als graue Würfel und Pfeile
//   ganz ohne Beschriftung; das erste Bild zeigte nur einen ruhigen Frachter statt
//   des Widerspruchs „Stahlklotz sinkt, Schiff schwimmt“.

export const SCENE_IMAGE_LIMITS = {sameSettingConsecutiveMax: 3, sameSettingShareMax: 0.3};

// Darstellungen, die ohne Beschriftung meist unklar bleiben.
// Querschnitte, Umgebungen und Makros dürfen ohne Label auskommen.
export const LABEL_REQUIRED_VISUAL_TYPES = ['diagram', 'comparison', 'object-comparison', 'schematic', 'infographic', 'measurement', 'before-after', 'diagramm', 'vergleich', 'schaltplan'];
// Pfeile, Kräfte und Messgrößen im Bild sind ohne Namen nicht zu lesen.
const NEEDS_NAMING_PATTERN = /\b(arrows?|forces?|force arrows?|measurement|measuring|levels?|gauge|meter reading)\b/i;

const norm = (value) => String(value ?? '').toLocaleLowerCase('de-DE').replace(/[^\p{L}\d]+/gu, ' ').trim();

export const analyzeSceneImageRules = ({plan, flowPlan, scenePrompts = {}, limits = SCENE_IMAGE_LIMITS}) => {
  const problems = [];
  const scenes = plan?.scenes ?? [];
  const entries = new Map((flowPlan?.scenes ?? []).map((entry) => [entry.id, entry]));

  // 1. Ort/Umgebung jeder Szene bewusst planen; Geräte an ihren echten Ort.
  const settings = scenes.map((scene) => String(entries.get(scene.id)?.setting ?? '').trim());
  const missing = scenes.filter((scene, index) => isPlaceholder(settings[index])).map((scene) => scene.id);
  if (missing.length) problems.push(`setting fehlt im Flow-Plan (wo spielt das Bild? z. B. „inside a home fuse box“, „harbor quay“): ${missing.slice(0, 8).join(', ')}${missing.length > 8 ? ' …' : ''}.`);

  // 2. Dieselbe Umgebung nicht endlos wiederholen.
  const planned = settings.map(norm).filter(Boolean);
  let run = 1;
  for (let index = 1; index < settings.length; index += 1) {
    if (norm(settings[index]) && norm(settings[index]) === norm(settings[index - 1])) {
      run += 1;
      if (run === limits.sameSettingConsecutiveMax + 1) problems.push(`Umgebung „${settings[index]}“ ${run}-mal hintereinander (bis ${scenes[index].id}); maximal ${limits.sameSettingConsecutiveMax}.`);
    } else run = 1;
  }
  const counts = new Map();
  for (const setting of planned) counts.set(setting, (counts.get(setting) ?? 0) + 1);
  for (const [setting, count] of counts) {
    if (scenes.length >= 10 && count / scenes.length > limits.sameSettingShareMax) problems.push(`Umgebung „${setting}“ in ${count} von ${scenes.length} Bildern (${Math.round((count / scenes.length) * 100)} %); maximal ${Math.round(limits.sameSettingShareMax * 100)} %. Detail, Querschnitt oder anderen Ort wählen.`);
  }

  // 3. Kraft-, Mengen- und Vergleichsbilder brauchen Beschriftung.
  for (const scene of scenes) {
    const entry = entries.get(scene.id) ?? {};
    const prompt = scenePrompts[scene.id];
    if (!prompt) continue;
    const brief = flowSceneBrief(prompt, scene);
    const needsLabel = LABEL_REQUIRED_VISUAL_TYPES.includes(String(entry.visualType ?? '').toLocaleLowerCase('de-DE')) || NEEDS_NAMING_PATTERN.test(brief);
    if (needsLabel && flowSceneLabels(prompt, scene).length === 0) problems.push(`${scene.id}: ${entry.visualType ?? 'Bild'} zeigt Pfeile, Messung oder Vergleich ohne ein einziges Label. Mindestens 1 kurzes deutsches Label verlangen (z. B. „Auftrieb“, „Gewicht“).`);
  }

  // 4. Das erste Bild zeigt den Hook-Widerspruch.
  const firstImage = String(plan?.hookAnchor?.firstImage ?? '').trim();
  const first = scenes[0];
  if (first && scenePrompts[first.id]) {
    if (isPlaceholder(firstImage)) problems.push('hookAnchor.firstImage fehlt: festlegen, was Bild 1 zeigt (der Widerspruch oder die Zahl aus dem Hook).');
    else if (!norm(flowSceneBrief(scenePrompts[first.id], first)).includes(norm(firstImage))) problems.push(`Bild 1 zeigt nicht den Hook: hookAnchor.firstImage „${firstImage}“ muss im Bildauftrag von ${first.id} stehen.`);
  }

  return {problems};
};
