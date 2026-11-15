import React from 'react';
import {AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {BRAND, FONT, de} from '../brand';
import type {Overlay, Row, ScoreboardSpec, Tone} from '../types';
import {Bolt} from './Overlays';

// Ruhiger Look: Milchglas-Karten, fette Sans-Schrift, Akzentfarbe Gelb, wenig gleichzeitige Elemente.

const cl = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};
const toneColor = (t?: Tone) => (t === 'good' ? BRAND.good : t === 'bad' ? BRAND.bad : BRAND.yellow);
const SHADOW = '0 3px 14px rgba(0,0,0,.65), 0 0 2px rgba(0,0,0,.8)';
const glass: React.CSSProperties = {
  background: 'rgba(16,20,26,0.58)',
  backdropFilter: 'blur(18px) saturate(1.2)',
  WebkitBackdropFilter: 'blur(18px) saturate(1.2)',
  border: '1.5px solid rgba(255,255,255,0.14)',
  borderRadius: 30,
  boxShadow: '0 18px 50px rgba(0,0,0,.35)',
};

const useIn = (delay = 0, damping = 18) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return spring({frame: f - delay, fps, config: {damping, mass: 0.6}});
};

/** Schreibmaschinen-Effekt: zeigt Zeichen nach und nach. */
const useTyped = (text: string, delay = 0, cps = 38) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const n = Math.max(0, Math.floor(((f - delay) / fps) * cps));
  return text.slice(0, n);
};

/** Kanalname oben, klein. */
export const CleanBrand: React.FC = () => (
  <div style={{position: 'absolute', top: 70, width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10}}>
    <div style={{width: 30, height: 30, borderRadius: 8, background: BRAND.yellow, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <Bolt size={20} />
    </div>
    <span style={{fontFamily: FONT.ui, fontWeight: 800, fontSize: 28, color: 'rgba(255,255,255,.92)', textShadow: SHADOW}}>
      Technik <span style={{color: BRAND.yellow}}>verstehen</span>
    </span>
  </div>
);

/** Frage zu Beginn: weiße Zeile + gelbe Zeile, getippt. */
export const CleanTitle: React.FC<{line1: string; line2: string}> = ({line1, line2}) => {
  const a = useTyped(line1, 0);
  const b = useTyped(line2, Math.round((line1.length / 38) * 30) + 4);
  return (
    <div style={{position: 'absolute', top: 180, left: 40, right: 40, textAlign: 'center', fontFamily: FONT.ui, fontWeight: 800, fontSize: 64, lineHeight: 1.15, textShadow: SHADOW}}>
      <div style={{color: '#fff', minHeight: 84}}>{a}</div>
      <div style={{color: BRAND.yellow, minHeight: 84}}>{b}</div>
    </div>
  );
};

/** Kapitel: „1 · Wasserkocher“ als ruhiger weißer Text. */
export const CleanChapter: React.FC<{text: string}> = ({text}) => {
  const [num, ...rest] = text.split('·');
  const label = rest.length ? rest.join('·').trim() : text;
  const typed = useTyped(label, 3, 34);
  const p = useIn(0);
  return (
    <div style={{position: 'absolute', top: 190, width: '100%', textAlign: 'center', fontFamily: FONT.ui, fontWeight: 800, fontSize: 68, color: '#fff', textShadow: SHADOW, opacity: p}}>
      {rest.length ? <span style={{color: BRAND.yellow}}>{num.trim()} · </span> : null}
      {typed}
    </div>
  );
};

/** Vergleichskarte, die sich Kapitel für Kapitel füllt. */
export const Scoreboard: React.FC<{spec: ScoreboardSpec; reveal: number[]; active: number; note?: {text: string; tone?: Tone; frame: number}; showFrame: number; hideFrame: number}> = ({spec, reveal, active, note, showFrame, hideFrame}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  if (f < showFrame || f > hideFrame) return null;
  const p = spring({frame: f - showFrame - 4, fps, config: {damping: 18, mass: 0.6}});
  const out = interpolate(f, [hideFrame - 8, hideFrame], [1, 0], cl);
  const n = spring({frame: f - (note?.frame ?? 0), fps, config: {damping: 16}});
  return (
    <div style={{position: 'absolute', top: 1000, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, opacity: p * out, transform: `translateY(${(1 - p) * 30}px)`}}>
      <div style={{...glass, width: 900, padding: '20px 18px 22px'}}>
        <div style={{textAlign: 'center', fontFamily: FONT.ui, fontWeight: 700, fontSize: 27, color: BRAND.muted, marginBottom: 10}}>{spec.title}</div>
        <div style={{display: 'flex'}}>
          {spec.columns.map((c, i) => {
            const shown = f >= reveal[i];
            const v = interpolate(f, [reveal[i], reveal[i] + 24], [0, c.value], {...cl, easing: Easing.out(Easing.cubic)});
            const isActive = i === active;
            return (
              <div key={c.label} style={{flex: 1, textAlign: 'center', padding: '8px 6px 6px', borderLeft: i ? '1.5px solid rgba(255,255,255,.12)' : 'none', background: isActive ? `${c.color}1c` : 'transparent', borderRadius: 18}}>
                <div style={{fontFamily: FONT.ui, fontWeight: 800, fontSize: 30, color: isActive ? '#fff' : 'rgba(255,255,255,.8)'}}>{c.label}</div>
                <div style={{fontFamily: FONT.ui, fontWeight: 800, fontSize: 72, lineHeight: 1.1, color: shown ? c.color : 'rgba(255,255,255,.28)', fontVariantNumeric: 'tabular-nums'}}>
                  {shown ? de(v, c.decimals) : '–'}
                  <span style={{fontSize: 34, marginLeft: 6}}>{c.unit}</span>
                </div>
                <div style={{fontFamily: FONT.ui, fontWeight: 700, fontSize: 24, color: BRAND.muted, opacity: shown ? 1 : 0}}>{c.sub ?? ''}</div>
              </div>
            );
          })}
        </div>
      </div>
      {note ? (
        <div style={{...glass, borderRadius: 40, padding: '12px 26px', fontFamily: FONT.ui, fontWeight: 800, fontSize: 31, color: note.tone ? toneColor(note.tone) : '#fff', opacity: n, transform: `scale(${0.85 + 0.15 * n})`}}>{note.text}</div>
      ) : null}
    </div>
  );
};

/** Ergebnis als ruhiger Balkenvergleich. */
export const CleanBars: React.FC<{title?: string; rows: Row[]; note?: string; highlight?: {text: string; sub?: string}}> = ({title, rows, note, highlight}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = useIn(4);
  const max = Math.max(...rows.map((r) => r.value));
  const h = spring({frame: f - (14 + rows.length * 6 + 12), fps, config: {damping: 12, mass: 0.6}});
  return (
    <div style={{position: 'absolute', top: 860, width: '100%', display: 'flex', justifyContent: 'center', opacity: p, transform: `translateY(${(1 - p) * 30}px)`}}>
      <div style={{...glass, width: 900, padding: '22px 32px 24px'}}>
        {title ? <div style={{textAlign: 'center', fontFamily: FONT.ui, fontWeight: 700, fontSize: 27, color: BRAND.muted, marginBottom: 8}}>{title}</div> : null}
        {rows.map((r, i) => {
          const grow = interpolate(f, [12 + i * 6, 36 + i * 6], [0, r.value / max], {...cl, easing: Easing.out(Easing.cubic)});
          const c = toneColor(r.tone);
          return (
            <div key={r.label} style={{display: 'flex', alignItems: 'center', gap: 16, padding: '7px 0'}}>
              <div style={{width: 240, fontFamily: FONT.ui, fontWeight: 800, fontSize: 31, color: '#fff'}}>{r.label}</div>
              <div style={{flex: 1, height: 22, borderRadius: 11, background: 'rgba(255,255,255,.08)'}}>
                <div style={{width: `${grow * 100}%`, height: '100%', borderRadius: 11, background: c}} />
              </div>
              <div style={{width: 150, textAlign: 'right', fontFamily: FONT.ui, fontWeight: 800, fontSize: 42, color: c, fontVariantNumeric: 'tabular-nums'}}>
                {de(grow * max, r.decimals ?? 0)}
                <span style={{fontSize: 24, marginLeft: 4}}>{r.unit}</span>
              </div>
            </div>
          );
        })}
        {highlight ? (
          <div style={{marginTop: 14, textAlign: 'center', opacity: h, transform: `scale(${0.88 + 0.12 * h})`}}>
            <div style={{fontFamily: FONT.ui, fontWeight: 800, fontSize: 62, color: BRAND.yellow}}>{highlight.text}</div>
            {highlight.sub ? <div style={{fontFamily: FONT.ui, fontWeight: 700, fontSize: 27, color: '#fff'}}>{highlight.sub}</div> : null}
          </div>
        ) : null}
        {note ? <div style={{textAlign: 'center', fontFamily: FONT.ui, fontWeight: 600, fontSize: 22, color: BRAND.muted, marginTop: 12}}>{note}</div> : null}
      </div>
    </div>
  );
};

/** Hinweis als Milchglas-Pille. */
export const CleanChip: React.FC<{text: string; icon?: 'warn' | 'info' | 'plus'; top?: number; delay?: number}> = ({text, icon = 'info', top = 1080, delay = 20}) => {
  const p = useIn(delay, 14);
  const c = icon === 'warn' ? BRAND.bad : icon === 'plus' ? BRAND.good : BRAND.yellow;
  return (
    <div style={{position: 'absolute', top, width: '100%', display: 'flex', justifyContent: 'center', opacity: p, transform: `scale(${0.85 + 0.15 * p})`}}>
      <div style={{...glass, borderRadius: 40, padding: '14px 28px', display: 'flex', alignItems: 'center', gap: 14}}>
        <div style={{width: 14, height: 14, borderRadius: 7, background: c, boxShadow: `0 0 12px ${c}`}} />
        <div style={{fontFamily: FONT.ui, fontWeight: 800, fontSize: 34, color: '#fff'}}>{text}</div>
      </div>
    </div>
  );
};

/** Abspann: Logo, Name, Folgen – über weichgezeichneter Szene. */
export const CleanEnd: React.FC<{line?: string; delay?: number}> = ({line, delay = 30}) => {
  const f = useCurrentFrame();
  const p = useIn(delay);
  const b = useIn(delay + 10, 12);
  if (f < delay - 2) return null;
  return (
    <AbsoluteFill style={{backdropFilter: `blur(${10 * p}px)`, WebkitBackdropFilter: `blur(${10 * p}px)`, background: `rgba(8,11,15,${0.45 * p})`, alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 22, paddingBottom: 220}}>
      <div style={{width: 120, height: 120, borderRadius: 30, border: `4px solid ${BRAND.yellow}`, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${p})`}}>
        <Bolt size={74} color={BRAND.yellow} />
      </div>
      <div style={{fontFamily: FONT.ui, fontWeight: 800, fontSize: 80, color: '#fff', opacity: p, textShadow: SHADOW}}>
        Technik <span style={{color: BRAND.yellow}}>verstehen</span>
      </div>
      {line ? <div style={{fontFamily: FONT.ui, fontWeight: 700, fontSize: 32, color: 'rgba(255,255,255,.8)', opacity: p}}>{line}</div> : null}
      <div style={{marginTop: 8, fontFamily: FONT.ui, fontWeight: 800, fontSize: 40, color: BRAND.ink, background: BRAND.yellow, padding: '14px 48px', borderRadius: 50, transform: `scale(${b})`}}>Folgen</div>
    </AbsoluteFill>
  );
};

/** Szenen-Ebene im ruhigen Look. */
export const CleanSceneOverlay: React.FC<{overlay?: Overlay; chapter?: string}> = ({overlay, chapter}) => (
  <AbsoluteFill>
    {chapter && overlay?.type !== 'title' && overlay?.type !== 'end' ? <CleanChapter text={chapter} /> : null}
    {overlay?.type === 'title' ? <CleanTitle line1={overlay.line1} line2={overlay.line2} /> : null}
    {overlay?.type === 'bars' ? <CleanBars title={overlay.title} rows={overlay.rows} note={overlay.note} highlight={overlay.highlight} /> : null}
    {overlay?.type === 'chip' ? <CleanChip {...overlay.chip} /> : null}
    {overlay?.type === 'end' ? <CleanEnd line={overlay.line} /> : null}
  </AbsoluteFill>
);
