#!/usr/bin/env node
// Lädt die CC0-Assets aus assets/3d-manifest.json von Poly Haven nach public/3d/.
// Bereits vorhandene Dateien werden übersprungen. Die Dateien kommen nicht ins Git.
import fs from 'node:fs';
import path from 'node:path';

const UA = {'User-Agent': 'TechnikKanalAssets/1.0'};
const manifest = JSON.parse(fs.readFileSync('assets/3d-manifest.json', 'utf8'));
const res = manifest.resolution || '1k';
const root = path.resolve('public', '3d');
let bytes = 0, files = 0;

async function download(url, target) {
  if (fs.existsSync(target)) return;
  fs.mkdirSync(path.dirname(target), {recursive: true});
  const r = await fetch(url, {headers: UA});
  if (!r.ok) throw new Error(`${r.status} ${url}`);
  const buf = Buffer.from(await r.arrayBuffer());
  fs.writeFileSync(target, buf);
  bytes += buf.length; files++;
}

const api = async (id) => {
  const r = await fetch(`https://api.polyhaven.com/files/${id}`, {headers: UA});
  if (!r.ok) throw new Error(`Asset nicht gefunden: ${id}`);
  return r.json();
};

for (const id of Object.keys(manifest.models)) {
  const g = (await api(id)).gltf[res].gltf;
  const dir = path.join(root, 'models', id);
  await download(g.url, path.join(dir, path.basename(g.url)));
  for (const [rel, inc] of Object.entries(g.include)) await download(inc.url, path.join(dir, rel));
  console.log('✓ Modell', id);
}
for (const id of Object.keys(manifest.hdris)) {
  const f = (await api(id)).hdri[res].hdr;
  await download(f.url, path.join(root, 'hdri', `${id}_${res}.hdr`));
  console.log('✓ HDRI', id);
}
console.log(`Fertig: ${files} neue Dateien, ${(bytes / 1e6).toFixed(1)} MB → public/3d/`);
