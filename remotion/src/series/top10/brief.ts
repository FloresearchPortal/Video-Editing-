// The episode BRIEF: the only thing that changes between PSX TOP 10 episodes. Plain JSON, no styling:
// colours, fonts, layout, motion, music and the CTA are locked by the series. fromBrief() maps it onto
// the components. Validated before render by videos/top10/make_episode.py.
import type { Episode, Ink, Seg, Term } from './types';

export type BriefTerm = { label: string; note: string; value: string; pre?: string; post?: string; visual?: 'one' | 'many' };
export type Brief = {
  episode: string; // "EP 02"
  slug: string; // "ep02-dividend-yield"
  title: string[]; // 2-3 lines; line 1 ink, the rest green
  pill: string; // "IN PSX"
  explainer: {
    kicker: string; question: string[]; // 2 lines; last line green
    a: BriefTerm; op: '×' | '÷' | '+' | '−'; b: BriefTerm; result: BriefTerm;
    example: string; takeaway: string[]; // 2 lines; line 2 green
  };
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

// first line ink, the rest green (or: last line green when `lastOnly`)
const lines = (ls: string[], lastOnly = false): Seg[][] =>
  ls.map((t, i) => [{ t, c: (lastOnly ? i === ls.length - 1 : i > 0) ? 'green' : 'ink' as Ink }]);
const term = (t: BriefTerm): Term => ({ label: t.label, note: t.note, value: t.value, pre: t.pre, post: t.post, visual: t.visual });

export const fromBrief = (b: Brief): Episode => ({
  ep: b.episode,
  title: { lines: b.title.map((t, i) => ({ t, c: i === 0 ? 'ink' : 'green' })), pill: b.pill },
  explainer: {
    kicker: b.explainer.kicker,
    question: lines(b.explainer.question, true),
    a: term(b.explainer.a), op: b.explainer.op, b: term(b.explainer.b), result: term(b.explainer.result),
    example: b.explainer.example,
    takeaway: lines(b.explainer.takeaway),
  },
  rankings: {
    heading: lines(b.rankings.heading, true),
    subtitle: b.rankings.subtitle,
    pre: b.rankings.value_format.pre, post: b.rankings.value_format.post, decimals: b.rankings.value_format.decimals,
    items: b.rankings.items.map((c) => ({ rank: c.rank, ticker: c.ticker, name: c.name ?? c.ticker, value: c.value, logo: b.logos?.[c.ticker] })),
    total: b.rankings.total,
    source: b.rankings.source,
  },
});
