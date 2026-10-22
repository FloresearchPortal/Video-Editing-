import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame } from 'remotion';
import { ChatV8 } from '../../lib/flostocks-v8/ChatV8';
import { Brand, Learn, Market, Official, OpenAccount, Research, Tools } from '../../lib/flostocks-v8/ScenesV8a';
import { Cta, Montage, Regulated } from '../../lib/flostocks-v8/ScenesV8b';
import { DROP, TOTAL, barF } from '../../lib/flostocks-v8/timing';

// =============================================================================
// COMPOSITION CONFIG — 1430 frames (47.67 s), music: work/music_v8.py
// =============================================================================
export const compositionConfig = {
  id: 'FsReelV8',
  durationInSeconds: 47.6667,
  fps: 30,
  width: 1080,
  height: 1920,
};

// =============================================================================
// TIMELINE — chat (silent; the punchline lands on a beat, turns green on the last hit,
// opens in the stop) → DROP on the logo → drop A, one bar per idea → Regulated across the
// break + stop bar → drop B fast feature montage → CTA + outro with disclaimer.
// =============================================================================
type Scene = { C: React.FC<{ t: number }>; from: number; to: number };
const SCENES: Scene[] = [
  { C: Brand, from: 0, to: 1 },
  { C: Official, from: 1, to: 2 },
  { C: Market, from: 2, to: 4 },
  { C: OpenAccount, from: 4, to: 5 },
  { C: Learn, from: 5, to: 6 },
  { C: Research, from: 6, to: 7 },
  { C: Tools, from: 7, to: 8 },
  { C: Regulated, from: 8, to: 10 },
  { C: Montage, from: 10, to: 14 },
  { C: Cta, from: 14, to: 99 },
];
const startF = (s: Scene) => barF(s.from);
const endF = (s: Scene) => (s.to > 18 ? TOTAL : barF(s.to));

const SceneSeq: React.FC<{ s: Scene }> = ({ s }) => <s.C t={useCurrentFrame()} />;
const ChatSeq: React.FC = () => <ChatV8 f={useCurrentFrame()} />;

const FsReelV8: React.FC = () => (
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

export default FsReelV8;
