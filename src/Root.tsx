import React from 'react';
import {Composition} from 'remotion';
import {demo} from './demo';
import {FPS,HEIGHT,WIDTH,totalFrames,type VideoSpec} from './types';
import {YouTubeVideo} from './Video';

export const Root:React.FC=()=>(
  <Composition id="TechnikVideo" component={YouTubeVideo} durationInFrames={totalFrames(demo)}
    fps={FPS} width={WIDTH} height={HEIGHT} defaultProps={{spec:demo}}
    calculateMetadata={({props})=>({durationInFrames:totalFrames(props.spec as VideoSpec)})}/>
);
