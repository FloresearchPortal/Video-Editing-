// 4. "Meet the TOP 10" (beats 22-26): punchy reveal with two ticker marquees, then lifts out into the chart.
import React from 'react';
import { AbsoluteFill, spring, useCurrentFrame } from 'remotion';
import { ACCENT, C, FONT, life, mix } from './theme';
import { bf, FPS, S, TOP } from './timeline';

const M = S.meet;

export const Meet: React.FC = () => {
  const f = useCurrentFrame();
  if (f < bf(M.start) || f > bf(M.end) + 4) return null; // appears under the green wipe
  const at = bf(M.start);
  const s = spring({ frame: f - at, fps: FPS, config: { damping: 11, stiffness: 180, mass: 0.6 } });
  const out = bf(M.exit);
  return (
    <AbsoluteFill>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 430, textAlign: 'center', ...life(f, at, out, 60) }}>
        <div style={{ ...ACCENT, fontSize: 120, lineHeight: '140px', color: C.ink }}>Meet the</div>
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 590, textAlign: 'center', ...life(f, at, out + 1, 0) }}>
        <div style={{ display: 'inline-block', fontFamily: FONT.display, fontWeight: 900, fontSize: 250, lineHeight: '280px', letterSpacing: -6, color: C.green, transform: `scale(${mix(0.6, 1, Math.min(1, s))})` }}>TOP 10</div>
      </div>
      {[0, 1].map((k) => (
        <div key={k} style={{ position: 'absolute', left: 0, top: 960 + k * 116, width: 1080, height: 96, overflow: 'hidden', ...life(f, at + 2 + k * 2, out + 2 + k, 90) }}>
          <div style={{ position: 'absolute', top: 0, left: k ? -900 + (f - at) * 7 : -(f - at) * 7, display: 'flex', gap: 18, whiteSpace: 'nowrap' }}>
            {[...TOP, ...TOP].map((c, i) => (
              <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 12, height: 90, padding: '0 30px', borderRadius: 45, background: (i + k) % 3 === 0 ? C.ink : '#fff', border: '2px solid #E3E8E2', fontFamily: FONT.display, fontWeight: 800, fontSize: 40, lineHeight: '86px', color: (i + k) % 3 === 0 ? '#fff' : C.ink }}>
                <span style={{ width: 14, height: 14, borderRadius: 7, background: C.lime }} />{c.ticker}
              </span>
            ))}
          </div>
        </div>
      ))}
    </AbsoluteFill>
  );
};
