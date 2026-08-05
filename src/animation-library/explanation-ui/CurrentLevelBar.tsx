import React from 'react';

export type CurrentLevelBarProps = {
  value: number;
  width?: number;
  height?: number;
  danger?: boolean;
  label?: string;
  valueLabel?: string;
  normalColor?: string;
  warningColor?: string;
  dangerColor?: string;
  backgroundColor?: string;
};

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));

export const CurrentLevelBar: React.FC<CurrentLevelBarProps> = ({
  value,
  width = 800,
  height = 88,
  danger = false,
  label,
  valueLabel,
  normalColor = '#2ac7ff',
  warningColor = '#ffc857',
  dangerColor = '#ff4d5e',
  backgroundColor = '#102b43',
}) => {
  const normalized = clamp01(value);
  const fill = danger
    ? `linear-gradient(90deg, ${warningColor}, ${dangerColor})`
    : `linear-gradient(90deg, ${normalColor}, ${warningColor}, #ff8c42)`;

  return (
    <div style={{width, fontFamily: 'Arial, sans-serif'}}>
      {(label || valueLabel) && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: 14,
            color: '#f4fbff',
            fontSize: 28,
            fontWeight: 900,
          }}
        >
          <span>{label}</span>
          <span style={{color: danger ? dangerColor : warningColor}}>{valueLabel}</span>
        </div>
      )}
      <div
        style={{
          width,
          height,
          borderRadius: height / 2,
          overflow: 'hidden',
          background: backgroundColor,
          border: '2px solid rgba(255,255,255,.12)',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${Math.max(4, normalized * 100)}%`,
            borderRadius: height / 2,
            background: fill,
            boxShadow: danger
              ? `0 0 45px ${dangerColor}88`
              : `0 0 30px ${normalColor}55`,
          }}
        />
      </div>
    </div>
  );
};
