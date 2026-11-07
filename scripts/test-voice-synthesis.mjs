#!/usr/bin/env node

import assert from 'node:assert/strict';
import { access, mkdir, mkdtemp, readFile, rm, stat, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import {
  DEFAULT_PRESET,
  VOICE_PRESETS,
  buildVoiceBoostFilter,
  formatAtempoFilter,
  loadVoicePolicy,
  normalizeGermanScriptForTts,
  parseProfileTempo,
  resolveRepoPath,
  resolveVoiceConfig,
  splitScriptIntoParagraphs,
  synthesizeProjectVoiceover
} from './lib/voice-synthesis.mjs';

test('Technik-Kanal VOICE_PRESETS enthält ausschließlich stickman-user-clone (0.95x Tempo)', () => {
  assert.deepEqual(Object.keys(VOICE_PRESETS), ['stickman-user-clone']);
  assert.equal(DEFAULT_PRESET, 'stickman-user-clone');

  const klon = VOICE_PRESETS['stickman-user-clone'];
  assert.equal(klon.provider, 'qwen-mlx');
  assert.equal(klon.tempo, 0.95);
  assert.equal(klon.rate, '-5%');
  assert.equal(klon.maxPauseSeconds, 0.30);
  assert.equal(klon.preStretchMaxPauseSeconds, 0.285);
  assert.equal(klon.maxWordsPerChunk, 32);
  assert.equal(klon.temperature, 0.7);
});

test('config/voice-policy.json, Reference-Audio und voice-v1.json sind kalibriert und STIMMEN-VERGLEICH ist gelöscht', async () => {
  const policy = await loadVoicePolicy();
  assert.equal(policy.defaultProfile, 'stickman-user-clone');
  assert.deepEqual(Object.keys(policy.profiles), ['stickman-user-clone']);

  const profile = policy.profiles['stickman-user-clone'];
  assert.equal(profile.tempo, 0.95);
  assert.equal(profile.maxPauseSeconds, 0.30);
  assert.equal(profile.preStretchMaxPauseSeconds, 0.285);
  assert.equal(profile.maxWordsPerChunk, 32);

  const wavStat = await stat(resolveRepoPath(profile.refAudio));
  assert.ok(wavStat.size > 800_000, 'Master-Referenz-WAV muss vollständig sein');

  const voiceV1 = JSON.parse(
    await readFile(resolveRepoPath('channels/science/engine/config/voice-v1.json'), 'utf8')
  );
  assert.equal(voiceV1.voice, 'stickman-user-clone');
  assert.equal(voiceV1.provider, 'qwen-mlx');
  assert.equal(voiceV1.cloneTempo, 0.95);
  assert.equal(voiceV1.maxPauseSeconds, 0.30);

  // Alter STIMMEN-VERGLEICH Ordner muss gelöscht sein
  await assert.rejects(
    access(
      resolveRepoPath(
        'START-HIER/nicht-die-dicke-warum-kugelsicheres-glas-gewehrkugeln-stoppt/STIMMEN-VERGLEICH'
      )
    )
  );
});

test('Filter, Normalisierung, 32-Wort-Chunking und Dry-Run funktionieren fehlerfrei', async () => {
  const policy = await loadVoicePolicy();
  const filter = buildVoiceBoostFilter(policy.voiceBoost);
  assert.ok(!filter.includes('[object Object]'));
  assert.ok(filter.includes('highpass=f=75'));
  assert.equal(formatAtempoFilter(parseProfileTempo({ tempo: 0.95 })), 'atempo=0.95');

  const norm = normalizeGermanScriptForTts('Bei 20 °C und 100 km/h fließen z. B. 50% mehr Strom.');
  assert.ok(norm.includes('20 Grad Celsius'));
  assert.ok(norm.includes('100 Kilometer pro Stunde'));
  assert.ok(norm.includes('zum Beispiel'));
  assert.ok(norm.includes('50 Prozent'));

  const longText = Array.from({ length: 15 }, (_, i) => `Satz ${i + 1} erklärt die Physik hinter Panzerglas und Spannung.`).join(' ');
  const chunks = splitScriptIntoParagraphs(longText);
  assert.ok(chunks.length >= 4);
  for (const c of chunks) {
    assert.ok(c.text.split(/\s+/).filter(Boolean).length <= 32);
  }

  const tmpDir = await mkdtemp(path.join(os.tmpdir(), 'technik-voice-test-'));
  try {
    await assert.rejects(synthesizeProjectVoiceover(tmpDir, { dryRun: true }), /Voice-Script fehlt/);
    const scriptDir = path.join(tmpDir, '01-script-audio');
    await mkdir(scriptDir, { recursive: true });
    await writeFile(path.join(scriptDir, 'voiceover.txt'), 'Warum stoppt Panzerglas eine Gewehrkugel?\n\nDie Antwort liegt im Schichtaufbau.', 'utf8');

    const res = await synthesizeProjectVoiceover(tmpDir, { dryRun: true });
    assert.equal(res.dryRun, true);
    assert.equal(res.config.preset, 'stickman-user-clone');
    assert.equal(res.config.tempo, 0.95);
    assert.equal(res.totalChunks, 2);
  } finally {
    await rm(tmpDir, { recursive: true, force: true });
  }
});
