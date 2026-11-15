import React from 'react';
import {Environment} from '@react-three/drei';
import {Bloom, DepthOfField, EffectComposer, ToneMapping} from '@react-three/postprocessing';
import {ToneMappingMode} from 'postprocessing';
import {hdriUrl} from './assets';

/**
 * Einheitlicher Look für alle Szenen der Technik-Welt:
 * echte Lichtumgebung (HDRI), Sonne mit Schatten, Leuchteffekt für alles, was glüht.
 */
/** focus: Abstand Kamera→Ziel in m; alles davor/dahinter wird weich (Tiefenschärfe). */
export const WorldLook: React.FC<{children: React.ReactNode; bloom?: number; background?: string; focus?: {distance: number; range: number; bokeh?: number}}> = ({children, bloom = 0.55, background = '#2a3440', focus}) => (
  <>
    <color attach="background" args={[background]} />
    <fog attach="fog" args={[background, 30, 70]} />
    <Environment files={hdriUrl('aristea_wreck_puresky')} environmentIntensity={0.6} />
    <ambientLight intensity={0.08} />
    <directionalLight
      position={[11, 17, 15]}
      intensity={2.3}
      color="#ffe2bd"
      castShadow
      shadow-mapSize={[4096, 4096]}
      shadow-bias={-0.0002}
      shadow-normalBias={0.02}
      shadow-camera-left={-15}
      shadow-camera-right={15}
      shadow-camera-top={15}
      shadow-camera-bottom={-15}
      shadow-camera-near={1}
      shadow-camera-far={70}
    />
    {children}
    {focus ? (
      <EffectComposer multisampling={4}>
        <DepthOfField worldFocusDistance={focus.distance} worldFocusRange={focus.range} bokehScale={focus.bokeh ?? 3} height={720} />
        <Bloom mipmapBlur luminanceThreshold={0.9} luminanceSmoothing={0.2} intensity={bloom} />
        <ToneMapping mode={ToneMappingMode.NEUTRAL} />
      </EffectComposer>
    ) : (
      <EffectComposer multisampling={4}>
        <Bloom mipmapBlur luminanceThreshold={0.9} luminanceSmoothing={0.2} intensity={bloom} />
        <ToneMapping mode={ToneMappingMode.NEUTRAL} />
      </EffectComposer>
    )}
  </>
);

/**
 * Nacht-Bühne: dunkles Blau, Nebel schluckt den Hintergrund, nur warme Lichtinseln.
 * Kein Sonnenlicht – die Szene setzt ihre eigenen Lampen.
 */
export const NightLook: React.FC<{children: React.ReactNode; bloom?: number; background?: string; fog?: [number, number]; env?: number; focus?: {distance: number; range: number; bokeh?: number}}> = ({children, bloom = 0.9, background = '#121418', fog = [1.6, 5.5], env = 0.22, focus}) => (
  <>
    <color attach="background" args={[background]} />
    <fog attach="fog" args={[background, fog[0], fog[1]]} />
    <Environment files={hdriUrl('brown_photostudio_02')} environmentIntensity={env} />
    <hemisphereLight args={['#6b7280', '#0b0c0f', 0.35]} />
    {children}
    {focus ? (
      <EffectComposer multisampling={4}>
        <DepthOfField worldFocusDistance={focus.distance} worldFocusRange={focus.range} bokehScale={focus.bokeh ?? 3} height={720} />
        <Bloom mipmapBlur luminanceThreshold={0.75} luminanceSmoothing={0.25} intensity={bloom} />
        <ToneMapping mode={ToneMappingMode.NEUTRAL} />
      </EffectComposer>
    ) : (
      <EffectComposer multisampling={4}>
        <Bloom mipmapBlur luminanceThreshold={0.75} luminanceSmoothing={0.25} intensity={bloom} />
        <ToneMapping mode={ToneMappingMode.NEUTRAL} />
      </EffectComposer>
    )}
  </>
);
