// Series transitions. Each returns the frame where the screen is fully covered (`swapAt`), which is
// where the scene underneath changes. Nothing is ever a full-frame ink flash.
import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { CLAMP, E, T } from './kit';

// Slant wipe: a stack of skewed bands (mint -> lime -> green -> deep, slim ink tail) sweeps right -> left.
const SL = [{ c: T.mint, w: 600 }, { c: T.mint2, w: 450 }, { c: T.lime, w: 450 }, { c: T.green, w: 600 }, { c: T.deep, w: 350 }, { c: T.ink, w: 160 }];
const SL_W = SL.reduce((a, b) => a + b.w, 0);
const TAN = Math.tan((25 * Math.PI) / 180) * 960; // skew overhang at top/bottom
const slantX = (f: number, at: number, dur: number) => interpolate(f, [at, at + dur], [1080 + TAN, -SL_W - TAN], { ...CLAMP, easing: E.inOut });
export const slantSwap = (at: number, dur = 16) => {
  for (let f = at; f < at + dur; f++) if (slantX(f, at, dur) <= (1080 - SL_W) / 2) return f;
  return at + dur / 2;
};
export const SlantWipe: React.FC<{ at: number; dur?: number }> = ({ at, dur = 16 }) => {
  const f = useCurrentFrame();
  if (f < at || f > at + dur) return null;
  let x = slantX(f, at, dur);
  return (
    <AbsoluteFill style={{ overflow: 'hidden', pointerEvents: 'none' }}>
      {SL.map((b, i) => {
        const left = x; x += b.w;
        // +2px overlap so no hairline gaps show between bands
        return <div key={i} style={{ position: 'absolute', left, top: 0, width: b.w + 2, height: 1920, background: b.c, transform: 'skewX(-25deg)' }} />;
      })}
    </AbsoluteFill>
  );
};

// Band shutter: ticker-band coloured slats slam in from alternating sides, cover, and fly out.
const SH = [T.ink, T.lime, '#FFFFFF', T.mint2, T.green, '#FFFFFF', T.smoke, T.lime, T.mint, T.ink];
export const SHUTTER_SWAP = 8;
export const BandShutter: React.FC<{ at: number }> = ({ at }) => {
  const f = useCurrentFrame();
  if (f < at || f > at + 18) return null;
  const n = SH.length, h = 2400 / n;
  return (
    <AbsoluteFill style={{ overflow: 'hidden', pointerEvents: 'none' }}>
      <div style={{ position: 'absolute', left: -600, top: -240, width: 2280, height: 2400, transform: 'rotate(-8deg)' }}>
        {SH.map((c, i) => {
          const dir = i % 2 ? 1 : -1, d = i * 0.35;
          const tin = interpolate(f, [at + d, at + SHUTTER_SWAP], [0, 1], { ...CLAMP, easing: E.out });
          const tout = interpolate(f, [at + SHUTTER_SWAP + 1 + d, at + 18], [0, 1], { ...CLAMP, easing: E.in });
          const x = dir * (1 - tin) * 2400 - dir * tout * 2400;
          return <div key={i} style={{ position: 'absolute', left: x, top: i * h - 1, width: 2280, height: h + 2, background: c }} />;
        })}
      </div>
    </AbsoluteFill>
  );
};
