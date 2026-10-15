// Beat-based timing, read from timeline.json (shared with the music generator) + data.json (PSX figures).
import tl from './timeline.json';
import data from './data.json';
import logos from './logos.json';

export const FPS = tl.fps;
export const FPB = (tl.fps * 60) / tl.bpm; // frames per beat (12.857 @ 140 BPM, 30 fps)
export const bf = (beat: number) => beat * FPB; // beat -> frame (float; interpolation is sub-frame safe)
export const S = tl.sections;
export const CTA_STATIC = Math.round(bf(S.cta.static_from));
export const END_FRAME = Math.round(CTA_STATIC + S.cta.hold_seconds * FPS);

export type Co = { rank: number; ticker: string; name: string; sector: string; mcap_bn: number; share_pct: number };
export const DATA = data as unknown as { source: string; close_date: string; total_bn: number; top10: Co[] };
export const TOP = [...DATA.top10].sort((a, b) => a.rank - b.rank) as Co[];
export const SOURCE_LINE = `Source: ${DATA.source} · close ${DATA.close_date}`;
// logos are shown only once every top-10 company has its official file
export const HAS_LOGOS = TOP.every((c) => (logos as Record<string, unknown>)[c.ticker]);
