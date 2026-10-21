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
  id: 'FsKineticNow',
  durationInSeconds: 7,
  fps: 30,
  width: 1080,
  height: 1920,
};

// beat boundaries (frames) — hard cuts, SaaS-showreel style
const B1 = 0; //   green: YOU HEARD / THAT RIGHT
const B2 = 42; //  ink:   FLORET CAPITALS
const B3 = 96; //  paper: A DECADE+ ON PMEX
const B4 = 148; // ink:   NOW IN STOCKS.
const END = 210;

const slamIn = (frame: number, at: number, dur = 9) => ({
  opacity: interpolate(frame, [at, at + 4], [0, 1], CLAMP),
  transform: `scale(${interpolate(frame, [at, at + dur], [1.7, 1], { ...CLAMP, easing: FS_EASE.slam })})`,
});

const riseIn = (frame: number, at: number, dist = 40, dur = 12) => ({
  opacity: interpolate(frame, [at, at + dur], [0, 1], { ...CLAMP, easing: FS_EASE.out }),
  transform: `translateY(${interpolate(frame, [at, at + dur], [dist, 0], { ...CLAMP, easing: FS_EASE.out })}px)`,
});

const center: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  textAlign: 'center',
  padding: '0 70px',
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================
const FsKineticNow: React.FC = () => {
  const frame = useCurrentFrame();

  return (
    <AbsoluteFill style={{ backgroundColor: FS.ink }}>
      {/* ---- beat 1: green — YOU HEARD THAT RIGHT ---- */}
      {frame < B2 && (
        <AbsoluteFill style={{ backgroundColor: FS.green }}>
          <div style={center}>
            <h1 style={{ ...fsHeadline(150, FS.ink), ...slamIn(frame, 2) }}>You heard</h1>
            <h1 style={{ ...fsHeadline(150, FS.paper), ...slamIn(frame, 14), marginTop: 10 }}>that right</h1>
          </div>
        </AbsoluteFill>
      )}

      {/* ---- beat 2: ink — FLORET CAPITALS ---- */}
      {frame >= B2 && frame < B3 && (
        <AbsoluteFill style={{ backgroundColor: FS.ink }}>
          <div style={center}>
            <p
              style={{
                margin: 0,
                fontFamily: FS_MONO,
                fontWeight: 600,
                fontSize: 34,
                letterSpacing: '0.35em',
                color: FS.mint,
                ...riseIn(frame, B2 + 2),
              }}
            >
              PAKISTAN
            </p>
            <h1 style={{ ...fsHeadline(148, FS.paper), ...slamIn(frame, B2 + 8), marginTop: 26 }}>Floret</h1>
            <h1 style={{ ...fsHeadline(148, FS.green), ...slamIn(frame, B2 + 16) }}>Capitals</h1>
            <p
              style={{
                margin: '34px 0 0',
                fontFamily: FS_BODY,
                fontWeight: 300,
                fontSize: 42,
                color: FS.paper,
                ...riseIn(frame, B2 + 26),
                opacity: riseIn(frame, B2 + 26).opacity * 0.85,
              }}
            >
              the commodities broker you already trust
            </p>
          </div>
        </AbsoluteFill>
      )}

      {/* ---- beat 3: paper — A DECADE+ ON PMEX ---- */}
      {frame >= B3 && frame < B4 && (
        <AbsoluteFill style={{ backgroundColor: FS.paper }}>
          <div style={center}>
            <h1 style={{ ...fsHeadline(140, FS.ink), ...slamIn(frame, B3 + 2) }}>A decade+</h1>
            <h1 style={{ ...fsHeadline(140, FS.ink), ...slamIn(frame, B3 + 10) }}>trading on</h1>
            <div
              style={{
                marginTop: 30,
                padding: '18px 54px',
                backgroundColor: FS.ink,
                opacity: riseIn(frame, B3 + 18, 50).opacity,
                transform: `skewX(-10deg) ${riseIn(frame, B3 + 18, 50).transform}`,
              }}
            >
              <h1 style={{ ...fsHeadline(140, FS.green, { fontStyle: 'normal' }) }}>PMEX</h1>
            </div>
            <p
              style={{
                margin: '36px 0 0',
                fontFamily: FS_BODY,
                fontWeight: 300,
                fontSize: 40,
                color: FS.gray,
                ...riseIn(frame, B3 + 30),
              }}
            >
              gold · silver · crude · copper
            </p>
          </div>
        </AbsoluteFill>
      )}

      {/* ---- beat 4: ink — NOW IN STOCKS. ---- */}
      {frame >= B4 && (
        <AbsoluteFill style={{ backgroundColor: FS.ink }}>
          <AbsoluteFill
            style={{
              backgroundColor: FS.green,
              transformOrigin: '50% 100%',
              transform: `scaleY(${interpolate(frame, [B4 + 26, B4 + 40], [0, 1], { ...CLAMP, easing: FS_EASE.slam })})`,
            }}
          />
          <div style={center}>
            <h1 style={{ ...fsHeadline(170, frame < B4 + 32 ? FS.paper : FS.ink), ...slamIn(frame, B4 + 4) }}>
              Now in
            </h1>
            <h1
              style={{
                ...fsHeadline(222, FS.ink),
                WebkitTextStroke: frame < B4 + 32 ? `4px ${FS.green}` : undefined,
                color: frame < B4 + 32 ? 'transparent' : FS.ink,
                ...slamIn(frame, B4 + 14, 10),
                marginTop: 14,
              }}
            >
              Stocks.
            </h1>
          </div>
        </AbsoluteFill>
      )}

      {frame < B4 + 26 && <FsWatermark width={1080} onLight={frame >= B3 && frame < B4} />}
    </AbsoluteFill>
  );
};

export default FsKineticNow;
