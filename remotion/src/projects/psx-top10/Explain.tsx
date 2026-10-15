// 3. What is market cap? (beats 14-22): headline, then the formula as SaaS UI cards popping on the
// beat (share price x total shares = market cap), then the one-line definition.
import React from 'react';
import { AbsoluteFill, spring, useCurrentFrame } from 'remotion';
import { C, FONT, life, mix, ramp } from './theme';
import { bf, FPS, S } from './timeline';

const X = S.explain;

const Icon: React.FC<{ kind: 'price' | 'shares' | 'cap'; light?: boolean }> = ({ kind, light }) => {
  const s = light ? '#fff' : C.green;
  return (
    <svg width={64} height={64} viewBox="0 0 24 24" fill="none" stroke={s} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
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
      position: 'absolute', left: 80, top, width: 920, height: h, borderRadius: 34, boxSizing: 'border-box', padding: '0 40px',
      display: 'flex', alignItems: 'center', gap: 34, background: green ? C.green : '#fff', border: green ? 'none' : '2px solid #E3E8E2',
      boxShadow: green ? '0 30px 70px rgba(44,156,0,0.32)' : '0 20px 50px rgba(17,17,17,0.08)',
      opacity: v.opacity, transform: `${v.transform} translateY(${(1 - s) * 90}px) scale(${mix(0.86, 1, s)})`,
    }}>
      <div style={{ width: 112, height: 112, borderRadius: 28, background: green ? 'rgba(255,255,255,0.16)' : '#EFF6EB', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon kind={kind} light={green} />
      </div>
      <div>
        <div style={{ fontFamily: FONT.display, fontWeight: 900, fontSize: green ? 80 : 62, lineHeight: 1, letterSpacing: -1.5, color: green ? '#fff' : C.ink }}>{title}</div>
        <div style={{ fontFamily: FONT.serif, fontStyle: 'italic', fontSize: green ? 48 : 44, lineHeight: 1.1, marginTop: 6, color: green ? 'rgba(255,255,255,0.9)' : C.grey }}>{sub}</div>
      </div>
    </div>
  );
};

const Op: React.FC<{ f: number; at: number; leave: number; ch: string; y: number }> = ({ f, at, leave, ch, y }) => {
  const s = spring({ frame: f - at, fps: FPS, config: { damping: 10, stiffness: 200, mass: 0.5 } });
  const v = life(f, at - 1, leave, 0);
  return <div style={{ position: 'absolute', left: 490, top: y - 50, width: 100, height: 100, borderRadius: 50, background: C.ink, color: C.lime, textAlign: 'center', fontFamily: FONT.display, fontWeight: 900, fontSize: 64, lineHeight: '96px', opacity: v.opacity, transform: `${v.transform} scale(${s})` }}>{ch}</div>;
};

export const Explain: React.FC = () => {
  const f = useCurrentFrame();
  if (f < bf(X.start) - 4 || f >= bf(S.meet.start)) return null; // swapped out under the green wipe
  const [c1, c2, c3] = X.cards.map((b) => bf(b) - 1);
  const out = (i: number) => bf(X.exit) + i * 0.9;
  return (
    <AbsoluteFill>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 290, textAlign: 'center', ...life(f, bf(X.head) - 3, out(0), 70) }}>
        <div style={{ fontFamily: FONT.display, fontWeight: 900, fontSize: 120, lineHeight: '128px', letterSpacing: -4, color: C.ink }}>What is</div>
        <div style={{ fontFamily: FONT.display, fontWeight: 900, fontSize: 140, lineHeight: '150px', letterSpacing: -5, color: C.green }}>market cap?</div>
      </div>
      <Card f={f} at={c1} leave={out(1)} top={640} h={170} kind="price" title="Share price" sub="what one share costs" />
      <Op f={f} at={c2 - 2} leave={out(2)} ch="×" y={845} />
      <Card f={f} at={c2} leave={out(2)} top={880} h={170} kind="shares" title="Total shares" sub="every share issued" />
      <Op f={f} at={c3 - 2} leave={out(3)} ch="=" y={1085} />
      <Card f={f} at={c3} leave={out(3)} top={1120} h={200} kind="cap" title="Market cap" sub="what the company is worth" green />
      <div style={{ position: 'absolute', left: 90, right: 90, top: 1372, textAlign: 'center', fontFamily: FONT.serif, fontStyle: 'italic', fontSize: 70, lineHeight: '78px', color: C.ink, ...life(f, bf(X.line) - 2, out(4), 50) }}>
        the total value of a company on the stock market.
      </div>
      {/* lime sweep under the definition */}
      <div style={{ position: 'absolute', left: 540 - 90, top: 1548, width: 180, height: 10, borderRadius: 5, background: C.lime, transformOrigin: 'center', transform: `scaleX(${ramp(f, bf(X.line) + 4, bf(X.line) + 14)})`, opacity: 1 - ramp(f, out(4), out(4) + 6) }} />
    </AbsoluteFill>
  );
};
