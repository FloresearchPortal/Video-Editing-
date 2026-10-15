// Decorative finance layer: light grid + faint candlesticks with a moving-average line, drifting
// slowly left. NO labels or numbers (so it never reads as real price data). The drift decelerates
// through the CTA build and is fully still for the CTA hold.
import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { C } from './theme';
import { bf, S, CTA_STATIC } from './timeline';

const rng = (seed: number) => () => {
  seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const N = 96, STEP = 34, BW = 16;
const CANDLES = (() => {
  const r = rng(20261014);
  let p = 0.55;
  const out: { o: number; c: number; h: number; l: number }[] = [];
  for (let i = 0; i < N; i++) {
    const drift = 0.006 * Math.sin(i / 9) + 0.002;
    const c = Math.min(0.92, Math.max(0.08, p + drift + (r() - 0.5) * 0.09));
    const h = Math.max(p, c) + r() * 0.04, l = Math.min(p, c) - r() * 0.04;
    out.push({ o: p, c, h, l }); p = c;
  }
  return out;
})();
const MA = CANDLES.map((_, i) => {
  const w = CANDLES.slice(Math.max(0, i - 7), i + 1);
  return w.reduce((s, k) => s + k.c, 0) / w.length;
});

// position of the drift: constant speed, easing to a stop between cta.start and cta.static_from
const V = 0.55;
const driftAt = (f: number) => {
  const f0 = bf(S.cta.start), f1 = CTA_STATIC;
  if (f <= f0) return V * f;
  const t = Math.min(f, f1) - f0, d = f1 - f0;
  return V * (f0 + t - (t * t) / (2 * d));
};

export const Backdrop: React.FC<{ opacity?: number }> = ({ opacity = 1 }) => {
  const f = useCurrentFrame();
  const dx = -driftAt(f);
  const Y0 = 860, Y1 = 1560; // band the chart lives in
  const y = (v: number) => Y1 - v * (Y1 - Y0);
  const ma = MA.map((v, i) => `${i ? 'L' : 'M'}${(i * STEP + BW / 2).toFixed(1)},${y(v).toFixed(1)}`).join(' ');
  return (
    <AbsoluteFill style={{ background: 'linear-gradient(180deg, #FFFFFF, #F7FBF8)' }}>
      {/* the site hero's soft green light */}
      <AbsoluteFill style={{ background: 'radial-gradient(900px 620px at 82% 6%, rgba(44,156,0,0.10), transparent 62%), radial-gradient(760px 640px at 0% 94%, rgba(44,156,0,0.05), transparent 62%)' }} />
      <svg width={1080} height={1920} style={{ position: 'absolute', opacity }}>
        <defs>
          <pattern id="grid" width={90} height={90} patternUnits="userSpaceOnUse">
            <path d="M90 0H0V90" fill="none" stroke={C.grid} strokeWidth={2} />
          </pattern>
          <linearGradient id="fadeY" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#fff" stopOpacity={0} />
            <stop offset="0.25" stopColor="#fff" stopOpacity={1} />
            <stop offset="0.8" stopColor="#fff" stopOpacity={1} />
            <stop offset="1" stopColor="#fff" stopOpacity={0} />
          </linearGradient>
          <mask id="chartMask"><rect x={0} y={Y0 - 120} width={1080} height={Y1 - Y0 + 240} fill="url(#fadeY)" /></mask>
        </defs>
        <rect width={1080} height={1920} fill="url(#grid)" />
        <g mask="url(#chartMask)">
          <g transform={`translate(${dx},0)`}>
            {CANDLES.map((k, i) => {
              const up = k.c >= k.o, x = i * STEP;
              const col = up ? C.green : C.ink;
              return (
                <g key={i} opacity={up ? 0.075 : 0.05}>
                  <rect x={x + BW / 2 - 1.5} y={y(k.h)} width={3} height={y(k.l) - y(k.h)} fill={col} />
                  <rect x={x} y={y(Math.max(k.o, k.c))} width={BW} height={Math.max(3, Math.abs(y(k.o) - y(k.c)))} rx={2} fill={col} />
                </g>
              );
            })}
            <path d={ma} fill="none" stroke={C.green} strokeOpacity={0.13} strokeWidth={4} strokeLinejoin="round" />
          </g>
        </g>
      </svg>
    </AbsoluteFill>
  );
};
