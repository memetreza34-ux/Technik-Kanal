export type VisualKind='hero'|'diagram'|'comparison'|'mechanism'|'conclusion';
export type VideoChapter={id:string;heading:string;detail:string;seconds:number;visual:VisualKind;script?:string};
export type VideoSpec={format:'youtube-16x9';title:string;status?:'draft'|'ready';previewOnly?:boolean;voiceoverPath?:string;chapters:VideoChapter[]};
export const FPS=30;
export const WIDTH=1920;
export const HEIGHT=1080;
export const framesFor=(seconds:number)=>Math.max(1,Math.round(seconds*FPS));
export const totalFrames=(spec:VideoSpec)=>spec.chapters.reduce((sum,ch)=>sum+framesFor(ch.seconds),0);
