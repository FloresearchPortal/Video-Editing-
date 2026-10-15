// Official company logos only (media/projects/psx-top10/logos/<file>), scaled proportionally into a
// box. logos.json lists the files present and their pixel size. Missing -> nothing (never a stand-in).
import React from 'react';
import { Img, staticFile } from 'remotion';
import logos from './logos.json';

const L = logos as Record<string, { file: string; w: number; h: number }>;

export const Logo: React.FC<{ ticker: string; maxW: number; maxH: number }> = ({ ticker, maxW, maxH }) => {
  const m = L[ticker];
  if (!m) return null;
  const s = Math.min(maxW / m.w, maxH / m.h);
  return <div style={{ width: maxW, height: maxH, display: 'flex', alignItems: 'center' }}><Img src={staticFile(`projects/psx-top10/logos/${m.file}`)} style={{ width: m.w * s, height: m.h * s }} /></div>;
};
