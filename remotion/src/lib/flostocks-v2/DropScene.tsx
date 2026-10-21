// Scene 2 (8–14.4 s): the beat drops. One word per half-bar with colour-flip
// backgrounds, then "IN STOCKS." over rising candles, an up-trend line and
// scrolling ticker tapes. Everything pulses with the kick.
import React from 'react';
import { AbsoluteFill } from 'remotion';
import { evolvePath } from '@remotion/paths';
import { FS, FS_EASE, FS_MONO, fsHeadline } from '../flostocks';
import { OutlineMarquee, Slam, lerp, pulse, seeded, sp, SNAP } from './fx';

type Word = { at: number; end: number; bg: string; fg: string; lines: string[]; size: number; rot: number; outline: string };

const WORDS: Word[] = [
  { at: 0, end: 24, bg: FS.green, fg: FS.ink, lines: ['FLORET'], size: 230, rot: -12, outline: FS.ink },
  { at: 24, end: 48, bg: FS.ink, fg: FS.green, lines: ['CAPITALS'], size: 196, rot: 10, outline: FS.green },
  { at: 48, end: 72, bg: FS.paper, fg: FS.ink, lines: ["PMEX'S", 'TOP BROKER'], size: 150, rot: -8, outline: FS.ink },
  { at: 72, end: 96, bg: FS.ink, fg: FS.paper, lines: ['IS NOW'], size: 230, rot: 8, outline: FS.paper },
];

const STOCKS_AT = 96;

const CANDLES = Array.from({ length: 13 }, (_, i) => {
  const trend = 260 + i * 62;
  const h = trend + (seeded(i + 7) - 0.5) * 140;
  return { h, up: i % 4 !== 2, wick: 50 + seeded(i + 30) * 70 };
});

const TREND = 'M 40 1500 L 190 1380 L 300 1430 L 440 1220 L 560 1270 L 700 1010 L 800 1060 L 940 760 L 1040 600';

const TAPE = '▲ OGDC +1.84%   ▲ LUCK +0.92%   ▼ HBL −0.45%   ▲ SYS +2.10%   ▼ MARI −1.12%   ▲ ENGRO +0.67%   ';

const Tape: React.FC<{ t: number; top: number; rot: number; dir: 1 | -1 }> = ({ t, top, rot, dir }) => (
  <div
    style={{
      position: 'absolute',
      left: -200,
      right: -200,
      top,
      height: 96,
      backgroundColor: FS.ink,
      transform: `rotate(${rot}deg)`,
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
    }}
  >
    <p
      style={{
        margin: 0,
        whiteSpace: 'nowrap',
        fontFamily: FS_MONO,
        fontWeight: 600,
        fontSize: 44,
        color: FS.green,
        transform: `translateX(${dir * ((t * 16) % 1500) - 1500}px)`,
      }}
    >
      {TAPE.repeat(5)}
    </p>
  </div>
);

export const DropScene: React.FC<{ t: number }> = ({ t }) => {
  if (t < STOCKS_AT) {
    const w = WORDS.find((x) => t < x.end) ?? WORDS[0];
    const flash = lerp(t, w.at, w.at + 6, 0.55, 0);
    const drift = lerp(t, w.at + 4, w.end, 1, 1.1, (n) => n);
    return (
      <AbsoluteFill style={{ backgroundColor: w.bg, overflow: 'hidden' }}>
        <OutlineMarquee t={t} word={w.lines.join(' ')} color={w.outline} opacity={0.12} />
        <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', transform: `scale(${drift})` }}>
          {w.lines.map((line, i) => (
            <Slam key={line} t={t} at={w.at + i * 4} rot={w.rot} from={3}>
              <h1 style={{ ...fsHeadline(w.size, w.fg), textAlign: 'center', whiteSpace: 'nowrap' }}>{line}</h1>
            </Slam>
          ))}
        </AbsoluteFill>
        <AbsoluteFill style={{ backgroundColor: '#fff', opacity: flash }} />
      </AbsoluteFill>
    );
  }

  const u = t - STOCKS_AT;
  const kick = pulse(u, 0);
  const line = lerp(u, 6, 46, 0, 1, FS_EASE.inOut);
  const { strokeDasharray, strokeDashoffset } = evolvePath(line, TREND);
  const arrow = sp(u, 44, SNAP);
  const flash = lerp(u, 0, 8, 0.8, 0);

  return (
    <AbsoluteFill style={{ backgroundColor: FS.green, overflow: 'hidden' }}>
      <AbsoluteFill style={{ background: 'radial-gradient(900px 900px at 50% 45%, rgba(255,255,255,0.35), transparent 70%)' }} />
      {/* candles */}
      <div style={{ position: 'absolute', left: 30, right: 30, bottom: 0, height: 1500, display: 'flex', alignItems: 'flex-end', gap: 22 }}>
        {CANDLES.map((c, i) => {
          const s = sp(u, 2 + i * 2, { damping: 11, stiffness: 200, mass: 0.6 });
          return (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', opacity: 0.32 }}>
              <div style={{ width: 6, height: c.wick * s, backgroundColor: FS.ink }} />
              <div
                style={{
                  width: '100%',
                  height: c.h * s,
                  borderRadius: 8,
                  backgroundColor: c.up ? FS.ink : FS.paper,
                }}
              />
            </div>
          );
        })}
      </div>
      {/* trend line */}
      <svg width="1080" height="1920" viewBox="0 0 1080 1920" style={{ position: 'absolute', inset: 0 }}>
        <path
          d={TREND}
          fill="none"
          stroke={FS.paper}
          strokeWidth={18}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          style={{ filter: 'drop-shadow(0 8px 0 rgba(10,14,10,0.35))' }}
        />
        <g transform={`translate(1040 600) rotate(-58) scale(${arrow})`}>
          <path d="M -46 -40 L 34 0 L -46 40 Z" fill={FS.paper} />
        </g>
      </svg>
      <Tape t={u} top={210} rot={-5} dir={-1} />
      <Tape t={u} top={1640} rot={4} dir={1} />
      {/* headline */}
      <AbsoluteFill
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          transform: `scale(${1 + kick * 0.05}) rotate(-4deg)`,
        }}
      >
        <Slam t={u} at={0} from={3.2} rot={-14}>
          <h1 style={{ ...fsHeadline(180, FS.ink) }}>IN</h1>
        </Slam>
        <Slam t={u} at={6} from={3.4} rot={12}>
          <h1 style={{ ...fsHeadline(196, FS.ink), textShadow: '10px 10px 0 rgba(255,255,255,0.85)' }}>STOCKS.</h1>
        </Slam>
      </AbsoluteFill>
      <AbsoluteFill style={{ backgroundColor: '#fff', opacity: flash }} />
    </AbsoluteFill>
  );
};
