// v4 motion kit — reference-style kinetic typography in the FloStocks palette.
// * Archivo variable (wdth 62–125, wght 100–900) for the big display type, so letters
//   can squash/stretch along the width axis like a real variable-font animation.
// * Directional motion blur: an SVG feGaussianBlur whose x/y deviation follows the
//   element's velocity (px/frame), i.e. a ~180° shutter look, not a uniform blur.
// * A designer HUD frame (corner brackets, mono labels, timecode, BPM/bar counter).
// Everything is a pure function of the frame passed in.
import React from 'react';
import { AbsoluteFill, interpolate } from 'remotion';
import { FS, FS_BODY, FS_EASE, FS_MONO } from '../flostocks';
import { loadLocalFont } from '../localFont';
import { lerp, seeded, sp } from '../flostocks-v2/fx';
import { BEATF, BARF, DROP, SHOW_BARS } from './timing';

export const ARCH = loadLocalFont('Archivo', 'Archivo-wdth-wght.ttf', '100 900', 'normal', '62% 125%');
export const ARCH_I = ((): string => loadLocalFont('Archivo', 'Archivo-Italic-wdth-wght.ttf', '100 900', 'italic', '62% 125%'))();

export const C = {
  green: FS.green,
  deep: FS.greenDeep,
  lime: FS.lime,
  mint: FS.mint,
  ink: FS.ink,
  cream: '#F4F4EE',
  white: '#FFFFFF',
} as const;

export const disp = (size: number, color: string, wdth = 125, wght = 900, italic = false): React.CSSProperties => ({
  margin: 0,
  fontFamily: ARCH,
  fontStyle: italic ? 'italic' : 'normal',
  fontVariationSettings: `'wdth' ${wdth}, 'wght' ${wght}`,
  fontSize: size,
  lineHeight: 0.84,
  letterSpacing: '-0.015em',
  color,
  textTransform: 'uppercase',
  whiteSpace: 'nowrap',
});

export const thin = (size: number, color: string): React.CSSProperties => ({
  margin: 0,
  fontFamily: FS_BODY,
  fontWeight: 200,
  fontSize: size,
  color,
  letterSpacing: '-0.01em',
});

export const mono = (size: number, color: string, op = 1): React.CSSProperties => ({
  margin: 0,
  fontFamily: FS_MONO,
  fontWeight: 600,
  fontSize: size,
  letterSpacing: '0.12em',
  color,
  opacity: op,
  textTransform: 'uppercase',
});

// ---- motion blur ----------------------------------------------------------------
const K = 0.28; // blur std per px/frame of velocity
export const MBlur: React.FC<{ id: string; vx?: number; vy?: number; style?: React.CSSProperties; children: React.ReactNode }> = ({
  id,
  vx = 0,
  vy = 0,
  style,
  children,
}) => {
  const sx = Math.min(70, Math.abs(vx) * K);
  const sy = Math.min(70, Math.abs(vy) * K);
  const on = sx > 0.35 || sy > 0.35;
  return (
    <>
      {on && (
        <svg width={0} height={0} style={{ position: 'absolute' }}>
          <defs>
            <filter id={id} x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation={`${sx.toFixed(2)} ${sy.toFixed(2)}`} />
            </filter>
          </defs>
        </svg>
      )}
      <div style={{ ...style, filter: on ? `url(#${id})` : style?.filter }}>{children}</div>
    </>
  );
};

// velocity helper: derivative of any position function
export const vel = (fn: (t: number) => number, t: number) => fn(t) - fn(t - 1);

// ---- HUD ------------------------------------------------------------------------
const tc = (frame: number) => {
  const s = Math.floor(frame / 30);
  const ff = frame % 30;
  const p = (n: number) => String(n).padStart(2, '0');
  return `00:00:${p(s)}:${p(ff)}`;
};

export const Hud: React.FC<{ frame: number; label: string; tone: 'dark' | 'light' }> = ({ frame, label, tone }) => {
  const col = tone === 'dark' ? C.ink : C.white;
  const rel = frame - DROP;
  const bar = Math.min(SHOW_BARS, Math.floor(rel / BARF) + 1);
  const beat = Math.floor((rel % BARF) / BEATF);
  const prog = Math.max(0, Math.min(1, rel / (SHOW_BARS * BARF)));
  const L = 46;
  const corner = (x: number, y: number, sx: number, sy: number) => (
    <div style={{ position: 'absolute', left: x, top: y, width: L, height: L, borderLeft: sx > 0 ? `3px solid ${col}` : undefined, borderRight: sx < 0 ? `3px solid ${col}` : undefined, borderTop: sy > 0 ? `3px solid ${col}` : undefined, borderBottom: sy < 0 ? `3px solid ${col}` : undefined, opacity: 0.7 }} />
  );
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      {corner(40, 120, 1, 1)}
      {corner(1080 - 40 - L, 120, -1, 1)}
      {corner(40, 1740 - L, 1, -1)}
      {corner(1080 - 40 - L, 1740 - L, -1, -1)}
      <div style={{ position: 'absolute', top: 132, left: 104, right: 104, display: 'flex', justifyContent: 'space-between' }}>
        <span style={mono(22, col, 0.85)}>
          FLOSTOCKS <span style={{ opacity: 0.55 }}>· WHAT IS FLOSTOCKS · 2026</span>
        </span>
        <span style={mono(22, col, 0.85)}>{label}</span>
      </div>
      <div style={{ position: 'absolute', top: 1676, left: 104, right: 104, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={mono(22, col, 0.8)}>
          {tc(frame)} <span style={{ opacity: 0.5 }}>· 30 FPS</span>
        </span>
        <span style={{ ...mono(22, col, 0.8), display: 'flex', alignItems: 'center', gap: 10 }}>
          128 BPM
          {[0, 1, 2, 3].map((i) => (
            <span key={i} style={{ width: 14, height: 14, display: 'inline-block', border: `2px solid ${col}`, backgroundColor: i === beat ? col : 'transparent' }} />
          ))}
          BAR {bar}/{SHOW_BARS}
        </span>
      </div>
      <div style={{ position: 'absolute', top: 1716, left: 104, right: 104, height: 2, backgroundColor: col, opacity: 0.25 }} />
      <div style={{ position: 'absolute', top: 1716, left: 104, width: (1080 - 208) * prog, height: 2, backgroundColor: col, opacity: 0.9 }} />
    </AbsoluteFill>
  );
};

// ---- kinetic type primitives ------------------------------------------------------

// letters rise out of a baseline mask, staggered, with vertical motion blur
export const Rise: React.FC<{
  t: number;
  at: number;
  text: string;
  style: React.CSSProperties;
  stagger?: number;
  dur?: number;
  id: string;
  colorFn?: (i: number) => string;
  wdthFn?: (i: number) => number;
}> = ({ t, at, text, style, stagger = 1.6, dur = 11, id, colorFn, wdthFn }) => (
  <div style={{ display: 'flex', overflow: 'hidden', paddingBottom: 6, marginBottom: -6 }}>
    {Array.from(text).map((ch, i) => {
      const a = at + i * stagger;
      const pos = (tt: number) => lerp(tt, a, a + dur, 105, 0, FS_EASE.slam);
      const w = wdthFn ? wdthFn(i) : undefined;
      return (
        <MBlur key={i} id={`${id}${i}`} vy={(vel(pos, t) * Number(style.fontSize ?? 100)) / 100}>
          <span
            style={{
              ...style,
              display: 'inline-block',
              transform: `translateY(${pos(t)}%)`,
              color: colorFn ? colorFn(i) : style.color,
              fontVariationSettings: w !== undefined ? `'wdth' ${w}, 'wght' 900` : style.fontVariationSettings,
              whiteSpace: 'pre',
            }}
          >
            {ch}
          </span>
        </MBlur>
      );
    })}
  </div>
);

// letters fall in from above and land with squash + bounce
export const Drop: React.FC<{ t: number; at: number; text: string; style: React.CSSProperties; stagger?: number; id: string }> = ({
  t,
  at,
  text,
  style,
  stagger = 3.2,
  id,
}) => (
  <div style={{ display: 'flex' }}>
    {Array.from(text).map((ch, i) => {
      const a = at + i * stagger;
      const fall = (tt: number) => lerp(tt, a, a + 9, -1300 - seeded(i + 3) * 300, 0, FS_EASE.in);
      const landed = t - (a + 9);
      const squash = landed >= 0 ? 1 - Math.exp(-landed * 0.35) * Math.cos(landed * 0.9) * 0.22 : 1;
      const rot = lerp(t, a, a + 9, (seeded(i + 9) - 0.5) * 50, 0);
      return (
        <MBlur key={i} id={`${id}${i}`} vy={vel(fall, t)}>
          <span
            style={{
              ...style,
              display: 'inline-block',
              transform: `translateY(${fall(t)}px) rotate(${rot}deg) scaleY(${squash}) scaleX(${2 - squash})`,
              transformOrigin: '50% 100%',
              opacity: t >= a ? 1 : 0,
              whiteSpace: 'pre',
            }}
          >
            {ch}
          </span>
        </MBlur>
      );
    })}
  </div>
);

// a word that whips in horizontally and settles with overshoot
export const Whip: React.FC<{ t: number; at: number; from?: number; id: string; children: React.ReactNode; style?: React.CSSProperties }> = ({
  t,
  at,
  from = 1400,
  id,
  children,
  style,
}) => {
  const pos = (tt: number) => (tt < at ? from : interpolate(sp(tt, at, { damping: 15, stiffness: 230, mass: 0.6 }), [0, 1], [from, 0]));
  return (
    <MBlur id={id} vx={vel(pos, t)} style={{ ...style, transform: `translateX(${pos(t)}px)` }}>
      {children}
    </MBlur>
  );
};

// big disk that grows from a point (cut-through transition), with a chromatic rim
export const Disk: React.FC<{ t: number; at: number; dur?: number; color: string; cx?: number; cy?: number }> = ({
  t,
  at,
  dur = 12,
  color,
  cx = 540,
  cy = 960,
}) => {
  if (t < at) return null;
  const r = lerp(t, at, at + dur, 6, 2300, FS_EASE.in);
  return (
    <div
      style={{
        position: 'absolute',
        left: cx - r,
        top: cy - r,
        width: r * 2,
        height: r * 2,
        borderRadius: '50%',
        backgroundColor: color,
        boxShadow: `0 0 0 ${Math.min(10, r * 0.02)}px rgba(126,220,168,0.75), 0 0 0 ${Math.min(22, r * 0.04)}px rgba(69,224,31,0.35), 0 0 60px rgba(56,209,0,0.5)`,
      }}
    />
  );
};

// rows of outlined words scrolling in alternate directions with one solid row
export const Marquee: React.FC<{ t: number; word: string; color: string; solidRow?: number; size?: number; speed?: number; rows?: number; top?: number }> = ({
  t,
  word,
  color,
  solidRow = 3,
  size = 190,
  speed = 11,
  rows = 9,
  top = -40,
}) => (
  <AbsoluteFill style={{ overflow: 'hidden' }}>
    {Array.from({ length: rows }, (_, r) => {
      const dir = r % 2 ? 1 : -1;
      const x = dir * ((t * speed) % 1400) - 1400;
      const solid = r === solidRow;
      return (
        <p
          key={r}
          style={{
            ...disp(size, solid ? color : 'transparent', 125, 900),
            position: 'absolute',
            left: x,
            top: top + r * size * 0.95,
            WebkitTextStroke: solid ? undefined : `2.5px ${color}`,
            opacity: solid ? 1 : 0.55,
          }}
        >
          {`${word} ${word} ${word} ${word} ${word} ${word}`}
        </p>
      );
    })}
  </AbsoluteFill>
);

export const Field: React.FC<{ color: string; children?: React.ReactNode }> = ({ color, children }) => (
  <AbsoluteFill style={{ backgroundColor: color, overflow: 'hidden' }}>{children}</AbsoluteFill>
);

export const Grain: React.FC<{ frame: number; dark?: boolean }> = ({ frame, dark }) => (
  <AbsoluteFill
    style={{
      backgroundImage: `radial-gradient(${dark ? 'rgba(255,255,255,0.05)' : 'rgba(10,14,10,0.05)'} 1px, transparent 1px)`,
      backgroundSize: '5px 5px',
      backgroundPosition: `${(frame * 7) % 5}px ${(frame * 3) % 5}px`,
      pointerEvents: 'none',
      mixBlendMode: dark ? 'screen' : 'multiply',
    }}
  />
);

// ---- market glyphs ------------------------------------------------------------------
// a candlestick drawn around (0,0): body from open to close, wick from low to high
export const Candle: React.FC<{ x: number; y: number; w: number; body: number; wick: number; up: boolean; color?: string; opacity?: number }> = ({
  x,
  y,
  w,
  body,
  wick,
  up,
  color,
  opacity = 1,
}) => {
  const c = color ?? (up ? C.green : C.ink);
  return (
    <g transform={`translate(${x} ${y})`} opacity={opacity}>
      <line x1={0} y1={-wick / 2} x2={0} y2={wick / 2} stroke={c} strokeWidth={Math.max(2, w * 0.14)} strokeLinecap="round" />
      <rect x={-w / 2} y={-body / 2} width={w} height={body} rx={w * 0.12} fill={c} />
    </g>
  );
};

// ticker tape text (illustrative symbols/moves, not market data)
export const TAPE = '▲ KSE-100   ▲ OGDC +1.84%   ▼ HBL −0.45%   ▲ LUCK +0.92%   ▲ SYS +2.10%   ▼ MARI −1.12%   ▲ ENGRO +0.67%   ';
