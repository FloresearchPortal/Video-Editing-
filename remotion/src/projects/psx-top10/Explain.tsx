// 3. What is market cap? (beats 13-18), as simple as it gets, one term per beat:
//   Market cap  =  Share price  ×  Number of shares   ->   "= what the whole company is worth."
// Layout: "Market cap" 520-690 · "=" 720-800 · Share price 830-950 · "×" 965-1045 · Number of shares
// 1060-1180 · sub 1250-1300. Rises in on a push and pushes out.
import React from 'react';
import { AbsoluteFill, spring, useCurrentFrame } from 'remotion';
import { C, E, FONT, GRAD_TEXT, H, mix, pushStyle, ramp } from './theme';
import { bf, FPS, S } from './timeline';
import { Eyebrow } from './Eyebrow';

const X = S.explain;

const Pop: React.FC<{ f: number; at: number; top: number; h: number; from?: number; children: React.ReactNode }> = ({ f, at, top, h, from = 0, children }) => {
  const s = spring({ frame: f - at + 2, fps: FPS, config: { damping: 13, stiffness: 180, mass: 0.6 } });
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, top, height: h, textAlign: 'center', opacity: ramp(f, at - 2, at + 3), transform: `translateX(${from * (1 - s) * 500}px) scale(${mix(0.7, 1, Math.min(1, s))})`, filter: `blur(${Math.max(0, 1 - s) * 12}px)` }}>
      {children}
    </div>
  );
};

export const Explain: React.FC = () => {
  const f = useCurrentFrame();
  if (f < bf(X.start) - 2 || f > bf(X.exit) + 9) return null;
  const [t1, t2, t3] = X.terms.map(bf);
  const head = bf(X.head);
  const spin = ramp(f, t2 - 4, t2 + 8, E.out);
  return (
    <AbsoluteFill style={pushStyle(f, bf(X.start), bf(X.exit))}>
      <Eyebrow text="THE BASICS" style={{ top: 440, opacity: ramp(f, head, head + 8) }} />
      <Pop f={f} at={head} top={520} h={170}><span style={{ ...H, fontSize: 150, lineHeight: '170px', ...GRAD_TEXT(1) }}>Market cap</span></Pop>
      <Pop f={f} at={t1 - 3} top={720} h={80}><span style={{ ...H, fontSize: 80, lineHeight: '80px', color: C.grey }}>=</span></Pop>
      <Pop f={f} at={t1} top={830} h={120} from={-1}><span style={{ ...H, fontSize: 96, lineHeight: '120px', color: C.ink }}>Share price</span></Pop>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 965, height: 80, textAlign: 'center', opacity: ramp(f, t2 - 4, t2), transform: `rotate(${(1 - spin) * 180}deg) scale(${mix(0.3, 1, spin)})` }}>
        <span style={{ ...H, fontSize: 80, lineHeight: '80px', color: C.green }}>×</span>
      </div>
      <Pop f={f} at={t3} top={1060} h={120} from={1}><span style={{ ...H, fontSize: 88, lineHeight: '120px', color: C.ink }}>Number of shares</span></Pop>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 1250, textAlign: 'center', fontFamily: FONT.display, fontWeight: 500, fontSize: 38, lineHeight: '50px', color: C.grey70, opacity: ramp(f, bf(X.sub), bf(X.sub) + 8), transform: `translateY(${(1 - ramp(f, bf(X.sub), bf(X.sub) + 12, E.out)) * 24}px)` }}>
        = what the whole company is worth.
      </div>
    </AbsoluteFill>
  );
};
