import React from 'react';
import {Magnet} from 'lucide-react';

export type MagneticInstantTripAnimationProps = {
  progress: number;
  width?: number;
  height?: number;
  title?: string;
  resultText?: string;
  fieldColor?: string;
  tripColor?: string;
};

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));

export const MagneticInstantTripAnimation: React.FC<MagneticInstantTripAnimationProps> = ({
  progress,
  width = 730,
  height = 610,
  title = 'MAGNETISCHER AUSLÖSER',
  resultText = 'FAST SOFORT',
  fieldColor = '#2ac7ff',
  tripColor = '#ff4d5e',
}) => {
  const p = clamp01(progress);
  const armatureRight = 90 + p * 140;

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
          top: 72,
          left: 70,
          color: '#9fb8ca',
          fontSize: 31,
          fontWeight: 900,
        }}
      >
        {title}
      </div>

      <Magnet
        size={170}
        color={fieldColor}
        style={{
          position: 'absolute',
          left: 90,
          top: 205,
          filter: `drop-shadow(0 0 ${p * 45}px ${fieldColor})`,
        }}
      />

      {[0, 1, 2].map((ring) => (
        <div
          key={ring}
          style={{
            position: 'absolute',
            left: 245 - ring * 18,
            top: 212 - ring * 18,
            width: 150 + ring * 36,
            height: 150 + ring * 36,
            borderRadius: '50%',
            border: `4px solid ${fieldColor}`,
            opacity: p * (0.7 - ring * 0.15),
            transform: `scale(${0.72 + p * 0.28})`,
          }}
        />
      ))}

      <div
        style={{
          position: 'absolute',
          right: armatureRight,
          top: 245,
          width: 180,
          height: 115,
          borderRadius: 24,
          background: '#d5e1e8',
          border: '4px solid #819aaa',
          boxShadow: p > 0.4 ? `0 0 28px ${fieldColor}77` : undefined,
        }}
      />

      <div
        style={{
          position: 'absolute',
          right: 70,
          top: 180,
          width: 24,
          height: 250,
          borderRadius: 12,
          background: tripColor,
          transformOrigin: '50% 90%',
          transform: `rotate(${p * 25}deg)`,
        }}
      />

      <div
        style={{
          position: 'absolute',
          bottom: 72,
          left: 0,
          right: 0,
          textAlign: 'center',
          color: tripColor,
          fontSize: 56,
          fontWeight: 950,
          opacity: Math.min(1, p * 1.8),
        }}
      >
        {resultText}
      </div>
    </div>
  );
};
