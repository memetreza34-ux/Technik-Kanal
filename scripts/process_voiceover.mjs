import {spawnSync} from 'node:child_process';
import {existsSync, mkdirSync} from 'node:fs';
import {dirname, resolve} from 'node:path';

const VOICE_SPEED = 1.10;
const TARGET_LUFS = -16;
const TARGET_TRUE_PEAK_DB = -1.5;
const TARGET_LRA = 11;
const [inputArg, outputArg] = process.argv.slice(2);

if (!inputArg || !outputArg) {
  console.error('Usage: npm run voice:1.10 -- <input.wav> <output.wav>');
  process.exit(1);
}

const input = resolve(inputArg);
const output = resolve(outputArg);

if (!existsSync(input)) {
  console.error(`Input file not found: ${input}`);
  process.exit(1);
}

mkdirSync(dirname(output), {recursive: true});

// atempo verändert die Geschwindigkeit ohne Pitch-Shift. Danach wird die Stimme
// auf ein einheitliches Social-Video-Lautheitsziel normalisiert.
const audioFilter = [
  `atempo=${VOICE_SPEED.toFixed(2)}`,
  `loudnorm=I=${TARGET_LUFS}:TP=${TARGET_TRUE_PEAK_DB}:LRA=${TARGET_LRA}`,
].join(',');

const result = spawnSync(
  'ffmpeg',
  [
    '-y',
    '-i', input,
    '-filter:a', audioFilter,
    '-ar', '48000',
    '-ac', '1',
    '-c:a', 'pcm_s16le',
    output,
  ],
  {stdio: 'inherit'},
);

if (result.error?.code === 'ENOENT') {
  console.error('FFmpeg is not installed or not available in PATH.');
  process.exit(1);
}

if (result.status !== 0) {
  process.exit(result.status ?? 1);
}

console.log(
  `Voice-over processed: ${VOICE_SPEED.toFixed(2)}x, ${TARGET_LUFS} LUFS target, ` +
  `${TARGET_TRUE_PEAK_DB} dBTP target, 48 kHz mono: ${output}`,
);
