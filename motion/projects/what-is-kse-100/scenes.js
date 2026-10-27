// "What is KSE-100" — 60 Seconds Investor EP 02. Cue times = word starts in videos/what-is-kse-100/edit/vo.words.json
// (VO = pause-tightened, studio-polished; see videos/what-is-kse-100/prep_vo.py). Index levels: media/library/psx/market.json
// (dps.psx.com.pk, 27 Oct 2026 ~11:44 AM PKT, intraday).
(function () {
  const { C, tl, el, scene, kin, charsIn, who, react, life, talk, line, swap, ctaLogo, icon, rnd } = K;
  const X = CAST.expr;
  const M = window.MARKET || {};
  const IX = M.indices || {};
  const card = (p, css) => el(p, Object.assign({ background: "#fff", borderRadius: 32, border: "2px solid #E3E9E5", boxShadow: "0 24px 50px rgba(20,40,20,.10)" }, css));
  const txt = (p, css, html) => el(p, Object.assign({ font: "700 40px Manrope", color: C.text, whiteSpace: "nowrap" }, css), html);
  const fadeUp = (e, t, d = 0.45, y = 40) => tl.fromTo(e, { y, opacity: 0 }, { y: 0, opacity: 1, duration: d, ease: "power3.out" }, t);
  const out = (e, t, d = 0.25) => tl.to(e, { opacity: 0, duration: d, ease: "power2.in" }, t);
  const chip = (p, css, html) => el(p, Object.assign({ padding: "12px 26px", borderRadius: 999, background: "#fff", border: `4px solid ${C.g}`,
    font: "800 34px Manrope", color: C.text, whiteSpace: "nowrap" }, css), html);
  const f2 = (v) => v.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const K100 = IX.KSE100 || { level: 163940.2, change_points: 901.74, change_pct: 0.55 };
  const S = `stroke="#0B0F14" stroke-width="8" stroke-linejoin="round" stroke-linecap="round"`;
  const OV = [];

  // ═══ S1 HOOK 0–8.32: 9 PM, the news is on → anchor: "KSE-100 mein aaj 1,000 points ki tezi" → "aakhir ye hai kia?" ═══
  const s1 = scene(0, 8.32, { push: 1.02 });
  const room = el(s1, { left: 0, top: 0, width: 1080, height: 1920 }); room.setAttribute("data-ov-group", "");
  // night window (the room stays light — white theme; the window says "raat")
  const win = el(room, { left: 600, top: 880, width: 400, height: 300 },
    `<svg viewBox="0 0 400 300" width="400" height="300"><rect x="6" y="6" width="388" height="288" rx="18" fill="#22314F" ${S}/>
     <circle cx="300" cy="86" r="40" fill="#FFF3C4"/><circle cx="322" cy="72" r="36" fill="#22314F"/>
     ${[[70, 70], [140, 120], [210, 60], [90, 190], [250, 200], [330, 230], [170, 240]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="4" fill="#E9EEF7"/>`).join("")}
     <path d="M200,6 V294 M6,150 H394" ${S}/></svg>`);
  // the TV: bezel, studio, chart wall, desk, anchor (client pick A), LIVE + 9:00 PM, breaking strip
  const tv = el(s1, { left: 60, top: 150, width: 960, height: 600, borderRadius: 30, background: "#0B0F14", boxShadow: "0 30px 60px rgba(20,40,20,.20)" });
  el(s1, { left: 470, top: 750, width: 140, height: 44 }, `<svg viewBox="0 0 140 44" width="140" height="44"><path d="M50,0 h40 l20,36 h-80Z" fill="#0B0F14"/><rect x="0" y="34" width="140" height="10" rx="5" fill="#0B0F14"/></svg>`);
  const scr = el(tv, { left: 18, top: 18, width: 924, height: 564, borderRadius: 16, overflow: "hidden", background: "linear-gradient(180deg,#DDEFE1,#F4F8F5)" });
  const wall = el(scr, { left: 520, top: 40, width: 360, height: 220, borderRadius: 14, background: "#0B0F14" });
  const wl = line(wall, [[0, 0.38], [0.12, 0.42], [0.24, 0.36], [0.36, 0.4], [0.48, 0.34], [0.58, 0.5], [0.7, 0.62], [0.82, 0.74], [0.92, 0.82], [1, 0.92]],
    { x: 22, y: 26, w: 316, h: 168, color: C.g });
  const anchor = who(scr, "anchor", 90, 30, 400, { expr: "smile", gesture: "none" });
  el(scr, { left: 0, top: 360, width: 924, height: 84, background: "#0B0F14", borderTop: `6px solid ${C.g}` });
  el(scr, { left: 26, top: 24, padding: "6px 14px", borderRadius: 8, background: C.red, color: "#fff", font: "800 26px Inter", letterSpacing: ".08em" }, "● LIVE");
  el(scr, { left: 770, top: 384, font: "700 34px 'IBM Plex Mono'", color: "#fff" }, "9:00 PM");
  el(scr, { left: 0, top: 444, width: 924, height: 120, background: "#1A2128" });   // desk front under the strip
  const strip = el(scr, { left: 0, top: 444, width: 924, height: 120, background: "#fff", borderTop: "5px solid #0B0F14" });
  el(strip, { left: 24, top: 32, padding: "8px 16px", borderRadius: 8, background: C.red, color: "#fff", font: "800 28px Inter", letterSpacing: ".06em" }, "BREAKING");
  txt(strip, { left: 224, top: 34, font: "800 38px Manrope" }, "KSE-100 INDEX");
  const pts = el(strip, { left: 548, top: 28, padding: "6px 16px", borderRadius: 12, background: C.g, color: C.ink, font: "800 34px Manrope", whiteSpace: "nowrap" }, "+1,000 POINTS ▲");
  tl.fromTo(tv, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, ease: "power3.out" }, 0);
  tl.fromTo(win, { opacity: 0 }, { opacity: 1, duration: 0.5, ease: "power2.out" }, 0.3);
  tl.to(tv, { scale: 1.03, duration: 1.2, ease: "power2.inOut" }, 1.84);                    // "aur anchor kehta hai": lean in
  life(anchor, 0, 8.3, "smile", 21);
  talk(anchor, [2.82, 3.1, 3.34, 3.64, 3.98, 4.16, 4.44, 4.9, 5.12, 5.26, 5.58, 5.86], "smile");
  tl.fromTo(strip, { yPercent: 100 }, { yPercent: 0, duration: 0.4, ease: "power3.out" }, 3.1);
  tl.fromTo(pts, { scale: 0.7, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.35, ease: "power2.out" }, 4.44);
  wl.draw(5.0, 0.9);                                                                          // "tezi": the chart wall climbs
  const sofa = icon(room, "sofa", -40, 1420, 560, 210);
  // the kid (client-approved Set 2): grin while watching → big "O" + lean in on "hazaar" → puzzled + head tilt on "aakhir"
  const aap = who(room, "aap", 30, 1060, 440, { expr: "grinOpen", gesture: "none" });
  fadeUp(sofa, 0.5, 0.45, 30); fadeUp(aap, 0.55, 0.45, 30);
  life(aap, 0.6, 8.3, "grinOpen", 22);
  X(tl, aap.av, "bigO", 4.44);
  K.pose(aap, 4.44, { h: [-5, 6, -14], b: [1.04, 0.99] }, 0.3);
  X(tl, aap.av, "puzzled", 6.54);
  K.pose(aap, 6.54, { h: [9, -4, 4], b: [1, 1] }, 0.4);
  const q = kin(s1, "AAKHIR | YE *KSE-100* | HAI KIA?", { x: 520, y: 1250, w: 540, size: 84 });
  charsIn.rise(q, 7.28, 0.02);
  OV.push(tv, win);

  // ═══ S2 8.32–13.64: 60 Seconds Investor series card (approved stopwatch) ═══
  const s2 = scene(8.32, 13.64);
  const sc2 = K.seriesCard(s2, 8.4, { tSweep: 9.0, tTitle: 9.3, tSeries: 10.12, tTag: 11.04, tEp: 12.12, ep: "EP 02 · WHAT IS KSE-100" });
  OV.push(sc2.watch);

  // ═══ S3 13.64–25.48: covered biryani pot → lid slides right (food shows only as it's uncovered) → tablespoon tastes
  //      → "pata chal gaya" → KSE-100 = PSX ka chamach (client-approved revision: pot B, client's biryani image) ═══
  const s3 = scene(13.64, 25.48);
  const h3 = kin(s3, "BIRYANI KI *DEG*", { y: 170, size: 100 }); charsIn.rise(h3, 14.24, 0.02);
  const kitchen = el(s3, { left: 0, top: 0, width: 1080, height: 1920 }); kitchen.setAttribute("data-ov-group", "");
  const LID = "M28,160 C36,-62 364,-62 372,160 A172,68 0 0 1 28,160Z";
  const wisps = [140, 200, 260].map((x) => `<path d="M${x},96 c-16,-20 16,-34 0,-54 c-14,-18 10,-30 3,-46" fill="none" stroke="#9AA8A0" stroke-width="6" stroke-linecap="round"/>`).join("");
  // 400×590 user units drawn at 1.5× → 600×885 px; pot mouth centre = (200,160)
  const pot = el(kitchen, { left: 40, top: 560, width: 600, height: 885 },
    `<svg viewBox="0 -170 400 590" width="600" height="885" style="overflow:visible">
      <defs><mask id="potReveal" maskUnits="userSpaceOnUse" x="-300" y="-300" width="1400" height="800"><rect x="-300" y="-300" width="1400" height="800" fill="#fff"/><path class="rv" d="${LID}" fill="#000"/></mask>
        <clipPath id="potMouth"><rect x="0" y="-170" width="400" height="330"/><ellipse cx="200" cy="160" rx="152" ry="58"/></clipPath></defs>
      <path d="M44,160 C30,290 60,390 120,410 H280 C340,390 370,290 356,160Z" fill="#FFFFFF" ${S}/>
      <path d="M50,272 C140,296 260,296 350,272" fill="none" stroke="${C.g}" stroke-width="30"/>
      <path d="M40,196 a22,22 0 0 1 0,-44 M360,196 a22,22 0 0 0 0,-44" fill="none" ${S}/>
      <ellipse cx="200" cy="160" rx="162" ry="66" fill="#3A2A1A" ${S}/>
      <g mask="url(#potReveal)"><g clip-path="url(#potMouth)"><image href="assets/food/biryani.png" x="-3" y="-2" width="402" height="301"/></g></g>
      <path d="M38,160 A162,66 0 0 0 362,160" fill="none" ${S}/>
      <g class="burst">${wisps}</g>
      <g class="lid"><path d="${LID}" fill="#FFFFFF" ${S}/><path d="M46,124 C68,24 332,24 354,124" fill="none" stroke="${C.g}" stroke-width="12" stroke-linecap="round"/><rect x="176" y="-29" width="48" height="30" rx="12" fill="${C.g}" ${S}/></g>
      <g class="spoon">
        <path d="M193,-160 Q200,-168 207,-160 L205,46 Q200,54 195,46Z" fill="${C.g}" stroke="#0B0F14" stroke-width="5"/>
        <path d="M196,-10 L195,46 Q200,54 205,46 L204,-10Z" fill="#C9CED3" stroke="#0B0F14" stroke-width="5"/>
        <ellipse cx="200" cy="90" rx="24" ry="40" fill="#C9CED3" stroke="#0B0F14" stroke-width="5"/>
        <g class="taste"><ellipse cx="200" cy="96" rx="15" ry="22" fill="#F2B526" stroke="#0B0F14" stroke-width="3"/><path d="M192,86 l6,4 M200,100 l7,-3 M194,106 l5,3" stroke="#FFF4D6" stroke-width="3" stroke-linecap="round"/></g>
      </g></svg>`);
  const q3 = (c) => pot.querySelector(c);
  fadeUp(pot, 13.8, 0.5, 50);
  // label on the pot band: BIRYANI → PSX on "PSX"
  const lab = el(kitchen, { left: 190, top: 1218, width: 300, textAlign: "center" },
    `<span style="display:inline-block;padding:6px 22px;border-radius:14px;border:4px solid #0B0F14;background:#fff;font:800 42px Manrope;color:${C.text}">BIRYANI</span>`);
  fadeUp(lab, 14.24, 0.35, 16);
  const labP = el(kitchen, { left: 190, top: 1218, width: 300, textAlign: "center" },
    `<span style="display:inline-block;padding:6px 30px;border-radius:14px;border:4px solid #0B0F14;background:${C.ink};font:800 42px Manrope;color:#fff">PSX</span>`);
  tl.to(lab, { y: -14, opacity: 0, duration: 0.18, ease: "power2.in" }, 23.84);
  tl.fromTo(labP, { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3, ease: "power2.out" }, 23.96);
  // "jab biryani tayyar hoti hai": the lid slides smoothly right; the food is revealed only where the lid has passed
  tl.to([q3(".lid"), q3(".rv")], { x: 780, duration: 1.4, ease: "power2.inOut" }, 15.5);   // fully out of frame (pot at 1.5×)
  tl.fromTo(q3(".burst"), { y: 24, opacity: 0 }, { y: -6, opacity: 0.95, duration: 0.6, ease: "power2.out" }, 16.5);
  tl.to(q3(".burst"), { y: -40, opacity: 0, duration: 0.7, ease: "power2.in" }, 17.7);
  // "poori deg nahi chakhte" → "bas ek chamach se" → "pata chal jata hai"
  const no = chip(kitchen, { left: 640, top: 420, borderColor: C.red, color: C.red }, "POORI DEG NAHI ✗");
  fadeUp(no, 17.2, 0.35, 20); out(no, 18.3, 0.2);
  const yes = chip(kitchen, { left: 640, top: 420 }, "SIRF EK CHAMACH ✓");
  fadeUp(yes, 18.66, 0.35, 20); out(yes, 20.1, 0.2);
  const got = chip(kitchen, { left: 640, top: 420 }, "PATA CHAL GAYA ✓");
  fadeUp(got, 20.32, 0.35, 20);
  // the tablespoon: comes down, dips into the biryani, stirs once, lifts a taste
  const sp = q3(".spoon");
  tl.set(q3(".taste"), { opacity: 0 }, 0);
  tl.fromTo(sp, { y: -360, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: "power3.out" }, 18.44);
  tl.to(sp, { x: -16, duration: 0.15, ease: "sine.inOut" }, 18.96).to(sp, { x: 16, duration: 0.2, ease: "sine.inOut" }, 19.11).to(sp, { x: 0, duration: 0.15, ease: "sine.inOut" }, 19.31);
  tl.to(q3(".taste"), { opacity: 1, duration: 0.12 }, 19.4);
  tl.to(sp, { y: -150, duration: 0.55, ease: "power2.inOut" }, 19.5);
  const aap3 = who(kitchen, "aap", 650, 980, 400, { expr: "smile", gesture: "none" });
  fadeUp(aap3, 17.0, 0.45, 30); life(aap3, 17.0, 25.4, "smile", 31);
  react.joy(aap3, 21.32, { gesture: "none", face: "grinOpen" });
  // "KSE-100 bhi PSX ka wohi chamach hai"
  out(h3, 22.5, 0.2); out(got, 22.5, 0.2);
  const h3b = kin(s3, "KSE-100 = | PSX KA *CHAMACH*", { y: 120, size: 84 }); charsIn.rise(h3b, 22.68, 0.02);
  const kTag = el(kitchen, { left: 400, top: 470, padding: "10px 22px", borderRadius: 14, background: C.g, color: C.ink, font: "800 40px Manrope", whiteSpace: "nowrap" }, "KSE-100");
  fadeUp(kTag, 22.9, 0.35, 16);
  OV.push(no, yes, got);

  // ═══ S4 25.48–39.16: 500+ listed → the 100 biggest (banks, oil, cement, fertilizer) → one number ═══
  const s4 = scene(25.48, 39.16);
  const h4 = kin(s4, "PSX PAR *500+* COMPANIES", { y: 160, size: 84 }); charsIn.rise(h4, 26.98, 0.02);
  const grid = el(s4, { left: 93, top: 340, width: 894, height: 714 });
  const tiles = Array.from({ length: 500 }, (_, i) => el(grid, { left: (i % 25) * 36, top: Math.floor(i / 25) * 36, width: 30, height: 30, borderRadius: 7, background: "#D9E0DB" }));
  tl.fromTo(tiles, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: "power2.out", stagger: { each: 0.0024, from: "start" } }, 25.7);
  const dir = chip(s4, { left: 290, top: 1110 }, "MARKET KI DIRECTION: ▲ YA ▼ ?");
  fadeUp(dir, 30.08, 0.35, 20); out(dir, 32.9, 0.25);
  const top100 = tiles.slice(0, 100), rest = tiles.slice(100);
  out(h4, 31.0, 0.2);
  const h4b = kin(s4, "*100* SAB SE BARI", { y: 160, size: 92 }); charsIn.rise(h4b, 31.2, 0.02);
  tl.to(top100, { backgroundColor: C.g, duration: 0.25, ease: "power1.out", stagger: 0.007 }, 31.2);
  tl.to(rest, { opacity: 0.3, duration: 0.4 }, 32.4);
  const SECT = [
    ["BANKS", 33.68, `<path d="M20,70 L110,22 L200,70Z" fill="#fff" ${S}/>${[46, 88, 132, 174].map((x) => `<rect x="${x - 9}" y="80" width="18" height="70" fill="#fff" stroke="#0B0F14" stroke-width="6"/>`).join("")}<rect x="20" y="150" width="180" height="22" fill="${C.g}" ${S}/>`],
    ["OIL", 34.38, `<rect x="56" y="40" width="108" height="132" rx="14" fill="#fff" ${S}/><path d="M56,80 h108 M56,132 h108" ${S}/><path d="M110,92 c-14,18 -14,30 0,30 c14,0 14,-12 0,-30Z" fill="${C.g}" stroke="#0B0F14" stroke-width="5"/>`],
    ["CEMENT", 34.86, `<path d="M44,52 q66,-22 132,0 l10,110 q-76,20 -152,0Z" fill="#fff" ${S}/><path d="M60,92 h100" ${S}/><rect x="80" y="104" width="60" height="30" rx="6" fill="${C.g}" stroke="#0B0F14" stroke-width="5"/>`],
    ["FERTILIZER", 35.48, `<path d="M50,64 h120 l-8,110 h-104Z" fill="#fff" ${S}/><path d="M110,150 V96" ${S}/><path d="M110,112 c-30,-6 -36,-30 -30,-44 c24,4 32,24 30,44Z M110,104 c26,-10 32,-30 26,-42 c-22,6 -28,24 -26,42Z" fill="${C.g}" stroke="#0B0F14" stroke-width="5"/>`],
  ].map(([lab, t, art], i) => {
    const b = card(s4, { left: 45 + i * 255, top: 1210, width: 225, height: 270, borderRadius: 26 });
    el(b, { left: 2, top: 20, width: 220, height: 190 }, `<svg viewBox="0 0 220 190" width="220" height="190">${art}</svg>`);
    txt(b, { left: 0, top: 214, width: 225, textAlign: "center", font: "800 28px Manrope" }, lab);
    fadeUp(b, t - 0.1, 0.4, 30); return b;
  });
  // "unki performance ek number mein jama": the 100 green tiles gather into one number
  out(SECT, 37.2, 0.3); out(rest, 37.0, 0.3); out(h4b, 36.9, 0.2);
  // the 25×4 band regroups into a 10×10 block at the centre (100 companies = one block), then becomes the number card
  tl.to(top100, { x: (i) => 447 - 180 + (i % 10) * 36 - (i % 25) * 36, y: (i) => 370 - 180 + Math.floor(i / 10) * 36 - Math.floor(i / 25) * 36,
    duration: 0.6, ease: "power3.inOut" }, 37.36);
  tl.to(top100, { scale: 0.6, opacity: 0, duration: 0.25, ease: "power2.in" }, 38.0);
  const one = card(s4, { left: 190, top: 560, width: 700, height: 300 });
  txt(one, { left: 0, top: 46, width: 700, textAlign: "center", font: "800 36px Manrope", color: C.mute, letterSpacing: ".1em" }, "100 COMPANIES → EK NUMBER");
  txt(one, { left: 0, top: 120, width: 700, textAlign: "center", font: "700 104px 'IBM Plex Mono'" }, f2(K100.level).split(".")[0]);
  tl.fromTo(one, { scale: 0.6, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.45, ease: "power3.out" }, 38.04);
  OV.push(one);

  // ═══ S5 39.16–43.18: "Karachi Stock Exchange 100 — yani KSE-100" (live level, 27 Oct) ═══
  const s5 = scene(39.16, 43.18);
  const kc = card(s5, { left: 70, top: 170, width: 940, height: 520 });
  const kLab = txt(kc, { left: 48, top: 42, font: "800 34px Manrope", color: C.mute, letterSpacing: ".1em" }, "EK NUMBER");
  txt(kc, { left: 48, top: 96, font: "700 92px 'IBM Plex Mono'" }, f2(K100.level));
  txt(kc, { left: 48, top: 212, font: "700 36px 'IBM Plex Mono'", color: C.gt }, `▲ +${f2(K100.change_points)} (+${K100.change_pct.toFixed(2)}%)`);
  txt(kc, { left: 520, top: 220, font: "500 26px Inter", color: C.mute }, "27 Oct 2026 · 11:44 AM · PSX");
  const kl = line(kc, [[0, 0.3], [0.1, 0.38], [0.2, 0.34], [0.3, 0.48], [0.4, 0.44], [0.5, 0.58], [0.6, 0.54], [0.7, 0.68], [0.8, 0.64], [0.9, 0.8], [1, 0.88]],
    { x: 48, y: 290, w: 844, h: 190, color: C.g2, grid: true, rows: 2 });
  fadeUp(kc, 39.2, 0.4, 30); kl.draw(39.5, 1.2);
  const NAME = [["K", "ARACHI", 39.52], ["S", "TOCK", 39.98], ["E", "XCHANGE", 40.22], ["100", "", 40.66]];
  const rests = NAME.map(([a, b, t], i) => {
    const row = el(s5, { left: 0, top: 780 + i * 112, width: 1080, textAlign: "center", font: "800 96px/1 Manrope", letterSpacing: "-.03em", color: C.text, whiteSpace: "nowrap" },
      `<span style="color:${C.gt}">${a}</span><span class="rest">${b}</span>`);
    fadeUp(row, t, 0.35, 24); return row.querySelector(".rest");
  });
  tl.to(rests, { opacity: 0.2, duration: 0.35 }, 41.3);
  const eq = el(s5, { left: 290, top: 1270, width: 500, height: 150, borderRadius: 28, background: C.g, color: C.ink, font: "800 96px/150px Manrope", textAlign: "center", letterSpacing: "-.03em" }, "KSE-100");
  tl.fromTo(eq, { scale: 0.7, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, ease: "power3.out" }, 41.5);
  swap(kLab, "KSE-100 INDEX", 41.5);
  OV.push(kc, eq);

  // ═══ S6 43.18–51.02: other indices exist, but KSE-100 is the one everyone watches — it covers the top 100 ═══
  const s6 = scene(43.18, 51.02);
  const h6 = kin(s6, "PSX KE *INDICES*", { y: 170, size: 96 }); charsIn.rise(h6, 43.52, 0.02);
  const IDX = [["KSE-100", "KSE100"], ["KSE-30", "KSE30"], ["KMI-30", "KMI30"], ["ALL SHARE", "ALLSHR"]];
  const ic = IDX.map(([name, key], i) => {
    const d = IX[key] || { level: 0, change_pct: 0 };
    const b = card(s6, { left: 50 + (i % 2) * 510, top: 380 + Math.floor(i / 2) * 260, width: 470, height: 230, borderRadius: 28 });
    txt(b, { left: 34, top: 28, font: "800 40px Manrope" }, name);
    txt(b, { left: 34, top: 92, font: "700 52px 'IBM Plex Mono'" }, f2(d.level));
    txt(b, { left: 34, top: 162, font: "700 30px 'IBM Plex Mono'", color: C.gt }, `▲ +${d.change_pct.toFixed(2)}%`);
    fadeUp(b, 44.56 + i * 0.12, 0.4, 30); return b;
  });
  tl.to(ic.slice(1), { opacity: 0.35, duration: 0.4 }, 45.84);
  tl.to(ic[0], { borderColor: C.g, borderWidth: 6, duration: 0.3 }, 45.84);
  const most = chip(s6, { left: 160, top: 930, background: C.ink, borderColor: C.ink, color: "#fff" },
    `<svg viewBox="0 0 60 36" width="54" height="32" style="vertical-align:-5px;margin-right:12px"><path d="M4,18 Q30,-8 56,18 Q30,44 4,18Z" fill="none" stroke="#fff" stroke-width="5"/><circle cx="30" cy="18" r="8" fill="${C.g}"/></svg>SAB SE ZYADA DEKHA JATA HAI`);
  fadeUp(most, 47.38, 0.35, 20);
  const pub = ["sana", "bilal", "zara", "usman", "ayesha", "aap"].map((n, i) => { const w = who(s6, n, 8 + i * 177, 1230, 190, { expr: "smile", gesture: "none" }); fadeUp(w, 47.0 + i * 0.06, 0.4, 30); return w; });
  pub.forEach((w, i) => life(w, 47.2, 51, "smile", 40 + i));
  const cov = chip(s6, { left: 150, top: 1050 }, "✓ COVERS MARKET KI TOP 100 COMPANIES");
  fadeUp(cov, 49.14, 0.35, 20);
  OV.push(...ic, most, cov);

  // ═══ S7 51.02–62: CTA → FloStocks icon → logo → disclaimer ═══
  const s7 = scene(51.02, 60, { push: false });
  const c1 = kin(s7, "MARKET KE TERMS", { y: 560, size: 100 }); const c2 = kin(s7, "*AASAAN* ZUBAAN MEIN", { y: 700, size: 86 });
  charsIn.rise(c1, 51.6, 0.02); charsIn.rise(c2, 52.68, 0.02);
  tl.to([c1, c2], { y: -40, opacity: 0, duration: 0.3, ease: "power2.in" }, 54.0);
  const cta = ctaLogo(s7, 54.4, { tDisc: 55.8 });
  OV.push(cta.fl);

  K.linkScenes();
  OV.forEach((e) => e && e.setAttribute("data-ov", ""));
  tl.seek(0);
})();
