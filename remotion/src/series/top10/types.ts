// What an episode supplies. Everything else (intro, layout, motion, transitions, CTA) is the series.
export type Ink = 'ink' | 'green' | 'white' | 'grey';
export type Seg = { t: string; c?: Ink };

// Topic title, built as the logo lockup: 2-3 lines (one colour each, ink first then green) + pill label.
export type Title = { lines: { t: string; c: Ink }[]; pill: string };

// logo: file under media/ (official company logo supplied by the user); none -> no logo slot is drawn
export type RankItem = { rank: number; ticker: string; name: string; value: number; logo?: string };
export type Rankings = {
  heading: Seg[][]; // [[TOP 10 BY], [MARKET CAP]]
  subtitle: string; // Rs bn · PSX close 14 Oct 2026
  pre: string; post: string; decimals: number; // value label: `${pre}${value}${post}`, e.g. Rs 1,289.16 bn
  items: RankItem[]; // rank 1..10
  total?: { label: string; value: string }; // optional summary pill under the chart
  source: string;
};

export type Episode = { ep: string; title: Title; rankings: Rankings };

// Timeline (beats; shared with the music generator). Section starts are fixed by the series format.
export type Timeline = {
  bpm: number; fps: number;
  sections: Record<'intro' | 'title' | 'rank' | 'cta', { start: number; end?: number; energy: string; static_from?: number; hold_seconds?: number }>;
  cues: { beat: number; type: string; to?: number }[];
};
