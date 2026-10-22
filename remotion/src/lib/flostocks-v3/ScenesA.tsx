// v3 showreel, first half. Scene-local frame `t`; beats via b(n) (121 BPM).
// Copy is taken from flostocks.com. Tickers/percentages are illustrative UI only.
import React from 'react';
import { AbsoluteFill, Img, interpolate } from 'remotion';
import { evolvePath } from '@remotion/paths';
import { BookOpen, Check, FileText, IdCard, Play, ShieldCheck, UserRound } from 'lucide-react';
import { FS, FS_BODY, FS_EASE, FS_MONO, FsWatermark, LOGO, fsHeadline } from '../flostocks';
import { Confetti, OutlineMarquee, Rays, Reveal, Slam, lerp, pulse, seeded, sp, SNAP } from '../flostocks-v2/fx';
import { BEATF, b } from './timing';
import { Bg, Foot, Head, Tag, card, pop } from './kit';

// =============================================================================
// IGNITE — the drop: logo slam, shockwaves, positioning line
// =============================================================================
const Shock: React.FC<{ t: number; at: number; cy: number }> = ({ t, at, cy }) => {
  const d = t - at;
  if (d < 0 || d > 34) return null;
  const r = interpolate(d, [0, 34], [80, 1100]);
  return (
    <div
      style={{
        position: 'absolute',
        left: 540 - r,
        top: cy - r,
        width: r * 2,
        height: r * 2,
        borderRadius: '50%',
        border: `${interpolate(d, [0, 34], [26, 2])}px solid ${FS.green}`,
        opacity: interpolate(d, [0, 34], [0.8, 0]),
      }}
    />
  );
};

export const Ignite: React.FC<{ t: number }> = ({ t }) => {
  const s = sp(t, 0, { damping: 11, stiffness: 230, mass: 0.6 });
  const kick = pulse(t, 0, BEATF);
  const flash = lerp(t, 0, 10, 1, 0);
  const sweep = lerp(t, 8, 30, -40, 140, (n) => n);
  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      <Bg t={t} seed={200} tint={1.3} />
      <Rays t={t * 1.4} color={FS.green} opacity={0.09} cy="33%" />
      <OutlineMarquee t={t} word="FLOSTOCKS" color={FS.green} opacity={0.07} />
      {[0, 2, 4, 6].map((n) => (
        <Shock key={n} t={t} at={b(n)} cy={630} />
      ))}
      <div
        style={{
          position: 'absolute',
          left: 110,
          top: 490,
          width: 860,
          height: 287,
          transform: `scale(${interpolate(s, [0, 1], [3.2, 1]) * (1 + kick * 0.035)}) rotate(${(1 - s) * -10}deg)`,
          opacity: Math.min(1, s * 3),
          filter: s < 0.9 ? `blur(${(1 - s) * 10}px)` : undefined,
        }}
      >
        <Img src={LOGO.fullOnLight} style={{ width: 860, height: 287 }} />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(100deg, transparent ${sweep - 16}%, rgba(255,255,255,0.95) ${sweep}%, transparent ${sweep + 16}%)`,
            WebkitMaskImage: `url(${LOGO.fullOnLight})`,
            maskImage: `url(${LOGO.fullOnLight})`,
            WebkitMaskSize: '100% 100%',
            maskSize: '100% 100%',
          }}
        />
      </div>
      <div style={{ position: 'absolute', top: 880, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Reveal t={t} at={b(2)}>
          <p style={{ margin: 0, fontFamily: FS_MONO, fontWeight: 600, fontSize: 40, letterSpacing: '0.36em', color: FS.greenDeep }}>THE OFFICIAL</p>
        </Reveal>
        <Slam t={t} at={b(3)} rot={-6}>
          <h1 style={{ ...fsHeadline(138, FS.green), marginTop: 10 }}>PSX DIVISION</h1>
        </Slam>
        <Slam t={t} at={b(4)} rot={6}>
          <h1 style={{ ...fsHeadline(84, FS.ink) }}>of Floret Capitals</h1>
        </Slam>
        <div style={{ height: 7, width: 640 * sp(t, b(5), SNAP), backgroundColor: FS.green, borderRadius: 4, marginTop: 36 }} />
        <Reveal t={t} at={b(5.5)} style={{ marginTop: 26 }}>
          <p style={{ margin: 0, fontFamily: FS_BODY, fontWeight: 400, fontSize: 40, color: FS.gray }}>Pakistan&apos;s modern gateway to the stock market</p>
        </Reveal>
      </div>
      <AbsoluteFill style={{ backgroundColor: FS.green, opacity: flash * 0.85 }} />
    </AbsoluteFill>
  );
};

// =============================================================================
// WALL — "TRADE THE PAKISTAN STOCK EXCHANGE" over a flipping ticker wall
// =============================================================================
const SYMS = ['OGDC', 'LUCK', 'HBL', 'SYS', 'ENGRO', 'MARI', 'PPL', 'UBL', 'MCB', 'FFC', 'EFERT', 'HUBC', 'TRG', 'PSO', 'BAHL', 'MEBL', 'DGKC', 'NBP', 'POL', 'ATRL'];
const TILES = Array.from({ length: 6 * 11 }, (_, i) => {
  const up = seeded(i + 11) > 0.3;
  return { sym: SYMS[i % SYMS.length], chg: `${up ? '+' : '−'}${(0.2 + seeded(i + 40) * 2.6).toFixed(2)}%`, up, d: seeded(i + 90) };
});

export const Wall: React.FC<{ t: number }> = ({ t }) => {
  const drift = (t * 1.6) % 170;
  return (
    <AbsoluteFill style={{ overflow: 'hidden', backgroundColor: FS.paper }}>
      <div style={{ position: 'absolute', left: -60, top: -170 - drift, display: 'grid', gridTemplateColumns: 'repeat(6, 190px)', gap: 14, transform: 'rotate(-8deg)', transformOrigin: '50% 50%' }}>
        {TILES.map((x, i) => {
          const at = x.d * b(1);
          const f = sp(t, at, { damping: 14, stiffness: 200, mass: 0.5 });
          return (
            <div
              key={i}
              style={{
                height: 156,
                borderRadius: 22,
                backgroundColor: x.up ? 'rgba(56,209,0,0.1)' : 'rgba(226,59,46,0.07)',
                border: `1.5px solid ${x.up ? 'rgba(56,209,0,0.3)' : 'rgba(226,59,46,0.2)'}`,
                padding: '22px 20px',
                transform: `perspective(600px) rotateX(${(1 - f) * 90}deg)`,
                opacity: f,
              }}
            >
              <p style={{ margin: 0, fontFamily: FS_MONO, fontWeight: 600, fontSize: 32, color: FS.ink }}>{x.sym}</p>
              <p style={{ margin: '10px 0 0', fontFamily: FS_MONO, fontWeight: 600, fontSize: 30, color: x.up ? FS.rise : FS.fall }}>
                {x.up ? '▲' : '▼'} {x.chg}
              </p>
            </div>
          );
        })}
      </div>
      <AbsoluteFill style={{ background: 'radial-gradient(620px 560px at 50% 50%, rgba(255,255,255,0.97) 45%, rgba(255,255,255,0.4) 100%)' }} />
      <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <Slam t={t} at={0} rot={-7}>
          <h1 style={{ ...fsHeadline(110, FS.ink) }}>Trade the</h1>
        </Slam>
        <Slam t={t} at={b(1)} rot={7}>
          <h1 style={{ ...fsHeadline(110, FS.green), textAlign: 'center' }}>Pakistan Stock</h1>
        </Slam>
        <Slam t={t} at={b(1.5)} rot={-7}>
          <h1 style={{ ...fsHeadline(110, FS.green) }}>Exchange</h1>
        </Slam>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 30, ...pop(t, b(2.5), 0, 40).style }}>
          <div style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: FS.fall, boxShadow: `0 0 ${16 * (0.5 + 0.5 * Math.sin(t * 0.4))}px ${FS.fall}` }} />
          <span style={{ fontFamily: FS_MONO, fontWeight: 600, fontSize: 36, color: FS.ink, letterSpacing: '0.1em' }}>PSX · LIVE</span>
        </div>
      </AbsoluteFill>
      <FsWatermark width={1080} onLight />
    </AbsoluteFill>
  );
};

// =============================================================================
// 01 ACCOUNT — fast digital onboarding stepper
// =============================================================================
const STEPS = [
  { Icon: IdCard, label: 'CNIC details' },
  { Icon: UserRound, label: 'Personal info' },
  { Icon: FileText, label: 'Documents' },
  { Icon: ShieldCheck, label: 'Account approved' },
] as const;

export const Account: React.FC<{ t: number }> = ({ t }) => {
  const done = (k: number) => b(2 + k);
  const prog = lerp(t, b(1.6), b(5.2), 0, 1, FS_EASE.inOut);
  const ready = sp(t, b(6), { damping: 12, stiffness: 200, mass: 0.6 });
  const c = pop(t, b(1), 0, 300);
  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      <Bg t={t} seed={400} />
      <Tag t={t} n="01" label="DIGITAL ONBOARDING" />
      <Head t={t} lines={[{ text: 'Open your' }, { text: 'PSX account', color: FS.green }]} />
      <div style={{ ...card({ position: 'absolute', left: 90, width: 900, top: 620, padding: '44px 50px' }), ...c.style }}>
        <div style={{ position: 'absolute', left: 50 + 42, top: 44 + 75, width: 6, height: 3 * 150, borderRadius: 3, backgroundColor: '#E3E8E4' }}>
          <div style={{ width: 6, height: `${prog * 100}%`, borderRadius: 3, backgroundColor: FS.green }} />
        </div>
        {STEPS.map((st, k) => {
          const d = t >= done(k);
          const tick = sp(t, done(k), { damping: 10, stiffness: 260, mass: 0.5 });
          return (
            <div key={st.label} style={{ display: 'flex', alignItems: 'center', gap: 34, height: 150 }}>
              <div
                style={{
                  width: 90,
                  height: 90,
                  borderRadius: 45,
                  backgroundColor: d ? FS.green : '#F1F4F2',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transform: `scale(${d ? 0.85 + tick * 0.15 : 1})`,
                  position: 'relative',
                  zIndex: 2,
                }}
              >
                {d ? <Check size={50} color={FS.paper} strokeWidth={3.4} /> : <st.Icon size={44} color={FS.gray} strokeWidth={2} />}
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontFamily: FS_BODY, fontWeight: 700, fontSize: 46, color: d ? FS.ink : '#9AA39D' }}>{st.label}</p>
                <p style={{ margin: '4px 0 0', fontFamily: FS_MONO, fontWeight: 500, fontSize: 26, color: d ? FS.greenDeep : '#B8BFBA' }}>
                  {d ? 'DONE' : `STEP ${k + 1}`}
                </p>
              </div>
            </div>
          );
        })}
      </div>
      {/* success banner */}
      <div
        style={{
          position: 'absolute',
          left: 160,
          right: 160,
          top: 1355,
          height: 120,
          borderRadius: 60,
          backgroundColor: FS.green,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 18,
          boxShadow: '0 24px 60px rgba(31,122,0,0.3)',
          transform: `scale(${ready})`,
        }}
      >
        <Check size={54} color={FS.ink} strokeWidth={3.2} />
        <span style={{ fontFamily: FS_BODY, fontWeight: 700, fontSize: 48, color: FS.ink }}>Account ready</span>
      </div>
      <Confetti t={t} at={b(6)} x={540} y={1415} />
      <Foot t={t} at={b(6.5)} top={1520} text="Opened & maintained through Floret Capitals" />
      <FsWatermark width={1080} onLight />
    </AbsoluteFill>
  );
};

// =============================================================================
// 02 BOOTCAMP — six free video lessons + ebook
// =============================================================================
export const Bootcamp: React.FC<{ t: number }> = ({ t }) => {
  const stamp = sp(t, b(6), SNAP);
  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      <Bg t={t} seed={600} />
      <Tag t={t} n="02" label="PSX BOOTCAMP" />
      <Head t={t} lines={[{ text: 'Learn the market' }, { text: 'for free', color: FS.green }]} />
      <div style={{ position: 'absolute', left: 70, top: 620, width: 940, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 26 }}>
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const p = pop(t, b(1.5 + i * 0.5), (i % 3 - 1) * 200, 260);
          const fill = lerp(t, b(2 + i * 0.5), b(4.5 + i * 0.4), 0, 1, FS_EASE.inOut);
          const hot = pulse(t, b(1.5 + i * 0.5), BEATF * 4);
          return (
            <div key={i} style={{ ...card({ borderRadius: 30, overflow: 'hidden' }), ...p.style }}>
              <div
                style={{
                  height: 190,
                  background: `linear-gradient(135deg, ${FS.green} 0%, ${FS.greenDeep} 100%)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                }}
              >
                <div style={{ width: 84, height: 84, borderRadius: 42, backgroundColor: 'rgba(255,255,255,0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `scale(${1 + hot * 0.12})` }}>
                  <Play size={40} color={FS.greenDeep} fill={FS.greenDeep} />
                </div>
                <span style={{ position: 'absolute', left: 16, top: 12, fontFamily: FS_MONO, fontWeight: 600, fontSize: 24, color: 'rgba(255,255,255,0.9)' }}>0{i + 1}</span>
              </div>
              <div style={{ padding: '18px 20px 22px' }}>
                <p style={{ margin: 0, fontFamily: FS_BODY, fontWeight: 700, fontSize: 30, color: FS.ink }}>Lesson {i + 1}</p>
                <div style={{ marginTop: 12, height: 8, borderRadius: 4, backgroundColor: '#E6ECE8' }}>
                  <div style={{ height: 8, width: `${fill * 100}%`, borderRadius: 4, backgroundColor: FS.green }} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {/* ebook */}
      <div
        style={{
          ...card({ position: 'absolute', left: 120, top: 1260, width: 440, height: 150, borderRadius: 30, display: 'flex', alignItems: 'center', gap: 24, padding: '0 30px' }),
          ...pop(t, b(4.5), -400, 0).style,
        }}
      >
        <div style={{ width: 86, height: 86, borderRadius: 20, backgroundColor: FS.ink, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <BookOpen size={46} color={FS.green} />
        </div>
        <div>
          <p style={{ margin: 0, fontFamily: FS_BODY, fontWeight: 700, fontSize: 36, color: FS.ink }}>PSX eBook</p>
          <p style={{ margin: 0, fontFamily: FS_BODY, fontSize: 26, color: FS.gray }}>+ reading guides</p>
        </div>
      </div>
      <div
        style={{
          position: 'absolute',
          left: 650,
          top: 1205,
          width: 270,
          height: 270,
          borderRadius: '50%',
          border: `10px solid ${FS.green}`,
          backgroundColor: 'rgba(255,255,255,0.95)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          transform: `scale(${2.6 - stamp * 1.6}) rotate(${-12 + (1 - stamp) * 30}deg)`,
          opacity: Math.min(1, stamp * 2),
          boxShadow: '0 18px 46px rgba(31,122,0,0.3)',
        }}
      >
        <span style={{ ...fsHeadline(88, FS.green), lineHeight: 1 }}>100%</span>
        <span style={{ ...fsHeadline(64, FS.ink), lineHeight: 1 }}>FREE</span>
      </div>
      <Foot t={t} at={b(6.5)} top={1510} text="6 on-demand video lessons for beginners" />
      <FsWatermark width={1080} onLight />
    </AbsoluteFill>
  );
};

// =============================================================================
// 03 ANALYZER — company scorecard (illustrative, no real company)
// =============================================================================
const METRICS = [
  { label: 'Valuation', v: 0.78 },
  { label: 'Financial health', v: 0.86 },
  { label: 'Growth', v: 0.64 },
  { label: 'Dividends', v: 0.72 },
] as const;
const RING = 'M 170 20 A 150 150 0 1 1 169.99 20';

export const Analyzer: React.FC<{ t: number }> = ({ t }) => {
  const c = pop(t, b(1), 0, 320);
  const ring = lerp(t, b(1.5), b(5), 0, 0.82, FS_EASE.inOut);
  const { strokeDasharray, strokeDashoffset } = evolvePath(ring, RING);
  const scan = lerp(t, b(1), b(7), 0, 1, (n) => n);
  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      <Bg t={t} seed={800} />
      <Tag t={t} n="03" label="PSX ANALYZER" />
      <Head t={t} lines={[{ text: 'Score any' }, { text: 'listed company', color: FS.green }]} />
      <div style={{ ...card({ position: 'absolute', left: 70, width: 940, top: 620, height: 800, padding: '40px 46px', overflow: 'hidden' }), ...c.style }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ margin: 0, fontFamily: FS_MONO, fontWeight: 600, fontSize: 30, color: FS.gray }}>COMPANY SCORECARD</p>
            <p style={{ margin: '4px 0 0', fontFamily: FS_BODY, fontWeight: 700, fontSize: 44, color: FS.ink }}>Any PSX-listed company</p>
          </div>
          <span style={{ fontFamily: FS_MONO, fontSize: 22, color: '#A8B0AB', border: '1px solid #D7DDD9', borderRadius: 10, padding: '6px 12px' }}>ILLUSTRATIVE</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 46, marginTop: 40 }}>
          <svg width="340" height="340" viewBox="0 0 340 340">
            <circle cx="170" cy="170" r="150" fill="none" stroke="#EAF0EC" strokeWidth="26" />
            <path d={RING} fill="none" stroke={FS.green} strokeWidth="26" strokeLinecap="round" strokeDasharray={strokeDasharray} strokeDashoffset={strokeDashoffset} />
            <text x="170" y="182" textAnchor="middle" fontFamily={FS_BODY} fontWeight={800} fontSize="92" fill={FS.ink}>
              {Math.round(ring * 100)}
            </text>
            <text x="170" y="236" textAnchor="middle" fontFamily={FS_MONO} fontWeight={600} fontSize="26" fill={FS.greenDeep}>
              RATING
            </text>
          </svg>
          <div style={{ flex: 1 }}>
            {METRICS.map((m, i) => {
              const at = b(2 + i * 0.75);
              const v = lerp(t, at, at + b(1.5), 0, m.v, FS_EASE.out);
              return (
                <div key={m.label} style={{ marginBottom: 30, ...pop(t, at, 200, 0).style }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ fontFamily: FS_BODY, fontWeight: 600, fontSize: 32, color: FS.ink }}>{m.label}</span>
                    <span style={{ fontFamily: FS_MONO, fontWeight: 600, fontSize: 30, color: FS.greenDeep }}>{Math.round(v * 100)}</span>
                  </div>
                  <div style={{ marginTop: 10, height: 14, borderRadius: 7, backgroundColor: '#EAF0EC' }}>
                    <div style={{ height: 14, width: `${v * 100}%`, borderRadius: 7, background: `linear-gradient(90deg, ${FS.mint}, ${FS.green})` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 18, marginTop: 40 }}>
          {['P/E', 'P/B', 'Div. yield', 'ROE'].map((k, i) => (
            <div key={k} style={{ flex: 1, padding: '18px 0', borderRadius: 20, backgroundColor: '#F4F8F5', textAlign: 'center', ...pop(t, b(4.5 + i * 0.5), 0, 60).style }}>
              <span style={{ fontFamily: FS_MONO, fontWeight: 600, fontSize: 30, color: FS.ink }}>{k}</span>
            </div>
          ))}
        </div>
        {/* scanning line */}
        <div style={{ position: 'absolute', left: 0, right: 0, top: `${scan * 100}%`, height: 120, background: 'linear-gradient(180deg, transparent, rgba(56,209,0,0.12), transparent)' }} />
      </div>
      <Foot t={t} at={b(6)} top={1480} text="Valuation metrics · financial insights · investment rating" />
      <FsWatermark width={1080} onLight />
    </AbsoluteFill>
  );
};

// =============================================================================
// 04 RESEARCH — fanning research notes + regional-first badge
// =============================================================================
const Doc: React.FC<{ t: number; at: number; rot: number; x: number; title: string; chart: boolean }> = ({ t, at, rot, x, title, chart }) => {
  const s = sp(t, at, { damping: 13, stiffness: 170, mass: 0.7 });
  return (
    <div
      style={{
        ...card({ position: 'absolute', left: 540 - 210 + x, top: 640, width: 420, height: 560, borderRadius: 24, overflow: 'hidden' }),
        transform: `translateY(${(1 - s) * 700}px) rotate(${rot * s}deg)`,
        transformOrigin: '50% 120%',
      }}
    >
      <div style={{ height: 96, backgroundColor: FS.green, display: 'flex', alignItems: 'center', padding: '0 26px', gap: 14 }}>
        <FileText size={40} color={FS.ink} />
        <span style={{ fontFamily: FS_MONO, fontWeight: 600, fontSize: 26, color: FS.ink }}>FLORET RESEARCH</span>
      </div>
      <div style={{ padding: '26px 26px' }}>
        <p style={{ margin: 0, fontFamily: FS_BODY, fontWeight: 800, fontSize: 36, color: FS.ink }}>{title}</p>
        {[0.95, 0.8, 0.9, 0.6].map((w, i) => (
          <div key={i} style={{ marginTop: 18, height: 12, width: `${w * 100}%`, borderRadius: 6, backgroundColor: '#E7ECE9' }} />
        ))}
        {chart && (
          <div style={{ marginTop: 26, display: 'flex', alignItems: 'flex-end', gap: 12, height: 150 }}>
            {[0.4, 0.55, 0.5, 0.7, 0.62, 0.85].map((h, i) => (
              <div key={i} style={{ flex: 1, height: `${h * 100 * sp(t, at + 8 + i * 2)}%`, borderRadius: 6, backgroundColor: i === 5 ? FS.green : '#CDEFC0' }} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export const Research: React.FC<{ t: number }> = ({ t }) => {
  const badge = sp(t, b(4), SNAP);
  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      <Bg t={t} seed={1000} />
      <Tag t={t} n="04" label="FLORET RESEARCH DESK" />
      <Head t={t} lines={[{ text: 'Equity notes' }, { text: '& IPO analysis', color: FS.green }]} />
      <Doc t={t} at={b(1)} rot={-13} x={-210} title="Sector outlook" chart={false} />
      <Doc t={t} at={b(1.5)} rot={12} x={210} title="IPO analysis" chart={false} />
      <Doc t={t} at={b(2)} rot={0} x={0} title="Equity note" chart />
      <div
        style={{
          position: 'absolute',
          left: 80,
          right: 80,
          top: 1290,
          borderRadius: 34,
          backgroundColor: FS.ink,
          padding: '30px 40px',
          textAlign: 'center',
          transform: `scale(${interpolate(badge, [0, 1], [2.2, 1])}) rotate(${(1 - badge) * -6}deg)`,
          opacity: Math.min(1, badge * 2),
          boxShadow: '0 26px 60px rgba(10,14,10,0.3)',
        }}
      >
        <p style={{ margin: 0, fontFamily: FS_MONO, fontWeight: 600, fontSize: 28, letterSpacing: '0.12em', color: FS.green }}>A REGIONAL FIRST</p>
        <p style={{ margin: '8px 0 0', fontFamily: FS_BODY, fontWeight: 700, fontSize: 40, color: FS.paper, lineHeight: 1.2 }}>
          The first licensed research entity in Northern Pakistan
        </p>
      </div>
      <FsWatermark width={1080} onLight />
    </AbsoluteFill>
  );
};
