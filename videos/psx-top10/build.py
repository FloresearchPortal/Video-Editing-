"""Build the FLOSTOCKS PSX Top 10 reel: music -> Remotion render -> mux -> QA -> stills + contact sheet.

  .venv/bin/python videos/psx-top10/build.py            # full 1080x1920 -> output/psx-top10.mp4
  .venv/bin/python videos/psx-top10/build.py --preview  # half size      -> output/psx-top10_preview.mp4
  .venv/bin/python videos/psx-top10/build.py --stills-only

QA (printed + output/qa.json): format, duration 40-45 s, CTA hold 5 s perfectly still, loudness
-14 LUFS / TP <= -1.5 dBTP on the delivered AAC, silent beat, no black frames.
"""
import argparse, json, re, subprocess, sys
from pathlib import Path
import numpy as np

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[1]
REM = ROOT / 'remotion'
OUT = HERE / 'output'
TL = json.loads((REM / 'src/projects/psx-top10/timeline.json').read_text())
DATA = json.loads((REM / 'src/projects/psx-top10/data.json').read_text())
FPS, BEAT = TL['fps'], 60 / TL['bpm']
S = TL['sections']
bf = lambda b: b * BEAT * FPS
CTA_STATIC = round(bf(S['cta']['static_from']))
END = CTA_STATIC + S['cta']['hold_seconds'] * FPS


def sh(cmd, **kw):
    print('$', ' '.join(map(str, cmd)))
    return subprocess.run(cmd, check=True, **kw)


def key_frames():
    """A still on every transition: section boundaries, every rank change, the drop, the hold."""
    beats = [0.0, 0.5, 1.2, 2.3, 3.3, 4.6, 5.6, 7.0, 7.5, 8.3, 9.5, 12.5, 14.6, 15.4, 16.5, 17.6, 18.2]
    b = S['countdown']['start']
    for r in range(10, 1, -1):
        beats += [b + 0.15, b + 1.5]
        b += S['countdown']['beats_rank2'] if r == 2 else S['countdown']['beats_per_company']
    beats += [63.8, 64.6, 65.5, 66.5, 67.1, 67.6, 69.0, 71.1, 71.6, 72.5, 73.3, 73.9, 74.3, 74.8, 76, 81.9, 82.4, 83, 84]
    frames = sorted({min(END - 1, max(0, round(bf(x)))) for x in beats} | {CTA_STATIC, END - 1})
    return frames


def qa(final: Path, preview: bool):
    rep, fails = {}, []
    pr = json.loads(subprocess.run(['ffprobe', '-v', 'error', '-show_streams', '-show_format', '-of', 'json', str(final)],
                                   capture_output=True, text=True, check=True).stdout)
    v = next(s for s in pr['streams'] if s['codec_type'] == 'video')
    a = next(s for s in pr['streams'] if s['codec_type'] == 'audio')
    dur = float(pr['format']['duration'])
    rep['format'] = dict(size=f"{v['width']}x{v['height']}", fps=v['r_frame_rate'], vcodec=v['codec_name'], pix=v['pix_fmt'],
                         acodec=a['codec_name'], sr=a['sample_rate'], duration=round(dur, 3))
    want = (540, 960) if preview else (1080, 1920)
    if (v['width'], v['height']) != want: fails.append('size')
    if v['r_frame_rate'] != '30/1' or v['codec_name'] != 'h264' or v['pix_fmt'] != 'yuv420p' or a['codec_name'] != 'aac': fails.append('codec')
    if not 40 <= dur <= 45: fails.append('duration')
    head = open(final, 'rb').read(64 * 1024)
    rep['faststart'] = head.find(b'moov') < head.find(b'mdat') if b'mdat' in head else b'moov' in head
    if not rep['faststart']: fails.append('faststart')
    # loudness of the delivered AAC
    err = subprocess.run(['ffmpeg', '-hide_banner', '-nostats', '-i', str(final), '-map', '0:a', '-af', 'ebur128=peak=true', '-f', 'null', '-'],
                         capture_output=True, text=True).stderr
    summ = err[err.rfind('Summary:'):]
    lufs = float(re.search(r'I:\s+(-?[\d.]+) LUFS', summ).group(1))
    tp = float(re.search(r'Peak:\s+(-?[\d.]+) dBFS', summ).group(1))
    rep['loudness'] = dict(lufs=lufs, true_peak_dbtp=tp)
    if abs(lufs + 14) > 0.5: fails.append('lufs')
    if tp > -1.5: fails.append('true_peak')
    # silent beat, measured on the decoded AAC (inner 90% of the beat, codec pre-echo aside)
    pcm = subprocess.run(['ffmpeg', '-v', 'error', '-i', str(final), '-map', '0:a', '-f', 'f32le', '-ac', '1', '-ar', '48000', '-'],
                         capture_output=True, check=True).stdout
    x = np.frombuffer(pcm, '<f4')
    s0, s1 = [int(b * BEAT * 48000) for b in S['build']['silence']]
    pad = int(0.05 * (s1 - s0))
    seg = x[s0 + pad:s1 - pad]
    peak_db = 20 * np.log10(max(1e-12, float(np.abs(seg).max())))
    rep['silent_beat'] = dict(window_s=[round(s0 / 48000, 3), round(s1 / 48000, 3)], peak_dbfs=round(peak_db, 1))
    if peak_db > -70: fails.append('silent_beat')
    # CTA hold: last 5 s must be pixel-still; no black frames anywhere
    w, h = v['width'] // 4, v['height'] // 4
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-ss', f'{CTA_STATIC / FPS + 0.02:.3f}', '-i', str(final), '-vf', f'scale={w}:{h}', '-f', 'rawvideo', '-pix_fmt', 'gray', '-'],
                         capture_output=True, check=True).stdout
    fr = np.frombuffer(raw, np.uint8).reshape(-1, h, w).astype(np.int16)
    still = int(np.abs(fr - fr[0]).max()) if len(fr) else 999
    rep['cta_hold'] = dict(seconds=round((END - CTA_STATIC) / FPS, 2), frames=len(fr), max_pixel_change=still)
    if still > 10 or (END - CTA_STATIC) / FPS < 5: fails.append('cta_hold')
    bd = subprocess.run(['ffmpeg', '-hide_banner', '-i', str(final), '-vf', 'blackdetect=d=0.03:pix_th=0.12', '-an', '-f', 'null', '-'],
                        capture_output=True, text=True).stderr
    rep['black_frames'] = re.findall(r'black_start:\S+ black_end:\S+', bd)
    if rep['black_frames']: fails.append('black_frames')
    rep['data'] = dict(close_date=DATA['close_date'], total_bn=DATA['total_bn'],
                       top10=[(c['rank'], c['ticker'], c['mcap_bn'], c['share_pct']) for c in sorted(DATA['top10'], key=lambda c: c['rank'])])
    rep['fails'] = fails
    rep['passed'] = not fails
    return rep


def contact_sheet(src: Path, out: Path, cols=8):
    from PIL import Image, ImageDraw
    files = sorted(src.glob('f*.png'))
    tw, th = 270, 480
    rows = (len(files) + cols - 1) // cols
    sheet = Image.new('RGB', (cols * (tw + 10) + 10, rows * (th + 36) + 10), (24, 24, 24))
    d = ImageDraw.Draw(sheet)
    for i, f in enumerate(files):
        x, y = 10 + (i % cols) * (tw + 10), 10 + (i // cols) * (th + 36)
        sheet.paste(Image.open(f).convert('RGB').resize((tw, th), Image.LANCZOS), (x, y + 26))
        n = int(f.stem[1:])
        d.text((x + 2, y + 6), f'frame {n}  {n / FPS:5.2f}s  beat {n / (BEAT * FPS):5.2f}', fill=(230, 230, 230))
    sheet.save(out)
    print('contact sheet ->', out.relative_to(ROOT))


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--preview', action='store_true')
    ap.add_argument('--stills-only', action='store_true')
    ap.add_argument('--skip-render', action='store_true')
    a = ap.parse_args()
    OUT.mkdir(exist_ok=True)
    scale = '0.5' if a.preview else '1'
    stills = OUT / ('stills_preview' if a.preview else 'stills')
    if not a.stills_only:
        tag = '_preview' if a.preview else ''
        silent, final = OUT / f'video{tag}_silent.mp4', OUT / f'psx-top10{tag}.mp4'
        if not a.skip_render:
            sh([sys.executable, str(HERE / 'music/make_music.py'), '-o', str(OUT / 'music.wav')])
            sh(['node', 'scripts/psx-top10.mjs', 'video', str(silent), f'--scale={scale}'], cwd=REM)
            sh(['ffmpeg', '-v', 'error', '-y', '-i', str(silent), '-i', str(OUT / 'music.wav'), '-map', '0:v', '-map', '1:a',
                # delivery encode: full-range Remotion frames -> broadcast-range yuv420p BT.709, H.264 High
                '-vf', 'scale=in_range=pc:out_range=tv:out_color_matrix=bt709,format=yuv420p',
                '-c:v', 'libx264', '-profile:v', 'high', '-preset', 'slow', '-crf', '15', '-r', '30',
                '-color_range', 'tv', '-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709',
                '-c:a', 'aac', '-b:a', '256k', '-ar', '48000', '-movflags', '+faststart', '-shortest', str(final)])
        rep = qa(final, a.preview)
        (OUT / f'qa{tag}.json').write_text(json.dumps(rep, indent=1))
        print(json.dumps({k: v for k, v in rep.items() if k != 'data'}, indent=1))
        print('QA', 'PASSED' if rep['passed'] else f"FAILED: {rep['fails']}")
    sh(['node', 'scripts/psx-top10.mjs', 'stills', str(stills), f'--scale={scale}', *map(str, key_frames())], cwd=REM)
    contact_sheet(stills, OUT / ('contact_sheet_preview.png' if a.preview else 'contact_sheet.png'))


if __name__ == '__main__':
    main()
