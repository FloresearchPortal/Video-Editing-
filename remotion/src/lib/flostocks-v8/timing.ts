// v8 beat grid — instrumental "Take this Higher" launch edit (work/music_v8.py), 124 BPM.
// Music fades in gently from "yes they are"; the punchline bubble turns green on the track's
// last hit (frame 272), the 3-beat stop carries the zoom, and the drop lands on the FloStocks
// logo at exactly 0:11 (frame 330).
//   bars 0–8 drop A · 8 break riser · 9 stop bar (hit + 3 silent beats) · 10–16 drop B · 16–17 outro
export const FPS = 30;
export const BPM = 124;
export const BEATF = (FPS * 60) / BPM; // 14.516 frames per beat
export const BARF = BEATF * 4; // 58.065 frames per bar
export const DROP = 330; // 11.0 s — the beat drops at exactly 0:11
export const HIT = Math.round(DROP - BARF); // 272 — last hit before the stop: bubble turns green
export const SHOW_BARS = 17;
export const barF = (bar: number) => Math.round(DROP + bar * BARF);
export const END = barF(SHOW_BARS); // 1317
export const TOTAL = 1325; // 44.17 s: outro tail rings out, then the end
export const b = (n: number) => n * BEATF;
