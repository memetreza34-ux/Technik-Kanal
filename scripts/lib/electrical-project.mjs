import {execFileSync, spawnSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const repositoryRoot = path.resolve(__dirname, '../..');
export const channelRoot = path.join(repositoryRoot, 'channels/elektrotechnik');

export const imageExtensions = new Set(['.png', '.jpg', '.jpeg', '.webp', '.avif']);
export const audioExtensions = new Set(['.wav', '.mp3', '.m4a', '.aac', '.flac', '.ogg']);

export const normalizePath = (value) => value.split(path.sep).join('/');

export const readJson = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
export const writeJson = (file, value) => {
  fs.mkdirSync(path.dirname(file), {recursive: true});
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
};

export const ensureDirectory = (dir) => fs.mkdirSync(dir, {recursive: true});

export const run = (command, args, options = {}) => {
  const result = spawnSync(command, args, {
    cwd: options.cwd ?? repositoryRoot,
    stdio: options.capture ? ['ignore', 'pipe', 'pipe'] : 'inherit',
    encoding: 'utf8',
    env: {...process.env, ...options.env},
  });
  if (result.error?.code === 'ENOENT') {
    throw new Error(`Benötigtes Programm fehlt: ${command}`);
  }
  if (result.status !== 0) {
    const details = options.capture ? `\n${result.stderr || result.stdout || ''}` : '';
    throw new Error(`Befehl fehlgeschlagen (${command} ${args.join(' ')}).${details}`);
  }
  return options.capture ? String(result.stdout ?? '').trim() : '';
};

export const commandExists = (command) => {
  const probe = spawnSync(command, ['--help'], {stdio: 'ignore'});
  return !probe.error || probe.error?.code !== 'ENOENT';
};

export const requireCommands = (commands) => {
  const missing = commands.filter((command) => !commandExists(command));
  if (missing.length) {
    throw new Error(`Fehlende lokale Programme: ${missing.join(', ')}`);
  }
};

export const projectPaths = (projectArg) => {
  const root = path.resolve(projectArg);
  return {
    root,
    scriptAudio: path.join(root, '01-script-audio'),
    audioDir: path.join(root, '01-script-audio/audio'),
    sfxDir: path.join(root, '01-script-audio/sfx'),
    imagesDir: path.join(root, '02-bilder/images'),
    captionsDir: path.join(root, '03-caption'),
    pdfDir: path.join(root, '04-pdf'),
    exportDir: path.join(root, '05-export'),
    projectFilesDir: path.join(root, '06-projektdateien'),
    scenePlan: path.join(root, '06-projektdateien/scene-plan.json'),
    sfxEvents: path.join(root, '06-projektdateien/sfx-events.json'),
    assetManifest: path.join(root, '06-projektdateien/asset-manifest.json'),
    readinessReport: path.join(root, '06-projektdateien/readiness-report.json'),
    wordTimestamps: path.join(root, '03-caption/word-timestamps.json'),
    captionsJson: path.join(root, '03-caption/voiceover-final.captions.json'),
    captionsSrt: path.join(root, '05-export/voiceover-final.srt'),
    captionsVtt: path.join(root, '05-export/voiceover-final.vtt'),
    workDir: path.join(root, '06-projektdateien/.work'),
    renderDir: path.join(root, '06-projektdateien/render'),
  };
};

export const validateProjectStructure = (paths) => {
  const requiredDirectories = [
    paths.scriptAudio,
    paths.audioDir,
    paths.imagesDir,
    paths.captionsDir,
    paths.exportDir,
    paths.projectFilesDir,
  ];
  const missing = requiredDirectories.filter((dir) => !fs.existsSync(dir) || !fs.statSync(dir).isDirectory());
  if (missing.length) {
    throw new Error(`Projektstruktur unvollständig:\n${missing.map((file) => `- ${file}`).join('\n')}`);
  }
  if (!fs.existsSync(paths.scenePlan)) throw new Error(`Szenenplan fehlt: ${paths.scenePlan}`);
};

export const walkFiles = (dir) => {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, {withFileTypes: true}).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walkFiles(full) : [full];
  });
};

export const findMedia = (dir, extensions) => walkFiles(dir)
  .filter((file) => extensions.has(path.extname(file).toLowerCase()))
  .sort((a, b) => a.localeCompare(b, 'de'));

export const findVoiceFiles = (audioDir) => {
  const files = findMedia(audioDir, audioExtensions);
  const by = (pattern) => files.find((file) => pattern.test(path.basename(file).toLowerCase()));
  return {
    raw: by(/(?:raw|roh|original)/) ?? files.find((file) => !/(?:final|processed|1[._-]?10)/.test(path.basename(file).toLowerCase())),
    final: by(/(?:final|processed|1[._-]?10)/),
  };
};

export const ffprobe = (file) => {
  const raw = execFileSync('ffprobe', [
    '-v', 'error',
    '-show_streams',
    '-show_format',
    '-of', 'json',
    file,
  ], {encoding: 'utf8'});
  return JSON.parse(raw);
};

export const mediaDurationSeconds = (file) => {
  const info = ffprobe(file);
  const duration = Number(info.format?.duration ?? info.streams?.find((stream) => stream.duration)?.duration);
  if (!Number.isFinite(duration) || duration <= 0) throw new Error(`Ungültige Mediendauer: ${file}`);
  return duration;
};

export const imageMetadata = (file) => {
  const info = ffprobe(file);
  const stream = info.streams?.find((candidate) => candidate.codec_type === 'video');
  if (!stream?.width || !stream?.height) throw new Error(`Bildabmessungen nicht lesbar: ${file}`);
  return {width: Number(stream.width), height: Number(stream.height)};
};

export const normalizeWord = (value) => String(value)
  .toLocaleLowerCase('de-DE')
  .normalize('NFKD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/ß/g, 'ss')
  .replace(/[^a-z0-9äöü]+/gi, '')
  .trim();

export const normalizeWords = (value) => String(value)
  .split(/\s+/)
  .map(normalizeWord)
  .filter(Boolean);

export const parseTimestampMs = (value) => {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value !== 'string') return undefined;
  const normalized = value.replace(',', '.').trim();
  const match = normalized.match(/^(?:(\d+):)?(\d{1,2}):(\d{1,2}(?:\.\d+)?)$/);
  if (!match) return undefined;
  const hours = Number(match[1] ?? 0);
  const minutes = Number(match[2]);
  const seconds = Number(match[3]);
  return Math.round((hours * 3600 + minutes * 60 + seconds) * 1000);
};

export const toSrtTimestamp = (seconds) => {
  const totalMs = Math.max(0, Math.round(seconds * 1000));
  const hours = Math.floor(totalMs / 3_600_000);
  const minutes = Math.floor((totalMs % 3_600_000) / 60_000);
  const secs = Math.floor((totalMs % 60_000) / 1000);
  const ms = totalMs % 1000;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')},${String(ms).padStart(3, '0')}`;
};

export const toVttTimestamp = (seconds) => toSrtTimestamp(seconds).replace(',', '.');

export const copyFile = (source, destination) => {
  ensureDirectory(path.dirname(destination));
  fs.copyFileSync(source, destination);
};

export const relativeToRepository = (file) => normalizePath(path.relative(repositoryRoot, file));
