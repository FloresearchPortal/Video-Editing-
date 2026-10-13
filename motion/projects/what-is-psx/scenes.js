// "What is PSX" v2 — kinetic cut. Dark terminal world, per-letter type, camera always moving,
// characters only in story beats and always acting. Cue times = VO word times (edit/vo.words.json).
(function () {
  const { C, tl, el, scene, kin, charsIn, charsOut, scramble, bar, roller, roll, who, sym, react, talk, life, enter,
          tape, candles, line, gauge, tickerBand, wipe, slices, whip, zoomThrough, glitch, flash, shake, punch, camReset, rnd, icon } = K;
  const X = CAST.expr, Gs = CAST.gesture;
  function numTo(e, from, to, t, d, fmt) {   // value swap: old figure lifts out, new one settles in (no counting)
    tl.to(e, { y: -14, opacity: 0, duration: 0.12, ease: "power2.in" }, t)
      .set(e, { textContent: fmt(to) }, t + 0.12)
      .fromTo(e, { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.22, ease: "power2.out", immediateRender: false }, t + 0.12);
  }
  const M = window.MARKET;
  const TAPE = (M && M.stocks && M.stocks.length >= 6)
    ? M.stocks.map((s) => [s.symbol, s.price.toLocaleString("en-US", { maximumFractionDigits: 2 }), s.change_pct])
    : ["OGDC", "HBL", "LUCK", "ENGRO", "PSO", "MCB", "UBL", "FFC", "HUBC", "SYS"].map((s, i) => [s, "", i % 3 ? 1 : -1]);
  const half = Math.ceil(TAPE.length / 2);

  // ═══ S1 HOOK 0–5.35: the PSX logo alone, then a live KSE-100 screen — market upar / neeche ═══
  const s1 = scene(0, 5.35, { push: 1.03 });
  const K100 = (M && M.kse100) || { level: 165298.5, change_pct: 0.11, change_points: 174.09 };
  const fIdx = (v) => v.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  // frame 0: nothing but the PSX logo — clean, instantly readable, settling in
  const logo = el(s1, { left: 290, top: 560, width: 500, height: 598 }, `<img src="assets/psx/psx-logo.png" style="width:100%;height:100%;object-fit:contain">`);
  const halo = el(s1, { left: 190, top: 510, width: 700, height: 700, borderRadius: "50%", background: "radial-gradient(circle, rgba(56,209,0,.16), rgba(56,209,0,0) 62%)" });
  s1.insertBefore(halo, logo);
  tl.fromTo(logo, { scale: 1.14 }, { scale: 1, duration: 1.4, ease: "power2.out" }, 0);
  tl.fromTo(halo, { scale: 0.7, opacity: 0.4 }, { scale: 1.15, opacity: 1, duration: 1.4, ease: "power2.out" }, 0).to(halo, { opacity: 0, duration: 0.4 }, 1.6);
  // "PSX" (1.2) → the logo docks at the top and the trading screen builds underneath
  tl.to(logo, { y: -585, scale: 0.36, duration: 0.7, ease: "power3.inOut" }, 1.5);
  const card = el(s1, { left: 50, top: 400, width: 980, height: 820, borderRadius: 36, background: "#fff", border: "2px solid #E3E9E5", boxShadow: "0 30px 60px rgba(20,40,20,.10)" });
  tl.fromTo(card, { y: 90, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55, ease: "power3.out" }, 2.0);
  el(card, { left: 44, top: 38, font: "800 34px Manrope", color: C.mute, letterSpacing: ".04em" }, "KSE-100 INDEX");
  el(card, { left: 790, top: 34, width: 150, height: 46, borderRadius: 23, background: "#EAF7E3", color: C.gt, font: "800 24px/46px Manrope", textAlign: "center" }, "● LIVE");
  const idx = el(card, { left: 44, top: 88, font: "700 96px/1 'IBM Plex Mono'", color: C.text, letterSpacing: "-.03em" }, fIdx(K100.level - 400));
  const chip = el(card, { left: 48, top: 200, height: 50, padding: "0 20px", borderRadius: 12, background: "#EAF7E3", color: C.gt, font: "700 30px/50px 'IBM Plex Mono'" },
    `▲ ${fIdx(K100.change_points)} (${K100.change_pct.toFixed(2)}%)`);
  numTo(idx, K100.level - 400, K100.level, 2.1, 1.0, fIdx);
  const AX = ["166,400", "165,800", "165,200", "164,600", "164,000"];
  // one candlestick chart that tells the VO: sideways (11), rally on "upar" (8), sell-off on "neeche" (7)
  const cd = candles(card, { x: 44, y: 300, w: 780, h: 470, n: 26, start: 0.36, grid: true, axis: AX,
    trend: (p, r) => (p < 0.42 ? (r() - 0.5) * 0.06 : p < 0.74 ? 0.04 + r() * 0.03 : -(0.055 + r() * 0.03)) });
  cd.growRange(2.2, 0, 11, 0.035);
  // market UPAR (3.28): green candles rally, index ticks up
  cd.growRange(3.28, 11, 19, 0.1);
  numTo(idx, K100.level, K100.level + 820.4, 3.28, 0.9, fIdx);
  tl.set(chip, { textContent: `▲ ${fIdx(K100.change_points + 820.4)} (0.61%)` }, 3.3);
  const up = kin(s1, "MARKET *UPAR* ▲", { y: 1250, size: 96, accent: C.gt });
  tl.fromTo(up.chars, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.35, ease: "power2.out", stagger: 0.02 }, 3.28);
  tl.to(up, { opacity: 0, duration: 0.2 }, 4.12);
  // market NEECHE (4.3): red candles sell off, index drops
  cd.growRange(4.3, 19, 26, 0.1);
  numTo(idx, K100.level + 820.4, K100.level - 688.25, 4.3, 0.8, fIdx);
  tl.set(chip, { textContent: "▼ 688.25 (0.42%)", background: "#FDE8EC", color: C.red }, 4.32);
  const dn = kin(s1, "MARKET *NEECHE* ▼", { y: 1250, size: 96, accent: C.red });
  tl.fromTo(dn.chars, { opacity: 0, y: -24 }, { opacity: 1, y: 0, duration: 0.35, ease: "power2.out", stagger: 0.02 }, 4.3);
  const band = null;   // ticker band removed (client)

  // ═══ S2 5.35–8.45: "Lekin akhir ye sab hai kia? Main samjhata hoon!" ══════
  const s2 = scene(5.35, 8.45, { push: 1.05 });
  whip(s1, s2, 5.35);
  const l1 = kin(s2, "LEKIN AKHIR", { y: 420, size: 80, color: C.mute });
  const l2 = kin(s2, "YE SAB", { y: 540, size: 230 });
  const l3 = kin(s2, "HAI *KIA?*", { y: 800, size: 220 });
  charsIn.rise(l1, 5.46); charsIn.flip(l2, 5.96, 0.04); charsIn.slam(l3, 6.36, 0.035);
  tl.to([l1, l2, l3], { y: -40, opacity: 0, duration: 0.22, ease: "power2.in", stagger: 0.02 }, 7.12);
  const a1 = kin(s2, "MAIN", { y: 520, size: 170, color: C.mute });
  const a2 = kin(s2, "SAMJHATA", { y: 700, size: 170, color: C.ink });
  const a3 = kin(s2, "*HOON!*", { y: 930, size: 210 });
  const abar = bar(s2, 50, 690, 980, 230, C.g, 7.42, 0.3);
  s2.insertBefore(abar, a2);
  charsIn.slam(a1, 7.32, 0.02); charsIn.stretch(a2, 7.5); charsIn.slam(a3, 7.9, 0.03); punch(7.9, 1.08, 0.3);
  const bulb = icon(s2, "bulb", 444, 1160, 192, 240);
  tl.fromTo(bulb, { y: 60, scale: 0.85, opacity: 0 }, { y: 0, scale: 1, opacity: 1, duration: 0.45, ease: "power3.out" }, 7.9);
  camReset(8.3, 0.2);
  wipe(8.45);

  // ═══ S3 8.45–14.7: Ahmed's chai dhaaba, zabardast, rozana line ═══════════
  const s3 = scene(8.45, 14.7, { push: 1.04 });
  const so = kin(s3, "SOCHIYE...", { y: 250, size: 70, color: C.mute }); charsIn.rise(so, 8.5); charsOut.up(so, 9.35);
  const nameA = kin(s3, "*AHMED* KA", { y: 230, size: 120 });
  const nameB = kin(s3, "CHAI DHAABA", { y: 360, size: 140 });
  charsIn.slam(nameA, 9.5); charsIn.flip(nameB, 10.1, 0.03);
  const stall = el(s3, { left: 140, top: 640, width: 800, height: 640 }); stall.setAttribute("data-ov-group", "");
  icon(stall, "stall", 0, 0, 800, 640, "AHMED CHAI", "back");
  const ahmed = who(stall, "ahmed", 200, 180, 400, { expr: "smile" });
  const front = icon(stall, "stall", 0, 0, 800, 640, "AHMED CHAI", "front");
  front.setAttribute("data-layout-allow-occlusion", "");
  tl.fromTo(stall, { y: 1300, rotation: 6 }, { y: 0, rotation: 0, duration: 0.6, ease: "expo.out" }, 8.5);
  life(ahmed, 8.5, 14.6, "smile", 4);
  X(tl, ahmed.av, "happy", 9.5);
  front.querySelectorAll(".steam").forEach((p, i) => tl.fromTo(p, { y: 0, opacity: 1 }, { y: -26, opacity: 0, duration: 0.8, repeat: 6, ease: "none" }, 8.8 + i * 0.25));
  // zabardast
  tl.to([nameA, nameB], { y: -260, opacity: 0, duration: 0.25, ease: "power3.in" }, 11.15);
  const zab = kin(s3, "*ZABARDAST!*", { y: 300, size: 132 });
  charsIn.stretch(zab, 11.95); punch(12.1, 1.07, 0.3, 0, -40);
  react.love(ahmed, 12.12);
  // queue
  camReset(12.85, 0.3); charsOut.blast(zab, 12.9);
  const lineT = kin(s3, "ROZANA *LINE!*", { y: 280, size: 130 }); charsIn.words(lineT, 13.3, 0.12);
  tl.to(stall, { x: -100, scale: 0.55, duration: 0.5, ease: "power3.inOut", transformOrigin: "0% 100%" }, 12.9);
  ["sana", "bilal", "ayesha", "usman"].forEach((n, i) => {
    const q = who(s3, n, 470 + i * 138, 1070, 205, { expr: "happy" });
    tl.fromTo(q, { x: 160, opacity: 0 }, { x: 0, opacity: 1, duration: 0.45, ease: "power3.out" }, 13.3 + i * 0.08);
    const plus = el(q, { left: 84, top: -6, font: "800 42px Manrope", color: C.gt, textShadow: "0 0 20px #38D10088" }, "+1");
    tl.fromTo(plus, { y: 20, opacity: 0 }, { y: -40, opacity: 1, duration: 0.3, ease: "back.out(2)" }, 13.6 + i * 0.1).to(plus, { opacity: 0, duration: 0.3 }, 14.2);
  });

  // ═══ S4 14.7–20.45: dream of 5 dhaabe → no money (record scratch) ══════════
  const s4 = scene(14.7, 20.45, { push: false });
  zoomThrough(s3, s4, 14.7, "42%", "45%");
  const dreamTxt = kin(s4, "SHEHAR MEIN", { y: 230, size: 80, color: C.mute });
  const five = kin(s4, "*5* DHAABE", { y: 330, size: 190 });
  charsIn.rise(dreamTxt, 15.7); charsIn.slam(five, 16.18, 0.03);
  const sky = icon(s4, "skyline", 90, 540, 900, 300, undefined, undefined, true);
  sky.querySelectorAll(".bld").forEach((b, i) => tl.to(b, { attr: { "stroke-dashoffset": 0 }, duration: 0.6, ease: "power2.out" }, 14.85 + i * 0.07));
  tl.to(sky.querySelectorAll(".win"), { opacity: 1, duration: 0.05, stagger: 0.015 }, 15.3);
  const minis = [0, 1, 2, 3, 4].map((i) => icon(s4, "miniStall", 60 + i * 196, 862, 168, 151));
  minis.forEach((m, i) => tl.fromTo(m, { y: -60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: "power3.out" }, 16.18 + i * 0.13));
  const ahm4 = who(s4, "ahmed", 360, 1040, 360, { expr: "think" }); enter(ahm4, 14.9, "bottom");
  react.think(ahm4, 15.0, 1.0); react.joy(ahm4, 16.6, { face: "grin" });
  // record scratch
  glitch(17.72, 0.3);
  tl.to(s4, { filter: "grayscale(1) brightness(.6)", duration: 0.05 }, 17.76);
  tl.to(minis, { opacity: 0, y: 40, duration: 0.3, ease: "power2.in" }, 17.8);
  tl.to([sky, dreamTxt, five], { opacity: 0, duration: 0.25 }, 17.85);
  tl.set(s4, { filter: "none" }, 18.0);
  tl.to(ahm4, { y: -330, scale: 1.3, duration: 0.5, ease: "power3.inOut", transformOrigin: "50% 50%" }, 17.9);
  react.helpless(ahm4, 18.1, 1.8);
  const p1 = kin(s4, "PAISAY?", { y: 250, size: 170 });
  charsIn.drop(p1, 18.5);
  const rs0 = roller(s4, { x: 0, y: 450, size: 140, text: "Rs 0", color: C.red });
  tl.fromTo(rs0, { opacity: 0 }, { opacity: 1, duration: 0.1 }, 18.56); roll(rs0, 18.56, 0.6);
  const nahi = kin(s4, "BILKUL *NAHI.*", { y: 1230, size: 110, accent: C.red });
  charsIn.slam(nahi, 19.4, 0.02); shake(19.6, 14);

  // ═══ S5 20.2–24.05: sell the dhaaba in pieces to the public ═══════════════
  const s5 = scene(20.2, 24.05, { push: 1.05 });
  slices(20.2);
  const dec = kin(s5, "AHMED *DECIDE* KARTA HAI", { y: 240, size: 80 }); charsIn.words(dec, 20.36, 0.08);
  const tiles = el(s5, { left: 240, top: 470, width: 600, height: 480 });
  const TW = 150, TH = 160, tileEls = [];
  for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) {
    const t = el(tiles, { left: c * TW, top: r * TH, width: TW, height: TH, overflow: "hidden", borderRadius: 6 });
    t.innerHTML = `<div style="position:absolute;left:${-c * TW}px;top:${-r * TH}px;width:600px;height:480px">${K.ICON.stall()}</div>`;
    t.firstChild.firstChild.setAttribute("width", "600"); t.firstChild.firstChild.setAttribute("height", "480");
    tileEls.push(t);
  }
  tl.fromTo(tiles, { scale: 0.5, opacity: 0, rotation: -6 }, { scale: 1, opacity: 1, rotation: 0, duration: 0.45, ease: "back.out(1.8)" }, 20.4);
  // crack into pieces on "public"
  tl.to(tileEls, { scale: 0.9, outline: `5px solid ${C.g}`, duration: 0.2, stagger: 0.015, ease: "power2.out" }, 22.3);
  shake(22.32, 10);
  const crowd5 = ["sana", "bilal", "ayesha", "usman", "zara", "aap"].map((n, i) => {
    const w = who(s5, n, 30 + i * 170, 1120, 200, { expr: "smile" }); enter(w, 21.8 + i * 0.06, "bottom"); return w; });
  tileEls.forEach((t, i) => {
    const k = i % 6, dx = (30 + k * 170 + 40) - (240 + (i % 4) * TW), dy = 1070 - (470 + Math.floor(i / 4) * TH);
    tl.to(t, { x: dx, y: dy, scale: 0.4, rotation: (i % 2 ? 380 : -380), duration: 0.55, ease: "power3.inOut" }, 22.82 + i * 0.045);
  });
  crowd5.forEach((w, i) => react.joy(w, 23.35 + i * 0.05, { face: "happy" }));
  const tt = kin(s5, "THORA *THORA*", { y: 250, size: 130 }); charsIn.slam(tt, 22.82, 0.02);
  tl.to(dec, { opacity: 0, duration: 0.2 }, 22.7);
  wipe(24.05);

  // ═══ S6 24.05–29.9: listed on PSX → 1,000 shares × Rs 100 ═════════════════
  const s6 = scene(24.05, 29.9, { push: 1.04 });
  const lg6 = el(s6, { left: 410, top: 200, width: 260, height: 311 }, `<img src="assets/psx/psx-logo.png" style="width:100%;height:100%;object-fit:contain">`);
  tl.fromTo(lg6, { scale: 0, rotation: -20 }, { scale: 1, rotation: 0, duration: 0.45, ease: "back.out(2)" }, 24.12);
  const board = el(s6, { left: 70, top: 560, width: 940, height: 260, background: "#fff", border: `4px solid ${C.g}`, borderRadius: 28, boxShadow: "0 24px 50px rgba(20,40,20,.14)" });
  const bn = kin(board, "AHMED CHAI", { x: 0, y: 30, w: 940, size: 96, font: "IBM Plex Mono", weight: 600, track: 0.04 });
  const bs = kin(board, "TICKER: ACHAI", { x: 0, y: 150, w: 940, size: 52, font: "IBM Plex Mono", weight: 600, color: C.gt, track: 0.08 });
  tl.fromTo(board, { scaleY: 0 }, { scaleY: 1, duration: 0.3, ease: "expo.out" }, 24.3);
  scramble(bn, 24.4, 0.7); scramble(bs, 24.7, 0.5);
  const stamp = el(s6, { left: 340, top: 850, width: 400, height: 140, border: `10px solid ${C.g}`, borderRadius: 20, font: "800 84px/120px Manrope", color: C.gt, textAlign: "center", background: "#ffffffee" }, "LISTED ✓");
  tl.fromTo(stamp, { scale: 1.6, opacity: 0 }, { scale: 1, rotation: -3, opacity: 1, duration: 0.3, ease: "power3.out" }, 25.25);
  shake(25.5, 24); flash(25.49, C.g, 0.3);
  // 1,000 shares wave
  tl.to([board, stamp, lg6], { y: -360, scale: 0.7, opacity: 0.0, duration: 0.4, ease: "power3.inOut" }, 25.95);
  const grid = el(s6, { left: 140, top: 520, width: 800, height: 500 });
  let gh = "";
  for (let i = 0; i < 1000; i++) gh += `<i style="position:absolute;left:${(i % 40) * 20}px;top:${Math.floor(i / 40) * 20}px;width:15px;height:15px;border-radius:4px;background:${C.g};box-shadow:0 0 6px ${C.g}"></i>`;
  grid.innerHTML = gh;
  tl.fromTo(grid.children, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.25, ease: "back.out(3)", stagger: { each: 0.0009, grid: [25, 40], from: "center" } }, 26.2);
  const r1000 = roller(s6, { x: 0, y: 1090, size: 150, text: "1,000", color: C.text }); roll(r1000, 26.22, 1.0);
  const shL = kin(s6, "*SHARES*", { y: 300, size: 150 }); charsIn.slam(shL, 26.56, 0.03);
  // one share = Rs 100
  tl.to(grid, { opacity: 0.18, scale: 0.92, duration: 0.3 }, 28.0).to([r1000, shL], { opacity: 0, duration: 0.2 }, 28.0);
  const tk = icon(s6, "ticket", 290, 600, 500, 292, "1 SHARE");
  tl.fromTo(tk, { rotationY: 180, scale: 0.2, opacity: 0, transformPerspective: 900 }, { rotationY: 0, scale: 1, opacity: 1, duration: 0.6, ease: "back.out(1.6)" }, 28.05);
  const r100 = roller(s6, { x: 0, y: 1000, size: 170, text: "Rs 100", color: C.gt }); roll(r100, 29.2, 0.6);

  // ═══ S7 29.9–34.85: 1 lakh from the market, no bank ═══════════════════════
  const s7 = scene(29.9, 34.85, { push: 1.05 });
  zoomThrough(s6, s7, 29.9);
  const e1 = kin(s7, "1,000", { x: 40, y: 300, w: 400, size: 104, font: "IBM Plex Mono", weight: 600 });
  const ex = kin(s7, "×", { x: 440, y: 300, w: 200, size: 104, color: C.gt });
  const e2 = kin(s7, "Rs 100", { x: 620, y: 300, w: 400, size: 104, font: "IBM Plex Mono", weight: 600, upper: false });
  tl.fromTo(e1, { x: -60, opacity: 0 }, { x: 0, opacity: 1, duration: 0.45, ease: "power3.out" }, 30.0).fromTo(e2, { x: 60, opacity: 0 }, { x: 0, opacity: 1, duration: 0.45, ease: "power3.out" }, 30.2);
  tl.fromTo(ex, { scale: 0.6, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.35, ease: "power3.out" }, 30.4);
  tl.to([e1, e2, ex], { y: -60, scale: 0.6, opacity: 0.5, duration: 0.3, ease: "power3.inOut" }, 32.0);
  const lakh = roller(s7, { x: 0, y: 480, size: 132, text: "Rs 1,00,000", color: C.gt });
  tl.fromTo(lakh, { scale: 1.08, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.35, ease: "power2.out" }, 32.25); roll(lakh, 32.25, 0.7);
  const lk2 = kin(s7, "1 LAKH RUPAY", { y: 680, size: 70, color: C.ink }); const lkb = bar(s7, 220, 676, 640, 96, C.g, 32.6, 0.3); s7.insertBefore(lkb, lk2); charsIn.rise(lk2, 32.66);
  const ahm7 = who(s7, "ahmed", 40, 850, 520, { expr: "smile", gesture: "hand" }); enter(ahm7, 30.1, "left"); life(ahm7, 30.2, 34.8, "smile", 6);
  react.joy(ahm7, 32.4, { gesture: "ok" });
  const bank = icon(s7, "bank", 640, 930, 330, 293);
  tl.fromTo(bank, { y: 300, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: "back.out(1.6)" }, 33.3);
  const slash = el(s7, { left: 600, top: 900, width: 410, height: 360 }, `<svg viewBox="0 0 410 360"><path d="M40,40 L370,320 M370,40 L40,320" stroke="${C.red}" stroke-width="34" stroke-linecap="round"/></svg>`);
  tl.fromTo(slash, { scale: 2.2, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.2, ease: "power4.in" }, 34.0); shake(34.2, 14);
  const bb = el(s7, { left: 660, top: 820, background: C.red, color: "#fff" }, "BINA BANK KE", "tag");
  tl.fromTo(bb, { scale: 0, rotation: -12 }, { scale: 1, rotation: -5, duration: 0.35, ease: "back.out(2.5)" }, 33.35);

  // ═══ S8 34.85–39.35: people get hissay = shares ═══════════════════════════
  const s8 = scene(34.85, 39.35, { push: 1.04 });
  whip(s7, s8, 34.85);
  const ppl = ["sana", "bilal", "ayesha", "usman"].map((n, i) => {
    const w = who(s8, n, 10 + i * 262, 820, 300, { expr: "smile" }); enter(w, 35.0 + i * 0.08, "bottom"); life(w, 35.2, 39.3, "smile", 7 + i); return w; });
  const st8 = icon(s8, "miniStall", 400, 360, 280, 252);
  tl.fromTo(st8, { scale: 0 }, { scale: 1, duration: 0.4, ease: "back.out(2)" }, 34.95);
  ppl.forEach((w, i) => {
    const tk8 = icon(s8, "ticket", 470, 470, 150, 88, "SHARE");
    tl.fromTo(tk8, { x: 0, y: 0, scale: 0.3, opacity: 0, rotation: 0 }, { x: (10 + i * 262 + 75) - 470, y: 770 - 470, scale: 1, rotation: i % 2 ? 380 : -380, opacity: 1, duration: 0.55, ease: "power3.out" }, 36.35 + i * 0.16);
    react.joy(w, 36.85 + i * 0.16, { face: "happy" });
  });
  const hs = kin(s8, "HISSAY", { y: 1170, size: 140 }); scramble(hs, 37.3, 0.4);
  tl.to(hs, { opacity: 0, duration: 0.12 }, 38.22);
  const eqS = kin(s8, "HISSAY = *SHARES*", { y: 1180, size: 110 }); charsIn.rise(eqS, 38.4, 0.02);

  // ═══ S9 39.35–45.25: Aap: "kamaal!" → buys 5 shares (Rs 500) ═════════════
  const s9 = scene(39.35, 45.25, { push: 1.04 });
  zoomThrough(s8, s9, 39.35);
  const aap = who(s9, "aap", 220, 740, 640, { expr: "smile", gesture: "cup" }); enter(aap, 39.4, "bottom"); life(aap, 39.5, 45.2, "smile", 9);
  const bub = el(s9, { left: 70, top: 220, width: 940, height: 380, background: "#fff", borderRadius: 40, border: "4px solid #0B0F14", boxShadow: "0 20px 50px rgba(20,40,20,.15)" });
  el(bub, { left: 536, top: 372, width: 0, height: 0, borderLeft: "44px solid transparent", borderRight: "44px solid transparent", borderTop: "64px solid #0B0F14" });
  el(bub, { left: 542, top: 368, width: 0, height: 0, borderLeft: "38px solid transparent", borderRight: "38px solid transparent", borderTop: "56px solid #fff" });
  const bq = kin(bub, "\"YAAR, AHMED KI CHAI | TOH *KAMAAL* HAI!\"", { x: 30, y: 70, w: 880, size: 84, color: C.ink, accent: C.g3, lh: 1.15 });
  tl.fromTo(bub, { scale: 0, transformOrigin: "60% 100%" }, { scale: 1, duration: 0.4, ease: "back.out(2)" }, 40.1);
  charsIn.words(bq, 40.26, 0.12);
  talk(aap, [40.26, 40.44, 40.74, 40.9, 41.16], "happy");
  react.love(aap, 41.64, { gesture: "cup", keep: true }); punch(41.64, 1.06, 0.3, 0, -30);
  tl.to(bub, { opacity: 0, y: -40, duration: 0.25, ease: "power2.in" }, 42.25); camReset(42.3);
  // buys 5 shares — in the FloStocks app
  tl.to(aap, { x: -160, opacity: 0, duration: 0.25, ease: "power2.in" }, 42.25);
  const A9 = K.app(s9, 330, 210, 0.8);
  tl.fromTo(A9.phone, { x: 160, opacity: 0 }, { x: 0, opacity: 1, duration: 0.45, ease: "power3.out" }, 42.55);
  K.tap(A9, 381, 472, 42.95, A9.actions.Buy);
  punch(43.02, 1.32, 0.45, -55, -20); camReset(44.5, 0.4);
  tl.to(A9.dim, { opacity: 1, duration: 0.2 }, 43.0).to(A9.sheet, { yPercent: 0, duration: 0.35, ease: "expo.out" }, 43.0);
  // quantity steps 1 → 5 at a readable pace, total follows each step
  tl.set(A9.qty, { textContent: "1" }, 43.0).set(A9.total, { textContent: "Rs 100" }, 43.0);
  [43.1, 43.36, 43.62, 43.88].forEach((tt, i) => {
    K.tap(A9, 538, 842, tt, A9.plus);
    tl.set(A9.qty, { textContent: String(i + 2) }, tt + 0.05).set(A9.total, { textContent: "Rs " + (i + 2) * 100 }, tt + 0.05);
  });
  K.tap(A9, 313, 1071, 44.18, A9.buyBtn);
  tl.to(A9.sheet, { yPercent: 105, duration: 0.3, ease: "power3.in" }, 44.32).to(A9.dim, { opacity: 0, duration: 0.2 }, 44.36);
  tl.fromTo(A9.toast, { y: -30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3, ease: "power2.out" }, 44.3).to(A9.toast, { opacity: 0, duration: 0.2 }, 44.9);
  tl.to(A9.empty, { opacity: 0, duration: 0.1 }, 44.45).fromTo(A9.card, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" }, 44.47);
  numTo(A9.value, 0, 500, 44.47, 0.6, (v) => v.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
  tl.to(A9.finger, { top: 1500, duration: 0.3 }, 44.5);
  wipe(45.25);

  // ═══ S10 45.25–50.75: 6 months later → 5 dhaabe → price 100 → 200 ═════════
  const s10 = scene(45.25, 50.75, { push: 1.05 });
  const clk = icon(s10, "clock", 390, 300, 300, 300);
  tl.fromTo(clk, { scale: 0 }, { scale: 1, duration: 0.35, ease: "back.out(2)" }, 45.3);
  tl.to(clk.querySelector(".mh"), { rotation: 360 * 6, svgOrigin: "150 150", duration: 1.0, ease: "power2.inOut" }, 45.35)
    .to(clk.querySelector(".hh"), { rotation: 180, svgOrigin: "150 150", duration: 1.0, ease: "power2.inOut" }, 45.35);
  const m6 = kin(s10, "*6* MAHINE BAAD", { y: 640, size: 120 }); charsIn.flip(m6, 45.4, 0.03);
  tl.to([clk, m6], { y: -260, scale: 0.6, opacity: 0, duration: 0.4, ease: "power3.inOut" }, 46.3);
  const row5 = [0, 1, 2, 3, 4].map((i) => icon(s10, "miniStall", 40 + i * 202, 380, 190, 171));
  row5.forEach((m, i) => tl.fromTo(m, { y: -800 }, { y: 0, duration: 0.45, ease: "bounce.out" }, 46.56 + i * 0.12));
  const pc = el(s10, { left: 60, top: 640, width: 960, height: 660, background: "#fff", border: "3px solid #E3E9E5", borderRadius: 36, boxShadow: "0 24px 50px rgba(20,40,20,.12)" });
  el(pc, { left: 44, top: 36, font: "600 38px 'IBM Plex Mono'", color: C.mute }, "ACHAI · SHARE PRICE");
  const pa = roller(pc, { x: 44, y: 90, w: 600, size: 110, text: "Rs 100", color: C.text }); pa.style.textAlign = "left";
  const pb = roller(pc, { x: 44, y: 90, w: 600, size: 110, text: "Rs 200", color: C.gt }); pb.style.textAlign = "left";
  const badge = el(pc, { left: 640, top: 108, width: 280, height: 90, background: C.g, borderRadius: 45, font: "800 50px/90px Manrope", textAlign: "center", color: C.ink }, "▲ 100%");
  const pl = line(pc, [[0, 0.05], [0.15, 0.12], [0.28, 0.1], [0.45, 0.4], [0.58, 0.35], [0.78, 0.72], [0.9, 0.68], [1, 0.95]], { x: 44, y: 260, w: 830, h: 340, color: C.g2, sw: 8, grid: true, rows: 2, axis: ["200", "150", "100"] });
  tl.fromTo(pc, { y: 900, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: "expo.out" }, 48.2);
  roll(pa, 48.3, 0.4); pl.draw(48.5, 1.3);
  tl.set(pa, { autoAlpha: 0 }, 49.68); roll(pb, 49.68, 0.5);
  tl.fromTo(badge, { scale: 0 }, { scale: 1, duration: 0.4, ease: "back.out(3)" }, 49.75); punch(49.7, 1.05, 0.3, 0, -60);

  // ═══ S11 50.75–54.95: same app — the holding doubles: Rs 500 → Rs 1,000 ═══
  const s11 = scene(50.75, 54.95, { push: 1.04 });
  whip(s10, s11, 50.75); camReset(50.75, 0.2);
  const gb = kin(s11, "GHAR BAITHE *BAITHE*", { y: 225, size: 72 }); charsIn.rise(gb, 51.86);
  tl.to(gb, { opacity: 0, y: -60, duration: 0.3, ease: "power2.in" }, 52.6);   // clear before the camera punch-in crops it
  const A11 = K.app(s11, 470, 330, 0.72);
  tl.set([A11.card], { opacity: 1 }, 0).set(A11.empty, { opacity: 0 }, 0);
  A11.value.textContent = "500.00"; A11.cValue.textContent = "500";
  tl.fromTo(A11.phone, { y: 1000 }, { y: 0, duration: 0.5, ease: "expo.out" }, 50.85);
  const lounge = el(s11, { left: 0, top: 0, width: 1080, height: 1920 }); lounge.setAttribute("data-ov-group", "");
  const sofa = icon(lounge, "sofa", -50, 1170, 400, 150);
  const aap11 = who(lounge, "aap", -20, 900, 360, { expr: "smile", gesture: "handPhone" });
  tl.fromTo([sofa, aap11], { x: -700 }, { x: 0, duration: 0.5, ease: "expo.out", stagger: 0.06 }, 50.9);
  life(aap11, 51, 54.9, "smile", 11);
  const f2 = (v) => v.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  numTo(A11.price, 100, 200, 52.7, 0.8, f2);
  numTo(A11.value, 500, 1000, 52.9, 0.6, f2);
  numTo(A11.cValue, 500, 1000, 52.9, 0.6, (v) => Math.round(v).toLocaleString("en-US"));
  tl.set(A11.chg, { textContent: "▲ +100.00 (+100.00%)", color: "#2FA80C" }, 53.44)
;
  tl.set(A11["cP&L %"], { textContent: "+100.00%", color: "#2FA80C" }, 53.44)
    .set(A11.allTime, { textContent: "+500.00", color: "#2FA80C" }, 53.44).set(A11.today, { textContent: "+500.00", color: "#2FA80C" }, 53.44);
  const ringV = el(A11.scr, { left: 10, top: 212, width: 330, height: 84, borderRadius: 20, border: "5px solid #38D100", opacity: 0 });
  tl.fromTo(ringV, { scale: 1.3, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: "back.out(2)" }, 53.44);
  tl.fromTo(A11.card, { boxShadow: "0 0 0 0 rgba(56,209,0,0)" }, { boxShadow: "0 0 0 8px rgba(56,209,0,.55)", duration: 0.3 }, 53.44);
  const plus = kin(K.fx, "+Rs 500", { x: 0, y: 190, w: 1080, size: 104, color: C.gt, font: "IBM Plex Mono", weight: 600, upper: false });
  charsIn.slam(plus, 53.5, 0.03); tl.to(plus, { opacity: 0, y: -60, duration: 0.3 }, 54.6);
  const x2 = el(K.fx, { left: 880, top: 180, width: 150, height: 150, background: C.g, borderRadius: "50%", font: "800 66px/150px Manrope", textAlign: "center", color: C.ink, boxShadow: `0 0 50px ${C.g}` }, "×2");
  tl.fromTo(x2, { scale: 0 }, { scale: 1, duration: 0.4, ease: "power3.out" }, 53.6).to(x2, { scale: 0, duration: 0.25 }, 54.6);
  react.shock(aap11, 53.3, { face: "wow" }); react.joy(aap11, 53.85, { gesture: "waveOkLongArms" });
  flash(53.4, C.g, 0.25); punch(52.75, 1.28, 0.45, -110, 300); camReset(54.3, 0.35);
  const conf = el(s11, { left: 0, top: 0, width: 1080, height: 1920 }); s11.insertBefore(conf, A11.phone);
  for (let i = 0; i < 40; i++) {
    const p = el(conf, { left: 640, top: 560, width: 18, height: 30, background: [C.g, C.gold, C.g3, C.lime][i % 4], borderRadius: 4 });
    const a = (i / 40) * Math.PI * 2;
    tl.fromTo(p, { x: 0, y: 0, opacity: 0 }, { x: Math.cos(a) * (300 + (i * 37) % 300), y: Math.sin(a) * (300 + (i * 53) % 300) + 400, rotation: 720, opacity: 1, duration: 1.3, ease: "power2.out" }, 53.45)
      .to(p, { opacity: 0, duration: 0.3 }, 54.45);
  }
  wipe(54.95, [C.night, C.g, C.night]);

  // ═══ S12 54.95–57.4: why did the price rise? ══════════════════════════════
  const s12 = scene(54.95, 57.4, { push: 1.1 });
  const sw = kin(s12, "LEKIN SAWAL YE HAI", { y: 300, size: 70, color: C.mute }); charsIn.rise(sw, 55.0);
  const qk = kin(s12, "QEEMAT | *KYUN* BADHI?", { y: 1000, size: 140 }); charsIn.flip(qk, 56.2, 0.025);
  const q12 = el(s12, { left: 290, top: 400, width: 500, height: 560, font: "800 520px/1 Manrope", color: C.gt, textAlign: "center", textShadow: `0 0 80px ${C.g}` }, "?");
  tl.fromTo(q12, { rotationY: 720, scale: 0, transformPerspective: 900 }, { rotationY: 0, scale: 1, duration: 0.8, ease: "back.out(1.5)" }, 55.4);
  tl.to(q12, { rotation: 10, duration: 0.25, yoyo: true, repeat: 3, ease: "sine.inOut" }, 56.2);

  // ═══ S13 57.4–64.95: good news → buying rush → DEMAND up ══════════════════
  const s13 = scene(57.4, 64.95, { push: 1.04 });
  zoomThrough(s12, s13, 57.4, "50%", "35%");
  const ph = icon(s13, "phone", 290, 240, 500, 800);
  const nt = el(ph, { left: 58, top: 140, width: 384, height: 200, background: "#fff", borderRadius: 26, padding: "22px 24px", font: "800 40px/1.2 Manrope", color: C.ink },
    `<div style="font:700 24px Manrope;color:${C.g3};letter-spacing:.08em">BREAKING · BUSINESS</div>Ahmed Chai ab 5 jagah! 📈`);
  tl.fromTo(ph, { y: 1200 }, { y: 0, duration: 0.5, ease: "expo.out" }, 57.5);
  tl.fromTo(nt, { y: -260, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, ease: "back.out(1.8)" }, 58.4);
  const pbars = [0.3, 0.45, 0.6, 0.8, 1].map((h, i) => el(ph, { left: 70 + i * 66, top: 720 - h * 300, width: 48, height: h * 300, background: i === 4 ? C.g : "#24302A", borderRadius: 10 }));
  tl.fromTo(pbars, { scaleY: 0, transformOrigin: "50% 100%" }, { scaleY: 1, duration: 0.4, ease: "back.out(2)", stagger: 0.08 }, 59.0);
  const good = kin(s13, "BUSINESS *ACHI TARAF*", { y: 1100, size: 90 }); charsIn.words(good, 59.46, 0.1);
  tl.to([ph, good], { y: -1200, duration: 0.4, ease: "power3.in" }, 61.0);
  const buyT = kin(s13, "SAB *KHAREEDNE* LAGE", { y: 230, size: 88 }); charsIn.slam(buyT, 61.44, 0.015);
  const buyers = ["sana", "bilal", "ayesha", "usman", "zara", "aap"].map((n, i) => {
    const w = who(s13, n, (i % 3) * 330 + 30, 420 + Math.floor(i / 3) * 360, 320, { expr: "happy", gesture: i % 2 ? "pointLongArm" : "waveLongArm" });
    tl.fromTo(w, { x: i % 3 === 0 ? -700 : i % 3 === 2 ? 700 : 0, y: i % 3 === 1 ? 900 : 0, opacity: 0 }, { x: 0, y: 0, opacity: 1, duration: 0.45, ease: "expo.out" }, 61.4 + i * 0.07);
    const tg = el(w, { left: 190, top: 20, background: C.g, color: C.ink }, "BUY", "tag");
    tl.fromTo(tg, { scale: 0, rotation: -20 }, { scale: 1, rotation: 8, duration: 0.3, ease: "back.out(3)" }, 61.75 + i * 0.07);
    react.buy(w, 61.9 + i * 0.06, 1.25);
    return w;
  });
  tl.to(buyers, { scale: 0.8, y: -120, duration: 0.35, ease: "power3.inOut" }, 63.3);
  const gD = gauge(s13, "DEMAND", { x: 320, y: 1100, color: C.gt, start: 0.2 });
  tl.fromTo(gD, { y: 400, opacity: 0 }, { y: 0, opacity: 1, duration: 0.35, ease: "expo.out" }, 63.3); gD.to(0.95, 63.6, 1.0);
  punch(63.6, 1.05, 0.3, 0, -80);

  // ═══ S14 64.95–68.7: supply locked at 1,000 ═══════════════════════════════
  const s14 = scene(64.95, 68.7, { push: 1.05 });
  slices(64.95, C.night); camReset(64.95, 0.1);
  const crate = icon(s14, "crate", 260, 300, 560, 414);
  tl.fromTo(crate, { scale: 0.3, rotation: -10 }, { scale: 1, rotation: 0, duration: 0.45, ease: "back.out(2)" }, 65.0);
  const sirf = kin(s14, "SIRF *1,000* SHARES", { y: 760, size: 100 }); charsIn.slam(sirf, 66.1, 0.015);
  const lock = icon(s14, "lock", 850, 420, 160, 190);
  tl.fromTo(lock, { y: -120, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: "power3.out" }, 67.1); shake(67.3, 16);
  const gD2 = gauge(s14, "DEMAND", { x: 40, y: 960, color: C.gt, start: 0.95 });
  const gS = gauge(s14, "SUPPLY", { x: 600, y: 960, color: "#9AA49F", start: 0.3 });
  tl.fromTo([gD2, gS], { y: 400, opacity: 0 }, { y: 0, opacity: 1, duration: 0.35, ease: "expo.out", stagger: 0.1 }, 66.9);
  const lim = el(s14, { left: 826, top: 640, background: C.ink, color: "#fff" }, "LIMITED", "tag");
  tl.fromTo(lim, { scale: 0 }, { scale: 1, rotation: -6, duration: 0.3, ease: "back.out(3)" }, 67.6);

  // ═══ S15 68.7–73.6: demand > supply → price UP ════════════════════════════
  const s15 = scene(68.7, 73.6, { push: 1.06 });
  whip(s14, s15, 68.7);
  const dz = kin(s15, "DEMAND *ZYADA*", { y: 260, size: 110 }); charsIn.slam(dz, 69.3, 0.015);
  const sk = kin(s15, "SUPPLY KAM", { y: 400, size: 110, color: C.mute }); charsIn.drop(sk, 70.14, 0.02);
  const eq = kin(s15, "=", { y: 540, size: 140, color: C.gt }); charsIn.stretch(eq, 70.9);
  const rocket = line(s15, [[0, 0], [0.2, 0.12], [0.32, 0.08], [0.55, 0.42], [0.66, 0.36], [0.85, 0.75], [1, 1]], { x: 90, y: 620, w: 840, h: 440, color: C.g2, sw: 9, grid: true, axis: ["Rs 200", "Rs 175", "Rs 150", "Rs 125", "Rs 100"] });
  rocket.draw(71.3, 1.0);
  const qu = kin(s15, "QEEMAT *UPAR!*", { y: 1170, size: 130 }); charsIn.slam(qu, 71.24, 0.02);
  punch(72.24, 1.1, 0.35, 0, 60); flash(72.24, C.g, 0.35);
  glitch(73.45, 0.3);

  // ═══ S16 73.6–84.05: bad news → panic selling → price DOWN ════════════════
  const s16 = scene(73.6, 84.05, { push: 1.03 });
  camReset(73.6, 0.1);
  const red = el(s16, { left: 0, top: 0, width: 1080, height: 1920, background: "radial-gradient(80% 60% at 50% 45%, rgba(228,0,43,.07), rgba(0,0,0,0) 70%)" });
  const agar = kin(s16, "AGAR LOGON KO LAGE...", { y: 240, size: 70, color: C.mute }); charsIn.rise(agar, 73.7);
  // "doob raha hai" — told in market terms: bad-news alert, red candles breaking down, price card falling
  const alert = el(s16, { left: 110, top: 360, width: 860, height: 170, background: "#fff", borderRadius: 28, border: `4px solid ${C.red}`, boxShadow: "0 20px 44px rgba(20,40,20,.14)" });
  el(alert, { left: 28, top: 26, background: C.red, color: "#fff", borderRadius: 10, padding: "4px 14px", font: "800 26px Manrope", letterSpacing: ".08em" }, "ALERT");
  el(alert, { left: 28, top: 78, font: "800 46px Manrope", color: C.text }, "Ahmed Chai ka business slow?");
  tl.fromTo(alert, { y: -300, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, ease: "back.out(1.6)" }, 74.25);
  const crashC = candles(s16, { x: 60, y: 590, w: 880, h: 420, n: 22, grid: true, axis: ["200", "180", "160", "140"], start: 0.78, trend: (p2, r) => (p2 < 0.35 ? (r() - 0.5) * 0.08 : -0.035 - r() * 0.03) });
  crashC.grow(74.7, 0.06);
  const pcard = el(s16, { left: 110, top: 1060, width: 640, height: 200, background: "#fff", borderRadius: 30, border: "3px solid #E3E9E5", boxShadow: "0 24px 50px rgba(20,40,20,.14)" });
  el(pcard, { left: 36, top: 30, font: "600 34px 'IBM Plex Mono'", color: C.mute }, "ACHAI");
  const pFall = roller(pcard, { x: 36, y: 74, w: 340, size: 90, text: "Rs 140", color: C.red }); pFall.style.textAlign = "left";
  const dBadge = el(pcard, { left: 384, top: 66, width: 220, height: 86, background: C.red, borderRadius: 43, font: "800 46px/86px Manrope", textAlign: "center", color: "#fff" }, "▼ 30%");
  tl.fromTo(pcard, { y: 400, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, ease: "expo.out" }, 75.3);
  roll(pFall, 75.6, 0.7);
  tl.fromTo(dBadge, { scale: 0 }, { scale: 1, duration: 0.35, ease: "back.out(3)" }, 75.75);
  tl.to(agar, { opacity: 0, y: -60, duration: 0.2 }, 75.3);
  const doob = kin(s16, "*DOOB* RAHA HAI?", { y: 235, size: 110, accent: C.red }); charsIn.drop(doob, 75.5, 0.02);
  tl.to(alert, { y: -60, opacity: 0, duration: 0.3, ease: "power2.in" }, 75.3);
  const ahm16 = who(s16, "ahmed", 750, 1030, 310, { expr: "worried" }); enter(ahm16, 74.9, "right");
  react.shock(ahm16, 75.75, { flashColor: C.red }); shake(75.8, 14);
  // panic sell
  tl.to([alert, crashC, pcard, doob, agar, ahm16], { opacity: 0, y: -200, duration: 0.3, ease: "power3.in", stagger: 0.02 }, 76.75);
  const sellers = ["bilal", "sana", "usman", "ayesha"].map((n, i) => {
    const w = who(s16, n, 20 + i * 262, 330, 300, { expr: "worried", gesture: "none" });
    tl.fromTo(w, { y: -900 }, { y: 0, duration: 0.4, ease: "power3.out" }, 76.95 + i * 0.07);
    const tg = el(w, { left: 92, top: 16, background: C.red, color: "#fff" }, "SELL", "tag");
    tl.fromTo(tg, { scale: 0 }, { scale: 1, rotation: -8, duration: 0.3, ease: "back.out(3)" }, 77.25 + i * 0.07);
    react.worry(w, 77.3 + i * 0.1, 1.8, { gesture: "none" });
    return w;
  });
  const gS3 = gauge(s16, "SUPPLY", { x: 40, y: 720, color: "#8A948F", start: 0.3 });
  const gD3 = gauge(s16, "DEMAND", { x: 600, y: 720, color: C.gt, start: 0.95 });
  tl.fromTo([gS3, gD3], { y: 500, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: "expo.out", stagger: 0.08 }, 78.1);
  gS3.to(0.95, 78.5, 1.0); gD3.to(0.12, 79.95, 1.0);
  tl.to(gD3.querySelector(".arc"), { stroke: C.red, duration: 0.3 }, 80.0);
  tl.to([...sellers, gS3, gD3], { y: -260, scale: 0.8, opacity: 0.0, duration: 0.35, ease: "power3.inOut" }, 81.2);
  const crash = line(s16, [[0, 0.95], [0.15, 0.82], [0.25, 0.88], [0.45, 0.45], [0.58, 0.52], [0.8, 0.12], [1, 0.03]], { x: 60, y: 460, w: 860, h: 560, color: C.red, sw: 9, grid: true, axis: ["Rs 200", "Rs 180", "Rs 160", "Rs 140"] });
  crash.draw(81.4, 1.4);
  const qd = kin(s16, "QEEMAT *NEECHE*", { y: 1090, size: 100, accent: C.red }); charsIn.drop(qd, 81.86, 0.02);
  shake(82.6, 22, 8); flash(82.6, C.red, 0.3);
  slices(84.05, "#000");

  // ═══ S17 84.05–87.95: MARKET VOLATILITY ═══════════════════════════════════
  const s17 = scene(84.05, 87.95, { push: 1.08 });
  const vc = candles(s17, { x: 50, y: 400, w: 880, h: 520, n: 28, grid: true, axis: ["168k", "166k", "164k", "162k", "160k"], trend: (p2, r) => (r() - 0.5) * 0.3 });
  gsap.set(vc, { opacity: 0.45 }); vc.grow(84.12, 0.03);
  const osc = line(s17, [[0, 0.5], [0.06, 0.6], [0.1, 0.52], [0.17, 0.7], [0.22, 0.58], [0.3, 0.34], [0.36, 0.42], [0.42, 0.3], [0.5, 0.55], [0.55, 0.5], [0.62, 0.76], [0.68, 0.62], [0.74, 0.66], [0.8, 0.4], [0.86, 0.46], [0.92, 0.3], [1, 0.5]],
    { x: 50, y: 400, w: 880, h: 520, color: C.g2, sw: 8, noise: 0.05, n: 90 });
  osc.draw(84.2, 1.6);
  const uc = el(s17, { left: 80, top: 300 }, "▲ UPAR", "chip"); tl.fromTo(uc, { scale: 0 }, { scale: 1, duration: 0.3, ease: "back.out(3)" }, 84.74);
  const nc = el(s17, { left: 690, top: 850 }, "▼ NEECHE", "chip"); nc.style.borderColor = C.red; tl.fromTo(nc, { scale: 0 }, { scale: 1, duration: 0.3, ease: "back.out(3)" }, 85.34);
  const vm = kin(s17, "MARKET", { y: 1010, size: 140 });
  const vv = kin(s17, "*VOLATILITY*", { y: 1175, size: 136 });
  charsIn.slam(vm, 86.44, 0.02); charsIn.slam(vv, 86.8, 0.02);
  glitch(86.8, 0.4); shake(86.85, 20, 8);

  // ═══ S18 87.95–94.05: not just numbers → darr, umeed, bharosa ═════════════
  const s18 = scene(87.95, 94.05, { push: 1.04 });
  const sn = kin(s18, "SIRF NUMBERS", { y: 240, size: 110 }); const sn2 = kin(s18, "*NAHI.*", { y: 370, size: 140 });
  charsIn.rise(sn, 88.02, 0.02); charsIn.rise(sn2, 88.52, 0.03);
  const wl = el(s18, { left: 120, top: 580, width: 840, height: 420, background: "#fff", borderRadius: 32, border: "2px solid #E3E9E5", boxShadow: "0 24px 50px rgba(20,40,20,.10)" });
  [["ACHAI", "200.00", 2.4, "usman"], ["PSO", "359.40", 0.06, "zara"], ["HBL", "288.00", -0.78, "ayesha"]].forEach(([sy, pr, ch, face], i) => {
    const y = 30 + i * 128;
    if (i) el(wl, { left: 30, top: y - 14, width: 780, height: 2, background: "#EEF2EF" });
    el(wl, { left: 40, top: y + 26, font: "700 44px 'IBM Plex Mono'", color: C.text }, sy);
    const fig = el(wl, { left: 300, top: y + 20, width: 500, height: 70 },
      `<span style="position:absolute;left:0;top:6px;font:600 44px 'IBM Plex Mono';color:${C.mute}">${pr}</span>
       <span style="position:absolute;right:0;top:4px;padding:6px 18px;border-radius:12px;font:700 34px 'IBM Plex Mono';background:${ch >= 0 ? "#EAF7E3" : "#FDE8EC"};color:${ch >= 0 ? C.gt : C.red}">${ch >= 0 ? "▲" : "▼"} ${Math.abs(ch).toFixed(2)}%</span>`);
    const face1 = who(wl, face, 560, y - 6, 120, { expr: "smile" });
    gsap.set(face1, { opacity: 0 });
    tl.to(fig, { opacity: 0, x: 24, duration: 0.25, ease: "power2.in" }, 88.85 + i * 0.1)
      .fromTo(face1, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.3, ease: "power2.out", immediateRender: false }, 89.0 + i * 0.1);
  });
  tl.fromTo(wl, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, ease: "power3.out" }, 88.0);
  tl.to([sn, sn2, wl], { y: -40, opacity: 0, duration: 0.25, ease: "power2.in" }, 89.1);
  const lk = kin(s18, "LAAKHON LOGON KI *SOCH*", { y: 250, size: 80 }); charsIn.words(lk, 89.36, 0.1);
  const emo = [["ayesha", "DARR", C.red, 90.95, "worry"], ["sana", "UMEED", C.gold, 91.8, "think"], ["bilal", "BHAROSA", C.g, 92.65, "joy"]];
  emo.forEach(([n, lab, col, t, kind], i) => {
    const w = who(s18, n, 10 + i * 355, 560, 360, { expr: "neutral" }); enter(w, 89.6 + i * 0.1, "pop"); life(w, 89.7, 93.9, "neutral", 14 + i);
    const L = kin(s18, lab, { x: 10 + i * 355, y: 960, w: 360, size: 56, color: col });
    charsIn.slam(L, t, 0.03);
    if (kind === "worry") react.worry(w, t, 2.2, { gesture: "none" });
    if (kind === "think") { react.think(w, t, 1.6, { gesture: "none", dots: false }); X(tl, w.av, "happy", t + 0.6); }
    if (kind === "joy") react.proud(w, t, { face: "grin", color: C.gt, gesture: "none" });
  });

  // ═══ S19 93.8–99.1: PSX = regulated marketplace ═══════════════════════════
  const s19 = scene(93.8, 99.1, { push: 1.04 });
  zoomThrough(s18, s19, 93.8);
  const lg19 = el(s19, { left: 390, top: 170, width: 300, height: 359 }, `<img src="assets/psx/psx-logo.png" style="width:100%;height:100%;object-fit:contain">`);
  tl.fromTo(lg19, { scale: 0.92, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6, ease: "power3.out" }, 93.84);
  const sh = icon(s19, "shield", 730, 300, 150, 173);
  tl.fromTo(sh, { scale: 1.3, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, ease: "power3.out" }, 94.8);
  const rg = kin(s19, "*REGULATED*", { y: 570, size: 116 }); charsIn.rise(rg, 94.82, 0.02);
  const mp = kin(s19, "MARKETPLACE", { y: 700, size: 100 }); charsIn.rise(mp, 95.3, 0.025);
  // the trading floor: buyers on the left pay money, sellers on the right hand over shares, PSX in between
  const buyer = who(s19, "bilal", 10, 960, 330, { expr: "happy" });
  const seller = who(s19, "sana", 740, 960, 330, { expr: "happy" });
  const lb = kin(s19, "BUYER", { x: 10, y: 1300, w: 330, size: 40, color: C.gt, font: "Manrope" });
  const ls = kin(s19, "SELLER", { x: 740, y: 1300, w: 330, size: 40, color: C.mute, font: "Manrope" });
  tl.fromTo([buyer, seller], { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.45, ease: "power3.out", stagger: 0.1 }, 96.0);
  tl.fromTo([lb, ls], { opacity: 0 }, { opacity: 1, duration: 0.3 }, 96.3);
  const hub = el(s19, { left: 470, top: 1092, width: 140, height: 64, borderRadius: 32, background: C.ink, color: "#fff", font: "800 32px/64px Manrope", textAlign: "center", letterSpacing: ".06em" }, "PSX");
  tl.fromTo(hub, { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.35, ease: "power3.out" }, 96.2);
  const lane = (y, col) => { const l = el(s19, { left: 330, top: y, width: 420, height: 4, borderRadius: 2, background: col, opacity: 0.25 }); tl.fromTo(l, { scaleX: 0 }, { scaleX: 1, duration: 0.4, ease: "power2.out" }, 96.3); };
  lane(1034, C.gold); lane(1214, C.g2);
  [96.6, 97.35, 98.1].forEach((tt) => {
    const cn = icon(s19, "coin", 330, 1000, 70, 70);                     // money → seller (top lane)
    gsap.set(cn, { opacity: 0 });
    tl.fromTo(cn, { x: 0, opacity: 0 }, { x: 350, opacity: 1, duration: 0.7, ease: "power1.inOut", immediateRender: false }, tt)
      .to(cn, { opacity: 0, duration: 0.12 }, tt + 0.62);
    const tk = icon(s19, "ticket", 630, 1180, 120, 70, "SHARE");           // shares → buyer (bottom lane)
    gsap.set(tk, { opacity: 0 });
    tl.fromTo(tk, { x: 0, opacity: 0 }, { x: -300, opacity: 1, duration: 0.7, ease: "power1.inOut", immediateRender: false }, tt + 0.1)
      .to(tk, { opacity: 0, duration: 0.12 }, tt + 0.72);
  });
  wipe(99.1);

  // ═══ S20 99.1–114: CTA → FloStocks logo → disclaimer ══════════════════════
  const s20 = scene(99.1, 114, { push: false });
  const c1 = kin(s20, "PSX KO", { y: 540, size: 110, color: C.mute });
  const c2 = kin(s20, "*AASAAN*", { y: 680, size: 200 });
  const c3 = kin(s20, "ZUBAAN MEIN", { y: 900, size: 150 });
  charsIn.rise(c1, 100.08); charsIn.slam(c2, 100.74, 0.03); charsIn.flip(c3, 101.04, 0.03);
  punch(100.74, 1.06, 0.3); camReset(102.2, 0.3);
  tl.to([c1, c2, c3], { y: -40, opacity: 0, duration: 0.3, ease: "power2.in", stagger: 0.03 }, 102.0);
  const fl = el(s20, { left: 90, top: 470, width: 900, height: 300, transformOrigin: "96px 123px" }, `<img src="assets/logos/flostocks-logo-full.png" style="width:100%;height:100%;object-fit:contain">`);
  gsap.set(fl, { autoAlpha: 0 });
  // icon only (left 20% of the lockup), centred and enlarged
  tl.set(fl, { autoAlpha: 1, x: 354, scale: 2.1, clipPath: "inset(0% 79.9% 0% 0%)" }, 102.42)
    .fromTo(fl, { opacity: 0, scale: 1.7 }, { opacity: 1, scale: 2.1, duration: 0.5, ease: "power3.out", immediateRender: false }, 102.42)
    // glide left + shrink while the wordmark unrolls beside it
    .to(fl, { x: 0, scale: 1, clipPath: "inset(0% 0% 0% 0%)", duration: 0.9, ease: "power3.inOut" }, 102.95);
  const gl = el(s20, { left: 90, top: 470, width: 900, height: 300, overflow: "hidden",
    webkitMask: "url(assets/logos/flostocks-logo-full.png) center / contain no-repeat", mask: "url(assets/logos/flostocks-logo-full.png) center / contain no-repeat" },
    `<i style="position:absolute;top:-40%;left:0;width:140px;height:180%;background:linear-gradient(90deg,rgba(255,255,255,0),rgba(255,255,255,.9),rgba(255,255,255,0))"></i>`);
  tl.fromTo(gl.firstChild, { xPercent: -150, skewX: -20 }, { xPercent: 800, duration: 0.8, ease: "power2.inOut" }, 103.9);
  const fol = el(s20, { left: 190, top: 810, width: 700, height: 116, background: C.g, borderRadius: 58, font: "800 52px/116px Manrope", whiteSpace: "nowrap", textAlign: "center", color: C.ink, boxShadow: `0 0 50px ${C.g}66` }, "FOLLOW FLOSTOCKS");
  tl.fromTo(fol, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, ease: "power3.out" }, 103.9);
  const mk = kin(s20, "MUSHKIL NAHI,", { y: 990, size: 84, color: C.mute }); charsIn.rise(mk, 105.2);
  const strike = el(s20, { left: 285, top: 1035, width: 380, height: 10, background: C.red, transformOrigin: "0% 50%" });
  tl.fromTo(strike, { scaleX: 0 }, { scaleX: 1, duration: 0.25, ease: "power3.out" }, 105.62);
  const simp = kin(s20, "*SIMPLE.*", { y: 1120, size: 180 }); charsIn.slam(simp, 106.42, 0.04); punch(106.42, 1.04, 0.3);
  camReset(107.6, 0.4);
  tl.to([mk, strike, simp], { opacity: 0, y: -40, duration: 0.35, ease: "power2.in" }, 108.1);
  const disc = el(s20, { left: 100, top: 1000, width: 880, padding: "26px 30px", borderTop: `4px solid ${C.g}`, font: "500 31px/1.5 Inter", color: "#3F4A44", textAlign: "center" },
    `<div style="font:800 26px Manrope;letter-spacing:.16em;color:${C.g};margin-bottom:10px">DISCLAIMER</div>Trading and investing in the PSX involve market risks, price fluctuations, and potential financial losses. Past performance does not guarantee future results. Learn the risks before you trade.`);
  tl.fromTo(disc, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: "power2.out" }, 108.45);
  tl.to(fl, { scale: 1.03, duration: 5.4, ease: "none" }, 108.5);

  // subtitle pills removed (client): the on-screen kinetic titles carry the words
  document.getElementById("caps").style.display = "none";

  K.linkScenes();

  // overlap-audit tags: solid graphics the layout checker treats as boxes that must not collide
  [band, logo, card, lg6, board, bub, A9.phone, pc, A11.phone, ph, gD, gD2, gS, alert, pcard, gS3, gD3, lg19, sh, fl, wl, hub]
    .forEach((e) => e && e.setAttribute("data-ov", ""));
  tl.seek(0);
})();
