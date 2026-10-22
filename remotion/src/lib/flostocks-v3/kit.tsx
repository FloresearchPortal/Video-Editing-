// Shared layout for the v3 showreel scenes (white theme, brand green accents).
// Every scene: animated white backdrop, a numbered strength tag, a headline that slams
// in line by line on the beat, one hero visual, and a footer line.
import React from 'react';
import { AbsoluteFill } from 'remotion';
import { FS, FS_BODY, FS_MONO, fsHeadline } from '../flostocks';
import { Blobs, Particles, Reveal, Slam, lerp, sp } from '../flostocks-v2/fx';
import { b } from './timing';

export const Bg: React.FC<{ t: number; seed?: number; tint?: number }> = ({ t, seed = 0, tint = 1 }) => (
  <>
    <Blobs
      t={t + seed}
      base={FS.paper}
      colors={[`rgba(56,209,0,${0.26 * tint})`, `rgba(126,220,168,${0.36 * tint})`, `rgba(69,224,31,${0.14 * tint})`]}
      opacity={0.75}
    />
    <AbsoluteFill
      style={{
        backgroundImage: 'radial-gradient(rgba(10,14,10,0.07) 1.6px, transparent 1.6px)',
        backgroundSize: '44px 44px',
        backgroundPosition: `0px ${(-t * 0.8) % 44}px`,
      }}
    />
    <Particles t={t} color={FS.green} speed={1.2} />
  </>
);

export const Tag: React.FC<{ t: number; n?: string; label: string; top?: number }> = ({ t, n, label, top = 180 }) => {
  const s = sp(t, 0, { damping: 16, stiffness: 200, mass: 0.6 });
  return (
    <div style={{ position: 'absolute', top, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 18,
          padding: '14px 30px',
          borderRadius: 999,
          backgroundColor: 'rgba(56,209,0,0.12)',
          border: '1.5px solid rgba(56,209,0,0.35)',
          transform: `translateY(${(1 - s) * -60}px)`,
          opacity: Math.min(1, s * 2),
        }}
      >
        {n && <span style={{ fontFamily: FS_MONO, fontWeight: 600, fontSize: 30, color: FS.paper, backgroundColor: FS.green, borderRadius: 8, padding: '2px 10px' }}>{n}</span>}
        <span style={{ fontFamily: FS_MONO, fontWeight: 600, fontSize: 30, letterSpacing: '0.18em', color: FS.greenDeep }}>{label}</span>
      </div>
    </div>
  );
};

type Line = { text: React.ReactNode; color?: string; size?: number };
export const Head: React.FC<{ t: number; lines: Line[]; top?: number; step?: number; start?: number }> = ({
  t,
  lines,
  top = 280,
  step = 0.5,
  start = 0,
}) => (
  <div style={{ position: 'absolute', top, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    {lines.map((l, i) => (
      <Slam key={i} t={t} at={b(start + i * step)} rot={i % 2 ? 7 : -7} from={2.4}>
        <h1 style={{ ...fsHeadline(l.size ?? 104, l.color ?? FS.ink), textAlign: 'center', whiteSpace: 'nowrap', padding: '0 12px' }}>{l.text}</h1>
      </Slam>
    ))}
  </div>
);

export const Foot: React.FC<{ t: number; at: number; text: string; top?: number }> = ({ t, at, text, top = 1500 }) => (
  <div style={{ position: 'absolute', top, left: 60, right: 60, display: 'flex', justifyContent: 'center' }}>
    <Reveal t={t} at={at}>
      <p style={{ margin: 0, fontFamily: FS_BODY, fontWeight: 400, fontSize: 38, color: FS.gray, textAlign: 'center' }}>{text}</p>
    </Reveal>
  </div>
);

export const card = (extra?: React.CSSProperties): React.CSSProperties => ({
  backgroundColor: 'rgba(255,255,255,0.94)',
  borderRadius: 40,
  border: '1.5px solid rgba(10,14,10,0.06)',
  boxShadow: '0 30px 70px rgba(10,14,10,0.12), 0 6px 18px rgba(10,14,10,0.06)',
  ...extra,
});

// pop-in transform for UI pieces (spring), with optional direction
export const pop = (t: number, at: number, dx = 0, dy = 80) => {
  const s = sp(t, at, { damping: 13, stiffness: 210, mass: 0.6 });
  return {
    s,
    style: {
      transform: `translate(${(1 - s) * dx}px, ${(1 - s) * dy}px) scale(${0.85 + 0.15 * s})`,
      opacity: Math.min(1, s * 2),
    } as React.CSSProperties,
  };
};

// count-up number helper
export const count = (t: number, a: number, z: number, from: number, to: number) => lerp(t, a, z, from, to);
