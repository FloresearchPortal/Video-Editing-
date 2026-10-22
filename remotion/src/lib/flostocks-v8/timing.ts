// v8 beat grid — instrumental "Take this Higher" launch edit (work/music_v8.py), 124 BPM.
// The punchline bubble turns green on the track's last hit (frame 311), the 3-beat stop
// carries the zoom, and the drop lands on the FloStocks logo at frame 369.
//   bars 0–8 drop A · 8 break riser · 9 stop bar (hit + 3 silent beats) · 10–16 drop B · 16–18 outro
export const FPS = 30;
export const BPM = 124;
export const BEATF = (FPS * 60) / BPM; // 14.516 frames per beat
export const BARF = BEATF * 4; // 58.065 frames per bar
export const DROP = 369; // 12.3 s
export const HIT = Math.round(DROP - BARF); // 311 — last hit before the stop: bubble turns green
export const SHOW_BARS = 18;
export const barF = (bar: number) => Math.round(DROP + bar * BARF);
export const END = barF(SHOW_BARS); // 1414
export const TOTAL = 1430; // music file length (47.68 s)
export const b = (n: number) => n * BEATF;
