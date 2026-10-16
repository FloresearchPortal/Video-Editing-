// Topic title (changes per episode): stacked Black Italic lines whip in from alternating sides with
// motion blur; `band` lines ride a full-bleed green band. Each line is sized to fit from font metrics.
import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { Backdrop } from '../flostocks/Backdrop';
import { E, FONT, MBlur, T, fitSize, mix, ramp, speedBlur, whip } from './kit';
import { TickerBands } from './TickerBands';
import type { Ink, Seg, TitleLine } from './types';

export const inkColor = (c: Ink = 'ink') => ({ ink: T.ink, green: T.green, white: '#FFFFFF', grey: T.grey }[c]);
export const segText = (segs: Seg[]) => segs.map((s) => s.t).join('');

export const KLine: React.FC<{ segs: Seg[]; size: number; style?: React.CSSProperties }> = ({ segs, size, style }) => (
  <div style={{ fontFamily: FONT, fontWeight: 900, fontStyle: 'italic', fontSize: size, lineHeight: `${size * 1.08}px`, letterSpacing: '-0.02em', whiteSpace: 'pre', textAlign: 'center', ...style }}>
    {segs.map((s, i) => <span key={i} style={{ color: inkColor(s.c) }}>{s.t}</span>)}
  </div>
);

const MAX_W = 940;
const GAP = 18;

export const TopicTitle: React.FC<{ lines: TitleLine[] }> = ({ lines }) => {
  const f = useCurrentFrame();
  const sized = lines.map((l) => ({ ...l, size: fitSize(segText(l.segs), MAX_W, l.max) }));
  const hs = sized.map((l) => (l.band ? l.size * 1.3 : l.size * 1.12));
  const total = hs.reduce((a, b) => a + b, 0) + GAP * (lines.length - 1);
  let y = 1000 - total / 2;
  return (
    <AbsoluteFill>
      <Backdrop />
      <TickerBands id="tt" faint speed={() => 3} rowH={120} seed={5} opacity={0.5} />
      {/* a slow push through the hold so it never sits dead */}
      <AbsoluteFill style={{ transform: `scale(${mix(1, 1.03, ramp(f, 20, 72, E.inOut))})` }}>
      {sized.map((l, i) => {
        const top = y; y += hs[i] + GAP;
        const at = 3 + i * 4, dir = i % 2 ? 1 : -1;
        const xf = (fr: number) => dir * (1 - whip(fr, at, 10)) * 1300;
        const x = xf(f), blur = speedBlur(xf, f, 0.4);
        const band = l.band ? ramp(f, at - 2, at + 7, E.out) : 0;
        return (
          <React.Fragment key={i}>
            {l.band && (
              <div style={{ position: 'absolute', left: -120, width: 1320, top: top - (i > 0 && sized[i - 1].band ? GAP : 0), height: hs[i] + (i > 0 && sized[i - 1].band ? GAP : 0) + 1,
                background: `linear-gradient(90deg, ${T.green}, ${T.lime})`, transform: `skewY(-3deg) scaleX(${band})`, transformOrigin: dir < 0 ? '0% 50%' : '100% 50%' }} />
            )}
            <MBlur id={`tl${i}`} x={blur} style={{ position: 'absolute', left: 0, right: 0, top: top + (l.band ? (hs[i] - l.size * 1.08) / 2 : 0), transform: `translateX(${x}px) skewY(${l.band ? -3 : 0}deg)`, opacity: f >= at ? 1 : 0 }}>
              <KLine segs={l.segs} size={l.size} />
            </MBlur>
          </React.Fragment>
        );
      })}
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
