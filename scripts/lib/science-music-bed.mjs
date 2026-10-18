import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';

// Leiser Musikteppich unter der Stimme.
// Die Musik liegt in 01-script-audio/musik/ (genau eine Audiodatei plus QUELLE.txt mit
// Herkunft und Lizenz). Ohne Quellenangabe wird nicht gerendert: fremde Musik ohne Lizenz
// löst Content-ID-Ansprüche aus. Empfohlen: YouTube Audio Library (Studio → Audio-Mediathek).

export const MUSIC_FOLDER = '01-script-audio/musik';
export const MUSIC_SOURCE_FILE = 'QUELLE.txt';
export const DEFAULT_MUSIC_BED = {targetLufs: -30, truePeakDb: -3, fadeInSeconds: 2, fadeOutSeconds: 3, sourceNoteRequired: true};
const AUDIO = new Set(['.wav', '.mp3', '.m4a', '.aac', '.flac', '.ogg']);

export const findMusic = (projectRoot) => {
  const dir = path.join(projectRoot, MUSIC_FOLDER);
  if (!fs.existsSync(dir)) return null;
  const tracks = fs.readdirSync(dir).filter((name) => !name.startsWith('.') && AUDIO.has(path.extname(name).toLowerCase()));
  if (!tracks.length) return null;
  if (tracks.length > 1) throw new Error(`Mehr als eine Musikdatei in ${MUSIC_FOLDER}: ${tracks.join(', ')}. Genau eine behalten.`);
  const sourceFile = path.join(dir, MUSIC_SOURCE_FILE);
  const source = fs.existsSync(sourceFile) ? fs.readFileSync(sourceFile, 'utf8').trim() : '';
  return {file: path.join(dir, tracks[0]), source, sourceFile};
};

export const assertMusicSource = (music, {sourceNoteRequired = true} = {}) => {
  if (sourceNoteRequired && (!music.source || music.source.length < 10)) {
    throw new Error(`Musikquelle fehlt: In ${MUSIC_FOLDER}/${MUSIC_SOURCE_FILE} Titel, Künstler, Quelle und Lizenz eintragen (z. B. „YouTube Audio Library – Titel – Künstler – keine Namensnennung erforderlich“). Ohne Lizenznachweis wird nicht gerendert.`);
  }
};

// Ffmpeg-Filter: Schleife auf Videolänge, Lautheit normalisieren, sanft ein- und ausblenden.
export const musicBedFilter = ({durationSeconds, targetLufs, truePeakDb, fadeInSeconds, fadeOutSeconds}) => {
  const fadeOut = Math.min(fadeOutSeconds, durationSeconds / 4);
  const fadeIn = Math.min(fadeInSeconds, durationSeconds / 4);
  return [
    `loudnorm=I=${targetLufs}:TP=${truePeakDb}:LRA=11`,
    `afade=t=in:st=0:d=${fadeIn.toFixed(2)}`,
    `afade=t=out:st=${Math.max(0, durationSeconds - fadeOut).toFixed(2)}:d=${fadeOut.toFixed(2)}`,
  ].join(',');
};

export const buildMusicBed = ({input, output, durationSeconds, settings = DEFAULT_MUSIC_BED}) => {
  const options = {...DEFAULT_MUSIC_BED, ...settings};
  fs.mkdirSync(path.dirname(output), {recursive: true});
  const result = spawnSync('ffmpeg', ['-v', 'error', '-y', '-stream_loop', '-1', '-i', input, '-t', durationSeconds.toFixed(3), '-af', musicBedFilter({durationSeconds, ...options}), '-ar', '48000', '-ac', '2', output], {encoding: 'utf8'});
  if (result.error?.code === 'ENOENT') throw new Error('ffmpeg fehlt für den Musikteppich (brew install ffmpeg).');
  if (result.status !== 0) throw new Error(`Musikteppich konnte nicht erzeugt werden: ${result.stderr}`);
  return output;
};

export const measureLoudness = (file) => {
  const result = spawnSync('ffmpeg', ['-hide_banner', '-nostats', '-i', file, '-af', 'loudnorm=print_format=json', '-f', 'null', '-'], {encoding: 'utf8'});
  const json = String(result.stderr ?? '').match(/\{[\s\S]*?"input_i"[\s\S]*?\}/);
  return json ? Number(JSON.parse(json[0]).input_i) : null;
};
