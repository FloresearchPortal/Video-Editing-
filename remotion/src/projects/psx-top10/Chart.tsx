// 5. The chart (beats 26-38): phone-readable horizontal ranking, #1 at the top. Rows cascade up from
// the bottom, bars spring out and values count up; #1 gets a highlight; the top-10 total counts up.
// On the CTA beat every bar folds into the CTA's short lime rule.
import React from 'react';
import { AbsoluteFill, spring, useCurrentFrame } from 'remotion';
import { C, E, FONT, SHADOW, fmtBn, life, mix, mixHex, ramp } from './theme';
import { bf, FPS, S, TOP, DATA, HAS_LOGOS, SOURCE_LINE } from './timeline';
import { Logo } from './Logo';
import { Num } from './Num';

export const RULE = { x: 540 - 70, y: 1182, w: 140, h: 10 }; // the CTA rule the bars fold into
const ROW0 = 420, PITCH = 104, BAR_DY = 72, BAR_H = 14; // rows 420-1444
const TX = HAS_LOGOS ? 280 : 168; // ticker / bar start
const BX = TX, BMAX = 940 - BX;
const barColor = (rank: number) => (rank === 1 ? C.green : rank <= 3 ? C.lime : C.ink);

export const Chart: React.FC = () => {
  const f = useCurrentFrame();
  const f0 = bf(S.chart.start), f1 = bf(S.chart.end);
  if (f < f0 - 6 || f > f1 + 14) return null;
  const max = TOP[0].mcap_bn;
  // row text leaves first, then the bars fold, then the CTA text arrives: nothing crosses anything
  const fold = (i: number) => ramp(f, f1 - 9 + (9 - i) * 0.3, f1 - 9 + (9 - i) * 0.3 + 8, E.inOut);
  const rowIn = (i: number) => f0 + 4 + i * 1.6;
  const totalIn = rowIn(10) + 2;
  const total = DATA.total_bn * ramp(f, totalIn, totalIn + 18, E.out);
  return (
    <AbsoluteFill>
      <div style={{ position: 'absolute', left: 72, top: 246, ...life(f, f0 - 5, f1 - 20) }}>
        <div style={{ fontFamily: FONT.display, fontWeight: 900, fontSize: 46, lineHeight: '58px', letterSpacing: -0.5, color: C.ink }}>
          PSX <span style={{ color: C.green }}>·</span> TOP 10 BY MARKET CAP
        </div>
        <div style={{ marginTop: 10, fontFamily: FONT.mono, fontWeight: 600, fontSize: 26, lineHeight: '34px', letterSpacing: 1, color: C.grey }}>Market capitalization · close {DATA.close_date}</div>
      </div>
      {TOP.map((co, i) => {
        const top = ROW0 + i * PITCH;
        const enter = rowIn(i);
        const leave = f1 - 20 + (9 - i) * 0.3;
        const w = (co.mcap_bn / max) * BMAX;
        const g = spring({ frame: f - enter - 3, fps: FPS, config: { damping: 15, stiffness: 120, mass: 0.7 } });
        let r = { x: BX, y: top + BAR_DY, w: w * g, h: BAR_H };
        const t = fold(i);
        r = { x: mix(r.x, RULE.x, t), y: mix(r.y, RULE.y, t), w: mix(r.w, RULE.w, t), h: mix(r.h, RULE.h, t) };
        const count = co.mcap_bn * ramp(f, enter + 2, enter + 20, E.out);
        const one = co.rank === 1;
        return (
          <React.Fragment key={co.ticker}>
            {one && <div style={{ position: 'absolute', left: 48, top: top - 16, width: 984, height: 112, borderRadius: 28, background: '#EEF8E8', ...life(f, enter + 6, leave, 0) }} />}
            <div style={{ position: 'absolute', left: BX, top: top + BAR_DY, width: BMAX, height: BAR_H, borderRadius: BAR_H / 2, background: one ? '#DDEFD3' : C.track, ...life(f, enter + 1, leave, 120) }} />
            <div style={{ position: 'absolute', left: r.x, top: r.y, width: Math.max(0, r.w), height: r.h, borderRadius: BAR_H / 2, background: mixHex(barColor(co.rank), C.lime, t), opacity: ramp(f, enter + 2, enter + 5), boxShadow: one ? '0 6px 18px rgba(44,156,0,0.35)' : 'none' }} />
            <div style={{ position: 'absolute', left: 0, top, width: 1080, height: 70, ...life(f, enter, leave, 140) }}>
              <div style={{ position: 'absolute', left: 72, top: 8, fontFamily: FONT.display, fontWeight: 900, fontSize: 38, lineHeight: '56px', color: co.rank <= 3 ? C.green : C.grey }}>{String(co.rank).padStart(2, '0')}</div>
              {HAS_LOGOS && <div style={{ position: 'absolute', left: 140, top: 6 }}><Logo ticker={co.ticker} maxW={118} maxH={58} /></div>}
              <div style={{ position: 'absolute', left: TX, top: 0, fontFamily: FONT.display, fontWeight: 900, fontSize: 52, lineHeight: '68px', color: C.ink }}>{co.ticker}</div>
              {one && <span style={{ position: 'absolute', left: TX + 186, top: 16, padding: '4px 16px', borderRadius: 20, background: C.green, fontFamily: FONT.mono, fontWeight: 700, fontSize: 20, lineHeight: '30px', letterSpacing: 2, color: '#fff', ...life(f, enter + 10, leave, 20) }}>LARGEST</span>}
              <div style={{ position: 'absolute', right: 1080 - 940, top: 10, fontFamily: FONT.display, fontWeight: 800, fontSize: 40, lineHeight: '60px', color: one ? C.green : C.ink, whiteSpace: 'nowrap' }}>
                <span style={{ fontSize: 26, fontWeight: 600, color: C.grey }}>Rs </span><Num v={fmtBn(count)} cell={0.66} /><span style={{ fontSize: 26, fontWeight: 600, color: C.grey }}> bn</span>
              </div>
            </div>
          </React.Fragment>
        );
      })}
      {/* summary card: combined value + each company's share of it */}
      <div style={{ position: 'absolute', left: 72, top: 1470, width: 936, height: 166, boxSizing: 'border-box', borderRadius: 22, background: '#fff', border: `2px solid ${C.line}`, boxShadow: SHADOW.md, padding: '20px 28px 0', ...life(f, totalIn, f1 - 20, 60) }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: FONT.mono, fontWeight: 600, fontSize: 21, lineHeight: '30px', letterSpacing: '0.12em', color: C.grey }}>COMBINED VALUE · TOP 10</span>
          <span style={{ fontFamily: FONT.display, fontWeight: 800, fontSize: 46, lineHeight: '56px', letterSpacing: '-0.02em', color: C.ink, whiteSpace: 'nowrap' }}>
            <span style={{ fontSize: 28, fontWeight: 600, color: C.grey }}>Rs </span><Num v={(total / 1000).toFixed(2)} cell={0.66} /><span style={{ fontSize: 28, fontWeight: 600, color: C.grey }}> trillion</span>
          </span>
        </div>
        <div style={{ position: 'relative', marginTop: 16, height: 18, borderRadius: 9, overflow: 'hidden', background: C.track, display: 'flex', gap: 3 }}>
          {TOP.map((c, i) => {
            const g = ramp(f, totalIn + 4 + i * 1.2, totalIn + 12 + i * 1.2, E.out);
            return <div key={c.ticker} style={{ width: `${c.share_pct * g}%`, height: '100%', background: [C.green, '#3ACC00', '#7ED957', C.ink, '#2A3038', '#3C434D', '#565E69', '#6B7280', '#8A929D', '#A9B0BA'][i], flexShrink: 0 }} />;
          })}
        </div>
        <div style={{ marginTop: 10, display: 'flex', justifyContent: 'space-between', fontFamily: FONT.display, fontWeight: 600, fontSize: 19, lineHeight: '24px', color: C.grey, opacity: ramp(f, totalIn + 14, totalIn + 22) }}>
          <span><span style={{ color: C.green }}>{TOP[0].ticker} {TOP[0].share_pct.toFixed(1)}%</span> of the top-10 total</span>
          <span>{TOP[9].ticker} {TOP[9].share_pct.toFixed(1)}%</span>
        </div>
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 1654, textAlign: 'center', fontFamily: FONT.mono, fontWeight: 500, fontSize: 22, lineHeight: '30px', color: C.grey, ...life(f, f0 + 6, f1 - 20, 20) }}>{SOURCE_LINE}</div>
    </AbsoluteFill>
  );
};
