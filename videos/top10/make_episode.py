"""PSX TOP 10 episode bot: brief.json -> validated -> rendered in the locked series style -> QA'd -> MP4.

  .venv/bin/python videos/top10/make_episode.py videos/top10/<slug>/brief.json --check     # validate only
  .venv/bin/python videos/top10/make_episode.py videos/top10/<slug>/brief.json --preview   # half size, fast
  .venv/bin/python videos/top10/make_episode.py videos/top10/<slug>/brief.json             # 1080x1920 delivery

The brief is the ONLY input that changes between episodes (format: videos/top10/BRIEF.md). Theme, fonts,
layout, motion, transitions, music and the CTA are locked in remotion/src/series/top10.

Outputs in videos/top10/<slug>/edit/:
  final_approved.mp4 (QA passed) or final_review.mp4 (QA failed: see qa/summary.md), preview.mp4 (--preview),
  contact_sheet.png, qa/report.json, qa/summary.md, brief.resolved.json (brief + logos found in the library).
"""
import argparse, json, math, os, re, shutil, subprocess, sys
from pathlib import Path
import numpy as np

HERE = Path(__file__).resolve().parent
ROOT = HERE.parents[1]
REM = ROOT / 'remotion'
SERIES = REM / 'src/series/top10'
TL_PATH = SERIES / 'timeline.json'
TL = json.loads(TL_PATH.read_text())
METRICS = json.loads((SERIES / 'metrics.json').read_text())
LOGO_DIR = ROOT / 'media/library/logos/psx'  # official company logos, <TICKER>.png|svg|webp|jpg
FPS, FPB = TL['fps'], TL['fps'] * 60 / TL['bpm']
S = TL['sections']
bf = lambda b: round(b * FPB)
CTA_STATIC = bf(S['cta']['static_from'])
END = CTA_STATIC + round(S['cta']['hold_seconds'] * FPS)
BANNED = ['guarantee', 'risk-free', 'risk free', 'sure profit', 'sure shot', 'will double', 'double your',
          'can\'t lose', 'cannot lose', 'best stock to buy', 'buy now', 'must buy', 'assured return', 'fixed return']


def text_w(s, size, face='900i', tracking=-0.02):
    return sum((METRICS[face][ord(c) - 32] if 32 <= ord(c) < 127 else 0.6) + tracking for c in s) * size


def fit(s, max_w, max_size, face='900i', tracking=-0.02):
    return min(max_size, math.floor(max_size * max_w / max(1, text_w(s, max_size, face, tracking))))


# ---------------------------------------------------------------- validation
def validate(b):
    err, warn = [], []
    need = lambda cond, msg: None if cond else err.append(msg)
    for k in ('episode', 'slug', 'title', 'pill', 'rankings'):
        need(k in b, f'missing "{k}"')
    if err:
        return err, warn
    need(re.fullmatch(r'EP \d{1,3}', b['episode'] or ''), 'episode must look like "EP 02"')
    need(re.fullmatch(r'[a-z0-9]+(-[a-z0-9]+)*', b['slug'] or ''), 'slug must be lowercase-with-dashes, e.g. "ep02-dividend-yield"')
    # title lockup: 2-3 lines, one shared size fitted to the longest
    t = b['title']
    need(isinstance(t, list) and 2 <= len(t) <= 3, 'title must be 2 or 3 lines')
    if isinstance(t, list) and t:
        size = min(92, *[fit(x, 940, 92, '800', 0.01) for x in t])
        need(size >= 64, f'title lines too long (text would shrink to {size}px; keep each line under ~17 characters)')
    need(text_w(b['pill'], 32, '800', 0.2) <= 330, 'pill label too long (max ~10 characters, e.g. "IN PSX")')
    if 'explainer' in b:
        warn.append('"explainer" is ignored: the series no longer has an explainer section')
    r = b['rankings']
    for k in ('heading', 'subtitle', 'value_format', 'items', 'source'):
        need(k in r, f'rankings: missing "{k}"')
    if 'items' in r:
        it = r['items']
        need(len(it) == 10, f'rankings.items must have exactly 10 rows (got {len(it)})')
        need(sorted(c.get('rank') for c in it) == list(range(1, 11)), 'rankings ranks must be 1..10, once each')
        for c in it:
            need(re.fullmatch(r'[A-Z0-9&.\-]{1,8}', str(c.get('ticker', ''))), f'bad ticker "{c.get("ticker")}" (PSX symbol, max 8 chars)')
            v = c.get('value')
            need(isinstance(v, (int, float)) and math.isfinite(v) and v > 0, f'{c.get("ticker")}: value must be a positive number')
        rows_ok = len(it) == 10 and all(isinstance(c.get('value'), (int, float)) and c.get('value', 0) > 0 and 'rank' in c and 'ticker' in c for c in it)
        if rows_ok and 'value_format' in r:
            by = sorted(it, key=lambda c: c['rank'])
            vals = [c['value'] for c in by]
            if vals != sorted(vals, reverse=True) and vals != sorted(vals):
                warn.append('values are not in rank order (neither highest-first nor lowest-first); check the ranks')
            vf = r['value_format']
            fmt = lambda v: f"{vf['pre']}{v:,.{vf['decimals']}f}{vf['post']}"
            label_w = max(text_w(fmt(c['value']), 32, '800', 0) for c in it)
            tick_w = max(text_w(c['ticker'], 44, '900i') for c in it)
            bar_max = 1016 - (170 + tick_w + 26) - 18 - label_w
            need(bar_max >= 240, f'value labels too long for the chart (longest "{max((fmt(c["value"]) for c in it), key=len)}"); use fewer decimals or a bigger unit (bn/tn)')
    if 'heading' in r:
        need(len(r['heading']) == 2, 'rankings.heading must be 2 lines, e.g. ["TOP 10 BY", "MARKET CAP"]')
        if len(r['heading']) == 2:
            need(fit(r['heading'][1], 940, 104) >= 70, 'rankings.heading line 2 too long (keep under ~14 characters)')
    if r.get('total'):
        need(text_w(r['total']['label'] + r['total']['value'], 34, '800', 0.06) <= 860, 'rankings.total too long')
    if 'source' in r:
        need(len(r['source'].strip()) > 8, 'rankings.source is required (where the numbers come from)')
        if not re.search(r'20\d\d', r.get('subtitle', '') + r['source']):
            warn.append('no date found in rankings.subtitle/source; say which close/period the data is from')
    # finance language: never promise returns
    blob = json.dumps(b, ensure_ascii=False).lower()
    for w in BANNED:
        if w in blob:
            err.append(f'finance rule: remove "{w}" (no promises of returns)')
    return err, warn


# ---------------------------------------------------------------- pipeline
def sh(cmd, **kw):
    print('$', ' '.join(map(str, cmd)), flush=True)
    return subprocess.run(cmd, check=True, **kw)


def resolve_logos(b):
    logos = {}
    for c in b['rankings']['items']:
        for ext in ('png', 'svg', 'webp', 'jpg'):
            p = LOGO_DIR / f"{c['ticker']}.{ext}"
            if p.exists():
                logos[c['ticker']] = str(p.relative_to(ROOT / 'media'))
                break
    return logos


def music():
    """The series score is the same for every episode (locked beat grid): synthesise once, reuse."""
    wav = HERE / '_music' / 'top10_series.wav'
    if not wav.exists() or wav.stat().st_mtime < TL_PATH.stat().st_mtime:
        wav.parent.mkdir(exist_ok=True)
        env = dict(os.environ, PSX_TIMELINE=str(TL_PATH.relative_to(ROOT)))
        sh([sys.executable, str(ROOT / 'videos/psx-top10/music/make_music.py'), '-o', str(wav)], env=env)
    return wav


def qa(final: Path, preview: bool):
    rep, fails = {}, []
    pr = json.loads(subprocess.run(['ffprobe', '-v', 'error', '-show_streams', '-show_format', '-of', 'json', str(final)],
                                   capture_output=True, text=True, check=True).stdout)
    v = next(s for s in pr['streams'] if s['codec_type'] == 'video')
    a = next(s for s in pr['streams'] if s['codec_type'] == 'audio')
    dur = float(pr['format']['duration'])
    rep['format'] = dict(size=f"{v['width']}x{v['height']}", fps=v['r_frame_rate'], vcodec=v['codec_name'], pix=v['pix_fmt'],
                         acodec=a['codec_name'], sr=a['sample_rate'], duration=round(dur, 3))
    if (v['width'], v['height']) != ((540, 960) if preview else (1080, 1920)): fails.append('size')
    if v['r_frame_rate'] != '30/1' or v['codec_name'] != 'h264' or v['pix_fmt'] != 'yuv420p' or a['codec_name'] != 'aac': fails.append('codec')
    if dur > 20.0: fails.append('duration')
    head = open(final, 'rb').read(64 * 1024)
    rep['faststart'] = head.find(b'moov') < head.find(b'mdat') if b'mdat' in head else b'moov' in head
    if not rep['faststart']: fails.append('faststart')
    err = subprocess.run(['ffmpeg', '-hide_banner', '-nostats', '-i', str(final), '-map', '0:a', '-af', 'ebur128=peak=true', '-f', 'null', '-'],
                         capture_output=True, text=True).stderr
    summ = err[err.rfind('Summary:'):]
    lufs = float(re.search(r'I:\s+(-?[\d.]+) LUFS', summ).group(1))
    tp = float(re.search(r'Peak:\s+(-?[\d.]+) dBFS', summ).group(1))
    rep['loudness'] = dict(lufs=lufs, true_peak_dbtp=tp)
    if abs(lufs + 14) > 0.5: fails.append('lufs')
    if tp > -1.5: fails.append('true_peak')
    w, h = v['width'] // 4, v['height'] // 4
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-ss', f'{CTA_STATIC / FPS + 0.02:.3f}', '-i', str(final), '-vf', f'scale={w}:{h}', '-f', 'rawvideo', '-pix_fmt', 'gray', '-'],
                         capture_output=True, check=True).stdout
    fr = np.frombuffer(raw, np.uint8).reshape(-1, h, w).astype(np.int16)
    still = int(np.abs(fr - fr[0]).max()) if len(fr) else 999
    rep['cta_hold'] = dict(seconds=round((END - CTA_STATIC) / FPS, 2), max_pixel_change=still)
    if still > 10: fails.append('cta_hold')
    bd = subprocess.run(['ffmpeg', '-hide_banner', '-i', str(final), '-vf', 'blackdetect=d=0.03:pix_th=0.12', '-an', '-f', 'null', '-'],
                        capture_output=True, text=True).stderr
    rep['black_frames'] = re.findall(r'black_start:\S+ black_end:\S+', bd)
    if rep['black_frames']: fails.append('black_frames')
    rep['fails'], rep['passed'] = fails, not fails
    return rep


def key_frames():
    fr = [3, 20, 30, 52, 66]
    fr += [bf(S['title']['start']) + x for x in (14, 34, 70)]
    fr += [bf(S['rank']['start']) + x for x in (40, 100, 126, 185)]
    fr += [bf(S['cta']['start']) + 8, END - 1]
    return sorted({int(min(END - 1, max(0, x))) for x in fr})


def contact_sheet(src: Path, out: Path, cols=6):
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
        d.text((x + 2, y + 6), f'frame {n}  {n / FPS:5.2f}s', fill=(230, 230, 230))
    sheet.save(out)


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument('brief')
    ap.add_argument('--check', action='store_true', help='validate the brief only')
    ap.add_argument('--preview', action='store_true', help='half size, written as edit/preview.mp4')
    a = ap.parse_args()
    bp = Path(a.brief).resolve()
    b = json.loads(bp.read_text(encoding='utf-8'))
    err, warn = validate(b)
    for w in warn: print('WARN ', w)
    for e in err: print('ERROR', e)
    if err:
        sys.exit(f'brief has {len(err)} error(s); fix them and run again')
    print('brief OK' + (f' ({len(warn)} warning(s))' if warn else ''))
    if a.check:
        return
    edit = bp.parent / 'edit'
    (edit / 'qa').mkdir(parents=True, exist_ok=True)
    b['logos'] = resolve_logos(b)
    missing = [c['ticker'] for c in sorted(b['rankings']['items'], key=lambda c: c['rank']) if c['ticker'] not in b['logos']]
    resolved = edit / 'brief.resolved.json'
    resolved.write_text(json.dumps(b, indent=1, ensure_ascii=False), encoding='utf-8')
    scale = '0.5' if a.preview else '1'
    wav = music()
    silent = edit / 'render_silent.mp4'
    sh(['node', 'scripts/top10.mjs', 'video', str(silent), f'--brief={resolved}', f'--scale={scale}'], cwd=REM)
    out = edit / ('preview.mp4' if a.preview else 'final_render.mp4')
    sh(['ffmpeg', '-v', 'error', '-y', '-i', str(silent), '-i', str(wav), '-map', '0:v', '-map', '1:a',
        '-vf', 'scale=in_range=pc:out_range=tv:out_color_matrix=bt709,format=yuv420p',
        '-c:v', 'libx264', '-profile:v', 'high', '-preset', 'slow', '-crf', '14', '-r', '30',
        '-color_range', 'tv', '-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709',
        '-c:a', 'aac', '-b:a', '256k', '-ar', '48000', '-movflags', '+faststart', '-shortest', str(out)])
    silent.unlink()
    rep = qa(out, a.preview)
    rep['warnings'], rep['logos_missing'] = warn, missing
    stills = edit / 'stills'
    shutil.rmtree(stills, ignore_errors=True)
    sh(['node', 'scripts/top10.mjs', 'stills', str(stills), f'--brief={resolved}', f'--scale={scale}', *map(str, key_frames())], cwd=REM)
    contact_sheet(stills, edit / 'contact_sheet.png')
    final = out
    if not a.preview:
        final = edit / ('final_approved.mp4' if rep['passed'] else 'final_review.mp4')
        for old in ('final_approved.mp4', 'final_review.mp4'):
            (edit / old).unlink(missing_ok=True)
        out.rename(final)
    rep['output'] = str(final.relative_to(ROOT))
    (edit / 'qa' / 'report.json').write_text(json.dumps(rep, indent=1))
    md = [f"# {b['episode']} · {' '.join(b['title'])} — QA", '', f"**{'PASSED' if rep['passed'] else 'FAILED: ' + ', '.join(rep['fails'])}** → `{rep['output']}`", '',
          f"- format: {rep['format']}", f"- loudness: {rep['loudness']['lufs']} LUFS, true peak {rep['loudness']['true_peak_dbtp']} dBTP",
          f"- CTA hold: {rep['cta_hold']['seconds']} s, max pixel change {rep['cta_hold']['max_pixel_change']}", f"- black frames: {len(rep['black_frames'])}",
          f"- company logos missing (no logo slot drawn): {', '.join(missing) or 'none'}", *[f'- warning: {w}' for w in warn]]
    (edit / 'qa' / 'summary.md').write_text('\n'.join(md) + '\n')
    print('\n'.join(md))
    if not rep['passed']:
        sys.exit(1)


if __name__ == '__main__':
    main()
