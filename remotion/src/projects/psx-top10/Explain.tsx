// B. What is market cap? (beats 8-18): headline + serif definition, the formula built from UI cards,
// and a closing line that hands over to the countdown.
import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { C, E, FONT, life, ramp } from './theme';
import { bf, S } from './timeline';

const Card: React.FC<{ title: string; sub: string; green?: boolean; w: number; h: number; style: React.CSSProperties }> = ({ title, sub, green, w, h, style }) => (
  <div style={{
    position: 'absolute', width: w, height: h, borderRadius: 30, boxSizing: 'border-box', padding: '0 40px',
    display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 8,
    background: green ? C.green : '#fff', border: green ? 'none' : `2px solid #E2E6E1`,
    boxShadow: green ? '0 24px 60px rgba(44,156,0,0.28)' : '0 18px 50px rgba(17,17,17,0.07)', ...style,
  }}>
    <div style={{ fontFamily: FONT.display, fontWeight: 900, fontSize: green ? 76 : 56, lineHeight: 1.0, letterSpacing: -1.5, color: green ? '#fff' : C.ink }}>{title}</div>
    <div style={{ fontFamily: FONT.serif, fontStyle: 'italic', fontSize: green ? 46 : 40, lineHeight: 1.05, color: green ? 'rgba(255,255,255,0.88)' : C.grey }}>{sub}</div>
  </div>
);

const Op: React.FC<{ ch: string; x: number; y: number; style: React.CSSProperties }> = ({ ch, x, y, style }) => (
  <div style={{ position: 'absolute', left: x - 50, top: y - 60, width: 100, height: 120, textAlign: 'center', fontFamily: FONT.display, fontWeight: 900, fontSize: 96, lineHeight: '120px', color: C.lime, ...style }}>{ch}</div>
);

export const Explain: React.FC = () => {
  const f = useCurrentFrame();
  const s = S.explain;
  if (f < bf(s.start) - 6 || f > bf(s.end) + 2) return null;
  const [c1, c2, c3, c4] = s.cards.map((b) => bf(b) - 2);
  const out = bf(s.closer) - 9; // formula + headline lift out
  const closerIn = bf(s.closer) + 3, closerOut = bf(s.end) - 7.5;
  return (
    <AbsoluteFill>
      <div style={{ position: 'absolute', left: 80, right: 80, top: 300, ...life(f, bf(s.start) - 4, out) }}>
        <div style={{ fontFamily: FONT.display, fontWeight: 900, fontSize: 168, lineHeight: '170px', letterSpacing: -6, color: C.green }}>Market cap</div>
      </div>
      <div style={{ position: 'absolute', left: 84, right: 80, top: 488, fontFamily: FONT.serif, fontStyle: 'italic', fontSize: 80, lineHeight: '88px', color: C.ink, ...life(f, bf(s.line) - 3, out + 2) }}>
        the total value of a company on the stock market.
      </div>
      {/* formula: [Share price] x [Total shares] = [Market cap] */}
      <Card title="Share price" sub="what one share costs" w={920} h={180} style={{ left: 80, top: 730, ...life(f, c1, out + 1) }} />
      <Op ch="×" x={540} y={970} style={life(f, c2 - 1, out + 1.5, 40)} />
      <Card title="Total shares" sub="every share issued" w={920} h={180} style={{ left: 80, top: 1030, ...life(f, c2, out + 2) }} />
      <Op ch="=" x={540} y={1272} style={life(f, c3, out + 2.5, 40)} />
      <Card green title="Market cap" sub="what the whole company is worth" w={920} h={210} style={{ left: 80, top: 1334, ...life(f, c4, out + 3) }} />
      {/* closer */}
      <div style={{ position: 'absolute', left: 80, right: 80, top: 760, textAlign: 'center', ...life(f, closerIn, closerOut) }}>
        <div style={{ fontFamily: FONT.serif, fontStyle: 'italic', fontSize: 110, lineHeight: '120px', color: C.ink }}>now meet the</div>
        <div style={{ fontFamily: FONT.display, fontWeight: 900, fontSize: 150, lineHeight: '160px', letterSpacing: -5, color: C.green }}>10 biggest</div>
        <div style={{ fontFamily: FONT.serif, fontStyle: 'italic', fontSize: 110, lineHeight: '120px', color: C.ink }}>on the PSX.</div>
        <div style={{ margin: '34px auto 0', width: 150, height: 10, borderRadius: 5, background: C.lime, transformOrigin: 'center', transform: `scaleX(${ramp(f, closerIn + 6, closerIn + 16, E.inOut)})` }} />
      </div>
    </AbsoluteFill>
  );
};
