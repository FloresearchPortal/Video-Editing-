// FLOSTOCKS PSX Top 10 — look: colours, type, shared geometry, easing helpers.
import { continueRender, delayRender, Easing, interpolate, staticFile } from 'remotion';

export const C = {
  paper: '#FFFFFF',
  ink: '#111111',
  green: '#2C9C00', // FLOSTOCKS logo green
  lime: '#3ACC00', // logo lime, accents only
  deep: '#1E6E00', // darker shade of the logo green (hook bands only)
  grey: '#7E857D',
  ghost: '#C9CEC7',
  track: '#EEF1ED',
  grid: '#F1F3F0',
};

export const FONT = { display: 'FS Display', serif: 'FS Serif', mono: 'FS Mono' };

// Fonts ship with the project (SIL OFL, media/projects/psx-top10/fonts) so renders are deterministic.
const FACES: [string, string, string, string][] = [
  [FONT.display, 'InterDisplay-Black.ttf', '900', 'normal'],
  [FONT.display, 'InterDisplay-ExtraBold.ttf', '800', 'normal'],
  [FONT.display, 'InterDisplay-Bold.ttf', '700', 'normal'],
  [FONT.serif, 'InstrumentSerif-Italic.ttf', '400', 'italic'],
  [FONT.mono, 'JetBrainsMono.ttf', '100 800', 'normal'],
];
if (typeof document !== 'undefined') {
  const handle = delayRender('psx-top10 fonts');
  Promise.all(FACES.map(([family, file, weight, style]) => {
    const face = new FontFace(family, `url('${staticFile(`projects/psx-top10/fonts/${file}`)}')`, { weight, style });
    return face.load().then((f) => (document.fonts as any).add(f));
  })).then(() => continueRender(handle)).catch((e) => { console.error(e); continueRender(handle); });
}

export const asset = (p: string) => staticFile(`projects/psx-top10/${p}`);

// ---- the market-cap column (countdown hero), shared by the countdown, the #1 flood and the ranking
export const COL = { x: 770, w: 160, base: 1540, top: 420, max: 1400 };
export const colH = (bn: number) => (Math.max(0, bn) / COL.max) * (COL.base - COL.top);

// ---- easing
export const CLAMP = { extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const };
export const E = {
  out: Easing.bezier(0.16, 1, 0.3, 1), // expo-ish out: fast arrival, soft landing
  inOut: Easing.bezier(0.65, 0, 0.35, 1),
  in: Easing.bezier(0.55, 0, 0.75, 0.2),
  back: Easing.bezier(0.34, 1.45, 0.64, 1), // gentle overshoot for slams
};
// 0..1 progress between frames a and b
export const ramp = (f: number, a: number, b: number, ease = E.out) =>
  interpolate(f, [a, Math.max(b, a + 0.001)], [0, 1], { ...CLAMP, easing: ease });
export const mix = (a: number, b: number, t: number) => a + (b - a) * t;

// rise in from below / lift out upward (direction rule: bottom -> top)
export const riseIn = (f: number, start: number, dist = 56, dur = 12) => {
  const t = ramp(f, start, start + dur);
  return { opacity: ramp(f, start, start + dur * 0.6, E.inOut), y: (1 - t) * dist };
};
export const liftOut = (f: number, start: number, dist = 48, dur = 9) => {
  const t = ramp(f, start, start + dur, E.inOut);
  return { opacity: 1 - t, y: -t * dist };
};
// combined enter/leave: visible between enter and leave (leave = Infinity for never)
export const life = (f: number, enter: number, leave = Infinity, dist = 56) => {
  const a = riseIn(f, enter, dist);
  const b = leave === Infinity ? { opacity: 1, y: 0 } : liftOut(f, leave);
  return { opacity: a.opacity * b.opacity, transform: `translateY(${a.y + b.y}px)` };
};

export const fmtBn = (v: number) => v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// mix two hex colours
export const mixHex = (a: string, b: string, t: number) => {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  return '#' + pa.map((v, i) => Math.round(mix(v, pb[i], Math.min(1, Math.max(0, t)))).toString(16).padStart(2, '0')).join('');
};
