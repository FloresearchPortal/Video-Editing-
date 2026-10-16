// One PSX TOP 10 episode = intro (fixed) -> topic lockup -> explainer -> rankings -> CTA, on the beat grid
// of the episode's timeline.json (150 BPM = 12 frames per beat). The intro zooms through into the topic
// lockup; then the ticker-band shutter, the FloStocks bar wipe and the slant band wipe, each covering its cut.
import React from 'react';
import { AbsoluteFill, Sequence, useCurrentFrame } from 'remotion';
import { BrandWipe, SWAP } from '../flostocks/BrandWipe';
import { CtaCard } from './CtaCard';
import { Explainer } from './Explainer';
import { E, FONT, T, ramp, seriesAsset } from './kit';
import { Rankings } from './Rankings';
import { SeriesIntro } from './SeriesIntro';
import { TopicTitle } from './TopicTitle';
import type { Episode, Timeline } from './types';
import { BandShutter, SHUTTER_SWAP, SlantWipe, slantSwap } from './Wipes';

export const frames = (tl: Timeline) => {
  const fpb = (tl.fps * 60) / tl.bpm, bf = (b: number) => Math.round(b * fpb);
  const s = tl.sections;
  const cta = bf(s.cta.start), ctaStatic = bf(s.cta.static_from ?? s.cta.start + 1.5);
  return { bf, title: bf(s.title.start), explain: bf(s.explain.start), rank: bf(s.rank.start), cta, ctaStatic, end: ctaStatic + Math.round((s.cta.hold_seconds ?? 1.2) * tl.fps) };
};

const DISCLAIMER = 'Investments in securities are subject to market risks. Please read all relevant documents carefully before investing.';

// series header on content scenes: logo left, series tag right
const Header: React.FC<{ ep: string; from: number }> = ({ ep, from }) => {
  const f = useCurrentFrame();
  const t = ramp(f, from + 2, from + 10, E.out);
  return (
    <AbsoluteFill style={{ opacity: t, transform: `translateY(${(1 - t) * -30}px)` }}>
      <img src={seriesAsset('logos/FLOSTOCKS.png')} style={{ position: 'absolute', left: 64, top: 112, width: 250, height: (250 * 306) / 1164 }} />
      <div style={{ position: 'absolute', right: 64, top: 118, height: 52, padding: '0 22px', borderRadius: 26, background: T.ink, display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ width: 12, height: 12, borderRadius: 6, background: T.lime }} />
        <span style={{ fontFamily: FONT, fontWeight: 800, fontSize: 22, letterSpacing: '0.14em', color: '#FFFFFF' }}>PSX TOP 10 · {ep}</span>
      </div>
    </AbsoluteFill>
  );
};

export const Top10Episode: React.FC<{ episode: Episode; tl: Timeline }> = ({ episode, tl }) => {
  const F = frames(tl);
  const slantAt = F.cta - (slantSwap(0) - 0);
  return (
    <AbsoluteFill style={{ background: '#FFFFFF' }}>
      <Sequence durationInFrames={F.title}><SeriesIntro /></Sequence>
      <Sequence from={F.title} durationInFrames={F.explain - F.title}><TopicTitle title={episode.title} /></Sequence>
      <Sequence from={F.explain} durationInFrames={F.rank - F.explain}><Explainer ex={episode.explainer} /></Sequence>
      <Sequence from={F.rank} durationInFrames={F.cta - F.rank}><Rankings r={episode.rankings} /></Sequence>
      <Sequence from={F.explain} durationInFrames={F.cta - F.explain}><Header ep={episode.ep} from={0} /></Sequence>
      <Sequence from={F.cta}><CtaCard disclaimer={DISCLAIMER} /></Sequence>
      <BandShutter at={F.explain - SHUTTER_SWAP} />
      <BrandWipe at={F.rank - SWAP} />
      <SlantWipe at={slantAt} />
    </AbsoluteFill>
  );
};
