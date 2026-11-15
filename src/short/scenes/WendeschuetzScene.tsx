import React from 'react';
import {useVideoConfig} from 'remotion';
import {WendeStage, type WendeEvents} from '../../demos/Wendeschuetz';
import type {Beats} from '../../world/kit';

// Wendeschützschaltung als Short-Szene: Taster und Schütze schalten genau beim gesprochenen Wort.
export const WendeschuetzScene: React.FC<{beats: Beats; width: number; height: number; theme?: 'dark' | 'light'}> = ({beats, theme}) => {
  const {fps} = useVideoConfig();
  const b = (k: string, fb: number) => beats[k] ?? fb;
  const end = 99999;
  const s1 = b('rechts@s1', b('rechts', 200));
  const k1On = b('rechts@k1', s1 + 6);
  const s1Up = b('rechts@motor', k1On + fps);
  const s0 = b('links@s0', b('links', s1Up + 3 * fps));
  const s2 = b('links@s2', s0 + fps);
  const k2On = b('links@k2', s2 + 6);
  const ev: WendeEvents = {
    s1: [s1, s1Up], s2a: [-1, -1], s0: [s0, s0 + 12], s2b: [s2, s2 + Math.round(0.8 * fps)], k1On, k1Off: s0 + 2, k2On,
    rolltor: [b('wozu@rolltor', b('wozu', 60)), b('trick', 150)],
    dim: [b('trick', 150), b('rechts', 200)],
    swap: [b('trick@tauscht', b('trick', 150)), b('rechts', 200)],
    danger: [b('sicher@gleichzeitig', b('sicher', end)), b('sicher@deshalb', end)],
    lock: [b('sicher@sperrt', end), end],
  };
  return <WendeStage ev={ev} theme={theme} />;
};
