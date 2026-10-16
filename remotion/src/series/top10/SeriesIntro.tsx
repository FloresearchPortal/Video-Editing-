// PSX TOP 10 series intro: identical in every episode (4 s, 120 frames @ 30 fps).
//   0-38   ticker-band wall slams in, split-flap board flips to TOP 10, "PSX RANKINGS" tag
//   32-40  zoom-through blur into white
//   36-66  ranking bars rise #10 -> #1, the line draws, No.1 dot pulses
//   58-74  slant band wipe
//   swap+  logo lockup: mark, wordmark, byline, rule, PSX TOP 10 / RANKINGS, data bar loads, flostocks.com
import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { Backdrop } from '../flostocks/Backdrop';
import { E, FONT, SHADOW, T, mix, pop, ramp } from './kit';
import { LogoBuild, RiseLine, Rule } from './Lockup';
import { SplitFlap } from './SplitFlap';
import { TickerBands } from './TickerBands';
import { SlantWipe, slantSwap } from './Wipes';

export const INTRO_FRAMES = 120;
const WIPE_AT = 58;
export const INTRO_SWAP = slantSwap(WIPE_AT);

const bandSpeed = (f: number) => (f < 14 ? mix(52, 16, ramp(f, 0, 14, E.out)) : f < 32 ? 16 : mix(16, 70, ramp(f, 32, 40, E.in)));

const Wall: React.FC = () => {
  const f = useCurrentFrame();
  if (f > 41) return null;
  const s = mix(1.32, 1.04, ramp(f, 0, 12, E.out)) * mix(1, 1.6, ramp(f, 32, 41, E.in));
  const out = ramp(f, 33, 41, E.in);
  const card = pop(f, 4, 11, 2.0);
  const cardBlur = f < 9 ? (9 - f) * 3 : out * 22;
  const pill = ramp(f, 26, 33, E.out);
  const ph = ((f - 26) / 14) % 1;
  return (
    <AbsoluteFill>
      <TickerBands id="iw" speed={bandSpeed} scale={s} rowH={150} seed={2} opacity={1 - out} />
      <AbsoluteFill style={{ background: '#FFFFFF', opacity: out }} />
      <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', transform: `scale(${Math.max(0, card) * mix(1, 2.3, out)})`, opacity: 1 - out, filter: cardBlur > 0.3 ? `blur(${cardBlur}px)` : undefined }}>
        <div style={{ background: '#FFFFFF', borderRadius: 30, padding: 26, boxShadow: SHADOW.lg }}>
          <SplitFlap start={6} stagger={2} w={124} h={172} gap={12} tiles={[{ ch: 'T' }, { ch: 'O' }, { ch: 'P' }, { ch: '1', bg: T.lime, gap: 26 }, { ch: '0', bg: T.lime }]} />
        </div>
        <div style={{ marginTop: 26, height: 64, display: 'flex', alignItems: 'center', gap: 16, padding: '0 34px', borderRadius: 32, background: T.ink, clipPath: `inset(0 ${(1 - pill) * 50}% 0 ${(1 - pill) * 50}% round 32px)` }}>
          <span style={{ width: 16, height: 16, borderRadius: 8, background: T.lime, boxShadow: `0 0 0 ${4 + 7 * Math.max(0, ph)}px rgba(58,204,0,${0.45 * (1 - Math.max(0, ph))})` }} />
          <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 30, letterSpacing: '0.16em', color: '#FFFFFF' }}>PSX RANKINGS</span>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// generic ranking staircase (the same in every episode; not the episode's data)
const H = [210, 250, 290, 330, 380, 430, 500, 580, 680, 820];
const BW = 70, GAP = 18, X0 = (1080 - (10 * BW + 9 * GAP)) / 2, BASE = 1430;

const Chart: React.FC = () => {
  const f = useCurrentFrame();
  if (f < 34 || f > INTRO_SWAP) return null;
  const enter = ramp(f, 34, 46, E.out);
  const cam = mix(1.28, 1, enter) * mix(1, 1.06, ramp(f, 46, 66, E.inOut));
  const blur = (1 - enter) * 16;
  const pts = H.map((h, i) => [X0 + i * (BW + GAP) + BW / 2, BASE - h * Math.min(1, Math.max(0, pop(f, 38 + i * 1.8, 9, 1.4)))]);
  const p = ramp(f, 40, 62, E.inOut);
  const n = p * (pts.length - 1), k = Math.floor(n), fr = n - k;
  const line = pts.slice(0, k + 1).concat(k < pts.length - 1 ? [[mix(pts[k][0], pts[k + 1][0], fr), mix(pts[k][1], pts[k + 1][1], fr)]] : []);
  const d = line.map((q, i) => `${i ? 'L' : 'M'}${q[0].toFixed(1)} ${q[1].toFixed(1)}`).join(' ');
  const end = line[line.length - 1];
  const area = `${d} L${end[0].toFixed(1)} ${BASE} L${line[0][0].toFixed(1)} ${BASE} Z`;
  const dot = pop(f, 61, 8, 2.4), ring = ((f - 61) / 12) % 1;
  const tag = pop(f, 60, 9, 2);
  return (
    <AbsoluteFill style={{ transform: `scale(${cam})`, transformOrigin: '60% 55%', filter: blur > 0.3 ? `blur(${blur}px)` : undefined }}>
      {/* level lines */}
      {[BASE - 820, BASE - 500].map((y, i) => <div key={i} style={{ position: 'absolute', left: 80, width: 920, top: y, borderTop: `3px dashed ${T.line}`, opacity: ramp(f, 38, 46) }} />)}
      {H.map((h, i) => {
        const t = Math.max(0, pop(f, 38 + i * 1.8, 9, 1.4));
        const top = i === 9;
        return (
          <React.Fragment key={i}>
            <div style={{ position: 'absolute', left: X0 + i * (BW + GAP), top: BASE - h * t, width: BW, height: h * t, borderRadius: '10px 10px 0 0',
              background: top ? `linear-gradient(180deg, ${T.lime}, ${T.green})` : i % 2 ? '#DCE1E6' : T.mint2, boxShadow: top ? '0 0 40px rgba(58,204,0,0.45)' : undefined }} />
            <div style={{ position: 'absolute', left: X0 + i * (BW + GAP), width: BW, top: BASE + 18, textAlign: 'center', fontFamily: FONT, fontWeight: top ? 900 : 700, fontStyle: top ? 'italic' : 'normal', fontSize: top ? 34 : 28, color: top ? T.green : T.silver, opacity: ramp(f, 38 + i * 1.8, 44 + i * 1.8) }}>{10 - i}</div>
          </React.Fragment>
        );
      })}
      <svg width={1080} height={1920} style={{ position: 'absolute', left: 0, top: 0 }}>
        <path d={area} fill="rgba(58,204,0,0.12)" />
        <path d={d} fill="none" stroke={T.green} strokeWidth={9} strokeLinejoin="round" strokeLinecap="round" />
        {dot > 0 && <circle cx={end[0]} cy={end[1]} r={34 * ring + 14} fill="none" stroke={T.lime} strokeWidth={5} opacity={1 - ring} />}
        {dot > 0 && <circle cx={end[0]} cy={end[1]} r={15 * dot} fill="#FFFFFF" stroke={T.green} strokeWidth={8} />}
      </svg>
      <div style={{ position: 'absolute', left: pts[9][0] - 110, top: BASE - 820 - 120, width: 160, height: 64, borderRadius: 14, background: T.ink, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${Math.max(0, tag)})`, transformOrigin: '70% 100%', fontFamily: FONT, fontWeight: 900, fontStyle: 'italic', fontSize: 34, color: '#FFFFFF' }}>
        No.<span style={{ color: T.lime }}>1</span>
      </div>
    </AbsoluteFill>
  );
};

const LockupScene: React.FC = () => {
  const f = useCurrentFrame();
  if (f < INTRO_SWAP) return null;
  const s = INTRO_SWAP;
  const load = ramp(f, s + 22, s + 34, E.inOut);
  return (
    <AbsoluteFill>
      <div style={{ position: 'absolute', left: 160, top: 560 }}><LogoBuild at={s + 1} width={760} /></div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 812 }}><Rule at={s + 14} /></div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 846 }}><RiseLine text="PSX TOP 10" at={s + 16} size={98} color={T.ink} /></div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 960 }}><RiseLine text="RANKINGS" at={s + 20} size={98} color={T.green} /></div>
      <div style={{ position: 'absolute', left: 370, top: 1118, width: 340, height: 52, borderRadius: 26, background: T.mint, overflow: 'hidden', transform: `scaleX(${ramp(f, s + 20, s + 26, E.out)})` }}>
        <div style={{ width: `${load * 100}%`, height: '100%', borderRadius: 26, background: T.lime }} />
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 1196, textAlign: 'center', fontFamily: FONT, fontWeight: 600, fontSize: 26, letterSpacing: '0.32em', color: T.grey, opacity: ramp(f, s + 28, s + 36) }}>FLOSTOCKS.COM</div>
    </AbsoluteFill>
  );
};

// faint staircase at the foot of the lockup (continuity with the chart)
const Foot: React.FC = () => {
  const f = useCurrentFrame();
  if (f < INTRO_SWAP) return null;
  return (
    <AbsoluteFill style={{ opacity: 0.5 }}>
      {H.map((h, i) => <div key={i} style={{ position: 'absolute', left: X0 + i * (BW + GAP), top: 1920 - h * 0.34 * ramp(f, INTRO_SWAP + i, INTRO_SWAP + 10 + i), width: BW, height: h * 0.34, borderRadius: '10px 10px 0 0', background: i === 9 ? T.mint2 : T.mint }} />)}
    </AbsoluteFill>
  );
};

export const SeriesIntro: React.FC = () => (
  <AbsoluteFill>
    <Backdrop />
    <Foot />
    <Chart />
    <LockupScene />
    <Wall />
    <SlantWipe at={WIPE_AT} />
  </AbsoluteFill>
);

