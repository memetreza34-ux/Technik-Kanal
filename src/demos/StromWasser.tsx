import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {FONT} from '../short/brand';
import {CaptionSlot, CardSlot, Heading, Label, Mark} from '../frame/Frame';

// Demo 1 – Intuition: Volt & Ampere wie Wasser im Rohr. Flache 2D-Animation, hell.
// Wasserkreislauf (Pumpe → Rohr → Wasserrad) verwandelt sich in den Stromkreis (Batterie → Kabel → Lampe).

const INK = '#1F2328';
const PAPER = '#F5F0E8';
const WATER = '#3D9BFF';
const COPPER = '#C97B3D';
const YELLOW = '#FFD23F';
const cl = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

const L = 280, R = 880, T = 400, B = 900, C = 60, MID = 650;
const LOOP = `M ${L} ${MID} L ${L} ${T + C} Q ${L} ${T} ${L + C} ${T} L ${R - C} ${T} Q ${R} ${T} ${R} ${T + C} L ${R} ${B - C} Q ${R} ${B} ${R - C} ${B} L ${L + C} ${B} Q ${L} ${B} ${L} ${B - C} Z`;
const LOOP_LEN = 2 * (B - T - 2 * C) + 2 * (R - L - 2 * C) + 4 * 94;

const speedAt = (f: number) => interpolate(f, [50, 64, 112, 128], [0, 1, 1, 2.3], cl) * interpolate(f, [150, 165], [1, 1.35], cl);
/** zurückgelegter Weg (Integral der Geschwindigkeit) – damit Rad und Fluss ruckelfrei beschleunigen */
const travel = (f: number) => {
  let s = 0;
  for (let i = 0; i < f; i++) s += speedAt(i);
  return s;
};

const Tag: React.FC<{x: number; y: number; show: number; children: React.ReactNode; align?: 'left' | 'right' | 'center'}> = ({x, y, show, children, align = 'center'}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: f - show, fps, config: {damping: 14, mass: 0.5}});
  if (f < show) return null;
  const tx = align === 'center' ? '-50%' : align === 'right' ? '-100%' : '0';
  return (
    <div style={{position: 'absolute', left: x, top: y, transform: `translate(${tx}, -50%) scale(${0.6 + 0.4 * s})`, opacity: s, background: '#fff', border: `4px solid ${INK}`, borderRadius: 18, padding: '8px 18px', fontFamily: FONT.ui, fontWeight: 800, fontSize: 38, color: INK, whiteSpace: 'nowrap', boxShadow: `6px 6px 0 ${INK}`}}>
      {children}
    </div>
  );
};

export const StromWasser: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const draw = interpolate(f, [8, 42], [0, 1], cl);
  const pop = (at: number) => spring({frame: f - at, fps, config: {damping: 12, mass: 0.6}});
  const morph = interpolate(f, [192, 216], [0, 1], cl);
  const pressure = interpolate(f, [112, 128], [0.35, 0.9], cl);
  const width = interpolate(f, [150, 165], [44, 74], cl);
  const flow = travel(f);
  const wheelAngle = flow * 4.2;
  const pumpAngle = flow * 6;
  const glow = morph * Math.min(1, speedAt(f) / 2.3);

  return (
    <AbsoluteFill style={{background: PAPER}}>
      {morph < 0.5 ? <Heading theme="light" text="Volt? [Ampere?]" /> : <Heading theme="light" text="Strom = [Wasser]" from={192} />}
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
        <defs>
          <radialGradient id="glow">
            <stop offset="0%" stopColor="#FFF4B0" stopOpacity={1} />
            <stop offset="45%" stopColor={YELLOW} stopOpacity={0.75} />
            <stop offset="100%" stopColor={YELLOW} stopOpacity={0} />
          </radialGradient>
        </defs>

        {/* Rohr / Kabel: Kontur, Füllung, fließende Teilchen */}
        <path d={LOOP} fill="none" stroke={INK} strokeWidth={width + 16} strokeLinejoin="round" strokeDasharray={LOOP_LEN} strokeDashoffset={(1 - draw) * LOOP_LEN} />
        <path d={LOOP} fill="none" stroke={WATER} strokeOpacity={1 - morph} strokeWidth={width} strokeLinejoin="round" strokeDasharray={LOOP_LEN} strokeDashoffset={(1 - draw) * LOOP_LEN} />
        <path d={LOOP} fill="none" stroke={COPPER} strokeOpacity={morph} strokeWidth={width * 0.55} strokeLinejoin="round" />
        {f > 50 ? (
          <>
            <path d={LOOP} fill="none" stroke="#BFE3FF" strokeOpacity={1 - morph} strokeWidth={width * 0.32} strokeLinecap="round" strokeDasharray="34 46" strokeDashoffset={-flow * 6} />
            <path d={LOOP} fill="none" stroke={YELLOW} strokeOpacity={morph} strokeWidth={22} strokeLinecap="round" strokeDasharray="1 44" strokeDashoffset={-flow * 6} />
          </>
        ) : null}

        {/* Pumpe → Batterie */}
        <g transform={`translate(${L} ${MID}) scale(${pop(30)})`}>
          <g opacity={1 - morph}>
            <circle r={104} fill="#fff" stroke={INK} strokeWidth={10} />
            <g transform={`rotate(${pumpAngle})`}>
              {[0, 90, 180, 270].map((a) => (
                <path key={a} d="M 0 0 Q 40 -20 70 -10" transform={`rotate(${a})`} fill="none" stroke={WATER} strokeWidth={16} strokeLinecap="round" />
              ))}
            </g>
            <circle r={16} fill={INK} />
            {/* Druckanzeige */}
            <g transform="translate(-170 0)">
              <path d="M -52 0 A 52 52 0 0 1 52 0" fill="#fff" stroke={INK} strokeWidth={8} />
              <path d="M 10 -50 A 52 52 0 0 1 52 0" fill="none" stroke="#FF5C5C" strokeWidth={8} />
              <line x1={0} y1={0} x2={0} y2={-42} stroke={INK} strokeWidth={7} strokeLinecap="round" transform={`rotate(${-75 + pressure * 150})`} />
              <circle r={8} fill={INK} />
            </g>
          </g>
          <g opacity={morph} transform={`scale(${0.7 + 0.3 * morph})`}>
            <rect x={-70} y={-120} width={140} height={240} rx={22} fill={INK} />
            <rect x={-58} y={-108} width={116} height={100} rx={12} fill="#FF6B5B" />
            <rect x={-58} y={-4} width={116} height={112} rx={12} fill="#2b3036" />
            <rect x={-26} y={-138} width={52} height={22} rx={6} fill={INK} />
            <text x={0} y={-36} textAnchor="middle" fontFamily={FONT.ui} fontWeight={900} fontSize={70} fill="#fff">+</text>
            <text x={0} y={78} textAnchor="middle" fontFamily={FONT.ui} fontWeight={900} fontSize={70} fill="#fff">−</text>
          </g>
        </g>

        {/* Wasserrad → Lampe */}
        <g transform={`translate(${R} ${MID}) scale(${pop(36)})`}>
          <g opacity={1 - morph}>
            <circle r={104} fill="#fff" stroke={INK} strokeWidth={10} />
            <g transform={`rotate(${wheelAngle})`}>
              {Array.from({length: 8}).map((_, i) => (
                <rect key={i} x={-9} y={-92} width={18} height={62} rx={6} fill={WATER} transform={`rotate(${i * 45})`} />
              ))}
            </g>
            <circle r={22} fill={INK} />
          </g>
          <g opacity={morph}>
            <circle r={260} fill="url(#glow)" opacity={glow} />
            <circle cy={-20} r={84} fill={glow > 0.05 ? '#FFF1A6' : '#fff'} stroke={INK} strokeWidth={10} />
            <path d="M -26 0 L -12 -40 L 0 -12 L 12 -40 L 26 0" fill="none" stroke={glow > 0.05 ? '#E89B00' : INK} strokeWidth={8} strokeLinejoin="round" />
            <rect x={-44} y={58} width={88} height={64} rx={10} fill="#9aa1a8" stroke={INK} strokeWidth={8} />
          </g>
        </g>
      </svg>

      {/* Beschriftungen */}
      {morph < 0.5 ? (
        <>
          <Tag x={L} y={MID + 160} show={58}>Pumpe</Tag>
          <Tag x={R} y={MID + 160} show={64}>Wasserrad</Tag>
        </>
      ) : (
        <>
          <Tag x={L} y={MID + 170} show={210}>Batterie</Tag>
          <Tag x={580} y={T} show={218}>Kabel</Tag>
          <Tag x={R} y={MID + 170} show={226}>Lampe</Tag>
        </>
      )}

      <CaptionSlot theme="light" show={14} hide={56}>Stell dir Wasser vor.</CaptionSlot>
      <CaptionSlot theme="light" show={58} hide={110}>Pumpe drückt, Rad dreht.</CaptionSlot>
      <CaptionSlot theme="light" show={112} hide={150}>
        Mehr Druck = <Mark theme="light">Spannung</Mark>
      </CaptionSlot>
      <CaptionSlot theme="light" show={150} hide={192}>
        Mehr Wasser = <Mark theme="light">Strom</Mark>
      </CaptionSlot>
      <CaptionSlot theme="light" show={196} hide={252}>Beim Strom genau so.</CaptionSlot>
      <CaptionSlot theme="light" show={254} hide={330}>
        <Mark theme="light">Spannung</Mark> drückt, <Mark theme="light">Strom</Mark> fließt.
      </CaptionSlot>
      <CardSlot theme="light" show={150} hide={192}>
        <Label theme="light">Wasser → Strom</Label>
        <div style={{fontSize: 46, fontWeight: 800}}>Druck = Volt · Menge = Ampere</div>
      </CardSlot>
    </AbsoluteFill>
  );
};
