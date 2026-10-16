// Topic title (text changes per episode), built as the FloStocks lockup: the logo mark drops in and the
// wordmark wipes on, a lime rule draws, the topic lines rise letter by letter (ink, then green), the
// pill loads and reveals its label, flostocks.com fades up. All lines share one size, fitted to the
// longest line from the Poppins metrics.
import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { Backdrop } from '../flostocks/Backdrop';
import { E, FONT, T, fitSize, ramp } from './kit';
import { LogoBuild, RiseLine, Rule } from './Lockup';
import type { Ink, Seg, Title } from './types';

export const inkColor = (c: Ink = 'ink') => ({ ink: T.ink, green: T.green, white: '#FFFFFF', grey: T.grey }[c]);
export const segText = (segs: Seg[]) => segs.map((s) => s.t).join('');

export const KLine: React.FC<{ segs: Seg[]; size: number; style?: React.CSSProperties }> = ({ segs, size, style }) => (
  <div style={{ fontFamily: FONT, fontWeight: 900, fontStyle: 'italic', fontSize: size, lineHeight: `${size * 1.08}px`, letterSpacing: '-0.02em', whiteSpace: 'pre', textAlign: 'center', ...style }}>
    {segs.map((s, i) => <span key={i} style={{ color: inkColor(s.c) }}>{s.t}</span>)}
  </div>
);

export const TopicTitle: React.FC<{ title: Title }> = ({ title }) => {
  const f = useCurrentFrame();
  const size = Math.min(92, ...title.lines.map((l) => fitSize(l.t, 940, 92, '800', 0.01)));
  const lh = size * 1.24;
  const linesTop = 290;
  const pillTop = linesTop + lh * title.lines.length + 34;
  const block = pillTop + 64 + 26 + 36; // logo .. flostocks.com
  const top = Math.round(960 - block / 2);
  const pill = ramp(f, 30, 36, E.out), load = ramp(f, 32, 44, E.inOut), label = ramp(f, 40, 46, E.out);
  return (
    <AbsoluteFill>
      <Backdrop />
      <div style={{ position: 'absolute', left: 160, top }}><LogoBuild at={0} width={760} /></div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: top + 252 }}><Rule at={14} /></div>
      {title.lines.map((l, i) => (
        <div key={i} style={{ position: 'absolute', left: 0, right: 0, top: top + linesTop + i * lh }}>
          <RiseLine text={l.t} at={16 + i * 4} size={size} color={inkColor(l.c)} stagger={0.5} />
        </div>
      ))}
      <div style={{ position: 'absolute', left: 0, right: 0, top: top + pillTop, display: 'flex', justifyContent: 'center' }}>
        <div style={{ position: 'relative', width: 380, height: 64, borderRadius: 32, background: T.mint, overflow: 'hidden', transform: `scaleX(${pill})` }}>
          <div style={{ width: `${load * 100}%`, height: '100%', borderRadius: 32, background: T.lime }} />
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: label, transform: `translateY(${(1 - label) * 16}px)`,
            fontFamily: FONT, fontWeight: 800, fontSize: 32, letterSpacing: '0.2em', color: '#FFFFFF' }}>{title.pill}</div>
        </div>
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, top: top + pillTop + 64 + 26, textAlign: 'center', fontFamily: FONT, fontWeight: 600, fontSize: 26, letterSpacing: '0.32em', color: T.grey, opacity: ramp(f, 44, 52) }}>FLOSTOCKS.COM</div>
    </AbsoluteFill>
  );
};
