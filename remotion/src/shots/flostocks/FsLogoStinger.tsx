import React from 'react';
import {
  useCurrentFrame,
  interpolate,
  AbsoluteFill,
  Img,
} from 'remotion';
import { CLAMP, FS, FS_EASE, FS_BODY, FS_MONO, FsDarkBg, LOGO, fsHeadline } from '../../lib/flostocks';

// =============================================================================
// COMPOSITION CONFIG
// =============================================================================
export const compositionConfig = {
  id: 'FsLogoStinger',
  durationInSeconds: 5,
  fps: 30,
  width: 1080,
  height: 1920,
};

// =============================================================================
// MAIN COMPONENT — logo reveal + positioning line
// =============================================================================
const FsLogoStinger: React.FC = () => {
  const frame = useCurrentFrame();

  const r = (a: number, b: number, from = 0, to = 1, easing = FS_EASE.out) =>
    interpolate(frame, [a, b], [from, to], { ...CLAMP, easing });

  // two green bars wipe across, then the logo slams in
  const bar1 = r(0, 12, -110, 130, FS_EASE.inOut);
  const bar2 = r(4, 16, 130, -110, FS_EASE.inOut);
  const barsFade = r(14, 22, 1, 0);

  const logoScale = r(10, 24, 2.1, 1, FS_EASE.slam);
  const logoOp = r(10, 16);

  const lineW = r(30, 46, 0, 1);

  return (
    <AbsoluteFill style={{ backgroundColor: FS.ink }}>
      <FsDarkBg glow={0.2} />

      {/* wipe bars (brand parallelogram energy) */}
      <div
        style={{
          position: 'absolute',
          top: '38%',
          left: `${bar1}%`,
          width: 460,
          height: 74,
          backgroundColor: FS.green,
          transform: 'skewX(-18deg)',
          opacity: barsFade,
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '46%',
          left: `${bar2}%`,
          width: 460,
          height: 74,
          backgroundColor: FS.mint,
          transform: 'skewX(-18deg)',
          opacity: barsFade,
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
        <Img
          src={LOGO.fullOnDark}
          style={{
            width: 780,
            opacity: logoOp,
            transform: `scale(${logoScale})`,
          }}
        />

        {/* positioning line */}
        <div style={{ height: 3, width: lineW * 560, backgroundColor: FS.green, marginTop: 70 }} />
        <p
          style={{
            margin: '44px 0 0',
            fontFamily: FS_MONO,
            fontWeight: 600,
            fontSize: 33,
            letterSpacing: '0.30em',
            color: FS.mint,
            opacity: r(40, 52),
            transform: `translateY(${r(40, 52, 30, 0)}px)`,
          }}
        >
          THE OFFICIAL PSX DIVISION
        </p>
        <h2
          style={{
            ...fsHeadline(86, FS.paper),
            marginTop: 20,
            opacity: r(50, 62),
            transform: `translateY(${r(50, 62, 30, 0)}px)`,
          }}
        >
          of Floret Capitals
        </h2>
        <p
          style={{
            margin: '60px 0 0',
            fontFamily: FS_BODY,
            fontWeight: 300,
            fontSize: 40,
            color: FS.paper,
            opacity: r(70, 84, 0, 0.9),
          }}
        >
          Pakistan&apos;s modern gateway to the stock market
        </p>
      </div>
    </AbsoluteFill>
  );
};

export default FsLogoStinger;
