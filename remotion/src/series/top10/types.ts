// What an episode supplies. Everything else (intro, layout, motion, transitions, CTA) is the series.
export type Ink = 'ink' | 'green' | 'white' | 'grey';
export type Seg = { t: string; c?: Ink };

// Topic title, built as the logo lockup: 2-3 lines (one colour each, ink first then green) + pill label.
export type Title = { lines: { t: string; c: Ink }[]; pill: string };

// Explainer: one simple formula  A (op) B = RESULT, shown with a worked example.
export type Term = {
  label: string; // SHARE PRICE
  note: string; // the price of one share
  pre?: string; // Rs
  value: string; // 299.74 (digits flip on a split-flap board)
  post?: string; // bn
  visual?: 'one' | 'many'; // one share chip / a row of share chips
};
export type Explainer = {
  kicker: string; // THE BASIS OF THIS RANKING
  question: Seg[][]; // [[WHAT IS], [MARKET CAP?]]
  a: Term; op: '×' | '÷' | '+' | '−'; b: Term; result: Term;
  example: string; // e.g. OGDC · PSX close 14 Oct 2026
  takeaway: Seg[][]; // [[BIGGER MARKET CAP], [= HIGHER RANK]]
};

// logo: file under media/ (official company logo supplied by the user); none -> no logo slot is drawn
export type RankItem = { rank: number; ticker: string; name: string; value: number; logo?: string };
export type Rankings = {
  heading: Seg[][]; // [[TOP 10 BY], [MARKET CAP]]
  subtitle: string; // Rs bn · PSX close 14 Oct 2026
  pre: string; post: string; decimals: number; // value label: `${pre}${value}${post}`, e.g. Rs 1,289.16 bn
  items: RankItem[]; // rank 1..10
  total: { label: string; value: string };
  source: string;
};

export type Episode = { ep: string; title: Title; explainer: Explainer; rankings: Rankings };

// Timeline (beats; shared with the music generator). Section starts are fixed by the series format.
export type Timeline = {
  bpm: number; fps: number;
  sections: Record<'intro' | 'title' | 'explain' | 'rank' | 'cta', { start: number; end?: number; energy: string; static_from?: number; hold_seconds?: number }>;
  cues: { beat: number; type: string; to?: number }[];
};
