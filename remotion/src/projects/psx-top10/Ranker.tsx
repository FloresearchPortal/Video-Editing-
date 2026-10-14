// C + D. Countdown #10 -> #2, the "And number one?" build, the #1 drop and OGDC's reveal.
// One continuous scene, because the market-cap column (right) is the hero that persists throughout.
import React from 'react';
import { AbsoluteFill, spring, useCurrentFrame } from 'remotion';
import { C, COL, E, FONT, colH, fmtBn, life, mix, mixHex, ramp, riseIn, liftOut } from './theme';
import { bf, FPB, FPS, S, SLOTS, ONE, Co } from './timeline';
import { Logo } from './Logo';

const L = 72; // left margin of the copy column
const RANK = { x: 64, y: 214, size: 300 };
const TOP3_BEAT = SLOTS.find((s) => s.co.rank === S.countdown.top3_from_rank)!.beat;
const BUILD = S.build, DROP = S.drop;
const fDrop = bf(DROP.start), fContract = bf(DROP.contract), fEnd = bf(DROP.end);

const pad2 = (n: number) => String(n).padStart(2, '0');
const slotAt = (f: number) => {
  let k = -1;
  SLOTS.forEach((s, i) => { if (f >= bf(s.beat) - 2) k = i; });
  return k;
};

// column value over time (bn): spring from the previous company to the current one
const colValue = (f: number) => {
  if (f >= fDrop) return ONE.mcap_bn;
  const k = slotAt(f);
  if (k < 0) return 0;
  const s = SLOTS[k];
  const from = s.prev ? s.prev.mcap_bn : 0;
  const t = spring({ frame: f - bf(s.beat), fps: FPS, config: { damping: 15, stiffness: 120, mass: 0.9 } });
  return mix(from, s.co.mcap_bn, t);
};

// the counting value (bn) shown on the left
const shownValue = (f: number) => {
  if (f >= fContract) {
    const from = SLOTS[SLOTS.length - 1].co.mcap_bn;
    return mix(from, ONE.mcap_bn, ramp(f, fContract + 8, bf(DROP.value_lands), E.inOut));
  }
  const k = slotAt(f);
  if (k < 0) return 0;
  const s = SLOTS[k];
  return mix(s.prev ? s.prev.mcap_bn : 0, s.co.mcap_bn, ramp(f, bf(s.beat) - 1, bf(s.beat) + 1.4 * FPB, E.out));
};

// ---- rank digits: each changed digit rolls up (old leaves upward, new rises from below)
const Digit: React.FC<{ f: number; at: number; from?: string; to: string; color: string }> = ({ f, at, from, to, color }) => {
  const lh = RANK.size;
  const t = from === to ? 1 : ramp(f, at - 2, at + 9, E.out);
  return (
    <span style={{ position: 'relative', display: 'inline-block', width: RANK.size * 0.64, height: lh, overflow: 'hidden', verticalAlign: 'top', textAlign: 'center' }}>
      {from !== undefined && from !== to && (
        <span style={{ position: 'absolute', inset: 0, transform: `translateY(${-t * lh}px)`, opacity: 1 - t, color }}>{from}</span>
      )}
      <span style={{ position: 'absolute', inset: 0, transform: `translateY(${(1 - t) * lh}px)`, opacity: from === undefined ? t : 1, color }}>{to}</span>
    </span>
  );
};

const RankRoller: React.FC<{ f: number; color: string }> = ({ f, color }) => {
  const k = slotAt(f);
  if (k < 0 || f >= fDrop) return null;
  const s = SLOTS[k];
  const to = pad2(s.co.rank), from = s.prev ? pad2(s.prev.rank) : undefined;
  const out = liftOut(f, bf(BUILD.start) - 5, 60, 9);
  return (
    <div style={{ position: 'absolute', left: RANK.x, top: RANK.y, height: RANK.size, fontFamily: FONT.display, fontWeight: 900, fontSize: RANK.size, lineHeight: `${RANK.size}px`, letterSpacing: -6, opacity: out.opacity, transform: `translateY(${out.y}px)` }}>
      <Digit f={f} at={bf(s.beat)} from={from?.[0]} to={to[0]} color={color} />
      <Digit f={f} at={bf(s.beat)} from={from?.[1]} to={to[1]} color={color} />
    </div>
  );
};

// ---- swappable copy for one company (logo, name, sector, share of total)
const Copy: React.FC<{ f: number; co: Co; enter: number; leave: number }> = ({ f, co, enter, leave }) => {
  if (f < enter - 1 || f > leave + 12) return null;
  const it = (i: number, extra: React.CSSProperties = {}): React.CSSProperties => ({ position: 'absolute', left: L, ...life(f, enter + i * 1.6, leave + i * 0.8, 50), ...extra });
  return (
    <>
      <div style={it(0, { top: 600 })}><Logo ticker={co.ticker} maxW={420} maxH={130} /></div>
      <div style={it(1, { top: 768, width: 650, height: 160, display: 'flex', alignItems: 'flex-end', fontFamily: FONT.display, fontWeight: 800, fontSize: (co as any).name_size ?? 64, lineHeight: 1.06, letterSpacing: -1, color: C.green })}>
        <span>{co.name}</span>
      </div>
      <div style={it(2, { top: 936, fontFamily: FONT.serif, fontStyle: 'italic', fontSize: 58, lineHeight: '66px', color: C.ink })}>{co.sector}</div>
      <div style={it(4, { top: 1232, fontFamily: FONT.display, fontWeight: 900, fontSize: 46, lineHeight: '56px', color: C.ink })}>
        <span style={{ color: C.green, fontFeatureSettings: '"tnum"' }}>{co.share_pct.toFixed(1)}%</span>
        <span style={{ fontFamily: FONT.serif, fontStyle: 'italic', fontWeight: 400, fontSize: 50 }}> of the top-10 total</span>
      </div>
    </>
  );
};

export const Ranker: React.FC = () => {
  const f = useCurrentFrame();
  const start = bf(S.countdown.start);
  if (f < start - 12 || f > fEnd + 16) return null;

  const top3 = ramp(f, bf(TOP3_BEAT) - 2, bf(TOP3_BEAT) + 8, E.inOut);
  const accent = mixHex(C.ink, C.green, top3);
  const k = slotAt(f);
  const v = colValue(f);
  const h = colH(v), colTop = COL.base - h;
  const trackIn = riseIn(f, start - 5, 80, 14);
  const trackOut = liftOut(f, fEnd - 3, 0, 7).opacity;
  const ogdcPhase = f >= fContract + 12;

  // flood (drop): column rect -> full frame -> column rect at #1
  const ubl = SLOTS[SLOTS.length - 1].co;
  const grow = ramp(f, fDrop, fDrop + 8, E.out), shrink = ramp(f, fContract, fContract + 13, E.inOut);
  const fromR = { x: COL.x, y: COL.base - colH(ubl.mcap_bn), w: COL.w, h: colH(ubl.mcap_bn) };
  const toR = { x: COL.x, y: COL.base - colH(ONE.mcap_bn), w: COL.w, h: colH(ONE.mcap_bn) };
  const full = { x: 0, y: 0, w: 1080, h: 1920 };
  const R = f < fContract
    ? { x: mix(fromR.x, full.x, grow), y: mix(fromR.y, full.y, grow), w: mix(fromR.w, full.w, grow), h: mix(fromR.h, full.h, grow) }
    : { x: mix(full.x, toR.x, shrink), y: mix(full.y, toR.y, shrink), w: mix(full.w, toR.w, shrink), h: mix(full.h, toR.h, shrink) };
  const flooding = f >= fDrop && f < fContract + 13;

  // value + label: persistent through the countdown, out for the build, back for OGDC
  const valueVis = f < bf(BUILD.start)
    ? life(f, start - 1, bf(BUILD.start) - 5)
    : life(f, fContract + 8, fEnd - 4);
  const land = ramp(f, bf(DROP.value_lands), bf(DROP.value_lands) + 16, E.out);
  const landPulse = f >= bf(DROP.value_lands) ? 1 - land : 0;
  const valueColor = ogdcPhase ? C.green : C.ink;

  // ticker on top of the column
  const tk = f >= fDrop ? ONE.ticker : k >= 0 ? SLOTS[k].co.ticker : '';
  const tkVis = f >= fDrop
    ? ramp(f, fContract + 10, fContract + 16) * (1 - ramp(f, fEnd - 4, fEnd + 2))
    : ramp(f, start, start + 8) * (1 - ramp(f, bf(BUILD.start) - 4, bf(BUILD.start) + 4));
  const tkSwap = k >= 0 && f < fDrop ? ramp(f, bf(SLOTS[k].beat) - 2, bf(SLOTS[k].beat) + 6) : 1;

  // "01": slam on the drop, pulse each beat, travel into the rank slot on the contract
  const beatsIn = (f - fDrop) / FPB;
  const pulse = beatsIn >= 0 && beatsIn < DROP.hold_beats ? Math.exp(-((beatsIn % 1) * FPB) / 4) : 0;
  const slam = ramp(f, fDrop, fDrop + 9, E.back);
  const travel = ramp(f, fContract, fContract + 14, E.inOut);
  const bigSize = 640, sc = mix(bigSize / RANK.size, 1, travel) * (1 + 0.045 * pulse * (1 - travel));
  const oneW = RANK.size * 0.64 * 2 - 12;
  const bigX = 540 - (oneW * bigSize) / RANK.size / 2, bigY = 860 - (bigSize / 2);
  const ox = mix(bigX, RANK.x, travel), oy = mix(bigY + (1 - slam) * 300, RANK.y, travel);
  const oneOut = liftOut(f, fEnd - 4, 60, 9);

  return (
    <AbsoluteFill>
      {/* column: track, fill, baseline */}
      <div style={{ position: 'absolute', left: COL.x, top: COL.top, width: COL.w, height: COL.base - COL.top, background: C.track, borderRadius: '18px 18px 0 0', opacity: trackIn.opacity * trackOut, transform: `translateY(${trackIn.y}px)` }} />
      {!flooding && f < fEnd - 1 && (
        <div style={{ position: 'absolute', left: COL.x, top: colTop, width: COL.w, height: h, background: accent, borderRadius: '18px 18px 0 0', opacity: trackIn.opacity * trackOut, transform: `translateY(${trackIn.y}px)` }}>
          <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 10, borderRadius: '18px 18px 0 0', background: C.lime, opacity: 0.9 * landPulse }} />
        </div>
      )}
      <div style={{ position: 'absolute', left: COL.x - 34, top: COL.base, width: COL.w + 68, height: 4, background: C.ink, opacity: 0.85 * trackIn.opacity * trackOut }} />

      {/* ghost line at the previous company's height + lime sweep to the new level */}
      {k >= 0 && f < fDrop && SLOTS[k].prev && (() => {
        const s = SLOTS[k], gy = COL.base - colH(s.prev!.mcap_bn), b0 = bf(s.beat);
        const op = ramp(f, b0 - 1, b0 + 4) * (1 - ramp(f, b0 + 2.4 * FPB, b0 + 3.6 * FPB, E.inOut));
        return (
          <>
            <div style={{ position: 'absolute', left: COL.x - 26, top: gy - 1.5, width: COL.w + 52, height: 3, background: `repeating-linear-gradient(90deg, ${C.ghost} 0 12px, transparent 12px 20px)`, opacity: op }} />
            <div style={{ position: 'absolute', left: COL.x + 18, top: gy - 1.5, width: COL.w - 36, height: 3, background: 'rgba(255,255,255,0.7)', opacity: op }} />
            <div style={{ position: 'absolute', left: COL.x + COL.w + 34, top: gy - 15, fontFamily: FONT.mono, fontWeight: 600, fontSize: 24, lineHeight: '30px', color: C.grey, opacity: op }}>{s.prev!.ticker}</div>
          </>
        );
      })()}
      {k >= 0 && f < fDrop && (() => {
        const s = SLOTS[k], ny = COL.base - colH(s.co.mcap_bn), b0 = bf(s.beat);
        const sweep = ramp(f, b0 - 1, b0 + 8, E.inOut), fade = 1 - ramp(f, b0 + 9, b0 + 22, E.inOut);
        return <div style={{ position: 'absolute', left: 0, top: ny - 2.5, width: COL.x, height: 4, background: `linear-gradient(90deg, rgba(58,204,0,0), ${C.lime})`, transformOrigin: 'left center', transform: `scaleX(${sweep})`, opacity: fade * (sweep > 0 ? 1 : 0), boxShadow: `0 0 18px rgba(58,204,0,0.5)` }} />;
      })()}

      {/* ticker on top of the column */}
      <div style={{ position: 'absolute', left: COL.x - 60, width: COL.w + 120, top: (f >= fDrop ? toR.y : colTop) - 74, textAlign: 'center', fontFamily: FONT.display, fontWeight: 900, fontSize: 50, lineHeight: '60px', letterSpacing: -0.5, color: accent, opacity: tkVis * trackOut, transform: `translateY(${(1 - tkSwap) * 22}px)` }}>
        <span style={{ opacity: tkSwap }}>{tk}</span>
      </div>

      {/* left: rank, TOP 3, copy, value */}
      <RankRoller f={f} color={accent} />
      {f >= bf(TOP3_BEAT) - 4 && (
        <div style={{ position: 'absolute', left: 480, top: RANK.y + 66, ...life(f, bf(TOP3_BEAT), bf(BUILD.start) - 5, 30), ...(f >= fContract ? life(f, fContract + 10, fEnd - 4, 30) : {}) }}>
          <span style={{ display: 'inline-block', padding: '10px 22px', borderRadius: 40, border: `3px solid ${C.green}`, fontFamily: FONT.mono, fontWeight: 700, fontSize: 30, letterSpacing: 4, color: C.green }}>TOP 3</span>
        </div>
      )}
      {SLOTS.map((s, i) => (
        <Copy key={s.co.ticker} f={f} co={s.co} enter={bf(s.beat) - 1} leave={i < SLOTS.length - 1 ? bf(SLOTS[i + 1].beat) - 5 : bf(BUILD.start) - 5} />
      ))}
      <Copy f={f} co={ONE} enter={fContract + 6} leave={fEnd - 4} />
      <div style={{ position: 'absolute', left: L, top: 1050, fontFamily: FONT.mono, fontWeight: 600, fontSize: 25, letterSpacing: 5, color: C.grey, ...valueVis }}>MARKET CAPITALIZATION</div>
      <div style={{ position: 'absolute', left: L, top: 1088, whiteSpace: 'nowrap', fontFamily: FONT.display, fontWeight: 900, color: valueColor, ...valueVis }}>
        <span style={{ fontSize: 52, letterSpacing: -1 }}>Rs </span>
        <span style={{ fontSize: 108, lineHeight: '124px', letterSpacing: -3, fontFeatureSettings: '"tnum"', textShadow: landPulse > 0 ? `0 0 ${40 * landPulse}px rgba(58,204,0,${0.9 * landPulse})` : 'none' }}>{fmtBn(shownValue(f))}</span>
        <span style={{ fontSize: 52, letterSpacing: -1 }}> bn</span>
      </div>

      {/* build: "And number one?" then one beat of stillness */}
      {f >= bf(BUILD.and) - 4 && f < fDrop + 6 && (
        <div style={{ position: 'absolute', left: L, top: 610, opacity: 1 - ramp(f, fDrop, fDrop + 4) }}>
          <div style={{ fontFamily: FONT.serif, fontStyle: 'italic', fontSize: 170, lineHeight: '170px', color: C.ink, ...life(f, bf(BUILD.and) - 2) }}>And</div>
          <div style={{ fontFamily: FONT.display, fontWeight: 900, fontSize: 168, lineHeight: '168px', letterSpacing: -6, color: C.green, ...life(f, bf(BUILD.number_one) - 2) }}>number<br />one?</div>
        </div>
      )}

      {/* the drop: green flood, giant 01, beat rings, line */}
      {flooding && <div style={{ position: 'absolute', left: R.x, top: R.y, width: R.w, height: R.h, background: C.green, borderRadius: mix(18, 0, f < fContract ? grow : 1 - shrink) + 'px ' + mix(18, 0, f < fContract ? grow : 1 - shrink) + 'px 0 0' }} />}
      {f >= fDrop && f < fContract + 2 && Array.from({ length: DROP.hold_beats }, (_, i) => {
        const t = (f - bf(DROP.start + i)) / 18;
        if (t < 0 || t > 1) return null;
        const r = mix(300, 1050, E.out(t));
        return <div key={i} style={{ position: 'absolute', left: 540 - r, top: 860 - r, width: 2 * r, height: 2 * r, borderRadius: r, border: `${mix(14, 3, t)}px solid ${C.lime}`, opacity: 0.85 * (1 - t) }} />;
      })}
      {f >= fDrop && (
        <div style={{ position: 'absolute', left: ox, top: oy, height: RANK.size, transformOrigin: '0 0', transform: `scale(${sc})`, whiteSpace: 'nowrap', fontFamily: FONT.display, fontWeight: 900, fontSize: RANK.size, lineHeight: `${RANK.size}px`, letterSpacing: -6, color: mixHex('#ffffff', C.green, ramp(f, fContract + 2, fContract + 7, E.inOut)), opacity: ramp(f, fDrop, fDrop + 3) * oneOut.opacity, translate: `0 ${oneOut.y}px` }}>
          <span style={{ display: 'inline-block', width: RANK.size * 0.64, textAlign: 'center' }}>0</span>
          <span style={{ display: 'inline-block', width: RANK.size * 0.64, textAlign: 'center' }}>1</span>
        </div>
      )}
      {f >= fDrop && f < fContract + 6 && (
        <div style={{ position: 'absolute', left: 80, right: 80, top: 1290, textAlign: 'center', fontFamily: FONT.serif, fontStyle: 'italic', fontSize: 76, lineHeight: '84px', color: '#fff', ...life(f, bf(DROP.start + 0.5), fContract - 6) }}>
          the largest listed company on the PSX.
        </div>
      )}
    </AbsoluteFill>
  );
};
