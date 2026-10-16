// PSX ticker bands: full-bleed rows of tickers (Black Italic caps + up/down arrows) on alternating
// ink / white / lime / mint / grey bands, rows scrolling in opposite directions with motion blur.
// `bold` = the intro wall; `faint` = a quiet texture behind content scenes.
import React from 'react';
import { useCurrentFrame } from 'remotion';
import { FONT, MBlur, PSX_TICKERS, T, rnd } from './kit';

export const Arrow: React.FC<{ up: boolean; color: string; size: number }> = ({ up, color, size }) => (
  <svg width={size} height={size} viewBox="0 0 10 10" style={{ display: 'inline-block', margin: `0 ${size * 0.9}px 0 ${size * 0.35}px` }}>
    <path d={up ? 'M5 1 L9.5 9 L0.5 9 Z' : 'M5 9 L9.5 1 L0.5 1 Z'} fill={color} />
  </svg>
);

const BANDS = [
  { bg: T.ink, fg: '#FFFFFF', up: T.lime, down: T.fog },
  { bg: '#FFFFFF', fg: T.silver, up: T.lime, down: T.fog },
  { bg: T.lime, fg: '#FFFFFF', up: '#FFFFFF', down: T.deep },
  { bg: '#FFFFFF', fg: T.silver, up: T.lime, down: T.fog },
  { bg: T.mint2, fg: '#FFFFFF', up: '#FFFFFF', down: T.deep },
  { bg: '#FFFFFF', fg: T.silver, up: T.lime, down: T.fog },
  { bg: T.smoke, fg: '#FFFFFF', up: T.lime, down: T.fog },
  { bg: '#FFFFFF', fg: T.silver, up: T.lime, down: T.fog },
];

export const TickerBands: React.FC<{
  rowH?: number; rotate?: number; speed?: (f: number) => number; offset?: number; seed?: number;
  faint?: boolean; opacity?: number; scale?: number; blurK?: number; id: string;
}> = ({ rowH = 150, rotate = -8, speed = () => 22, offset = 0, seed = 1, faint = false, opacity = 1, scale = 1, blurK = 0.35, id }) => {
  const f = useCurrentFrame();
  // distance travelled = integral of speed (summed per frame, deterministic)
  let dist = 0;
  for (let i = 0; i < f; i++) dist += speed(i);
  const v = speed(f);
  const rows = Math.ceil(2600 / rowH) + 1;
  const fs = rowH * 0.5;
  return (
    <div style={{ position: 'absolute', left: -760, top: -340, width: 2600, height: 2600, transform: `rotate(${rotate}deg) scale(${scale})`, opacity, overflow: 'hidden' }}>
      {Array.from({ length: rows }, (_, r) => {
        const b = faint ? (r % 2 ? { bg: 'transparent', fg: T.line, up: T.mint, down: T.line } : { bg: T.mist, fg: '#E2E7EC', up: T.mint, down: '#E2E7EC' }) : BANDS[(r + seed) % BANDS.length];
        const dir = r % 2 ? 1 : -1;
        // no wrap-around (a wrap would jump): rows start far enough out to cover ~3500 px of travel
        const d = dist + offset + rnd(r + seed) * 400;
        const x = dir > 0 ? -4400 + d : -300 - d;
        const items = Array.from({ length: 30 }, (_, k) => PSX_TICKERS[Math.floor(rnd(r * 31 + k * 7 + seed) * PSX_TICKERS.length)]);
        return (
          <div key={r} style={{ position: 'absolute', left: 0, top: r * rowH, width: 2600, height: rowH, background: b.bg, overflow: 'hidden' }}>
            <MBlur id={`${id}-${r}`} x={faint ? 0 : v * blurK} style={{ position: 'absolute', left: x, top: 0, whiteSpace: 'nowrap', height: rowH, display: 'flex', alignItems: 'center' }}>
              {items.map((t, k) => {
                const up = rnd(r * 13 + k * 3 + seed) > 0.28;
                return (
                  <span key={k} style={{ display: 'inline-flex', alignItems: 'center', fontFamily: FONT, fontWeight: 900, fontStyle: 'italic', fontSize: fs, letterSpacing: '-0.01em', color: b.fg }}>
                    {t}<Arrow up={up} color={up ? b.up : b.down} size={fs * 0.42} />
                  </span>
                );
              })}
            </MBlur>
          </div>
        );
      })}
    </div>
  );
};
