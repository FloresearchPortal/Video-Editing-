// Beat grid for the v5 reel: an original 128 BPM soundtrack (work/gen_music_v5.py) is
// composed to this timeline, so every cut, riser, stop and hit is frame-locked.
// The chat intro is silent apart from message sounds; music fades in from "but" and
// builds into the drop on frame DROP.
export const FPS = 30;
export const BPM = 128;
export const BEATF = (FPS * 60) / BPM; // 14.0625 frames per beat
export const BARF = BEATF * 4; // 56.25 frames per bar

export const DROP = 314; // 10.4667 s — showreel starts, music drops

export const SHOW_BARS = 17;
export const barF = (bar: number) => Math.round(DROP + bar * BARF);
export const END = barF(SHOW_BARS); // 1270 frames = 42.33 s
export const b = (n: number) => n * BEATF;
