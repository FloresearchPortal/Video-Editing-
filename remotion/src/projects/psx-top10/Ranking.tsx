// E. Full ranking (beats 74-82): phone-readable horizontal list, #1 at the top. The #1 column morphs
// into OGDC's bar; the other rows rise in from the bottom and their bars grow. On beat 82 every bar
// folds into the CTA's short lime rule.
import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { C, COL, E, FONT, colH, fmtBn, life, mix, mixHex, ramp } from './theme';
import { bf, S, TOP, DATA } from './timeline';
import { Logo } from './Logo';

export const RULE = { x: 540 - 70, y: 1182, w: 140, h: 10 }; // the CTA rule the bars fold into
const ROW0 = 418, PITCH = 114, BX = 280, BMAX = 660, BAR_DY = 76, BAR_H = 14;
const barColor = (rank: number) => (rank === 1 ? C.green : rank <= 3 ? C.lime : C.ink);

export const Ranking: React.FC = () => {
  const f = useCurrentFrame();
  const f0 = bf(S.ranking.start), f1 = bf(S.ranking.end);
  if (f < f0 - 2 || f > f1 + 26) return null;
  const max = TOP[0].mcap_bn;
  const fold = (i: number) => ramp(f, f1 - 5 + (9 - i) * 0.4, f1 - 5 + (9 - i) * 0.4 + 11, E.inOut);
  return (
    <AbsoluteFill>
      <div style={{ position: 'absolute', left: 72, top: 236, ...life(f, f0 + 2, f1 - 9) }}>
        <div style={{ fontFamily: FONT.display, fontWeight: 900, fontSize: 56, lineHeight: '64px', letterSpacing: -1, color: C.ink }}>
          PSX <span style={{ color: C.green }}>·</span> TOP 10 BY MARKET CAP
        </div>
        <div style={{ marginTop: 10, fontFamily: FONT.mono, fontWeight: 600, fontSize: 27, letterSpacing: 2, color: C.grey }}>Rs bn · close {DATA.close_date}</div>
      </div>
      {TOP.map((co, i) => {
        const top = ROW0 + i * PITCH;
        const enter = i === 0 ? f0 + 8 : f0 + 3 + i * 2.2;
        const leave = f1 - 9 + (9 - i) * 0.4;
        const w = (co.mcap_bn / max) * BMAX;
        // bar rect: grows in (row 1 morphs from the column), then folds into the rule
        let r = { x: BX, y: top + BAR_DY, w: w * ramp(f, enter + 3, enter + 17, E.out), h: BAR_H };
        if (i === 0) {
          // the column first collapses upward into a thin bar, then stretches out along row 1
          const mv = ramp(f, f0 - 2, f0 + 9, E.inOut), mh = ramp(f, f0 + 4, f0 + 16, E.inOut), ch = colH(co.mcap_bn);
          r = { x: mix(COL.x, BX, mh), y: mix(COL.base - ch, top + BAR_DY, mv), w: mix(COL.w, w, mh), h: mix(ch, BAR_H, mv) };
        }
        const t = fold(i);
        r = { x: mix(r.x, RULE.x, t), y: mix(r.y, RULE.y, t), w: mix(r.w, RULE.w, t), h: mix(r.h, RULE.h, t) };
        const radius = i === 0 ? mix(18, BAR_H / 2, ramp(f, f0 - 2, f0 + 9)) : BAR_H / 2;
        const rowStyle = life(f, enter, leave, 120);
        return (
          <React.Fragment key={co.ticker}>
            <div style={{ position: 'absolute', left: BX, top: top + BAR_DY, width: BMAX, height: BAR_H, borderRadius: BAR_H / 2, background: C.track, ...life(f, enter + 2, leave, 120) }} />
            <div style={{ position: 'absolute', left: r.x, top: r.y, width: r.w, height: r.h, borderRadius: radius, background: mixHex(barColor(co.rank), C.lime, t), opacity: i === 0 ? 1 : ramp(f, enter, enter + 4) }} />
            <div style={{ position: 'absolute', left: 0, top, width: 1080, height: 70, ...rowStyle }}>
              <div style={{ position: 'absolute', left: 72, top: 8, width: 64, fontFamily: FONT.display, fontWeight: 900, fontSize: 40, lineHeight: '56px', color: co.rank <= 3 ? C.green : C.grey, fontFeatureSettings: '"tnum"' }}>{String(co.rank).padStart(2, '0')}</div>
              <div style={{ position: 'absolute', left: 140, top: 6 }}><Logo ticker={co.ticker} maxW={118} maxH={58} /></div>
              <div style={{ position: 'absolute', left: BX, top: 0, fontFamily: FONT.display, fontWeight: 900, fontSize: 58, lineHeight: '70px', letterSpacing: -1, color: C.ink }}>{co.ticker}</div>
              <div style={{ position: 'absolute', right: 1080 - (BX + BMAX), top: 10, fontFamily: FONT.display, fontWeight: 800, fontSize: 46, lineHeight: '60px', color: co.rank === 1 ? C.green : C.ink, fontFeatureSettings: '"tnum"' }}>{fmtBn(co.mcap_bn)}</div>
            </div>
          </React.Fragment>
        );
      })}
    </AbsoluteFill>
  );
};
