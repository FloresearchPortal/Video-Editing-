// 2. Title (beats 11-17), Gen Z investor style. The intro's green frame has just become the hero card
// (Intro.tsx, CARD); around it stickers pop, then the title builds below it:
//   Companies (letters pop) / by market / [Capitalization] (stamped chip) / in PSX (marker scribble)
// and a FloStocks notification toast slides up. Every element has its own space: nothing overlaps.
import React from 'react';
import { AbsoluteFill, Img, spring, useCurrentFrame } from 'remotion';
import { ACCENT, C, E, FONT, asset, liftOut, mix, ramp } from './theme';
import { bf, FPB, FPS, S } from './timeline';

const T = S.title;
const sp = (f: number, at: number, cfg = { damping: 11, stiffness: 160, mass: 0.6 }) => spring({ frame: f - at, fps: FPS, config: cfg });

// a sticker: pops in with a wobble, white die-cut border, soft shadow
const Sticker: React.FC<{ f: number; at: number; leave: number; x: number; y: number; w: number; h: number; rot: number; r?: number; bg: string; children: React.ReactNode }> = ({ f, at, leave, x, y, w, h, rot, r = 30, bg, children }) => {
  const s = sp(f, at);
  const o = liftOut(f, leave, 70, 8);
  const wob = Math.sin((f - at) / 4) * 4 * Math.exp(-(f - at) / 10) * (f > at ? 1 : 0);
  return (
    <div style={{ position: 'absolute', left: x, top: y, width: w, height: h, boxSizing: 'border-box', borderRadius: r, background: bg, border: '6px solid #fff', boxShadow: '0 14px 30px rgba(17,17,17,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: Math.min(1, s * 2) * o.opacity, transform: `translateY(${o.y}px) rotate(${rot + wob}deg) scale(${s})` }}>
      {children}
    </div>
  );
};

const Sparkle: React.FC<{ f: number; at: number; leave: number; x: number; y: number; size: number; color?: string }> = ({ f, at, leave, x, y, size, color = C.lime }) => {
  const s = sp(f, at, { damping: 9, stiffness: 180, mass: 0.5 });
  const tw = 0.85 + 0.15 * Math.sin(f / 3);
  const o = liftOut(f, leave, 60, 8);
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ position: 'absolute', left: x - size / 2, top: y - size / 2, opacity: o.opacity, transform: `translateY(${o.y}px) scale(${s * tw}) rotate(${(f - at) * 2}deg)` }}>
      <path d="M12 0 C13 8 16 11 24 12 C16 13 13 16 12 24 C11 16 8 13 0 12 C8 11 11 8 12 0 Z" fill={color} />
    </svg>
  );
};

export const Title: React.FC = () => {
  const f = useCurrentFrame();
  if (f < bf(T.start) - 2 || f > bf(T.end) + 2) return null;
  const st = bf(T.stickers);
  const [l1, l2, l3] = T.lines.map(bf);
  const chip = bf(T.chip), toast = bf(T.toast);
  const out = (i: number) => bf(T.exit) + i * 0.8;
  const ph = (f / FPB) % 1;
  const lo = (i: number) => { const o = liftOut(f, out(i), 70, 8); return { opacity: o.opacity, transform: `translateY(${o.y}px)` }; };

  // "Companies": letters pop up one by one
  const word = 'Companies';
  // chip stamp
  const cs = sp(f, chip - 1, { damping: 12, stiffness: 200, mass: 0.6 });
  // marker scribble under PSX
  const scrib = ramp(f, l3 + 4, l3 + 14, E.inOut);
  const ts = sp(f, toast - 1, { damping: 15, stiffness: 140, mass: 0.7 });
  const tOut = liftOut(f, out(5), 70, 8);

  return (
    <AbsoluteFill>
      {/* stickers around the hero card (card spans x 280-800, y 250-630) */}
      <Sticker f={f} at={st} leave={out(0)} x={60} y={300} w={190} h={96} rot={-8} r={48} bg={C.green}>
        <span style={{ width: 20, height: 20, borderRadius: 10, background: C.lime, marginRight: 10, boxShadow: `0 0 0 ${3 + 5 * ph}px rgba(58,204,0,${0.5 * (1 - ph)})` }} />
        <span style={{ fontFamily: FONT.display, fontWeight: 900, fontSize: 46, lineHeight: '60px', color: '#fff' }}>PSX</span>
      </Sticker>
      <Sticker f={f} at={st + 3} leave={out(0)} x={95} y={470} w={130} h={130} rot={10} r={65} bg={C.lime}>
        <span style={{ fontFamily: FONT.display, fontWeight: 900, fontSize: 50, lineHeight: '60px', color: C.ink }}>Rs</span>
      </Sticker>
      <Sticker f={f} at={st + 2} leave={out(0)} x={850} y={300} w={150} h={150} rot={8} r={38} bg={C.ink}>
        <svg width={92} height={92} viewBox="0 0 24 24" fill="none" stroke={C.lime} strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 17l6-6 4 4 8-8" /><path d="M14 7h7v7" />
        </svg>
      </Sticker>
      <Sparkle f={f} at={st + 5} leave={out(0)} x={905} y={545} size={60} />

      {/* Companies: letters pop */}
      <div style={{ position: 'absolute', left: 0, right: 0, top: 680, height: 170, textAlign: 'center', fontFamily: FONT.display, fontWeight: 900, fontSize: 140, lineHeight: '170px', letterSpacing: -3, color: C.ink, ...lo(1) }}>
        {word.split('').map((ch, i) => {
          const s = sp(f, l1 - 2 + i * 1.1, { damping: 10, stiffness: 190, mass: 0.5 });
          return <span key={i} style={{ display: 'inline-block', opacity: Math.min(1, s * 2.5), transform: `translateY(${(1 - s) * 70}px) scale(${mix(0.5, 1, s)})` }}>{ch}</span>;
        })}
      </div>
      {/* by market: slides in from the left */}
      <div style={{ position: 'absolute', left: 0, right: 0, top: 860, height: 120, textAlign: 'center', ...ACCENT, fontSize: 100, lineHeight: '120px', color: C.ink, ...lo(2) }}>
        <span style={{ display: 'inline-block', opacity: ramp(f, l2 - 2, l2 + 4), transform: `translateX(${(1 - ramp(f, l2 - 2, l2 + 10, E.out)) * -160}px)` }}>by market</span>
      </div>
      {/* Capitalization: stamped chip */}
      <div style={{ position: 'absolute', left: 540 - 390, top: 1010, width: 780, height: 140, ...lo(3) }}>
        <div style={{ width: '100%', height: '100%', boxSizing: 'border-box', borderRadius: 70, background: C.ink, border: '6px solid #fff', boxShadow: '0 20px 44px rgba(17,17,17,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: ramp(f, chip - 1, chip + 2), transform: `rotate(-2.5deg) scale(${mix(1.5, 1, cs)})` }}>
          <span style={{ fontFamily: FONT.display, fontWeight: 900, fontSize: 92, lineHeight: '128px', letterSpacing: -2, color: C.lime }}>Capitalization</span>
        </div>
      </div>
      {/* in PSX + marker scribble */}
      <div style={{ position: 'absolute', left: 0, right: 0, top: 1190, height: 130, textAlign: 'center', ...lo(4) }}>
        <span style={{ display: 'inline-block', position: 'relative', opacity: ramp(f, l3 - 2, l3 + 3), transform: `translateY(${(1 - ramp(f, l3 - 2, l3 + 9, E.out)) * 60}px)` }}>
          <span style={{ ...ACCENT, fontSize: 110, lineHeight: '130px', color: C.ink }}>in </span>
          <span style={{ fontFamily: FONT.display, fontWeight: 900, fontSize: 110, lineHeight: '130px', color: C.green }}>PSX</span>
          <svg width={250} height={34} viewBox="0 0 250 34" style={{ position: 'absolute', right: -10, top: 124 }}>
            <path d="M6 22 C 60 6, 120 30, 170 14 S 236 10, 244 18" fill="none" stroke={C.lime} strokeWidth={12} strokeLinecap="round" strokeDasharray={300} strokeDashoffset={300 * (1 - scrib)} />
          </svg>
        </span>
      </div>
      <Sparkle f={f} at={l3 + 6} leave={out(4)} x={185} y={1250} size={48} />
      <Sparkle f={f} at={l3 + 8} leave={out(4)} x={900} y={1236} size={40} color={C.green} />

      {/* notification toast */}
      <div style={{ position: 'absolute', left: 90, top: 1410, width: 900, height: 140, boxSizing: 'border-box', borderRadius: 36, background: '#fff', boxShadow: '0 24px 60px rgba(17,17,17,0.14), 0 0 0 2px #E7EBE6', display: 'flex', alignItems: 'center', gap: 24, padding: '0 30px', opacity: Math.min(1, ts * 2) * tOut.opacity, transform: `translateY(${(1 - ts) * 140 + tOut.y}px)` }}>
        <div style={{ width: 84, height: 84, borderRadius: 22, background: '#F2F6F0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Img src={asset('logos/FLOSTOCKS-icon.png')} style={{ width: 58, height: 58 * 431 / 437 }} />
        </div>
        <div>
          <div style={{ fontFamily: FONT.display, fontWeight: 700, fontSize: 28, lineHeight: '36px', color: C.ink }}>FloStocks <span style={{ fontWeight: 500, color: C.grey }}>· now</span></div>
          <div style={{ fontFamily: FONT.display, fontWeight: 500, fontSize: 28, lineHeight: '38px', color: C.ink }}>The 10 biggest companies on the PSX, ranked.</div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
