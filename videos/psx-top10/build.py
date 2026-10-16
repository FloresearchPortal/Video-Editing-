"""Build the FLOSTOCKS PSX Top 10 reel: music -> Remotion render -> mux -> QA -> stills + contact sheet.

  .venv/bin/python videos/psx-top10/build.py            # full 1080x1920 -> output/psx-top10.mp4
  .venv/bin/python videos/psx-top10/build.py --preview  # half size      -> output/psx-top10_preview.mp4
  .venv/bin/python videos/psx-top10/build.py --stills-only
  .venv/bin/python videos/psx-top10/build.py --series[=top10-mcap] [--preview]  # PSX TOP 10 series episode
                                                     # -> output/<episode folder>.mp4

QA (printed + output/qa.json): format, duration <= 20 s, CTA hold perfectly still, loudness
-14 LUFS / TP <= -1.5 dBTP on the delivered AAC, no black frames.
"""
import argparse, json, os, re, subprocess, sys
from pathlib import Path
import numpy as np

# --reel builds the 3D showreel cut (remotion/src/projects/psx-reel) instead of the series 2D cut;
# --series builds the PSX TOP 10 series episode (remotion/src/projects/top10-mcap, kit in src/series/top10)
REEL = '--reel' in sys.argv
SERIES = next((a.split('=', 1)[1] if '=' in a else 'top10-mcap' for a in sys.argv if a.startswith('--series')), None)

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[1]
REM = ROOT / 'remotion'
OUT = HERE / 'output'
PROJ = 'psx-reel' if REEL else SERIES if SERIES else 'psx-top10'
os.environ['PSX_TIMELINE'] = f'remotion/src/projects/{PROJ}/timeline.json'
TL = json.loads((REM / f'src/projects/{PROJ}/timeline.json').read_text())
DATA = json.loads((REM / f'src/projects/{PROJ}/data.json').read_text())
FPS, BEAT = TL['fps'], 60 / TL['bpm']
S = TL['sections']
bf = lambda b: b * BEAT * FPS
CTA_STATIC = round(bf(S['cta']['static_from']))
END = CTA_STATIC + S['cta']['hold_seconds'] * FPS


def sh(cmd, **kw):
    print('$', ' '.join(map(str, cmd)))
    return subprocess.run(cmd, check=True, **kw)


def key_frames_reel():
    beats = [0.2, 1.5, 3.5, 6, 7.5, 10, 12.5, 13.8, 15, 16.6, 17.6, 18.8, 20.2, 21.5, 22.8, 24.5, 26.5, 28.5, 30.5, 32.2, 33.4, 34.6, 36, 38, 39.6, 40.8, 41.6, 42.4, 43]
    return sorted({min(END - 1, max(0, round(bf(x)))) for x in beats} | {CTA_STATIC, END - 1})


def key_frames_series():
    """Stills through every section: intro beats, each title line, explainer steps, every ranking row, CTA."""
    fr = [3, 10, 20, 30, 38, 46, 56, 62, 66, 72, 84, 100, 112]
    b = lambda k: round(bf(S[k]['start']))
    fr += [b('title') + x for x in (4, 12, 24, 60)]
    fr += [b('explain') + x for x in (6, 22, 40, 66, 96, 130)]
    fr += [b('rank') + x for x in (6, 30, 64, 100, 126, 140, 190)]
    fr += [b('cta') + x for x in (4, 10)]
    return sorted({int(min(END - 1, max(0, x))) for x in fr} | {CTA_STATIC, int(END - 1)})


def key_frames():
    """A still on every transition: each wipe, each section's entry and middle, the countdown and the hold."""
    beats = [0.0, 0.3, 0.8, 1.6, 2.4, 3.2]
    for w in TL['wipes']:
        beats += [w + 0.3, w + 0.65, w + 1.2]
    for k, sec in S.items():
        beats += [sec['start'] + 0.5, (sec['start'] + sec.get('end', sec['start'] + 2)) / 2]
    beats += [S['board']['first_row'] + i + 0.4 for i in range(0, 10, 2)] + [S['board']['total'] + 1, S['cta']['static_from']]
    return sorted({min(END - 1, max(0, round(bf(x)))) for x in beats} | {CTA_STATIC, END - 1})


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
    if dur > 20.0: fails.append('duration')  # series + reel: 20 s max
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
    # CTA hold: last 5 s must be pixel-still; no black frames anywhere
    w, h = v['width'] // 4, v['height'] // 4
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-ss', f'{CTA_STATIC / FPS + 0.02:.3f}', '-i', str(final), '-vf', f'scale={w}:{h}', '-f', 'rawvideo', '-pix_fmt', 'gray', '-'],
                         capture_output=True, check=True).stdout
    fr = np.frombuffer(raw, np.uint8).reshape(-1, h, w).astype(np.int16)
    still = int(np.abs(fr - fr[0]).max()) if len(fr) else 999
    rep['cta_hold'] = dict(seconds=round((END - CTA_STATIC) / FPS, 2), frames=len(fr), max_pixel_change=still)
    if still > 10 or (END - CTA_STATIC) / FPS < S['cta']['hold_seconds']: fails.append('cta_hold')
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


def render_reel(silent: Path, scale: str, parts: int = 3):
    """Render the 3D reel as `parts` parallel processes (one browser + one WebGL context each), then join."""
    edges = [round(i * END / parts) for i in range(parts + 1)]
    procs, files = [], []
    for i in range(parts):
        part = OUT / f'reel_part{i}.mp4'
        files.append(part)
        cmd = ['node', 'scripts/psx-reel.mjs', 'video', str(part), 'PsxReel', f'--scale={scale}', '--gl=swangle', f'--range={edges[i]}-{edges[i + 1] - 1}']
        print('$', ' '.join(cmd))
        procs.append(subprocess.Popen(cmd, cwd=REM, stdout=open(OUT / f'reel_part{i}.log', 'w'), stderr=subprocess.STDOUT))
    codes = [p.wait() for p in procs]
    if any(codes):
        raise SystemExit(f'reel part render failed: {codes} (see output/reel_part*.log)')
    lst = OUT / 'reel_parts.txt'
    lst.write_text(''.join(f"file '{f.name}'\n" for f in files))
    sh(['ffmpeg', '-v', 'error', '-y', '-f', 'concat', '-safe', '0', '-i', str(lst), '-c', 'copy', str(silent)])


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--preview', action='store_true')
    ap.add_argument('--stills-only', action='store_true')
    ap.add_argument('--skip-render', action='store_true')
    ap.add_argument('--reel', action='store_true')
    ap.add_argument('--series', nargs='?', const='top10-mcap')
    a = ap.parse_args()
    OUT.mkdir(exist_ok=True)
    scale = '0.5' if a.preview else '1'
    kind = '_reel' if REEL else '_series' if SERIES else ''
    stills = OUT / ('stills' + kind + ('_preview' if a.preview else ''))
    if not a.stills_only:
        tag = kind + ('_preview' if a.preview else '')
        silent = OUT / f'video{tag}_silent.mp4'
        name = (SERIES + ('_preview' if a.preview else '')) if SERIES else f'psx-top10{tag}'
        final = OUT / f'{name}.mp4'
        if not a.skip_render:
            sh([sys.executable, str(HERE / 'music/make_music.py'), '-o', str(OUT / 'music.wav')])
            if REEL:
                render_reel(silent, scale)
            elif SERIES:
                sh(['node', 'scripts/top10.mjs', 'video', str(silent), PROJ, f'--scale={scale}'], cwd=REM)
            else:
                sh(['node', 'scripts/psx-top10.mjs', 'video', str(silent), f'--scale={scale}'], cwd=REM)
            sh(['ffmpeg', '-v', 'error', '-y', '-i', str(silent), '-i', str(OUT / 'music.wav'), '-map', '0:v', '-map', '1:a',
                # delivery encode: full-range Remotion frames -> broadcast-range yuv420p BT.709, H.264 High
                '-vf', 'scale=in_range=pc:out_range=tv:out_color_matrix=bt709,format=yuv420p',
                '-c:v', 'libx264', '-profile:v', 'high', '-preset', 'slow', '-crf', '14', '-r', '30',
                '-color_range', 'tv', '-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709',
                '-c:a', 'aac', '-b:a', '256k', '-ar', '48000', '-movflags', '+faststart', '-shortest', str(final)])
        rep = qa(final, a.preview)
        (OUT / f'qa{tag}.json').write_text(json.dumps(rep, indent=1))
        print(json.dumps({k: v for k, v in rep.items() if k != 'data'}, indent=1))
        print('QA', 'PASSED' if rep['passed'] else f"FAILED: {rep['fails']}")
    import shutil; shutil.rmtree(stills, ignore_errors=True)  # never mix in stills from an older timeline
    if SERIES:
        sh(['node', 'scripts/top10.mjs', 'stills', str(stills), PROJ, f'--scale={scale}', *map(str, key_frames_series())], cwd=REM)
    elif REEL:
        sh(['node', 'scripts/psx-reel.mjs', 'stills', str(stills), 'PsxReel', f'--scale={scale}', '--gl=swangle', *map(str, key_frames_reel())], cwd=REM)
    else:
        sh(['node', 'scripts/psx-top10.mjs', 'stills', str(stills), f'--scale={scale}', *map(str, key_frames())], cwd=REM)
    contact_sheet(stills, OUT / ('contact_sheet' + kind + ('_preview.png' if a.preview else '.png')))


if __name__ == '__main__':
    main()
