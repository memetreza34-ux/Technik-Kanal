import { execFile } from 'node:child_process';
import { access, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

const REPO_ROOT = path.resolve(fileURLToPath(new URL('../../', import.meta.url)));

export const MASTER_REFERENCE_TEXT =
  'Willkommen bei Alles Stickman. Wir erzählen die krassesten und faszinierendsten Geschichten der Menschheit. Unzensiert, direkt und auf den Punkt. Was passiert, wenn alles schief geht und du nur eine einzige Chance hast zu überleben? Genau das finden wir heute heraus. Lehn dich zurück und bleib bis zum Ende dran.';

export const VOICE_PRESETS = {
  'stickman-user-clone': {
    name: 'stickman-user-clone',
    label: 'Master Creator Voice Clone (0.95x Tempo)',
    engine: 'qwen-mlx',
    provider: 'qwen-mlx',
    model: 'mlx-community/Qwen3-TTS-12Hz-1.7B-Base-bf16',
    voice: 'stickman-user-clone',
    refAudio: 'channel/audio/reference/user_voice_reference.wav',
    refMetadata: 'channel/audio/reference/user_voice_reference.json',
    refText: MASTER_REFERENCE_TEXT,
    temperature: 0.7,
    tempo: 0.95,
    atempo: 0.95,
    rate: '-5%',
    pitch: '+0Hz',
    volume: '+0%',
    max_pause: 0.285,
    preStretchMaxPauseSeconds: 0.285,
    maxPauseSeconds: 0.30,
    maxWordsPerChunk: 32,
    description:
      'Exakter 1:1 Stimmklon aus deiner eigenen Referenzaufnahme (18.48s Studio-Referenz) via Qwen3-TTS 1.7B Base auf Apple Silicon, kalibriert auf 0.95x Tempo (-5%), max. 0.30s Pausen und 32 Wörter pro Chunk.'
  }
};

export const DEFAULT_PRESET = 'stickman-user-clone';

export function resolveRepoPath(...parts) {
  return path.join(REPO_ROOT, ...parts);
}

async function exists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

export async function loadVoicePolicy(customPath) {
  const policyPath = customPath || resolveRepoPath('config', 'voice-policy.json');
  const raw = await readFile(policyPath, 'utf8');
  return JSON.parse(raw);
}

export function parseProfileTempo(profile = {}, options = {}) {
  if (options.tempo !== undefined && options.tempo !== null) {
    const t = Number(options.tempo);
    if (Number.isFinite(t) && t >= 0.5 && t <= 2.0) return Number(t.toFixed(4));
  }
  if (options.atempo !== undefined && options.atempo !== null) {
    const t = Number(options.atempo);
    if (Number.isFinite(t) && t >= 0.5 && t <= 2.0) return Number(t.toFixed(4));
  }
  if (typeof options.rate === 'string' && options.rate.trim().endsWith('%')) {
    const pct = Number(options.rate.trim().slice(0, -1));
    if (Number.isFinite(pct)) {
      const t = 1 + pct / 100;
      if (t >= 0.5 && t <= 2.0) return Number(t.toFixed(4));
    }
  }
  if (profile.tempo !== undefined && profile.tempo !== null) {
    const t = Number(profile.tempo);
    if (Number.isFinite(t) && t >= 0.5 && t <= 2.0) return Number(t.toFixed(4));
  }
  if (typeof profile.rate === 'string' && profile.rate.trim().endsWith('%')) {
    const pct = Number(profile.rate.trim().slice(0, -1));
    if (Number.isFinite(pct)) {
      const t = 1 + pct / 100;
      if (t >= 0.5 && t <= 2.0) return Number(t.toFixed(4));
    }
  }
  return 0.95;
}

export function formatAtempoFilter(tempo) {
  const num = Number(tempo);
  if (!Number.isFinite(num) || Math.abs(num - 1.0) < 0.001) {
    return null;
  }
  const clamped = Math.min(2.0, Math.max(0.5, num));
  return `atempo=${Number(clamped.toFixed(4))}`;
}

export function buildVoiceBoostFilter(boost) {
  if (boost && boost.enabled === false) return null;
  const b = boost || {
    enabled: true,
    highpassHz: 75,
    deess: { enabled: true, intensity: 0.45, max: 0.55, frequency: 0.5, freqHz: 6600, gainDb: -3.5, q: 2.0 },
    warmth: { freqHz: 180, gainDb: 2.2, q: 1.2 },
    presence: { freqHz: 3200, gainDb: 2.0, q: 1.2 },
    aiSheenTame: { freqHz: 11500, gainDb: -2.5, q: 1.0 },
    tubeWarmth: { enabled: true, type: 'tanh', threshold: 0.88, output: 0.98 },
    roomPresence: { enabled: true, inGain: 0.88, outGain: 0.95, delays: '18|28', decays: '0.04|0.02' },
    compand: 'attacks=0.02:decays=0.15:points=-60/-60|-24/-18|-12/-10|0/-3:gain=1',
    limiter: 0.92
  };

  const parts = [];
  if (b.highpassHz) parts.push(`highpass=f=${Number(b.highpassHz)}`);
  if (b.deess && b.deess.enabled !== false) {
    const intensity = b.deess.intensity ?? 0.45;
    const maxDeess = b.deess.max ?? 0.55;
    const freq = b.deess.frequency ?? 0.5;
    parts.push(`deesser=i=${intensity}:m=${maxDeess}:f=${freq}:s=o`);
    if (b.deess.freqHz && b.deess.gainDb) {
      const q = b.deess.q ?? 2.0;
      parts.push(`equalizer=f=${Number(b.deess.freqHz)}:t=q:w=${Number(q)}:g=${Number(b.deess.gainDb)}`);
    }
  }
  if (b.warmth && typeof b.warmth === 'object') {
    parts.push(`equalizer=f=${Number(b.warmth.freqHz)}:t=q:w=${Number(b.warmth.q)}:g=${Number(b.warmth.gainDb)}`);
  }
  if (b.presence && typeof b.presence === 'object') {
    parts.push(`equalizer=f=${Number(b.presence.freqHz)}:t=q:w=${Number(b.presence.q)}:g=${Number(b.presence.gainDb)}`);
  }
  if (b.aiSheenTame && typeof b.aiSheenTame === 'object' && b.aiSheenTame.enabled !== false) {
    parts.push(`equalizer=f=${Number(b.aiSheenTame.freqHz ?? 11500)}:t=q:w=${Number(b.aiSheenTame.q ?? 1.0)}:g=${Number(b.aiSheenTame.gainDb ?? -2.5)}`);
  }
  if (b.tubeWarmth && typeof b.tubeWarmth === 'object' && b.tubeWarmth.enabled !== false) {
    parts.push(`asoftclip=type=${b.tubeWarmth.type || 'tanh'}:threshold=${b.tubeWarmth.threshold || 0.88}:output=${b.tubeWarmth.output || 0.98}`);
  }
  if (b.roomPresence && typeof b.roomPresence === 'object' && b.roomPresence.enabled !== false) {
    parts.push(`aecho=in_gain=${b.roomPresence.inGain ?? 0.88}:out_gain=${b.roomPresence.outGain ?? 0.95}:delays=${b.roomPresence.delays || '18|28'}:decays=${b.roomPresence.decays || '0.04|0.02'}`);
  }
  if (b.compand) parts.push(`compand=${b.compand}`);
  if (b.limiter) parts.push(`alimiter=limit=${Number(b.limiter)}:level=false`);
  return parts.length > 0 ? parts.join(',') : null;
}

export function normalizeGermanScriptForTts(rawText) {
  if (!rawText || typeof rawText !== 'string') return '';
  let text = rawText;
  text = text.replace(/\[[^\]]*\]/g, ' ');
  text = text.replace(/\((?:Pause|Musik|SFX|Sprecher|Betonung|flüstert)[^)]*\)/gi, ' ');
  text = text.replace(/^#{1,6}\s+/gm, '');
  text = text.replace(/(\d+)\s*°C\b/gi, '$1 Grad Celsius');
  text = text.replace(/(\d+)\s*km\/h\b/gi, '$1 Kilometer pro Stunde');
  text = text.replace(/\bkm²\b/g, 'Quadratkilometer');
  text = text.replace(/\bkm\b/g, 'Kilometer');
  text = text.replace(/\bmm\b/g, 'Millimeter');
  text = text.replace(/\bcm\b/g, 'Zentimeter');
  text = text.replace(/\bkV\b/g, 'Kilovolt');
  text = text.replace(/\bmA\b/g, 'Milliampere');
  text = text.replace(/\bz\.\s*B\./g, 'zum Beispiel');
  text = text.replace(/\bd\.\s*h\./g, 'das heißt');
  text = text.replace(/\bbzw\./g, 'beziehungsweise');
  text = text.replace(/\bca\./g, 'circa');
  text = text.replace(/\bu\.\s*a\./g, 'unter anderem');
  text = text.replace(/\bv\.\s*a\./g, 'vor allem');
  text = text.replace(/\bsog\./g, 'sogenannte');
  text = text.replace(/\bMrd\./g, 'Milliarden');
  text = text.replace(/\bMio\./g, 'Millionen');
  text = text.replace(/(\d+)\s*%/g, '$1 Prozent');
  text = text.replace(/[ \t]+/g, ' ');
  return text.trim();
}

export function splitScriptIntoParagraphs(text, maxWordsPerChunk = 32) {
  const paragraphs = String(text || '')
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);

  const chunks = [];
  let currentId = 0;

  for (const para of paragraphs) {
    const words = para.split(/\s+/).filter(Boolean);
    if (words.length <= maxWordsPerChunk) {
      chunks.push({ id: currentId++, text: para });
    } else {
      const sentences = para.match(/[^.!?]+[.!?]+(?:\s+|$)|[^.!?]+$/g) || [para];
      let sub = '';
      for (const sent of sentences) {
        const trimmedSent = sent.trim();
        if (!trimmedSent) continue;
        const sentWords = trimmedSent.split(/\s+/).filter(Boolean);
        if (sentWords.length > maxWordsPerChunk) {
          if (sub.trim().length > 0) {
            chunks.push({ id: currentId++, text: sub.trim() });
            sub = '';
          }
          for (let i = 0; i < sentWords.length; i += maxWordsPerChunk) {
            chunks.push({
              id: currentId++,
              text: sentWords.slice(i, i + maxWordsPerChunk).join(' ')
            });
          }
          continue;
        }
        const candidate = (sub ? `${sub} ${trimmedSent}` : trimmedSent).trim();
        if (candidate.split(/\s+/).filter(Boolean).length > maxWordsPerChunk && sub.length > 0) {
          chunks.push({ id: currentId++, text: sub.trim() });
          sub = trimmedSent;
        } else {
          sub = candidate;
        }
      }
      if (sub.trim().length > 0) {
        chunks.push({ id: currentId++, text: sub.trim() });
      }
    }
  }
  return chunks;
}

export function resolveVoiceConfig({
  preset = DEFAULT_PRESET,
  profile,
  tempo,
  atempo,
  rate,
  max_pause,
  maxPauseSeconds,
  maxWordsPerChunk,
  temperature,
  refAudio,
  refText
} = {}) {
  const requestedKey = profile || preset || DEFAULT_PRESET;
  const base = VOICE_PRESETS[requestedKey] || VOICE_PRESETS[DEFAULT_PRESET];
  const resolvedTempo = parseProfileTempo(base, { tempo, atempo, rate });
  const resolvedMaxPause =
    maxPauseSeconds !== undefined ? Number(maxPauseSeconds) : base.maxPauseSeconds;
  const resolvedPreStretchPause =
    max_pause !== undefined
      ? Number(max_pause)
      : Number((resolvedMaxPause * resolvedTempo).toFixed(4));

  return {
    preset: VOICE_PRESETS[requestedKey] ? requestedKey : DEFAULT_PRESET,
    profile: VOICE_PRESETS[requestedKey] ? requestedKey : DEFAULT_PRESET,
    label: base.label,
    engine: base.engine,
    provider: base.provider,
    model: base.model,
    voice: base.voice,
    refAudio: refAudio || base.refAudio,
    refText: refText || base.refText,
    temperature: temperature !== undefined ? Number(temperature) : base.temperature,
    rate: rate || base.rate,
    tempo: resolvedTempo,
    atempo: resolvedTempo,
    max_pause: resolvedPreStretchPause,
    preStretchMaxPauseSeconds: resolvedPreStretchPause,
    maxPauseSeconds: resolvedMaxPause,
    maxWordsPerChunk: maxWordsPerChunk || base.maxWordsPerChunk || 32
  };
}

export async function probeAudioDuration(filePath) {
  const { stdout } = await execFileAsync('ffprobe', [
    '-v',
    'error',
    '-show_entries',
    'format=duration',
    '-of',
    'default=noprint_wrappers=1:nokey=1',
    filePath
  ]);
  const duration = Number(String(stdout).trim());
  if (!Number.isFinite(duration) || duration <= 0) {
    throw new Error(`Ungültige Audiodauer ermittelt: ${filePath}`);
  }
  return Number(duration.toFixed(3));
}

async function resolveProjectScriptAndOutput(projectDir, options = {}) {
  const candidates = [
    options.script ? path.resolve(options.script) : null,
    path.join(projectDir, 'script-fliesstext.txt'),
    path.join(projectDir, '01-script-audio', 'voiceover.txt'),
    path.join(projectDir, '01-SKRIPT.txt'),
    path.join(projectDir, '01-voice-script', 'voice-script.txt'),
    path.join(projectDir, '01-script', 'script.txt')
  ].filter(Boolean);

  let scriptPath = null;
  for (const c of candidates) {
    if (await exists(c)) {
      scriptPath = c;
      break;
    }
  }
  if (!scriptPath) {
    throw new Error(`Voice-Script fehlt in ${projectDir} (erwartet z. B. script-fliesstext.txt, 01-script-audio/voiceover.txt oder 01-SKRIPT.txt)`);
  }

  const baseName = path.basename(scriptPath);
  if (baseName === 'script-fliesstext.txt') {
    const audioDir = path.join(projectDir, 'audio');
    return {
      scriptPath,
      audioDir,
      techDir: audioDir,
      rawWavPath: path.join(audioDir, 'voiceover-raw.wav'),
      outputWav: path.join(audioDir, 'voiceover.wav'),
      reportPath: path.join(audioDir, 'VOICE_GENERATION_REPORT.json')
    };
  }

  const isStartHier = baseName === '01-SKRIPT.txt';
  const audioDir = isStartHier
    ? path.join(projectDir, '01-AUDIO')
    : path.join(projectDir, '01-script-audio', 'audio');
  const techDir = isStartHier
    ? path.join(projectDir, '99-INTERN')
    : path.join(projectDir, '99-intern');

  return {
    scriptPath,
    audioDir,
    techDir,
    rawWavPath: path.join(audioDir, 'voiceover-raw.wav'),
    outputWav: path.join(audioDir, 'voiceover-final.wav'),
    reportPath: path.join(techDir, 'VOICE_GENERATION_REPORT.json')
  };
}

export async function synthesizeProjectVoiceover(projectDirectory, options = {}) {
  const projectDir = path.resolve(projectDirectory);
  const paths = await resolveProjectScriptAndOutput(projectDir, options);

  if ((await exists(paths.outputWav)) && !options.force && !options.dryRun) {
    throw new Error(`Audiodatei existiert bereits: ${paths.outputWav}. Verwende --force zum Überschreiben.`);
  }

  const policy = await loadVoicePolicy(options.policyPath);
  const config = resolveVoiceConfig(options);
  const rawScript = await readFile(paths.scriptPath, 'utf8');
  const normalizedScript = normalizeGermanScriptForTts(rawScript);
  const chunks = splitScriptIntoParagraphs(normalizedScript, config.maxWordsPerChunk);

  if (!chunks.length) {
    throw new Error('Das Skript enthält keinen sprechbaren Text.');
  }

  const wordCount = normalizedScript.split(/\s+/).filter(Boolean).length;

  if (options.dryRun) {
    return {
      dryRun: true,
      config,
      scriptPath: paths.scriptPath,
      outputWav: paths.outputWav,
      totalWords: wordCount,
      totalChunks: chunks.length,
      estimatedDurationMinutes: (wordCount / 145).toFixed(1),
      chunks: chunks.map((c) => ({
        id: c.id,
        words: c.text.split(/\s+/).filter(Boolean).length,
        preview: c.text.slice(0, 80) + (c.text.length > 80 ? '...' : '')
      }))
    };
  }

  const workDir = path.join(paths.techDir, 'temp-tts-generation');
  await rm(workDir, { recursive: true, force: true });
  await mkdir(workDir, { recursive: true });
  await mkdir(paths.audioDir, { recursive: true });
  await mkdir(paths.techDir, { recursive: true });

  try {
    const refAudioPath = path.isAbsolute(config.refAudio)
      ? config.refAudio
      : resolveRepoPath(config.refAudio);
    if (!(await exists(refAudioPath))) {
      throw new Error(`Referenz-Audiodatei für Voice-Cloning fehlt: ${refAudioPath}`);
    }

    const sprecherPy = '/Users/arman/finanzneo-tts/sprecher.py';
    const localVenvPython = '/Users/arman/finanzneo-tts/.venv/bin/python';
    const tempRawUnstretchedWav = path.join(workDir, 'raw-unstretched.wav');
    const normalizedTxtPath = path.join(workDir, 'normalized-script.txt');
    await writeFile(normalizedTxtPath, `${normalizedScript}\n`, 'utf8');

    await execFileAsync(
      localVenvPython,
      [
        sprecherPy,
        '--script',
        normalizedTxtPath,
        '--out',
        tempRawUnstretchedWav,
        '--voice',
        config.voice,
        '--ref-audio',
        refAudioPath,
        '--ref-text',
        config.refText,
        '--temperature',
        String(config.temperature ?? 0.7),
        '--max-pause',
        String(config.preStretchMaxPauseSeconds ?? 0.285),
        '--no-master'
      ],
      {
        timeout: 60 * 60 * 1000,
        maxBuffer: 20 * 1024 * 1024,
        env: { ...process.env, HF_HOME: '/Users/arman/finanzneo-tts/hf' }
      }
    );

    const atempoFilter = formatAtempoFilter(config.tempo);
    const rawFilterArgs = atempoFilter ? ['-af', atempoFilter] : [];
    await execFileAsync('ffmpeg', [
      '-y',
      '-v',
      'error',
      '-i',
      tempRawUnstretchedWav,
      ...rawFilterArgs,
      '-ar',
      '48000',
      '-ac',
      '1',
      '-c:a',
      'pcm_s16le',
      paths.rawWavPath
    ]);

    const applyBoost = options.boost !== false && policy.voiceBoost?.enabled !== false;
    const boostFilter = applyBoost ? buildVoiceBoostFilter(policy.voiceBoost) : null;
    const finalFilterArgs = boostFilter ? ['-af', boostFilter] : [];

    await execFileAsync('ffmpeg', [
      '-y',
      '-v',
      'error',
      '-i',
      paths.rawWavPath,
      ...finalFilterArgs,
      '-ar',
      '48000',
      '-ac',
      '1',
      '-c:a',
      'pcm_s16le',
      paths.outputWav
    ]);

    const durationSeconds = await probeAudioDuration(paths.outputWav);
    const report = {
      schemaVersion: 2,
      generatedAt: new Date().toISOString(),
      engine: config.engine,
      provider: config.provider,
      model: config.model,
      preset: config.preset,
      voice: config.voice,
      refAudio: config.refAudio,
      tempo: config.tempo,
      rate: config.rate,
      maxPauseSeconds: config.maxPauseSeconds,
      preStretchMaxPauseSeconds: config.preStretchMaxPauseSeconds,
      maxWordsPerChunk: config.maxWordsPerChunk,
      voiceBoostApplied: applyBoost,
      sourceScript: path.relative(projectDir, paths.scriptPath),
      rawAudioFile: path.relative(projectDir, paths.rawWavPath),
      outputFile: path.relative(projectDir, paths.outputWav),
      totalWords: wordCount,
      totalChunks: chunks.length,
      durationSeconds,
      sampleRate: 48000,
      channels: 1,
      wpm: Math.round((wordCount / durationSeconds) * 60)
    };

    await writeFile(paths.reportPath, JSON.stringify(report, null, 2) + '\n', 'utf8');

    return {
      success: true,
      rawAudioPath: paths.rawWavPath,
      audioPath: paths.outputWav,
      reportPath: paths.reportPath,
      report
    };
  } finally {
    await rm(workDir, { recursive: true, force: true }).catch(() => {});
  }
}
