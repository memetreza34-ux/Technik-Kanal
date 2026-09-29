import React from 'react';
import {ELECTRICAL_COLORS, ELECTRICAL_FORMAT, ELECTRICAL_TYPOGRAPHY} from '@elektrotechnik/core';

export const ElectricalSceneHeader: React.FC<{
  kicker?: string;
  headline: string;
  accent?: string;
}> = ({kicker, headline, accent = ELECTRICAL_COLORS.current}) => (
  <div
    style={{
      position: 'absolute',
      top: ELECTRICAL_FORMAT.headlineSafeTop,
      left: ELECTRICAL_FORMAT.horizontalSafe,
      right: ELECTRICAL_FORMAT.horizontalSafe,
      zIndex: 20,
      textAlign: 'center',
    }}
  >
    {kicker ? (
      <div style={{fontFamily: ELECTRICAL_TYPOGRAPHY.family, fontSize: ELECTRICAL_TYPOGRAPHY.kicker, fontWeight: 950, letterSpacing: 4, color: accent, textTransform: 'uppercase'}}>
        {kicker}
      </div>
    ) : null}
    <div style={{marginTop: kicker ? 14 : 0, fontFamily: ELECTRICAL_TYPOGRAPHY.family, fontSize: ELECTRICAL_TYPOGRAPHY.headline, lineHeight: 1.03, fontWeight: 950, color: ELECTRICAL_COLORS.text, textShadow: '0 4px 18px rgba(0,0,0,.8)'}}>
      {headline}
    </div>
  </div>
);
