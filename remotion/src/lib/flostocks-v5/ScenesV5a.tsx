// v5 showreel, first half (scene-local frame t; beats via b(n), 128 BPM).
import React from 'react';
import { AbsoluteFill, Img, interpolate } from 'remotion';
import { FS_EASE, LOGO } from '../flostocks';
import { lerp, seeded, sp } from '../flostocks-v2/fx';
import { b } from './timing';
import { C, Candle, Disk, Drop, Field, MBlur, Marquee, Rise, TAPE, Whip, disp, mono, thin, vel } from './mkit';
import { NEWS_LINES, NEWS_SIZE, NEWS_X, NEWS_Y, NewsBlock } from './news';

const Dot: React.FC<{ size: number; color: string; s?: number }> = ({ size, color, s = 1 }) => (
  <span style={{ display: 'inline-block', width: size, height: size, borderRadius: '50%', backgroundColor: color, marginLeft: size * 0.18, transform: `scale(${s})` }} />
);

// =============================================================================
// 01 THE NEWS — the flood lands; each line punches on the beat (white -> ink,
// width axis snaps 62 -> 100 with overshoot), then a marquee groove, then squeeze.
// =============================================================================
export const News: React.FC<{ t: number }> = ({ t }) => {
  const squeeze = lerp(t, b(3.5), b(4), 0, 1, FS_EASE.in);
  return (
    <Field color={C.green}>
      <div style={{ position: 'absolute', left: NEWS_X, top: NEWS_Y }}>
        <NewsBlock
          color={C.white}
          render={(line, i) => {
            const at = b(i * 0.5);
            const s = sp(t, at, { damping: 9, stiffness: 260, mass: 0.5 });
            const hit = t >= at;
            const wdth = hit ? interpolate(s, [0, 1], [62, 100]) - squeeze * 40 : 100;
            const isLast = i === NEWS_LINES.length - 1;
            const text = isLast ? line.replace('!', '') : line;
            return (
              <p style={{ ...disp(NEWS_SIZE, hit ? C.ink : C.white, Math.max(62, Math.min(125, wdth)), 900), transform: `scale(${hit ? 0.92 + 0.08 * s : 1})`, transformOrigin: '0 100%' }}>
                {text}
                {isLast && <span style={{ color: C.white }}>!</span>}
              </p>
            );
          }}
        />
      </div>
    </Field>
  );
};

// =============================================================================
// 02 IDENTITY — no spin, no orbit: a price line rips up through the frame, the mark
// SLAMS down onto it (vertical motion blur, squash on impact), shockwave rings +
// a candle burst + camera shake on the hit, then the title stacks in on the beats.
// =============================================================================
const IMPACT = 7; // frame the mark lands (drop spring below reaches rest ≈ here)
// the rip runs along the lower third, under the title, so it never crosses any text
const RIP = [
  [-40, 1840], [90, 1825], [170, 1835], [260, 1790], [330, 1800], [420, 1745], [500, 1755], [590, 1690], [660, 1705], [760, 1625], [830, 1640], [940, 1535], [1000, 1550], [1120, 1430],
] as const;
const MY = 600; // the mark's centre
const ripPath = (k: number) => {
  const n = RIP.length - 1;
  const upto = k * n;
  const i = Math.min(n, Math.floor(upto));
  const u = upto - i;
  const pts = RIP.slice(0, i + 1).map((p) => `${p[0]} ${p[1]}`);
  if (i < n) pts.push(`${RIP[i][0] + (RIP[i + 1][0] - RIP[i][0]) * u} ${RIP[i][1] + (RIP[i + 1][1] - RIP[i][1]) * u}`);
  return 'M ' + pts.join(' L ');
};
const BURST = Array.from({ length: 22 }, (_, i) => ({ a: (i / 22) * Math.PI * 2 + seeded(i + 300) * 0.2, v: 0.75 + seeded(i + 330) * 0.6, up: seeded(i + 360) > 0.3 }));

export const Identity: React.FC<{ t: number }> = ({ t }) => {
  const fall = (tt: number) => (tt < 0 ? -1300 : interpolate(lerp(tt, 0, IMPACT, 0, 1, FS_EASE.in), [0, 1], [-1300, 0]));
  const hit = t - IMPACT;
  const squash = hit >= 0 ? 1 - Math.exp(-hit * 0.32) * Math.cos(hit * 0.85) * 0.28 : 1.12;
  const shake = hit >= 0 ? Math.exp(-hit * 0.22) * 26 : 0;
  const sx = shake * Math.sin(t * 2.7);
  const sy = shake * Math.cos(t * 3.3);
  const rip = lerp(t, 0, 12, 0, 1, FS_EASE.out);
  const flash = hit >= 0 ? Math.exp(-hit * 0.45) : 0;
  return (
    <Field color={C.ink}>
      <AbsoluteFill style={{ transform: `translate(${sx}px, ${sy}px)` }}>
        <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0 }}>
          {/* grid */}
          {Array.from({ length: 9 }, (_, i) => (
            <line key={`h${i}`} x1={0} y1={260 + i * 180} x2={1080} y2={260 + i * 180} stroke={C.white} strokeOpacity={0.05} strokeWidth={2} />
          ))}
          {Array.from({ length: 6 }, (_, i) => (
            <line key={`v${i}`} x1={90 + i * 180} y1={0} x2={90 + i * 180} y2={1920} stroke={C.white} strokeOpacity={0.05} strokeWidth={2} />
          ))}
          {/* the rip: a price line tearing up through the frame */}
          <path d={`${ripPath(rip)} L ${RIP[RIP.length - 1][0]} 1920 L -40 1920 Z`} fill={C.green} opacity={0.1 * rip} />
          <path d={ripPath(rip)} fill="none" stroke={C.green} strokeWidth={9} strokeLinejoin="round" style={{ filter: 'drop-shadow(0 0 18px rgba(56,209,0,0.8))' }} />
          {/* shockwave rings */}
          {hit >= 0 &&
            [0, 4, 9].map((d, k) => {
              const h = hit - d;
              if (h < 0 || h > 26) return null;
              const r = 150 + (1 - Math.pow(1 - h / 26, 3)) * (90 + k * 30);
              return <circle key={k} cx={540} cy={MY} r={r} fill="none" stroke={k === 1 ? C.green : C.white} strokeWidth={Math.max(1, 14 - h * 0.5)} opacity={1 - h / 26} />;
            })}
          {/* candle burst */}
          {hit >= 0 &&
            hit < 12 &&
            BURST.map((p, i) => {
              const k = 1 - Math.pow(1 - Math.min(1, hit / 12), 3);
              const r = 170 + k * 300 * p.v;
              const x = 540 + Math.cos(p.a) * r;
              const y = MY + Math.sin(p.a) * r;
              const len = interpolate(hit, [0, 4, 12], [20, 90, 24]) * p.v;
              return (
                <g key={i} transform={`rotate(${(p.a * 180) / Math.PI + 90} ${x} ${y})`} opacity={1 - hit / 12}>
                  <Candle x={x} y={y} w={14} body={len * 0.55} wick={len} up={p.up} color={p.up ? C.green : C.white} />
                </g>
              );
            })}
        </svg>
        <AbsoluteFill style={{ backgroundColor: C.green, opacity: flash * 0.35, mixBlendMode: 'screen' }} />
        <MBlur id="idm" vy={vel(fall, t)} style={{ position: 'absolute', left: 540 - 170, top: MY - 170 }}>
          <Img
            src={LOGO.iconOnDark}
            style={{ width: 340, height: 340, transform: `translateY(${fall(t)}px) scaleY(${squash}) scaleX(${2 - squash})`, transformOrigin: '50% 100%', opacity: t >= 0 ? 1 : 0 }}
          />
        </MBlur>
        <div style={{ position: 'absolute', top: 920, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18 }}>
          <Rise t={t} at={b(1)} text="THE OFFICIAL" id="idA" stagger={0.7} style={mono(36, C.green)} />
          <Rise t={t} at={b(1.5)} text="PSX DIVISION" id="idB" stagger={1} style={disp(124, C.white, 96, 900)} />
          <Rise t={t} at={b(2.25)} text="of Floret Capitals" id="idC" stagger={0.5} style={thin(54, C.white)} />
        </div>
      </AbsoluteFill>
      <Disk t={t} at={b(3.3)} dur={10} color={C.white} cy={MY} />
    </Field>
  );
};

// =============================================================================
// 03 WORDMARK — FLOSTOCKS rises from a baseline, then the width axis waves
// through the letters (variable-font squash & stretch), editorial rules + labels.
// =============================================================================
export const Wordmark: React.FC<{ t: number }> = ({ t }) => {
  const rule = lerp(t, 0, b(1), 0, 1, FS_EASE.out);
  return (
    <Field color={C.white}>
      <div style={{ position: 'absolute', top: 690, left: 70, right: 70 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', opacity: rule }}>
          <span style={mono(22, C.ink, 0.7)}>Nº 01</span>
          <span style={mono(22, C.ink, 0.7)}>PSX DIVISION — 2026</span>
        </div>
        <div style={{ height: 3, backgroundColor: C.ink, marginTop: 12, width: `${rule * 100}%` }} />
      </div>
      <div style={{ position: 'absolute', top: 770, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
        <Rise
          t={t}
          at={2}
          text="FLOSTOCKS"
          id="wm"
          stagger={1.5}
          style={disp(128, C.ink, 100, 900, true)}
          colorFn={(i) => (i < 3 ? C.ink : C.green)}
        />
      </div>
      <div style={{ position: 'absolute', top: 960, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
        <Rise t={t} at={b(1)} text="by Floret Capitals" id="wmb" stagger={0.7} style={thin(66, C.ink)} />
      </div>
      <div style={{ position: 'absolute', top: 1090, left: 70, right: 70 }}>
        <div style={{ height: 2, backgroundColor: C.ink, opacity: 0.4, width: `${rule * 100}%` }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, opacity: lerp(t, b(2), b(2.6), 0, 1) }}>
          <span style={mono(20, C.ink, 0.6)}>PAKISTAN STOCK EXCHANGE</span>
          <span style={mono(20, C.ink, 0.6)}>SECP LICENSED</span>
          <span style={mono(20, C.ink, 0.6)}>TREC 535</span>
        </div>
      </div>
    </Field>
  );
};

// =============================================================================
// 04 HOW IT WORKS — "from A to B": three tracks, three easings, motion trails.
// =============================================================================
type Ease = (n: number) => number;
const expoOut: Ease = (n) => (n >= 1 ? 1 : 1 - Math.pow(2, -10 * n));
const backOut: Ease = (n) => {
  const c1 = 1.9;
  const c3 = c1 + 1;
  return 1 + c3 * Math.pow(n - 1, 3) + c1 * Math.pow(n - 1, 2);
};
const elastic: Ease = (n) => (n <= 0 ? 0 : n >= 1 ? 1 : Math.pow(2, -9 * n) * Math.sin((n * 10 - 0.75) * ((2 * Math.PI) / 3.2)) + 1);

const ROWS = [
  { n: '01', k: 'LEARN', sub: 'free guides · ebook · A–Z glossary', ease: expoOut, curve: 'M2 34 C 6 4, 14 2, 38 2', col: C.ink },
  { n: '02', k: 'OPEN', sub: 'your PSX account, fully digital', ease: backOut, curve: 'M2 34 C 14 -10, 22 2, 38 2', col: C.green },
  { n: '03', k: 'INVEST', sub: 'trade the PSX with Floret Capitals', ease: elastic, curve: 'M2 34 C 10 -6, 16 10, 22 0 S 30 4, 38 2', col: C.deep },
] as const;
const TX0 = 330;
const TX1 = 980;
// a rising, slightly noisy price path from A to B (row-specific wiggle)
const traceY = (row: number, x: number, y: number) => {
  const u = (x - TX0) / (TX1 - TX0);
  return y + 34 - 68 * u + 12 * Math.sin(u * 17 + row * 2) * Math.sin(u * 3.1);
};
const tracePath = (row: number, xEnd: number, y: number) => {
  const pts: string[] = [];
  for (let x = TX0; x <= xEnd; x += 10) pts.push(`${pts.length ? 'L' : 'M'} ${x} ${traceY(row, x, y)}`);
  pts.push(`L ${xEnd} ${traceY(row, xEnd, y)}`);
  return pts.join(' ');
};

export const HowItWorks: React.FC<{ t: number }> = ({ t }) => (
  <Field color={C.cream}>
    <div style={{ position: 'absolute', top: 330, left: 70, right: 70 }}>
      <Rise t={t} at={0} text="Three steps from" id="hw1" stagger={0.6} style={thin(78, C.ink)} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginTop: 10 }}>
        <Rise t={t} at={6} text="CURIOUS" id="hw2" stagger={1} style={disp(92, C.ink, 85, 900, true)} />
        <Whip t={t} at={12} from={600} id="hwa">
          <span style={disp(92, C.green, 100, 900)}>→</span>
        </Whip>
        <Rise t={t} at={14} text="INVESTED." id="hw3" stagger={1} style={disp(92, C.ink, 85, 900, true)} />
      </div>
    </div>
    {ROWS.map((r, i) => {
      const y = 760 + i * 250;
      const at = b(1 + i * 0.75);
      const dur = b(1.6);
      const pos = (tt: number) => TX0 + (TX1 - TX0) * r.ease(Math.max(0, Math.min(1, (tt - at) / dur)));
      const arrived = t >= at + dur * 0.8;
      const ring = t - (at + dur * 0.8);
      return (
        <div key={r.k}>
          <span style={{ ...mono(26, C.ink, 0.5), position: 'absolute', left: 70, top: y - 46 }}>{r.n}</span>
          <span style={{ ...disp(56, C.ink, 90, 800), position: 'absolute', left: 70, top: y - 14 }}>{r.k}</span>
          {/* track + ticks */}
          <div style={{ position: 'absolute', left: TX0, top: y, width: (TX1 - TX0) * lerp(t, 4 + i * 3, 20 + i * 3, 0, 1), height: 2, backgroundColor: C.ink, opacity: 0.25 }} />
          {Array.from({ length: 14 }, (_, k) => (
            <div key={k} style={{ position: 'absolute', left: TX0 + k * 50, top: y - 7, width: 2, height: 16, backgroundColor: C.ink, opacity: lerp(t, 6 + k, 12 + k, 0, 0.2) }} />
          ))}
          <span style={{ ...mono(20, C.ink, 0.4), position: 'absolute', left: TX0 - 8, top: y + 18 }}>A</span>
          <span style={{ ...mono(20, C.ink, 0.4), position: 'absolute', left: TX1 - 8, top: y + 18 }}>B</span>
          {/* price line traced from A to B with this row's easing */}
          {t >= at - 1 && (
            <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0 }}>
              <path
                d={tracePath(i, pos(t), y)}
                fill="none"
                stroke={r.col}
                strokeWidth={5}
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            </svg>
          )}
          {t >= at - 1 && (
            <MBlur id={`hwb${i}`} vx={vel(pos, t)} style={{ position: 'absolute', left: pos(t) - 18, top: traceY(i, pos(t), y) - 18 }}>
              <div style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: r.col, boxShadow: `0 0 0 8px ${r.col}22` }} />
            </MBlur>
          )}
          {arrived && ring < 24 && (
            <div style={{ position: 'absolute', left: TX1 - 26 - ring * 3, top: traceY(i, TX1, y) - 26 - ring * 3, width: 52 + ring * 6, height: 52 + ring * 6, borderRadius: '50%', border: `3px solid ${r.col}`, opacity: 1 - ring / 24 }} />
          )}
          <span style={{ ...thin(36, C.ink), position: 'absolute', left: TX0, top: y + 66, opacity: arrived ? lerp(ring, 0, 10, 0, 0.9) : 0 }}>{r.sub}</span>
        </div>
      );
    })}
    <div style={{ position: 'absolute', top: 1500, left: 70, display: 'flex', gap: 28 }}>
      {['LEARN', 'OPEN', 'INVEST'].map((w, i) => {
        const s = sp(t, b(4.5 + i * 0.75), { damping: 12, stiffness: 240, mass: 0.5 });
        return (
          <span key={w} style={{ ...disp(64, C.ink, 100, 900), display: 'flex', alignItems: 'flex-end', transform: `translateY(${(1 - s) * 40}px)`, opacity: Math.min(1, s * 2) }}>
            {w}
            <Dot size={18} color={C.green} s={s} />
          </span>
        );
      })}
    </div>
  </Field>
);

// =============================================================================
// 05 LEARN — letters drop with gravity + squash; free learning (no videos).
// =============================================================================
const LEARN_C = Array.from({ length: 16 }, (_, i) => ({ h: 60 + i * 14 + seeded(i + 700) * 50, up: seeded(i + 720) > 0.25 }));
export const Learn: React.FC<{ t: number }> = ({ t }) => (
  <Field color={C.green}>
    <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0, opacity: 0.28 }}>
      {LEARN_C.map((c, i) => {
        const g = sp(t, i * 1.6, { damping: 13, stiffness: 180, mass: 0.6 });
        const x = 90 + i * 60;
        return <Candle key={i} x={x} y={1560 - (c.h * g) / 2} w={30} body={c.h * g * 0.7} wick={c.h * g} up={c.up} color={c.up ? C.white : C.ink} />;
      })}
    </svg>
    <div style={{ position: 'absolute', top: 560, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
      <Drop t={t} at={0} text="LEARN" id="ln" stagger={3} style={disp(220, C.white, 108, 900)} />
    </div>
    <div style={{ position: 'absolute', top: 800, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
      <Whip t={t} at={b(1.5)} from={-1200} id="lnf">
        <span style={{ ...disp(140, C.ink, 100, 900), display: 'flex', alignItems: 'flex-end' }}>
          FOR FREE
          <Dot size={38} color={C.white} s={sp(t, b(2))} />
        </span>
      </Whip>
    </div>
    <div style={{ position: 'absolute', top: 1060, left: 70, right: 70, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22 }}>
      {['PSX BOOTCAMP · BEGINNER GUIDES', 'DOWNLOADABLE EBOOK', 'FLOPEDIA · A–Z OF PSX TERMS'].map((x, i) => {
        const s = sp(t, b(2.25 + i * 0.5), { damping: 13, stiffness: 220, mass: 0.6 });
        return (
          <div key={x} style={{ padding: '18px 34px', borderRadius: 999, border: `3px solid ${C.white}`, transform: `scale(${0.6 + 0.4 * s})`, opacity: Math.min(1, s * 2) }}>
            <span style={mono(30, C.white)}>{x}</span>
          </div>
        );
      })}
    </div>
  </Field>
);

// =============================================================================
// 06 ANALYZE — Truchet tile field flipping in waves; ANALYZE. whips in.
// =============================================================================
const TILE = 120;
const COLS = 9;
const ROWS_T = 16;
const TILES = Array.from({ length: COLS * ROWS_T }, (_, i) => ({ up: seeded(i + 5) > 0.45, body: 30 + seeded(i + 77) * 40, wick: 70 + seeded(i + 99) * 30 }));

export const Analyze: React.FC<{ t: number }> = ({ t }) => (
  <Field color={C.ink}>
    <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0 }}>
      {TILES.map((tile, i) => {
        const cx = (i % COLS) * TILE + 60;
        const cy = Math.floor(i / COLS) * TILE + 60;
        const d = Math.hypot(cx - 540, cy - 960) / 900;
        let m = 0;
        for (let k = 0; k < 4; k++) m += sp(t, b(k) + d * 10, { damping: 13, stiffness: 160, mass: 0.6 });
        const flips = Math.round(m);
        const phase = m - Math.floor(m);
        const sy = Math.abs(Math.cos(Math.PI * phase));
        const up = flips % 2 === 0 ? tile.up : !tile.up;
        const appear = lerp(t, d * 8, d * 8 + 8, 0, 1);
        return (
          <g key={i} transform={`translate(${cx} ${cy}) scale(${appear} ${appear * sy}) translate(${-cx} ${-cy})`}>
            <rect x={cx - 56} y={cy - 56} width={112} height={112} rx={10} fill="none" stroke={C.white} strokeOpacity={0.06} strokeWidth={2} />
            <Candle x={cx} y={cy} w={30} body={tile.body} wick={tile.wick} up={up} color={up ? C.green : C.white} opacity={up ? 0.95 : 0.7} />
          </g>
        );
      })}
    </svg>
    <AbsoluteFill style={{ background: 'radial-gradient(560px 380px at 50% 50%, rgba(10,14,10,0.96) 55%, rgba(10,14,10,0) 100%)', opacity: lerp(t, b(0.8), b(1.3), 0, 1) }} />
    <div style={{ position: 'absolute', top: 830, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
      <Whip t={t} at={b(1)} from={1300} id="an">
        <span style={{ ...disp(176, C.white, 100, 900), display: 'flex', alignItems: 'flex-end' }}>
          ANALYZE
          <Dot size={44} color={C.green} s={sp(t, b(1.6))} />
        </span>
      </Whip>
    </div>
    <div style={{ position: 'absolute', top: 1010, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
      <Rise t={t} at={b(2)} text="PSX ANALYZER" id="an2" stagger={0.7} style={mono(32, C.green)} />
      <Rise t={t} at={b(2.4)} text="score any listed company" id="an3" stagger={0.5} style={thin(54, C.white)} />
    </div>
  </Field>
);

