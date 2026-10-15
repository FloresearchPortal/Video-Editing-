// 2D kinetic typography over the 3D world. Letters rise out of masks one by one (with motion blur on
// the way in) and leave the same way; all copy lives in the top or bottom third so the 3D action
// keeps the centre.
import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { C, FONT, KIN, fmt2, seriesAsset } from '../../series/flostocks/theme';
import { Num } from '../../series/flostocks/Num';
import { bf, DATA, EZ, rp, S, TOP } from './timeline';

// a line whose letters rise out of a mask, staggered; leaves upward
const Rise: React.FC<{ text: string; at: number; leave: number; top: number; size: number; color: string; align?: 'left' | 'center'; stagger?: number; style?: React.CSSProperties }> = ({ text, at, leave, top, size, color, align = 'center', stagger = 0.9, style }) => {
  const f = useCurrentFrame();
  if (f < at - 1 || f > leave + 16) return null;
  const lh = Math.round(size * 1.12);
  return (
    <div style={{ position: 'absolute', left: align === 'left' ? 84 : 0, right: align === 'left' ? undefined : 0, top, height: lh + 10, overflow: 'hidden', textAlign: align, whiteSpace: 'nowrap', ...KIN, fontSize: size, lineHeight: `${lh}px`, color, ...style }}>
      {text.split('').map((ch, i) => {
        const a = at + i * stagger, l = leave + i * stagger * 0.5;
        const tin = rp(f, a, a + 11, EZ.out), tout = rp(f, l, l + 8, EZ.in);
        return <span key={i} style={{ display: 'inline-block', whiteSpace: 'pre', transform: `translateY(${(1 - tin) * (lh + 10) - tout * (lh + 10)}px)`, filter: `blur(${(1 - tin) * 6 + tout * 6}px)` }}>{ch}</span>;
      })}
    </div>
  );
};

const Fade: React.FC<{ at: number; leave: number; top: number; children: React.ReactNode; style?: React.CSSProperties }> = ({ at, leave, top, children, style }) => {
  const f = useCurrentFrame();
  if (f < at - 1 || f > leave + 10) return null;
  const t = rp(f, at, at + 12, EZ.out) * (1 - rp(f, leave, leave + 8));
  return <div style={{ position: 'absolute', left: 0, right: 0, top, textAlign: 'center', opacity: t, transform: `translateY(${(1 - rp(f, at, at + 14, EZ.out)) * 24}px)`, ...style }}>{children}</div>;
};

const label: React.CSSProperties = { fontFamily: FONT, fontWeight: 600, fontSize: 25, lineHeight: '34px', letterSpacing: '0.28em', color: C.grey };

export const Overlay: React.FC = () => {
  const f = useCurrentFrame();
  const sh = S.share, tw = S.towers;
  const tag = rp(f, 6, 16) * (1 - rp(f, bf(S.logo.start), bf(S.logo.start) + 6));
  const win = (a: number, b: number) => rp(f, bf(a) - 4, bf(a) + 4) * (1 - rp(f, bf(b) - 4, bf(b) + 4));
  const bottomScrim = Math.max(win(sh.coin, S.towers.start), win(tw.hero, S.logo.start));
  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      {/* cinematic scrims: the copy zones (top / bottom thirds) sit on soft darkness, never on busy 3D */}
      <AbsoluteFill style={{ background: 'linear-gradient(180deg, rgba(247,251,248,0.92) 0%, rgba(247,251,248,0.5) 22%, rgba(247,251,248,0) 34%)' }} />
      {/* the bottom scrim only while there is copy down there (share, hero, wide), never over the tower labels */}
      <AbsoluteFill style={{ opacity: bottomScrim, background: 'linear-gradient(180deg, rgba(247,251,248,0) 60%, rgba(247,251,248,0.62) 76%, rgba(247,251,248,0.94) 100%)' }} />
      {/* series tag */}
      <div style={{ position: 'absolute', left: 84, top: 170, display: 'flex', alignItems: 'center', gap: 14, opacity: tag }}>
        <img src={seriesAsset('logos/FLOSTOCKS-icon.png')} style={{ width: 40, height: 40 }} />
        <span style={{ fontFamily: FONT, fontWeight: 700, fontSize: 22, letterSpacing: '0.16em', color: C.ink }}>FLOSTOCKS EXPLAINS <span style={{ color: C.green }}>· EP 01</span></span>
      </div>
      {/* ignite */}
      <Fade at={bf(0.8)} leave={bf(6.4)} top={330}><span style={label}>LIVE FROM KARACHI</span></Fade>
      <Rise text="PAKISTAN" at={bf(1)} leave={bf(6.4)} top={380} size={132} color={C.ink} />
      <Rise text="STOCK EXCHANGE" at={bf(1.6)} leave={bf(6.6)} top={530} size={96} color={C.green} stagger={0.6} />
      {/* city */}
      <Rise text="WHO ARE" at={bf(8.2)} leave={bf(12.6)} top={360} size={130} color={C.ink} />
      <Rise text="THE BIGGEST?" at={bf(8.9)} leave={bf(12.8)} top={510} size={124} color={C.green} stagger={0.7} />
      {/* share */}
      <Rise text="SHARE PRICE" at={bf(sh.coin) + 8} leave={bf(sh.stack) - 3} top={1300} size={110} color={C.ink} stagger={0.6} />
      <Fade at={bf(sh.coin) + 16} leave={bf(sh.stack) - 4} top={1440}><span style={{ ...label, letterSpacing: '0.2em' }}>WHAT ONE SHARE COSTS</span></Fade>
      <Rise text="× ALL SHARES" at={bf(sh.stack) + 2} leave={bf(sh.cap) - 4} top={1300} size={110} color={C.ink} stagger={0.6} />
      <Rise text="= MARKET CAP" at={bf(sh.cap)} leave={bf(S.towers.start) - 2} top={1290} size={122} color={C.green} stagger={0.6} />
      <Fade at={bf(sh.cap) + 8} leave={bf(S.towers.start) - 3} top={1440}><span style={{ ...label, letterSpacing: '0.2em' }}>THE VALUE OF THE WHOLE COMPANY</span></Fade>
      {/* towers: the countdown is labelled on the towers themselves; hero #1 */}
      <Fade at={bf(tw.first_rise) - 4} leave={bf(27.5)} top={330}><span style={label}>RANKED BY MARKET CAP · PSX</span></Fade>
      <Fade at={bf(tw.hero) + 4} leave={bf(tw.wide) - 2} top={1250}>
        <span style={{ display: 'inline-block', padding: '6px 22px', borderRadius: 24, background: C.green, fontFamily: FONT, fontWeight: 800, fontSize: 26, letterSpacing: '0.1em', color: '#fff' }}>No. 1</span>
      </Fade>
      <Rise text={TOP[0].ticker} at={bf(tw.hero) + 6} leave={bf(tw.wide) - 2} top={1310} size={170} color={C.ink} />
      <Fade at={bf(tw.hero) + 12} leave={bf(tw.wide) - 2} top={1510}>
        <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 54, color: C.green }}><span style={{ fontSize: 32, fontWeight: 600, color: C.grey }}>Rs </span><Num v={fmt2(TOP[0].mcap_bn)} /><span style={{ fontSize: 32, fontWeight: 600, color: C.grey }}> bn</span></span>
      </Fade>
      {/* wide */}
      <Rise text="TOP 10" at={bf(tw.wide) + 6} leave={bf(S.logo.start)} top={300} size={230} color={C.ink} stagger={1.2} />
      <Fade at={bf(tw.wide) + 14} leave={bf(S.logo.start)} top={570}><span style={label}>BY MARKET CAP · PAKISTAN STOCK EXCHANGE</span></Fade>
      <Fade at={bf(tw.wide) + 20} leave={bf(S.logo.start)} top={1440}>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 64, lineHeight: '76px', color: C.ink }}><span style={{ fontSize: 36, fontWeight: 600, color: C.grey }}>Rs </span>{(DATA.total_bn / 1000).toFixed(2)}<span style={{ fontSize: 36, fontWeight: 600, color: C.grey }}> trillion</span></div>
        <div style={{ ...label, marginTop: 6, letterSpacing: '0.2em' }}>COMBINED VALUE OF THE TOP 10</div>
        <div style={{ marginTop: 26, fontFamily: FONT, fontWeight: 500, fontSize: 21, color: C.grey }}>Source: {DATA.source} · close {DATA.close_date}</div>
      </Fade>
    </AbsoluteFill>
  );
};
