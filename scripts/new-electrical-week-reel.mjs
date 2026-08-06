#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {createElectricalPromptManifestTemplate, createElectricalScenePlanTemplate, createElectricalStatusTemplate} from './lib/create-electrical-scene-plan-template.mjs';
import {ELECTRICAL_REEL_DIRECTORIES} from './lib/electrical-project-structure.mjs';

const args = process.argv.slice(2);
const option = (name) => args.find((arg) => arg.startsWith(`--${name}=`))?.slice(name.length + 3);
const week = option('week');
const slot = option('slot');
const title = option('title');
const hookOption = option('hook');
const sceneCount = Number(option('scenes') ?? 9);
if (!week || !slot || !title) {
  console.error('Nutzung: npm run electrical:new -- --week=2026-08-10_bis_2026-08-16 --slot=01 --title="FI-Schalter" --hook="Was macht ein FI-Schalter?" [--scenes=9]');
  process.exit(1);
}
if (!/^\d{4}-\d{2}-\d{2}_bis_\d{4}-\d{2}-\d{2}$/.test(week)) throw new Error(`Ungültiger Wochenname: ${week}`);
if (!/^\d{1,2}$/.test(slot)) throw new Error(`Ungültiger Slot: ${slot}`);
if (!Number.isInteger(sceneCount) || sceneCount < 8 || sceneCount > 10) throw new Error('Szenenzahl muss zwischen 8 und 10 liegen.');

const hook = (hookOption ?? (title.trim().endsWith('?') ? title.trim() : '')).trim();
if (!hook || !hook.endsWith('?')) throw new Error('Ein direkter Frage-Hook ist Pflicht.');
if (hook.split(/\s+/).filter(Boolean).length > 8) throw new Error('Hook ist länger als acht Wörter.');

const slug = title.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/ß/g, 'ss').replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-+|-+$/g, '').toLowerCase();
const folderTitle = title.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/ß/g, 'ss').replace(/[^a-zA-Z0-9ÄÖÜäöüß]+/g, '-').replace(/^-+|-+$/g, '');
const root = path.join(process.cwd(), 'channels/elektrotechnik/reels', week, `${String(Number(slot)).padStart(2, '0')}_${folderTitle}`);
if (fs.existsSync(root)) throw new Error(`Reel-Ordner existiert bereits: ${root}`);
for (const relative of ELECTRICAL_REEL_DIRECTORIES) fs.mkdirSync(path.join(root, relative), {recursive: true});
fs.mkdirSync(path.join(root, '02-bilder/images/00-cover'), {recursive: true});

const plan = createElectricalScenePlanTemplate({slug, title, hook, compositionId: 'ElectricalReel', sceneCount});
const visibleScenes = plan.scenes.filter((scene) => scene.renderMode !== 'mechanism-only');
const mechanismScenes = plan.scenes.filter((scene) => scene.renderMode === 'mechanism-only');
const write = (relative, content) => fs.writeFileSync(path.join(root, relative), content);
const writeJson = (relative, value) => write(relative, `${JSON.stringify(value, null, 2)}\n`);

write('README.md', `# ${title}\n\n## Hook\n\n> ${hook}\n\n## Medienbedarf\n\n- ${visibleScenes.length} sichtbare Szenenbilder\n- ${mechanismScenes.length} Remotion-Szenen ohne Nutzerbild\n- ein Coverbild mit dem exakten deutschen Hook\n- deutsche Rohaufnahme\n\nVor Bildern und Audio: \`npm run electrical:preflight -- "${path.relative(process.cwd(), root)}"\`.\n`);
write('01-script-audio/script.md', `# Sprechtext – ${title}\n\n## Hook\n\n${hook}\n\n## Regeln\n\n- 115 bis 165 Wörter\n- direkte Antwort nach der Frage\n- eine Aussage pro Szene\n- keine künstlichen Metaphern\n\n${plan.scenes.map((scene) => `### ${scene.id}\n\n**Voice:** ${scene.voiceText}\n`).join('\n')}\n`);
write('01-script-audio/script-fliesstext.txt', `${hook} Direkte, natürliche und fachlich belegte Erklärung ergänzen.\n`);
write('01-script-audio/voiceover.txt', `${hook} Direkte, natürliche und fachlich belegte Erklärung ergänzen.\n`);
write('01-script-audio/audio/00_AUDIO_HIER_EINFUEGEN.md', '# Audio erst nach bestandenem Preflight als voiceover-raw.wav einfügen.\n');
write('01-script-audio/sfx/README.md', '# Optionale semantische SFX, maximal ein Cue pro Szene.\n');

const style = 'Create a semi-photorealistic technical CGI image with real-world proportions and recognizable European electrical components. Full-bleed vertical 9:16 edge-to-edge image, no pure-white background, no white or gray bands, no blank title panel, no border, no letterboxing, bottom 25 percent calm for subtitles, no cartoon, no toy render, no neon fantasy cable, no logo and no watermark.';
const coverPrompt = `Create one real dominant electrical subject for this reel. Use a warm graphite workshop background and leave the subject clearly visible. Render the exact German hook "${hook}" in clean bold white typography. Do not add any other text.\n\n${style}\n`;
write('02-bilder/prompts/00-cover.txt', coverPrompt);
write('02-bilder/images/00-cover/00_BILD_HIER_EINFUEGEN.md', 'Finales Coverbild mit exakt geschriebenem deutschen Hook hier ablegen.\n');

const combined = [`# Alle Bildprompts – ${title}`, '', '## Cover', '', coverPrompt.trim(), ''];
for (const scene of plan.scenes) {
  fs.mkdirSync(path.join(root, scene.imageDir), {recursive: true});
  const mechanism = scene.renderMode === 'mechanism-only';
  const instruction = mechanism
    ? `REFERENCE BRIEF ONLY for a Remotion mechanism canvas. The exact German scene label is "${scene.imageLabel}" and will be rendered in Remotion.`
    : `Create one real dominant subject for exactly one technical statement. Render exactly one German label: "${scene.imageLabel}". No English or additional text.`;
  const prompt = `${instruction}\n\nBackground family: ${scene.backgroundFamily}. This scene must visibly differ from the previous background. Scene statement: [GENAUE AUSSAGE FÜR ${scene.id} ERGÄNZEN].\n\n${style}\n`;
  write(`02-bilder/prompts/${scene.id}.txt`, prompt);
  write(`${scene.imageDir}/00_BILD_HIER_EINFUEGEN.md`, mechanism ? '# Kein Nutzerbild erforderlich; Remotion rendert die Szene.\n' : `Finales 9:16-Bild mit der exakten deutschen Beschriftung "${scene.imageLabel}" hier ablegen.\n`);
  combined.push(`## ${scene.id}${mechanism ? ' – KEIN NUTZERBILD' : ''}`, '', prompt.trim(), '');
}
write('02-bilder/ALLE-BILDPROMPTS-MIT-COVER.txt', `${combined.join('\n')}\n`);
write('02-bilder/bildprompts.md', `${combined.join('\n')}\n`);
write('02-bilder/images/00_BILDER_HIER_EINFUEGEN.md', `Benötigt werden Cover und ${visibleScenes.length} sichtbare Full-bleed-Bilder mit exakten deutschen Labels.\n`);

write('03-caption/00_CAPTION_INFO.md', '# Wortzeiten aus finalem 1,10×-Audio. Weiß, ohne Box, maximal zwei Zeilen.\n');
write('03-caption/social-caption.md', `# Social Caption\n\n${title}\n`);
write('04-pdf/inhalt.md', `# Lernzettel – ${title}\n`);
write('05-export/README.md', '# Export erst nach bestandener Readiness- und Render-QA.\n');
write('05-export/video/README.md', '# Finales Video\n');
write('06-projektdateien/motion-design.md', `# Motion Design\n\n- maximal vier Vollanimationen\n- Hook nicht voll animieren\n- deutsche Bildlabels exakt\n- keine weißen Balken oder gleichen Hintergründe\n`);
write('06-projektdateien/sources.md', '# Quellen\n\nFachliche Quellen mit stabilen IDs ergänzen.\n');
write('06-projektdateien/storyboard.md', `# Storyboard – ${title}\n`);
writeJson('06-projektdateien/scene-plan.json', plan);
writeJson('06-projektdateien/prompt-manifest.json', createElectricalPromptManifestTemplate(plan));
writeJson('06-projektdateien/visual-policy.json', {version:'visual-v4',hook,generatedImageTextPolicy:'exact-german-short-labels',minimumBackgroundFamilies:4,whiteBandsAllowed:false,letterboxingAllowed:false,maximumFullMechanismAnimations:4,fullMechanismSceneIds:plan.animationBudget.fullMechanismScenes,requiredVisibleSceneImages:visibleScenes.length});
writeJson('06-projektdateien/production-status.json', createElectricalStatusTemplate(plan));
writeJson('06-projektdateien/asset-manifest.json', {version:'electrical-v4',slug,generatedAt:new Date().toISOString(),assets:[]});
for (const name of ['content-package-report','creative-qa-report','script-qa-report','preproduction-report','qa-report','ready-report']) writeJson(`06-projektdateien/${name}.json`, {version:'electrical-v4',passed:false,status:'noch-nicht-geprueft'});
write('06-projektdateien/render/README.md', '# Arbeitsrender und Kontrollbilder\n');

console.log(`✓ Neuer visual-v4 Elektrotechnik-Reel: ${root}`);
console.log('Vor Bildgenerierung alle Platzhalter ersetzen und electrical:preflight ausführen.');
