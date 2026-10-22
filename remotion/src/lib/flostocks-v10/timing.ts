// v10 beat grid — instrumental "Take this Higher" launch edit (work/music_v10.py), 124 BPM.
// Music builds from "Wo tou pmex…" (frame 112), is loud when the punchline turns green on a
// beat (frame 272); the message cuts straight to the logo animation ON the drop at 0:11 (330).
//   bars 0–8 drop A · 8 break riser + 9 stop bar (Regulated) · 10–13 drop B montage ·
//   13 build (riser + roll) "All of PSX." · 14 CTA drop · 15–16.5 beat silent: logo + details
export const FPS = 30;
export const BPM = 124;
export const BEATF = (FPS * 60) / BPM; // 14.516 frames per beat
export const BARF = BEATF * 4; // 58.065 frames per bar
export const DROP = 330; // 11.0 s
export const HIT = Math.round(DROP - BARF); // 272 — the punchline turns green on this beat
export const MUSIC_IN = 112;
export const SHOW_BARS = 16.5;
export const barF = (bar: number) => Math.round(DROP + bar * BARF);
export const END = barF(SHOW_BARS); // 1288
export const TOTAL = 1294; // music file length (43.15 s)
export const b = (n: number) => n * BEATF;
