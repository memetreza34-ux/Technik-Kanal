export type SilenceWindow = {startMs: number; endMs: number};

export const scaleTimestamp = (milliseconds: number, speed: number) => {
  if (!Number.isFinite(milliseconds) || milliseconds < 0) throw new Error('milliseconds must be non-negative');
  if (!Number.isFinite(speed) || speed <= 0) throw new Error('speed must be positive');
  return Math.round(milliseconds / speed);
};

export const scaleWindows = (windows: SilenceWindow[], speed: number): SilenceWindow[] =>
  windows.map((window) => ({
    startMs: scaleTimestamp(window.startMs, speed),
    endMs: scaleTimestamp(window.endMs, speed),
  }));

export const audioDurationToFrames = (durationSeconds: number, fps: number) => {
  if (!Number.isFinite(durationSeconds) || durationSeconds <= 0) throw new Error('durationSeconds must be positive');
  if (!Number.isFinite(fps) || fps <= 0) throw new Error('fps must be positive');
  return Math.ceil(durationSeconds * fps);
};

export const normalizeVolume = (volume: number, maximum = 0.3) =>
  Math.max(0, Math.min(maximum, Number.isFinite(volume) ? volume : 0));
