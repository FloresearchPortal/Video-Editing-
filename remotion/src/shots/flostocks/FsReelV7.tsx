import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame } from 'remotion';
import { ChatV7 } from '../../lib/flostocks-v7/ChatV7';
import { Brand, Learn, Market, OpenAccount } from '../../lib/flostocks-v7/ScenesV7a';
import { Cta, Everything, Regulated, Research, Tools } from '../../lib/flostocks-v7/ScenesV7b';
import { DROP, TOTAL, barF } from '../../lib/flostocks-v7/timing';

// =============================================================================
// COMPOSITION CONFIG — 1490 frames (49.67 s), music: work/music_v7.py
// =============================================================================
export const compositionConfig = {
  id: 'FsReelV7',
  durationInSeconds: 49.6667,
  fps: 30,
  width: 1080,
  height: 1920,
};

// =============================================================================
// TIMELINE — premium Apple-style UI × dynamic fintech motion, cut on the launch edit:
// chat (silent) → bubble opens into FloStocks on the DROP → drop A (brand, market, open,
// learn) → break (research, tools) → stop bar (regulated) → drop B (bento) → CTA + outro.
// =============================================================================
type Scene = { C: React.FC<{ t: number }>; from: number; to: number };
const SCENES: Scene[] = [
  { C: Brand, from: 0, to: 2 },
  { C: Market, from: 2, to: 4 },
  { C: OpenAccount, from: 4, to: 6 },
  { C: Learn, from: 6, to: 8 },
  { C: Research, from: 8, to: 9 },
  { C: Tools, from: 9, to: 10 },
  { C: Regulated, from: 10, to: 11 },
  { C: Everything, from: 11, to: 15 },
  { C: Cta, from: 15, to: 99 },
];
const startF = (s: Scene) => barF(s.from);
const endF = (s: Scene) => (s.to > 20 ? TOTAL : barF(s.to));

const SceneSeq: React.FC<{ s: Scene }> = ({ s }) => <s.C t={useCurrentFrame()} />;
const ChatSeq: React.FC = () => <ChatV7 f={useCurrentFrame()} />;

const FsReelV7: React.FC = () => (
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

export default FsReelV7;
