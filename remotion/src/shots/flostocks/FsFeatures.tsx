import React from 'react';
import {
  useCurrentFrame,
  interpolate,
  AbsoluteFill,
} from 'remotion';
import { CLAMP, FS, FS_EASE, FS_BODY, FS_MONO, FsWatermark, fsHeadline } from '../../lib/flostocks';

// =============================================================================
// COMPOSITION CONFIG
// =============================================================================
export const compositionConfig = {
  id: 'FsFeatures',
  durationInSeconds: 8,
  fps: 30,
  width: 1080,
  height: 1920,
};

// =============================================================================
// PRE-GENERATED DATA — what flostocks.com actually offers
// =============================================================================
const FEATURES = [
  { n: '01', title: 'Open your PSX account', sub: '100% digital onboarding' },
  { n: '02', title: 'PSX Bootcamp', sub: '6 free lessons · guides · ebook' },
  { n: '03', title: 'PSX Analyzer', sub: 'score any listed company' },
  { n: '04', title: 'Research Desk', sub: 'equity notes & IPO analysis' },
  { n: '05', title: 'Smart calculators', sub: 'commission · SIP · CGT' },
] as const;

const HEAD_END = 52;

// =============================================================================
// MAIN COMPONENT — light frame, staggered feature rows
// =============================================================================
const FsFeatures: React.FC = () => {
  const frame = useCurrentFrame();
  const r = (a: number, b: number, from = 0, to = 1, easing = FS_EASE.out) =>
    interpolate(frame, [a, b], [from, to], { ...CLAMP, easing });

  return (
    <AbsoluteFill style={{ backgroundColor: FS.paper }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(900px 700px at 50% -8%, rgba(56,209,0,0.12), transparent 60%)`,
        }}
      />

      <div style={{ position: 'absolute', inset: 0, padding: '220px 80px 0' }}>
        <p
          style={{
            margin: 0,
            fontFamily: FS_MONO,
            fontWeight: 600,
            fontSize: 32,
            letterSpacing: '0.32em',
            color: FS.greenDeep,
            opacity: r(0, 10),
          }}
        >
          FLOSTOCKS.COM
        </p>
        <h1 style={{ ...fsHeadline(108, FS.ink), marginTop: 26, opacity: r(4, 12), transform: `scale(${r(4, 16, 1.4, 1, FS_EASE.slam)})`, transformOrigin: 'left center' }}>
          Everything
        </h1>
        <h1 style={{ ...fsHeadline(108, FS.ink), opacity: r(12, 20), transform: `scale(${r(12, 24, 1.4, 1, FS_EASE.slam)})`, transformOrigin: 'left center' }}>
          you need{' '}
          <span style={{ color: FS.green }}>to start</span>
        </h1>

        <div style={{ marginTop: 64 }}>
          {FEATURES.map((f, i) => {
            const at = HEAD_END + i * 24;
            return (
              <div
                key={f.n}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 38,
                  padding: '30px 36px',
                  marginBottom: 26,
                  borderRadius: 24,
                  backgroundColor: i === 0 ? FS.ink : FS.mist,
                  border: `1.5px solid ${i === 0 ? FS.ink : 'rgba(89,99,92,0.18)'}`,
                  opacity: r(at, at + 10),
                  transform: `translateY(${r(at, at + 14, 70, 0)}px) scale(${r(at, at + 14, 0.94, 1)})`,
                }}
              >
                <div
                  style={{
                    minWidth: 96,
                    height: 96,
                    borderRadius: 18,
                    backgroundColor: i === 0 ? FS.green : FS.ink,
                    transform: 'skewX(-10deg)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <span style={{ fontFamily: FS_MONO, fontWeight: 600, fontSize: 40, color: i === 0 ? FS.ink : FS.green, transform: 'skewX(10deg)' }}>
                    {f.n}
                  </span>
                </div>
                <div>
                  <p style={{ margin: 0, fontFamily: FS_BODY, fontWeight: 700, fontSize: 52, color: i === 0 ? FS.paper : FS.ink, lineHeight: 1.1 }}>
                    {f.title}
                  </p>
                  <p style={{ margin: '8px 0 0', fontFamily: FS_BODY, fontWeight: 300, fontSize: 36, color: i === 0 ? FS.mint : FS.gray }}>
                    {f.sub}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <p
          style={{
            margin: '30px 0 0',
            textAlign: 'center',
            fontFamily: FS_BODY,
            fontWeight: 300,
            fontSize: 36,
            color: FS.gray,
            opacity: r(HEAD_END + 5 * 24 + 10, HEAD_END + 5 * 24 + 24),
          }}
        >
          learning &amp; tools — <span style={{ fontWeight: 700, color: FS.greenDeep }}>100% free</span>
        </p>
      </div>

      <FsWatermark width={1080} onLight />
    </AbsoluteFill>
  );
};

export default FsFeatures;
