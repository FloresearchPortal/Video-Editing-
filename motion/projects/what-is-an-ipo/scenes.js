// "What is an IPO" — 60 Seconds Investor. Cue times = word starts in videos/what-is-an-ipo/edit/vo.words.json
// (VO = trimmed, pause-tightened, studio-polished; see videos/what-is-an-ipo/prep_vo.py).
(function () {
  const { C, tl, el, scene, kin, charsIn, roller, roll, who, react, life, line, swap, ctaLogo, icon } = K;
  const X = CAST.expr, Gs = CAST.gesture;
  const card = (p, css) => el(p, Object.assign({ background: "#fff", borderRadius: 32, border: "2px solid #E3E9E5", boxShadow: "0 24px 50px rgba(20,40,20,.10)" }, css));
  const txt = (p, css, html) => el(p, Object.assign({ font: "700 40px Manrope", color: C.text, whiteSpace: "nowrap" }, css), html);
  const fadeUp = (e, t, d = 0.45, y = 40) => tl.fromTo(e, { y, opacity: 0 }, { y: 0, opacity: 1, duration: d, ease: "power3.out" }, t);
  const OV = [];

  // ═══ S1 HOOK 0–7.86: a WhatsApp group chat → "Ye IPO hai kia?" (no PSX logo intro — client) ═══
  const s1 = scene(0, 7.86, { push: 1.02 });
  const chat = el(s1, { left: 120, top: 150, width: 840, height: 900, borderRadius: 36, overflow: "hidden", background: "#EFEAE2",
    boxShadow: "0 30px 60px rgba(20,40,20,.16)", border: "2px solid #E3E9E5" });
  // wallpaper doodles (very faint)
  el(chat, { left: 0, top: 0, width: 840, height: 900, opacity: 0.07, backgroundImage: "radial-gradient(#0B0F14 1.5px, transparent 1.6px)", backgroundSize: "34px 34px" });
  const hdr = el(chat, { left: 0, top: 0, width: 840, height: 132, background: "#008069" });
  el(hdr, { left: 26, top: 42, font: "400 46px/1 Inter", color: "#fff" }, "‹");
  el(hdr, { left: 76, top: 30, width: 72, height: 72, borderRadius: 36, background: "#DFE5E7", overflow: "hidden" },
    `<svg viewBox="0 0 72 72" width="72" height="72"><circle cx="36" cy="28" r="13" fill="#fff"/><path d="M12,66 a24,22 0 0 1 48,0Z" fill="#fff"/></svg>`);
  txt(hdr, { left: 168, top: 30, font: "700 36px Inter", color: "#fff" }, "Bacha Party 🎉");
  txt(hdr, { left: 168, top: 76, font: "500 24px Inter", color: "#D6EFE9" }, "Bilal, Sana, Usman, Zara, You");
  el(hdr, { left: 700, top: 44, font: "700 34px Inter", color: "#fff", letterSpacing: ".3em" }, "⋮");
  const day = el(chat, { left: 340, top: 160, padding: "8px 18px", borderRadius: 12, background: "#fff", font: "600 22px Inter", color: "#54656F", boxShadow: "0 1px 1px rgba(0,0,0,.08)" }, "Today");
  const bub = (side, html, top, t, extra = "") => {
    const b = el(chat, { top, maxWidth: 600, padding: "16px 22px 34px", borderRadius: side === "in" ? "4px 22px 22px 22px" : "22px 4px 22px 22px",
      background: side === "in" ? "#fff" : "#D9FDD3", boxShadow: "0 1px 1px rgba(0,0,0,.12)", font: "500 36px/1.3 Inter", color: "#111B21",
      [side === "in" ? "left" : "right"]: 28 }, html + `<span style="position:absolute;right:16px;bottom:8px;font:500 20px Inter;color:#667781">${extra}</span>`);
    fadeUp(b, t, 0.3, 18); return b; };
  bub("in", `<div style="font:700 26px Inter;color:#C2185B;margin-bottom:4px">Bilal</div>Yaar, IPO aa raha hai, apply kiya? 👀`, 230, 1.62, "3:02 PM");
  bub("out", `Haan&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`, 430, 4.26, `3:03 PM <svg viewBox="0 0 16 11" width="30" height="21" style="vertical-align:-4px;margin-left:4px"><path fill="#53BDEB" d="M11.07.65 10.43.15a.46.46 0 0 0-.65.08L4.86 6.6 2.5 4.38a.46.46 0 0 0-.65.02l-.5.53a.46.46 0 0 0 .02.65l3.2 3.07c.18.17.47.16.64-.04l5.93-7.3a.46.46 0 0 0-.07-.66Zm4 0L14.43.15a.46.46 0 0 0-.65.08L8.86 6.6l-.62-.6-.98 1.2 1.42 1.37c.18.17.47.16.64-.04l5.93-7.3a.46.46 0 0 0-.07-.66Z"/></svg>`);
  const typing = bub("in", `<div style="font:700 26px Inter;color:#1F7A00;margin-bottom:4px">Sana</div><span style="letter-spacing:.2em">•••</span>`, 560, 5.2, "");
  const bar = el(chat, { left: 20, top: 806, width: 800, height: 76 });
  el(bar, { left: 0, top: 0, width: 700, height: 76, borderRadius: 38, background: "#fff", font: "500 30px/76px Inter", color: "#8696A0", paddingLeft: "30px" }, "Message");
  el(bar, { left: 716, top: 0, width: 76, height: 76, borderRadius: 38, background: "#00A884" },
    `<svg viewBox="0 0 76 76" width="76" height="76"><rect x="31" y="18" width="14" height="26" rx="7" fill="#fff"/><path d="M24,38 a14,14 0 0 0 28,0 M38,52 v8" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round"/></svg>`);
  tl.fromTo(chat, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: "power3.out" }, 0);
  const aap = who(s1, "aap", 40, 1090, 420, { expr: "smile", gesture: "handPhone" });
  fadeUp(aap, 3.78, 0.45, 40); life(aap, 3.8, 7.8, "smile", 2);
  react.think(aap, 5.4, 1.6, { gesture: "none", dots: false });
  const q = kin(s1, "YE IPO | HAI *KIA?*", { x: 470, y: 1220, w: 570, size: 104 });
  charsIn.rise(q, 6.52, 0.03);
  OV.push(chat);

  // ═══ S2 7.86–13.02: 60 Seconds Investor series card ═══
  const s2 = scene(7.86, 13.02);
  // approved series card: stopwatch (client pick, variation A)
  const sc2 = K.seriesCard(s2, 7.95, { tSweep: 8.46, tTitle: 8.88, tSeries: 9.54, tTag: 10.52, tEp: 11.9, ep: "EP 01 · WHAT IS AN IPO" });
  OV.push(sc2.watch);

  // ═══ S3 13.02–19.84: a new phone launch — pre-booking gets the launch price ═══
  const s3 = scene(13.02, 19.84);
  const h3 = kin(s3, "NAYA *PHONE* LAUNCH", { y: 190, size: 96 }); charsIn.rise(h3, 14.0, 0.02);
  // iPhone 18 (front): aluminium frame, Dynamic Island, launch screen
  const ph = el(s3, { left: 110, top: 350, width: 380, height: 780 },
    `<svg viewBox="0 0 380 780" width="380" height="780">
      <defs><linearGradient id="ti" x1="0" x2="1"><stop offset="0" stop-color="#9DB0C2"/><stop offset=".5" stop-color="#E1E9F1"/><stop offset="1" stop-color="#93A6B8"/></linearGradient>
      <linearGradient id="scr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1C2A1F"/><stop offset="1" stop-color="#0B0F14"/></linearGradient></defs>
      <rect x="4" y="4" width="372" height="772" rx="62" fill="url(#ti)"/><rect x="14" y="14" width="352" height="752" rx="54" fill="#0B0F14"/>
      <rect x="22" y="22" width="336" height="736" rx="48" fill="url(#scr)"/>
      <rect x="140" y="42" width="100" height="30" rx="15" fill="#000"/>
      <rect x="-2" y="190" width="6" height="70" rx="3" fill="#93A6B8"/><rect x="376" y="230" width="6" height="110" rx="3" fill="#93A6B8"/></svg>`);
  fadeUp(ph, 13.3, 0.5, 60);
  el(ph, { left: 0, top: 300, width: 380, textAlign: "center", font: "600 26px Inter", color: "#9FB7A4", letterSpacing: ".2em" }, "NEW");
  txt(ph, { left: 0, top: 340, width: 380, textAlign: "center", font: "800 60px Manrope", color: "#fff" }, "iPhone 18");
  const pre = el(ph, { left: 60, top: 620, width: 260, height: 74, borderRadius: 37, background: C.g2, color: "#fff", font: "800 30px/74px Manrope", textAlign: "center" }, "PRE-BOOK");
  fadeUp(pre, 16.12, 0.35, 16);
  tl.to(pre, { scale: 0.94, duration: 0.1, yoyo: true, repeat: 1, ease: "power1.inOut" }, 17.82);
  const open = el(s3, { left: 540, top: 400, padding: "16px 26px", borderRadius: 999, border: `4px solid ${C.g}`, background: "#fff", font: "800 34px Manrope", color: C.text, whiteSpace: "nowrap" }, "PRE-BOOKING OPEN");
  fadeUp(open, 15.56, 0.4, 20);
  const lp = card(s3, { left: 540, top: 540, width: 480, height: 250 });
  txt(lp, { left: 36, top: 172, font: "600 22px Inter", color: C.mute }, "iPhone 18 256GB · expected PK price");
  txt(lp, { left: 36, top: 34, font: "800 28px Manrope", color: C.mute, letterSpacing: ".06em" }, "LAUNCH PRICE");
  txt(lp, { left: 36, top: 84, font: "700 64px 'IBM Plex Mono'" }, "Rs 379,999");
  fadeUp(lp, 18.66, 0.45, 30);
  const early = ["zara", "usman", "ayesha"].map((n, i) => {
    const w = who(s3, n, 520 + i * 170, 900, 200, { expr: "smile" });
    fadeUp(w, 17.22 + i * 0.12, 0.4, 30); return w; });
  const bk = el(early[0], { left: 0, top: -62, width: 200, boxSizing: "border-box", textAlign: "center", padding: "6px 0", borderRadius: 14, background: C.g, color: C.ink, font: "800 26px Manrope", whiteSpace: "nowrap" }, "PEHLE BOOK ✓");
  fadeUp(bk, 17.82, 0.35, 16); react.joy(early[0], 18.94);
  OV.push(ph, lp);

  // ═══ S4 19.84–21.64: "IPO bhi bilkul aisa hi hai" ═══
  const s4 = scene(19.84, 21.64);
  const a4 = kin(s4, "IPO BHI", { y: 640, size: 150 }); const b4 = kin(s4, "BILKUL *AISA HI*", { y: 820, size: 120 });
  charsIn.rise(a4, 19.9, 0.03); charsIn.rise(b4, 20.3, 0.02);

  // ═══ S5 21.64–28.92: Initial Public Offering — a private company sells shares to the public, lists on PSX ═══
  const s5 = scene(21.64, 28.92);
  // I · P · O as bold tiles; each letter's word drops out of its tile on its VO word
  [["I", "NITIAL", 22.34, C.g, C.ink], ["P", "UBLIC", 22.76, C.ink, C.g], ["O", "FFERING", 23.08, C.g, C.ink]].forEach(([L, rest, t, bg, fg], i) => {
    const x = 90 + i * 315;
    const tile = el(s5, { left: x, top: 150, width: 270, height: 250, borderRadius: 40, background: bg,
      boxShadow: `0 22px 40px ${bg === C.g ? "rgba(56,209,0,.35)" : "rgba(11,15,20,.25)"}`, overflow: "hidden" },
      `<div style="position:absolute;inset:0;font:800 200px/250px Manrope;text-align:center;color:${fg}">${L}</div>
       <div class="shine" style="position:absolute;top:-20%;left:0;width:60px;height:140%;background:linear-gradient(90deg,rgba(255,255,255,0),rgba(255,255,255,.55),rgba(255,255,255,0));transform:skewX(-18deg)"></div>`);
    tl.fromTo(tile, { y: 50, opacity: 0, scale: 0.9 }, { y: 0, opacity: 1, scale: 1, duration: 0.45, ease: "power3.out" }, 21.7 + i * 0.1);
    tl.fromTo(tile.querySelector(".shine"), { x: -80 }, { x: 360, duration: 0.6, ease: "power2.inOut" }, t - 0.1);
    const stem = el(s5, { left: x + 133, top: 400, width: 4, height: 40, background: bg });
    tl.fromTo(stem, { scaleY: 0, transformOrigin: "50% 0%" }, { scaleY: 1, duration: 0.2, ease: "power2.out" }, t);
    const word = el(s5, { left: x - 20, top: 446, width: 310, textAlign: "center", font: "800 46px Manrope", color: C.text, whiteSpace: "nowrap" },
      `<span style="color:${C.gt}">${L}</span>${rest}`);
    fadeUp(word, t + 0.05, 0.35, 16);
  });
  const co = card(s5, { left: 70, top: 580, width: 520, height: 300 });
  txt(co, { left: 40, top: 36, font: "800 26px Manrope", color: C.mute, letterSpacing: ".08em" }, "PRIVATE COMPANY");
  txt(co, { left: 40, top: 82, font: "800 60px Manrope" }, "TECHPAK LTD");
  el(co, { left: 40, top: 168, padding: "4px 14px", borderRadius: 10, background: "#F2F4F3", font: "700 22px Inter", color: C.mute }, "EXAMPLE");
  const lk = icon(co, "lock", 400, 160, 90, 107);
  fadeUp(co, 23.68, 0.45, 40);
  const pb = el(s5, { left: 650, top: 640, padding: "14px 24px", borderRadius: 999, background: C.ink, color: "#fff", font: "800 32px Manrope", whiteSpace: "nowrap" }, "PEHLI BAAR");
  fadeUp(pb, 24.7, 0.35, 20);
  tl.to(lk, { opacity: 0, y: -20, duration: 0.3 }, 25.34);
  const pub = ["sana", "bilal", "zara", "usman", "ayesha", "aap"].map((n, i) => { const w = who(s5, n, 8 + i * 177, 1150, 190, { expr: "smile" }); fadeUp(w, 25.94 + i * 0.06, 0.4, 30); return w; });
  pub.forEach((w, i) => {
    const tk = icon(s5, "ticket", 270, 860, 110, 64, "SHARE");
    gsap.set(tk, { opacity: 0 });
    tl.fromTo(tk, { x: 0, y: 0, opacity: 0 }, { x: (8 + i * 177 + 40) - 270, y: 1080 - 860, opacity: 1, duration: 0.6, ease: "power2.inOut", immediateRender: false }, 26.1 + i * 0.08);
    X(tl, w.av, "happy", 26.7 + i * 0.08);
  });
  const lg5 = el(s5, { left: 680, top: 580, width: 230, height: 275 }, `<img src="assets/psx/psx-logo.png" style="width:100%;height:100%;object-fit:contain">`);
  const lst = el(s5, { left: 640, top: 900, padding: "10px 22px", borderRadius: 14, border: `4px solid ${C.g}`, background: "#fff", font: "800 32px Manrope", color: C.gt, whiteSpace: "nowrap" }, "LISTED ON PSX ✓");
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
  // big investors: Rehan (suited) + institutions — banks, mutual funds, insurance
  const rehan = who(s6, "rehan", 20, 1120, 330, { expr: "smile", gesture: "none" });   // no arms/hands (client note)
  fadeUp(rehan, 35.6, 0.4, 30); life(rehan, 35.6, 37.7, "smile", 6);   // arrives with the institutions
  const inst = ["BANKS", "MUTUAL FUNDS", "INSURANCE<br>COMPANY"].map((lab, i) => {
    const b = el(s6, { left: 380 + i * 225, top: 1180, width: 200, height: 260 },
      `<svg viewBox="0 0 200 200" width="200" height="200"><path d="M14,64 L100,18 L186,64Z" fill="#fff" stroke="#0B0F14" stroke-width="8" stroke-linejoin="round"/>
       ${[38, 76, 114, 152].map((x) => `<rect x="${x - 8}" y="74" width="16" height="86" fill="#fff" stroke="#0B0F14" stroke-width="6"/>`).join("")}
       <rect x="14" y="160" width="172" height="26" fill="${C.g}" stroke="#0B0F14" stroke-width="8"/></svg>
       <div style="position:absolute;left:-10px;top:200px;width:220px;text-align:center;font:800 26px/1.1 Manrope;color:${C.text};white-space:nowrap">${lab}</div>`);
    b.style.filter = "drop-shadow(0 14px 18px rgba(20,40,20,.16))";
    fadeUp(b, 35.6 + i * 0.1, 0.4, 30); return b; });
  const big = el(s6, { left: 40, top: 1470, padding: "8px 20px", borderRadius: 12, background: C.ink, color: "#fff", font: "800 28px Manrope", whiteSpace: "nowrap" }, "BARAY INVESTOR");
  fadeUp(big, 35.9, 0.3, 14);
  [[12, inst[0]], [13, inst[1]], [13.5, rehan]].forEach(([rs, src], k) => {
    const bid = el(s6, { left: PX(rs) - 70, top: 600 + k * 64, width: 140, height: 52, borderRadius: 26, background: "#fff", border: `3px solid ${C.ink}`, font: "800 24px/46px Manrope", textAlign: "center", color: C.text }, `BID ${rs}`);
    fadeUp(bid, 36.84 + k * 0.16, 0.35, 30);
  });
  X(tl, rehan.av, "grin", 37.16);
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
