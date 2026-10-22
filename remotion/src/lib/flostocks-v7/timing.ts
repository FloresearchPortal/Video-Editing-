// v7 beat grid — "Take this Higher" launch edit (videos/flostocks-whatis/work/music_v7.py):
// 124 BPM, the drop lands on frame 314 (when the chat bubble has opened into FloStocks).
//   bars 0–8 drop A · 8–10 break · 10 stop bar (hit + 3 silent beats) · 11–17 drop B · 17–20 outro
export const FPS = 30;
export const BPM = 124;
export const BEATF = (FPS * 60) / BPM; // 14.516 frames per beat
export const BARF = BEATF * 4; // 58.065 frames per bar
export const DROP = 314; // 10.467 s
export const SHOW_BARS = 20;
export const barF = (bar: number) => Math.round(DROP + bar * BARF);
export const END = barF(SHOW_BARS); // 1475
export const TOTAL = 1490; // music file length (49.7 s)
export const b = (n: number) => n * BEATF;
