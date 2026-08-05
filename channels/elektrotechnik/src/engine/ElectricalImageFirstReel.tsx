import React from 'react';
import type {ElectricalReelRuntime, ElectricalRuntimeScene} from './contracts';
import {assertElectricalRuntime} from './contracts';
import {ElectricalProductionLayer} from './ElectricalProductionLayer';

export const ElectricalImageFirstReel: React.FC<{
  runtime: ElectricalReelRuntime;
  mechanismLayer?: (scene: ElectricalRuntimeScene) => React.ReactNode;
}> = ({runtime, mechanismLayer}) => (
  <ElectricalProductionLayer runtime={assertElectricalRuntime(runtime)} mechanismLayer={mechanismLayer} />
);
