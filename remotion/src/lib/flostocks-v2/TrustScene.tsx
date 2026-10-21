// Scene 6 (32–35.2 s): BUILT ON TRUST. BACKED BY REGULATION. — badges pop in on
// each beat from alternating sides and tick themselves.
import React from 'react';
import { AbsoluteFill } from 'remotion';
import { ShieldCheck } from 'lucide-react';
import { FS, FS_BODY, FS_MONO, FsWatermark, fsHeadline } from '../flostocks';
import { Blobs, Particles, Rays, Reveal, Slam, lerp, pulse, sp } from './fx';

const BADGES = ['SECP licensed', 'PSX TREC Holder 535', 'Member PSX & PMEX', 'Research Entity licence'] as const;

const Tick: React.FC<{ p: number }> = ({ p }) => (
  <svg width="60" height="60" viewBox="0 0 54 54">
    <circle cx="27" cy="27" r="25" fill={FS.green} />
    <path
      d="M15 28 L24 37 L40 19"
      fill="none"
      stroke={FS.ink}
      strokeWidth={6}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray={60}
      strokeDashoffset={60 * (1 - p)}
    />
  </svg>
);

export const TrustScene: React.FC<{ t: number }> = ({ t }) => {
  const kick = pulse(t, 0);
  const shield = sp(t, 0, { damping: 12, stiffness: 120, mass: 0.9 });
  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      <Blobs t={t + 1200} base={FS.ink} colors={['rgba(56,209,0,0.42)', 'rgba(126,220,168,0.25)']} />
      <Rays t={t * 1.5} color={FS.green} opacity={0.07} cy="30%" />
      <Particles t={t} color={FS.mint} speed={1.4} />
      <div
        style={{
          position: 'absolute',
          left: 540 - 330,
          top: 560 - 330,
          opacity: 0.1 + kick * 0.06,
          transform: `scale(${(0.6 + shield * 0.4) * (1 + kick * 0.04)})`,
        }}
      >
        <ShieldCheck size={660} color={FS.green} strokeWidth={1.2} />
      </div>

      <div style={{ position: 'absolute', top: 330, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Slam t={t} at={0} rot={-8}>
          <h1 style={{ ...fsHeadline(108, FS.paper) }}>Built on trust.</h1>
        </Slam>
        <Slam t={t} at={8} rot={8}>
          <h1 style={{ ...fsHeadline(108, FS.green) }}>Backed by</h1>
        </Slam>
        <Slam t={t} at={13} rot={-8}>
          <h1 style={{ ...fsHeadline(108, FS.green) }}>regulation.</h1>
        </Slam>
      </div>

      <div style={{ position: 'absolute', top: 860, left: 110, right: 110, display: 'flex', flexDirection: 'column', gap: 28 }}>
        {BADGES.map((b, i) => {
          const at = 22 + i * 10;
          const s = sp(t, at, { damping: 12, stiffness: 210, mass: 0.6 });
          const dir = i % 2 === 0 ? -1 : 1;
          return (
            <div
              key={b}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 30,
                padding: '24px 40px',
                borderRadius: 999,
                border: '2px solid rgba(126,220,168,0.45)',
                backgroundColor: 'rgba(56,209,0,0.1)',
                boxShadow: `0 0 ${30 * pulse(t, at, 48)}px rgba(56,209,0,0.45)`,
                transform: `translateX(${dir * (1 - s) * 900}px) scale(${0.8 + s * 0.2})`,
                opacity: Math.min(1, s * 2),
              }}
            >
              <Tick p={lerp(t, at + 5, at + 15, 0, 1)} />
              <p style={{ margin: 0, fontFamily: FS_BODY, fontWeight: 600, fontSize: 46, color: FS.paper }}>{b}</p>
            </div>
          );
        })}
      </div>

      <div style={{ position: 'absolute', top: 1480, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
        <Reveal t={t} at={66}>
          <p style={{ margin: 0, fontFamily: FS_MONO, fontWeight: 500, fontSize: 32, letterSpacing: '0.22em', color: FS.mint }}>
            FORMERLY FLORET COMMODITIES
          </p>
        </Reveal>
      </div>

      <FsWatermark width={1080} />
    </AbsoluteFill>
  );
};
