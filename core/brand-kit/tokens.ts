export const ELECTRICAL_COLORS = {
  background: '#03101f',
  surface: '#081d34',
  surfaceElevated: '#0d2b49',
  current: '#2ac7ff',
  currentSoft: '#72e6ff',
  explanation: '#ffc857',
  overload: '#ff8c42',
  fault: '#ff4d5e',
  success: '#49d17d',
  text: '#f4fbff',
  muted: '#9fb8ca',
} as const;

export const ELECTRICAL_TYPOGRAPHY = {
  family: 'Arial, Helvetica, sans-serif',
  kicker: 27,
  headline: 68,
  caption: 56,
  body: 38,
  label: 30,
} as const;

export const ELECTRICAL_FORMAT = {
  width: 1080,
  height: 1920,
  fps: 30,
  headlineSafeTop: 90,
  captionBottom: 285,
  horizontalSafe: 72,
} as const;

export const ELECTRICAL_MOTION = {
  shortFrames: 8,
  normalFrames: 14,
  imageScaleStart: 1,
  imageScaleEnd: 1.035,
  imagePanPixels: 12,
} as const;

export const ELECTRICAL_SHADOWS = {
  panel: '0 28px 70px rgba(0,0,0,.38)',
  text: '0 4px 5px rgba(0,0,0,1), 0 0 16px rgba(0,0,0,.95)',
} as const;

export type ElectricalAccent = keyof Pick<
  typeof ELECTRICAL_COLORS,
  'current' | 'explanation' | 'overload' | 'fault' | 'success'
>;
