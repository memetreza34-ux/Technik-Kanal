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
  <Composition id="RahmenVorlage" component={()=>(<AbsoluteFill style={{background:'#14161a'}}><ZoneGuide/></AbsoluteFill>)} durationInFrames={1} fps={SHORT_FPS} width={SHORT_WIDTH} height={SHORT_HEIGHT}/>
</>);
