import React from 'react';
import {
  useCurrentFrame,
  interpolate,
  AbsoluteFill,
  Img,
} from 'remotion';
import { CLAMP, FS, FS_EASE, FS_BODY, FS_MONO, LOGO, fsHeadline } from '../../lib/flostocks';

// =============================================================================
// COMPOSITION CONFIG
// =============================================================================
export const compositionConfig = {
  id: 'FsCta',
  durationInSeconds: 5,
  fps: 30,
  width: 1080,
  height: 1920,
};

// =============================================================================
// MAIN COMPONENT — green CTA finale
// =============================================================================
const FsCta: React.FC = () => {
  const frame = useCurrentFrame();
  const r = (a: number, b: number, from = 0, to = 1, easing = FS_EASE.out) =>
    interpolate(frame, [a, b], [from, to], { ...CLAMP, easing });

  // subtle breathing pulse on the CTA button (frame-driven)
  const pulse = 1 + 0.015 * Math.sin(frame * 0.18);

  return (
    <AbsoluteFill style={{ backgroundColor: FS.green }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(1000px 1200px at 50% 10%, rgba(69,224,31,0.9), transparent 70%)`,
        }}
      />

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
        <div
          style={{
            width: 210,
            height: 210,
            borderRadius: 48,
            backgroundColor: FS.paper,
            boxShadow: '0 18px 54px rgba(10,14,10,0.25)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: r(0, 10),
            transform: `scale(${r(0, 14, 1.8, 1, FS_EASE.slam)}) rotate(${r(0, 14, -14, 0)}deg)`,
          }}
        >
          <Img src={LOGO.iconOnLight} style={{ width: 150 }} />
        </div>

        <h1 style={{ ...fsHeadline(128, FS.ink), marginTop: 60, opacity: r(10, 18), transform: `scale(${r(10, 22, 1.5, 1, FS_EASE.slam)})` }}>
          Your gateway
        </h1>
        <h1 style={{ ...fsHeadline(128, FS.paper), opacity: r(18, 26), transform: `scale(${r(18, 30, 1.5, 1, FS_EASE.slam)})` }}>
          to the PSX
        </h1>

        {/* CTA button */}
        <div
          style={{
            marginTop: 86,
            padding: '36px 74px',
            borderRadius: 999,
            backgroundColor: FS.ink,
            boxShadow: '0 24px 70px rgba(10,14,10,0.35)',
            opacity: r(36, 46),
            transform: `translateY(${r(36, 50, 70, 0)}px) scale(${pulse})`,
            display: 'flex',
            alignItems: 'center',
            gap: 28,
          }}
        >
          <p style={{ margin: 0, fontFamily: FS_BODY, fontWeight: 700, fontSize: 54, color: FS.paper }}>
            Open your PSX account
          </p>
          <svg width="46" height="46" viewBox="0 0 46 46">
            <path d="M8 23 H38 M26 9 L38 23 L26 37" fill="none" stroke={FS.green} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <p
          style={{
            margin: '72px 0 0',
            fontFamily: FS_MONO,
            fontWeight: 600,
            fontSize: 56,
            letterSpacing: '0.06em',
            color: FS.ink,
            opacity: r(56, 68),
            transform: `translateY(${r(56, 68, 40, 0)}px)`,
          }}
        >
          flostocks.com
        </p>
        <p
          style={{
            margin: '26px 0 0',
            fontFamily: FS_BODY,
            fontWeight: 600,
            fontSize: 36,
            color: FS.ink,
            opacity: r(68, 80, 0, 0.8),
          }}
        >
          @floretcapitals
        </p>
      </div>
    </AbsoluteFill>
  );
};

export default FsCta;
