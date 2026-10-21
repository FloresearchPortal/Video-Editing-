// Motion kit for the FloStocks v2 reel: springs, beat pulses, animated backdrops,
// kinetic type and small UI primitives. Frame-driven only — every helper takes the
// scene-local frame `t` so scenes stay pure functions of time.
// Music is 150 BPM, which is exactly 12 frames per beat at 30 fps.
import React from 'react';
import { AbsoluteFill, interpolate, spring } from 'remotion';
import { CLAMP, FS, FS_EASE, FS_DISPLAY } from '../flostocks';

export const FPS = 30;
export const BEAT = 12;
export const BAR = 48;

type SpringCfg = Partial<{ damping: number; stiffness: number; mass: number }>;

export const lerp = (
  t: number,
  a: number,
  b: number,
  from: number,
  to: number,
  easing: (n: number) => number = FS_EASE.out,
) => interpolate(t, [a, b], [from, to], { ...CLAMP, easing });

export const sp = (t: number, delay = 0, config: SpringCfg = {}) =>
  t < delay ? 0 : spring({ frame: t - delay, fps: FPS, config: { damping: 13, stiffness: 170, mass: 0.7, ...config } });

// snappy spring for slams
export const SNAP: SpringCfg = { damping: 16, stiffness: 280, mass: 0.55 };
// soft spring for floating UI
export const SOFT: SpringCfg = { damping: 18, stiffness: 110, mass: 0.9 };

// 1 on each beat, decaying to ~0 before the next one
export const pulse = (t: number, start = 0, every = BEAT) =>
  t < start ? 0 : Math.exp(-((t - start) % every) * 0.42);

export const seeded = (seed: number) => {
  const x = Math.sin(seed * 9999.13) * 10000;
  return x - Math.floor(x);
};

// ---- backdrops ---------------------------------------------------------------
export const Blobs: React.FC<{ t: number; base: string; colors: string[]; opacity?: number }> = ({
  t,
  base,
  colors,
  opacity = 0.55,
}) => (
  <AbsoluteFill style={{ backgroundColor: base, overflow: 'hidden' }}>
    {colors.map((c, i) => {
      const x = 50 + Math.sin(t / (34 + i * 9) + i * 2.1) * 34;
      const y = 50 + Math.cos(t / (41 + i * 7) + i * 1.3) * 36;
      return (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: `${x}%`,
            top: `${y}%`,
            width: 1200,
            height: 1200,
            marginLeft: -600,
            marginTop: -600,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${c} 0%, transparent 62%)`,
            opacity,
          }}
        />
      );
    })}
  </AbsoluteFill>
);

const PARTS = Array.from({ length: 48 }, (_, i) => ({
  x: seeded(i + 1) * 1080,
  y: seeded(i + 50) * 1980,
  s: 3 + seeded(i + 100) * 7,
  v: 1.5 + seeded(i + 150) * 4.5,
  o: 0.15 + seeded(i + 200) * 0.55,
}));

export const Particles: React.FC<{ t: number; color: string; speed?: number }> = ({ t, color, speed = 1 }) => (
  <AbsoluteFill style={{ pointerEvents: 'none' }}>
    {PARTS.map((p, i) => {
      const y = (((p.y - t * p.v * speed) % 2000) + 2000) % 2000 - 40;
      const x = p.x + Math.sin(t / 26 + i) * 16;
      return (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: x,
            top: y,
            width: p.s,
            height: p.s,
            borderRadius: p.s,
            backgroundColor: color,
            opacity: p.o,
          }}
        />
      );
    })}
  </AbsoluteFill>
);

// receding neon grid floor (speed in px/frame)
export const GridFloor: React.FC<{ t: number; color?: string; speed?: number }> = ({
  t,
  color = 'rgba(56,209,0,0.45)',
  speed = 7,
}) => (
  <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 760, perspective: 600, overflow: 'hidden' }}>
    <div
      style={{
        position: 'absolute',
        left: -1400,
        right: -1400,
        bottom: 0,
        height: 2600,
        transformOrigin: '50% 100%',
        transform: 'rotateX(74deg)',
        backgroundImage: `linear-gradient(${color} 3px, transparent 3px), linear-gradient(90deg, ${color} 3px, transparent 3px)`,
        backgroundSize: '110px 110px',
        backgroundPosition: `0px ${(t * speed) % 110}px`,
        WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 70%)',
        maskImage: 'linear-gradient(to bottom, transparent 0%, black 70%)',
      }}
    />
  </div>
);

export const Rays: React.FC<{ t: number; color: string; opacity?: number; cx?: string; cy?: string }> = ({
  t,
  color,
  opacity = 0.12,
  cx = '50%',
  cy = '50%',
}) => (
  <div
    style={{
      position: 'absolute',
      left: cx,
      top: cy,
      width: 3200,
      height: 3200,
      marginLeft: -1600,
      marginTop: -1600,
      background: `repeating-conic-gradient(from ${t * 0.7}deg, ${color} 0deg 5deg, transparent 5deg 15deg)`,
      opacity,
      WebkitMaskImage: 'radial-gradient(circle, black 0%, transparent 55%)',
      maskImage: 'radial-gradient(circle, black 0%, transparent 55%)',
    }}
  />
);

export const Stripes: React.FC<{ t: number; color: string }> = ({ t, color }) => (
  <AbsoluteFill
    style={{
      backgroundImage: `repeating-linear-gradient(-35deg, ${color} 0px, ${color} 40px, transparent 40px, transparent 120px)`,
      backgroundPosition: `${(t * 4) % 147}px 0px`,
      backgroundSize: '147px 147px',
    }}
  />
);

// ---- kinetic type ------------------------------------------------------------
export const Slam: React.FC<{
  t: number;
  at: number;
  from?: number;
  rot?: number;
  style?: React.CSSProperties;
  children: React.ReactNode;
}> = ({ t, at, from = 2.6, rot = 0, style, children }) => {
  const s = sp(t, at, SNAP);
  const scale = interpolate(s, [0, 1], [from, 1]);
  const blur = Math.max(0, 1 - s) * 16;
  return (
    <div
      style={{
        ...style,
        opacity: Math.min(1, s * 3),
        transform: `scale(${scale}) rotate(${rot * (1 - s)}deg)`,
        filter: blur > 0.3 ? `blur(${blur}px)` : undefined,
      }}
    >
      {children}
    </div>
  );
};

// text rises out of a mask line
export const Reveal: React.FC<{ t: number; at: number; dur?: number; style?: React.CSSProperties; children: React.ReactNode }> = ({
  t,
  at,
  dur = 10,
  style,
  children,
}) => (
  <div style={{ overflow: 'hidden', paddingBottom: 14, marginBottom: -14, ...style }}>
    <div style={{ transform: `translateY(${lerp(t, at, at + dur, 115, 0, FS_EASE.slam)}%)` }}>{children}</div>
  </div>
);

// huge outlined words scrolling sideways as texture
export const OutlineMarquee: React.FC<{ t: number; word: string; color: string; opacity?: number }> = ({
  t,
  word,
  color,
  opacity = 0.14,
}) => (
  <AbsoluteFill style={{ opacity, overflow: 'hidden' }}>
    {[0, 1, 2, 3, 4].map((row) => {
      const dir = row % 2 === 0 ? -1 : 1;
      const x = dir * ((t * 9) % 900) - 900;
      return (
        <p
          key={row}
          style={{
            margin: 0,
            position: 'absolute',
            top: row * 400 - 40,
            left: x,
            whiteSpace: 'nowrap',
            fontFamily: FS_DISPLAY,
            fontWeight: 800,
            fontStyle: 'italic',
            fontSize: 300,
            color: 'transparent',
            WebkitTextStroke: `3px ${color}`,
            textTransform: 'uppercase',
          }}
        >
          {`${word} ${word} ${word} ${word} ${word}`}
        </p>
      );
    })}
  </AbsoluteFill>
);

// ---- UI primitives -----------------------------------------------------------
export const Cursor: React.FC<{ x: number; y: number; pressed?: number; opacity?: number }> = ({
  x,
  y,
  pressed = 0,
  opacity = 1,
}) => (
  <svg
    width="84"
    height="84"
    viewBox="0 0 28 28"
    style={{
      position: 'absolute',
      left: x - 8,
      top: y - 6,
      opacity,
      transform: `scale(${1 - pressed * 0.18})`,
      transformOrigin: '8px 6px',
      filter: 'drop-shadow(0 6px 10px rgba(0,0,0,0.35))',
      zIndex: 20,
    }}
  >
    <path d="M3 2 L3 22 L8.5 17 L12 25 L15.5 23.5 L12 15.8 L19.5 15.8 Z" fill="#ffffff" stroke="#0a0e0a" strokeWidth="1.6" strokeLinejoin="round" />
  </svg>
);

export const Ripple: React.FC<{ t: number; at: number; x: number; y: number; color?: string }> = ({
  t,
  at,
  x,
  y,
  color = FS.green,
}) => {
  if (t < at || t > at + 22) return null;
  const r = lerp(t, at, at + 22, 10, 210);
  return (
    <div
      style={{
        position: 'absolute',
        left: x - r,
        top: y - r,
        width: r * 2,
        height: r * 2,
        borderRadius: '50%',
        border: `6px solid ${color}`,
        opacity: lerp(t, at, at + 22, 0.9, 0),
        zIndex: 19,
      }}
    />
  );
};

const BURST = Array.from({ length: 34 }, (_, i) => {
  const a = seeded(i + 300) * Math.PI * 2;
  const v = 9 + seeded(i + 340) * 17;
  return {
    vx: Math.cos(a) * v,
    vy: Math.sin(a) * v - 9,
    s: 10 + seeded(i + 380) * 16,
    rot: seeded(i + 420) * 360,
    c: i % 3,
    shape: i % 2,
  };
});

export const Confetti: React.FC<{ t: number; at: number; x: number; y: number; colors?: string[] }> = ({
  t,
  at,
  x,
  y,
  colors = [FS.green, FS.mint, FS.paper],
}) => {
  const d = t - at;
  if (d < 0 || d > 42) return null;
  return (
    <>
      {BURST.map((p, i) => {
        const px = x + p.vx * d;
        const py = y + p.vy * d + 0.55 * d * d;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: px,
              top: py,
              width: p.s,
              height: p.shape ? p.s : p.s * 0.45,
              borderRadius: p.shape ? '50%' : 3,
              backgroundColor: colors[p.c % colors.length],
              opacity: lerp(d, 26, 42, 1, 0),
              transform: `rotate(${p.rot + d * 14}deg)`,
              zIndex: 18,
            }}
          />
        );
      })}
    </>
  );
};

export const glass = (dark = true): React.CSSProperties => ({
  backgroundColor: dark ? 'rgba(18,26,18,0.72)' : 'rgba(255,255,255,0.82)',
  border: `1.5px solid ${dark ? 'rgba(126,220,168,0.28)' : 'rgba(10,14,10,0.08)'}`,
  borderRadius: 40,
  boxShadow: dark ? '0 30px 80px rgba(0,0,0,0.55)' : '0 24px 60px rgba(10,14,10,0.14)',
  backdropFilter: 'blur(18px)',
});
