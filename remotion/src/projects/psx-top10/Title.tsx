// 2. Title (beats 8-13): one clean statement, kinetic. Each line whips in from alternating sides
// with motion blur and locks on its beat; "capitalization" gets a lime marker sweep. The screen
// then pushes up and out. Layout: lines at y 640 / 760 / 880 / 1000 (120 px pitch), centred.
import React from 'react';
import { AbsoluteFill, spring, useCurrentFrame } from 'remotion';
import { C, E, GRAD_TEXT, H, pushStyle, ramp } from './theme';
import { bf, FPB, FPS, S } from './timeline';

const T = S.title;

const Whip: React.FC<{ f: number; at: number; from: 1 | -1; top: number; children: React.ReactNode }> = ({ f, at, from, top, children }) => {
  const s = spring({ frame: f - at + 2, fps: FPS, config: { damping: 15, stiffness: 170, mass: 0.6 } });
  const blur = Math.max(0, 1 - s) * 16;
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, top, height: 120, textAlign: 'center', opacity: ramp(f, at - 2, at + 2), transform: `translateX(${from * (1 - s) * 760}px) skewX(${from * (1 - Math.min(1, s)) * -12}deg)`, filter: `blur(${blur}px)` }}>
      <span style={{ ...H, fontSize: 100, lineHeight: '120px', color: C.ink, whiteSpace: 'nowrap' }}>{children}</span>
    </div>
  );
};

export const Title: React.FC = () => {
  const f = useCurrentFrame();
  if (f < bf(T.start) - 2 || f > bf(T.exit) + 9) return null;
  const [l1, l2, l3, l4] = T.lines.map(bf);
  const marker = ramp(f, l3 + 6, l3 + 16, E.inOut);
  const ph = (f / FPB) % 1;
  return (
    <AbsoluteFill style={pushStyle(f, bf(T.start) - 30, bf(T.exit))}>
      <Whip f={f} at={l1} from={-1} top={640}>Top 10 companies</Whip>
      <Whip f={f} at={l2} from={1} top={760}>by market</Whip>
      <Whip f={f} at={l3} from={-1} top={880}>
        <span style={{ position: 'relative', display: 'inline-block' }}>
          <span style={{ position: 'absolute', left: -14, right: -14, bottom: 14, height: 34, borderRadius: 10, background: 'rgba(58,204,0,0.22)', transformOrigin: 'left center', transform: `scaleX(${marker})` }} />
          <span style={{ position: 'relative', ...GRAD_TEXT(1) }}>capitalization</span>
        </span>
      </Whip>
      <Whip f={f} at={l4} from={1} top={1000}>
        in <span style={{ color: C.green }}>PSX</span>
        <span style={{ display: 'inline-block', width: 26, height: 26, borderRadius: 13, marginLeft: 18, verticalAlign: 'middle', background: C.lime, boxShadow: `0 0 0 ${4 + 8 * ph}px rgba(58,204,0,${0.4 * (1 - ph)})` }} />
      </Whip>
    </AbsoluteFill>
  );
};
