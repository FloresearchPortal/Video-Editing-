// FLOSTOCKS · "Top 10 companies by market capitalization in PSX" — 9:16 reel, 128 BPM.
// Source + README: videos/psx-top10/. Timing: src/projects/psx-top10/timeline.json (shared with the
// music generator). Data: src/projects/psx-top10/data.json (videos/psx-top10/data/fetch_psx.py).
import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { Backdrop } from '../../projects/psx-top10/Backdrop';
import { Hook } from '../../projects/psx-top10/Hook';
import { Explain } from '../../projects/psx-top10/Explain';
import { Ranker } from '../../projects/psx-top10/Ranker';
import { Ranking } from '../../projects/psx-top10/Ranking';
import { Cta } from '../../projects/psx-top10/Cta';
import { C, FONT, life } from '../../projects/psx-top10/theme';
import { bf, S, END_FRAME, SOURCE_LINE } from '../../projects/psx-top10/timeline';

// durationInSeconds must equal END_FRAME / 30 (cta.static_from beat + hold) — checked below.
export const compositionConfig = { id: 'PsxTop10', durationInSeconds: 43.7667, fps: 30, width: 1080, height: 1920 };
if (Math.round(compositionConfig.durationInSeconds * compositionConfig.fps) !== END_FRAME) {
  throw new Error(`PsxTop10: set durationInSeconds to ${(END_FRAME / 30).toFixed(4)} (timeline end frame ${END_FRAME})`);
}

const Source: React.FC = () => {
  const f = useCurrentFrame();
  if (f < bf(S.countdown.start) - 8 || f > bf(S.cta.start) + 10) return null;
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, top: 1606, textAlign: 'center', fontFamily: FONT.mono, fontWeight: 500, fontSize: 23, letterSpacing: 1, color: C.grey, ...life(f, bf(S.countdown.start) - 6, bf(S.cta.start) - 2, 20) }}>
      {SOURCE_LINE}
    </div>
  );
};

const PsxTop10: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: C.paper }}>
    <Backdrop />
    <Explain />
    <Source />
    <Ranker />
    <Ranking />
    <Cta />
    <Hook />
  </AbsoluteFill>
);
export default PsxTop10;
