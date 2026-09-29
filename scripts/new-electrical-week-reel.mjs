#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {createElectricalPromptManifestTemplate,createElectricalScenePlanTemplate,createElectricalStatusTemplate} from './lib/create-electrical-scene-plan-template.mjs';
import {ELECTRICAL_REEL_DIRECTORIES} from './lib/electrical-project-structure.mjs';

const args=process.argv.slice(2);
const option=(name)=>args.find((arg)=>arg.startsWith(`--${name}=`))?.slice(name.length+3);
const week=option('week');
const slot=option('slot');
const title=option('title');
const hookOption=option('hook');
const sceneCount=Number(option('scenes')??10);

if(!week||!slot||!title){
  console.error('Nutzung: npm run science:new -- --week=2026-10-01_bis_2026-10-07 --slot=01 --title="Warum ist der Himmel blau?" --hook="Warum ist der Himmel blau?" [--scenes=10]');
  process.exit(1);
}
if(!/^\d{4}-\d{2}-\d{2}_bis_\d{4}-\d{2}-\d{2}$/.test(week)) throw new Error(`Ungültiger Wochenname: ${week}`);
if(!/^\d{1,2}$/.test(slot)) throw new Error(`Ungültiger Slot: ${slot}`);
if(!Number.isInteger(sceneCount)||sceneCount<6||sceneCount>16) throw new Error('Visuelle Beats müssen zwischen 6 und 16 liegen. Die endgültige Anzahl richtet sich nach dem Inhalt.');

const hook=(hookOption??(title.trim().endsWith('?')?title.trim():'')).trim();
if(!hook||!hook.endsWith('?')) throw new Error('Ein direkter Frage-Hook ist Pflicht.');
if(hook.split(/\s+/).filter(Boolean).length>10) throw new Error('Hook ist länger als zehn Wörter.');

const slug=title.normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/ß/g,'ss').replace(/[^a-zA-Z0-9]+/g,'-').replace(/^-+|-+$/g,'').toLowerCase();
const folderTitle=title.normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/ß/g,'ss').replace(/[^a-zA-Z0-9ÄÖÜäöüß]+/g,'-').replace(/^-+|-+$/g,'');
const root=path.join(process.cwd(),'channels/elektrotechnik/reels',week,`${String(Number(slot)).padStart(2,'0')}_${folderTitle}`);
if(fs.existsSync(root)) throw new Error(`Reel-Ordner existiert bereits: ${root}`);

for(const relative of ELECTRICAL_REEL_DIRECTORIES) fs.mkdirSync(path.join(root,relative),{recursive:true});

const plan=createElectricalScenePlanTemplate({slug,title,hook,compositionId:'ScienceReel',sceneCount});
const write=(relative,content)=>{const file=path.join(root,relative);fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,content);};
const writeJson=(relative,value)=>write(relative,`${JSON.stringify(value,null,2)}\n`);

write('README.md',`# ${title}\n\n## Hook\n\n> ${hook}\n\n## Produktionsmodus\n\n- Science Static v1\n- Cinematic Scientific 3D Editorial\n- ${sceneCount} geplante visuelle Beats als Startwert\n- jedes Bild erklärt genau eine Aussage\n- Bild 01 ist Cover-Hintergrund und erste Szene\n- für Bild 01 drei Kandidaten erzeugen, einen Gewinner auswählen\n- keine KI-Schrift\n- Remotion erzeugt keine Animationen oder Kamerabewegungen\n- harte Schnitte zwischen statischen Bildern\n\nVor Bildern und Audio: \`npm run science:preflight -- "${path.relative(process.cwd(),root)}"\`.\n`);

write('01-script-audio/script.md',`# Sprechtext – ${title}\n\n## Hook\n\n${hook}\n\n## Regeln\n\n- direkte Antwort\n- eine fachliche Aussage pro visueller Einheit\n- Fachbegriffe kurz erklären\n- keine künstlichen Metaphern\n- Aussagen mit Quellen absichern\n`);
write('01-script-audio/script-fliesstext.txt',`${hook} Direkte, natürliche und fachlich belegte Erklärung ergänzen.\n`);
write('01-script-audio/voiceover.txt',`${hook} Direkte, natürliche und fachlich belegte Erklärung ergänzen.\n`);
write('01-script-audio/audio/00_AUDIO_HIER_EINFUEGEN.md','# Audio erst nach bestandenem Preflight als voiceover-raw.wav einfügen.\n');
write('01-script-audio/sfx/README.md','# Optionale semantische SFX. Keine Musik und keine dekorative Dauerbeschallung.\n');

const masterStyle=`Cinematic Scientific 3D Editorial. High-end stylized scientific 3D illustration, scientifically plausible, realistic materials and believable proportions, modern adult editorial look, clear spatial depth, controlled studio lighting, one dominant subject, maximum one to three supporting elements, strong mobile readability, vertical 9:16 edge-to-edge. Use dark navy, blue-black or neutral scientific environments when appropriate, but allow lighter scenes when the subject requires it. Use color semantically: cyan/blue for energy or signals, gold for explanation, orange for heat, red only for danger or critical states, and natural material colors for chemistry, matter, planets, liquids and real objects. No visible text, labels, letters, numbers, formulas, logos, watermark, UI cards, decorative icons, white bars, gray bars, letterboxing, split backgrounds or visible seams. Keep the upper 18 percent visually calm for optional controlled title text and the lower 25 percent calm for subtitles. The final image must work completely without animation.`;

const coverPrompt=`SCENE 01 / COVER SOURCE\nCreate three distinct composition candidates for the first scene. All three must visualize the same central question and use the same channel style. Do not create a separate thumbnail style. The selected winner becomes both the first video image and the cover background.\n\nCentral question: ${hook}\n\n${masterStyle}\n`;
write('02-bilder/prompts/00-cover.txt',coverPrompt);

const combined=[`# Alle Bildprompts – ${title}`,'',`Finaler Covertext: ${hook}`,'','## Cover / Bild 01 – drei Kandidaten','',coverPrompt.trim(),''];

for(const [index,scene] of plan.scenes.entries()){
  fs.mkdirSync(path.join(root,scene.imageDir),{recursive:true});
  const prompt=`SCENE ${String(index+1).padStart(2,'0')}\nThe viewer must immediately understand exactly one scientific statement.\nScientific statement: [GENAUE FACHLICHE AUSSAGE ERGÄNZEN]\nMain subject: ${scene.visualRecipe.subject}\nVisual focus: ${scene.visualRecipe.focus}\nSuggested framing: ${scene.visualRecipe.camera}.\nDo not visualize a second competing idea. Do not add motion cues that require animation.\n\n${masterStyle}\n`;
  write(`02-bilder/prompts/${scene.id}.txt`,prompt);
  write(`${scene.imageDir}/00_BILD_HIER_EINFUEGEN.md`,index===0
    ? '# Drei Kandidaten erzeugen. Danach genau einen Gewinner als final/approved Bild in diesem Ordner behalten.\n'
    : '# Genau ein finales freigegebenes 9:16-Szenenbild hier ablegen.\n');
  combined.push(`## ${scene.id}`,'',prompt.trim(),'');
}

write('02-bilder/ALLE-BILDPROMPTS-MIT-COVER.txt',`${combined.join('\n')}\n`);
write('02-bilder/bildprompts.md','# Vollständige Prompt-Sammlung siehe ALLE-BILDPROMPTS-MIT-COVER.txt.\n');
write('02-bilder/REFERENZ-WORKFLOW.md','# Referenz-Workflow\n\nDie gesamte Serie verwendet Cinematic Scientific 3D Editorial. Wiederkehrende Objekte oder Materialien müssen innerhalb eines Reels konsistent aussehen. Bild 01 definiert die visuelle Grundqualität, ist aber keine starre Motivvorlage für fachlich andere Szenen.\n');
write('02-bilder/images/00_BILDER_HIER_EINFUEGEN.md',`Benötigt werden ${sceneCount} freigegebene Szenenbilder. Bild 01 dient zusätzlich als Cover-Hintergrund.\n`);

write('03-caption/00_CAPTION_INFO.md','# Wortzeiten aus finalem Audio. Weiß, ohne Box, maximal zwei Zeilen und ohne Einblendanimation.\n');
write('03-caption/social-caption.md',`# Social Caption\n\n${title}\n`);
write('04-pdf/inhalt.md',`# Lernzettel – ${title}\n`);
write('05-export/README.md','# Export erst nach bestandener Readiness- und Render-QA.\n');
write('05-export/video/README.md','# Finales Video\n');
write('06-projektdateien/motion-design.md','# Static Edit Contract\n\n- keine Animationen\n- keine Kamerabewegung\n- keine Zooms oder Pans\n- keine Crossfades als Standard\n- statische Szenenbilder\n- harte Schnitte\n- statische kontrollierte Text-Overlays nur wenn fachlich nötig\n');
write('06-projektdateien/sources.md','# Quellen\n\nFachliche Quellen mit stabilen IDs ergänzen.\n');
write('06-projektdateien/storyboard.md',`# Storyboard – ${title}\n\nJeder Beat beschreibt genau eine Aussage und genau ein dafür vorgesehenes statisches Bild.\n`);

writeJson('06-projektdateien/scene-plan.json',plan);
writeJson('06-projektdateien/prompt-manifest.json',createElectricalPromptManifestTemplate(plan));
writeJson('06-projektdateien/visual-policy.json',{
  version:'science-static-v1',
  styleId:'cinematic-scientific-3d-editorial-v1',
  generatedImageTextPolicy:'none',
  animationAllowed:false,
  cameraMotionAllowed:false,
  transitionPolicy:'hard-cut',
  coverUsesFirstScene:true,
  coverCandidateCount:3,
  adaptiveVisualBeatCount:true,
  requiredVisibleSceneImages:sceneCount
});
writeJson('06-projektdateien/production-status.json',createElectricalStatusTemplate(plan));
writeJson('06-projektdateien/asset-manifest.json',{version:'science-v1',slug,generatedAt:new Date().toISOString(),assets:[]});
for(const name of ['content-package-report','creative-qa-report','script-qa-report','preproduction-report','qa-report','ready-report']) writeJson(`06-projektdateien/${name}.json`,{version:'science-v1',passed:false,status:'noch-nicht-geprueft'});
write('06-projektdateien/render/README.md','# Arbeitsrender und Kontrollbilder\n');

console.log(`✓ Neuer Science-Static-Reel: ${root}`);
console.log('Zuerst Recherche, Skript, Quellen, Bildplan und Prompts vervollständigen; danach science:preflight ausführen.');
