import React from 'react';

export type BreakerTripAnimationProps = {
  progress: number;
  label?: string;
  width?: number;
  height?: number;
  activeColor?: string;
  tripColor?: string;
  onText?: string;
  trippedText?: string;
  showStateLabel?: boolean;
  style?: React.CSSProperties;
};

export const BreakerTripAnimation: React.FC<BreakerTripAnimationProps> = ({
  progress,
  label = 'B16',
  width = 320,
  height = 560,
  activeColor = '#1e4e6c',
  tripColor = '#ff4d5e',
  onText = 'EIN',
  trippedText = 'AUSGELÖST',
  showStateLabel = true,
  style,
}) => {
  const normalizedProgress = Math.min(1, Math.max(0, progress));
  const handleAngle = -18 + normalizedProgress * 52;
  const isTripped = normalizedProgress > 0.55;
  const scale = width / 320;

  return (
    <div
      aria-label={`${label}: ${isTripped ? trippedText : onText}`}
      style={{
        position: 'relative',
        width,
        height,
        borderRadius: 38 * scale,
        background: 'linear-gradient(145deg, #f7fbff, #c8d6df)',
        border: `${Math.max(2, 4 * scale)}px solid #90a9b8`,
        boxShadow: `0 ${35 * scale}px ${90 * scale}px rgba(0,0,0,.48), 0 0 ${normalizedProgress * 55 * scale}px ${tripColor}66`,
        overflow: 'hidden',
        ...style,
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 38 * scale,
          left: 40 * scale,
          color: '#173046',
          fontFamily: 'Arial, sans-serif',
          fontWeight: 950,
          fontSize: 44 * scale,
        }}
      >
        {label}
      </div>

      <div
        style={{
          position: 'absolute',
          top: 120 * scale,
          left: 72 * scale,
          width: 176 * scale,
          height: 260 * scale,
          borderRadius: 28 * scale,
          background: '#1b2f3d',
          boxShadow: `inset 0 ${8 * scale}px ${18 * scale}px rgba(0,0,0,.5)`,
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: 55 * scale,
            top: 32 * scale,
            width: 66 * scale,
            height: 190 * scale,
            borderRadius: 26 * scale,
            background: 'linear-gradient(180deg, #f9fbfc, #a8bac6)',
            transformOrigin: '50% 88%',
            transform: `rotate(${handleAngle}deg)`,
            boxShadow: `0 ${10 * scale}px ${18 * scale}px rgba(0,0,0,.42)`,
          }}
        />
      </div>

      {showStateLabel ? (
        <div
          style={{
            position: 'absolute',
            left: 42 * scale,
            right: 42 * scale,
            bottom: 48 * scale,
            height: 92 * scale,
            borderRadius: 18 * scale,
            background: '#e9f1f5',
            border: `${Math.max(1, 2 * scale)}px solid #9fb2bf`,
            display: 'grid',
            placeItems: 'center',
            color: isTripped ? tripColor : activeColor,
            fontFamily: 'Arial, sans-serif',
            fontSize: 29 * scale,
            fontWeight: 950,
          }}
        >
          {isTripped ? trippedText : onText}
        </div>
      ) : null}
    </div>
  );
};
