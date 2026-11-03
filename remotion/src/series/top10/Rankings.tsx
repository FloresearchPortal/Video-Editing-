// The ranked chart (data changes per episode), grey glassmorphism: ten frosted-glass bars step down from
// the left edge, longest = #1. Each bar = a graphite glass tab (rank, ticker, sector) + a light glass bar
// whose length past the tab is proportional to the value, a thin glowing green edge, and a frosted plate at
// the bar end holding the company's official logo (wordmark-shaped; no logo file -> no plate). Name + value sit inside the
// bar when it is long enough, else to the right of the plate. Countdown build #10 -> #1, one row per beat;
// #1 lands with a lime plate glow. Then the total pill + source.
import React from 'react';
import { AbsoluteFill, Img, staticFile, useCurrentFrame } from 'remotion';
import { Backdrop } from '../flostocks/Backdrop';
import { E, FONT, MBlur, T, fitSize, mix, pop, ramp, speedBlur, textW, whip } from './kit';
import { KLine, segText } from './TopicTitle';
import type { RankItem, Rankings as R } from './types';

// geometry (mirrored in videos/top10/make_episode.py validation)
export const RANK = { top: 524, pitch: 104, barH: 80, tab: 300, end: 850, plateW: 190, plateH: 100, gap: 18, labelSize: 31, right: 1040 };
export const rowAt = (rank: number) => 16 + (10 - rank) * 12; // reveal frame (relative), one per beat

const fmt = (v: number, d: number) => v.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });
export const displayName = (c: RankItem) => (c.name || c.ticker).toUpperCase();

// where each row's bar ends and where its label goes
export const rowLayout = (c: RankItem, max: number, r: R) => {
  const end = RANK.tab + (c.value / max) * (RANK.end - RANK.tab);
  const half = c.logo ? RANK.plateW / 2 : 0;
  const lw = Math.max(textW(displayName(c), RANK.labelSize, '800', 0.01), textW(`${r.pre}${fmt(c.value, r.decimals)}${r.post}`, RANK.labelSize, '800', 0));
  const insideX = end - half - RANK.gap - lw;
  const inside = insideX >= RANK.tab + 24;
  return { end, inside, labelX: inside ? insideX : end + half + RANK.gap, labelW: lw };
};

const GLASS_BAR: React.CSSProperties = {
  position: 'absolute', left: 0, height: RANK.barH, boxSizing: 'border-box', borderRadius: '0 26px 26px 0',
  background: 'linear-gradient(180deg, rgba(255,255,255,0.78) 0%, rgba(255,255,255,0.30) 46%, rgba(226,231,236,0.38) 54%, rgba(214,220,227,0.55) 100%)',
  border: '1.5px solid rgba(255,255,255,0.95)', borderLeft: 0,
  backdropFilter: 'blur(22px) saturate(150%)', WebkitBackdropFilter: 'blur(22px) saturate(150%)',
  boxShadow: '0 22px 44px rgba(15,23,42,0.10), 0 3px 8px rgba(15,23,42,0.06), inset 0 1.5px 0 rgba(255,255,255,1), inset 0 -1px 0 rgba(15,23,42,0.08)',
};
const GLASS_TAB: React.CSSProperties = {
  position: 'absolute', left: 0, width: RANK.tab, height: RANK.barH, boxSizing: 'border-box', paddingLeft: 30, display: 'flex', alignItems: 'center', gap: 14,
  background: 'linear-gradient(180deg, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0) 50%), rgba(28,33,40,0.86)',
  backdropFilter: 'blur(22px)', WebkitBackdropFilter: 'blur(22px)', borderRight: '1px solid rgba(255,255,255,0.18)', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.22)',
};
export const GRAPHITE_PILL: React.CSSProperties = {
  background: 'linear-gradient(180deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0) 50%), rgba(28,33,40,0.88)',
  boxShadow: '0 16px 34px rgba(15,23,42,0.18), inset 0 1px 0 rgba(255,255,255,0.22)', backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)',
};

// soft colour behind the glass so it has something to refract (static)
const Orbs: React.FC = () => (
  <AbsoluteFill>
    <div style={{ position: 'absolute', left: 470, top: 470, width: 820, height: 820, borderRadius: 410, background: 'radial-gradient(circle, rgba(58,204,0,0.22) 0%, rgba(58,204,0,0.07) 42%, rgba(58,204,0,0) 68%)' }} />
    <div style={{ position: 'absolute', left: -260, top: 980, width: 760, height: 760, borderRadius: 380, background: 'radial-gradient(circle, rgba(100,116,139,0.20) 0%, rgba(100,116,139,0.06) 45%, rgba(100,116,139,0) 70%)' }} />
    <div style={{ position: 'absolute', left: 640, top: 1240, width: 520, height: 520, borderRadius: 260, background: 'radial-gradient(circle, rgba(100,116,139,0.16) 0%, rgba(100,116,139,0) 68%)' }} />
  </AbsoluteFill>
);

export const Rankings: React.FC<{ r: R }> = ({ r }) => {
  const f = useCurrentFrame();
  const items = [...r.items].sort((a, b) => a.rank - b.rank);
  const max = Math.max(...items.map((c) => c.value)); // longest bar = largest value (also for 'lowest is best' rankings)
  const hs = r.heading.map((q, i) => fitSize(segText(q), 940, i === r.heading.length - 1 ? 104 : 78));
  const totalAt = rowAt(1) + 14;
  const bottom = RANK.top + RANK.pitch * 9 + RANK.barH;
  return (
    <AbsoluteFill>
      <Backdrop />
      <Orbs />
      {r.heading.map((q, i) => {
        const at = i * 4, xf = (fr: number) => (i % 2 ? 1 : -1) * (1 - whip(fr, at, 10)) * 1200;
        return (
          <MBlur key={i} id={`rh${i}`} x={speedBlur(xf, f, 0.4)} style={{ position: 'absolute', left: 0, right: 0, top: 246 + (i ? hs[0] * 1.06 : 0), transform: `translateX(${xf(f)}px)`, opacity: f >= at ? 1 : 0 }}>
            <KLine segs={q} size={hs[i]} />
          </MBlur>
        );
      })}
      <div style={{ position: 'absolute', left: 0, right: 0, top: 246 + hs[0] * 1.06 + hs[1] * 1.08 + 6, textAlign: 'center', fontFamily: FONT, fontWeight: 600, fontSize: 26, letterSpacing: '0.04em', color: T.grey, opacity: ramp(f, 8, 16) }}>{r.subtitle}</div>
      {items.map((c) => {
        const a = rowAt(c.rank), y = RANK.top + (c.rank - 1) * RANK.pitch;
        if (f < a) return null;
        const L = rowLayout(c, max, r);
        const isOne = c.rank === 1;
        const tabX = (fr: number) => (1 - whip(fr, a, 8)) * -RANK.tab;
        const g = ramp(f, a + 2, a + 14, E.out);
        const end = mix(RANK.tab, L.end, g);
        const ring = Math.max(0, pop(f, a + 4, 10, 2.0));
        const value = `${r.pre}${fmt(c.value * g, r.decimals)}${r.post}`;
        const lab = L.inside ? ramp(f, a + 10, a + 16, E.out) : ramp(f, a + 4, a + 10, E.out);
        const labX = L.inside ? L.labelX : end + (c.logo ? RANK.plateW / 2 : 0) + RANK.gap;
        const half = RANK.plateW / 2;
        return (
          <React.Fragment key={c.rank}>
            <div style={{ ...GLASS_BAR, top: y, width: end }} />
            {end > RANK.tab + 30 && <div style={{ position: 'absolute', left: RANK.tab, top: y + RANK.barH - 6, width: end - RANK.tab - 24, height: 3, borderRadius: 2,
              background: 'linear-gradient(90deg, rgba(58,204,0,0), rgba(58,204,0,0.9))', boxShadow: '0 0 12px rgba(58,204,0,0.55)' }} />}
            <MBlur id={`tab${c.rank}`} x={speedBlur(tabX, f, 0.35)} style={{ ...GLASS_TAB, top: y, transform: `translateX(${tabX(f)}px)` }}>
              <span style={{ fontFamily: FONT, fontSize: 28, fontWeight: 900, fontStyle: 'italic', color: T.lime, width: 44 }}>{String(c.rank).padStart(2, '0')}</span>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontFamily: FONT, fontSize: 38, lineHeight: '42px', fontWeight: 900, fontStyle: 'italic', letterSpacing: '-0.02em', color: '#FFFFFF' }}>{c.ticker}</span>
                {c.sector && <span style={{ fontFamily: FONT, fontSize: 18, lineHeight: '23px', fontWeight: 500, color: '#C9CFD6', whiteSpace: 'nowrap' }}>{c.sector}</span>}
              </div>
            </MBlur>
            <div style={{ position: 'absolute', left: labX, top: y + 3, width: L.labelW + 4, display: 'flex', flexDirection: 'column', alignItems: L.inside ? 'flex-end' : 'flex-start',
              fontFamily: FONT, fontSize: RANK.labelSize, lineHeight: '37px', fontWeight: 800, whiteSpace: 'nowrap', opacity: lab, transform: `translateY(${(1 - lab) * 14}px)` }}>
              <span style={{ color: T.ink, letterSpacing: '0.01em' }}>{displayName(c)}</span>
              <span style={{ color: T.green }}>{value}</span>
            </div>
            {c.logo && (
              <div style={{ position: 'absolute', left: end - half, top: y + RANK.barH / 2 - RANK.plateH / 2, width: RANK.plateW, height: RANK.plateH, boxSizing: 'border-box', borderRadius: 30,
                background: 'linear-gradient(145deg, rgba(255,255,255,0.85), rgba(222,228,234,0.45))', border: '1.5px solid #FFFFFF',
                backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)', transform: `scale(${ring}) rotate(${(1 - Math.min(1, ring)) * -8}deg)`,
                boxShadow: isOne ? '0 0 0 3px rgba(58,204,0,0.55), 0 0 28px rgba(58,204,0,0.35), 0 18px 36px rgba(15,23,42,0.16)' : '0 18px 36px rgba(15,23,42,0.16), 0 2px 6px rgba(15,23,42,0.08), inset 0 1.5px 0 #FFFFFF' }}>
                <div style={{ position: 'absolute', inset: 9, borderRadius: 22, background: '#FFFFFF', boxShadow: 'inset 0 0 0 1px rgba(15,23,42,0.06), 0 2px 6px rgba(15,23,42,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Img src={staticFile(c.logo)} style={{ width: '88%', height: '84%', objectFit: 'contain' }} />
                </div>
              </div>
            )}
          </React.Fragment>
        );
      })}
      {r.total && <div style={{ position: 'absolute', left: 0, right: 0, top: bottom + 66, display: 'flex', justifyContent: 'center', transform: `scale(${Math.max(0, pop(f, totalAt, 10, 1.8))})` }}>
        <div style={{ ...GRAPHITE_PILL, display: 'flex', alignItems: 'center', gap: 18, height: 72, padding: '0 34px', borderRadius: 36 }}>
          <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 26, letterSpacing: '0.12em', color: T.fog }}>{r.total.label}</span>
          <span style={{ fontFamily: FONT, fontWeight: 900, fontStyle: 'italic', fontSize: 38, color: T.lime }}>{r.total.value}</span>
        </div>
      </div>}
      <div style={{ position: 'absolute', left: 0, right: 0, top: bottom + (r.total ? 156 : 70), textAlign: 'center', fontFamily: FONT, fontWeight: 500, fontSize: 22, color: T.grey, opacity: ramp(f, totalAt + 4, totalAt + 12) }}>{r.source}</div>
    </AbsoluteFill>
  );
};
