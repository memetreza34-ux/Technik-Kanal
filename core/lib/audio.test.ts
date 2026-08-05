import {describe, expect, it} from 'vitest';
import {audioDurationToFrames, normalizeVolume, scaleTimestamp} from './audio';

describe('audio utilities', () => {
  it('scales timestamps for 1.10x playback', () => {
    expect(scaleTimestamp(69_000, 1.1)).toBe(62_727);
  });

  it('converts duration to complete frames', () => {
    expect(audioDurationToFrames(62.727, 30)).toBe(1882);
  });

  it('clamps SFX volume', () => {
    expect(normalizeVolume(0.8)).toBe(0.3);
    expect(normalizeVolume(-1)).toBe(0);
  });
});
