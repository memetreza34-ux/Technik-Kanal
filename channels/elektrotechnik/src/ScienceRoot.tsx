import {Composition} from 'remotion';
import {
  SCIENCE_REEL_FPS,
  SCIENCE_REEL_HEIGHT,
  SCIENCE_REEL_TOTAL_FRAMES,
  SCIENCE_REEL_WIDTH,
  ScienceReel,
} from './ScienceReel';

export const ScienceRoot = () => (
  <Composition
    id="ScienceReel"
    component={ScienceReel}
    durationInFrames={SCIENCE_REEL_TOTAL_FRAMES}
    fps={SCIENCE_REEL_FPS}
    width={SCIENCE_REEL_WIDTH}
    height={SCIENCE_REEL_HEIGHT}
  />
);
