import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {describe, expect, it} from 'vitest';
import {ELECTRICAL_REEL_DIRECTORIES, checkElectricalProjectStructure, electricalProjectPaths} from './lib/electrical-project-structure.mjs';

describe('science project folder gate', () => {
  it('does not allow a separate caption folder', () => {
    expect(ELECTRICAL_REEL_DIRECTORIES).not.toContain('03-caption');
    const root = fs.mkdtempSync(path.join(os.tmpdir(), 'science-folder-'));
    const paths = electricalProjectPaths(root);
    expect(paths.socialCaption).toBe(path.join(root, '05-export/social-caption.md'));
    expect(paths.wordTimestamps).toBe(path.join(root, '05-export/word-timestamps.json'));
    expect(paths.captionsFinal).toBe(path.join(root, '05-export/voiceover-final.captions.json'));
    expect(paths.captionsDir).toBe(path.join(root, '05-export'));
    fs.rmSync(root, {recursive: true, force: true});
  });

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
    expect(fs.existsSync(path.join(root, '03-caption'))).toBe(false);
    fs.rmSync(root, {recursive: true, force: true});
  });
});
