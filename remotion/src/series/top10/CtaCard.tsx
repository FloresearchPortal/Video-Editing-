// Series CTA: the intro's logo lockup returns with KNOW THE MARKET, / INVEST SMARTER., the
// flostocks.com bar and the market-risk disclaimer. Builds in 18 frames, then holds perfectly still.
import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { Backdrop } from '../flostocks/Backdrop';
import { E, FONT, T, fitSize, ramp } from './kit';
import { LogoBuild, RiseLine, Rule } from './Lockup';

export const CTA_BUILD = 18;
const L1 = 'KNOW THE MARKET,', L2 = 'INVEST SMARTER.';

export const CtaCard: React.FC<{ disclaimer: string }> = ({ disclaimer }) => {
  const f = useCurrentFrame();
  const size = Math.min(fitSize(L1, 940, 92, '800', 0.01), fitSize(L2, 940, 92, '800', 0.01));
  const bar = ramp(f, 8, 14, E.out);
  return (
    <AbsoluteFill>
      <Backdrop />
      <div style={{ position: 'absolute', left: 160, top: 540 }}><LogoBuild at={0} width={760} /></div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 792 }}><Rule at={4} w={300} /></div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 832 }}><RiseLine text={L1} at={4} size={size} color={T.ink} stagger={0.25} /></div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 832 + size * 1.24 }}><RiseLine text={L2} at={5} size={size} color={T.green} stagger={0.25} /></div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: 860 + size * 2.48 + 30, display: 'flex', justifyContent: 'center' }}>
        <div style={{ height: 64, padding: '0 40px', borderRadius: 32, background: T.lime, display: 'flex', alignItems: 'center', transform: `scaleX(${bar})`,
          fontFamily: FONT, fontWeight: 800, fontSize: 30, letterSpacing: '0.2em', color: '#FFFFFF' }}>FLOSTOCKS.COM</div>
      </div>
      <div style={{ position: 'absolute', left: 90, right: 90, top: 1470, textAlign: 'center', fontFamily: FONT, fontWeight: 500, fontSize: 23, lineHeight: '32px', color: T.grey, opacity: ramp(f, 8, 16) }}>{disclaimer}</div>
    </AbsoluteFill>
  );
};
