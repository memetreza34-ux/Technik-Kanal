import React from 'react';
import {SCIENCE_COLORS, SCIENCE_FORMAT, SCIENCE_TYPOGRAPHY} from '@science/core';

export const ScienceSceneHeader: React.FC<{
  kicker?: string;
  headline: string;
  accent?: string;
}> = ({kicker, headline, accent = SCIENCE_COLORS.energy}) => (
  <div
    style={{
      position: 'absolute',
      top: SCIENCE_FORMAT.headlineSafeTop,
      left: SCIENCE_FORMAT.horizontalSafe,
      right: SCIENCE_FORMAT.horizontalSafe,
      zIndex: 20,
      textAlign: 'center',
    }}
  >
    {kicker ? (
      <div style={{fontFamily: SCIENCE_TYPOGRAPHY.family, fontSize: SCIENCE_TYPOGRAPHY.kicker, fontWeight: 950, letterSpacing: 4, color: accent, textTransform: 'uppercase'}}>
        {kicker}
      </div>
    ) : null}
    <div style={{marginTop: kicker ? 14 : 0, fontFamily: SCIENCE_TYPOGRAPHY.family, fontSize: SCIENCE_TYPOGRAPHY.headline, lineHeight: 1.03, fontWeight: 950, color: SCIENCE_COLORS.text, textShadow: '0 4px 18px rgba(0,0,0,.8)'}}>
      {headline}
    </div>
  </div>
);
