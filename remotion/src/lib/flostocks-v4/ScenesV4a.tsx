// v4 showreel, first half (scene-local frame t; beats via b(n), 121 BPM).
import React from 'react';
import { AbsoluteFill, Img, interpolate } from 'remotion';
import { evolvePath } from '@remotion/paths';
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
  const squeeze = lerp(t, b(7), b(7.6), 0, 1, FS_EASE.in);
  const groove = lerp(t, b(4), b(4.6), 0, 1);
  return (
    <Field color={C.green}>
      <AbsoluteFill style={{ opacity: groove * 0.28 }}>
        <Marquee t={t} word={TAPE} color={C.white} solidRow={-1} size={110} speed={12} rows={19} top={-20} />
      </AbsoluteFill>
      <div style={{ position: 'absolute', left: NEWS_X, top: NEWS_Y }}>
        <NewsBlock
          color={C.white}
          render={(line, i) => {
            const at = b(i);
            const s = sp(t, at, { damping: 9, stiffness: 260, mass: 0.5 });
            const hit = t >= at;
            const wave = groove * Math.sin((t - b(4)) * 0.22 - i * 0.9);
            const wdth = hit ? interpolate(s, [0, 1], [62, 100]) + wave * 22 - squeeze * 40 : 100;
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
      <AbsoluteFill style={{ backgroundColor: C.white, opacity: lerp(t, 0, 5, 0.55, 0) }} />
    </Field>
  );
};

// =============================================================================
// 02 IDENTITY — the mark spins in with a motion trail, ring draws, circular text
// orbits, a radial burst on beat 1, then a white disk blooms into the next scene.
// =============================================================================
const RING = 'M 540 640 m -300 0 a 300 300 0 1 0 600 0 a 300 300 0 1 0 -600 0';
const ORBIT = 'FLOSTOCKS · THE OFFICIAL PSX DIVISION · FLORET CAPITALS · ';

export const Identity: React.FC<{ t: number }> = ({ t }) => {
  const s = sp(t, 0, { damping: 14, stiffness: 120, mass: 0.9 });
  const ang = (tt: number) => interpolate(sp(tt, 0, { damping: 14, stiffness: 120, mass: 0.9 }), [0, 1], [-540, 0]);
  const ring = lerp(t, 3, b(1.5), 0, 1, FS_EASE.inOut);
  const { strokeDasharray, strokeDashoffset } = evolvePath(ring, RING);
  const burst = t - b(1);
  return (
    <Field color={C.ink}>
      <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0 }}>
        <path d={RING} fill="none" stroke={C.white} strokeOpacity={0.35} strokeWidth={2} strokeDasharray={strokeDasharray} strokeDashoffset={strokeDashoffset} />
        <defs>
          <path id="orb" d="M 540 640 m -370 0 a 370 370 0 1 1 740 0 a 370 370 0 1 1 -740 0" />
        </defs>
        <g transform={`rotate(${t * 0.9} 540 640)`} opacity={lerp(t, 6, 20, 0, 0.75)}>
          <text fontFamily="IBM Plex Mono" fontWeight={600} fontSize={26} letterSpacing={6} fill={C.white}>
            <textPath href="#orb">{ORBIT + ORBIT}</textPath>
          </text>
        </g>
        {burst >= 0 && burst < 22 &&
          Array.from({ length: 16 }, (_, i) => {
            const a = (i / 16) * Math.PI * 2;
            const r0 = interpolate(burst, [0, 22], [180, 520]);
            const r1 = r0 + interpolate(burst, [0, 8, 22], [10, 120, 10]);
            const rm = (r0 + r1) / 2;
            return (
              <g key={i} transform={`rotate(${(a * 180) / Math.PI + 90} ${540 + Math.cos(a) * rm} ${640 + Math.sin(a) * rm})`} opacity={interpolate(burst, [0, 22], [1, 0])}>
                <Candle x={540 + Math.cos(a) * rm} y={640 + Math.sin(a) * rm} w={16} body={(r1 - r0) * 0.55} wick={r1 - r0} up={i % 2 === 0} color={i % 2 ? C.white : C.green} />
              </g>
            );
          })}
      </svg>
      {/* motion trail: ghost copies at earlier angles */}
      {[4, 3, 2, 1, 0].map((k) => {
        const tt = t - k * 1.2;
        return (
          <Img
            key={k}
            src={LOGO.iconOnDark}
            style={{
              position: 'absolute',
              left: 540 - 170,
              top: 640 - 170,
              width: 340,
              height: 340,
              transform: `rotate(${ang(tt)}deg) scale(${Math.max(0, interpolate(sp(tt, 0, { damping: 14, stiffness: 120, mass: 0.9 }), [0, 1], [0.1, 1]))})`,
              opacity: k === 0 ? Math.min(1, s * 2) : 0.18 * (1 - k / 5) * (1 - s * 0.7),
            }}
          />
        );
      })}
      <div style={{ position: 'absolute', top: 1160, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 22 }}>
        <Rise t={t} at={b(1.5)} text="THE OFFICIAL" id="idA" style={mono(34, C.green)} stagger={0.8} />
        <Rise t={t} at={b(2)} text="PSX DIVISION" id="idB" style={disp(110, C.white, 100, 900)} stagger={1.2} />
      </div>
      <Disk t={t} at={b(3.3)} dur={10} color={C.white} cy={640} />
    </Field>
  );
};

// =============================================================================
// 03 WORDMARK — FLOSTOCKS rises from a baseline, then the width axis waves
// through the letters (variable-font squash & stretch), editorial rules + labels.
// =============================================================================
export const Wordmark: React.FC<{ t: number }> = ({ t }) => {
  const rule = lerp(t, 0, b(1), 0, 1, FS_EASE.out);
  const waveOn = lerp(t, b(1.5), b(2.2), 0, 1);
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
          wdthFn={(i) => 96 + waveOn * 22 * Math.sin((t - b(1.5)) * 0.2 - i * 0.7)}
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
          <svg width={40} height={36} viewBox="0 0 40 36" style={{ position: 'absolute', left: 250, top: y - 18 }}>
            <path d={r.curve} fill="none" stroke={C.ink} strokeWidth={2.5} />
          </svg>
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
          <span style={{ ...thin(36, C.ink), position: 'absolute', left: TX0, top: y + 40, opacity: arrived ? lerp(ring, 0, 10, 0, 0.9) : 0 }}>{r.sub}</span>
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

