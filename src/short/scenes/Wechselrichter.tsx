import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import type {Beats} from '../../world/kit';

// Wechselrichter: Solardach (Gleichstrom) → H-Brücke → Rechteck → PWM → Spule/Kondensator → Sinus für die Steckdose.
// Weißer Hintergrund, nur Bild – der einzige Text ist der Untertitel (docs/RAHMEN.md).

const INK = '#1F2328';
const MUTED = '#9aa1ab';
const SOFT = '#eef0f3';
const BLUE = '#1E7FD8';
const ORANGE = '#E2650F';
const GOLD = '#F2B000';
const PANEL = "#1f4f8f";
const cl = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};
const ease = Easing.bezier(0.33, 0, 0.2, 1);
const ramp = (f: number, start: number, dur = 12) => interpolate(f, [start, start + dur], [0, 1], {...cl, easing: ease});
const win = (f: number, a: number, b: number, fade = 10) => Math.min(ramp(f, a, fade), 1 - ramp(f, b - fade, fade));

type P = [number, number];
const polyLen = (pts: P[]) => pts.slice(1).reduce((n, p, i) => n + Math.hypot(p[0] - pts[i][0], p[1] - pts[i][1]), 0);
const along = (pts: P[], s: number): P => {
  const L = polyLen(pts);
  let d = ((s % L) + L) % L;
  for (let i = 1; i < pts.length; i++) {
    const [ax, ay] = pts[i - 1], [bx, by] = pts[i];
    const seg = Math.hypot(bx - ax, by - ay);
    if (d <= seg) return [ax + ((bx - ax) * d) / seg, ay + ((by - ay) * d) / seg];
    d -= seg;
  }
  return pts[pts.length - 1];
};
const toD = (pts: P[]) => 'M' + pts.map((p) => p.join(' ')).join('L');

/* ---------- Bildbeispiele ---------- */

const Sun: React.FC<{x: number; y: number; f: number; o: number}> = ({x, y, f, o}) => (
  <g opacity={o} transform={`translate(${x} ${y}) rotate(${f * 0.6})`}>
    {Array.from({length: 10}, (_, i) => (
      <line key={i} x1={0} y1={-58} x2={0} y2={-80} stroke={GOLD} strokeWidth={8} strokeLinecap="round" transform={`rotate(${i * 36})`} />
    ))}
    <circle r={44} fill={GOLD} />
  </g>
);

const SolarHouse: React.FC<{x: number; y: number; s?: number; glow: number}> = ({x, y, s = 1, glow}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <rect x={-105} y={0} width={210} height={150} rx={8} fill="#f7f5f2" stroke={INK} strokeWidth={5} />
    <rect x={-25} y={70} width={50} height={80} rx={6} fill={SOFT} stroke={INK} strokeWidth={4} />
    <rect x={-80} y={35} width={40} height={40} rx={4} fill="#dbe9f6" stroke={INK} strokeWidth={4} />
    <polygon points="-130,0 0,-115 130,0" fill="#c9cdd3" stroke={INK} strokeWidth={5} strokeLinejoin="round" />
    {/* Modul auf der rechten Dachseite */}
    <g transform="translate(14 -92) rotate(41.5)">
      <rect x={0} y={0} width={135} height={60} rx={4} fill={PANEL} stroke={INK} strokeWidth={4} />
      {[1, 2, 3].map((i) => <line key={i} x1={i * 33.75} y1={2} x2={i * 33.75} y2={58} stroke="#8fb3d9" strokeWidth={2} />)}
      <line x1={2} y1={30} x2={133} y2={30} stroke="#8fb3d9" strokeWidth={2} />
      <rect x={0} y={0} width={135} height={60} rx={4} fill="#ffffff" opacity={0.2 * glow} />
    </g>
  </g>
);

const Socket: React.FC<{x: number; y: number; s?: number; glow?: number}> = ({x, y, s = 1, glow = 0}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {glow > 0 ? <circle r={120} fill={GOLD} opacity={0.18 * glow} /> : null}
    <rect x={-90} y={-90} width={180} height={180} rx={34} fill="#fff" stroke={INK} strokeWidth={5} />
    <circle r={58} fill={SOFT} stroke={INK} strokeWidth={4} />
    <circle cx={-22} r={9} fill={INK} />
    <circle cx={22} r={9} fill={INK} />
    <rect x={-8} y={-58} width={16} height={12} rx={3} fill={MUTED} />
    <rect x={-8} y={46} width={16} height={12} rx={3} fill={MUTED} />
  </g>
);

const Inverter: React.FC<{x: number; y: number; s: number; o: number; f: number}> = ({x, y, s, o, f}) => (
  <g opacity={o} transform={`translate(${x} ${y}) scale(${s})`}>
    {Array.from({length: 7}, (_, i) => (
      <rect key={i} x={-150} y={-150 + i * 46} width={300} height={22} rx={6} fill="#c3c8cf" />
    ))}
    <rect x={-130} y={-180} width={260} height={360} rx={26} fill="#e9ecef" stroke={INK} strokeWidth={5} />
    <rect x={-80} y={-130} width={160} height={70} rx={10} fill="#1d2a36" />
    <path d="M-60 -95 Q-40 -125 -20 -95 T20 -95 T60 -95" stroke="#6fe3a6" strokeWidth={5} fill="none" />
    <circle cx={0} cy={-20} r={10} fill={f % 30 < 18 ? '#2ec27e' : '#bfe8d2'} />
    {[-60, -20, 20, 60].map((cx) => <rect key={cx} x={cx - 10} y={180} width={20} height={40} rx={5} fill={INK} />)}
  </g>
);

const MiniPanel: React.FC<{x: number; y: number; glow: number}> = ({x, y, glow}) => (
  <g transform={`translate(${x} ${y})`}>
    <rect x={-62} y={-44} width={124} height={88} rx={6} fill={PANEL} stroke={INK} strokeWidth={4} />
    {[-31, 0, 31].map((cx) => <line key={cx} x1={cx} y1={-42} x2={cx} y2={42} stroke="#8fb3d9" strokeWidth={2} />)}
    <line x1={-60} y1={0} x2={60} y2={0} stroke="#8fb3d9" strokeWidth={2} />
    <rect x={-62} y={-44} width={124} height={88} rx={6} fill="#ffffff" opacity={0.18 * glow} />
  </g>
);

/* ---------- Kleine Kurvenanzeige ---------- */

const MiniPlot: React.FC<{x: number; y: number; w: number; kind: 'dc' | 'ac'; p: number; color: string; f: number}> = ({x, y, w, kind, p, color, f}) => {
  const n = 60;
  const pts: P[] = Array.from({length: n + 1}, (_, i) => {
    const t = i / n;
    const v = kind === 'dc' ? 0.7 : Math.sin(t * Math.PI * 4 - f * 0.02);
    return [x + t * w, y - v * 34];
  });
  const len = polyLen(pts);
  return (
    <g>
      <line x1={x} y1={y} x2={x + w} y2={y} stroke={MUTED} strokeWidth={2} strokeDasharray="6 8" />
      <path d={toD(pts)} stroke={color} strokeWidth={7} fill="none" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={len} strokeDashoffset={len * (1 - p)} />
    </g>
  );
};

/* ---------- H-Brücke ---------- */

const PLUS = 470, MINUS = 830, MID = 650;
const XS = 180, XL = 420, XR = 740;
const PATH_A: P[] = [[XS, 560], [XS, PLUS], [XL, PLUS], [XL, MID], [XR, MID], [XR, MINUS], [XS, MINUS], [XS, 740]];
const PATH_B: P[] = [[XS, 560], [XS, PLUS], [XR, PLUS], [XR, MID], [XL, MID], [XL, MINUS], [XS, MINUS], [XS, 740]];

const Switch: React.FC<{x: number; y: number; on: boolean; pop: number}> = ({x, y, on, pop}) => (
  <g transform={`translate(${x} ${y}) scale(${pop})`} opacity={pop}>
    <rect x={-38} y={-52} width={76} height={104} rx={16} fill={on ? '#fff4cc' : '#fff'} stroke={on ? GOLD : INK} strokeWidth={5} />
    <circle cx={0} cy={-30} r={7} fill={INK} />
    <circle cx={0} cy={30} r={7} fill={INK} />
    <line x1={0} y1={30} x2={on ? 0 : -24} y2={on ? -30 : -22} stroke={on ? GOLD : INK} strokeWidth={8} strokeLinecap="round" />
  </g>
);

const Coil: React.FC<{x0: number; x1: number; y: number; o: number}> = ({x0, x1, y, o}) => {
  const loops = 4, w = (x1 - x0) / loops;
  let d = `M${x0} ${y}`;
  for (let i = 0; i < loops; i++) d += ` a${w / 2} ${w * 1.1} 0 1 1 ${w} 0`;
  return (
    <g opacity={o} transform={`translate(${(x0 + x1) / 2} ${y}) scale(${0.6 + 0.4 * o}) translate(${-(x0 + x1) / 2} ${-y})`}>
      <rect x={x0 - 8} y={y - w * 2.2 - 10} width={x1 - x0 + 16} height={w * 2.2 + 20} fill="#fff" />
      <path d={d} stroke={ORANGE} strokeWidth={10} fill="none" strokeLinecap="round" />
    </g>
  );
};

const Lamp: React.FC<{x: number; y: number; glow: number}> = ({x, y, glow}) => (
  <g transform={`translate(${x} ${y})`}>
    <circle r={70 + 30 * glow} fill={GOLD} opacity={0.22 * glow} />
    <circle r={38} fill={glow > 0.05 ? `rgba(255,210,63,${0.25 + 0.75 * glow})` : '#fff'} stroke={INK} strokeWidth={5} />
    <line x1={-26} y1={-26} x2={26} y2={26} stroke={INK} strokeWidth={5} />
    <line x1={-26} y1={26} x2={26} y2={-26} stroke={INK} strokeWidth={5} />
  </g>
);

/* ---------- Szene ---------- */

export const WechselrichterScene: React.FC<{beats: Beats; width: number; height: number; theme?: 'dark' | 'light'}> = ({beats}) => {
  const f = useCurrentFrame();
  const b = (k: string, fb: number) => beats[k] ?? fb;
  const tB = b('arten', 150), tC = b('bruecke', 300), tD = b('kreuz', 450), tE = b('pwm', 620), tF = b('filter', 760);

  // Rhythmus der Schalter: Sinusperiode 60 Frames (Zeitlupe), Träger 6 Frames
  const SINE = 60, CARRIER = 6;
  const sine = (t: number) => Math.sin((2 * Math.PI * (t - tD)) / SINE);
  const pwmDuty = (t: number) => 0.5 + 0.46 * sine(t);
  const stateAt = (t: number): 0 | 1 | -1 => {
    if (t < tD) return 0;
    if (t < tE) return Math.floor((t - tD) / (SINE / 2)) % 2 === 0 ? 1 : -1;
    const ph = (((t - tE) % CARRIER) + CARRIER) % CARRIER / CARRIER;
    return ph < pwmDuty(t) ? 1 : -1;
  };
  const glatt = b('filter@glätten', tF + 20);
  const smooth = ramp(f, glatt, 40);
  const outAt = (t: number) => {
    const s = stateAt(t);
    if (t < tE) return s * 0.85;
    return (1 - smooth) * s * 0.85 + smooth * 0.85 * sine(t);
  };

  /* --- Teil 1: Solardach → ? → Steckdose --- */
  const oA = win(f, 0, tB);
  const dcDraw = ramp(f, b('frage@gleichstrom', 12), 24);
  const sockIn = ramp(f, b('frage@steckdose', 45), 14);
  const acDraw = ramp(f, b('frage@wechselstrom', 70), 24);
  const ask = ramp(f, b('frage@wie', 100), 12);
  const pulse = 1 + 0.06 * Math.sin(f * 0.25) * ask;

  /* --- Teil 2: Gleich- vs. Wechselstrom --- */
  const oB = win(f, tB, tC);
  const acRow = ramp(f, b('arten@wechselstrom', tB + 60), 14);
  const fifty = ramp(f, b('arten@fünfzigmal', tB + 80), 14);

  /* --- Teil 3: Gerät → Blick hinein → H-Brücke --- */
  const devIn = ramp(f, tC, 14);
  const look = ramp(f, b('bruecke@vier', tC + 50), 22);
  const oDev = devIn * (1 - look);
  const oBridge = ramp(f, b('bruecke@vier', tC + 50) + 8, 16);
  const sw = [0, 1, 2, 3].map((i) => ramp(f, b('bruecke@elektronische', tC + 60) + i * 5, 10));
  const hFlash = ramp(f, b('bruecke@hbrücke', tC + 100), 8) * (1 - ramp(f, b('bruecke@hbrücke', tC + 100) + 20, 12));

  const st = stateAt(f);
  const pathOn = st !== 0 && f >= tD;
  const path = st === 1 ? PATH_A : PATH_B;
  const pathLen = polyLen(path);
  const panelGlow = ramp(f, tC + 10, 20);
  const lampGlow = f < tD ? 0 : f < tF ? 0.35 + 0.15 * Math.abs(outAt(f)) : 0.3 + 0.7 * ramp(f, b('filter@steckdose', tF + 90), 16) + 0.2 * smooth;
  const filterIn = ramp(f, b('filter@spule', tF), 14);
  const capIn = ramp(f, b('filter@kondensator', tF + 10), 14);

  /* --- Oszilloskop (rollend) --- */
  const SC = {x0: 120, x1: 960, y0: 880, y1: 1120};
  const scY = (SC.y0 + SC.y1) / 2, scA = 92, WIN = 120;
  const oScope = ramp(f, tD - 6, 12);
  const scopePts: P[] = [];
  for (let i = 0; i <= 420; i++) {
    const t = f - WIN + (i / 420) * WIN;
    scopePts.push([SC.x0 + 20 + (i / 420) * (SC.x1 - SC.x0 - 40), scY - outAt(t) * scA]);
  }
  const ghost: P[] = [];
  for (let i = 0; i <= 140; i++) {
    const t = f - WIN + (i / 140) * WIN;
    ghost.push([SC.x0 + 20 + (i / 140) * (SC.x1 - SC.x0 - 40), scY - 0.85 * sine(t) * scA]);
  }
  const ghostO = ramp(f, b('pwm@breit', tE + 40), 14) * (1 - smooth);
  const rectFlash = ramp(f, b('kreuz@rechteck', tD + 110), 8) * (1 - ramp(f, b('kreuz@rechteck', tD + 110) + 24, 12));

  /* --- Ende: Steckdose --- */
  const endIn = ramp(f, b('filter@steckdose', tF + 90) + 4, 16);

  return (
    <AbsoluteFill style={{background: '#fff'}}>
      <svg width={1080} height={1920} viewBox="0 0 1080 1920">
        {/* Teil 1 */}
        <g opacity={oA}>
          <Sun x={150} y={520} f={f} o={1} />
          <SolarHouse x={270} y={700} glow={dcDraw} />
          <MiniPlot x={170} y={970} w={200} kind="dc" p={dcDraw} color={ORANGE} f={f} />
          <g opacity={sockIn} transform={`translate(${810} ${770}) scale(${0.8 + 0.2 * sockIn}) translate(${-810} ${-770})`}>
            <Socket x={810} y={770} />
            <MiniPlot x={710} y={970} w={200} kind="ac" p={acDraw} color={BLUE} f={f} />
          </g>
          <g opacity={ask} transform={`translate(540 770) scale(${pulse})`}>
            <rect x={-70} y={-70} width={140} height={140} rx={22} fill="#fff" stroke={MUTED} strokeWidth={5} strokeDasharray="14 10" />
            <path d="M-26 -18 Q-26 -44 0 -44 Q26 -44 26 -20 Q26 -2 4 8 L4 22" stroke={INK} strokeWidth={9} fill="none" strokeLinecap="round" />
            <circle cx={4} cy={44} r={7} fill={INK} />
          </g>
          <line x1={420} y1={770} x2={455} y2={770} stroke={MUTED} strokeWidth={5} strokeDasharray="8 8" opacity={ask} />
          <line x1={625} y1={770} x2={700} y2={770} stroke={MUTED} strokeWidth={5} strokeDasharray="8 8" opacity={ask} />
        </g>

        {/* Teil 2 */}
        <g opacity={oB}>
          {([['dc', 560, 1], ['ac', 900, acRow]] as const).map(([kind, y, o]) => (
            <g key={kind} opacity={o}>
              <rect x={150} y={y - 26} width={780} height={52} rx={26} fill={SOFT} stroke={INK} strokeWidth={4} />
              {Array.from({length: 11}, (_, i) => {
                const base = 175 + i * 72;
                const x = kind === 'dc' ? 175 + ((i * 72 + (f - tB) * 4) % 740 + 740) % 740 : base + 26 * Math.sin((2 * Math.PI * (f - tB)) / 36);
                return <circle key={i} cx={x} cy={y} r={11} fill={kind === 'dc' ? ORANGE : BLUE} />;
              })}
              {kind === 'dc' ? (
                <path d={`M890 ${y - 70} l40 0 m-18 -16 l18 16 l-18 16`} stroke={ORANGE} strokeWidth={7} fill="none" strokeLinecap="round" strokeLinejoin="round" />
              ) : (
                <path d={`M890 ${y - 70} l40 0 m-18 -16 l18 16 l-18 16 M890 ${y - 70} m18 -16 l-18 16 l18 16`} stroke={BLUE} strokeWidth={7} fill="none" strokeLinecap="round" strokeLinejoin="round" />
              )}
              <MiniPlot x={170} y={y + 100} w={kind === 'ac' ? 740 : 740} kind={kind} p={kind === 'dc' ? ramp(f, tB + 6, 24) : acRow} color={kind === 'dc' ? ORANGE : BLUE} f={kind === 'ac' ? f * (1 + fifty) : f} />
            </g>
          ))}
          <MiniPanel x={90} y={470} glow={1} />
          <g opacity={acRow}>
            <Socket x={96} y={812} s={0.42} />
          </g>
        </g>

        {/* Teil 3: Gerät von außen */}
        {f >= tC - 2 && f < tD + 10 ? <Inverter x={540} y={770} s={0.9 + 0.9 * look} o={oDev} f={f} /> : null}

        {/* Teil 3–6: H-Brücke */}
        {f >= tC ? (
          <g opacity={oBridge * (1 - endIn)}>
            {/* Schienen + Verbindungen */}
            <path d={toD([[XS, 560], [XS, PLUS], [XR, PLUS], [XR, MINUS], [XS, MINUS], [XS, 740]])} stroke={INK} strokeWidth={6} fill="none" strokeLinejoin="round" />
            <line x1={XL} y1={PLUS} x2={XL} y2={MINUS} stroke={INK} strokeWidth={6} />
            <line x1={XL} y1={MID} x2={XR} y2={MID} stroke={INK} strokeWidth={6} />
            <circle cx={XL} cy={MID} r={9} fill={INK} />
            <circle cx={XR} cy={MID} r={9} fill={INK} />
            <MiniPanel x={XS} y={650} glow={panelGlow} />
            <path d={`M${XS - 40} ${PLUS + 26} l16 0 m-8 -8 l0 16 M${XS - 40} ${MINUS - 26} l16 0`} stroke={INK} strokeWidth={4} />

            {/* Stromweg */}
            {pathOn ? (
              <>
                <path d={toD(path)} stroke={f < tE ? BLUE : '#7fb8ee'} strokeWidth={14} fill="none" strokeLinejoin="round" opacity={0.35} />
                {Array.from({length: 14}, (_, i) => {
                  const [x, y] = along(path, (i / 14) * pathLen + (f - tD) * 7);
                  return <circle key={i} cx={x} cy={y} r={8} fill={BLUE} />;
                })}
              </>
            ) : null}

            {/* Richtung durch die Last */}
            {pathOn && f < tE ? (
              <path d={st === 1 ? 'M535 600 l90 0 m-22 -18 l22 18 l-22 18' : 'M625 600 l-90 0 m22 -18 l-22 18 l22 18'} stroke={BLUE} strokeWidth={8} fill="none" strokeLinecap="round" strokeLinejoin="round" />
            ) : null}

            {/* Spule + Kondensator */}
            <Coil x0={436} x1={548} y={MID} o={filterIn} />
            <g opacity={capIn}>
              <path d={`M570 ${MID} L570 730 L620 730 M640 730 L700 730 L700 ${MID}`} stroke={INK} strokeWidth={6} fill="none" />
              <line x1={620} y1={696} x2={620} y2={764} stroke={BLUE} strokeWidth={12} />
              <line x1={640} y1={696} x2={640} y2={764} stroke={BLUE} strokeWidth={12} />
              <circle cx={570} cy={MID} r={8} fill={INK} />
              <circle cx={700} cy={MID} r={8} fill={INK} />
            </g>

            <Lamp x={630} y={MID} glow={lampGlow} />

            {/* vier Schalter */}
            <g transform={hFlash ? `translate(580 650) scale(${1 + 0.04 * hFlash}) translate(-580 -650)` : undefined}>
              <Switch x={XL} y={560} on={st === 1} pop={sw[0]} />
              <Switch x={XR} y={560} on={st === -1} pop={sw[1]} />
              <Switch x={XL} y={740} on={st === -1} pop={sw[2]} />
              <Switch x={XR} y={740} on={st === 1} pop={sw[3]} />
            </g>
            {hFlash > 0 ? (
              <path d={`M${XL} 500 L${XL} 800 M${XR} 500 L${XR} 800 M${XL} ${MID} L${XR} ${MID}`} stroke={GOLD} strokeWidth={22} opacity={0.45 * hFlash} strokeLinecap="round" />
            ) : null}
          </g>
        ) : null}

        {/* Oszilloskop */}
        {f >= tD - 6 ? (
          <g opacity={oScope * (1 - endIn)}>
            <rect x={SC.x0} y={SC.y0} width={SC.x1 - SC.x0} height={SC.y1 - SC.y0} rx={26} fill="#f6f7f9" stroke={rectFlash > 0 ? GOLD : '#d5d9de'} strokeWidth={4 + 6 * rectFlash} />
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <line key={i} x1={SC.x0 + (i * (SC.x1 - SC.x0)) / 8} y1={SC.y0 + 12} x2={SC.x0 + (i * (SC.x1 - SC.x0)) / 8} y2={SC.y1 - 12} stroke="#e4e7eb" strokeWidth={2} />
            ))}
            <line x1={SC.x0 + 14} y1={scY} x2={SC.x1 - 14} y2={scY} stroke="#cfd4da" strokeWidth={3} />
            <path d={toD(ghost)} stroke={GOLD} strokeWidth={6} fill="none" strokeDasharray="12 10" opacity={ghostO} />
            <path d={toD(scopePts)} stroke={smooth > 0.5 ? GOLD : BLUE} strokeWidth={6} fill="none" strokeLinejoin="round" />
            <circle cx={scopePts[scopePts.length - 1][0]} cy={scopePts[scopePts.length - 1][1]} r={10} fill={smooth > 0.5 ? GOLD : BLUE} />
          </g>
        ) : null}

        {/* Ende: sauberer Sinus an der Steckdose */}
        {endIn > 0 ? (
          <g opacity={endIn}>
            <g transform={`translate(540 700) scale(${0.85 + 0.15 * endIn}) translate(-540 -700)`}>
              <Socket x={540} y={700} s={1.5} glow={1} />
            </g>
            <MiniPlot x={240} y={1020} w={600} kind="ac" p={endIn} color={GOLD} f={f} />
          </g>
        ) : null}
      </svg>
    </AbsoluteFill>
  );
};
