import {Composition} from 'remotion';
import {
  FI_REEL_FPS,
  FI_REEL_HEIGHT,
  FI_REEL_TOTAL_FRAMES,
  FI_REEL_WIDTH,
  FiSchalterReel,
} from './FiSchalterReel';
import {
  LS_REEL_FPS,
  LS_REEL_HEIGHT,
  LS_REEL_TOTAL_FRAMES,
  LS_REEL_WIDTH,
  LeitungsschutzschalterReel,
} from './LeitungsschutzschalterReel';
import {
  SCHUTZLEITER_REEL_FPS,
  SCHUTZLEITER_REEL_HEIGHT,
  SCHUTZLEITER_REEL_TOTAL_FRAMES,
  SCHUTZLEITER_REEL_WIDTH,
  SchutzleiterReel,
} from './SchutzleiterReel';
import {
  SICHERUNGS_REEL_FPS,
  SICHERUNGS_REEL_HEIGHT,
  SICHERUNGS_REEL_TOTAL_FRAMES,
  SICHERUNGS_REEL_WIDTH,
  SicherungsReel,
} from './SicherungsReel';

export const ElektrotechnikRoot = () => (
  <>
    <Composition id="SicherungsReel" component={SicherungsReel} durationInFrames={SICHERUNGS_REEL_TOTAL_FRAMES} fps={SICHERUNGS_REEL_FPS} width={SICHERUNGS_REEL_WIDTH} height={SICHERUNGS_REEL_HEIGHT}/>
    <Composition id="FiSchalterReel" component={FiSchalterReel} durationInFrames={FI_REEL_TOTAL_FRAMES} fps={FI_REEL_FPS} width={FI_REEL_WIDTH} height={FI_REEL_HEIGHT}/>
    <Composition id="SchutzleiterReel" component={SchutzleiterReel} durationInFrames={SCHUTZLEITER_REEL_TOTAL_FRAMES} fps={SCHUTZLEITER_REEL_FPS} width={SCHUTZLEITER_REEL_WIDTH} height={SCHUTZLEITER_REEL_HEIGHT}/>
    <Composition id="LeitungsschutzschalterReel" component={LeitungsschutzschalterReel} durationInFrames={LS_REEL_TOTAL_FRAMES} fps={LS_REEL_FPS} width={LS_REEL_WIDTH} height={LS_REEL_HEIGHT}/>
  </>
);
