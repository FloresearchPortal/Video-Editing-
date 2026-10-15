// 4. Why there is a "Top 10" (beats 18-27). Twenty real PSX companies appear as circles sized by
// market cap (the top 10 plus the next 10 from the cut-off check), scattered:
//   "Every company has one."  ->  "Rank them by size."  (they glide into size order)
//   ->  the 10 biggest turn green, get their tickers and a TOP 10 bracket  ->  "Meet the top 10."
// Layout: heading 320-424 · grid 5 x 4 cells (184 x 190), rows centred at y 640/830/1020/1210 ·
// caption 1330-1370. Circles never exceed their cell, so nothing overlaps at rest.
import React from 'react';
import { AbsoluteFill, spring, useCurrentFrame } from 'remotion';
import { C, E, FONT, H, mix, mixHex, ramp } from './theme';
import { bf, FPS, S, TOP } from './timeline';
import data from './data.json';

const Q = S.sort;
type Dot = { ticker: string; mcap: number; top: boolean };
const DOTS: Dot[] = [
  ...TOP.map((c) => ({ ticker: c.ticker, mcap: c.mcap_bn, top: true })),
  ...(data as any).cutoff_check.slice(0, 10).map((c: any) => ({ ticker: c.ticker, mcap: c.mcap_bn, top: false })),
].sort((a, b) => b.mcap - a.mcap);
const MAXD = 168;
const dia = (m: number) => MAXD * Math.sqrt(m / DOTS[0].mcap);
const COLS = [172, 356, 540, 724, 908], ROWS = [640, 830, 1020, 1210];
const slot = (k: number) => ({ x: COLS[k % 5], y: ROWS[Math.floor(k / 5)] });
// scattered start: a fixed shuffle of the same slots, jittered within each cell's free space
const SHUFFLE = [13, 4, 17, 9, 1, 15, 7, 19, 2, 11, 6, 16, 0, 10, 18, 5, 12, 3, 14, 8];
const JIT = DOTS.map((_, i) => [Math.sin(i * 12.9898) * 0.5, Math.cos(i * 78.233) * 0.5]);

const Roll: React.FC<{ f: number; lines: [number, string][] }> = ({ f, lines }) => (
  <div style={{ position: 'absolute', left: 0, right: 0, top: 320, height: 104, overflow: 'hidden', textAlign: 'center' }}>
    {lines.map(([at, text], i) => {
      const next = lines[i + 1]?.[0] ?? Infinity;
      const tin = ramp(f, at + 1, at + 9, E.out), tout = next === Infinity ? 0 : ramp(f, next - 5, next + 1, E.in);
      if (f < at || f > next + 2) return null;
      return <div key={i} style={{ position: 'absolute', left: 0, right: 0, ...H, fontSize: 68, lineHeight: '104px', color: C.ink, transform: `translateY(${(1 - tin) * 104 - tout * 104}px)`, filter: `blur(${(1 - tin) * 8 + tout * 8}px)` }}>{text}</div>;
    })}
  </div>
);

export const Sort: React.FC = () => {
  const f = useCurrentFrame();
  if (f < bf(Q.start) - 2 || f >= bf(S.chart.start)) return null; // swapped out under the green wipe
  const sc = bf(Q.scatter), rk = bf(Q.rank), tp = bf(Q.top), mt = bf(Q.meet);
  const hi = ramp(f, tp, tp + 10, E.inOut);
  const bracket = ramp(f, tp + 4, tp + 16, E.inOut);
  return (
    <AbsoluteFill>
      <Roll f={f} lines={[[sc - 2, 'Every company has one.'], [rk, 'Rank them by size.'], [mt, 'Meet the top 10.']]} />
      {/* TOP 10 bracket around the first two rows */}
      <svg width={1080} height={1920} style={{ position: 'absolute' }}>
        <rect x={70} y={545} width={940} height={380} rx={40} fill="rgba(44,156,0,0.05)" stroke={C.green} strokeWidth={4}
          strokeDasharray={2700} strokeDashoffset={2700 * (1 - bracket)} opacity={bracket > 0 ? 1 : 0} />
      </svg>
      <div style={{ position: 'absolute', left: 104, top: 526, padding: '4px 18px', borderRadius: 18, background: C.green, fontFamily: FONT.display, fontWeight: 700, fontSize: 22, lineHeight: '30px', letterSpacing: '0.12em', color: '#fff', opacity: ramp(f, tp + 10, tp + 16), transform: `translateY(${(1 - ramp(f, tp + 10, tp + 18, E.out)) * 12}px)` }}>TOP 10</div>
      {DOTS.map((d, i) => {
        const a = slot(SHUFFLE[i]), b = slot(i);
        const r = dia(d.mcap) / 2;
        const free = [(184 - 2 * r) / 2, (190 - 2 * r) / 2];
        const ax = a.x + JIT[i][0] * free[0] * 2, ay = a.y + JIT[i][1] * free[1] * 2;
        const appear = Math.min(1, spring({ frame: f - sc - i * 0.8, fps: FPS, config: { damping: 13, stiffness: 160, mass: 0.6 } }));
        const mv = ramp(f, rk + 2 + i * 0.9, rk + 20 + i * 0.9, E.inOut);
        const x = mix(ax, b.x, mv), y = mix(ay, b.y, mv);
        const fill = d.top ? mixHex('#C9D0D8', C.green, hi) : mixHex('#C9D0D8', '#E6EAEF', hi);
        const label = d.top ? ramp(f, tp + 4 + i, tp + 10 + i) : 0;
        return (
          <div key={d.ticker} style={{ position: 'absolute', left: x - r, top: y - r, width: 2 * r, height: 2 * r, borderRadius: r, background: d.top && hi > 0 ? `linear-gradient(135deg, ${mixHex('#C9D0D8', C.deep, hi)}, ${fill})` : fill, transform: `scale(${appear})`, boxShadow: d.top ? `0 ${10 * hi}px ${28 * hi}px rgba(44,156,0,${0.3 * hi})` : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontFamily: FONT.display, fontWeight: 800, fontSize: Math.max(18, r * 0.42), lineHeight: 1, letterSpacing: '-0.02em', color: '#fff', opacity: label }}>{d.ticker}</span>
          </div>
        );
      })}
      <div style={{ position: 'absolute', left: 0, right: 0, top: 1330, textAlign: 'center', fontFamily: FONT.display, fontWeight: 500, fontSize: 30, lineHeight: '40px', color: C.grey, opacity: ramp(f, tp + 12, tp + 20) }}>
        Circle size = market cap · PSX close {(data as any).close_date}
      </div>
    </AbsoluteFill>
  );
};
