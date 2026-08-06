#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {createElectricalPromptManifestTemplate,createElectricalScenePlanTemplate,createElectricalStatusTemplate} from './lib/create-electrical-scene-plan-template.mjs';
import {ELECTRICAL_REEL_DIRECTORIES} from './lib/electrical-project-structure.mjs';

const args=process.argv.slice(2);
const option=(name)=>args.find((arg)=>arg.startsWith(`--${name}=`))?.slice(name.length+3);
const week=option('week');const slot=option('slot');const title=option('title');const hookOption=option('hook');const sceneCount=Number(option('scenes')??9);
if(!week||!slot||!title){console.error('Nutzung: npm run electrical:new -- --week=2026-08-10_bis_2026-08-16 --slot=01 --title="FI-Schalter" --hook="Was macht ein FI-Schalter?" [--scenes=9]');process.exit(1);}
if(!/^\d{4}-\d{2}-\d{2}_bis_\d{4}-\d{2}-\d{2}$/.test(week)) throw new Error(`Ungültiger Wochenname: ${week}`);
if(!/^\d{1,2}$/.test(slot)) throw new Error(`Ungültiger Slot: ${slot}`);
if(!Number.isInteger(sceneCount)||sceneCount<8||sceneCount>10) throw new Error('Szenenzahl muss zwischen 8 und 10 liegen.');
const hook=(hookOption??(title.trim().endsWith('?')?title.trim():'')).trim();
if(!hook||!hook.endsWith('?')) throw new Error('Ein direkter Frage-Hook ist Pflicht.');
if(hook.split(/\s+/).filter(Boolean).length>8) throw new Error('Hook ist länger als acht Wörter.');
const slug=title.normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/ß/g,'ss').replace(/[^a-zA-Z0-9]+/g,'-').replace(/^-+|-+$/g,'').toLowerCase();
const folderTitle=title.normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/ß/g,'ss').replace(/[^a-zA-Z0-9ÄÖÜäöüß]+/g,'-').replace(/^-+|-+$/g,'');
const root=path.join(process.cwd(),'channels/elektrotechnik/reels',week,`${String(Number(slot)).padStart(2,'0')}_${folderTitle}`);
if(fs.existsSync(root)) throw new Error(`Reel-Ordner existiert bereits: ${root}`);
for(const relative of ELECTRICAL_REEL_DIRECTORIES) fs.mkdirSync(path.join(root,relative),{recursive:true});
fs.mkdirSync(path.join(root,'02-bilder/images/00-cover'),{recursive:true});
const plan=createElectricalScenePlanTemplate({slug,title,hook,compositionId:'ElectricalReel',sceneCount});
const visible=plan.scenes.filter((scene)=>scene.renderMode!=='mechanism-only');
const mechanism=plan.scenes.filter((scene)=>scene.renderMode==='mechanism-only');
const write=(relative,content)=>fs.writeFileSync(path.join(root,relative),content);
const writeJson=(relative,value)=>write(relative,`${JSON.stringify(value,null,2)}\n`);

write('README.md',`# ${title}\n\n## Hook\n\n> ${hook}\n\n## Visual-v5\n\n- ${visible.length} textfreie Basisbilder\n- ${mechanism.length} Remotion-Szenen ohne Nutzerbild\n- zwei bis vier Serienreferenzen statt unabhängiger Bilder\n- deutsche Labels werden nach der Bildgenerierung kontrolliert eingebrannt\n\nVor Bildern und Audio: \`npm run electrical:preflight -- "${path.relative(process.cwd(),root)}"\`.\n`);
write('01-script-audio/script.md',`# Sprechtext – ${title}\n\n## Hook\n\n${hook}\n\n## Regeln\n\n- 115 bis 165 Wörter\n- direkte Antwort\n- eine Aussage pro Szene\n- keine künstlichen Metaphern\n`);
write('01-script-audio/script-fliesstext.txt',`${hook} Direkte, natürliche und fachlich belegte Erklärung ergänzen.\n`);
write('01-script-audio/voiceover.txt',`${hook} Direkte, natürliche und fachlich belegte Erklärung ergänzen.\n`);
write('01-script-audio/audio/00_AUDIO_HIER_EINFUEGEN.md','# Audio erst nach bestandenem Preflight als voiceover-raw.wav einfügen.\n');
write('01-script-audio/sfx/README.md','# Optionale semantische SFX, maximal ein Cue pro Szene.\n');

const style='Create a full-bleed cinematic industrial editorial photograph or cinematic technical visualization with real European components and real-world proportions. Use the assigned series reference, a consistent teal-shadow and warm-highlight color grade, natural lens depth and believable materials. This is not a catalog shot, not a floating product and not a blank studio image. No visible text, no labels, no letters, no numbers, no logos and no watermark. Full-bleed vertical 9:16 edge-to-edge, no white or gray bars, no blank panel, no frame and no letterboxing. Bottom 25 percent calm for subtitles.';
const coverPrompt=`Create one dominant real electrical anchor object as a low three-quarter hero image. This image becomes the first series reference.\n\n${style}\n`;
write('02-bilder/prompts/00-cover.txt',coverPrompt);
write('02-bilder/images/00-cover/00_BILD_HIER_EINFUEGEN.md','Textfreies Basis-Coverbild hier ablegen. Der deutsche Hook wird kontrolliert eingebrannt.\n');
const combined=[`# Alle Bildprompts – ${title}`,'',`Finaler Covertext: ${hook}`,'','Nach dem Einfügen: npm run electrical:label-images -- "<reel-ordner>"','','## Cover','',coverPrompt.trim(),''];
for(const scene of plan.scenes){
  fs.mkdirSync(path.join(root,scene.imageDir),{recursive:true});
  const isMechanism=scene.renderMode==='mechanism-only';
  const instruction=isMechanism?'REFERENCE BRIEF ONLY for a Remotion mechanism canvas. Do not generate a user image.':'Use the assigned uploaded series reference. Create one clear technical action or consequence with the specified shot type. Scene statement: [GENAUE AUSSAGE ERGÄNZEN].';
  const prompt=`${instruction}\n\nReference group: ${scene.referenceGroup}. Set family: ${scene.backgroundFamily}. Shot type: ${scene.shotType}.\n\n${style}\n`;
  write(`02-bilder/prompts/${scene.id}.txt`,prompt);
  write(`${scene.imageDir}/00_BILD_HIER_EINFUEGEN.md`,isMechanism?'# Kein Nutzerbild erforderlich.\n':`Textfreies Basisbild hier ablegen. Finales deutsches Label: ${scene.imageLabel}\n`);
  combined.push(`## ${scene.id}${isMechanism?' – KEIN NUTZERBILD':''}`,'',`Finales deutsches Label: ${scene.imageLabel}`,'',prompt.trim(),'');
}
write('02-bilder/ALLE-BILDPROMPTS-MIT-COVER.txt',`${combined.join('\n')}\n`);
write('02-bilder/bildprompts.md','# Vollständige Prompt-Sammlung siehe ALLE-BILDPROMPTS-MIT-COVER.txt.\n');
write('02-bilder/REFERENZ-WORKFLOW.md','# Referenz-Workflow\n\nErzeuge zuerst die Anchor-Referenzen und nutze sie für alle Szenen derselben referenceGroup. Basisbilder bleiben textfrei.\n');
write('02-bilder/images/00_BILDER_HIER_EINFUEGEN.md',`Benötigt: Cover plus ${visible.length} textfreie Basisbilder. Danach electrical:label-images ausführen.\n`);
write('03-caption/00_CAPTION_INFO.md','# Wortzeiten aus finalem 1,10×-Audio. Weiß, ohne Box, maximal zwei Zeilen.\n');
write('03-caption/social-caption.md',`# Social Caption\n\n${title}\n`);
write('04-pdf/inhalt.md',`# Lernzettel – ${title}\n`);
write('05-export/README.md','# Export erst nach bestandener Readiness- und Render-QA.\n');
write('05-export/video/README.md','# Finales Video\n');
write('06-projektdateien/motion-design.md','# Motion Design\n\n- maximal vier Vollanimationen\n- Referenz-basierte Bildserie\n- keine KI-Schrift\n- deutsche Labels kontrolliert einbrennen\n');
write('06-projektdateien/sources.md','# Quellen\n\nFachliche Quellen mit stabilen IDs ergänzen.\n');
write('06-projektdateien/storyboard.md',`# Storyboard – ${title}\n`);
writeJson('06-projektdateien/scene-plan.json',plan);
writeJson('06-projektdateien/prompt-manifest.json',createElectricalPromptManifestTemplate(plan));
writeJson('06-projektdateien/visual-policy.json',{version:'visual-v5',hook,generatedImageTextPolicy:'controlled-german-overlay',minimumBackgroundFamilies:3,maximumBackgroundFamilies:4,minimumShotTypes:4,maximumFullMechanismAnimations:4,fullMechanismSceneIds:plan.animationBudget.fullMechanismScenes,requiredVisibleSceneImages:visible.length});
writeJson('06-projektdateien/production-status.json',createElectricalStatusTemplate(plan));
writeJson('06-projektdateien/asset-manifest.json',{version:'electrical-v5',slug,generatedAt:new Date().toISOString(),assets:[]});
for(const name of ['content-package-report','creative-qa-report','script-qa-report','preproduction-report','qa-report','ready-report']) writeJson(`06-projektdateien/${name}.json`,{version:'electrical-v5',passed:false,status:'noch-nicht-geprueft'});
write('06-projektdateien/render/README.md','# Arbeitsrender und Kontrollbilder\n');
console.log(`✓ Neuer visual-v5 Reel: ${root}`);
console.log('Zuerst Platzhalter ersetzen und electrical:preflight ausführen.');
