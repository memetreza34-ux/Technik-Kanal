import React from 'react';
import {AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {BRAND, FONT, de} from '../brand';
import type {Overlay, Row, Tone} from '../types';

// Zahlen-Ebene über der 3D-Szene. Alle Teile werden aus short.json gesteuert.

const cl = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};
const toneColor = (t?: Tone) => (t === 'good' ? BRAND.good : t === 'bad' ? BRAND.bad : BRAND.yellow);

const useEnter = (delay = 0) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return spring({frame: f - delay, fps, config: {damping: 16, mass: 0.6}});
};

/** Zählt von 0 auf den Zielwert hoch. */
const useCount = (target: number, delay: number, dur = 26) => {
  const f = useCurrentFrame();
  return interpolate(f, [delay, delay + dur], [0, target], {...cl, easing: Easing.out(Easing.cubic)});
};

const fmt = (row: Row, v: number) => (row.format === 'mmss' ? `${Math.floor(v / 60)}:${String(Math.floor(v % 60)).padStart(2, '0')}` : de(v, row.decimals ?? 0));

export const Bolt: React.FC<{size: number; color?: string}> = ({size, color = BRAND.ink}) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path d="M13.5 2 4 13.5h6.5L9 22l10-12.5h-6.6L13.5 2Z" fill={color} />
  </svg>
);

/** Kleiner Kanalname oben – dauerhaft sichtbar. */
export const BrandBar: React.FC = () => (
  <div style={{position: 'absolute', top: 64, width: '100%', display: 'flex', justifyContent: 'center'}}>
    <div style={{display: 'flex', alignItems: 'center', gap: 12, padding: '8px 18px 8px 10px', borderRadius: 40, background: 'rgba(11,15,20,0.55)', border: `1px solid ${BRAND.line}`}}>
      <div style={{width: 38, height: 38, borderRadius: 19, background: BRAND.yellow, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <Bolt size={24} />
      </div>
      <span style={{fontFamily: FONT.ui, fontWeight: 800, fontSize: 26, letterSpacing: 4, color: BRAND.text}}>{BRAND.name}</span>
    </div>
  </div>
);

/** Kapitel als gelbes Beschriftungsband. */
export const ChapterTag: React.FC<{text: string}> = ({text}) => {
  const p = useEnter(2);
  return (
    <div style={{position: 'absolute', top: 190, width: '100%', display: 'flex', justifyContent: 'center'}}>
      <div style={{
        transform: `rotate(-1.5deg) translateX(${(1 - p) * -80}px)`, opacity: p,
        background: BRAND.yellow, color: BRAND.ink, fontFamily: FONT.display, fontSize: 46, padding: '10px 26px 8px',
        textTransform: 'uppercase', letterSpacing: 1, boxShadow: '0 10px 30px rgba(0,0,0,.35)',
        clipPath: `inset(0 ${(1 - p) * 100}% 0 0)`,
      }}>
        {text}
      </div>
    </div>
  );
};

/** Eröffnungsfrage: weiße Zeile + gelb markierte Frage + Kandidaten. */
export const TitleCard: React.FC<{line1: string; line2: string; options?: string[]}> = ({line1, line2, options = []}) => {
  const a = useEnter(0), b = useEnter(8);
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <div style={{position: 'absolute', top: 190, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18}}>
      <div style={{fontFamily: FONT.display, fontSize: 76, color: BRAND.text, opacity: a, transform: `translateY(${(1 - a) * 30}px)`, textShadow: '0 6px 24px rgba(0,0,0,.6)'}}>{line1}</div>
      <div style={{fontFamily: FONT.display, fontSize: 72, color: BRAND.ink, background: BRAND.yellow, padding: '6px 22px 2px', transform: `rotate(-1.5deg) scale(${0.85 + 0.15 * b})`, opacity: b, maxWidth: 940, textAlign: 'center', lineHeight: 1.15}}>{line2}</div>
      <div style={{display: 'flex', gap: 14, marginTop: 14}}>
        {options.map((o, i) => {
          const p = spring({frame: f - 18 - i * 5, fps, config: {damping: 14}});
          return (
            <div key={o} style={{opacity: p, transform: `translateY(${(1 - p) * 20}px)`, fontFamily: FONT.ui, fontWeight: 800, fontSize: 32, color: BRAND.text, background: BRAND.panel, border: `1px solid ${BRAND.line}`, borderRadius: 30, padding: '10px 22px'}}>
              {o}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const Panel: React.FC<{children: React.ReactNode; title?: string; top?: number}> = ({children, title, top = 1010}) => {
  const p = useEnter(6);
  return (
    <div style={{position: 'absolute', top, width: '100%', display: 'flex', justifyContent: 'center'}}>
      <div style={{
        width: 880, background: `linear-gradient(180deg, rgba(20,26,33,.92), ${BRAND.panel})`, border: `2px solid ${BRAND.line}`, borderRadius: 24,
        padding: '22px 34px 24px', boxShadow: '0 20px 60px rgba(0,0,0,.45)', opacity: p, transform: `translateY(${(1 - p) * 40}px) scale(${0.96 + 0.04 * p})`,
      }}>
        {title ? (
          <div style={{display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10}}>
            <div style={{width: 12, height: 12, borderRadius: 6, background: BRAND.yellow, boxShadow: `0 0 12px ${BRAND.yellow}`}} />
            <div style={{fontFamily: FONT.ui, fontWeight: 700, fontSize: 27, color: BRAND.muted, letterSpacing: 1}}>{title}</div>
          </div>
        ) : null}
        {children}
      </div>
    </div>
  );
};

const MeterRow: React.FC<{row: Row; i: number}> = ({row, i}) => {
  const v = useCount(row.value, 12 + i * 6);
  const c = toneColor(row.tone);
  return (
    <div style={{display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', borderTop: i ? `1px solid ${BRAND.line}` : 'none', padding: '8px 0 4px'}}>
      <div style={{fontFamily: FONT.ui, fontWeight: 700, fontSize: 36, color: BRAND.text}}>{row.label}</div>
      <div style={{fontFamily: FONT.mono, fontSize: 84, color: c, textShadow: `0 0 22px ${c}66`, lineHeight: 1}}>
        {fmt(row, v)}
        <span style={{fontSize: 38, marginLeft: 10, opacity: 0.85}}>{row.unit}</span>
      </div>
    </div>
  );
};

/** Messgeräte-Karte mit hochzählenden Werten. */
export const MeterCard: React.FC<{title?: string; rows: Row[]; note?: string}> = ({title, rows, note}) => (
  <Panel title={title}>
    {rows.map((r, i) => (
      <MeterRow key={r.label} row={r} i={i} />
    ))}
    {note ? <div style={{fontFamily: FONT.ui, fontWeight: 600, fontSize: 24, color: BRAND.muted, marginTop: 10}}>{note}</div> : null}
  </Panel>
);

/** Balkenvergleich, Balken wachsen nacheinander. */
export const BarsCard: React.FC<{title?: string; rows: Row[]; note?: string; highlight?: {text: string; sub?: string}}> = ({title, rows, note, highlight}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const max = Math.max(...rows.map((r) => r.value));
  const h = spring({frame: f - (16 + rows.length * 7 + 10), fps, config: {damping: 11, mass: 0.6}});
  return (
    <Panel title={title} top={860}>
      {rows.map((r, i) => {
        const grow = interpolate(f, [14 + i * 7, 40 + i * 7], [0, r.value / max], {...cl, easing: Easing.out(Easing.cubic)});
        const c = toneColor(r.tone);
        return (
          <div key={r.label} style={{display: 'flex', alignItems: 'center', gap: 18, padding: '9px 0'}}>
            <div style={{width: 250, fontFamily: FONT.ui, fontWeight: 700, fontSize: 32, color: BRAND.text, lineHeight: 1.05}}>
              {r.label}
              {r.sub ? <div style={{fontSize: 22, color: BRAND.muted, fontWeight: 600}}>{r.sub}</div> : null}
            </div>
            <div style={{flex: 1, height: 34, background: 'rgba(255,255,255,.06)', borderRadius: 6, overflow: 'hidden'}}>
              <div style={{width: `${grow * 100}%`, height: '100%', background: `repeating-linear-gradient(90deg, ${c} 0 22px, ${c}cc 22px 26px)`, boxShadow: `0 0 18px ${c}55`}} />
            </div>
            <div style={{width: 190, textAlign: 'right', fontFamily: FONT.mono, fontSize: 52, color: c}}>
              {fmt(r, grow * max)}
              <span style={{fontSize: 26, marginLeft: 6}}>{r.unit}</span>
            </div>
          </div>
        );
      })}
      {highlight ? (
        <div style={{marginTop: 14, display: 'flex', alignItems: 'center', gap: 18, opacity: h, transform: `scale(${0.9 + 0.1 * h})`, transformOrigin: 'left center'}}>
          <div style={{fontFamily: FONT.display, fontSize: 56, color: BRAND.ink, background: BRAND.yellow, padding: '4px 18px 0', transform: 'rotate(-1.5deg)', whiteSpace: 'nowrap'}}>{highlight.text}</div>
          {highlight.sub ? <div style={{fontFamily: FONT.ui, fontWeight: 700, fontSize: 27, color: BRAND.text, lineHeight: 1.15}}>{highlight.sub}</div> : null}
        </div>
      ) : null}
      {note ? <div style={{fontFamily: FONT.ui, fontWeight: 600, fontSize: 22, color: BRAND.muted, marginTop: 14}}>{note}</div> : null}
    </Panel>
  );
};

/** Hinweis-Chip (Warnung, Info, Plus). */
export const Chip: React.FC<{icon?: 'warn' | 'info' | 'plus'; text: string; top?: number; delay?: number}> = ({icon = 'info', text, top = 900, delay = 30}) => {
  const p = useEnter(delay);
  const c = icon === 'warn' ? BRAND.bad : icon === 'plus' ? BRAND.good : BRAND.yellow;
  return (
    <div style={{position: 'absolute', top, width: '100%', display: 'flex', justifyContent: 'center'}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 14, padding: '12px 24px', borderRadius: 40, background: BRAND.panel, border: `2px solid ${c}`, opacity: p, transform: `scale(${0.8 + 0.2 * p})`}}>
        <div style={{width: 34, height: 34, borderRadius: 17, background: c, color: BRAND.ink, fontFamily: FONT.display, fontSize: 26, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          {icon === 'warn' ? '!' : icon === 'plus' ? '+' : 'i'}
        </div>
        <div style={{fontFamily: FONT.ui, fontWeight: 800, fontSize: 34, color: BRAND.text}}>{text}</div>
      </div>
    </div>
  );
};

/** Abspann mit Logo und Folgen-Knopf. */
export const EndCard: React.FC<{line?: string}> = ({line}) => {
  const p = useEnter(4);
  const btn = useEnter(14);
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: `rgba(8,11,15,${0.55 * p})`, alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 26, paddingBottom: 260}}>
      <div style={{width: 150, height: 150, borderRadius: 75, background: BRAND.yellow, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${p}) rotate(${(1 - p) * -40}deg)`, boxShadow: `0 0 60px ${BRAND.yellow}55`}}>
        <Bolt size={96} />
      </div>
      <div style={{fontFamily: FONT.display, fontSize: 76, color: BRAND.text, opacity: p, letterSpacing: 2}}>{BRAND.name}</div>
      {line ? <div style={{fontFamily: FONT.ui, fontWeight: 700, fontSize: 34, color: BRAND.muted, opacity: p}}>{line}</div> : null}
      <div style={{marginTop: 10, fontFamily: FONT.display, fontSize: 44, color: BRAND.ink, background: BRAND.yellow, padding: '12px 46px 8px', borderRadius: 50, transform: `scale(${btn * (1 + 0.03 * Math.sin(f / 5))})`}}>
        FOLGEN
      </div>
    </AbsoluteFill>
  );
};

/** Abdunkelung oben/unten, damit Schrift immer lesbar ist. */
export const Vignette: React.FC = () => (
  <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(5,7,10,.62) 0%, rgba(5,7,10,0) 20%, rgba(5,7,10,0) 46%, rgba(5,7,10,.55) 72%, rgba(5,7,10,.75) 100%)'}} />
);

/** Wählt die passende Ebene für eine Szene. */
export const SceneOverlay: React.FC<{overlay?: Overlay; chapter?: string}> = ({overlay, chapter}) => (
  <AbsoluteFill>
    {chapter && overlay?.type !== 'title' && overlay?.type !== 'end' ? <ChapterTag text={chapter} /> : null}
    {overlay?.type === 'title' ? <TitleCard line1={overlay.line1} line2={overlay.line2} options={overlay.options} /> : null}
    {overlay?.type === 'meter' ? <MeterCard title={overlay.title} rows={overlay.rows} note={overlay.note} /> : null}
    {overlay?.type === 'bars' ? <BarsCard title={overlay.title} rows={overlay.rows} note={overlay.note} highlight={overlay.highlight} /> : null}
    {overlay?.type === 'end' ? <EndCard line={overlay.line} /> : null}
    {overlay && 'chip' in overlay && overlay.chip ? <Chip {...overlay.chip} /> : null}
  </AbsoluteFill>
);
