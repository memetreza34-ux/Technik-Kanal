import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {describe, expect, it} from 'vitest';
import {ELECTRICAL_REEL_DIRECTORIES, checkElectricalProjectStructure} from './lib/electrical-project-structure.mjs';

describe('science project folder gate', () => {
  it('detects missing folders', () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'science-folder-'));
    const result = checkElectricalProjectStructure(root, {requireContent: false});
    expect(result.ok).toBe(false);
    expect(result.missingDirectories.length).toBe(ELECTRICAL_REEL_DIRECTORIES.length);
    fs.rmSync(root, {recursive: true, force: true});
  });

  it('accepts the complete directory contract', () => {
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'science-folder-'));
    for (const relative of ELECTRICAL_REEL_DIRECTORIES) fs.mkdirSync(path.join(root, relative), {recursive: true});
    expect(checkElectricalProjectStructure(root, {requireContent: false}).ok).toBe(true);
    fs.rmSync(root, {recursive: true, force: true});
  });
});
