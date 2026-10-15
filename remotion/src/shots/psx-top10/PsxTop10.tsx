// FLOSTOCKS EXPLAINS · EP 01 — "Top 10 companies by market capitalization in PSX". 9:16, 140 BPM.
// Built from the series kit (src/series/flostocks); episode timing in src/projects/psx-top10/timeline.json
// (shared with the music generator), data in data.json (videos/psx-top10/data/fetch_psx.py).
import React from 'react';
import { AbsoluteFill } from 'remotion';
import { C } from '../../series/flostocks/theme';
import { Backdrop } from '../../series/flostocks/Backdrop';
import { BrandWipe, SWAP } from '../../series/flostocks/BrandWipe';
import { EpisodeCard } from '../../series/flostocks/EpisodeCard';
import { Leaderboard } from '../../series/flostocks/Leaderboard';
import { TickerStrip } from '../../series/flostocks/TickerStrip';
import { EndCard } from '../../series/flostocks/EndCard';
import { Hook } from '../../projects/psx-top10/Hook';
import { Concept } from '../../projects/psx-top10/Concept';
import { Logo } from '../../projects/psx-top10/Logo';
import { bf, DATA, END_FRAME, CTA_STATIC, HAS_LOGOS, S, SOURCE_LINE, TOP, WIPES } from '../../projects/psx-top10/timeline';

// durationInSeconds must equal END_FRAME / 30 (cta.static_from beat + hold) — checked below.
export const compositionConfig = { id: 'PsxTop10', durationInSeconds: 17.0333, fps: 30, width: 1080, height: 1920 };
if (Math.round(compositionConfig.durationInSeconds * compositionConfig.fps) !== END_FRAME) {
  throw new Error(`PsxTop10: set durationInSeconds to ${(END_FRAME / 30).toFixed(4)} (timeline end frame ${END_FRAME})`);
}

const swap = (i: number) => bf(WIPES[i]) + SWAP;

const PsxTop10: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: C.paper }}>
    <Backdrop />
    <Hook />
    <EpisodeCard from={swap(0)} to={swap(1)} ep="EP 01" word="TOP" number={10} subtitle="companies by market capitalization" label="PAKISTAN STOCK EXCHANGE" />
    <Concept />
    <Leaderboard from={swap(2)} to={swap(3)} rowAt={(rank) => bf(S.board.first_row + (10 - rank))}
      rows={TOP.map((c) => ({ rank: c.rank, ticker: c.ticker, value: c.mcap_bn }))}
      title="PSX · TOP 10 BY MARKET CAP" sub={`Market capitalization · close ${DATA.close_date}`} unit="bn" currency="Rs"
      total={{ label: 'TOP 10 COMBINED', value: `Rs ${(DATA.total_bn / 1000).toFixed(2)} trillion`, at: bf(S.board.total) }}
      source={SOURCE_LINE} logo={HAS_LOGOS ? (t) => <Logo ticker={t} maxW={74} maxH={54} /> : undefined} />
    <TickerStrip items={TOP.map((c) => ({ ticker: c.ticker, value: c.mcap_bn, unit: 'bn' }))} from={swap(1)} to={swap(3) - 8} />
    <EndCard from={swap(3)} settle={CTA_STATIC} />
    <BrandWipe at={-SWAP} />
    {WIPES.map((w) => <BrandWipe key={w} at={bf(w)} />)}
  </AbsoluteFill>
);
export default PsxTop10;
