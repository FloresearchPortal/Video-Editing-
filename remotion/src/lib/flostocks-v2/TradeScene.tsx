// Scene 4 (17.6–25.6 s): "TRADE THE PAKISTAN STOCK EXCHANGE" over a neon grid floor.
// Floating glass cards: a live index chart drawing itself, a watchlist with rolling
// prices, an order ticket a cursor taps, and an iOS-style "Order placed" toast.
// Tickers and prices are illustrative UI, not market data or a performance claim.
import React from 'react';
import { AbsoluteFill } from 'remotion';
import { evolvePath, getLength, getPointAtLength } from '@remotion/paths';
import { CheckCircle2 } from 'lucide-react';
import { FS, FS_BODY, FS_EASE, FS_MONO, FsWatermark, fsHeadline } from '../flostocks';
import { Blobs, Cursor, GridFloor, Particles, Ripple, Slam, glass, lerp, sp, SOFT } from './fx';

const WATCH = [
  { sym: 'OGDC', name: 'Oil & Gas Dev.', price: 221.4, chg: '+1.84%', up: true },
  { sym: 'LUCK', name: 'Lucky Cement', price: 1180.25, chg: '+0.92%', up: true },
  { sym: 'HBL', name: 'Habib Bank', price: 158.1, chg: '−0.45%', up: false },
  { sym: 'SYS', name: 'Systems Ltd', price: 470.66, chg: '+2.10%', up: true },
  { sym: 'ENGRO', name: 'Engro Corp', price: 318.02, chg: '+0.67%', up: true },
] as const;

const CHART = 'M 0 300 L 60 280 L 120 292 L 190 246 L 250 258 L 320 206 L 380 224 L 450 170 L 510 190 L 580 134 L 640 152 L 710 96 L 770 112 L 840 52';
const CHART_LEN = getLength(CHART);

const fmt = (n: number) => n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const CLICK = 150;
const TOAST = 160;

export const TradeScene: React.FC<{ t: number }> = ({ t }) => {
  const chartIn = sp(t, 8, SOFT);
  const draw = lerp(t, 16, 86, 0, 1, FS_EASE.inOut);
  const { strokeDasharray, strokeDashoffset } = evolvePath(draw, CHART);
  const head = getPointAtLength(CHART, Math.max(0.01, draw * CHART_LEN));
  const listIn = sp(t, 34, SOFT);
  const ticket = sp(t, 100, { damping: 15, stiffness: 150, mass: 0.8 });
  const toast = sp(t, TOAST, { damping: 14, stiffness: 160, mass: 0.7 });

  // cursor path: enters bottom-right, glides to the button, clicks
  const cx = lerp(t, 116, 146, 1000, 660, FS_EASE.inOut);
  const cy = lerp(t, 116, 146, 1960, 1478, FS_EASE.inOut);
  const pressed = t >= CLICK - 2 && t < CLICK + 6 ? 1 : 0;
  const placed = t >= CLICK + 4;

  const tiltX = 8 + Math.sin(t / 40) * 3;
  const tiltY = Math.sin(t / 33) * 6;
  const push = lerp(t, 0, 240, 1, 1.06, (n) => n);
  const live = 0.5 + 0.5 * Math.sin(t * 0.35);

  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      <Blobs t={t + 600} base={FS.paper} colors={['rgba(56,209,0,0.26)', 'rgba(126,220,168,0.32)']} />
      <GridFloor t={t} color="rgba(56,209,0,0.3)" />
      <Particles t={t} color={FS.green} speed={1.2} />

      {/* headline */}
      <div style={{ position: 'absolute', top: 150, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Slam t={t} at={0} rot={-6}>
          <h1 style={{ ...fsHeadline(90, FS.ink) }}>Trade the</h1>
        </Slam>
        <Slam t={t} at={5} rot={6}>
          <h1 style={{ ...fsHeadline(90, FS.green) }}>Pakistan Stock</h1>
        </Slam>
        <Slam t={t} at={10} rot={-6}>
          <h1 style={{ ...fsHeadline(90, FS.green) }}>Exchange</h1>
        </Slam>
      </div>

      {/* 3D card stage */}
      <AbsoluteFill style={{ perspective: 2200, transform: `scale(${push})` }}>
        <AbsoluteFill style={{ transformStyle: 'preserve-3d', transform: `rotateX(${tiltX}deg) rotateY(${tiltY}deg)` }}>
          {/* chart card */}
          <div
            style={{
              ...glass(false),
              position: 'absolute',
              left: 70,
              top: 520,
              width: 940,
              height: 450,
              padding: '34px 44px',
              transform: `translateY(${(1 - chartIn) * 700}px) translateZ(40px)`,
              opacity: Math.min(1, chartIn * 2),
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <p style={{ margin: 0, fontFamily: FS_MONO, fontWeight: 600, fontSize: 38, color: FS.ink }}>KSE-100</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 16, height: 16, borderRadius: 8, backgroundColor: FS.green, boxShadow: `0 0 ${18 * live}px ${FS.green}` }} />
                <p style={{ margin: 0, fontFamily: FS_MONO, fontWeight: 600, fontSize: 32, color: FS.greenDeep }}>PSX · LIVE</p>
              </div>
            </div>
            <svg width="852" height="320" viewBox="-6 30 852 290" style={{ display: 'block', marginTop: 22, overflow: 'visible' }}>
              <defs>
                <linearGradient id="fsArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={FS.green} stopOpacity={0.45} />
                  <stop offset="100%" stopColor={FS.green} stopOpacity={0} />
                </linearGradient>
              </defs>
              <path d={`${CHART} L 840 320 L 0 320 Z`} fill="url(#fsArea)" opacity={draw} />
              <path
                d={CHART}
                fill="none"
                stroke={FS.green}
                strokeWidth={8}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                style={{ filter: `drop-shadow(0 0 10px ${FS.green})` }}
              />
              {draw > 0.01 && (
                <>
                  <circle cx={head.x} cy={head.y} r={26 + live * 10} fill={FS.green} opacity={0.25} />
                  <circle cx={head.x} cy={head.y} r={13} fill={FS.paper} stroke={FS.green} strokeWidth={6} />
                </>
              )}
            </svg>
          </div>

          {/* watchlist */}
          <div
            style={{
              ...glass(false),
              position: 'absolute',
              left: 70,
              top: 1010,
              width: 940,
              padding: '18px 40px',
              transform: `translateY(${(1 - listIn) * 900}px) translateZ(10px)`,
              opacity: Math.min(1, listIn * 2),
            }}
          >
            {WATCH.map((w, i) => {
              const at = 40 + i * 5;
              const s = sp(t, at, { damping: 15, stiffness: 190, mass: 0.6 });
              const roll = lerp(t, at, at + 26, 0.9, 1, FS_EASE.out);
              return (
                <div
                  key={w.sym}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '20px 0',
                    borderBottom: i < WATCH.length - 1 ? '1px solid rgba(10,14,10,0.07)' : undefined,
                    transform: `translateX(${(1 - s) * 260}px)`,
                    opacity: s,
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <p style={{ margin: 0, fontFamily: FS_MONO, fontWeight: 600, fontSize: 40, color: FS.ink }}>{w.sym}</p>
                    <p style={{ margin: '2px 0 0', fontFamily: FS_BODY, fontWeight: 300, fontSize: 26, color: FS.gray }}>{w.name}</p>
                  </div>
                  <p style={{ margin: 0, fontFamily: FS_MONO, fontWeight: 500, fontSize: 38, color: FS.ink, width: 260, textAlign: 'right' }}>
                    {fmt(w.price * roll)}
                  </p>
                  <div
                    style={{
                      marginLeft: 26,
                      width: 190,
                      padding: '10px 0',
                      borderRadius: 16,
                      textAlign: 'center',
                      backgroundColor: w.up ? 'rgba(56,209,0,0.14)' : 'rgba(226,59,46,0.12)',
                    }}
                  >
                    <span style={{ fontFamily: FS_MONO, fontWeight: 600, fontSize: 34, color: w.up ? FS.rise : FS.fall }}>{w.chg}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </AbsoluteFill>
      </AbsoluteFill>

      {/* order ticket (screen space, above the stage) */}
      <div
        style={{
          ...glass(false),
          border: `3px solid ${FS.green}`,
          boxShadow: '0 30px 80px rgba(31,122,0,0.28)',
          position: 'absolute',
          left: 300,
          top: 1290,
          width: 700,
          padding: '34px 40px',
          transform: `translateY(${(1 - ticket) * 900}px) rotate(${(1 - ticket) * 8}deg)`,
          opacity: Math.min(1, ticket * 2),
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <span style={{ fontFamily: FS_BODY, fontWeight: 700, fontSize: 28, color: FS.ink, backgroundColor: FS.green, padding: '6px 18px', borderRadius: 12 }}>BUY</span>
          <span style={{ fontFamily: FS_MONO, fontWeight: 600, fontSize: 46, color: FS.ink }}>OGDC</span>
          <span style={{ marginLeft: 'auto', fontFamily: FS_BODY, fontSize: 30, color: FS.gray }}>Qty 100 · Market</span>
        </div>
        <div
          style={{
            marginTop: 28,
            height: 112,
            borderRadius: 30,
            backgroundColor: placed ? FS.ink : FS.green,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 14,
            transform: `scale(${pressed ? 0.95 : 1})`,
          }}
        >
          {placed && <CheckCircle2 size={44} color={FS.green} strokeWidth={2.6} />}
          <span style={{ fontFamily: FS_BODY, fontWeight: 700, fontSize: 44, color: placed ? FS.green : FS.ink }}>
            {placed ? 'Order placed' : 'Place order'}
          </span>
        </div>
      </div>

      <Ripple t={t} at={CLICK} x={655} y={1470} />
      {t >= 112 && t < 200 && <Cursor x={cx} y={cy} pressed={pressed} opacity={lerp(t, 186, 200, 1, 0)} />}

      {/* iOS-style toast */}
      <div
        style={{
          position: 'absolute',
          left: 50,
          right: 50,
          top: 44,
          transform: `translateY(${(1 - toast) * -320}px) scale(${0.9 + toast * 0.1})`,
          opacity: Math.min(1, toast * 2),
          backgroundColor: 'rgba(255,255,255,0.94)',
          borderRadius: 48,
          padding: '28px 34px',
          display: 'flex',
          alignItems: 'center',
          gap: 26,
          boxShadow: '0 30px 80px rgba(10,14,10,0.22)',
          border: '1.5px solid rgba(10,14,10,0.06)',
          zIndex: 30,
        }}
      >
        <div style={{ width: 96, height: 96, borderRadius: 24, backgroundColor: FS.green, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <CheckCircle2 size={58} color={FS.ink} strokeWidth={2.4} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontFamily: FS_BODY, fontWeight: 700, fontSize: 36, color: FS.ink }}>Order placed</span>
            <span style={{ fontFamily: FS_BODY, fontSize: 28, color: FS.gray }}>now</span>
          </div>
          <span style={{ fontFamily: FS_BODY, fontSize: 32, color: FS.gray }}>OGDC × 100 · Pakistan Stock Exchange</span>
        </div>
      </div>

      {t < TOAST && <FsWatermark width={1080} onLight />}
    </AbsoluteFill>
  );
};
