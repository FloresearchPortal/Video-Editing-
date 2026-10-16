// PSX TOP 10 — one generic entry for every episode. The episode is a brief (plain JSON) passed as input
// props by scripts/top10.mjs; the default is EP 01 so Studio previews something real.
import React from 'react';
import { Composition } from 'remotion';
import '../../series/flostocks/theme'; // loads Poppins
import { Top10Episode, frames } from '../../series/top10/Top10Episode';
import { fromBrief, type Brief } from '../../series/top10/brief';
import type { Timeline } from '../../series/top10/types';
import tl from '../../series/top10/timeline.json';
import ep01 from '../../../../videos/top10/ep01-market-cap/brief.json';

const TL = tl as unknown as Timeline;
const FromBrief: React.FC<{ brief: Brief }> = ({ brief }) => <Top10Episode episode={fromBrief(brief)} tl={TL} />;

export const Root: React.FC = () => (
  <Composition id="Top10" component={FromBrief} durationInFrames={frames(TL).end} fps={TL.fps} width={1080} height={1920}
    defaultProps={{ brief: ep01 as unknown as Brief }} />
);
