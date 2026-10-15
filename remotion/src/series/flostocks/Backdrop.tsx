// Series backdrop: the site hero's white-to-mint wash, soft green light and a faint grid. Static.
import React from 'react';
import { AbsoluteFill } from 'remotion';

export const Backdrop: React.FC = () => (
  <AbsoluteFill style={{ background: 'linear-gradient(180deg, #FFFFFF, #F7FBF8)' }}>
    <AbsoluteFill style={{ background: 'radial-gradient(900px 620px at 82% 6%, rgba(44,156,0,0.10), transparent 62%), radial-gradient(760px 640px at 0% 94%, rgba(44,156,0,0.05), transparent 62%)' }} />
    <AbsoluteFill style={{ backgroundImage: 'linear-gradient(#EEF2EF 2px, transparent 2px), linear-gradient(90deg, #EEF2EF 2px, transparent 2px)', backgroundSize: '90px 90px', opacity: 0.7 }} />
  </AbsoluteFill>
);
