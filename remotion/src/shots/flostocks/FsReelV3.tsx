import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame } from 'remotion';
import { FS, FS_EASE } from '../../lib/flostocks';
import { lerp, pulse } from '../../lib/flostocks-v2/fx';
import { ChatReal } from '../../lib/flostocks-v3/ChatReal';
import { Account, Analyzer, Bootcamp, Ignite, Research, Wall } from '../../lib/flostocks-v3/ScenesA';
import { Cta, Edge, Markets, Recap, Tools, Trust } from '../../lib/flostocks-v3/ScenesB';
import { BEATF, BARF, DROP, END, barF } from '../../lib/flostocks-v3/timing';

// =============================================================================
// COMPOSITION CONFIG — 1593 frames (53.1 s); the end card is appended in reelkit
// =============================================================================
export const compositionConfig = {
  id: 'FsReelV3',
  durationInSeconds: 53.1,
  fps: 30,
  width: 1080,
  height: 1920,
};

// =============================================================================
// TIMELINE — chat until the drop, then one scene per bar range (121 BPM grid)
// =============================================================================
type Tr = 'none' | 'whipUp' | 'whipLeft' | 'zoom' | 'circle';
type Scene = { C: React.FC<{ t: number }>; from: number; to: number; tin: Tr };

const SCENES: Scene[] = [
  { C: Ignite, from: 0, to: 2, tin: 'none' },
  { C: Wall, from: 2, to: 3, tin: 'zoom' },
  { C: Account, from: 3, to: 5, tin: 'whipUp' },
  { C: Bootcamp, from: 5, to: 7, tin: 'whipLeft' },
  { C: Analyzer, from: 7, to: 9, tin: 'circle' },
  { C: Research, from: 9, to: 11, tin: 'whipUp' },
  { C: Tools, from: 11, to: 13, tin: 'whipLeft' },
  { C: Edge, from: 13, to: 15, tin: 'zoom' },
  { C: Markets, from: 15, to: 17, tin: 'circle' },
  { C: Trust, from: 17, to: 19, tin: 'whipUp' },
  { C: Recap, from: 19, to: 21, tin: 'zoom' },
  { C: Cta, from: 21, to: 23, tin: 'circle' },
];
const T = 9; // transition overlap (frames)

const Wrap: React.FC<{ s: Scene; next?: Scene; lead: number; dur: number }> = ({ s, next, lead, dur }) => {
  const local = useCurrentFrame();
  const t = local - lead;
  const tf: string[] = [];
  let blur = 0;
  let opacity = 1;
  let clip: string | undefined;

  if (lead > 0 && local < lead) {
    const p = lerp(local, 0, lead, 0, 1, FS_EASE.out);
    if (s.tin === 'whipUp') tf.push(`translateY(${(1 - p) * 100}%)`);
    if (s.tin === 'whipLeft') tf.push(`translateX(${(1 - p) * 100}%)`);
    if (s.tin === 'zoom') {
      tf.push(`scale(${1.7 - p * 0.7})`);
      opacity = p;
    }
    if (s.tin === 'circle') clip = `circle(${p * 120}% at 50% 55%)`;
    blur = s.tin === 'circle' ? 0 : (1 - p) * 24;
  }
  const tout = next?.tin ?? 'none';
  if (tout !== 'none' && local >= dur - T) {
    const q = lerp(local, dur - T, dur, 0, 1, FS_EASE.in);
    if (tout === 'whipUp') tf.push(`translateY(${-q * 100}%)`);
    if (tout === 'whipLeft') tf.push(`translateX(${-q * 100}%)`);
    if (tout === 'zoom') {
      tf.push(`scale(${1 + q * 2})`);
      opacity = 1 - q;
    }
    if (tout === 'circle') tf.push(`scale(${1 - q * 0.08})`);
    blur = tout === 'circle' ? 0 : q * 24;
  }
  return (
    <AbsoluteFill
      style={{
        transform: tf.join(' ') || undefined,
        filter: blur > 0.5 ? `blur(${blur}px)` : undefined,
        opacity,
        clipPath: clip,
        overflow: 'hidden',
      }}
    >
      <s.C t={t} />
    </AbsoluteFill>
  );
};

const ChatSeq: React.FC = () => {
  const f = useCurrentFrame();
  return <ChatReal f={f} />;
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================
const FsReelV3: React.FC = () => {
  const frame = useCurrentFrame();
  const after = frame >= DROP;
  const bump = after ? pulse(frame, DROP, BEATF) : 0;
  const bar = after ? pulse(frame, DROP, BARF) : 0;
  const shakeX = Math.sin(frame * 3.1) * bar * 6;
  const shakeY = Math.cos(frame * 2.3) * bar * 4;

  return (
    <AbsoluteFill style={{ backgroundColor: FS.paper, overflow: 'hidden' }}>
      <Sequence from={0} durationInFrames={DROP} layout="none">
        <ChatSeq />
      </Sequence>
      <AbsoluteFill style={{ transform: `translate(${shakeX}px, ${shakeY}px) scale(${1 + bump * 0.01})` }}>
        {SCENES.map((s, i) => {
          const start = barF(s.from);
          const lead = s.tin === 'none' ? 0 : T;
          const from = start - lead;
          const end = barF(s.to);
          return (
            <Sequence key={i} from={from} durationInFrames={end - from} layout="none">
              <Wrap s={s} next={SCENES[i + 1]} lead={lead} dur={end - from} />
            </Sequence>
          );
        })}
      </AbsoluteFill>
      <AbsoluteFill style={{ background: 'radial-gradient(ellipse at center, transparent 68%, rgba(10,14,10,0.06) 100%)', pointerEvents: 'none' }} />
    </AbsoluteFill>
  );
};

export const V3_END = END;
export default FsReelV3;
