// "What is PSX" — FloStocks, 9:16, 114 s. Every cue is the VO word time (edit/vo.words.json).
(function () {
  const { C, tl, stage, el, scene, who, words, reveal, hideWords, slab, slabIn, slabOut, pop, popOut, rise, slideIn,
          counter, pk, en, icon, chart, meter, wipe, whip, zoomThrough, pushUp, glitch, shake } = K;
  const X = CAST.expr, Gs = CAST.gesture;
  const life = (w, t0, t1, face = "smile", seed = 1) => { CAST.blinks(tl, w.av, t0, t1, face, seed); CAST.bob(tl, w.av, t0, t1, 5); };

  // ambient brand bars drifting behind everything
  const amb = el(stage, { left: 0, top: 0, width: 1080, height: 1920, zIndex: 0 });
  [[-120, 1500, 180, C.wash], [880, -200, 160, C.wash], [960, 1320, 110, "#E8F6E1"]].forEach(([x, y, w, c], i) => {
    const b = el(amb, { left: x, top: y, width: w, height: 760, background: c, borderRadius: 30 });
    gsap.set(b, { skewX: -16 });
    tl.fromTo(b, { y: 0 }, { y: i % 2 ? 120 : -120, duration: 114, ease: "none" }, 0);
  });

  // ── S1 hook 0–5.35: PSX everywhere, market up / down ───────────────────────
  const s1 = scene(0, 5.35);
  const aap1 = who(s1, "aap", 250, 640, 580, { expr: "think", gesture: "handPhone" });
  pop(aap1, 0.0, 0.5, 0.7); life(aap1, 0, 5.3, "think", 2);
  const chips = [["PSX", 70, 560, -8], ["KSE-100", 700, 600, 7], ["Shares", 40, 1080, 6], ["Market", 720, 1060, -6]].map(([t, x, y, r]) => {
    const c = el(s1, { left: x, top: y }, t, "chip"); gsap.set(c, { rotation: r }); return c; });
  chips.forEach((c, i) => pop(c, 0.1 + i * 0.28, 0.4));
  const t1 = words(s1, "PSX", { y: 250, size: 250, track: -0.04 });
  gsap.set(t1, { color: C.ink }); reveal(t1, 1.18, { dur: 0.35 });
  tl.fromTo(t1, { scale: 1.6 }, { scale: 1, duration: 0.45, ease: "expo.out" }, 1.18);
  const ul1 = el(s1, { left: 330, top: 530, width: 420, height: 26, background: C.g, borderRadius: 13 });
  tl.fromTo(ul1, { scaleX: 0 }, { scaleX: 1, duration: 0.4, ease: "expo.out" }, 1.4);
  X(tl, aap1.av, "wow", 1.2);
  // market up / down
  tl.to([...chips, t1, ul1], { opacity: 0, y: -40, duration: 0.25, stagger: 0.02, ease: "power2.in" }, 3.0);
  const up = chart(s1, [[0, 0.1], [0.25, 0.35], [0.4, 0.3], [0.6, 0.65], [0.75, 0.6], [1, 0.95]], { x: 90, y: 300, w: 900, h: 380, color: C.g, sw: 16 });
  up.draw(3.2, 0.9);
  const sUp = slab(s1, "MARKET UPAR ▲", { y: 1170, size: 70, center: true, bg: C.g }); sUp.style.setProperty("--w", "700px"); slabIn(sUp, 3.28);
  X(tl, aap1.av, "happy", 3.3); Gs(tl, aap1.av, "pointLongArm", 3.3);
  tl.to(up.path, { stroke: C.red, duration: 0.15 }, 4.25);
  tl.to(up, { rotation: 0, scaleY: -1, duration: 0.35, ease: "power3.inOut", transformOrigin: "50% 50%" }, 4.28);
  slabOut(sUp, 4.22);
  const sDn = slab(s1, "MARKET NEECHE ▼", { y: 1170, size: 70, center: true, bg: C.red, color: "#fff" }); sDn.style.setProperty("--w", "760px"); slabIn(sDn, 4.3);
  X(tl, aap1.av, "shocked", 4.4); Gs(tl, aap1.av, "handPhone", 4.4);

  // ── S2 5.35–8.45: "Lekin akhir ye sab hai kia? Main samjhata hoon!" ────────
  const s2 = scene(5.35, 8.45);
  whip(s1, s2, 5.35);
  const q1 = words(s2, "Lekin akhir", { y: 300, size: 64, weight: 600, color: C.g3 });
  const q2 = words(s2, "YE SAB HAI | KIA?", { y: 380, size: 128, hl: { "KIA?": C.g3 } });
  reveal(q1, 5.46); reveal(q2, 5.96, { stagger: 0.09 });
  const aap2 = who(s2, "aap", 300, 760, 480, { expr: "think", gesture: "none" }); rise(aap2, 5.4); life(aap2, 5.4, 8.4, "think", 3);
  const qm = ["?", "?", "?"].map((m, i) => el(s2, { left: 330 + i * 150, top: 700 - (i % 2) * 50, font: "800 110px Manrope", color: C.g }, m));
  qm.forEach((m, i) => { pop(m, 6.5 + i * 0.1, 0.35); tl.to(m, { y: -16, duration: 0.4, yoyo: true, repeat: 2, ease: "sine.inOut" }, 6.9 + i * 0.08); });
  // answer: kinetic + lightbulb, no narrator on screen
  tl.to([q1, q2, ...qm], { opacity: 0, y: -30, duration: 0.22, ease: "power2.in" }, 7.12);
  const bulb = el(s2, { left: 420, top: 230, width: 240, height: 300 }, `<svg viewBox="0 0 240 300"><path d="M120,20 a90,90 0 0 1 56,160 v38 h-112 v-38 a90,90 0 0 1 56,-160Z" fill="${C.g}" stroke="${C.ink}" stroke-width="8"/><path d="M78,240 h84 M86,268 h68" stroke="${C.ink}" stroke-width="8" stroke-linecap="round"/><path d="M120,0 v-0 M30,40 l-22,-18 M210,40 l22,-18 M0,120 h-26 M240,120 h26" stroke="${C.ink}" stroke-width="8" stroke-linecap="round"/></svg>`, "icon");
  pop(bulb, 7.28, 0.45); tl.fromTo(bulb, { rotation: -10 }, { rotation: 6, duration: 0.3, yoyo: true, repeat: 1, ease: "sine.inOut" }, 7.6);
  const ans = slab(s2, "MAIN SAMJHATA HOON!", { y: 580, size: 74, center: true, bg: C.g }); ans.style.setProperty("--w", "860px"); slabIn(ans, 7.38);
  X(tl, aap2.av, "happy", 7.5); Gs(tl, aap2.av, "ok", 7.6);
  wipe(8.45);

  // ── S3 8.45–14.7: Ahmed's chai dhaaba, queue every day ───────────────────
  const s3 = scene(8.45, 14.7);
  const t3a = words(s3, "Ahmed ka", { y: 250, size: 62, weight: 600, color: C.g3 });
  const t3b = words(s3, "CHAI DHAABA", { y: 320, size: 120 });
  reveal(t3a, 9.45); reveal(t3b, 10.1, { stagger: 0.1 });
  const stall = el(s3, { left: 140, top: 560, width: 800, height: 640 });
  icon(stall, "stall", 0, 0, 800, 640, "AHMED CHAI", "back");
  const ahmed3 = who(stall, "ahmed", 200, 190, 400, { expr: "smile", gesture: "none" });
  const stallBack = icon(stall, "stall", 0, 0, 800, 640, "AHMED CHAI", "front");   // sign, awning, counter, cups in front of Ahmed
  stallBack.setAttribute("data-layout-allow-occlusion", "");
  tl.fromTo(stall, { y: 900 }, { y: 0, duration: 0.6, ease: "expo.out" }, 8.5);
  tl.fromTo(stallBack.querySelector(".awning"), { y: -260, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: "bounce.out" }, 8.75);
  tl.fromTo(ahmed3, { y: 200, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, ease: "back.out(1.6)" }, 9.45);
  Gs(tl, ahmed3.av, "waveLongArm", 9.5); X(tl, ahmed3.av, "grin", 9.5); Gs(tl, ahmed3.av, "hand", 10.7); X(tl, ahmed3.av, "smile", 10.7);
  life(ahmed3, 9.5, 14.6, "smile", 4);
  stallBack.querySelectorAll(".steam").forEach((p, i) => tl.fromTo(p, { y: 0, opacity: 0.9 }, { y: -22, opacity: 0, duration: 0.9, repeat: 5, ease: "none" }, 8.6 + i * 0.3));
  // zabardast
  hideWords(t3a, 11.15); hideWords(t3b, 11.2);
  const zab = slab(s3, "ZABARDAST CHAI ✦", { y: 300, size: 80, center: true, bg: C.g }); zab.style.setProperty("--w", "820px"); slabIn(zab, 11.6);
  [[150, 520], [860, 560], [800, 420], [220, 400]].forEach(([x, y], i) => { const st = el(s3, { left: x, top: y, font: "800 70px Manrope", color: C.gold }, "✦"); pop(st, 12.1 + i * 0.08, 0.35); tl.to(st, { rotation: 180, duration: 2, ease: "none" }, 12.1); });
  X(tl, ahmed3.av, "happy", 12.1);
  // queue
  slabOut(zab, 12.85);
  const t3c = words(s3, "ROZANA LINE!", { y: 300, size: 118, hl: { "LINE!": C.g3 } }); reveal(t3c, 13.2);
  tl.to(stall, { x: -170, scale: 0.78, duration: 0.5, ease: "power3.inOut", transformOrigin: "0% 100%" }, 12.9);
  ["sana", "bilal", "ayesha", "usman"].forEach((n, i) => {
    const q = who(s3, n, 460 + i * 115, 870 + (i % 2) * 20, 250, { expr: i % 2 ? "happy" : "smile" });
    tl.fromTo(q, { x: 700, opacity: 0 }, { x: 0, opacity: 1, duration: 0.5, ease: "expo.out" }, 12.95 + i * 0.12);
    tl.to(q, { y: -10, duration: 0.25, yoyo: true, repeat: 3, ease: "sine.inOut" }, 13.6 + i * 0.1);
  });

  // ── S4 14.7–20.2: dream of 5 dhaabe, but no money ──────────────────────────
  const s4 = scene(14.7, 20.45);
  zoomThrough(s3, s4, 14.7);
  const ahmed4 = who(s4, "ahmed", 30, 900, 470, { expr: "think", gesture: "none" }); life(ahmed4, 14.7, 20.1, "think", 5);
  const cloud = icon(s4, "cloud", 230, 250, 800, 548);
  tl.fromTo(cloud, { scale: 0.2, opacity: 0, transformOrigin: "10% 95%" }, { scale: 1, opacity: 1, duration: 0.55, ease: "back.out(1.5)" }, 14.95);
  const city = icon(cloud, "city", 120, 120, 560, 240);
  rise(city, 15.6, 60);
  const minis = [0, 1, 2, 3, 4].map((i) => icon(cloud, "miniStall", 120 + i * 108, 300, 104, 94));
  minis.forEach((m, i) => pop(m, 16.18 + i * 0.12, 0.38));
  const x5 = el(s4, { left: 840, top: 230, width: 170, height: 170, background: C.g, borderRadius: 85, font: "800 76px/170px Manrope", textAlign: "center", color: C.ink }, "×5");
  pop(x5, 16.5, 0.45);
  const t4 = words(s4, "SHEHAR MEIN | 5 DHAABE", { y: 1090, size: 84, x: 480, w: 560, align: "left", hl: { "5": C.g3, DHAABE: C.g3 } });
  reveal(t4, 15.8);
  X(tl, ahmed4.av, "happy", 16.2);
  // no money
  tl.to([cloud, x5], { scale: 0, opacity: 0, duration: 0.3, ease: "back.in(1.6)" }, 17.75);
  hideWords(t4, 17.75);
  const wal = icon(s4, "wallet", 470, 380, 520, 371);
  pop(wal, 18.0, 0.5);
  tl.fromTo(wal.querySelector(".moth"), { y: 0, x: 0 }, { y: -160, x: 60, duration: 1.4, ease: "sine.out" }, 18.3);
  const rs0 = el(s4, { left: 470, top: 800, width: 520, textAlign: "center", font: "600 130px 'IBM Plex Mono'", color: C.red }, "Rs 0");
  pop(rs0, 18.56, 0.4);
  const t4b = words(s4, "PAISAY? | BILKUL NAHI.", { y: 1000, size: 76, x: 470, w: 560, align: "center", hl: { "NAHI.": C.red } });
  reveal(t4b, 18.9);
  X(tl, ahmed4.av, "worried", 18.0); X(tl, ahmed4.av, "shocked", 19.0);

  // ── S5 20.2–24.05: sell the dhaaba to the public, piece by piece ─────────────
  const s5 = scene(19.99, 24.05);
  pushUp(s4, s5, 20.2);
  const t5a = words(s5, "THORA THORA", { y: 260, size: 120, hl: {} });
  const t5b = words(s5, "public ko becho", { y: 410, size: 64, weight: 600, color: C.g3 });
  reveal(t5b, 21.3); reveal(t5a, 22.8, { stagger: 0.12 });
  const tiles = el(s5, { left: 240, top: 560, width: 600, height: 480 });
  const TW = 150, TH = 160, tileEls = [];
  for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) {
    const t = el(tiles, { left: c * TW, top: r * TH, width: TW, height: TH, overflow: "hidden" });
    t.innerHTML = `<div style="position:absolute;left:${-c * TW}px;top:${-r * TH}px;width:600px;height:480px">${K.ICON.stall()}</div>`;
    t.firstChild.firstChild.setAttribute("width", "600"); t.firstChild.firstChild.setAttribute("height", "480");
    tileEls.push(t);
  }
  pop(tiles, 20.4, 0.5, 0.7);
  tl.to(tileEls, { scale: 0.92, borderRadius: 18, outline: "6px solid " + C.g3, duration: 0.3, ease: "power2.out", stagger: 0.02 }, 22.2);
  const crowd5 = ["sana", "bilal", "ayesha", "usman", "zara", "aap"].map((n, i) => {
    const w = who(s5, n, 20 + i * 172, 1110, 210, { expr: "happy" }); pop(w, 21.9 + i * 0.07, 0.4); return w; });
  tileEls.forEach((t, i) => {
    const target = crowd5[i % 6];
    const dx = (20 + (i % 6) * 172 + 50) - (240 + (i % 4) * TW), dy = 1080 - (560 + Math.floor(i / 4) * TH);
    tl.to(t, { x: dx, y: dy, scale: 0.42, rotation: (i % 2 ? 12 : -12), duration: 0.6, ease: "power3.inOut" }, 22.82 + i * 0.05);
  });
  wipe(24.05);

  // ── S6 24.05–29.9: listed on PSX, 1,000 shares, Rs 100 each ─────────────────
  const s6 = scene(24.05, 29.9);
  const board = el(s6, { left: 70, top: 250, width: 940, height: 330, background: C.ink, borderRadius: 34 });
  const bTitle = el(board, { left: 44, top: 34, font: "800 64px Manrope", color: "#fff" }, `PSX <span style="font-size:34px;color:${C.g};letter-spacing:.08em;margin-left:12px">NEW LISTING</span>`);
  const bRow = el(board, { left: 44, top: 140, width: 852, height: 150, background: "#151C24", borderRadius: 22 },
    `<div class="abs" style="left:30px;top:24px;font:800 48px Manrope;color:#fff">Ahmed Chai</div><div class="abs mono" style="left:30px;top:88px;font-size:34px;color:${C.g}">ACHAI</div>`);
  pop(board, 24.15, 0.5, 0.8); rise(bRow, 24.5, 40);
  const stamp = el(board, { left: 600, top: 150, width: 260, height: 120, border: `8px solid ${C.g}`, borderRadius: 18, font: "800 50px/104px Manrope", color: C.g, textAlign: "center" }, "LISTED ✓");
  tl.fromTo(stamp, { scale: 2.4, rotation: -14, opacity: 0 }, { scale: 1, rotation: -8, opacity: 1, duration: 0.3, ease: "power4.in" }, 25.25);
  shake(25.55, 10);
  // 1,000 shares grid
  const grid = el(s6, { left: 140, top: 640, width: 800, height: 500 });
  let gh = "";
  for (let i = 0; i < 1000; i++) gh += `<i style="position:absolute;left:${(i % 40) * 20}px;top:${Math.floor(i / 40) * 20}px;width:15px;height:15px;border-radius:4px;background:${C.g}"></i>`;
  grid.innerHTML = gh;
  tl.fromTo(grid.children, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.18, ease: "back.out(2)", stagger: { each: 0.0009, from: "start" } }, 26.2);
  const cnt = el(s6, { left: 0, top: 1170, width: 1080, textAlign: "center", font: "600 92px 'IBM Plex Mono'", color: C.ink }, "0");
  rise(cnt, 26.2, 30, 0.3);
  counter(cnt, 0, 1000, 26.22, 1.0, (v) => en(v) + " SHARES");
  // one share = Rs 100
  tl.to(grid, { opacity: 0.25, duration: 0.3 }, 28.0);
  const tk = icon(s6, "ticket", 300, 760, 480, 280, "1 SHARE");
  pop(tk, 28.05, 0.5);
  const price = el(s6, { left: 0, top: 1170, width: 1080, textAlign: "center", font: "600 92px 'IBM Plex Mono'", color: C.g3 }, "= Rs 100");
  tl.to(cnt, { opacity: 0, y: -40, duration: 0.2 }, 28.9); rise(price, 29.25, 40, 0.35);

  // ── S7 29.9–34.85: 1 lakh from the market, no bank ─────────────────────────
  const s7 = scene(29.9, 34.85);
  zoomThrough(s6, s7, 29.9);
  const eq1 = el(s7, { left: 0, top: 260, width: 1080, textAlign: "center", font: "600 74px 'IBM Plex Mono'", color: C.ink },
    `1,000 <span style="color:#5E6863">×</span> Rs 100`);
  rise(eq1, 30.0, 40);
  const eq2 = el(s7, { left: 0, top: 380, width: 1080, textAlign: "center", font: "600 132px 'IBM Plex Mono'", color: C.g3 }, "Rs 0");
  pop(eq2, 32.25, 0.35, 0.7);
  counter(eq2, 0, 100000, 32.3, 0.65, (v) => "Rs " + pk(v));
  const lakh = slab(s7, "1 LAKH RUPAY", { y: 560, size: 70, center: true, bg: C.g }); lakh.style.setProperty("--w", "600px"); slabIn(lakh, 32.62);
  const ahmed7 = who(s7, "ahmed", 40, 760, 520, { expr: "smile", gesture: "hand" }); rise(ahmed7, 30.1); life(ahmed7, 30.1, 34.8, "smile", 6);
  X(tl, ahmed7.av, "grin", 32.4); Gs(tl, ahmed7.av, "ok", 32.4);
  for (let i = 0; i < 9; i++) {
    const cn = icon(s7, "coin", 180 + (i * 97) % 760, 1300, 90, 90);
    tl.fromTo(cn, { y: 0, opacity: 0 }, { y: -600 - (i % 3) * 120, x: (i % 2 ? 60 : -60), rotation: 360, opacity: 1, duration: 0.9, ease: "power2.out" }, 32.4 + i * 0.04)
      .to(cn, { opacity: 0, duration: 0.25 }, 33.2 + i * 0.03);
  }
  const bank = icon(s7, "bank", 640, 860, 330, 293);
  rise(bank, 33.3, 60, 0.4);
  const xx = el(s7, { left: 610, top: 830, width: 390, height: 360 }, `<svg viewBox="0 0 390 360"><path d="M40,40 L350,320 M350,40 L40,320" stroke="${C.red}" stroke-width="30" stroke-linecap="round"/></svg>`, "icon");
  tl.fromTo(xx, { scale: 1.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.25, ease: "power4.in" }, 34.0);
  const nb = el(s7, { left: 650, top: 770, background: C.red, color: "#fff", borderRadius: 14, padding: "6px 18px", font: "800 40px Manrope", border: `5px solid ${C.ink}` }, "BINA BANK KE");
  tl.fromTo(nb, { scale: 0.5, opacity: 0, rotation: -6 }, { scale: 1, opacity: 1, rotation: -4, duration: 0.4, ease: "back.out(2)" }, 33.32);

  // ── S8 34.85–39.35: people get hissay = shares ─────────────────────────────
  const s8 = scene(34.85, 39.35);
  whip(s7, s8, 34.85);
  const st8 = icon(s8, "miniStall", 390, 240, 300, 270);
  pop(st8, 34.95, 0.45);
  const ppl = ["sana", "bilal", "ayesha", "usman"].map((n, i) => {
    const w = who(s8, n, 10 + i * 262, 760, 300, { expr: "smile" }); pop(w, 35.05 + i * 0.1, 0.45); life(w, 35, 39.3, "smile", 7 + i); return w; });
  ppl.forEach((w, i) => {
    const tk8 = icon(s8, "ticket", 470, 400, 150, 88, "SHARE");
    tl.fromTo(tk8, { x: 0, y: 0, scale: 0.4, opacity: 0 }, { x: (10 + i * 262 + 80) - 470, y: 700 - 400, scale: 1, rotation: i % 2 ? 10 : -10, opacity: 1, duration: 0.6, ease: "power3.out" }, 36.4 + i * 0.18);
    X(tl, w.av, "happy", 36.9 + i * 0.18);
  });
  const h8a = words(s8, "HISSAY", { y: 1160, size: 110, x: 0, w: 1080 });
  reveal(h8a, 37.3);
  const h8b = slab(s8, "= SHARES", { y: 1290, size: 78, center: true, bg: C.g }); h8b.style.setProperty("--w", "460px"); slabIn(h8b, 38.3);

  // ── S9 39.35–45.25: Aap: "kamaal!" → buys 5 shares for Rs 500 ───────────────
  const s9 = scene(39.35, 45.25);
  zoomThrough(s8, s9, 39.35);
  const aap9 = who(s9, "aap", 40, 700, 600, { expr: "smile", gesture: "none" }); life(aap9, 39.4, 45.2, "smile", 9);
  rise(aap9, 39.4);
  const bub = el(s9, { left: 80, top: 250, width: 920, height: 330 }, K.ICON.bubble(), "icon");
  const bubT = words(bub, "\"Yaar, Ahmed ki chai toh | KAMAAL hai!\"", { x: 40, y: 50, w: 840, size: 62, weight: 700, hl: { KAMAAL: C.g3 } });
  pop(bub, 40.2, 0.45, 0.6); reveal(bubT, 40.35, { stagger: 0.07 });
  CAST.talk(tl, aap9.av, [40.26, 40.44, 40.74, 40.9, 41.16, 41.64], "happy"); Gs(tl, aap9.av, "waveOkLongArms", 41.6);
  // portfolio card
  popOut(bub, 42.4);
  const pf = el(s9, { left: 560, top: 300, width: 470, height: 560 }, "", "card");
  el(pf, { left: 0, top: 0, width: 456, height: 90, background: C.g, borderRadius: "26px 26px 0 0", font: "800 40px/90px Manrope", textAlign: "center", color: C.ink }, "Aap ka portfolio");
  el(pf, { left: 30, top: 120, font: "800 40px Manrope", color: C.ink }, "Ahmed Chai");
  const pfN = el(pf, { left: 30, top: 180, font: "600 62px 'IBM Plex Mono'", color: C.g3 }, "0 shares");
  pop(pf, 42.5, 0.5, 0.7);
  for (let i = 0; i < 5; i++) {
    const tk9 = icon(s9, "ticket", 160 + i * 70, 1300, 160, 94, "SHARE");
    tl.fromTo(tk9, { x: 0, y: 0, opacity: 0, rotation: -20 }, { x: 560 + 150 - (160 + i * 70), y: 300 + 250 - 1300, opacity: 1, rotation: 0, duration: 0.5, ease: "power3.inOut" }, 42.8 + i * 0.12)
      .to(tk9, { scale: 0.3, opacity: 0, duration: 0.15 }, 43.3 + i * 0.12);
  }
  counter(pfN, 0, 5, 42.85, 0.7, (v) => Math.round(v) + " shares");
  const pfM = el(pf, { left: 30, top: 300, width: 400, font: "600 44px/1.5 'IBM Plex Mono'", color: C.ink }, "5 × Rs 100<br><b style='color:#1F7A00;font-size:64px'>= Rs 500</b>");
  rise(pfM, 44.0, 30, 0.4);
  X(tl, aap9.av, "grin", 43.1); Gs(tl, aap9.av, "ok", 44.0);
  wipe(45.25);

  // ── S10 45.25–50.75: 6 months later, 5 dhaabe, price 200 ───────────────────
  const s10 = scene(45.25, 50.75);
  const cal = icon(s10, "calendar", 360, 230, 360, 380);
  const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN"];
  const mEl = el(cal, { left: 0, top: 150, width: 360, textAlign: "center", font: "800 110px Manrope", color: C.ink }, "JAN");
  pop(cal, 45.3, 0.4);
  months.forEach((m, i) => tl.set(mEl, { innerHTML: m }, 45.4 + i * 0.1));
  tl.fromTo(mEl, { rotationX: 0 }, { rotationX: 360 * 3, duration: 0.6, ease: "power2.inOut" }, 45.4);
  const m6 = slab(s10, "6 MAHINE BAAD", { y: 640, size: 66, center: true, bg: C.g }); m6.style.setProperty("--w", "600px"); slabIn(m6, 45.6);
  tl.to([cal, m6], { y: -150, scale: 0.7, duration: 0.45, ease: "power3.inOut", transformOrigin: "50% 0%" }, 46.3);
  const row5 = [0, 1, 2, 3, 4].map((i) => icon(s10, "miniStall", 30 + i * 206, 640, 200, 180));
  row5.forEach((m, i) => pop(m, 46.56 + i * 0.13, 0.4));
  const pc = el(s10, { left: 70, top: 880, width: 940, height: 470 }, "", "card");
  const prLab = el(pc, { left: 40, top: 30, font: "800 38px Manrope", color: C.ink }, "ACHAI share price");
  const prV = el(pc, { left: 40, top: 86, font: "600 92px 'IBM Plex Mono'", color: C.ink }, "Rs 100");
  const prB = el(pc, { left: 600, top: 100, width: 280, height: 80, background: C.g, borderRadius: 40, font: "800 44px/80px Manrope", textAlign: "center", color: C.ink }, "▲ 100%");
  const pch = chart(pc, [[0, 0.05], [0.2, 0.15], [0.35, 0.12], [0.55, 0.45], [0.7, 0.4], [0.85, 0.75], [1, 0.95]], { x: 40, y: 210, w: 850, h: 220, color: C.g, sw: 14 });
  rise(pc, 48.3, 60, 0.45); pch.draw(48.4, 1.4);
  counter(prV, 100, 200, 48.8, 1.0, (v) => "Rs " + Math.round(v));
  tl.to(prV, { color: C.g3, duration: 0.2 }, 49.7); pop(prB, 49.75, 0.4);

  // ── S11 50.75–54.95: your 500 becomes 1,000 at home ────────────────────────
  const s11 = scene(50.75, 54.95);
  whip(s10, s11, 50.75);
  const sofa = icon(s11, "sofa", 140, 1010, 800, 300);
  const aap11 = who(s11, "aap", 300, 640, 480, { expr: "happy", gesture: "handPhone" });
  rise(sofa, 50.85, 80); rise(aap11, 50.95, 80); life(aap11, 51, 54.9, "happy", 11);
  const gb = slab(s11, "GHAR BAITHE BAITHE", { y: 560, size: 58, center: true, bg: C.wash }); gb.style.setProperty("--w", "700px"); slabIn(gb, 51.86);
  const mon = el(s11, { left: 0, top: 260, width: 1080, textAlign: "center", font: "600 150px 'IBM Plex Mono'", color: C.ink }, "Rs 500");
  pop(mon, 51.4, 0.4, 0.7);
  counter(mon, 500, 1000, 52.8, 0.7, (v) => "Rs " + en(v));
  tl.to(mon, { color: C.g3, duration: 0.2 }, 53.44);
  const x2 = el(s11, { left: 860, top: 200, width: 170, height: 170, background: C.g, borderRadius: 85, font: "800 70px/170px Manrope", textAlign: "center", color: C.ink }, "×2");
  pop(x2, 53.5, 0.45);
  X(tl, aap11.av, "wow", 53.4); Gs(tl, aap11.av, "waveOkLongArms", 53.5);
  for (let i = 0; i < 10; i++) {
    const cn = icon(s11, "coin", 60 + i * 100, -120, 90, 90);
    tl.fromTo(cn, { y: 0 }, { y: 1200 + (i % 3) * 200, rotation: 540, duration: 1.3, ease: "power1.in" }, 53.45 + (i % 5) * 0.08);
  }
  wipe(54.95);

  // ── S12 54.95–57.4: why did the price go up? ───────────────────────────────
  const s12 = scene(54.95, 57.4);
  const bigQ = el(s12, { left: 0, top: 400, width: 1080, textAlign: "center", font: "800 480px/1 Manrope", color: C.g, webkitTextStroke: "10px " + C.ink }, "?");
  pop(bigQ, 55.1, 0.5, 0.3); tl.to(bigQ, { rotation: 8, duration: 0.3, yoyo: true, repeat: 5, ease: "sine.inOut" }, 55.6);
  const t12a = words(s12, "Lekin sawal ye hai", { y: 280, size: 62, weight: 600, color: C.g3 });
  const t12b = words(s12, "QEEMAT | KYUN BADHI?", { y: 990, size: 110, hl: { "BADHI?": C.g3 } });
  reveal(t12a, 55.0); reveal(t12b, 56.2, { stagger: 0.08 });

  // ── S13 57.4–64.95: good news → everyone buys → demand up ───────────────────
  const s13 = scene(57.4, 65.2);
  tl.to(s12, { scale: 0.85, opacity: 0, duration: 0.25, ease: "power2.in" }, 57.15);
  const ph = el(s13, { left: 290, top: 240, width: 500, height: 800 }, K.ICON.phone(), "icon");
  const post = el(ph, { left: 54, top: 120, width: 392, height: 560 },
    `<div class="abs" style="left:0;top:0;width:392px;font:800 30px Manrope;color:${C.g3}">BUSINESS NEWS</div>
     <div class="abs" style="left:0;top:50px;width:392px;font:800 46px/1.15 Manrope;color:${C.ink}">Ahmed Chai ab 5 jagah!</div>`);
  const bars = [0.3, 0.45, 0.6, 0.8, 1].map((h, i) => el(post, { left: 20 + i * 74, top: 520 - h * 300, width: 54, height: h * 300, background: i === 4 ? C.g : C.wash, border: `5px solid ${C.ink}`, borderRadius: 10 }));
  rise(ph, 57.45, 120, 0.5);
  tl.fromTo(bars, { scaleY: 0, transformOrigin: "50% 100%" }, { scaleY: 1, duration: 0.5, ease: "back.out(1.6)", stagger: 0.08 }, 58.2);
  const t13 = words(s13, "BUSINESS ACHI | TARAF JA RAHA HAI", { y: 1100, size: 66, hl: { ACHI: C.g3 } }); reveal(t13, 59.4);
  // rush to buy
  tl.to(ph, { x: 280, y: -60, scale: 0.55, duration: 0.5, ease: "power3.inOut", transformOrigin: "50% 0%" }, 61.0);
  hideWords(t13, 61.0);
  const buyers = ["sana", "bilal", "ayesha", "usman", "zara", "aap"].map((n, i) => {
    const w = who(s13, n, (i % 3) * 330 + 20, 560 + Math.floor(i / 3) * 330, 330, { expr: "happy", gesture: i % 2 ? "pointLongArm" : "waveLongArm" });
    tl.fromTo(w, { x: i % 3 === 0 ? -600 : i % 3 === 2 ? 600 : 0, y: i < 3 ? -200 : 300, opacity: 0 }, { x: 0, y: 0, opacity: 1, duration: 0.45, ease: "expo.out" }, 61.4 + i * 0.08);
    const tag = el(w, { left: 190, top: 40, background: C.g, border: `5px solid ${C.ink}`, borderRadius: 14, padding: "4px 14px", font: "800 34px Manrope", color: C.ink }, "BUY");
    pop(tag, 61.7 + i * 0.08, 0.35);
    return w;
  });
  const dm = meter(s13, "DEMAND", { x: 120, y: 1240, w: 840, color: C.g, start: 0.25 });
  rise(dm, 63.3, 40, 0.3); dm.to(0.95, 63.6, 0.8, K.ICON.arrowUp());

  // ── S14 64.95–68.7: supply fixed at 1,000 ───────────────────────────────────
  const s14 = scene(64.74, 68.7);
  pushUp(s13, s14, 64.95);
  const crate = icon(s14, "crate", 250, 260, 580, 429);
  pop(crate, 65.05, 0.5);
  const lk = icon(s14, "lock", 720, 560, 160, 190);
  tl.fromTo(lk, { y: -300, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: "bounce.out" }, 67.18);
  const t14 = words(s14, "SIRF 1,000 SHARES", { y: 740, size: 88, hl: { "1,000": C.g3 } }); reveal(t14, 66.1);
  const dm2 = meter(s14, "DEMAND", { x: 120, y: 940, w: 840, color: C.g, start: 0.95 }); rise(dm2, 65.1, 30, 0.3);
  tl.set(dm2.querySelector(".m-arrow"), { innerHTML: K.ICON.arrowUp() }, 65.1);
  const sp2 = meter(s14, "SUPPLY", { x: 120, y: 1100, w: 840, color: "#9AA49F", start: 0.32 }); rise(sp2, 67.1, 30, 0.3);
  const lim = slab(s14, "SUPPLY LIMITED", { y: 1250, size: 60, center: true, bg: C.ink, color: "#fff" }); lim.style.setProperty("--w", "560px"); slabIn(lim, 67.5);

  // ── S15 68.7–73.6: demand > supply → price up ───────────────────────────────
  const s15 = scene(68.7, 73.6);
  whip(s14, s15, 68.7);
  const cD = el(s15, { left: 60, top: 300 }, `DEMAND <span style="color:${C.g3}">▲ ZYADA</span>`, "chip");
  const cS = el(s15, { left: 60, top: 450 }, `SUPPLY <span style="color:${C.grey}">▼ KAM</span>`, "chip");
  slideIn(cD, 69.3, -400, 0.4); slideIn(cS, 70.14, -400, 0.4);
  const eqS = el(s15, { left: 0, top: 590, width: 1080, textAlign: "center", font: "800 120px Manrope", color: C.ink }, "=");
  pop(eqS, 70.9, 0.35);
  const qUp = words(s15, "QEEMAT UPAR", { y: 1180, size: 112, hl: { UPAR: C.g3 } }); reveal(qUp, 71.24, { stagger: 0.12 });
  const rocket = chart(s15, [[0, 0], [0.3, 0.15], [0.45, 0.12], [0.7, 0.55], [0.82, 0.5], [1, 1]], { x: 150, y: 740, w: 780, h: 420, color: C.g, sw: 18 });
  rocket.draw(71.5, 1.0);
  const aU = icon(s15, "arrowUp", 860, 700, 160, 160); pop(aU, 72.24, 0.4);
  shake(72.3, 8);
  glitch(73.6);

  // ── S16 73.6–84.05: bad news → everyone sells → supply up, demand down → price falls
  const s16 = scene(73.6, 84.05);
  const sink = el(s16, { left: 240, top: 300, width: 600, height: 560, overflow: "hidden" });
  const st16 = icon(sink, "stall", 0, 40, 600, 480);
  const wave = el(s16, { left: 140, top: 760, width: 800, height: 120 }, `<svg viewBox="0 0 800 120"><path d="M0,40 q50,-36 100,0 t100,0 t100,0 t100,0 t100,0 t100,0 t100,0 t100,0 V120 H0Z" fill="#BFE6F2" stroke="${C.ink}" stroke-width="7"/></svg>`, "icon");
  rise(sink, 73.7, 80, 0.4); rise(wave, 73.8, 40, 0.4);
  tl.to(wave, { x: -60, duration: 2, yoyo: true, repeat: 2, ease: "sine.inOut" }, 74);
  tl.to(st16, { y: 380, rotation: 7, duration: 1.4, ease: "power2.in" }, 75.6);
  const dub = slab(s16, "DOOB RAHA HAI?", { y: 210, size: 64, center: true, bg: C.red, color: "#fff" }); dub.style.setProperty("--w", "620px"); slabIn(dub, 75.4);
  const ahm16 = who(s16, "ahmed", 10, 900, 330, { expr: "worried" }); rise(ahm16, 74.9, 60, 0.4); X(tl, ahm16.av, "shocked", 75.7); life(ahm16, 75, 78.3, "shocked", 12);
  const sellers = ["bilal", "sana", "usman"].map((n, i) => {
    const w = who(s16, n, 350 + i * 230, 920, 270, { expr: "worried", gesture: "point" });
    pop(w, 76.95 + i * 0.1, 0.4);
    const tag = el(w, { left: 160, top: 30, background: C.red, border: `5px solid ${C.ink}`, borderRadius: 14, padding: "4px 14px", font: "800 34px Manrope", color: "#fff" }, "SELL");
    pop(tag, 77.25 + i * 0.1, 0.35);
    return w;
  });
  // swap to meters + falling chart
  tl.to([sink, wave, dub, ahm16, ...sellers], { opacity: 0, y: -80, duration: 0.3, ease: "power2.in", stagger: 0.02 }, 78.1);
  const sp3 = meter(s16, "SUPPLY", { x: 120, y: 300, w: 840, color: "#9AA49F", start: 0.32 });
  const dm3 = meter(s16, "DEMAND", { x: 120, y: 460, w: 840, color: C.g, start: 0.95 });
  rise(sp3, 78.3, 30, 0.3); rise(dm3, 78.4, 30, 0.3);
  sp3.to(0.92, 78.5, 0.8, K.ICON.arrowUp(C.ink)); dm3.to(0.2, 79.95, 0.8, K.ICON.arrowDown());
  const fall = chart(s16, [[0, 0.95], [0.18, 0.8], [0.3, 0.85], [0.5, 0.45], [0.65, 0.5], [0.85, 0.12], [1, 0.05]], { x: 110, y: 640, w: 860, h: 460, color: C.red, sw: 18 });
  fall.draw(81.4, 1.6);
  const qDn = slab(s16, "QEEMAT NEECHE ▼", { y: 1170, size: 74, center: true, bg: C.red, color: "#fff" }); qDn.style.setProperty("--w", "720px"); slabIn(qDn, 81.86);
  wipe(84.05, [C.ink, C.red, C.ink]);

  // ── S17 84.05–87.95: MARKET VOLATILITY (dark) ──────────────────────────────
  const s17 = scene(84.05, 87.95, C.ink);
  const vz = chart(s17, [[0, 0.5], [0.08, 0.8], [0.16, 0.35], [0.26, 0.9], [0.36, 0.2], [0.46, 0.75], [0.56, 0.3], [0.66, 0.85], [0.76, 0.25], [0.86, 0.7], [1, 0.45]],
    { x: 40, y: 380, w: 1000, h: 520, color: C.g, sw: 14 });
  vz.draw(84.1, 1.6);
  const uC = el(s17, { left: 90, top: 260 }, `<span style="color:${C.g3}">▲</span> upar`, "chip"); pop(uC, 84.74, 0.35);
  const nC = el(s17, { left: 640, top: 940 }, `<span style="color:${C.red}">▼</span> neeche`, "chip"); pop(nC, 85.34, 0.35);
  const vol1 = words(s17, "MARKET", { y: 1060, size: 120, color: "#fff" });
  const vol2 = words(s17, "VOLATILITY", { y: 1200, size: 140, color: C.g, track: -0.03 });
  reveal(vol1, 86.4); reveal(vol2, 86.75, { stagger: 0 });
  tl.fromTo(vol2, { scale: 1.4 }, { scale: 1, duration: 0.4, ease: "expo.out" }, 86.75);
  shake(86.8, 18);

  // ── S18 87.95–93.8: not just numbers — darr, umeed, bharosa ────────────────
  const s18 = scene(87.95, 94.05);
  tl.to(s17, { opacity: 0, duration: 0.3 }, 87.8);
  const nums = el(s18, { left: 0, top: 0, width: 1080, height: 1300 });
  let nh = ""; for (let i = 0; i < 18; i++) nh += `<div class="abs mono" style="left:${60 + (i % 3) * 330 + (i * 37) % 90}px;top:${560 + Math.floor(i / 3) * 125}px;font-size:${40 + (i % 3) * 16}px;color:${i % 4 ? "#C9D3CD" : (i % 8 ? C.g : C.red)}">${["+2.4%", "-1.1%", "118,452", "1,042.5", "+0.8%", "-3.2%"][i % 6]}</div>`;
  nums.innerHTML = nh;
  tl.fromTo(nums.children, { opacity: 0 }, { opacity: 1, duration: 0.2, stagger: 0.01 }, 88.0);
  const sn = words(s18, "SIRF NUMBERS | NAHI.", { y: 300, size: 104, hl: { "NAHI.": C.g3 } }); reveal(sn, 88.1);
  tl.to(nums, { opacity: 0, scale: 1.3, duration: 0.5, ease: "power2.in" }, 89.2); hideWords(sn, 89.25);
  const lak = words(s18, "LAAKHON LOGON KI SOCH", { y: 260, size: 72, hl: { SOCH: C.g3 } }); reveal(lak, 89.4);
  const faces = [["ayesha", "worried", "DARR", C.red, 90.95], ["sana", "think", "UMEED", C.gold, 91.8], ["bilal", "happy", "BHAROSA", C.g3, 92.65]];
  faces.forEach(([n, ex, lab, col, t], i) => {
    const w = who(s18, n, 15 + i * 350, 620, 350, { expr: "smile" }); pop(w, 89.6 + i * 0.12, 0.45); life(w, 89.6, 93.7, "smile", 14 + i);
    X(tl, w.av, ex, t);
    const L = el(s18, { left: 15 + i * 350, top: 1010, width: 350, textAlign: "center", font: "800 64px Manrope", color: col }, lab);
    tl.fromTo(L, { y: 40, opacity: 0, scale: 0.6 }, { y: 0, opacity: 1, scale: 1, duration: 0.4, ease: "back.out(2)" }, t);
    tl.fromTo(w, { scale: 1 }, { scale: 1.12, duration: 0.25, yoyo: true, repeat: 1, ease: "power2.out" }, t);
  });

  // ── S19 93.8–99.1: PSX = regulated marketplace ──────────────────────────────
  const s19 = scene(93.59, 99.1);
  pushUp(s18, s19, 93.8);
  const ex19 = icon(s19, "exchange", 240, 250, 600, 440);
  rise(ex19, 93.9, 80, 0.5);
  const sh = icon(s19, "shield", 760, 480, 200, 230);
  tl.fromTo(sh, { scale: 0, rotation: -30 }, { scale: 1, rotation: 0, duration: 0.45, ease: "back.out(2)" }, 94.8);
  const reg = words(s19, "REGULATED | MARKETPLACE", { y: 760, size: 92, hl: { REGULATED: C.g3 } }); reveal(reg, 94.85);
  const cos = ["Cement", "Bank", "Energy", "Textile", "Chai ☕"].map((n, i) => {
    const c = el(s19, { left: 40 + (i % 3) * 340, top: 1020 + Math.floor(i / 3) * 130 }, n, "chip");
    if (i >= 3) c.style.left = (210 + (i - 3) * 340) + "px";
    pop(c, 96.4 + i * 0.12, 0.38); return c; });
  for (let i = 0; i < 4; i++) {
    const a = cos[i], b = cos[(i + 2) % 5];
    const tk19 = icon(s19, "ticket", parseFloat(a.style.left) + 60, parseFloat(a.style.top) - 20, 100, 58, "");
    tl.fromTo(tk19, { x: 0, y: 0, opacity: 0 }, { x: parseFloat(b.style.left) - parseFloat(a.style.left), y: parseFloat(b.style.top) - parseFloat(a.style.top), opacity: 1, duration: 0.6, ease: "power2.inOut" }, 97.9 + i * 0.15)
      .to(tk19, { opacity: 0, duration: 0.15 }, 98.5 + i * 0.15);
  }
  wipe(99.1);

  // ── S20 99.1–114: CTA → logo → disclaimer ──────────────────────────────────
  const s20 = scene(99.1, 114);
  const c1 = words(s20, "PSX ko", { y: 560, size: 90, weight: 700, color: C.g3 });
  const c2 = words(s20, "AASAAN | ZUBAAN MEIN", { y: 680, size: 128, hl: { AASAAN: C.g3 } });
  reveal(c1, 100.08); reveal(c2, 100.74, { stagger: 0.1 });
  const sq = el(s20, { left: 0, top: 1020, width: 1080, textAlign: "center", font: "600 52px Manrope", color: C.ink }, "samajhna chahte hain?");
  rise(sq, 101.46, 30, 0.4);
  // smooth transition into the logo: three brand bars sweep in and settle as the mark
  tl.to([c1, c2, sq], { y: -120, opacity: 0, duration: 0.35, ease: "power3.in", stagger: 0.04 }, 102.35);
  const mark = el(s20, { left: 0, top: 0, width: 1080, height: 1920 });
  const mb = [[C.g, 0], [C.g2, 1], [C.ink, 2]].map(([c, i]) => {
    const b = el(mark, { left: 330 + i * 150, top: 560, width: 110, height: 340, background: c, borderRadius: 22 });
    gsap.set(b, { skewX: -20 }); return b; });
  tl.set(mb, { autoAlpha: 0 }, 0).set(mb, { autoAlpha: 1 }, 102.38);
  tl.fromTo(mb, { yPercent: 340 }, { yPercent: 0, duration: 0.5, ease: "expo.out", stagger: 0.07, immediateRender: false }, 102.4)
    .to(mb, { yPercent: -60, scaleY: 0.2, opacity: 0, duration: 0.35, ease: "power3.in", stagger: 0.04 }, 102.95);
  const logo = el(s20, { left: 90, top: 480, width: 900, height: 300 }, `<img src="assets/logos/flostocks-logo-full.png" style="width:100%;height:100%;object-fit:contain">`);
  tl.fromTo(logo, { scale: 0.82, opacity: 0, filter: "blur(12px)" }, { scale: 1, opacity: 1, filter: "blur(0px)", duration: 0.6, ease: "expo.out" }, 103.05);
  const glint = el(s20, { left: 90, top: 480, width: 900, height: 300, overflow: "hidden",
    webkitMask: "url(assets/logos/flostocks-logo-full.png) center / contain no-repeat", mask: "url(assets/logos/flostocks-logo-full.png) center / contain no-repeat" },
    `<i style="position:absolute;top:-40%;left:0;width:130px;height:180%;background:linear-gradient(90deg,rgba(255,255,255,0),rgba(255,255,255,.75),rgba(255,255,255,0))"></i>`);
  tl.fromTo(glint.firstChild, { xPercent: -150, skewX: -20 }, { xPercent: 800, duration: 0.8, ease: "power2.inOut" }, 103.5);
  const fol = el(s20, { left: 290, top: 820, width: 500, height: 110, background: C.g, borderRadius: 55, font: "800 54px/110px Manrope", textAlign: "center", color: C.ink }, "Follow FloStocks");
  tl.fromTo(fol, { scale: 0.5, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.45, ease: "back.out(1.8)" }, 103.36)
    .to(fol, { scale: 1.06, duration: 0.35, yoyo: true, repeat: 3, ease: "sine.inOut" }, 104.0);
  // mushkil nahi → simple
  const mk = el(s20, { left: 0, top: 990, width: 1080, textAlign: "center", font: "700 62px Manrope", color: C.ink }, `Stock market <span id="mk" style="position:relative;color:#5E6863">mushkil<i id="mkx" style="position:absolute;left:-4%;top:52%;width:108%;height:8px;background:${C.red};transform-origin:0 50%"></i></span> nahi,`);
  rise(mk, 104.5, 30, 0.4);
  tl.fromTo(mk.querySelector("#mkx"), { scaleX: 0 }, { scaleX: 1, duration: 0.3, ease: "power3.out" }, 105.4);
  const simple = words(s20, "SIMPLE.", { y: 1080, size: 150, color: C.g3, track: -0.03 }); reveal(simple, 106.42, { stagger: 0 });
  tl.fromTo(simple, { scale: 1.3 }, { scale: 1, duration: 0.4, ease: "expo.out" }, 106.42);
  // disclaimer underneath the logo
  tl.to([mk, simple], { opacity: 0, y: -30, duration: 0.4, ease: "power2.in" }, 108.2);
  const disc = el(s20, { left: 110, top: 1010, width: 860, padding: "28px 34px", borderTop: `4px solid ${C.g}`,
    font: "500 30px/1.5 Inter", color: "#3B4540", textAlign: "center" },
    `<div style="font:800 26px Manrope;letter-spacing:.14em;color:${C.g3};margin-bottom:10px">DISCLAIMER</div>Trading and investing in the PSX involve market risks, price fluctuations, and potential financial losses. Past performance does not guarantee future results. Learn the risks before you trade.`);
  tl.fromTo(disc, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: "power2.out" }, 108.5);
  tl.to(logo, { scale: 1.02, duration: 5, ease: "none" }, 108.5);

  // ── captions ────────────────────────────────────────────────────────────────
  const caps = document.getElementById("caps");
  window.CAPTIONS.forEach(([a, b, html]) => {
    if (a > 108.1) return;
    const c = document.createElement("div"); c.className = "cap"; c.innerHTML = `<span>${html}</span>`; caps.appendChild(c);
    tl.set(c, { autoAlpha: 0 }, 0)
      .fromTo(c, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.12, ease: "power2.out", immediateRender: false }, Math.max(0, a))
      .set(c, { autoAlpha: 0 }, b);
  });

  window.__timelines["main"] = tl;
  tl.seek(0);
})();
