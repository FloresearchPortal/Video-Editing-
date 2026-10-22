// v7 kit — premium Apple-style UI × dynamic fintech motion.
// * Type: Inter (SF-like) with tight tracking, big bold headlines + grey secondary lines.
// * Surfaces: white / #F5F5F7 canvases, white cards with soft layered shadows, frosted glass.
// * Motion: Apple's ease (fast start, very soft landing, no overshoot) and keynote-style
//   word reveals (rise + fade + de-blur). Nothing pulses or loops on the beat.
// * Fintech: line charts that draw, candlesticks, sparklines, pills, counters.
// Every helper is a pure function of the frame passed in.
import React from 'react';
import { AbsoluteFill, Easing, interpolate } from 'remotion';
import { FS, FS_BODY, FS_MONO } from '../flostocks';
import { seeded } from '../flostocks-v2/fx';

export const A = {
  bg: '#FFFFFF',
  mist: '#F5F5F7',
  ink: '#1D1D1F',
  sub: '#6E6E73',
  faint: '#D2D2D7',
  line: 'rgba(0,0,0,0.08)',
  green: FS.green,
  deep: '#1F8A00', // green for text on white (contrast)
  red: '#E5484D',
} as const;

export const APPLE = Easing.bezier(0.32, 0.72, 0, 1);
const CL = { extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const };

/** 0→1 over `dur` frames from `at`, Apple ease. */
export const ap = (t: number, at: number, dur = 16, e: (n: number) => number = APPLE) => interpolate(t, [at, at + dur], [0, 1], { ...CL, easing: e });
export const mixN = (a: number, b: number, k: number) => a + (b - a) * k;

export const sf = (size: number, weight = 700, color: string = A.ink): React.CSSProperties => ({
  margin: 0,
  fontFamily: FS_BODY,
  fontWeight: weight,
  fontSize: size,
  letterSpacing: size >= 60 ? '-0.04em' : size >= 34 ? '-0.02em' : '-0.005em',
  lineHeight: 1.06,
  color,
  whiteSpace: 'nowrap',
});
export const num = (size: number, weight = 700, color: string = A.ink): React.CSSProperties => ({
  ...sf(size, weight, color),
  fontVariantNumeric: 'tabular-nums',
});
export const mono = (size: number, color: string = A.sub): React.CSSProperties => ({
  margin: 0,
  fontFamily: FS_MONO,
  fontWeight: 600,
  fontSize: size,
  letterSpacing: '0.08em',
  color,
  textTransform: 'uppercase',
  whiteSpace: 'nowrap',
});

/** Keynote-style reveal: each word rises, fades in and de-blurs, staggered. One line. */
export const Reveal: React.FC<{
  t: number;
  at: number;
  text: string;
  style: React.CSSProperties;
  stagger?: number;
  dur?: number;
  align?: 'flex-start' | 'center' | 'flex-end';
  colorFn?: (word: string, i: number) => string | undefined;
}> = ({ t, at, text, style, stagger = 2.5, dur = 16, align = 'flex-start', colorFn }) => {
  const words = text.split(' ');
  return (
    <div style={{ display: 'flex', justifyContent: align, gap: '0.24em', fontSize: style.fontSize }}>
      {words.map((w, i) => {
        const p = ap(t, at + i * stagger, dur);
        return (
          <span
            key={i}
            style={{
              ...style,
              display: 'inline-block',
              color: colorFn?.(w, i) ?? style.color,
              transform: `translateY(${(1 - p) * 0.45}em)`,
              opacity: p,
              filter: p < 1 ? `blur(${(1 - p) * 12}px)` : undefined,
            }}
          >
            {w}
          </span>
        );
      })}
    </div>
  );
};

/** Card / sheet entrance: rise + fade + slight scale, Apple ease. */
export const enter = (t: number, at: number, dur = 18, dy = 90) => {
  const p = ap(t, at, dur);
  return { p, style: { opacity: p, transform: `translateY(${(1 - p) * dy}px) scale(${0.96 + 0.04 * p})` } as React.CSSProperties };
};

export const SHADOW = '0 1px 2px rgba(0,0,0,0.04), 0 10px 30px rgba(0,0,0,0.07), 0 30px 80px rgba(0,0,0,0.06)';

export const Card: React.FC<{ x: number; y: number; w: number; h: number; r?: number; bg?: string; style?: React.CSSProperties; children?: React.ReactNode }> = ({
  x,
  y,
  w,
  h,
  r = 44,
  bg = A.bg,
  style,
  children,
}) => (
  <div style={{ position: 'absolute', left: x, top: y, width: w, height: h, borderRadius: r, backgroundColor: bg, boxShadow: SHADOW, overflow: 'hidden', ...style }}>
    {children}
  </div>
);

/** Frosted-glass pill. */
export const Chip: React.FC<{ children: React.ReactNode; style?: React.CSSProperties; dark?: boolean }> = ({ children, style, dark }) => (
  <div
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 12,
      padding: '16px 28px',
      borderRadius: 999,
      backgroundColor: dark ? 'rgba(29,29,31,0.9)' : 'rgba(255,255,255,0.78)',
      border: `1px solid ${dark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)'}`,
      boxShadow: '0 6px 24px rgba(0,0,0,0.08)',
      ...style,
    }}
  >
    {children}
  </div>
);

export const Pill: React.FC<{ up: boolean; text: string; size?: number }> = ({ up, text, size = 26 }) => (
  <span
    style={{
      ...num(size, 700, '#fff'),
      backgroundColor: up ? A.green : A.red,
      padding: `${size * 0.22}px ${size * 0.5}px`,
      borderRadius: size * 0.4,
      display: 'inline-block',
    }}
  >
    {text}
  </span>
);

/** Soft white canvas with a faint green glow and mist floor (static: nothing pulses). */
export const Canvas: React.FC<{ tone?: 'white' | 'mist'; children?: React.ReactNode }> = ({ tone = 'white', children }) => (
  <AbsoluteFill style={{ backgroundColor: tone === 'white' ? A.bg : A.mist, overflow: 'hidden' }}>
    <AbsoluteFill
      style={{
        background:
          'radial-gradient(900px 700px at 88% 6%, rgba(56,209,0,0.10), rgba(56,209,0,0) 70%), radial-gradient(900px 800px at 0% 100%, rgba(0,0,0,0.035), rgba(0,0,0,0) 70%)',
      }}
    />
    {children}
  </AbsoluteFill>
);

// ---- fintech primitives -----------------------------------------------------------------

/** Deterministic random walk, normalised to 0..1 (0 = bottom). */
export const walk = (n: number, seed: number, drift = 0.6, vol = 1) => {
  const out: number[] = [];
  let v = 0;
  for (let i = 0; i < n; i++) {
    v += (seeded(seed + i * 7.13) - 0.5 + drift * 0.18) * vol;
    out.push(v);
  }
  const lo = Math.min(...out);
  const hi = Math.max(...out);
  return out.map((x) => (x - lo) / (hi - lo || 1));
};

/** Line chart that draws left→right to `prog`, with gradient area and a live end dot. */
export const LineChart: React.FC<{
  id: string;
  data: number[];
  w: number;
  h: number;
  prog: number;
  color?: string;
  stroke?: number;
  area?: boolean;
  dot?: boolean;
  grid?: boolean;
}> = ({ id, data, w, h, prog, color = A.green, stroke = 6, area = true, dot = true, grid = false }) => {
  const n = data.length - 1;
  const pt = (i: number): [number, number] => [(i / n) * w, h - 8 - data[i] * (h - 16)];
  const upto = Math.max(0, Math.min(1, prog)) * n;
  const k = Math.floor(upto);
  const u = upto - k;
  const pts: [number, number][] = [];
  for (let i = 0; i <= k; i++) pts.push(pt(i));
  if (k < n) {
    const a = pt(k);
    const c = pt(k + 1);
    pts.push([a[0] + (c[0] - a[0]) * u, a[1] + (c[1] - a[1]) * u]);
  }
  const d = pts.map((p, i) => `${i ? 'L' : 'M'} ${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ');
  const tip = pts[pts.length - 1];
  return (
    <svg width={w} height={h} style={{ overflow: 'visible', display: 'block' }}>
      <defs>
        <linearGradient id={`g${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={color} stopOpacity={0.28} />
          <stop offset="1" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      {grid &&
        [0.25, 0.5, 0.75].map((g) => <line key={g} x1={0} x2={w} y1={h * g} y2={h * g} stroke="rgba(0,0,0,0.06)" strokeWidth={2} strokeDasharray="2 10" />)}
      {area && pts.length > 1 && <path d={`${d} L ${tip[0]} ${h} L 0 ${h} Z`} fill={`url(#g${id})`} />}
      {pts.length > 1 && <path d={d} fill="none" stroke={color} strokeWidth={stroke} strokeLinejoin="round" strokeLinecap="round" />}
      {dot && prog > 0.02 && (
        <g>
          <circle cx={tip[0]} cy={tip[1]} r={stroke * 3} fill={color} opacity={0.18} />
          <circle cx={tip[0]} cy={tip[1]} r={stroke * 1.4} fill="#fff" stroke={color} strokeWidth={stroke * 0.8} />
        </g>
      )}
    </svg>
  );
};

export const Candle: React.FC<{ x: number; y: number; w: number; body: number; wick: number; up: boolean; opacity?: number; color?: string }> = ({ x, y, w, body, wick, up, opacity = 1, color }) => {
  const col = color ?? (up ? A.green : A.red);
  return (
    <g opacity={opacity}>
      <line x1={x} x2={x} y1={y - wick / 2} y2={y + wick / 2} stroke={col} strokeWidth={Math.max(2, w * 0.14)} strokeLinecap="round" />
      <rect x={x - w / 2} y={y - body / 2} width={w} height={Math.max(2, body)} rx={w * 0.18} fill={col} />
    </g>
  );
};

export const fmt = (v: number, dec = 0) => v.toLocaleString('en-US', { minimumFractionDigits: dec, maximumFractionDigits: dec });

/** Apple-style check circle that fills and draws its tick when `p` goes 0→1. */
export const Check: React.FC<{ p: number; size?: number }> = ({ p, size = 64 }) => (
  <svg width={size} height={size} viewBox="0 0 64 64">
    <circle cx={32} cy={32} r={29} fill={p > 0 ? A.green : 'none'} fillOpacity={Math.min(1, p * 2)} stroke={p > 0 ? A.green : A.faint} strokeWidth={4} />
    <path d="M19 33 L28 42 L46 23" fill="none" stroke="#fff" strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - Math.max(0, Math.min(1, (p - 0.3) / 0.7))} />
  </svg>
);
