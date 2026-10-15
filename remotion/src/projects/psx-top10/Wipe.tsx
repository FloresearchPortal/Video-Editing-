// Green panel that sweeps up through the frame (bottom -> top); the scenes swap while it covers the
// screen, so the cut lands on the beat with no empty frame.
import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { C, E, ramp } from './theme';
import { bf } from './timeline';

export const Wipe: React.FC<{ span: number[] }> = ({ span }) => {
  const f = useCurrentFrame();
  const [a, b] = span.map(bf);
  if (f < a || f > b) return null;
  const t = ramp(f, a, b, E.inOut);
  const y = (1 - 2 * t) * 1920; // +H -> -H
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <div style={{ position: 'absolute', left: 0, top: y - 160, width: 1080, height: 160, background: C.lime }} />
      <div style={{ position: 'absolute', left: 0, top: y, width: 1080, height: 1920, background: C.green }} />
    </AbsoluteFill>
  );
};
