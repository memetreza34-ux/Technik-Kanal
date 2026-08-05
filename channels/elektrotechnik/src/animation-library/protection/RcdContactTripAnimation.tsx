import React from 'react';

export type RcdContactTripAnimationProps = {
  progress: number;
  width?: number;
  height?: number;
  label?: string;
  activeColor?: string;
  tripColor?: string;
  explanationColor?: string;
  style?: React.CSSProperties;
};

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));

export const RcdContactTripAnimation: React.FC<RcdContactTripAnimationProps> = ({
  progress,
  width = 360,
  height = 590,
  label = 'FI / RCD',
  activeColor = '#2ac7ff',
  tripColor = '#ff4d5e',
  explanationColor = '#ffc857',
  style,
}) => {
  const p = clamp01(progress);
  const scale = width / 360;
  const tripped = p > 0.52;
  const contactGap = 4 + p * 58;
  const leverAngle = -18 + p * 48;
  const latchShift = p * 24;

  return (
    <div
      aria-label={`${label}: ${tripped ? 'ausgelöst' : 'eingeschaltet'}`}
      style={{
        position: 'relative',
        width,
        height,
        borderRadius: 38 * scale,
        background: 'linear-gradient(145deg, #f6fbff, #cbd8e0)',
        border: `${4 * scale}px solid #8fa8b7`,
        boxShadow: `0 ${30 * scale}px ${70 * scale}px rgba(0,0,0,.44), 0 0 ${52 * p * scale}px ${tripColor}55`,
        overflow: 'hidden',
        ...style,
      }}
    >
      <div style={{position: 'absolute', top: 34 * scale, left: 34 * scale, color: '#173046', fontFamily: 'Arial, sans-serif', fontSize: 36 * scale, fontWeight: 950}}>{label}</div>
      <div style={{position: 'absolute', right: 30 * scale, top: 30 * scale, width: 66 * scale, height: 48 * scale, borderRadius: 14 * scale, background: '#86d8ff', color: '#103047', display: 'grid', placeItems: 'center', fontFamily: 'Arial, sans-serif', fontSize: 20 * scale, fontWeight: 950}}>TEST</div>

      <div style={{position: 'absolute', left: 46 * scale, right: 46 * scale, top: 108 * scale, height: 330 * scale, borderRadius: 28 * scale, background: '#102638', boxShadow: 'inset 0 10px 24px rgba(0,0,0,.5)'}}>
        <div style={{position: 'absolute', left: 54 * scale, top: 44 * scale, width: 72 * scale, height: 72 * scale, borderRadius: '50%', border: `${13 * scale}px solid #60798b`, boxShadow: `0 0 ${24 * p * scale}px ${explanationColor}`}} />
        <div style={{position: 'absolute', left: (144 + latchShift) * scale, top: 66 * scale, width: 86 * scale, height: 22 * scale, borderRadius: 12 * scale, background: explanationColor, transform: `rotate(${p * 14}deg)`, transformOrigin: 'left center'}} />

        {[0, 1].map((pole) => {
          const x = (80 + pole * 118) * scale;
          return (
            <React.Fragment key={pole}>
              <div style={{position: 'absolute', left: x, bottom: 52 * scale, width: 18 * scale, height: 118 * scale, borderRadius: 10 * scale, background: activeColor, boxShadow: `0 0 ${18 * scale}px ${activeColor}77`}} />
              <div style={{position: 'absolute', left: (80 + pole * 118 + contactGap) * scale, bottom: 164 * scale, width: 94 * scale, height: 18 * scale, borderRadius: 10 * scale, background: tripped ? tripColor : activeColor, transform: `rotate(${-p * 23}deg)`, transformOrigin: 'left center', boxShadow: `0 0 ${22 * scale}px ${tripped ? tripColor : activeColor}77`}} />
              <div style={{position: 'absolute', left: (160 + pole * 118) * scale, top: 68 * scale, width: 18 * scale, height: 102 * scale, borderRadius: 10 * scale, background: activeColor}} />
            </React.Fragment>
          );
        })}
      </div>

      <div style={{position: 'absolute', left: 122 * scale, top: 452 * scale, width: 116 * scale, height: 66 * scale, borderRadius: 24 * scale, background: '#1d3341', overflow: 'hidden'}}>
        <div style={{position: 'absolute', left: 42 * scale, top: 6 * scale, width: 34 * scale, height: 54 * scale, borderRadius: 13 * scale, background: '#f3f7f9', transformOrigin: '50% 85%', transform: `rotate(${leverAngle}deg)`, boxShadow: '0 6px 14px rgba(0,0,0,.4)'}} />
      </div>

      <div style={{position: 'absolute', left: 38 * scale, right: 38 * scale, bottom: 28 * scale, height: 54 * scale, borderRadius: 16 * scale, display: 'grid', placeItems: 'center', background: '#edf3f6', color: tripped ? tripColor : activeColor, fontFamily: 'Arial, sans-serif', fontSize: 25 * scale, fontWeight: 950}}>{tripped ? 'KONTAKTE OFFEN' : 'STROMKREIS EIN'}</div>
    </div>
  );
};
