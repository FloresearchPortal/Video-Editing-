// "What is DFC?" — 60 Seconds Investor EP 06. Cue times = word starts in videos/what-is-dfc/edit/vo.words.json
// (VO = room tone cut, tight pauses that keep every word, studio chain; see videos/what-is-dfc/prep_vo.py).
// Cast (all approved earlier): bhai (the trader), aap, ahmed (the dukandaar), usman (the supplier). Rupee amounts are illustrations.
// Layout rule: every block is centred on x = 540 with equal margins; y 960–1500 content stays inside x 130–950 (Instagram safe area).
(function () {
  const { C, tl, el, scene, kin, charsIn, who, life, talk, line, ctaLogo } = K;
  const X = CAST.expr;
  // cue times below are on the first VO cut, which still opened with "okay so"; the re-cut starts at "Broker" and cuts
  // the silences (client notes). tmap.js maps old -> new VO time; every numeric timeline position is translated once, here.
  const TMAP = window.TMAP || [[0, 0], [200, 200]];
  const R = (t) => { if (typeof t !== "number") return t; let i = 0; while (i < TMAP.length - 2 && TMAP[i + 1][0] < t) i++;
    const [x0, y0] = TMAP[i], [x1, y1] = TMAP[i + 1]; return Math.max(0, y0 + (y1 - y0) * ((t - x0) / ((x1 - x0) || 1))); };
  ["to", "from", "fromTo", "set", "call", "add"].forEach((m) => { const f = tl[m].bind(tl);
    tl[m] = (...a) => { const i = a.length - 1; if (i > 0 && typeof a[i] === "number") a[i] = R(a[i]); return f(...a); }; });
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
  const tag = (p, cx, top, html) => { const t = el(p, { left: cx, top, padding: "8px 20px", borderRadius: 14, background: C.ink, color: "#fff", font: "800 28px Manrope", whiteSpace: "nowrap" }, html); gsap.set(t, { xPercent: -50 }); return t; };
  const stamp = (p, css, html) => { const s = el(p, Object.assign({ padding: "6px 22px", borderRadius: 14, border: `5px solid ${C.g2}`, color: C.gt, font: "800 40px Manrope", whiteSpace: "nowrap", background: "rgba(255,255,255,.9)" }, css), html); gsap.set(s, { rotation: -8 }); return s; };
  const stampIn = (s, t) => { hide(s); tl.fromTo(s, { scale: 1.25, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.3, ease: "power2.out", immediateRender: false }, t); };
  const S = `stroke="#0B0F14" stroke-width="8" stroke-linejoin="round" stroke-linecap="round"`;
  const art = (p, css, w, h, inner) => el(p, css, `<svg viewBox="0 0 ${w} ${h}" width="${css.width}" height="${css.height}" style="overflow:visible">${inner}</svg>`);
  const DOC = (label = "DFC") => `<rect x="20" y="10" width="120" height="150" rx="12" fill="#fff" ${S}/><rect x="20" y="10" width="120" height="36" rx="10" fill="${C.g}" ${S}/>
    <text x="80" y="36" text-anchor="middle" font-family="Manrope" font-weight="800" font-size="20" fill="#0B0F14">${label}</text>
    <path d="M40,70 h80 M40,92 h80 M40,114 h50" stroke="#C9D3CD" stroke-width="8" stroke-linecap="round"/><path d="M92,140 q10,-14 20,0 q10,14 18,-4" fill="none" stroke="#0B0F14" stroke-width="5" stroke-linecap="round"/>`;
  const PHONE = (x, y, s = 1) => `<g transform="translate(${x},${y}) scale(${s})"><rect x="0" y="0" width="34" height="60" rx="8" fill="#0B0F14"/><rect x="4" y="7" width="26" height="44" rx="4" fill="#E3F1F4"/><circle cx="17" cy="55" r="2.5" fill="#fff"/></g>`;
  const ARROW_UP = `<path d="M50,8 L92,58 H66 V92 H34 V58 H8Z" fill="${C.g}" ${S}/>`, ARROW_DN = `<path d="M50,92 L92,42 H66 V8 H34 V42 H8Z" fill="${C.red}" ${S}/>`;
  const rest = (w, t) => K.pose(w, t, { h: [0, 0, 0], b: [1, 1] }, 0.45);
  const OV = [];

  // ═══ S1 HOOK 0–9.55: broker's office — the trader (Bhai): "Sauda maine aaj kiya hai, lekin shares mujhe mahine ke end mein milenge." ═══
  const s1 = scene(0, 9.55, { push: 1.012 });
  const office = el(s1, { left: 0, top: 0, width: 1080, height: 1920 }); office.setAttribute("data-ov-group", "");
  // wall screen with the market (white-theme monitor, candles moving sideways)
  const CND = [[0, 60, 40, 74, 30], [1, 42, 52, 64, 34], [2, 52, 36, 58, 28], [3, 36, 46, 52, 26], [4, 46, 30, 50, 22], [5, 30, 40, 46, 20], [6, 40, 24, 44, 16], [7, 26, 30, 36, 12]];
  const screen = art(office, { left: 290, top: 370, width: 500, height: 290 }, 500, 290,
    `<rect x="4" y="4" width="492" height="262" rx="22" fill="#0B0F14"/><rect x="18" y="18" width="464" height="234" rx="12" fill="#fff"/>
     ${[0, 1, 2, 3].map((r) => `<path d="M30,${70 + r * 46} H470" stroke="#E3E9E5" stroke-width="2"/>`).join("")}
     <text x="34" y="52" font-family="Manrope" font-weight="800" font-size="24" fill="#0B0F14">PSX · LIVE</text><circle cx="160" cy="44" r="7" fill="${C.red}"/>
     ${CND.map(([i, o, c, h, l]) => { const x = 70 + i * 52, up = c < o, col = up ? C.g2 : C.red, sy = (v) => 70 + v * 2.2;
       return `<path d="M${x},${sy(h + 10)} V${sy(l + 10)}" stroke="${col}" stroke-width="4"/><rect x="${x - 12}" y="${sy(Math.min(o, c) + 10)}" width="24" height="${Math.max(6, Math.abs(o - c) * 2.2)}" rx="3" fill="${col}"/>`; }).join("")}
     <rect x="230" y="266" width="40" height="18" fill="#0B0F14"/>`);
  const bhai = who(office, "bhai", 150, 880, 410, { expr: "smile", gesture: "handPhone" });
  const aap = who(office, "aap", 520, 880, 410, { expr: "smile", gesture: "none" });
  const desk = art(office, { left: 130, top: 1230, width: 820, height: 240 }, 820, 240,
    `<rect x="10" y="10" width="800" height="44" rx="14" fill="#DDF3D2" ${S}/><rect x="40" y="54" width="740" height="170" rx="10" fill="#fff" ${S}/>
     <rect x="290" y="96" width="240" height="70" rx="12" fill="#0B0F14"/><text x="410" y="142" text-anchor="middle" font-family="Manrope" font-weight="800" font-size="30" fill="#fff">BROKER</text>`);
  tl.fromTo([screen, bhai, aap, desk], { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, ease: "power3.out", stagger: 0.03 }, 0);
  life(bhai, 0.2, 9.5, "smile", 131); life(aap, 0.2, 9.5, "smile", 132);
  const h1 = kin(s1, "BROKER KA *OFFICE*", { y: 250, size: 90 }); charsIn.rise(h1, 0.4, 0.02); out(h1, 7.6, 0.2);
  // one-line bubbles (client rule), centred on the frame; the tail leans toward the speaker
  const say = (html, t0, t1, spk) => {
    const b = el(s1, { left: 540, top: 700, padding: "24px 40px", borderRadius: 30, background: "#fff", border: `4px solid ${C.ink}`, boxShadow: "0 24px 50px rgba(20,40,20,.10)",
      font: "700 50px/1.15 Manrope", color: C.text, whiteSpace: "nowrap" }, html);
    gsap.set(b, { xPercent: -50 });
    el(b, { left: `calc(50% + ${Math.round((spk - 540) * 0.6)}px)`, bottom: -30, marginLeft: -26, width: 0, height: 0, borderLeft: "26px solid transparent", borderRight: "26px solid transparent", borderTop: `30px solid ${C.ink}` });
    show(b, t0, 0.3, 16); out(b, t1, 0.15); return b; };
  const b1 = say(`“Sauda maine <span style="color:${C.gt}">aaj</span> kiya hai,”`, 2.9, 4.22, 355);
  const b2 = say("“lekin shares mujhe”", 4.3, 5.1, 355);
  const b3 = say(`“<span style="color:${C.gt}">mahine ke end</span> mein milenge.”`, 5.3, 6.72, 355);
  talk(bhai, [2.96, 3.34, 3.64, 3.96, 4.32, 4.66, 5.02, 5.3, 5.72, 6.14, 6.28], "smile");
  X(tl, aap.av, "puzzled", 6.9); K.pose(aap, 6.9, { h: [9, -4, 4], b: [1, 1] }, 0.4);
  out(screen, 7.6, 0.3);
  const th = art(s1, { left: 545, top: 650, width: 360, height: 300 }, 480, 400,
    `<path d="M70,270 C10,270 10,190 70,180 C60,110 150,80 190,120 C220,60 320,60 340,120 C400,100 460,150 430,210 C480,240 450,310 390,300 C370,350 290,350 260,320 C220,360 130,350 120,310 C100,320 70,310 70,270Z" fill="#fff" ${S}/>
     <circle cx="300" cy="370" r="14" fill="#fff" ${S}/>
     <text x="245" y="238" text-anchor="middle" font-family="Manrope" font-weight="800" font-size="96" letter-spacing="-2" fill="#0B0F14">DFC<tspan fill="${C.gt}">?</tspan></text>`);
  show(th, 7.1, 0.4, 20);
  const q = kin(s1, "YE CONCEPT | AAKHIR HAI *KIA?*", { y: 250, size: 84 });
  charsIn.rise(q, 8.0, 0.02);
  OV.push(b1, b2, b3, th);

  // ═══ S2 9.55–15.0: 60 Seconds Investor series card (approved stopwatch) ═══
  const s2 = scene(9.55, 15.0);
  const sc2 = K.seriesCard(s2, 9.6, { tSweep: 10.0, tTitle: 10.48, tSeries: 11.22, tTag: 11.96, tEp: 13.4, ep: "EP 06 · WHAT IS DFC" });
  OV.push(sc2.watch);

  // ═══ S3 15.0–26.9: a shopkeeper books 100 phones today at today's rate, delivery in a month; the supplier's credit lets him order big ═══
  const s3 = scene(15.0, 26.9, { push: 1.012 });
  const h3 = kin(s3, "EK *DUKANDAAR*", { y: 250, size: 100 }); charsIn.rise(h3, 15.2, 0.02);
  const os = card(s3, { left: 240, top: 380, width: 600, height: 430, border: `4px solid ${C.ink}` });
  txt(os, { left: 0, top: 30, width: 600, textAlign: "center", font: "800 30px Manrope", color: C.mute, letterSpacing: ".08em" }, "ORDER SLIP");
  el(os, { left: 40, top: 80, width: 520, height: 3, background: "#E3E9E5" });
  const row = (top, k, v, t) => { const r = el(os, { left: 40, top, width: 520, height: 60 });
    txt(r, { left: 0, top: 12, font: "700 26px Inter", color: C.mute }, k); txt(r, { left: 170, top: 0, font: "800 40px Manrope" }, v); show(r, t, 0.35, 14); return r; };
  row(110, "DELIVERY", "1 MAHINE BAAD", 16.66);
  row(190, "RATE", `<span style="color:${C.gt}">AAJ KA</span>`, 18.62);
  row(270, "ITEM", `100 PHONES <svg viewBox="0 0 120 64" width="96" height="51" style="vertical-align:-10px;margin-left:8px">${PHONE(0, 2)}${PHONE(42, 2)}${PHONE(84, 2)}</svg>`, 19.5);
  const pk = stamp(os, { left: 160, top: 350 }, "ORDER PAKKA ✓"); stampIn(pk, 20.56);
  show(os, 15.5, 0.45, 30);
  const ahmed = who(s3, "ahmed", 190, 980, 300, { expr: "smile", gesture: "none" });
  const usman = who(s3, "usman", 590, 980, 300, { expr: "smile", gesture: "none" });
  show(ahmed, 15.42, 0.4, 24); life(ahmed, 15.6, 26.8, "smile", 141);
  const tA = tag(s3, 340, 1300, "DUKANDAAR"); show(tA, 15.6, 0.3, 12);
  show(usman, 23.72, 0.4, 24); life(usman, 23.9, 26.8, "smile", 142);
  const tU = tag(s3, 740, 1300, "SUPPLIER"); show(tU, 23.86, 0.3, 12);
  // alone he stands centred; he steps aside as the supplier comes in (layout stays symmetric)
  tl.set([ahmed, tA], { x: 200 }, 0); tl.to([ahmed, tA], { x: 0, duration: 0.5, ease: "power2.inOut" }, 23.2);
  // "uske paas poore paise nahi hote" → worried; supplier's credit → big order → happy
  const pp = bigChip(s3, 850, "POORE PAISE NAHI", { borderColor: C.red, color: C.red }); show(pp, 22.06, 0.3, 16); out(pp, 23.5, 0.2);
  X(tl, ahmed.av, "worried", 22.06); K.pose(ahmed, 22.06, { h: [-6, 0, 6], b: [0.98, 1] }, 0.4); rest(ahmed, 24.6);
  const cr = bigChip(s3, 850, "THORA CREDIT", { borderColor: C.g, color: C.gt }); show(cr, 24.56, 0.3, 16); out(cr, 25.36, 0.15);
  const bo = bigChip(s3, 850, "BARA ORDER ✓", { background: C.g, borderColor: C.g }); show(bo, 25.48, 0.3, 16);
  X(tl, usman.av, "happy", 24.56); X(tl, ahmed.av, "happy", 25.48);
  OV.push(os, pp, cr, bo, ahmed, usman, tA, tU);

  // ═══ S4 26.9–34.5: a month later — rate up → profit, down → loss, because he pays today's rate ═══
  const s4 = scene(26.9, 34.5, { push: 1.012 });
  const h4 = kin(s4, "1 MAHINE *BAAD*", { y: 250, size: 100 }); charsIn.rise(h4, 27.0, 0.02);
  const mc = card(s4, { left: 130, top: 370, width: 820, height: 540 });
  txt(mc, { left: 40, top: 30, font: "800 28px Manrope", color: C.mute, letterSpacing: ".06em" }, "MARKET RATE");
  const W = 740, H = 400, yv = (v) => H * (1 - (v - 85) / 30);
  const ch = art(mc, { left: 40, top: 100, width: W, height: H }, W, H,
    [115, 107.5, 100, 92.5, 85].map((v) => `<line x1="0" x2="${W}" y1="${yv(v)}" y2="${yv(v)}" stroke="#D9E3DC" stroke-width="2" stroke-dasharray="${v === 85 ? 0 : "6 8"}"/>`).join("") +
    `<path d="M0,${yv(100)} H${W}" stroke="${C.ink}" stroke-width="4" stroke-dasharray="12 10" opacity=".55"/>
     <path d="M0,${yv(100)} L${W * 0.08},${yv(101)} L${W * 0.16},${yv(99.5)} L${W * 0.24},${yv(100.5)} L${W * 0.32},${yv(100)}" fill="none" stroke="${C.ink}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
     <circle cx="${W * 0.32}" cy="${yv(100)}" r="13" fill="${C.ink}"/>
     <path class="upP" d="M${W * 0.32},${yv(100)} L${W * 0.42},${yv(103)} L${W * 0.52},${yv(101.5)} L${W * 0.64},${yv(106)} L${W * 0.76},${yv(104.5)} L${W * 0.88},${yv(109)} L${W},${yv(111)}" fill="none" stroke="${C.g2}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" opacity="0"/>
     <path class="dnP" d="M${W * 0.32},${yv(100)} L${W * 0.42},${yv(97.5)} L${W * 0.52},${yv(99)} L${W * 0.64},${yv(94)} L${W * 0.76},${yv(95.5)} L${W * 0.88},${yv(91)} L${W},${yv(89)}" fill="none" stroke="${C.red}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" opacity="0"/>`);
  txt(mc, { left: 40, top: 100 + yv(100) + 18, font: "700 24px 'IBM Plex Mono'", color: C.ink }, "AAJ KA RATE");
  show(mc, 27.1, 0.4, 30);
  tl.fromTo(ch.querySelector(".upP"), { opacity: 0 }, { opacity: 1, duration: 0.7, ease: "power1.inOut", immediateRender: false }, 28.44);
  tl.fromTo(ch.querySelector(".dnP"), { opacity: 0 }, { opacity: 1, duration: 0.7, ease: "power1.inOut", immediateRender: false }, 31.16);
  const fa = bigChip(s4, 950, "▲ FAIDA", { borderColor: C.g, color: C.gt }, 335); show(fa, 30.12, 0.3, 16);
  const nq = bigChip(s4, 950, "▼ NUQSAN", { borderColor: C.red, color: C.red }, 745); show(nq, 31.74, 0.3, 16);
  const ah4 = who(s4, "ahmed", 410, 1070, 260, { expr: "smile", gesture: "none" }); show(ah4, 27.3, 0.4, 20); life(ah4, 27.5, 34.4, "smile", 143);
  X(tl, ah4.av, "happy", 30.12); X(tl, ah4.av, "worried", 31.74);
  const rt = bigChip(s4, 1350, "RATE AAJ WALA HI ✓", { background: C.ink, borderColor: C.ink, color: "#fff" }); show(rt, 32.96, 0.3, 16);
  X(tl, ah4.av, "smile", 33.2);
  OV.push(mc, fa, nq, ah4, rt);

  // ═══ S5 34.5–39.15: PSX par DFC = Deliverable Futures Contract — works the same way ═══
  const s5 = scene(34.5, 39.15);
  const h5 = kin(s5, "PSX PAR *DFC*", { y: 250, size: 110 }); charsIn.rise(h5, 34.6, 0.02);
  [["D", "ELIVERABLE", 36.28], ["F", "UTURES", 36.88], ["C", "ONTRACT", 37.3]].forEach(([a, b, t], i) => {
    const r = el(s5, { left: 0, top: 450 + i * 104, width: 1080, textAlign: "center", font: "800 86px/1 Manrope", letterSpacing: "-.02em", color: C.text, whiteSpace: "nowrap" },
      `<span style="color:${C.gt}">${a}</span>${b}`);
    show(r, t, 0.35, 20);
  });
  const doc5 = art(s5, { left: 440, top: 820, width: 200, height: 220 }, 160, 170, DOC("DFC")); show(doc5, 37.5, 0.4, 24);
  const same = bigChip(s5, 1110, "BILKUL AISAY HI ✓", { background: C.g, borderColor: C.g }); show(same, 38.4, 0.3, 16);
  OV.push(doc5, same);

  // ═══ S6 39.15–47.9: share Rs 100 → today you lock 500 shares at Rs 100; one PSX contract = 500 shares ═══
  const s6 = scene(39.15, 47.9, { push: 1.012 });
  const h6 = kin(s6, "MAAN *LIJIYE*", { y: 250, size: 100 }); charsIn.rise(h6, 39.3, 0.02);
  const sp = card(s6, { left: 290, top: 380, width: 500, height: 190 });
  txt(sp, { left: 0, top: 30, width: 500, textAlign: "center", font: "800 30px Manrope", color: C.mute, letterSpacing: ".06em" }, "1 SHARE");
  txt(sp, { left: 0, top: 78, width: 500, textAlign: "center", font: "700 76px 'IBM Plex Mono'", color: C.gt }, "Rs 100");
  show(sp, 40.34, 0.4, 24);
  const ct = card(s6, { left: 130, top: 620, width: 820, height: 340, border: `5px solid ${C.g}` });
  art(ct, { left: 50, top: 60, width: 180, height: 200 }, 160, 170, DOC("DFC"));
  txt(ct, { left: 270, top: 56, font: "800 34px Manrope", color: C.mute }, "AAJ KA SAUDA");
  txt(ct, { left: 270, top: 110, font: "700 64px 'IBM Plex Mono'" }, "500 × Rs 100");
  txt(ct, { left: 270, top: 200, font: "600 28px Inter", color: C.mute }, "rate aaj hi pakka");
  show(ct, 41.48, 0.45, 30);
  const sk = stamp(ct, { left: 560, top: 250 }, "PAKKA ✓"); stampIn(sk, 43.82);
  const one = bigChip(s6, 1030, "1 CONTRACT = 500 SHARES", { font: "800 44px Manrope", background: C.ink, borderColor: C.ink, color: "#fff" }); show(one, 46.36, 0.3, 16);
  const eg6 = el(s6, { left: 0, top: 1150, width: 1080, textAlign: "center", font: "500 26px Inter", color: C.mute }, "misaal ke numbers"); show(eg6, 41.6, 0.3, 10);
  OV.push(sp, ct, one);

  // ═══ S7 47.9–56.7: you don't need the full Rs 50,000 — the broker's margin lets you deal in more than your own money ═══
  const s7 = scene(47.9, 56.7, { push: 1.012 });
  const h7 = kin(s7, "POORI *RAQAM?*", { y: 250, size: 100 }); charsIn.rise(h7, 48.2, 0.02); out(h7, 51.3, 0.2);
  const h7b = kin(s7, "*MARGIN* KI SAHULAT", { y: 250, size: 92 }); charsIn.rise(h7b, 51.6, 0.02);
  const mg = card(s7, { left: 130, top: 370, width: 820, height: 480 });
  txt(mg, { left: 40, top: 40, font: "800 32px Manrope", color: C.mute }, "POORI RAQAM");
  const full = el(mg, { left: 40, top: 96, width: 740, height: 110, borderRadius: 18, border: "4px dashed #9AA8A0", background: "#F1F4F2" });
  txt(full, { left: 0, top: 28, width: 732, textAlign: "center", font: "700 46px 'IBM Plex Mono'", color: "#6E7A74" }, "Rs 50,000");
  const strike = el(mg, { left: 30, top: 148, width: 760, height: 7, borderRadius: 4, background: C.red, transformOrigin: "0% 50%" });
  tl.set(strike, { scaleX: 0 }, 0); tl.to(strike, { scaleX: 1, duration: 0.45, ease: "power2.out" }, 50.52);
  const ml = txt(mg, { left: 40, top: 262, font: "800 32px Manrope", color: C.gt }, "BROKER KI MARGIN SAHULAT"); show(ml, 51.56, 0.3, 12);
  // margin drawn like the POORI RAQAM bar (approved in EP Futures): same box, green paid part, MARGIN centred
  const mbox = el(mg, { left: 40, top: 320, width: 740, height: 110, borderRadius: 18, border: `4px solid ${C.ink}`, background: "#fff", overflow: "hidden" });
  const part = el(mbox, { left: 0, top: 0, width: 185, height: 102, background: C.g, transformOrigin: "0% 50%" });
  txt(mbox, { left: 0, top: 28, width: 732, textAlign: "center", font: "800 40px Manrope", color: C.ink }, "MARGIN");
  show(mbox, 51.7, 0.3, 12);
  tl.set(part, { scaleX: 0 }, 0); tl.to(part, { scaleX: 1, duration: 0.5, ease: "power2.out" }, 52.2);
  show(mg, 48.0, 0.4, 30);
  const zn = bigChip(s7, 890, "ZAROORI NAHI", { borderColor: C.red, color: C.red }); show(zn, 50.6, 0.3, 16); out(zn, 53.9, 0.2);
  const zy = bigChip(s7, 890, "APNI RAQAM SE ZYADA SAUDA", { font: "800 42px Manrope", background: C.g, borderColor: C.g }); show(zy, 54.06, 0.3, 16);
  const aap7 = who(s7, "aap", 390, 1060, 300, { expr: "smile", gesture: "none" }); show(aap7, 48.3, 0.4, 20); life(aap7, 48.5, 56.6, "smile", 151);
  X(tl, aap7.av, "wow", 50.6); X(tl, aap7.av, "happy", 54.3);
  OV.push(mg, zn, zy, aap7);

  // ═══ S8 56.7–63.8: last Friday of the month — keep the contract, pay the full amount, 500 shares land in your account ═══
  const s8 = scene(56.7, 63.8, { push: 1.012 });
  const h8 = kin(s8, "AAKHRI *FRIDAY*", { y: 250, size: 100 }); charsIn.rise(h8, 56.9, 0.02);
  const cal = card(s8, { left: 290, top: 370, width: 500, height: 400 });
  txt(cal, { left: 0, top: 24, width: 500, textAlign: "center", font: "800 28px Manrope", color: C.mute, letterSpacing: ".08em" }, "IS MAHINE");
  const D = ["M", "T", "W", "T", "F", "S", "S"];
  const cells = [];
  D.forEach((d, c) => txt(cal, { left: 40 + c * 62, top: 76, width: 50, textAlign: "center", font: "800 22px Manrope", color: c === 4 ? C.gt : C.mute }, d));
  for (let r = 0; r < 5; r++) for (let c = 0; c < 7; c++) {
    const n = r * 7 + c - 1; if (n < 1 || n > 30) continue;
    const last = n === 26;   // last Friday of the month
    const e = el(cal, { left: 40 + c * 62, top: 112 + r * 54, width: 50, height: 44, borderRadius: 10, background: last ? "#fff" : "#F1F4F2", border: last ? `3px solid ${C.ink}` : "none", font: "700 22px/44px 'IBM Plex Mono'", textAlign: "center", color: C.text }, String(n));
    if (last) cells.push(e);
  }
  show(cal, 56.9, 0.4, 30);
  tl.to(cells[0], { background: C.g, scale: 1.12, duration: 0.35, ease: "power2.out" }, 57.78);
  const kp = bigChip(s8, 805, "CONTRACT RAKHA HO", { font: "800 40px Manrope", borderColor: C.ink }); show(kp, 58.98, 0.3, 16);
  const pay = bigChip(s8, 925, "POORI RAQAM ADA · Rs 50,000", { font: "800 40px Manrope", background: C.ink, borderColor: C.ink, color: "#fff" }); show(pay, 60.36, 0.3, 16);
  tl.to([cal, kp, pay], { opacity: 0, y: -30, duration: 0.3, ease: "power2.in" }, 61.2);
  // the shares land in the FloStocks app (skill: the client's app UI for any buying/holding), centred on the frame
  const A8 = K.app(s8, 290, 380, 0.8);
  const hc = A8.card.children; hc[0].textContent = "DFC"; hc[1].textContent = "PSX SHARE"; hc[2].textContent = "DFC delivery · aakhri Friday";
  A8.price.textContent = "100.00"; A8.cShares.textContent = "500"; A8.cCost.textContent = "100.00"; A8.cValue.textContent = "50,000";
  hide(A8.phone); tl.fromTo(A8.phone, { y: 80, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: "power3.out", immediateRender: false }, 61.4);
  tl.set(A8.empty, { opacity: 1 }, 0); tl.to(A8.empty, { opacity: 0, duration: 0.2 }, 61.9);
  tl.set(A8.value, { textContent: "0.00" }, 0); tl.set(A8.value, { textContent: "50,000.00" }, 61.9);
  tl.fromTo(A8.card, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.4, ease: "power3.out", immediateRender: false }, 61.9);
  tl.fromTo(A8.card, { boxShadow: "0 0 0 0 rgba(56,209,0,0)" }, { boxShadow: "0 0 0 8px rgba(56,209,0,.55)", duration: 0.3, immediateRender: false }, 62.3);
  if (A8.finger) gsap.set(A8.finger, { opacity: 0 });   // no tap in this beat
  A8.toast.textContent = "+500 shares delivered ✓";
  tl.fromTo(A8.toast, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.3, ease: "power2.out", immediateRender: false }, 62.8);
  OV.push(cal, kp, pay, A8.phone);

  // ═══ S9 63.8–70.3: margin makes the gain bigger — and the loss too; understand the risk first ═══
  const s9 = scene(63.8, 70.3, { push: 1.012 });
  const h9 = kin(s9, "YAAD *RAHE*", { y: 250, size: 110, accent: C.red }); charsIn.rise(h9, 63.9, 0.02);
  const mt = el(s9, { left: 0, top: 400, width: 1080, textAlign: "center", font: "800 44px Manrope", color: C.text }, `<span style="color:${C.gt}">MARGIN</span> SE`);
  show(mt, 64.84, 0.3, 14);
  const up = card(s9, { left: 150, top: 490, width: 370, height: 360, border: `4px solid ${C.g}` });
  art(up, { left: 120, top: 40, width: 130, height: 130 }, 100, 100, ARROW_UP);
  txt(up, { left: 0, top: 200, width: 370, textAlign: "center", font: "800 44px Manrope", color: C.gt }, "FAIDA BHI");
  txt(up, { left: 0, top: 262, width: 370, textAlign: "center", font: "800 44px Manrope", color: C.gt }, "BARA");
  const dn = card(s9, { left: 560, top: 490, width: 370, height: 360, border: `4px solid ${C.red}` });
  art(dn, { left: 120, top: 40, width: 130, height: 130 }, 100, 100, ARROW_DN);
  txt(dn, { left: 0, top: 200, width: 370, textAlign: "center", font: "800 44px Manrope", color: C.red }, "NUQSAN BHI");
  txt(dn, { left: 0, top: 262, width: 370, textAlign: "center", font: "800 44px Manrope", color: C.red }, "BARA");
  show(up, 65.6, 0.4, 24); show(dn, 67.26, 0.4, 24);
  const risk = bigChip(s9, 920, `<svg viewBox="0 0 48 44" width="66" height="60" style="display:block"><path d="M24,3 L46,41 H2Z" fill="#FFD95A" stroke="#0B0F14" stroke-width="4" stroke-linejoin="round"/><path d="M24,16 V28 M24,34 V35" stroke="#0B0F14" stroke-width="5" stroke-linecap="round"/></svg>PEHLE RISK SAMJHEIN`, { background: C.ink, borderColor: C.ink, color: "#fff", display: "flex", alignItems: "center", gap: "18px", padding: "14px 44px" });
  show(risk, 68.62, 0.35, 16);
  OV.push(mt, up, dn, risk);

  // ═══ S10 70.3–82: CTA → FloStocks icon → logo → disclaimer ═══
  const s10 = scene(70.3, 82, { push: false });
  const t1 = kin(s10, "MARKET KE TERMS", { y: 560, size: 100 }); const t2 = kin(s10, "*AASAAN* ZUBAAN MEIN", { y: 700, size: 86 });
  charsIn.rise(t1, 71.3, 0.02); charsIn.rise(t2, 72.18, 0.02);
  tl.to([t1, t2], { y: -40, opacity: 0, duration: 0.3, ease: "power2.in" }, 73.8);
  const cta = ctaLogo(s10, 74.2, { tDisc: 75.8 });
  OV.push(cta.fl);

  K.linkScenes();
  window.__sceneCuts = (window.__sceneCuts || []).map(R);
  OV.forEach((e) => e && e.setAttribute("data-ov", ""));
  tl.seek(0);
})();
