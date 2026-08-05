import {Composition} from 'remotion';
import {
  SICHERUNGS_REEL_FPS,
  SICHERUNGS_REEL_HEIGHT,
  SICHERUNGS_REEL_TOTAL_FRAMES,
  SICHERUNGS_REEL_WIDTH,
  SicherungsReel,
} from './SicherungsReel';

export const ElektrotechnikRoot = () => (
  <Composition
    id="SicherungsReel"
    component={SicherungsReel}
    durationInFrames={SICHERUNGS_REEL_TOTAL_FRAMES}
    fps={SICHERUNGS_REEL_FPS}
    width={SICHERUNGS_REEL_WIDTH}
    height={SICHERUNGS_REEL_HEIGHT}
  />
);
