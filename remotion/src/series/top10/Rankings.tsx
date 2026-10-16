// The ranked chart (data changes per episode): a countdown build #10 -> #1, one row per beat.
// Each row: rank tile, (official logo if supplied), ticker, a slanted bar that shoots out to its value
// while the value label counts up beside it. #1 lands in lime with a flash. Then the total + source.
import React from 'react';
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from 'remotion';
import { Backdrop } from '../flostocks/Backdrop';
import { E, FONT, MBlur, T, fitSize, pop, ramp, speedBlur, textW, whip } from './kit';
import { KLine, segText } from './TopicTitle';
import type { Rankings as R } from './types';

const TOP = 556, PITCH = 96, BAR_H = 58, RIGHT = 1016;
export const rowAt = (rank: number) => 16 + (10 - rank) * 12; // reveal frame (relative), one per beat

const fmt = (v: number, d: number) => v.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });

export const Rankings: React.FC<{ r: R }> = ({ r }) => {
  const f = useCurrentFrame();
  const items = [...r.items].sort((a, b) => a.rank - b.rank);
  const max = items[0].value;
  const hasLogo = items.some((c) => c.logo);
  const tickX = 170 + (hasLogo ? 68 : 0);
  const tickW = Math.max(...items.map((c) => textW(c.ticker, 44, '900i')));
  const barX = tickX + tickW + 26;
  const labelW = Math.max(...items.map((c) => textW(`${r.pre}${fmt(c.value, r.decimals)}${r.post}`, 32, '800', 0)));
  const barMax = RIGHT - barX - 18 - labelW;
  const hs = r.heading.map((q, i) => fitSize(segText(q), 940, i === r.heading.length - 1 ? 104 : 78));
  const one = rowAt(1);
  const flash = f >= one ? Math.max(0, 1 - (f - one) / 14) : 0;
  const totalAt = one + 14;
  // vertical value grid
  const step = Math.pow(10, Math.floor(Math.log10(max))) / (max / Math.pow(10, Math.floor(Math.log10(max))) > 5 ? 0.5 : 2);
  const grid = Array.from({ length: Math.floor(max / step) + 1 }, (_, i) => i * step);
  return (
    <AbsoluteFill>
      <Backdrop />
      {r.heading.map((q, i) => {
        const at = i * 4, xf = (fr: number) => (i % 2 ? 1 : -1) * (1 - whip(fr, at, 10)) * 1200;
        return (
          <MBlur key={i} id={`rh${i}`} x={speedBlur(xf, f, 0.4)} style={{ position: 'absolute', left: 0, right: 0, top: 250 + (i ? hs[0] * 1.06 : 0), transform: `translateX(${xf(f)}px)`, opacity: f >= at ? 1 : 0 }}>
            <KLine segs={q} size={hs[i]} />
          </MBlur>
        );
      })}
      <div style={{ position: 'absolute', left: 0, right: 0, top: 250 + hs[0] * 1.06 + hs[1] * 1.08 + 8, textAlign: 'center', fontFamily: FONT, fontWeight: 600, fontSize: 26, letterSpacing: '0.04em', color: T.grey, opacity: ramp(f, 8, 16) }}>{r.subtitle}</div>
      {grid.map((v, i) => (
        <div key={i} style={{ position: 'absolute', left: barX + (v / max) * barMax, top: TOP - 20, width: 2, height: PITCH * 10 + 10, background: i ? '#EBEFEC' : T.fog, opacity: ramp(f, 6 + i, 14 + i) }} />
      ))}
      {items.map((c) => {
        const a = rowAt(c.rank), y = TOP + (c.rank - 1) * PITCH;
        if (f < a) return null;
        const isOne = c.rank === 1;
        const tile = Math.max(0, pop(f, a, 8, 2.2));
        const xf = (fr: number) => (1 - whip(fr, a, 8)) * -500;
        const g = ramp(f, a + 2, a + 13, E.out);
        const w = Math.max(6, (c.value / max) * barMax * g);
        const label = `${r.pre}${fmt(c.value * g, r.decimals)}${r.post}`;
        return (
          <React.Fragment key={c.rank}>
            {isOne && flash > 0 && <div style={{ position: 'absolute', left: 0, top: y - 14, width: 1080, height: BAR_H + 28, background: T.mint, opacity: flash }} />}
            <div style={{ position: 'absolute', left: 64, top: y, width: 84, height: BAR_H, borderRadius: 12, background: isOne ? T.lime : T.ink, color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: FONT, fontWeight: 900, fontStyle: 'italic', fontSize: 32, transform: `scale(${tile})` }}>{String(c.rank).padStart(2, '0')}</div>
            {c.logo && <Img src={staticFile(c.logo)} style={{ position: 'absolute', left: 170, top: y + 1, width: 56, height: 56, objectFit: 'contain', borderRadius: 12, background: '#FFFFFF', transform: `scale(${tile})` }} />}
            <MBlur id={`rt${c.rank}`} x={speedBlur(xf, f, 0.35)} style={{ position: 'absolute', left: tickX, top: y, height: BAR_H, display: 'flex', alignItems: 'center', transform: `translateX(${xf(f)}px)`,
              fontFamily: FONT, fontWeight: 900, fontStyle: 'italic', fontSize: 44, letterSpacing: '-0.02em', color: T.ink }}>{c.ticker}</MBlur>
            <div style={{ position: 'absolute', left: barX, top: y + 2, width: w, height: BAR_H - 4, borderRadius: 8, transform: 'skewX(-10deg)', transformOrigin: '0 50%',
              background: isOne ? `linear-gradient(90deg, ${T.green}, ${T.lime})` : `linear-gradient(90deg, ${T.mint2}, ${T.green})`, boxShadow: isOne ? '0 10px 30px rgba(58,204,0,0.35)' : undefined }} />
            <div style={{ position: 'absolute', left: barX + w + 18, top: y, height: BAR_H, display: 'flex', alignItems: 'center', whiteSpace: 'nowrap',
              fontFamily: FONT, fontWeight: 800, fontSize: 32, color: isOne ? T.green : T.ink, opacity: ramp(f, a + 2, a + 6) }}>{label}</div>
          </React.Fragment>
        );
      })}
      <div style={{ position: 'absolute', left: 0, right: 0, top: TOP + PITCH * 10 + 12, display: 'flex', justifyContent: 'center', transform: `scale(${Math.max(0, pop(f, totalAt, 10, 1.8))})` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, height: 72, padding: '0 34px', borderRadius: 36, background: T.ink }}>
          <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 26, letterSpacing: '0.12em', color: T.fog }}>{r.total.label}</span>
          <span style={{ fontFamily: FONT, fontWeight: 900, fontStyle: 'italic', fontSize: 38, color: T.lime }}>{r.total.value}</span>
        </div>
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: TOP + PITCH * 10 + 98, textAlign: 'center', fontFamily: FONT, fontWeight: 500, fontSize: 22, color: T.grey, opacity: ramp(f, totalAt + 4, totalAt + 12) }}>{r.source}</div>
    </AbsoluteFill>
  );
};
