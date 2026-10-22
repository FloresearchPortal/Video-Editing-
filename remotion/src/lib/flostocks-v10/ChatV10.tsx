// v10 opening: a realistic, full-screen iOS Messages conversation at a natural pace —
// thread starts at the top under the header, no keyboard, no input bar. The music builds
// under the last messages; on a beat the punchline turns FloStocks green and lifts (Apple
// focus: the thread frosts behind it), holds, and cuts straight to the FloStocks logo
// animation exactly on the drop (0:11). No expanding bubble, no full-screen green.
import React from 'react';
import { AbsoluteFill, Easing, Img, interpolate } from 'remotion';
import { FS, FS_BODY, LOGO } from '../flostocks';
import { sp } from '../flostocks-v2/fx';
import { DROP, HIT } from './timing';

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

const mix = (a: string, b: string, k: number) => {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  return `rgb(${pa.map((v, i) => Math.round(v + (pb[i] - v) * Math.min(1, Math.max(0, k)))).join(',')})`;
};

// ---- layout (px) -------------------------------------------------------------
const HEADER_H = 380;

// ---- script ------------------------------------------------------------------
type Msg = { me: boolean; text: string; at: number; dots?: [number, number] };
export const MSGS: Msg[] = [
  { me: false, text: 'i opened my account with floret capitals', at: 26, dots: [2, 26] },
  { me: true, text: 'PMEX?', at: 52 },
  { me: false, text: 'Nope, PSX', at: 80, dots: [58, 80] },
  { me: true, text: 'Wo tou pmex ke top broker nai?', at: 112 }, // music starts building here
  // the last three messages get more room while the music builds (all on beats)
  { me: false, text: 'yes they are', at: 156, dots: [128, 156] },
  { me: false, text: 'but', at: 199 },
  { me: false, text: 'THEY ARE NOW IN STOCKS TOO!', at: 228, dots: [208, 228] },
];
export const PUNCH_AT = 228;
export const FOCUS = HIT; // 272: on a beat of the (now loud) build the bubble turns green, lifts, thread frosts
export const CUT = DROP; // 330: hard cut from the green message to the logo animation, on the drop beat
// Apple's standard "ease" for sheets/zooms: fast start, very soft landing, no overshoot
const APPLE = Easing.bezier(0.32, 0.72, 0, 1);

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

const Bubble: React.FC<{ m: Msg; f: number; tail: boolean; delivered: boolean; groupTop: boolean; hide?: boolean }> = ({
  m,
  f,
  tail,
  delivered,
  groupTop,
  hide = false,
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
          opacity: hide ? 0 : Math.min(1, s * 3),
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

// ---- scene -----------------------------------------------------------------
// punchline bubble body at rest (measured from a full-res still of the top-anchored thread)
const BX0 = 44;
const BY0 = 1315;
const BX1 = 768;
const BY1 = 1473;
const BR = 18 * PT; // bubble corner radius
// where the FloStocks mark sits when the card has opened (= frame 0 of the Brand scene)
export const MARK_X = 540;
export const MARK_Y = 860;
export const MARK = 240;

export const ChatV10: React.FC<{ f: number }> = ({ f }) => {
  const shown = MSGS.filter((m) => f >= m.at);
  const lastMeIdx = shown.map((m) => m.me).lastIndexOf(true);
  const dots = MSGS.find((m) => m.dots && f >= m.dots[0] && f < m.dots[1]);
  const focused = f >= FOCUS;
  const k = interpolate(f, [FOCUS, FOCUS + 14], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: APPLE });
  const green = interpolate(f, [HIT - 1, HIT + 3], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.out(Easing.cubic) }); // snaps green on the beat
  const z = 0; // no expansion: the lifted green message holds and cuts straight to the logo animation on the drop

  // lifted bubble: scales up a touch about its centre and rises on a soft shadow
  const lift = 1 + 0.06 * k;
  const cx = (BX0 + BX1) / 2;
  const cy = (BY0 + BY1) / 2 - 40 * k;
  const w0 = (BX1 - BX0) * lift;
  const h0 = (BY1 - BY0) * lift;
  // window zoom: lifted bubble -> full screen (corner radius eases to 0 at the very end)
  const x0 = interpolate(z, [0, 1], [cx - w0 / 2, 0]);
  const y0 = interpolate(z, [0, 1], [cy - h0 / 2, 0]);
  const x1 = interpolate(z, [0, 1], [cx + w0 / 2, 1080]);
  const y1 = interpolate(z, [0, 1], [cy + h0 / 2, 1920]);
  const radius = BR * lift * (1 - z) + 120 * Math.sin(Math.PI * z) * (1 - z);
  // app-launch hand-off: message text out, card turns white, the FloStocks mark resolves in
  const msgOut = 1;
  const toWhite = 0; // stays green while it opens — no empty white screen; the logo cuts in on the drop
  const markIn = 0; // the card opens to clean white; the FloStocks mark pops in exactly on the drop (Brand scene)

  return (
    <AbsoluteFill style={{ backgroundColor: '#fff', overflow: 'hidden' }}>
      <AbsoluteFill style={{ filter: k > 0.01 ? `blur(${k * 22}px) saturate(${1 + 0.4 * k})` : undefined, transform: `scale(${1 - 0.04 * k})` }}>
        <div
          style={{
            position: 'absolute',
            left: 16 * PT,
            right: 16 * PT,
            top: 0,
            paddingTop: HEADER_H + 10 * PT,
            height: 1920,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
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
                hide={m.at === PUNCH_AT && focused}
              />
            );
          })}
          {dots && <Dots f={f} at={dots.dots![0]} />}
        </div>
        <Header />
        {/* home indicator: hidden once the thread frosts — blurred, it read as a grey box in the bottom half */}
        {!focused && <div style={{ position: 'absolute', bottom: 8 * PT, left: '50%', marginLeft: -67 * PT, width: 134 * PT, height: 5 * PT, borderRadius: 3 * PT, backgroundColor: '#000' }} />}
      </AbsoluteFill>
      {/* frosted veil, like an iOS context-menu / macOS vibrancy backdrop */}
      <AbsoluteFill style={{ backgroundColor: `rgba(246,247,244,${0.5 * k})` }} />

      {/* the punchline, lifted out of the thread and zoomed open */}
      {focused && (
        <div
          style={{
            position: 'absolute',
            left: x0,
            top: y0,
            width: x1 - x0,
            height: y1 - y0,
            borderRadius: radius,
            backgroundColor: toWhite > 0 ? mix(FS.green, '#FFFFFF', toWhite) : mix(C.recv, FS.green, green), // green is already 1 before the zoom
            overflow: 'hidden',
            boxShadow: `0 ${30 * k * (1 - z)}px ${80 * k * (1 - z)}px rgba(10,14,10,${0.22 * k * (1 - z)}), 0 2px 6px rgba(10,14,10,${0.08 * k * (1 - z)})`,
          }}
        >
          <p
            style={{
              position: 'absolute',
              left: 12 * PT * lift,
              top: 7 * PT * lift,
              width: BX1 - BX0 - 24 * PT,
              margin: 0,
              fontFamily: FONT,
              fontSize: 17 * PT,
              lineHeight: 1.3,
              letterSpacing: '-0.01em',
              color: mix('#000000', '#FFFFFF', interpolate(green, [0.15, 0.45], [0, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' })),
              transform: `scale(${lift})`,
              transformOrigin: '0 0',
              opacity: msgOut,
              filter: msgOut < 1 ? `blur(${(1 - msgOut) * 8}px)` : undefined,
            }}
          >
            THEY ARE NOW IN STOCKS TOO!
          </p>
          {markIn > 0 && (
            <Img
              src={LOGO.iconOnLight}
              style={{
                position: 'absolute',
                left: MARK_X - MARK / 2 - x0,
                top: MARK_Y - MARK / 2 - y0,
                width: MARK,
                height: MARK,
                opacity: markIn,
                filter: markIn < 1 ? `blur(${(1 - markIn) * 10}px)` : undefined,
                transform: `scale(${0.7 + 0.3 * markIn})`,
              }}
            />
          )}
        </div>
      )}
    </AbsoluteFill>
  );
};
