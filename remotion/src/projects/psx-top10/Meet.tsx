// 4. "Meet the top 10." (beats 27-30), site style, revealed by the green wipe; two rows of
// ticker chips glide underneath. Layout: eyebrow 400-436 · "Meet the" 470-596 · "top 10." 600-840 ·
// chips 930-1016 and 1046-1132.
import React from 'react';
import { AbsoluteFill, spring, useCurrentFrame } from 'remotion';
import { C, E, FONT, GRAD_TEXT, H, SHADOW, life, mix, ramp } from './theme';
import { bf, FPS, S, TOP } from './timeline';
import { Eyebrow } from './Eyebrow';

const M = S.meet;

export const Meet: React.FC = () => {
  const f = useCurrentFrame();
  if (f < bf(M.start) || f > bf(M.end) + 4) return null; // appears under the green wipe
  const at = bf(M.start);
  const s = Math.min(1, spring({ frame: f - at, fps: FPS, config: { damping: 14, stiffness: 160, mass: 0.6 } }));
  const out = bf(M.exit);
  return (
    <AbsoluteFill>
      <Eyebrow text="THE RANKING" style={{ top: 400, ...life(f, at, out, 26, 12) }} />
      <div style={{ position: 'absolute', left: 0, right: 0, top: 470, textAlign: 'center', ...life(f, at + 1, out, 40, 12) }}>
        <div style={{ ...H, fontSize: 110, lineHeight: '126px', color: C.ink }}>Meet the</div>
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 600, textAlign: 'center', ...life(f, at + 2, out + 1, 0, 8) }}>
        <div style={{ display: 'inline-block', ...H, fontSize: 220, lineHeight: '240px', transform: `scale(${mix(0.85, 1, s)})` }}>
          <span style={GRAD_TEXT(ramp(f, at + 4, at + 20, E.inOut))}>top 10.</span>
        </div>
      </div>
      {[0, 1].map((k) => (
        <div key={k} style={{ position: 'absolute', left: 0, top: 930 + k * 116, width: 1080, height: 86, overflow: 'visible', ...life(f, at + 4 + k * 2, out + 2 + k, 60, 12) }}>
          <div style={{ position: 'absolute', top: 0, left: k ? -900 + (f - at) * 6 : -(f - at) * 6, display: 'flex', gap: 18, whiteSpace: 'nowrap' }}>
            {[...TOP, ...TOP].map((c, i) => (
              <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 12, height: 82, boxSizing: 'border-box', padding: '0 28px', borderRadius: 41, background: '#fff', border: `2px solid ${C.line}`, boxShadow: SHADOW.sm, fontFamily: FONT.display, fontWeight: 700, fontSize: 36, lineHeight: '78px', color: C.ink }}>
                <span style={{ width: 12, height: 12, borderRadius: 6, background: C.green }} />{c.ticker}
              </span>
            ))}
          </div>
        </div>
      ))}
    </AbsoluteFill>
  );
};
