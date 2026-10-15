// EP 01 timing (beats, from timeline.json, shared with the music generator) + PSX data.
import tl from './timeline.json';
import data from './data.json';
import logos from './logos.json';

export const FPS = tl.fps;
export const FPB = (tl.fps * 60) / tl.bpm;
export const bf = (beat: number) => beat * FPB;
export const S = tl.sections;
export const WIPES = tl.wipes;
export const CTA_STATIC = Math.round(bf(S.cta.static_from));
export const END_FRAME = Math.round(CTA_STATIC + S.cta.hold_seconds * FPS);

export type Co = { rank: number; ticker: string; name: string; sector: string; mcap_bn: number; share_pct: number; price: number; shares: number };
export const DATA = data as unknown as { source: string; close_date: string; total_bn: number; top10: Co[] };
export const TOP = [...DATA.top10].sort((a, b) => a.rank - b.rank) as Co[];
export const ONE = TOP[0];
export const SOURCE_LINE = `Source: ${DATA.source} · close ${DATA.close_date}`;
export const HAS_LOGOS = TOP.every((c) => (logos as Record<string, unknown>)[c.ticker]);
