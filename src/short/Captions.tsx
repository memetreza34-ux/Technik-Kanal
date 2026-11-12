import React, {useMemo} from 'react';
import {AbsoluteFill, Sequence, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {createTikTokStyleCaptions, type Caption, type TikTokPage} from '@remotion/captions';
import {FONT} from './theme';

// Stil wie bei großen 3D-Erklärkanälen: 1–2 Wörter, weiß, dicke Kontur, Schlüsselwort gelb.
const SWITCH_MS = 260;
const YELLOW = '#ffd84a';

const norm = (w: string) => w.toLowerCase().replace(/[^\p{L}\p{N}]/gu, '');

const Page: React.FC<{page: TikTokPage; keywords: Set<string>}> = ({page, keywords}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const pop = spring({frame, fps, config: {damping: 14, mass: 0.45}, from: 0.82, to: 1});
  return (
    <AbsoluteFill style={{top: 1180, height: 220, alignItems: 'center', justifyContent: 'center'}}>
      <div style={{
        maxWidth: 900, textAlign: 'center', fontFamily: FONT, fontWeight: 900, fontSize: 104, lineHeight: 1.05,
        whiteSpace: 'pre-wrap', transform: `scale(${pop})`, WebkitTextStroke: '16px #000', paintOrder: 'stroke fill',
        textShadow: '0 8px 24px rgba(0,0,0,.55)',
      }}>
        {page.tokens.map((t, i) => (
          <span key={t.fromMs + '-' + i} style={{color: keywords.has(norm(t.text)) ? YELLOW : '#fff'}}>{t.text}</span>
        ))}
      </div>
    </AbsoluteFill>
  );
};

export const Captions: React.FC<{captions: Caption[]; highlight?: string[]}> = ({captions, highlight = []}) => {
  const {fps} = useVideoConfig();
  const keywords = useMemo(() => new Set(highlight.map(norm)), [highlight]);
  const {pages} = useMemo(() => createTikTokStyleCaptions({captions, combineTokensWithinMilliseconds: SWITCH_MS}), [captions]);
  return (
    <AbsoluteFill>
      {pages.map((page, i) => {
        const next = pages[i + 1];
        const from = Math.round((page.startMs / 1000) * fps);
        const until = next ? Math.round((next.startMs / 1000) * fps) : from + Math.round(((page.durationMs + 300) / 1000) * fps);
        if (until <= from) return null;
        return <Sequence key={i} from={from} durationInFrames={until - from} layout="none"><Page page={page} keywords={keywords} /></Sequence>;
      })}
    </AbsoluteFill>
  );
};
