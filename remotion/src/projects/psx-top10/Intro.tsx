// 1. Intro (beats 0-8): SaaS show-reel open, Pakistan Stock Exchange theme, paced to read.
//   b0   a "PSX Live" dashboard window springs in, its chart drawing
//   b3   a cursor clicks "Show Top 10"  ->  the button's green floods the frame
//   b4   "TOP / 10" slams in (slot-roll digits, shockwave), pulses on each beat
//   b7.4 zoom-through: TOP 10 rushes at the camera, white floods in, the title whips in
import React from 'react';
import { AbsoluteFill, spring, useCurrentFrame } from 'remotion';
import { C, E, FONT, asset, mix, ramp } from './theme';
import { bf, FPB, FPS, S, TOP } from './timeline';
import { Up } from './Num';

const W = 1080, H = 1920;
const I = S.intro;
const sp = (f: number, at: number, cfg = { damping: 14, stiffness: 150, mass: 0.7 }) => spring({ frame: f - at, fps: FPS, config: cfg });

// decorative chart path for the window (no labels / numbers)
const CHART = (() => {
  const pts: [number, number][] = [];
  let s = 11;
  const r = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  for (let i = 0; i <= 40; i++) {
    const t = i / 40;
    pts.push([t * 800, 200 - t * 140 - 22 * Math.sin(t * 8) + (r() - 0.5) * 22]);
  }
  return pts;
})();

const Cursor: React.FC<{ x: number; y: number; press: number }> = ({ x, y, press }) => (
  <svg width={70} height={84} viewBox="0 0 28 34" style={{ position: 'absolute', left: x - 6, top: y - 4, transform: `scale(${1 - 0.14 * press})`, transformOrigin: '6px 4px', filter: 'drop-shadow(0 8px 14px rgba(0,0,0,0.28))' }}>
    <path d="M3 2 L3 26 L9 20.5 L13 30 L17.5 28 L13.5 18.8 L21.5 18.8 Z" fill={C.ink} stroke="#fff" strokeWidth={2} strokeLinejoin="round" />
  </svg>
);

const WIN = { x: 80, y: 640, w: 920, h: 720 };
const BTN = { x: 540, y: WIN.y + 620 }; // button centre (screen)

const Window: React.FC<{ f: number }> = ({ f }) => {
  const enter = sp(f, -6, { damping: 15, stiffness: 95, mass: 0.9 });
  const draw = ramp(f, 2, bf(2.2), E.inOut);
  const n = Math.max(1, Math.round(draw * (CHART.length - 1)));
  const pts = CHART.slice(0, n + 1);
  const d = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
  const head = pts[pts.length - 1];
  const click = bf(I.click);
  const press = ramp(f, click - 3, click, E.inOut) * (1 - ramp(f, click + 1, click + 6));
  const push = ramp(f, click + 2, bf(I.burst), E.in); // push-in toward the button
  const mv = ramp(f, bf(1.2), click - 2, E.inOut);
  const cur = { x: mix(1000, BTN.x + 40, mv), y: mix(1720, BTN.y + 14, mv) - 140 * Math.sin(Math.PI * mv) };
  return (
    <>
      <div style={{
        position: 'absolute', left: WIN.x, top: WIN.y, width: WIN.w, height: WIN.h, borderRadius: 44, background: '#fff',
        boxShadow: '0 40px 120px rgba(17,17,17,0.16), 0 0 0 2px #E7EBE6', overflow: 'hidden',
        transformOrigin: `${BTN.x - WIN.x}px ${BTN.y - WIN.y}px`,
        transform: `perspective(1600px) translateY(${(1 - enter) * 260}px) rotateX(${(1 - enter) * 26}deg) scale(${mix(0.8, 1, enter) * mix(1, 1.9, push)})`,
        opacity: ramp(f, -6, 2, E.inOut),
      }}>
        {/* window chrome */}
        <div style={{ height: 88, display: 'flex', alignItems: 'center', padding: '0 34px', gap: 12, borderBottom: '2px solid #EEF1ED' }}>
          {[0, 1, 2].map((i) => <span key={i} style={{ width: 20, height: 20, borderRadius: 10, background: '#E6E9E5' }} />)}
          <span style={{ marginLeft: 20, display: 'inline-flex', alignItems: 'center', gap: 12, padding: '8px 22px', borderRadius: 30, background: '#F2F6F0', fontFamily: FONT.mono, fontWeight: 700, fontSize: 24, color: C.ink, letterSpacing: 1 }}>
            <span style={{ width: 14, height: 14, borderRadius: 7, background: C.lime, boxShadow: `0 0 0 ${4 + 4 * ((f / FPB) % 1)}px rgba(58,204,0,${0.35 * (1 - ((f / FPB) % 1))})` }} />
            PSX · LIVE
          </span>
          <span style={{ marginLeft: 'auto', fontFamily: FONT.mono, fontWeight: 600, fontSize: 22, color: C.grey, letterSpacing: 2 }}>KARACHI · PKR</span>
        </div>
        {/* body */}
        <div style={{ padding: '30px 44px 0' }}>
          <div style={{ fontFamily: FONT.mono, fontWeight: 600, fontSize: 22, lineHeight: '30px', letterSpacing: 4, color: C.grey }}>PAKISTAN STOCK EXCHANGE</div>
          <div style={{ fontFamily: FONT.display, fontWeight: 900, fontSize: 56, lineHeight: '72px', letterSpacing: -1, color: C.ink }}>Market overview</div>
          <svg width={830} height={220} style={{ marginTop: 14, overflow: 'visible', display: 'block' }}>
            <defs>
              <linearGradient id="wArea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={C.green} stopOpacity={0.22} /><stop offset="1" stopColor={C.green} stopOpacity={0} /></linearGradient>
            </defs>
            {[50, 110, 170].map((y) => <line key={y} x1={0} x2={800} y1={y} y2={y} stroke="#EEF1ED" strokeWidth={2} />)}
            <path d={`${d} L${head[0]},220 L0,220 Z`} fill="url(#wArea)" />
            <path d={d} fill="none" stroke={C.green} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
            <circle cx={head[0]} cy={head[1]} r={11} fill={C.lime} stroke="#fff" strokeWidth={4} />
          </svg>
          <div style={{ display: 'flex', gap: 16, marginTop: 22 }}>
            {TOP.slice(0, 3).map((c, i) => {
              const s = sp(f, 8 + i * 4);
              return (
                <span key={c.ticker} style={{ padding: '8px 22px', borderRadius: 18, background: '#F4F7F3', fontFamily: FONT.display, fontWeight: 800, fontSize: 30, lineHeight: '44px', color: C.ink, opacity: Math.min(1, s * 2), transform: `translateY(${(1 - s) * 24}px)` }}>
                  {c.ticker} <Up color={C.green} />
                </span>
              );
            })}
          </div>
        </div>
        {/* the button */}
        <div style={{ position: 'absolute', left: BTN.x - WIN.x - 230, top: BTN.y - WIN.y - 50, width: 460, height: 100, borderRadius: 50, background: C.green, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, transform: `scale(${(1 - 0.06 * press) * mix(0.6, 1, sp(f, 16))})`, opacity: ramp(f, 14, 20), boxShadow: `0 18px 40px rgba(44,156,0,${0.35 + 0.3 * press})` }}>
          <span style={{ fontFamily: FONT.display, fontWeight: 900, fontSize: 40, color: '#fff' }}>Show Top 10</span>
          <svg width={34} height={34} viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6" stroke="#fff" strokeWidth={3} fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
        </div>
      </div>
      {f < click + 8 && f > bf(1.1) && <Cursor x={cur.x} y={cur.y} press={press} />}
    </>
  );
};

// ---- slot-roll digit: spins through digits fast, then lands
const Slot: React.FC<{ f: number; at: number; to: number; size: number; spins: number }> = ({ f, at, to, size, spins }) => {
  const t = ramp(f, at, at + 16, E.out);
  const pos = t * (spins * 10 + to);
  const k = Math.floor(pos), fr = pos - k;
  const blur = t < 1 ? Math.min(10, (1 - t) * 18) : 0;
  return (
    <span style={{ position: 'relative', display: 'inline-block', width: size * 0.7, height: size, overflow: 'hidden', verticalAlign: 'top' }}>
      {[0, 1].map((j) => (
        <span key={j} style={{ position: 'absolute', left: 0, right: 0, textAlign: 'center', top: (j - fr) * size, height: size, lineHeight: `${size}px`, filter: `blur(${blur}px)` }}>{(k + j) % 10}</span>
      ))}
    </span>
  );
};

export const Intro: React.FC = () => {
  const f = useCurrentFrame();
  if (f > bf(I.end) + 2) return null;
  const click = bf(I.click), burst = bf(I.burst), slam = bf(I.slam), zoom = bf(I.zoom), end = bf(I.end);
  const flood = ramp(f, click + 1, burst, E.in);
  const R = flood * 2300;
  const beat = (f - slam) / FPB, ph = beat >= 0 ? beat % 1 : 0;
  const pulse = beat >= 1 && beat < I.zoom - I.slam ? Math.exp(-(ph * FPB) / 3.5) : 0;
  const slamS = sp(f, slam, { damping: 12, stiffness: 170, mass: 0.65 });
  // zoom-through: TOP 10 rushes at the camera and white light floods in
  const zt = ramp(f, zoom, end, E.in);
  const flash = ramp(f, zoom + 3, end - 1, E.in); // white light floods in as TOP 10 rushes past
  const blockS = mix(1.3, 1, slamS) * (1 + 0.03 * pulse) * mix(1, 4.5, zt);

  return (
    <AbsoluteFill>
      {f < burst + 2 && <Window f={f} />}
      {f < click + 4 && (
        <div style={{ position: 'absolute', left: 0, right: 0, top: 470, display: 'flex', justifyContent: 'center', opacity: ramp(f, 2, 9) * (1 - ramp(f, click, click + 4)) }}>
          <img src={asset('logos/FLOSTOCKS.png')} style={{ width: 320, height: (320 * 306) / 1164 }} />
        </div>
      )}
      {f >= click + 1 && (
        <AbsoluteFill style={{ overflow: 'hidden' }}>
          {f < burst + 2 ? <div style={{ position: 'absolute', left: BTN.x - R, top: BTN.y - R, width: 2 * R, height: 2 * R, borderRadius: R, background: C.green }} />
            : <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(160deg, ${C.deep}, ${C.green} 55%, #3ACC00)` }} />}
          {f >= slam - 1 && (
            <>
              {(() => { const t = ramp(f, slam, slam + 20, E.out); const r = mix(200, 1200, t); return <div style={{ position: 'absolute', left: 540 - r, top: 960 - r, width: 2 * r, height: 2 * r, borderRadius: r, border: `${mix(26, 2, t)}px solid rgba(255,255,255,0.5)`, opacity: 1 - t }} />; })()}
              <div style={{ position: 'absolute', left: 0, right: 0, top: 440, textAlign: 'center', fontFamily: FONT.mono, fontWeight: 600, fontSize: 30, lineHeight: '40px', letterSpacing: 9, color: 'rgba(255,255,255,0.88)', opacity: ramp(f, slam + 4, slam + 12) * (1 - ramp(f, zoom, zoom + 4)), transform: `translateY(${(1 - ramp(f, slam + 4, slam + 14)) * 30}px)` }}>PAKISTAN STOCK EXCHANGE</div>
              <div style={{ position: 'absolute', left: 0, right: 0, top: 540, height: 830, textAlign: 'center', color: '#fff', fontFamily: FONT.display, fontWeight: 900, transformOrigin: '540px 415px', transform: `scale(${blockS})`, filter: `blur(${zt * 14}px)`, opacity: 1 - ramp(f, zoom + 4, end) }}>
                <div style={{ fontSize: 300, lineHeight: '320px', height: 320, overflow: 'hidden', letterSpacing: -6 }}>
                  <div style={{ transform: `translateY(${(1 - ramp(f, slam - 1, slam + 8, E.out)) * 320}px)` }}>TOP</div>
                </div>
                <div style={{ fontSize: 520, lineHeight: '520px', height: 520, marginTop: -10 }}>
                  <Slot f={f} at={slam - 1} to={1} size={520} spins={1} /><Slot f={f} at={slam + 1} to={0} size={520} spins={2} />
                </div>
              </div>
            </>
          )}
          {flash > 0 && <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 50% 50%, #fff 0%, #fff 55%, rgba(255,255,255,0.85) 100%)', opacity: flash }} />}
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
