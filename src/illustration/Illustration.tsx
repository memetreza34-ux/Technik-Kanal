import React from 'react';
import {AbsoluteFill, Img, interpolate, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {FONT} from '../short/brand';

// Beschriftungs-Ebene für Langvideo-Standbilder (1920×1080).
// Das KI-Bild enthält nie Text – Labels, Pfeile, Formeln und Diagramme setzen wir hier exakt darüber.
// Koordinaten in Pixeln des 1920×1080-Bildes.

export type Pt = [number, number];
/** at = Ende der Unterstreichung (dort beginnt die Hinweislinie), to = Punkt am Bauteil. Text steht auf der dem Bauteil abgewandten Seite. */
/** in = Sekunde (ab Bildbeginn), ab der das Element eingeblendet wird; ohne in sofort sichtbar. */
export type Label = {at: Pt; text: string; sub?: string; to?: Pt; tone?: 'main' | 'signal' | 'danger' | 'plain'; in?: number};
export type Arrow = {from: Pt; to: Pt; tone?: Label['tone']; curve?: number; in?: number};
export type Card = {at: Pt; title?: string; lines: {text: string; tone?: Label['tone']; big?: boolean}[]};
export type Chart = {
  box: [number, number, number, number]; // x, y, Breite, Höhe
  x: string; y: string;
  series: {points: Pt[]; tone?: Label['tone']}[]; // Werte 0..1 in beiden Achsen
  marks?: {at: number; text: string; tone?: Label['tone']}[]; // x-Position 0..1
};
export type IllustrationProps = {
  image: string; // Pfad relativ zu public/
  theme?: 'dark' | 'light';
  title?: string;
  labels?: Label[];
  arrows?: Arrow[];
  cards?: Card[];
  chart?: Chart;
  /** Spotlight: Rest des Bildes abdunkeln, Kreis um das Wichtige bleibt hell. */
  focus?: {at: Pt; r: number};
};

const TONE = {main: '#FF9A3C', signal: '#3FD6F0', danger: '#FF5C5C', plain: '#FFFFFF'};

export const Illustration: React.FC<IllustrationProps> = ({image, theme = 'dark', title, labels = [], arrows = [], cards = [], chart, focus}) => {
  const ink = theme === 'dark' ? '#FFFFFF' : '#1B2330';
  const panel = theme === 'dark' ? 'rgba(10,16,28,0.78)' : 'rgba(255,255,255,0.9)';
  const border = theme === 'dark' ? 'rgba(255,255,255,0.22)' : 'rgba(27,35,48,0.18)';
  const tone = (t?: Label['tone']) => (t && t !== 'plain' ? TONE[t] : ink);
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const show = (t?: number) => (t === undefined ? 1 : interpolate(frame, [t * fps, t * fps + 8], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));
  // Heller Hintergrund: dunkle Schrift mit hellem Schein statt weißer Schrift mit Schatten.
  const textShadow = theme === 'dark' ? '0 2px 10px rgba(0,0,0,.85), 0 0 2px rgba(0,0,0,.9)' : '0 1px 8px rgba(255,255,255,.9), 0 0 2px rgba(255,255,255,.9)';
  return (
    <AbsoluteFill style={{fontFamily: FONT.ui}}>
      <Img src={staticFile(image)} style={{width: 1920, height: 1080, objectFit: 'cover'}} />
      <svg width={1920} height={1080} style={{position: 'absolute', inset: 0}}>
        <defs>
          {Object.entries(TONE).map(([k, c]) => (
            <marker key={k} id={'head-' + k} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 z" fill={c} />
            </marker>
          ))}
        </defs>
        {focus ? (
          <>
            <defs>
              <radialGradient id="spot" cx={focus.at[0]} cy={focus.at[1]} r={focus.r * 1.6} gradientUnits="userSpaceOnUse">
                <stop offset="0.55" stopColor="#fff" stopOpacity={0} />
                <stop offset="1" stopColor="#fff" stopOpacity={1} />
              </radialGradient>
              <mask id="spotmask"><rect width={1920} height={1080} fill="url(#spot)" /></mask>
            </defs>
            <rect width={1920} height={1080} fill="#050A14" opacity={0.55} mask="url(#spotmask)" />
          </>
        ) : null}
        {labels.filter((l) => l.to).map((l, i) => (
          <g key={i} filter="drop-shadow(0 2px 4px rgba(0,0,0,.6))" opacity={show(l.in)}>
            <line x1={l.at[0]} y1={l.at[1]} x2={l.to![0]} y2={l.to![1]} stroke={l.tone && l.tone !== 'plain' ? TONE[l.tone] : ink} strokeWidth={3} />
            <circle cx={l.to![0]} cy={l.to![1]} r={9} fill="none" stroke="#FFFFFF" strokeWidth={3} />
            <circle cx={l.to![0]} cy={l.to![1]} r={4} fill={l.tone && l.tone !== 'plain' ? TONE[l.tone] : '#FFFFFF'} />
          </g>
        ))}
        {arrows.map((a, i) => {
          const [x1, y1] = a.from, [x2, y2] = a.to;
          const mx = (x1 + x2) / 2 - (y2 - y1) * (a.curve ?? 0), my = (y1 + y2) / 2 + (x2 - x1) * (a.curve ?? 0);
          const k = a.tone ?? 'main';
          return <path key={i} opacity={show(a.in)} d={`M${x1} ${y1} Q${mx} ${my} ${x2} ${y2}`} stroke={TONE[k === 'plain' ? 'plain' : k]} strokeWidth={7} fill="none" strokeLinecap="round" markerEnd={`url(#head-${k})`} />;
        })}
        {chart ? <ChartSvg chart={chart} ink={ink} panel={panel} border={border} /> : null}
      </svg>
      {title ? (
        <div style={{position: 'absolute', top: 60, left: 80, display: 'flex', alignItems: 'center', gap: 18, color: ink, fontWeight: 800, fontSize: 42, letterSpacing: 0.3, textShadow}}>
          <div style={{width: 8, height: 46, borderRadius: 4, background: TONE.main}} />
          {title}
        </div>
      ) : null}
      {labels.map((l, i) => {
        const right = !l.to || l.to[0] >= l.at[0]; // Bauteil rechts → Text links vom Ankerpunkt
        const c = l.tone && l.tone !== 'plain' ? TONE[l.tone] : ink;
        return (
          <div key={i} style={{opacity: show(l.in), position: 'absolute', left: l.at[0], top: l.at[1], transform: `translate(${right ? '-100%' : '0'}, -100%)`, textAlign: right ? 'right' : 'left', color: ink, whiteSpace: 'nowrap', paddingBottom: 6, borderBottom: `3px solid ${c}`, textShadow}}>
            <div style={{fontWeight: 800, fontSize: 34, lineHeight: 1.1}}>{l.text}</div>
            {l.sub ? <div style={{fontWeight: 600, fontSize: 24, opacity: 0.85, marginTop: 4}}>{l.sub}</div> : null}
          </div>
        );
      })}
      {cards.map((c, i) => (
        <div key={i} style={{position: 'absolute', left: c.at[0], top: c.at[1], padding: '22px 30px', borderRadius: 20, background: panel, border: `2px solid ${border}`, color: ink, minWidth: 320}}>
          {c.title ? <div style={{fontSize: 26, fontWeight: 700, opacity: 0.7, marginBottom: 10}}>{c.title}</div> : null}
          {c.lines.map((ln, j) => (
            <div key={j} style={{fontSize: ln.big ? 64 : 36, fontWeight: 800, color: tone(ln.tone), lineHeight: 1.25, whiteSpace: 'nowrap'}}>{ln.text}</div>
          ))}
        </div>
      ))}
    </AbsoluteFill>
  );
};

const ChartSvg: React.FC<{chart: Chart; ink: string; panel: string; border: string}> = ({chart, ink, panel, border}) => {
  const [x, y, w, h] = chart.box;
  const px = (t: number) => x + 70 + t * (w - 110);
  const py = (v: number) => y + h - 70 - v * (h - 150);
  return (
    <g fontFamily={FONT.ui}>
      <rect x={x} y={y} width={w} height={h} rx={24} fill={panel} stroke={border} strokeWidth={2} />
      <line x1={px(0)} y1={py(0)} x2={px(1) + 20} y2={py(0)} stroke={ink} strokeWidth={3} />
      <line x1={px(0)} y1={py(0)} x2={px(0)} y2={py(1) - 20} stroke={ink} strokeWidth={3} />
      <text x={px(1) + 10} y={py(0) + 44} fill={ink} fontSize={30} fontWeight={700} textAnchor="end">{chart.x}</text>
      <text x={px(0) + 16} y={py(1) - 4} fill={ink} fontSize={30} fontWeight={700}>{chart.y}</text>
      {chart.marks?.map((m, i) => (
        <g key={i}>
          <line x1={px(m.at)} y1={py(0)} x2={px(m.at)} y2={py(1)} stroke={TONE[m.tone ?? 'main']} strokeWidth={2.5} strokeDasharray="8 8" />
          <text x={px(m.at) + 10} y={py(1) + 6} fill={TONE[m.tone ?? 'main']} fontSize={26} fontWeight={800}>{m.text}</text>
        </g>
      ))}
      {chart.series.map((s, i) => (
        <polyline key={i} points={s.points.map(([t, v]) => `${px(t)},${py(v)}`).join(' ')} fill="none" stroke={TONE[s.tone ?? 'signal']} strokeWidth={7} strokeLinejoin="round" strokeLinecap="round" />
      ))}
    </g>
  );
};
