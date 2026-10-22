// v3 showreel, second half: tools, trading edge, stocks + commodities, trust,
// LEARN/ANALYZE/INVEST recap, CTA. Copy from flostocks.com.
import React from 'react';
import { AbsoluteFill, Img, interpolate } from 'remotion';
import {
  Apple,
  Calculator,
  Check,
  Headset,
  Laptop,
  Monitor,
  Receipt,
  Repeat,
  ShieldCheck,
  Smartphone,
  TrendingUp,
  Zap,
} from 'lucide-react';
import { FS, FS_BODY, FS_EASE, FS_MONO, FsWatermark, LOGO, fsHeadline } from '../flostocks';
import { Confetti, Cursor, Ripple, Slam, Stripes, lerp, pulse, sp, SNAP } from '../flostocks-v2/fx';
import { BEATF, b } from './timing';
import { Bg, Foot, Head, Tag, card, pop } from './kit';

// =============================================================================
// 05 TOOLS — four free calculators
// =============================================================================
const TOOLS = [
  { Icon: Calculator, name: 'Commission', sub: 'brokerage · SST · net' },
  { Icon: Repeat, name: 'SIP', sub: 'monthly investing plan' },
  { Icon: TrendingUp, name: 'Investment return', sub: 'incl. cash dividends' },
  { Icon: Receipt, name: 'CGT', sub: 'by holding period' },
] as const;

const Spark: React.FC<{ t: number; at: number; kind: number }> = ({ t, at, kind }) => {
  const g = lerp(t, at, at + b(2), 0, 1, FS_EASE.out);
  if (kind === 1)
    return (
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 80 }}>
        {[0.25, 0.35, 0.45, 0.55, 0.68, 0.8, 0.95].map((h, i) => (
          <div key={i} style={{ flex: 1, height: `${h * 100 * Math.min(1, g * 1.4 - i * 0.05)}%`, borderRadius: 4, backgroundColor: i === 6 ? FS.green : '#CDEFC0' }} />
        ))}
      </div>
    );
  if (kind === 2) {
    const d = 'M 0 70 L 60 58 L 120 62 L 180 40 L 240 46 L 300 22 L 360 14';
    return (
      <svg width="100%" height="80" viewBox="0 0 360 80" preserveAspectRatio="none">
        <path d={d} fill="none" stroke={FS.green} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - g} />
      </svg>
    );
  }
  if (kind === 3)
    return (
      <div style={{ display: 'flex', gap: 10, height: 80, alignItems: 'center' }}>
        {['< 1 yr', '1–2 yrs', '2+ yrs'].map((x, i) => (
          <span key={x} style={{ fontFamily: FS_MONO, fontWeight: 600, fontSize: 22, padding: '8px 12px', borderRadius: 10, backgroundColor: i === Math.floor(g * 2.99) ? FS.green : '#EEF3EF', color: FS.ink }}>
            {x}
          </span>
        ))}
      </div>
    );
  return (
    <div style={{ height: 80, display: 'flex', alignItems: 'center' }}>
      <span style={{ fontFamily: FS_MONO, fontWeight: 600, fontSize: 52, color: FS.ink }}>
        Rs {Math.round(interpolate(g, [0, 1], [0, 1250])).toLocaleString('en-US')}
      </span>
    </div>
  );
};

export const Tools: React.FC<{ t: number }> = ({ t }) => (
  <AbsoluteFill style={{ overflow: 'hidden' }}>
    <Bg t={t} seed={1200} />
    <Tag t={t} n="05" label="FREE INVESTMENT TOOLS" />
    <Head t={t} lines={[{ text: 'Plan every rupee' }, { text: 'before you trade', color: FS.green, size: 92 }]} />
    <div style={{ position: 'absolute', left: 70, top: 620, width: 940, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 28 }}>
      {TOOLS.map((tl, i) => {
        const at = b(1 + i);
        const p = pop(t, at, i % 2 ? 300 : -300, 120);
        const hot = pulse(t, at, BEATF * 8);
        return (
          <div key={tl.name} style={{ ...card({ borderRadius: 34, padding: '34px 32px', height: 380 }), ...p.style }}>
            <div
              style={{
                width: 96,
                height: 96,
                borderRadius: 26,
                backgroundColor: FS.ink,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transform: `rotate(${(1 - p.s) * -90}deg) scale(${1 + hot * 0.08})`,
              }}
            >
              <tl.Icon size={52} color={FS.green} strokeWidth={2.2} />
            </div>
            <p style={{ margin: '26px 0 0', fontFamily: FS_BODY, fontWeight: 800, fontSize: 42, color: FS.ink, lineHeight: 1.05 }}>{tl.name}</p>
            <p style={{ margin: '6px 0 18px', fontFamily: FS_BODY, fontSize: 28, color: FS.gray }}>{tl.sub}</p>
            <Spark t={t} at={at + 6} kind={i} />
          </div>
        );
      })}
    </div>
    <Foot t={t} at={b(5.5)} top={1480} text="Commission · SIP · Investment return · CGT calculators" />
    <FsWatermark width={1080} onLight />
  </AbsoluteFill>
);

// =============================================================================
// 06 EDGE — MTS, relationship managers, V Trade on every platform
// =============================================================================
const EDGE = [
  { Icon: Zap, title: 'Margin Trading (MTS)', sub: "PSX's regulated facility for more buying power" },
  { Icon: Headset, title: 'Relationship managers', sub: 'Personal support · dedicated customer service' },
  { Icon: Monitor, title: 'V Trade terminal', sub: 'Real-time quotes · advanced charting · live portfolio' },
] as const;
const PLATFORMS = [
  { Icon: Monitor, name: 'Windows' },
  { Icon: Laptop, name: 'macOS' },
  { Icon: Smartphone, name: 'Android' },
  { Icon: Apple, name: 'iOS' },
] as const;

export const Edge: React.FC<{ t: number }> = ({ t }) => (
  <AbsoluteFill style={{ overflow: 'hidden' }}>
    <Bg t={t} seed={1400} />
    <Tag t={t} n="06" label="TRADE YOUR WAY" />
    <Head t={t} lines={[{ text: 'More power' }, { text: 'to trade', color: FS.green }]} />
    <div style={{ position: 'absolute', left: 70, width: 940, top: 610, display: 'flex', flexDirection: 'column', gap: 26 }}>
      {EDGE.map((e, i) => {
        const p = pop(t, b(1 + i), 900, 0);
        return (
          <div key={e.title} style={{ ...card({ borderRadius: 34, padding: '30px 34px', display: 'flex', alignItems: 'center', gap: 30 }), ...p.style }}>
            <div style={{ minWidth: 110, height: 110, borderRadius: 30, backgroundColor: i === 0 ? FS.green : FS.ink, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <e.Icon size={56} color={i === 0 ? FS.ink : FS.green} strokeWidth={2.2} />
            </div>
            <div>
              <p style={{ margin: 0, fontFamily: FS_BODY, fontWeight: 800, fontSize: 44, color: FS.ink }}>{e.title}</p>
              <p style={{ margin: '6px 0 0', fontFamily: FS_BODY, fontSize: 29, color: FS.gray }}>{e.sub}</p>
            </div>
          </div>
        );
      })}
    </div>
    <div style={{ position: 'absolute', left: 70, width: 940, top: 1250, display: 'flex', gap: 18 }}>
      {PLATFORMS.map((pf, i) => {
        const p = pop(t, b(4 + i * 0.5), 0, 160);
        return (
          <div key={pf.name} style={{ flex: 1, ...card({ borderRadius: 28, padding: '24px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }), ...p.style }}>
            <pf.Icon size={58} color={FS.ink} strokeWidth={1.9} />
            <span style={{ fontFamily: FS_BODY, fontWeight: 700, fontSize: 30, color: FS.ink }}>{pf.name}</span>
          </div>
        );
      })}
    </div>
    <Foot t={t} at={b(6)} top={1500} text="V Trade on Windows, macOS, Android and iOS" />
    <FsWatermark width={1080} onLight />
  </AbsoluteFill>
);

// =============================================================================
// 07 MARKETS — PSX stocks + PMEX commodities, one brokerage
// =============================================================================
const STOCK_CHIPS = ['Banks', 'Cement', 'Oil & Gas', 'Tech', 'Fertilizer', 'Power'];
const COMMOD = [
  { n: 'Gold', c: '#D4A017' },
  { n: 'Silver', c: '#A7AFB7' },
  { n: 'Crude Oil', c: '#2B2B2B' },
  { n: 'Copper', c: '#C26A3A' },
];

export const Markets: React.FC<{ t: number }> = ({ t }) => {
  const plus = sp(t, b(2), SNAP);
  const L = pop(t, b(1), -600, 0);
  const R = pop(t, b(1.5), 600, 0);
  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      <Bg t={t} seed={1600} />
      <Tag t={t} n="07" label="STOCKS + COMMODITIES" />
      <Head t={t} lines={[{ text: 'One brokerage.' }, { text: 'Two exchanges.', color: FS.green }]} />
      <div style={{ ...card({ position: 'absolute', left: 60, top: 640, width: 455, height: 760, padding: '36px 32px' }), ...L.style }}>
        <p style={{ margin: 0, ...fsHeadline(96, FS.green) }}>PSX</p>
        <p style={{ margin: '4px 0 26px', fontFamily: FS_BODY, fontWeight: 600, fontSize: 30, color: FS.gray }}>Pakistan Stock Exchange</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14 }}>
          {STOCK_CHIPS.map((c, i) => (
            <span key={c} style={{ fontFamily: FS_BODY, fontWeight: 700, fontSize: 30, padding: '14px 22px', borderRadius: 999, backgroundColor: 'rgba(56,209,0,0.12)', color: FS.ink, ...pop(t, b(2.5 + i * 0.4), 0, 50).style }}>
              {c}
            </span>
          ))}
        </div>
      </div>
      <div style={{ ...card({ position: 'absolute', right: 60, top: 640, width: 455, height: 760, padding: '36px 32px' }), ...R.style }}>
        <p style={{ margin: 0, ...fsHeadline(96, FS.ink) }}>PMEX</p>
        <p style={{ margin: '4px 0 26px', fontFamily: FS_BODY, fontWeight: 600, fontSize: 30, color: FS.gray }}>Commodity futures</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {COMMOD.map((c, i) => (
            <div key={c.n} style={{ display: 'flex', alignItems: 'center', gap: 18, padding: '16px 20px', borderRadius: 22, backgroundColor: '#F4F6F5', ...pop(t, b(3 + i * 0.5), 200, 0).style }}>
              <div style={{ width: 44, height: 44, borderRadius: 22, background: `radial-gradient(circle at 35% 35%, #fff 0%, ${c.c} 55%)` }} />
              <span style={{ fontFamily: FS_BODY, fontWeight: 700, fontSize: 34, color: FS.ink }}>{c.n}</span>
            </div>
          ))}
        </div>
      </div>
      <div
        style={{
          position: 'absolute',
          left: 540 - 60,
          top: 960,
          width: 120,
          height: 120,
          borderRadius: 60,
          backgroundColor: FS.green,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transform: `scale(${plus}) rotate(${(1 - plus) * 180}deg)`,
          boxShadow: '0 16px 40px rgba(31,122,0,0.35)',
        }}
      >
        <span style={{ ...fsHeadline(90, FS.paper), fontStyle: 'normal', lineHeight: 1, marginTop: -6 }}>+</span>
      </div>
      <Foot t={t} at={b(5.5)} top={1460} text="Member of PSX & PMEX — stocks and commodity futures, one brokerage" />
      <FsWatermark width={1080} onLight />
    </AbsoluteFill>
  );
};

// =============================================================================
// 08 TRUST — regulation badges
// =============================================================================
const BADGES = ['SECP licensed & regulated', 'PSX TREC Holder 535', 'Member PSX & PMEX', 'Formerly Floret Commodities'];

export const Trust: React.FC<{ t: number }> = ({ t }) => {
  const kick = pulse(t, 0, BEATF);
  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      <Bg t={t} seed={1800} />
      <div style={{ position: 'absolute', left: 540 - 300, top: 980 - 300, opacity: 0.07 + kick * 0.04, transform: `scale(${1 + kick * 0.04})` }}>
        <ShieldCheck size={600} color={FS.green} strokeWidth={1.1} />
      </div>
      <Tag t={t} n="08" label="REGULATED" />
      <Head t={t} lines={[{ text: 'Built on trust.' }, { text: 'Backed by', color: FS.green }, { text: 'regulation.', color: FS.green }]} step={0.5} />
      <div style={{ position: 'absolute', top: 760, left: 100, right: 100, display: 'flex', flexDirection: 'column', gap: 26 }}>
        {BADGES.map((x, i) => {
          const at = b(2 + i * 0.75);
          const p = pop(t, at, i % 2 ? 900 : -900, 0);
          const tick = lerp(t, at + 4, at + 14, 0, 1);
          return (
            <div
              key={x}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 28,
                padding: '26px 38px',
                borderRadius: 999,
                backgroundColor: 'rgba(255,255,255,0.95)',
                border: '2px solid rgba(56,209,0,0.4)',
                boxShadow: '0 14px 40px rgba(10,14,10,0.08)',
                ...p.style,
              }}
            >
              <svg width="62" height="62" viewBox="0 0 54 54">
                <circle cx="27" cy="27" r="25" fill={FS.green} />
                <path d="M15 28 L24 37 L40 19" fill="none" stroke={FS.ink} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={60} strokeDashoffset={60 * (1 - tick)} />
              </svg>
              <span style={{ fontFamily: FS_BODY, fontWeight: 700, fontSize: 44, color: FS.ink }}>{x}</span>
            </div>
          );
        })}
      </div>
      <Foot t={t} at={b(5.5)} top={1480} text="A decade-plus foundation in Pakistan's markets" />
      <FsWatermark width={1080} onLight />
    </AbsoluteFill>
  );
};

// =============================================================================
// RECAP — LEARN. ANALYZE. INVEST. on the beat
// =============================================================================
const WORDS = [
  { at: 0, w: 'LEARN.', bg: FS.paper, fg: FS.ink },
  { at: 2, w: 'ANALYZE.', bg: FS.green, fg: FS.paper },
  { at: 4, w: 'INVEST.', bg: FS.paper, fg: FS.green },
] as const;

export const Recap: React.FC<{ t: number }> = ({ t }) => {
  const cur = [...WORDS].reverse().find((x) => t >= b(x.at));
  if (t < b(6) && cur) {
    const flash = lerp(t, b(cur.at), b(cur.at) + 6, 0.35, 0);
    const drift = lerp(t, b(cur.at), b(cur.at + 2), 1, 1.12, (n) => n);
    return (
      <AbsoluteFill style={{ backgroundColor: cur.bg, overflow: 'hidden' }}>
        <Stripes t={t} color={cur.bg === FS.green ? 'rgba(255,255,255,0.08)' : 'rgba(56,209,0,0.06)'} />
        <AbsoluteFill style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${drift})` }}>
          <Slam t={t} at={b(cur.at)} from={3.2} rot={-10}>
            <h1 style={{ ...fsHeadline(cur.w.length > 7 ? 190 : 230, cur.fg) }}>{cur.w}</h1>
          </Slam>
        </AbsoluteFill>
        <AbsoluteFill style={{ backgroundColor: cur.bg === FS.green ? FS.paper : FS.green, opacity: flash }} />
      </AbsoluteFill>
    );
  }
  const s = sp(t, b(6), { damping: 11, stiffness: 220, mass: 0.6 });
  return (
    <AbsoluteFill style={{ backgroundColor: FS.paper, overflow: 'hidden' }}>
      <Bg t={t} seed={2000} tint={1.4} />
      <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ margin: 0, fontFamily: FS_MONO, fontWeight: 600, fontSize: 40, letterSpacing: '0.3em', color: FS.greenDeep, opacity: Math.min(1, s * 2) }}>ALL WITH</p>
        <Img src={LOGO.fullOnLight} style={{ width: 860, marginTop: 20, transform: `scale(${interpolate(s, [0, 1], [2.6, 1])})`, opacity: Math.min(1, s * 3) }} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

// =============================================================================
// CTA — gateway line, button tap, URL types itself
// =============================================================================
const URL = 'flostocks.com';
export const Cta: React.FC<{ t: number }> = ({ t }) => {
  const btn = sp(t, b(2.5), { damping: 12, stiffness: 200, mass: 0.6 });
  const CLICK = b(4.5);
  const pressed = t >= CLICK - 2 && t < CLICK + 6 ? 1 : 0;
  const cx = lerp(t, b(3), CLICK - 3, 1000, 700, FS_EASE.inOut);
  const cy = lerp(t, b(3), CLICK - 3, 1980, 1060, FS_EASE.inOut);
  const typed = Math.floor(lerp(t, CLICK + 4, CLICK + 4 + b(2), 0, URL.length, (n) => n));
  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      <Bg t={t} seed={2200} tint={1.3} />
      <Head
        t={t}
        top={330}
        lines={[{ text: "Pakistan's modern", size: 96 }, { text: 'gateway to the', size: 96 }, { text: 'stock market', color: FS.green, size: 112 }]}
      />
      <div
        style={{
          position: 'absolute',
          left: 110,
          width: 860,
          top: 960,
          height: 150,
          borderRadius: 75,
          backgroundColor: FS.green,
          boxShadow: '0 26px 70px rgba(31,122,0,0.35)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 22,
          transform: `translateY(${(1 - btn) * 500}px) scale(${pressed ? 0.94 : 1 + pulse(t, CLICK, BEATF) * 0.03})`,
          opacity: Math.min(1, btn * 2),
        }}
      >
        <span style={{ fontFamily: FS_BODY, fontWeight: 800, fontSize: 56, color: FS.ink }}>Open your PSX account</span>
        <svg width="52" height="52" viewBox="0 0 46 46" style={{ transform: `translateX(${Math.sin(t / 5) * 5}px)` }}>
          <path d="M8 23 H38 M26 9 L38 23 L26 37" fill="none" stroke={FS.ink} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <Ripple t={t} at={CLICK} x={700} y={1035} />
      <Confetti t={t} at={CLICK} x={540} y={1030} colors={[FS.green, FS.ink, FS.mint]} />
      {t >= b(3) - 2 && t < b(7.5) && <Cursor x={cx} y={cy} pressed={pressed} opacity={lerp(t, b(6.5), b(7.5), 1, 0)} />}
      <div style={{ position: 'absolute', top: 1190, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
        <p style={{ margin: 0, fontFamily: FS_MONO, fontWeight: 600, fontSize: 70, color: FS.ink }}>
          {URL.slice(0, typed)}
          <span style={{ color: FS.green, opacity: t > CLICK && t % 16 < 9 ? 1 : 0 }}>|</span>
        </p>
      </div>
      <div style={{ position: 'absolute', top: 1300, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 16, opacity: lerp(t, b(6.5), b(7.2), 0, 1) }}>
        <Check size={40} color={FS.green} strokeWidth={3} />
        <span style={{ fontFamily: FS_BODY, fontWeight: 600, fontSize: 36, color: FS.gray }}>Learn & analyze the PSX — 100% free</span>
      </div>
      <p style={{ position: 'absolute', top: 1380, left: 0, right: 0, margin: 0, textAlign: 'center', fontFamily: FS_BODY, fontWeight: 600, fontSize: 34, color: FS.gray, opacity: lerp(t, b(7), b(7.6), 0, 1) }}>
        @floretcapitals
      </p>
    </AbsoluteFill>
  );
};

