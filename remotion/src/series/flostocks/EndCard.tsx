// Series end card: logo, KNOW THE / MARKET. / INVEST / SMARTER. (italic, kinetic), rule, follow line,
// "By Floret Capitals", market-risk disclaimer. Builds over ~1 beat, then holds perfectly still.
import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { C, E, FONT, KIN, ramp, seriesAsset } from './theme';

export const EndCard: React.FC<{ from: number; settle: number }> = ({ from, settle }) => {
  const f = useCurrentFrame();
  if (f < from - 1) return null;
  const n = 8, span = Math.max(4, settle - from - 9);
  const it = (i: number): React.CSSProperties => {
    const a = from + (i * span) / n, t = ramp(f, a, a + 8, E.out);
    return { position: 'absolute', left: 0, right: 0, textAlign: 'center', opacity: Math.min(1, t * 1.5), transform: `translateX(${(1 - t) * (i % 2 ? 160 : -160)}px)` };
  };
  const big: React.CSSProperties = { ...KIN, fontSize: 118, lineHeight: '128px' };
  return (
    <AbsoluteFill>
      <div style={{ ...it(0), top: 420, display: 'flex', justifyContent: 'center' }}><img src={seriesAsset('logos/FLOSTOCKS.png')} style={{ width: 430, height: (430 * 306) / 1164 }} /></div>
      <div style={{ ...it(1), ...big, top: 640, color: C.ink }}>KNOW THE</div>
      <div style={{ ...it(2), ...big, top: 768, color: C.ink }}>MARKET.</div>
      <div style={{ ...it(3), ...big, top: 912, color: C.green }}>INVEST</div>
      <div style={{ ...it(4), ...big, top: 1040, color: C.green }}>SMARTER.</div>
      <div style={{ ...it(5), top: 1206, display: 'flex', justifyContent: 'center' }}><span style={{ width: 140, height: 10, borderRadius: 5, background: C.lime, transform: 'skewX(-10deg)' }} /></div>
      <div style={{ ...it(6), top: 1252, fontFamily: FONT, fontWeight: 900, fontSize: 46, lineHeight: '60px', letterSpacing: '0.06em', color: C.ink }}>FOLLOW FLOSTOCKS</div>
      <div style={{ ...it(7), top: 1320, fontFamily: FONT, fontWeight: 600, fontSize: 30, lineHeight: '40px', color: C.grey }}>By Floret Capitals</div>
      <div style={{ ...it(8), top: 1600, fontFamily: FONT, fontWeight: 500, fontSize: 22, lineHeight: '30px', color: C.grey }}>Investments in securities are subject to market risks.</div>
    </AbsoluteFill>
  );
};
