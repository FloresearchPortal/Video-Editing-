// F. CTA: builds on beat 82 (the ranking bars fold into its lime rule) and is fully settled by
// cta.static_from; the last `hold_seconds` are perfectly still.
import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { C, FONT, asset, life } from './theme';
import { bf, S, CTA_STATIC } from './timeline';
import { RULE } from './Ranking';

export const Cta: React.FC = () => {
  const f = useCurrentFrame();
  const f0 = bf(S.cta.start);
  if (f < f0) return null;
  const it = (i: number): React.CSSProperties => ({ position: 'absolute', left: 0, right: 0, textAlign: 'center', ...life(f, f0 + 9 + i * 1.6, Infinity, 60) });
  const big: React.CSSProperties = { fontFamily: FONT.display, fontWeight: 900, fontSize: 134, lineHeight: '128px', letterSpacing: -4 };
  const settled = f >= f0 + 12;
  return (
    <AbsoluteFill>
      <div style={{ ...it(0), top: 380, display: 'flex', justifyContent: 'center' }}>
        <img src={asset('logos/FLOSTOCKS.png')} style={{ width: 440, height: (440 * 306) / 1164 }} />
      </div>
      <div style={{ ...it(1), ...big, top: 610, color: C.ink }}>KNOW THE</div>
      <div style={{ ...it(2), ...big, top: 738, color: C.ink }}>MARKET.</div>
      <div style={{ ...it(3), ...big, top: 888, color: C.green }}>INVEST</div>
      <div style={{ ...it(4), ...big, top: 1016, color: C.green }}>SMARTER.</div>
      {settled && <div style={{ position: 'absolute', left: RULE.x, top: RULE.y, width: RULE.w, height: RULE.h, borderRadius: RULE.h / 2, background: C.lime }} />}
      <div style={{ ...it(5), top: 1234, fontFamily: FONT.display, fontWeight: 900, fontSize: 54, lineHeight: '64px', letterSpacing: 5, color: C.ink }}>FOLLOW FLOSTOCKS</div>
      <div style={{ ...it(6), top: 1312, fontFamily: FONT.display, fontWeight: 700, fontSize: 34, lineHeight: '44px', letterSpacing: 0.5, color: C.grey }}>By Floret Capitals</div>
      <div style={{ ...it(7), top: 1574, fontFamily: FONT.display, fontWeight: 700, fontSize: 24, lineHeight: '32px', color: C.grey, opacity: 0.85 }}>Investments in securities are subject to market risks.</div>
    </AbsoluteFill>
  );
};
