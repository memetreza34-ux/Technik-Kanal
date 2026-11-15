import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {BRAND, FONT} from '../brand';
import type {Overlay, RaceSpec, Tone} from '../types';
import {raceClock} from '../race';
import {Bolt} from './Overlays';

// Nacht-Look: dunkle Bühne, oben Fortschritt + Kanalname + Überschrift,
// Datenkarte über den Untertiteln, unten ruhig (Platz für die App-Bedienelemente).

const cl = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};
const CARD: React.CSSProperties = {
  background: 'rgba(20,22,27,0.86)',
  border: '1.5px solid rgba(255,255,255,0.08)',
  borderRadius: 26,
  boxShadow: '0 20px 60px rgba(0,0,0,.45)',
};
const MUTED = '#9aa0aa';
const pill = (tone?: Tone): React.CSSProperties => ({
  background: tone === 'bad' ? BRAND.bad : BRAND.yellow,
  color: tone === 'bad' ? '#fff' : '#12161f',
});

const useSpring = (delay = 0, damping = 16) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  return spring({frame: f - delay, fps, config: {damping, mass: 0.55}});
};

/** Fortschrittsbalken in Segmenten (eins je Szene) + Kanalname. */
export const NightTop: React.FC<{segments: [number, number][]}> = ({segments}) => {
  const f = useCurrentFrame();
  return (
    <>
      <div style={{position: 'absolute', top: 92, left: 60, right: 60, display: 'flex', gap: 10}}>
        {segments.map(([a, b], i) => (
          <div key={i} style={{flex: 1, height: 7, borderRadius: 4, background: 'rgba(255,255,255,0.16)', overflow: 'hidden'}}>
            <div style={{height: '100%', width: `${interpolate(f, [a, b], [0, 100], cl)}%`, background: BRAND.yellow}} />
          </div>
        ))}
      </div>
      <div style={{position: 'absolute', top: 128, width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10, fontFamily: FONT.ui, fontWeight: 700, fontSize: 30, color: '#e8edf5'}}>
        <div style={{width: 30, height: 30, borderRadius: 8, background: BRAND.yellow, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <Bolt size={20} />
        </div>
        <span>
          Technik <span style={{color: BRAND.yellow}}>verstehen</span>
        </span>
      </div>
    </>
  );
};

/** Überschrift: Wörter blenden einzeln aus der Unschärfe ein; [Klammer] = gelb. */
export const NightHeading: React.FC<{text: string}> = ({text}) => {
  const f = useCurrentFrame();
  const words: {w: string; accent: boolean}[] = [];
  for (const part of text.split(/(\[[^\]]+\])/).filter(Boolean)) {
    const accent = part.startsWith('[');
    for (const w of part.replace(/[[\]]/g, '').split(/\s+/).filter(Boolean)) words.push({w, accent});
  }
  return (
    <div style={{position: 'absolute', top: 205, left: 50, right: 50, textAlign: 'center', fontFamily: FONT.ui, fontWeight: 800, fontSize: 66, lineHeight: 1.12, color: '#fff', textShadow: '0 4px 24px rgba(0,0,0,.6)'}}>
      {words.map(({w, accent}, i) => {
        const p = interpolate(f, [i * 3, i * 3 + 9], [0, 1], cl);
        return (
          <span key={i} style={{display: 'inline-block', marginRight: '0.26em', color: accent ? BRAND.yellow : '#fff', opacity: p, filter: `blur(${(1 - p) * 14}px)`, transform: `translateY(${(1 - p) * 14}px)`}}>
            {w}
          </span>
        );
      })}
    </div>
  );
};

const Chip: React.FC<{text: string; at: number}> = ({text, at}) => {
  const f = useCurrentFrame();
  const s = useSpring(at, 13);
  if (f < at) return null;
  return (
    <div style={{padding: '12px 22px', borderRadius: 16, background: 'rgba(255,255,255,0.09)', border: '1.5px solid rgba(255,255,255,0.10)', fontSize: 40, fontWeight: 800, color: '#fff', transform: `scale(${0.7 + 0.3 * s})`, opacity: s}}>
      {text}
    </div>
  );
};

/** Datenkarte: Chips nacheinander, oder Wert → Ergebnis-Pille. `at(word)` liefert den Frame (relativ zur Szene). */
export const FactsCard: React.FC<{o: Extract<Overlay, {type: 'facts'}>; at: (word?: string) => number}> = ({o, at}) => {
  const f = useCurrentFrame();
  const enter = useSpring(4, 18);
  const vAt = o.value ? at(o.value.word) : 0;
  const rAt = o.result ? at(o.result.word) : 0;
  const v = useSpring(vAt, 16);
  const r = useSpring(rAt, 11);
  return (
    <div style={{position: 'absolute', top: 1015, left: 70, right: 70, display: 'flex', justifyContent: 'center'}}>
      <div style={{...CARD, padding: '22px 30px 24px', fontFamily: FONT.ui, opacity: enter, transform: `translateY(${(1 - enter) * 40}px)`, maxWidth: 940}}>
        {o.label ? <div style={{fontSize: 27, fontWeight: 700, color: MUTED, marginBottom: 12}}>{o.label}</div> : null}
        <div style={{display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap'}}>
          {o.chips?.map((c, i) => <Chip key={i} text={c.text} at={at(c.word)} />)}
          {o.value && f >= vAt ? (
            <div style={{opacity: v, transform: `translateX(${(1 - v) * -20}px)`}}>
              <div style={{fontSize: 52, fontWeight: 800, color: '#fff', lineHeight: 1}}>{o.value.text}</div>
              {o.sub ? <div style={{fontSize: 27, fontWeight: 600, color: MUTED, marginTop: 8}}>{o.sub}</div> : null}
            </div>
          ) : null}
          {o.result && f >= rAt ? (
            <>
              <div style={{fontSize: 46, fontWeight: 700, color: MUTED, opacity: r}}>→</div>
              <div style={{...pill(o.result.tone), fontSize: 56, fontWeight: 800, padding: '8px 22px', borderRadius: 18, transform: `scale(${0.6 + 0.4 * r})`, boxShadow: '0 8px 30px rgba(255,210,63,.25)'}}>{o.result.text}</div>
            </>
          ) : null}
        </div>
        {o.source ? <div style={{fontSize: 22, fontWeight: 600, color: '#66738c', marginTop: 14}}>{o.source}</div> : null}
      </div>
    </div>
  );
};

/** Merkliste mit ✓ / ✗, Punkte erscheinen beim gesprochenen Wort. */
export const Checklist: React.FC<{o: Extract<Overlay, {type: 'checklist'}>; at: (word?: string) => number}> = ({o, at}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const enter = useSpring(2, 18);
  return (
    <div style={{position: 'absolute', top: 430, left: 90, right: 90}}>
      <div style={{...CARD, padding: '28px 34px', fontFamily: FONT.ui, opacity: enter, transform: `translateY(${(1 - enter) * 40}px)`, display: 'flex', flexDirection: 'column', gap: 22}}>
        {o.title ? <div style={{fontSize: 28, fontWeight: 700, color: MUTED}}>{o.title}</div> : null}
        {o.items.map((it, i) => {
          const a = at(it.word);
          const s = spring({frame: f - a, fps, config: {damping: 14, mass: 0.5}});
          return (
            <div key={i} style={{display: 'flex', alignItems: 'center', gap: 20, opacity: f < a ? 0.18 : 1}}>
              <div style={{width: 54, height: 54, borderRadius: 27, flex: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 34, fontWeight: 900, background: f < a ? 'rgba(255,255,255,.08)' : it.ok ? BRAND.good : BRAND.bad, color: '#0d1320', transform: `scale(${f < a ? 1 : 0.5 + 0.5 * s})`}}>
                {f < a ? '' : it.ok ? '✓' : '✕'}
              </div>
              <div style={{fontSize: 46, fontWeight: 800, color: '#fff', textDecoration: !it.ok && f >= a ? 'line-through' : undefined, textDecorationColor: BRAND.bad, textDecorationThickness: 5}}>{it.text}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/** Abspann: Szene weichgezeichnet, Logo, Name, Folgen-Knopf. */
export const NightEnd: React.FC<{line?: string}> = ({line}) => {
  const s = useSpring(6, 16);
  const b = useSpring(16, 12);
  return (
    <AbsoluteFill style={{backdropFilter: `blur(${s * 16}px)`, WebkitBackdropFilter: `blur(${s * 16}px)`, background: `rgba(10,11,13,${0.45 * s})`, alignItems: 'center', justifyContent: 'center'}}>
      <div style={{...CARD, padding: '54px 70px 48px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20, fontFamily: FONT.ui, opacity: s, transform: `scale(${0.9 + 0.1 * s})`, marginTop: -180}}>
        <div style={{width: 120, height: 120, borderRadius: 30, background: BRAND.yellow, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
          <Bolt size={80} />
        </div>
        <div style={{fontSize: 64, fontWeight: 800, color: '#fff'}}>
          Technik <span style={{color: BRAND.yellow}}>verstehen</span>
        </div>
        {line ? <div style={{fontSize: 34, fontWeight: 600, color: MUTED}}>{line}</div> : null}
        <div style={{marginTop: 10, padding: '16px 52px', borderRadius: 40, background: BRAND.yellow, color: '#12161f', fontSize: 40, fontWeight: 800, transform: `scale(${0.6 + 0.4 * b})`, opacity: b}}>Folgen</div>
      </div>
    </AbsoluteFill>
  );
};

/** Kurzer Abtauch ins Dunkle um jeden Schnitt zwischen Kapiteln. */
export const DipToDark: React.FC<{cuts: number[]}> = ({cuts}) => {
  const f = useCurrentFrame();
  const o = Math.max(0, ...cuts.map((c) => interpolate(f, [c - 5, c, c + 7], [0, 0.92, 0], cl)));
  return o > 0 ? <AbsoluteFill style={{background: '#0b0c0f', opacity: o}} /> : null;
};

/** Oben leicht, unten kräftig abdunkeln – die Bühne läuft ins Dunkle aus. */
export const NightShade: React.FC = () => (
  <AbsoluteFill
    style={{
      background:
        'linear-gradient(180deg, rgba(10,11,13,.75) 0%, rgba(10,11,13,0) 18%, rgba(10,11,13,0) 50%, rgba(10,11,13,.55) 64%, rgba(10,11,13,.92) 78%, #0b0c0f 100%), radial-gradient(ellipse at 50% 36%, rgba(0,0,0,0) 48%, rgba(0,0,0,.45) 100%)',
    }}
  />
);

export const NightSceneOverlay: React.FC<{overlay?: Overlay; heading?: string; at: (word?: string) => number}> = ({overlay, heading, at}) => (
  <>
    {heading ? <NightHeading text={heading} /> : null}
    {overlay?.type === 'facts' ? <FactsCard o={overlay} at={at} /> : null}
    {overlay?.type === 'checklist' ? <Checklist o={overlay} at={at} /> : null}
    {overlay?.type === 'end' ? <NightEnd line={overlay.line} /> : null}
  </>
);

const mmss = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

/** Zeitraffer-Rennen: drei Thermometer-Balken unter der Überschrift, Uhr läuft mit dem Sprechtext. */
export const NightRace: React.FC<{race: RaceSpec; keys: [number, number][]; show: number; hide: number}> = ({race, keys, show, hide}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  if (f < show - 4 || f > hide + 12) return null;
  const clock = raceClock(keys, (f / fps) * 1000);
  const enter = spring({frame: f - show + 4, fps, config: {damping: 18, mass: 0.6}});
  const exit = interpolate(f, [hide, hide + 10], [1, 0], cl);
  return (
    <div style={{position: 'absolute', top: 300, left: 110, right: 110, opacity: enter * exit, transform: `translateY(${(1 - enter) * -24}px)`}}>
      <div style={{...CARD, padding: '10px 22px 12px', fontFamily: FONT.ui, display: 'flex', flexDirection: 'column', gap: 4, borderRadius: 20}}>
        <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 21, fontWeight: 700, color: MUTED}}>
          <span>⏱ {race.title ?? 'Zeitraffer'} · bis {race.to} {race.unit}</span>
          <span style={{color: '#fff', fontVariantNumeric: 'tabular-nums'}}>{mmss(clock)}</span>
        </div>
        {race.lanes.map((l) => {
          const done = clock >= l.finish;
          const p = Math.min(1, clock / l.finish);
          const col = l.tone === 'good' ? BRAND.good : l.tone === 'bad' ? BRAND.bad : BRAND.yellow;
          return (
            <div key={l.label} style={{display: 'flex', alignItems: 'center', gap: 16}}>
              <div style={{width: 190, fontSize: 25, fontWeight: 800, color: '#fff'}}>{l.label}</div>
              <div style={{flex: 1, height: 12, borderRadius: 6, background: 'rgba(255,255,255,0.09)', overflow: 'hidden'}}>
                <div style={{width: `${p * 100}%`, height: '100%', borderRadius: 8, background: done ? col : `linear-gradient(90deg, #4fb6ff, ${BRAND.yellow})`}} />
              </div>
              <div style={{width: 104, textAlign: 'right', fontSize: 25, fontWeight: 800, color: done ? col : '#fff', fontVariantNumeric: 'tabular-nums'}}>
                {done ? `✓ ${mmss(l.finish)}` : mmss(clock)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

/** Röntgen-Moment: gelbes Etikett, wiederkehrend in jedem Video. */
export const XrayTag: React.FC<{at: number; dur: number}> = ({at, dur}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  if (f < at || f > at + dur + 10) return null;
  const s = spring({frame: f - at, fps, config: {damping: 13, mass: 0.5}});
  const o = interpolate(f, [at + dur, at + dur + 10], [1, 0], cl);
  return (
    <div style={{position: 'absolute', top: 935, width: '100%', display: 'flex', justifyContent: 'center', opacity: o}}>
      <div style={{display: 'flex', alignItems: 'center', gap: 12, padding: '12px 26px', borderRadius: 40, background: BRAND.yellow, color: '#12161f', fontFamily: FONT.ui, fontWeight: 800, fontSize: 36, letterSpacing: 1, transform: `scale(${0.6 + 0.4 * s})`, boxShadow: '0 0 40px rgba(255,210,63,.45)'}}>
        <Bolt size={26} /> BLICK INS INNERE
      </div>
    </div>
  );
};
