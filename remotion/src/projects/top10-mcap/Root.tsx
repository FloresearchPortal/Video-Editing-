import React from 'react';
import { Composition } from 'remotion';
import '../../series/flostocks/theme'; // loads Poppins
import { Top10Episode, frames } from '../../series/top10/Top10Episode';
import { EPISODE, TIMELINE } from './episode';

export const Root: React.FC = () => (
  <Composition id="Top10" component={Top10Episode} durationInFrames={frames(TIMELINE).end} fps={TIMELINE.fps} width={1080} height={1920}
    defaultProps={{ episode: EPISODE, tl: TIMELINE }} />
);
