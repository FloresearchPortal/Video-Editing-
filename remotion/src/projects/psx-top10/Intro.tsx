// 1. Intro (beats 0-8): SaaS show-reel open, Pakistan Stock Exchange theme.
//   b0  a "PSX Live" dashboard window springs in, its chart drawing
//   b1  a cursor clicks "Show Top 10"  ->  the button's green floods the frame (zoom-through)
//   b2  the 10 tickers burst out as pills on green  ->  b3.5 they are pulled back to the centre
//   b4  "TOP / 10" slams in (slot-roll digits, shockwave), tickers tapes run, pulses on each beat
//   b7.25 the green panel slides up and off, revealing the title underneath
import React from 'react';
import { AbsoluteFill, spring, useCurrentFrame } from 'remotion';
import { C, E, FONT, asset, fmtBn, mix, ramp } from './theme';
import { bf, FPB, FPS, S, TOP } from './timeline';

const W = 1080, H = 1920;
const I = S.intro;
const sp = (f: number, at: number, cfg = { damping: 14, stiffness: 160, mass: 0.7 }) => spring({ frame: f - at, fps: FPS, config: cfg });

// decorative chart path for the window (no labels / numbers)
const CHART = (() => {
  const pts: [number, number][] = [];
  let s = 11;
  const r = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  for (let i = 0; i <= 40; i++) {
    const t = i / 40;
    pts.push([t * 800, 230 - t * 150 - 26 * Math.sin(t * 8) + (r() - 0.5) * 26]);
  }
  return pts;
})();

const Cursor: React.FC<{ x: number; y: number; press: number }> = ({ x, y, press }) => (
  <svg width={70} height={84} viewBox="0 0 28 34" style={{ position: 'absolute', left: x - 6, top: y - 4, transform: `scale(${1 - 0.14 * press})`, transformOrigin: '6px 4px', filter: 'drop-shadow(0 8px 14px rgba(0,0,0,0.28))' }}>
    <path d="M3 2 L3 26 L9 20.5 L13 30 L17.5 28 L13.5 18.8 L21.5 18.8 Z" fill={C.ink} stroke="#fff" strokeWidth={2} strokeLinejoin="round" />
  </svg>
);

const Window: React.FC<{ f: number }> = ({ f }) => {
  const enter = sp(f, -5, { damping: 13, stiffness: 120, mass: 0.8 });
  const draw = ramp(f, 0, bf(1.3), E.inOut);
  const n = Math.max(1, Math.round(draw * (CHART.length - 1)));
  const pts = CHART.slice(0, n + 1);
  const d = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
  const head = pts[pts.length - 1];
  const click = bf(I.click);
  const press = ramp(f, click - 3, click, E.inOut) * (1 - ramp(f, click + 1, click + 6));
  const push = ramp(f, click + 2, bf(I.burst), E.in); // push-in toward the button
  const btn = { x: 540, y: 1250 }; // button centre (screen)
  const cur = {
    x: mix(1010, btn.x + 40, ramp(f, bf(0.25), click - 2, E.inOut)),
    y: mix(1640, btn.y + 14, ramp(f, bf(0.25), click - 2, E.inOut)),
  };
  return (
    <>
      <div style={{
        position: 'absolute', left: 80, top: 650, width: 920, height: 700, borderRadius: 40, background: '#fff',
        boxShadow: '0 40px 120px rgba(17,17,17,0.16), 0 0 0 2px #E7EBE6', overflow: 'hidden',
        transformOrigin: `${btn.x - 80}px ${btn.y - 650}px`,
        transform: `perspective(1600px) translateY(${(1 - enter) * 220}px) rotateX(${(1 - enter) * 24}deg) scale(${mix(0.78, 1, enter) * mix(1, 1.9, push)})`,
        opacity: ramp(f, -5, 2, E.inOut),
      }}>
        {/* window chrome */}
        <div style={{ height: 84, display: 'flex', alignItems: 'center', padding: '0 34px', gap: 14, borderBottom: '2px solid #EEF1ED' }}>
          {['#E6E9E5', '#E6E9E5', '#E6E9E5'].map((c, i) => <span key={i} style={{ width: 20, height: 20, borderRadius: 10, background: c }} />)}
          <span style={{ marginLeft: 22, display: 'inline-flex', alignItems: 'center', gap: 12, padding: '8px 22px', borderRadius: 30, background: '#F2F6F0', fontFamily: FONT.mono, fontWeight: 700, fontSize: 24, color: C.ink, letterSpacing: 1 }}>
            <span style={{ width: 14, height: 14, borderRadius: 7, background: C.lime, boxShadow: `0 0 0 ${4 + 4 * ((f / FPB) % 1)}px rgba(58,204,0,${0.35 * (1 - ((f / FPB) % 1))})` }} />
            PSX · LIVE
          </span>
          <span style={{ marginLeft: 'auto', fontFamily: FONT.mono, fontWeight: 600, fontSize: 22, color: C.grey, letterSpacing: 2 }}>KARACHI · PKR</span>
        </div>
        {/* body */}
        <div style={{ padding: '34px 44px 0' }}>
          <div style={{ fontFamily: FONT.mono, fontWeight: 600, fontSize: 22, letterSpacing: 4, color: C.grey }}>PAKISTAN STOCK EXCHANGE</div>
          <div style={{ fontFamily: FONT.display, fontWeight: 900, fontSize: 64, letterSpacing: -1.5, color: C.ink, marginTop: 6 }}>Market overview</div>
          <svg width={830} height={250} style={{ marginTop: 10, overflow: 'visible' }}>
            <defs>
              <linearGradient id="wArea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={C.green} stopOpacity={0.22} /><stop offset="1" stopColor={C.green} stopOpacity={0} /></linearGradient>
            </defs>
            {[60, 125, 190].map((y) => <line key={y} x1={0} x2={800} y1={y} y2={y} stroke="#EEF1ED" strokeWidth={2} />)}
            <path d={`${d} L${head[0]},250 L0,250 Z`} fill="url(#wArea)" />
            <path d={d} fill="none" stroke={C.green} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
            <circle cx={head[0]} cy={head[1]} r={11} fill={C.lime} stroke="#fff" strokeWidth={4} />
          </svg>
          <div style={{ display: 'flex', gap: 16, marginTop: 8 }}>
            {TOP.slice(0, 3).map((c, i) => (
              <span key={c.ticker} style={{ padding: '10px 20px', borderRadius: 18, background: '#F4F7F3', fontFamily: FONT.display, fontWeight: 900, fontSize: 30, color: C.ink, opacity: ramp(f, 4 + i * 2, 10 + i * 2), transform: `translateY(${(1 - ramp(f, 4 + i * 2, 12 + i * 2)) * 20}px)` }}>
                {c.ticker} <span style={{ color: C.green }}>▲</span>
              </span>
            ))}
          </div>
        </div>
        {/* the button */}
        <div style={{ position: 'absolute', left: btn.x - 80 - 230, top: btn.y - 650 - 50, width: 460, height: 100, borderRadius: 50, background: C.green, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, transform: `scale(${1 - 0.06 * press})`, boxShadow: `0 18px 40px rgba(44,156,0,${0.35 + 0.3 * press})` }}>
          <span style={{ fontFamily: FONT.display, fontWeight: 900, fontSize: 42, color: '#fff', letterSpacing: -0.5 }}>Show Top 10</span>
          <svg width={34} height={34} viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6" stroke="#fff" strokeWidth={3} fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </div>
      </div>
      {f < click + 8 && <Cursor x={cur.x} y={cur.y} press={press} />}
    </>
  );
};

// ---- slot-roll digit: spins through digits fast, then lands
const Slot: React.FC<{ f: number; at: number; to: number; size: number; spins: number }> = ({ f, at, to, size, spins }) => {
  const t = ramp(f, at, at + 14, E.out);
  const total = spins * 10 + to;
  const pos = t * total;
  const lh = size;
  const k = Math.floor(pos), fr = pos - k;
  const blur = Math.min(10, Math.abs(1 - t) * 18);
  return (
    <span style={{ position: 'relative', display: 'inline-block', width: size * 0.62, height: lh, overflow: 'hidden', verticalAlign: 'top' }}>
      {[0, 1].map((j) => (
        <span key={j} style={{ position: 'absolute', left: 0, right: 0, textAlign: 'center', top: (j - fr) * lh, height: lh, lineHeight: `${lh}px`, filter: `blur(${blur * (t < 1 ? 1 : 0)}px)` }}>{(k + j) % 10}</span>
      ))}
    </span>
  );
};

export const Intro: React.FC = () => {
  const f = useCurrentFrame();
  if (f > bf(I.end) + 2) return null;
  const click = bf(I.click), burst = bf(I.burst), slam = bf(I.slam), exit = bf(I.exit);
  // green flood from the button (circle reveal)
  const flood = ramp(f, click + 1, burst, E.in);
  const R = flood * 2300;
  const panelUp = ramp(f, exit, bf(I.end), E.inOut); // green panel leaves upward
  const panelY = -panelUp * H;
  const beat = (f - slam) / FPB, ph = beat >= 0 ? beat % 1 : 0;
  const pulse = beat >= 1 && beat < 3.25 ? Math.exp(-(ph * FPB) / 3.5) : 0;
  const slamS = sp(f, slam, { damping: 11, stiffness: 190, mass: 0.6 });
  const pull = ramp(f, bf(3.5), slam, E.in);

  return (
    <AbsoluteFill>
      {f < burst + 2 && <Window f={f} />}
      {/* green world: flood circle, then a full panel that slides up at the exit */}
      {f >= click + 1 && (
        <div style={{ position: 'absolute', inset: 0, transform: `translateY(${panelY}px)`, overflow: 'hidden' }}>
          <div style={{ position: 'absolute', left: 540 - R, top: 1250 - R, width: 2 * R, height: 2 * R, borderRadius: R, background: C.green }} />
          {f >= burst && (
            <>
              {/* rings */}
              {[0, 1, 2].map((i) => {
                const t = ramp(f, burst + i * 4, burst + i * 4 + 22, E.out);
                const r = mix(60, 900, t);
                return <div key={i} style={{ position: 'absolute', left: 540 - r, top: 900 - r, width: 2 * r, height: 2 * r, borderRadius: r, border: `${mix(10, 2, t)}px solid ${C.lime}`, opacity: (1 - t) * 0.8 }} />;
              })}
              {/* the ten tickers burst out, then get pulled back in */}
              {f < slam + 2 && TOP.map((c, i) => {
                const a = (i / 10) * Math.PI * 2 - Math.PI / 2 + 0.3;
                const rad = (i % 2 ? 330 : 470);
                const o = sp(f, burst + i * 0.9, { damping: 12, stiffness: 150, mass: 0.6 }) * (1 - pull);
                const x = 540 + Math.cos(a) * rad * 0.8 * o, y = 900 + Math.sin(a) * rad * 1.35 * o;
                return (
                  <div key={c.ticker} style={{ position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) scale(${mix(0.3, 1, o)}) rotate(${(1 - o) * (i % 2 ? 20 : -20)}deg)`, opacity: Math.min(1, o * 3), padding: '16px 28px', borderRadius: 28, background: '#fff', boxShadow: '0 18px 40px rgba(0,0,0,0.18)', whiteSpace: 'nowrap', textAlign: 'center' }}>
                    <div style={{ fontFamily: FONT.display, fontWeight: 900, fontSize: 46, lineHeight: '50px', color: C.ink }}>{c.ticker}</div>
                    <div style={{ fontFamily: FONT.mono, fontWeight: 700, fontSize: 20, color: C.green, letterSpacing: 1 }}>Rs {fmtBn(c.mcap_bn)} bn</div>
                  </div>
                );
              })}
            </>
          )}
          {f >= slam - 1 && (
            <>
              {/* ticker tapes */}
              {[300, 1580].map((y, k) => (
                <div key={y} style={{ position: 'absolute', left: 0, top: y, width: W, height: 66, background: C.deep, overflow: 'hidden', opacity: ramp(f, slam, slam + 6) }}>
                  <div style={{ position: 'absolute', top: 14, left: (k ? -1 : 1) * ((f * 6) % 1400) - (k ? 0 : 1400), whiteSpace: 'nowrap', fontFamily: FONT.mono, fontWeight: 700, fontSize: 30, color: '#fff', letterSpacing: 2 }}>
                    {[...TOP, ...TOP, ...TOP].map((c, i) => <span key={i} style={{ marginRight: 46 }}>{c.ticker} <span style={{ color: C.lime }}>▲</span></span>)}
                  </div>
                </div>
              ))}
              {/* shockwave */}
              {(() => { const t = ramp(f, slam, slam + 18, E.out); const r = mix(200, 1200, t); return <div style={{ position: 'absolute', left: 540 - r, top: 940 - r, width: 2 * r, height: 2 * r, borderRadius: r, border: `${mix(26, 2, t)}px solid rgba(255,255,255,0.5)`, opacity: 1 - t }} />; })()}
              <div style={{ position: 'absolute', left: 0, right: 0, top: 470, textAlign: 'center', fontFamily: FONT.mono, fontWeight: 700, fontSize: 30, letterSpacing: 9, color: 'rgba(255,255,255,0.85)', opacity: ramp(f, slam + 4, slam + 12), transform: `translateY(${(1 - ramp(f, slam + 4, slam + 14)) * 30}px)` }}>PAKISTAN STOCK EXCHANGE</div>
              <div style={{ position: 'absolute', left: 0, right: 0, top: 540, textAlign: 'center', color: '#fff', fontFamily: FONT.display, fontWeight: 900, letterSpacing: -12, transform: `scale(${mix(1.35, 1, slamS) * (1 + 0.035 * pulse)})`, transformOrigin: '540px 400px' }}>
                <div style={{ fontSize: 330, lineHeight: '320px', overflow: 'hidden', height: 320 }}>
                  <div style={{ transform: `translateY(${(1 - ramp(f, slam - 1, slam + 7, E.out)) * 320}px)` }}>TOP</div>
                </div>
                <div style={{ fontSize: 560, lineHeight: '560px', height: 560, marginTop: -10, fontFeatureSettings: '"tnum"' }}>
                  <Slot f={f} at={slam - 1} to={1} size={560} spins={1} /><Slot f={f} at={slam + 1} to={0} size={560} spins={2} />
                </div>
              </div>
            </>
          )}
        </div>
      )}
      {/* small brand mark during the window section */}
      {f < click + 4 && (
        <div style={{ position: 'absolute', left: 0, right: 0, top: 450, display: 'flex', justifyContent: 'center', opacity: ramp(f, 2, 8) * (1 - ramp(f, click, click + 4)) }}>
          <img src={asset('logos/FLOSTOCKS.png')} style={{ width: 300, height: (300 * 306) / 1164 }} />
        </div>
      )}
    </AbsoluteFill>
  );
};
