// Showreel timing + camera. Everything is frame-deterministic: camAt(f) returns the camera for any frame.
import tl from './timeline.json';
import data from './data.json';
import { Easing, interpolate } from 'remotion';

export const FPS = tl.fps;
export const FPB = (tl.fps * 60) / tl.bpm;
export const bf = (b: number) => b * FPB;
export const S = tl.sections;
export const CTA_STATIC = Math.round(bf(S.cta.static_from));
export const END_FRAME = Math.round(CTA_STATIC + S.cta.hold_seconds * FPS);

export type Co = { rank: number; ticker: string; mcap_bn: number; price: number; shares: number };
export const DATA = data as unknown as { source: string; close_date: string; total_bn: number; top10: Co[] };
export const TOP = [...DATA.top10].sort((a, b) => a.rank - b.rank) as Co[];

export const CL = { extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const };
export const EZ = {
  out: Easing.bezier(0.16, 1, 0.3, 1),
  inOut: Easing.bezier(0.65, 0, 0.35, 1),
  smooth: Easing.bezier(0.45, 0, 0.2, 1),
  in: Easing.bezier(0.55, 0, 0.75, 0.2),
  back: Easing.bezier(0.34, 1.56, 0.64, 1),
};
export const rp = (f: number, a: number, b: number, e = EZ.out) => interpolate(f, [a, Math.max(b, a + 0.001)], [0, 1], { ...CL, easing: e });
export const mx = (a: number, b: number, t: number) => a + (b - a) * t;
type V3 = [number, number, number];
const mv = (a: V3, b: V3, t: number): V3 => [mx(a[0], b[0], t), mx(a[1], b[1], t), mx(a[2], b[2], t)];

// ---- the price line (world units; ground at y = 0, candle field behind at z < -2)
export const LINE_X0 = -40, LINE_X1 = 40;
export const lineY = (x: number) => 1.5 + 0.04 * (x + 40) + 0.55 * Math.sin(x * 0.33) + 0.22 * Math.sin(x * 1.07 + 1);
export const IGNITE_END = bf(6.2);
const HX0 = -14, HX1 = 34;
export const headX = (f: number) => { const t = Math.min(1, Math.max(0, f / IGNITE_END)); return HX0 + (HX1 - HX0) * (1 - Math.pow(1 - t, 1.35)); };
export const headPassFrame = (x: number) => { // inverse of headX
  if (x <= HX0) return 0;
  if (x >= HX1) return IGNITE_END + 4;
  const p = (x - HX0) / (HX1 - HX0);
  return (1 - Math.pow(1 - p, 1 / 1.35)) * IGNITE_END;
};

// ---- the towers (rank r at x = -(r - 1) * 3, z = 4); #1 is the stacked-coin monolith at x = 0
export const TOWER_Z = 4, TOWER_GAP = 3, TOWER_MAX_H = 15.2;
export const towerX = (r: number) => -(r - 1) * TOWER_GAP;
export const towerH = (m: number) => (TOWER_MAX_H * m) / TOP[0].mcap_bn;
export const riseFrame = (r: number) => bf(S.towers.first_rise + (10 - r)); // #10 on beat 24 ... #2 on beat 32

// ---- camera
type Key = { f: number; pos: V3; look: V3; fov: number; e?: (t: number) => number };
// shot A: the camera rides beside the spark, a little behind and above it, so the drawn line trails off
// to the left and the candles erupt behind it
const trackCam = (f: number): Key => {
  const hx = headX(f), hy = lineY(hx);
  return { f, pos: [hx - 2.6, hy + 1.1, 7.2], look: [hx + 0.9, hy - 0.2, -1.5], fov: 44 };
};
// shot D2: a steady dolly that keeps the tower rising on each beat in frame (#10 on beat 24 ... #2 on 32)
const D2_A = bf(24), D2_B = bf(32);
// the camera sits to the right of the newest tower and looks back down the row: risen towers recede
// behind it, and the next one rises into frame on the right, on its beat
const dollyCam = (f: number): Key => {
  const t = Math.min(1, Math.max(0, (f - D2_A - 6) / (D2_B - D2_A)));
  const tx = -27 + 24 * t;
  return { f, pos: [tx + 4.6, 3.0 + 3.2 * t, 14.5], look: [tx - 3.2, 2.9 + 3.4 * t, 3.5], fov: 48 };
};
const A_END = bf(7);
const KEYS: Key[] = [
  trackCam(A_END),
  { f: bf(12), pos: [3, 33, 33], look: [0, 0, -13], fov: 44, e: EZ.inOut },
  { f: bf(13), pos: [5, 34, 31], look: [0, 0, -13], fov: 44, e: EZ.smooth },
  { f: bf(14.6), pos: [0, 6.6, 11], look: [0, 6, 4], fov: 40, e: EZ.inOut }, // dive to the coin
  { f: bf(16.8), pos: [0.4, 6.5, 10.4], look: [0, 6, 4], fov: 40, e: EZ.smooth },
  { f: bf(19.8), pos: [3.2, 9, 25], look: [0, 7.6, 4], fov: 42, e: EZ.inOut }, // tilt up the stack
  { f: bf(22), pos: [4.4, 6.2, 18.5], look: [0, 8, 4], fov: 42, e: EZ.smooth },
  { ...dollyCam(D2_A), f: D2_A, e: EZ.inOut }, // whip to #10
  { ...dollyCam(D2_B), f: D2_B }, // (dolly: computed, see camAt)
  { f: bf(34.4), pos: [3.4, 0.9, 8.6], look: [0, 10.5, 4], fov: 56, e: EZ.inOut }, // hero #1, low angle
  { f: bf(38.6), pos: [15, 19, 36], look: [-11, 5.5, 2], fov: 46, e: EZ.inOut }, // wide: the row recedes diagonally
  { f: bf(41.5), pos: [-4, 6.4, 19.5], look: [-4.4, 6.4, 9], fov: 42, e: EZ.in }, // push into the logo bars
];
export const camAt = (f: number) => {
  if (f <= A_END) return trackCam(f);
  if (f >= D2_A && f <= D2_B) return dollyCam(f);
  for (let i = 1; i < KEYS.length; i++) {
    const a = KEYS[i - 1], b = KEYS[i];
    if (f <= b.f) {
      const t = (b.e ?? EZ.inOut)((f - a.f) / (b.f - a.f));
      return { pos: mv(a.pos, b.pos, t), look: mv(a.look, b.look, t), fov: mx(a.fov, b.fov, t) };
    }
  }
  const k = KEYS[KEYS.length - 1];
  return { pos: k.pos, look: k.look, fov: k.fov };
};
