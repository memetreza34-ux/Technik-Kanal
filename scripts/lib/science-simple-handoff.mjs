import fs from 'node:fs';
import path from 'node:path';

const read=file=>fs.readFileSync(file,'utf8').trim();
const load=file=>JSON.parse(read(file));
const put=(file,content)=>{
  fs.mkdirSync(path.dirname(file),{recursive:true});
  if(!fs.existsSync(file)||fs.readFileSync(file,'utf8')!==content)fs.writeFileSync(file,content);
};
const isUnder=(root,file)=>file.startsWith(root+path.sep);
export function buildScienceSimpleHandoff({repoRoot,projectDir,repository='memetreza34-ux/Technik-Kanal',ref='science-channel-v1'}){
  const root=path.resolve(repoRoot),project=path.resolve(projectDir);
  if(!isUnder(root,project))throw Error('Videoordner muss innerhalb des Repos liegen.');
  const file=rel=>path.join(project,rel);
  const plan=load(file('06-projektdateien/scene-plan.json'));
  const flow=load(file('06-projektdateien/flow-plan.json'));
  const gate=load(file('06-projektdateien/preproduction-report.json'));
  if(gate.passed!==true||gate.phase!=='assets-may-be-created')throw Error('Phase 1 ist noch nicht freigegeben.');
  if(!Array.isArray(plan.scenes)||!plan.scenes.length||!Array.isArray(flow.steps)||flow.steps.length!==5)throw Error('Szenen/Bildschritte unvollständig.');
  const ids=plan.scenes.map(s=>s.id);
  if(flow.steps.flatMap(step=>step.sceneIds||[]).join('|')!==ids.join('|'))throw Error('Bildschritte decken Szenen nicht korrekt ab.');
  const voice=read(file('01-script-audio/voiceover.txt'));
  const expectedVoice=plan.scenes.map(s=>s.voiceText.trim()).join('\n\n');
  if(!voice||voice.replace(/\s+/g,' ')!==expectedVoice.replace(/\s+/g,' '))throw Error('Der Fließtext stimmt nicht mit dem finalen Szenenplan überein.');
  const cover=read(file('02-bilder/prompts/00-thumbnail.txt'));
  if(!cover||!/THUMBNAIL/i.test(cover))throw Error('Coverprompt fehlt.');
  const stepTexts=flow.steps.map((step,index)=>{
    const lines=[
      `GOOGLE FLOW – WISSONAUT – BILDSCHRITT ${index+1}/5`,
      'Nur statische 16:9-Bilder im Technical Editorial Explainer 2.5D-Stil.',
      'Jedes Bild einzeln erstellen, auf Inhalt/Text/Qualität prüfen und korrekt als -final speichern.',
      'Keine Produktionsnummern oder Dateinamen ins Bild schreiben.',
      'Diese neun Szenen in Reihenfolge bearbeiten, nicht alle zu einer Collage zusammenfassen.',
      index===0?'Zuerst die drei Coverkandidaten aus 02-FLOW-COVER.txt erstellen und auf die Nutzerwahl warten. Danach Bildschritt 1.':'Die Cover-Auswahl ist bereits erledigt; NICHT neu erzeugen.',
      '',
    ];
    for(const id of step.sceneIds){
      const prompt=read(file('02-bilder/prompts/'+id+'.txt'));
      if(!prompt||!prompt.includes('Technical Editorial Explainer 2.5D')||!prompt.includes('VISIBLE TEXT LOCK'))throw Error('Prompt nicht final oder Stilregeln fehlen: '+id);
      lines.push('----- '+id+' -----','',prompt,'');
    }
    lines.push(index===4?'GESAMTABSCHLUSS: alle Szenen auf Vollständigkeit prüfen; nur finale Bilder behalten.':'WEITER: Ohne weitere Rückfrage direkt Bildschritt '+(index+2)+'/5.');
    return lines.join('\n')+'\n';
  });
  const pack=path.join(root,'START-HIER',plan.slug);
  put(path.join(pack,'01-SKRIPT.txt'),voice+'\n');
  put(path.join(pack,'02-FLOW-COVER.txt'),cover+'\n');
  for(let i=0;i<5;i++)put(path.join(pack,`${String(i+3).padStart(2,'0')}-FLOW-BILDER-${i+1}.txt`),stepTexts[i]);
  const info=path.join(pack,'DATEIEN-HIER-REIN/HIER-ABLEGEN.txt');
  if(!fs.existsSync(info))put(info,
    'Hier alle finalen Bilder und eine Sprachaufnahme ablegen.\n'+
    `Szenenbilder 01.png bis ${String(plan.scenes.length).padStart(2,'0')}.png oder die Szenen-IDs mit -final benennen.\n`+
    'Cover: 00-thumbnail-final.png; Sprache: voiceover-raw.wav.\n'+
    'Keine Unterordner. Die Originaldateien bleiben bei der Übernahme erhalten.\n');
  const projectIndex=file('PHASE-1-START-HIER.md');
  put(projectIndex,`# Einfache Produktionsmappe\n\n**Bitte nur diesen Ordner nutzen:** [START-HIER/${plan.slug}](../../../../../START-HIER/${plan.slug})\n\nEine Skriptdatei als Fließtext, ein Coverprompt, fünf Bildpakete und genau ein Ordner für alle fertigen Dateien. Die technischen Originale bleiben für die Videomontage erhalten.\n`);
  const url=`https://github.com/${repository}/tree/${encodeURIComponent(ref)}/START-HIER/${encodeURIComponent(plan.slug)}`;
  return {folder:pack,url,sceneCount:ids.length,script:path.join(pack,'01-SKRIPT.txt'),flowPrompts:6,dropFolder:path.join(pack,'DATEIEN-HIER-REIN')};
}
