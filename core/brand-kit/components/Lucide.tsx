import React from 'react';
import type {LucideIcon} from 'lucide-react';
import {interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {ELECTRICAL_COLORS} from '../tokens';

export const ElectricalLucide: React.FC<{
  icon: LucideIcon;
  size?: number;
  color?: string;
  delay?: number;
  strokeWidth?: number;
}> = ({icon: Icon, size = 72, color = ELECTRICAL_COLORS.current, delay = 0, strokeWidth = 2.4}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const progress = spring({frame: frame - delay, fps, config: {damping: 18, stiffness: 170}});
  const opacity = interpolate(progress, [0, 1], [0, 1]);
  const scale = interpolate(progress, [0, 1], [0.7, 1]);

  return (
    <div style={{display: 'inline-flex', opacity, transform: `scale(${scale})`}}>
      <Icon size={size} color={color} strokeWidth={strokeWidth} />
    </div>
  );
};
