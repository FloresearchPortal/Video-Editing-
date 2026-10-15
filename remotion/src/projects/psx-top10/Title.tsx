// 2. Title (beats 11-18): the title IS a bar chart. The intro's green frame has collapsed into bar 1
// ("Top 10", drawn by Intro.tsx); the other phrases grow in as bars on the beat along a chart axis,
// a light sweep runs across them, and a price line draws through the bar tips to a live dot.
// Layout (no overlaps): bars at y 560/790/970/1130/1310 (heights 200/150/130/150/130, 30 px gaps),
// axis x 80, caption 1490-1526.
import React from 'react';
import { AbsoluteFill, spring, useCurrentFrame } from 'remotion';
import { C, E, FONT, H, SHADOW, mix, ramp } from './theme';
import { bf, FPB, FPS, S } from './timeline';
import { Eyebrow } from './Eyebrow';

const T = S.title;
export const BARS = [
  { y: 560, w: 600, h: 200 }, // "Top 10" (Intro's morph target)
  { y: 790, w: 720, h: 150 },
  { y: 970, w: 600, h: 130 },
  { y: 1130, w: 900, h: 150 },
  { y: 1310, w: 470, h: 130 },
];
export const AX = 80;

const Bar: React.FC<{ f: number; at: number; leave: number; i: number; bg: string; border?: boolean; children: React.ReactNode }> = ({ f, at, leave, i, bg, border, children }) => {
  const b = BARS[i];
  const g = Math.min(1, spring({ frame: f - at, fps: FPS, config: { damping: 16, stiffness: 120, mass: 0.7 } }));
  const txt = ramp(f, at + 4, at + 12, E.out);
  const out = ramp(f, leave, leave + 9, E.inOut);
  return (
    <>
      {/* the bar grows from the axis; its label is revealed by a clip, never stretched */}
      <div style={{ position: 'absolute', left: AX, top: b.y, width: b.w, height: b.h, borderRadius: 26, background: bg, border: border ? `3px solid ${C.line}` : 'none', boxSizing: 'border-box', boxShadow: border ? SHADOW.md : '0 10px 30px rgba(11,15,20,0.12)', transformOrigin: 'left center', transform: `scaleX(${g * (1 - out)})` }} />
      <div style={{ position: 'absolute', left: AX, top: b.y, width: b.w, height: b.h, clipPath: `inset(0 ${(1 - g * (1 - out)) * 100}% 0 0 round 26px)` }}>
        <div style={{ position: 'absolute', left: 48, top: 0, height: '100%', display: 'flex', alignItems: 'center', opacity: txt * (1 - out), transform: `translateY(${(1 - txt) * 30}px)` }}>{children}</div>
      </div>
    </>
  );
};

// axis + faint gridlines: rendered UNDER the intro layer (which owns bar 1), so no line crosses a bar
export const TitleAxis: React.FC = () => {
  const f = useCurrentFrame();
  if (f < bf(T.start) - 2 || f > bf(T.end) + 2) return null;
  const ex = bf(T.exit);
  const axis = ramp(f, bf(T.start) - 2, bf(T.start) + 10, E.out) * (1 - ramp(f, ex + 4, ex + 12));
  return (
    <AbsoluteFill>
      {/* chart axis + faint vertical gridlines (no numbers) */}
      <svg width={1080} height={1920} style={{ position: 'absolute', opacity: axis }}>
        {[280, 480, 680, 880].map((x) => <line key={x} x1={x} x2={x} y1={530} y2={1470} stroke={C.line} strokeWidth={2} strokeDasharray="6 10" />)}
        <line x1={AX - 2} x2={AX - 2} y1={530} y2={1470} stroke={C.ink} strokeWidth={4} strokeLinecap="round" />
        {BARS.map((b, i) => <line key={i} x1={AX - 18} x2={AX - 2} y1={b.y + b.h / 2} y2={b.y + b.h / 2} stroke={C.ink} strokeWidth={3} />)}
      </svg>
    </AbsoluteFill>
  );
};

export const Title: React.FC = () => {
  const f = useCurrentFrame();
  if (f < bf(T.start) - 2 || f > bf(T.end) + 2) return null;
  const [b2, b3, b4, b5] = T.bars.map(bf);
  const ex = bf(T.exit);
  const leave = (i: number) => ex + i * 1.2;
  // stepped price line through the bar tips. It routes around the bars: when the next tip is further
  // right it goes across first then down, otherwise down first then across, so it never crosses a bar.
  const tips = BARS.map((b) => [AX + b.w + 34, b.y + b.h / 2] as [number, number]);
  const route: [number, number][] = [tips[0]];
  for (let i = 1; i < tips.length; i++) {
    const [px, py] = tips[i - 1], [nx, ny] = tips[i];
    route.push(nx > px ? [nx, py] : [px, ny], [nx, ny]);
  }
  const segLen = route.slice(1).map((p, i) => Math.hypot(p[0] - route[i][0], p[1] - route[i][1]));
  const total = segLen.reduce((a, b) => a + b, 0);
  const lt = ramp(f, bf(T.line), bf(T.line) + 16, E.inOut) * (1 - ramp(f, ex, ex + 8));
  let left = lt * total, k = 0;
  const drawn: [number, number][] = [route[0]];
  while (k < segLen.length && left > segLen[k]) { left -= segLen[k]; k++; drawn.push(route[k]); }
  if (k < segLen.length) { const fr = left / segLen[k]; drawn.push([mix(route[k][0], route[k + 1][0], fr), mix(route[k][1], route[k + 1][1], fr)]); }
  const d = drawn.map(([x, y], i) => `${i ? 'L' : 'M'}${x},${y}`).join(' ');
  const reached = tips.filter((t) => drawn.some((p) => p[0] === t[0] && p[1] === t[1]));
  const head = drawn[drawn.length - 1];
  const ph = (f / FPB) % 1;
  // light sweep across all bars
  const sw = ramp(f, bf(T.line) + 4, bf(T.line) + 22, E.inOut);
  const ink = { ...H, fontSize: 104, lineHeight: '120px' };
  return (
    <AbsoluteFill>
      <Bar f={f} at={b2} leave={leave(1)} i={1} bg={C.ink}><span style={{ ...ink, color: '#fff' }}>companies</span></Bar>
      <Bar f={f} at={b3} leave={leave(2)} i={2} bg="#fff" border><span style={{ ...H, fontSize: 92, lineHeight: '110px', color: C.ink }}>by market</span></Bar>
      <Bar f={f} at={b4} leave={leave(3)} i={3} bg={`linear-gradient(90deg, ${C.deep}, ${C.green} 55%, #3ACC00)`}><span style={{ ...ink, color: '#fff' }}>capitalization</span></Bar>
      <Bar f={f} at={b5} leave={leave(4)} i={4} bg="#fff" border>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 22 }}>
          <span style={{ ...H, fontSize: 92, lineHeight: '110px', color: C.ink }}>in <span style={{ color: C.green }}>PSX</span></span>
          <span style={{ width: 26, height: 26, borderRadius: 13, background: C.lime, boxShadow: `0 0 0 ${4 + 8 * ph}px rgba(58,204,0,${0.4 * (1 - ph)})` }} />
        </span>
      </Bar>
      {/* light sweep (clipped to the bars) */}
      {sw > 0 && sw < 1 && (
        <svg width={1080} height={1920} style={{ position: 'absolute' }}>
          <defs>
            <clipPath id="barsClip">{BARS.map((b, i) => <rect key={i} x={AX} y={b.y} width={b.w} height={b.h} rx={26} />)}</clipPath>
            <linearGradient id="shine" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#fff" stopOpacity={0} /><stop offset="0.5" stopColor="#fff" stopOpacity={0.45} /><stop offset="1" stopColor="#fff" stopOpacity={0} />
            </linearGradient>
          </defs>
          <g clipPath="url(#barsClip)">
            <rect x={mix(-300, 1100, sw)} y={500} width={220} height={1100} fill="url(#shine)" transform={`skewX(-18)`} />
          </g>
        </svg>
      )}
      {/* price line through the tips */}
      {lt > 0 && (
        <svg width={1080} height={1920} style={{ position: 'absolute' }}>
          <path d={d} fill="none" stroke={C.green} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'drop-shadow(0 4px 10px rgba(44,156,0,0.35))' }} />
          {reached.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={11} fill="#fff" stroke={C.green} strokeWidth={5} />)}
          <circle cx={head[0]} cy={head[1]} r={14} fill={C.lime} stroke="#fff" strokeWidth={4} />
          <circle cx={head[0]} cy={head[1]} r={16 + 26 * ph} fill="none" stroke={C.lime} strokeWidth={3} opacity={0.8 * (1 - ph)} />
        </svg>
      )}
      <Eyebrow text="RANKED BY MARKET VALUE" style={{ top: 1490, justifyContent: 'flex-start', left: AX, opacity: ramp(f, bf(T.caption), bf(T.caption) + 10) * (1 - ramp(f, ex + 6, ex + 14)), transform: `translateY(${(1 - ramp(f, bf(T.caption), bf(T.caption) + 12, E.out)) * 26}px)` }} />
    </AbsoluteFill>
  );
};
