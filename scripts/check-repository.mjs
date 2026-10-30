import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
for(const old of ['channels/elektrotechnik/reels','channels/elektrotechnik/src','core','reels','shorts']){
  assert.equal(fs.existsSync(path.resolve(old)),false,'Veralteter Produktionspfad: '+old);
}
const pkg=JSON.parse(fs.readFileSync('package.json','utf8'));
assert.ok(pkg.scripts['youtube:render']);
const types=fs.readFileSync('src/types.ts','utf8');
assert.match(types,/WIDTH=1920/);
assert.match(types,/HEIGHT=1080/);
console.log('✓ Repository ist auf YouTube 16:9 beschränkt.');
