// PSX TOP 10 — series design system (FloStocks). Every episode is built from these tokens and the
// components in this folder, so only the topic, the explainer content and the data change per episode.
// Visual language (from the FloStocks PSX Weekly intro): white grid paper, PSX ticker bands with motion
// blur, split-flap boards, chart builds, slanted green band wipes, the logo lockup. Poppins only.
import React from 'react';
import { interpolate } from 'remotion';
import { C, CLAMP, E } from '../flostocks/theme';
import metrics from './metrics.json';

export * from '../flostocks/theme';

export const T = {
  ...C,
  mint: '#D8F5CC', // light band
  mint2: '#A6E58C', // mid band
  smoke: '#5B636D', // dark grey band
  silver: '#A3AAB3', // ticker text on white bands
  fog: '#C9CFD6',
};

// deterministic pseudo-random in [0, 1)
export const rnd = (seed: number) => {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
};

export const PSX_TICKERS = ['OGDC', 'UBL', 'MEBL', 'FFC', 'MARI', 'PPL', 'LUCK', 'MCB', 'HBL', 'PAKT', 'NBP', 'ENGROH', 'HUBC', 'EFERT',
  'PSO', 'SYS', 'BAHL', 'MLCF', 'FCCL', 'DGKC', 'ATRL', 'KEL', 'SNGP', 'POL', 'TRG', 'AIRLINK', 'BAFL', 'INIL', 'GHNI', 'SEARL', 'AKBL', 'NML'];

// Text width from Poppins advance metrics (scripts: series/top10/metrics.json), so copy is sized to fit
// before the fonts are even loaded. face: '900i' (kinetic), '900', '800', '700', '600', '500'.
type Face = keyof typeof metrics;
export const textW = (s: string, size: number, face: Face = '900i', tracking = -0.02) =>
  [...s].reduce((w, ch) => w + ((metrics[face] as number[])[ch.charCodeAt(0) - 32] ?? 0.6) + tracking, 0) * size;
export const fitSize = (s: string, maxW: number, maxSize: number, face: Face = '900i', tracking = -0.02) =>
  Math.min(maxSize, Math.floor(maxSize * (maxW / Math.max(1, textW(s, maxSize, face, tracking)))));

// a fast whip-in: 0 -> 1 with a hard ease-out (expo-ish), used for every kinetic entry
export const whip = (f: number, a: number, dur = 9) => interpolate(f, [a, a + dur], [0, 1], { ...CLAMP, easing: E.out });
// overshoot pop 0 -> 1 (back ease out)
export const pop = (f: number, a: number, dur = 10, k = 1.9) => {
  const t = Math.min(1, Math.max(0, (f - a) / dur));
  const u = t - 1;
  return t <= 0 ? 0 : 1 + (k + 1) * u * u * u + k * u * u;
};

// Directional motion blur: an SVG Gaussian with separate x/y deviation, keyed by a unique id.
export const MBlur: React.FC<{ id: string; x?: number; y?: number; style?: React.CSSProperties; children: React.ReactNode }> = ({ id, x = 0, y = 0, style, children }) => {
  const on = x > 0.25 || y > 0.25;
  return React.createElement('div', { style: { ...style, filter: on ? `url(#${id})` : undefined } },
    on ? React.createElement('svg', { width: 0, height: 0, style: { position: 'absolute' } },
      React.createElement('filter', { id, x: '-50%', y: '-50%', width: '200%', height: '200%', colorInterpolationFilters: 'sRGB' },
        React.createElement('feGaussianBlur', { stdDeviation: `${x.toFixed(2)} ${y.toFixed(2)}` }))) : null,
    children);
};
// blur from the per-frame displacement of an animated value (px moved per frame -> px of blur)
export const speedBlur = (fn: (f: number) => number, f: number, k = 0.45, max = 60) => Math.min(max, Math.abs(fn(f) - fn(f - 1)) * k);
