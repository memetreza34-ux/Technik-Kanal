import {Composition} from 'remotion';
import {
  FI_REEL_FPS,
  FI_REEL_HEIGHT,
  FI_REEL_TOTAL_FRAMES,
  FI_REEL_WIDTH,
  FiSchalterReel,
} from './FiSchalterReel';
import {
  SICHERUNGS_REEL_FPS,
  SICHERUNGS_REEL_HEIGHT,
  SICHERUNGS_REEL_TOTAL_FRAMES,
  SICHERUNGS_REEL_WIDTH,
  SicherungsReel,
} from './SicherungsReel';

export const ElektrotechnikRoot = () => (
  <>
    <Composition
      id="SicherungsReel"
      component={SicherungsReel}
      durationInFrames={SICHERUNGS_REEL_TOTAL_FRAMES}
      fps={SICHERUNGS_REEL_FPS}
      width={SICHERUNGS_REEL_WIDTH}
      height={SICHERUNGS_REEL_HEIGHT}
    />
    <Composition
      id="FiSchalterReel"
      component={FiSchalterReel}
      durationInFrames={FI_REEL_TOTAL_FRAMES}
      fps={FI_REEL_FPS}
      width={FI_REEL_WIDTH}
      height={FI_REEL_HEIGHT}
    />
  </>
);
