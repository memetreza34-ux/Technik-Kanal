#!/usr/bin/env node
// Schreibt YouTube-Kapitelmarken nach dem Render in 06-projektdateien/youtube-chapters.txt
// und in 05-export/caption.txt. Nutzung: npm run science:chapters -- "<video-ordner>"
import fs from 'node:fs';
import path from 'node:path';
import {projectPaths} from './lib/electrical-project.mjs';
import {buildYouTubeChapters, insertChaptersIntoCaption} from './lib/science-chapters.mjs';

const projectArg = process.argv.slice(2).find((arg) => !arg.startsWith('--'));
if (!projectArg) {
  console.error('Nutzung: npm run science:chapters -- <video-ordner>');
  process.exit(1);
}
const paths = projectPaths(projectArg);
const runtimePath = path.join(paths.projectFilesDir, 'reel-runtime.json');
if (!fs.existsSync(runtimePath)) {
  console.error(`Keine Render-Zeiten gefunden (${runtimePath}). Erst science:prepare bzw. science:finish ausführen.`);
  process.exit(1);
}
const plan = JSON.parse(fs.readFileSync(paths.scenePlan, 'utf8'));
const runtime = JSON.parse(fs.readFileSync(runtimePath, 'utf8'));
const result = buildYouTubeChapters({planScenes: plan.scenes, runtimeScenes: runtime.scenes, fps: runtime.fps, durationSeconds: runtime.durationSeconds});
if (result.problems.length) {
  console.error(`Kapitelmarken nicht geschrieben:\n- ${result.problems.join('\n- ')}`);
  process.exit(1);
}
fs.writeFileSync(path.join(paths.projectFilesDir, 'youtube-chapters.txt'), `${result.lines.join('\n')}\n`);
const captionPath = path.join(paths.root, '05-export', 'caption.txt');
if (fs.existsSync(captionPath)) fs.writeFileSync(captionPath, insertChaptersIntoCaption(fs.readFileSync(captionPath, 'utf8'), result.lines));
console.log(`✓ ${result.lines.length} YouTube-Kapitel geschrieben:\n${result.lines.join('\n')}`);
