#!/usr/bin/env node
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {flattenScienceExport,findScienceVideoFolders,migrateLegacyLocalReels} from './lib/science-export-cleanup.mjs';
const repoRoot=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const arg=process.argv.slice(2).find(s=>!s.startsWith('--'));
const migration=migrateLegacyLocalReels(repoRoot,{dryRun:process.argv.includes('--check')});
console.log('Alter reels-Ordner: '+migration.files+' lokale Dateien '+(migration.dryRun?'zur Migration geprüft':'sicher nach YouTube übernommen')+'.');
const dirs=arg?[path.resolve(arg)]:findScienceVideoFolders(repoRoot);
const dryRun=process.argv.includes('--check');
if(!dirs.length)throw Error('Kein YouTube-Videoordner gefunden.');
for(const dir of dirs){
  const result=flattenScienceExport(dir,{dryRun});
  console.log((dryRun?'PRÜFUNG':'AUFGERÄUMT')+' '+result.slug+': '+result.migrated.length+' alte Exportdateien '+(dryRun?'gefunden':'sicher verschoben'));
}
console.log('05-export/ enthält künftig ausschließlich video.mp4, cover.png und caption.txt (soweit vorhanden).');
