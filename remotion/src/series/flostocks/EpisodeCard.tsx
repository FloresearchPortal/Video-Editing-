// Series episode card on brand green: "FLOSTOCKS EXPLAINS · EP 01" pill, giant italic title (with an
// optional slot-rolling number), subtitle, and a small market label. Layout: pill 590-650 ·
// title 680-980 · subtitle 1030-1090 · label 1140-1176.
import React from 'react';
import { AbsoluteFill, spring, useCurrentFrame } from 'remotion';
import { C, E, FONT, GRAD, KIN, mix, ramp, seriesAsset } from './theme';

const Slot: React.FC<{ f: number; at: number; to: number; size: number; spins: number }> = ({ f, at, to, size, spins }) => {
  const t = ramp(f, at, at + 16, E.out);
  const pos = t * (spins * 10 + to), k = Math.floor(pos), fr = pos - k;
  return (
    <span style={{ position: 'relative', display: 'inline-block', width: size * 0.66, height: size * 1.04, overflow: 'hidden', verticalAlign: 'top' }}>
      {[0, 1].map((j) => <span key={j} style={{ position: 'absolute', left: 0, right: 0, textAlign: 'center', top: (j - fr) * size * 1.04, filter: t < 1 ? `blur(${(1 - t) * 10}px)` : 'none' }}>{(k + j) % 10}</span>)}
    </span>
  );
};

export const EpisodeCard: React.FC<{ from: number; to: number; ep: string; word: string; number?: number; subtitle: string; label: string; fps?: number }> = ({ from, to, ep, word, number, subtitle, label, fps = 30 }) => {
  const f = useCurrentFrame();
  if (f < from - 1 || f > to) return null;
  const pill = spring({ frame: f - from - 2, fps, config: { damping: 14, stiffness: 170, mass: 0.6 } });
  const w = spring({ frame: f - from - 4, fps, config: { damping: 13, stiffness: 180, mass: 0.6 } });
  const sub = ramp(f, from + 12, from + 22, E.site);
  const lab = ramp(f, from + 16, from + 26, E.site);
  return (
    <AbsoluteFill style={{ background: GRAD }}>
      <AbsoluteFill style={{ background: 'radial-gradient(900px 700px at 80% 10%, rgba(255,255,255,0.18), transparent 60%)' }} />
      {/* faint slanted logo bars in the background */}
      {[0, 1, 2].map((i) => <div key={i} style={{ position: 'absolute', left: 640 + i * 150, top: -200, width: 110, height: 2400, background: i === 2 ? 'rgba(11,15,20,0.10)' : 'rgba(255,255,255,0.07)', transform: 'skewX(-10deg)' }} />)}
      <div style={{ position: 'absolute', left: 80, top: 590, display: 'inline-flex', alignItems: 'center', gap: 14, height: 60, padding: '0 26px 0 14px', borderRadius: 30, background: '#fff', opacity: Math.min(1, pill * 2), transform: `translateX(${(1 - Math.min(1, pill)) * -200}px)` }}>
        <img src={seriesAsset('logos/FLOSTOCKS-icon.png')} style={{ width: 36, height: 36 }} />
        <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 24, letterSpacing: '0.1em', color: C.ink }}>FLOSTOCKS EXPLAINS <span style={{ color: C.green }}>· {ep}</span></span>
      </div>
      <div style={{ position: 'absolute', left: 70, top: 680, whiteSpace: 'nowrap', ...KIN, fontSize: 280, lineHeight: '300px', color: '#fff', transformOrigin: 'left center', transform: `translateX(${(1 - Math.min(1, w)) * -500}px) skewX(${(1 - Math.min(1, w)) * -16}deg) scale(${mix(1.2, 1, Math.min(1, w))})`, filter: `blur(${Math.max(0, 1 - w) * 12}px)` }}>
        {word}{number !== undefined && <> <Slot f={f} at={from + 4} to={Math.floor(number / 10)} size={280} spins={1} /><Slot f={f} at={from + 6} to={number % 10} size={280} spins={2} /></>}
      </div>
      <div style={{ position: 'absolute', left: 84, top: 1030, fontFamily: FONT, fontWeight: 600, fontSize: 46, lineHeight: '60px', color: '#fff', opacity: sub, transform: `translateY(${(1 - sub) * 26}px)` }}>{subtitle}</div>
      <div style={{ position: 'absolute', left: 84, top: 1140, display: 'flex', alignItems: 'center', gap: 14, fontFamily: FONT, fontWeight: 600, fontSize: 24, lineHeight: '36px', letterSpacing: '0.16em', color: 'rgba(255,255,255,0.85)', opacity: lab }}>
        <span style={{ width: 34, height: 3, borderRadius: 2, background: C.lime }} />{label}
      </div>
    </AbsoluteFill>
  );
};
