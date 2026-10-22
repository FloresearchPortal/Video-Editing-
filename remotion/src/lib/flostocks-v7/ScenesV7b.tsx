// v7 showreel, part 2: the break (research, tools), the stop bar (regulated), drop B
// (bento grid of features) and the CTA ending with the market-risk disclaimer.
import React from 'react';
import { Img } from 'remotion';
import { LOGO } from '../flostocks';
import { seeded } from '../flostocks-v2/fx';
import { A, Canvas, Candle, Card, Chip, LineChart, Reveal, SHADOW, ap, enter, mixN, mono, sf, walk } from './kit';
import { b } from './timing';

// =============================================================================
// 05 RESEARCH (break) — a calm gauge card: the PSX Analyzer score arc sweeps round.
// =============================================================================
export const Research: React.FC<{ t: number }> = ({ t }) => {
  const card = enter(t, 4, 18);
  const g = ap(t, b(0.5), 32);
  const score = Math.round(82 * g);
  const R = 250;
  const arc = (k: number) => {
    const a0 = Math.PI;
    const a1 = Math.PI + Math.PI * k;
    return `M ${400 + R * Math.cos(a0)} ${380 + R * Math.sin(a0)} A ${R} ${R} 0 0 1 ${400 + R * Math.cos(a1)} ${380 + R * Math.sin(a1)}`;
  };
  return (
    <Canvas tone="mist">
      <div style={{ position: 'absolute', left: 70, top: 220 }}>
        <Reveal t={t} at={0} text="Research that" style={sf(88, 800)} stagger={2} />
        <div style={{ height: 12 }} />
        <Reveal t={t} at={5} text="does the homework." style={sf(88, 800, A.deep)} stagger={2} />
      </div>
      <Card x={140} y={600} w={800} h={640} style={card.style}>
        <svg width={800} height={460} style={{ position: 'absolute', left: 0, top: 20 }}>
          <path d={arc(1)} fill="none" stroke={A.mist} strokeWidth={36} strokeLinecap="round" />
          {g > 0.01 && <path d={arc(0.82 * g)} fill="none" stroke={A.green} strokeWidth={36} strokeLinecap="round" />}
        </svg>
        <div style={{ position: 'absolute', left: 0, right: 0, top: 250, display: 'flex', justifyContent: 'center', alignItems: 'baseline', gap: 6 }}>
          <span style={{ ...sf(150, 800), fontVariantNumeric: 'tabular-nums' }}>{score}</span>
          <span style={sf(44, 600, A.sub)}>/100</span>
        </div>
        <p style={{ ...sf(36, 700), position: 'absolute', left: 0, right: 0, top: 470, textAlign: 'center' }}>PSX Analyzer</p>
        <p style={{ ...sf(28, 500, A.sub), position: 'absolute', left: 0, right: 0, top: 524, textAlign: 'center' }}>Score any listed company · illustrative</p>
      </Card>
      <div style={{ position: 'absolute', top: 1320, left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: 20 }}>
        {['Equity notes', 'IPO analysis'].map((c, i) => {
          const e = enter(t, b(1.5 + i * 0.5), 16, 40);
          return (
            <div key={c} style={e.style}>
              <Chip>
                <span style={sf(34, 600)}>{c}</span>
              </Chip>
            </div>
          );
        })}
      </div>
    </Canvas>
  );
};

// =============================================================================
// 06 TOOLS (break riser) — a calculator card whose segmented tabs step on every beat;
// the slider and bars re-settle each time. No outcome figures (no promised returns).
// =============================================================================
const TABS = ['Commission', 'SIP', 'CGT', 'Dividends'];
export const Tools: React.FC<{ t: number }> = ({ t }) => {
  const card = enter(t, 2, 16);
  let seg = 0;
  for (let i = 1; i < 4; i++) seg += ap(t, b(i), 9);
  const cur = Math.round(seg);
  const TW = 860 / 4;
  return (
    <Canvas>
      <div style={{ position: 'absolute', left: 70, top: 220 }}>
        <Reveal t={t} at={0} text="Plan every rupee." style={sf(92, 800)} stagger={2} />
        <div style={{ height: 18 }} />
        <Reveal t={t} at={5} text="Free calculators, built in." style={sf(44, 500, A.sub)} stagger={1.5} />
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
        <p style={{ ...sf(64, 800), position: 'absolute', left: 50, top: 190 }}>{TABS[cur]} calculator</p>
        <p style={{ ...sf(30, 500, A.sub), position: 'absolute', left: 50, top: 276 }}>Know the numbers before you trade.</p>
        {/* slider */}
        <div style={{ position: 'absolute', left: 50, right: 50, top: 400, height: 10, borderRadius: 5, backgroundColor: A.mist }}>
          <div style={{ width: `${30 + 15 * seg + 5 * Math.sin(seg * 2.1)}%`, height: 10, borderRadius: 5, backgroundColor: A.green }} />
          <div
            style={{
              position: 'absolute',
              top: -21,
              left: `calc(${30 + 15 * seg + 5 * Math.sin(seg * 2.1)}% - 26px)`,
              width: 52,
              height: 52,
              borderRadius: 26,
              backgroundColor: '#fff',
              boxShadow: '0 3px 10px rgba(0,0,0,0.18)',
            }}
          />
        </div>
        {/* bars */}
        <svg width={840} height={300} style={{ position: 'absolute', left: 50, top: 500 }}>
          {Array.from({ length: 10 }, (_, i) => {
            const lo = Math.floor(seg);
            const H = (k: number) => 0.3 + 0.7 * seeded(i * 3 + k * 17);
            const h = 60 + 200 * mixN(H(lo), H(lo + 1), seg - lo) * ap(t, 4 + i * 1.2, 14);
            return <rect key={i} x={i * 84} y={300 - h} width={60} height={h} rx={14} fill={i % 3 === 2 ? A.deep : A.green} opacity={0.35 + 0.065 * i} />;
          })}
        </svg>
      </Card>
    </Canvas>
  );
};

// =============================================================================
// 07 REGULATED (stop bar) — one hit, then three beats of quiet: the shield draws, the
// word lands, and the licence facts fade in calmly.
// =============================================================================
export const Regulated: React.FC<{ t: number }> = ({ t }) => {
  const s = ap(t, 0, 12);
  const draw = ap(t, 2, 16);
  return (
    <Canvas>
      <div style={{ position: 'absolute', left: 540 - 120, top: 420, width: 240, height: 280, transform: `scale(${0.85 + 0.15 * s})`, opacity: s }}>
        <svg width={240} height={280} viewBox="0 0 240 280">
          <path d="M120 10 L220 50 L220 130 C 220 200, 175 245, 120 270 C 65 245, 20 200, 20 130 L 20 50 Z" fill={A.green} />
          <path d="M72 142 L106 176 L170 106" fill="none" stroke="#fff" strokeWidth={20} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - draw} />
        </svg>
      </div>
      <div style={{ position: 'absolute', top: 790, left: 0, right: 0 }}>
        <Reveal t={t} at={0} text="Regulated." style={sf(140, 800)} align="center" dur={12} />
      </div>
      <div style={{ position: 'absolute', top: 1060, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 30 }}>
        {['SECP licensed & regulated', 'PSX TREC holder 535', 'Licensed research entity'].map((x, i) => {
          const e = enter(t, b(1 + i * 0.75), 22, 24);
          return (
            <div key={x} style={{ display: 'flex', alignItems: 'center', gap: 18, ...e.style }}>
              <span style={{ width: 16, height: 16, borderRadius: 8, backgroundColor: A.green }} />
              <span style={sf(44, 600)}>{x}</span>
            </div>
          );
        })}
      </div>
    </Canvas>
  );
};

// =============================================================================
// 08 EVERYTHING (drop B) — an Apple "bento" grid of features flies in on the drop, then
// one tile lights up per beat; the grid clears and "All of PSX. One account." lands over
// a field of candles rising on the beats.
// =============================================================================
type Tile = { x: number; y: number; w: number; h: number; t: string; s: string; g: 'candles' | 'steps' | 'line' | 'ipo' | 'rm' | 'sectors' };
const TILES: Tile[] = [
  { x: 50, y: 200, w: 980, h: 380, t: 'MTS', s: 'Margin Trading System', g: 'candles' },
  { x: 50, y: 602, w: 479, h: 370, t: 'SIP', s: 'Systematic investment plans', g: 'steps' },
  { x: 551, y: 602, w: 479, h: 370, t: 'V Trade', s: 'Trade online', g: 'line' },
  { x: 50, y: 994, w: 479, h: 370, t: 'IPOs', s: 'Analysis & access', g: 'ipo' },
  { x: 551, y: 994, w: 479, h: 370, t: 'Your RM', s: 'Relationship managers', g: 'rm' },
  { x: 50, y: 1386, w: 980, h: 330, t: 'Every sector', s: 'Banks · Cement · Energy · Tech', g: 'sectors' },
];
const TileGfx: React.FC<{ g: Tile['g']; w: number; h: number; on: number; t: number }> = ({ g, w, h, on, t }) => {
  const c = on > 0.5 ? '#fff' : A.green;
  const c2 = on > 0.5 ? 'rgba(255,255,255,0.6)' : A.red;
  if (g === 'candles')
    return (
      <svg width={w} height={h}>
        {Array.from({ length: 9 }, (_, i) => {
          const up = seeded(i + 400) > 0.3;
          const y = h * 0.62 - i * (h * 0.045) + (seeded(i + 410) - 0.5) * 30;
          const k = ap(t, 4 + i * 1.5, 10);
          return <Candle key={i} x={30 + i * ((w - 60) / 8)} y={y} w={30} body={(40 + seeded(i + 420) * 50) * k} wick={(90 + seeded(i + 430) * 40) * k} up={up} />;
        })}
      </svg>
    );
  if (g === 'steps')
    return (
      <svg width={w} height={h}>
        {Array.from({ length: 6 }, (_, i) => (
          <rect key={i} x={i * (w / 6) + 6} y={h - (20 + i * (h - 30) / 6) * ap(t, 6 + i * 1.5, 10)} width={w / 6 - 14} height={(20 + i * (h - 30) / 6) * ap(t, 6 + i * 1.5, 10)} rx={10} fill={c} opacity={0.5 + i * 0.1} />
        ))}
      </svg>
    );
  if (g === 'line') return <LineChart id={`vt${on > 0.5 ? 1 : 0}`} data={walk(30, 61, 0.9)} w={w} h={h} prog={ap(t, 6, 20, (n) => n)} color={c} stroke={6} />;
  if (g === 'ipo')
    return (
      <svg width={w} height={h}>
        <rect x={0} y={h * 0.25} width={w} height={h * 0.5} rx={22} fill="none" stroke={c} strokeWidth={4} strokeDasharray="10 10" />
        <text x={w / 2} y={h * 0.5 + 18} textAnchor="middle" fontFamily="Inter" fontWeight={800} fontSize={48} fill={c}>
          NEW LISTING
        </text>
      </svg>
    );
  if (g === 'rm')
    return (
      <svg width={w} height={h}>
        <circle cx={w * 0.32} cy={h * 0.4} r={h * 0.22} fill={c} opacity={0.9} />
        <path d={`M ${w * 0.32 - h * 0.4} ${h} C ${w * 0.32 - h * 0.38} ${h * 0.62}, ${w * 0.32 + h * 0.38} ${h * 0.62}, ${w * 0.32 + h * 0.4} ${h}`} fill={c} opacity={0.9} />
        <rect x={w * 0.6} y={h * 0.2} width={w * 0.36} height={h * 0.22} rx={h * 0.11} fill={c2} />
        <rect x={w * 0.6} y={h * 0.5} width={w * 0.28} height={h * 0.22} rx={h * 0.11} fill={c2} />
      </svg>
    );
  return (
    <svg width={w} height={h}>
      {Array.from({ length: 12 }, (_, i) => {
        const v = 0.25 + 0.75 * seeded(i + 470);
        const k = ap(t, 8 + i, 12);
        return <rect key={i} x={i * (w / 12) + 6} y={h - v * h * k} width={w / 12 - 12} height={v * h * k} rx={8} fill={seeded(i + 480) > 0.25 ? c : c2} opacity={0.85} />;
      })}
    </svg>
  );
};
const RISE = Array.from({ length: 16 }, (_, i) => ({ up: seeded(i + 600) > 0.22, b: 50 + seeded(i + 610) * 70, w: 120 + seeded(i + 620) * 60 }));

export const Everything: React.FC<{ t: number }> = ({ t }) => {
  const out = ap(t, b(12), 12);
  return (
    <Canvas tone="mist">
      {out < 1 &&
        TILES.map((tile, i) => {
          const inn = ap(t, i * 2, 16);
          const on = ap(t, b(4 + i), 6) - ap(t, b(5 + i), 6);
          const lit = on;
          const dx = (tile.x + tile.w / 2 - 540) * out * 0.6;
          const dy = (tile.y + tile.h / 2 - 960) * out * 0.6;
          const bg = lit > 0.5 ? A.green : '#fff';
          return (
            <div
              key={tile.t}
              style={{
                position: 'absolute',
                left: tile.x,
                top: tile.y,
                width: tile.w,
                height: tile.h,
                borderRadius: 40,
                backgroundColor: bg,
                boxShadow: SHADOW,
                overflow: 'hidden',
                opacity: inn * (1 - out),
                transform: `translate(${dx}px, ${(1 - inn) * 160 + dy}px) scale(${(0.9 + 0.1 * inn) * (1 + 0.035 * lit) * (1 - 0.3 * out)})`,
                filter: inn < 1 ? `blur(${(1 - inn) * 14}px)` : undefined,
              }}
            >
              <p style={{ ...sf(tile.w > 600 ? 76 : 72, 800, lit > 0.5 ? '#fff' : A.ink), position: 'absolute', left: 40, top: 36 }}>{tile.t}</p>
              <p style={{ ...sf(28, 500, lit > 0.5 ? 'rgba(255,255,255,0.9)' : A.sub), position: 'absolute', left: 40, top: 124 }}>{tile.s}</p>
              {/* wide tiles: graphic on the right 44%, clear of the title/subtitle column */}
              <div style={{ position: 'absolute', left: tile.w > 600 ? tile.w * 0.56 : 40, right: 40, bottom: 34, height: tile.w > 600 ? tile.h - 110 : tile.h - 200 }}>
                <TileGfx g={tile.g} w={tile.w > 600 ? tile.w * 0.44 - 40 : tile.w - 80} h={tile.w > 600 ? tile.h - 110 : tile.h - 200} on={lit} t={t} />
              </div>
            </div>
          );
        })}
      {out > 0 && (
        <>
          <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0 }}>
            {RISE.map((c, i) => {
              const k = ap(t, b(12) + 4 + i * 1.6, 14);
              const x = 60 + i * 64;
              const y = 1700 - i * 34;
              return <Candle key={i} x={x} y={y} w={34} body={c.b * k} wick={(c.b + 60) * k} up={c.up} opacity={0.9} />;
            })}
          </svg>
          <div style={{ position: 'absolute', top: 560, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
            <Reveal t={t} at={b(12) + 4} text="All of PSX." style={sf(132, 800)} align="center" />
            <Reveal t={t} at={b(13)} text="One account." style={sf(132, 800, A.deep)} align="center" />
          </div>
        </>
      )}
    </Canvas>
  );
};

// =============================================================================
// 09 CTA — "Open your PSX account." lands on the hit, the button arrives, a pointer
// glides in and taps it on the next downbeat; in the outro the lockup, licence line and
// the market-risk disclaimer settle in and hold.
// =============================================================================
export const DISCLAIMER = 'Investments in securities are subject to market risks. Please read all relevant documents carefully before investing.';

export const Cta: React.FC<{ t: number }> = ({ t }) => {
  const btn = enter(t, b(1.5), 16, 50);
  const tap = t - b(4);
  const press = tap >= 0 && tap < 10 ? 1 - Math.sin((tap / 10) * Math.PI) * 0.05 : 1;
  const cur = ap(t, b(2), 22);
  const cx = mixN(930, 640, cur);
  const cy = mixN(1560, 1040, cur);
  const curOut = 1 - ap(t, b(6), 12);
  const outro = enter(t, b(8), 22, 40);
  const disc = enter(t, b(9), 24, 20);
  return (
    <Canvas>
      <div style={{ position: 'absolute', top: 210, left: 0, right: 0, display: 'flex', justifyContent: 'center', ...outro.style }}>
        <Img src={LOGO.fullOnLight} style={{ width: 600, height: 200 }} />
      </div>
      <div style={{ position: 'absolute', top: 520, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
        <Reveal t={t} at={0} text="Open your" style={sf(124, 800)} align="center" dur={14} />
        <Reveal t={t} at={4} text="PSX account." style={sf(132, 800, A.deep)} align="center" dur={14} />
      </div>
      <div
        style={{
          position: 'absolute',
          left: 170,
          right: 170,
          top: 960,
          height: 150,
          borderRadius: 75,
          backgroundColor: A.ink,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 18,
          overflow: 'hidden',
          boxShadow: '0 20px 50px rgba(0,0,0,0.22)',
          ...btn.style,
          transform: `${btn.style.transform} scale(${press})`,
        }}
      >
        {tap >= 0 && tap < 22 && (
          <div style={{ position: 'absolute', left: 370 - tap * 22, top: 75 - tap * 22, width: tap * 44, height: tap * 44, borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.18)', opacity: 1 - tap / 22 }} />
        )}
        <span style={sf(50, 700, '#fff')}>Open account</span>
        <span style={sf(50, 700, A.green)}>→</span>
      </div>
      <p style={{ ...sf(44, 600, A.ink), position: 'absolute', top: 1150, left: 0, right: 0, textAlign: 'center', opacity: btn.p }}>flostocks.com</p>
      {/* pointer */}
      {cur > 0 && curOut > 0 && (
        <svg width={60} height={80} viewBox="0 0 60 80" style={{ position: 'absolute', left: cx, top: cy, opacity: curOut, transform: `scale(${tap >= 0 && tap < 10 ? 0.9 : 1})`, transformOrigin: '0 0' }}>
          <path d="M4 4 L4 64 L20 50 L31 74 L42 69 L31 46 L52 46 Z" fill="#111" stroke="#fff" strokeWidth={4} strokeLinejoin="round" />
        </svg>
      )}
      <div style={{ position: 'absolute', top: 1300, left: 90, right: 90, ...outro.style }}>
        <div style={{ height: 2, backgroundColor: A.line }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 18 }}>
          <span style={mono(22)}>SECP licensed</span>
          <span style={mono(22)}>PSX TREC 535</span>
          <span style={mono(22)}>Floret Capitals</span>
        </div>
      </div>
      <p
        style={{
          ...sf(28, 400, A.sub),
          whiteSpace: 'normal',
          lineHeight: 1.45,
          letterSpacing: 0,
          position: 'absolute',
          top: 1420,
          left: 110,
          right: 110,
          textAlign: 'center',
          ...disc.style,
        }}
      >
        {DISCLAIMER}
      </p>
    </Canvas>
  );
};
