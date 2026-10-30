import React from 'react';
import type {VisualKind} from './types';
const cyan='#72e6ff',gold='#ffc857',white='#eaf7fa';
export const TechnicalVisual:React.FC<{kind:VisualKind;progress:number}>=({kind,progress})=>{
  const p=Math.max(0,Math.min(1,progress));
  return <svg width="750" height="470" viewBox="0 0 750 470" role="img" aria-label="Schematische Technikvisualisierung">
    <defs><linearGradient id="metal" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#c5d8e2"/><stop offset="1" stopColor="#638296"/></linearGradient></defs>
    {kind==='comparison'?<>
      <rect x="25" y="32" width="320" height="380" rx="22" fill="#133349" stroke={cyan} strokeWidth="3"/>
      <rect x="405" y="32" width="320" height="380" rx="22" fill="#133349" stroke={gold} strokeWidth="3"/>
      <text x="185" y="95" fill={cyan} fontSize="32" fontWeight="bold" textAnchor="middle">ZUSTAND A</text>
      <text x="565" y="95" fill={gold} fontSize="32" fontWeight="bold" textAnchor="middle">ZUSTAND B</text>
      <path d="M85 260H285" stroke={cyan} strokeWidth="20" strokeLinecap="round"/>
      <path d="M468 260H518M615 260H665" stroke={gold} strokeWidth="20" strokeLinecap="round"/>
      <path d="M518 260L590 200" stroke={gold} strokeWidth="12" strokeLinecap="round"/>
      <circle cx="518" cy="260" r="12" fill={white}/>
    </>:kind==='diagram'?<>
      <path d="M65 250H195L255 140H465L545 250H680" stroke="#244b61" strokeWidth="30" fill="none" strokeLinejoin="round" strokeLinecap="round"/>
      <path d="M65 250H195L255 140H465L545 250H680" stroke={cyan} strokeWidth="11" fill="none" strokeDasharray="26 25" strokeDashoffset={-Math.round(p*380)} strokeLinejoin="round" strokeLinecap="round"/>
      <circle cx="255" cy="140" r="25" fill="#173c53" stroke={gold} strokeWidth="7"/>
      <circle cx="465" cy="140" r="25" fill="#173c53" stroke={gold} strokeWidth="7"/>
      <rect x="225" y="320" width="310" height="64" rx="15" fill="#15394e"/>
      <text x="380" y="363" textAnchor="middle" fill={white} fontSize="27">TECHNISCHES MODELL</text>
    </>:kind==='mechanism'?<>
      <rect x="95" y="50" width="565" height="365" rx="32" fill="#123248" stroke="#7698a9" strokeWidth="4"/>
      <rect x="160" y="135" width="110" height="170" rx="15" fill="url(#metal)"/>
      <path d="M215 165V280" stroke="#214254" strokeWidth="18" strokeLinecap="round"/>
      <path d="M270 235H355" stroke={cyan} strokeWidth="13" strokeLinecap="round"/>
      <path d="M355 235L470 194" stroke={gold} strokeWidth="13" strokeLinecap="round" transform={'rotate('+(p*17)+' 355 235)'}/>
      <path d="M505 235H585" stroke={cyan} strokeWidth="13" strokeLinecap="round"/>
      <circle cx="355" cy="235" r="13" fill={white}/>
      <text x="375" y="360" textAnchor="middle" fill={white} fontSize="27">URSACHE → REAKTION</text>
    </>:<>
      <rect x="203" y="36" width="345" height="390" rx="36" fill="url(#metal)" stroke="#46687c" strokeWidth="6"/>
      <rect x="244" y="120" width="260" height="196" rx="20" fill="#15384d"/>
      <path d="M302 225H350L390 170L428 253H462" stroke={kind==='conclusion'?gold:cyan} strokeWidth="14" fill="none" strokeLinejoin="round" strokeLinecap="round"/>
      <rect x="248" y="346" width="257" height="42" rx="10" fill="#e2ebef"/>
      <text x="376" y="373" textAnchor="middle" fill="#18384d" fontSize="24" fontWeight="bold">TECHNIK</text>
    </>}
  </svg>;
};
