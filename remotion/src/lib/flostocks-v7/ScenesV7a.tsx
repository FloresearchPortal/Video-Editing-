// v7 showreel, part 1 (scene-local frame t; beats via b(n) on the 124 BPM grid).
// Premium Apple-style UI × dynamic fintech motion — see videos/flostocks-whatis/BRIEF.md.
import React from 'react';
import { Img, interpolate } from 'remotion';
import { LOGO } from '../flostocks';
import { A, APPLE, Canvas, Card, Check, Chip, LineChart, Pill, Reveal, ap, enter, mixN, mono, sf, walk } from './kit';
import { MARK, MARK_X, MARK_Y } from './ChatV7';
import { b } from './timing';

// =============================================================================
// 01 BRAND — the mark from the chat settles on the drop, slides into the full FloStocks
// lockup (wipe), then lifts away for "The official PSX division of Floret Capitals"
// while a price line draws across the floor.
// =============================================================================
const LW = 860; // lockup display width (image is 1200 x 400)
const LS = LW / 1200;
const LOCK_X = 540 - ((21 + 1181) / 2) * LS; // content-centred
const LOCK_Y = MARK_Y - ((53 + 356) / 2) * LS;
const ICON_CX = LOCK_X + 128 * LS; // icon glyph centre inside the lockup
const ICON_CY = LOCK_Y + 164 * LS;
const ICON_M = (222 * LS) / 0.814; // standalone icon image size whose glyph matches
const BRAND_LINE = walk(70, 11, 0.9, 1.1);

export const Brand: React.FC<{ t: number }> = ({ t }) => {
  const move = ap(t, b(1), 14);
  const mx = mixN(MARK_X, ICON_CX, move);
  const my = mixN(MARK_Y, ICON_CY, move);
  const ms = mixN(MARK, ICON_M, move);
  const wipe = ap(t, b(1.5), 16);
  const lift = ap(t, b(4), 18); // bar 1: lockup lifts to the top
  const lockY = (330 - MARK_Y) * lift; // lockup centre: 860 -> 330
  const lockS = mixN(1, 0.72, lift);
  const halo = t < 22 ? t / 22 : 1;
  return (
    <Canvas>
      {/* one soft halo as the mark lands on the drop (once, not a pulse) */}
      {t < 22 && (
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
      <div style={{ position: 'absolute', inset: 0, transform: `translateY(${lockY}px) scale(${lockS})`, transformOrigin: `540px ${MARK_Y}px` }}>
        {wipe > 0 && (
          <Img
            src={LOGO.fullOnLight}
            style={{
              position: 'absolute',
              left: LOCK_X,
              top: LOCK_Y,
              width: LW,
              height: LW / 3,
              clipPath: `inset(0 ${(1 - wipe) * (1 - 243 / 1200) * 100}% 0 0)`,
            }}
          />
        )}
        <Img
          src={LOGO.iconOnLight}
          style={{ position: 'absolute', left: mx - ms / 2, top: my - ms / 2, width: ms, height: ms, opacity: 1 - ap(t, b(1.5) + 4, 6) }}
        />
      </div>
      <div style={{ position: 'absolute', top: 690, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18 }}>
        <Reveal t={t} at={b(4) + 6} text="The official" style={sf(104, 800)} align="center" />
        <Reveal t={t} at={b(4.5) + 6} text="PSX division" style={sf(132, 800, A.deep)} align="center" />
        <div style={{ height: 8 }} />
        <Reveal t={t} at={b(5.25) + 4} text="of Floret Capitals." style={sf(56, 500, A.sub)} align="center" stagger={2} />
      </div>
      <div style={{ position: 'absolute', top: 1260, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 20 }}>
        {['SECP licensed', 'PSX TREC 535'].map((c, i) => {
          const e = enter(t, b(6 + i * 0.5), 16, 40);
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
      <div style={{ position: 'absolute', left: 0, top: 1450, opacity: ap(t, b(4), 10) }}>
        <LineChart id="brand" data={BRAND_LINE} w={1080} h={330} prog={ap(t, b(4), b(4), (n) => n)} stroke={7} />
      </div>
    </Canvas>
  );
};

// =============================================================================
// 02 MARKET — an Apple-grade market card: KSE-100 chart drawing, a segmented control
// stepping 1D → 1W → 1M → 1Y on the beats (the chart morphs each time), then a
// watchlist building row by row with sparklines. Illustrative data.
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
  let k = 0;
  for (let i = 1; i < 4; i++) {
    const p = ap(t, b(i), 10);
    if (p > 0) {
      seg = i - 1 + p;
      k = i;
    }
  }
  const lo = Math.floor(seg);
  const fr = seg - lo;
  const data = SERIES[lo].map((v, i) => mixN(v, SERIES[Math.min(3, lo + 1)][i], fr));
  const card = enter(t, 0, 16);
  const list = enter(t, b(3.5), 16);
  const SW = 860 / 4;
  return (
    <Canvas tone="mist">
      <div style={{ position: 'absolute', left: 70, top: 200 }}>
        <Reveal t={t} at={0} text="Trade the whole PSX." style={sf(84, 800)} stagger={2} />
        <div style={{ height: 20 }} />
        <Reveal t={t} at={6} text="Every listed company, one account." style={sf(40, 500, A.sub)} stagger={1.5} />
      </div>
      <Card x={50} y={430} w={980} h={610} style={card.style}>
        <p style={{ ...sf(50, 800), position: 'absolute', left: 44, top: 40 }}>KSE-100</p>
        <p style={{ ...sf(28, 500, A.sub), position: 'absolute', left: 44, top: 104 }}>Pakistan Stock Exchange</p>
        <div style={{ position: 'absolute', left: 44, top: 160 }}>
          <Pill up text="+2.41%" size={34} />
        </div>
        {/* segmented control */}
        <div style={{ position: 'absolute', right: 40, top: 40, width: 860 / 2, height: 64, borderRadius: 18, backgroundColor: A.mist }}>
          <div
            style={{
              position: 'absolute',
              top: 5,
              left: 5 + seg * (SW / 2),
              width: SW / 2 - 10,
              height: 54,
              borderRadius: 14,
              backgroundColor: '#fff',
              boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
            }}
          />
          {SEGS.map((s, i) => (
            <span key={s} style={{ ...sf(26, 700, i === k ? A.ink : A.sub), position: 'absolute', top: 16, left: i * (SW / 2) + SW / 4 - 20, width: 40, textAlign: 'center' }}>
              {s}
            </span>
          ))}
        </div>
        <div style={{ position: 'absolute', left: 44, top: 250 }}>
          <LineChart id="kse" data={data} w={892} h={300} prog={ap(t, 2, b(1), (n) => n)} grid />
        </div>
        <p style={{ ...mono(18, A.faint), position: 'absolute', right: 44, bottom: 24 }}>Illustrative</p>
      </Card>
      <Card x={50} y={1080} w={980} h={570} style={list.style}>
        {WATCH.map((w, i) => {
          const r = enter(t, b(4 + i * 0.5), 14, 30);
          return (
            <div key={w.s} style={{ position: 'absolute', left: 0, right: 0, top: 20 + i * 106, height: 106, ...r.style }}>
              {i > 0 && <div style={{ position: 'absolute', left: 44, right: 44, top: 0, height: 2, backgroundColor: A.line }} />}
              <p style={{ ...sf(38, 800), position: 'absolute', left: 44, top: 20 }}>{w.s}</p>
              <p style={{ ...sf(24, 500, A.sub), position: 'absolute', left: 44, top: 66 }}>{w.n}</p>
              <div style={{ position: 'absolute', left: 480, top: 26 }}>
                <LineChart id={`w${i}`} data={walk(24, w.seed, w.up ? 0.7 : -0.4)} w={220} h={56} prog={ap(t, b(4 + i * 0.5) + 2, 14, (n) => n)} stroke={4} color={w.up ? A.green : A.red} dot={false} />
              </div>
              <div style={{ position: 'absolute', right: 44, top: 28 }}>
                <Pill up={w.up} text={w.c} size={30} />
              </div>
            </div>
          );
        })}
      </Card>
      <p style={{ ...mono(18, A.sub), position: 'absolute', left: 70, top: 1672, opacity: list.p }}>Illustrative data · not investment advice</p>
    </Canvas>
  );
};

// =============================================================================
// 03 OPEN — a checklist card: each step's circle fills and draws its tick on the beat,
// a progress bar runs underneath, then a "Ready to trade" toast.
// =============================================================================
const STEPS = [
  ['Create your account', 'Sign up in minutes'],
  ['Verify your identity', 'Quick digital verification'],
  ['Fund your account', 'Straight from your bank'],
  ['Start trading', 'Every PSX-listed stock'],
];
export const OpenAccount: React.FC<{ t: number }> = ({ t }) => {
  const card = enter(t, b(0.5), 16);
  const prog = interpolate(t, [b(1.5), b(4.5) + 12], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  const toast = enter(t, b(6), 16, 60);
  return (
    <Canvas>
      <div style={{ position: 'absolute', left: 70, top: 220 }}>
        <Reveal t={t} at={0} text="Open your account." style={sf(92, 800)} stagger={2} />
        <div style={{ height: 14 }} />
        <Reveal t={t} at={b(0.5)} text="Fully digital." style={sf(92, 800, A.deep)} stagger={2} />
      </div>
      <Card x={70} y={560} w={940} h={800} style={card.style}>
        {STEPS.map(([h, s], i) => {
          const p = ap(t, b(1.5 + i), 12);
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
// 04 LEARN — an Apple-style carousel of free learning cards, snapping on the beats,
// with a pager whose active dot stretches into a pill.
// =============================================================================
const CW = 700;
const CG = 40;
const BookGlyph: React.FC<{ kind: number }> = ({ kind }) => {
  if (kind === 0)
    return (
      <svg width={300} height={240} viewBox="0 0 300 240">
        {[0, 1, 2, 3].map((i) => (
          <rect key={i} x={20 + i * 70} y={180 - i * 50} width={56} height={40 + i * 50} rx={12} fill="#fff" opacity={0.55 + i * 0.15} />
        ))}
        <path d="M30 150 L100 110 L170 120 L270 30" fill="none" stroke="#fff" strokeWidth={10} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  if (kind === 1)
    return (
      <svg width={300} height={240} viewBox="0 0 300 240">
        <path d="M150 50 C 110 30, 60 30, 20 45 L 20 210 C 60 195, 110 195, 150 215 Z" fill="#fff" opacity={0.9} />
        <path d="M150 50 C 190 30, 240 30, 280 45 L 280 210 C 240 195, 190 195, 150 215 Z" fill="#fff" opacity={0.65} />
        <path d="M150 120 L150 175 M128 155 L150 177 L172 155" stroke={A.deep} strokeWidth={10} fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  return (
    <svg width={300} height={240} viewBox="0 0 300 240">
      <text x={150} y={170} textAnchor="middle" fontFamily="Inter" fontWeight={800} fontSize={150} letterSpacing={-6} fill="#fff">
        A–Z
      </text>
    </svg>
  );
};
const LEARN = [
  { h: 'Beginner guides', s: 'PSX basics, step by step', bg: 'linear-gradient(160deg, #45e01f 0%, #1f8a00 100%)' },
  { h: 'Downloadable eBook', s: 'Your investing handbook', bg: 'linear-gradient(160deg, #2b2b2e 0%, #0a0e0a 100%)' },
  { h: 'Flopedia', s: 'The A–Z of PSX terms', bg: 'linear-gradient(160deg, #7edca8 0%, #1f8a00 100%)' },
];
export const Learn: React.FC<{ t: number }> = ({ t }) => {
  const idx = ap(t, b(2.5), 14) + ap(t, b(5), 14);
  const x0 = 540 - CW / 2 - idx * (CW + CG);
  const intro = enter(t, b(0.5), 18, 120);
  return (
    <Canvas tone="mist">
      <div style={{ position: 'absolute', left: 70, top: 220 }}>
        <Reveal t={t} at={0} text="Learn the market." style={sf(92, 800)} stagger={2} />
        <div style={{ height: 14 }} />
        <Reveal t={t} at={b(0.5)} text="For free." style={sf(92, 800, A.deep)} stagger={2} />
      </div>
      <div style={{ position: 'absolute', inset: 0, ...intro.style }}>
        {LEARN.map((c, i) => {
          const d = Math.abs(i - idx);
          const sc = 1 - Math.min(1, d) * 0.1;
          return (
            <Card key={c.h} x={x0 + i * (CW + CG)} y={560} w={CW} h={860} style={{ transform: `scale(${sc})`, opacity: 1 - Math.min(1, d) * 0.45 }}>
              <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 540, background: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <BookGlyph kind={i} />
              </div>
              <p style={{ ...sf(54, 800), position: 'absolute', left: 48, top: 590 }}>{c.h}</p>
              <p style={{ ...sf(32, 500, A.sub), position: 'absolute', left: 48, top: 664 }}>{c.s}</p>
              <div style={{ position: 'absolute', left: 48, top: 750 }}>
                <Chip style={{ padding: '10px 22px', boxShadow: 'none', backgroundColor: A.mist }}>
                  <span style={sf(26, 700, A.deep)}>Free</span>
                </Chip>
              </div>
            </Card>
          );
        })}
      </div>
      <div style={{ position: 'absolute', top: 1500, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 14 }}>
        {[0, 1, 2].map((i) => {
          const a = Math.max(0, 1 - Math.abs(i - idx));
          return <div key={i} style={{ width: 16 + 30 * a, height: 16, borderRadius: 8, backgroundColor: a > 0.5 ? A.ink : A.faint }} />;
        })}
      </div>
    </Canvas>
  );
};
