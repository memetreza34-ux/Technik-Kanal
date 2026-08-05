import React, {createContext, useContext} from 'react';
import {ELECTRICAL_COLORS, ELECTRICAL_FORMAT, ELECTRICAL_MOTION, ELECTRICAL_TYPOGRAPHY} from './tokens';

export type ElectricalTheme = {
  colors: typeof ELECTRICAL_COLORS;
  format: typeof ELECTRICAL_FORMAT;
  motion: typeof ELECTRICAL_MOTION;
  typography: typeof ELECTRICAL_TYPOGRAPHY;
};

export const defaultElectricalTheme: ElectricalTheme = {
  colors: ELECTRICAL_COLORS,
  format: ELECTRICAL_FORMAT,
  motion: ELECTRICAL_MOTION,
  typography: ELECTRICAL_TYPOGRAPHY,
};

const ThemeContext = createContext<ElectricalTheme>(defaultElectricalTheme);

export const ElectricalThemeProvider: React.FC<{
  children: React.ReactNode;
  value?: Partial<ElectricalTheme>;
}> = ({children, value}) => {
  const merged: ElectricalTheme = {
    colors: {...defaultElectricalTheme.colors, ...value?.colors},
    format: {...defaultElectricalTheme.format, ...value?.format},
    motion: {...defaultElectricalTheme.motion, ...value?.motion},
    typography: {...defaultElectricalTheme.typography, ...value?.typography},
  };

  return <ThemeContext.Provider value={merged}>{children}</ThemeContext.Provider>;
};

export const useElectricalTheme = () => useContext(ThemeContext);
