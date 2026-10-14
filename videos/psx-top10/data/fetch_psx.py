"""Fetch market caps from the PSX Data Portal (dps.psx.com.pk/company/<TICKER>).

market cap = closing price x shares outstanding.
  --price close  (default) the REG board's latest price; run AFTER the 3:30 PM PKT close so it
                 is that day's closing price
  --price ldcp   the "LDCP" field (last day's closing price) - use this the next morning

Writes the top 10 (plus the cut-off check list) to remotion/src/projects/psx-top10/data.json,
which the video reads. Usage (repo root):
  python3 videos/psx-top10/data/fetch_psx.py --date "14 Oct 2026"
"""
import argparse, html, json, re, sys, time, urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[3]
OUT = ROOT / 'remotion/src/projects/psx-top10/data.json'
RAW = Path(__file__).resolve().parent / 'raw'

# reference top 10 + the companies just outside it (cut-off check) + other large caps
CANDIDATES = ['OGDC', 'UBL', 'MEBL', 'FFC', 'MARI', 'PPL', 'LUCK', 'MCB', 'HBL', 'PAKT',
              'NBP', 'NESTLE', 'ENGROH', 'EFERT', 'HUBC', 'SCBPL', 'BAFL', 'BAHL', 'ABL', 'SYS',
              'POL', 'PSO', 'COLG', 'UPFL', 'ATRL', 'FATIMA', 'PKGS', 'ISL', 'MTL', 'AKBL',
              'HMB', 'BOP', 'FABL', 'PSEL', 'LOTCHEM', 'SAZEW', 'HCAR', 'INIL', 'IBFL', 'PIOC']

# display names / sectors as shown in the reel (short, phone-readable)
NAMES = {
    'OGDC': ('Oil & Gas Development Company', 'Oil & Gas Exploration'),
    'UBL': ('United Bank', 'Commercial Bank'),
    'MEBL': ('Meezan Bank', 'Commercial Bank'),
    'FFC': ('Fauji Fertilizer Company', 'Fertilizer'),
    'MARI': ('Mari Energies', 'Oil & Gas Exploration'),
    'PPL': ('Pakistan Petroleum', 'Oil & Gas Exploration'),
    'LUCK': ('Lucky Cement', 'Cement'),
    'MCB': ('MCB Bank', 'Commercial Bank'),
    'HBL': ('Habib Bank', 'Commercial Bank'),
    'PAKT': ('Pakistan Tobacco Company', 'Tobacco'),
}


FONT_NAME = ROOT / 'media/projects/psx-top10/fonts/InterDisplay-ExtraBold.ttf'
NAME_BOX = 640  # px width of the company-name block in the countdown (2 lines max)


def name_size(name, box=NAME_BOX, sizes=range(72, 40, -2)):
    """Largest font size at which the name wraps into <= 2 lines of `box` px (measured with the real font)."""
    from PIL import ImageFont
    for sz in sizes:
        font = ImageFont.truetype(str(FONT_NAME), sz)
        lines, cur = [], ''
        for word in name.split():
            t = (cur + ' ' + word).strip()
            if font.getlength(t) <= box:
                cur = t
            else:
                lines.append(cur); cur = word
        lines.append(cur)
        if len(lines) <= 2 and all(font.getlength(l) <= box for l in lines):
            return sz
    return sizes[-1]


def num(s):
    return float(s.replace(',', '').replace('Rs.', '').strip())


def fetch(ticker, tries=4):
    url = f'https://dps.psx.com.pk/company/{ticker}'
    for i in range(tries):
        try:
            req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
            return urllib.request.urlopen(req, timeout=30).read().decode('utf-8', 'replace')
        except Exception as e:  # network flake: back off and retry
            err = e
            time.sleep(2 ** (i + 1))
    raise RuntimeError(f'{ticker}: {err}')


def parse(ticker, t):
    reg = t[t.find('data-name="REG"', t.find('tabs__panel')):]
    reg = reg[:reg.find('tabs__panel', 10)]
    stats = dict((html.unescape(a).strip(), b.strip()) for a, b in re.findall(
        r'<div class="stats_label">(.*?)</div>\s*<div class="stats_value[^"]*">([^<]*)</div>', reg))
    shares = re.search(r'<div class="stats_label">Shares</div>\s*<div class="stats_value">([^<]*)</div>', t)
    close = re.search(r'<div class="quote__close">([^<]*)</div>', t)
    asof = re.search(r'<div class="quote__date">\^?\s*As of ([^<]*)</div>', t)
    name = re.search(r'<div class="quote__name">([^<]*)', t)
    sector = re.search(r'<div class="quote__sector"><span>([^<]*)</span>', t)
    if not (shares and close):
        raise RuntimeError(f'{ticker}: could not parse page')
    return {
        'ticker': ticker,
        'psx_name': html.unescape(name.group(1)).strip() if name else ticker,
        'psx_sector': html.unescape(sector.group(1)).strip() if sector else '',
        'close': num(close.group(1)), 'ldcp': num(stats['LDCP']),
        'shares': int(num(shares.group(1))),
        'as_of': asof.group(1).strip() if asof else '',
    }


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--date', required=True, help='close date shown on screen, e.g. "14 Oct 2026"')
    ap.add_argument('--price', choices=['close', 'ldcp'], default='close')
    a = ap.parse_args()
    RAW.mkdir(exist_ok=True)
    rows, todo = [], list(CANDIDATES)
    for attempt in range(3):  # the portal drops connections now and then: retry the misses
        missed = []
        for tk in todo:
            try:
                page = fetch(tk)
                (RAW / f'{tk}.html').write_text(page)
                r = parse(tk, page)
            except Exception as e:
                print('  retry later:', e, file=sys.stderr)
                missed.append(tk)
                continue
            r['price'] = r[a.price]
            r['mcap_bn'] = round(r['price'] * r['shares'] / 1e9, 2)
            rows.append(r)
            print(f"{tk:8s} price {r['price']:>10,.2f}  shares {r['shares']:>15,}  mcap {r['mcap_bn']:>10,.2f} bn  ({r['as_of']})")
        todo = missed
        if not todo:
            break
    if todo:
        sys.exit(f'FAILED to fetch {todo} - re-run; a missing large cap could change the ranking')
    rows.sort(key=lambda r: -r['mcap_bn'])
    top = rows[:10]
    total = sum(r['mcap_bn'] for r in top)
    for i, r in enumerate(top):
        r['rank'] = i + 1
        r['name'], r['sector'] = NAMES.get(r['ticker'], (r['psx_name'], r['psx_sector'].title()))
        r['share_pct'] = round(100 * r['mcap_bn'] / total, 1)
        r['name_size'] = name_size(r['name'])
    print('\nTOP 10'); [print(f"{r['rank']:2d} {r['ticker']:7s} {r['mcap_bn']:>10,.2f}  {r['share_pct']:4.1f}%") for r in top]
    print(f'total {total:,.2f} bn; next: ' + ', '.join(f"{r['ticker']} {r['mcap_bn']:,.2f}" for r in rows[10:16]))
    if set(r['ticker'] for r in top) != set(NAMES):
        print('WARNING: top 10 differs from the reference list - add names/sectors and logos', file=sys.stderr)
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps({
        'source': 'PSX Data Portal', 'url': 'https://dps.psx.com.pk/company/<TICKER>',
        'close_date': a.date, 'price_field': a.price, 'formula': 'market cap = closing price x shares outstanding',
        'total_bn': round(total, 2), 'top10': top,
        'cutoff_check': [{k: r[k] for k in ('ticker', 'price', 'shares', 'mcap_bn')} for r in rows[10:]],
    }, indent=1))
    print('->', OUT.relative_to(ROOT))


if __name__ == '__main__':
    main()
