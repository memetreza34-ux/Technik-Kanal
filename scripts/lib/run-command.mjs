import {spawnSync} from 'node:child_process';

export const runCommand = (command, args = [], options = {}) => {
  const result = spawnSync(command, args, {
    cwd: options.cwd ?? process.cwd(),
    stdio: options.capture ? ['ignore', 'pipe', 'pipe'] : 'inherit',
    encoding: 'utf8',
    env: {...process.env, ...options.env},
  });

  if (result.error?.code === 'ENOENT') throw new Error(`Programm fehlt: ${command}`);
  if (result.status !== 0) {
    const output = options.capture ? `\n${result.stderr || result.stdout || ''}` : '';
    throw new Error(`Befehl fehlgeschlagen: ${command} ${args.join(' ')}${output}`);
  }

  return options.capture ? String(result.stdout ?? '').trim() : '';
};
