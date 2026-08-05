import React from 'react';
import {Composition} from 'remotion';
import {ElectricalLayoutGallery} from './engine/LayoutGallery';

export const LayoutGalleryRoot: React.FC = () => (
  <Composition
    id="ElectricalLayoutGallery"
    component={ElectricalLayoutGallery}
    durationInFrames={300}
    fps={30}
    width={1080}
    height={1920}
  />
);
