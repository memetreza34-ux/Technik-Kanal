import React from 'react';
import {Zap} from 'lucide-react';

export type ShortCircuitContactAnimationProps = {
  progress: number;
  width?: number;
  height?: number;
  phaseColor?: string;
  neutralColor?: string;
  arcColor?: string;
  label?: string;
};

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));

export const ShortCircuitContactAnimation: React.FC<ShortCircuitContactAnimationProps> = ({
  progress,
  width = 860,
  height = 570,
  phaseColor = '#d65d4a',
  neutralColor = '#4d8bd6',
  arcColor = '#ffc857',
  label = 'SEHR KLEINER WIDERSTAND',
}) => {
  const p = clamp01(progress);
  const approach = Math.min(1, p * 1.35);
  const flash = Math.max(0, (p - 0.45) / 0.55);

  return (
    <div
      style={{
        position: 'relative',
        width,
        height,
        borderRadius: 38,
        overflow: 'hidden',
        background: 'linear-gradient(145deg, rgba(13,43,73,.96), rgba(4,20,38,.96))',
        border: '2px solid rgba(114,230,255,.22)',
        boxShadow: '0 28px 70px rgba(0,0,0,.38)',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: 80,
          top: 175,
          width: 390,
          height: 50,
          borderRadius: 30,
          background: phaseColor,
          transformOrigin: '100% 50%',
          transform: `rotate(${-8 + approach * 16}deg) translateX(${approach * 26}px)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          right: 80,
          top: 335,
          width: 390,
          height: 50,
          borderRadius: 30,
          background: neutralColor,
          transformOrigin: '0 50%',
          transform: `rotate(${8 - approach * 16}deg) translateX(${-approach * 26}px)`,
        }}
      />

      <Zap
        size={165}
        color={arcColor}
        style={{
          position: 'absolute',
          left: 350,
          top: 195,
          opacity: flash,
          filter: `drop-shadow(0 0 ${flash * 60}px #ff4d5e)`,
          transform: `scale(${0.2 + flash * 0.95})`,
        }}
      />

      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 62,
          textAlign: 'center',
          color: '#f4fbff',
          fontSize: 34,
          fontWeight: 900,
          opacity: Math.min(1, p * 1.7),
        }}
      >
        {label}
      </div>
    </div>
  );
};
