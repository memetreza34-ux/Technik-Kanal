import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {FONT} from '../short/brand';
import {CaptionSlot, CardSlot, Heading, Label, Mark} from '../frame/Frame';

// Demo – Wie entsteht das Drehfeld? Drei Spulen, drei um 120° versetzte Ströme → ein umlaufendes Magnetfeld.
// Weißer Hintergrund (Standard). 15 s, ohne Ton.

const INK = '#1F2328';
const MUTED = '#9aa1ab';
const RING = '#eef0f3';
const COL = ['#E2650F', '#3a3f46', '#1E7FD8']; // L1, L2, L3
const GOLD = '#F2B000';
const cl = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};
const DEG = Math.PI / 180;

const CX = 540, CY = 800, R = 215;
const PLOT = {x0: 150, x1: 930, y: 1128, a: 42};

// Ablauf (Frames)
const ONE = 70, THREE = 150, FIELD = 200, ROTOR = 222, SWAP = 345, END = 450;
const OMEGA = (2 * Math.PI * 0.42) / 30; // Zeitlupe: 0,42 Umdrehungen pro Sekunde

const pt = (r: number, th: number): [number, number] => [CX + r * Math.cos(th), CY - r * Math.sin(th)];
const theta = (k: number) => (90 + k * 120) * DEG; // Spulenachse L1 oben, L2/L3 je +120°

/** Phasenwinkel (läuft ab ONE) und Ströme der drei Spulen. Nach SWAP sind L1 und L3 vertauscht. */
const currents = (f: number) => {
  const phi = Math.max(0, f - ONE) * OMEGA;
  const raw = [0, 1, 2].map((k) => Math.cos(phi - k * 120 * DEG));
  const swapped = f >= SWAP;
  const i = swapped ? [raw[2], raw[1], raw[0]] : raw;
  const single = f < THREE;
  return {phi, i: single ? [f >= ONE ? raw[0] : 0, 0, 0] : f >= ONE ? i : [0, 0, 0], swapped, single};
};

const Arrow: React.FC<{from: [number, number]; to: [number, number]; color: string; w: number; glow?: boolean; opacity?: number}> = ({from, to, color, w, glow, opacity = 1}) => {
  const dx = to[0] - from[0], dy = to[1] - from[1];
  const len = Math.hypot(dx, dy);
  if (len < 6) return null;
  const ux = dx / len, uy = dy / len;
  const head = Math.min(w * 3.2, len * 0.45);
  const bx = to[0] - ux * head, by = to[1] - uy * head;
  const px = -uy * head * 0.6, py = ux * head * 0.6;
  return (
    <g opacity={opacity} style={glow ? {filter: `drop-shadow(0 0 10px ${color})`} : undefined}>
      <line x1={from[0]} y1={from[1]} x2={bx} y2={by} stroke={color} strokeWidth={w} strokeLinecap="round" />
      <path d={`M ${to[0]} ${to[1]} L ${bx + px} ${by + py} L ${bx - px} ${by - py} Z`} fill={color} />
    </g>
  );
};

export const Drehfeld: React.FC = () => {
  const f = useCurrentFrame();
  const draw = interpolate(f, [0, 25], [0, 1], cl);
  const {phi, i, swapped, single} = currents(f);

  // Summe der drei Spulenfelder = resultierendes Feld
  let bx = 0, by = 0;
  i.forEach((v, k) => {
    bx += v * Math.cos(theta(k));
    by += v * Math.sin(theta(k));
  });
  const bAng = Math.atan2(by, bx);
  const fieldOn = interpolate(f, [FIELD, FIELD + 12], [0, 1], cl);

  // Läufer: läuft dem Feld knapp hinterher; beim Tausch rollt er aus, kehrt um und rastet wieder ein
  const LAG = 0.35;
  const phiAt = (n: number) => Math.max(0, n - ONE) * OMEGA;
  const lock1 = (n: number) => Math.PI / 2 + phiAt(n) - LAG;
  const K = (() => {
    const c = currents(SWAP);
    let x = 0, y = 0;
    c.i.forEach((v, k) => {
      x += v * Math.cos(theta(k));
      y += v * Math.sin(theta(k));
    });
    return Math.atan2(y, x) + phiAt(SWAP);
  })();
  let ra = lock1(f);
  if (f >= SWAP) {
    const tau = 16;
    const coast = lock1(SWAP) + OMEGA * tau * (1 - Math.exp(-(f - SWAP) / tau));
    let lock2 = K - phiAt(f) + LAG;
    const ref = lock1(SWAP) + OMEGA * tau;
    const refLock = K - phiAt(SWAP + 40) + LAG;
    lock2 -= Math.round((refLock - ref) / (2 * Math.PI)) * 2 * Math.PI;
    const u = interpolate(f, [SWAP + 18, SWAP + 60], [0, 1], cl);
    const e = u * u * (3 - 2 * u);
    ra = coast * (1 - e) + lock2 * e;
  }
  const rotorOn = interpolate(f, [ROTOR, ROTOR + 14], [0, 1], cl);

  // Sinus-Diagramm: Wellen laufen von links in die „Jetzt“-Linie rechts
  const wave = (k: number) => {
    const pts: string[] = [];
    for (let n = 0; n <= 90; n++) {
      const x = PLOT.x0 + ((PLOT.x1 - PLOT.x0) * n) / 90;
      const back = ((PLOT.x1 - x) / (PLOT.x1 - PLOT.x0)) * 2 * Math.PI * 1.5;
      const v = Math.cos(phi - back - k * 120 * DEG);
      pts.push(`${x.toFixed(1)},${(PLOT.y - v * PLOT.a).toFixed(1)}`);
    }
    return pts.join(' ');
  };
  const plotOn = interpolate(f, [ONE, ONE + 12], [0, 1], cl);

  return (
    <AbsoluteFill style={{background: '#FFFFFF'}}>
      <AbsoluteFill style={{backgroundImage: 'linear-gradient(rgba(31,35,40,.045) 1px, transparent 1px), linear-gradient(90deg, rgba(31,35,40,.045) 1px, transparent 1px)', backgroundSize: '40px 40px'}} />
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0, opacity: draw}}>
        {/* Ständer */}
        <circle cx={CX} cy={CY} r={R} fill="none" stroke={RING} strokeWidth={40} />
        <circle cx={CX} cy={CY} r={R - 20} fill="none" stroke="#dfe3e8" strokeWidth={2} />
        {/* Spulen (je zwei Polschuhe) */}
        {[0, 1, 2].map((k) =>
          [0, 180].map((off) => {
            const th = theta(k) + off * DEG;
            const [x, y] = pt(R - 22, th);
            const a = Math.abs(i[k]);
            return (
              <g key={k + '-' + off} transform={`translate(${x} ${y}) rotate(${-(th / DEG) + 90})`}>
                <rect x={-38} y={-20} width={76} height={40} rx={10} fill={COL[k]} opacity={0.18 + 0.82 * a} />
                {[-24, -8, 8, 24].map((dx) => (
                  <line key={dx} x1={dx} y1={-20} x2={dx} y2={20} stroke="#fff" strokeOpacity={0.55} strokeWidth={3} />
                ))}
              </g>
            );
          }),
        )}
        {[0, 1, 2].map((k) => {
          const [x, y] = pt(R + 46, theta(k));
          const label = swapped ? ['L3', 'L2', 'L1'][k] : ['L1', 'L2', 'L3'][k];
          const col = swapped ? COL[[2, 1, 0][k]] : COL[k];
          return (
            <text key={k} x={x} y={y + 10} textAnchor="middle" fontFamily={FONT.ui} fontWeight={900} fontSize={32} fill={col}>
              {label}
            </text>
          );
        })}

        {/* Läufer */}
        <g opacity={rotorOn} transform={`translate(${CX} ${CY}) rotate(${-ra / DEG})`}>
          <rect x={-120} y={-26} width={240} height={52} rx={26} fill="#e9ecf0" stroke="#c9ced6" strokeWidth={3} />
          <rect x={20} y={-26} width={100} height={52} rx={26} fill="#E5484D" />
          <text x={78} y={11} textAnchor="middle" fontFamily={FONT.ui} fontWeight={900} fontSize={30} fill="#fff">N</text>
          <text x={-78} y={11} textAnchor="middle" fontFamily={FONT.ui} fontWeight={900} fontSize={30} fill={MUTED}>S</text>
        </g>

        {/* Feld jeder Spule (Pfeil wächst/schrumpft mit dem Strom) */}
        {[0, 1, 2].map((k) => (
          <Arrow key={k} from={[CX, CY]} to={pt(150 * i[k], theta(k))} color={swapped ? COL[[2, 1, 0][k]] : COL[k]} w={9} opacity={fieldOn > 0 ? 1 - 0.55 * fieldOn : 1} />
        ))}
        {/* resultierendes Feld */}
        {fieldOn > 0 ? <Arrow from={[CX, CY]} to={pt(185, bAng)} color={GOLD} w={16} glow opacity={fieldOn} /> : null}
        <circle cx={CX} cy={CY} r={9} fill={INK} />
        {fieldOn > 0 && !single ? (
          <text x={CX + 260} y={CY - 250} textAnchor="end" fontFamily={FONT.ui} fontWeight={900} fontSize={34} fill={GOLD} opacity={fieldOn}>
            {swapped ? '↻' : '↺'} Drehfeld
          </text>
        ) : null}

        {/* Sinus-Diagramm */}
        <g opacity={plotOn}>
          <line x1={PLOT.x0} y1={PLOT.y} x2={PLOT.x1} y2={PLOT.y} stroke="#d7dbe1" strokeWidth={2} />
          {[0, 1, 2].map((k) => (
            <polyline key={k} points={wave(k)} fill="none" stroke={COL[k]} strokeWidth={5} strokeLinejoin="round" opacity={single && k > 0 ? 0.12 : 1} />
          ))}
          <line x1={PLOT.x1} y1={PLOT.y - PLOT.a - 10} x2={PLOT.x1} y2={PLOT.y + PLOT.a + 10} stroke={INK} strokeWidth={3} />
          {[0, 1, 2].map((k) =>
            single && k > 0 ? null : (
              <circle key={k} cx={PLOT.x1} cy={PLOT.y - i[swapped ? [2, 1, 0][k] : k] * PLOT.a} r={9} fill={COL[k]} stroke="#fff" strokeWidth={3} />
            ),
          )}
          <text x={PLOT.x0} y={PLOT.y - PLOT.a - 14} fontFamily={FONT.ui} fontWeight={700} fontSize={22} fill={MUTED}>Strom in den Spulen (Zeitlupe)</text>
        </g>
      </svg>

      {/* Rahmen */}
      {f < ONE ? <Heading theme="light" text="Warum [dreht] er sich?" /> : f < THREE ? <Heading theme="light" text="Nur [eine] Phase" from={ONE} /> : f < SWAP ? <Heading theme="light" text="Drei [Phasen]" from={THREE} /> : <Heading theme="light" text="L1 und L3 [tauschen]" from={SWAP} />}

      <CaptionSlot theme="light" show={8} hide={68}>Drei Spulen, drei Phasen</CaptionSlot>
      <CaptionSlot theme="light" show={ONE + 4} hide={THREE - 2}>
        Eine Phase: Feld <Mark theme="light">pendelt</Mark> nur
      </CaptionSlot>
      <CaptionSlot theme="light" show={THREE + 2} hide={ROTOR - 2}>Jede Phase 120° versetzt</CaptionSlot>
      <CaptionSlot theme="light" show={ROTOR} hide={300}>
        Zusammen: ein <Mark theme="light">Drehfeld</Mark>
      </CaptionSlot>
      <CaptionSlot theme="light" show={302} hide={SWAP - 2}>Der Läufer dreht mit</CaptionSlot>
      <CaptionSlot theme="light" show={SWAP + 2} hide={400}>Phasen getauscht …</CaptionSlot>
      <CaptionSlot theme="light" show={400} hide={END + 30}>
        … Feld dreht <Mark theme="light">andersrum</Mark>
      </CaptionSlot>

      <CardSlot theme="light" show={THREE + 10} hide={SWAP - 2}>
        <Label theme="light">Drehstrom</Label>
        <div style={{fontSize: 46, fontWeight: 900}}>
          <span style={{color: COL[0]}}>L1</span> · <span style={{color: COL[1]}}>L2</span> · <span style={{color: COL[2]}}>L3</span> – je 120° versetzt
        </div>
      </CardSlot>
      <CardSlot theme="light" show={SWAP + 10} hide={END + 30}>
        <Label theme="light">Phasenfolge</Label>
        <div style={{fontSize: 46, fontWeight: 900}}>
          <span style={{color: COL[2]}}>L3</span> · <span style={{color: COL[1]}}>L2</span> · <span style={{color: COL[0]}}>L1</span> → rückwärts
        </div>
      </CardSlot>
    </AbsoluteFill>
  );
};
