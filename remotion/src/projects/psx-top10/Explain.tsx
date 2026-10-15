// 3. What is market cap? (beats 14-22): headline, then the formula as SaaS UI cards popping on the
// beat (share price x total shares = market cap), then the one-line definition.
import React from 'react';
import { AbsoluteFill, spring, useCurrentFrame } from 'remotion';
import { ACCENT, C, FONT, life, mix, ramp } from './theme';
import { bf, FPS, S } from './timeline';

const X = S.explain;

const Icon: React.FC<{ kind: 'price' | 'shares' | 'cap'; light?: boolean }> = ({ kind, light }) => {
  const s = light ? '#fff' : C.green;
  return (
    <svg width={56} height={56} viewBox="0 0 24 24" fill="none" stroke={s} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
      {kind === 'price' && <><path d="M3 12V4h8l10 10-8 8L3 12z" /><circle cx={7.5} cy={8} r={1.6} /></>}
      {kind === 'shares' && <><path d="M12 3l9 5-9 5-9-5 9-5z" /><path d="M3 13l9 5 9-5" /><path d="M3 17.5l9 5 9-5" /></>}
      {kind === 'cap' && <><path d="M3 21h18" /><path d="M5 21V11M10 21V7M15 21V13M20 21V4" /></>}
    </svg>
  );
};

const Card: React.FC<{ f: number; at: number; leave: number; top: number; h: number; kind: 'price' | 'shares' | 'cap'; title: string; sub: string; green?: boolean }> = ({ f, at, leave, top, h, kind, title, sub, green }) => {
  const s = spring({ frame: f - at, fps: FPS, config: { damping: 13, stiffness: 170, mass: 0.6 } });
  const v = life(f, at - 1, leave, 0);
  return (
    <div style={{
      position: 'absolute', left: 80, top, width: 920, height: h, borderRadius: 32, boxSizing: 'border-box', padding: '0 40px',
      display: 'flex', alignItems: 'center', gap: 34, background: green ? C.green : '#fff', border: green ? 'none' : '2px solid #E3E8E2',
      boxShadow: green ? '0 30px 70px rgba(44,156,0,0.32)' : '0 20px 50px rgba(17,17,17,0.08)',
      opacity: v.opacity, transform: `${v.transform} translateY(${(1 - s) * 60}px) scale(${mix(0.88, 1, Math.min(1, s))})`,
    }}>
      <div style={{ width: 96, height: 96, borderRadius: 26, background: green ? 'rgba(255,255,255,0.16)' : '#EFF6EB', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon kind={kind} light={green} />
      </div>
      <div>
        <div style={{ fontFamily: FONT.display, fontWeight: 900, fontSize: green ? 68 : 54, lineHeight: green ? '78px' : '64px', letterSpacing: -1, color: green ? '#fff' : C.ink }}>{title}</div>
        <div style={{ ...ACCENT, fontSize: green ? 38 : 34, lineHeight: green ? '48px' : '44px', color: green ? 'rgba(255,255,255,0.9)' : C.grey }}>{sub}</div>
      </div>
    </div>
  );
};

const Op: React.FC<{ f: number; at: number; leave: number; ch: string; y: number }> = ({ f, at, leave, ch, y }) => {
  const s = Math.min(1, spring({ frame: f - at, fps: FPS, config: { damping: 12, stiffness: 200, mass: 0.5 } }));
  const v = life(f, at - 1, leave, 0);
  // 80 px disc that sits inside the 100 px gap between two cards
  return <div style={{ position: 'absolute', left: 500, top: y - 40, width: 80, height: 80, borderRadius: 40, background: C.ink, color: C.lime, textAlign: 'center', fontFamily: FONT.display, fontWeight: 900, fontSize: 52, lineHeight: '84px', opacity: v.opacity, transform: `${v.transform} scale(${s})` }}>{ch}</div>;
};

export const Explain: React.FC = () => {
  const f = useCurrentFrame();
  if (f < bf(X.start) - 4 || f >= bf(S.meet.start)) return null; // swapped out under the green wipe
  const [c1, c2, c3] = X.cards.map((b) => bf(b) - 1);
  const out = (_i: number) => Infinity; // held until the green wipe covers the frame
  return (
    <AbsoluteFill>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 300, textAlign: 'center', ...life(f, bf(X.head) - 3, out(0), 70) }}>
        <div style={{ fontFamily: FONT.display, fontWeight: 900, fontSize: 110, lineHeight: '120px', letterSpacing: -3, color: C.ink }}>What is</div>
        <div style={{ fontFamily: FONT.display, fontWeight: 900, fontSize: 120, lineHeight: '132px', letterSpacing: -3, color: C.green }}>market cap?</div>
      </div>
      {/* stack: card 600-740 · op 750-830 · card 840-980 · op 990-1070 · card 1080-1260 · line 1300-1444 */}
      <Card f={f} at={c1} leave={out(1)} top={600} h={140} kind="price" title="Share price" sub="what one share costs" />
      <Op f={f} at={c2 - 2} leave={out(2)} ch="×" y={790} />
      <Card f={f} at={c2} leave={out(2)} top={840} h={140} kind="shares" title="Total shares" sub="every share issued" />
      <Op f={f} at={c3 - 2} leave={out(3)} ch="=" y={1030} />
      <Card f={f} at={c3} leave={out(3)} top={1080} h={180} kind="cap" title="Market cap" sub="what the company is worth" green />
      <div style={{ position: 'absolute', left: 90, right: 90, top: 1300, textAlign: 'center', ...ACCENT, fontSize: 58, lineHeight: '72px', color: C.ink, ...life(f, bf(X.line) - 2, out(4), 50) }}>
        the total value of a company on the stock market.
      </div>
      <div style={{ position: 'absolute', left: 540 - 90, top: 1466, width: 180, height: 10, borderRadius: 5, background: C.lime, transformOrigin: 'center', transform: `scaleX(${ramp(f, bf(X.line) + 4, bf(X.line) + 14)})` }} />
    </AbsoluteFill>
  );
};
