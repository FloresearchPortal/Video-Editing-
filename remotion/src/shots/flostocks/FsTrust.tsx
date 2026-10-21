import React from 'react';
import {
  useCurrentFrame,
  interpolate,
  AbsoluteFill,
} from 'remotion';
import { CLAMP, FS, FS_EASE, FS_BODY, FS_MONO, FsDarkBg, FsWatermark, fsHeadline } from '../../lib/flostocks';

// =============================================================================
// COMPOSITION CONFIG
// =============================================================================
export const compositionConfig = {
  id: 'FsTrust',
  durationInSeconds: 6,
  fps: 30,
  width: 1080,
  height: 1920,
};

// =============================================================================
// PRE-GENERATED DATA — regulatory facts from flostocks.com
// =============================================================================
const BADGES = [
  'SECP licensed',
  'PSX TREC Holder 535',
  'Member PSX & PMEX',
  'Research Entity licence',
] as const;

const Check: React.FC<{ progress: number }> = ({ progress }) => {
  const len = 60;
  return (
    <svg width="54" height="54" viewBox="0 0 54 54">
      <circle cx="27" cy="27" r="25" fill={FS.green} />
      <path
        d="M15 28 L24 37 L40 19"
        fill="none"
        stroke={FS.ink}
        strokeWidth={6}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={len}
        strokeDashoffset={len * (1 - progress)}
      />
    </svg>
  );
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================
const FsTrust: React.FC = () => {
  const frame = useCurrentFrame();
  const r = (a: number, b: number, from = 0, to = 1, easing = FS_EASE.out) =>
    interpolate(frame, [a, b], [from, to], { ...CLAMP, easing });

  return (
    <AbsoluteFill style={{ backgroundColor: FS.ink }}>
      <FsDarkBg glow={0.18} />

      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '0 80px',
        }}
      >
        <h1 style={{ ...fsHeadline(116, FS.paper), opacity: r(0, 8), transform: `scale(${r(0, 12, 1.5, 1, FS_EASE.slam)})` }}>
          Built on trust.
        </h1>
        <h1 style={{ ...fsHeadline(116, FS.green), marginTop: 8, opacity: r(10, 18), transform: `scale(${r(10, 22, 1.5, 1, FS_EASE.slam)})` }}>
          Backed by
        </h1>
        <h1 style={{ ...fsHeadline(116, FS.green), opacity: r(10, 18), transform: `scale(${r(10, 22, 1.5, 1, FS_EASE.slam)})` }}>
          regulation.
        </h1>

        <div style={{ marginTop: 90, display: 'flex', flexDirection: 'column', gap: 30, width: 860 }}>
          {BADGES.map((b, i) => {
            const at = 34 + i * 16;
            return (
              <div
                key={b}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 34,
                  padding: '26px 44px',
                  borderRadius: 999,
                  border: '1.5px solid rgba(126,220,168,0.4)',
                  backgroundColor: 'rgba(56,209,0,0.07)',
                  opacity: r(at, at + 10),
                  transform: `translateX(${r(at, at + 14, i % 2 === 0 ? -90 : 90, 0)}px)`,
                }}
              >
                <Check progress={r(at + 6, at + 20)} />
                <p style={{ margin: 0, fontFamily: FS_BODY, fontWeight: 600, fontSize: 46, color: FS.paper }}>{b}</p>
              </div>
            );
          })}
        </div>

        <p
          style={{
            margin: '80px 0 0',
            fontFamily: FS_MONO,
            fontWeight: 500,
            fontSize: 32,
            letterSpacing: '0.2em',
            color: FS.mint,
            opacity: r(110, 126, 0, 0.95),
          }}
        >
          FORMERLY FLORET COMMODITIES
        </p>
      </div>

      <FsWatermark width={1080} />
    </AbsoluteFill>
  );
};

export default FsTrust;
