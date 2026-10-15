// Kinetic slanted type: a line punches in on its beat (slides + un-skews + sharpens + settles).
import React from 'react';
import { spring, useCurrentFrame } from 'remotion';
import { KIN, mix, ramp } from './theme';

export const Punch: React.FC<{
  at: number; top: number; size: number; color: string; from?: 'left' | 'right' | 'below';
  align?: 'left' | 'center'; leave?: number; children: React.ReactNode; fps?: number;
}> = ({ at, top, size, color, from = 'left', align = 'left', leave = Infinity, children, fps = 30 }) => {
  const f = useCurrentFrame();
  const s = spring({ frame: f - at + 2, fps, config: { damping: 14, stiffness: 190, mass: 0.6 } });
  const sc = Math.min(1, s);
  const o = leave === Infinity ? 0 : ramp(f, leave, leave + 7);
  const dx = from === 'left' ? -700 : from === 'right' ? 700 : 0, dy = from === 'below' ? 220 : 0;
  return (
    <div style={{
      position: 'absolute', left: align === 'left' ? 80 : 0, right: align === 'left' ? undefined : 0, top, textAlign: align,
      whiteSpace: 'nowrap', ...KIN, fontSize: size, lineHeight: `${Math.round(size * 1.08)}px`, color,
      opacity: ramp(f, at - 2, at + 2) * (1 - o),
      transform: `translate(${(1 - s) * dx - o * 120}px, ${(1 - s) * dy}px) skewX(${(1 - sc) * -16}deg) scale(${mix(1.25, 1, sc)})`,
      transformOrigin: align === 'left' ? 'left center' : 'center',
      filter: `blur(${Math.max(0, 1 - s) * 14 + o * 10}px)`,
    }}>{children}</div>
  );
};
