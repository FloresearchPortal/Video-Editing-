// Fixed-width digits (Poppins has no tabular figures): every digit sits in its own equal-width
// cell, so counting numbers never jitter sideways.
import React from 'react';

export const Num: React.FC<{ v: string; cell?: number }> = ({ v, cell = 0.68 }) => (
  <>
    {v.split('').map((ch, i) => (/[0-9]/.test(ch)
      ? <span key={i} style={{ display: 'inline-block', width: `${cell}em`, textAlign: 'center' }}>{ch}</span>
      : <span key={i}>{ch}</span>))}
  </>
);

// up-triangle drawn as SVG (Poppins has no ▲ glyph, and no other font may be used)
export const Up: React.FC<{ color: string }> = ({ color }) => (
  <svg width="0.62em" height="0.62em" viewBox="0 0 10 10" style={{ display: 'inline-block', verticalAlign: '0.02em' }}>
    <path d="M5 1 L9.5 9 L0.5 9 Z" fill={color} />
  </svg>
);
