export const ELECTRICAL_FONT_FAMILY = 'Arial, Helvetica, sans-serif';

export const electricalFontWeight = {
  regular: 400,
  medium: 600,
  bold: 800,
  black: 950,
} as const;

export const electricalTextStyle = {
  kicker: {
    fontFamily: ELECTRICAL_FONT_FAMILY,
    fontWeight: electricalFontWeight.black,
    letterSpacing: 4,
    textTransform: 'uppercase' as const,
  },
  headline: {
    fontFamily: ELECTRICAL_FONT_FAMILY,
    fontWeight: electricalFontWeight.black,
    lineHeight: 1.03,
  },
  caption: {
    fontFamily: ELECTRICAL_FONT_FAMILY,
    fontWeight: electricalFontWeight.black,
    lineHeight: 1.08,
  },
} as const;
