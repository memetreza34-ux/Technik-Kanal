import React from 'react';
import {Audio, Sequence, staticFile} from 'remotion';

export type ScienceSoundCue = {
  id: string;
  path: string;
  fromFrame: number;
  volume?: number;
};

export const ScienceSoundLayer: React.FC<{
  voiceoverPath?: string;
  // Musikteppich ist bereits beim Vorbereiten leise normalisiert, auf Videolänge gebracht und ein-/ausgeblendet.
  musicPath?: string;
  cues?: ScienceSoundCue[];
}> = ({voiceoverPath, musicPath, cues = []}) => (
  <>
    {voiceoverPath ? <Audio src={staticFile(voiceoverPath)} volume={1} /> : null}
    {musicPath ? <Audio src={staticFile(musicPath)} volume={1} /> : null}
    {cues.map((cue) => (
      <Sequence key={cue.id} from={cue.fromFrame}>
        <Audio src={staticFile(cue.path)} volume={cue.volume ?? 0.16} />
      </Sequence>
    ))}
  </>
);
