import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame } from 'remotion';
import { ChatV9 } from '../../lib/flostocks-v9/ChatV9';
import { Brand, Learn, MarketFast, Official, OpenAccount, ResearchTools } from '../../lib/flostocks-v9/ScenesV9a';
import { Abroad, Cta, Montage, Regulated } from '../../lib/flostocks-v9/ScenesV9b';
import { DROP, TOTAL, barF } from '../../lib/flostocks-v9/timing';

// =============================================================================
// COMPOSITION CONFIG — 1240 frames (41.33 s), music: work/music_v9.py
// =============================================================================
export const compositionConfig = {
  id: 'FsReelV9',
  durationInSeconds: 41.3333,
  fps: 30,
  width: 1080,
  height: 1920,
};

// =============================================================================
// TIMELINE — chat over a slow music build (from "Wo tou…"), green on a beat at the loud end of
// the build, the green bubble opens and cuts to the logo ON the drop (0:11) → drop A, fast
// cuts → Regulated on the stop bar → drop B feature montage → "Why just look abroad…" build →
// CTA on the drop → the beat goes silent for the logo, licence line and disclaimer.
// =============================================================================
type Scene = { C: React.FC<{ t: number }>; from: number; to: number };
const SCENES: Scene[] = [
  { C: Brand, from: 0, to: 1 },
  { C: Official, from: 1, to: 2 },
  { C: MarketFast, from: 2, to: 3 },
  { C: OpenAccount, from: 3, to: 4 },
  { C: Learn, from: 4, to: 5 },
  { C: ResearchTools, from: 5, to: 6 },
  { C: Regulated, from: 6, to: 7 },
  { C: Montage, from: 7, to: 11 },
  { C: Abroad, from: 11, to: 13 },
  { C: Cta, from: 13, to: 99 },
];
const startF = (s: Scene) => barF(s.from);
const endF = (s: Scene) => (s.to > 16 ? TOTAL : barF(s.to));

const SceneSeq: React.FC<{ s: Scene }> = ({ s }) => <s.C t={useCurrentFrame()} />;
const ChatSeq: React.FC = () => <ChatV9 f={useCurrentFrame()} />;

const FsReelV9: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: '#fff', overflow: 'hidden' }}>
    <Sequence from={0} durationInFrames={DROP} layout="none">
      <ChatSeq />
    </Sequence>
    {SCENES.map((s, i) => (
      <Sequence key={i} from={startF(s)} durationInFrames={endF(s) - startF(s)} layout="none">
        <SceneSeq s={s} />
      </Sequence>
    ))}
  </AbsoluteFill>
);

export default FsReelV9;
