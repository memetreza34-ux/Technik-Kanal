import React from 'react';
import {Audio, Sequence, staticFile} from 'remotion';

export type ElectricalSoundCue = {
  id: string;
  path: string;
  fromFrame: number;
  volume?: number;
};

export const ElectricalSoundLayer: React.FC<{
  voiceoverPath?: string;
  cues?: ElectricalSoundCue[];
}> = ({voiceoverPath, cues = []}) => (
  <>
    {voiceoverPath ? <Audio src={staticFile(voiceoverPath)} volume={1} /> : null}
    {cues.map((cue) => (
      <Sequence key={cue.id} from={cue.fromFrame}>
        <Audio src={staticFile(cue.path)} volume={cue.volume ?? 0.16} />
      </Sequence>
    ))}
  </>
);
