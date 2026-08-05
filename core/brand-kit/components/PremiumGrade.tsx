import React from 'react';
import {AbsoluteFill} from 'remotion';

export const PremiumElectricalGrade: React.FC<{
  vignette?: number;
  contrast?: number;
  children?: React.ReactNode;
}> = ({vignette = 0.42, contrast = 1.04, children}) => (
  <AbsoluteFill style={{filter: `contrast(${contrast})`}}>
    {children}
    <AbsoluteFill
      style={{
        pointerEvents: 'none',
        background: `radial-gradient(circle at 50% 42%, transparent 42%, rgba(0,0,0,${vignette}) 100%)`,
        mixBlendMode: 'multiply',
      }}
    />
  </AbsoluteFill>
);
