// "What are Blue Chips?" — 60 Seconds Investor EP 04. Cue times = word starts in videos/what-are-blue-chips/edit/vo.words.json
// (VO = "Okay, so" cut, pause-tightened, studio-polished; see videos/what-are-blue-chips/prep_vo.py).
// New cast (client picks): cousin (B, deep-green blazer), batsman (helmet + Pakistan-style kit, gesture "bat").
(function () {
  const { C, tl, el, scene, kin, charsIn, who, react, life, talk, line, swap, ctaLogo } = K;
  const X = CAST.expr;
  const BLUE = "#1E6FD9", BLUE_D = "#124A99";
  const card = (p, css) => el(p, Object.assign({ background: "#fff", borderRadius: 32, border: "2px solid #E3E9E5", boxShadow: "0 24px 50px rgba(20,40,20,.10)" }, css));
  const txt = (p, css, html) => el(p, Object.assign({ font: "700 40px Manrope", color: C.text, whiteSpace: "nowrap" }, css), html);
  const fadeUp = (e, t, d = 0.45, y = 40) => tl.fromTo(e, { y, opacity: 0 }, { y: 0, opacity: 1, duration: d, ease: "power3.out" }, t);
  const out = (e, t, d = 0.25) => tl.to(e, { opacity: 0, duration: d, ease: "power2.in" }, t);
  const chip = (p, css, html) => el(p, Object.assign({ padding: "12px 26px", borderRadius: 999, background: "#fff", border: `4px solid ${C.g}`,
    font: "800 34px Manrope", color: C.text, whiteSpace: "nowrap" }, css), html);
  const S = `stroke="#0B0F14" stroke-width="8" stroke-linejoin="round" stroke-linecap="round"`;
  const art = (p, css, w, h, inner) => el(p, css, `<svg viewBox="0 0 ${w} ${h}" width="${css.width}" height="${css.height}" style="overflow:visible">${inner}</svg>`);
  const OV = [];

  // ═══ S1 HOOK 0–7.94: cousin: "Main toh sirf blue chip companies mein invest karta hoon" → Aap: company blue kab se? ═══
  const s1 = scene(0, 7.94, { push: 1.02 });
  const bub = card(s1, { left: 50, top: 560, width: 620, height: 250, borderRadius: 30, border: `4px solid ${C.ink}` });
  const bt = txt(bub, { left: 36, top: 30, width: 548, whiteSpace: "normal", font: "700 44px/1.3 Manrope" },
    `“Main toh sirf <span class="bc" style="color:${C.text}">blue chip</span> companies mein invest karta hoon.”`);
  el(bub, { left: 250, top: 242, width: 0, height: 0, borderLeft: "26px solid transparent", borderRight: "26px solid transparent", borderTop: `30px solid ${C.ink}` });
  fadeUp(bub, 0.1, 0.4, 20);
  tl.to(bt.querySelector(".bc"), { color: BLUE, duration: 0.25 }, 1.62);
  // the cousin and Aap sit together on the sofa (client note); cousin has nothing in his hands
  const lounge = el(s1, { left: 0, top: 0, width: 1080, height: 1920 }); lounge.setAttribute("data-ov-group", "");
  const SOFA_ARMS = `<rect x="0" y="120" width="130" height="230" rx="44" fill="#fff" ${S}/><rect x="810" y="120" width="130" height="230" rx="44" fill="#fff" ${S}/>`;
  const sofaBack = art(lounge, { left: 70, top: 1080, width: 940, height: 360 }, 940, 360,
    `<rect x="60" y="0" width="820" height="250" rx="54" fill="#DDF3D2" ${S}/><path d="M470,20 V240" stroke="#BFE5AE" stroke-width="8" stroke-linecap="round"/>${SOFA_ARMS}`);
  const cz = who(lounge, "cousin", 140, 880, 440, { expr: "smile", gesture: "none" });
  fadeUp(cz, 0.05, 0.45, 30); life(cz, 0.1, 7.9, "smile", 81);
  talk(cz, [0.92, 1.18, 1.42, 1.62, 1.9, 2.06, 2.46, 2.58, 2.9, 3.24], "smile");
  const aap = who(lounge, "aap", 540, 880, 440, { expr: "smile", gesture: "none" });
  fadeUp(aap, 0.12, 0.45, 30); life(aap, 0.2, 7.9, "smile", 82);
  const sofa = art(lounge, { left: 70, top: 1080, width: 940, height: 360 }, 940, 360,
    `<rect x="100" y="210" width="740" height="110" rx="28" fill="#fff" ${S}/><path d="M470,214 V316" stroke="#E3E9E5" stroke-width="6"/>${SOFA_ARMS}
     <path d="M160,320 v32 M780,320 v32" ${S}/>`);
  tl.fromTo([sofaBack, sofa], { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, ease: "power3.out" }, 0);
  X(tl, aap.av, "puzzled", 3.76); K.pose(aap, 3.76, { h: [9, -4, 4], b: [1, 1] }, 0.4);
  // thought cloud: a company building that turns blue ("company ka rang blue kab se ho gaya?")
  const th = art(s1, { left: 690, top: 540, width: 360, height: 270 }, 480, 360,
    `<path d="M70,250 C10,250 10,170 70,160 C60,90 150,60 190,100 C220,40 320,40 340,100 C400,80 460,130 430,190 C480,220 450,290 390,280 C370,330 290,330 260,300 C220,340 130,330 120,290 C100,300 70,290 70,250Z" fill="#fff" ${S}/>
     <circle cx="430" cy="320" r="14" fill="#fff" ${S}/><circle cx="462" cy="352" r="8" fill="#fff" stroke="#0B0F14" stroke-width="6"/>
     <g class="bld"><rect x="170" y="110" width="140" height="160" rx="8" fill="#fff" ${S}/>
     ${[0, 1, 2].map((r) => [0, 1].map((c) => `<rect x="${196 + c * 56}" y="${132 + r * 40}" width="32" height="24" rx="4" fill="#E3F1F4" stroke="#0B0F14" stroke-width="5"/>`).join("")).join("")}</g>
     <text class="q" x="350" y="160" font-family="Manrope" font-weight="800" font-size="76" fill="${BLUE}">?</text>`);
  fadeUp(th, 4.66, 0.4, 20);
  tl.set(th.querySelector(".q"), { opacity: 0 }, 0);
  tl.to(th.querySelector(".bld rect"), { fill: BLUE, duration: 0.35 }, 5.3);
  tl.to(th.querySelector(".q"), { opacity: 1, duration: 0.2 }, 5.5);
  const q = kin(s1, "BLUE CHIP | AAKHIR HAIN *KIA?*", { y: 1500, size: 92 });
  q.chars.slice(0, 4).forEach((c) => (c.style.color = BLUE));
  charsIn.rise(q, 6.7, 0.02);
  OV.push(bub, th);

  // ═══ S2 7.94–13.14: 60 Seconds Investor series card (approved stopwatch) ═══
  const s2 = scene(7.94, 13.14);
  const sc2 = K.seriesCard(s2, 8.0, { tSweep: 8.56, tTitle: 8.92, tSeries: 9.74, tTag: 10.64, tEp: 11.7, ep: "EP 04 · WHAT ARE BLUE CHIPS" });
  OV.push(sc2.watch);

  // ═══ S3 13.14–23.30: the senior batsman — 30-40 runs every match; not always 100, but the team trusts him ═══
  const s3 = scene(13.14, 23.3);
  const h3 = kin(s3, "TEAM KA *SENIOR BATSMAN*", { y: 150, size: 80 }); charsIn.rise(h3, 14.4, 0.02);
  const bat = who(s3, "batsman", 10, 560, 600, { expr: "smile", gesture: "bat" });
  fadeUp(bat, 13.3, 0.5, 40); life(bat, 13.4, 23.2, "smile", 83);
  const sc = [["MATCH 1", "35", 16.16], ["MATCH 2", "42", 16.66], ["MATCH 3", "31", 17.08], ["MATCH 4", "38", 17.58]].map(([m, r, t], i) => {
    const b = card(s3, { left: 640, top: 400 + i * 120, width: 380, height: 100, borderRadius: 22 });
    txt(b, { left: 28, top: 30, font: "800 30px Manrope", color: C.mute }, m);
    txt(b, { left: 210, top: 18, font: "700 54px 'IBM Plex Mono'", color: C.gt }, r);
    txt(b, { left: 290, top: 34, font: "600 24px Inter", color: C.mute }, "runs");
    fadeUp(b, t, 0.35, 20); return b;
  });
  const cent = chip(s3, { left: 640, top: 900, borderColor: C.mute, color: C.mute }, "HAR BAAR 100? NAHI");
  fadeUp(cent, 19.28, 0.35, 16);
  const tough = card(s3, { left: 60, top: 1210, width: 960, height: 150, borderRadius: 26, border: `4px solid ${C.red}` });
  txt(tough, { left: 40, top: 46, font: "800 40px Manrope", color: C.red }, "MUSHKIL WAQT");
  txt(tough, { left: 540, top: 34, font: "700 64px 'IBM Plex Mono'" }, "45/4");
  fadeUp(tough, 20.56, 0.4, 24);
  const trust = chip(s3, { left: 200, top: 1420, background: C.g, borderColor: C.g }, "POORI TEAM KA BHAROSA ✓");
  fadeUp(trust, 22.36, 0.35, 20);
  X(tl, bat.av, "grinOpen", 22.36); K.pose(bat, 22.36, { h: [-4, 0, -10], b: [1.03, 0.99] }, 0.3);
  OV.push(...sc, cent, tough, trust);

  // ═══ S4 23.30–26.48: "stock market mein aisi companies ko kehte hain blue chip" ═══
  const s4 = scene(23.3, 26.48);
  const h4 = kin(s4, "STOCK MARKET MEIN", { y: 300, size: 92 }); charsIn.rise(h4, 23.36, 0.02);
  // the analogy, no poker chip (client note): senior batsman = a steady, trusted company
  const bat4 = who(s4, "batsman", 30, 520, 400, { expr: "smile", gesture: "bat" });
  fadeUp(bat4, 23.4, 0.45, 30); life(bat4, 23.5, 26.4, "smile", 84);
  const eq = el(s4, { left: 430, top: 660, width: 90, textAlign: "center", font: "800 110px/1 Manrope", color: C.mute }, "=");
  fadeUp(eq, 24.1, 0.3, 14);
  const big = card(s4, { left: 540, top: 470, width: 490, height: 520, border: `5px solid ${BLUE}` });
  art(big, { left: 40, top: 40, width: 150, height: 150 }, 160, 160,
    `<rect x="40" y="20" width="80" height="120" rx="6" fill="#fff" ${S}/><rect x="10" y="60" width="40" height="80" rx="6" fill="#E3F1F4" ${S}/><rect x="110" y="50" width="40" height="90" rx="6" fill="#E3F1F4" ${S}/>${[0, 1, 2].map((r) => `<rect x="60" y="${38 + r * 30}" width="40" height="16" rx="3" fill="${BLUE}"/>`).join("")}`);
  el(big, { left: 220, top: 70, padding: "8px 18px", borderRadius: 14, background: BLUE, color: "#fff", font: "800 30px Manrope", whiteSpace: "nowrap" }, "BLUE CHIP");
  txt(big, { left: 220, top: 128, font: "600 26px Inter", color: C.mute }, "company");
  const bl = K.candles(big, { x: 30, y: 220, w: 330, h: 210, n: 14, start: 0.12, grid: true, axis: ["520", "460", "400"],
    trend: (p, r) => 0.055 + (r() - 0.5) * 0.14 });
  ["JAN", "MAY", "SEP"].forEach((m, i) => txt(big, { left: 36 + i * 130, top: 446, font: "600 22px 'IBM Plex Mono'", color: C.mute }, m));
  tl.fromTo(big, { x: 60, opacity: 0 }, { x: 0, opacity: 1, duration: 0.45, ease: "power3.out" }, 24.1);
  bl.grow(24.4, 0.05);
  const h4b = kin(s4, "*BLUE* *CHIP* COMPANIES", { y: 1110, size: 96, accent: BLUE }); charsIn.rise(h4b, 25.4, 0.02);
  OV.push(big);

  // ═══ S5 26.48–33.74: bari, mazboot, purani, stable business, regular dividend ═══
  const s5 = scene(26.48, 33.74);
  const h5 = kin(s5, "*BLUE* *CHIP* KAUN?", { y: 150, size: 96, accent: BLUE }); charsIn.rise(h5, 26.52, 0.02);
  const TR = [
    ["BARI", 27.32, `<rect x="40" y="20" width="80" height="120" rx="6" fill="#fff" ${S}/><rect x="10" y="60" width="40" height="80" rx="6" fill="#E3F1F4" ${S}/><rect x="110" y="50" width="40" height="90" rx="6" fill="#E3F1F4" ${S}/>${[0, 1, 2].map((r) => `<rect x="60" y="${38 + r * 30}" width="40" height="16" rx="3" fill="${BLUE}"/>`).join("")}`],
    ["MAZBOOT", 27.9, `<path d="M80,12 L140,34 V80 C140,118 112,140 80,150 C48,140 20,118 20,80 V34Z" fill="${BLUE}" ${S}/><path d="M54,82 L74,102 L110,62" fill="none" stroke="#fff" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>`],
    ["PURANI", 28.6, `<rect x="20" y="26" width="120" height="114" rx="14" fill="#fff" ${S}/><rect x="20" y="26" width="120" height="34" rx="10" fill="${BLUE}" ${S}/><text x="80" y="118" text-anchor="middle" font-family="Manrope" font-weight="800" font-size="44" fill="#0B0F14">50+</text>`],
    ["STABLE BUSINESS", 30.44, `<path d="M10,120 L45,104 L80,96 L115,80 L150,64" fill="none" stroke="${C.g2}" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/><path d="M10,140 H150" ${S}/><circle cx="150" cy="64" r="10" fill="${C.g}" stroke="#0B0F14" stroke-width="5"/>`],
  ].map(([lab, t, a], i) => {
    const b = card(s5, { left: 50 + (i % 2) * 510, top: 330 + Math.floor(i / 2) * 290, width: 470, height: 260, borderRadius: 28 });
    art(b, { left: 34, top: 50, width: 160, height: 160 }, 160, 160, a);
    txt(b, { left: 214, top: 106, font: "800 38px Manrope", whiteSpace: "normal", width: 230, lineHeight: "1.1" }, lab);
    fadeUp(b, t, 0.4, 24); return b;
  });
  const dv = card(s5, { left: 50, top: 930, width: 980, height: 190, borderRadius: 28, border: `4px solid ${C.g}` });
  art(dv, { left: 40, top: 40, width: 110, height: 110 }, 100, 100, `<circle cx="50" cy="50" r="44" fill="#FFD95A" ${S}/><circle cx="50" cy="50" r="30" fill="#F2B526"/><text x="50" y="62" text-anchor="middle" font-family="Manrope" font-weight="800" font-size="32" fill="#5A3B00">Rs</text>`);
  txt(dv, { left: 180, top: 46, font: "800 42px Manrope" }, "AKSAR REGULAR DIVIDEND");
  txt(dv, { left: 180, top: 104, font: "500 28px Inter", color: C.mute }, "munafe mein se hissa, saal ba saal");
  fadeUp(dv, 32.36, 0.4, 24);
  OV.push(...TR, dv);

  // ═══ S6 33.74–39.28: market cap zyada → KSE-100 par bara asar ═══
  const s6 = scene(33.74, 39.28);
  const h6 = kin(s6, "MARKET CAP *ZYADA*", { y: 150, size: 96 }); charsIn.rise(h6, 34.1, 0.02);
  const mc = card(s6, { left: 60, top: 330, width: 960, height: 560 });
  txt(mc, { left: 40, top: 30, font: "800 30px Manrope", color: C.mute, letterSpacing: ".06em" }, "COMPANY KI MARKET VALUE");
  const bars = [[330, BLUE, "BLUE CHIP"], [120, "#C9D3CD", ""], [90, "#C9D3CD", ""], [150, "#C9D3CD", ""], [70, "#C9D3CD", ""], [110, "#C9D3CD", ""]].map(([h, c, lab], i) => {
    const b = el(mc, { left: 60 + i * 150, top: 500 - h, width: 110, height: h, borderRadius: "14px 14px 0 0", background: c, border: `4px solid ${C.ink}`, transformOrigin: "50% 100%" });
    tl.fromTo(b, { scaleY: 0 }, { scaleY: 1, duration: 0.5, ease: "power3.out", immediateRender: false }, 34.52 + i * 0.06);
    tl.set(b, { scaleY: 0 }, 0);
    if (lab) { const l = txt(mc, { left: 30 + i * 150, top: 500 - h - 52, width: 170, textAlign: "center", font: "800 26px Manrope", color: BLUE }, lab); fadeUp(l, 34.9, 0.3, 10); }
    return b;
  });
  el(mc, { left: 40, top: 500, width: 880, height: 6, borderRadius: 3, background: C.ink });
  fadeUp(mc, 34.1, 0.4, 30);
  const kx = card(s6, { left: 60, top: 940, width: 960, height: 300 });
  txt(kx, { left: 40, top: 30, font: "800 40px Manrope" }, "KSE-100 INDEX");
  const seg = el(kx, { left: 40, top: 110, width: 880, height: 70, borderRadius: 16, overflow: "hidden", border: `4px solid ${C.ink}`, background: "#E3E9E5" });
  const segB = el(seg, { left: 0, top: 0, width: 440, height: 70, background: BLUE, transformOrigin: "0% 50%" });
  txt(seg, { left: 24, top: 14, font: "800 32px Manrope", color: "#fff" }, "BARI COMPANIES");
  txt(kx, { left: 40, top: 210, font: "500 28px Inter", color: C.mute }, "index ki chaal mein in ka wazan zyada");
  fadeUp(kx, 36.58, 0.4, 30);
  tl.fromTo(segB, { scaleX: 0 }, { scaleX: 1, duration: 0.6, ease: "power2.out", immediateRender: false }, 37.0); tl.set(segB, { scaleX: 0 }, 0);
  const asar = chip(s6, { left: 340, top: 1300, background: C.ink, borderColor: C.ink, color: "#fff" }, "BARA ASAR");
  fadeUp(asar, 38.14, 0.35, 16);
  OV.push(mc, kx, asar);

  // ═══ S7 39.28–46.04: banks, oil, fertilizer, cement — many big companies in this category (examples only) ═══
  const s7 = scene(39.28, 46.04);
  const h7 = kin(s7, "PSX PAR *KAHAN?*", { y: 150, size: 96 }); charsIn.rise(h7, 39.4, 0.02);
  const SECT = [
    ["BANKS", "HBL · MCB · UBL", 40.56, `<path d="M20,70 L110,22 L200,70Z" fill="#fff" ${S}/>${[46, 88, 132, 174].map((x) => `<rect x="${x - 9}" y="80" width="18" height="70" fill="#fff" stroke="#0B0F14" stroke-width="6"/>`).join("")}<rect x="20" y="150" width="180" height="22" fill="${C.g}" ${S}/>`],
    ["OIL", "OGDC · PPL · PSO", 41.2, `<rect x="56" y="40" width="108" height="132" rx="14" fill="#fff" ${S}/><path d="M56,80 h108 M56,132 h108" ${S}/><path d="M110,92 c-14,18 -14,30 0,30 c14,0 14,-12 0,-30Z" fill="${C.g}" stroke="#0B0F14" stroke-width="5"/>`],
    ["FERTILIZER", "FFC · ENGRO", 41.64, `<path d="M110,150 V30" ${S}/><path d="M110,76 c-36,-2 -50,-28 -46,-50 c30,0 46,24 46,50Z M110,58 c32,-8 46,-32 40,-50 c-28,4 -42,26 -40,50Z" fill="${C.g}" stroke="#0B0F14" stroke-width="5" stroke-linejoin="round"/><path d="M60,112 h100 l-8,64 h-84Z" fill="#fff" ${S}/><path d="M74,138 h72" stroke="${C.g}" stroke-width="10" stroke-linecap="round"/>`],
    ["CEMENT", "LUCK · DGKC", 42.52, `<path d="M44,52 q66,-22 132,0 l10,110 q-76,20 -152,0Z" fill="#fff" ${S}/><path d="M60,92 h100" ${S}/><rect x="80" y="104" width="60" height="30" rx="6" fill="${C.g}" stroke="#0B0F14" stroke-width="5"/>`],
  ].map(([lab, eg, t, a], i) => {
    const b = card(s7, { left: 50 + (i % 2) * 510, top: 330 + Math.floor(i / 2) * 400, width: 470, height: 370, borderRadius: 28 });
    art(b, { left: 125, top: 26, width: 220, height: 190 }, 220, 190, a);
    txt(b, { left: 0, top: 226, width: 470, textAlign: "center", font: "800 38px Manrope" }, lab);
    txt(b, { left: 0, top: 282, width: 470, textAlign: "center", font: "600 28px 'IBM Plex Mono'", color: C.mute }, eg);
    const tag = el(b, { left: 300, top: 22, padding: "6px 14px", borderRadius: 12, background: BLUE, color: "#fff", font: "800 22px Manrope", whiteSpace: "nowrap" }, "BLUE CHIP");
    fadeUp(b, t - 0.1, 0.4, 24);
    tl.fromTo(tag, { scale: 0.6, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: "power2.out", immediateRender: false }, 44.7 + i * 0.1); tl.set(tag, { opacity: 0 }, 0);
    return b;
  });
  const note = el(s7, { left: 0, top: 1150, width: 1080, textAlign: "center", font: "500 28px Inter", color: C.mute }, "naam sirf misaal hain, recommendation nahi");
  fadeUp(note, 43.2, 0.3, 10);
  OV.push(...SECT);

  // ═══ S8 46.04–51.64: blue chip ≠ guaranteed profit — prices still go up and down ═══
  const s8 = scene(46.04, 51.64);
  const h8 = kin(s8, "GUARANTEED | *FAIDA* NAHI", { y: 150, size: 96, accent: C.red }); charsIn.rise(h8, 46.36, 0.02);
  const pc = card(s8, { left: 60, top: 450, width: 960, height: 560 });
  txt(pc, { left: 40, top: 30, font: "800 32px Manrope", color: C.mute }, "BLUE CHIP · SHARE PRICE");
  const pl = K.candles(pc, { x: 40, y: 100, w: 760, h: 360, n: 22, start: 0.28, grid: true, axis: ["Rs 420", "Rs 390", "Rs 360", "Rs 330"],
    trend: (p, r) => Math.sin(p * 9.5) * 0.09 + (r() - 0.5) * 0.12 });
  ["JUN", "JUL", "AUG", "SEP", "OCT", "NOV"].forEach((m, i) => txt(pc, { left: 46 + i * 128, top: 482, font: "600 22px 'IBM Plex Mono'", color: C.mute }, m));
  fadeUp(pc, 48.94, 0.4, 30); pl.grow(49.2, 0.05);
  const up = chip(s8, { left: 140, top: 1080, borderColor: C.g, color: C.gt }, "▲ UPAR");
  const dn = chip(s8, { left: 600, top: 1080, borderColor: C.red, color: C.red }, "▼ NEECHE");
  fadeUp(up, 50.22, 0.3, 16); fadeUp(dn, 50.54, 0.3, 16);
  OV.push(pc, up, dn);

  // ═══ S9 51.64–61: CTA → FloStocks icon → logo → disclaimer ═══
  const s9 = scene(51.64, 61, { push: false });
  const t1 = kin(s9, "MARKET KE TERMS", { y: 560, size: 100 }); const t2 = kin(s9, "*AASAAN* ZUBAAN MEIN", { y: 700, size: 86 });
  charsIn.rise(t1, 52.7, 0.02); charsIn.rise(t2, 53.66, 0.02);
  tl.to([t1, t2], { y: -40, opacity: 0, duration: 0.3, ease: "power2.in" }, 55.0);
  const cta = ctaLogo(s9, 55.4, { tDisc: 57.0 });
  OV.push(cta.fl);

  K.linkScenes();
  OV.forEach((e) => e && e.setAttribute("data-ov", ""));
  tl.seek(0);
})();
