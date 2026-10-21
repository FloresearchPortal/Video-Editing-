import React from 'react';
import {
  useCurrentFrame,
  interpolate,
  AbsoluteFill,
} from 'remotion';
import { evolvePath } from '@remotion/paths';
import { CLAMP, FS, FS_EASE, FS_BODY, FS_MONO, FsDarkBg, FsWatermark, fsHeadline } from '../../lib/flostocks';

// =============================================================================
// COMPOSITION CONFIG
// =============================================================================
export const compositionConfig = {
  id: 'FsTradePsx',
  durationInSeconds: 7,
  fps: 30,
  width: 1080,
  height: 1920,
};

// =============================================================================
// PRE-GENERATED DATA
// =============================================================================
// Illustrative tickers (mixed moves — this is UI, not a performance claim)
const TICKERS = [
  { sym: 'OGDC', price: '221.40', chg: '+1.84%', up: true },
  { sym: 'LUCK', price: '1,180.25', chg: '+0.92%', up: true },
  { sym: 'HBL', price: '158.10', chg: '-0.45%', up: false },
  { sym: 'SYS', price: '470.66', chg: '+2.10%', up: true },
  { sym: 'MARI', price: '612.84', chg: '-1.12%', up: false },
  { sym: 'ENGRO', price: '318.02', chg: '+0.67%', up: true },
] as const;

// hand-drawn KSE-100-style index line across a 920x360 viewBox
const INDEX_PATH =
  'M 0 300 L 70 282 L 130 294 L 200 252 L 260 262 L 330 212 L 390 228 L 460 176 L 520 196 L 590 142 L 650 158 L 720 104 L 790 122 L 860 60 L 920 44';

// =============================================================================
// MAIN COMPONENT
// =============================================================================
const FsTradePsx: React.FC = () => {
  const frame = useCurrentFrame();
  const r = (a: number, b: number, from = 0, to = 1, easing = FS_EASE.out) =>
    interpolate(frame, [a, b], [from, to], { ...CLAMP, easing });

  const lineProgress = r(26, 110, 0, 1, FS_EASE.inOut);
  const { strokeDasharray, strokeDashoffset } = evolvePath(lineProgress, INDEX_PATH);

  return (
    <AbsoluteFill style={{ backgroundColor: FS.ink }}>
      <FsDarkBg glow={0.14} />

      <div style={{ position: 'absolute', inset: 0, padding: '210px 70px 0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {/* headline */}
        <h1 style={{ ...fsHeadline(96, FS.paper, { textAlign: 'center' }), opacity: r(0, 8), transform: `scale(${r(0, 12, 1.5, 1, FS_EASE.slam)})` }}>
          Trade the
        </h1>
        <h1 style={{ ...fsHeadline(96, FS.green, { textAlign: 'center' }), opacity: r(8, 16), transform: `scale(${r(8, 20, 1.5, 1, FS_EASE.slam)})` }}>
          Pakistan Stock Exchange
        </h1>

        {/* index card */}
        <div
          style={{
            marginTop: 70,
            width: 940,
            borderRadius: 28,
            border: '1.5px solid rgba(126,220,168,0.35)',
            backgroundColor: 'rgba(10,14,10,0.78)',
            padding: '38px 10px 10px',
            opacity: r(20, 32),
            transform: `translateY(${r(20, 34, 60, 0)}px)`,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 40px' }}>
            <p style={{ margin: 0, fontFamily: FS_MONO, fontWeight: 600, fontSize: 36, color: FS.paper }}>KSE-100</p>
            <p style={{ margin: 0, fontFamily: FS_MONO, fontWeight: 600, fontSize: 36, color: FS.mint }}>
              PSX · LIVE
            </p>
          </div>
          <svg width="920" height="360" viewBox="0 0 920 360" style={{ display: 'block', marginTop: 8 }}>
            {[60, 140, 220, 300].map((y) => (
              <line key={y} x1={0} y1={y} x2={920} y2={y} stroke="rgba(126,220,168,0.12)" strokeWidth={1.5} />
            ))}
            <path
              d={`${INDEX_PATH} L 920 360 L 0 360 Z`}
              fill="rgba(56,209,0,0.12)"
              opacity={lineProgress}
            />
            <path
              d={INDEX_PATH}
              fill="none"
              stroke={FS.green}
              strokeWidth={7}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
            />
          </svg>
        </div>

        {/* ticker rows */}
        <div style={{ marginTop: 56, width: 940 }}>
          {TICKERS.map((t, i) => {
            const at = 70 + i * 9;
            return (
              <div
                key={t.sym}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '21px 40px',
                  borderBottom: '1px solid rgba(126,220,168,0.14)',
                  opacity: r(at, at + 10),
                  transform: `translateX(${r(at, at + 12, 90, 0)}px)`,
                }}
              >
                <p style={{ margin: 0, fontFamily: FS_MONO, fontWeight: 600, fontSize: 40, color: FS.paper, width: 240 }}>{t.sym}</p>
                <p style={{ margin: 0, fontFamily: FS_MONO, fontWeight: 500, fontSize: 40, color: FS.paper, opacity: 0.85 }}>{t.price}</p>
                <p
                  style={{
                    margin: 0,
                    fontFamily: FS_MONO,
                    fontWeight: 600,
                    fontSize: 40,
                    color: t.up ? FS.green : FS.fall,
                    width: 220,
                    textAlign: 'right',
                  }}
                >
                  {t.chg}
                </p>
              </div>
            );
          })}
        </div>

        <p
          style={{
            margin: '52px 0 0',
            fontFamily: FS_BODY,
            fontWeight: 300,
            fontSize: 34,
            color: FS.gray,
            opacity: r(140, 154, 0, 1),
          }}
        >
          Pakistan&apos;s top companies. One account.
        </p>
      </div>

      <FsWatermark width={1080} />
    </AbsoluteFill>
  );
};

export default FsTradePsx;
