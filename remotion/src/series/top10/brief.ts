// The episode BRIEF: the only thing that changes between PSX TOP 10 episodes. Plain JSON, no styling:
// colours, fonts, layout, motion, music and the CTA are locked by the series. fromBrief() maps it onto
// the components. Validated before render by videos/top10/make_episode.py.
import type { Episode, Ink, Seg } from './types';

export type Brief = {
  episode: string; // "EP 02"
  slug: string; // "ep02-dividend-yield"
  title: string[]; // 2-3 lines; line 1 ink, the rest green
  pill: string; // "IN PSX"
  rankings: {
    heading: string[]; // 2 lines; last line green
    subtitle: string;
    value_format: { pre: string; post: string; decimals: number };
    items: { rank: number; ticker: string; name?: string; value: number }[];
    total?: { label: string; value: string };
    source: string;
  };
  logos?: Record<string, string>; // TICKER -> path under media/ (filled in by make_episode.py)
};

// last line green, the rest ink
const lines = (ls: string[]): Seg[][] => ls.map((t, i) => [{ t, c: (i === ls.length - 1 ? 'green' : 'ink') as Ink }]);

export const fromBrief = (b: Brief): Episode => ({
  ep: b.episode,
  title: { lines: b.title.map((t, i) => ({ t, c: i === 0 ? 'ink' : 'green' })), pill: b.pill },
  rankings: {
    heading: lines(b.rankings.heading),
    subtitle: b.rankings.subtitle,
    pre: b.rankings.value_format.pre, post: b.rankings.value_format.post, decimals: b.rankings.value_format.decimals,
    items: b.rankings.items.map((c) => ({ rank: c.rank, ticker: c.ticker, name: c.name ?? c.ticker, value: c.value, logo: b.logos?.[c.ticker] })),
    total: b.rankings.total,
    source: b.rankings.source,
  },
});
