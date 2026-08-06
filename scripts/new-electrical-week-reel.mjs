#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {
  createElectricalPromptManifestTemplate,
  createElectricalScenePlanTemplate,
  createElectricalStatusTemplate,
} from './lib/create-electrical-scene-plan-template.mjs';
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
if (!hook || !hook.endsWith('?')) {
  throw new Error('Ein direkter Frage-Hook ist Pflicht. Ergänze zum Beispiel --hook="Was macht ein FI-Schalter?"');
}
const hookWords = hook.split(/\s+/).filter(Boolean).length;
if (hookWords > 8) throw new Error(`Hook ist zu lang: ${hookWords} Wörter; maximal 8.`);

const slug = title
  .normalize('NFKD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/ß/g, 'ss')
  .replace(/[^a-zA-Z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '')
  .toLowerCase();
const folderTitle = title
  .normalize('NFKD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/ß/g, 'ss')
  .replace(/[^a-zA-Z0-9ÄÖÜäöüß]+/g, '-')
  .replace(/^-+|-+$/g, '');
const slotName = String(Number(slot)).padStart(2, '0');
const root = path.join(process.cwd(), 'channels/elektrotechnik/reels', week, `${slotName}_${folderTitle}`);
if (fs.existsSync(root)) throw new Error(`Reel-Ordner existiert bereits: ${root}`);

for (const relative of ELECTRICAL_REEL_DIRECTORIES) fs.mkdirSync(path.join(root, relative), {recursive: true});
fs.mkdirSync(path.join(root, '02-bilder/images/00-cover'), {recursive: true});
const plan = createElectricalScenePlanTemplate({slug, title, hook, compositionId: 'ElectricalReel', sceneCount});
const visibleScenes = plan.scenes.filter((scene) => scene.renderMode !== 'mechanism-only');
const mechanismScenes = plan.scenes.filter((scene) => scene.renderMode === 'mechanism-only');
const write = (relative, content) => fs.writeFileSync(path.join(root, relative), content);
const writeJson = (relative, value) => write(relative, `${JSON.stringify(value, null, 2)}\n`);

write('README.md', `# ${title}\n\n## Direkter Hook\n\n> ${hook}\n\n## Medienbedarf\n\n- ${visibleScenes.length} sichtbare Szenenbilder\n- ${mechanismScenes.length} reine Remotion-Mechanismus-Szenen ohne Nutzerbild\n- ein Coverbild\n- eine deutsche Rohaufnahme\n\n## Verbindlicher Ablauf\n\n1. Recherche, Skript, Quellen und Visual-Plan fertigstellen.\n2. Vor jeglicher Bild- oder Audioerzeugung ausführen:\n\n\`\`\`bash\nnpm run electrical:preflight -- "${path.relative(process.cwd(), root)}"\n\`\`\`\n\n3. Erst nach bestandenem Preflight Bilder und Voice-over erzeugen.\n4. Danach \`npm run electrical:finish -- "${path.relative(process.cwd(), root)}"\` ausführen.\n`);
write('01-script-audio/script.md', `# Sprechtext – ${title}\n\n## Hook\n\n${hook}\n\n## Regeln\n\n- 115 bis 165 Wörter insgesamt\n- direkte Antwort unmittelbar nach der Frage\n- genau eine technische Aussage pro Szene\n- keine künstlichen Metaphern\n- Ziel nach 1,10×: ungefähr 42 bis 62 Sekunden\n\n## Szenen\n\n${plan.scenes.map((scene) => `### ${scene.id}\n\n**Voice:** ${scene.voiceText}\n`).join('\n')}\n`);
write('01-script-audio/script-fliesstext.txt', `${hook} Direkte, natürliche und fachlich belegte Erklärung ergänzen.\n`);
write('01-script-audio/voiceover.txt', `${hook} Direkte, natürliche und fachlich belegte Erklärung ergänzen.\n`);
write('01-script-audio/audio/00_AUDIO_HIER_EINFUEGEN.md', '# Audio hier einfügen\n\nErst nach bestandenem `electrical:preflight`. Rohaufnahme als `voiceover-raw.wav`, deutsch, trocken und ohne Musik ablegen.\n');
write('01-script-audio/sfx/README.md', '# Optionale SFX\n\nNur semantische SFX. Höchstens ein Cue pro Szene, WAV, 48 kHz.\n');

const sharedPromptRule = 'Premium stylized 3D editorial electrical illustration, one clear technical idea, one dominant subject, simplified credible geometry, calm seamless dark navy environment, no visible text, letters, numbers, labels, units, type plates, UI, logos or watermark, vertical 9:16, top 18 percent and bottom 25 percent clear.';
const coverPrompt = `One large, clean and immediately recognizable electrical subject for the question: ${title}. Keep the composition simple and leave calm space for a later Remotion title. Do not generate the title inside the image.\n\n${sharedPromptRule}\n`;
write('02-bilder/prompts/00-cover.txt', coverPrompt);
write('02-bilder/images/00-cover/00_BILD_HIER_EINFUEGEN.md', 'Finales textfreies Coverbild erst nach bestandenem Preflight hier ablegen.\n');

const combined = [
  `# Alle Bildprompts – ${title}`,
  '',
  '## Wichtig',
  '',
  `Nur ${visibleScenes.length} Szenenbilder erzeugen. Für reine Remotion-Mechanismus-Szenen wird kein Bild benötigt.`,
  '',
  '## Covertext',
  '',
  `> ${hook}`,
  '',
  '## Feste Regel',
  '',
  'Bilder enthalten keinerlei Schrift. Alle Texte werden in Remotion gesetzt.',
  '',
  '## 00 – Cover',
  '',
  coverPrompt.trim(),
  '',
];

for (const scene of plan.scenes) {
  fs.mkdirSync(path.join(root, scene.imageDir), {recursive: true});
  const isMechanismOnly = scene.renderMode === 'mechanism-only';
  const mechanismInstruction = isMechanismOnly
    ? 'REFERENCE BRIEF ONLY — DO NOT GENERATE AN IMAGE FOR THIS SCENE. Remotion will render the full mechanism on an internal clean canvas. Describe only the intended mechanism geometry for the developer.'
    : scene.layout === 'comparison'
      ? 'Create a clear side-by-side comparison with only two dominant subjects and no split-screen border.'
      : 'Create one large and centered subject that communicates exactly one technical statement.';
  const prompt = `${mechanismInstruction}\n\nScene statement to visualize: [GENAUE AUSSAGE FÜR ${scene.id} ERGÄNZEN].\n\n${sharedPromptRule}\n`;
  write(`02-bilder/prompts/${scene.id}.txt`, prompt);
  write(
    `${scene.imageDir}/00_BILD_HIER_EINFUEGEN.md`,
    isMechanismOnly
      ? `# Kein Nutzerbild erforderlich\n\n${scene.id} wird vollständig in Remotion animiert. Die Pipeline erzeugt intern eine temporäre Fläche.\n`
      : `Finales textfreies Bild für ${scene.id} erst nach bestandenem Preflight hier ablegen.\n`,
  );
  combined.push(
    `## ${scene.id}${isMechanismOnly ? ' – KEIN BILD ERZEUGEN' : ''}`,
    '',
    prompt.trim(),
    '',
  );
}
write('02-bilder/bildprompts.md', `${combined.join('\n')}\n`);
write('02-bilder/ALLE-BILDPROMPTS-MIT-COVER.txt', `${combined.join('\n')}\n`);
write('02-bilder/images/00_BILDER_HIER_EINFUEGEN.md', `# Bilder hier einfügen\n\nErst nach bestandenem Preflight. Benötigt werden ein Cover und ${visibleScenes.length} textfreie 9:16-Szenenbilder. Für ${mechanismScenes.length} mechanism-only-Szenen wird kein Nutzerbild benötigt.\n`);

write('03-caption/00_CAPTION_INFO.md', '# Caption\n\nWortzeiten werden ausschließlich aus dem finalen 1,10×-Audio erzeugt. Weiß, ohne Box, maximal zwei Zeilen.\n');
write('03-caption/social-caption.md', `# Social Caption\n\n${title}\n`);
write('04-pdf/inhalt.md', `# Lernzettel – ${title}\n\nNur erstellen, wenn der Reel einen echten Lernzettel verspricht.\n`);
write('05-export/README.md', '# Export\n\nFinale Dateien werden erst nach bestandener Readiness- und Render-QA erzeugt.\n');
write('05-export/video/README.md', '# Finales Video\n');
write('06-projektdateien/motion-design.md', `# Motion Design\n\n## Budget\n\n- maximal vier Vollanimationen\n- Hook niemals als Vollanimation\n- keine zwei Vollanimationen direkt hintereinander\n- mechanism-only benötigt kein Nutzerbild\n- Bild-plus-Mechanismus-Overlay nur mit schriftlicher Begründung\n\n| Szene | Render-Modus | Bewegung | Nutzerbild | Mechanismus |\n|---|---|---|---|---|\n${plan.scenes.map((scene) => `| ${scene.id} | ${scene.renderMode} | ${scene.motionLevel} | ${scene.renderMode === 'mechanism-only' ? 'nein' : 'ja'} | ${scene.mechanism ?? 'keiner'} |`).join('\n')}\n`);
write('06-projektdateien/sources.md', '# Quellen\n\nFachliche Quellen mit stabilen IDs dokumentieren.\n');
write('06-projektdateien/storyboard.md', `# Storyboard – ${title}\n\n| Szene | eine Aussage | Bild | Render-Modus | Voice |\n|---|---|---|---|---|\n${plan.scenes.map((scene) => `| ${scene.id} | ergänzen | ${scene.renderMode === 'mechanism-only' ? 'kein Nutzerbild' : 'ergänzen'} | ${scene.renderMode} | ergänzen |`).join('\n')}\n`);
writeJson('06-projektdateien/scene-plan.json', plan);
writeJson('06-projektdateien/prompt-manifest.json', createElectricalPromptManifestTemplate(plan));
writeJson('06-projektdateien/visual-policy.json', {
  version: 'visual-v2',
  hook,
  generatedImageTextPolicy: 'none',
  maximumFullMechanismAnimations: 4,
  fullMechanismSceneIds: plan.animationBudget.fullMechanismScenes,
  requiredVisibleSceneImages: visibleScenes.length,
  mechanismOnlyScenesWithoutUserImages: mechanismScenes.map((scene) => scene.id),
  imagesBeforePreflightAllowed: false,
});
writeJson('06-projektdateien/production-status.json', createElectricalStatusTemplate(plan));
writeJson('06-projektdateien/asset-manifest.json', {version: 'electrical-v2', slug, generatedAt: new Date().toISOString(), assets: []});
writeJson('06-projektdateien/content-package-report.json', {version: 'electrical-v2', passed: false, status: 'noch-nicht-geprueft'});
writeJson('06-projektdateien/creative-qa-report.json', {version: 'electrical-v2', passed: false, status: 'noch-nicht-geprueft'});
writeJson('06-projektdateien/script-qa-report.json', {version: 'electrical-v2', passed: false, status: 'noch-nicht-geprueft'});
writeJson('06-projektdateien/preproduction-report.json', {version: 'electrical-v2', passed: false, status: 'blocked-before-assets'});
writeJson('06-projektdateien/qa-report.json', {version: 'electrical-v2', passed: false, status: 'noch-nicht-gerendert'});
writeJson('06-projektdateien/ready-report.json', {version: 'electrical-v2', ready: false, status: 'in-vorbereitung'});
write('06-projektdateien/render/README.md', '# Arbeitsrender und Kontrollbilder\n');

console.log(`✓ Neuer visual-v2 Elektrotechnik-Reel: ${root}`);
console.log(`  Sichtbare Szenenbilder: ${visibleScenes.length}`);
console.log(`  Reine Remotion-Szenen ohne Nutzerbild: ${mechanismScenes.length}`);
console.log('Nächster Schritt vor Bildern oder Audio: electrical:preflight');
