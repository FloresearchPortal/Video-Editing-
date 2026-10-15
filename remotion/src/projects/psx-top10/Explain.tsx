// 3. What is market cap? (beats 18-27), a visual multiplication with OGDC's real figures:
//   b18    one OGDC share appears as a tile: Rs <price>
//   b19.5  zoom out: the tile multiplies into a field of shares while the count rolls to <shares>
//   b21.5  the field condenses into one solid block: Rs <mcap> bn, OGDC's market cap
//   b23    "The total value of a company on the stock market."
// The formula strip underneath fills in step by step: [share price] x [total shares] = [market cap].
// Zones (no overlaps): eyebrow 270-306 · heading 330-410 · sub 440-486 · stage 540-1300 · strip 1340-1480
import React from 'react';
import { AbsoluteFill, spring, useCurrentFrame } from 'remotion';
import { C, E, FONT, H, SHADOW, fmtBn, mix, ramp } from './theme';
import { bf, FPS, S, ONE } from './timeline';
import { Eyebrow } from './Eyebrow';
import { Num } from './Num';

const X = S.explain;
const PRICE: number = (ONE as any).price;
const SHARES: number = (ONE as any).shares;
const STAGE = { x: 80, y: 540, w: 920, h: 760, r: 40 };
const CX = 540, CY = 900, P = 280, TILE = 240;

const fmtInt = (n: number) => Math.round(n).toLocaleString('en-US');
const fmtPrice = (v: number) => v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// heading that rolls to the next line of copy
const Roll: React.FC<{ f: number; lines: [number, string][] }> = ({ f, lines }) => (
  <div style={{ position: 'absolute', left: 0, right: 0, top: 330, height: 90, overflow: 'hidden', textAlign: 'center' }}>
    {lines.map(([at, text], i) => {
      const next = lines[i + 1]?.[0] ?? Infinity;
      // sequential: the old line leaves before the new one rises, so they never share the slot
      const tin = ramp(f, at + 1, at + 9, E.out), tout = next === Infinity ? 0 : ramp(f, next - 5, next + 1, E.in);
      if (f < at || f > next + 2) return null;
      return <div key={i} style={{ position: 'absolute', left: 0, right: 0, ...H, fontSize: 62, lineHeight: '90px', color: C.ink, transform: `translateY(${(1 - tin) * 90 - tout * 90}px)` }}>{text}</div>;
    })}
  </div>
);

const Chip: React.FC<{ f: number; at: number; x: number; w: number; label: string; green?: boolean; children: React.ReactNode }> = ({ f, at, x, w, label, green, children }) => {
  const s = Math.min(1, spring({ frame: f - at, fps: FPS, config: { damping: 16, stiffness: 160, mass: 0.6 } }));
  return (
    <div style={{ position: 'absolute', left: x, top: 1340, width: w, height: 140, boxSizing: 'border-box', borderRadius: 22, padding: '22px 0 0 24px',
      background: green ? `linear-gradient(135deg, ${C.deep}, ${C.green} 60%, #3ACC00)` : '#fff', border: green ? 'none' : `2px solid ${C.line}`,
      boxShadow: green ? '0 20px 50px rgba(44,156,0,0.28)' : SHADOW.md, opacity: ramp(f, at - 1, at + 4), transform: `translateY(${(1 - s) * 30}px)` }}>
      <div style={{ fontFamily: FONT.display, fontWeight: 600, fontSize: 19, lineHeight: '26px', letterSpacing: '0.1em', color: green ? 'rgba(255,255,255,0.85)' : C.grey }}>{label}</div>
      <div style={{ fontFamily: FONT.display, fontWeight: 800, fontSize: 40, lineHeight: '60px', letterSpacing: '-0.02em', color: green ? '#fff' : C.ink, whiteSpace: 'nowrap' }}>{children}</div>
    </div>
  );
};
const Op: React.FC<{ f: number; at: number; x: number; ch: string }> = ({ f, at, x, ch }) => (
  <div style={{ position: 'absolute', left: x, top: 1390, width: 36, height: 40, textAlign: 'center', fontFamily: FONT.display, fontWeight: 800, fontSize: 40, lineHeight: '40px', color: C.green, opacity: ramp(f, at - 1, at + 4) }}>{ch}</div>
);

export const Explain: React.FC = () => {
  const f = useCurrentFrame();
  if (f < bf(X.start) - 4 || f >= bf(S.meet.start)) return null; // swapped out under the green wipe
  const t0 = bf(X.tile), z0 = bf(X.zoom), m0 = bf(X.merge), s0 = bf(X.sub);
  // one tile pops in
  const pop = Math.min(1.04, spring({ frame: f - t0, fps: FPS, config: { damping: 12, stiffness: 150, mass: 0.6 } }));
  // exponential zoom out: 1 -> 0.05
  const zt = ramp(f, z0, m0 - 2, E.inOut);
  const z = Math.exp(mix(0, Math.log(0.05), zt));
  const reveal = mix(TILE * 0.55, 1500, ramp(f, z0, m0 - 6, E.in));
  // share count rolls up (log scale so every digit gets its moment)
  const ct = ramp(f, z0 + 2, m0 - 2, E.inOut);
  const shares = ct <= 0 ? 1 : Math.pow(10, ct * Math.log10(SHARES));
  // merge into the solid block
  const solid = ramp(f, m0 - 3, m0 + 4, E.inOut);
  const shrink = ramp(f, m0 + 2, m0 + 14, E.out);
  const blk = { x: mix(STAGE.x, 140, shrink), y: mix(STAGE.y, 620, shrink), w: mix(STAGE.w, 800, shrink), h: mix(STAGE.h, 560, shrink) };
  const cap = ONE.mcap_bn * ramp(f, m0 + 4, m0 + 22, E.out);
  const tileText = 1 - ramp(f, z0 + 2, z0 + 8);

  return (
    <AbsoluteFill>
      <Eyebrow text="MARKET CAP, EXPLAINED" style={{ top: 270, opacity: ramp(f, t0 - 4, t0 + 6), transform: `translateY(${(1 - ramp(f, t0 - 4, t0 + 10, E.out)) * 26}px)` }} />
      <Roll f={f} lines={[[t0 - 1, 'Take one OGDC share.'], [z0, 'Multiply by every share.'], [m0, "That's its market cap."]]} />
      <div style={{ position: 'absolute', left: 0, right: 0, top: 440, textAlign: 'center', fontFamily: FONT.display, fontWeight: 400, fontSize: 32, lineHeight: '46px', color: C.grey, opacity: ramp(f, s0 - 2, s0 + 8), transform: `translateY(${(1 - ramp(f, s0 - 2, s0 + 12, E.out)) * 20}px)` }}>
        The total value of a company on the stock market.
      </div>

      {/* stage */}
      <div style={{ position: 'absolute', left: STAGE.x, top: STAGE.y, width: STAGE.w, height: STAGE.h, borderRadius: STAGE.r, overflow: 'hidden', background: C.mist, border: `2px solid ${C.line}`, boxSizing: 'border-box', opacity: ramp(f, t0 - 3, t0 + 4) }}>
        <svg width={STAGE.w} height={STAGE.h} style={{ position: 'absolute', left: -2, top: -2 }}>
          <defs>
            <pattern id="shares" width={P} height={P} patternUnits="userSpaceOnUse" patternTransform={`translate(${CX - STAGE.x} ${CY - STAGE.y}) scale(${z}) translate(${-P / 2} ${-P / 2})`}>
              <rect x={(P - TILE) / 2} y={(P - TILE) / 2} width={TILE} height={TILE} rx={48} fill={C.green} />
            </pattern>
            <radialGradient id="rev" cx={CX - STAGE.x} cy={CY - STAGE.y} r={reveal} gradientUnits="userSpaceOnUse">
              <stop offset="0.7" stopColor="#fff" /><stop offset="1" stopColor="#000" />
            </radialGradient>
            <mask id="revMask"><rect width={STAGE.w} height={STAGE.h} fill="url(#rev)" /></mask>
          </defs>
          {f >= z0 && <rect width={STAGE.w} height={STAGE.h} fill="url(#shares)" mask="url(#revMask)" opacity={1 - solid * 0.6} />}
        </svg>
        {/* the one share (stays crisp at the centre of the zoom) */}
        <div style={{ position: 'absolute', left: CX - STAGE.x - TILE / 2, top: CY - STAGE.y - TILE / 2, width: TILE, height: TILE, borderRadius: 48, background: `linear-gradient(135deg, ${C.deep}, ${C.green} 60%, #3ACC00)`, boxShadow: '0 24px 60px rgba(44,156,0,0.3)', transform: `scale(${pop * z})`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 1 - solid }}>
          <div style={{ ...H, fontSize: 52, lineHeight: '60px', color: '#fff', opacity: tileText }}>OGDC</div>
          <div style={{ fontFamily: FONT.display, fontWeight: 500, fontSize: 26, lineHeight: '34px', color: 'rgba(255,255,255,0.85)', opacity: tileText }}>1 share</div>
        </div>
        {/* price tag under the single share */}
        <div style={{ position: 'absolute', left: 0, right: 0, top: CY - STAGE.y + TILE / 2 + 36, display: 'flex', justifyContent: 'center', opacity: ramp(f, t0 + 6, t0 + 12) * (1 - ramp(f, z0, z0 + 6)) }}>
          <span style={{ padding: '10px 26px', borderRadius: 30, background: '#fff', border: `2px solid ${C.line}`, boxShadow: SHADOW.sm, fontFamily: FONT.display, fontWeight: 800, fontSize: 40, lineHeight: '52px', color: C.ink }}>Rs <Num v={fmtPrice(PRICE * ramp(f, t0 + 6, t0 + 18, E.out))} cell={0.64} /></span>
        </div>
      </div>
      {/* share counter while the field multiplies: its own slot between heading and stage */}
        <div style={{ position: 'absolute', left: 0, right: 0, top: 452, display: 'flex', justifyContent: 'center', opacity: ramp(f, z0 + 2, z0 + 8) * (1 - ramp(f, m0 - 2, m0 + 3)) }}>
          <span style={{ padding: '10px 28px', borderRadius: 32, background: C.ink, boxShadow: SHADOW.md, fontFamily: FONT.display, fontWeight: 800, fontSize: 34, lineHeight: '44px', color: '#fff' }}>
            × <span style={{ color: C.lime }}><Num v={fmtInt(shares)} cell={0.64} /></span> shares
          </span>
        </div>
      {/* the solid block: OGDC's market cap */}
      {solid > 0 && (
        <div style={{ position: 'absolute', left: blk.x, top: blk.y, width: blk.w, height: blk.h, borderRadius: 40, background: `linear-gradient(135deg, ${C.deep}, ${C.green} 60%, #3ACC00)`, opacity: solid, boxShadow: '0 30px 80px rgba(44,156,0,0.35)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ fontFamily: FONT.display, fontWeight: 600, fontSize: 24, lineHeight: '34px', letterSpacing: '0.14em', color: 'rgba(255,255,255,0.85)', opacity: ramp(f, m0 + 6, m0 + 12) }}>OGDC MARKET CAP</div>
          <div style={{ ...H, fontSize: 90, lineHeight: '110px', color: '#fff', whiteSpace: 'nowrap', opacity: ramp(f, m0 + 4, m0 + 9) }}>Rs <Num v={fmtBn(cap)} cell={0.64} /> bn</div>
          <div style={{ marginTop: 10, fontFamily: FONT.display, fontWeight: 500, fontSize: 26, lineHeight: '36px', color: 'rgba(255,255,255,0.85)', opacity: ramp(f, m0 + 12, m0 + 18) }}>{fmtInt(SHARES)} shares × Rs {fmtPrice(PRICE)}</div>
        </div>
      )}

      {/* formula strip */}
      <Chip f={f} at={t0 + 8} x={58} w={280} label="SHARE PRICE">Rs {fmtPrice(PRICE)}</Chip>
      <Op f={f} at={z0} x={346} ch="×" />
      <Chip f={f} at={z0 + 2} x={390} w={280} label="TOTAL SHARES">{(SHARES / 1e9).toFixed(2)} bn</Chip>
      <Op f={f} at={m0} x={678} ch="=" />
      <Chip f={f} at={m0 + 2} x={722} w={300} label="MARKET CAP" green>Rs {(ONE.mcap_bn / 1000).toFixed(2)} tn</Chip>
    </AbsoluteFill>
  );
};
