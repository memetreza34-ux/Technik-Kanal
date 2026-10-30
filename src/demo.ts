import type {VideoSpec} from './types';
export const demo:VideoSpec={
  format:'youtube-16x9',title:'Technik verstehen – 16:9-Layoutvorschau',previewOnly:true,
  chapters:[
    {id:'01',heading:'Mit dem Problem beginnen',detail:'Keine Cover-Szene. Die erste Sekunde erklärt, worum es geht.',seconds:55,visual:'hero'},
    {id:'02',heading:'Technisches Prinzip zeigen',detail:'Ein großes Schaubild, gut lesbar und mit erkennbaren Bauteilen.',seconds:60,visual:'diagram'},
    {id:'03',heading:'Ursache und Wirkung',detail:'Bewegung erklärt einen konkreten physikalischen Ablauf.',seconds:60,visual:'mechanism'},
    {id:'04',heading:'Zustände vergleichen',detail:'Die entscheidenden Unterschiede nebeneinander zeigen.',seconds:60,visual:'comparison'},
    {id:'05',heading:'Beispiele und Grenzen',detail:'Plausible Anwendungen, keine dekorativen Füllszenen.',seconds:60,visual:'diagram'},
    {id:'06',heading:'Klare fachliche Antwort',detail:'Zum Schluss eine verständliche und präzise Erkenntnis.',seconds:55,visual:'conclusion'}
  ]
};
