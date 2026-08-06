import React from 'react';

export type ProtectiveConductorPathAnimationProps = {
  progress: number;
  faultProgress?: number;
  width?: number;
  height?: number;
  phaseColor?: string;
  neutralColor?: string;
  protectiveColor?: string;
  faultColor?: string;
  style?: React.CSSProperties;
};

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));

export const ProtectiveConductorPathAnimation: React.FC<ProtectiveConductorPathAnimationProps> = ({
  progress,
  faultProgress = 0,
  width = 800,
  height = 620,
  phaseColor = '#ff7b55',
  neutralColor = '#2ac7ff',
  protectiveColor = '#d8f04a',
  faultColor = '#ff4d5e',
  style,
}) => {
  const motion = clamp01(progress);
  const fault = clamp01(faultProgress);
  const scale = width / 800;
  const dots = [0.05, 0.25, 0.45, 0.65, 0.85];
  const deviceLeft = 505 * scale;
  const deviceTop = 74 * scale;

  return (
    <div
      aria-label={fault > 0.05 ? 'Fehlerstrom fließt über den Schutzleiter' : 'Normalbetrieb ohne Betriebsstrom im Schutzleiter'}
      style={{position: 'relative', width, height, ...style}}
    >
      <div style={{position: 'absolute', left: deviceLeft, top: deviceTop, width: 238 * scale, height: 390 * scale, borderRadius: 38 * scale, background: 'linear-gradient(145deg, #dbe5ea, #91a6b2)', border: `${7 * scale}px solid #627b89`, boxShadow: `0 0 ${55 * fault * scale}px ${faultColor}66`}}>
        <div style={{position: 'absolute', left: 55 * scale, top: 86 * scale, width: 120 * scale, height: 120 * scale, borderRadius: '50%', border: `${18 * scale}px solid #29455a`, boxShadow: 'inset 0 0 25px rgba(0,0,0,.45)'}} />
        <div style={{position: 'absolute', left: 88 * scale, bottom: 42 * scale, width: 62 * scale, height: 62 * scale, borderRadius: '50%', background: protectiveColor, border: `${8 * scale}px solid #173042`, boxShadow: `0 0 ${24 * scale}px ${protectiveColor}66`}} />
      </div>

      <div style={{position: 'absolute', left: 58 * scale, top: 154 * scale, width: 515 * scale, height: 22 * scale, borderRadius: 12 * scale, background: '#4b2d28', boxShadow: `0 0 ${18 * scale}px ${phaseColor}55`}} />
      <div style={{position: 'absolute', left: 58 * scale, top: 264 * scale, width: 515 * scale, height: 22 * scale, borderRadius: 12 * scale, background: '#123f5c', boxShadow: `0 0 ${18 * scale}px ${neutralColor}55`}} />
      <div style={{position: 'absolute', left: 58 * scale, top: 374 * scale, width: 535 * scale, height: 28 * scale, borderRadius: 14 * scale, background: `repeating-linear-gradient(90deg, ${protectiveColor} 0 28px, #2f6b3d 28px 56px)`, opacity: 0.45 + fault * 0.55, boxShadow: `0 0 ${28 * fault * scale}px ${protectiveColor}88`}} />

      {dots.map((base, index) => {
        const forwardX = 58 + (((base + motion * 0.42) % 1) * 500);
        const returnX = 558 - (((base + motion * 0.42) % 1) * 500);
        const peX = 575 - (((base + motion * 0.48) % 1) * 500);
        return (
          <React.Fragment key={index}>
            <div style={{position: 'absolute', left: (forwardX - 10) * scale, top: 149 * scale, width: 32 * scale, height: 32 * scale, borderRadius: '50%', background: phaseColor, boxShadow: `0 0 ${22 * scale}px ${phaseColor}`}} />
            <div style={{position: 'absolute', left: (returnX - 10) * scale, top: 259 * scale, width: 32 * scale, height: 32 * scale, borderRadius: '50%', background: neutralColor, boxShadow: `0 0 ${22 * scale}px ${neutralColor}`}} />
            {fault > 0.04 ? <div style={{position: 'absolute', left: (peX - 10) * scale, top: 372 * scale, width: 34 * scale, height: 34 * scale, borderRadius: '50%', background: protectiveColor, opacity: fault, boxShadow: `0 0 ${26 * scale}px ${protectiveColor}`}} /> : null}
          </React.Fragment>
        );
      })}

      <div style={{position: 'absolute', left: 528 * scale, top: 168 * scale, width: 24 * scale, height: 162 * fault * scale, borderRadius: 14 * scale, background: `linear-gradient(180deg, ${faultColor}, ${faultColor}66)`, boxShadow: `0 0 ${34 * fault * scale}px ${faultColor}`, transform: 'rotate(-11deg)', transformOrigin: 'top center'}} />
      {fault > 0.04 ? <div style={{position: 'absolute', left: 575 * scale, top: 282 * scale, width: 80 * scale, height: 80 * scale, borderRadius: '50%', border: `${9 * scale}px solid ${faultColor}`, opacity: fault, boxShadow: `0 0 ${32 * scale}px ${faultColor}`}} /> : null}

      <div style={{position: 'absolute', left: 62 * scale, top: 102 * scale, color: phaseColor, fontFamily: 'Arial, sans-serif', fontSize: 30 * scale, fontWeight: 950}}>Außenleiter L</div>
      <div style={{position: 'absolute', left: 62 * scale, top: 212 * scale, color: neutralColor, fontFamily: 'Arial, sans-serif', fontSize: 30 * scale, fontWeight: 950}}>Neutralleiter N</div>
      <div style={{position: 'absolute', left: 62 * scale, top: 425 * scale, color: protectiveColor, fontFamily: 'Arial, sans-serif', fontSize: 30 * scale, fontWeight: 950}}>Schutzleiter PE</div>

      <div style={{position: 'absolute', left: 0, right: 0, bottom: 28 * scale, textAlign: 'center', color: fault > 0.05 ? protectiveColor : '#f4fbff', fontFamily: 'Arial, sans-serif', fontSize: 38 * scale, fontWeight: 950}}>
        {fault > 0.05 ? 'Fehlerstrom fließt über PE' : 'PE ohne Betriebsstrom'}
      </div>
    </div>
  );
};
