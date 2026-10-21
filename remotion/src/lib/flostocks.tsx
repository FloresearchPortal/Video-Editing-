// FloStocks (Floret Capitals) theme kit for the "What is FloStocks?" motion-graphic video.
// Shared by the shots in src/shots/flostocks/ — NOT a shot (no compositionConfig).
// Tokens mirror brand/brand.json; fonts are the brand families loaded from Google Fonts.
import React from 'react';
import { AbsoluteFill, Easing, Img, interpolate, staticFile, useCurrentFrame } from 'remotion';
import { loadLocalFont } from './localFont';

// Brand families (brand/brand.json), served offline from media/fonts/ (SIL OFL).
export const FS_DISPLAY = ((): string => {
  loadLocalFont('Manrope', 'Manrope-Bold.ttf', '700');
  return loadLocalFont('Manrope', 'Manrope-ExtraBold.ttf', '800');
})();
export const FS_BODY = loadLocalFont('Inter', 'Inter-opsz-wght.ttf', '100 900');
export const FS_MONO = loadLocalFont('IBM Plex Mono', 'IBMPlexMono-SemiBold.ttf', '600');

export const FS = {
  green: '#38d100',
  greenDeep: '#1f7a00',
  logoGreen: '#2f9f00',
  lime: '#45e01f',
  mint: '#7edca8',
  ink: '#0a0e0a',
  black: '#000000',
  paper: '#ffffff',
  mist: '#f5f7fa',
  gray: '#59635c',
  rise: '#17971e',
  fall: '#e23b2e',
  amber: '#c4820e',
} as const;

export const FS_EASE = {
  out: Easing.bezier(0.33, 1, 0.68, 1),
  in: Easing.bezier(0.32, 0, 0.67, 0),
  inOut: Easing.bezier(0.37, 0, 0.63, 1),
  slam: Easing.bezier(0.16, 1, 0.3, 1), // very fast arrival, long settle
  overshoot: Easing.bezier(0.34, 1.45, 0.64, 1),
} as const;

export const CLAMP = { extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const };

export const LOGO = {
  fullOnDark: staticFile('brand/flostocks-logo-full-light.png'), // light wordmark for dark bg
  fullOnLight: staticFile('brand/flostocks-logo-full.png'),
  iconOnDark: staticFile('brand/flostocks-icon-light.png'),
  iconOnLight: staticFile('brand/flostocks-icon.png'),
} as const;

// Brand slant (brand.json caption_slant_deg = 10; the wordmark is a heavy italic).
export const SLANT_DEG = 10;

// ---- dark brand backdrop: ink + green glow + faint grid ---------------------
export const FsDarkBg: React.FC<{ glow?: number }> = ({ glow = 0.16 }) => (
  <>
    <AbsoluteFill style={{ backgroundColor: FS.ink }} />
    <AbsoluteFill
      style={{
        background: `radial-gradient(900px 1300px at 50% 118%, rgba(56,209,0,${glow}), transparent 62%)`,
      }}
    />
    <AbsoluteFill
      style={{
        backgroundImage: 'radial-gradient(rgba(126,220,168,0.14) 1.5px, transparent 1.5px)',
        backgroundSize: '54px 54px',
        opacity: 0.5,
      }}
    />
  </>
);

// ---- logo watermark, brand spec: icon_on_dark top-right, 11% width, 0.85 ----
export const FsWatermark: React.FC<{ width: number; onLight?: boolean; appear?: number }> = ({
  width,
  onLight = false,
  appear = 0,
}) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [appear, appear + 10], [0, 0.85], { ...CLAMP, easing: FS_EASE.out });
  return (
    <Img
      src={onLight ? LOGO.iconOnLight : LOGO.iconOnDark}
      style={{
        position: 'absolute',
        top: 54,
        right: 44,
        width: width * 0.11,
        opacity: o,
      }}
    />
  );
};

// ---- big display headline helper -------------------------------------------
export const fsHeadline = (size: number, color: string, extra?: React.CSSProperties): React.CSSProperties => ({
  margin: 0,
  fontFamily: FS_DISPLAY,
  fontWeight: 800,
  fontSize: size,
  lineHeight: 1.02,
  letterSpacing: '-0.025em',
  color,
  textTransform: 'uppercase',
  fontStyle: 'italic',
  ...extra,
});
