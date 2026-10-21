// Scene 1 (0–8 s): floating iPhone, the iMessage conversation pops in on the beat,
// the punchline bubble morphs into FloStocks green, haptic shake + confetti, then
// the camera dives into it.
import React from 'react';
import { AbsoluteFill, interpolate } from 'remotion';
import { FS, FS_BODY, FS_EASE } from '../flostocks';
import { Blobs, Confetti, Particles, lerp, sp, SOFT } from './fx';

// iOS light mode
const UI = {
  recv: '#e9e9eb',
  sent: '#0a84ff',
  muted: '#8e8e93',
  line: 'rgba(60,60,67,0.22)',
  text: '#000000',
} as const;

const FONT = `${FS_BODY}, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif`;

type Msg = { me: boolean; text: string; at: number; typing?: [number, number]; big?: boolean };

export const CHAT: Msg[] = [
  { me: false, text: 'i opened my account with floret capitals', at: 22, typing: [4, 22] },
  { me: true, text: 'PMEX?', at: 46 },
  { me: false, text: 'Nope, PSX', at: 82, typing: [60, 82] },
  { me: true, text: 'Wo tou pmex ke top broker nai?', at: 106 },
  { me: false, text: 'yes they are', at: 136, typing: [118, 136] },
  { me: false, text: 'but', at: 154 },
  { me: false, text: 'THEY ARE NOW IN STOCKS 📈', at: 186, typing: [164, 186], big: true },
];

const MORPH = 196; // punchline turns green
const DIVE = 204; // camera dives into the phone

const PHONE_W = 860;
const PHONE_H = 1720;

const Dots: React.FC<{ t: number; at: number }> = ({ t, at }) => {
  const s = sp(t, at, { damping: 14, stiffness: 220, mass: 0.5 });
  return (
    <div
      style={{
        alignSelf: 'flex-start',
        backgroundColor: UI.recv,
        borderRadius: 44,
        padding: '26px 32px',
        display: 'flex',
        gap: 12,
        marginTop: 16,
        transform: `scale(${s})`,
        transformOrigin: 'bottom left',
      }}
    >
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            width: 18,
            height: 18,
            borderRadius: 9,
            backgroundColor: UI.muted,
            opacity: 0.35 + ((Math.sin((t - i * 4) * 0.45) + 1) / 2) * 0.65,
            transform: `translateY(${Math.sin((t - i * 4) * 0.45) * -4}px)`,
          }}
        />
      ))}
    </div>
  );
};

const Bubble: React.FC<{ m: Msg; t: number }> = ({ m, t }) => {
  const s = sp(t, m.at, { damping: 11, stiffness: 240, mass: 0.55 });
  const morph = m.big ? lerp(t, MORPH, MORPH + 8, 0, 1) : 0;
  const bg = m.me
    ? UI.sent
    : m.big
      ? `linear-gradient(135deg, rgba(56,209,0,${morph}) 0%, rgba(69,224,31,${morph}) 100%), ${UI.recv}`
      : UI.recv;
  const glow = m.big ? morph * (0.75 + 0.25 * Math.sin(t * 0.5)) : 0;
  const tap = m.big ? sp(t, MORPH + 6, { damping: 10, stiffness: 260, mass: 0.5 }) : 0;
  return (
    <div
      style={{
        position: 'relative',
        alignSelf: m.me ? 'flex-end' : 'flex-start',
        maxWidth: '80%',
        marginTop: 16,
        transform: `translateY(${(1 - s) * 40}px) scale(${interpolate(s, [0, 1], [0.35, 1])})`,
        transformOrigin: m.me ? 'bottom right' : 'bottom left',
        opacity: Math.min(1, s * 2.5),
      }}
    >
      <div
        style={{
          background: bg,
          borderRadius: 44,
          padding: m.big ? '30px 40px' : '22px 34px',
          boxShadow: glow > 0 ? `0 0 ${70 * glow}px rgba(56,209,0,${0.85 * glow})` : undefined,
        }}
      >
        <p
          style={{
            margin: 0,
            fontFamily: FONT,
            fontWeight: m.big ? 800 : 400,
            fontSize: m.big ? 52 : 40,
            lineHeight: 1.22,
            color: m.me ? '#ffffff' : m.big && morph > 0.5 ? FS.ink : UI.text,
          }}
        >
          {m.text}
        </p>
      </div>
      {m.big && tap > 0 && (
        <div
          style={{
            position: 'absolute',
            top: -38,
            right: -26,
            width: 84,
            height: 84,
            borderRadius: 42,
            backgroundColor: UI.recv,
            border: '4px solid #fff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 40,
            transform: `scale(${tap})`,
          }}
        >
          ‼️
        </div>
      )}
      {m.big && <Confetti t={t} at={MORPH} x={260} y={60} />}
    </div>
  );
};

const Screen: React.FC<{ t: number }> = ({ t }) => {
  const typing = CHAT.find((m) => m.typing && t >= m.typing[0] && t < m.typing[1]);
  return (
    <AbsoluteFill style={{ backgroundColor: '#ffffff', borderRadius: 96, overflow: 'hidden' }}>
      {/* status bar */}
      <div style={{ position: 'absolute', top: 30, left: 76, right: 70, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontFamily: FONT, fontWeight: 600, fontSize: 34, color: UI.text }}>9:41</span>
        <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
          {[0, 1, 2, 3].map((i) => (
            <div key={i} style={{ width: 8, height: 10 + i * 5, borderRadius: 2, backgroundColor: UI.text }} />
          ))}
          <div style={{ width: 46, height: 22, borderRadius: 7, border: '2.5px solid rgba(0,0,0,0.35)', marginLeft: 12, padding: 2 }}>
            <div style={{ width: '78%', height: '100%', borderRadius: 4, backgroundColor: UI.text }} />
          </div>
        </div>
      </div>
      {/* header */}
      <div style={{ position: 'absolute', top: 110, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <svg width="24" height="42" viewBox="0 0 26 46" style={{ position: 'absolute', left: 40, top: 28 }}>
          <path d="M22 4 L5 23 L22 42" fill="none" stroke={UI.sent} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <div
          style={{
            width: 104,
            height: 104,
            borderRadius: 52,
            background: 'linear-gradient(180deg, #a1a1a6, #636366)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <span style={{ fontFamily: FONT, fontWeight: 600, fontSize: 46, color: '#fff' }}>H</span>
        </div>
        <span style={{ fontFamily: FONT, fontSize: 28, color: UI.text, marginTop: 8 }}>Hamza ›</span>
      </div>
      <div style={{ position: 'absolute', top: 290, left: 0, right: 0, height: 2, backgroundColor: UI.line, opacity: 0.6 }} />
      {/* thread */}
      <div style={{ position: 'absolute', top: 310, left: 30, right: 30, display: 'flex', flexDirection: 'column' }}>
        <p style={{ margin: '10px 0 6px', textAlign: 'center', fontFamily: FONT, fontSize: 24, color: UI.muted }}>
          <span style={{ fontWeight: 600 }}>iMessage</span> · Today 9:41
        </p>
        {CHAT.filter((m) => t >= m.at).map((m, i) => (
          <Bubble key={i} m={m} t={t} />
        ))}
        {typing && <Dots t={t} at={typing.typing ? typing.typing[0] : 0} />}
      </div>
      {/* input bar */}
      <div style={{ position: 'absolute', left: 30, right: 30, bottom: 60, height: 84, display: 'flex', alignItems: 'center', gap: 18 }}>
        <div style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: UI.recv, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ color: UI.muted, fontSize: 48, fontFamily: FONT, marginTop: -6 }}>+</span>
        </div>
        <div style={{ flex: 1, height: 80, borderRadius: 40, border: `2.5px solid ${UI.line}`, display: 'flex', alignItems: 'center', padding: '0 30px' }}>
          <span style={{ fontFamily: FONT, fontSize: 32, color: UI.muted }}>iMessage</span>
        </div>
      </div>
      {/* dynamic island */}
      <div style={{ position: 'absolute', top: 22, left: '50%', marginLeft: -110, width: 220, height: 64, borderRadius: 32, backgroundColor: '#000', boxShadow: '0 0 0 2px #111' }} />
    </AbsoluteFill>
  );
};

export const ChatScene: React.FC<{ t: number }> = ({ t }) => {
  const enter = sp(t, 0, SOFT);
  const floatY = Math.sin(t / 22) * 12;
  const rotY = Math.sin(t / 30) * 7;
  const rotX = 6 + Math.cos(t / 37) * 3 + (1 - enter) * 34;
  const d = t - (MORPH + 2);
  const shake = d >= 0 ? Math.exp(-d * 0.2) * Math.sin(d * 2.7) * 22 : 0;
  const dive = lerp(t, DIVE, 240, 1, 2.6, FS_EASE.in);
  const push = lerp(t, 0, DIVE, 0.96, 1.04, FS_EASE.inOut);
  const glowPulse = t >= MORPH ? 0.5 + 0.5 * Math.sin(t * 0.4) : 0;

  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      <Blobs t={t} base={FS.paper} colors={['rgba(56,209,0,0.32)', 'rgba(10,132,255,0.16)', 'rgba(126,220,168,0.4)']} opacity={0.7} />
      <Particles t={t} color={FS.green} />
      <AbsoluteFill
        style={{
          background: `radial-gradient(700px 900px at 50% 60%, rgba(56,209,0,${0.1 + glowPulse * 0.3}), transparent 70%)`,
        }}
      />
      <AbsoluteFill style={{ perspective: 2400, transform: `scale(${push * dive})`, transformOrigin: '42% 70%' }}>
        <div
          style={{
            position: 'absolute',
            left: (1080 - PHONE_W) / 2,
            top: 100,
            width: PHONE_W,
            height: PHONE_H,
            transform: `translate(${shake}px, ${(1 - enter) * 1500 + floatY}px) rotateX(${rotX}deg) rotateY(${rotY}deg)`,
            borderRadius: 120,
            padding: 22,
            background: 'linear-gradient(145deg, #3a3d3a 0%, #121412 45%, #2a2d2a 100%)',
            boxShadow: `0 60px 120px rgba(10,14,10,0.28), 0 0 0 3px #4a4d4a inset, 0 0 ${80 * glowPulse}px rgba(56,209,0,${0.5 * glowPulse})`,
          }}
        >
          <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            <Screen t={t} />
            {/* glass reflection sweeping with the tilt */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: 96,
                background: `linear-gradient(${115 + rotY * 3}deg, rgba(255,255,255,0) 30%, rgba(255,255,255,0.18) 45%, rgba(255,255,255,0) 60%)`,
                pointerEvents: 'none',
              }}
            />
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
