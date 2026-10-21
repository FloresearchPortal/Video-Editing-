// Scene 7 (35.2–40 s): green finale. Logo tile springs in, YOUR GATEWAY TO THE PSX
// slams, the CTA button pops, a cursor taps it (ripple + confetti) and the URL
// types itself out.
import React from 'react';
import { AbsoluteFill, Img } from 'remotion';
import { FS, FS_BODY, FS_EASE, FS_MONO, LOGO, fsHeadline } from '../flostocks';
import { Blobs, Confetti, Cursor, Particles, Ripple, Slam, Stripes, lerp, pulse, sp } from './fx';

const CLICK = 74;
const URL = 'flostocks.com';

export const CtaScene: React.FC<{ t: number }> = ({ t }) => {
  const tile = sp(t, 0, { damping: 10, stiffness: 190, mass: 0.7 });
  const btn = sp(t, 28, { damping: 12, stiffness: 200, mass: 0.6 });
  const pressed = t >= CLICK - 2 && t < CLICK + 6 ? 1 : 0;
  const cx = lerp(t, 44, 70, 980, 720, FS_EASE.inOut);
  const cy = lerp(t, 44, 70, 1980, 1046, FS_EASE.inOut);
  const typed = Math.floor(lerp(t, 84, 106, 0, URL.length, (n) => n));
  const caret = t % 16 < 9;
  const kick = pulse(t, 0);
  const bob = Math.sin(t / 14) * 8;

  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      <Blobs t={t + 1500} base={FS.green} colors={['rgba(255,255,255,0.45)', 'rgba(69,224,31,0.9)', 'rgba(31,122,0,0.4)']} opacity={0.7} />
      <Stripes t={t} color="rgba(255,255,255,0.07)" />
      <Particles t={t} color="#ffffff" speed={1.3} />

      {/* logo tile */}
      <div
        style={{
          position: 'absolute',
          left: 540 - 115,
          top: 300 + bob,
          width: 230,
          height: 230,
          borderRadius: 56,
          backgroundColor: FS.paper,
          boxShadow: '0 26px 60px rgba(10,14,10,0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transform: `scale(${tile * (1 + kick * 0.04)}) rotate(${(1 - tile) * -40}deg)`,
        }}
      >
        <Img src={LOGO.iconOnLight} style={{ width: 160 }} />
      </div>

      <div style={{ position: 'absolute', top: 610, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Slam t={t} at={8} rot={-8}>
          <h1 style={{ ...fsHeadline(124, FS.ink) }}>Your gateway</h1>
        </Slam>
        <Slam t={t} at={16} rot={8}>
          <h1 style={{ ...fsHeadline(124, FS.paper), textShadow: '6px 6px 0 rgba(10,14,10,0.25)' }}>to the PSX</h1>
        </Slam>
      </div>

      {/* CTA button */}
      <div
        style={{
          position: 'absolute',
          left: 130,
          width: 820,
          top: 960,
          height: 140,
          borderRadius: 70,
          backgroundColor: FS.ink,
          boxShadow: '0 26px 70px rgba(10,14,10,0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 24,
          transform: `translateY(${(1 - btn) * 500}px) scale(${pressed ? 0.94 : 1 + pulse(t, 84, 24) * 0.03})`,
          opacity: Math.min(1, btn * 2),
        }}
      >
        <span style={{ fontFamily: FS_BODY, fontWeight: 700, fontSize: 52, color: FS.paper }}>Open your PSX account</span>
        <svg width="50" height="50" viewBox="0 0 46 46" style={{ transform: `translateX(${Math.sin(t / 5) * 5}px)` }}>
          <path d="M8 23 H38 M26 9 L38 23 L26 37" fill="none" stroke={FS.green} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <Ripple t={t} at={CLICK} x={720} y={1030} color={FS.paper} />
      <Confetti t={t} at={CLICK} x={540} y={1000} colors={[FS.paper, FS.ink, FS.mint]} />
      {t >= 40 && t < 112 && <Cursor x={cx} y={cy} pressed={pressed} opacity={lerp(t, 98, 112, 1, 0)} />}

      {/* typed URL */}
      <div style={{ position: 'absolute', top: 1190, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
        <p style={{ margin: 0, fontFamily: FS_MONO, fontWeight: 600, fontSize: 64, color: FS.ink, letterSpacing: '0.04em' }}>
          {URL.slice(0, typed)}
          <span style={{ opacity: t >= 80 && caret ? 1 : 0, color: FS.paper }}>|</span>
        </p>
      </div>
      <p
        style={{
          position: 'absolute',
          top: 1300,
          left: 0,
          right: 0,
          margin: 0,
          textAlign: 'center',
          fontFamily: FS_BODY,
          fontWeight: 600,
          fontSize: 38,
          color: FS.ink,
          opacity: lerp(t, 106, 118, 0, 0.85),
        }}
      >
        @floretcapitals
      </p>
    </AbsoluteFill>
  );
};
