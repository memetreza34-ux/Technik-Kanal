import React, {useLayoutEffect, useRef} from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {FONT} from '../short/brand';

// Fester Rahmen für alle Shorts – Zonen und Größen siehe docs/RAHMEN.md.

// Alles sitzt mittig: Überschrift → Bühne → Untertitel direkt darunter → Karte.
export const Z = {
  // Sicherer Bereich für TikTok/Reels/Shorts: ca. 900×1400 mittig; oben ~200 px, unten ~340 px, rechts ~120 px frei.
  heading: 290, // kleine Zwischenüberschrift (Kapitel)
  stage: [390, 1240] as const,
  caption: 1420, // unteres Drittel, über den App-Knöpfen (Wunsch Arman 15.11.)
  card: 1400, // nur noch für alte Videos
  rest: 1530,
  left: 80,
  right: 120,
};
export const SIZE = {label: 28, value: 52, heading: 50, caption: 58};
const CAPTION_W = 860;
export const YELLOW = '#FFD23F';

export type Theme = 'dark' | 'light';
export const THEME = {
  dark: {bg: '#0b0c0f', text: '#ffffff', muted: '#9aa0aa', card: 'rgba(20,22,27,0.88)', cardBorder: 'rgba(255,255,255,0.08)', track: 'rgba(255,255,255,0.16)', shade: '11,12,15'},
  light: {bg: '#FFFFFF', text: '#1F2328', muted: '#6b7079', card: '#ffffff', cardBorder: 'rgba(31,35,40,0.12)', track: 'rgba(31,35,40,0.14)', shade: '255,255,255'},
};

const cl = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

/** Überschrift: eine Zeile, [Klammer] = gelb hinterlegt, Wörter blenden aus der Unschärfe ein. */
export const Heading: React.FC<{text: string; theme: Theme; from?: number}> = ({text, theme, from = 0}) => {
  const f = useCurrentFrame() - from;
  const c = THEME[theme];
  if (f < 0) return null;
  const words: {w: string; accent: boolean}[] = [];
  for (const part of text.split(/(\[[^\]]+\])/).filter(Boolean)) {
    const accent = part.startsWith('[');
    // markierter Teil bleibt ein Block (ein gelbes Feld), Rest wortweise
    if (accent) words.push({w: part.slice(1, -1), accent});
    else for (const w of part.split(/\s+/).filter(Boolean)) words.push({w, accent});
  }
  return (
    <div style={{position: 'absolute', top: Z.heading, left: Z.left, right: Z.left, height: 80, display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', fontFamily: FONT.ui, fontWeight: 900, fontSize: SIZE.heading, color: c.text, textShadow: theme === 'dark' ? '0 2px 10px rgba(0,0,0,.95), 0 0 24px rgba(0,0,0,.8)' : 'none'}}>
      {words.map(({w, accent}, i) => {
        const p = interpolate(f, [i * 3, i * 3 + 9], [0, 1], cl);
        const yel: React.CSSProperties = accent ? (theme === 'dark' ? {color: YELLOW} : {background: YELLOW, padding: '0 10px', borderRadius: 10}) : {};
        return (
          <span key={i} style={{display: 'inline-block', whiteSpace: 'pre', margin: '0 0.13em', opacity: p, filter: `blur(${(1 - p) * 12}px)`, transform: `translateY(${(1 - p) * 12}px)`, ...yel}}>
            {w}
          </span>
        );
      })}
    </div>
  );
};

const useInOut = (show: number, hide: number) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: f - show, fps, config: {damping: 16, mass: 0.55}});
  const o = interpolate(f, [hide - 6, hide], [1, 0], cl);
  return {visible: f >= show && f < hide, s, o};
};

/** Karten-Zone: genau eine Karte. */
export const CardSlot: React.FC<{theme: Theme; show: number; hide: number; border?: string; children: React.ReactNode}> = ({theme, show, hide, border, children}) => {
  const {visible, s, o} = useInOut(show, hide);
  const c = THEME[theme];
  if (!visible) return null;
  return (
    <div style={{position: 'absolute', top: Z.card, left: Z.left, right: Z.left, display: 'flex', justifyContent: 'center', opacity: s * o}}>
      <div style={{background: c.card, border: `2px solid ${border ?? c.cardBorder}`, borderRadius: 26, padding: '22px 30px', fontFamily: FONT.ui, color: c.text, boxShadow: theme === 'light' ? '0 16px 44px rgba(60,40,20,.16)' : '0 18px 50px rgba(0,0,0,.4)', transform: `translateY(${(1 - s) * 26}px)`, maxWidth: 1080 - 2 * Z.left}}>
        {children}
      </div>
    </div>
  );
};
export const Label: React.FC<{theme: Theme; children: React.ReactNode}> = ({theme, children}) => (
  <div style={{fontSize: SIZE.label, fontWeight: 700, color: THEME[theme].muted, marginBottom: 8}}>{children}</div>
);
export const Pill: React.FC<{color?: string; text?: string; children: React.ReactNode}> = ({color = YELLOW, text = '#12161f', children}) => (
  <span style={{background: color, color: text, fontSize: SIZE.value, fontWeight: 900, padding: '4px 18px', borderRadius: 16, display: 'inline-block'}}>{children}</span>
);

/** Untertitel-Zone: immer genau eine Zeile (zu lange Zeilen werden kleiner skaliert). Max. 860 px breit. */
export const CaptionSlot: React.FC<{theme: Theme; show: number; hide: number; children: React.ReactNode}> = ({theme, show, hide, children}) => {
  const {visible, s, o} = useInOut(show, hide);
  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.zoom = '1';
    if (el.scrollWidth > CAPTION_W) el.style.zoom = String(CAPTION_W / el.scrollWidth);
  });
  if (!visible) return null;
  return (
    <div style={{position: 'absolute', top: Z.caption, left: (1080 - CAPTION_W) / 2, width: CAPTION_W, height: 90, display: 'flex', justifyContent: 'center', alignItems: 'center', opacity: s * o, transform: `scale(${0.92 + 0.08 * s})`}}>
      <div ref={ref} style={{whiteSpace: 'nowrap', fontFamily: FONT.ui, fontWeight: 800, fontSize: SIZE.caption, color: THEME[theme].text, textShadow: theme === 'dark' ? '0 3px 14px rgba(0,0,0,.7)' : 'none'}}>
        {children}
      </div>
    </div>
  );
};
export const Mark: React.FC<{theme: Theme; children: React.ReactNode}> = ({theme, children}) => (
  <span style={theme === 'dark' ? {color: YELLOW} : {background: YELLOW, padding: '0 8px', borderRadius: 8}}>{children}</span>
);

/** Abdunkeln/Aufhellen: oben leicht (für die Überschrift), unten Ruhezone deckend. */
export const Shade: React.FC<{theme: Theme}> = ({theme}) => {
  const s = THEME[theme].shade;
  return <AbsoluteFill style={{background: `linear-gradient(180deg, rgba(${s},.9) 0%, rgba(${s},0) 20%, rgba(${s},0) 55%, rgba(${s},.75) 68%, rgba(${s},.97) 76%, rgb(${s}) 100%)`}} />;
};

/** Hilfsbild: zeigt alle Zonen (für die Vorlage). */
export const ZoneGuide: React.FC = () => {
  const box = (top: number, h: number, label: string, color: string) => (
    <div style={{position: 'absolute', top, height: h, left: Z.left, right: Z.left, border: `3px dashed ${color}`, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color, fontFamily: FONT.ui, fontWeight: 800, fontSize: 34, background: color + '14'}}>
      {label}
    </div>
  );
  return (
    <AbsoluteFill>
      {box(30, 230, 'frei · App oben', '#FF5C7A')}
      {box(Z.heading, 80, 'Zwischenüberschrift (klein)', YELLOW)}
      {box(Z.stage[0], Z.stage[1] - Z.stage[0], 'Bühne · Objekt', '#2DE1C2')}
      {box(Z.caption, 90, 'Untertitel · 1 Zeile', '#ffffff')}
      {box(Z.rest, 1920 - Z.rest - 40, 'Ruhezone · App-Bedienung', '#FF5C7A')}
      <div style={{position: 'absolute', top: 900, right: 0, width: Z.right, height: 800, background: 'rgba(255,92,122,.18)', borderLeft: '3px dashed #FF5C7A'}} />
    </AbsoluteFill>
  );
};

/** Markierung am Objekt: Punkt + Linie + kurzes Etikett. (x,y) = Bildpunkt des Bauteils. */
export const Marker: React.FC<{theme: Theme; x: number; y: number; show: number; hide: number; side?: 'left' | 'right'; len?: number; children: React.ReactNode}> = ({theme, x, y, show, hide, side = 'right', len = 150, children}) => {
  const {visible, s, o} = useInOut(show, hide);
  if (!visible) return null;
  const c = THEME[theme];
  const dir = side === 'right' ? 1 : -1;
  const ex = Math.max(Z.left + 20, Math.min(1080 - Z.right - 20, x + dir * len * s));
  const ey = y - 70 * s;
  return (
    <div style={{position: 'absolute', inset: 0, opacity: o}}>
      <svg width={1080} height={1920} style={{position: 'absolute', inset: 0}}>
        <polyline points={`${x},${y} ${x + dir * 30 * s},${ey} ${ex},${ey}`} fill="none" stroke={c.text} strokeWidth={3} />
        <circle cx={x} cy={y} r={9 * s} fill={YELLOW} stroke={c.text} strokeWidth={3} />
      </svg>
      <div style={{position: 'absolute', top: ey - 26, left: side === 'right' ? ex + 8 : undefined, right: side === 'left' ? 1080 - ex + 8 : undefined, height: 52, display: 'flex', alignItems: 'center', padding: '0 16px', borderRadius: 14, background: c.card, border: `2px solid ${c.text}`, fontFamily: FONT.ui, fontWeight: 800, fontSize: 30, color: c.text, opacity: s, whiteSpace: 'nowrap'}}>
        {children}
      </div>
    </div>
  );
};
