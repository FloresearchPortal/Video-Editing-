// "What is REIT?" — 60 Seconds Investor EP 06. Cue times = word starts in videos/what-is-reit/edit/vo.words.json
// (VO = leading breath cut, tight pauses that keep every word, studio chain; see videos/what-is-reit/prep_vo.py).
// Cast: bilal (the dost) + aap, both already approved. Rupee amounts / unit counts are illustrations.
(function () {
  const { C, tl, el, scene, kin, charsIn, who, react, life, talk, line, swap, ctaLogo } = K;
  const X = CAST.expr;
  const card = (p, css) => el(p, Object.assign({ background: "#fff", borderRadius: 32, border: "2px solid #E3E9E5", boxShadow: "0 24px 50px rgba(20,40,20,.10)" }, css));
  const txt = (p, css, html) => el(p, Object.assign({ font: "700 40px Manrope", color: C.text, whiteSpace: "nowrap" }, css), html);
  const fadeUp = (e, t, d = 0.45, y = 40) => tl.fromTo(e, { y, opacity: 0 }, { y: 0, opacity: 1, duration: d, ease: "power3.out" }, t);
  const out = (e, t, d = 0.2) => tl.to(e, { opacity: 0, duration: d, ease: "power2.in" }, t);
  const chip = (p, css, html) => el(p, Object.assign({ padding: "12px 26px", borderRadius: 999, background: "#fff", border: `4px solid ${C.g}`,
    font: "800 34px Manrope", color: C.text, whiteSpace: "nowrap" }, css), html);
  const bigChip = (p, top, html, css = {}, cx = 540) => {
    const c = chip(p, Object.assign({ left: cx, top, padding: "18px 44px", font: "800 48px Manrope", borderWidth: 5 }, css), html);
    gsap.set(c, { xPercent: -50 }); return c; };
  const S = `stroke="#0B0F14" stroke-width="8" stroke-linejoin="round" stroke-linecap="round"`;
  const art = (p, css, w, h, inner) => el(p, css, `<svg viewBox="0 0 ${w} ${h}" width="${css.width}" height="${css.height}" style="overflow:visible">${inner}</svg>`);
  const COIN = `<circle cx="50" cy="50" r="44" fill="#FFD95A" ${S}/><circle cx="50" cy="50" r="30" fill="#F2B526"/><text x="50" y="62" text-anchor="middle" font-family="Manrope" font-weight="800" font-size="32" fill="#5A3B00">Rs</text>`;
  const BLD = (hl = C.g) => `<rect x="30" y="20" width="140" height="180" rx="8" fill="#fff" ${S}/><rect x="20" y="192" width="160" height="14" rx="4" fill="#0B0F14"/>
     ${[0, 1, 2, 3].map((r) => [0, 1, 2].map((c) => `<rect x="${48 + c * 38}" y="${36 + r * 36}" width="26" height="22" rx="3" fill="${r === 1 && c === 1 ? hl : "#E3F1F4"}" stroke="#0B0F14" stroke-width="4"/>`).join("")).join("")}
     <rect x="86" y="168" width="28" height="32" rx="3" fill="#C98A4B" stroke="#0B0F14" stroke-width="4"/>`;
  const OV = [];

  // ═══ S1 HOOK 0–11.9: dost (Bilal) + Aap on the sofa — "tera bhai property owner ban gaya" → "property khareed li?" → "nahi, REIT mein invest kiya" ═══
  const s1 = scene(0, 11.9, { push: 1.012 });
  const lounge = el(s1, { left: 0, top: 0, width: 1080, height: 1920 }); lounge.setAttribute("data-ov-group", "");
  const ARMS = `<rect x="0" y="120" width="130" height="230" rx="44" fill="#fff" ${S}/><rect x="810" y="120" width="130" height="230" rx="44" fill="#fff" ${S}/>`;
  const sofaBack = art(lounge, { left: 130, top: 1100, width: 820, height: 330 }, 940, 360,
    `<rect x="60" y="0" width="820" height="250" rx="54" fill="#DDF3D2" ${S}/><path d="M470,20 V240" stroke="#BFE5AE" stroke-width="8" stroke-linecap="round"/>${ARMS}`);
  const dost = who(lounge, "bilal", 150, 900, 410, { expr: "smile", gesture: "none" });
  const aap = who(lounge, "aap", 520, 900, 410, { expr: "smile", gesture: "none" });
  const seat = art(lounge, { left: 130, top: 1100, width: 820, height: 330 }, 940, 360,
    `<rect x="100" y="210" width="740" height="110" rx="28" fill="#fff" ${S}/><path d="M470,214 V316" stroke="#E3E9E5" stroke-width="6"/>${ARMS}<path d="M160,320 v32 M780,320 v32" ${S}/>`);
  tl.fromTo([sofaBack, seat, dost, aap], { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, ease: "power3.out", stagger: 0.03 }, 0);
  life(dost, 0.2, 11.8, "smile", 101); life(aap, 0.2, 11.8, "smile", 102);
  // one line at a time (client preference): a single-line bubble, tail pointing at the speaker
  // bubble sized to its one line (client: bigger text, smaller box), centred over the speaker, tail pointing at them
  const say = (html, t0, t1, spk) => {   // bubble centred on the frame; only its tail leans toward the speaker
    const b = el(s1, { left: 540, top: 650, padding: "24px 40px", borderRadius: 30, background: "#fff", border: `4px solid ${C.ink}`, boxShadow: "0 24px 50px rgba(20,40,20,.10)",
      font: "700 50px/1.15 Manrope", color: C.text, whiteSpace: "nowrap" }, html);
    gsap.set(b, { xPercent: -50 });
    el(b, { left: `calc(50% + ${Math.round((spk - 540) * 0.6)}px)`, bottom: -30, marginLeft: -26, width: 0, height: 0, borderLeft: "26px solid transparent", borderRight: "26px solid transparent", borderTop: `30px solid ${C.ink}` });
    fadeUp(b, t0, 0.3, 16); out(b, t1, 0.15); return b; };
  const b1 = say(`“Tera bhai <span style="color:${C.gt}">property owner</span> ban gaya!”`, 0.1, 2.8, 355);
  talk(dost, [1.08, 1.42, 1.76, 2.28, 2.52], "smile");
  const b2 = say("“Tum ne property khareed li?”", 2.98, 4.9, 725);
  talk(aap, [3.76, 4.04, 4.52, 4.8], "smile");
  const b3 = say("“Property nahi khareedi,”", 5.06, 7.5, 355);
  const b3b = say(`“bas <span style="color:${C.gt}">REIT</span> mein invest kiya hai.”`, 7.62, 9.1, 355);
  X(tl, dost.av, "grinOpen", 5.38);                                         // "usne muskura kar kaha"
  talk(dost, [6.38, 6.96, 7.04, 7.68, 8.1, 8.54], "grinOpen");
  X(tl, aap.av, "puzzled", 9.5); K.pose(aap, 9.5, { h: [9, -4, 4], b: [1, 1] }, 0.4);
  const th = art(s1, { left: 545, top: 520, width: 360, height: 300 }, 480, 400,
    `<path d="M70,270 C10,270 10,190 70,180 C60,110 150,80 190,120 C220,60 320,60 340,120 C400,100 460,150 430,210 C480,240 450,310 390,300 C370,350 290,350 260,320 C220,360 130,350 120,310 C100,320 70,310 70,270Z" fill="#fff" ${S}/>
     <circle cx="300" cy="370" r="14" fill="#fff" ${S}/>
     <text x="245" y="238" text-anchor="middle" font-family="Manrope" font-weight="800" font-size="96" letter-spacing="-2" fill="#0B0F14">REIT<tspan fill="${C.gt}">?</tspan></text>`);
  fadeUp(th, 9.74, 0.4, 20);
  const q = kin(s1, "*REIT* AAKHIR | HAI KIA?", { y: 250, size: 92 });
  charsIn.rise(q, 10.72, 0.02);
  OV.push(b1, b2, b3, b3b, th);

  // ═══ S2 11.9–17.02: 60 Seconds Investor series card (approved stopwatch) ═══
  const s2 = scene(11.9, 17.02);
  const sc2 = K.seriesCard(s2, 11.95, { tSweep: 12.54, tTitle: 13.2, tSeries: 13.62, tTag: 14.62, tEp: 15.6, ep: "EP 05 · WHAT IS REIT" });
  OV.push(sc2.watch);

  // ═══ S3 17.02–27.16: a big pizza is hard to buy alone, but anyone can take a slice → pizza = big property, slice = small part ═══
  const s3 = scene(17.02, 27.16);
  const h3 = kin(s3, "EK *BARA* PIZZA", { y: 250, size: 100 }); charsIn.rise(h3, 17.44, 0.02);
  const PEP = "#D9472B";
  const slices = Array.from({ length: 6 }, (_, i) => {
    const a0 = (-90 + 60 * i) * Math.PI / 180, a1 = (-30 + 60 * i) * Math.PI / 180, am = (a0 + a1) / 2, r = 220;
    const p = (a, rr) => `${(250 + rr * Math.cos(a)).toFixed(1)},${(250 + rr * Math.sin(a)).toFixed(1)}`;
    return `<g class="sl" data-i="${i}"><path d="M250,250 L${p(a0, r)} A${r},${r} 0 0 1 ${p(a1, r)} Z" fill="#FFD95A" stroke="#E0A04A" stroke-width="14" stroke-linejoin="round"/>
      <path d="M250,250 L${p(a0, r)} A${r},${r} 0 0 1 ${p(a1, r)} Z" fill="none" stroke="#0B0F14" stroke-width="5" stroke-linejoin="round"/>
      <circle cx="${(250 + 130 * Math.cos(am)).toFixed(1)}" cy="${(250 + 130 * Math.sin(am)).toFixed(1)}" r="20" fill="${PEP}" stroke="#0B0F14" stroke-width="4"/>
      <circle cx="${(250 + 70 * Math.cos(am + 0.3)).toFixed(1)}" cy="${(250 + 70 * Math.sin(am + 0.3)).toFixed(1)}" r="9" fill="${C.g}"/></g>`;
  }).join("");
  const pz = art(s3, { left: 310, top: 400, width: 460, height: 460 }, 500, 500, `<circle cx="250" cy="250" r="238" fill="#E0A04A" stroke="#0B0F14" stroke-width="6"/>${slices}`);
  tl.fromTo(pz, { scale: 0.7, opacity: 0, rotation: -20 }, { scale: 1, opacity: 1, rotation: 0, duration: 0.55, ease: "power3.out" }, 17.58);
  const hard = bigChip(s3, 900, "AKELE KHAREEDNA MUSHKIL", { borderColor: C.red, color: C.red });
  fadeUp(hard, 19.7, 0.3, 16); out(hard, 20.6, 0.2);
  // "lekin us ka ek slice har koi le sakta hai": six people, a slice each
  const ppl = ["sana", "usman", "zara", "ayesha", "bilal", "aap"].map((n, i) => { const w = who(s3, n, 540 + (i - 2.5) * 140 - 80, 1250, 160, { expr: "smile", gesture: "none" }); fadeUp(w, 20.66 + i * 0.05, 0.35, 24); return w; });
  ppl.forEach((w, i) => life(w, 20.9, 27.1, "smile", 110 + i));
  [...pz.querySelectorAll(".sl")].forEach((g, i) => {
    const k = 460 / 500, am = (-60 + 60 * i) * Math.PI / 180, sx = 310 + k * (250 + 120 * Math.cos(am)), sy = 400 + k * (250 + 120 * Math.sin(am));
    const tx = 540 + (i - 2.5) * 140, ty = 1185;
    tl.to(g, { x: (tx - sx) / k, y: (ty - sy) / k, scale: 0.42, svgOrigin: `${(250 + 120 * Math.cos(am)).toFixed(1)} ${(250 + 120 * Math.sin(am)).toFixed(1)}`, duration: 0.6, ease: "power3.inOut" }, 21.74 + i * 0.08);
  });
  const crust = pz.querySelector("circle"); tl.to(crust, { opacity: 0, duration: 0.3 }, 22.2);
  // the pizza becomes a big property
  out(h3, 22.75, 0.2);
  const h3b = kin(s3, "*REIT* MEIN", { y: 250, size: 100 }); charsIn.rise(h3b, 22.9, 0.02);
  const prop = art(s3, { left: 400, top: 400, width: 280, height: 300 }, 200, 210, BLD());
  tl.fromTo(prop, { scale: 0.7, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.45, ease: "power3.out" }, 22.95);
  const eq1 = bigChip(s3, 780, "PIZZA = BARI PROPERTY", { background: C.g, borderColor: C.g });
  fadeUp(eq1, 24.22, 0.3, 16);
  const eq2 = bigChip(s3, 910, "SLICE = CHHOTA HISSA", { background: "#fff" });
  fadeUp(eq2, 26.38, 0.3, 16);
  OV.push(hard, eq1, eq2, prop);

  // ═══ S4 27.16–36.96: Real Estate Investment Trust — many investors pool money → malls, offices, apartments ═══
  const s4 = scene(27.16, 36.96, { push: 1.012 });   // tiny push: keeps the edge content inside the Instagram safe area
  [["R", "EAL", 27.8], ["E", "STATE", 28.14], ["I", "NVESTMENT", 28.44], ["T", "RUST", 29.02]].forEach(([a, b, t], i) => {
    const row = el(s4, { left: 0, top: 240 + i * 84, width: 1080, textAlign: "center", font: "800 76px/1 Manrope", letterSpacing: "-.02em", color: C.text, whiteSpace: "nowrap" },
      `<span style="color:${C.gt}">${a}</span>${b}`);
    fadeUp(row, t, 0.35, 20);
  });
  const fund = card(s4, { left: 290, top: 600, width: 500, height: 170, border: `5px solid ${C.g}` });
  txt(fund, { left: 0, top: 36, width: 500, textAlign: "center", font: "800 46px Manrope" }, "REIT FUND");
  txt(fund, { left: 0, top: 100, width: 500, textAlign: "center", font: "600 26px Inter", color: C.mute }, "bohat se investors ka paisa");
  fadeUp(fund, 29.48, 0.4, 24);
  // lots of coins = lots of investors' money pouring into the fund (client: "use more coins")
  Array.from({ length: 16 }, (_, i) => [i % 2 ? 874 - (i >> 1) % 2 * 70 : 130 + (i >> 1) % 2 * 70, 560 + ((i >> 2) % 4) * 60]).forEach(([x, y], i) => {
    const c = art(s4, { left: x, top: y, width: 76, height: 76 }, 100, 100, COIN);
    tl.fromTo(c, { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.22, immediateRender: false }, 29.84 + i * 0.04); tl.set(c, { opacity: 0 }, 0);
    tl.to(c, { x: 540 - 38 - x, y: 685 - 38 - y, scale: 0.45, opacity: 0, duration: 0.5, ease: "power2.in" }, 30.5 + i * 0.05);
  });

  const PROPS = [
    ["MALL", 32.4, `<rect x="10" y="60" width="180" height="120" rx="8" fill="#fff" ${S}/><rect x="10" y="40" width="180" height="34" rx="6" fill="${C.g}" ${S}/><text x="100" y="64" text-anchor="middle" font-family="Manrope" font-weight="800" font-size="22" fill="#0B0F14">MALL</text>${[0, 1, 2].map((c) => `<rect x="${28 + c * 52}" y="94" width="40" height="40" rx="4" fill="#E3F1F4" stroke="#0B0F14" stroke-width="4"/>`).join("")}<rect x="84" y="140" width="32" height="40" rx="3" fill="#C98A4B" stroke="#0B0F14" stroke-width="4"/>`],
    ["OFFICE", 33.14, `<rect x="60" y="10" width="80" height="170" rx="6" fill="#E3F1F4" ${S}/>${[0, 1, 2, 3, 4, 5].map((r) => `<path d="M68,${34 + r * 24} h64" stroke="#0B0F14" stroke-width="4"/>`).join("")}<rect x="40" y="172" width="120" height="12" rx="4" fill="#0B0F14"/>`],
    ["APARTMENTS", 33.88, BLD()],
  ].map(([lab, t, a], i) => {
    const b = card(s4, { left: 150 + i * 280, top: 900, width: 220, height: 330, borderRadius: 28 });
    art(b, { left: 15, top: 26, width: 190, height: 190 }, 200, 210, a);
    txt(b, { left: 0, top: 252, width: 220, textAlign: "center", font: "800 28px Manrope" }, lab);
    fadeUp(b, t, 0.4, 24); return b;
  });
  const arrows = art(s4, { left: 0, top: 770, width: 1080, height: 130 }, 1080, 130,
    [[540, 260], [540, 540], [540, 820]].map(([x0, x1], i) => `<path class="ar${i}" d="M${x0},6 L${x1},124" fill="none" stroke="#0B0F14" stroke-width="7" stroke-linecap="round" opacity="0"/>`).join(""));
  [32.2, 32.94, 33.68].forEach((t, i) => tl.to(arrows.querySelector(".ar" + i), { opacity: 1, duration: 0.45, ease: "power1.inOut" }, t));   // lines fade in (client note)
  const buy = bigChip(s4, 1300, "KHAREEDI YA BANAI JATI HAIN", { background: C.ink, borderColor: C.ink, color: "#fff" });
  fadeUp(buy, 35.3, 0.3, 16);
  OV.push(fund, ...PROPS, buy);

  // ═══ S5 36.96–42.50: rent + profit flow to investors, by the size of their share ═══
  const s5 = scene(36.96, 42.5);
  const h5 = kin(s5, "KIRAYA *+* MUNAFA", { y: 250, size: 100 }); charsIn.rise(h5, 37.2, 0.02);
  const b5 = art(s5, { left: 410, top: 400, width: 260, height: 280 }, 200, 210, BLD());
  fadeUp(b5, 37.0, 0.4, 24);
  const kr = chip(s5, { left: 270, top: 500 }, "KIRAYA"); const mn = chip(s5, { left: 810, top: 500 }, "MUNAFA");
  gsap.set([kr, mn], { xPercent: -50 });   // mirrored about the centre line
  fadeUp(kr, 38.02, 0.3, 14); fadeUp(mn, 38.48, 0.3, 14);
  const inv = [["sana", 1], ["usman", 2], ["zara", 3]].map(([n, u], i) => {
    const x = 540 + (i - 1) * 290 - 120;
    const w = who(s5, n, x, 980, 240, { expr: "smile", gesture: "none" }); fadeUp(w, 39.48 + i * 0.06, 0.35, 24); life(w, 39.6, 42.4, "smile", 120 + i);
    const tag = el(s5, { left: x + 120, top: 1235, padding: "8px 18px", borderRadius: 14, background: C.ink, color: "#fff", font: "800 28px Manrope", whiteSpace: "nowrap" }, `${u} UNIT${u > 1 ? "S" : ""}`);
    gsap.set(tag, { xPercent: -50 }); fadeUp(tag, 39.66 + i * 0.06, 0.3, 14);
    Array.from({ length: u }, (_, k) => {
      const c = art(s5, { left: x + 120 - 35 + (k - (u - 1) / 2) * 56, top: 880, width: 70, height: 70 }, 100, 100, COIN);
      tl.fromTo(c, { x: 540 - (x + 120), y: -300, opacity: 0, scale: 0.6 }, { x: 0, y: 0, opacity: 1, scale: 1, duration: 0.55, ease: "power3.inOut", immediateRender: false }, 40.24 + i * 0.12 + k * 0.06);
      tl.set(c, { opacity: 0 }, 0);
    });
    return w;
  });
  const hh = bigChip(s5, 1350, "HISSE KE HISAAB SE", { background: C.g, borderColor: C.g });
  fadeUp(hh, 41.02, 0.3, 16);
  OV.push(kr, mn, hh);

  // ═══ S6 42.50–47.56: REIT units trade on PSX like shares — without buying a whole property ═══
  const s6 = scene(42.5, 47.56, { push: 1.012 });
  const h6 = kin(s6, "PSX PAR *SHARE* KI TARAH", { y: 250, size: 84 }); charsIn.rise(h6, 43.42, 0.02);
  const tc = card(s6, { left: 130, top: 380, width: 820, height: 600 });
  txt(tc, { left: 44, top: 40, font: "800 34px Manrope", color: C.mute, letterSpacing: ".06em" }, "REIT UNITS · PSX");
  txt(tc, { left: 44, top: 96, font: "700 76px 'IBM Plex Mono'" }, "Rs 12.50");
  txt(tc, { left: 44, top: 196, font: "500 26px Inter", color: C.mute }, "per unit (misaal)");
  const rl = line(tc, [[0, 0.3], [0.15, 0.42], [0.3, 0.36], [0.45, 0.5], [0.6, 0.46], [0.75, 0.6], [0.9, 0.56], [1, 0.66]], { x: 44, y: 250, w: 640, h: 170, n: 60, noise: 0.04, color: C.g2, grid: true, rows: 2 });
  const bBuy = el(tc, { left: 44, top: 470, width: 350, height: 92, borderRadius: 20, background: C.g, font: "800 40px/92px Manrope", textAlign: "center", color: C.ink }, "BUY");
  const bSell = el(tc, { left: 426, top: 470, width: 350, height: 92, borderRadius: 20, background: "#fff", border: `4px solid ${C.red}`, font: "800 40px/84px Manrope", textAlign: "center", color: C.red }, "SELL");
  fadeUp(tc, 42.6, 0.4, 30); rl.draw(43.0, 0.9);
  tl.to(bBuy, { scale: 0.94, duration: 0.1, yoyo: true, repeat: 1, ease: "power1.inOut" }, 44.72);
  tl.to(bSell, { scale: 0.94, duration: 0.1, yoyo: true, repeat: 1, ease: "power1.inOut" }, 45.18);
  const nb = bigChip(s6, 1060, "BINA POORI PROPERTY ✓", { background: C.ink, borderColor: C.ink, color: "#fff" });
  fadeUp(nb, 46.12, 0.3, 16);
  OV.push(tc, nb);

  // ═══ S7 47.56–53.96: property market ups and downs change both the unit price and the rent ═══
  const s7 = scene(47.56, 53.96);
  const h7 = kin(s7, "YAAD *RAHE*", { y: 250, size: 110, accent: C.red }); charsIn.rise(h7, 47.94, 0.02);
  const mk = card(s7, { left: 130, top: 400, width: 820, height: 540 });
  txt(mk, { left: 40, top: 30, font: "800 30px Manrope", color: C.mute, letterSpacing: ".06em" }, "PROPERTY MARKET");
  const ml = line(mk, [[0, 0.5], [0.1, 0.66], [0.2, 0.44], [0.32, 0.72], [0.44, 0.5], [0.56, 0.3], [0.68, 0.48], [0.8, 0.36], [0.9, 0.62], [1, 0.54]],
    { x: 40, y: 100, w: 720, h: 380, n: 80, noise: 0.04, color: C.g2, grid: true, rows: 3 });
  fadeUp(mk, 48.62, 0.4, 30); ml.draw(49.5, 1.2);
  const pr = bigChip(s7, 1010, "PRICE ▲▼", { borderColor: C.g, color: C.gt }, 335);
  const kc = bigChip(s7, 1010, "KIRAYA ▲▼", { borderColor: C.red, color: C.red }, 745);
  fadeUp(pr, 51.62, 0.3, 16); fadeUp(kc, 52.32, 0.3, 16);
  const both = el(s7, { left: 0, top: 1150, width: 1080, textAlign: "center", font: "700 40px Manrope", color: C.text }, "dono badal sakte hain");
  fadeUp(both, 53.1, 0.3, 12);
  OV.push(mk, pr, kc);

  // ═══ S8 53.96–64: CTA → FloStocks icon → logo → disclaimer ═══
  const s8 = scene(53.96, 64, { push: false });
  const t1 = kin(s8, "MARKET KE TERMS", { y: 560, size: 100 }); const t2 = kin(s8, "*AASAAN* ZUBAAN MEIN", { y: 700, size: 86 });
  charsIn.rise(t1, 54.3, 0.02); charsIn.rise(t2, 56.0, 0.02);
  tl.to([t1, t2], { y: -40, opacity: 0, duration: 0.3, ease: "power2.in" }, 57.4);
  const cta = ctaLogo(s8, 57.8, { tDisc: 59.4 });
  OV.push(cta.fl);

  K.linkScenes();
  OV.forEach((e) => e && e.setAttribute("data-ov", ""));
  tl.seek(0);
})();
