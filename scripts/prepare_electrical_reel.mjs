#!/usr/bin/env node
import {createHash} from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import {
  audioExtensions,
  channelRoot,
  copyFile,
  ensureDirectory,
  findMedia,
  findVoiceFiles,
  imageExtensions,
  imageMetadata,
  mediaDurationSeconds,
  normalizePath,
  normalizeWord,
  normalizeWords,
  projectPaths,
  readJson,
  repositoryRoot,
  run,
  toSrtTimestamp,
  toVttTimestamp,
  validateProjectStructure,
  writeJson,
} from './lib/electrical-project.mjs';

const args = process.argv.slice(2);
const projectArg = args.find((arg) => !arg.startsWith('--'));
if (!projectArg) {
  console.error('Nutzung: npm run science:prepare -- <video-ordner> [--force-transcribe]');
  process.exit(1);
}

const forceTranscribe = args.includes('--force-transcribe');
const paths = projectPaths(projectArg);
validateProjectStructure(paths);
ensureDirectory(paths.workDir);
ensureDirectory(paths.exportDir);

const voicesBefore = findVoiceFiles(paths.audioDir);
let finalVoice = voicesBefore.final;
const rawIsNewer = Boolean(
  voicesBefore.raw && finalVoice && fs.statSync(voicesBefore.raw).mtimeMs > fs.statSync(finalVoice).mtimeMs,
);
if (!finalVoice || rawIsNewer) {
  if (!voicesBefore.raw) {
    throw new Error(`Keine Voice-Datei gefunden. Lege die Rohaufnahme in ${paths.audioDir}.`);
  }
  const rawStem = path.basename(voicesBefore.raw, path.extname(voicesBefore.raw));
  const finalStem = /raw|roh|original/i.test(rawStem)
    ? rawStem.replace(/raw|roh|original/i, 'final')
    : 'voiceover-final';
  finalVoice = path.join(paths.audioDir, `${finalStem}.wav`);
  run('ffmpeg', [
    '-y', '-i', voicesBefore.raw,
    '-filter:a', 'atempo=1.10',
    '-ar', '48000',
    '-ac', '1',
    '-c:a', 'pcm_s16le',
    finalVoice,
  ]);
  console.log(`✓ Voice-over auf 1,10× verarbeitet: ${finalVoice}`);
}

const transcriptMissing = !fs.existsSync(paths.wordTimestamps);
const transcriptOlder = !transcriptMissing && fs.statSync(paths.wordTimestamps).mtimeMs < fs.statSync(finalVoice).mtimeMs;
if (forceTranscribe || transcriptMissing || transcriptOlder) {
  run(process.execPath, ['scripts/transcribe_electrical_voiceover.mjs', paths.root], {cwd: repositoryRoot});
}

const plan = readJson(paths.scenePlan);
if (!Array.isArray(plan.scenes) || plan.scenes.length < 2) throw new Error('scene-plan.json enthält keine gültigen Szenen.');
const fps = Number(plan.fps ?? 30);
if (!Number.isFinite(fps) || fps <= 0) throw new Error('Ungültige FPS im Szenenplan.');
if (Number(plan.width) !== 1920 || Number(plan.height) !== 1080) throw new Error('Aktives Science-Video muss 1920×1080 / 16:9 sein.');
const slug = String(plan.slug ?? path.basename(paths.root)).trim();
if (!slug) throw new Error('Szenenplan benötigt einen slug.');

for (const scene of plan.scenes) {
  if (!scene.id || !scene.title || !scene.voiceText || !scene.imageDir) {
    throw new Error(`Szene unvollständig: ${JSON.stringify(scene)}`);
  }
}

const transcript = readJson(paths.wordTimestamps);
const transcriptWords = Array.isArray(transcript.words)
  ? transcript.words.filter((word) => word.normalized || normalizeWord(word.text))
  : [];
if (!transcriptWords.length) throw new Error('Worttranskript ist leer.');

const levenshtein = (a, b) => {
  if (a === b) return 0;
  const previous = Array.from({length: b.length + 1}, (_, index) => index);
  for (let i = 1; i <= a.length; i += 1) {
    let diagonal = previous[0];
    previous[0] = i;
    for (let j = 1; j <= b.length; j += 1) {
      const above = previous[j];
      previous[j] = Math.min(
        previous[j] + 1,
        previous[j - 1] + 1,
        diagonal + (a[i - 1] === b[j - 1] ? 0 : 1),
      );
      diagonal = above;
    }
  }
  return previous[b.length];
};

const substitutionCost = (a, b) => {
  if (a === b) return 0;
  if (!a || !b) return 1;
  if (a.length >= 5 && b.length >= 5 && (a.startsWith(b) || b.startsWith(a))) return 0.25;
  const distance = levenshtein(a, b);
  if (Math.max(a.length, b.length) >= 4 && distance === 1) return 0.35;
  if (Math.max(a.length, b.length) >= 7 && distance === 2) return 0.55;
  return 1;
};

const scriptWords = [];
const sceneSpans = [];
for (const scene of plan.scenes) {
  const words = normalizeWords(scene.voiceText);
  if (!words.length) throw new Error(`Szene ${scene.id} enthält keinen ausrichtbaren Sprechtext.`);
  const start = scriptWords.length;
  scriptWords.push(...words);
  sceneSpans.push({sceneId: scene.id, start, end: scriptWords.length - 1});
}

const recognizedWords = transcriptWords.map((word) => word.normalized || normalizeWord(word.text));
const n = scriptWords.length;
const m = recognizedWords.length;
const width = m + 1;
const costs = new Float64Array((n + 1) * (m + 1));
const moves = new Uint8Array((n + 1) * (m + 1));
const gap = 0.9;
for (let i = 1; i <= n; i += 1) {
  costs[i * width] = i * gap;
  moves[i * width] = 1;
}
for (let j = 1; j <= m; j += 1) {
  costs[j] = j * gap;
  moves[j] = 2;
}
for (let i = 1; i <= n; i += 1) {
  for (let j = 1; j <= m; j += 1) {
    const index = i * width + j;
    const diagonal = costs[(i - 1) * width + j - 1] + substitutionCost(scriptWords[i - 1], recognizedWords[j - 1]);
    const up = costs[(i - 1) * width + j] + gap;
    const left = costs[i * width + j - 1] + gap;
    if (diagonal <= up && diagonal <= left) {
      costs[index] = diagonal;
      moves[index] = 0;
    } else if (up <= left) {
      costs[index] = up;
      moves[index] = 1;
    } else {
      costs[index] = left;
      moves[index] = 2;
    }
  }
}

const mapping = new Array(n).fill(null);
let i = n;
let j = m;
while (i > 0 || j > 0) {
  const move = moves[i * width + j];
  if (i > 0 && j > 0 && move === 0) {
    mapping[i - 1] = j - 1;
    i -= 1;
    j -= 1;
  } else if (i > 0 && (j === 0 || move === 1)) {
    i -= 1;
  } else {
    j -= 1;
  }
}

let goodMatches = 0;
for (let index = 0; index < mapping.length; index += 1) {
  const transcriptIndex = mapping[index];
  if (transcriptIndex !== null && substitutionCost(scriptWords[index], recognizedWords[transcriptIndex]) <= 0.55) goodMatches += 1;
}
const matchRatio = goodMatches / scriptWords.length;
const minimumMatchRatio = Number(plan.minimumWordMatchRatio ?? 0.80);
if (matchRatio < minimumMatchRatio) {
  throw new Error(
    `Voice-over passt nicht sicher zum Szenenplan: ${(matchRatio * 100).toFixed(1)} % Worttreffer; ` +
    `mindestens ${(minimumMatchRatio * 100).toFixed(0)} % erforderlich.`,
  );
}

const mappedRange = (span) => {
  const values = mapping.slice(span.start, span.end + 1).filter((value) => value !== null);
  if (!values.length) throw new Error(`Szene ${span.sceneId} konnte keinem Transkriptbereich zugeordnet werden.`);
  return {first: values[0], last: values[values.length - 1]};
};
const ranges = sceneSpans.map(mappedRange);
const durationSeconds = mediaDurationSeconds(finalVoice);
const durationMs = Math.round(durationSeconds * 1000);
const boundariesMs = [0];
for (let index = 0; index < ranges.length - 1; index += 1) {
  const previousEnd = Number(transcriptWords[ranges[index].last].endMs);
  const nextStart = Number(transcriptWords[ranges[index + 1].first].startMs);
  const midpoint = nextStart >= previousEnd ? Math.round((previousEnd + nextStart) / 2) : previousEnd;
  boundariesMs.push(Math.max(boundariesMs[boundariesMs.length - 1] + 1, midpoint));
}
boundariesMs.push(durationMs);

const publicReelDir = path.join(channelRoot, 'public/reels', slug);
fs.rmSync(publicReelDir, {recursive: true, force: true});
ensureDirectory(path.join(publicReelDir, 'images'));
ensureDirectory(path.join(publicReelDir, 'audio'));
ensureDirectory(path.join(publicReelDir, 'sfx'));

const hash = (file) => createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const usedImageHashes = new Map();
const warnings = [];
const assets = [];
const alignedScenes = [];

for (let index = 0; index < plan.scenes.length; index += 1) {
  const scene = plan.scenes[index];
  const imageDirectory = path.resolve(paths.root, scene.imageDir);
  const images = findMedia(imageDirectory, imageExtensions);
  if (!images.length) throw new Error(`Bild fehlt für Szene ${scene.id}: ${imageDirectory}`);
  const selected = images.find((file) => /(?:final|approved|freigabe)/i.test(path.basename(file))) ?? images[0];
  const metadata = imageMetadata(selected);
  const aspect = metadata.width / metadata.height;
  if (metadata.width < 1280 || metadata.height < 720) {
    throw new Error(`Bild zu klein (${metadata.width}×${metadata.height}) für Szene ${scene.id}: ${selected}`);
  }
  if (aspect < 1.70 || aspect > 1.85) {
    throw new Error(`Bildformat für Szene ${scene.id} ist nicht 16:9-tauglich (${metadata.width}×${metadata.height}).`);
  }
  const digest = hash(selected);
  if (usedImageHashes.has(digest)) {
    throw new Error(`Dasselbe Bild wurde doppelt verwendet: ${scene.id} und ${usedImageHashes.get(digest)}`);
  }
  usedImageHashes.set(digest, scene.id);
  if (images.length > 1 && !images.some((file) => /(?:final|approved|freigabe)/i.test(path.basename(file)))) {
    warnings.push(`Mehrere Bilder in ${scene.imageDir}; automatisch wurde ${path.basename(selected)} gewählt.`);
  }
  const extension = path.extname(selected).toLowerCase();
  const stagedName = `${String(index + 1).padStart(2, '0')}-${scene.id}${extension}`;
  const staged = path.join(publicReelDir, 'images', stagedName);
  copyFile(selected, staged);
  assets.push({
    id: `image-${scene.id}`,
    kind: 'image',
    role: 'scene-image',
    source: normalizePath(path.relative(paths.root, selected)),
    runtimePath: `reels/${slug}/images/${stagedName}`,
    width: metadata.width,
    height: metadata.height,
    sha256: digest,
  });

  const fromMs = boundariesMs[index];
  const toMs = boundariesMs[index + 1];
  const fromFrame = index === 0 ? 0 : alignedScenes[alignedScenes.length - 1].toFrame;
  const toFrame = index === plan.scenes.length - 1
    ? Math.ceil(durationSeconds * fps)
    : Math.max(fromFrame + 1, Math.round((toMs / 1000) * fps));
  alignedScenes.push({
    ...scene,
    fromMs,
    toMs,
    fromFrame,
    toFrame,
    durationSeconds: Number(((toMs - fromMs) / 1000).toFixed(3)),
    imagePath: `reels/${slug}/images/${stagedName}`,
  });
}

const stagedVoice = path.join(publicReelDir, 'audio/voiceover-final.wav');
copyFile(finalVoice, stagedVoice);
assets.push({
  id: 'voiceover-final',
  kind: 'audio',
  role: 'voiceover-final',
  source: normalizePath(path.relative(paths.root, finalVoice)),
  runtimePath: `reels/${slug}/audio/voiceover-final.wav`,
  durationSeconds: Number(durationSeconds.toFixed(3)),
  sha256: hash(finalVoice),
});

const captionChunks = [];
let current = [];
const flushCaption = () => {
  if (!current.length) return;
  captionChunks.push({
    startMs: current[0].startMs,
    endMs: current[current.length - 1].endMs,
    text: current.map((word) => word.text).join(' ').replace(/\s+([,.;:!?])/g, '$1'),
    words: current.map((word) => ({text: word.text, startMs: word.startMs, endMs: word.endMs})),
  });
  current = [];
};
for (const word of transcriptWords) {
  const gapMs = current.length ? word.startMs - current[current.length - 1].endMs : 0;
  const candidate = [...current, word].map((entry) => entry.text).join(' ');
  if (current.length && (current.length >= 5 || candidate.length > 34 || gapMs > 450)) flushCaption();
  current.push(word);
  if (/[.!?]$/.test(word.text)) flushCaption();
}
flushCaption();

const captions = captionChunks.map((caption) => ({
  ...caption,
  fromFrame: Math.max(0, Math.floor((caption.startMs / 1000) * fps)),
  toFrame: Math.min(Math.ceil(durationSeconds * fps), Math.max(1, Math.ceil((caption.endMs / 1000) * fps))),
}));

writeJson(paths.captionsJson, {
  version: 2,
  language: 'de',
  source: 'local-whisper.cpp-word-timestamps',
  voiceSpeed: 1.10,
  durationSeconds: Number(durationSeconds.toFixed(3)),
  style: {color: 'white', highlightColor: null, backgroundBox: false, maxLines: 2, verticalPositionPercent: 90},
  captions,
});

fs.writeFileSync(paths.captionsSrt, captions.map((caption, index) => (
  `${index + 1}\n${toSrtTimestamp(caption.startMs / 1000)} --> ${toSrtTimestamp(caption.endMs / 1000)}\n${caption.text}\n`
)).join('\n'));
fs.writeFileSync(paths.captionsVtt, `WEBVTT\n\n${captions.map((caption) => (
  `${toVttTimestamp(caption.startMs / 1000)} --> ${toVttTimestamp(caption.endMs / 1000)}\n${caption.text}\n`
)).join('\n')}`);

const stagedSfx = [];
if (fs.existsSync(paths.sfxEvents)) {
  const config = readJson(paths.sfxEvents);
  for (const event of Array.isArray(config.events) ? config.events : []) {
    const source = path.join(paths.sfxDir, event.file);
    if (!fs.existsSync(source)) {
      warnings.push(`Optionaler SFX fehlt: ${event.file}`);
      continue;
    }
    const scene = alignedScenes.find((candidate) => candidate.id === event.sceneId);
    if (!scene) throw new Error(`SFX ${event.id} verweist auf unbekannte Szene ${event.sceneId}.`);
    let startMs = scene.fromMs + Number(event.relativeMs ?? 0);
    const anchor = normalizeWords(event.anchorText ?? '');
    if (anchor.length) {
      const withinScene = transcriptWords.filter((word) => word.startMs >= scene.fromMs && word.endMs <= scene.toMs);
      const anchorIndex = withinScene.findIndex((word) => (word.normalized || normalizeWord(word.text)) === anchor[0]);
      if (anchorIndex >= 0) startMs = withinScene[anchorIndex].startMs + Number(event.offsetMs ?? 0);
      else warnings.push(`SFX-Anker nicht gefunden (${event.id}: ${event.anchorText}); relative Szenenzeit verwendet.`);
    }
    const extension = path.extname(source).toLowerCase();
    if (!audioExtensions.has(extension)) throw new Error(`Ungültiges SFX-Format: ${source}`);
    const stagedName = `${event.id}${extension}`;
    copyFile(source, path.join(publicReelDir, 'sfx', stagedName));
    stagedSfx.push({
      id: event.id,
      path: `reels/${slug}/sfx/${stagedName}`,
      fromFrame: Math.max(0, Math.round((startMs / 1000) * fps)),
      volume: Number(event.volume ?? 0.16),
    });
    assets.push({
      id: `sfx-${event.id}`,
      kind: 'audio',
      role: 'sfx',
      source: normalizePath(path.relative(paths.root, source)),
      runtimePath: `reels/${slug}/sfx/${stagedName}`,
      sha256: hash(source),
    });
  }
}

const totalFrames = Math.ceil(durationSeconds * fps);
const runtime = {
  version: 1,
  slug,
  compositionId: String(plan.compositionId ?? 'ScienceReel'),
  fps,
  width: Number(plan.width ?? 1920),
  height: Number(plan.height ?? 1080),
  totalFrames,
  durationSeconds: Number(durationSeconds.toFixed(3)),
  voiceoverPath: `reels/${slug}/audio/voiceover-final.wav`,
  scenes: alignedScenes,
  captions,
  sfx: stagedSfx,
  alignment: {
    method: 'local-whisper-word-alignment',
    matchRatio: Number(matchRatio.toFixed(4)),
    minimumMatchRatio,
    generatedAt: new Date().toISOString(),
  },
};

const generatedRuntime = path.join(channelRoot, 'src/generated/reel-runtime.json');
writeJson(generatedRuntime, runtime);
writeJson(path.join(paths.projectFilesDir, 'reel-runtime.json'), runtime);
writeJson(paths.assetManifest, {version: 1, slug, generatedAt: new Date().toISOString(), assets});
writeJson(paths.scenePlan, {...plan, scenes: alignedScenes, alignment: runtime.alignment, totalFrames, durationSeconds: runtime.durationSeconds});
writeJson(paths.readinessReport, {
  readyForRender: true,
  slug,
  generatedAt: new Date().toISOString(),
  checks: {
    finalVoice: true,
    localWordTranscript: true,
    wordMatchRatio: Number(matchRatio.toFixed(4)),
    sceneCount: alignedScenes.length,
    imageCount: alignedScenes.length,
    captions: captions.length,
    stagedSfx: stagedSfx.length,
  },
  warnings,
});

console.log('✓ YouTube-Science-Video vollständig vorbereitet.');
console.log(`  Voice: ${durationSeconds.toFixed(3)} s bei 1,10×`);
console.log(`  Worttreffer: ${(matchRatio * 100).toFixed(1)} %`);
console.log(`  Visuelle Beats: ${alignedScenes.length}`);
console.log(`  Bilder: ${alignedScenes.length}`);
console.log(`  Caption-Blöcke: ${captions.length}`);
console.log(`  Runtime: ${generatedRuntime}`);
if (warnings.length) {
  console.log('Warnungen:');
  warnings.forEach((warning) => console.log(`- ${warning}`));
}
