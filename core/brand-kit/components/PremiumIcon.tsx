import React from 'react';
import type {LucideIcon} from 'lucide-react';
import {ELECTRICAL_COLORS} from '../tokens';
import {ElectricalLucide} from './Lucide';

export const PremiumElectricalIcon: React.FC<{
  icon: LucideIcon;
  size?: number;
  color?: string;
  delay?: number;
}> = ({icon, size = 72, color = ELECTRICAL_COLORS.current, delay = 0}) => (
  <div
    style={{
      display: 'grid',
      placeItems: 'center',
      width: size + 34,
      height: size + 34,
      borderRadius: 999,
      background: 'linear-gradient(145deg, rgba(13,43,73,.95), rgba(3,16,31,.95))',
      border: `2px solid ${color}55`,
      boxShadow: `0 14px 34px ${color}24`,
    }}
  >
    <ElectricalLucide icon={icon} size={size} color={color} delay={delay} />
  </div>
);
