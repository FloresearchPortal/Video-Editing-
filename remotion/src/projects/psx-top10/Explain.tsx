// 3. What is market cap? (beats 18-27), flostocks.com style: eyebrow, ExtraBold headline with the
// gradient phrase, then the formula as site cards popping on the beat, then the definition.
// Stack (no overlaps): eyebrow 300-336 · headline 360-592 · card 640-780 · op 790-870 · card 880-1020 ·
// op 1030-1110 · card 1120-1300 · definition 1340-1452 · rule 1482
import React from 'react';
import { AbsoluteFill, spring, useCurrentFrame } from 'remotion';
import { C, E, FONT, GRAD_TEXT, H, SHADOW, life, mix, ramp } from './theme';
import { bf, FPS, S } from './timeline';
import { Eyebrow } from './Eyebrow';

const X = S.explain;

const Icon: React.FC<{ kind: 'price' | 'shares' | 'cap'; light?: boolean }> = ({ kind, light }) => (
  <svg width={52} height={52} viewBox="0 0 24 24" fill="none" stroke={light ? '#fff' : C.green} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    {kind === 'price' && <><path d="M3 12V4h8l10 10-8 8L3 12z" /><circle cx={7.5} cy={8} r={1.6} /></>}
    {kind === 'shares' && <><path d="M12 3l9 5-9 5-9-5 9-5z" /><path d="M3 13l9 5 9-5" /><path d="M3 17.5l9 5 9-5" /></>}
    {kind === 'cap' && <><path d="M3 21h18" /><path d="M5 21V11M10 21V7M15 21V13M20 21V4" /></>}
  </svg>
);

const Card: React.FC<{ f: number; at: number; top: number; h: number; kind: 'price' | 'shares' | 'cap'; title: string; sub: string; green?: boolean }> = ({ f, at, top, h, kind, title, sub, green }) => {
  const s = Math.min(1, spring({ frame: f - at, fps: FPS, config: { damping: 16, stiffness: 150, mass: 0.7 } }));
  return (
    <div style={{
      position: 'absolute', left: 80, top, width: 920, height: h, borderRadius: 22, boxSizing: 'border-box', padding: '0 40px',
      display: 'flex', alignItems: 'center', gap: 32,
      background: green ? `linear-gradient(135deg, ${C.deep}, ${C.green} 60%, #3ACC00)` : '#fff',
      border: green ? 'none' : `2px solid ${C.line}`, boxShadow: green ? '0 8px 24px rgba(11,15,20,0.08), 0 30px 70px rgba(44,156,0,0.28)' : SHADOW.md,
      opacity: ramp(f, at - 1, at + 5), transform: `translateY(${(1 - s) * 40}px) scale(${mix(0.94, 1, s)})`,
    }}>
      <div style={{ width: 92, height: 92, borderRadius: 18, background: green ? 'rgba(255,255,255,0.16)' : 'rgba(44,156,0,0.10)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon kind={kind} light={green} />
      </div>
      <div>
        <div style={{ ...H, fontSize: green ? 66 : 52, lineHeight: green ? '76px' : '62px', color: green ? '#fff' : C.ink }}>{title}</div>
        <div style={{ fontFamily: FONT.display, fontWeight: 400, fontSize: green ? 34 : 31, lineHeight: '44px', color: green ? 'rgba(255,255,255,0.88)' : C.grey }}>{sub}</div>
      </div>
    </div>
  );
};

// 80 px disc inside the 100 px gap between two cards
const Op: React.FC<{ f: number; at: number; ch: string; y: number }> = ({ f, at, ch, y }) => {
  const s = Math.min(1, spring({ frame: f - at, fps: FPS, config: { damping: 14, stiffness: 190, mass: 0.5 } }));
  return <div style={{ position: 'absolute', left: 500, top: y - 40, width: 80, height: 80, boxSizing: 'border-box', borderRadius: 40, background: '#fff', border: `2px solid ${C.line}`, boxShadow: SHADOW.sm, color: C.green, textAlign: 'center', fontFamily: FONT.display, fontWeight: 800, fontSize: 48, lineHeight: '74px', opacity: ramp(f, at - 1, at + 3), transform: `scale(${mix(0.4, 1, s)})` }}>{ch}</div>;
};

export const Explain: React.FC = () => {
  const f = useCurrentFrame();
  if (f < bf(X.start) - 4 || f >= bf(S.meet.start)) return null; // swapped out under the green wipe
  const [c1, c2, c3] = X.cards.map((b) => bf(b) - 1);
  const head = bf(X.head);
  const sweep = ramp(f, head + 6, head + 22, E.inOut);
  return (
    <AbsoluteFill>
      <Eyebrow text="MARKET CAP, EXPLAINED" style={{ top: 300, ...life(f, head - 4, Infinity, 26, 14) }} />
      <div style={{ position: 'absolute', left: 0, right: 0, top: 360, textAlign: 'center', ...life(f, head - 2, Infinity, 26, 14) }}>
        <div style={{ ...H, fontSize: 110, lineHeight: '116px', color: C.ink }}>What is</div>
        <div style={{ ...H, fontSize: 110, lineHeight: '116px' }}><span style={GRAD_TEXT(sweep)}>market cap?</span></div>
      </div>
      <Card f={f} at={c1} top={640} h={140} kind="price" title="Share price" sub="what one share costs" />
      <Op f={f} at={c2 - 2} ch="×" y={830} />
      <Card f={f} at={c2} top={880} h={140} kind="shares" title="Total shares" sub="every share issued" />
      <Op f={f} at={c3 - 2} ch="=" y={1070} />
      <Card f={f} at={c3} top={1120} h={180} kind="cap" title="Market cap" sub="what the company is worth" green />
      <div style={{ position: 'absolute', left: 60, right: 60, top: 1340, textAlign: 'center', fontFamily: FONT.display, fontWeight: 400, fontSize: 40, lineHeight: '56px', color: C.grey70, ...life(f, bf(X.line) - 2, Infinity, 26, 14) }}>
        The total value of a company<br />on the stock market.
      </div>
      <div style={{ position: 'absolute', left: 540 - 60, top: 1482, width: 120, height: 6, borderRadius: 3, background: C.green, transformOrigin: 'center', transform: `scaleX(${ramp(f, bf(X.line) + 6, bf(X.line) + 18, E.inOut)})` }} />
    </AbsoluteFill>
  );
};
