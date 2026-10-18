#!/usr/bin/env node
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {migrateLegacyLocalReels,flattenScienceExport} from './lib/science-export-cleanup.mjs';

const root=fs.mkdtempSync(path.join(os.tmpdir(),'wissonaut-folder-migration-'));
const old=path.join(root,'channels/science/reels/2026-Woche/01-Test');
const current=path.join(root,'channels/science/YouTube/2026-Woche/01-Test');
const put=(file,data)=>{fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file,data);};
const ls=p=>fs.readdirSync(p).sort();
try{
  put(path.join(current,'06-projektdateien/scene-plan.json'),JSON.stringify({slug:'test-video'}));
  put(path.join(current,'05-export/caption.txt'),'Titel: Test\n');
  put(path.join(old,'05-export/video/test-video.mp4'),'video-bytes');
  put(path.join(old,'05-export/cover/00-thumbnail-final.png'),'cover-bytes');
  put(path.join(old,'05-export/youtube-analytics.json'),'{"version":1}');
  const preview=migrateLegacyLocalReels(root,{dryRun:true});
  assert.equal(preview.files,3);
  assert.ok(fs.existsSync(path.join(old,'05-export/video/test-video.mp4')));
  const moved=migrateLegacyLocalReels(root);
  assert.equal(moved.moved,3);
  assert.ok(!fs.existsSync(path.join(root,'channels/science/reels')));
  const flat=flattenScienceExport(current);
  assert.equal(flat.migrated.length,3);
  assert.deepEqual(ls(path.join(current,'05-export')),['caption.txt','cover.png','video.mp4']);
  assert.equal(fs.readFileSync(path.join(current,'05-export/cover.png'),'utf8'),'cover-bytes');
  assert.ok(fs.existsSync(path.join(current,'06-projektdateien/youtube-analytics.json')));
  assert.equal(flattenScienceExport(current).migrated.length,0);
  const oldAgain=path.join(old,'05-export/video/test-video.mp4');
  put(oldAgain,'DIFFERENT VIDEO');
  put(path.join(current,'05-export/video/test-video.mp4'),'other');
  assert.throws(()=>migrateLegacyLocalReels(root),/Konflikt/);
  assert.ok(fs.existsSync(oldAgain),'Konflikt darf Original nicht löschen.');
  console.log('✓ Lokale reels→YouTube-Migration und flacher Export: keine Datenverluste, Idempotenz, Konfliktschutz, genau 3 Enddateien.');
}finally{fs.rmSync(root,{recursive:true,force:true});}
