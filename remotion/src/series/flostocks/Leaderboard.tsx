// Series leaderboard: a dark trading-board panel that counts down N -> 1, one row per beat. Each
// row: rank (italic), [logo], ticker, value with unit, proportional bar. #1 gets the green treatment
// and a "No. 1" tag; a total line sits at the bottom of the panel.
// Panel 48-1032 x 236-1656 · header 276-370 · rows from 412, pitch 104 · total 1520-1616.
import React from 'react';
import { spring, useCurrentFrame } from 'remotion';
import { C, E, FONT, GRAD, KIN, SHADOW, fmt2, mix, ramp } from './theme';
import { Num } from './Num';

export type Row = { rank: number; ticker: string; value: number };
const P = { x: 48, y: 236, w: 984, h: 1420 };
const ROW0 = 412, PITCH = 104, TX = 196, BMAX = 1000 - 196;

export const Leaderboard: React.FC<{
  from: number; to: number; rowAt: (rank: number) => number; rows: Row[]; title: string; sub: string; unit: string; currency: string;
  total?: { label: string; value: string; at: number }; source: string; logo?: (ticker: string) => React.ReactNode; fps?: number;
}> = ({ from, to, rowAt, rows, title, sub, unit, currency, total, source, logo, fps = 30 }) => {
  const f = useCurrentFrame();
  if (f < from - 1 || f > to) return null;
  const max = Math.max(...rows.map((r) => r.value));
  const panel = ramp(f, from - 1, from + 10, E.site); // lands under the wipe; solid, never a grey fade
  const tx = logo ? TX + 90 : TX;
  return (
    <>
      <div style={{ position: 'absolute', left: P.x, top: P.y, width: P.w, height: P.h, borderRadius: 40, background: C.ink, boxShadow: SHADOW.lg, opacity: Math.min(1, panel * 4), transform: `translateY(${(1 - panel) * 60}px)`, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(700px 500px at 90% 0%, rgba(58,204,0,0.16), transparent 60%)' }} />
      </div>
      <div style={{ position: 'absolute', left: P.x + 48, top: 276, opacity: ramp(f, from + 4, from + 12), transform: `translateY(${(1 - ramp(f, from + 4, from + 16, E.out)) * 24}px)` }}>
        <div style={{ ...KIN, fontSize: 46, lineHeight: '56px', color: '#fff' }}>{title}</div>
        <div style={{ fontFamily: FONT, fontWeight: 500, fontSize: 25, lineHeight: '36px', color: 'rgba(255,255,255,0.6)' }}>{sub}</div>
      </div>
      {rows.map((r) => {
        const at = rowAt(r.rank);
        if (f < at - 2) return null;
        const top = ROW0 + (r.rank - 1) * PITCH;
        const s = spring({ frame: f - at + 2, fps, config: { damping: 15, stiffness: 180, mass: 0.6 } });
        const sc = Math.min(1, s);
        const g = ramp(f, at, at + 14, E.out);
        const one = r.rank === 1;
        const glow = one ? ramp(f, at + 2, at + 10) : 0;
        const barBg = one ? GRAD : r.rank <= 3 ? C.lime : 'rgba(255,255,255,0.28)';
        return (
          <div key={r.ticker} style={{ position: 'absolute', left: 0, top, width: 1080, height: 96, opacity: ramp(f, at - 2, at + 3), transform: `translateX(${(1 - s) * 420}px) skewX(${(1 - sc) * -12}deg)`, filter: `blur(${Math.max(0, 1 - s) * 10}px)` }}>
            {one && <div style={{ position: 'absolute', left: 72, top: -10, width: 936, height: 104, borderRadius: 24, background: 'rgba(58,204,0,0.12)', boxShadow: `inset 0 0 0 2px rgba(58,204,0,${0.6 * glow})`, opacity: glow }} />}
            <div style={{ position: 'absolute', left: 100, top: 6, width: 80, ...KIN, fontSize: 46, lineHeight: '60px', color: r.rank <= 3 ? C.lime : 'rgba(255,255,255,0.45)' }}>{String(r.rank).padStart(2, '0')}</div>
            {logo && <div style={{ position: 'absolute', left: TX, top: 4 }}>{logo(r.ticker)}</div>}
            <div style={{ position: 'absolute', left: tx, top: 0, fontFamily: FONT, fontWeight: 900, fontSize: 50, lineHeight: '66px', color: '#fff' }}>{r.ticker}</div>
            {one && <span style={{ position: 'absolute', left: tx + 180, top: 16, padding: '2px 14px', borderRadius: 16, background: C.lime, fontFamily: FONT, fontWeight: 800, fontSize: 20, lineHeight: '30px', letterSpacing: '0.08em', color: C.ink, opacity: glow }}>No. 1</span>}
            <div style={{ position: 'absolute', right: 1080 - 1000, top: 8, whiteSpace: 'nowrap', fontFamily: FONT, fontWeight: 800, fontSize: 40, lineHeight: '58px', color: one ? C.lime : '#fff' }}>
              <span style={{ fontSize: 24, fontWeight: 600, color: 'rgba(255,255,255,0.55)' }}>{currency} </span><Num v={fmt2(r.value * g)} /><span style={{ fontSize: 24, fontWeight: 600, color: 'rgba(255,255,255,0.55)' }}> {unit}</span>
            </div>
            <div style={{ position: 'absolute', left: tx, top: 72, width: 1000 - tx, height: 10, borderRadius: 5, background: 'rgba(255,255,255,0.08)' }} />
            <div style={{ position: 'absolute', left: tx, top: 72, width: (r.value / max) * (1000 - tx) * g, height: 10, borderRadius: 5, background: barBg }} />
          </div>
        );
      })}
      {total && f >= total.at - 2 && (
        <div style={{ position: 'absolute', left: P.x + 24, top: 1468, width: P.w - 48, height: 92, borderRadius: 24, background: 'rgba(255,255,255,0.06)', boxShadow: 'inset 0 0 0 2px rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 28px', boxSizing: 'border-box', opacity: ramp(f, total.at, total.at + 8), transform: `translateY(${(1 - ramp(f, total.at, total.at + 12, E.out)) * 30}px)` }}>
          <span style={{ fontFamily: FONT, fontWeight: 600, fontSize: 22, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.6)' }}>{total.label}</span>
          <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 40, color: '#fff' }}>{total.value}</span>
        </div>
      )}
      <div style={{ position: 'absolute', left: 0, right: 0, top: 1600, textAlign: 'center', fontFamily: FONT, fontWeight: 500, fontSize: 21, lineHeight: '30px', color: 'rgba(255,255,255,0.45)', opacity: ramp(f, from + 10, from + 18) }}>{source}</div>
    </>
  );
};
