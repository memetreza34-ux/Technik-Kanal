import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {ShieldCheck} from 'lucide-react';
import {RcdContactTripAnimation, ResidualCurrentBalanceAnimation} from './animation-library';
import {ElectricalProductionLayer} from './engine';
import type {ElectricalReelRuntime, ElectricalRuntimeScene} from './engine';
import runtimeJson from './generated/fi-schalter-runtime.json';

const runtime = runtimeJson as ElectricalReelRuntime;

export const FI_REEL_TOTAL_FRAMES = Math.max(1, runtime.totalFrames);
export const FI_REEL_FPS = runtime.fps || 30;
export const FI_REEL_WIDTH = runtime.width || 1080;
export const FI_REEL_HEIGHT = runtime.height || 1920;

const clamp = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

const MechanismPlate: React.FC<{children: React.ReactNode}> = ({children}) => (
  <div
    style={{
      position: 'absolute',
      top: 475,
      left: 110,
      width: 860,
      height: 650,
      display: 'grid',
      placeItems: 'center',
      borderRadius: 46,
      background: 'linear-gradient(145deg, rgba(3,16,31,.94), rgba(8,35,58,.90))',
      border: '2px solid rgba(114,230,255,.18)',
      boxShadow: '0 30px 80px rgba(0,0,0,.44)',
      overflow: 'hidden',
    }}
  >
    {children}
  </div>
);

const FiMechanism: React.FC<{scene: ElectricalRuntimeScene}> = ({scene}) => {
  const frame = useCurrentFrame();
  const progress = interpolate(frame, [scene.fromFrame, scene.toFrame], [0, 1], clamp);

  if (scene.id === '03-normalzustand') {
    return (
      <MechanismPlate>
        <ResidualCurrentBalanceAnimation
          progress={progress}
          faultProgress={0}
          signalProgress={0}
          width={760}
          height={560}
          showLabels={false}
        />
      </MechanismPlate>
    );
  }

  if (scene.id === '05-differenzstrom') {
    return (
      <MechanismPlate>
        <ResidualCurrentBalanceAnimation
          progress={progress}
          faultProgress={interpolate(progress, [0.12, 0.78], [0.12, 1], clamp)}
          signalProgress={0}
          width={760}
          height={560}
          showLabels={false}
        />
      </MechanismPlate>
    );
  }

  if (scene.id === '07-kontakte-oeffnen') {
    return (
      <MechanismPlate>
        <RcdContactTripAnimation
          progress={interpolate(progress, [0.2, 0.72], [0, 1], clamp)}
          width={340}
          height={557}
          label="FI"
        />
      </MechanismPlate>
    );
  }

  if (scene.id === '08-30ma') {
    return (
      <div
        style={{
          position: 'absolute',
          top: 720,
          left: 240,
          right: 240,
          padding: '34px 28px',
          borderRadius: 34,
          background: 'rgba(3,16,31,.86)',
          border: '2px solid rgba(255,200,87,.55)',
          textAlign: 'center',
          boxShadow: '0 26px 60px rgba(0,0,0,.38)',
        }}
      >
        <ShieldCheck size={74} color="#2ac7ff" />
        <div style={{marginTop: 10, color: '#ffc857', fontFamily: 'Arial, sans-serif', fontSize: 92, fontWeight: 950}}>30 mA</div>
        <div style={{marginTop: 6, color: '#f4fbff', fontFamily: 'Arial, sans-serif', fontSize: 29, fontWeight: 850}}>zusätzlicher Personenschutz</div>
      </div>
    );
  }

  return null;
};

export const FiSchalterReel: React.FC = () => (
  <AbsoluteFill>
    <ElectricalProductionLayer runtime={runtime} mechanismLayer={(scene) => <FiMechanism scene={scene} />} />
  </AbsoluteFill>
);
