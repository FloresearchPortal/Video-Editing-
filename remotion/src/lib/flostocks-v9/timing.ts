// v9 beat grid — instrumental "Take this Higher" launch edit (work/music_v9.py), 124 BPM.
// Music builds from "Wo tou pmex…" (frame 112), is loud by the green moment (frame 272, on a
// beat) and DROPS on the FloStocks logo at exactly 0:11 (frame 330).
//   bars 0–6 drop A · 6 stop bar · 7–11 drop B montage · 11–13 "Why look abroad" build ·
//   13 CTA drop · 13.75… beat silences for the logo + details · end 15.5
export const FPS = 30;
export const BPM = 124;
export const BEATF = (FPS * 60) / BPM; // 14.516 frames per beat
export const BARF = BEATF * 4; // 58.065 frames per bar
export const DROP = 330; // 11.0 s
export const HIT = Math.round(DROP - BARF); // 272 — the punchline turns green on this beat
export const MUSIC_IN = 112; // music starts under "Wo tou pmex ke top broker nai?"
export const SHOW_BARS = 15.5;
export const barF = (bar: number) => Math.round(DROP + bar * BARF);
export const END = barF(SHOW_BARS); // 1230
export const TOTAL = 1240;
export const b = (n: number) => n * BEATF;
