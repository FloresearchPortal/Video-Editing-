// Scene 1 (0 → DROP): a realistic, full-screen iOS Messages conversation (light mode).
// Proportions follow an iPhone at 393 pt wide scaled to 1080 px (×2.748): status bar,
// translucent nav header, bottom-anchored thread that scrolls under the header, input
// bar, and the system keyboard with key pop-ups while "me" types. Bubbles have iOS
// tails and grouping; the last sent message shows "Delivered". At the end the camera
// punches into "THEY ARE NOW IN STOCKS" and the beat drops.
import React from 'react';
import { AbsoluteFill, interpolate } from 'remotion';
import { FS, FS_BODY, FS_EASE } from '../flostocks';
import { lerp, sp } from '../flostocks-v2/fx';
import { DROP } from './timing';

const PT = 2.748; // 1 iOS point in px at 1080 wide
const FONT = `${FS_BODY}, -apple-system, 'Segoe UI', Roboto, Arial, sans-serif`;
const C = {
  blue: '#007AFF',
  recv: '#E9E9EB',
  text: '#000000',
  muted: '#8A8A8E',
  hair: 'rgba(60,60,67,0.18)',
  kbBg: '#D1D4DA',
  key: '#FFFFFF',
  keyAlt: '#ABB1BA',
  keyShadow: '#898A8D',
} as const;

// ---- layout (px) -------------------------------------------------------------
const KB_H = 852; // predictive bar + 4 rows + bottom bar + home indicator
const INPUT_H = 50 * PT;
const HEADER_H = 380;
const INPUT_TOP = 1920 - KB_H - INPUT_H;

// ---- script ------------------------------------------------------------------
type Msg = { me: boolean; text: string; at: number; typeFrom?: number; dots?: [number, number] };
const PER_CHAR = 1.3;
export const MSGS: Msg[] = [
  { me: false, text: 'i opened my account with floret capitals', at: 16, dots: [2, 16] },
  { me: true, text: 'PMEX?', at: 41, typeFrom: 25 },
  { me: false, text: 'Nope, PSX', at: 62, dots: [46, 62] },
  { me: true, text: 'Wo tou pmex ke top broker nai?', at: 111, typeFrom: 68 },
  { me: false, text: 'yes they are', at: 128, dots: [116, 128] },
  { me: false, text: 'but', at: 142 },
  { me: false, text: 'THEY ARE NOW IN STOCKS TOO!', at: 168, dots: [150, 168] },
];
// frames at which a key is struck (for SFX), exported for the timeline
export const KEY_TAPS: number[] = MSGS.flatMap((m) =>
  m.typeFrom === undefined ? [] : Array.from(m.text).map((_, i) => Math.round(m.typeFrom! + i * PER_CHAR)),
);
const ZOOM_FROM = 176;
const PUNCH = DROP - 12; // readable push-in until here, then punch through into the drop
// centre of the punchline bubble (last received, bottom of the thread), measured from a still
const BUB_X = 423;
const BUB_Y = 830;

// ---- keyboard geometry ---------------------------------------------------------
const ROWS = ['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM'];
const KEY_W = 32 * PT;
const KEY_H = 42 * PT;
const GAP_X = 6 * PT;
const ROW_GAP = 11 * PT;
const PRED_H = 44 * PT;
const keyPos = (ch: string): { x: number; y: number } | null => {
  const c = ch.toUpperCase();
  for (let r = 0; r < ROWS.length; r++) {
    const i = ROWS[r].indexOf(c);
    if (i < 0) continue;
    const rowW = ROWS[r].length * KEY_W + (ROWS[r].length - 1) * GAP_X;
    const x0 = (1080 - rowW) / 2;
    return { x: x0 + i * (KEY_W + GAP_X), y: PRED_H + 8 * PT + r * (KEY_H + ROW_GAP) };
  }
  if (c === ' ') return { x: 540 - 90 * PT, y: PRED_H + 8 * PT + 3 * (KEY_H + ROW_GAP) };
  return null;
};

const typedText = (f: number): { text: string; key: string | null } => {
  for (const m of MSGS) {
    if (m.typeFrom === undefined || f < m.typeFrom || f >= m.at) continue;
    const n = Math.min(m.text.length, Math.floor((f - m.typeFrom) / PER_CHAR) + 1);
    const struckAt = m.typeFrom + (n - 1) * PER_CHAR;
    return { text: m.text.slice(0, n), key: f - struckAt < 2.5 ? m.text[n - 1] : null };
  }
  return { text: '', key: null };
};

// ---- pieces --------------------------------------------------------------------
const Tail: React.FC<{ me: boolean; color: string }> = ({ me, color }) => (
  <svg
    width={22}
    height={36}
    viewBox="0 0 22 36"
    style={{ position: 'absolute', bottom: 0, [me ? 'right' : 'left']: -9, transform: me ? undefined : 'scaleX(-1)' }}
  >
    <path d="M0 0 C 2 20, 8 30, 22 36 C 10 36, 2 33, -4 28 Z" fill={color} />
  </svg>
);

const Bubble: React.FC<{ m: Msg; f: number; tail: boolean; delivered: boolean; groupTop: boolean }> = ({
  m,
  f,
  tail,
  delivered,
  groupTop,
}) => {
  const s = sp(f, m.at, { damping: 15, stiffness: 260, mass: 0.55 });
  const grow = Math.min(1, s * 1.15);
  const color = m.me ? C.blue : C.recv;
  return (
    <div
      style={{
        alignSelf: m.me ? 'flex-end' : 'flex-start',
        maxWidth: 265 * PT,
        marginTop: groupTop ? 8 * PT : 2 * PT,
        maxHeight: grow * 400,
        overflow: 'visible',
      }}
    >
      <div
        style={{
          position: 'relative',
          backgroundColor: color,
          borderRadius: 18 * PT,
          padding: `${7 * PT}px ${12 * PT}px`,
          transform: m.me
            ? `translateY(${(1 - s) * 140}px) scale(${interpolate(s, [0, 1], [0.92, 1])})`
            : `scale(${interpolate(s, [0, 1], [0.5, 1])})`,
          transformOrigin: m.me ? 'bottom right' : 'bottom left',
          opacity: Math.min(1, s * 3),
        }}
      >
        <p style={{ margin: 0, fontFamily: FONT, fontSize: 17 * PT, lineHeight: 1.3, color: m.me ? '#fff' : C.text, letterSpacing: '-0.01em' }}>
          {m.text}
        </p>
        {tail && <Tail me={m.me} color={color} />}
      </div>
      {delivered && (
        <p style={{ margin: `${2 * PT}px ${4 * PT}px 0 0`, textAlign: 'right', fontFamily: FONT, fontWeight: 600, fontSize: 11 * PT, color: C.muted }}>
          Delivered
        </p>
      )}
    </div>
  );
};

const Dots: React.FC<{ f: number; at: number }> = ({ f, at }) => {
  const s = sp(f, at, { damping: 14, stiffness: 240, mass: 0.5 });
  return (
    <div style={{ alignSelf: 'flex-start', marginTop: 8 * PT, transform: `scale(${s})`, transformOrigin: 'bottom left' }}>
      <div
        style={{
          position: 'relative',
          backgroundColor: C.recv,
          borderRadius: 18 * PT,
          padding: `${12 * PT}px ${13 * PT}px`,
          display: 'flex',
          gap: 4 * PT,
        }}
      >
        {[0, 1, 2].map((i) => {
          const ph = (Math.sin((f - i * 5) * 0.42) + 1) / 2;
          return <div key={i} style={{ width: 8 * PT, height: 8 * PT, borderRadius: 4 * PT, backgroundColor: '#8E8E93', opacity: 0.35 + ph * 0.6 }} />;
        })}
        <Tail me={false} color={C.recv} />
      </div>
    </div>
  );
};

const StatusBar: React.FC = () => (
  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 54 * PT, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: `0 ${32 * PT}px 0 ${42 * PT}px` }}>
    <span style={{ fontFamily: FONT, fontWeight: 600, fontSize: 17 * PT, color: C.text, marginTop: 6 * PT }}>9:41</span>
    <div style={{ display: 'flex', alignItems: 'center', gap: 7 * PT, marginTop: 6 * PT }}>
      <svg width={18 * PT} height={12 * PT} viewBox="0 0 18 12">
        {[0, 1, 2, 3].map((i) => (
          <rect key={i} x={i * 4.8} y={9 - i * 3} width={3.2} height={3 + i * 3} rx={0.8} fill={C.text} />
        ))}
      </svg>
      <svg width={17 * PT} height={12 * PT} viewBox="0 0 17 12">
        <path d="M8.5 11.5 L6 8.6 A3.6 3.6 0 0 1 11 8.6 Z" fill={C.text} />
        <path d="M3.4 6.2 A7.4 7.4 0 0 1 13.6 6.2 L12 8 A5.2 5.2 0 0 0 5 8 Z" fill={C.text} />
        <path d="M0.6 3.4 A11.4 11.4 0 0 1 16.4 3.4 L14.9 5.1 A9.2 9.2 0 0 0 2.1 5.1 Z" fill={C.text} />
      </svg>
      <svg width={27 * PT} height={13 * PT} viewBox="0 0 27 13">
        <rect x={0.5} y={0.5} width={23} height={12} rx={3.8} fill="none" stroke={C.text} strokeOpacity={0.35} />
        <rect x={2} y={2} width={17} height={9} rx={2.4} fill={C.text} />
        <path d="M25 4.5 A2 2 0 0 1 25 8.5 Z" fill={C.text} fillOpacity={0.4} />
      </svg>
    </div>
  </div>
);

const Header: React.FC = () => (
  <div
    style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: HEADER_H,
      backgroundColor: 'rgba(249,249,249,0.94)',
      backdropFilter: 'blur(20px)',
      borderBottom: `1px solid ${C.hair}`,
      zIndex: 5,
    }}
  >
    <StatusBar />
    <div style={{ position: 'absolute', top: 60 * PT, left: 14 * PT, display: 'flex', alignItems: 'center', gap: 3 * PT }}>
      <svg width={12 * PT} height={21 * PT} viewBox="0 0 12 21">
        <path d="M10 1.5 L1.8 10.5 L10 19.5" fill="none" stroke={C.blue} strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <div style={{ backgroundColor: C.blue, borderRadius: 10 * PT, padding: `${1 * PT}px ${7 * PT}px`, marginLeft: 3 * PT }}>
        <span style={{ fontFamily: FONT, fontWeight: 600, fontSize: 13 * PT, color: '#fff' }}>12</span>
      </div>
    </div>
    <svg width={24 * PT} height={16 * PT} viewBox="0 0 24 16" style={{ position: 'absolute', top: 64 * PT, right: 16 * PT }}>
      <rect x={1} y={1.5} width={15} height={13} rx={3.5} fill="none" stroke={C.blue} strokeWidth={1.8} />
      <path d="M17.5 6 L23 2.5 L23 13.5 L17.5 10 Z" fill="none" stroke={C.blue} strokeWidth={1.8} strokeLinejoin="round" />
    </svg>
    <div style={{ position: 'absolute', top: 56 * PT, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div
        style={{
          width: 50 * PT,
          height: 50 * PT,
          borderRadius: 25 * PT,
          background: 'linear-gradient(180deg, #A5A9B3 0%, #858A94 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <span style={{ fontFamily: FONT, fontWeight: 600, fontSize: 21 * PT, color: '#fff' }}>H</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 2 * PT, marginTop: 4 * PT }}>
        <span style={{ fontFamily: FONT, fontSize: 12 * PT, color: C.text }}>Hamza</span>
        <svg width={6 * PT} height={10 * PT} viewBox="0 0 6 10">
          <path d="M1 1 L5 5 L1 9" fill="none" stroke={C.muted} strokeWidth={1.4} strokeLinecap="round" />
        </svg>
      </div>
    </div>
  </div>
);

const InputBar: React.FC<{ text: string }> = ({ text }) => (
  <div
    style={{
      position: 'absolute',
      left: 0,
      right: 0,
      top: INPUT_TOP,
      height: INPUT_H,
      backgroundColor: '#FFFFFF',
      display: 'flex',
      alignItems: 'center',
      padding: `0 ${10 * PT}px`,
      gap: 8 * PT,
    }}
  >
    <div style={{ width: 34 * PT, height: 34 * PT, borderRadius: 17 * PT, backgroundColor: '#E9E9EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width={14 * PT} height={14 * PT} viewBox="0 0 14 14">
        <path d="M7 1 V13 M1 7 H13" stroke="#6D6D72" strokeWidth={2} strokeLinecap="round" />
      </svg>
    </div>
    <div
      style={{
        flex: 1,
        minHeight: 36 * PT,
        borderRadius: 18 * PT,
        border: `1.6px solid #C7C7CC`,
        display: 'flex',
        alignItems: 'center',
        padding: `0 ${4 * PT}px 0 ${14 * PT}px`,
      }}
    >
      <span style={{ flex: 1, fontFamily: FONT, fontSize: 17 * PT, color: text ? C.text : '#B4B4B8', whiteSpace: 'nowrap', overflow: 'hidden' }}>
        {text || 'iMessage'}
        {text && <span style={{ display: 'inline-block', width: 2.5, height: 21 * PT, backgroundColor: C.blue, marginLeft: 2, verticalAlign: 'middle' }} />}
      </span>
      {text ? (
        <div style={{ width: 29 * PT, height: 29 * PT, borderRadius: 15 * PT, backgroundColor: C.blue, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width={13 * PT} height={15 * PT} viewBox="0 0 13 15">
            <path d="M6.5 13.5 V2 M1.5 6.8 L6.5 1.6 L11.5 6.8" fill="none" stroke="#fff" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      ) : (
        <svg width={14 * PT} height={20 * PT} viewBox="0 0 14 20" style={{ marginRight: 8 * PT }}>
          <rect x={4} y={1} width={6} height={11} rx={3} fill="none" stroke="#8A8A8E" strokeWidth={1.6} />
          <path d="M1.5 9 A5.5 5.5 0 0 0 12.5 9 M7 14.5 V18.5" fill="none" stroke="#8A8A8E" strokeWidth={1.6} strokeLinecap="round" />
        </svg>
      )}
    </div>
  </div>
);

const Key: React.FC<{ x: number; y: number; w: number; label: string; alt?: boolean; size?: number }> = ({ x, y, w, label, alt, size = 22 }) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      width: w,
      height: KEY_H,
      borderRadius: 5 * PT,
      backgroundColor: alt ? C.keyAlt : C.key,
      boxShadow: `0 ${1 * PT}px 0 ${C.keyShadow}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <span style={{ fontFamily: FONT, fontSize: size * PT, color: C.text, marginTop: -2 }}>{label}</span>
  </div>
);

const Keyboard: React.FC<{ pressed: string | null }> = ({ pressed }) => {
  const rowY = (r: number) => PRED_H + 8 * PT + r * (KEY_H + ROW_GAP);
  const pk = pressed ? keyPos(pressed) : null;
  const sideW = 42 * PT;
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: KB_H, backgroundColor: C.kbBg }}>
      {/* predictive bar */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: PRED_H, display: 'flex', alignItems: 'center' }}>
        {['"I"', 'The', 'I’m'].map((w, i) => (
          <div key={w} style={{ flex: 1, textAlign: 'center', borderLeft: i ? `1px solid rgba(0,0,0,0.12)` : undefined }}>
            <span style={{ fontFamily: FONT, fontSize: 16 * PT, color: C.text }}>{w}</span>
          </div>
        ))}
      </div>
      {ROWS.map((row, r) => {
        const rowW = row.length * KEY_W + (row.length - 1) * GAP_X;
        const x0 = (1080 - rowW) / 2;
        return row.split('').map((ch, i) => <Key key={ch} x={x0 + i * (KEY_W + GAP_X)} y={rowY(r)} w={KEY_W} label={ch.toLowerCase()} />);
      })}
      <Key x={3 * PT} y={rowY(2)} w={sideW} label="⇧" alt size={18} />
      <Key x={1080 - 3 * PT - sideW} y={rowY(2)} w={sideW} label="⌫" alt size={18} />
      <Key x={3 * PT} y={rowY(3)} w={sideW} label="123" alt size={15} />
      <Key x={3 * PT + sideW + GAP_X} y={rowY(3)} w={sideW} label="☺" alt size={20} />
      <Key x={3 * PT + 2 * (sideW + GAP_X)} y={rowY(3)} w={1080 - 2 * (3 * PT + 2 * (sideW + GAP_X)) - (88 * PT + GAP_X) + 3 * PT} label="space" size={15} />
      <Key x={1080 - 3 * PT - 88 * PT} y={rowY(3)} w={88 * PT} label="return" alt size={15} />
      {/* home indicator */}
      <div style={{ position: 'absolute', bottom: 8 * PT, left: '50%', marginLeft: -67 * PT, width: 134 * PT, height: 5 * PT, borderRadius: 3 * PT, backgroundColor: '#000' }} />
      {/* key pop-up */}
      {pk && pressed && pressed.trim() && (
        <div
          style={{
            position: 'absolute',
            left: pk.x - 10 * PT,
            top: pk.y - 56 * PT,
            width: KEY_W + 20 * PT,
            height: 56 * PT + KEY_H,
            borderRadius: 9 * PT,
            backgroundColor: '#fff',
            boxShadow: '0 4px 14px rgba(0,0,0,0.25)',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <span style={{ fontFamily: FONT, fontSize: 34 * PT, color: C.text, marginTop: 6 * PT }}>{pressed}</span>
        </div>
      )}
    </div>
  );
};

// ---- scene -----------------------------------------------------------------
export const ChatReal: React.FC<{ f: number }> = ({ f }) => {
  const { text, key } = typedText(f);
  const shown = MSGS.filter((m) => f >= m.at);
  const lastMeIdx = shown.map((m) => m.me).lastIndexOf(true);
  const dots = MSGS.find((m) => m.dots && f >= m.dots[0] && f < m.dots[1]);

  // camera: punch into the last bubble, accelerating into the drop
  const push = lerp(f, ZOOM_FROM, 200, 0, 1, FS_EASE.inOut);
  const zoom = 1 + push * 0.32 + lerp(f, PUNCH, DROP, 0, 3.5, FS_EASE.in);
  const panX = push * (540 - BUB_X);
  const panY = push * (960 - BUB_Y);
  const blur = lerp(f, DROP - 6, DROP, 0, 16, FS_EASE.in);
  const thump = f >= MSGS[6].at ? Math.exp(-(f - MSGS[6].at) * 0.25) * Math.sin((f - MSGS[6].at) * 2.4) * 10 : 0;

  return (
    <AbsoluteFill style={{ backgroundColor: '#fff', overflow: 'hidden' }}>
      <AbsoluteFill
        style={{
          transform: `translate(${thump + panX}px, ${panY}px) scale(${zoom})`,
          transformOrigin: `${BUB_X}px ${BUB_Y}px`,
          filter: blur > 0.5 ? `blur(${blur}px)` : undefined,
        }}
      >
        {/* thread: bottom-anchored, scrolls up under the header */}
        <div
          style={{
            position: 'absolute',
            left: 16 * PT,
            right: 16 * PT,
            top: 0,
            height: INPUT_TOP - 6 * PT,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            overflow: 'hidden',
          }}
        >
          <p style={{ margin: `0 0 ${6 * PT}px`, textAlign: 'center', fontFamily: FONT, fontSize: 11 * PT, color: C.muted }}>
            <span style={{ fontWeight: 600 }}>iMessage</span>
            <br />
            Today 9:41 PM
          </p>
          {shown.map((m, i) => {
            const next = shown[i + 1];
            const prev = shown[i - 1];
            return (
              <Bubble
                key={i}
                m={m}
                f={f}
                tail={!next || next.me !== m.me}
                delivered={i === lastMeIdx}
                groupTop={!prev || prev.me !== m.me}
              />
            );
          })}
          {dots && <Dots f={f} at={dots.dots![0]} />}
        </div>
        <Header />
        <InputBar text={text} />
        <Keyboard pressed={key} />
      </AbsoluteFill>
      {/* focus vignette on the punchline during the push-in */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(600px 230px at ${BUB_X + panX}px ${BUB_Y + panY}px, transparent 60%, rgba(0,0,0,0.55) 100%)`,
          opacity: push * 0.85,
        }}
      />
      {/* drop flash */}
      <AbsoluteFill style={{ backgroundColor: FS.green, opacity: lerp(f, DROP - 5, DROP, 0, 0.9, FS_EASE.in) }} />
    </AbsoluteFill>
  );
};
