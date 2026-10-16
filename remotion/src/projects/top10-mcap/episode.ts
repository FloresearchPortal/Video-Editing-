// PSX TOP 10 · EP 01 — Top 10 companies by market capitalization on the PSX.
// All numbers come from data.json (videos/psx-top10/data/fetch_psx.py: PSX Data Portal, close x shares).
import data from './data.json';
import logos from './logos.json';
import tl from './timeline.json';
import type { Episode, Timeline } from '../../series/top10/types';

type Co = { rank: number; ticker: string; name: string; mcap_bn: number; price: number; shares: number };
const D = data as unknown as { source: string; close_date: string; total_bn: number; top10: Co[] };
const top = [...D.top10].sort((a, b) => a.rank - b.rank);
const one = top[0];
const L = logos as Record<string, string>;

export const TIMELINE = tl as unknown as Timeline;

export const EPISODE: Episode = {
  ep: 'EP 01',
  title: [
    { segs: [{ t: 'TOP ', c: 'ink' }, { t: '10', c: 'green' }], max: 250 },
    { segs: [{ t: 'COMPANIES BY', c: 'ink' }], max: 104 },
    { segs: [{ t: 'MARKET', c: 'white' }], max: 150, band: true },
    { segs: [{ t: 'CAPITALIZATION', c: 'white' }], max: 150, band: true },
    { segs: [{ t: 'IN ', c: 'ink' }, { t: 'PSX', c: 'green' }], max: 120 },
  ],
  explainer: {
    kicker: 'HOW THEY ARE RANKED',
    question: [[{ t: 'WHAT IS', c: 'ink' }], [{ t: 'MARKET CAP?', c: 'green' }]],
    a: { label: 'SHARE PRICE', note: 'the price of one share', pre: 'Rs', value: one.price.toFixed(2), visual: 'one' },
    op: '×',
    b: { label: 'TOTAL SHARES', note: 'all the shares the company has', value: (one.shares / 1e9).toFixed(2), post: 'bn', visual: 'many' },
    result: { label: 'MARKET CAP', note: 'what the whole company is worth', pre: 'Rs', value: Math.round(one.mcap_bn).toLocaleString('en-US'), post: 'bn' },
    example: `e.g. ${one.ticker} · PSX close ${D.close_date}`,
    takeaway: [[{ t: 'BIGGER MARKET CAP', c: 'ink' }], [{ t: '= HIGHER RANK', c: 'green' }]],
  },
  rankings: {
    heading: [[{ t: 'TOP 10 BY', c: 'ink' }], [{ t: 'MARKET CAP', c: 'green' }]],
    subtitle: `Rs billion · PSX close ${D.close_date}`,
    pre: 'Rs ', post: ' bn', decimals: 2,
    items: top.map((c) => ({ rank: c.rank, ticker: c.ticker, name: c.name, value: c.mcap_bn, logo: L[c.ticker] })),
    total: { label: 'TOP 10 TOTAL', value: `Rs ${(D.total_bn / 1000).toFixed(2)} trillion` },
    source: `Source: ${D.source} · market cap = close × shares outstanding`,
  },
};
