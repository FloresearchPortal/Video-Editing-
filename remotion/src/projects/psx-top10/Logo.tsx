// Official company logos only (media/projects/psx-top10/logos/<TICKER>.png|svg), scaled
// proportionally to fit a box. logos.json lists the files present and their pixel size.
// A missing logo renders nothing (never a redrawn / text stand-in); the chart only reserves logo
// space once every top-10 logo is present (HAS_LOGOS).
import React from 'react';
import { Img } from 'remotion';
import { asset } from './theme';
import logos from './logos.json';

const L = logos as Record<string, { file: string; w: number; h: number }>;

export const Logo: React.FC<{ ticker: string; maxW: number; maxH: number; align?: 'left' | 'center' }> = ({ ticker, maxW, maxH, align = 'left' }) => {
  const m = L[ticker];
  if (!m) return null; // never a stand-in
  const s = Math.min(maxW / m.w, maxH / m.h);
  return (
    <div style={{ width: maxW, height: maxH, display: 'flex', alignItems: 'center', justifyContent: align === 'left' ? 'flex-start' : 'center' }}>
      <Img src={asset(`logos/${m.file}`)} style={{ width: m.w * s, height: m.h * s }} />
    </div>
  );
};
