// v5 showreel, second half (PSX only — no commodities).
import React from 'react';
import { AbsoluteFill, Img, interpolate } from 'remotion';
import { FS_EASE, LOGO } from '../flostocks';
import { lerp, seeded, sp } from '../flostocks-v2/fx';
import { BEATF, b } from './timing';
import { C, Candle, Drop, Field, MBlur, Rise, Whip, disp, mono, thin, vel } from './mkit';

const Dot: React.FC<{ size: number; color: string; s?: number }> = ({ size, color, s = 1 }) => (
  <span style={{ display: 'inline-block', width: size, height: size, borderRadius: '50%', backgroundColor: color, marginLeft: size * 0.18, transform: `scale(${s})` }} />
);

// =============================================================================
// 07 MARKETS — an LED dot-matrix candlestick board (exchange-display look): candles
// print column by column, a glowing price line traces the closes, then the board
// scrolls as new candles print. Illustrative series, not market data.
// =============================================================================
const PITCH = 22;
const GC = 44;
const GR = 34;
const GX0 = (1080 - (GC - 1) * PITCH) / 2;
const GY0 = 400;
type Bar = { o: number; c: number; h: number; l: number; up: boolean };
const SERIES: Bar[] = (() => {
  const out: Bar[] = [];
  let lvl = 6;
  for (let k = 0; k < 18; k++) {
    const up = seeded(k + 31) > 0.3;
    const body = 2 + Math.floor(seeded(k + 61) * 4);
    const o = Math.round(lvl + (seeded(k + 91) - 0.5) * 2);
    const c = up ? o + body : o - Math.max(1, body - 2);
    const h = Math.max(o, c) + 1 + Math.floor(seeded(k + 121) * 2);
    const l = Math.min(o, c) - 1 - Math.floor(seeded(k + 151) * 2);
    out.push({ o, c, h, l, up });
    lvl = c + (up ? 0.6 : 1.2);
  }
  return out;
})();
const rowY = (r: number) => GY0 + (GR - 1 - r) * PITCH;

export const Markets: React.FC<{ t: number }> = ({ t }) => {
  const swap = t >= b(4);
  const shift = Math.min(24, Math.max(0, Math.floor((t - b(4)) / 2.2))); // columns scrolled
  const dots: React.ReactNode[] = [];
  for (let col = 0; col < GC; col++) {
    const vc = col + shift; // virtual column
    const k = Math.floor(vc / 4);
    const sub = vc % 4;
    const bar = SERIES[k];
    const shownAt = k * 3; // candle k prints at frame k*3 (scrolled-in ones appear as they enter)
    for (let r = 0; r < GR; r++) {
      let on = false;
      let col1: string = C.ink;
      if (bar && sub < 3) {
        const lo = Math.min(bar.o, bar.c);
        const hi = Math.max(bar.o, bar.c);
        const build = Math.max(0, Math.min(1, (t - shownAt) / 5));
        const topLit = bar.l + (bar.h - bar.l) * build;
        const inBody = r >= lo && r <= hi;
        const inWick = sub === 1 && r >= bar.l && r <= bar.h;
        on = (inBody || inWick) && r <= topLit && (t >= shownAt || shift > 0);
        col1 = bar.up ? C.green : C.ink;
      }
      dots.push(
        <circle key={`${col}-${r}`} cx={GX0 + col * PITCH} cy={rowY(r)} r={on ? 8 : 4} fill={on ? col1 : C.ink} opacity={on ? 1 : 0.08} />,
      );
    }
  }
  // price line through visible closes
  const closes: string[] = [];
  for (let k = 0; k < SERIES.length; k++) {
    const col = k * 4 + 1 - shift;
    if (col < 0 || col >= GC) continue;
    closes.push(`${closes.length ? 'L' : 'M'} ${GX0 + col * PITCH} ${rowY(SERIES[k].c)}`);
  }
  const lineOn = lerp(t, 34, 52, 0, 1, FS_EASE.inOut);
  const lastK = Math.min(SERIES.length - 1, Math.floor((GC - 1 + shift) / 4));
  const lastY = rowY(SERIES[lastK].c);
  return (
    <Field color={C.white}>
      <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0 }}>
        {dots}
        <path d={closes.join(' ')} fill="none" stroke={C.deep} strokeWidth={5} strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - lineOn} style={{ filter: 'drop-shadow(0 0 8px rgba(56,209,0,0.6))' }} />
        {lineOn > 0.95 && (
          <g>
            <line x1={GX0 - 10} y1={lastY} x2={GX0 + (GC - 1) * PITCH + 10} y2={lastY} stroke={C.green} strokeWidth={2} strokeDasharray="6 8" />
            <circle cx={GX0 + (GC - 1) * PITCH} cy={lastY} r={14} fill={C.green} opacity={0.35} />
            <rect x={GX0 + (GC - 1) * PITCH - 128} y={lastY - 52} width={120} height={40} rx={8} fill={C.ink} />
            <text x={GX0 + (GC - 1) * PITCH - 68} y={lastY - 24} textAnchor="middle" fontFamily="IBM Plex Mono" fontWeight={600} fontSize={22} fill={C.green}>
              PSX ▲
            </text>
          </g>
        )}
      </svg>
      <div style={{ position: 'absolute', top: 262, left: 70, right: 70, display: 'flex', justifyContent: 'space-between' }}>
        <span style={mono(24, C.ink, 0.7)}>{swap ? 'PSX · SECTOR BOARD' : 'PSX · KSE-100 · LIVE BOARD'}</span>
        <span style={mono(24, C.ink, 0.7)}>● MARKET OPEN</span>
      </div>
      {!swap ? (
        <div style={{ position: 'absolute', top: 1220, left: 70 }}>
          <Rise t={t} at={b(0.5)} text="STOCKS" id="mk1" stagger={1.4} style={disp(200, C.ink, 100, 900)} />
          <div style={{ marginTop: 18 }}>
            <Rise t={t} at={b(1.5)} text="on the Pakistan Stock Exchange" id="mk2" stagger={0.35} style={thin(46, C.ink)} />
          </div>
        </div>
      ) : (
        <div style={{ position: 'absolute', top: 1200, left: 70, right: 70 }}>
          <Rise t={t} at={b(4)} text="EVERY SECTOR." id="mk3" stagger={1} style={disp(124, C.green, 74, 900)} />
          <div style={{ display: 'flex', gap: 14, marginTop: 30, flexWrap: 'wrap' }}>
            {['BANKS', 'CEMENT', 'OIL & GAS', 'TECH', 'FERTILIZER', 'POWER'].map((x, i) => {
              const s2 = sp(t, b(4.75 + i * 0.375), { damping: 13, stiffness: 240, mass: 0.5 });
              return (
                <span key={x} style={{ ...mono(30, i % 2 ? C.ink : C.white), backgroundColor: i % 2 ? C.green : C.ink, padding: '12px 22px', borderRadius: 999, transform: `translateY(${(1 - s2) * 50}px)`, opacity: Math.min(1, s2 * 2) }}>
                  ▲ {x}
                </span>
              );
            })}
          </div>
          <div style={{ marginTop: 22 }}>
            <Rise t={t} at={b(6.5)} text="the whole Pakistan Stock Exchange" id="mk4" stagger={0.3} style={thin(40, C.ink)} />
          </div>
        </div>
      )}
    </Field>
  );
};

// =============================================================================
// 08 ONE ACCOUNT — the form morphs on every beat between PSX glyphs: rising bars
// (shares) → candlestick (IPOs) → sector pie → index arrow, flipping white/ink;
// mini candles and arrows ride the guide rings; crosshair.
// =============================================================================
const NP = 96;
const resample = (verts: [number, number][]) => {
  const segs: number[] = [];
  let total = 0;
  for (let i = 0; i < verts.length; i++) {
    const a = verts[i];
    const c = verts[(i + 1) % verts.length];
    const d = Math.hypot(c[0] - a[0], c[1] - a[1]);
    segs.push(d);
    total += d;
  }
  const out: [number, number][] = [];
  for (let k = 0; k < NP; k++) {
    let dist = (k / NP) * total;
    let i = 0;
    while (dist > segs[i]) {
      dist -= segs[i];
      i++;
    }
    const a = verts[i];
    const c = verts[(i + 1) % verts.length];
    const u = segs[i] ? dist / segs[i] : 0;
    out.push([a[0] + (c[0] - a[0]) * u, a[1] + (c[1] - a[1]) * u]);
  }
  return out;
};
const arc = (cx: number, cy: number, r: number, a0: number, a1: number, n: number) =>
  Array.from({ length: n }, (_, i) => {
    const a = a0 + ((a1 - a0) * i) / (n - 1);
    return [cx + Math.cos(a) * r, cy + Math.sin(a) * r] as [number, number];
  });
// every outline starts at its top-centre and runs clockwise so morphs don't twist
const SHAPES = [
  resample([[0.3, -0.85], [0.85, -0.85], [0.85, 0.85], [-0.9, 0.85], [-0.9, 0.2], [-0.42, 0.2], [-0.42, 0.85], [-0.3, 0.85], [-0.3, -0.25], [0.18, -0.25], [0.18, 0.85], [0.3, 0.85]]),
  resample([[0, -0.95], [0.08, -0.95], [0.08, -0.55], [0.4, -0.55], [0.4, 0.5], [0.08, 0.5], [0.08, 0.95], [-0.08, 0.95], [-0.08, 0.5], [-0.4, 0.5], [-0.4, -0.55], [-0.08, -0.55], [-0.08, -0.95]]),
  resample([...arc(0, 0, 0.85, -Math.PI / 2, Math.PI, 56), [0, 0]]),
  resample([[0, -0.95], [0.75, -0.1], [0.3, -0.1], [0.3, 0.9], [-0.3, 0.9], [-0.3, -0.1], [-0.75, -0.1]]),
];
const TINTS = ['#FFFFFF', '#0A0E0A', '#FFFFFF', '#0A0E0A'];
const LABELS = ['SHARES', 'IPOs', 'SECTORS', 'KSE-100'];
const hexMix = (a: string, c: string, k: number) => {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
  const pc = [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
  return `rgb(${pa.map((v, i) => Math.round(v + (pc[i] - v) * k)).join(',')})`;
};

export const OneAccount: React.FC<{ t: number }> = ({ t }) => {
  let pts = SHAPES[0].map((p) => [p[0], p[1]]);
  let fill = TINTS[0];
  for (let k = 1; k < 4; k++) {
    const m = sp(t, b(k), { damping: 12, stiffness: 190, mass: 0.6 });
    pts = pts.map((p, i) => [p[0] + (SHAPES[k][i][0] - SHAPES[k - 1][i][0]) * m, p[1] + (SHAPES[k][i][1] - SHAPES[k - 1][i][1]) * m]);
    if (m > 0) fill = hexMix(TINTS[k - 1].startsWith('#') ? TINTS[k - 1] : '#FFFFFF', TINTS[k], Math.min(1, m));
  }
  const R = 250 * sp(t, 0, { damping: 13, stiffness: 160, mass: 0.7 });
  const d = pts.map((p, i) => `${i ? 'L' : 'M'} ${540 + p[0] * R} ${800 + p[1] * R}`).join(' ') + ' Z';
  const cur = Math.min(3, Math.max(0, Math.floor(t / b(1))));
  return (
    <Field color={C.green}>
      <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0 }}>
        <line x1={0} y1={800} x2={1080} y2={800} stroke={C.white} strokeOpacity={0.25} strokeWidth={2} />
        <line x1={540} y1={300} x2={540} y2={1300} stroke={C.white} strokeOpacity={0.25} strokeWidth={2} />
        {[330, 420].map((r) => (
          <circle key={r} cx={540} cy={800} r={r} fill="none" stroke={C.white} strokeOpacity={0.22} strokeWidth={2} strokeDasharray="4 10" />
        ))}
        <path d={d} fill={fill} fillRule="evenodd" />
        {Array.from({ length: 14 }, (_, i) => {
          const a = (i / 14) * Math.PI * 2 + t * 0.03;
          const rr = 380;
          const x = 540 + Math.cos(a) * rr;
          const y = 800 + Math.sin(a) * rr;
          return i % 2 === 0 ? (
            <Candle key={i} x={x} y={y} w={12} body={22 + (i % 3) * 8} wick={44} up={i % 4 !== 2} color={i % 4 !== 2 ? C.white : C.ink} />
          ) : (
            <path key={i} d={`M ${x} ${y - 14} L ${x + 13} ${y + 9} L ${x - 13} ${y + 9} Z`} fill={i % 3 ? C.white : C.ink} />
          );
        })}
      </svg>
      <span style={{ ...mono(24, C.white, 0.9), position: 'absolute', left: 70, top: 262 }}>
        0{cur + 1}/04 · {LABELS[cur]}
      </span>
      <div style={{ position: 'absolute', top: 1260, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
        <Rise t={t} at={b(0.5)} text="One account." id="oa1" stagger={0.6} style={thin(74, C.white)} />
        <Whip t={t} at={b(1)} from={-1300} id="oa2">
          <span style={{ ...disp(132, C.ink, 74, 900), display: 'flex', alignItems: 'flex-end' }}>
            THE WHOLE PSX
            <Dot size={36} color={C.white} s={sp(t, b(1.6))} />
          </span>
        </Whip>
      </div>
    </Field>
  );
};

// =============================================================================
// 09 TOOLS — a slot machine of calculator names, one per beat, vertical blur.
// =============================================================================
const SLOTS = ['COMMISSION', 'SIP PLANS', 'CGT', 'DIVIDENDS'];
export const Tools: React.FC<{ t: number }> = ({ t }) => {
  const H = 230;
  const pos = (tt: number) => {
    let y = 0;
    for (let k = 1; k < SLOTS.length; k++) y -= H * sp(tt, b(k), { damping: 14, stiffness: 260, mass: 0.5 });
    return y + (1 - sp(tt, 0, { damping: 14, stiffness: 260, mass: 0.5 })) * H;
  };
  return (
    <Field color={C.cream}>
      <div style={{ position: 'absolute', top: 560, left: 70 }}>
        <Rise t={t} at={0} text="Free calculators for" id="tl1" stagger={0.5} style={thin(70, C.ink)} />
      </div>
      <div style={{ position: 'absolute', top: 680, left: 70, right: 70, height: H, overflow: 'hidden' }}>
        <MBlur id="tlb" vy={vel(pos, t)} style={{ transform: `translateY(${pos(t)}px)` }}>
          {SLOTS.map((w) => (
            <div key={w} style={{ height: H, display: 'flex', alignItems: 'center' }}>
              <span style={{ ...disp(Math.min(210, 1450 / w.length), C.ink, w.length > 6 ? 74 : 112, 900), display: 'flex', alignItems: 'flex-end' }}>
                {w}
                <Dot size={34} color={C.green} />
              </span>
            </div>
          ))}
        </MBlur>
      </div>
      <div style={{ position: 'absolute', top: 960, left: 70, right: 70 }}>
        <div style={{ height: 10, backgroundColor: 'rgba(10,14,10,0.08)', borderRadius: 5 }}>
          <div style={{ height: 10, width: `${lerp(t, 0, b(4), 0, 100, (n) => n)}%`, backgroundColor: C.green, borderRadius: 5 }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 18 }}>
          {SLOTS.map((w, i) => (
            <span key={w} style={mono(22, C.ink, t >= b(i) ? 0.9 : 0.3)}>
              0{i + 1} {w}
            </span>
          ))}
        </div>
      </div>
      <div style={{ position: 'absolute', top: 1150, left: 70, right: 70 }}>
        <Rise t={t} at={b(2)} text="PLAN EVERY RUPEE" id="tl2" stagger={0.8} style={disp(92, C.ink, 80, 900, true)} />
        <Rise t={t} at={b(2.6)} text="BEFORE YOU TRADE." id="tl3" stagger={0.8} style={disp(92, C.green, 80, 900, true)} />
      </div>
    </Field>
  );
};

// =============================================================================
// 10 REGULATED — big word + green dot, a plotted arrow and the licence facts.
// =============================================================================
const CHART = [
  [140, 1460], [200, 1420], [250, 1440], [310, 1370], [370, 1395], [430, 1320], [490, 1340], [550, 1260], [610, 1290], [670, 1200], [730, 1220], [790, 1130], [850, 1150], [920, 1060],
] as const;
export const Regulated: React.FC<{ t: number }> = ({ t }) => {
  const prog = lerp(t, b(0.5), b(2.2), 0, 1, FS_EASE.inOut);
  const n = CHART.length - 1;
  const upto = prog * n;
  const k = Math.min(n, Math.floor(upto));
  const u = upto - k;
  const tip: [number, number] = k >= n ? [CHART[n][0], CHART[n][1]] : [CHART[k][0] + (CHART[k + 1][0] - CHART[k][0]) * u, CHART[k][1] + (CHART[k + 1][1] - CHART[k][1]) * u];
  const pts: [number, number][] = [...CHART.slice(0, k + 1).map((p) => [p[0], p[1]] as [number, number]), tip];
  const line = pts.map((p, i) => `${i ? 'L' : 'M'} ${p[0]} ${p[1]}`).join(' ');
  const prev = CHART[Math.max(0, Math.min(k, n - 1))];
  const ang = (Math.atan2(tip[1] - prev[1], tip[0] - prev[0]) * 180) / Math.PI;
  return (
    <Field color={C.ink}>
      <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0 }}>
        <line x1={110} y1={1490} x2={110} y2={1490 - 520 * lerp(t, 0, 12, 0, 1)} stroke={C.white} strokeOpacity={0.3} strokeWidth={2} />
        <line x1={110} y1={1490} x2={110 + 860 * lerp(t, 0, 12, 0, 1)} y2={1490} stroke={C.white} strokeOpacity={0.3} strokeWidth={2} />
        {[1390, 1290, 1190, 1090].map((y) => (
          <line key={y} x1={110} y1={y} x2={970} y2={y} stroke={C.white} strokeOpacity={0.08} strokeWidth={2} strokeDasharray="4 10" />
        ))}
        <path d={`${line} L ${tip[0]} 1490 L 140 1490 Z`} fill={C.green} opacity={0.12} />
        <path d={line} fill="none" stroke={C.white} strokeWidth={5} strokeLinejoin="round" />
        {CHART.slice(0, k + 1).map((p, i) => (
          <circle key={i} cx={p[0]} cy={p[1]} r={6} fill={C.green} />
        ))}
        {prog > 0.02 && <path d="M 0 -16 L 32 0 L 0 16 Z" fill={C.green} transform={`translate(${tip[0]} ${tip[1]}) rotate(${ang})`} />}
      </svg>
      <div style={{ position: 'absolute', top: 640, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
        <Whip t={t} at={0} from={-1400} id="rg">
          <span style={{ ...disp(150, C.white, 92, 900), display: 'flex', alignItems: 'flex-end' }}>
            REGULATED
            <Dot size={40} color={C.green} s={sp(t, b(0.6))} />
          </span>
        </Whip>
      </div>
      <div style={{ position: 'absolute', top: 860, left: 120, display: 'flex', flexDirection: 'column', gap: 18 }}>
        {['SECP LICENSED & REGULATED', 'PSX TREC HOLDER 535', 'LICENSED RESEARCH ENTITY'].map((x, i) => (
          <div key={x} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span style={{ width: 14, height: 14, borderRadius: 7, backgroundColor: C.green, transform: `scale(${sp(t, b(1.5 + i * 0.5))})` }} />
            <Rise t={t} at={b(1.5 + i * 0.5)} text={x} id={`rgl${i}`} stagger={0.35} style={mono(34, C.white)} />
          </div>
        ))}
      </div>
    </Field>
  );
};

// =============================================================================
// 11 HYPE — the drop's peak: one feature per beat as a smash cut (colour field flips,
// inverse flash frame, width-axis squeeze, a giant ▲ ripping up behind), then a
// 16th-note stutter on "PSX" and one beat of dead air before the final hit.
// =============================================================================
const HYPE = [
  { w: 'RESEARCH', bg: C.green, fg: C.ink, sub: 'EQUITY NOTES · IPO ANALYSIS' },
  { w: 'MTS', bg: C.ink, fg: C.green, sub: 'MARGIN TRADING SYSTEM' },
  { w: 'SIP', bg: C.white, fg: C.ink, sub: 'SYSTEMATIC INVESTMENT PLANS' },
  { w: 'V TRADE', bg: C.green, fg: C.white, sub: 'ONLINE TRADING' },
  { w: 'ANALYZER', bg: C.ink, fg: C.white, sub: 'SCORE ANY LISTED COMPANY' },
  { w: 'RMs', bg: C.white, fg: C.green, sub: 'YOUR OWN RELATIONSHIP MANAGER' },
];
const STUT = [C.ink, C.green, C.white, C.green];

export const Hype: React.FC<{ t: number }> = ({ t }) => {
  const idx = Math.floor(t / BEATF);
  if (idx >= 7) {
    // the hard stop: one silent beat
    const k = t - b(7);
    return (
      <Field color={C.ink}>
        <div style={{ position: 'absolute', top: 900, left: 0, right: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 14 }}>
          <span style={{ ...thin(72, C.white), opacity: Math.min(1, k / 2) }}>are you in?</span>
          <span style={{ width: 6, height: 78, backgroundColor: C.green }} />
        </div>
      </Field>
    );
  }
  if (idx === 6) {
    const q = Math.min(3, Math.floor((t - b(6)) / (BEATF / 4)));
    const bg = STUT[q];
    const fg = bg === C.ink ? C.green : bg === C.green ? C.ink : C.green;
    return (
      <Field color={bg}>
        <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p style={{ ...disp(400 + q * 20, fg, 62 + q * 12, 900), transform: `translateX(${(q % 2 ? -1 : 1) * 14}px) skewX(${q % 2 ? -6 : 6}deg)` }}>PSX</p>
        </div>
        <div style={{ position: 'absolute', top: 1280, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
          <span style={{ ...disp(120, fg, 100, 900) }}>{'▲'.repeat(q + 1)}</span>
        </div>
      </Field>
    );
  }
  const h = HYPE[Math.max(0, Math.min(HYPE.length - 1, idx))];
  const u = t - b(idx);
  const inv = u < 2; // inverse flash frame(s) on the cut
  const bg = inv ? h.fg : h.bg;
  const fg = inv ? h.bg : h.fg;
  const s = sp(u, 0, { damping: 14, stiffness: 420, mass: 0.45 });
  const size = Math.min(320, 1500 / Math.max(3, h.w.length));
  const wdth = interpolate(s, [0, 1], [h.w.length > 5 ? 100 : 125, h.w.length > 5 ? 70 : 100]);
  return (
    <Field color={bg}>
      {/* speed lines */}
      <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0 }}>
        {Array.from({ length: 14 }, (_, i) => {
          const x = (seeded(i + idx * 31) * 1080) | 0;
          const y = ((seeded(i + idx * 17 + 5) * 2400 - u * 140) % 2400) - 240;
          return <rect key={i} x={x} y={y} width={4} height={180 + seeded(i + 40) * 260} fill={fg} opacity={0.18} />;
        })}
      </svg>
      <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 34 }}>
        <p style={{ ...disp(size, fg, wdth, 900), textTransform: 'none', transform: `scale(${interpolate(s, [0, 1], [1.45, 1])})` }}>{h.w}</p>
        <span style={{ ...mono(30, fg, 0.9), transform: `translateY(${(1 - s) * 60}px)` }}>{h.sub}</span>
      </div>
      <span style={{ ...mono(26, fg, 0.8), position: 'absolute', left: 70, top: 300 }}>0{idx + 1}/06</span>
      <span style={{ ...disp(64, fg, 100, 900), position: 'absolute', right: 70, top: 280 }}>▲</span>
    </Field>
  );
};

// =============================================================================
// 12 CTA — the final hit: the mark slams down, the call to action stacks in on the
// beats (PSX huge, letters dropping), then on the closing chord: url pill, licence
// row and the market-risk disclaimer. White, like flostocks.com.
// =============================================================================
const CTA_C = Array.from({ length: 18 }, (_, i) => ({ h: 70 + i * 16 + seeded(i + 900) * 60, up: seeded(i + 930) > 0.22 }));
export const DISCLAIMER = 'Investments in securities are subject to market risks. Please read all relevant documents carefully before investing.';

export const Cta: React.FC<{ t: number }> = ({ t }) => {
  const IMP = 6;
  const fall = (tt: number) => (tt < 0 ? -900 : interpolate(lerp(tt, 0, IMP, 0, 1, FS_EASE.in), [0, 1], [-900, 0]));
  const hit = t - IMP;
  const squash = hit >= 0 ? 1 - Math.exp(-hit * 0.32) * Math.cos(hit * 0.85) * 0.26 : 1.1;
  const shake = hit >= 0 ? Math.exp(-hit * 0.25) * 18 : 0;
  const swell = lerp(t, b(4), b(8), 0, 1, FS_EASE.out);
  return (
    <Field color={C.white}>
      <AbsoluteFill style={{ transform: `translate(${shake * Math.sin(t * 2.9)}px, ${shake * Math.cos(t * 3.1)}px)` }}>
        <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0 }}>
          {CTA_C.map((c, i) => {
            const g = sp(t, b(4) + i * 1.4, { damping: 14, stiffness: 150, mass: 0.7 }) * (0.55 + 0.45 * swell);
            const x = 70 + i * 55;
            return <Candle key={i} x={x} y={1880 - (c.h * g) / 2} w={26} body={c.h * g * 0.7} wick={c.h * g} up={c.up} color={c.up ? C.green : C.ink} opacity={0.22} />;
          })}
          {hit >= 0 &&
            [0, 5].map((d, k) => {
              const h = hit - d;
              if (h < 0 || h > 24) return null;
              const r = 120 + (1 - Math.pow(1 - h / 24, 3)) * (70 + k * 40);
              return <circle key={k} cx={540} cy={430} r={r} fill="none" stroke={k ? C.ink : C.green} strokeWidth={Math.max(1, 12 - h * 0.45)} opacity={1 - h / 24} />;
            })}
        </svg>
        <MBlur id="ctam" vy={vel(fall, t)} style={{ position: 'absolute', left: 540 - 110, top: 430 - 110 }}>
          <Img src={LOGO.iconOnLight} style={{ width: 220, height: 220, transform: `translateY(${fall(t)}px) scaleY(${squash}) scaleX(${2 - squash})`, transformOrigin: '50% 100%' }} />
        </MBlur>
        <div style={{ position: 'absolute', top: 640, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <Rise t={t} at={b(0.5)} text="OPEN YOUR" id="ct1" stagger={0.9} style={disp(132, C.ink, 92, 900)} />
          <Drop t={t} at={b(1)} text="PSX" id="ct2" stagger={2.4} style={disp(340, C.green, 112, 900)} />
          <Rise t={t} at={b(1.75)} text="ACCOUNT" id="ct3" stagger={0.9} style={disp(132, C.ink, 92, 900)} />
        </div>
        <div
          style={{
            position: 'absolute',
            left: 170,
            right: 170,
            top: 1250,
            height: 120,
            borderRadius: 60,
            backgroundColor: C.ink,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 18,
            transform: `scale(${sp(t, b(3), { damping: 12, stiffness: 220, mass: 0.6 })})`,
            boxShadow: '0 24px 60px rgba(10,14,10,0.25)',
          }}
        >
          <span style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 50, color: C.white }}>flostocks.com</span>
          <span style={{ fontFamily: 'Inter', fontWeight: 700, fontSize: 50, color: C.green }}>→</span>
        </div>
        <div style={{ position: 'absolute', top: 1420, left: 90, right: 90 }}>
          <div style={{ height: 2, backgroundColor: C.ink, opacity: 0.5, width: `${lerp(t, b(4), b(5), 0, 100, FS_EASE.out)}%` }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 14, opacity: lerp(t, b(4.5), b(5.2), 0, 1) }}>
            <span style={mono(20, C.ink, 0.75)}>FLOSTOCKS · FLORET CAPITALS</span>
            <span style={mono(20, C.ink, 0.75)}>SECP LICENSED · TREC 535</span>
          </div>
        </div>
        <p
          style={{
            position: 'absolute',
            top: 1500,
            left: 110,
            right: 110,
            margin: 0,
            textAlign: 'center',
            fontFamily: 'Inter',
            fontWeight: 400,
            fontSize: 27,
            lineHeight: 1.4,
            color: C.ink,
            opacity: 0.72 * lerp(t, b(5), b(6), 0, 1),
          }}
        >
          {DISCLAIMER}
        </p>
      </AbsoluteFill>
    </Field>
  );
};
