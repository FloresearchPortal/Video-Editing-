// Overlap + frame-fit audit for a HyperFrames composition (FloStocks explainer rule: no titles, numbers or
// graphics may collide, and no text may leave the frame). Seeks the paused timeline every STEP seconds and
// reports pairs of visible boxes that intersect, plus text past the 30 px side / 40 px top-bottom margins.
//
//   node tools/flostocks/overlap_audit.cjs motion/projects/<slug> [step=0.125] [t0] [t1]
//
// Boxes checked: .kin (visible letters only), .roller, .chip, .tag, .icon, .who (figure silhouette) and anything
// tagged data-ov. Children of one [data-ov-group] may overlap (a character inside a stall, Aap on a sofa).
// Samples inside a scene wipe (±0.32 s of a scene start, from window.__sceneCuts) are skipped — clipped apart.
const path = require('path'), fs = require('fs'), http = require('http');
const ROOT = path.resolve(__dirname, '../..');
const { chromium } = require(path.join(ROOT, 'motion/node_modules/playwright-core'));
const DIR = path.resolve(process.argv[2] || '.');
const STEP = +(process.argv[3] || 0.125);
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.png': 'image/png', '.ttf': 'font/ttf', '.json': 'application/json', '.svg': 'image/svg+xml', '.webp': 'image/webp' };
const server = http.createServer((req, res) => {
  const f = path.join(DIR, decodeURIComponent(req.url.split('?')[0]));
  fs.readFile(f, (e, b) => { if (e) { res.writeHead(404); res.end(); return; } res.writeHead(200, { 'Content-Type': MIME[path.extname(f)] || 'application/octet-stream' }); res.end(b); });
});
(async () => {
  await new Promise((r) => server.listen(0, r));
  const port = server.address().port;
  const exe = [process.env.CHROME_PATH, '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'].find((x) => x && fs.existsSync(x));
  const b = await chromium.launch(exe ? { executablePath: exe } : {});
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  p.on('pageerror', (e) => console.log('pageerror:', e.message.slice(0, 300)));
  await p.addInitScript(() => { window.__timelines = {}; });
  await p.goto(`http://localhost:${port}/index.html`); await p.waitForTimeout(2500);
  const T0 = +(process.argv[4] || STEP), T1 = +(process.argv[5] || await p.evaluate(() => window.__timelines.main.duration()));
  const res = await p.evaluate(({ STEP, T0, T1 }) => {
    const tl = window.__timelines.main, out = [];
    const SEL = '.kin, .roller, .chip, .tag, .icon, .who, #caps > *, [data-ov]';
    const op = (e) => { let o = 1; for (let x = e; x && x !== document.body; x = x.parentElement) { const cs = getComputedStyle(x); if (cs.visibility === 'hidden' || cs.display === 'none') return 0; o *= +cs.opacity; } return o; };
    const name = (e) => (e.className && typeof e.className === 'string' ? e.className.replace('abs', '').trim() : e.tagName) + ':' + (e.innerText || e.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 22);
    const cuts = window.__sceneCuts || [];
    for (let t = T0; t <= T1; t += STEP) {
      if (cuts.some((c) => Math.abs(t - c) <= 0.32)) continue;   // inside a scene wipe: scenes are clipped apart
      tl.seek(t, false);
      const els = [...document.querySelectorAll(SEL)].filter((e) => op(e) > 0.35);
      const box = (e) => {
        const kc = e.querySelectorAll(':scope .kc');
        if (kc.length) {               // kinetic text: union of the letters that are actually visible
          let L = 1e9, T = 1e9, Rr = -1e9, B = -1e9, n = 0;
          kc.forEach((c) => { if (op(c) > 0.35) { const r = c.getBoundingClientRect(); if (r.width < 1) return; n++; L = Math.min(L, r.left); T = Math.min(T, r.top); Rr = Math.max(Rr, r.right); B = Math.max(B, r.bottom); } });
          return n ? { left: L, top: T, right: Rr, bottom: B, width: Rr - L, height: B - T } : null;
        }
        const r = e.getBoundingClientRect();
        if (e.classList.contains('who')) {   // a character fills roughly the middle 64% × lower 78% of its square
          const w = r.width, h = r.height;
          return { left: r.left + w * 0.18, right: r.right - w * 0.18, top: r.top + h * 0.2, bottom: r.bottom, width: w * 0.64, height: h * 0.8 };
        }
        return r;
      };
      const R = els.map((e) => [e, box(e)]).filter(([, r]) => r && r.width > 4 && r.height > 4 && r.right > 0 && r.left < 1080 && r.bottom > 0 && r.top < 1920);
      // text that doesn't fit the frame (margins 30px sides / 40px top-bottom)
      R.forEach(([e, r]) => { if (/kin|roller|chip|tag/.test(e.className) && (r.left < 30 || r.right > 1050 || r.top < 40 || r.bottom > 1880)) out.push([+t.toFixed(2), name(e), 'FRAME-EDGE', Math.round(Math.max(30 - r.left, r.right - 1050, 40 - r.top, r.bottom - 1880))]); });
      for (let i = 0; i < R.length; i++) for (let j = i + 1; j < R.length; j++) {
        const [a, ra] = R[i], [c, rc] = R[j];
        if (a.contains(c) || c.contains(a)) continue;
        if (a.closest('[data-ov-group]') && a.closest('[data-ov-group]') === c.closest('[data-ov-group]')) continue;
        const w = Math.min(ra.right, rc.right) - Math.max(ra.left, rc.left), h = Math.min(ra.bottom, rc.bottom) - Math.max(ra.top, rc.top);
        if (w > 12 && h > 12 && w * h > 2500) out.push([+t.toFixed(2), name(a), name(c), Math.round(w * h)]);
      }
    }
    return out;
  }, { STEP, T0, T1 });
  // collapse consecutive samples of the same pair into ranges
  const m = new Map();
  for (const [t, a, c, ar] of res) { const k = a + ' ✕ ' + c; const r = m.get(k); if (r && t - r.t1 <= STEP * 1.5) { r.t1 = t; r.max = Math.max(r.max, ar); } else { if (r) console.log(fmt(k, r)); m.set(k, { t0: t, t1: t, max: ar }); } }
  function fmt(k, r) { return `${r.t0.toFixed(2)}–${r.t1.toFixed(2)}  ${k}  (${r.max}px²)`; }
  for (const [k, r] of m) console.log(fmt(k, r));
  await b.close(); server.close();
})();
