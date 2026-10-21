// Scene 5 (25.6–32 s): "EVERYTHING YOU NEED" slams centre then glides to the top;
// five feature cards fly in on the beat, each flipping its toggle on, and a
// "100% FREE" stamp lands for the free learning & tools.
import React from 'react';
import { AbsoluteFill } from 'remotion';
import { Calculator, GraduationCap, LineChart, Newspaper, UserPlus } from 'lucide-react';
import { FS, FS_BODY, FS_EASE, FS_MONO, FsWatermark, fsHeadline } from '../flostocks';
import { Blobs, Particles, Slam, glass, lerp, sp, SNAP } from './fx';

const FEATURES = [
  { Icon: UserPlus, title: 'Open your PSX account', sub: '100% digital onboarding' },
  { Icon: GraduationCap, title: 'PSX Bootcamp', sub: '6 free lessons · guides · ebook' },
  { Icon: LineChart, title: 'PSX Analyzer', sub: 'score any listed company' },
  { Icon: Newspaper, title: 'Research Desk', sub: 'equity notes & IPO analysis' },
  { Icon: Calculator, title: 'Smart calculators', sub: 'commission · SIP · CGT' },
] as const;

const FIRST = 28;
const STEP = 22;
const TOP = 450;
const GAP = 194;
const STAMP = FIRST + STEP * 5 + 8;

const Toggle: React.FC<{ on: number }> = ({ on }) => (
  <div
    style={{
      width: 108,
      height: 62,
      borderRadius: 31,
      padding: 5,
      backgroundColor: on > 0.5 ? FS.green : '#d5dbd7',
      transition: 'none',
    }}
  >
    <div
      style={{
        width: 52,
        height: 52,
        borderRadius: 26,
        backgroundColor: '#fff',
        boxShadow: '0 3px 8px rgba(0,0,0,0.22)',
        transform: `translateX(${on * 46}px)`,
      }}
    />
  </div>
);

export const FeaturesScene: React.FC<{ t: number }> = ({ t }) => {
  const lift = lerp(t, 16, 30, 0, 1, FS_EASE.inOut);
  const stamp = sp(t, STAMP, SNAP);

  return (
    <AbsoluteFill style={{ overflow: 'hidden' }}>
      <Blobs t={t + 900} base={FS.paper} colors={['rgba(56,209,0,0.28)', 'rgba(126,220,168,0.35)', 'rgba(69,224,31,0.18)']} opacity={0.7} />
      <Particles t={t} color={FS.green} speed={0.9} />

      {/* header: centre → top */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 0,
          height: 1920,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          transform: `translateY(${lift * -710}px) scale(${1 - lift * 0.42})`,
        }}
      >
        <p
          style={{
            margin: '0 0 14px',
            fontFamily: FS_MONO,
            fontWeight: 600,
            fontSize: 40,
            letterSpacing: '0.34em',
            color: FS.greenDeep,
            opacity: lerp(t, 2, 10, 0, 1),
          }}
        >
          FLOSTOCKS.COM
        </p>
        <Slam t={t} at={0} rot={-8}>
          <h1 style={{ ...fsHeadline(150, FS.ink) }}>Everything</h1>
        </Slam>
        <Slam t={t} at={6} rot={8}>
          <h1 style={{ ...fsHeadline(150, FS.ink) }}>
            you <span style={{ color: FS.green }}>need</span>
          </h1>
        </Slam>
      </div>

      {FEATURES.map((f, i) => {
        const at = FIRST + i * STEP;
        const s = sp(t, at, { damping: 13, stiffness: 190, mass: 0.65 });
        const icon = sp(t, at + 3, { damping: 10, stiffness: 220, mass: 0.5 });
        const on = lerp(t, at + 9, at + 15, 0, 1, FS_EASE.inOut);
        const float = Math.sin((t + i * 9) / 16) * 5;
        const hero = i === 0;
        return (
          <div
            key={f.title}
            style={{
              ...glass(!hero ? false : true),
              backgroundColor: hero ? FS.ink : 'rgba(255,255,255,0.9)',
              position: 'absolute',
              left: 60,
              width: 960,
              top: TOP + i * GAP,
              height: 168,
              borderRadius: 36,
              display: 'flex',
              alignItems: 'center',
              gap: 32,
              padding: '0 36px',
              transform: `translate(${(1 - s) * 1000}px, ${float}px) rotate(${(1 - s) * 12}deg)`,
              opacity: Math.min(1, s * 2),
            }}
          >
            <div
              style={{
                minWidth: 108,
                height: 108,
                borderRadius: 28,
                backgroundColor: hero ? FS.green : FS.ink,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transform: `rotate(${(1 - icon) * -120}deg) scale(${0.4 + icon * 0.6})`,
              }}
            >
              <f.Icon size={58} color={hero ? FS.ink : FS.green} strokeWidth={2.3} />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ margin: 0, fontFamily: FS_BODY, fontWeight: 700, fontSize: 46, color: hero ? FS.paper : FS.ink, lineHeight: 1.1 }}>{f.title}</p>
              <p style={{ margin: '6px 0 0', fontFamily: FS_BODY, fontWeight: 300, fontSize: 32, color: hero ? FS.mint : FS.gray }}>{f.sub}</p>
            </div>
            <Toggle on={on} />
          </div>
        );
      })}

      {/* 100% FREE stamp */}
      <div
        style={{
          position: 'absolute',
          left: 660,
          top: 1380,
          width: 300,
          height: 300,
          borderRadius: '50%',
          border: `10px solid ${FS.green}`,
          backgroundColor: 'rgba(255,255,255,0.92)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          transform: `scale(${2.8 - stamp * 1.8}) rotate(${-14 + (1 - stamp) * 30}deg)`,
          opacity: Math.min(1, stamp * 2),
          boxShadow: '0 20px 50px rgba(31,122,0,0.35)',
        }}
      >
        <span style={{ fontFamily: FS_MONO, fontWeight: 600, fontSize: 22, color: FS.greenDeep, letterSpacing: '0.1em' }}>LEARN · TOOLS</span>
        <span style={{ ...fsHeadline(86, FS.green), lineHeight: 1 }}>100%</span>
        <span style={{ ...fsHeadline(64, FS.ink), lineHeight: 1 }}>FREE</span>
      </div>

      <FsWatermark width={1080} onLight />
    </AbsoluteFill>
  );
};
