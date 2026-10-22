// "What is an IPO" — 60 Seconds Investor. Cue times = word starts in videos/what-is-an-ipo/edit/vo.words.json
// (VO = trimmed, pause-tightened, studio-polished; see videos/what-is-an-ipo/prep_vo.py).
(function () {
  const { C, tl, el, scene, kin, charsIn, roller, roll, who, react, life, line, swap, ctaLogo, icon } = K;
  const X = CAST.expr, Gs = CAST.gesture;
  const card = (p, css) => el(p, Object.assign({ background: "#fff", borderRadius: 32, border: "2px solid #E3E9E5", boxShadow: "0 24px 50px rgba(20,40,20,.10)" }, css));
  const txt = (p, css, html) => el(p, Object.assign({ font: "700 40px Manrope", color: C.text, whiteSpace: "nowrap" }, css), html);
  const fadeUp = (e, t, d = 0.45, y = 40) => tl.fromTo(e, { y, opacity: 0 }, { y: 0, opacity: 1, duration: d, ease: "power3.out" }, t);
  const OV = [];

  // ═══ S1 HOOK 0–7.86: PSX logo alone → docks; the group chat; "Ye IPO hai kia?" ═══
  const s1 = scene(0, 7.86, { push: 1.02 });
  const logo = el(s1, { left: 290, top: 560, width: 500, height: 598 }, `<img src="assets/psx/psx-logo.png" style="width:100%;height:100%;object-fit:contain">`);
  tl.fromTo(logo, { scale: 1.12 }, { scale: 1, duration: 1.0, ease: "power2.out" }, 0)
    .to(logo, { y: -600, scale: 0.3, duration: 0.6, ease: "power3.inOut" }, 0.95);
  const chat = card(s1, { left: 140, top: 400, width: 800, height: 640 });
  fadeUp(chat, 1.3, 0.5, 60);
  el(chat, { left: 0, top: 0, width: 800, height: 110, borderRadius: "32px 32px 0 0", background: "#F1F7EE", borderBottom: "2px solid #E3E9E5" });
  el(chat, { left: 36, top: 26, width: 58, height: 58, borderRadius: 29, background: C.g, color: C.ink, font: "800 26px/58px Manrope", textAlign: "center" }, "D");
  txt(chat, { left: 112, top: 22, font: "800 34px Manrope" }, "Doston ka group");
  txt(chat, { left: 112, top: 62, font: "600 22px Inter", color: C.mute }, "Bilal, Sana, Usman, Aap");
  const b1 = el(chat, { left: 36, top: 160, maxWidth: 600, padding: "22px 28px", borderRadius: "8px 28px 28px 28px", background: "#F2F4F3", font: "600 38px/1.3 Inter", color: C.text },
    `<div style="font:800 24px Manrope;color:${C.gt};margin-bottom:6px">Bilal</div>Yaar, IPO aa raha hai, apply kiya?`);
  fadeUp(b1, 1.62, 0.4, 24);
  const b2 = el(chat, { left: 520, top: 380, padding: "22px 30px", borderRadius: "28px 8px 28px 28px", background: "#DDF5CF", font: "700 40px Inter", color: C.text },
    `Haan <span style="font:700 26px Inter;color:${C.gt}">✓✓</span>`);
  fadeUp(b2, 4.26, 0.35, 24);
  const aap = who(s1, "aap", 40, 1090, 420, { expr: "smile", gesture: "handPhone" });
  fadeUp(aap, 3.78, 0.45, 40); life(aap, 3.8, 7.8, "smile", 2);
  react.think(aap, 5.4, 1.6, { gesture: "none", dots: false });
  const q = kin(s1, "YE IPO | HAI *KIA?*", { x: 470, y: 1220, w: 570, size: 104 });
  charsIn.rise(q, 6.52, 0.03);
  OV.push(chat, logo);

  // ═══ S2 7.86–13.02: 60 Seconds Investor series card ═══
  const s2 = scene(7.86, 13.02);
  const ring = el(s2, { left: 310, top: 330, width: 460, height: 460 },
    `<svg viewBox="0 0 460 460"><circle cx="230" cy="230" r="210" fill="none" stroke="#E3E9E5" stroke-width="22"/>
     <circle class="arc" cx="230" cy="230" r="210" fill="none" stroke="${C.g}" stroke-width="22" stroke-linecap="round" pathLength="100" stroke-dasharray="100" stroke-dashoffset="100" transform="rotate(-90 230 230)"/></svg>
     <div class="abs" style="left:0;top:118px;width:460px;text-align:center;font:800 200px/1 Manrope;color:${C.text};letter-spacing:-.04em">60</div>`);
  fadeUp(ring, 8.0, 0.45, 30);
  tl.fromTo(ring.querySelector(".arc"), { attr: { "stroke-dashoffset": 100 } }, { attr: { "stroke-dashoffset": 0 }, duration: 1.4, ease: "power2.inOut", immediateRender: false }, 8.46);
  const sI = kin(s2, "SECONDS *INVESTOR*", { y: 860, size: 92 }); charsIn.rise(sI, 8.88, 0.02);
  const ser = el(s2, { left: 420, top: 990, width: 240, height: 64, borderRadius: 32, background: C.ink, color: "#fff", font: "800 30px/64px Manrope", textAlign: "center", letterSpacing: ".16em" }, "SERIES");
  fadeUp(ser, 9.54, 0.35, 20);
  const t1 = kin(s2, "PSX KE TERMS", { y: 1150, size: 72, color: C.mute }); charsIn.rise(t1, 10.52, 0.02);
  const t2 = kin(s2, "*SIMPLE* TAREEQE SE", { y: 1250, size: 92 }); charsIn.rise(t2, 11.62, 0.02);

  // ═══ S3 13.02–19.84: a new phone launch — pre-booking gets the launch price ═══
  const s3 = scene(13.02, 19.84);
  const h3 = kin(s3, "NAYA *PHONE* LAUNCH", { y: 190, size: 96 }); charsIn.rise(h3, 14.0, 0.02);
  const ph = icon(s3, "phone", 110, 360, 380, 608);
  fadeUp(ph, 13.3, 0.5, 60);
  el(ph, { left: 120, top: 120, width: 140, height: 46, borderRadius: 23, background: C.g, color: C.ink, font: "800 24px/46px Manrope", textAlign: "center" }, "NEW");
  txt(ph, { left: 0, top: 200, width: 380, textAlign: "center", font: "800 52px Manrope" }, "PHONE X");
  el(ph, { left: 95, top: 270, width: 190, height: 150, borderRadius: 26, background: "linear-gradient(160deg,#E7F4E0,#C9E9B8)" });
  const pre = el(ph, { left: 60, top: 470, width: 260, height: 74, borderRadius: 37, background: C.g2, color: "#fff", font: "800 30px/74px Manrope", textAlign: "center" }, "PRE-BOOK");
  fadeUp(pre, 16.12, 0.35, 16);
  tl.to(pre, { scale: 0.94, duration: 0.1, yoyo: true, repeat: 1, ease: "power1.inOut" }, 17.82);
  const open = el(s3, { left: 560, top: 400, padding: "16px 26px", borderRadius: 999, border: `4px solid ${C.g}`, background: "#fff", font: "800 34px Manrope", color: C.text, whiteSpace: "nowrap" }, "PRE-BOOKING OPEN");
  fadeUp(open, 15.56, 0.4, 20);
  const lp = card(s3, { left: 560, top: 540, width: 440, height: 210 });
  txt(lp, { left: 36, top: 34, font: "800 28px Manrope", color: C.mute, letterSpacing: ".06em" }, "LAUNCH PRICE");
  txt(lp, { left: 36, top: 84, font: "700 72px 'IBM Plex Mono'" }, "Rs 89,999");
  fadeUp(lp, 18.66, 0.45, 30);
  const early = ["zara", "usman", "ayesha"].map((n, i) => {
    const w = who(s3, n, 90 + i * 320, 1060, 260, { expr: "smile" });
    fadeUp(w, 17.22 + i * 0.12, 0.4, 30); return w; });
  const bk = el(early[0], { left: 60, top: -6, padding: "6px 16px", borderRadius: 14, background: C.g, color: C.ink, font: "800 26px Manrope", whiteSpace: "nowrap" }, "PEHLE BOOK ✓");
  fadeUp(bk, 17.82, 0.35, 16); react.joy(early[0], 18.94);
  OV.push(ph, lp);

  // ═══ S4 19.84–21.64: "IPO bhi bilkul aisa hi hai" ═══
  const s4 = scene(19.84, 21.64);
  const a4 = kin(s4, "IPO BHI", { y: 640, size: 150 }); const b4 = kin(s4, "BILKUL *AISA HI*", { y: 820, size: 120 });
  charsIn.rise(a4, 19.9, 0.03); charsIn.rise(b4, 20.3, 0.02);

  // ═══ S5 21.64–28.92: Initial Public Offering — a private company sells shares to the public, lists on PSX ═══
  const s5 = scene(21.64, 28.92);
  [["I", "INITIAL", 22.34], ["P", "PUBLIC", 22.76], ["O", "OFFERING", 23.08]].forEach(([L, word, t], i) => {
    const big = kin(s5, `*${L}*`, { x: 70 + i * 320, y: 170, w: 300, size: 190, accent: C.gt }); charsIn.rise(big, 21.7 + i * 0.08, 0.02);
    const sm = kin(s5, word, { x: 70 + i * 320, y: 390, w: 300, size: 52 }); charsIn.rise(sm, t, 0.02);
  });
  const co = card(s5, { left: 70, top: 560, width: 520, height: 330 });
  txt(co, { left: 40, top: 36, font: "800 26px Manrope", color: C.mute, letterSpacing: ".08em" }, "PRIVATE COMPANY");
  txt(co, { left: 40, top: 82, font: "800 60px Manrope" }, "TECHPAK LTD");
  el(co, { left: 40, top: 168, padding: "4px 14px", borderRadius: 10, background: "#F2F4F3", font: "700 22px Inter", color: C.mute }, "EXAMPLE");
  const lk = icon(co, "lock", 400, 160, 90, 107);
  fadeUp(co, 23.68, 0.45, 40);
  const pb = el(s5, { left: 640, top: 600, padding: "14px 24px", borderRadius: 999, background: C.ink, color: "#fff", font: "800 32px Manrope", whiteSpace: "nowrap" }, "PEHLI BAAR");
  fadeUp(pb, 24.7, 0.35, 20);
  tl.to(lk, { opacity: 0, y: -20, duration: 0.3 }, 25.34);
  const pub = ["sana", "bilal", "zara"].map((n, i) => { const w = who(s5, n, 60 + i * 340, 1080, 260, { expr: "smile" }); fadeUp(w, 25.94 + i * 0.1, 0.4, 30); return w; });
  pub.forEach((w, i) => {
    const tk = icon(s5, "ticket", 260, 820, 130, 76, "SHARE");
    gsap.set(tk, { opacity: 0 });
    tl.fromTo(tk, { x: 0, y: 0, opacity: 0 }, { x: (60 + i * 340 + 65) - 260, y: 1010 - 820, opacity: 1, duration: 0.6, ease: "power2.inOut", immediateRender: false }, 26.2 + i * 0.12);
    X(tl, w.av, "happy", 26.8 + i * 0.12);
  });
  const lg5 = el(s5, { left: 690, top: 700, width: 200, height: 239 }, `<img src="assets/psx/psx-logo.png" style="width:100%;height:100%;object-fit:contain">`);
  const lst = el(s5, { left: 650, top: 950, padding: "10px 22px", borderRadius: 14, border: `4px solid ${C.g}`, background: "#fff", font: "800 32px Manrope", color: C.gt, whiteSpace: "nowrap" }, "LISTED ON PSX ✓");
  tl.to(pb, { opacity: 0, duration: 0.25 }, 27.2);
  fadeUp(lg5, 27.38, 0.45, 30); fadeUp(lst, 27.92, 0.35, 16);
  OV.push(co, lg5);

  // ═══ shared: price axis Rs 9–15 (S6–S7) ═══
  const PX = (rs) => 120 + (rs - 9) * 140;          // Rs → x
  function axis(p, t) {
    const ax = el(p, { left: 120, top: 1000, width: 840, height: 4, background: C.ink });
    tl.fromTo(ax, { scaleX: 0, transformOrigin: "0% 50%" }, { scaleX: 1, duration: 0.5, ease: "power2.out" }, t);
    for (let rs = 9; rs <= 15; rs++) {
      el(p, { left: PX(rs) - 2, top: 992, width: 4, height: 20, background: C.ink });
      const lb = txt(p, { left: PX(rs) - 40, top: 1024, width: 80, textAlign: "center", font: "600 28px 'IBM Plex Mono'", color: C.mute }, String(rs));
      tl.fromTo(lb, { opacity: 0 }, { opacity: 1, duration: 0.2 }, t + 0.2);
    }
    const rl = txt(p, { left: 120, top: 1070, font: "700 24px Manrope", color: C.mute, letterSpacing: ".08em" }, "PRICE (Rs)");
    tl.fromTo(rl, { opacity: 0 }, { opacity: 1, duration: 0.2 }, t + 0.3);
  }
  function stepper(p, active, t, top = 330) {
    [["1", "BOOK BUILDING"], ["2", "PUBLIC SUBSCRIPTION"]].forEach(([n, label], i) => {
      const on = i + 1 === active;
      const s = el(p, { left: i ? 470 : 70, top, height: 72, padding: "0 28px", borderRadius: 36, display: "flex", alignItems: "center", gap: "14px",
        background: on ? C.g : "#fff", border: `3px solid ${on ? C.g : "#E3E9E5"}`, font: "800 30px Manrope", color: on ? C.ink : C.mute, whiteSpace: "nowrap" },
        `<span style="width:40px;height:40px;border-radius:20px;background:${on ? C.ink : "#E3E9E5"};color:${on ? "#fff" : C.mute};font:800 24px/40px Manrope;text-align:center;display:inline-block">${n}</span>${label}`);
      fadeUp(s, t + i * 0.12, 0.35, 20);
    });
  }

  // ═══ S6 28.92–37.78: two stages → book building: price band Rs 10–14, big investors bid ═══
  const s6 = scene(28.92, 37.78);
  const h6 = kin(s6, "PROCESS: *DO STAGES*", { y: 180, size: 88 }); charsIn.rise(h6, 29.0, 0.02);
  stepper(s6, 1, 29.46);
  const bbT = kin(s6, "PRICE *BAND*", { y: 480, size: 80 }); charsIn.rise(bbT, 32.34, 0.02);
  axis(s6, 31.32);
  const band = el(s6, { left: PX(10), top: 880, width: PX(14) - PX(10), height: 110, borderRadius: 14, background: "rgba(56,209,0,.16)", border: `3px solid ${C.g}` });
  tl.fromTo(band, { scaleX: 0, transformOrigin: "0% 50%", opacity: 0 }, { scaleX: 1, opacity: 1, duration: 0.55, ease: "power2.out" }, 32.68);
  const r10 = txt(s6, { left: PX(10) - 70, top: 800, width: 140, textAlign: "center", font: "700 44px 'IBM Plex Mono'", color: C.gt }, "Rs 10");
  const r14 = txt(s6, { left: PX(14) - 70, top: 800, width: 140, textAlign: "center", font: "700 44px 'IBM Plex Mono'", color: C.gt }, "Rs 14");
  fadeUp(r10, 34.1, 0.3, 14); fadeUp(r14, 34.36, 0.3, 14);
  const inv = ["bilal", "usman", "ayesha"].map((n, i) => { const w = who(s6, n, 90 + i * 320, 1150, 250, { expr: "smile" }); fadeUp(w, 35.5 + i * 0.1, 0.4, 30); return w; });
  const big = el(s6, { left: 300, top: 1420, padding: "8px 20px", borderRadius: 12, background: C.ink, color: "#fff", font: "800 28px Manrope", whiteSpace: "nowrap" }, "BADE INVESTORS");
  fadeUp(big, 35.88, 0.3, 14);
  [[12, 0], [13, 1], [13.5, 2]].forEach(([rs, i], k) => {
    const bid = el(s6, { left: PX(rs) - 70, top: 600 + k * 64, width: 140, height: 52, borderRadius: 26, background: "#fff", border: `3px solid ${C.ink}`, font: "800 24px/46px Manrope", textAlign: "center", color: C.text }, `BID ${rs}`);
    fadeUp(bid, 36.84 + k * 0.16, 0.35, 30);
    react.buy(inv[i], 36.84 + k * 0.16, 0.8);
  });
  tl.to(bbT, { opacity: 0, duration: 0.2 }, 36.7);
  OV.push(band);

  // ═══ S7 37.78–41.32: demand decides the final price = strike price ═══
  const s7 = scene(37.78, 41.32);
  const h7 = kin(s7, "DEMAND SE | *FINAL PRICE*", { y: 190, size: 96 }); charsIn.rise(h7, 37.92, 0.02);
  axis(s7, 37.85);
  const D = [0.12, 0.2, 0.3, 0.42, 0.55, 0.72, 0.95, 0.6, 0.3];   // demand at Rs 10, 10.5 … 14 (peak at 13)
  D.forEach((v, i) => {
    const rs = 10 + i * 0.5, h = v * 380;
    const b = el(s7, { left: PX(rs) - 26, top: 996 - h, width: 52, height: h, borderRadius: "10px 10px 0 0", background: i === 6 ? C.g2 : "#CDE9C0" });
    tl.fromTo(b, { scaleY: 0, transformOrigin: "50% 100%" }, { scaleY: 1, duration: 0.45, ease: "power2.out" }, 38.4 + i * 0.05);
  });
  const sl = el(s7, { left: PX(13) - 2, top: 520, width: 4, height: 476, background: C.ink });
  tl.fromTo(sl, { scaleY: 0, transformOrigin: "50% 100%" }, { scaleY: 1, duration: 0.4, ease: "power2.out" }, 40.3);
  const sp = el(s7, { left: PX(13) - 190, top: 430, width: 380, height: 80, borderRadius: 40, background: C.ink, color: "#fff", font: "800 34px/80px Manrope", textAlign: "center", whiteSpace: "nowrap" }, "STRIKE PRICE Rs 13");
  fadeUp(sp, 40.58, 0.35, 16);
  const dl = txt(s7, { left: 120, top: 560, font: "800 30px Manrope", color: C.gt, letterSpacing: ".08em" }, "DEMAND");
  fadeUp(dl, 38.4, 0.3, 14);

  // ═══ S8 41.32–47.52: stage 2 — general public applies through a broker at the strike price ═══
  const s8 = scene(41.32, 47.52);
  const h8 = kin(s8, "GENERAL PUBLIC | *SUBSCRIPTION*", { y: 180, size: 84 }); charsIn.rise(h8, 42.04, 0.02);
  stepper(s8, 2, 41.4, 420);
  const ap8 = who(s8, "aap", 30, 860, 420, { expr: "smile", gesture: "handPhone" }); fadeUp(ap8, 43.78, 0.45, 30); life(ap8, 43.8, 47.4, "smile", 4);
  const rt = el(s8, { left: 90, top: 1300, padding: "8px 20px", borderRadius: 12, background: C.ink, color: "#fff", font: "800 28px Manrope", whiteSpace: "nowrap" }, "RETAIL INVESTOR");
  fadeUp(rt, 44.06, 0.3, 14);
  const bc = card(s8, { left: 500, top: 560, width: 520, height: 720 });
  txt(bc, { left: 36, top: 32, font: "800 24px Manrope", color: C.mute, letterSpacing: ".1em" }, "BROKER APP");
  txt(bc, { left: 36, top: 76, font: "800 50px Manrope" }, "IPO · TECHPAK");
  el(bc, { left: 36, top: 148, padding: "4px 14px", borderRadius: 10, background: "#F2F4F3", font: "700 22px Inter", color: C.mute }, "EXAMPLE");
  const rows = [["Strike price", "Rs 13.00"], ["Quantity", "500"], ["Amount", "Rs 6,500"]].map(([k, v], i) => {
    const r = el(bc, { left: 24, top: 220 + i * 104, width: 472, height: 88, borderRadius: 16 });
    txt(r, { left: 14, top: 24, font: "600 30px Inter", color: C.mute }, k);
    txt(r, { left: 200, top: 20, width: 258, textAlign: "right", font: "700 36px 'IBM Plex Mono'" }, v);
    return r; });
  const apply = el(bc, { left: 36, top: 576, width: 448, height: 96, borderRadius: 48, background: C.g2, color: "#fff", font: "800 38px/96px Manrope", textAlign: "center" }, "APPLY");
  fadeUp(bc, 44.62, 0.45, 40);
  tl.to(rows[0], { backgroundColor: "#EAF7E3", duration: 0.25 }, 45.88);
  tl.to(apply, { scale: 0.95, duration: 0.1, yoyo: true, repeat: 1, ease: "power1.inOut" }, 46.7);
  const done = el(bc, { left: 36, top: 576, width: 448, height: 96, borderRadius: 48, background: C.ink, color: "#fff", font: "800 32px/96px Manrope", textAlign: "center" }, "APPLIED ✓");
  gsap.set(done, { opacity: 0 }); tl.to(done, { opacity: 1, duration: 0.25 }, 46.96);
  X(tl, ap8.av, "happy", 46.96);
  OV.push(bc);

  // ═══ S9 47.52–54.98: after listing the price can fluctuate → do your research ═══
  const s9 = scene(47.52, 54.98);
  const h9 = kin(s9, "LISTING KE *BAAD*", { y: 180, size: 96 }); charsIn.rise(h9, 48.44, 0.02);
  const pc = card(s9, { left: 60, top: 340, width: 960, height: 580 });
  txt(pc, { left: 40, top: 32, font: "800 26px Manrope", color: C.mute, letterSpacing: ".08em" }, "TECHPAK · AFTER LISTING (EXAMPLE)");
  const strike = el(pc, { left: 40, top: 300, width: 800, height: 0, borderTop: `3px dashed ${C.mute}` });
  txt(pc, { left: 660, top: 32, font: "700 22px 'IBM Plex Mono'", color: C.mute }, "- - - STRIKE Rs 13");
  const fl = line(pc, [[0, 0.5], [0.12, 0.72], [0.22, 0.55], [0.34, 0.82], [0.46, 0.38], [0.58, 0.6], [0.7, 0.25], [0.82, 0.48], [0.92, 0.35], [1, 0.58]],
    { x: 40, y: 110, w: 800, h: 420, color: C.g2, sw: 8, noise: 0.05, n: 70, grid: true, axis: ["16", "14.5", "13", "11.5", "10"] });
  fadeUp(pc, 47.6, 0.45, 40);
  fl.draw(49.16, 1.8);
  tl.set(strike, { opacity: 1 }, 47.6);
  const rc = card(s9, { left: 60, top: 980, width: 960, height: 430 });
  txt(rc, { left: 40, top: 32, font: "800 40px Manrope" }, "Apply se pehle <span style=\"color:" + C.gt + "\">research</span>");
  [["Company ke financials", 53.16], ["Price band aur valuation", 53.46], ["Risks — prospectus parhein", 53.86]].forEach(([s, t], i) => {
    const row = el(rc, { left: 40, top: 120 + i * 96, height: 76, display: "flex", alignItems: "center", gap: "20px", font: "600 36px Inter", color: C.text, whiteSpace: "nowrap" },
      `<span class="ck" style="width:52px;height:52px;border-radius:14px;border:4px solid ${C.g2};display:inline-flex;align-items:center;justify-content:center;font:900 32px Manrope;color:#fff">✓</span>${s}`);
    fadeUp(row, 51.04 + i * 0.15, 0.35, 16);
    tl.to(row.querySelector(".ck"), { backgroundColor: C.g2, duration: 0.2 }, t);
  });
  fadeUp(rc, 50.9, 0.45, 40);
  OV.push(pc, rc);

  // ═══ S10 54.98–66: CTA → FloStocks icon → logo → disclaimer ═══
  const s10 = scene(54.98, 66, { push: false });
  const c1 = kin(s10, "MARKET KE TERMS", { y: 560, size: 100 }); const c2 = kin(s10, "*AASAAN* ZUBAAN MEIN", { y: 700, size: 86 });
  charsIn.rise(c1, 55.4, 0.02); charsIn.rise(c2, 56.62, 0.02);
  tl.to([c1, c2], { y: -40, opacity: 0, duration: 0.3, ease: "power2.in" }, 57.9);
  const cta = ctaLogo(s10, 58.3, { tDisc: 60.0 });
  OV.push(cta.fl);

  K.linkScenes();
  OV.forEach((e) => e && e.setAttribute("data-ov", ""));
  tl.seek(0);
})();
