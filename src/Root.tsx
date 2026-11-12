import React from 'react';
import {Composition} from 'remotion';
import {demo} from './demo';
import {FPS,HEIGHT,WIDTH,totalFrames,type VideoSpec} from './types';
import {YouTubeVideo} from './Video';
import {ShortVideo,calculateShortMetadata} from './short/ShortVideo';
import {SHORT_FPS,SHORT_HEIGHT,SHORT_WIDTH,type ShortProps} from './short/types';

const shortDefaults:ShortProps={slug:'2026-11-12_kabellos-laden',spec:null,captions:null,hasAudio:true};

export const Root:React.FC=()=>(<>
  <Composition id="TechnikVideo" component={YouTubeVideo} durationInFrames={totalFrames(demo)}
    fps={FPS} width={WIDTH} height={HEIGHT} defaultProps={{spec:demo}}
    calculateMetadata={({props})=>({durationInFrames:totalFrames(props.spec as VideoSpec)})}/>
  <Composition id="TechnikShort" component={ShortVideo} durationInFrames={SHORT_FPS*40}
    fps={SHORT_FPS} width={SHORT_WIDTH} height={SHORT_HEIGHT} defaultProps={shortDefaults}
    calculateMetadata={calculateShortMetadata}/>
</>);
