// FLOSTOCKS EXPLAINS — series design system. Every episode builds from these tokens + components
// (BrandWipe, Punch, TickerStrip, EpisodeCard, Leaderboard, EndCard) so the series stays consistent.
// Brand source: flostocks.com (site tokens, logo mark = 2 green slanted bars + 1 ink bar, heavy italic
// wordmark). Type: Poppins only (SIL OFL, media/series/flostocks/fonts).
import type React from 'react';
import { continueRender, delayRender, Easing, interpolate, staticFile } from 'remotion';

export const C = {
  paper: '#FFFFFF',
  mist: '#F5F7FA',
  ink: '#0B0F14', // site ink-2
  green: '#2C9C00', // logo green
  lime: '#3ACC00', // logo lime
  deep: '#1E6E00',
  grey: '#6B7280', // site grey-50
  grey70: '#3C434D',
  line: '#E7EBF0',
  track: '#EEF1F4',
};
export const GRAD = `linear-gradient(135deg, ${C.deep}, ${C.green} 55%, ${C.lime})`;
export const SLANT = -10; // degrees: the logo's italic slant, used for bars and kinetic type
export const FONT = 'Poppins';
// kinetic headline: Black Italic caps, tight
export const KIN: React.CSSProperties = { fontFamily: FONT, fontWeight: 900, fontStyle: 'italic', letterSpacing: '-0.02em', textTransform: 'uppercase' };
export const SHADOW = {
  sm: '0 1px 2px rgba(11,15,20,0.04), 0 8px 24px rgba(11,15,20,0.05)',
  md: '0 2px 6px rgba(11,15,20,0.05), 0 24px 60px rgba(11,15,20,0.09)',
  lg: '0 8px 24px rgba(11,15,20,0.08), 0 40px 90px rgba(11,15,20,0.14)',
};

const FACES: [string, string, string][] = [
  ['Poppins-Black.ttf', '900', 'normal'], ['Poppins-BlackItalic.ttf', '900', 'italic'],
  ['Poppins-ExtraBold.ttf', '800', 'normal'], ['Poppins-Bold.ttf', '700', 'normal'],
  ['Poppins-SemiBold.ttf', '600', 'normal'], ['Poppins-SemiBoldItalic.ttf', '600', 'italic'],
  ['Poppins-Medium.ttf', '500', 'normal'], ['Poppins-MediumItalic.ttf', '500', 'italic'],
  ['Poppins-Regular.ttf', '400', 'normal'], ['Poppins-Italic.ttf', '400', 'italic'],
];
if (typeof document !== 'undefined') {
  const handle = delayRender('flostocks fonts');
  Promise.all(FACES.map(([file, weight, style]) => {
    const face = new FontFace(FONT, `url('${staticFile(`series/flostocks/fonts/${file}`)}')`, { weight, style });
    return face.load().then((f) => (document.fonts as any).add(f));
  })).then(() => continueRender(handle)).catch((e) => { console.error(e); continueRender(handle); });
}
export const seriesAsset = (p: string) => staticFile(`series/flostocks/${p}`);

export const CLAMP = { extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const };
export const E = {
  out: Easing.bezier(0.16, 1, 0.3, 1),
  inOut: Easing.bezier(0.65, 0, 0.35, 1),
  in: Easing.bezier(0.55, 0, 0.75, 0.2),
  site: Easing.bezier(0.22, 0.61, 0.36, 1), // flostocks.com --ease
};
export const ramp = (f: number, a: number, b: number, ease = E.out) =>
  interpolate(f, [a, Math.max(b, a + 0.001)], [0, 1], { ...CLAMP, easing: ease });
export const mix = (a: number, b: number, t: number) => a + (b - a) * t;
export const mixHex = (a: string, b: string, t: number) => {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  return '#' + pa.map((v, i) => Math.round(mix(v, pb[i], Math.min(1, Math.max(0, t)))).toString(16).padStart(2, '0')).join('');
};
export const fmt2 = (v: number) => v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
