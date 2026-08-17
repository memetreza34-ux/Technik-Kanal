import React from 'react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {AlertTriangle, Cable, Plug, ShieldCheck, Wrench, ZapOff} from 'lucide-react';
import {BreakerTripAnimation, ProtectiveConductorPathAnimation} from '../animation-library';
import type {ElectricalRuntimeScene} from '../engine';

const clamp = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};
const colors = {
  bg: '#03101f',
  panel: '#081d34',
  panel2: '#0d2b49',
  steel: '#aebec8',
  steelDark: '#526875',
  phase: '#ff7b55',
  neutral: '#2ac7ff',
  pe: '#d8f04a',
  peDark: '#2d6f45',
  fault: '#ff4d5e',
  gold: '#ffc857',
  mint: '#63e6be',
  text: '#f4fbff',
  muted: '#9fb8ca',
};

const sceneProgress = (frame: number, scene: ElectricalRuntimeScene) => interpolate(frame, [scene.fromFrame, scene.toFrame], [0, 1], clamp);

const Card: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => (
  <div style={{borderRadius: 34, background: 'linear-gradient(145deg, rgba(13,43,73,.96), rgba(4,20,38,.96))', border: '2px solid rgba(114,230,255,.18)', boxShadow: '0 28px 70px rgba(0,0,0,.42)', ...style}}>{children}</div>
);

const TechLabel: React.FC<{text: string; x: number; y: number; targetX?: number; targetY?: number; accent?: string; width?: number}> = ({text, x, y, targetX, targetY, accent = colors.mint, width = 270}) => (
  <>
    {targetX !== undefined && targetY !== undefined ? (
      <svg width="1080" height="1280" style={{position: 'absolute', inset: 0, overflow: 'visible', pointerEvents: 'none'}}>
        <path d={`M ${x + width / 2} ${y + 64} L ${targetX} ${targetY}`} fill="none" stroke={accent} strokeWidth="6" strokeLinecap="round" opacity="0.95" />
        <circle cx={targetX} cy={targetY} r="12" fill={colors.bg} stroke={accent} strokeWidth="6" />
      </svg>
    ) : null}
    <div style={{position: 'absolute', left: x, top: y, width, padding: '18px 20px', borderRadius: 18, background: 'rgba(3,16,31,.92)', border: `3px solid ${accent}`, borderLeftWidth: 9, color: colors.text, fontFamily: 'Arial, sans-serif', fontSize: 29, lineHeight: 1.08, fontWeight: 900, boxShadow: '0 12px 34px rgba(0,0,0,.38)'}}>{text}</div>
  </>
);

const MotorGraphic: React.FC<{progress: number; fault?: number; compact?: boolean}> = ({progress, fault = 0, compact = false}) => {
  const width = compact ? 470 : 610;
  const height = compact ? 430 : 540;
  const pulse = 0.55 + Math.sin(progress * Math.PI * 5) * 0.12;
  const fins = Array.from({length: 8}, (_, index) => index);
  return (
    <div style={{position: 'relative', width, height}}>
      <div style={{position: 'absolute', left: 38, top: 88, width: width - 110, height: height - 165, borderRadius: 72, background: 'linear-gradient(135deg,#9eafb9 0%,#556d7a 45%,#a8bac4 100%)', border: '7px solid #405765', boxShadow: `0 30px 70px rgba(0,0,0,.48), inset 0 0 45px rgba(255,255,255,.12), 0 0 ${fault * 55}px ${colors.fault}55`}}>
        {fins.map((index) => <div key={index} style={{position: 'absolute', left: 52 + index * ((width - 220) / 8), top: 26, width: 14, height: height - 225, borderRadius: 7, background: 'linear-gradient(180deg,#c0ccd2,#536874)', opacity: 0.78}} />)}
        <div style={{position: 'absolute', left: 92, top: 90, width: 170, height: 170, borderRadius: '50%', border: '22px solid #2e4757', background: 'radial-gradient(circle,#071522 0 36%,#385263 38% 100%)', boxShadow: 'inset 0 0 28px rgba(0,0,0,.62)'}} />
        {fault > 0.03 ? <div style={{position: 'absolute', left: 258, top: 68, width: 22, height: 178 * fault, borderRadius: 12, background: `linear-gradient(180deg,${colors.phase},${colors.fault})`, transform: 'rotate(18deg)', transformOrigin: 'top center', boxShadow: `0 0 ${36 * fault}px ${colors.fault}`}} /> : null}
        {fault > 0.03 ? <div style={{position: 'absolute', left: 286, top: 208, width: 70, height: 70, borderRadius: '50%', border: `9px solid ${colors.fault}`, opacity: pulse, boxShadow: `0 0 40px ${colors.fault}`}} /> : null}
      </div>
      <div style={{position: 'absolute', right: 30, top: 46, width: 170, height: 132, borderRadius: 24, background: '#8397a3', border: '6px solid #435b69', boxShadow: '0 12px 26px rgba(0,0,0,.38)'}} />
      <div style={{position: 'absolute', left: width - 178, top: height - 178, width: 46, height: 46, borderRadius: '50%', background: colors.pe, border: '7px solid #1c3444', boxShadow: `0 0 ${20 + progress * 20}px ${colors.pe}77`}} />
      <div style={{position: 'absolute', left: width - 156, top: height - 160, width: 210, height: 26, borderRadius: 13, background: `repeating-linear-gradient(90deg, ${colors.pe} 0 28px, ${colors.peDark} 28px 56px)`, transform: 'rotate(18deg)', transformOrigin: 'left center', boxShadow: '0 8px 20px rgba(0,0,0,.35)'}} />
      <div style={{position: 'absolute', left: 0, right: 0, bottom: 10, height: 34, borderRadius: 17, background: 'linear-gradient(90deg,#2a3e4b,#6f828d,#2a3e4b)', opacity: 0.85}} />
    </div>
  );
};

const RingLugGraphic: React.FC<{progress: number}> = ({progress}) => {
  const glow = 16 + progress * 24;
  return (
    <div style={{position: 'relative', width: 720, height: 540}}>
      <div style={{position: 'absolute', inset: '62px 48px 54px', borderRadius: 54, background: 'linear-gradient(145deg,#96a7b1,#566a75)', border: '6px solid #3a515e', boxShadow: 'inset 0 0 46px rgba(255,255,255,.12), 0 30px 70px rgba(0,0,0,.4)'}} />
      <div style={{position: 'absolute', left: 345, top: 205, width: 110, height: 110, borderRadius: '50%', border: '27px solid #c58a45', background: '#172836', boxShadow: `0 0 ${glow}px ${colors.pe}55`}} />
      <div style={{position: 'absolute', left: 382, top: 140, width: 36, height: 210, borderRadius: 18, background: 'linear-gradient(90deg,#8b9498,#e0e5e6,#727d82)', boxShadow: '0 9px 20px rgba(0,0,0,.42)'}} />
      <div style={{position: 'absolute', left: 405, top: 250, width: 290, height: 30, borderRadius: 15, background: `repeating-linear-gradient(90deg, ${colors.pe} 0 32px, ${colors.peDark} 32px 64px)`, transform: 'rotate(10deg)', transformOrigin: 'left center'}} />
      <div style={{position: 'absolute', left: 306, top: 174, width: 190, height: 170, borderRadius: '50%', border: '4px dashed rgba(216,240,74,.7)', transform: `scale(${0.96 + progress * 0.06})`}} />
      <TechLabel text="Ringkabelschuh" x={35} y={65} targetX={382} targetY={245} accent={colors.pe} width={260} />
      <TechLabel text="Erdungsschraube" x={430} y={38} targetX={402} targetY={185} accent={colors.mint} width={270} />
      <TechLabel text="Direkter Metallkontakt" x={60} y={390} targetX={365} targetY={296} accent={colors.neutral} width={325} />
    </div>
  );
};

const FaultCutaway: React.FC<{progress: number}> = ({progress}) => {
  const fault = interpolate(progress, [0.16, 0.62], [0, 1], clamp);
  return (
    <div style={{position: 'relative', width: 790, height: 650}}>
      <MotorGraphic progress={progress} fault={fault} />
      <TechLabel text="Beschädigte Isolation" x={10} y={145} targetX={410} targetY={350} accent={colors.fault} width={290} />
      <TechLabel text="Kontakt zum Metallgehäuse" x={460} y={92} targetX={490} targetY={382} accent={colors.gold} width={310} />
      <TechLabel text="Schutzleiter (PE)" x={470} y={500} targetX={590} targetY={445} accent={colors.pe} width={270} />
    </div>
  );
};

const TripVisual: React.FC<{progress: number}> = ({progress}) => {
  const trip = interpolate(progress, [0.35, 0.72], [0, 1], clamp);
  const faultWidth = interpolate(progress, [0.05, 0.46], [40, 420], clamp);
  return (
    <div style={{position: 'relative', width: 850, height: 720}}>
      <Card style={{position: 'absolute', left: 30, top: 95, width: 440, height: 420, display: 'grid', placeItems: 'center'}}>
        <div style={{position: 'absolute', top: 35, color: colors.muted, fontFamily: 'Arial, sans-serif', fontSize: 28, fontWeight: 900}}>FEHLERSTROM</div>
        <div style={{width: faultWidth, maxWidth: 340, height: 30, borderRadius: 15, background: colors.fault, boxShadow: `0 0 36px ${colors.fault}`}} />
        <div style={{position: 'absolute', bottom: 42, color: colors.fault, fontFamily: 'Arial, sans-serif', fontSize: 34, fontWeight: 900}}>Fehler erkannt</div>
      </Card>
      <div style={{position: 'absolute', right: 15, top: 40, transform: 'scale(.82)', transformOrigin: 'top right'}}><BreakerTripAnimation progress={trip} label="B16" /></div>
      <TechLabel text="Schutzeinrichtung" x={520} y={500} targetX={685} targetY={315} accent={colors.mint} width={290} />
      {trip > 0.55 ? <div style={{position: 'absolute', left: 255, right: 255, bottom: 32, padding: '20px 28px', borderRadius: 20, background: 'rgba(255,77,94,.13)', border: `3px solid ${colors.fault}`, color: colors.text, textAlign: 'center', fontFamily: 'Arial, sans-serif', fontSize: 38, fontWeight: 900}}>Stromkreis getrennt</div> : null}
    </div>
  );
};

const CompareVisual: React.FC<{progress: number}> = ({progress}) => {
  const dots = [0.06, 0.28, 0.5, 0.72];
  return (
    <div style={{position: 'relative', width: 850, height: 700, display: 'flex', gap: 36}}>
      <Card style={{position: 'relative', flex: 1, padding: '38px 34px', borderColor: `${colors.neutral}88`}}>
        <div style={{color: colors.neutral, fontFamily: 'Arial, sans-serif', fontSize: 46, fontWeight: 900}}>Neutralleiter (N)</div>
        <div style={{position: 'absolute', left: 72, right: 72, top: 205, height: 32, borderRadius: 16, background: '#123f5c', boxShadow: `0 0 20px ${colors.neutral}55`}} />
        {dots.map((base, index) => { const x = 75 + (((base + progress * 0.55) % 1) * 245); return <div key={index} style={{position: 'absolute', left: x, top: 204, width: 34, height: 34, borderRadius: '50%', background: colors.neutral, boxShadow: `0 0 24px ${colors.neutral}`}} />; })}
        <div style={{position: 'absolute', left: 42, right: 42, bottom: 85, color: colors.text, fontFamily: 'Arial, sans-serif', fontSize: 34, lineHeight: 1.2, fontWeight: 900, textAlign: 'center'}}>führt im Betrieb Strom zurück</div>
      </Card>
      <Card style={{position: 'relative', flex: 1, padding: '38px 34px', borderColor: `${colors.pe}88`}}>
        <div style={{color: colors.pe, fontFamily: 'Arial, sans-serif', fontSize: 46, fontWeight: 900}}>Schutzleiter (PE)</div>
        <div style={{position: 'absolute', left: 72, right: 72, top: 205, height: 36, borderRadius: 18, background: `repeating-linear-gradient(90deg, ${colors.pe} 0 34px, ${colors.peDark} 34px 68px)`}} />
        <ShieldCheck size={120} color={colors.pe} style={{position: 'absolute', left: 145, top: 305}} />
        <div style={{position: 'absolute', left: 42, right: 42, bottom: 85, color: colors.text, fontFamily: 'Arial, sans-serif', fontSize: 34, lineHeight: 1.2, fontWeight: 900, textAlign: 'center'}}>dient dem Schutz im Fehlerfall</div>
      </Card>
    </div>
  );
};

const PeMarkingVisual: React.FC<{progress: number}> = ({progress}) => (
  <div style={{position: 'relative', width: 840, height: 700}}>
    <Card style={{position: 'absolute', inset: '40px 60px', display: 'grid', placeItems: 'center'}}>
      <div style={{position: 'relative', width: 600, height: 220, transform: `scale(${0.96 + progress * 0.04})`}}>
        <div style={{position: 'absolute', left: 0, right: 0, top: 84, height: 62, borderRadius: 31, background: `repeating-linear-gradient(90deg, ${colors.pe} 0 52px, ${colors.peDark} 52px 104px)`, boxShadow: `0 0 ${26 + progress * 26}px ${colors.pe}55`}} />
        <div style={{position: 'absolute', right: -12, top: 51, width: 128, height: 128, borderRadius: 26, background: '#75914a', border: '6px solid #40572d', display: 'grid', placeItems: 'center'}}><div style={{width: 55, height: 55, borderRadius: '50%', background: '#c78945'}} /></div>
      </div>
      <div style={{position: 'absolute', bottom: 80, color: colors.pe, fontFamily: 'Arial, sans-serif', fontSize: 54, fontWeight: 900}}>Grün-Gelb = Schutzleiter (PE)</div>
    </Card>
    <TechLabel text="PE-Klemme" x={560} y={220} targetX={664} targetY={338} accent={colors.mint} width={230} />
  </div>
);

const SafetyVisual: React.FC<{progress: number}> = ({progress}) => {
  const move = interpolate(progress, [0.12, 0.55], [0, 85], clamp);
  return (
    <div style={{position: 'relative', width: 850, height: 710}}>
      <Card style={{position: 'absolute', inset: '55px 55px 65px', padding: 50}}>
        <div style={{display: 'flex', alignItems: 'center', gap: 26, color: colors.gold}}><AlertTriangle size={78} /><div style={{fontFamily: 'Arial, sans-serif', fontSize: 44, fontWeight: 900}}>Beschädigtes Gerät nicht weiter benutzen</div></div>
        <div style={{position: 'absolute', left: 90, top: 220, transform: `translateX(${-move}px)`}}><Plug size={125} color={colors.neutral} /></div>
        <div style={{position: 'absolute', left: 240, top: 265, width: 260, height: 28, borderRadius: 14, background: '#202b32'}} />
        <div style={{position: 'absolute', left: 420, top: 246, width: 60, height: 65, transform: 'rotate(-18deg)', borderRadius: 8, border: `7px solid ${colors.fault}`}} />
        <div style={{position: 'absolute', right: 84, top: 220}}><Wrench size={120} color={colors.mint} /></div>
        <TechLabel text="Stecker getrennt" x={65} y={430} targetX={155 - move} targetY={335} accent={colors.mint} width={245} />
        <TechLabel text="Beschädigtes Kabel" x={475} y={430} targetX={457} targetY={320} accent={colors.gold} width={270} />
        <div style={{position: 'absolute', left: 95, right: 95, bottom: 58, display: 'flex', justifyContent: 'center', gap: 22, alignItems: 'center', color: colors.text, fontFamily: 'Arial, sans-serif', fontSize: 36, fontWeight: 900}}><ZapOff size={55} color={colors.mint} /> Ausstecken und fachgerecht prüfen lassen</div>
      </Card>
    </div>
  );
};

export const SchutzleiterVisual: React.FC<{scene: ElectricalRuntimeScene}> = ({scene}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = sceneProgress(frame, scene);
  const enter = spring({frame: Math.max(0, frame - scene.fromFrame), fps, config: {damping: 18, stiffness: 120}});
  const opacity = interpolate(enter, [0, 1], [0, 1]);
  const translateY = interpolate(enter, [0, 1], [22, 0]);
  let content: React.ReactNode = null;

  if (scene.id === '01-hook') content = <div style={{position: 'relative', width: 830, height: 670}}><MotorGraphic progress={p} /><TechLabel text="Schutzleiter (PE)" x={70} y={415} targetX={610} targetY={474} accent={colors.pe} width={270} /><TechLabel text="Metallgehäuse" x={520} y={160} targetX={565} targetY={285} accent={colors.mint} width={250} /></div>;
  else if (scene.id === '02-verbindung') content = <RingLugGraphic progress={p} />;
  else if (scene.id === '03-normalbetrieb') content = <ProtectiveConductorPathAnimation progress={p} faultProgress={0} width={820} height={640} />;
  else if (scene.id === '04-isolationsfehler') content = <FaultCutaway progress={p} />;
  else if (scene.id === '05-fehlerstromweg') content = <ProtectiveConductorPathAnimation progress={p} faultProgress={interpolate(p, [0.1, 0.68], [0, 1], clamp)} width={820} height={640} />;
  else if (scene.id === '06-abschaltung') content = <TripVisual progress={p} />;
  else if (scene.id === '07-pe-vs-n') content = <CompareVisual progress={p} />;
  else if (scene.id === '08-gruen-gelb') content = <PeMarkingVisual progress={p} />;
  else content = <SafetyVisual progress={p} />;

  return <div style={{position: 'absolute', top: 400, left: 0, right: 0, bottom: 310, display: 'grid', placeItems: 'center', opacity, transform: `translateY(${translateY}px)`}}>{content}</div>;
};
