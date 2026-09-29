import React from 'react';
import {useCurrentFrame} from 'remotion';
import {ELECTRICAL_COLORS, ELECTRICAL_FORMAT, ELECTRICAL_SHADOWS, ELECTRICAL_TYPOGRAPHY} from '../tokens';

export type TimedCaption = {
  fromFrame: number;
  toFrame: number;
  text: string;
};

export const ElectricalCaptions: React.FC<{
  captions: TimedCaption[];
  bottom?: number;
  fontSize?: number;
}> = ({captions, bottom = ELECTRICAL_FORMAT.captionBottom, fontSize = ELECTRICAL_TYPOGRAPHY.caption}) => {
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
        color: ELECTRICAL_COLORS.text,
        fontFamily: 'Arial, Helvetica, sans-serif',
        fontSize,
        lineHeight: 1.08,
        fontWeight: 950,
        textAlign: 'center',
        textShadow: ELECTRICAL_SHADOWS.text,
      }}
    >
      {active.text}
    </div>
  );
};
