import React from 'react';
import {AbsoluteFill,Audio,Sequence,interpolate,staticFile,useCurrentFrame} from 'remotion';
import {TechnicalVisual} from './TechnicalVisual';
import {framesFor,type VideoChapter,type VideoSpec} from './types';
const clamp={extrapolateLeft:'clamp' as const,extrapolateRight:'clamp' as const};
const ChapterScene:React.FC<{chapter:VideoChapter;index:number;total:number}>=({chapter,index,total})=>{
  const frame=useCurrentFrame(),duration=framesFor(chapter.seconds);
  const appear=interpolate(frame,[0,18],[0,1],clamp);
  const progress=interpolate(frame,[0,Math.max(1,duration-1)],[0,1],clamp);
  return <AbsoluteFill style={{background:'radial-gradient(circle at 65% 43%,#143b52 0%,#071d2e 52%,#03101d 100%)',color:'#edf7fb',fontFamily:'Arial,Helvetica,sans-serif'}}>
    <AbsoluteFill style={{opacity:.13,backgroundImage:'linear-gradient(rgba(114,230,255,.2) 1px,transparent 1px),linear-gradient(90deg,rgba(114,230,255,.2) 1px,transparent 1px)',backgroundSize:'90px 90px'}}/>
    <div style={{position:'absolute',left:110,top:65,right:110,display:'flex',justifyContent:'space-between',fontSize:23,letterSpacing:3,color:'#a7c4d1',fontWeight:800}}>
      <span>TECHNIK VERSTEHEN</span><span>KAPITEL {String(index+1).padStart(2,'0')} / {String(total).padStart(2,'0')}</span>
    </div>
    <div style={{position:'absolute',top:235,left:110,width:850,opacity:appear,transform:'translateY('+((1-appear)*25)+'px)'}}>
      <div style={{fontWeight:900,fontSize:68,lineHeight:1.07}}>{chapter.heading}</div>
      <div style={{width:130,height:7,background:'#72e6ff',marginTop:38,marginBottom:35,borderRadius:4}}/>
      <div style={{fontSize:36,lineHeight:1.35,color:'#bfd5e1'}}>{chapter.detail}</div>
    </div>
    <div style={{position:'absolute',left:1020,top:275,opacity:appear}}><TechnicalVisual kind={chapter.visual} progress={progress}/></div>
    <div style={{position:'absolute',left:110,right:110,bottom:65,height:5,background:'rgba(114,230,255,.16)'}}>
      <div style={{height:'100%',width:(progress*100)+'%',background:'#72e6ff'}}/>
    </div>
  </AbsoluteFill>;
};
export const YouTubeVideo:React.FC<{spec:VideoSpec}>=({spec})=>{
  let start=0;
  const nodes=spec.chapters.map((chapter,index)=>{
    const from=start,duration=framesFor(chapter.seconds);start+=duration;
    return <Sequence key={chapter.id} from={from} durationInFrames={duration}><ChapterScene chapter={chapter} index={index} total={spec.chapters.length}/></Sequence>;
  });
  return <AbsoluteFill style={{background:'#03101d'}}>
    {spec.voiceoverPath?<Audio src={staticFile(spec.voiceoverPath)}/>:null}
    {nodes}
    {spec.previewOnly?<div style={{position:'absolute',bottom:24,right:85,zIndex:100,color:'#ffcf77',fontFamily:'Arial',fontWeight:800,fontSize:24}}>LAYOUT-DEMO – NICHT VERÖFFENTLICHEN</div>:null}
  </AbsoluteFill>;
};
