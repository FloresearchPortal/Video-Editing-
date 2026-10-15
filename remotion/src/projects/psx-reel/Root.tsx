import React from 'react';
import { Composition } from 'remotion';
import '../../series/flostocks/theme'; // loads Poppins
import { PsxReel } from './PsxReel';
import { END_FRAME, FPS } from './timeline';

export const Root: React.FC = () => (
  <Composition id="PsxReel" component={PsxReel} durationInFrames={END_FRAME} fps={FPS} width={1080} height={1920} />
);
