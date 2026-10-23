import React from 'react';
import {useCurrentFrame} from 'remotion';
import {SCIENCE_COLORS, SCIENCE_FORMAT, SCIENCE_SHADOWS, SCIENCE_TYPOGRAPHY} from '../tokens';

export type TimedCaption = {
  fromFrame: number;
  toFrame: number;
  text: string;
};

export const ScienceCaptions: React.FC<{
  captions: TimedCaption[];
  bottom?: number;
  fontSize?: number;
}> = ({captions, bottom = SCIENCE_FORMAT.captionBottom, fontSize = SCIENCE_TYPOGRAPHY.caption}) => {
  const frame = useCurrentFrame();
  const active = captions.find((caption) => frame >= caption.fromFrame && frame < caption.toFrame);
  if (!active) return null;

  return (
    <div
      style={{
        position: 'absolute',
        left: 90,
        right: 90,
        bottom,
        zIndex: 100,
        color: SCIENCE_COLORS.text,
        fontFamily: SCIENCE_TYPOGRAPHY.family,
        fontSize,
        lineHeight: 1.08,
        fontWeight: 950,
        textAlign: 'center',
        textShadow: SCIENCE_SHADOWS.text,
      }}
    >
      {active.text}
    </div>
  );
};
