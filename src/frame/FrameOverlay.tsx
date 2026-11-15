import React from 'react';
import {useCurrentFrame} from 'remotion';
import type {Overlay} from '../short/types';
import {CardSlot, Heading, Label, type Theme} from './Frame';

const RED = '#FF4B3A';

/** Färbt bestimmte Wörter im Text (z. B. L1/L2/L3 in Phasenfarben). */
const Colored: React.FC<{text: string; colors?: Record<string, string>}> = ({text, colors}) => {
  if (!colors) return <>{text}</>;
  const keys = Object.keys(colors).sort((a, b) => b.length - a.length).map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const parts = text.split(new RegExp(`(${keys.join('|')})`));
  return <>{parts.map((p, i) => (colors[p] ? <span key={i} style={{color: colors[p]}}>{p}</span> : <React.Fragment key={i}>{p}</React.Fragment>))}</>;
};

/** Pro Szene im festen Rahmen: Überschrift + höchstens eine Datenkarte (erscheint beim Wort). */
export const FrameSceneOverlay: React.FC<{theme: Theme; heading?: string; overlay?: Overlay; at: (word?: string) => number; dur: number}> = ({theme, heading, overlay, at, dur}) => {
  useCurrentFrame();
  return (
    <>
      {heading ? <Heading theme={theme} text={heading} /> : null}
      {overlay?.type === 'facts' ? (
        <CardSlot theme={theme} show={at(overlay.value?.word)} hide={dur + 4} border={overlay.tone === 'bad' ? RED : undefined}>
          {overlay.label ? <Label theme={theme}>{overlay.label}</Label> : null}
          {overlay.value ? (
            <div style={{fontSize: 46, fontWeight: 900}}>
              <Colored text={overlay.value.text} colors={overlay.colors} />
            </div>
          ) : null}
        </CardSlot>
      ) : null}
    </>
  );
};
