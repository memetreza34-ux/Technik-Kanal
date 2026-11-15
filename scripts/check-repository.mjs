import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
for(const old of ['channels/elektrotechnik/reels','channels/elektrotechnik/src','core','reels']){
  assert.equal(fs.existsSync(path.resolve(old)),false,'Veralteter Produktionspfad: '+old);
}
const pkg=JSON.parse(fs.readFileSync('package.json','utf8'));
assert.ok(pkg.scripts['youtube:render']);
assert.ok(pkg.scripts['short:render']);
const types=fs.readFileSync('src/types.ts','utf8');
assert.match(types,/WIDTH=1920/);
assert.match(types,/HEIGHT=1080/);
const shortTypes=fs.readFileSync('src/short/types.ts','utf8');
assert.match(shortTypes,/SHORT_WIDTH = 1080/);
assert.match(shortTypes,/SHORT_HEIGHT = 1920/);
for(const d of fs.existsSync('shorts')?fs.readdirSync('shorts'):[]){
  const dir=path.join('shorts',d);if(!fs.statSync(dir).isDirectory())continue;
  const spec=JSON.parse(fs.readFileSync(path.join(dir,'short.json'),'utf8'));
  const lines=fs.readFileSync(path.join(dir,'script-fliesstext.txt'),'utf8').trim().split('\n');
  assert.equal(spec.format,'short-9x16',dir);assert.ok(spec.scene,dir+': scene fehlt');
  assert.deepEqual(spec.scenes.map(s=>s.text),lines,dir+': short.json und script-fliesstext.txt weichen ab');
  for(const sc of spec.scenes){
    if(!sc.overlay)continue;
    assert.ok(['title','meter','bars','chip','end','facts','checklist'].includes(sc.overlay.type),dir+': unbekannte Overlay-Art '+sc.overlay.type);
    for(const r of sc.overlay.rows??[]) assert.ok(Number.isFinite(r.value),dir+': Wert fehlt bei '+r.label);
  }
  if(spec.race){
    const ids=new Set(spec.scenes.map(s=>s.id));
    for(const k of spec.race.keys) assert.ok(ids.has(k.scene),dir+': Rennen verweist auf unbekannte Szene '+k.scene);
    for(const id of [spec.race.dockAfter,spec.race.until]) assert.ok(ids.has(id),dir+': Rennen verweist auf unbekannte Szene '+id);
    for(const l of spec.race.lanes) assert.ok(l.finish>0,dir+': Zielzeit fehlt bei '+l.label);
  }
  if(spec.scenes.some(s=>s.overlay?.rows)) assert.ok(fs.existsSync(path.join(dir,'quellen.md')),dir+': Zahlen ohne quellen.md');
}
console.log('✓ Repository: YouTube 16:9 + Shorts 9:16 geprüft.');
