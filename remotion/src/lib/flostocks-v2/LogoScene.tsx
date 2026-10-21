// Scene 3 (14.4–17.6 s): logo slam with light sweep, beat rings and rotating rays,
// then the positioning line: THE OFFICIAL PSX DIVISION OF FLORET CAPITALS.
import React from 'react';
import { AbsoluteFill, Img, interpolate } from 'remotion';
import { FS, FS_BODY, FS_MONO, LOGO, fsHeadline } from '../flostocks';
import { Blobs, Particles, Rays, Reveal, lerp, pulse, sp, SNAP, BEAT } from './fx';

const Ring: React.FC<{ t: number; at: number }> = ({ t, at }) => {
  const d = t - at;
  if (d < 0 || d > 30) return null;
  const s = interpolate(d, [0, 30], [0.4, 2.4]);
  return (
    <div
      style={{
        position: 'absolute',
        left: 540 - 300,
        top: 700 - 300,
        width: 600,
        height: 600,
        borderRadius: '50%',
        border: `5px solid ${FS.green}`,
        transform: `scale(${s})`,
        opacity: interpolate(d, [0, 30], [0.7, 0]),
      }}
    />
  );
};

export const LogoScene: React.FC<{ t: number }> = ({ t }) => {
  const s = sp(t, 0, { damping: 10, stiffness: 200, mass: 0.7 });
  const logoScale = interpolate(s, [0, 1], [0.15, 1]);
  const sweep = lerp(t, 12, 34, -120, 220, (n) => n);
  const zoom = lerp(t, 0, 96, 1, 1.07, (n) => n);
  const kick = pulse(t, 0);
  const bar = sp(t, 46, SNAP);

  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      <Blobs t={t + 300} base={FS.ink} colors={['rgba(56,209,0,0.5)', 'rgba(126,220,168,0.3)']} />
      <Rays t={t} color={FS.green} opacity={0.1} cy="36%" />
      <Particles t={t} color={FS.green} speed={1.6} />
      {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
        <Ring key={i} t={t} at={6 + i * BEAT} />
      ))}
      <AbsoluteFill style={{ transform: `scale(${zoom})` }}>
        <div
          style={{
            position: 'absolute',
            left: 130,
            top: 560,
            width: 820,
            height: 274,
            transform: `scale(${logoScale * (1 + kick * 0.03)}) rotate(${(1 - s) * -12}deg)`,
            opacity: Math.min(1, s * 3),
          }}
        >
          <Img src={LOGO.fullOnDark} style={{ width: 820, height: 274 }} />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: `linear-gradient(100deg, transparent ${sweep - 18}%, rgba(255,255,255,0.95) ${sweep}%, transparent ${sweep + 18}%)`,
              WebkitMaskImage: `url(${LOGO.fullOnDark})`,
              maskImage: `url(${LOGO.fullOnDark})`,
              WebkitMaskSize: '100% 100%',
              maskSize: '100% 100%',
            }}
          />
        </div>

        <div style={{ position: 'absolute', top: 930, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Reveal t={t} at={22}>
            <p style={{ margin: 0, fontFamily: FS_MONO, fontWeight: 600, fontSize: 40, letterSpacing: '0.34em', color: FS.mint }}>THE OFFICIAL</p>
          </Reveal>
          <Reveal t={t} at={28} style={{ marginTop: 14 }}>
            <h2 style={{ ...fsHeadline(132, FS.green), padding: '0 20px' }}>PSX DIVISION</h2>
          </Reveal>
          <Reveal t={t} at={36} style={{ marginTop: 6 }}>
            <h2 style={{ ...fsHeadline(78, FS.paper), padding: '0 20px' }}>of Floret Capitals</h2>
          </Reveal>
          <div style={{ height: 6, width: 620 * bar, backgroundColor: FS.green, borderRadius: 3, marginTop: 40 }} />
          <p
            style={{
              margin: '34px 0 0',
              fontFamily: FS_BODY,
              fontWeight: 300,
              fontSize: 40,
              color: FS.paper,
              opacity: lerp(t, 54, 66, 0, 0.9),
              transform: `translateY(${lerp(t, 54, 66, 24, 0)}px)`,
            }}
          >
            Pakistan&apos;s modern gateway to the stock market
          </p>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
