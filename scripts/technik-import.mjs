#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {importScienceDrop} from './lib/science-simple-import.mjs';

const repoRoot=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const args=process.argv.slice(2);
const named=args.find(x=>!x.startsWith('--'));
let folder;
if(named)folder=path.resolve(named);
else{
  const base=path.join(repoRoot,'START-HIER');
  const options=fs.readdirSync(base,{withFileTypes:true}).filter(x=>x.isDirectory()).map(x=>path.join(base,x.name));
  if(options.length!==1)throw Error('Bitte einen Videonamen auswählen: npm run technik:import -- "START-HIER/VIDEO"');
  folder=options[0];
}
const result=importScienceDrop({repoRoot,packageDir:folder,dryRun:args.includes('--check')});
console.log('✓ Technik-Kanal – Medienordner '+(result.dryRun?'geprüft':'eingelesen'));
console.log('  '+result.readyFromDrop+'/'+result.sceneCount+' Szenenbilder im Ablageordner · '+result.copied.length+' neue Dateien sicher übernommen');
console.log('  Cover: '+(result.hasCover?'vorhanden':'fehlt')+' · Stimme: '+(result.hasVoice?'vorhanden':'fehlt'));
if(result.missing.length)console.log('  Fehlende Bilder ('+result.missing.length+'): '+result.missing.join(', '));
console.log('  Originale im DATEIEN-HIER-REIN-Ordner wurden NICHT gelöscht.');
if(!result.missing.length&&result.hasCover&&result.hasVoice)console.log('  Nächster Schritt: npm run science:finish -- "'+result.projectDir+'"');
else console.log('  Noch NICHT renderbereit. Fehlende Originaldateien einlegen, danach erneut importieren.');
