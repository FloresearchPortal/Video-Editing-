// "What is Dividend" — 60 Seconds Investor EP 03. Cue times = word starts in videos/what-is-dividend/edit/vo.words.json
// (VO = pause-tightened, studio-polished; see videos/what-is-dividend/prep_vo.py). New cast: Abbu (client pick A).
(function () {
  const { C, tl, el, scene, kin, charsIn, who, react, life, talk, line, swap, ctaLogo, icon } = K;
  const X = CAST.expr;
  const card = (p, css) => el(p, Object.assign({ background: "#fff", borderRadius: 32, border: "2px solid #E3E9E5", boxShadow: "0 24px 50px rgba(20,40,20,.10)" }, css));
  const txt = (p, css, html) => el(p, Object.assign({ font: "700 40px Manrope", color: C.text, whiteSpace: "nowrap" }, css), html);
  const fadeUp = (e, t, d = 0.45, y = 40) => tl.fromTo(e, { y, opacity: 0 }, { y: 0, opacity: 1, duration: d, ease: "power3.out" }, t);
  const out = (e, t, d = 0.25) => tl.to(e, { opacity: 0, duration: d, ease: "power2.in" }, t);
  const chip = (p, css, html) => el(p, Object.assign({ padding: "12px 26px", borderRadius: 999, background: "#fff", border: `4px solid ${C.g}`,
    font: "800 34px Manrope", color: C.text, whiteSpace: "nowrap" }, css), html);
  const S = `stroke="#0B0F14" stroke-width="8" stroke-linejoin="round" stroke-linecap="round"`;
  const art = (p, css, w, h, inner) => el(p, css, `<svg viewBox="0 0 ${w} ${h}" width="${css.width}" height="${css.height}" style="overflow:visible">${inner}</svg>`);
  const COIN = `<circle cx="50" cy="50" r="44" fill="#FFD95A" ${S}/><circle cx="50" cy="50" r="30" fill="#F2B526"/><text x="50" y="62" text-anchor="middle" font-family="Manrope" font-weight="800" font-size="32" fill="#5A3B00">Rs</text>`;
  const NOTE = `<rect x="6" y="6" width="188" height="96" rx="12" fill="#CFF2BF" ${S}/><circle cx="100" cy="54" r="26" fill="#fff" stroke="#0B0F14" stroke-width="6"/><text x="100" y="66" text-anchor="middle" font-family="Manrope" font-weight="800" font-size="32" fill="#1F7A00">Rs</text>`;
  const OV = [];

  // ═══ S1 HOOK 0–9.86: evening — Abbu on his phone, chai on the table: "Is saal meri company ne dividend diya hai"
  //     → Aap: "wah Abbu!" → but a question: "ye dividend aakhir hai kia?" ═══
  const s1 = scene(0, 9.86, { push: 1.02 });
  const room = el(s1, { left: 0, top: 0, width: 1080, height: 1920 }); room.setAttribute("data-ov-group", "");
  const win = art(room, { left: 90, top: 190, width: 380, height: 300 }, 380, 300,
    `<defs><linearGradient id="dusk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFB86B"/><stop offset=".7" stop-color="#FFE2B8"/><stop offset="1" stop-color="#FFF3DD"/></linearGradient></defs>
     <rect x="6" y="6" width="368" height="288" rx="18" fill="url(#dusk)" ${S}/><circle cx="250" cy="200" r="46" fill="#FF8A3D" opacity=".9"/>
     <path d="M6,236 C90,214 160,250 240,228 C300,212 340,226 374,218 V294 H6Z" fill="#E8C79B" opacity=".8"/><path d="M190,6 V294 M6,150 H374" ${S}/>`);
  const clock = chip(room, { left: 530, top: 300, borderColor: C.ink }, "SHAAM · 6:30 PM");
  tl.fromTo([win, clock], { opacity: 0 }, { opacity: 1, duration: 0.5, ease: "power2.out", stagger: 0.1 }, 0);
  const abbu = who(room, "abbu", 30, 800, 500, { expr: "smile", gesture: "handPhone" });
  tl.fromTo(abbu, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, ease: "power3.out" }, 0.05);
  life(abbu, 0.1, 9.8, "smile", 51);
  talk(abbu, [2.6, 2.92, 3.26, 3.5, 3.82, 3.98, 4.48], "smile");
  // side table with the chai cup on it (client note: cup on the table, phone in Abbu's hand)
  const table = art(room, { left: 470, top: 1090, width: 260, height: 220 }, 200, 170,
    `<rect x="10" y="96" width="180" height="16" rx="6" fill="#C98A4B" stroke="#0B0F14" stroke-width="6"/><path d="M34,112 V168 M166,112 V168" stroke="#0B0F14" stroke-width="8" stroke-linecap="round"/>
     <path d="M70,50 h56 l-6,40 q-1,6 -7,6 h-30 q-6,0 -7,-6Z" fill="#fff" stroke="#0B0F14" stroke-width="5" stroke-linejoin="round"/><path d="M72,62 h52 l-2,11 h-48Z" fill="${C.g}"/>
     <path d="M126,58 q16,0 15,14 q-1,13 -18,14" fill="none" stroke="#0B0F14" stroke-width="5" stroke-linecap="round"/>
     <path class="wisp" d="M88,42 q-6,-10 0,-20 q6,-10 0,-20 M106,42 q-6,-10 0,-20 q6,-10 0,-20" fill="none" stroke="#C9D3CD" stroke-width="4" stroke-linecap="round"/>`);
  fadeUp(table, 0.2, 0.45, 30);
  // the phone alert: dividend credited (ties to the Rs 5 × 100 = Rs 500 example later)
  const alert = card(s1, { left: 520, top: 420, width: 500, height: 210, borderRadius: 28 });
  el(alert, { left: 28, top: 30, width: 64, height: 64, borderRadius: 18, background: C.g }, `<svg viewBox="0 0 100 100" width="64" height="64">${COIN}</svg>`);
  txt(alert, { left: 112, top: 28, font: "800 32px Manrope" }, "Dividend credited");
  txt(alert, { left: 112, top: 74, font: "500 26px Inter", color: C.mute }, "100 shares × Rs 5");
  txt(alert, { left: 28, top: 124, font: "700 54px 'IBM Plex Mono'", color: C.gt }, "+ Rs 500");
  tl.fromTo(alert, { y: -30, opacity: 0, scale: 0.96 }, { y: 0, opacity: 1, scale: 1, duration: 0.45, ease: "power3.out" }, 3.98);
  const aap = who(room, "aap", 660, 880, 430, { expr: "smile", gesture: "none" });
  fadeUp(aap, 0.3, 0.45, 30); life(aap, 0.4, 9.8, "smile", 52);
  const wah = chip(room, { left: 650, top: 760, background: C.g, borderColor: C.g }, "WAH ABBU!");
  X(tl, aap.av, "grinOpen", 5.52); K.pose(aap, 5.52, { h: [-4, 0, -10], b: [1.03, 0.99] }, 0.3);
  fadeUp(wah, 5.52, 0.3, 16); out(wah, 6.6, 0.2);
  X(tl, aap.av, "puzzled", 6.86); K.pose(aap, 6.86, { h: [9, -4, 4], b: [1, 1] }, 0.4);
  out(alert, 7.7, 0.25);
  const q = kin(s1, "YE DIVIDEND | AAKHIR HAI *KIA?*", { y: 1440, size: 96 });
  charsIn.rise(q, 7.94, 0.02);
  OV.push(win, alert);

  // ═══ S2 9.86–14.84: 60 Seconds Investor series card (approved stopwatch) ═══
  const s2 = scene(9.86, 14.84);
  const sc2 = K.seriesCard(s2, 9.9, { tSweep: 10.22, tTitle: 10.5, tSeries: 11.26, tTag: 12.22, tEp: 13.32, ep: "EP 03 · WHAT IS DIVIDEND" });
  OV.push(sc2.watch);

  // ═══ S3 14.84–25.56: Aap + dost ki bakery → mahine ka munafa → kuch naya oven, baqi aapas mein baant → = DIVIDEND ═══
  const s3 = scene(14.84, 25.56);
  const h3 = kin(s3, "AAP + DOST KI *BAKERY*", { y: 150, size: 88 }); charsIn.rise(h3, 15.26, 0.02);
  const shop = el(s3, { left: 0, top: 0, width: 1080, height: 1920 }); shop.setAttribute("data-ov-group", "");
  const stall = icon(shop, "stall", 140, 330, 800, 640, "BAKERY");
  fadeUp(stall, 14.95, 0.5, 40);
  const pAap = who(shop, "aap", 130, 1010, 400, { expr: "smile", gesture: "none" });
  const pDost = who(shop, "bilal", 560, 1010, 400, { expr: "smile", gesture: "none" });
  fadeUp(pAap, 15.26, 0.4, 30); fadeUp(pDost, 15.94, 0.4, 30);
  life(pAap, 15.3, 25.5, "smile", 53); life(pDost, 15.9, 25.5, "smile", 54);
  react.joy(pAap, 17.12, { gesture: "none", face: "grinOpen" });
  react.joy(pDost, 17.2, { gesture: "none" });
  out(stall, 17.8, 0.3);
  // month-end profit → split
  const prof = card(s3, { left: 240, top: 330, width: 600, height: 200 });
  txt(prof, { left: 0, top: 30, width: 600, textAlign: "center", font: "800 32px Manrope", color: C.mute, letterSpacing: ".08em" }, "MAHINE KE END PAR MUNAFA");
  const profV = txt(prof, { left: 0, top: 86, width: 600, textAlign: "center", font: "700 76px 'IBM Plex Mono'", color: C.gt }, "Rs 1,00,000");
  fadeUp(prof, 18.16, 0.45, 30);
  const arrows = art(s3, { left: 0, top: 530, width: 1080, height: 110 }, 1080, 110,
    `<path class="a1" d="M440,6 L260,96" fill="none" stroke="#0B0F14" stroke-width="8" stroke-linecap="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"/>
     <path class="a2" d="M640,6 L820,96" fill="none" stroke="#0B0F14" stroke-width="8" stroke-linecap="round" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"/>`);
  tl.to(arrows.querySelector(".a1"), { strokeDashoffset: 0, duration: 0.4, ease: "power2.out" }, 19.98);
  tl.to(arrows.querySelector(".a2"), { strokeDashoffset: 0, duration: 0.4, ease: "power2.out" }, 22.2);
  const oven = card(s3, { left: 50, top: 640, width: 440, height: 300, borderRadius: 28 });
  art(oven, { left: 30, top: 26, width: 150, height: 150 }, 150, 150,
    `<rect x="10" y="14" width="130" height="122" rx="14" fill="#fff" ${S}/><rect x="26" y="50" width="98" height="70" rx="8" fill="#FFE2B8" stroke="#0B0F14" stroke-width="6"/>
     <path d="M30,32 h20 M60,32 h20" ${S}/><circle cx="114" cy="32" r="6" fill="${C.g}"/><path d="M40,98 q35,-24 70,0" fill="none" stroke="#F29F1F" stroke-width="6" stroke-linecap="round"/>`);
  txt(oven, { left: 196, top: 52, font: "800 34px Manrope" }, "NAYA OVEN");
  txt(oven, { left: 196, top: 104, font: "500 26px Inter", color: C.mute }, "business mein");
  txt(oven, { left: 30, top: 200, font: "700 60px 'IBM Plex Mono'" }, "Rs 40,000");
  fadeUp(oven, 20.16, 0.45, 30);
  const share = card(s3, { left: 590, top: 640, width: 440, height: 300, borderRadius: 28 });
  art(share, { left: 30, top: 34, width: 140, height: 76 }, 200, 108, NOTE);
  txt(share, { left: 196, top: 40, font: "800 34px Manrope" }, "AAPAS MEIN");
  txt(share, { left: 196, top: 92, font: "800 34px Manrope" }, "BAANT");
  txt(share, { left: 30, top: 200, font: "700 60px 'IBM Plex Mono'", color: C.gt }, "Rs 60,000");
  fadeUp(share, 22.42, 0.45, 30);
  // the shared part goes to the two partners: Rs 30,000 each
  [[pAap, 330], [pDost, 760]].forEach(([w, cx], i) => {
    const n = el(s3, { left: cx - 120, top: 950, width: 240, height: 66, borderRadius: 16, background: "#CFF2BF", border: `4px solid ${C.ink}`,
      font: "800 34px/58px 'IBM Plex Mono'", textAlign: "center", color: C.ink }, "Rs 30,000");
    tl.fromTo(n, { x: 810 - cx, y: 0, scale: 0.6, opacity: 0 }, { x: 0, y: 0, scale: 1, opacity: 1, duration: 0.55, ease: "power3.inOut", immediateRender: false }, 23.26 + i * 0.12);
    tl.set(n, { opacity: 0 }, 0);
    OV.push(n);
  });
  react.joy(pAap, 23.9, { gesture: "none", face: "grinOpen" });
  react.joy(pDost, 24.0, { gesture: "none" });
  out(h3, 23.9, 0.2);
  const h3b = kin(s3, "ISE KEHTE HAIN *DIVIDEND*", { y: 150, size: 84 }); charsIn.rise(h3b, 24.06, 0.02);
  const badge = el(share, { left: 30, top: 136, padding: "6px 16px", borderRadius: 14, background: C.g, color: C.ink, font: "800 30px Manrope", whiteSpace: "nowrap" }, "= DIVIDEND");
  tl.fromTo(badge, { scale: 0.7, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.35, ease: "power2.out" }, 24.8);
  tl.to(share, { borderColor: C.g, borderWidth: 6, duration: 0.3 }, 24.8);
  OV.push(prof, oven, share);

  // ═══ S4 25.56–32.48: dividend = the part of profit shared with shareholders, per share ═══
  const s4 = scene(25.56, 32.48);
  const h4 = kin(s4, "*DIVIDEND* KYA HAI?", { y: 150, size: 96 }); charsIn.rise(h4, 25.6, 0.02);
  const pie = art(s4, { left: 290, top: 300, width: 500, height: 500 }, 500, 500,
    `<path d="M250,250 L385.2,436.1 A230,230 0 1 1 250,20 Z" fill="#E3E9E5" ${S}/>
     <g class="slice"><path d="M250,250 L250,20 A230,230 0 0 1 385.2,436.1 Z" fill="${C.g}" ${S}/></g>`);
  fadeUp(pie, 25.94, 0.5, 30);
  txt(pie, { left: -40, top: 520, width: 580, textAlign: "center", font: "800 34px Manrope", color: C.mute }, "COMPANY KA MUNAFA");
  tl.to(pie.querySelector(".slice"), { x: 22, y: -8, duration: 0.4, ease: "power2.out" }, 27.2);
  const lg1 = chip(s4, { left: 130, top: 880, borderColor: C.g }, `<span style="display:inline-block;width:22px;height:22px;border-radius:6px;background:${C.g};margin-right:12px;vertical-align:-2px"></span>DIVIDEND: SHAREHOLDERS KO`);
  const lg2 = chip(s4, { left: 130, top: 970, borderColor: "#C9D3CD" }, `<span style="display:inline-block;width:22px;height:22px;border-radius:6px;background:#E3E9E5;border:3px solid #0B0F14;margin-right:12px;vertical-align:-4px"></span>BAQI: BUSINESS MEIN WAPAS`);
  fadeUp(lg1, 27.2, 0.35, 20); fadeUp(lg2, 27.6, 0.35, 20);
  const holders = ["sana", "bilal", "zara", "usman", "ayesha", "aap"].map((n, i) => { const w = who(s4, n, 18 + i * 175, 1250, 170, { expr: "smile", gesture: "none" }); fadeUp(w, 28.68 + i * 0.05, 0.4, 24); return w; });
  holders.forEach((w, i) => {
    life(w, 28.9, 32.4, "smile", 60 + i);
    const c = art(s4, { left: 505, top: 520, width: 70, height: 70 }, 100, 100, COIN);
    tl.fromTo(c, { x: 0, y: 0, opacity: 0, scale: 0.6 }, { x: 18 + i * 175 + 50 - 505, y: 1160 - 520, opacity: 1, scale: 1, duration: 0.7, ease: "power3.inOut", immediateRender: false }, 29.34 + i * 0.08);
    tl.set(c, { opacity: 0 }, 0);
  });
  const per = chip(s4, { left: 250, top: 1500, background: C.ink, borderColor: C.ink, color: "#fff" }, "PER SHARE KE HISAAB SE");
  fadeUp(per, 31.1, 0.35, 20);
  OV.push(lg1, lg2, per);

  // ═══ S5 32.48–37.88: Rs 5 per share × 100 shares = Rs 500 (the amount on Abbu's phone) ═══
  const s5 = scene(32.48, 37.88);
  const h5 = kin(s5, "MISAAL", { y: 150, size: 96 }); charsIn.rise(h5, 32.5, 0.02);
  const calc = card(s5, { left: 90, top: 330, width: 900, height: 640 });
  const row = (t, top, label, val, color, icn) => {
    const r = el(calc, { left: 0, top, width: 900, height: 160 });
    art(r, { left: 50, top: 30, width: 100, height: 100 }, 100, 100, icn);
    txt(r, { left: 180, top: 22, font: "800 30px Manrope", color: C.mute, letterSpacing: ".06em" }, label);
    txt(r, { left: 180, top: 62, font: "700 64px 'IBM Plex Mono'", color }, val);
    fadeUp(r, t, 0.4, 24); return r;
  };
  row(33.06, 30, "DIVIDEND ANNOUNCED", "Rs 5 / share", C.text, COIN);
  row(35.32, 230, "AAP KE SHARES", "× 100 shares", C.text, `<rect x="6" y="22" width="88" height="56" rx="10" fill="${C.g}" ${S}/><text x="50" y="58" text-anchor="middle" font-family="Manrope" font-weight="800" font-size="20" fill="#0B0F14">SHARE</text>`);
  el(calc, { left: 50, top: 410, width: 800, height: 6, borderRadius: 3, background: C.ink });
  const res = row(36.82, 440, "AAP KO MILENGE", "= Rs 500", C.gt, `<rect x="6" y="20" width="88" height="60" rx="10" fill="#CFF2BF" ${S}/><text x="50" y="60" text-anchor="middle" font-family="Manrope" font-weight="800" font-size="26" fill="#1F7A00">Rs</text>`);
  const abbu5 = who(s5, "abbu", 600, 1060, 440, { expr: "smile", gesture: "handPhone" });
  fadeUp(abbu5, 33.3, 0.45, 30); life(abbu5, 33.4, 37.8, "smile", 55);
  react.joy(abbu5, 37.26, { gesture: "handPhone" });
  const same = chip(s5, { left: 90, top: 1200 }, "ABBU KE Rs 500 ✓");
  fadeUp(same, 37.26, 0.3, 16);
  OV.push(calc, same);

  // ═══ S6 37.88–41.42: cash ki shakal mein ya bonus shares ki surat mein ═══
  const s6 = scene(37.88, 41.42);
  const h6 = kin(s6, "DO *SHAKLEIN*", { y: 150, size: 100 }); charsIn.rise(h6, 37.92, 0.02);
  const cash = card(s6, { left: 50, top: 340, width: 450, height: 560 });
  art(cash, { left: 85, top: 50, width: 280, height: 210 }, 220, 165,
    `<g transform="translate(10,40) rotate(-8 100 54)"><rect x="6" y="6" width="188" height="96" rx="12" fill="#A9E58F" ${S}/></g><g transform="translate(20,20)">${NOTE}</g>`);
  txt(cash, { left: 0, top: 300, width: 450, textAlign: "center", font: "800 44px Manrope" }, "CASH");
  txt(cash, { left: 0, top: 362, width: 450, textAlign: "center", font: "500 28px Inter", color: C.mute }, "paise seedha account mein");
  txt(cash, { left: 0, top: 440, width: 450, textAlign: "center", font: "700 44px 'IBM Plex Mono'", color: C.gt }, "+ Rs 500");
  fadeUp(cash, 38.14, 0.45, 30);
  const ya = el(s6, { left: 505, top: 580, width: 70, textAlign: "center", font: "800 40px Manrope", color: C.mute }, "YA");
  fadeUp(ya, 39.78, 0.3, 16);
  const bonus = card(s6, { left: 580, top: 340, width: 450, height: 560 });
  art(bonus, { left: 85, top: 50, width: 280, height: 210 }, 240, 180,
    [0, 1, 2].map((i) => `<g transform="translate(${10 + i * 22},${10 + i * 34})"><rect x="0" y="0" width="190" height="96" rx="16" fill="${i === 2 ? C.g : "#fff"}" ${S}/><text x="95" y="60" text-anchor="middle" font-family="Manrope" font-weight="800" font-size="30" fill="#0B0F14">SHARE</text></g>`).join(""));
  txt(bonus, { left: 0, top: 300, width: 450, textAlign: "center", font: "800 44px Manrope" }, "BONUS SHARES");
  txt(bonus, { left: 0, top: 362, width: 450, textAlign: "center", font: "500 28px Inter", color: C.mute }, "muft mein naye shares");
  txt(bonus, { left: 0, top: 440, width: 450, textAlign: "center", font: "700 44px 'IBM Plex Mono'", color: C.gt }, "100 → 110");
  fadeUp(bonus, 39.94, 0.45, 30);
  const eg = el(s6, { left: 580, top: 920, width: 450, textAlign: "center", font: "500 26px Inter", color: C.mute }, "misaal: 10% bonus");
  fadeUp(eg, 40.3, 0.3, 12);
  OV.push(cash, bonus);

  // ═══ S7 41.42–46.9: record date — whoever holds the shares by that date gets the dividend ═══
  const s7 = scene(41.42, 46.9);
  const h7 = kin(s7, "*RECORD* DATE", { y: 150, size: 100 }); charsIn.rise(h7, 41.96, 0.02);
  const cal = card(s7, { left: 360, top: 320, width: 360, height: 360 });
  el(cal, { left: 0, top: 0, width: 360, height: 96, borderRadius: "30px 30px 0 0", background: C.g });
  txt(cal, { left: 0, top: 22, width: 360, textAlign: "center", font: "800 44px Manrope", color: C.ink }, "NOV");
  txt(cal, { left: 0, top: 118, width: 360, textAlign: "center", font: "800 150px/1 Manrope" }, "15");
  txt(cal, { left: 0, top: 282, width: 360, textAlign: "center", font: "700 26px Inter", color: C.mute }, "misaal ki tareekh");
  fadeUp(cal, 41.96, 0.45, 30);
  const tlbar = art(s7, { left: 60, top: 760, width: 960, height: 120 }, 960, 120,
    `<path d="M10,60 H950" ${S}/><path d="M940,44 L956,60 L940,76" ${S}/><circle cx="480" cy="60" r="20" fill="${C.g}" ${S}/>
     <rect class="zone" x="10" y="20" width="460" height="80" rx="14" fill="${C.g}" opacity=".16"/>`);
  fadeUp(tlbar, 42.62, 0.4, 20);
  tl.fromTo(tlbar.querySelector(".zone"), { opacity: 0 }, { opacity: 0.16, duration: 0.4, immediateRender: false }, 43.54);
  tl.set(tlbar.querySelector(".zone"), { opacity: 0 }, 0);
  const zl = txt(s7, { left: 60, top: 890, width: 460, textAlign: "center", font: "800 28px Manrope", color: C.gt }, "TAREEKH TAK SHAREHOLDER");
  const zr = txt(s7, { left: 560, top: 890, width: 460, textAlign: "center", font: "800 28px Manrope", color: C.mute }, "BAAD MEIN KHAREEDA");
  fadeUp(zl, 43.54, 0.35, 14); fadeUp(zr, 44.3, 0.35, 14);
  const pIn = who(s7, "sana", 140, 980, 320, { expr: "smile", gesture: "none" });
  const pOut = who(s7, "usman", 620, 980, 320, { expr: "smile", gesture: "none" });
  fadeUp(pIn, 44.3, 0.4, 30); fadeUp(pOut, 44.5, 0.4, 30);
  life(pIn, 44.4, 46.85, "smile", 70); life(pOut, 44.6, 46.85, "smile", 71);
  const yesC = chip(s7, { left: 90, top: 1340 }, "DIVIDEND MILEGA ✓");
  const noC = chip(s7, { left: 590, top: 1340, borderColor: C.red, color: C.red }, "IS BAAR NAHI ✗");
  fadeUp(yesC, 45.66, 0.35, 16); react.joy(pIn, 45.7, { gesture: "none", face: "grinOpen" });
  fadeUp(noC, 46.04, 0.35, 16); X(tl, pOut.av, "worried", 46.04);
  OV.push(cal, yesC, noC);

  // ═══ S8 46.9–51.7: not guaranteed — depends on profit and the board's decision ═══
  const s8 = scene(46.9, 51.7);
  const h8 = kin(s8, "DIVIDEND *PAKKA* NAHI", { y: 150, size: 92, accent: C.red }); charsIn.rise(h8, 47.22, 0.02);
  const c1 = card(s8, { left: 50, top: 340, width: 470, height: 460 });
  txt(c1, { left: 34, top: 30, font: "800 32px Manrope" }, "COMPANY KA MUNAFA");
  const pl = line(c1, [[0, 0.4], [0.15, 0.62], [0.3, 0.5], [0.45, 0.78], [0.6, 0.56], [0.75, 0.3], [0.9, 0.42], [1, 0.22]], { x: 34, y: 110, w: 400, h: 300, color: C.g2, grid: true, rows: 2 });
  fadeUp(c1, 48.8, 0.45, 30); pl.draw(49.0, 1.0);
  const c2 = card(s8, { left: 560, top: 340, width: 470, height: 460 });
  txt(c2, { left: 34, top: 30, font: "800 32px Manrope" }, "BOARD KA FAISLA");
  art(c2, { left: 60, top: 120, width: 350, height: 260 }, 350, 260,
    `<ellipse cx="175" cy="180" rx="150" ry="46" fill="#C98A4B" ${S}/>
     ${[[80, 110], [175, 92], [270, 110]].map(([x, y]) => `<circle cx="${x}" cy="${y - 34}" r="30" fill="#fff" ${S}/><path d="M${x - 44},${y + 30} q44,-56 88,0" fill="${C.g}" ${S}/>`).join("")}
     <rect x="150" y="150" width="50" height="30" rx="6" fill="#fff" stroke="#0B0F14" stroke-width="5"/>`);
  fadeUp(c2, 49.9, 0.45, 30);
  const dep = chip(s8, { left: 230, top: 880, background: C.ink, borderColor: C.ink, color: "#fff" }, "IN DONO PAR DEPEND");
  fadeUp(dep, 50.88, 0.35, 20);
  OV.push(c1, c2, dep);

  // ═══ S9 51.7–58.22: PSX earnings = price gain (capital appreciation) + dividend ═══
  const s9 = scene(51.7, 58.22);
  const h9 = kin(s9, "PSX MEIN *KAMAI*", { y: 150, size: 100 }); charsIn.rise(h9, 51.86, 0.02);
  const g1 = card(s9, { left: 60, top: 320, width: 960, height: 420 });
  txt(g1, { left: 40, top: 32, font: "800 38px Manrope" }, "1 · CAPITAL APPRECIATION");
  const g1s = txt(g1, { left: 40, top: 86, font: "500 28px Inter", color: C.mute }, "yani share price barhna");
  const gl = line(g1, [[0, 0.12], [0.15, 0.2], [0.3, 0.18], [0.45, 0.36], [0.6, 0.32], [0.75, 0.55], [0.9, 0.62], [1, 0.82]], { x: 40, y: 150, w: 600, h: 230, color: C.g2, grid: true, rows: 2 });
  const gp = txt(g1, { left: 680, top: 220, font: "700 52px 'IBM Plex Mono'", color: C.text }, "Rs 100");
  fadeUp(g1, 53.64, 0.45, 30); tl.set(g1s, { opacity: 0 }, 0); tl.to(g1s, { opacity: 1, duration: 0.3 }, 54.84);
  gl.draw(55.08, 1.0); swap(gp, "Rs 130 ▲", 55.72);
  const plus = el(s9, { left: 500, top: 752, width: 80, textAlign: "center", font: "800 72px/1 Manrope", color: C.gt }, "+");
  fadeUp(plus, 56.4, 0.3, 14);
  const g2 = card(s9, { left: 60, top: 850, width: 960, height: 250 });
  art(g2, { left: 40, top: 60, width: 130, height: 130 }, 100, 100, COIN);
  txt(g2, { left: 200, top: 62, font: "800 38px Manrope" }, "2 · DIVIDEND");
  txt(g2, { left: 200, top: 120, font: "500 28px Inter", color: C.mute }, "munafe mein se hissa, har saal");
  fadeUp(g2, 56.52, 0.45, 30);
  const both = chip(s9, { left: 200, top: 1160, background: C.g, borderColor: C.g }, "DONO SE KAMAI HO SAKTI HAI ✓");
  fadeUp(both, 57.4, 0.35, 20);
  OV.push(g1, g2, both);

  // ═══ S10 58.22–68: CTA → FloStocks icon → logo → disclaimer ═══
  const s10 = scene(58.22, 68, { push: false });
  const t1 = kin(s10, "MARKET KE TERMS", { y: 560, size: 100 }); const t2 = kin(s10, "*AASAAN* ZUBAAN MEIN", { y: 700, size: 86 });
  charsIn.rise(t1, 58.74, 0.02); charsIn.rise(t2, 60.06, 0.02);
  tl.to([t1, t2], { y: -40, opacity: 0, duration: 0.3, ease: "power2.in" }, 61.4);
  const cta = ctaLogo(s10, 61.8, { tDisc: 63.5 });
  OV.push(cta.fl);

  K.linkScenes();
  OV.forEach((e) => e && e.setAttribute("data-ov", ""));
  tl.seek(0);
})();
