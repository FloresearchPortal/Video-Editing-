// Beat grid for the v4 reel (same Mixkit track as v3: 121.00 BPM, drop downbeat at
// 63.6904 s). The chat plays at a natural pace over the track's breakdown, then the
// punchline bubble turns green and floods the screen; the drop lands on frame DROP.
export const FPS = 30;
export const BEATF = (FPS * 60) / 121.0; // 14.876 frames per beat
export const BARF = BEATF * 4; // 59.504 frames per bar

export const DROP = 372; // 12.4 s
export const TRACK_DROP_S = 63.6904;
export const MUSIC_OFFSET_S = TRACK_DROP_S - DROP / FPS; // 51.2904 s

export const SHOW_BARS = 16;
export const barF = (bar: number) => Math.round(DROP + bar * BARF);
export const END = barF(SHOW_BARS); // 1324 frames = 44.13 s
export const b = (n: number) => n * BEATF;
