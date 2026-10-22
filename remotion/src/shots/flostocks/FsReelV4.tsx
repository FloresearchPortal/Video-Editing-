import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame } from 'remotion';
import { pulse } from '../../lib/flostocks-v2/fx';
import { ChatV4 } from '../../lib/flostocks-v4/ChatV4';
import { Analyze, HowItWorks, Identity, Learn, News, Wordmark } from '../../lib/flostocks-v4/ScenesV4a';
import { Everything, Markets, OneAccount, Outro, Regulated, Tools } from '../../lib/flostocks-v4/ScenesV4b';
import { Grain, Hud } from '../../lib/flostocks-v4/mkit';
import { BEATF, DROP, END, barF } from '../../lib/flostocks-v4/timing';

// =============================================================================
// COMPOSITION CONFIG — 1324 frames (44.13 s); the end card is appended in reelkit
// =============================================================================
export const compositionConfig = {
  id: 'FsReelV4',
  durationInSeconds: 44.1333,
  fps: 30,
  width: 1080,
  height: 1920,
};

// =============================================================================
// TIMELINE — natural-pace chat, green flood into the drop, then hard cuts on bar
// lines through flat colour fields (121 BPM grid). HUD + grain over the showreel.
// =============================================================================
type Scene = { C: React.FC<{ t: number }>; from: number; to: number; label: string; tone: 'dark' | 'light' };
const SCENES: Scene[] = [
  { C: News, from: 0, to: 2, label: '01 · THE NEWS', tone: 'light' },
  { C: Identity, from: 2, to: 3, label: '02 · IDENTITY', tone: 'light' },
  { C: Wordmark, from: 3, to: 4, label: '03 · WORDMARK', tone: 'dark' },
  { C: HowItWorks, from: 4, to: 6, label: '04 · HOW IT WORKS', tone: 'dark' },
  { C: Learn, from: 6, to: 7, label: '05 · LEARN', tone: 'light' },
  { C: Analyze, from: 7, to: 8, label: '06 · ANALYZE', tone: 'light' },
  { C: Markets, from: 8, to: 10, label: '07 · MARKETS', tone: 'dark' },
  { C: OneAccount, from: 10, to: 11, label: '08 · ONE ACCOUNT', tone: 'light' },
  { C: Tools, from: 11, to: 12, label: '09 · TOOLS', tone: 'dark' },
  { C: Regulated, from: 12, to: 13, label: '10 · REGULATED', tone: 'light' },
  { C: Everything, from: 13, to: 14, label: '11 · EVERYTHING', tone: 'dark' },
  { C: Outro, from: 14, to: 16, label: '12 · FLOSTOCKS', tone: 'dark' },
];

const SceneSeq: React.FC<{ s: Scene }> = ({ s }) => {
  const t = useCurrentFrame();
  return <s.C t={t} />;
};
const ChatSeq: React.FC = () => <ChatV4 f={useCurrentFrame()} />;

const FsReelV4: React.FC = () => {
  const frame = useCurrentFrame();
  const cur = SCENES.find((s) => frame >= barF(s.from) && frame < barF(s.to));
  const bump = frame >= DROP ? pulse(frame, DROP, BEATF) : 0;
  return (
    <AbsoluteFill style={{ backgroundColor: '#fff', overflow: 'hidden' }}>
      <Sequence from={0} durationInFrames={DROP} layout="none">
        <ChatSeq />
      </Sequence>
      <AbsoluteFill style={{ transform: `scale(${1 + bump * 0.006})` }}>
        {SCENES.map((s, i) => (
          <Sequence key={i} from={barF(s.from)} durationInFrames={barF(s.to) - barF(s.from)} layout="none">
            <SceneSeq s={s} />
          </Sequence>
        ))}
      </AbsoluteFill>
      {cur && (
        <>
          <Grain frame={frame} dark={cur.tone === 'light'} />
          <Hud frame={frame} label={cur.label} tone={cur.tone} />
        </>
      )}
    </AbsoluteFill>
  );
};

export const V4_END = END;
export default FsReelV4;
