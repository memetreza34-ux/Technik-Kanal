#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {electricalProjectPaths} from './lib/electrical-project-structure.mjs';
import {loadElectricalConfig} from './lib/load-electrical-config.mjs';
import {DENSITY_LOCK, FLOW_PROMPT_VERSION, STYLE_LOCK, findFlowPromptLeaks, flowSceneBlock} from './lib/science-flow-prompt.mjs';

const normalize = (value) => String(value ?? '').trim().toLowerCase();

// Baut den einen Google-Flow-Masterprompt (Cover + alle Szenen) aus Szenenplan, Flow-Plan und Einzelprompts.
// Stil- und Density-Block stehen genau einmal oben; jede Szene bekommt nur einen neutralen Bildauftrag
// ohne Szenen-ID, Abschnittsnamen, Motiv-Slug oder Sprechtext (siehe scripts/lib/science-flow-prompt.mjs).
export const buildGoogleFlowMasterPrompt = ({plan, flowPlan, config, thumbnailPrompt, scenePrompts}) => {
  if(plan.productionProfile==='youtube-6to7min-v1' && (flowPlan.scene01IndependentFromCover!==true || flowPlan.coverNeverUsedAsVideoFrame!==true || flowPlan.coverExportDir!=='05-export/cover')) throw new Error('Cover ist nicht ausschließlich Exportasset oder Szene 01 keine eigene Illustration.');
  const scenes = Array.isArray(plan.scenes) ? plan.scenes : [];
  const flowScenes = Array.isArray(flowPlan.scenes) ? flowPlan.scenes : [];
  const stepCount = Number(config.visuals?.flow?.imageProductionSteps ?? 5);
  const diversity = config.visuals?.diversity ?? {};
  const budgetConfig = config.visuals?.informationBudget ?? {};
  const normalLabelsMax = Number(budgetConfig.normalSceneHardLabelsMax ?? 2);
  const complexLabelsMax = Number(budgetConfig.diagramComparisonSummaryLabelsMax ?? 3);
  const normalObjectsMax = Number(budgetConfig.normalScenePrimaryObjectsMax ?? 3);
  const complexObjectsMax = Number(budgetConfig.diagramComparisonSummaryPrimaryObjectsMax ?? 4);
  const panelsMax = Number(budgetConfig.panelsMax ?? 2);
  const arrowsMax = Number(budgetConfig.arrowsMax ?? 2);

  if (!String(thumbnailPrompt ?? '').trim()) throw new Error('00-thumbnail.txt fehlt oder ist leer.');
  if (!scenes.length) throw new Error('Szenenplan enthält keine Beats.');
  if (flowPlan.imageOnly !== true) throw new Error('flow-plan.json muss imageOnly=true setzen.');
  if (flowPlan.informationBudgetLocked !== true) throw new Error('flow-plan.json muss informationBudgetLocked=true setzen.');
  if (flowPlan.imageProductionSteps !== stepCount) throw new Error(`flow-plan.json muss imageProductionSteps=${stepCount} setzen.`);
  if (flowPlan.pauseAfterEachImageStep !== false) throw new Error('flow-plan.json muss pauseAfterEachImageStep=false setzen.');
  if (flowPlan.continueAutomaticallyBetweenImageSteps !== true) throw new Error('flow-plan.json muss continueAutomaticallyBetweenImageSteps=true setzen.');
  if (flowPlan.deleteUnselectedThumbnailCandidatesAfterSelection !== true) throw new Error('flow-plan.json muss die zwei nicht gewählten Cover nach Auswahl entfernen.');
  if (flowPlan.selectedThumbnailFinalName !== '00-thumbnail-final') throw new Error('flow-plan.json muss selectedThumbnailFinalName=00-thumbnail-final setzen.');
  if (flowPlan.finalFlowCollectionRequired !== true || flowPlan.singleFinalFlowCollectionPerVideo !== true) throw new Error('flow-plan.json muss genau eine finale Flow-Sammlung pro Video verlangen.');
  if (flowPlan.removeRejectedVariantsBeforeCompletion !== true || flowPlan.renameFinalAssetsBeforeCompletion !== true || flowPlan.finalCollectionContainsFinalAssetsOnly !== true) throw new Error('flow-plan.json muss die finale Asset-Bereinigung vollständig aktivieren.');
  if (!String(flowPlan.finalCollectionName ?? '').trim()) throw new Error('flow-plan.json muss finalCollectionName setzen.');
  if (flowScenes.length !== scenes.length) throw new Error(`flow-plan.json muss ${scenes.length} Beat-Einträge enthalten.`);

  const byId = new Map(flowScenes.map((entry) => [entry.id, entry]));
  const groupedScenes = Array.from({length: stepCount}, () => []);
  const visualTypes = new Set();
  const motifCounts = new Map();
  let previousVisualType = null;
  let handOnObjectCount = 0;

  scenes.forEach((scene, index) => {
    const entry = byId.get(scene.id);
    if (!entry) throw new Error(`Flow-Plan fehlt für ${scene.id}.`);
    if (entry.output !== 'image') throw new Error(`${scene.id}: Nur output=image ist erlaubt.`);
    if (entry.clipSeconds != null || String(entry.motionPrompt ?? '').trim() || String(entry.videoDir ?? '').trim()) throw new Error(`${scene.id}: Video-/Motion-Felder sind nicht erlaubt.`);

    const imageStep = Number(entry.imageStep);
    if (!Number.isInteger(imageStep) || imageStep < 1 || imageStep > stepCount) throw new Error(`${scene.id}: imageStep muss 1–${stepCount} sein.`);

    const visualType = normalize(entry.visualType);
    const primaryMotif = normalize(entry.primaryMotif);
    if (!visualType || /ungeplant|tbd|placeholder/.test(visualType)) throw new Error(`${scene.id}: visualType ist noch nicht final geplant.`);
    if (!primaryMotif || /ungeplant|tbd|placeholder/.test(primaryMotif)) throw new Error(`${scene.id}: primaryMotif ist noch nicht final geplant.`);
    if (previousVisualType && previousVisualType === visualType) throw new Error(`${scene.id}: derselbe visualType darf nicht direkt hintereinander dominieren.`);
    previousVisualType = visualType;
    visualTypes.add(visualType);
    motifCounts.set(primaryMotif,(motifCounts.get(primaryMotif)??0)+1);
    if (/hand.*(gegenstand|kontakt|material|object)|hand-contact|hand-on-object/.test(primaryMotif)) handOnObjectCount += 1;

    const budget = entry.informationBudget;
    if (!budget || budget.oneDominantIdea !== true) throw new Error(`${scene.id}: informationBudget.oneDominantIdea=true ist Pflicht.`);
    const densityClass = normalize(budget.densityClass || 'normal');
    if (!['normal','complex'].includes(densityClass)) throw new Error(`${scene.id}: densityClass muss normal oder complex sein.`);
    const isComplex = densityClass === 'complex';
    const maxLabels = Number(budget.maxLabels);
    const maxPrimaryObjects = Number(budget.maxPrimaryObjects);
    const maxPanelsScene = Number(budget.maxPanels);
    const maxArrowsScene = Number(budget.maxArrows);
    if (!Number.isInteger(maxLabels) || maxLabels < 0 || maxLabels > (isComplex ? complexLabelsMax : normalLabelsMax)) throw new Error(`${scene.id}: maxLabels überschreitet das Informationsbudget.`);
    if (!Number.isInteger(maxPrimaryObjects) || maxPrimaryObjects < 1 || maxPrimaryObjects > (isComplex ? complexObjectsMax : normalObjectsMax)) throw new Error(`${scene.id}: maxPrimaryObjects überschreitet das Informationsbudget.`);
    if (!Number.isInteger(maxPanelsScene) || maxPanelsScene < 1 || maxPanelsScene > panelsMax) throw new Error(`${scene.id}: maxPanels überschreitet das Informationsbudget.`);
    if (!Number.isInteger(maxArrowsScene) || maxArrowsScene < 0 || maxArrowsScene > arrowsMax) throw new Error(`${scene.id}: maxArrows überschreitet das Informationsbudget.`);
    if (budget.largeHeadlineAllowed !== false) throw new Error(`${scene.id}: largeHeadlineAllowed muss false sein.`);
    if (budget.fullSentenceTextAllowed !== false) throw new Error(`${scene.id}: fullSentenceTextAllowed muss false sein.`);

    const promptText = scenePrompts[scene.id];
    if (!String(promptText ?? '').trim()) throw new Error(`${scene.id}: Einzelprompt fehlt.`);
    groupedScenes[imageStep - 1].push({scene,entry,promptText,position:index+1});
  });

  for (let index=0;index<groupedScenes.length;index+=1) {
    if (!groupedScenes[index].length) throw new Error(`Bildschritt ${index+1} enthält keine Bilder.`);
    const types = new Set(groupedScenes[index].map(({entry})=>normalize(entry.visualType)));
    const required = Math.min(groupedScenes[index].length,Number(diversity.minimumDistinctVisualTypesPerImageStepPreferred ?? 3));
    if (types.size < required) throw new Error(`Bildschritt ${index+1}: zu wenig visuelle Vielfalt (${types.size}/${required}).`);
  }

  const flattened = groupedScenes.flat().map(({scene}) => scene.id);
  const expectedOrder = scenes.map((scene) => scene.id);
  if (flattened.join('|') !== expectedOrder.join('|')) throw new Error('Die fünf Bildschritte müssen zusammenhängend und in Szenenreihenfolge angeordnet sein.');
  const sizes = groupedScenes.map((group) => group.length);
  if (Math.max(...sizes)-Math.min(...sizes)>1) throw new Error(`Die ${stepCount} Bildschritte müssen möglichst gleichmäßig verteilt sein. Aktuell: ${sizes.join(', ')}.`);
  if (visualTypes.size < Number(diversity.minimumDistinctVisualTypesPerVideo ?? 5)) throw new Error(`Mindestens ${diversity.minimumDistinctVisualTypesPerVideo ?? 5} unterschiedliche Visual-Typen erforderlich.`);
  for (const [motif,count] of motifCounts) if (count > Number(diversity.samePrimaryMotifMaxPerVideo ?? 3)) throw new Error(`Primärmotiv „${motif}“ kommt ${count}-mal vor; zu häufig.`);
  if (handOnObjectCount > Number(diversity.handOnObjectPrimaryMotifMaxPerVideo ?? 3)) throw new Error(`Hand-auf-Gegenstand-Motiv kommt ${handOnObjectCount}-mal vor; zu häufig.`);

  const total = scenes.length;
  const lines = [];
  lines.push('GOOGLE FLOW MASTER PROMPT — WISSONAUT — NUR BILDER / IMAGE ONLY');
  lines.push('================================================================');
  lines.push(`Prompt-Version: ${FLOW_PROMPT_VERSION}`);
  lines.push(`TITLE: ${plan.title ?? plan.slug}`);
  lines.push(`VIDEO: ${plan.width}×${plan.height} / 16:9, exactly ${total} static scene images, ${stepCount} Bildschritte.`);
  lines.push('VISUAL WORLD: Technical Editorial Explainer 2.5D.');
  lines.push(`Finale Flow-Sammlung: ${flowPlan.finalCollectionName}`);
  lines.push('');
  lines.push(STYLE_LOCK);
  lines.push('');
  lines.push(DENSITY_LOCK);
  lines.push('');
  lines.push('WAS INS BILD GEHÖRT');
  lines.push('-------------------');
  lines.push('- Nur der Text hinter „Bildauftrag:“ beschreibt das Bild. Zeilen wie „BILD 7 VON 45“, „BILDSCHRITT“, „Budget“ und „Speichern als …“ sind Arbeitsanweisungen und erscheinen niemals im Bild.');
  lines.push('- Sichtbarer Text nur, wenn die Zeile „Visible German text“ ihn verlangt – exakt diese Wörter, klein, vollständig, richtig geschrieben. Steht dort „Visible text: none“, ist das Bild komplett textfrei.');
  lines.push('- Keine Überschriften, keine Nummern, keine Abschnitts- oder Dateinamen, keine englischen Wörter im Bild.');
  lines.push('');
  lines.push('VERBINDLICHE WORKFLOW-REGELN / BINDING WORKFLOW');
  lines.push('1. Zuerst genau DREI Thumbnail-Kandidaten gemäß dem Coverprompt erzeugen; dann STOPP und auf die ausdrückliche AUSWAHL des Nutzers warten.');
  lines.push('2. Die ZWEI NICHT GEWÄHLTEN COVER entfernen. Gewinner als 00-thumbnail-final ausschließlich nach 05-export/cover exportieren; niemals als Videobild verwenden.');
  lines.push('3. Bild 1 unabhängig vom Cover gestalten: KEINE Farbpalette, KEINE Layoutvorlage, keine Cover-Schlagzeile und keine wiederholte Cover-Komposition auf Videoszenen übertragen.');
  lines.push(`4. Danach genau ${stepCount} Bildschritte. Jeweils EIN finales Bild pro Bildauftrag erzeugen, sofort prüfen und wie angegeben speichern. KEINE WEITEREN STOPPS ODER RÜCKFRAGEN zwischen BILDSCHRITT 1 und ${stepCount}.`);
  lines.push('5. VISUELLE VIELFALT IST PFLICHT: Komposition, Darstellungsform und Perspektive wechseln, ohne den STYLE LOCK zu verlassen. Kein Bild darf das vorige praktisch wiederholen.');
  lines.push('6. INFORMATIONSDICHTE IST HART BEGRENZT: Budget jeder Szene einhalten; lieber vereinfachen als überladen.');
  lines.push('7. Keine gesichtslosen sichtbaren Köpfe. Wenn ein Kopf sichtbar ist, dann mit vollständigen natürlichen Gesichtszügen.');
  lines.push('8. NUR BILDER: ausschließlich statische 16:9-Illustrationen, keine KI-Videoclips, keine Animationen, keine Kamerafahrten.');
  lines.push('9. Vor jeder Freigabe den sichtbaren Text prüfen: falsch geschriebene, abgeschnittene, zusätzliche oder nicht verlangte Schrift → Bild verwerfen und neu erzeugen.');
  lines.push(`10. Erst NACH ABSCHLUSS VON BILDSCHRITT ${stepCount} aufräumen und den GESAMTABSCHLUSS melden.`);
  lines.push('');
  lines.push('THUMBNAIL — ERST DREI THUMBNAILS, DANACH STOPP');
  lines.push('==============================================');
  lines.push(String(thumbnailPrompt).trim());
  lines.push('');
  lines.push('STOPP NACH DREI THUMBNAILS; AUF AUSWAHL WARTEN. DANACH OHNE ZWISCHENSTOPP MIT BILDSCHRITT 1 WEITER.');

  for (let stepIndex=0;stepIndex<groupedScenes.length;stepIndex+=1) {
    const stepNumber = stepIndex + 1;
    const group = groupedScenes[stepIndex];
    lines.push('');
    lines.push(`BILDSCHRITT ${stepNumber}/${stepCount} — BILDER ${group[0].position} BIS ${group.at(-1).position}`);
    lines.push('='.repeat(52));
    lines.push(`Erzeuge genau ${group.length} finale statische Bilder in dieser Reihenfolge. Pro Bildauftrag ein angenommenes Bild; Fehlversuche verwerfen.`);
    for (const {scene,entry,promptText,position} of group) {
      lines.push('');
      lines.push(flowSceneBlock({position,total,scene,entry,promptText}));
    }
    lines.push('');
    if (stepNumber < stepCount) lines.push(`BILDSCHRITT ${stepNumber} ABGESCHLOSSEN. OHNE ZWISCHENSTOPP direkt mit BILDSCHRITT ${stepNumber+1} fortfahren.`);
    else lines.push(`BILDSCHRITT ${stepNumber} ABGESCHLOSSEN. Erst jetzt aufräumen und danach den GESAMTABSCHLUSS melden.`);
  }

  lines.push('');
  lines.push('PHASE 3 – FINALE ASSET-BEREINIGUNG');
  lines.push('-----------------------------------');
  lines.push(`1. Genau EINE finale Google-Flow-Sammlung namens „${flowPlan.finalCollectionName}“ verwenden.`);
  lines.push('2. Dort nur die finalen Szenenbilder sammeln. 00-thumbnail-final getrennt nach 05-export/cover exportieren; niemals als Videobild verwenden.');
  lines.push('3. Die zwei nicht gewählten Cover, Zwischenstände, Fehlversuche, Duplikate und verworfene Varianten entfernen.');
  lines.push(`4. Reihenfolge und Dateinamen 01.png bis ${String(total).padStart(2,'0')}.png prüfen.`);
  lines.push('5. Den Abschluss erst melden, wenn die Sammlung nur finale Assets enthält.');

  const text = `${lines.join('\n')}\n`;
  const leaks = findFlowPromptLeaks(text, plan);
  if (leaks.length) throw new Error(`Flow-Masterprompt würde Metadaten ins Bild tragen:\n- ${leaks.join('\n- ')}`);
  return {text, sceneCount: total, visualTypeCount: visualTypes.size, stepSizes: sizes, finalCollectionName: flowPlan.finalCollectionName};
};

const isCli = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isCli) {
  const [projectArg] = process.argv.slice(2).filter((arg) => !arg.startsWith('--'));
  if (!projectArg) throw new Error('Nutzung: npm run science:flow-master -- <video-ordner>');
  const root = path.resolve(projectArg);
  const paths = electricalProjectPaths(root);
  if (!fs.existsSync(paths.scenePlan)) throw new Error('scene-plan.json fehlt.');
  if (!fs.existsSync(paths.flowPlan)) throw new Error('flow-plan.json fehlt.');
  const thumbnailFile = path.join(paths.promptDir, '00-thumbnail.txt');
  if (!fs.existsSync(thumbnailFile)) throw new Error('00-thumbnail.txt fehlt.');
  const read = (file) => fs.readFileSync(file, 'utf8').trim();
  const plan = JSON.parse(read(paths.scenePlan));
  const flowPlan = JSON.parse(read(paths.flowPlan));
  const config = loadElectricalConfig(plan.productionProfile);
  const scenePrompts = {};
  for (const scene of plan.scenes ?? []) {
    const promptFile = path.join(paths.promptDir, `${scene.id}.txt`);
    if (fs.existsSync(promptFile)) scenePrompts[scene.id] = read(promptFile);
  }
  const result = buildGoogleFlowMasterPrompt({plan, flowPlan, config, thumbnailPrompt: read(thumbnailFile), scenePrompts});
  fs.writeFileSync(paths.flowMaster, result.text);
  console.log(`✓ Google-Flow-Masterprompt gebaut: ${paths.flowMaster}`);
  console.log(`  ${result.sceneCount} statische Bilder · ${result.visualTypeCount} Visual-Typen · ${result.stepSizes.length} Schritte ohne Zwischenstopps · 0 Clips.`);
  console.log(`  ${FLOW_PROMPT_VERSION}: Style-Lock und Density-Lock je einmal, keine Szenen-IDs, kein Sprechtext im Bildauftrag.`);
  console.log(`  Finale Flow-Sammlung: ${result.finalCollectionName}`);
  console.log(`  Verteilung: ${result.stepSizes.join(' / ')} Bilder · ${Math.round(result.text.length/1000)}k Zeichen.`);
}
