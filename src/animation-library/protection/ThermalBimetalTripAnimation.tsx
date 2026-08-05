import React from 'react';
import {Flame, Timer} from 'lucide-react';

export type ThermalBimetalTripAnimationProps = {
  progress: number;
  width?: number;
  height?: number;
  title?: string;
  resultText?: string;
  coldColor?: string;
  hotColor?: string;
  accentColor?: string;
};

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));

export const ThermalBimetalTripAnimation: React.FC<ThermalBimetalTripAnimationProps> = ({
  progress,
  width = 720,
  height = 600,
  title = 'THERMISCHER AUSLÖSER',
  resultText = 'ZEITVERZÖGERT',
  coldColor = '#2ac7ff',
  hotColor = '#ff8c42',
  accentColor = '#ffc857',
}) => {
  const p = clamp01(progress);
  const bend = p * 28;

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
          top: 78,
          left: 70,
          color: '#9fb8ca',
          fontSize: 31,
          fontWeight: 900,
          letterSpacing: 1,
        }}
      >
        {title}
      </div>

      <div
        style={{
          position: 'absolute',
          top: 255,
          left: 95,
          width: 430,
          height: 42,
          borderRadius: 22,
          background: `linear-gradient(90deg, ${coldColor}, ${hotColor})`,
          transformOrigin: '0 50%',
          transform: `rotate(${bend}deg)`,
          boxShadow: `0 0 ${12 + p * 48}px ${hotColor}88`,
        }}
      />

      <div
        style={{
          position: 'absolute',
          left: 548,
          top: 286,
          width: 30,
          height: 145,
          borderRadius: 15,
          background: p > 0.72 ? hotColor : '#a8bac6',
          transformOrigin: '50% 100%',
          transform: `rotate(${p * 18}deg)`,
        }}
      />

      <Flame size={95} color={hotColor} style={{position: 'absolute', left: 95, bottom: 72}} />
      <Timer size={110} color={accentColor} style={{position: 'absolute', right: 78, bottom: 70}} />

      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 78,
          textAlign: 'center',
          color: hotColor,
          fontSize: 47,
          fontWeight: 950,
          opacity: p,
        }}
      >
        {resultText}
      </div>
    </div>
  );
};
