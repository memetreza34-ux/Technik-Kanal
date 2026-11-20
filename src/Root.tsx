import React from 'react';
import {Composition} from 'remotion';
import {demo} from './demo';
import {FPS,HEIGHT,WIDTH,totalFrames,type VideoSpec} from './types';
import {YouTubeVideo} from './Video';
import {ShortVideo,calculateShortMetadata} from './short/ShortVideo';
import {SHORT_FPS,SHORT_HEIGHT,SHORT_WIDTH,type ShortProps} from './short/types';
import {TOUR,TOUR_STEP_S,WorldTour} from './world/WorldTour';
import {StromWasser} from './demos/StromWasser';
import {Steckdose} from './demos/Steckdose';
import {Kuehlschrank} from './demos/Kuehlschrank';
import {Wendeschuetz} from './demos/Wendeschuetz';
import {Drehfeld} from './demos/Drehfeld';
import {Motor3D} from './demos/Motor3D';
import {ZoneGuide} from './frame/Frame';
import {Illustration, type IllustrationProps} from './illustration/Illustration';
import {Bildfolge, bildfolgeFrames, type BildfolgeProps} from './illustration/Bildfolge';

const illuDefaults: IllustrationProps = {image: 'illustration/beispiel.jpeg'};
const bildfolgeDefaults: BildfolgeProps = {end: 3, scenes: [{start: 0, image: 'illustration/beispiel.jpeg'}]};
import {AbsoluteFill} from 'remotion';

const shortDefaults:ShortProps={slug:'2026-11-12_kabellos-laden',spec:null,captions:null,hasAudio:true};

export const Root:React.FC=()=>(<>
  <Composition id="TechnikVideo" component={YouTubeVideo} durationInFrames={totalFrames(demo)}
    fps={FPS} width={WIDTH} height={HEIGHT} defaultProps={{spec:demo}}
    calculateMetadata={({props})=>({durationInFrames:totalFrames(props.spec as VideoSpec)})}/>
  <Composition id="TechnikShort" component={ShortVideo} durationInFrames={SHORT_FPS*40}
    fps={SHORT_FPS} width={SHORT_WIDTH} height={SHORT_HEIGHT} defaultProps={shortDefaults}
    calculateMetadata={calculateShortMetadata}/>
  <Composition id="TechnikWelt" component={WorldTour} durationInFrames={Math.round(SHORT_FPS*TOUR_STEP_S*TOUR.length)}
    fps={SHORT_FPS} width={SHORT_WIDTH} height={SHORT_HEIGHT}/>
  {/* Stil-Proben: 10 s, nur Bild */}
  <Composition id="DemoStromWasser" component={StromWasser} durationInFrames={300} fps={SHORT_FPS} width={SHORT_WIDTH} height={SHORT_HEIGHT}/>
  <Composition id="DemoSteckdose" component={Steckdose} durationInFrames={300} fps={SHORT_FPS} width={SHORT_WIDTH} height={SHORT_HEIGHT}/>
  <Composition id="DemoKuehlschrank" component={Kuehlschrank} durationInFrames={300} fps={SHORT_FPS} width={SHORT_WIDTH} height={SHORT_HEIGHT}/>
  <Composition id="DemoWendeschuetz" component={Wendeschuetz} durationInFrames={300} fps={SHORT_FPS} width={SHORT_WIDTH} height={SHORT_HEIGHT}/>
  <Composition id="DemoDrehfeld" component={Drehfeld} durationInFrames={450} fps={SHORT_FPS} width={SHORT_WIDTH} height={SHORT_HEIGHT}/>
  <Composition id="DemoMotor3D" component={Motor3D} durationInFrames={450} fps={SHORT_FPS} width={SHORT_WIDTH} height={SHORT_HEIGHT}/>
  {/* Langvideo: KI-Bild + eigene Beschriftung (Standbild) */}
  <Composition id="Illustration" component={Illustration} durationInFrames={1} fps={30} width={1920} height={1080} defaultProps={illuDefaults} />
  <Composition id="Bildfolge" component={Bildfolge} durationInFrames={90} fps={30} width={1920} height={1080} defaultProps={bildfolgeDefaults}
    calculateMetadata={({props})=>({durationInFrames:bildfolgeFrames(props as BildfolgeProps,30)})}/>
  <Composition id="RahmenVorlage" component={()=>(<AbsoluteFill style={{background:'#14161a'}}><ZoneGuide/></AbsoluteFill>)} durationInFrames={1} fps={SHORT_FPS} width={SHORT_WIDTH} height={SHORT_HEIGHT}/>
</>);
