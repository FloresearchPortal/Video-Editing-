// The FloStocks logo lockup (series intro + CTA share it): the mark drops in, the wordmark wipes on
// behind a lime edge, "By Floret Capitals" rises, a green rule draws, then two headline lines.
// The official logo PNG is sliced with clip-paths (never redrawn).
import React from 'react';
import { useCurrentFrame } from 'remotion';
import { E, FONT, MBlur, T, mix, pop, ramp, seriesAsset, whip } from './kit';

const LW = 1164, LH = 306; // FLOSTOCKS.png
const MARK_R = 218 / LW; // mark occupies x < 218
const WORD_B = 232 / LH; // wordmark above y 232, byline below

export const LogoBuild: React.FC<{ at: number; width?: number }> = ({ at, width = 760 }) => {
  const f = useCurrentFrame();
  const h = (width * LH) / LW;
  const m = pop(f, at, 10, 2.2);
  const mY = mix(-140, 0, whip(f, at, 8));
  const wipe = ramp(f, at + 3, at + 13, E.out);
  const by = ramp(f, at + 10, at + 18, E.out);
  const img = (clip: string, style?: React.CSSProperties) => (
    <img src={seriesAsset('logos/FLOSTOCKS.png')} style={{ position: 'absolute', left: 0, top: 0, width, height: h, clipPath: clip, ...style }} />
  );
  const edgeX = MARK_R * width + wipe * (1 - MARK_R) * width;
  return (
    <div style={{ position: 'relative', width, height: h }}>
      <MBlur id={`lmark${at}`} y={Math.min(16, Math.abs(mix(-140, 0, whip(f, at, 8)) - mix(-140, 0, whip(f - 1, at, 8))) * 0.4)} style={{ position: 'absolute', inset: 0 }}>
        {img(`inset(0 ${(1 - MARK_R) * 100}% ${(1 - WORD_B) * 100}% 0)`, { transform: `translateY(${mY}px) scale(${Math.max(0, m)})`, transformOrigin: `${MARK_R * 50}% 40%` })}
      </MBlur>
      {img(`inset(0 ${(1 - (MARK_R + wipe * (1 - MARK_R))) * 100}% ${(1 - WORD_B) * 100}% ${MARK_R * 100}%)`)}
      {wipe > 0 && wipe < 0.995 && <div style={{ position: 'absolute', left: edgeX - 6, top: h * 0.12, width: 12, height: h * 0.56, background: T.lime, transform: 'skewX(-10deg)' }} />}
      {img(`inset(${WORD_B * 100}% 0 0 0)`, { opacity: by, transform: `translateY(${(1 - by) * 24}px)` })}
    </div>
  );
};

// one headline line: per-letter rise from a mask, letters staggered
export const RiseLine: React.FC<{ text: string; at: number; size: number; color: string; weight?: number; tracking?: string; stagger?: number }> = ({ text, at, size, color, weight = 800, tracking = '0.01em', stagger = 0.7 }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ display: 'flex', justifyContent: 'center', overflow: 'hidden', height: size * 1.24, fontFamily: FONT, fontWeight: weight, fontSize: size, lineHeight: `${size * 1.24}px`, letterSpacing: tracking, color, whiteSpace: 'pre' }}>
      {[...text].map((ch, i) => {
        const t = whip(f, at + i * stagger, 9);
        return <span key={i} style={{ display: 'inline-block', transform: `translateY(${(1 - t) * size * 1.1}px)`, opacity: t > 0 ? 1 : 0 }}>{ch}</span>;
      })}
    </div>
  );
};

export const Rule: React.FC<{ at: number; w?: number }> = ({ at, w = 330 }) => {
  const f = useCurrentFrame();
  const t = ramp(f, at, at + 9, E.out);
  return <div style={{ display: 'flex', justifyContent: 'center' }}><div style={{ width: w * t, height: 7, borderRadius: 4, background: T.lime }} /></div>;
};
