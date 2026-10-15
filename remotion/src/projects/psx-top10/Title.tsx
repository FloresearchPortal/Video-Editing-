// 2. Title (beats 11-18), in the flostocks.com hero style. The intro's green frame has just become
// the hero card (Intro.tsx, CARD, y 250-630); below it, website-style:
//   eyebrow pill  ·  ExtraBold headline (one line per beat, masked rise; "capitalization" in the
//   green gradient, which sweeps in)  ·  grey subtitle  ·  source line with a check.
// Layout (no overlaps): pill 690-754 · headline 796-1244 (4 x 112) · subtitle 1272-1372 · meta 1410-1450
import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { C, E, FONT, GRAD_TEXT, H, SHADOW, liftOut, ramp } from './theme';
import { bf, DATA, FPB, S } from './timeline';

const T = S.title;
const EASE = E.out;

// website reveal: fade + 26 px rise
const reveal = (f: number, at: number, leave: number, dist = 26, dur = 14) => {
  const t = ramp(f, at, at + dur, EASE);
  const o = liftOut(f, leave, 40, 9);
  return { opacity: Math.min(1, t * 1.4) * o.opacity, transform: `translateY(${(1 - t) * dist + o.y}px)` };
};

const Line: React.FC<{ f: number; at: number; leave: number; top: number; children: React.ReactNode }> = ({ f, at, leave, top, children }) => {
  const t = ramp(f, at - 1, at + 11, EASE);
  const o = liftOut(f, leave, 40, 9);
  return (
    // the mask is taller than the 112 px line pitch so descenders (p, y) are never clipped
    <div style={{ position: 'absolute', left: 0, right: 0, top, height: 136, overflow: 'hidden', textAlign: 'center', opacity: o.opacity, transform: `translateY(${o.y}px)` }}>
      <div style={{ ...H, fontSize: 100, lineHeight: '112px', color: C.ink, transform: `translateY(${(1 - t) * 136}px)` }}>{children}</div>
    </div>
  );
};

export const Title: React.FC = () => {
  const f = useCurrentFrame();
  if (f < bf(T.start) - 2 || f > bf(T.end) + 2) return null;
  const [l1, l2, l3, l4] = T.lines.map(bf);
  const out = (i: number) => bf(T.exit) + i * 1.0;
  const ph = (f / FPB) % 1;
  const sweep = ramp(f, l3 + 2, l3 + 20, E.inOut);
  const check = ramp(f, bf(T.meta) + 4, bf(T.meta) + 12, E.inOut);
  return (
    <AbsoluteFill>
      {/* eyebrow pill */}
      <div style={{ position: 'absolute', left: 0, right: 0, top: 690, display: 'flex', justifyContent: 'center', ...reveal(f, bf(T.eyebrow), out(0)) }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 14, height: 64, boxSizing: 'border-box', padding: '0 28px', borderRadius: 32, background: '#fff', border: `2px solid ${C.line}`, boxShadow: SHADOW.sm, fontFamily: FONT.display, fontWeight: 600, fontSize: 27, color: C.grey70 }}>
          <span style={{ width: 16, height: 16, borderRadius: 8, background: C.green, boxShadow: `0 0 ${10 + 8 * (1 - ph)}px rgba(44,156,0,0.55)` }} />
          Pakistan Stock Exchange
          <b style={{ fontWeight: 700, color: C.deep, letterSpacing: 1 }}>RANKED</b>
        </span>
      </div>
      {/* headline */}
      <Line f={f} at={l1} leave={out(1)} top={796}>Top 10 companies</Line>
      <Line f={f} at={l2} leave={out(2)} top={908}>by market</Line>
      <Line f={f} at={l3} leave={out(3)} top={1020}><span style={GRAD_TEXT(sweep)}>capitalization</span></Line>
      <Line f={f} at={l4} leave={out(4)} top={1132}>in PSX.</Line>
      {/* subtitle */}
      <div style={{ position: 'absolute', left: 60, right: 60, top: 1272, textAlign: 'center', fontFamily: FONT.display, fontWeight: 400, fontSize: 36, lineHeight: '50px', color: C.grey, ...reveal(f, bf(T.sub), out(5)) }}>
        The ten largest listed companies,<br />ranked by what they are worth.
      </div>
      {/* meta line */}
      <div style={{ position: 'absolute', left: 0, right: 0, top: 1410, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12, fontFamily: FONT.display, fontWeight: 600, fontSize: 26, lineHeight: '40px', color: C.grey70, ...reveal(f, bf(T.meta), out(6)) }}>
        <svg width={32} height={32} viewBox="0 0 24 24">
          <circle cx={12} cy={12} r={11} fill="rgba(44,156,0,0.12)" />
          <path d="M7 12.5l3.2 3.2L17 9" fill="none" stroke={C.green} strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={16} strokeDashoffset={16 * (1 - check)} />
        </svg>
        Source: PSX Data Portal · close {DATA.close_date}
      </div>
    </AbsoluteFill>
  );
};
