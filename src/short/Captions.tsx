import React, {useLayoutEffect, useMemo, useRef} from 'react';
import {AbsoluteFill, Sequence, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {createTikTokStyleCaptions, type Caption, type TikTokPage} from '@remotion/captions';
import {FONT} from './theme';

// Stil wie bei großen 3D-Erklärkanälen: 1–2 Wörter, weiß, dicke Kontur, Schlüsselwort gelb.
const SWITCH_MS = 260;
const YELLOW = '#ffd84a';

const norm = (w: string) => w.toLowerCase().replace(/[^\p{L}\p{N}]/gu, '');

type Look = {top: number; fontFamily: string; fontSize: number; stroke: boolean; karaoke: boolean; singleLine: boolean; color: string; active: string};
const Page: React.FC<{page: TikTokPage; keywords: Set<string>; look: Look}> = ({page, keywords, look}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const pop = spring({frame, fps, config: {damping: 14, mass: 0.45}, from: look.karaoke ? 0.92 : 0.82, to: 1});
  // Karaoke: das gerade gesprochene Wort leuchtet gelb
  const now = page.startMs + (frame / fps) * 1000;
  let active = -1;
  page.tokens.forEach((t, i) => {
    if (now >= t.fromMs - 40) active = i;
  });
  const ref = useRef<HTMLDivElement>(null);
  // Einzeilig: zu lange Seiten werden kleiner statt umzubrechen (max. 860 px)
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || !look.singleLine) return;
    el.style.zoom = '1';
    if (el.scrollWidth > 860) el.style.zoom = String(860 / el.scrollWidth);
  });
  return (
    <AbsoluteFill style={{top: look.top, height: look.singleLine ? 90 : 220, alignItems: 'center', justifyContent: 'center'}}>
      <div ref={ref} style={{
        maxWidth: look.singleLine ? undefined : 900, textAlign: 'center', fontFamily: look.fontFamily, fontWeight: look.singleLine ? 800 : 900, fontSize: look.fontSize, lineHeight: 1.05,
        whiteSpace: look.singleLine ? 'pre' : 'pre-wrap', transform: `scale(${pop})`, WebkitTextStroke: look.stroke ? '16px #000' : undefined, paintOrder: 'stroke fill',
        textShadow: look.stroke ? '0 8px 24px rgba(0,0,0,.55)' : look.color === '#fff' ? '0 3px 14px rgba(0,0,0,.75), 0 0 3px rgba(0,0,0,.9)' : 'none',
      }}>
        {page.tokens.map((t, i) => (
          <span key={t.fromMs + '-' + i} style={{color: (look.karaoke ? i === active : keywords.has(norm(t.text))) ? look.active : look.color}}>{t.text}</span>
        ))}
      </div>
    </AbsoluteFill>
  );
};

export const Captions: React.FC<{captions: Caption[]; highlight?: string[]; top?: number; fontFamily?: string; fontSize?: number; stroke?: boolean; karaoke?: boolean; combineMs?: number; singleLine?: boolean; color?: string; activeColor?: string}> = ({captions, highlight = [], top = 1180, fontFamily = FONT, fontSize = 104, stroke = true, karaoke = false, combineMs = SWITCH_MS, singleLine = false, color = '#fff', activeColor = YELLOW}) => {
  const {fps} = useVideoConfig();
  const look = useMemo(() => ({top, fontFamily, fontSize, stroke, karaoke, singleLine, color, active: activeColor}), [top, fontFamily, fontSize, stroke, karaoke, singleLine, color, activeColor]);
  const keywords = useMemo(() => new Set(highlight.map(norm)), [highlight]);
  const {pages} = useMemo(() => createTikTokStyleCaptions({captions, combineTokensWithinMilliseconds: combineMs}), [captions, combineMs]);
  return (
    <AbsoluteFill>
      {pages.map((page, i) => {
        const next = pages[i + 1];
        const from = Math.round((page.startMs / 1000) * fps);
        const until = next ? Math.round((next.startMs / 1000) * fps) : from + Math.round(((page.durationMs + 300) / 1000) * fps);
        if (until <= from) return null;
        return <Sequence key={i} from={from} durationInFrames={until - from} layout="none"><Page page={page} keywords={keywords} look={look} /></Sequence>;
      })}
    </AbsoluteFill>
  );
};
