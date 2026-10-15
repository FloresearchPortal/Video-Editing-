// EP 01 concept (beats 8-17), the one idea behind the ranking, in two kinetic beats:
//   MARKET CAP = SHARE PRICE × TOTAL SHARES  ("the value of the whole company")
//   BIGGER VALUE = HIGHER RANK
// Layout: eyebrow 590 · lines at 650 / 820 / 960 · sub 1130; part two at 840 / 980.
import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { C, E, FONT, KIN, ramp } from '../../series/flostocks/theme';
import { Punch } from '../../series/flostocks/Kinetic';
import { SWAP } from '../../series/flostocks/BrandWipe';
import { bf, S, WIPES } from './timeline';

const X = S.concept;

export const Concept: React.FC = () => {
  const f = useCurrentFrame();
  if (f < bf(WIPES[1]) + SWAP || f >= bf(WIPES[2]) + SWAP) return null;
  const [t1, t2, t3] = X.terms.map(bf);
  const sw = bf(X.swap);
  const [p1, p2] = X.lines2.map(bf);
  const sub = ramp(f, bf(X.sub), bf(X.sub) + 10, E.site) * (1 - ramp(f, sw, sw + 7));
  const op = (at: number) => ({ opacity: ramp(f, at - 2, at + 4) * (1 - ramp(f, sw, sw + 7)) });
  return (
    <AbsoluteFill>
      <div style={{ position: 'absolute', left: 84, top: 590, display: 'flex', alignItems: 'center', gap: 14, fontFamily: FONT, fontWeight: 600, fontSize: 24, letterSpacing: '0.16em', color: C.grey, opacity: ramp(f, t1, t1 + 8) * (1 - ramp(f, sw, sw + 7)) }}>
        <span style={{ width: 34, height: 3, borderRadius: 2, background: C.green }} />THE BASICS
      </div>
      <Punch at={t1} top={650} size={130} color={C.green} from="left" leave={sw}>MARKET CAP</Punch>
      <div style={{ position: 'absolute', left: 84, top: 810, ...KIN, fontSize: 90, lineHeight: '96px', color: C.grey, ...op(t2 - 3) }}>=</div>
      <Punch at={t2} top={820} size={104} color={C.ink} from="right" leave={sw + 1}><span style={{ marginLeft: 110 }}>SHARE PRICE</span></Punch>
      <div style={{ position: 'absolute', left: 84, top: 950, ...KIN, fontSize: 90, lineHeight: '96px', color: C.green, ...op(t3 - 3) }}>×</div>
      <Punch at={t3} top={960} size={104} color={C.ink} from="left" leave={sw + 2}><span style={{ marginLeft: 110 }}>TOTAL SHARES</span></Punch>
      <div style={{ position: 'absolute', left: 84, top: 1130, fontFamily: FONT, fontWeight: 500, fontSize: 44, lineHeight: '58px', color: C.grey70, opacity: sub, transform: `translateY(${(1 - sub) * 24}px)` }}>= the value of the whole company</div>
      <Punch at={p1} top={840} size={116} color={C.ink} from="right">BIGGER VALUE</Punch>
      <Punch at={p2} top={980} size={116} color={C.green} from="left">= HIGHER RANK</Punch>
    </AbsoluteFill>
  );
};
