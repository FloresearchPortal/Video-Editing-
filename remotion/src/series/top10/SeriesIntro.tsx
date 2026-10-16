// PSX TOP 10 series intro: identical in every episode (2.4 s, 72 frames @ 30 fps = 6 beats).
//   0-12   ticker-band wall slams in (scale + motion blur)
//   4-33   split-flap board flips to TOP 10, "PSX RANKINGS" tag opens
//   33-60  hold: bands keep running, slow push on the board, live dot pulses
//   60-70  zoom-through blur into the white grid (the topic lockup builds on it)
import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { Backdrop } from '../flostocks/Backdrop';
import { E, FONT, SHADOW, T, mix, pop, ramp } from './kit';
import { SplitFlap } from './SplitFlap';
import { TickerBands } from './TickerBands';

export const INTRO_FRAMES = 72;
const OUT = 60, GONE = 70;

const bandSpeed = (f: number) => (f < 14 ? mix(52, 16, ramp(f, 0, 14, E.out)) : f < OUT ? 16 : mix(16, 70, ramp(f, OUT, GONE, E.in)));

export const SeriesIntro: React.FC = () => {
  const f = useCurrentFrame();
  const s = mix(1.32, 1.04, ramp(f, 0, 12, E.out)) * mix(1, 1.012, ramp(f, 12, OUT, E.inOut)) * mix(1, 1.6, ramp(f, OUT, GONE, E.in));
  const out = ramp(f, OUT + 1, GONE, E.in);
  const card = pop(f, 4, 11, 2.0) * mix(1, 1.06, ramp(f, 33, OUT, E.inOut));
  const cardBlur = f < 9 ? (9 - f) * 3 : out * 22;
  const pill = ramp(f, 26, 33, E.out);
  const ph = ((f - 26) / 14) % 1;
  return (
    <AbsoluteFill>
      <Backdrop />
      {f <= GONE && (
        <>
          <TickerBands id="iw" speed={bandSpeed} scale={s} rowH={150} seed={2} opacity={1 - out} />
          <AbsoluteFill style={{ alignItems: 'center', justifyContent: 'center', transform: `scale(${Math.max(0, card) * mix(1, 2.3, out)})`, opacity: 1 - out, filter: cardBlur > 0.3 ? `blur(${cardBlur}px)` : undefined }}>
            <div style={{ background: '#FFFFFF', borderRadius: 30, padding: 26, boxShadow: SHADOW.lg }}>
              <SplitFlap start={6} stagger={2} w={124} h={172} gap={12} tiles={[{ ch: 'T' }, { ch: 'O' }, { ch: 'P' }, { ch: '1', bg: T.lime, gap: 26 }, { ch: '0', bg: T.lime }]} />
            </div>
            <div style={{ marginTop: 26, height: 64, display: 'flex', alignItems: 'center', gap: 16, padding: '0 34px', borderRadius: 32, background: T.ink, clipPath: `inset(0 ${(1 - pill) * 50}% 0 ${(1 - pill) * 50}% round 32px)` }}>
              <span style={{ width: 16, height: 16, borderRadius: 8, background: T.lime, boxShadow: `0 0 0 ${4 + 7 * Math.max(0, ph)}px rgba(58,204,0,${0.45 * (1 - Math.max(0, ph))})` }} />
              <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 30, letterSpacing: '0.16em', color: '#FFFFFF' }}>PSX RANKINGS</span>
            </div>
          </AbsoluteFill>
        </>
      )}
    </AbsoluteFill>
  );
};
