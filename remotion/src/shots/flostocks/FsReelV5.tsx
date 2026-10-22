import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame } from 'remotion';
import { ChatV5 } from '../../lib/flostocks-v5/ChatV5';
import { Analyze, HowItWorks, Identity, Learn, News, Wordmark } from '../../lib/flostocks-v5/ScenesV5a';
import { Cta, Hype, Markets, OneAccount, Regulated, Tools } from '../../lib/flostocks-v5/ScenesV5b';
import { Grain, Hud } from '../../lib/flostocks-v5/mkit';
import { DROP, barF } from '../../lib/flostocks-v5/timing';

// =============================================================================
// COMPOSITION CONFIG — 1360 frames (45.33 s): chat → 17-bar showreel → CTA hold
// =============================================================================
export const compositionConfig = {
  id: 'FsReelV5',
  durationInSeconds: 45.3333,
  fps: 30,
  width: 1080,
  height: 1920,
};
const TOTAL = 1360;

// =============================================================================
// TIMELINE — silent natural-pace chat, fast green flood into the drop, then hard
// cuts on bar lines (128 BPM). Hype on bars 12–14 ends on the music's hard stop;
// the CTA lands on bar 14 and holds through the closing chord.
// =============================================================================
type Scene = { C: React.FC<{ t: number }>; from: number; to: number; label: string; tone: 'dark' | 'light' };
const SCENES: Scene[] = [
  { C: News, from: 0, to: 1, label: '01 · THE NEWS', tone: 'light' },
  { C: Identity, from: 1, to: 2, label: '02 · IDENTITY', tone: 'light' },
  { C: Wordmark, from: 2, to: 3, label: '03 · WORDMARK', tone: 'dark' },
  { C: HowItWorks, from: 3, to: 5, label: '04 · HOW IT WORKS', tone: 'dark' },
  { C: Learn, from: 5, to: 6, label: '05 · LEARN', tone: 'light' },
  { C: Analyze, from: 6, to: 7, label: '06 · ANALYZE', tone: 'light' },
  { C: Markets, from: 7, to: 9, label: '07 · PSX BOARD', tone: 'dark' },
  { C: OneAccount, from: 9, to: 10, label: '08 · THE WHOLE PSX', tone: 'light' },
  { C: Tools, from: 10, to: 11, label: '09 · TOOLS', tone: 'dark' },
  { C: Regulated, from: 11, to: 12, label: '10 · REGULATED', tone: 'light' },
  { C: Hype, from: 12, to: 14, label: '11 · EVERYTHING PSX', tone: 'light' },
  { C: Cta, from: 14, to: 99, label: '12 · OPEN YOUR ACCOUNT', tone: 'dark' },
];
const startF = (s: Scene) => barF(s.from);
const endF = (s: Scene) => (s.to > 17 ? TOTAL : barF(s.to));
const IMPACTS = [barF(12), barF(14)]; // no flash on the drop: the chat zoom hands off smoothly

const SceneSeq: React.FC<{ s: Scene }> = ({ s }) => {
  const t = useCurrentFrame();
  return <s.C t={t} />;
};
const ChatSeq: React.FC = () => <ChatV5 f={useCurrentFrame()} />;

const FsReelV5: React.FC = () => {
  const frame = useCurrentFrame();
  const cur = SCENES.find((s) => frame >= startF(s) && frame < endF(s));
  const imp = IMPACTS.map((f) => frame - f).find((d) => d >= 0 && d < 6);
  return (
    <AbsoluteFill style={{ backgroundColor: '#fff', overflow: 'hidden' }}>
      <Sequence from={0} durationInFrames={DROP} layout="none">
        <ChatSeq />
      </Sequence>
      <AbsoluteFill>
        {SCENES.map((s, i) => (
          <Sequence key={i} from={startF(s)} durationInFrames={endF(s) - startF(s)} layout="none">
            <SceneSeq s={s} />
          </Sequence>
        ))}
      </AbsoluteFill>
      {imp !== undefined && <AbsoluteFill style={{ backgroundColor: '#fff', opacity: 0.55 * (1 - imp / 6), pointerEvents: 'none' }} />}
      {cur && (
        <>
          <Grain frame={frame} dark={cur.tone === 'light'} />
          {cur.C !== Cta && <Hud frame={frame} label={cur.label} tone={cur.tone} />}
        </>
      )}
    </AbsoluteFill>
  );
};

export default FsReelV5;
