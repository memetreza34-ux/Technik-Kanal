import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {AlertTriangle, Cable, Plug, ShieldCheck, Wrench, ZapOff} from 'lucide-react';
import {BreakerTripAnimation, RcdContactTripAnimation, ResidualCurrentBalanceAnimation} from './animation-library';
import {ElectricalProductionLayer} from './engine';
import type {ElectricalReelRuntime, ElectricalRuntimeScene} from './engine';
import runtimeJson from './generated/fi-schalter-runtime.json';

const runtime = runtimeJson as ElectricalReelRuntime;

export const FI_REEL_TOTAL_FRAMES = Math.max(1, runtime.totalFrames);
export const FI_REEL_FPS = runtime.fps || 30;
export const FI_REEL_WIDTH = runtime.width || 1080;
export const FI_REEL_HEIGHT = runtime.height || 1920;

const palette = {
  panel: 'rgba(6,27,49,.94)',
  panelLight: 'rgba(14,48,77,.94)',
  blue: '#2ac7ff',
  gold: '#ffc857',
  red: '#ff4d5e',
  white: '#f4fbff',
  muted: '#a7c0d1',
};

const clamp = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};
const sceneProgress = (frame: number, scene: ElectricalRuntimeScene) => interpolate(frame, [scene.fromFrame, scene.toFrame], [0, 1], clamp);

const Panel: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => (
  <div style={{borderRadius: 36, background: `linear-gradient(145deg, ${palette.panelLight}, ${palette.panel})`, border: '2px solid rgba(114,230,255,.22)', boxShadow: '0 28px 70px rgba(0,0,0,.42)', ...style}}>{children}</div>
);

const Badge: React.FC<{label: string; value: string; accent: string}> = ({label, value, accent}) => (
  <Panel style={{width: 390, height: 310, padding: 42, textAlign: 'center', display: 'grid', alignContent: 'center', borderColor: `${accent}88`}}>
    <div style={{fontFamily: 'Arial, sans-serif', fontSize: 26, fontWeight: 950, letterSpacing: 3, color: palette.muted}}>{label}</div>
    <div style={{marginTop: 20, fontFamily: 'Arial, sans-serif', fontSize: 72, fontWeight: 950, color: accent}}>{value}</div>
  </Panel>
);

const FiMechanism: React.FC<{scene: ElectricalRuntimeScene}> = ({scene}) => {
  const frame = useCurrentFrame();
  const p = sceneProgress(frame, scene);

  if (scene.id === '01-hook') {
    return (
      <>
        <div style={{position: 'absolute', top: 470, left: 72}}><ResidualCurrentBalanceAnimation progress={p} faultProgress={interpolate(p, [0.18, 0.7], [0, 1], clamp)} width={650} height={500} /></div>
        <div style={{position: 'absolute', top: 585, right: 72, transform: 'scale(.72)', transformOrigin: 'top right'}}><RcdContactTripAnimation progress={interpolate(p, [0.5, 0.86], [0, 1], clamp)} /></div>
      </>
    );
  }

  if (scene.id === '02-begriff') {
    return (
      <div style={{position: 'absolute', top: 470, left: 0, right: 0, display: 'grid', placeItems: 'center'}}>
        <RcdContactTripAnimation progress={0.08} width={390} height={640} />
        <div style={{position: 'absolute', top: 80, right: 140, width: 280, color: palette.gold, fontFamily: 'Arial, sans-serif', fontSize: 31, lineHeight: 1.2, fontWeight: 950}}>Summenstromwandler<br />Auslöser<br />Schaltkontakte</div>
      </div>
    );
  }

  if (scene.id === '03-normalzustand') {
    return <div style={{position: 'absolute', top: 520, left: 160}}><ResidualCurrentBalanceAnimation progress={p} faultProgress={0} width={760} height={560} /></div>;
  }

  if (scene.id === '04-fehlerweg') {
    const leak = interpolate(p, [0.2, 0.72], [0, 1], clamp);
    return (
      <div style={{position: 'absolute', top: 520, left: 105, right: 105}}>
        <Panel style={{height: 650, position: 'relative'}}>
          <div style={{position: 'absolute', left: 110, top: 110, width: 360, height: 340, borderRadius: 42, background: '#b6c4cc', border: '8px solid #78909f', display: 'grid', placeItems: 'center'}}><Plug size={150} color={palette.red} /></div>
          <div style={{position: 'absolute', left: 430, top: 255, width: 280 * leak, height: 22, borderRadius: 12, background: palette.red, transform: 'rotate(24deg)', transformOrigin: 'left center', boxShadow: `0 0 ${35 * leak}px ${palette.red}`}} />
          <div style={{position: 'absolute', right: 70, bottom: 76, color: palette.red, fontFamily: 'Arial, sans-serif', fontSize: 48, fontWeight: 950}}>⏚ ERDE</div>
          <div style={{position: 'absolute', left: 80, right: 80, bottom: 35, textAlign: 'center', color: palette.muted, fontFamily: 'Arial, sans-serif', fontSize: 26, fontWeight: 900}}>Kein Mensch berührt spannungsführende Teile.</div>
        </Panel>
      </div>
    );
  }

  if (scene.id === '05-differenzstrom') {
    return <div style={{position: 'absolute', top: 520, left: 160}}><ResidualCurrentBalanceAnimation progress={p} faultProgress={interpolate(p, [0.1, 0.75], [0.15, 1], clamp)} width={760} height={560} /></div>;
  }

  if (scene.id === '06-summenstromwandler') {
    return <div style={{position: 'absolute', top: 520, left: 160}}><ResidualCurrentBalanceAnimation progress={p} faultProgress={1} signalProgress={interpolate(p, [0.2, 0.8], [0, 1], clamp)} width={760} height={560} /></div>;
  }

  if (scene.id === '07-kontakte-oeffnen') {
    return <div style={{position: 'absolute', top: 470, left: 360}}><RcdContactTripAnimation progress={interpolate(p, [0.18, 0.72], [0, 1], clamp)} width={360} height={590} /></div>;
  }

  if (scene.id === '08-30ma') {
    return (
      <div style={{position: 'absolute', top: 570, left: 0, right: 0, display: 'grid', placeItems: 'center'}}>
        <div style={{width: 620, height: 620, borderRadius: '50%', border: `14px solid ${palette.gold}`, boxShadow: `0 0 ${interpolate(p, [0, 1], [18, 70], clamp)}px ${palette.gold}66`, display: 'grid', placeItems: 'center', background: 'rgba(6,27,49,.9)'}}>
          <ShieldCheck size={155} color={palette.blue} />
          <div style={{marginTop: -120, color: palette.gold, fontFamily: 'Arial, sans-serif', fontSize: 112, fontWeight: 950}}>30 mA</div>
          <div style={{marginTop: -92, color: palette.white, fontFamily: 'Arial, sans-serif', fontSize: 31, fontWeight: 900}}>Bemessungsdifferenzstrom</div>
        </div>
      </div>
    );
  }

  if (scene.id === '09-fi-vs-ls') {
    return (
      <div style={{position: 'absolute', top: 520, left: 68, right: 68, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <div style={{display: 'grid', justifyItems: 'center', gap: 20}}><RcdContactTripAnimation progress={0.08} width={260} height={426} /><Badge label="FI / RCD" value="FEHLERSTROM" accent={palette.blue} /></div>
        <div style={{fontFamily: 'Arial, sans-serif', fontSize: 62, color: palette.gold, fontWeight: 950}}>≠</div>
        <div style={{display: 'grid', justifyItems: 'center', gap: 20}}><BreakerTripAnimation progress={0.08} width={238} height={416} label="B16" /><Badge label="LEITUNGSSCHUTZ" value="ÜBERSTROM" accent={palette.red} /></div>
      </div>
    );
  }

  return (
    <div style={{position: 'absolute', top: 520, left: 88, right: 88}}>
      <Panel style={{height: 700, padding: 54}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 28, color: palette.red}}><AlertTriangle size={92} /><div style={{fontFamily: 'Arial, sans-serif', fontSize: 52, fontWeight: 950}}>NIEMALS ÜBERBRÜCKEN</div></div>
        <div style={{marginTop: 56, display: 'grid', gap: 30}}>
          {[
            {icon: <ZapOff size={56} />, text: 'Geräte ausschalten'},
            {icon: <Cable size={56} />, text: 'Stecker ziehen'},
            {icon: <Wrench size={56} />, text: 'Ursache prüfen lassen'},
          ].map((item) => <div key={item.text} style={{display: 'flex', alignItems: 'center', gap: 30, color: palette.white, fontFamily: 'Arial, sans-serif', fontSize: 40, fontWeight: 900}}><span style={{color: palette.blue}}>{item.icon}</span>{item.text}</div>)}
        </div>
        <div style={{marginTop: 54, textAlign: 'center', color: palette.gold, fontFamily: 'Arial, sans-serif', fontSize: 45, fontWeight: 950}}>Kommentiere: FI</div>
      </Panel>
    </div>
  );
};

export const FiSchalterReel: React.FC = () => (
  <AbsoluteFill>
    <ElectricalProductionLayer runtime={runtime} mechanismLayer={(scene) => <FiMechanism scene={scene} />} />
  </AbsoluteFill>
);
