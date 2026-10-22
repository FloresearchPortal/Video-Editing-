// Beat grid for the v3 reel, measured from the music bed (Mixkit "What About Action?",
// 121.00 BPM; drop downbeat at 63.6904 s in the track). The track is started at
// MUSIC_OFFSET_S so that its drop lands exactly on frame DROP — the moment the chat
// punches into "THEY ARE NOW IN STOCKS". Every showreel cut sits on a bar line.
export const FPS = 30;
export const BPM = 121.0;
export const BEATF = (FPS * 60) / BPM; // 14.876 frames per beat
export const BARF = BEATF * 4; // 59.504 frames per bar

export const DROP = 224; // frame of the drop downbeat
export const TRACK_DROP_S = 63.6904;
export const MUSIC_OFFSET_S = TRACK_DROP_S - DROP / FPS; // 56.2237 s into the track

export const SHOW_BARS = 23;
export const barF = (bar: number) => Math.round(DROP + bar * BARF);
export const END = barF(SHOW_BARS); // 1593 frames = 53.1 s

// scene-local beat n -> frame offset (float is fine for springs/interpolate)
export const b = (n: number) => n * BEATF;
