import {describe, expect, it} from 'vitest';
import {
  VISIBLE_TEXT_LOCK_MARKER,
  applyMasterVisibleTextLock,
  applySceneVisibleTextLock,
} from './science-visible-text-lock.mjs';

describe('science visible text lock', () => {
  it('forbids scene metadata from becoming visible image text', () => {
    const result = applySceneVisibleTextLock('Create one refrigerator.');
    expect(result).toContain(VISIBLE_TEXT_LOCK_MARKER);
    expect(result).toContain('Never render scene numbers, beat numbers, scene IDs');
    expect(result).toContain('Never carry a thumbnail headline into a normal scene');
    expect(result).toContain('REJECT that image and regenerate it');
  });

  it('is idempotent for scene prompts', () => {
    const once = applySceneVisibleTextLock('Create one refrigerator.');
    const twice = applySceneVisibleTextLock(once);
    expect(twice.match(new RegExp(VISIBLE_TEXT_LOCK_MARKER, 'g'))?.length).toBe(1);
  });

  it('puts the hard lock before master-prompt instructions', () => {
    const result = applyMasterVisibleTextLock('GOOGLE FLOW MASTER PROMPT');
    expect(result.startsWith(VISIBLE_TEXT_LOCK_MARKER)).toBe(true);
    expect(result).toContain('THUMBNAIL EXCEPTION');
  });
});
