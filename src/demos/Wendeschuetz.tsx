import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {FONT} from '../short/brand';
import {CaptionSlot, CardSlot, Heading, Label, Mark} from '../frame/Frame';

// Demo – Schaltplan: Wendeschützschaltung (Rechts-/Linkslauf mit Verriegelung).
// Links Hauptstromkreis mit Motor, rechts Steuerstromkreis. Strom = farbig, stromlos = grau.

// Farben als CSS-Variablen → dieselbe Zeichnung funktioniert hell und dunkel.
const BG = 'var(--wb)';
const GREY = 'var(--wg)';
const INK = 'var(--wi)';
const LIVE = 'var(--live)';
const PH = {L1: 'var(--l1)', L2: 'var(--l2)', L3: 'var(--l3)'};
const PALETTE = {
  dark: {'--wb': '#101216', '--wg': '#4f5763', '--wi': '#c9d0da', '--l1': '#FF8A3D', '--l2': '#E6EAF0', '--l3': '#4FB6FF', '--live': '#FFD23F', '--disc': 'var(--disc)', '--grid': 'rgba(255,255,255,.035)'},
  light: {'--wb': '#FFFFFF', '--wg': '#c9ced6', '--wi': '#1F2328', '--l1': '#E2650F', '--l2': '#3a3f46', '--l3': '#1E7FD8', '--live': '#F2B000', '--disc': '#ffffff', '--grid': 'rgba(31,35,40,.05)'},
} as const;
const RED = '#FF4B3A';
const cl = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

// ---------- Ablauf (Frames) ----------
/** Zeitpunkte (Frames): Tasterdrücke [von, bis] und Schaltzeitpunkte der Schütze. */
export type WendeEvents = {
  s1: number[]; s2a: number[]; s0: number[]; s2b: number[]; k1On: number; k1Off: number; k2On: number;
  /** optionale Erklär-Momente: Steuerkreis abdunkeln, Phasentausch zeigen, Rolltor-Pfeile, „Was wäre wenn“-Kurzschluss, Verriegelung markieren */
  dim?: number[]; swap?: number[]; rolltor?: number[]; danger?: number[]; lock?: number[];
};
const DEMO_EV: WendeEvents = {s1: [40, 95], s2a: [128, 150], s0: [160, 172], s2b: [185, 215], k1On: 46, k1Off: 162, k2On: 191};
const within = (f: number, [a, b]: number[]) => f >= a && f < b;

// ---------- Schaltzeichen ----------
const Wire: React.FC<{d: string; live?: boolean; color?: string; f: number}> = ({d, live, color = LIVE, f}) => (
  <>
    <path d={d} fill="none" stroke={GREY} strokeWidth={4} strokeLinejoin="round" />
    {live ? (
      <>
        <path d={d} fill="none" stroke={color} strokeWidth={6} strokeLinejoin="round" style={{filter: `drop-shadow(0 0 6px ${color})`}} />
        <path d={d} fill="none" stroke="#fff" strokeOpacity={0.75} strokeWidth={4} strokeLinecap="round" strokeDasharray="1 26" strokeDashoffset={-f * 3} />
      </>
    ) : null}
  </>
);

const Dot: React.FC<{x: number; y: number; live?: boolean; color?: string}> = ({x, y, live, color = LIVE}) => <circle cx={x} cy={y} r={6} fill={live ? color : GREY} />;

/** Kontakt zwischen y1 (oben) und y2 (unten). closed 0–1. NO = Schließer, NC = Öffner. */
const Contact: React.FC<{x: number; y1: number; y2: number; closed: number; kind: 'NO' | 'NC'; button?: boolean; pressed?: boolean; label?: string; live?: boolean; color?: string; warn?: boolean}> = ({x, y1, y2, closed, kind, button, pressed, label, live, color = LIVE, warn}) => {
  const c = live ? color : GREY;
  const top = y1 + 14, piv = y2 - 14;
  const open: [number, number] = [x - 22, top + 6];
  const shut: [number, number] = kind === 'NC' ? [x + 9, top] : [x, top];
  const end: [number, number] = [open[0] + (shut[0] - open[0]) * closed, open[1] + (shut[1] - open[1]) * closed];
  const midY = (piv + end[1]) / 2, midX = (x + end[0]) / 2;
  const push = pressed ? 8 : 0;
  return (
    <g>
      <line x1={x} y1={y1} x2={x} y2={top} stroke={c} strokeWidth={4} />
      <line x1={x} y1={piv} x2={x} y2={y2} stroke={c} strokeWidth={4} />
      {kind === 'NC' ? <line x1={x} y1={top} x2={x + 12} y2={top} stroke={c} strokeWidth={4} /> : null}
      <line x1={x} y1={piv} x2={end[0]} y2={end[1]} stroke={warn ? RED : c} strokeWidth={4} strokeLinecap="round" />
      {button ? (
        <g>
          <line x1={midX} y1={midY} x2={x - 50 + push} y2={midY} stroke={INK} strokeWidth={2.5} strokeDasharray="5 5" />
          <line x1={x - 50 + push} y1={midY - 12} x2={x - 50 + push} y2={midY + 12} stroke={pressed ? LIVE : INK} strokeWidth={4} />
          <line x1={x - 50 + push} y1={midY - 12} x2={x - 58 + push} y2={midY - 12} stroke={pressed ? LIVE : INK} strokeWidth={4} />
          <line x1={x - 50 + push} y1={midY + 12} x2={x - 58 + push} y2={midY + 12} stroke={pressed ? LIVE : INK} strokeWidth={4} />
        </g>
      ) : null}
      {warn ? <circle cx={x} cy={(y1 + y2) / 2} r={34} fill="none" stroke={RED} strokeWidth={4} /> : null}
      {label ? (
        <text x={x + 18} y={(y1 + y2) / 2 + 8} fontFamily={FONT.ui} fontWeight={800} fontSize={24} fill={warn ? RED : INK}>
          {label}
        </text>
      ) : null}
    </g>
  );
};

const Coil: React.FC<{x: number; y: number; on: boolean; label: string}> = ({x, y, on, label}) => (
  <g>
    <rect x={x - 30} y={y - 20} width={60} height={40} rx={4} fill={on ? LIVE : BG} stroke={on ? LIVE : GREY} strokeWidth={4} style={on ? {filter: `drop-shadow(0 0 12px ${LIVE})`} : undefined} />
    <text x={x + 42} y={y + 8} fontFamily={FONT.ui} fontWeight={900} fontSize={26} fill={on ? LIVE : INK}>
      {label}
    </text>
  </g>
);

const Fuse: React.FC<{x: number; y: number; live?: boolean; color?: string; label?: string}> = ({x, y, live, color = LIVE, label}) => (
  <g>
    <rect x={x - 9} y={y - 20} width={18} height={40} rx={3} fill={BG} stroke={live ? color : GREY} strokeWidth={3.5} />
    <line x1={x} y1={y - 20} x2={x} y2={y + 20} stroke={live ? color : GREY} strokeWidth={3} />
    {label ? (
      <text x={x + 16} y={y + 8} fontFamily={FONT.ui} fontWeight={800} fontSize={22} fill={INK}>
        {label}
      </text>
    ) : null}
  </g>
);

/** Drei gekoppelte Hauptkontakte (Schließer) mit Wirkverbindung. */
const MainContacts: React.FC<{xs: number[]; closed: number; label: string; live: boolean; colors: string[]}> = ({xs, closed, label, live, colors}) => (
  <g>
    {xs.map((x, i) => (
      <Contact key={x} x={x} y1={520} y2={580} closed={closed} kind="NO" live={live} color={colors[i]} />
    ))}
    <line x1={xs[0] - 12} y1={551} x2={xs[2] - 6} y2={551} stroke={INK} strokeWidth={2.5} strokeDasharray="5 5" />
    <text x={xs[2] + 16} y={560} fontFamily={FONT.ui} fontWeight={900} fontSize={26} fill={live ? LIVE : INK}>
      {label}
    </text>
  </g>
);

/** Bühne: Schaltplan + Motor (ohne Texte). */
export const WendeStage: React.FC<{ev: WendeEvents; theme?: 'dark' | 'light'}> = ({ev, theme = 'dark'}) => {
  const f = useCurrentFrame();
  const s1 = within(f, ev.s1), s0 = within(f, ev.s0), s2 = within(f, ev.s2a) || within(f, ev.s2b);
  const K1 = f >= ev.k1On && f < ev.k1Off;
  const K2 = f >= ev.k2On;
  const b1 = !s0 && (s1 || K1) && !K2;
  const b2 = !s0 && (s2 || K2) && !K1;
  const blocked = within(f, ev.s2a) && K1;
  const draw = interpolate(f, [0, 30], [0, 1], cl);
  const on = (r?: number[]) => !!r && within(f, r);
  const danger = on(ev.danger), swap = on(ev.swap), rolltor = on(ev.rolltor), lock = on(ev.lock);
  const flick = f % 8 < 5;
  const dimCtl = ev.dim ? 1 - 0.8 * Math.min(interpolate(f, [ev.dim[0], ev.dim[0] + 8], [0, 1], cl), interpolate(f, [ev.dim[1] - 8, ev.dim[1]], [1, 0], cl)) : 1;

  // Motor: Drehzahl folgt mit Verzögerung (Anlauf/Auslauf)
  let v = 0, ang = 0;
  for (let i = 0; i <= f; i++) {
    const target = i >= ev.k1On && i < ev.k1Off ? 1 : i >= ev.k2On ? -1 : 0;
    v += (target - v) * 0.07;
    ang += v * 14;
  }
  const dir = v > 0.15 ? 'Rechtslauf' : v < -0.15 ? 'Linkslauf' : 'Stillstand';

  // Phasen an den Motorklemmen U, V, W
  const lead = K1 ? [PH.L1, PH.L2, PH.L3] : K2 ? [PH.L3, PH.L2, PH.L1] : null;
  const swapGlow = K2 ? 0.5 + 0.5 * Math.sin(f * 0.25) : 0;

  return (
    <AbsoluteFill style={{...(PALETTE[theme] as unknown as React.CSSProperties), background: BG}}>
      {/* feines Raster wie auf Schaltplanpapier */}
      <AbsoluteFill style={{backgroundImage: 'linear-gradient(var(--grid) 1px, transparent 1px), linear-gradient(90deg, var(--grid) 1px, transparent 1px)', backgroundSize: '40px 40px'}} />

      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, opacity: draw}}>
       <g transform="translate(0 210)">
        {/* ===== Hauptstromkreis ===== */}
        {(['L1', 'L2', 'L3'] as const).map((p, i) => (
          <text key={p} x={140 + i * 60} y={318} textAnchor="middle" fontFamily={FONT.ui} fontWeight={900} fontSize={26} fill={PH[p]}>
            {p}
          </text>
        ))}
        {[140, 200, 260].map((x, i) => (
          <Wire key={x} f={f} d={`M ${x} 332 V 520`} live color={Object.values(PH)[i]} />
        ))}
        {[140, 200, 260].map((x, i) => (
          <Fuse key={x} x={x} y={372} live color={Object.values(PH)[i]} label={i === 2 ? 'F1' : undefined} />
        ))}
        {/* Abzweig zu K2 */}
        <Wire f={f} d="M 140 420 H 370 V 520" live color={PH.L1} />
        <Wire f={f} d="M 200 440 H 430 V 520" live color={PH.L2} />
        <Wire f={f} d="M 260 460 H 490 V 520" live color={PH.L3} />
        <Dot x={140} y={420} live color={PH.L1} />
        <Dot x={200} y={440} live color={PH.L2} />
        <Dot x={260} y={460} live color={PH.L3} />
        <MainContacts xs={[140, 200, 260]} closed={K1 || danger ? 1 : 0} label="K1" live={K1 || danger} colors={danger ? [RED, RED, RED] : [PH.L1, PH.L2, PH.L3]} />
        <MainContacts xs={[370, 430, 490]} closed={K2 || danger ? 1 : 0} label="K2" live={K2 || danger} colors={danger ? [RED, RED, RED] : [PH.L1, PH.L2, PH.L3]} />
        {/* K1-Ausgänge gerade runter */}
        <Wire f={f} d="M 140 580 V 680" live={K1} color={PH.L1} />
        <Wire f={f} d="M 200 580 V 660" live={K1} color={PH.L2} />
        <Wire f={f} d="M 260 580 V 640" live={K1} color={PH.L3} />
        {/* K2-Ausgänge: L1 und L3 vertauscht */}
        <g style={K2 || swap ? {filter: `drop-shadow(0 0 ${8 + (swap ? 0.5 + 0.5 * Math.sin(f * 0.25) : swapGlow) * 10}px ${LIVE})`} : undefined}>
          <Wire f={f} d="M 370 580 V 640 H 260" live={K2 || swap || danger} color={danger ? (flick ? RED : PH.L1) : PH.L1} />
          <Wire f={f} d="M 490 580 V 680 H 140" live={K2 || swap || danger} color={danger ? (flick ? RED : PH.L3) : PH.L3} />
        </g>
        {danger && flick ? (
          <g>
            <circle cx={140} cy={680} r={22} fill="none" stroke={RED} strokeWidth={5} />
            <circle cx={260} cy={640} r={22} fill="none" stroke={RED} strokeWidth={5} />
            <text x={330} y={720} fontFamily={FONT.ui} fontWeight={900} fontSize={34} fill={RED}>⚡ Kurzschluss!</text>
          </g>
        ) : null}
        <Wire f={f} d="M 430 580 V 660 H 200" live={K2} color={PH.L2} />
        {/* Zuleitungen zum Motor U V W */}
        <Wire f={f} d="M 140 680 V 764" live={!!lead} color={lead?.[0]} />
        <Wire f={f} d="M 200 660 V 730" live={!!lead} color={lead?.[1]} />
        <Wire f={f} d="M 260 640 V 764" live={!!lead} color={lead?.[2]} />
        <Dot x={140} y={680} live={!!lead} color={lead?.[0]} />
        <Dot x={200} y={660} live={!!lead} color={lead?.[1]} />
        <Dot x={260} y={640} live={!!lead} color={lead?.[2]} />
        {['U', 'V', 'W'].map((t, i) => (
          <text key={t} x={124 + i * 60} y={722} textAnchor="end" fontFamily={FONT.ui} fontWeight={700} fontSize={20} fill={INK} opacity={0.8}>
            {t}
          </text>
        ))}
        {/* Motor */}
        <circle cx={200} cy={800} r={70} fill={BG} stroke={lead ? LIVE : INK} strokeWidth={5} />
        <text x={200} y={796} textAnchor="middle" fontFamily={FONT.ui} fontWeight={900} fontSize={44} fill={INK}>M</text>
        <text x={200} y={834} textAnchor="middle" fontFamily={FONT.ui} fontWeight={800} fontSize={28} fill={INK}>3~</text>
        {rolltor ? (
          <g transform={`translate(425 ${700 + Math.sin(f * 0.18) * 14})`}>
            <text textAnchor="middle" fontFamily={FONT.ui} fontWeight={900} fontSize={30} fill={LIVE}>▲ hoch · ▼ runter</text>
          </g>
        ) : null}
        {/* Welle von vorn: dreht sich */}
        <line x1={270} y1={800} x2={360} y2={800} stroke={GREY} strokeWidth={8} />
        <g transform={`translate(425 800) rotate(${ang})`}>
          <circle r={58} fill="var(--disc)" stroke={INK} strokeWidth={4} />
          {[0, 120, 240].map((a) => (
            <path key={a} d="M 0 0 L 50 -12 L 50 12 Z" fill={a === 0 ? LIVE : '#5d6673'} transform={`rotate(${a})`} />
          ))}
          <circle r={10} fill={INK} />
        </g>
        <text x={425} y={900} textAnchor="middle" fontFamily={FONT.ui} fontWeight={900} fontSize={30} fill={dir === 'Stillstand' ? INK : LIVE}>
          {dir === 'Rechtslauf' ? '↻ Rechtslauf' : dir === 'Linkslauf' ? '↺ Linkslauf' : 'Stillstand'}
        </text>

        {/* ===== Steuerstromkreis ===== */}
        <g opacity={dimCtl}>
        <text x={622} y={328} fontFamily={FONT.ui} fontWeight={900} fontSize={26} fill={INK}>L</text>
        <Wire f={f} d="M 650 320 V 404" live={b1 || b2 || blocked} />
        <Fuse x={650} y={360} live={b1 || b2 || blocked} label="F3" />
        <Contact x={650} y1={404} y2={470} closed={s0 ? 0 : 1} kind="NC" button pressed={s0} label="S0" live={b1 || b2 || blocked} />
        <Wire f={f} d="M 650 470 V 490 H 960" live={b1 || b2 || blocked} />
        {[700, 780, 880, 960].map((x) => (
          <Dot key={x} x={x} y={490} live={b1 || b2 || blocked} />
        ))}
        {/* Zweig K1 */}
        <Contact x={700} y1={490} y2={600} closed={s1 ? 1 : 0} kind="NO" button pressed={s1} label="S1" live={b1 && s1} />
        <Contact x={780} y1={490} y2={600} closed={K1 ? 1 : 0} kind="NO" label="K1" live={K1 && b1} />
        <Wire f={f} d="M 780 600 V 610 H 700" live={K1 && b1} />
        <Wire f={f} d="M 700 600 V 630" live={b1} />
        <Contact x={700} y1={630} y2={700} closed={K2 ? 0 : 1} kind="NC" label="K2" live={b1} />
        <Wire f={f} d="M 700 700 V 760" live={b1} />
        <Coil x={700} y={780} on={K1} label="K1" />
        <Wire f={f} d="M 700 800 V 940" live={b1} />
        {/* Zweig K2 */}
        <Contact x={880} y1={490} y2={600} closed={s2 ? 1 : 0} kind="NO" button pressed={s2} label="S2" live={(b2 && s2) || blocked} />
        <Contact x={960} y1={490} y2={600} closed={K2 ? 1 : 0} kind="NO" label="K2" live={K2 && b2} />
        <Wire f={f} d="M 960 600 V 610 H 880" live={K2 && b2} />
        <Wire f={f} d="M 880 600 V 630" live={b2 || blocked} />
        <Contact x={880} y1={630} y2={700} closed={K1 ? 0 : 1} kind="NC" label="K1" live={b2} warn={blocked && f % 10 < 6} />
        <Wire f={f} d="M 880 700 V 760" live={b2} />
        <Coil x={880} y={780} on={K2} label="K2" />
        <Wire f={f} d="M 880 800 V 940" live={b2} />
        {/* N */}
        <Wire f={f} d="M 650 940 H 960" live={b1 || b2} />
        <text x={622} y={948} fontFamily={FONT.ui} fontWeight={900} fontSize={26} fill={INK}>N</text>
        {lock
          ? [700, 880].map((x) => <circle key={x} cx={x} cy={665} r={40 + Math.sin(f * 0.25) * 4} fill="none" stroke={LIVE} strokeWidth={5} style={{filter: `drop-shadow(0 0 10px ${LIVE})`}} />)
          : null}
        </g>
       </g>
      </svg>
    </AbsoluteFill>
  );
};

/** 10-s-Probe ohne Stimme. */
export const Wendeschuetz: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill>
      <WendeStage ev={DEMO_EV} />

      {/* Rahmen: Überschrift, eine Karte, einzeiliger Untertitel */}
      {f < 40 ? <Heading theme="dark" text="Motor [andersrum?]" /> : f < 160 ? <Heading theme="dark" text="K1 an: [Rechtslauf]" from={40} /> : f < 185 ? <Heading theme="dark" text="S0: alles [aus]" from={160} /> : f < 250 ? <Heading theme="dark" text="K2 an: [Linkslauf]" from={185} /> : <Heading theme="dark" text="Der [Trick]" from={250} />}

      <CardSlot theme="dark" show={50} hide={126}>
        <Label theme="dark">K1 schaltet durch</Label>
        <div style={{fontSize: 46, fontWeight: 900}}>
          <span style={{color: PH.L1}}>L1</span>→U · <span style={{color: PH.L2}}>L2</span>→V · <span style={{color: PH.L3}}>L3</span>→W
        </div>
      </CardSlot>
      <CardSlot theme="dark" show={128} hide={158} border={RED}>
        <Label theme="dark">Verriegelung</Label>
        <div style={{fontSize: 46, fontWeight: 900}}>
          K1 sperrt K2 → <span style={{color: RED}}>kein Kurzschluss</span>
        </div>
      </CardSlot>
      <CardSlot theme="dark" show={195} hide={250}>
        <Label theme="dark">K2 tauscht zwei Phasen</Label>
        <div style={{fontSize: 46, fontWeight: 900}}>
          <span style={{color: PH.L3}}>L3</span>→U · <span style={{color: PH.L2}}>L2</span>→V · <span style={{color: PH.L1}}>L1</span>→W
        </div>
      </CardSlot>

      <CaptionSlot theme="dark" show={6} hide={38}>Wendeschützschaltung</CaptionSlot>
      <CaptionSlot theme="dark" show={40} hide={94}>
        S1 drücken: <Mark theme="dark">K1 zieht an</Mark>
      </CaptionSlot>
      <CaptionSlot theme="dark" show={96} hide={127}>Selbsthaltung hält K1</CaptionSlot>
      <CaptionSlot theme="dark" show={128} hide={158}>
        S2 drücken: <span style={{color: RED}}>gesperrt</span>
      </CaptionSlot>
      <CaptionSlot theme="dark" show={160} hide={184}>S0 drücken: alles aus</CaptionSlot>
      <CaptionSlot theme="dark" show={186} hide={250}>
        S2: K2 tauscht <Mark theme="dark">L1 und L3</Mark>
      </CaptionSlot>
      <CaptionSlot theme="dark" show={252} hide={330}>Motor dreht andersrum</CaptionSlot>
    </AbsoluteFill>
  );
};
