import fs from 'node:fs';
import path from 'node:path';
const [slug,title]=process.argv.slice(2);
if(!slug||!/^[0-9]{4}-[0-9]{2}-[0-9]{2}_[a-z0-9-]+$/.test(slug)||!title?.trim()){
  console.error('Nutzung: npm run youtube:new -- YYYY-MM-DD_thema "Video-Titel"');process.exit(1);
}
const dir=path.resolve('videos',slug);
if(fs.existsSync(dir))throw new Error('Projekt existiert bereits: '+dir);
fs.cpSync(path.resolve('videos/_vorlage'),dir,{recursive:true});
const file=path.join(dir,'video.json'),obj=JSON.parse(fs.readFileSync(file,'utf8'));
obj.title=title.trim();
fs.writeFileSync(file,JSON.stringify(obj,null,2)+'\n');
fs.mkdirSync(path.join(dir,'audio'),{recursive:true});
console.log('✓ YouTube-Projekt angelegt: '+dir);
console.log('Nun fachlichen Inhalt, Quellen, Skript, Aufnahme und Bildplanung vorbereiten.');
