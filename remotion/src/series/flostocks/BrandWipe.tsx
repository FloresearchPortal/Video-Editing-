// The series transition: the FloStocks logo mark (two green slanted bars + one ink bar) sweeps across
// the frame right -> left. The bars fully cover the frame at `at + SWAP`, which is where the scenes swap.
import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { C, E, SLANT, ramp, mix } from './theme';

export const SWAP = 8; // frames after `at` when the frame is fully covered
const DUR = 16;
// green + lime are wide enough to cover the frame together; the ink bar is a slim trailing stripe,
// so the frame is never all ink (no black flash)
const BARS = [{ c: C.green, w: 1400 }, { c: C.lime, w: 1400 }, { c: C.ink, w: 420 }];

export const BrandWipe: React.FC<{ at: number }> = ({ at }) => {
  const f = useCurrentFrame();
  if (f < at - 1 || f > at + DUR + 6) return null;
  return (
    <AbsoluteFill style={{ pointerEvents: 'none', overflow: 'hidden' }}>
      {BARS.map(({ c, w }, i) => {
        const t = ramp(f, at + i * 2.5, at + i * 2.5 + DUR, E.inOut);
        const x = mix(1080 + 500, -w - 900, t);
        return <div key={i} style={{ position: 'absolute', left: x + i * 140, top: -300, width: w, height: 2520, background: c, transform: `skewX(${SLANT}deg)` }} />;
      })}
    </AbsoluteFill>
  );
};
