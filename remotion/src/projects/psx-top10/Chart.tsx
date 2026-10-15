// 5. The chart (beats 26-38): phone-readable horizontal ranking, #1 at the top. Rows cascade up from
// the bottom, bars spring out and values count up; #1 gets a highlight; the top-10 total counts up.
// On the CTA beat every bar folds into the CTA's short lime rule.
import React from 'react';
import { AbsoluteFill, spring, useCurrentFrame } from 'remotion';
import { C, E, FONT, fmtBn, life, mix, mixHex, ramp } from './theme';
import { bf, FPS, S, TOP, DATA, HAS_LOGOS, SOURCE_LINE } from './timeline';
import { Logo } from './Logo';
import { Num } from './Num';

export const RULE = { x: 540 - 70, y: 1182, w: 140, h: 10 }; // the CTA rule the bars fold into
const ROW0 = 432, PITCH = 110, BAR_DY = 74, BAR_H = 14;
const TX = HAS_LOGOS ? 280 : 168; // ticker / bar start
const BX = TX, BMAX = 940 - BX;
const barColor = (rank: number) => (rank === 1 ? C.green : rank <= 3 ? C.lime : C.ink);

export const Chart: React.FC = () => {
  const f = useCurrentFrame();
  const f0 = bf(S.chart.start), f1 = bf(S.chart.end);
  if (f < f0 - 2 || f > f1 + 22) return null;
  const max = TOP[0].mcap_bn;
  // row text leaves first, then the bars fold, then the CTA text arrives: nothing crosses anything
  const fold = (i: number) => ramp(f, f1 - 4 + (9 - i) * 0.35, f1 - 4 + (9 - i) * 0.35 + 9, E.inOut);
  const rowIn = (i: number) => f0 + 4 + i * 1.6;
  const totalIn = rowIn(10) + 2;
  const total = DATA.total_bn * ramp(f, totalIn, totalIn + 18, E.out);
  return (
    <AbsoluteFill>
      <div style={{ position: 'absolute', left: 72, top: 246, ...life(f, f0 - 5, f1 - 12) }}>
        <div style={{ fontFamily: FONT.display, fontWeight: 900, fontSize: 46, lineHeight: '58px', letterSpacing: -0.5, color: C.ink }}>
          PSX <span style={{ color: C.green }}>·</span> TOP 10 BY MARKET CAP
        </div>
        <div style={{ marginTop: 10, fontFamily: FONT.mono, fontWeight: 600, fontSize: 26, lineHeight: '34px', letterSpacing: 1, color: C.grey }}>Rs bn · close {DATA.close_date}</div>
      </div>
      {TOP.map((co, i) => {
        const top = ROW0 + i * PITCH;
        const enter = rowIn(i);
        const leave = f1 - 12 + (9 - i) * 0.3;
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
              <div style={{ position: 'absolute', right: 1080 - 940, top: 10, fontFamily: FONT.display, fontWeight: 800, fontSize: 42, lineHeight: '60px', color: one ? C.green : C.ink }}><Num v={fmtBn(count)} cell={0.66} /></div>
            </div>
          </React.Fragment>
        );
      })}
      <div style={{ position: 'absolute', left: 72, right: 140, top: 1552, display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 70, padding: '0 28px', borderRadius: 22, background: C.ink, ...life(f, totalIn, f1 - 12, 60) }}>
        <span style={{ fontFamily: FONT.mono, fontWeight: 600, fontSize: 22, letterSpacing: 3, color: 'rgba(255,255,255,0.75)' }}>TOP-10 TOTAL</span>
        <span style={{ fontFamily: FONT.display, fontWeight: 800, fontSize: 36, lineHeight: '50px', color: '#fff' }}>Rs <span style={{ color: C.lime }}><Num v={(total / 1000).toFixed(2)} cell={0.66} /></span> trillion</span>
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 1648, textAlign: 'center', fontFamily: FONT.mono, fontWeight: 500, fontSize: 22, lineHeight: '30px', color: C.grey, ...life(f, f0 + 6, f1 - 12, 20) }}>{SOURCE_LINE}</div>
    </AbsoluteFill>
  );
};
