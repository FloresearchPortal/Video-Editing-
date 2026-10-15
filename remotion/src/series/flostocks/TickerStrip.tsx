// Site-style market ticker bar (flostocks.com has a KSE-100 ticker under its nav): a fixed PSX tag
// and the episode's tickers scrolling. Sits at the top of the frame on content scenes.
import React from 'react';
import { useCurrentFrame } from 'remotion';
import { C, FONT, fmt2, ramp } from './theme';
import { Up } from './Num';

export const TickerStrip: React.FC<{ items: { ticker: string; value: number; unit: string }[]; from: number; to: number; top?: number }> = ({ items, from, to, top = 150 }) => {
  const f = useCurrentFrame();
  if (f < from - 2 || f > to + 10) return null;
  const op = ramp(f, from, from + 8) * (1 - ramp(f, to, to + 8));
  const ph = (f / 15) % 1;
  const row = [...items, ...items, ...items];
  return (
    <div style={{ position: 'absolute', left: 0, top, width: 1080, height: 64, background: C.ink, overflow: 'hidden', opacity: op }}>
      <div style={{ position: 'absolute', left: 150, top: 0, whiteSpace: 'nowrap', transform: `translateX(${-((f * 3.2) % (items.length * 300))}px)`, fontFamily: FONT, fontWeight: 600, fontSize: 25, lineHeight: '64px', color: '#fff' }}>
        {row.map((it, i) => (
          <span key={i} style={{ marginRight: 46 }}>{it.ticker} <span style={{ color: C.lime }}><Up color={C.lime} /> {fmt2(it.value)} {it.unit}</span></span>
        ))}
      </div>
      <div style={{ position: 'absolute', left: 0, top: 0, width: 150, height: 64, background: C.ink, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, boxShadow: '12px 0 18px rgba(11,15,20,0.9)' }}>
        <span style={{ width: 12, height: 12, borderRadius: 6, background: C.lime, boxShadow: `0 0 0 ${3 + 5 * ph}px rgba(58,204,0,${0.4 * (1 - ph)})` }} />
        <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 26, letterSpacing: '0.08em', color: '#fff' }}>PSX</span>
      </div>
    </div>
  );
};
