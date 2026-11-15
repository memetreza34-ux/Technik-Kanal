import React from 'react';
import {interpolate, interpolateColors, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {BRAND, FONT} from '../brand';
import {raceClock, raceMsAt} from '../race';
import type {RaceSpec, Tone} from '../types';

const cl = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};
const toneColor = (t?: Tone) => (t === 'good' ? BRAND.good : t === 'bad' ? BRAND.bad : BRAND.yellow);
const mmss = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

/**
 * Zeitraffer-Rennen: Thermometer pro Gerät, gemeinsame Uhr.
 * Startet groß unten (Hook), wandert dann als kompakte Leiste nach oben.
 */
export const RacePanel: React.FC<{race: RaceSpec; keys: [number, number][]; showFrame: number; dockFrame: number; hideFrame: number}> = ({race, keys, showFrame, dockFrame, hideFrame}) => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const ms = (f / fps) * 1000;
  const clock = raceClock(keys, ms);
  const appear = spring({frame: f - showFrame - 6, fps, config: {damping: 16, mass: 0.6}});
  const dock = spring({frame: f - dockFrame, fps, config: {damping: 18, mass: 0.8}});
  const hide = interpolate(f, [hideFrame - 8, hideFrame], [1, 0], cl);
  if (f < showFrame || f > hideFrame) return null;
  const top = interpolate(dock, [0, 1], [1000, 300]);
  const scale = interpolate(dock, [0, 1], [1, 0.84]);
  return (
    <div style={{position: 'absolute', top, width: '100%', display: 'flex', justifyContent: 'center', opacity: appear * hide}}>
      <div style={{
        width: 880, transform: `scale(${scale * (0.94 + 0.06 * appear)})`, transformOrigin: 'top center',
        background: `linear-gradient(180deg, rgba(20,26,33,.92), ${BRAND.panel})`, border: `2px solid ${BRAND.line}`, borderRadius: 24,
        padding: '16px 30px 18px', boxShadow: '0 20px 60px rgba(0,0,0,.45)',
      }}>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6}}>
          <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
            <div style={{width: 12, height: 12, borderRadius: 6, background: BRAND.bad, opacity: 0.5 + 0.5 * Math.round((f / 8) % 1.6 > 0.8 ? 1 : 0)}} />
            <div style={{fontFamily: FONT.ui, fontWeight: 800, fontSize: 26, color: BRAND.muted, letterSpacing: 3}}>{race.title ?? 'ZEITRAFFER'}</div>
          </div>
          <div style={{fontFamily: FONT.mono, fontSize: 52, color: BRAND.yellow, textShadow: `0 0 18px ${BRAND.yellow}66`}}>{mmss(clock)}</div>
        </div>
        {race.lanes.map((lane) => {
          const p = Math.min(1, clock / lane.finish);
          const temp = race.from + (race.to - race.from) * p;
          const done = clock >= lane.finish;
          const doneFrame = Math.round((raceMsAt(keys, lane.finish) / 1000) * fps);
          const pop = done ? spring({frame: f - doneFrame, fps, config: {damping: 9, mass: 0.5}}) : 0;
          const fill = done ? toneColor(lane.tone) : interpolateColors(p, [0, 0.5, 1], ['#4aa3ff', '#ffb347', '#ff6a3d']);
          return (
            <div key={lane.label} style={{display: 'flex', alignItems: 'center', gap: 16, padding: '7px 0'}}>
              <div style={{width: 220, fontFamily: FONT.ui, fontWeight: 800, fontSize: 32, color: BRAND.text}}>{lane.label}</div>
              <div style={{flex: 1, height: 30, borderRadius: 15, background: 'rgba(255,255,255,.07)', position: 'relative', overflow: 'hidden'}}>
                <div style={{width: `${p * 100}%`, height: '100%', borderRadius: 15, background: fill, boxShadow: `0 0 16px ${fill}88`}} />
                <div style={{position: 'absolute', right: 8, top: 4, bottom: 4, width: 3, background: 'rgba(255,255,255,.35)'}} />
              </div>
              <div style={{width: 190, display: 'flex', justifyContent: 'flex-end'}}>
                {done ? (
                  <div style={{fontFamily: FONT.mono, fontSize: 40, color: BRAND.ink, background: toneColor(lane.tone), borderRadius: 10, padding: '2px 12px', transform: `scale(${0.6 + 0.4 * pop})`}}>
                    ✓ {mmss(lane.finish).replace(/^0/, '')}
                  </div>
                ) : (
                  <div style={{fontFamily: FONT.mono, fontSize: 44, color: BRAND.text}}>
                    {Math.round(temp)}
                    <span style={{fontSize: 26, marginLeft: 4, color: BRAND.muted}}>{race.unit}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
