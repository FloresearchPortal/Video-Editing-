// FLOSTOCKS · "Top 10 companies by market capitalization in PSX" — 9:16 reel, under 20 s, 140 BPM, flostocks.com look.
// Source + README: videos/psx-top10/. Timing: src/projects/psx-top10/timeline.json (shared with the
// music generator). Data: src/projects/psx-top10/data.json (videos/psx-top10/data/fetch_psx.py).
import React from 'react';
import { AbsoluteFill } from 'remotion';
import { Backdrop } from '../../projects/psx-top10/Backdrop';
import { Intro } from '../../projects/psx-top10/Intro';
import { Title } from '../../projects/psx-top10/Title';
import { Explain } from '../../projects/psx-top10/Explain';
import { Sort } from '../../projects/psx-top10/Sort';
import { Chart } from '../../projects/psx-top10/Chart';
import { Cta } from '../../projects/psx-top10/Cta';
import { Wipe } from '../../projects/psx-top10/Wipe';
import { C } from '../../projects/psx-top10/theme';
import { END_FRAME, S } from '../../projects/psx-top10/timeline';

// durationInSeconds must equal END_FRAME / 30 (cta.static_from beat + hold) — checked below.
export const compositionConfig = { id: 'PsxTop10', durationInSeconds: 18.6667, fps: 30, width: 1080, height: 1920 };
if (Math.round(compositionConfig.durationInSeconds * compositionConfig.fps) !== END_FRAME) {
  throw new Error(`PsxTop10: set durationInSeconds to ${(END_FRAME / 30).toFixed(4)} (timeline end frame ${END_FRAME})`);
}

const PsxTop10: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: C.paper }}>
    <Backdrop />
    <Explain />
    <Sort />
    <Chart />
    <Cta />
    <Wipe span={S.sort.wipe} />
    <Intro />
    <Title />
  </AbsoluteFill>
);
export default PsxTop10;
