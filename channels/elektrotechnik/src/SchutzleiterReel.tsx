import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {ProtectiveConductorPathAnimation} from './animation-library';
import {ElectricalProductionLayer} from './engine';
import type {ElectricalReelRuntime, ElectricalRuntimeScene} from './engine';
import runtimeJson from './generated/schutzleiter-runtime.json';

const runtime = runtimeJson as ElectricalReelRuntime;

export const SCHUTZLEITER_REEL_TOTAL_FRAMES = Math.max(1, runtime.totalFrames);
export const SCHUTZLEITER_REEL_FPS = runtime.fps || 30;
export const SCHUTZLEITER_REEL_WIDTH = runtime.width || 1080;
export const SCHUTZLEITER_REEL_HEIGHT = runtime.height || 1920;

const clamp = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};
const sceneProgress = (frame: number, scene: ElectricalRuntimeScene) => interpolate(frame, [scene.fromFrame, scene.toFrame], [0, 1], clamp);

const SchutzleiterMechanism: React.FC<{scene: ElectricalRuntimeScene}> = ({scene}) => {
  const frame = useCurrentFrame();
  const progress = sceneProgress(frame, scene);

  if (scene.id === '03-normalbetrieb') {
    return (
      <AbsoluteFill style={{display: 'grid', placeItems: 'center', paddingTop: 220}}>
        <ProtectiveConductorPathAnimation progress={progress} faultProgress={0} width={800} height={620} />
      </AbsoluteFill>
    );
  }

  if (scene.id === '05-fehlerstromweg') {
    const fault = interpolate(progress, [0.12, 0.72], [0, 1], clamp);
    return (
      <AbsoluteFill style={{display: 'grid', placeItems: 'center', paddingTop: 220}}>
        <ProtectiveConductorPathAnimation progress={progress} faultProgress={fault} width={800} height={620} />
      </AbsoluteFill>
    );
  }

  return null;
};

const Label: React.FC<{children: React.ReactNode; left?: number; right?: number; top: number; accent?: string}> = ({children, left, right, top, accent = '#2ac7ff'}) => (
  <div style={{position: 'absolute', left, right, top, zIndex: 18, padding: '17px 24px', borderRadius: 18, background: 'rgba(3,16,31,.88)', border: `2px solid ${accent}`, color: '#ffffff', fontFamily: 'Arial, sans-serif', fontSize: 31, fontWeight: 950, textAlign: 'center', boxShadow: '0 10px 30px rgba(0,0,0,.4)'}}>{children}</div>
);

const GermanTechnicalLabels: React.FC = () => {
  const frame = useCurrentFrame();
  const scene = runtime.scenes.find((candidate) => frame >= candidate.fromFrame && frame < candidate.toFrame);
  if (!scene) return null;

  if (scene.id === '01-hook') return <Label right={74} top={900} accent="#d9e82e">Schutzleiter verbindet Metallgehäuse</Label>;
  if (scene.id === '02-verbindung') return <Label right={80} top={920} accent="#d9e82e">Schutzleiter (PE)</Label>;
  if (scene.id === '03-normalbetrieb') return <Label right={72} top={960} accent="#2ac7ff">Kein Betriebsstrom über PE</Label>;
  if (scene.id === '04-isolationsfehler') return <Label right={72} top={920} accent="#ff4d5e">Isolationsfehler am Gehäuse</Label>;
  if (scene.id === '05-fehlerstromweg') return <Label right={72} top={960} accent="#d9e82e">Fehlerstrom über Schutzleiter</Label>;
  if (scene.id === '06-abschaltung') return <Label right={80} top={930} accent="#ff4d5e">Schutzeinrichtung schaltet ab</Label>;
  if (scene.id === '07-pe-vs-n') {
    return (
      <>
        <Label left={78} top={820} accent="#2ac7ff">Neutralleiter (N)</Label>
        <Label right={78} top={820} accent="#d9e82e">Schutzleiter (PE)</Label>
      </>
    );
  }
  if (scene.id === '08-gruen-gelb') return <Label right={70} top={900} accent="#d9e82e">Grün-Gelb = Schutzleiter</Label>;
  if (scene.id === '09-sicher-reagieren') return <Label right={68} top={910} accent="#ffc857">Ausstecken und prüfen lassen</Label>;
  return null;
};

export const SchutzleiterReel: React.FC = () => (
  <AbsoluteFill>
    <ElectricalProductionLayer runtime={runtime} mechanismLayer={(scene) => <SchutzleiterMechanism scene={scene} />} />
    <GermanTechnicalLabels />
  </AbsoluteFill>
);