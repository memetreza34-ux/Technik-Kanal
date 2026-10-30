import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {validateVideo} from './check-video.mjs';
test('Projektvorlage kann nicht ohne echte Inhalte freigegeben werden',()=>{
 const x=validateVideo('videos/_vorlage');assert.ok(x.errors.length>0);assert.ok(x.errors.some(s=>s.includes('ready')));
});
test('Alle neuen Projekte beginnen im 16:9-Format',()=>{
 const x=JSON.parse(fs.readFileSync('videos/_vorlage/video.json','utf8'));
 assert.equal(x.format,'youtube-16x9');assert.ok(x.chapters.length>=3);
});
