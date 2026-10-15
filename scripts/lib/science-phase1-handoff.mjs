import fs from 'node:fs';
import path from 'node:path';

export function buildSciencePhase1Handoff({projectDir,repoRoot,repository="memetreza34-ux/Technik-Kanal",ref="science-channel-v1"}){
  const read=file=>fs.readFileSync(file,"utf8").trim();
  const json=file=>JSON.parse(read(file));
  const relative=(root,target)=>path.relative(root,target).split(path.sep).join("/");
  const encode=filename=>filename.split("/").map(encodeURIComponent).join("/");
  const fence=value=>"`".repeat(Math.max(4,...[...value.matchAll(/`+/g)].map(x=>x[0].length+1)));
  const placeholder=/NOCH NICHT FINAL|\bUNGEPLANT\b|\b(?:TBD|TODO)\b|\[(?:PLACEHOLDER|PLATZHALTER)\]|VOLLSTÄNDIGEN.{0,80}ERGÄNZEN/i;
  const root=path.resolve(projectDir),repoDir=path.resolve(repoRoot),projectPath=relative(repoDir,root);
  if(!projectPath||projectPath.startsWith("..")||path.isAbsolute(projectPath))throw Error("Videoordner muss im Repo liegen.");
  if(!/^[\w.-]+\/[\w.-]+$/.test(repository)||!ref||ref.includes("..")||ref.includes(" "))throw Error("Ungültiges Repo/Ref.");
  const inside=name=>path.join(root,name);
  const planFile=inside("06-projektdateien/scene-plan.json");
  const flowFile=inside("06-projektdateien/flow-plan.json");
  const preflightFile=inside("06-projektdateien/preproduction-report.json");
  const masterFile=inside("02-bilder/GOOGLE-FLOW-MASTER-PROMPT.txt");
  const coverFile=inside("02-bilder/prompts/00-thumbnail.txt");
  const scriptFile=inside("01-script-audio/script.md");
  for(const file of [planFile,flowFile,preflightFile,masterFile,coverFile,scriptFile])
    if(!fs.existsSync(file))throw Error("Phase 1 unvollständig, fehlt: "+relative(root,file));
  const plan=json(planFile),flow=json(flowFile),gate=json(preflightFile);
  if(gate.passed!==true||gate.phase!=="assets-may-be-created")throw Error("Phase 1 noch nicht freigegeben: science:preflight muss erfolgreich sein.");
  if(!Array.isArray(plan.scenes)||!plan.scenes.length||flow.scenes?.length!==plan.scenes.length||flow.imageOnly!==true||flow.imageProductionSteps!==5)throw Error("Szenen-/Flow-Plan ist nicht vollständig.");
  if(!Array.isArray(flow.steps)||flow.steps.length!==5||flow.steps.flatMap(g=>g.sceneIds??[]).join("|")!==plan.scenes.map(s=>s.id).join("|"))throw Error("Fünf Bildschritte entsprechen nicht allen Szenen.");
  const master=read(masterFile),cover=read(coverFile),script=read(scriptFile);
  if(!master||!cover||!script||[master,cover,script].some(t=>placeholder.test(t)))throw Error("Skript oder Prompts enthalten Platzhalter.");
  if(!master.includes("Technical Editorial Explainer 2.5D")||!master.includes("VISIBLE TEXT LOCK")||!master.includes(cover))throw Error("Google-Flow-Masterprompt ist nicht aktuell oder Style/Text-Lock fehlt.");
  const prompts=[],seen=new Set();
  for(const scene of plan.scenes){
    if(!scene.id||seen.has(scene.id)||!String(scene.voiceText??"").trim()||placeholder.test(scene.voiceText))throw Error("Szene/Sprechertext ungültig: "+scene.id);
    seen.add(scene.id);
    const file=inside("02-bilder/prompts/"+scene.id+".txt");
    if(!fs.existsSync(file))throw Error("Bildprompt fehlt: "+scene.id);
    const text=read(file);
    if(!text||placeholder.test(text)||!master.includes(text))throw Error("Masterprompt nicht aktuell oder Szene unvollständig: "+scene.id);
    prompts.push({scene,file});
  }
  const base=`https://github.com/${repository}/blob/${encodeURIComponent(ref)}`;
  const raw=`https://raw.githubusercontent.com/${repository}/${encodeURIComponent(ref)}`;
  const github=file=>base+"/"+encode(relative(repoDir,file));
  const rawUrl=file=>raw+"/"+encode(relative(repoDir,file));
  const voice=plan.scenes.map(s=>s.voiceText.trim()).join("\n\n");
  const vFence=fence(voice),mFence=fence(master);
  const lines=[
    `# Phase 1 fertig – ${plan.title||plan.slug}`,"",
    "**WISSONAUT · KOPIERMAPPE FÜR GOOGLE FLOW UND VOICE-OVER**","",
    "> Eine zentrale GitHub-Seite: Skript und alle Bildprompts direkt am Laptop öffnen und kopieren. Die Prompts erzeugen nur statische Bilder. Das gewählte Cover ist keine Videoszene.","",
    "## Drei Direktlinks","",
    `1. **Alle Google-Flow-Prompts:** [Masterprompt auf GitHub](${github(masterFile)}) · [reinen Text öffnen](${rawUrl(masterFile)})`,
    `2. **Komplettes Skript:** [Skript auf GitHub](${github(scriptFile)}) · [reinen Text öffnen](${rawUrl(scriptFile)})`,
    `3. **Drei Thumbnail-Ideen:** [Cover-Prompt öffnen](${github(coverFile)})`,"",
    `**Vollständigkeit:** ${prompts.length} Szenenprompts · 5 Bildschritte · 16:9 · separater Thumbnail-Prompt.`,"",
    "## Vollständiger Sprechertext zum Kopieren","",
    "Dieser Text folgt exakt den `voiceText`-Feldern des final freigegebenen Szenenplans.","",
    vFence,voice,vFence,"",
    "## Google Flow – vollständiger Masterprompt zum Kopieren","",
    "Erst drei Cover-Kandidaten erzeugen und auf deine Auswahl warten. Danach alle fünf Bildschritte einzeln und automatisch abarbeiten, ohne das Cover in das Video zu übernehmen.","",
    mFence,master,mFence,"",
    "## Jeder Bildprompt einzeln öffnen","",
    "| Bildschritt | Szene | Voice-over-Auszug | Link |",
    "|---|---|---|---|"
  ];
  const entries=new Map(prompts.map(item=>[item.scene.id,item]));
  for(const group of flow.steps)for(const id of group.sceneIds){
    const item=entries.get(id);
    if(!item)throw Error("Bildschritt verweist auf unbekannte Szene: "+id);
    const excerpt=item.scene.voiceText.replace(/[\n\r|]/g," ").replace(/\s+/g," ").slice(0,95);
    lines.push(`| ${group.step}/5 | ${id} | ${excerpt} | [Prompt kopieren](${github(item.file)}) |`);
  }
  lines.push("","## Nach Google Flow","",
    "- Gewähltes Thumbnail separat unter `05-export/cover/00-thumbnail-final.*` exportieren und Szene 01 als eigenständiges Erklärbild erzeugen.",
    "- Jedes finale Szenenbild in `02-bilder/images/<scene-id>/` ablegen.",
    "- Montageagenten dürfen niemals Bilder selbst erstellen, ersetzen oder fehlende Szenen überspringen.",
    "- Diese Kopiermappe erst nach erfolgreichem Commit/Push als GitHub-Link versenden.","");
  const output=inside("PHASE-1-START-HIER.md"),content=lines.join("\n")+"\n";
  if(!fs.existsSync(output)||fs.readFileSync(output,"utf8")!==content)fs.writeFileSync(output,content);
  return {output,url:github(output),sceneCount:prompts.length};
}
