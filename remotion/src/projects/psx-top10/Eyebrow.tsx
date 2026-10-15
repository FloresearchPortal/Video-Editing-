// Site-style section eyebrow: short green rule + uppercase grey label.
import React from 'react';
import { C, FONT } from './theme';

export const Eyebrow: React.FC<{ text: string; style?: React.CSSProperties }> = ({ text, style }) => (
  <div style={{ position: 'absolute', left: 0, right: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 14, fontFamily: FONT.display, fontWeight: 600, fontSize: 25, lineHeight: '36px', letterSpacing: '0.14em', color: C.grey, ...style }}>
    <span style={{ width: 34, height: 3, borderRadius: 2, background: C.green }} />
    {text}
  </div>
);
