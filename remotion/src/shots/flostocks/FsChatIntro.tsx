import React from 'react';
import {
  useCurrentFrame,
  interpolate,
  AbsoluteFill,
} from 'remotion';
import { CLAMP, FS, FS_BODY, FS_EASE } from '../../lib/flostocks';

// =============================================================================
// COMPOSITION CONFIG
// =============================================================================
export const compositionConfig = {
  id: 'FsChatIntro',
  durationInSeconds: 17,
  fps: 30,
  width: 1080,
  height: 1920,
};

// =============================================================================
// STYLE CONSTANTS — iOS dark-mode Messages clone (1080w ≈ 390pt × 2.77)
// =============================================================================
const UI = {
  bg: '#000000',
  header: 'rgba(22,22,24,0.94)',
  line: 'rgba(84,84,88,0.65)',
  recv: '#3b3b3d',
  sent: '#0a84ff',
  text: '#ffffff',
  muted: '#8e8e93',
  blue: '#0a84ff',
  avatar1: '#8e8e93',
  avatar2: '#636366',
} as const;

// Inter stands in for SF Pro (closest local metric match; headless Linux has no Apple fonts)
const FONT = `${FS_BODY}, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif`;

// =============================================================================
// SCRIPT — the conversation, with appearance frames (30 fps)
// =============================================================================
type Msg = {
  from: 'them' | 'me';
  text: string;
  at: number; // frame the bubble pops
  typing?: [number, number]; // typing indicator window (them only)
  big?: boolean;
};

const MESSAGES: Msg[] = [
  { from: 'them', text: 'i opened my account with floret capitals', at: 62, typing: [16, 58] },
  { from: 'me', text: 'PMEX?', at: 112 },
  { from: 'them', text: 'Nope, PSX', at: 172, typing: [132, 168] },
  { from: 'me', text: 'Wo tou pmex ke top broker nai?', at: 232 },
  { from: 'them', text: 'yes they are', at: 292, typing: [252, 288] },
  { from: 'them', text: 'but', at: 324 },
  { from: 'them', text: 'THEY ARE NOW IN STOCKS 📈', at: 384, typing: [338, 380], big: true },
];

const ZOOM_START = 428;
const ZOOM_END = 498;
const FLASH_AT = 492;

// =============================================================================
// PIECES
// =============================================================================
const StatusBar: React.FC = () => (
  <div
    style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: 100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 76px 0 90px',
      zIndex: 3,
    }}
  >
    <span style={{ fontFamily: FONT, fontWeight: 600, fontSize: 40, color: '#fff', margin: 0 }}>9:41</span>
    <svg width="170" height="36" viewBox="0 0 170 36">
      {/* signal bars */}
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} x={i * 14} y={18 - i * 5} width={9} height={10 + i * 5} rx={2.5} fill="#fff" />
      ))}
      {/* wifi */}
      <g transform="translate(66,2)">
        <path d="M16 26 L10 19 A10 10 0 0 1 22 19 Z" fill="#fff" />
        <path d="M4 13 A18 18 0 0 1 28 13 L24 17.5 A12 12 0 0 0 8 17.5 Z" fill="#fff" />
        <path d="M-2 7 A26 26 0 0 1 34 7 L30 11.5 A20 20 0 0 0 2 11.5 Z" fill="#fff" />
      </g>
      {/* battery */}
      <g transform="translate(112,6)">
        <rect x={0} y={0} width={46} height={24} rx={8} fill="none" stroke="#fff" strokeOpacity={0.4} strokeWidth={3} />
        <rect x={4} y={4} width={32} height={16} rx={5} fill="#fff" />
        <rect x={49} y={7} width={5} height={10} rx={2.5} fill="#fff" fillOpacity={0.4} />
      </g>
    </svg>
  </div>
);

const Header: React.FC = () => (
  <div
    style={{
      position: 'absolute',
      top: 100,
      left: 0,
      right: 0,
      height: 210,
      backgroundColor: 'transparent',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      zIndex: 3,
    }}
  >
    {/* back chevron */}
    <svg width="26" height="46" viewBox="0 0 26 46" style={{ position: 'absolute', left: 46, top: 36 }}>
      <path d="M22 4 L5 23 L22 42" fill="none" stroke={UI.blue} strokeWidth={6} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
    {/* FaceTime */}
    <svg width="64" height="44" viewBox="0 0 64 44" style={{ position: 'absolute', right: 46, top: 40 }}>
      <rect x={0} y={4} width={42} height={36} rx={10} fill={UI.blue} />
      <path d="M46 16 L60 7 L60 37 L46 28 Z" fill={UI.blue} />
    </svg>
    {/* avatar */}
    <div
      style={{
        width: 118,
        height: 118,
        borderRadius: 59,
        background: `linear-gradient(180deg, ${UI.avatar1}, ${UI.avatar2})`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <span style={{ fontFamily: FONT, fontWeight: 600, fontSize: 52, color: '#fff', margin: 0 }}>H</span>
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10 }}>
      <span style={{ fontFamily: FONT, fontWeight: 400, fontSize: 30, color: '#fff', margin: 0 }}>Hamza</span>
      <svg width="16" height="26" viewBox="0 0 16 26">
        <path d="M3 3 L13 13 L3 23" fill="none" stroke={UI.muted} strokeWidth={4} strokeLinecap="round" />
      </svg>
    </div>
  </div>
);

const TypingDots: React.FC<{ frame: number }> = ({ frame }) => (
  <div
    style={{
      alignSelf: 'flex-start',
      backgroundColor: UI.recv,
      borderRadius: 50,
      padding: '30px 38px',
      display: 'flex',
      gap: 14,
      marginTop: 18,
    }}
  >
    {[0, 1, 2].map((i) => {
      const pulse = (Math.sin((frame - i * 5) * 0.35) + 1) / 2;
      return (
        <div
          key={i}
          style={{
            width: 22,
            height: 22,
            borderRadius: 11,
            backgroundColor: UI.muted,
            opacity: 0.35 + pulse * 0.65,
          }}
        />
      );
    })}
  </div>
);

const Bubble: React.FC<{ msg: Msg; frame: number }> = ({ msg, frame }) => {
  const t = frame - msg.at;
  const scale = interpolate(t, [0, 12], [0.55, 1], { ...CLAMP, easing: FS_EASE.overshoot });
  const opacity = interpolate(t, [0, 6], [0, 1], CLAMP);
  const mine = msg.from === 'me';
  return (
    <div
      style={{
        alignSelf: mine ? 'flex-end' : 'flex-start',
        maxWidth: '74%',
        backgroundColor: mine ? UI.sent : UI.recv,
        borderRadius: 50,
        padding: msg.big ? '34px 44px' : '26px 40px',
        marginTop: 18,
        opacity,
        transform: `scale(${scale})`,
        transformOrigin: mine ? 'bottom right' : 'bottom left',
      }}
    >
      <p
        style={{
          margin: 0,
          fontFamily: FONT,
          fontWeight: msg.big ? 700 : 400,
          fontSize: msg.big ? 58 : 46,
          lineHeight: 1.25,
          color: UI.text,
          letterSpacing: msg.big ? '0.01em' : 0,
        }}
      >
        {msg.text}
      </p>
    </div>
  );
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================
const FsChatIntro: React.FC = () => {
  const frame = useCurrentFrame();

  const uiIn = interpolate(frame, [0, 16], [0, 1], { ...CLAMP, easing: FS_EASE.out });

  // typing indicator: visible if inside any upcoming 'them' window
  const typingVisible = MESSAGES.some((m) => m.typing && frame >= m.typing[0] && frame < m.typing[1]);

  // finale: zoom into the last bubble (sits low-left in the stack)
  const zoom = interpolate(frame, [ZOOM_START, ZOOM_END], [1, 1.75], { ...CLAMP, easing: FS_EASE.in });
  const dim = interpolate(frame, [ZOOM_START, ZOOM_END], [0, 0.55], CLAMP);
  const flash = interpolate(frame, [FLASH_AT, FLASH_AT + 10, FLASH_AT + 18], [0, 1, 1], CLAMP);
  const glow = interpolate(frame, [ZOOM_START + 20, ZOOM_END], [0, 0.6], CLAMP);

  return (
    <AbsoluteFill style={{ backgroundColor: UI.bg }}>
      <AbsoluteFill
        style={{
          transform: `scale(${zoom})`,
          transformOrigin: '18% 72%',
        }}
      >
        <AbsoluteFill style={{ opacity: uiIn }}>
          <StatusBar />
          <Header />
          <div style={{ position: 'absolute', top: 310, left: 0, right: 0, height: 2, backgroundColor: UI.line, opacity: 0.5 }} />

          {/* message area */}
          <div
            style={{
              position: 'absolute',
              top: 340,
              left: 44,
              right: 44,
              bottom: 230,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <p style={{ margin: '18px 0 6px', textAlign: 'center', fontFamily: FONT, fontSize: 28, color: UI.muted }}>
              <span style={{ fontWeight: 600 }}>iMessage</span>
            </p>
            <p style={{ margin: '0 0 14px', textAlign: 'center', fontFamily: FONT, fontSize: 28, color: UI.muted }}>
              Today 9:41
            </p>
            {MESSAGES.filter((m) => frame >= m.at).map((m, i) => (
              <Bubble key={i} msg={m} frame={frame} />
            ))}
            {typingVisible && <TypingDots frame={frame} />}
          </div>

          {/* input bar */}
          <div
            style={{
              position: 'absolute',
              left: 44,
              right: 44,
              bottom: 90,
              height: 104,
              display: 'flex',
              alignItems: 'center',
              gap: 24,
            }}
          >
            <div
              style={{
                width: 92,
                height: 92,
                borderRadius: 46,
                backgroundColor: '#1c1c1e',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg width="40" height="40" viewBox="0 0 40 40">
                <path d="M20 6 V34 M6 20 H34" stroke={UI.muted} strokeWidth={5} strokeLinecap="round" />
              </svg>
            </div>
            <div
              style={{
                flex: 1,
                height: 92,
                borderRadius: 46,
                border: `2.5px solid ${UI.line}`,
                display: 'flex',
                alignItems: 'center',
                padding: '0 36px',
              }}
            >
              <span style={{ fontFamily: FONT, fontSize: 38, color: UI.muted, margin: 0 }}>iMessage</span>
            </div>
          </div>
        </AbsoluteFill>
      </AbsoluteFill>

      {/* finale dim + green flash into the showreel */}
      <AbsoluteFill style={{ backgroundColor: '#000', opacity: dim, pointerEvents: 'none' }} />
      <AbsoluteFill
        style={{
          background: `radial-gradient(760px 760px at 38% 72%, rgba(56,209,0,${glow}), transparent 70%)`,
          pointerEvents: 'none',
        }}
      />
      <AbsoluteFill style={{ backgroundColor: FS.green, opacity: flash, pointerEvents: 'none' }} />
    </AbsoluteFill>
  );
};

export default FsChatIntro;
