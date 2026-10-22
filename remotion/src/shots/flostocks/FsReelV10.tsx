import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame } from 'remotion';
import { ChatV10 } from '../../lib/flostocks-v10/ChatV10';
import { Brand, Learn, Market, Official, OpenAccount, Research, Tools } from '../../lib/flostocks-v10/ScenesV10a';
import { Cta, Montage, Regulated } from '../../lib/flostocks-v10/ScenesV10b';
import { DROP, TOTAL, barF } from '../../lib/flostocks-v10/timing';

// =============================================================================
// COMPOSITION CONFIG — 1294 frames (43.13 s), music: work/music_v10.py
// =============================================================================
export const compositionConfig = {
  id: 'FsReelV10',
  durationInSeconds: 43.1333,
  fps: 30,
  width: 1080,
  height: 1920,
};

// =============================================================================
// TIMELINE — chat over a slow music build; the punchline turns green on a beat and cuts
// straight to the logo animation ON the drop (0:11) → drop A, one bar per idea (market two)
// → Regulated across the break riser + stop bar → drop B feature montage → "All of PSX." on
// the build (riser + roll) → CTA on the drop → the beat goes silent for the logo + details.
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
const endF = (s: Scene) => (s.to > 17 ? TOTAL : barF(s.to));

const SceneSeq: React.FC<{ s: Scene }> = ({ s }) => <s.C t={useCurrentFrame()} />;
const ChatSeq: React.FC = () => <ChatV10 f={useCurrentFrame()} />;

const FsReelV10: React.FC = () => (
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

export default FsReelV10;
