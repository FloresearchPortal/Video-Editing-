// v8 showreel, drop A — one bar per idea, every move on a beat or an 8th (124 BPM).
// Premium Apple-style UI × dynamic fintech motion — see videos/flostocks-whatis/BRIEF.md.
import React from 'react';
import { Img, interpolate } from 'remotion';
import { LOGO } from '../flostocks';
import { A, Canvas, Card, Check, Chip, LineChart, Pill, Reveal, ap, enter, mixN, sf, walk } from './kit';
import { MARK, MARK_X, MARK_Y } from './ChatV8';
import { b } from './timing';

const FAST = 8; // entrance length in frames (~half a beat)

// ---- lockup geometry (logo image is 1200 x 400; icon glyph at x 21–235, y 53–275) -----------
const LW = 860;
const LS = LW / 1200;
const LOCK_X = 540 - ((21 + 1181) / 2) * LS;
const LOCK_Y = MARK_Y - ((53 + 356) / 2) * LS;
const ICON_CX = LOCK_X + 128 * LS;
const ICON_CY = LOCK_Y + 164 * LS;
const ICON_M = (222 * LS) / 0.814;
const LIFT_Y = 300 - MARK_Y; // lockup centre 860 -> 300 for the next bar
const LIFT_S = 0.66;

const Lockup: React.FC<{ wipe: number; lift: number }> = ({ wipe, lift }) => (
  <div style={{ position: 'absolute', inset: 0, transform: `translateY(${LIFT_Y * lift}px) scale(${mixN(1, LIFT_S, lift)})`, transformOrigin: `540px ${MARK_Y}px` }}>
    <Img
      src={LOGO.fullOnLight}
      style={{ position: 'absolute', left: LOCK_X, top: LOCK_Y, width: LW, height: LW / 3, clipPath: `inset(0 ${(1 - wipe) * (1 - 243 / 1200) * 100}% 0 0)` }}
    />
  </div>
);

// =============================================================================
// 01 BRAND (bar 0) — the mark lands on the drop, snaps into the lockup on beat 1, the
// wordmark wipes on the "and" of 1.
// =============================================================================
export const Brand: React.FC<{ t: number }> = ({ t }) => {
  const move = ap(t, b(1), FAST);
  const wipe = ap(t, b(1.5), FAST + 2);
  const pop = ap(t, 0, 5); // the mark pops in on the drop frame itself
  const ms = mixN(MARK, ICON_M, move) * mixN(0.8, 1, pop); // visible at full opacity on the drop frame, settles in 5 frames
  const halo = Math.min(1, t / 18);
  return (
    <Canvas>
      {t < 18 && (
        <div
          style={{
            position: 'absolute',
            left: MARK_X - 140 - halo * 260,
            top: MARK_Y - 140 - halo * 260,
            width: 280 + halo * 520,
            height: 280 + halo * 520,
            borderRadius: '50%',
            border: `3px solid ${A.green}`,
            opacity: 0.5 * (1 - halo),
          }}
        />
      )}
      {wipe > 0 && <Lockup wipe={wipe} lift={0} />}
      <Img
        src={LOGO.iconOnLight}
        style={{ position: 'absolute', left: mixN(MARK_X, ICON_CX, move) - ms / 2, top: mixN(MARK_Y, ICON_CY, move) - ms / 2, width: ms, height: ms, opacity: 1 - ap(t, b(1.5) + 3, 5) }}
      />
    </Canvas>
  );
};

// =============================================================================
// 02 OFFICIAL (bar 1) — lockup lifts; the claim stacks in on beats 0 / 1 / 2, chips on
// 2½ and 3, a price line rips across the floor through the bar.
// =============================================================================
const BRAND_LINE = walk(70, 11, 0.9, 1.1);
export const Official: React.FC<{ t: number }> = ({ t }) => (
  <Canvas>
    <Lockup wipe={1} lift={ap(t, 0, FAST)} />
    <div style={{ position: 'absolute', top: 640, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18 }}>
      <Reveal t={t} at={2} text="The official" style={sf(104, 800)} align="center" dur={10} stagger={1.5} />
      <Reveal t={t} at={b(1)} text="PSX division" style={sf(132, 800, A.deep)} align="center" dur={10} stagger={1.5} />
      <div style={{ height: 8 }} />
      <Reveal t={t} at={b(2)} text="of Floret Capitals." style={sf(56, 500, A.sub)} align="center" dur={10} stagger={1.2} />
    </div>
    <div style={{ position: 'absolute', top: 1220, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 20 }}>
      {['SECP licensed', 'PSX TREC 535'].map((c, i) => {
        const e = enter(t, b(2.5 + i * 0.5), FAST, 30);
        return (
          <div key={c} style={e.style}>
            <Chip>
              <span style={{ width: 14, height: 14, borderRadius: 7, backgroundColor: A.green }} />
              <span style={sf(34, 600)}>{c}</span>
            </Chip>
          </div>
        );
      })}
    </div>
    <div style={{ position: 'absolute', left: 0, top: 1450 }}>
      <LineChart id="brand" data={BRAND_LINE} w={1080} h={330} prog={ap(t, 0, b(4), (n) => n)} stroke={7} />
    </div>
  </Canvas>
);

// =============================================================================
// 03 MARKET (bars 2–3) — bar 2: the KSE-100 card cuts in on the downbeat, its chart
// rips across in two beats, the range control steps 1D→1W→1M→1Y on beats 1–3.
// Bar 3: the watchlist builds one row per 8th note. Illustrative data.
// =============================================================================
const SERIES = [walk(48, 3, 0.4), walk(48, 41, 0.6), walk(48, 77, 0.8), walk(48, 123, 1.0)];
const SEGS = ['1D', '1W', '1M', '1Y'];
const WATCH = [
  { s: 'OGDC', n: 'Oil & Gas Development', c: '+1.84%', up: true, seed: 5 },
  { s: 'HBL', n: 'Habib Bank', c: '−0.45%', up: false, seed: 9 },
  { s: 'LUCK', n: 'Lucky Cement', c: '+0.92%', up: true, seed: 14 },
  { s: 'SYS', n: 'Systems Limited', c: '+2.10%', up: true, seed: 21 },
  { s: 'ENGRO', n: 'Engro Corporation', c: '+0.67%', up: true, seed: 33 },
];
export const Market: React.FC<{ t: number }> = ({ t }) => {
  let seg = 0;
  for (let i = 1; i < 4; i++) seg += ap(t, b(i), 6);
  const lo = Math.min(2, Math.floor(seg));
  const fr = seg - lo;
  const data = SERIES[lo].map((v, i) => mixN(v, SERIES[lo + 1][i], fr));
  const cur = Math.round(seg);
  const card = enter(t, 0, FAST, 70);
  const list = enter(t, b(4), FAST, 70);
  const SW = 860 / 4;
  return (
    <Canvas tone="mist">
      <div style={{ position: 'absolute', left: 70, top: 200 }}>
        <Reveal t={t} at={0} text="Trade the whole PSX." style={sf(84, 800)} dur={10} stagger={1.5} />
        <div style={{ height: 20 }} />
        <Reveal t={t} at={b(0.5)} text="Every listed company, one account." style={sf(40, 500, A.sub)} dur={10} stagger={1} />
      </div>
      <Card x={50} y={430} w={980} h={610} style={card.style}>
        <p style={{ ...sf(50, 800), position: 'absolute', left: 44, top: 40 }}>KSE-100</p>
        <p style={{ ...sf(28, 500, A.sub), position: 'absolute', left: 44, top: 104 }}>Pakistan Stock Exchange</p>
        <div style={{ position: 'absolute', left: 44, top: 160 }}>
          <Pill up text="+2.41%" size={34} />
        </div>
        <div style={{ position: 'absolute', right: 40, top: 40, width: 860 / 2, height: 64, borderRadius: 18, backgroundColor: A.mist }}>
          <div style={{ position: 'absolute', top: 5, left: 5 + seg * (SW / 2), width: SW / 2 - 10, height: 54, borderRadius: 14, backgroundColor: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.12)' }} />
          {SEGS.map((s, i) => (
            <span key={s} style={{ ...sf(26, 700, i === cur ? A.ink : A.sub), position: 'absolute', top: 16, left: i * (SW / 2) + SW / 4 - 20, width: 40, textAlign: 'center' }}>
              {s}
            </span>
          ))}
        </div>
        <div style={{ position: 'absolute', left: 44, top: 250 }}>
          <LineChart id="kse" data={data} w={892} h={300} prog={ap(t, 1, b(2), (n) => n)} grid />
        </div>
        <p style={{ ...sf(18, 600, A.faint), position: 'absolute', right: 44, bottom: 24, letterSpacing: '0.08em' }}>ILLUSTRATIVE</p>
      </Card>
      <Card x={50} y={1080} w={980} h={570} style={list.style}>
        {WATCH.map((w, i) => {
          const r = enter(t, b(4 + i * 0.5), 6, 26);
          return (
            <div key={w.s} style={{ position: 'absolute', left: 0, right: 0, top: 20 + i * 106, height: 106, ...r.style }}>
              {i > 0 && <div style={{ position: 'absolute', left: 44, right: 44, top: 0, height: 2, backgroundColor: A.line }} />}
              <p style={{ ...sf(38, 800), position: 'absolute', left: 44, top: 20 }}>{w.s}</p>
              <p style={{ ...sf(24, 500, A.sub), position: 'absolute', left: 44, top: 66 }}>{w.n}</p>
              <div style={{ position: 'absolute', left: 480, top: 26 }}>
                <LineChart id={`w${i}`} data={walk(24, w.seed, w.up ? 0.7 : -0.4)} w={220} h={56} prog={ap(t, b(4 + i * 0.5) + 1, 8, (n) => n)} stroke={4} color={w.up ? A.green : A.red} dot={false} />
              </div>
              <div style={{ position: 'absolute', right: 44, top: 28 }}>
                <Pill up={w.up} text={w.c} size={30} />
              </div>
            </div>
          );
        })}
      </Card>
      <p style={{ ...sf(20, 600, A.sub), position: 'absolute', left: 70, top: 1672, opacity: list.p, letterSpacing: '0.06em' }}>ILLUSTRATIVE DATA · NOT INVESTMENT ADVICE</p>
    </Canvas>
  );
};

// =============================================================================
// 04 OPEN (bar 4) — checklist ticks on the 8ths of beats 1–2½, toast on beat 3.
// =============================================================================
const STEPS = [
  ['Create your account', 'Sign up in minutes'],
  ['Verify your identity', 'Quick digital verification'],
  ['Fund your account', 'Straight from your bank'],
  ['Start trading', 'Every PSX-listed stock'],
];
export const OpenAccount: React.FC<{ t: number }> = ({ t }) => {
  const card = enter(t, 2, FAST, 70);
  const prog = interpolate(t, [b(1), b(2.5) + 6], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const toast = enter(t, b(3), FAST, 50);
  return (
    <Canvas>
      <div style={{ position: 'absolute', left: 70, top: 220 }}>
        <Reveal t={t} at={0} text="Open your account." style={sf(92, 800)} dur={10} stagger={1.5} />
        <div style={{ height: 14 }} />
        <Reveal t={t} at={b(0.5)} text="Fully digital." style={sf(92, 800, A.deep)} dur={10} stagger={1.5} />
      </div>
      <Card x={70} y={560} w={940} h={800} style={card.style}>
        {STEPS.map(([h, s], i) => {
          const p = ap(t, b(1 + i * 0.5), 6);
          return (
            <div key={h} style={{ position: 'absolute', left: 0, right: 0, top: 50 + i * 165, height: 150 }}>
              <div style={{ position: 'absolute', left: 50, top: 24 }}>
                <Check p={p} size={72} />
              </div>
              <p style={{ ...sf(46, 700, p > 0.5 ? A.ink : A.sub), position: 'absolute', left: 156, top: 22 }}>{h}</p>
              <p style={{ ...sf(28, 500, A.sub), position: 'absolute', left: 156, top: 84 }}>{s}</p>
            </div>
          );
        })}
        <div style={{ position: 'absolute', left: 50, right: 50, bottom: 60, height: 12, borderRadius: 6, backgroundColor: A.mist }}>
          <div style={{ width: `${prog * 100}%`, height: 12, borderRadius: 6, backgroundColor: A.green }} />
        </div>
      </Card>
      <div style={{ position: 'absolute', top: 1440, left: 0, right: 0, display: 'flex', justifyContent: 'center', ...toast.style }}>
        <Chip dark style={{ padding: '24px 40px' }}>
          <Check p={1} size={48} />
          <span style={sf(40, 700, '#fff')}>Ready to trade</span>
        </Chip>
      </div>
    </Canvas>
  );
};

// =============================================================================
// 05 LEARN (bar 5) — an Apple grouped list (Settings style): one row per 8th, each with
// an icon tile, title, one-liner, "Free" badge and chevron; a selection sweep on beat 3.
// =============================================================================
const LEARN = [
  { h: 'Beginner guides', s: 'PSX basics, step by step', icon: 'guide' },
  { h: 'Downloadable eBook', s: 'Your investing handbook', icon: 'book' },
  { h: 'Flopedia', s: 'The A–Z of PSX terms', icon: 'az' },
] as const;
const RowIcon: React.FC<{ kind: string }> = ({ kind }) => (
  <div style={{ width: 96, height: 96, borderRadius: 24, background: kind === 'book' ? 'linear-gradient(160deg,#2b2b2e,#0a0e0a)' : 'linear-gradient(160deg,#45e01f,#1f8a00)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
    {kind === 'guide' && (
      <svg width={56} height={56} viewBox="0 0 56 56">
        {[0, 1, 2].map((i) => (
          <rect key={i} x={6 + i * 16} y={40 - i * 12} width={12} height={10 + i * 12} rx={3} fill="#fff" opacity={0.6 + i * 0.2} />
        ))}
      </svg>
    )}
    {kind === 'book' && (
      <svg width={60} height={56} viewBox="0 0 60 56">
        <path d="M30 10 C 22 5, 12 5, 4 8 L 4 48 C 12 45, 22 45, 30 50 Z" fill="#fff" />
        <path d="M30 10 C 38 5, 48 5, 56 8 L 56 48 C 48 45, 38 45, 30 50 Z" fill="#fff" opacity={0.7} />
      </svg>
    )}
    {kind === 'az' && <span style={sf(40, 800, '#fff')}>A–Z</span>}
  </div>
);
export const Learn: React.FC<{ t: number }> = ({ t }) => {
  const sel = ap(t, b(3), 6);
  return (
    <Canvas tone="mist">
      <div style={{ position: 'absolute', left: 70, top: 220 }}>
        <Reveal t={t} at={0} text="Learn the market." style={sf(92, 800)} dur={10} stagger={1.5} />
        <div style={{ height: 14 }} />
        <Reveal t={t} at={b(0.5)} text="For free." style={sf(92, 800, A.deep)} dur={10} stagger={1.5} />
      </div>
      <p style={{ ...sf(26, 600, A.sub), position: 'absolute', left: 110, top: 572, letterSpacing: '0.06em', opacity: ap(t, b(0.5), FAST) }}>FREE LEARNING</p>
      <Card x={70} y={620} w={940} h={3 * 190} r={36} style={enter(t, b(0.5), FAST, 60).style}>
        {LEARN.map((r, i) => {
          const e = enter(t, b(1 + i * 0.5), 6, 24);
          const hi = i === 0 ? sel * (1 - 0) : 0;
          return (
            <div key={r.h} style={{ position: 'absolute', left: 0, right: 0, top: i * 190, height: 190, backgroundColor: hi > 0 ? `rgba(56,209,0,${0.08 * hi})` : undefined, ...e.style }}>
              {i > 0 && <div style={{ position: 'absolute', left: 170, right: 0, top: 0, height: 2, backgroundColor: A.line }} />}
              <div style={{ position: 'absolute', left: 44, top: 47 }}>
                <RowIcon kind={r.icon} />
              </div>
              <p style={{ ...sf(46, 700), position: 'absolute', left: 170, top: 52 }}>{r.h}</p>
              <p style={{ ...sf(28, 500, A.sub), position: 'absolute', left: 170, top: 110 }}>{r.s}</p>
              <div style={{ position: 'absolute', right: 96, top: 72, opacity: ap(t, b(2 + i * 0.25), 5) }}>
                <span style={{ ...sf(24, 700, A.deep), backgroundColor: 'rgba(56,209,0,0.12)', padding: '8px 18px', borderRadius: 999 }}>Free</span>
              </div>
              <svg width={22} height={36} viewBox="0 0 22 36" style={{ position: 'absolute', right: 44, top: 77 }}>
                <path d="M4 4 L18 18 L4 32" fill="none" stroke={A.faint} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          );
        })}
      </Card>
    </Canvas>
  );
};

// =============================================================================
// 06 RESEARCH (bar 6) — the PSX Analyzer gauge sweeps in two beats; chips on 2 and 2½.
// =============================================================================
export const Research: React.FC<{ t: number }> = ({ t }) => {
  const card = enter(t, 2, FAST, 70);
  const g = ap(t, b(0.5), b(1.5));
  const R = 250;
  const arc = (k: number) => {
    const a1 = Math.PI + Math.PI * k;
    return `M ${400 - R} 380 A ${R} ${R} 0 0 1 ${400 + R * Math.cos(a1)} ${380 + R * Math.sin(a1)}`;
  };
  return (
    <Canvas tone="mist">
      <div style={{ position: 'absolute', left: 70, top: 220 }}>
        <Reveal t={t} at={0} text="Research that" style={sf(88, 800)} dur={10} stagger={1.5} />
        <div style={{ height: 12 }} />
        <Reveal t={t} at={b(0.5)} text="does the homework." style={sf(88, 800, A.deep)} dur={10} stagger={1.5} />
      </div>
      <Card x={140} y={600} w={800} h={640} style={card.style}>
        <svg width={800} height={460} style={{ position: 'absolute', left: 0, top: 20 }}>
          <path d={arc(1)} fill="none" stroke={A.mist} strokeWidth={36} strokeLinecap="round" />
          {g > 0.01 && <path d={arc(0.82 * g)} fill="none" stroke={A.green} strokeWidth={36} strokeLinecap="round" />}
        </svg>
        <div style={{ position: 'absolute', left: 0, right: 0, top: 250, display: 'flex', justifyContent: 'center', alignItems: 'baseline', gap: 6 }}>
          <span style={{ ...sf(150, 800), fontVariantNumeric: 'tabular-nums' }}>{Math.round(82 * g)}</span>
          <span style={sf(44, 600, A.sub)}>/100</span>
        </div>
        <p style={{ ...sf(36, 700), position: 'absolute', left: 0, right: 0, top: 470, textAlign: 'center' }}>PSX Analyzer</p>
        <p style={{ ...sf(28, 500, A.sub), position: 'absolute', left: 0, right: 0, top: 524, textAlign: 'center' }}>Score any listed company · illustrative</p>
      </Card>
      <div style={{ position: 'absolute', top: 1320, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 20 }}>
        {['Equity notes', 'IPO analysis'].map((c, i) => (
          <div key={c} style={enter(t, b(2 + i * 0.5), 6, 30).style}>
            <Chip>
              <span style={sf(34, 600)}>{c}</span>
            </Chip>
          </div>
        ))}
      </div>
    </Canvas>
  );
};

// =============================================================================
// 07 TOOLS (bar 7) — the calculator tabs step on every beat (Commission, SIP, CGT,
// Returns = investment return calculator). No outcome figures (no promised returns).
// =============================================================================
const TABS = ['Commission', 'SIP', 'CGT', 'Returns'];
const TITLES = ['Commission calculator', 'SIP calculator', 'CGT calculator', 'Investment return calculator'];
const seededBar = (i: number, k: number) => {
  const x = Math.sin((i * 3 + k * 17) * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};
export const Tools: React.FC<{ t: number }> = ({ t }) => {
  const card = enter(t, 0, FAST, 70);
  let seg = 0;
  for (let i = 1; i < 4; i++) seg += ap(t, b(i), 6);
  const cur = Math.round(seg);
  const lo = Math.min(2, Math.floor(seg));
  const TW = 860 / 4;
  const slider = 30 + 15 * seg + 5 * Math.sin(seg * 2.1);
  return (
    <Canvas>
      <div style={{ position: 'absolute', left: 70, top: 220 }}>
        <Reveal t={t} at={0} text="Plan every rupee." style={sf(92, 800)} dur={10} stagger={1.5} />
        <div style={{ height: 18 }} />
        <Reveal t={t} at={b(0.5)} text="Free calculators, built in." style={sf(44, 500, A.sub)} dur={10} stagger={1} />
      </div>
      <Card x={70} y={540} w={940} h={860} style={card.style}>
        <div style={{ position: 'absolute', left: 40, top: 40, width: 860, height: 84, borderRadius: 22, backgroundColor: A.mist }}>
          <div style={{ position: 'absolute', top: 6, left: 6 + seg * TW, width: TW - 12, height: 72, borderRadius: 17, backgroundColor: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.12)' }} />
          {TABS.map((s, i) => (
            <span key={s} style={{ ...sf(28, 700, i === cur ? A.ink : A.sub), position: 'absolute', top: 26, left: i * TW, width: TW, textAlign: 'center' }}>
              {s}
            </span>
          ))}
        </div>
        <p style={{ ...sf(cur === 3 ? 54 : 64, 800), position: 'absolute', left: 50, top: cur === 3 ? 198 : 190 }}>{TITLES[cur]}</p>
        <p style={{ ...sf(30, 500, A.sub), position: 'absolute', left: 50, top: 276 }}>Know the numbers before you trade.</p>
        <div style={{ position: 'absolute', left: 50, right: 50, top: 400, height: 10, borderRadius: 5, backgroundColor: A.mist }}>
          <div style={{ width: `${slider}%`, height: 10, borderRadius: 5, backgroundColor: A.green }} />
          <div style={{ position: 'absolute', top: -21, left: `calc(${slider}% - 26px)`, width: 52, height: 52, borderRadius: 26, backgroundColor: '#fff', boxShadow: '0 3px 10px rgba(0,0,0,0.18)' }} />
        </div>
        <svg width={840} height={300} style={{ position: 'absolute', left: 50, top: 500 }}>
          {Array.from({ length: 10 }, (_, i) => {
            const h = 60 + 200 * mixN(0.3 + 0.7 * seededBar(i, lo), 0.3 + 0.7 * seededBar(i, lo + 1), seg - lo) * ap(t, 2 + i * 0.8, 8);
            return <rect key={i} x={i * 84} y={300 - h} width={60} height={h} rx={14} fill={i % 3 === 2 ? A.deep : A.green} opacity={0.35 + 0.065 * i} />;
          })}
        </svg>
      </Card>
    </Canvas>
  );
};
