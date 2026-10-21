import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame } from 'remotion';
import { FS, FS_EASE } from '../../lib/flostocks';
import { lerp, pulse } from '../../lib/flostocks-v2/fx';
import { ChatScene } from '../../lib/flostocks-v2/ChatScene';
import { DropScene } from '../../lib/flostocks-v2/DropScene';
import { LogoScene } from '../../lib/flostocks-v2/LogoScene';
import { TradeScene } from '../../lib/flostocks-v2/TradeScene';
import { FeaturesScene } from '../../lib/flostocks-v2/FeaturesScene';
import { TrustScene } from '../../lib/flostocks-v2/TrustScene';
import { CtaScene } from '../../lib/flostocks-v2/CtaScene';

// =============================================================================
// COMPOSITION CONFIG
// =============================================================================
export const compositionConfig = {
  id: 'FsReelV2',
  durationInSeconds: 40,
  fps: 30,
  width: 1080,
  height: 1920,
};

// =============================================================================
// TIMELINE — 150 BPM: 12 frames per beat, 48 per bar. Scene cuts sit on bar lines.
// =============================================================================
const DROP = 240; // the beat drops as the chat dives into the phone
const T = 8; // transition overlap (frames)

type Tr = 'none' | 'whip' | 'zoom' | 'slide';
type Scene = { C: React.FC<{ t: number }>; start: number; end: number; tin: Tr; tout: Tr };

const SCENES: Scene[] = [
  { C: ChatScene, start: 0, end: 240, tin: 'none', tout: 'zoom' },
  { C: DropScene, start: 240, end: 432, tin: 'zoom', tout: 'zoom' },
  { C: LogoScene, start: 432, end: 528, tin: 'zoom', tout: 'whip' },
  { C: TradeScene, start: 528, end: 768, tin: 'whip', tout: 'slide' },
  { C: FeaturesScene, start: 768, end: 960, tin: 'slide', tout: 'whip' },
  { C: TrustScene, start: 960, end: 1056, tin: 'whip', tout: 'zoom' },
  { C: CtaScene, start: 1056, end: 1200, tin: 'zoom', tout: 'none' },
];

// brand-green flashes on the big hits
const FLASHES = [DROP, 336, 432, 1056];

const Wrap: React.FC<{ s: Scene; lead: number; dur: number }> = ({ s, lead, dur }) => {
  const local = useCurrentFrame();
  const t = local - lead;
  const transforms: string[] = [];
  let blur = 0;
  let opacity = 1;

  if (lead > 0 && local < lead) {
    const p = lerp(local, 0, lead, 0, 1, FS_EASE.out);
    if (s.tin === 'whip') transforms.push(`translateY(${(1 - p) * 100}%)`);
    if (s.tin === 'slide') transforms.push(`translateX(${(1 - p) * 100}%)`);
    if (s.tin === 'zoom') {
      transforms.push(`scale(${1.6 - p * 0.6})`);
      opacity = p;
    }
    blur = (1 - p) * 26;
  }
  if (s.tout !== 'none' && local >= dur - T) {
    const q = lerp(local, dur - T, dur, 0, 1, FS_EASE.in);
    if (s.tout === 'whip') transforms.push(`translateY(${-q * 100}%)`);
    if (s.tout === 'slide') transforms.push(`translateX(${-q * 100}%)`);
    if (s.tout === 'zoom') {
      transforms.push(`scale(${1 + q * 2.2})`);
      opacity = 1 - q;
    }
    blur = q * 26;
  }

  return (
    <AbsoluteFill
      style={{
        transform: transforms.join(' ') || undefined,
        filter: blur > 0.5 ? `blur(${blur}px)` : undefined,
        opacity,
        overflow: 'hidden',
      }}
    >
      <s.C t={t} />
    </AbsoluteFill>
  );
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================
const FsReelV2: React.FC = () => {
  const frame = useCurrentFrame();
  const bump = frame >= DROP ? pulse(frame, DROP) : 0;
  const bar = frame >= DROP ? pulse(frame, DROP, 48) : 0;
  const shakeX = Math.sin(frame * 3.1) * bar * 7;
  const shakeY = Math.cos(frame * 2.3) * bar * 5;
  const flash = Math.max(0, ...FLASHES.map((f) => (frame >= f - 2 && frame < f + 10 ? lerp(frame, f - 2, f + 10, 0.45, 0) : 0)));

  return (
    <AbsoluteFill style={{ backgroundColor: FS.paper, overflow: 'hidden' }}>
      <AbsoluteFill style={{ transform: `translate(${shakeX}px, ${shakeY}px) scale(${1 + bump * 0.012})` }}>
        {SCENES.map((s, i) => {
          const lead = i === 0 ? 0 : T;
          const from = s.start - lead;
          return (
            <Sequence key={i} from={from} durationInFrames={s.end - from} layout="none">
              <Wrap s={s} lead={lead} dur={s.end - from} />
            </Sequence>
          );
        })}
      </AbsoluteFill>
      <AbsoluteFill style={{ backgroundColor: FS.green, opacity: flash, pointerEvents: 'none' }} />
      <AbsoluteFill
        style={{
          background: 'radial-gradient(ellipse at center, transparent 66%, rgba(10,14,10,0.07) 100%)',
          pointerEvents: 'none',
        }}
      />
    </AbsoluteFill>
  );
};

export default FsReelV2;
