// Beat-based timing, read from timeline.json (shared with the music generator) + data.json (PSX figures).
import tl from './timeline.json';
import data from './data.json';

export const FPS = tl.fps;
export const FPB = (tl.fps * 60) / tl.bpm; // frames per beat (14.0625 @ 128 BPM, 30 fps)
export const bf = (beat: number) => beat * FPB; // beat -> frame (float; interpolation is sub-frame safe)
export const S = tl.sections;
export const CTA_STATIC = Math.round(bf(S.cta.static_from));
export const END_FRAME = CTA_STATIC + S.cta.hold_seconds * FPS;

export type Co = { rank: number; ticker: string; name: string; sector: string; mcap_bn: number; share_pct: number };
export const DATA = data as unknown as { source: string; close_date: string; total_bn: number; top10: Co[] };
export const TOP = [...DATA.top10].sort((a, b) => a.rank - b.rank) as Co[];
export const SOURCE_LINE = `Source: ${DATA.source} · close ${DATA.close_date}`;

// Countdown slots #10 -> #2 (5 beats each, #2 gets 6) then #1 (revealed on the drop)
export type Slot = { co: Co; beat: number; end: number; prev?: Co };
export const SLOTS: Slot[] = (() => {
  const out: Slot[] = [];
  let b = S.countdown.start;
  for (let r = 10; r >= 2; r--) {
    const len = r === 2 ? S.countdown.beats_rank2 : S.countdown.beats_per_company;
    out.push({ co: TOP[r - 1], beat: b, end: b + len, prev: r < 10 ? TOP[r] : undefined });
    b += len;
  }
  if (b !== S.countdown.end) throw new Error(`countdown beats (${b}) != timeline end (${S.countdown.end})`);
  return out;
})();
export const ONE = TOP[0];
