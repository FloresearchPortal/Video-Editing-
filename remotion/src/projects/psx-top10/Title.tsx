// 2. Title (beats 8-14): "Top 10 / Companies / by Market / [Capitalization] / in [PSX]", revealed as
// the intro's green panel slides up; each line rises out of a mask on its beat.
import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { C, E, FONT, asset, liftOut, ramp } from './theme';
import { bf, FPB, S } from './timeline';

const T = S.title;

// masked rise: the line slides up out of its own baseline
const Mask: React.FC<{ f: number; at: number; h: number; children: React.ReactNode; style?: React.CSSProperties; leave: number }> = ({ f, at, h, children, style, leave }) => {
  const t = ramp(f, at - 2, at + 9, E.out);
  const o = liftOut(f, leave, 70, 8);
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, height: h, overflow: 'hidden', textAlign: 'center', opacity: o.opacity, transform: `translateY(${o.y}px)`, ...style }}>
      <div style={{ transform: `translateY(${(1 - t) * h * 1.05}px)` }}>{children}</div>
    </div>
  );
};

export const Title: React.FC = () => {
  const f = useCurrentFrame();
  if (f < bf(S.intro.exit) - 1 || f > bf(T.end) + 2) return null;
  const [l1, l2, l3, l4] = T.lines.map(bf);
  const out = (i: number) => bf(T.exit) + i * 1.2;
  const pill = ramp(f, l3 - 1, l3 + 8, E.inOut);
  const ph = (f / FPB) % 1;
  return (
    <AbsoluteFill>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 300, display: 'flex', justifyContent: 'center', ...(() => { const o = liftOut(f, out(0), 60, 8); return { opacity: o.opacity, transform: `translateY(${o.y}px)` }; })() }}>
        <img src={asset('logos/FLOSTOCKS.png')} style={{ width: 300, height: (300 * 306) / 1164 }} />
      </div>
      {/* already in place when the green panel uncovers it */}
      <Mask f={f} at={bf(S.intro.exit) - 6} h={260} leave={out(0)} style={{ top: 410 }}>
        <span style={{ fontFamily: FONT.display, fontWeight: 900, fontSize: 250, lineHeight: '260px', letterSpacing: -9, color: C.ink }}>Top <span style={{ color: C.green }}>10</span></span>
      </Mask>
      <Mask f={f} at={l1} h={180} leave={out(1)} style={{ top: 670 }}>
        <span style={{ fontFamily: FONT.display, fontWeight: 900, fontSize: 160, lineHeight: '180px', letterSpacing: -5, color: C.ink }}>Companies</span>
      </Mask>
      <Mask f={f} at={l2} h={180} leave={out(2)} style={{ top: 850 }}>
        <span style={{ fontFamily: FONT.serif, fontStyle: 'italic', fontSize: 150, lineHeight: '180px', color: C.ink }}>by </span>
        <span style={{ fontFamily: FONT.display, fontWeight: 900, fontSize: 150, lineHeight: '180px', letterSpacing: -5, color: C.ink }}>Market</span>
      </Mask>
      {/* green pill wipes in left -> right, then the word rises inside it */}
      <div style={{ position: 'absolute', left: 540 - 450, top: 1046, width: 900, height: 168, ...(() => { const o = liftOut(f, out(3), 70, 8); return { opacity: o.opacity, transform: `translateY(${o.y}px)` }; })() }}>
        <div style={{ position: 'absolute', inset: 0, borderRadius: 84, background: C.green, transformOrigin: 'left center', transform: `scaleX(${pill})`, boxShadow: '0 22px 50px rgba(44,156,0,0.3)' }} />
        <Mask f={f} at={l3 + 3} h={168} leave={1e9} style={{ top: 0 }}>
          <span style={{ fontFamily: FONT.display, fontWeight: 900, fontSize: 112, lineHeight: '168px', letterSpacing: -3, color: '#fff' }}>Capitalization</span>
        </Mask>
      </div>
      <Mask f={f} at={l4} h={170} leave={out(4)} style={{ top: 1250 }}>
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: 28 }}>
          <span style={{ fontFamily: FONT.serif, fontStyle: 'italic', fontSize: 140, lineHeight: '170px', color: C.ink }}>in</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 22, height: 128, padding: '0 46px 0 40px', borderRadius: 64, border: `6px solid ${C.green}` }}>
            <span style={{ position: 'relative', width: 28, height: 28 }}>
              <span style={{ position: 'absolute', inset: 0, borderRadius: 14, background: C.lime }} />
              <span style={{ position: 'absolute', inset: -4 - 18 * E.out(ph), borderRadius: 40, border: `3px solid ${C.lime}`, opacity: 0.9 * (1 - ph) }} />
            </span>
            <span style={{ fontFamily: FONT.display, fontWeight: 900, fontSize: 92, color: C.green, letterSpacing: 2, lineHeight: '116px' }}>PSX</span>
          </span>
        </span>
      </Mask>
    </AbsoluteFill>
  );
};
