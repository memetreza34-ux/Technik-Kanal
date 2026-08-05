import {spawnSync} from 'node:child_process';
import {existsSync} from 'node:fs';
import {dirname, resolve} from 'node:path';
import {mkdirSync} from 'node:fs';

const VOICE_SPEED = 1.10;
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

const result = spawnSync(
  'ffmpeg',
  ['-y', '-i', input, '-filter:a', `atempo=${VOICE_SPEED.toFixed(2)}`, '-ar', '48000', output],
  {stdio: 'inherit'},
);

if (result.error?.code === 'ENOENT') {
  console.error('FFmpeg is not installed or not available in PATH.');
  process.exit(1);
}

if (result.status !== 0) {
  process.exit(result.status ?? 1);
}

console.log(`Voice-over processed at ${VOICE_SPEED.toFixed(2)}x without pitch shift: ${output}`);
