import React from 'react';

export type ResidualCurrentBalanceAnimationProps = {
  progress: number;
  faultProgress?: number;
  signalProgress?: number;
  width?: number;
  height?: number;
  normalColor?: string;
  returnColor?: string;
  faultColor?: string;
  explanationColor?: string;
  showLabels?: boolean;
  style?: React.CSSProperties;
};

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));

export const ResidualCurrentBalanceAnimation: React.FC<ResidualCurrentBalanceAnimationProps> = ({
  progress,
  faultProgress = 0,
  signalProgress = 0,
  width = 760,
  height = 560,
  normalColor = '#2ac7ff',
  returnColor = '#72e6ff',
  faultColor = '#ff4d5e',
  explanationColor = '#ffc857',
  showLabels = true,
  style,
}) => {
  const motion = clamp01(progress);
  const fault = clamp01(faultProgress);
  const signal = clamp01(signalProgress);
  const scale = width / 760;
  const returningStrength = 1 - fault * 0.46;
  const fieldOpacity = 0.12 + fault * 0.7;
  const dotPositions = [0.08, 0.26, 0.44, 0.62, 0.8];

  return (
    <div style={{position: 'relative', width, height, ...style}} aria-label="Summenstromwandler mit Hin-, Rück- und Fehlerstrom">
      <div
        style={{
          position: 'absolute',
          left: 205 * scale,
          top: 62 * scale,
          width: 350 * scale,
          height: 350 * scale,
          borderRadius: '50%',
          border: `${58 * scale}px solid #526b7d`,
          boxShadow: `inset 0 0 ${34 * scale}px rgba(255,255,255,.18), 0 0 ${55 * scale}px rgba(42,199,255,.18), 0 0 ${90 * signal * scale}px ${explanationColor}88`,
          background: 'radial-gradient(circle, rgba(3,16,31,.05) 0 42%, rgba(6,28,50,.72) 43% 100%)',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: -30 * scale,
            borderRadius: '50%',
            border: `${8 * scale}px solid ${fault > 0.03 ? explanationColor : normalColor}`,
            opacity: fieldOpacity,
            transform: `scale(${0.88 + signal * 0.12})`,
          }}
        />
      </div>

      <div style={{position: 'absolute', left: 46 * scale, right: 46 * scale, top: 178 * scale, height: 24 * scale, borderRadius: 20 * scale, background: '#18344b', boxShadow: `0 0 ${20 * scale}px ${normalColor}55`}} />
      <div style={{position: 'absolute', left: 46 * scale, right: 46 * scale, top: 302 * scale, height: 24 * scale, borderRadius: 20 * scale, background: '#18344b', boxShadow: `0 0 ${20 * scale}px ${returnColor}44`}} />

      {dotPositions.map((base, index) => {
        const x = 46 + (((base + motion * 0.36) % 1) * 668);
        const returnX = 714 - (((base + motion * 0.36) % 1) * 668);
        return (
          <React.Fragment key={index}>
            <div style={{position: 'absolute', left: (x - 12) * scale, top: 174 * scale, width: 32 * scale, height: 32 * scale, borderRadius: '50%', background: normalColor, boxShadow: `0 0 ${26 * scale}px ${normalColor}`}} />
            <div style={{position: 'absolute', left: (returnX - 12) * scale, top: 298 * scale, width: 32 * scale * returningStrength, height: 32 * scale * returningStrength, borderRadius: '50%', background: returnColor, opacity: 0.45 + returningStrength * 0.55, boxShadow: `0 0 ${24 * scale}px ${returnColor}`}} />
          </React.Fragment>
        );
      })}

      <div style={{position: 'absolute', left: 576 * scale, top: 190 * scale, width: 22 * scale, height: 224 * scale * fault, transform: 'rotate(-22deg)', transformOrigin: 'top center', borderRadius: 18 * scale, background: `linear-gradient(180deg, ${faultColor}, ${faultColor}44)`, boxShadow: `0 0 ${36 * fault * scale}px ${faultColor}`}} />
      {fault > 0.04 ? <div style={{position: 'absolute', left: 602 * scale, top: 404 * scale, color: faultColor, fontFamily: 'Arial, sans-serif', fontWeight: 950, fontSize: 30 * scale}}>FEHLERSTROM</div> : null}

      <div style={{position: 'absolute', left: 535 * scale, top: 88 * scale, width: 108 * scale, height: 82 * scale, borderRadius: 18 * scale, border: `${5 * scale}px solid ${explanationColor}`, opacity: 0.25 + signal * 0.75, boxShadow: `0 0 ${38 * signal * scale}px ${explanationColor}`, display: 'grid', placeItems: 'center', color: explanationColor, fontFamily: 'Arial, sans-serif', fontSize: 25 * scale, fontWeight: 950}}>SIGNAL</div>

      {showLabels ? (
        <>
          <div style={{position: 'absolute', left: 48 * scale, top: 122 * scale, color: normalColor, fontFamily: 'Arial, sans-serif', fontSize: 27 * scale, fontWeight: 950}}>HIN</div>
          <div style={{position: 'absolute', right: 48 * scale, top: 342 * scale, color: returnColor, fontFamily: 'Arial, sans-serif', fontSize: 27 * scale, fontWeight: 950}}>ZURÜCK</div>
          <div style={{position: 'absolute', left: 0, right: 0, bottom: 16 * scale, textAlign: 'center', color: fault > 0.03 ? faultColor : normalColor, fontFamily: 'Arial, sans-serif', fontSize: 34 * scale, fontWeight: 950}}>{fault > 0.03 ? 'DIFFERENZ ERKANNT' : 'SUMME = 0'}</div>
        </>
      ) : null}
    </div>
  );
};
