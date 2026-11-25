// "What is Buyback?" — 60 Seconds Investor EP 07. Cue times = word starts in videos/what-is-buyback/edit/vo.words.json
// (VO = starts at "Dost" — the "okay so" is cut — silences cut at -36 dB, studio chain; see videos/what-is-buyback/prep_vo.py).
// Cast (all approved earlier): aap, bilal (in the chat), the 10 partners from the approved cast. Numbers are illustrations.
// Layout rule: every block is centred on x = 540 with equal margins; y 960–1500 content stays inside x 130–950 (Instagram safe area).
(function () {
  const { C, tl, el, scene, kin, charsIn, who, life, line, swap, ctaLogo } = K;
  const X = CAST.expr;
  const card = (p, css) => el(p, Object.assign({ background: "#fff", borderRadius: 32, border: "2px solid #E3E9E5", boxShadow: "0 24px 50px rgba(20,40,20,.10)" }, css));
  const txt = (p, css, html) => el(p, Object.assign({ font: "700 40px Manrope", color: C.text, whiteSpace: "nowrap" }, css), html);
  const fadeUp = (e, t, d = 0.45, y = 40) => tl.fromTo(e, { y, opacity: 0 }, { y: 0, opacity: 1, duration: d, ease: "power3.out", immediateRender: false }, t);
  const hide = (...e) => e.forEach((x) => tl.set(x, { opacity: 0 }, 0));
  const show = (e, t, d, y) => { hide(e); fadeUp(e, t, d, y); return e; };
  const out = (e, t, d = 0.2) => tl.to(e, { opacity: 0, duration: d, ease: "power2.in" }, t);
  const chip = (p, css, html) => el(p, Object.assign({ padding: "12px 26px", borderRadius: 999, background: "#fff", border: `4px solid ${C.g}`,
    font: "800 34px Manrope", color: C.text, whiteSpace: "nowrap" }, css), html);
  const bigChip = (p, top, html, css = {}, cx = 540) => {
    const c = chip(p, Object.assign({ left: cx, top, padding: "18px 44px", font: "800 48px Manrope", borderWidth: 5 }, css), html);
    gsap.set(c, { xPercent: -50 }); return c; };
  const tag = (p, cx, top, html, css = {}) => { const t = el(p, Object.assign({ left: cx, top, padding: "8px 20px", borderRadius: 14, background: C.ink, color: "#fff", font: "800 28px Manrope", whiteSpace: "nowrap" }, css), html); gsap.set(t, { xPercent: -50 }); return t; };
  const S = `stroke="#0B0F14" stroke-width="8" stroke-linejoin="round" stroke-linecap="round"`;
  const art = (p, css, w, h, inner) => el(p, css, `<svg viewBox="0 0 ${w} ${h}" width="${css.width}" height="${css.height}" style="overflow:visible">${inner}</svg>`);
  const COIN = `<circle cx="50" cy="50" r="44" fill="#FFD95A" ${S}/><circle cx="50" cy="50" r="30" fill="#F2B526"/><text x="50" y="62" text-anchor="middle" font-family="Manrope" font-weight="800" font-size="32" fill="#5A3B00">Rs</text>`;
  const BLD = `<rect x="30" y="20" width="140" height="180" rx="8" fill="#fff" ${S}/><rect x="20" y="192" width="160" height="14" rx="4" fill="#0B0F14"/>
     ${[0, 1, 2, 3].map((r) => [0, 1, 2].map((c) => `<rect x="${48 + c * 38}" y="${36 + r * 36}" width="26" height="22" rx="3" fill="${r === 1 && c === 1 ? C.g : "#E3F1F4"}" stroke="#0B0F14" stroke-width="4"/>`).join("")).join("")}
     <rect x="86" y="168" width="28" height="32" rx="3" fill="#C98A4B" stroke="#0B0F14" stroke-width="4"/>`;
  // ownership donut: n equal slices (alternating brand greens), centre hole left empty for an HTML label
  const donut = (n) => Array.from({ length: n }, (_, i) => {
    const a0 = (-90 + (360 / n) * i) * Math.PI / 180, a1 = (-90 + (360 / n) * (i + 1)) * Math.PI / 180, R = 200, r = 92, c = 210;
    const P = (a, rr) => `${(c + rr * Math.cos(a)).toFixed(1)},${(c + rr * Math.sin(a)).toFixed(1)}`;
    return `<path class="sl${i}" d="M${P(a0, R)} A${R},${R} 0 0 1 ${P(a1, R)} L${P(a1, r)} A${r},${r} 0 0 0 ${P(a0, r)} Z" fill="${i % 2 ? "#9BE07A" : C.g}" stroke="#fff" stroke-width="6" stroke-linejoin="round"/>`;
  }).join("") + `<circle cx="210" cy="210" r="200" fill="none" stroke="#0B0F14" stroke-width="6"/><circle cx="210" cy="210" r="92" fill="#fff" stroke="#0B0F14" stroke-width="6"/>`;
  const OV = [];

  // ═══ S1 HOOK 0–6.95: WhatsApp group — Bilal: "Company ne share buyback karne ka elan kiya hai" → Aap puzzled → "ye buyback aakhir hai kia?" ═══
  const s1 = scene(0, 6.95, { push: 1.012 });
  const chat = el(s1, { left: 130, top: 330, width: 820, height: 560, borderRadius: 36, overflow: "hidden", background: "#EFEAE2",
    boxShadow: "0 30px 60px rgba(20,40,20,.16)", border: "2px solid #E3E9E5" });
  el(chat, { left: 0, top: 0, width: 820, height: 560, opacity: 0.07, backgroundImage: "radial-gradient(#0B0F14 1.5px, transparent 1.6px)", backgroundSize: "34px 34px" });
  const hdr = el(chat, { left: 0, top: 0, width: 820, height: 120, background: "#008069" });
  el(hdr, { left: 26, top: 36, font: "400 46px/1 Inter", color: "#fff" }, "‹");
  el(hdr, { left: 76, top: 26, width: 68, height: 68, borderRadius: 34, background: "#DFE5E7", overflow: "hidden" },
    `<svg viewBox="0 0 72 72" width="68" height="68"><circle cx="36" cy="28" r="13" fill="#fff"/><path d="M12,66 a24,22 0 0 1 48,0Z" fill="#fff"/></svg>`);
  txt(hdr, { left: 164, top: 24, font: "700 34px Inter", color: "#fff" }, "Biryani Lovers 🍛");
  txt(hdr, { left: 164, top: 68, font: "500 23px Inter", color: "#D6EFE9" }, "Bilal, Sana, Usman, Zara, You");
  el(hdr, { left: 740, top: 38, font: "700 34px Inter", color: "#fff" }, "⋮");
  el(chat, { left: 350, top: 140, padding: "6px 18px", borderRadius: 12, background: "#fff", font: "600 22px Inter", color: "#54656F", boxShadow: "0 1px 1px rgba(0,0,0,.08)" }, "Today");
  const bub = (html, top, t, time) => {
    const b = el(chat, { left: 28, top, maxWidth: 680, padding: "14px 22px 34px", borderRadius: "4px 22px 22px 22px", background: "#fff", boxShadow: "0 1px 1px rgba(0,0,0,.12)",
      font: "500 34px/1.3 Inter", color: "#111B21" }, html + `<span style="position:absolute;right:16px;bottom:8px;font:500 20px Inter;color:#667781">${time}</span>`);
    if (t > 0) show(b, t, 0.3, 18); return b; };
  bub(`<div style="font:700 25px Inter;color:#1F7A00;margin-bottom:4px">Sana</div>Sunday ko biryani pakki? 🍛`, 196, 0, "9:41 PM");
  bub(`<div style="font:700 25px Inter;color:#C2185B;margin-bottom:4px">Bilal</div>Company ne share <b>buyback</b> karne ka<br>elan kiya hai 📢`, 340, 1.34, "9:42 PM");
  tl.fromTo(chat, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, ease: "power3.out" }, 0);
  const aap = who(s1, "aap", 375, 960, 330, { expr: "smile", gesture: "handPhone" });
  tl.fromTo(aap, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, ease: "power3.out" }, 0.05);
  life(aap, 0.2, 6.9, "smile", 161);
  X(tl, aap.av, "bigO", 2.3);
  out(chat, 4.6, 0.3);
  X(tl, aap.av, "puzzled", 3.98); K.pose(aap, 3.98, { h: [9, -4, 4], b: [1, 1] }, 0.4);
  const th = art(s1, { left: 300, top: 560, width: 480, height: 400 }, 480, 400,
    `<path d="M70,270 C10,270 10,190 70,180 C60,110 150,80 190,120 C220,60 320,60 340,120 C400,100 460,150 430,210 C480,240 450,310 390,300 C370,350 290,350 260,320 C220,360 130,350 120,310 C100,320 70,310 70,270Z" fill="#fff" ${S}/>
     <circle cx="300" cy="370" r="14" fill="#fff" ${S}/>
     <text x="245" y="232" text-anchor="middle" font-family="Manrope" font-weight="800" font-size="54" letter-spacing="-1" fill="#0B0F14">BUYBACK<tspan fill="${C.gt}">?</tspan></text>`);
  show(th, 4.96, 0.4, 20);
  const q = kin(s1, "*BUYBACK* AAKHIR | HAI KIA?", { y: 250, size: 88 });
  charsIn.rise(q, 5.24, 0.02);
  OV.push(chat, th, aap);

  // ═══ S2 6.95–12.4: 60 Seconds Investor series card (approved stopwatch) ═══
  const s2 = scene(6.95, 12.4);
  const sc2 = K.seriesCard(s2, 7.0, { tSweep: 7.4, tTitle: 7.56, tSeries: 8.54, tTag: 9.28, tEp: 11.0, ep: "EP 07 · WHAT IS BUYBACK" });
  OV.push(sc2.watch);

  // ═══ S3 12.4–25.5: a business with 10 partners × 10% → it buys back 2 partners' shares → 8 partners × 12.5% ═══
  const s3 = scene(12.4, 25.5, { push: 1.012 });
  const h3 = kin(s3, "10 *PARTNERS*", { y: 250, size: 100 }); charsIn.rise(h3, 12.6, 0.02);
  const p10 = art(s3, { left: 330, top: 370, width: 420, height: 420 }, 420, 420, donut(10));
  const p8 = art(s3, { left: 330, top: 370, width: 420, height: 420 }, 420, 420, donut(8));
  const pl = el(s3, { left: 330, top: 370 + 210 - 34, width: 420, textAlign: "center", font: "700 56px/68px 'IBM Plex Mono'", color: C.text }, "10%");
  show(p10, 12.94, 0.45, 24); show(pl, 15.18, 0.3, 10); hide(p8);
  const NAMES = ["sana", "usman", "zara", "ayesha", "bilal", "ahmed", "aap", "cousin", "abbu", "bhai"];
  const ppl = NAMES.map((n, i) => {
    const r = Math.floor(i / 5), c = i % 5, w = who(s3, n, 540 + (c - 2) * 165 - 75, 840 + r * 180, 150, { expr: "smile", gesture: "none" });
    show(w, 13.48 + i * 0.05, 0.35, 20); life(w, 13.8, 25.4, "smile", 170 + i); return w; });
  const c10 = bigChip(s3, 1240, "HAR EK KA HISSA 10%", { borderColor: C.g, color: C.text }); show(c10, 15.18, 0.3, 16); out(c10, 16.2, 0.2);
  // "business khud 2 partners ke hisse wapas khareed leta hai": two slices lift out, those two partners leave
  [8, 9].forEach((i, k) => {
    const sl = p10.querySelector(".sl" + i), am = (-90 + 36 * i + 18) * Math.PI / 180;
    tl.to(sl, { x: 40 * Math.cos(am), y: 40 * Math.sin(am), duration: 0.45, ease: "power2.out" }, 18.14 + k * 0.08);
    tl.to(sl, { opacity: 0, duration: 0.3 }, 18.9 + k * 0.08);
    tl.to(ppl[i], { opacity: 0, y: 30, duration: 0.35, ease: "power2.in" }, 18.6 + k * 0.08);
  });
  const c2 = bigChip(s3, 1240, "2 HISSE WAPAS", { borderColor: C.red, color: C.red }); show(c2, 18.44, 0.3, 16); out(c2, 19.7, 0.2);
  // "tou 8 partners reh jaate hain": the second row re-centres, the pie redraws as 8 equal slices
  tl.to(ppl.slice(5, 8), { x: 165, duration: 0.5, ease: "power2.inOut" }, 19.9);
  tl.to(p10, { opacity: 0, duration: 0.35 }, 20.0); tl.fromTo(p8, { opacity: 0, rotation: -10 }, { opacity: 1, rotation: 0, duration: 0.5, ease: "power2.out", immediateRender: false }, 20.0);
  const c8 = bigChip(s3, 1240, "8 PARTNERS", { borderColor: C.ink }); show(c8, 20.36, 0.3, 16); out(c8, 23.6, 0.2);
  swap(pl, "12.5%", 23.88);
  const c125 = bigChip(s3, 1240, "10% → 12.5% ▲", { background: C.g, borderColor: C.g }); show(c125, 23.88, 0.3, 16);
  OV.push(c10, c2, c8, c125);

  // ═══ S4 25.5–36.7: PSX — the company buys its own shares from the market with its own money and cancels them → fewer shares, bigger stake ═══
  const s4 = scene(25.5, 36.7, { push: 1.012 });
  const h4 = kin(s4, "PSX MEIN *BUYBACK*", { y: 250, size: 92 }); charsIn.rise(h4, 25.6, 0.02);
  const co = art(s4, { left: 450, top: 360, width: 180, height: 190 }, 200, 210, BLD); show(co, 27.5, 0.4, 24);
  const ct = tag(s4, 540, 560, "COMPANY"); show(ct, 27.6, 0.3, 12);
  const mk = card(s4, { left: 130, top: 650, width: 820, height: 280 });
  txt(mk, { left: 0, top: 24, width: 820, textAlign: "center", font: "800 28px Manrope", color: C.mute, letterSpacing: ".06em" }, "MARKET MEIN SHARES");
  const tiles = Array.from({ length: 20 }, (_, i) => {
    const r = Math.floor(i / 10), c = i % 10;
    return el(mk, { left: 36 + c * 76, top: 86 + r * 86, width: 64, height: 70, borderRadius: 12, background: "#E8F8DF", border: `3px solid ${C.g2}`, font: "800 22px/64px Manrope", textAlign: "center", color: C.gt }, "S");
  });
  show(mk, 28.84, 0.4, 24);
  // "apne paise se": company money goes to the market
  [0, 1, 2].forEach((k) => {
    const c = art(s4, { left: 502, top: 460, width: 76, height: 76 }, 100, 100, COIN);
    hide(c); tl.fromTo(c, { opacity: 0, x: 0, y: 0 }, { opacity: 1, x: (k - 1) * 220, y: 300, duration: 0.6, ease: "power2.inOut", immediateRender: false }, 28.26 + k * 0.08);
    tl.to(c, { opacity: 0, duration: 0.25 }, 29.0 + k * 0.08);
  });
  // "apne hi shares khareed kar khatam kar deti hai": four shares fly up to the company and are gone
  const MK = { x: 130, y: 650 };
  [3, 8, 12, 17].forEach((i, k) => {
    const r = Math.floor(i / 10), c = i % 10, sx = MK.x + 36 + c * 76 + 32, sy = MK.y + 86 + r * 86 + 35;
    tl.to(tiles[i], { x: 540 - sx, y: 455 - sy, scale: 0.6, duration: 0.55, ease: "power2.inOut" }, 30.2 + k * 0.08);
    tl.to(tiles[i], { opacity: 0, scale: 0.1, duration: 0.3, ease: "power2.in" }, 30.84 + k * 0.05);
  });
  const kh = tag(s4, 760, 440, "KHATAM", { background: C.red }); show(kh, 30.9, 0.25, 10); out(kh, 31.8, 0.2);
  const less = bigChip(s4, 990, "MARKET MEIN SHARES KAM", { font: "800 42px Manrope", borderColor: C.ink }); show(less, 33.1, 0.3, 16);
  const more = bigChip(s4, 1120, "BAAQI KA HISSA ▲", { background: C.g, borderColor: C.g }); show(more, 35.94, 0.3, 16);
  OV.push(co, mk, less, more);

  // ═══ S5 36.7–42.6: companies usually buy back when they think the share price is below its real value ═══
  const s5 = scene(36.7, 42.6, { push: 1.012 });
  const h5 = kin(s5, "*BUYBACK* KAB?", { y: 250, size: 100 }); charsIn.rise(h5, 36.8, 0.02);
  const pc = card(s5, { left: 130, top: 380, width: 820, height: 520 });
  txt(pc, { left: 40, top: 30, font: "800 28px Manrope", color: C.mute, letterSpacing: ".06em" }, "SHARE PRICE");
  const PW = 620, PH = 360, VY = PH * 0.22;
  const pr = line(pc, [[0, 0.5], [0.12, 0.42], [0.24, 0.47], [0.36, 0.36], [0.48, 0.41], [0.6, 0.33], [0.72, 0.38], [0.86, 0.3], [1, 0.34]],
    { x: 40, y: 110, w: PW, h: PH, n: 70, noise: 0.03, color: C.ink, grid: true, rows: 3 });
  const val = art(pc, { left: 40, top: 110, width: PW, height: PH }, PW, PH,
    `<path d="M0,${VY} H${PW}" stroke="${C.g2}" stroke-width="6" stroke-dasharray="16 12"/>
     <path d="M${PW - 30},${VY + 14} V${PH * 0.62}" stroke="${C.red}" stroke-width="5"/><path d="M${PW - 42},${VY + 26} L${PW - 30},${VY + 12} L${PW - 18},${VY + 26} M${PW - 42},${PH * 0.62 - 12} L${PW - 30},${PH * 0.62 + 2} L${PW - 18},${PH * 0.62 - 12}" fill="none" stroke="${C.red}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>`);
  const vl = txt(pc, { left: 40, top: 110 + VY - 46, font: "800 28px Manrope", color: C.gt }, "ASLI VALUE");
  show(pc, 37.0, 0.4, 30); pr.draw(39.76, 0.9);
  show(val, 41.14, 0.4, 0); show(vl, 41.14, 0.3, 10);
  const lt = bigChip(s5, 960, "PRICE &lt; ASLI VALUE", { borderColor: C.g, color: C.text }); show(lt, 41.76, 0.3, 16);
  OV.push(pc, lt);

  // ═══ S6 42.6–49.2: no guarantee the price rises — look at the company's overall performance too ═══
  const s6 = scene(42.6, 49.2, { push: 1.012 });
  const h6 = kin(s6, "LEKIN *GUARANTEE* NAHI", { y: 250, size: 84, accent: C.red }); charsIn.rise(h6, 42.7, 0.02);
  const fc = card(s6, { left: 130, top: 380, width: 820, height: 480 });
  const W = 740, H = 360, yv = (v) => H * (1 - (v - 85) / 30);
  const fk = art(fc, { left: 40, top: 80, width: W, height: H }, W, H,
    [115, 107.5, 100, 92.5, 85].map((v) => `<line x1="0" x2="${W}" y1="${yv(v)}" y2="${yv(v)}" stroke="#D9E3DC" stroke-width="2" stroke-dasharray="${v === 85 ? 0 : "6 8"}"/>`).join("") +
    `<path d="M0,${yv(97)} L${W * 0.1},${yv(98.5)} L${W * 0.2},${yv(97.5)} L${W * 0.3},${yv(99)} L${W * 0.4},${yv(100)}" fill="none" stroke="${C.ink}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
     <circle cx="${W * 0.4}" cy="${yv(100)}" r="13" fill="${C.ink}"/>
     <path class="upP" d="M${W * 0.4},${yv(100)} L${W * 0.5},${yv(103)} L${W * 0.6},${yv(101.5)} L${W * 0.72},${yv(106)} L${W * 0.86},${yv(105)} L${W},${yv(110)}" fill="none" stroke="${C.g2}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" opacity="0"/>
     <path class="dnP" d="M${W * 0.4},${yv(100)} L${W * 0.5},${yv(97.5)} L${W * 0.6},${yv(99)} L${W * 0.72},${yv(94)} L${W * 0.86},${yv(95)} L${W},${yv(90)}" fill="none" stroke="${C.red}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" opacity="0"/>`);
  txt(fc, { left: 40 + W * 0.4 - 70, top: 80 + yv(100) + 24, font: "800 24px Manrope", color: C.ink }, "BUYBACK");
  txt(fc, { left: 40, top: 26, font: "800 28px Manrope", color: C.mute, letterSpacing: ".06em" }, "BUYBACK KE BAAD?");
  show(fc, 42.8, 0.4, 30);
  tl.fromTo(fk.querySelector(".upP"), { opacity: 0 }, { opacity: 1, duration: 0.6, ease: "power1.inOut", immediateRender: false }, 43.84);
  tl.fromTo(fk.querySelector(".dnP"), { opacity: 0 }, { opacity: 1, duration: 0.6, ease: "power1.inOut", immediateRender: false }, 44.88);
  const ng = bigChip(s6, 910, "PRICE ▲ KI GUARANTEE NAHI", { font: "800 40px Manrope", borderColor: C.red, color: C.red }); show(ng, 44.46, 0.3, 16);
  const pf = bigChip(s6, 1030, `<svg viewBox="0 0 40 40" width="40" height="40" style="vertical-align:-8px;margin-right:14px"><circle cx="17" cy="17" r="12" fill="none" stroke="#fff" stroke-width="5"/><path d="M26,26 L36,36" stroke="#fff" stroke-width="6" stroke-linecap="round"/></svg>OVERALL PERFORMANCE DEKHEIN`, { font: "800 40px Manrope", background: C.ink, borderColor: C.ink, color: "#fff" });
  show(pf, 46.72, 0.3, 16);
  OV.push(fc, ng, pf);

  // ═══ S7 49.2–60.5: CTA → FloStocks icon → logo → disclaimer ═══
  const s7 = scene(49.2, 60.5, { push: false });
  const t1 = kin(s7, "MARKET KE TERMS", { y: 560, size: 100 }); const t2 = kin(s7, "*AASAAN* ZUBAAN MEIN", { y: 700, size: 86 });
  charsIn.rise(t1, 50.14, 0.02); charsIn.rise(t2, 51.1, 0.02);
  tl.to([t1, t2], { y: -40, opacity: 0, duration: 0.3, ease: "power2.in" }, 52.6);
  const cta = ctaLogo(s7, 52.9, { tDisc: 54.5 });
  OV.push(cta.fl);

  K.linkScenes();
  OV.forEach((e) => e && e.setAttribute("data-ov", ""));
  tl.seek(0);
})();
