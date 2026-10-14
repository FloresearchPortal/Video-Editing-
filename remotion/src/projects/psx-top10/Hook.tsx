// A. Hook (beats 0-8): ticker bands with "TOP 10" knocked out -> bands slice away L/R on beat 1 ->
// title lockup builds one line per beat over a drawing price line + dark ticker tape -> lifts out.
import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { C, E, FONT, asset, ramp, mix, riseIn, liftOut } from './theme';
import { bf, FPB, S, TOP } from './timeline';
import { fmtBn } from './theme';

const W = 1080, H = 1920;
const TAPE = TOP.map((c) => `${c.ticker}  ${fmtBn(c.mcap_bn)} BN`);
const tapeText = (k: number) => [...TAPE.slice(k % 10), ...TAPE.slice(0, k % 10)].join('     ·     ') + '     ·     ';

// ---- frame-1 bands -----------------------------------------------------------------------------
const NB = 12, BH = H / NB;
const Bands: React.FC<{ f: number }> = ({ f }) => {
  const start = bf(S.hook.words[0]) - 3;
  if (f > start + NB * 0.8 + 16) return null;
  const koT = `translate(540 960) scale(${mix(1.06, 1, ramp(f, 0, start))}) translate(-540 -960)`;
  return (
    <svg width={W} height={H} style={{ position: 'absolute' }}>
      <defs>
        {Array.from({ length: NB }, (_, i) => <clipPath key={i} id={`band${i}`}><rect x={-2} y={i * BH - 0.5} width={W + 4} height={BH + 1} /></clipPath>)}
      </defs>
      <g>
        {Array.from({ length: NB }, (_, i) => {
          const dir = i % 2 ? 1 : -1;
          const t = ramp(f, start + i * 0.8, start + i * 0.8 + 14, E.inOut);
          const scroll = ((f * 5 * (i % 2 ? -1 : 1)) % 1400) - 700 * (i % 2);
          return (
            <g key={i} transform={`translate(${dir * t * (W + 60)},0)`} clipPath={`url(#band${i})`}>
              <rect x={-2} y={i * BH - 0.5} width={W + 4} height={BH + 1} fill={i % 2 ? C.deep : C.green} />
              <text x={scroll - 200} y={i * BH + BH / 2 + 14} fontFamily={FONT.mono} fontWeight={600} fontSize={38}
                fill="#fff" fillOpacity={0.3} letterSpacing={2}>{tapeText(i * 3) + tapeText(i * 3)}</text>
              {/* "TOP 10" knocked out in white; each band carries its own slice of the letters */}
              <g fontFamily={FONT.display} fontWeight={900} textAnchor="middle" fill={C.paper} letterSpacing={-14} transform={koT}>
                <text x={540} y={905} fontSize={500}>TOP</text>
                <text x={548} y={1345} fontSize={500}>10</text>
              </g>
            </g>
          );
        })}
      </g>
    </svg>
  );
};

// ---- odometer "10" ------------------------------------------------------------------------------
const Odometer: React.FC<{ f: number; start: number; size: number; color: string }> = ({ f, start, size, color }) => {
  const v = mix(0, 10, ramp(f, start, start + 16, E.out));
  const lh = size * 1.0;
  const strip = (pos: number, digits: string[]) => (
    <span style={{ display: 'inline-block', height: lh, overflow: 'hidden', verticalAlign: 'top' }}>
      <span style={{ display: 'block', transform: `translateY(${-pos * lh}px)` }}>
        {digits.map((d, i) => <span key={i} style={{ display: 'block', height: lh, lineHeight: `${lh}px` }}>{d}</span>)}
      </span>
    </span>
  );
  return (
    <span style={{ color, fontVariantNumeric: 'tabular-nums' }}>
      {strip(Math.min(1, Math.max(0, v - 9)), ['0', '1'])}
      {strip(v, ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0'])}
    </span>
  );
};

// ---- split-flap word ----------------------------------------------------------------------------
const AZ = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const SplitFlap: React.FC<{ f: number; start: number; word: string }> = ({ f, start, word }) => (
  <>
    {word.split('').map((ch, i) => {
      const appear = start + i * 0.9;
      const lock = start + 5 + i * 1.4;
      const t = (f - appear) / 1.5;
      const locked = f >= lock;
      const shown = locked ? ch : AZ[(i * 7 + Math.max(0, Math.floor(t)) * 5) % 26];
      const frac = locked ? ramp(f, lock, lock + 2.5) : ((t % 1) + 1) % 1;
      const sy = locked ? mix(0.55, 1, frac) : mix(0.3, 1, E.out(frac));
      const tile = 1 - ramp(f, lock + 1, lock + 8, E.inOut);
      return (
        <span key={i} style={{ position: 'relative', display: 'inline-block', opacity: f >= appear ? 1 : 0 }}>
          <span style={{ position: 'absolute', left: 2, right: 2, top: '8%', bottom: '4%', borderRadius: 10, background: C.track, opacity: tile }}>
            <span style={{ position: 'absolute', left: 0, right: 0, top: '50%', height: 3, background: '#fff' }} />
          </span>
          <span style={{ visibility: 'hidden' }}>{ch}</span>
          <span style={{ position: 'absolute', inset: 0, textAlign: 'center', overflow: 'hidden', transform: `scaleY(${sy})`, color: locked ? C.ink : '#3a3f3a' }}>{shown}</span>
        </span>
      );
    })}
  </>
);

// ---- price line behind the title -----------------------------------------------------------------
const PTS = (() => {
  const out: [number, number][] = [];
  let s = 7;
  const r = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  for (let x = -10; x <= W + 10; x += 14) {
    const t = (x + 10) / (W + 20);
    out.push([x, 1700 - t * 420 - 40 * Math.sin(t * 9) + (r() - 0.5) * 34]);
  }
  return out;
})();
const PriceLine: React.FC<{ f: number; op: number }> = ({ f, op }) => {
  const p = ramp(f, bf(1) - 2, bf(7), E.inOut);
  const n = p * (PTS.length - 1), i = Math.floor(n), fr = n - i;
  const pts = PTS.slice(0, i + 1);
  const nx = PTS[Math.min(i + 1, PTS.length - 1)];
  const head: [number, number] = [mix(PTS[i][0], nx[0], fr), mix(PTS[i][1], nx[1], fr)];
  pts.push(head);
  const d = pts.map(([x, y], k) => `${k ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
  const beatPhase = ((f / FPB) % 1);
  return (
    <svg width={W} height={H} style={{ position: 'absolute', opacity: op }}>
      <defs>
        <linearGradient id="area" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={C.green} stopOpacity={0.16} />
          <stop offset="1" stopColor={C.green} stopOpacity={0} />
        </linearGradient>
        <radialGradient id="glow"><stop offset="0" stopColor={C.lime} stopOpacity={0.55} /><stop offset="1" stopColor={C.lime} stopOpacity={0} /></radialGradient>
      </defs>
      <path d={`${d} L${head[0].toFixed(1)},1760 L-10,1760 Z`} fill="url(#area)" />
      <path d={d} fill="none" stroke={C.green} strokeWidth={6} strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={head[0]} cy={head[1]} r={56} fill="url(#glow)" />
      <circle cx={head[0]} cy={head[1]} r={16 + 46 * E.out(beatPhase)} fill="none" stroke={C.lime} strokeWidth={4} strokeOpacity={0.75 * (1 - beatPhase)} />
      <circle cx={head[0]} cy={head[1]} r={13} fill={C.lime} stroke="#fff" strokeWidth={4} />
    </svg>
  );
};

export const Hook: React.FC = () => {
  const f = useCurrentFrame();
  if (f > bf(S.hook.end) + 2) return null;
  const [w1, w2, w3, w4, w5] = S.hook.words.map((b) => bf(b));
  const exit = liftOut(f, bf(S.hook.exit), 110, 11);
  const cx: React.CSSProperties = { position: 'absolute', left: 0, right: 0, textAlign: 'center' };
  const Y = 360; // top of the lockup
  const lineIn = (start: number, dist = 70) => { const r = riseIn(f, start - 1, dist, 12); return { opacity: r.opacity, transform: `translateY(${r.y}px)` }; };
  const cap = 'CAPITALIZATION';
  const pulse = (f / FPB) % 1;
  const lockupOn = f >= w1 - 3 ? 1 : 0;
  return (
    <AbsoluteFill>
      {/* behind the title */}
      <PriceLine f={f} op={exit.opacity} />
      <div style={{ position: 'absolute', left: 0, top: 1772, width: W, height: 74, background: C.ink, overflow: 'hidden', opacity: exit.opacity }}>
        <div style={{ position: 'absolute', top: 18, left: -((f * 4) % 1200), whiteSpace: 'nowrap', fontFamily: FONT.mono, fontWeight: 600, fontSize: 30, color: '#fff', letterSpacing: 1 }}>
          {TAPE.concat(TAPE).map((t, i) => {
            const [tk, ...v] = t.split('  ');
            return <span key={i} style={{ marginRight: 54 }}>{tk} <span style={{ color: C.lime }}>{v.join(' ')}</span></span>;
          })}
        </div>
      </div>
      {/* title lockup */}
      <div style={{ position: 'absolute', inset: 0, opacity: lockupOn * exit.opacity, transform: `translateY(${exit.y}px)` }}>
        <div style={{ ...cx, top: Y, display: 'flex', justifyContent: 'center', ...lineIn(w1, 40) }}>
          <img src={asset('logos/FLOSTOCKS.png')} style={{ width: 290, height: 290 * 306 / 1164 }} />
        </div>
        <div style={{ ...cx, top: Y + 110, fontFamily: FONT.display, fontWeight: 900, fontSize: 250, lineHeight: '250px', letterSpacing: -8, color: C.ink, ...lineIn(w1, 90) }}>
          TOP <Odometer f={f} start={w1 - 1} size={250} color={C.green} />
        </div>
        <div style={{ ...cx, top: Y + 380, fontFamily: FONT.display, fontWeight: 900, fontSize: 138, lineHeight: '150px', letterSpacing: -3, color: C.ink }}>
          <SplitFlap f={f} start={w2 - 3} word="COMPANIES" />
        </div>
        <div style={{ ...cx, top: Y + 520, fontFamily: FONT.serif, fontStyle: 'italic', fontSize: 132, lineHeight: '150px', color: C.ink, ...lineIn(w3, 80) }}>
          by market
        </div>
        <div style={{ ...cx, top: Y + 680, fontFamily: FONT.display, fontWeight: 900, fontSize: 98, lineHeight: '110px', letterSpacing: -2, color: C.green }}>
          {cap.split('').map((ch, i) => {
            const s = w4 - 3 + i * 0.75;
            const t = ramp(f, s, s + 8, E.back);
            return <span key={i} style={{ display: 'inline-block', opacity: ramp(f, s, s + 3, E.inOut), transform: `translateY(${(1 - t) * 120}px)` }}>{ch}</span>;
          })}
        </div>
        <div style={{ position: 'absolute', left: 540 - 415, top: Y + 800, width: 830, height: 12, borderRadius: 6, background: C.lime, transformOrigin: 'left center', transform: `scaleX(${ramp(f, w4 + 6, w4 + 18, E.inOut)})` }} />
        <div style={{ ...cx, top: Y + 850, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 30, ...lineIn(w5, 80) }}>
          <span style={{ fontFamily: FONT.serif, fontStyle: 'italic', fontSize: 132, lineHeight: '130px', color: C.ink }}>in</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 22, height: 124, padding: '0 46px 0 40px', borderRadius: 62, background: C.green }}>
            <span style={{ position: 'relative', width: 26, height: 26 }}>
              <span style={{ position: 'absolute', inset: 0, borderRadius: 13, background: C.lime }} />
              <span style={{ position: 'absolute', inset: -4 - 18 * E.out(pulse), borderRadius: 40, border: `3px solid ${C.lime}`, opacity: 0.9 * (1 - pulse) * ramp(f, w5, w5 + 4) }} />
            </span>
            <span style={{ fontFamily: FONT.display, fontWeight: 900, fontSize: 84, color: '#fff', letterSpacing: 2, lineHeight: '124px' }}>PSX</span>
          </span>
        </div>
      </div>
      <Bands f={f} />
    </AbsoluteFill>
  );
};
