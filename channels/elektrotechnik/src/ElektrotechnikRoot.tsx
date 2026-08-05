import {Composition} from 'remotion';
import {SICHERUNGS_REEL_TOTAL_FRAMES, SicherungsReel} from './SicherungsReel';

export const ElektrotechnikRoot = () => (
  <Composition
    id="SicherungsReel"
    component={SicherungsReel}
    durationInFrames={SICHERUNGS_REEL_TOTAL_FRAMES}
    fps={30}
    width={1080}
    height={1920}
  />
);
