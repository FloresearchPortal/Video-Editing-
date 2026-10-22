// v8 showreel, part 2: the break + stop bar (Regulated), drop B (fast feature montage, each
// feature two beats with a one-liner and its own market graphic keyed to the beats/8ths),
// the CTA and the outro with the market-risk disclaimer.
import React from 'react';
import { Img } from 'remotion';
import { LOGO } from '../flostocks';
import { seeded } from '../flostocks-v2/fx';
import { A, Canvas, Candle, Check, LineChart, Pill, Reveal, SHADOW, ap, enter, mixN, sf, walk } from './kit';
import { b } from './timing';

// =============================================================================
// 08 REGULATED (bars 8–9) — bar 8 is the break riser: the shield outline draws through
// the bar and the licence lines land on beats ½, 1½, 2½. Bar 9 is the stop bar: on its
// single hit the shield fills, the tick draws and "Regulated." lands; then three beats of
// silence hold the frame.
// =============================================================================
export const Regulated: React.FC<{ t: number }> = ({ t }) => {
  const outline = ap(t, 0, b(3.5), (n) => n);
  const fill = ap(t, b(4), 5);
  const tick = ap(t, b(4) + 2, 8);
  return (
    <Canvas>
      <svg width={240} height={280} viewBox="0 0 240 280" style={{ position: 'absolute', left: 540 - 120, top: 400 }}>
        <path
          d="M120 10 L220 50 L220 130 C 220 200, 175 245, 120 270 C 65 245, 20 200, 20 130 L 20 50 Z"
          fill={A.green}
          fillOpacity={fill}
          stroke={A.green}
          strokeWidth={8}
          strokeLinejoin="round"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - outline}
        />
        <path d="M72 142 L106 176 L170 106" fill="none" stroke="#fff" strokeWidth={20} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - tick} />
      </svg>
      <div style={{ position: 'absolute', top: 760, left: 0, right: 0 }}>
        {t >= b(4) && <Reveal t={t} at={b(4)} text="Regulated." style={sf(140, 800)} align="center" dur={8} stagger={1} />}
      </div>
      <div style={{ position: 'absolute', top: 1040, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 30 }}>
        {['SECP licensed & regulated', 'PSX TREC holder 535', 'Licensed research entity'].map((x, i) => (
          <div key={x} style={{ display: 'flex', alignItems: 'center', gap: 18, ...enter(t, b(0.5 + i), 8, 24).style }}>
            <span style={{ width: 16, height: 16, borderRadius: 8, backgroundColor: A.green }} />
            <span style={sf(44, 600)}>{x}</span>
          </div>
        ))}
      </div>
    </Canvas>
  );
};

// =============================================================================
// 09 MONTAGE (bars 10–14, drop B) — five features, two beats each, whipping in on the
// beat; each graphic moves on the beats/8ths. Then a two-beat ticker blast and
// "All of PSX. One account." over candles printing on the 8ths.
// =============================================================================
type Gfx = React.FC<{ u: number }>; // u = frames since the feature's first beat

const MtsGfx: Gfx = ({ u }) => {
  const N = 8;
  const pts: [number, number][] = [];
  return (
    <svg width={960} height={900}>
      <text x={60} y={90} fontFamily="Inter" fontWeight={600} fontSize={30} fill={A.sub}>
        Buying power
      </text>
      <rect x={60} y={120} width={840} height={26} rx={13} fill={A.mist} />
      <rect x={60} y={120} width={840 * mixN(0.42, 1, ap(u, b(1), 8))} height={26} rx={13} fill={A.green} />
      {Array.from({ length: N }, (_, k) => {
        const at = b(k * 0.25) + 2; // one candle per 16th through the two beats
        const g = ap(u, at, 5);
        const up = seeded(k + 900) > 0.25;
        const x = 110 + k * 105;
        const y = 720 - k * 58 + (seeded(k + 910) - 0.5) * 40;
        if (g > 0) pts.push([x, y]);
        return <Candle key={k} x={x} y={y} w={48} body={(80 + seeded(k + 920) * 70) * g} wick={(150 + seeded(k + 930) * 60) * g} up={up} />;
      })}
      {pts.length > 1 && <path d={pts.map((p, i) => `${i ? 'L' : 'M'} ${p[0]} ${p[1]}`).join(' ')} fill="none" stroke={A.ink} strokeWidth={4} strokeDasharray="2 10" strokeLinecap="round" />}
    </svg>
  );
};

const VTradeGfx: Gfx = ({ u }) => {
  const qty = Math.round(500 * ap(u, 2, b(1) - 2, (n) => n) / 50) * 50;
  const press = u >= b(1) && u < b(1) + 6 ? 0.95 : 1;
  const done = enter(u, b(1) + 3, 6, 30);
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <p style={{ ...sf(30, 600, A.sub), position: 'absolute', left: 60, top: 60 }}>Order ticket</p>
      <p style={{ ...sf(72, 800), position: 'absolute', left: 60, top: 104 }}>OGDC</p>
      <div style={{ position: 'absolute', right: 60, top: 116, width: 300, height: 72, borderRadius: 20, backgroundColor: A.mist }}>
        <div style={{ position: 'absolute', left: 6, top: 6, width: 144, height: 60, borderRadius: 15, backgroundColor: A.green }} />
        <span style={{ ...sf(30, 700, '#fff'), position: 'absolute', left: 6, width: 144, top: 18, textAlign: 'center' }}>Buy</span>
        <span style={{ ...sf(30, 700, A.sub), position: 'absolute', left: 150, width: 144, top: 18, textAlign: 'center' }}>Sell</span>
      </div>
      {[
        ['Quantity', `${qty}`],
        ['Order type', 'Limit'],
      ].map(([k, v], i) => (
        <div key={k} style={{ position: 'absolute', left: 60, right: 60, top: 260 + i * 120, height: 100, borderRadius: 22, backgroundColor: A.mist }}>
          <span style={{ ...sf(32, 600, A.sub), position: 'absolute', left: 32, top: 32 }}>{k}</span>
          <span style={{ ...sf(40, 800), position: 'absolute', right: 32, top: 28, fontVariantNumeric: 'tabular-nums' }}>{v}</span>
        </div>
      ))}
      <div style={{ position: 'absolute', left: 60, right: 60, top: 540, height: 120, borderRadius: 60, backgroundColor: A.ink, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${press})` }}>
        <span style={sf(44, 700, '#fff')}>Buy OGDC</span>
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 720, display: 'flex', justifyContent: 'center', ...done.style }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '20px 34px', borderRadius: 999, backgroundColor: 'rgba(56,209,0,0.12)' }}>
          <Check p={1} size={48} />
          <span style={sf(36, 700, A.deep)}>Order placed</span>
        </div>
      </div>
    </div>
  );
};

const IPO_PRE = Array.from({ length: 20 }, (_, i) => 0.18 + (seeded(i + 950) - 0.5) * 0.04);
const IPO_POST = walk(20, 960, 1.2, 0.8).map((v) => 0.2 + v * 0.75);
const IpoGfx: Gfx = ({ u }) => {
  const launch = ap(u, b(1), b(1), (n) => n);
  const data = [...IPO_PRE, ...IPO_POST];
  const prog = mixN(0.5 * ap(u, 1, b(1) - 2, (n) => n), 1, launch);
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <div style={{ position: 'absolute', left: 60, top: 60, padding: '14px 26px', borderRadius: 999, border: `3px dashed ${A.green}`, ...enter(u, 0, 6, 20).style }}>
        <span style={sf(34, 800, A.deep)}>NEW LISTING</span>
      </div>
      <div style={{ position: 'absolute', left: 60, top: 200 }}>
        <LineChart id="ipo" data={data} w={840} h={560} prog={prog} stroke={7} grid />
      </div>
      <div style={{ position: 'absolute', left: 60 + 420, top: 190, width: 3, height: 580 * ap(u, b(1), 6), backgroundColor: A.ink, opacity: 0.5 }} />
      <span style={{ ...sf(26, 700, A.ink), position: 'absolute', left: 60 + 434, top: 196, opacity: ap(u, b(1), 6) }}>Listing day</span>
    </div>
  );
};

const RmGfx: Gfx = ({ u }) => {
  const m1 = enter(u, 2, 6, 30);
  const m2 = enter(u, b(1), 6, 30);
  const Bubble: React.FC<{ text: string; me?: boolean; style: React.CSSProperties }> = ({ text, me, style }) => (
    <div style={{ display: 'flex', justifyContent: me ? 'flex-end' : 'flex-start', ...style }}>
      <div style={{ maxWidth: 640, padding: '24px 34px', borderRadius: 36, backgroundColor: me ? A.green : A.mist }}>
        <span style={{ ...sf(38, 600, me ? '#fff' : A.ink), whiteSpace: 'normal' }}>{text}</span>
      </div>
    </div>
  );
  return (
    <div style={{ position: 'absolute', inset: 0 }}>
      <div style={{ position: 'absolute', left: 60, top: 60, display: 'flex', alignItems: 'center', gap: 24 }}>
        <div style={{ width: 110, height: 110, borderRadius: 55, background: 'linear-gradient(160deg,#45e01f,#1f8a00)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width={60} height={60} viewBox="0 0 60 60">
            <circle cx={30} cy={22} r={13} fill="#fff" />
            <path d="M6 58 C 8 40, 52 40, 54 58 Z" fill="#fff" />
          </svg>
        </div>
        <div>
          <p style={sf(42, 800)}>Your RM</p>
          <p style={{ ...sf(28, 500, A.sub), marginTop: 6 }}>Floret Capitals · online</p>
        </div>
      </div>
      <div style={{ position: 'absolute', left: 60, right: 60, top: 260, display: 'flex', flexDirection: 'column', gap: 26 }}>
        <Bubble text="Hi! I'm your relationship manager." style={m1.style} />
        <Bubble text="Let's plan your first PSX trade." style={m2.style} />
      </div>
    </div>
  );
};

const SECTORS = ['Banks', 'Cement', 'Energy', 'Tech', 'Fertilizer', 'Power'];
const SectorGfx: Gfx = ({ u }) => (
  <div style={{ position: 'absolute', inset: 0 }}>
    {SECTORS.map((s, i) => {
      const g = ap(u, b(i * 0.25) + 1, 6); // one bar per 16th
      const v = 0.45 + 0.55 * seeded(i + 980);
      return (
        <div key={s} style={{ position: 'absolute', left: 60, right: 60, top: 70 + i * 132, height: 100 }}>
          <span style={{ ...sf(34, 700), position: 'absolute', left: 0, top: 30, width: 220 }}>{s}</span>
          <div style={{ position: 'absolute', left: 240, right: 0, top: 30, height: 40, borderRadius: 20, backgroundColor: A.mist }}>
            <div style={{ width: `${v * 100 * g}%`, height: 40, borderRadius: 20, backgroundColor: i % 3 === 1 ? A.deep : A.green }} />
          </div>
        </div>
      );
    })}
  </div>
);

const FEATURES: { eyebrow: string; title: string; line: string; G: Gfx }[] = [
  { eyebrow: 'MARGIN TRADING SYSTEM', title: 'MTS', line: 'More buying power for your PSX trades.', G: MtsGfx },
  { eyebrow: 'ONLINE TRADING', title: 'V Trade', line: 'Buy and sell PSX stocks from anywhere.', G: VTradeGfx },
  { eyebrow: 'INITIAL PUBLIC OFFERINGS', title: 'IPOs', line: 'New listings, analysed before you apply.', G: IpoGfx },
  { eyebrow: 'RELATIONSHIP MANAGERS', title: 'Your RM', line: 'A real person on your side.', G: RmGfx },
  { eyebrow: 'SECTOR COVERAGE', title: 'Every sector', line: 'Banks, cement, energy, tech and more.', G: SectorGfx },
];

const TAPE = [
  ['OGDC', '+1.84%', true],
  ['HBL', '−0.45%', false],
  ['LUCK', '+0.92%', true],
  ['SYS', '+2.10%', true],
  ['ENGRO', '+0.67%', true],
  ['MARI', '−1.12%', false],
  ['UBL', '+0.58%', true],
  ['PPL', '+1.31%', true],
] as const;
const RISE = Array.from({ length: 16 }, (_, i) => ({ up: seeded(i + 600) > 0.22, b: 50 + seeded(i + 610) * 70 }));

export const Montage: React.FC<{ t: number }> = ({ t }) => {
  const nF = FEATURES.length;
  const tickerAt = b(nF * 2);
  const allAt = b(12);
  return (
    <Canvas tone="mist">
      {FEATURES.map((f, i) => {
        const s = b(i * 2);
        const e = s + b(2);
        if (t < s - 1 || t > e + 7) return null;
        const pin = ap(t, s, 6);
        const pout = ap(t, e, 6);
        const x = (1 - pin) * 300 - pout * 300;
        const blur = (1 - pin) * 14 + pout * 14;
        const op = Math.min(pin * 1.5, 1 - pout);
        const u = t - s;
        return (
          <div key={f.title} style={{ position: 'absolute', inset: 0, transform: `translateX(${x}px)`, filter: blur > 0.3 ? `blur(${blur}px)` : undefined, opacity: op }}>
            <p style={{ ...sf(28, 700, A.deep), position: 'absolute', left: 70, top: 220, letterSpacing: '0.1em' }}>{f.eyebrow}</p>
            <p style={{ ...sf(f.title.length > 8 ? 120 : 150, 800), position: 'absolute', left: 64, top: 268 }}>{f.title}</p>
            <p style={{ ...sf(42, 500, A.sub), position: 'absolute', left: 70, top: 452 }}>{f.line}</p>
            <div style={{ position: 'absolute', left: 60, top: 600, width: 960, height: 900, borderRadius: 44, backgroundColor: '#fff', boxShadow: SHADOW, overflow: 'hidden' }}>
              <f.G u={u} />
            </div>
            <p style={{ ...sf(24, 700, A.faint), position: 'absolute', right: 70, top: 226, letterSpacing: '0.08em' }}>
              0{i + 1} / 0{nF}
            </p>
          </div>
        );
      })}
      {/* ticker blast: rows of the tape whip across on 16ths */}
      {t >= tickerAt - 1 && t < allAt + 8 && (
        <div style={{ position: 'absolute', inset: 0, opacity: 1 - ap(t, allAt, 6) }}>
          {Array.from({ length: 9 }, (_, r) => {
            const inn = ap(t, tickerAt + r * (b(0.25) / 2), 5);
            const dir = r % 2 ? 1 : -1;
            const x = dir * (t - tickerAt) * 26 - 400 + (1 - inn) * dir * -600;
            return (
              <div key={r} style={{ position: 'absolute', left: x, top: 180 + r * 175, display: 'flex', gap: 34, opacity: inn, whiteSpace: 'nowrap' }}>
                {[...TAPE, ...TAPE].map(([s, c, up], k) => (
                  <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <span style={sf(72, 800, r % 3 === 1 ? A.deep : A.ink)}>{s}</span>
                    <Pill up={up} text={c} size={34} />
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      )}
      {t >= allAt && (
        <>
          <svg width={1080} height={1920} style={{ position: 'absolute', inset: 0 }}>
            {RISE.map((c, i) => {
              const k = ap(t, allAt + b(Math.floor(i / 2) * 0.5) + 1, 5); // two candles per 8th
              return <Candle key={i} x={60 + i * 64} y={1700 - i * 34} w={34} body={c.b * k} wick={(c.b + 60) * k} up={c.up} opacity={0.9} />;
            })}
          </svg>
          <div style={{ position: 'absolute', top: 560, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
            <Reveal t={t} at={allAt} text="All of PSX." style={sf(132, 800)} align="center" dur={8} stagger={1.2} />
            <Reveal t={t} at={allAt + b(1)} text="One account." style={sf(132, 800, A.deep)} align="center" dur={8} stagger={1.2} />
          </div>
        </>
      )}
    </Canvas>
  );
};

// =============================================================================
// 10 CTA (bars 14–17) — fast: "Open your PSX account." on the hit, the button on the "and"
// of 1, the pointer taps it on beat 2, lockup on 2½, licence line on 3, disclaimer on 3½ —
// all inside one bar — then it holds while the music's tail rings out.
// =============================================================================
export const DISCLAIMER = 'Investments in securities are subject to market risks. Please read all relevant documents carefully before investing.';

export const Cta: React.FC<{ t: number }> = ({ t }) => {
  const btn = enter(t, b(0.5), 7, 50);
  const tap = t - b(2);
  const press = tap >= 0 && tap < 8 ? 1 - Math.sin((tap / 8) * Math.PI) * 0.05 : 1;
  const cur = ap(t, b(1), b(1) - 1);
  const cx = mixN(930, 640, cur);
  const cy = mixN(1560, 1040, cur);
  const curOut = 1 - ap(t, b(3), 6);
  const outro = enter(t, b(2.5), 8, 40);
  const lic = enter(t, b(3), 8, 30);
  const disc = enter(t, b(3.5), 8, 20);
  return (
    <Canvas>
      <div style={{ position: 'absolute', top: 210, left: 0, right: 0, display: 'flex', justifyContent: 'center', ...outro.style }}>
        <Img src={LOGO.fullOnLight} style={{ width: 600, height: 200 }} />
      </div>
      <div style={{ position: 'absolute', top: 520, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
        <Reveal t={t} at={0} text="Open your" style={sf(124, 800)} align="center" dur={8} stagger={1.2} />
        <Reveal t={t} at={4} text="PSX account." style={sf(132, 800, A.deep)} align="center" dur={8} stagger={1.2} />
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
        {tap >= 0 && tap < 20 && (
          <div style={{ position: 'absolute', left: 370 - tap * 24, top: 75 - tap * 24, width: tap * 48, height: tap * 48, borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.18)', opacity: 1 - tap / 20 }} />
        )}
        <span style={sf(50, 700, '#fff')}>Open account</span>
        <span style={sf(50, 700, A.green)}>→</span>
      </div>
      <p style={{ ...sf(44, 600, A.ink), position: 'absolute', top: 1150, left: 0, right: 0, textAlign: 'center', opacity: btn.p }}>flostocks.com</p>
      {cur > 0 && curOut > 0 && (
        <svg width={60} height={80} viewBox="0 0 60 80" style={{ position: 'absolute', left: cx, top: cy, opacity: curOut, transform: `scale(${tap >= 0 && tap < 8 ? 0.9 : 1})`, transformOrigin: '0 0' }}>
          <path d="M4 4 L4 64 L20 50 L31 74 L42 69 L31 46 L52 46 Z" fill="#111" stroke="#fff" strokeWidth={4} strokeLinejoin="round" />
        </svg>
      )}
      <div style={{ position: 'absolute', top: 1300, left: 90, right: 90, ...lic.style }}>
        <div style={{ height: 2, backgroundColor: A.line }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 18 }}>
          {['SECP LICENSED', 'PSX TREC 535', 'FLORET CAPITALS'].map((x) => (
            <span key={x} style={{ ...sf(22, 600, A.sub), letterSpacing: '0.08em' }}>
              {x}
            </span>
          ))}
        </div>
      </div>
      <p style={{ ...sf(28, 400, A.sub), whiteSpace: 'normal', lineHeight: 1.45, letterSpacing: 0, position: 'absolute', top: 1420, left: 110, right: 110, textAlign: 'center', ...disc.style }}>
        {DISCLAIMER}
      </p>
    </Canvas>
  );
};
