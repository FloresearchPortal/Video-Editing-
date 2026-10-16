// Split-flap board (departure-board tiles). Each tile flips through a few random glyphs and lands on
// its target: the old top half folds down over the new one (3 frames per flip), then settles with a bump.
import React from 'react';
import { useCurrentFrame } from 'remotion';
import { FONT, T, rnd } from './kit';

const POOL = 'ABCDEFGHKLMNPRSTUVXYZ0123456789';
const STEP = 3;

export type Tile = { ch: string; bg?: string; fg?: string; gap?: number };

const Half: React.FC<{ ch: string; w: number; h: number; top: boolean; bg: string; fg: string; style?: React.CSSProperties }> = ({ ch, w, h, top, bg, fg, style }) => (
  <div style={{ position: 'absolute', left: 0, top: top ? 0 : h / 2, width: w, height: h / 2, overflow: 'hidden', background: bg, borderRadius: top ? `${w * 0.09}px ${w * 0.09}px 0 0` : `0 0 ${w * 0.09}px ${w * 0.09}px`, ...style }}>
    <div style={{ position: 'absolute', left: 0, top: top ? 0 : -h / 2, width: w, height: h, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: FONT, fontWeight: 800, fontSize: h * 0.74, lineHeight: 1, color: fg, paddingTop: h * 0.04 }}>{ch}</div>
  </div>
);

export const FlapTile: React.FC<{ tile: Tile; start: number; flips?: number; seed: number; w: number; h: number }> = ({ tile, start, flips = 4, seed, w, h }) => {
  const f = useCurrentFrame();
  const bg = tile.bg ?? T.ink, fg = tile.fg ?? '#FFFFFF';
  const seq = [' ', ...Array.from({ length: flips }, (_, i) => POOL[Math.floor(rnd(seed * 17 + i * 5) * POOL.length)]), tile.ch];
  const local = f - start;
  const i = Math.floor(local / STEP), ph = local - i * STEP;
  const done = i >= seq.length - 1;
  const cur = local < 0 ? ' ' : done ? tile.ch : seq[i + 1];
  const prev = local < 0 ? ' ' : done ? tile.ch : seq[i];
  const landed = local - (seq.length - 1) * STEP;
  const bump = landed >= 0 && landed < 6 ? Math.sin((landed / 6) * Math.PI) * 0.06 : 0;
  const flipping = !done && local >= 0;
  return (
    <div style={{ position: 'relative', width: w, height: h, perspective: h * 4, transform: `scale(${1 + bump})`, marginLeft: tile.gap ?? 0 }}>
      <Half ch={cur} w={w} h={h} top bg={bg} fg={fg} />
      <Half ch={flipping && ph < 2 ? prev : cur} w={w} h={h} top={false} bg={bg} fg={fg} />
      {flipping && ph === 0 && <Half ch={prev} w={w} h={h} top bg={bg} fg={fg} style={{ transformOrigin: '50% 100%', transform: 'rotateX(-58deg)', filter: 'brightness(0.82)' }} />}
      {flipping && ph === 1 && <Half ch={cur} w={w} h={h} top={false} bg={bg} fg={fg} style={{ transformOrigin: '50% 0%', transform: 'rotateX(62deg)', filter: 'brightness(1.15)' }} />}
      {/* hinge line */}
      <div style={{ position: 'absolute', left: 0, top: h / 2 - 1.5, width: w, height: 3, background: 'rgba(0,0,0,0.38)' }} />
    </div>
  );
};

export const SplitFlap: React.FC<{ tiles: Tile[]; start: number; stagger?: number; w?: number; h?: number; gap?: number; seed?: number }> = ({ tiles, start, stagger = 2, w = 116, h = 160, gap = 10, seed = 3 }) => (
  <div style={{ display: 'flex', gap }}>
    {tiles.map((t, i) => <FlapTile key={i} tile={t} start={start + i * stagger} seed={seed * 10 + i} w={w} h={h} />)}
  </div>
);
