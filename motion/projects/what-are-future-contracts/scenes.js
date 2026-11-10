// "What are Future Contracts?" — 60 Seconds Investor EP 05. Cue times = word starts in videos/what-are-future-contracts/edit/vo.words.json
// (VO = leading breath cut, pause-tightened, studio-polished; see videos/what-are-future-contracts/prep_vo.py).
// New cast (client pick): bhai (B: curly hair, curled moustache, green jacket over a black tee). Rupee amounts are illustrations.
(function () {
  const { C, tl, el, scene, kin, charsIn, who, react, life, talk, line, swap, ctaLogo } = K;
  const X = CAST.expr;
  // cue times below are on the first VO cut; the client then asked to "skip the empty places" (pauses 0.22 -> 0.10 s).
  // tmap.js maps old VO time -> new VO time; every numeric timeline position is translated once, here.
  const TMAP = window.TMAP || [[0, 0], [100, 100]];
  const R = (t) => { if (typeof t !== "number") return t; let i = 0; while (i < TMAP.length - 2 && TMAP[i + 1][0] < t) i++;
    const [x0, y0] = TMAP[i], [x1, y1] = TMAP[i + 1]; return y0 + (y1 - y0) * ((t - x0) / ((x1 - x0) || 1)); };
  ["to", "from", "fromTo", "set", "call", "add"].forEach((m) => { const f = tl[m].bind(tl);
    tl[m] = (...a) => { const i = a.length - 1; if (i > 0 && typeof a[i] === "number") a[i] = R(a[i]); return f(...a); }; });
  const card = (p, css) => el(p, Object.assign({ background: "#fff", borderRadius: 32, border: "2px solid #E3E9E5", boxShadow: "0 24px 50px rgba(20,40,20,.10)" }, css));
  const txt = (p, css, html) => el(p, Object.assign({ font: "700 40px Manrope", color: C.text, whiteSpace: "nowrap" }, css), html);
  const fadeUp = (e, t, d = 0.45, y = 40) => tl.fromTo(e, { y, opacity: 0 }, { y: 0, opacity: 1, duration: d, ease: "power3.out" }, t);
  const out = (e, t, d = 0.25) => tl.to(e, { opacity: 0, duration: d, ease: "power2.in" }, t);
  const chip = (p, css, html) => el(p, Object.assign({ padding: "12px 26px", borderRadius: 999, background: "#fff", border: `4px solid ${C.g}`,
    font: "800 34px Manrope", color: C.text, whiteSpace: "nowrap" }, css), html);
  // big centred button-chip (client preference from EP 04): centred on cx via xPercent
  const bigChip = (p, top, html, css = {}, cx = 540) => {
    const c = chip(p, Object.assign({ left: cx, top, padding: "18px 44px", font: "800 48px Manrope", borderWidth: 5 }, css), html);
    gsap.set(c, { xPercent: -50 }); return c; };
  const S = `stroke="#0B0F14" stroke-width="8" stroke-linejoin="round" stroke-linecap="round"`;
  const art = (p, css, w, h, inner) => el(p, css, `<svg viewBox="0 0 ${w} ${h}" width="${css.width}" height="${css.height}" style="overflow:visible">${inner}</svg>`);
  const bubble = (p, css, html, tail) => {
    const b = card(p, Object.assign({ borderRadius: 30, border: `4px solid ${C.ink}` }, css));
    txt(b, { left: 34, top: 28, width: css.width - 68, whiteSpace: "normal", font: "700 42px/1.3 Manrope" }, html);
    el(b, { left: tail, top: css.height - 8, width: 0, height: 0, borderLeft: "26px solid transparent", borderRight: "26px solid transparent", borderTop: `30px solid ${C.ink}` });
    return b; };
  const DOC = `<rect x="20" y="10" width="120" height="150" rx="12" fill="#fff" ${S}/><rect x="20" y="10" width="120" height="36" rx="10" fill="${C.g}" ${S}/>
    <text x="80" y="36" text-anchor="middle" font-family="Manrope" font-weight="800" font-size="18" fill="#0B0F14">FUTURE</text>
    <path d="M40,70 h80 M40,92 h80 M40,114 h50" stroke="#C9D3CD" stroke-width="8" stroke-linecap="round"/><path d="M92,140 q10,-14 20,0 q10,14 18,-4" fill="none" stroke="#0B0F14" stroke-width="5" stroke-linecap="round"/>`;
  const OV = [];

  // ═══ S1 HOOK 0–13.88: Bhai (phone) + Aap on the sofa — "upar jayega, invest kar diya" → "share khareed liya?" → "nahi, future contract" ═══
  const s1 = scene(0, 13.88, { push: 1.02 });
  const lounge = el(s1, { left: 0, top: 0, width: 1080, height: 1920 }); lounge.setAttribute("data-ov-group", "");
  const ARMS = `<rect x="0" y="120" width="130" height="230" rx="44" fill="#fff" ${S}/><rect x="810" y="120" width="130" height="230" rx="44" fill="#fff" ${S}/>`;
  const sofaBack = art(lounge, { left: 70, top: 1080, width: 940, height: 360 }, 940, 360,
    `<rect x="60" y="0" width="820" height="250" rx="54" fill="#DDF3D2" ${S}/><path d="M470,20 V240" stroke="#BFE5AE" stroke-width="8" stroke-linecap="round"/>${ARMS}`);
  const bhai = who(lounge, "bhai", 140, 880, 440, { expr: "smile", gesture: "handPhone" });
  const aap = who(lounge, "aap", 540, 880, 440, { expr: "smile", gesture: "none" });
  const seat = art(lounge, { left: 70, top: 1080, width: 940, height: 360 }, 940, 360,
    `<rect x="100" y="210" width="740" height="110" rx="28" fill="#fff" ${S}/><path d="M470,214 V316" stroke="#E3E9E5" stroke-width="6"/>${ARMS}<path d="M160,320 v32 M780,320 v32" ${S}/>`);
  tl.fromTo([sofaBack, seat, bhai, aap], { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.45, ease: "power3.out", stagger: 0.03 }, 0);
  life(bhai, 0.2, 13.8, "smile", 91); life(aap, 0.2, 13.8, "smile", 92);
  talk(bhai, [0.52, 1.02, 1.32, 1.84, 2.12, 2.9, 3.32, 3.96, 4.18, 4.62, 4.82, 5.42, 5.9], "smile");
  // client note: one line at a time, split where the comma is
  const line1 = (html, t0, t1) => { const b = card(s1, { left: 40, top: 640, width: 1000, height: 120, borderRadius: 30, border: `4px solid ${C.ink}` });
    txt(b, { left: 0, top: 34, width: 1000, textAlign: "center", font: "700 38px Manrope" }, html);
    el(b, { left: 230, top: 112, width: 0, height: 0, borderLeft: "26px solid transparent", borderRight: "26px solid transparent", borderTop: `30px solid ${C.ink}` });
    fadeUp(b, t0, 0.35, 16); out(b, t1, 0.15); return b; };
  const b1 = line1(`“Mujhe lagta hai ye share mahine baad <span style="color:${C.gt}">upar</span> jayega,”`, 0.2, 3.5);
  const b1b = line1(`“tou maine abhi se apna paisa invest kar diya hai.”`, 3.78, 6.3);
  const b2 = bubble(s1, { left: 470, top: 620, width: 560, height: 160 }, "“Share khareed liya?”", 260);
  fadeUp(b2, 6.8, 0.35, 16); out(b2, 8.9, 0.2);
  talk(aap, [7.16, 7.32, 7.68, 8.04], "smile");
  const b3 = bubble(s1, { left: 50, top: 600, width: 640, height: 210 }, `“Nahi, <span style="color:${C.gt}">future contract</span> liya hai.”`, 250);
  fadeUp(b3, 9.2, 0.35, 16); out(b3, 11.3, 0.2);
  talk(bhai, [9.2, 9.68, 10.02, 10.44, 10.9], "smile");
  X(tl, aap.av, "puzzled", 11.74); K.pose(aap, 11.74, { h: [9, -4, 4], b: [1, 1] }, 0.4);
  const th = art(s1, { left: 690, top: 520, width: 360, height: 300 }, 480, 400,
    `<path d="M70,270 C10,270 10,190 70,180 C60,110 150,80 190,120 C220,60 320,60 340,120 C400,100 460,150 430,210 C480,240 450,310 390,300 C370,350 290,350 260,320 C220,360 130,350 120,310 C100,320 70,310 70,270Z" fill="#fff" ${S}/>
     <circle cx="300" cy="370" r="14" fill="#fff" ${S}/><g transform="translate(169,124) scale(.95)">${DOC}</g>
     <text x="338" y="200" font-family="Manrope" font-weight="800" font-size="76" fill="${C.gt}">?</text>`);
  fadeUp(th, 11.74, 0.4, 20);
  const q = kin(s1, "FUTURE CONTRACT | AAKHIR HAI *KIA?*", { y: 1500, size: 84 });
  charsIn.rise(q, 12.7, 0.02);
  OV.push(b1, b1b, b2, b3, th);

  // ═══ S2 13.88–19.12: 60 Seconds Investor series card (approved stopwatch) ═══
  const s2 = scene(13.88, 19.12);
  const sc2 = K.seriesCard(s2, 13.95, { tSweep: 14.54, tTitle: 14.86, tSeries: 15.68, tTag: 16.58, tEp: 17.68, ep: "EP 05 · WHAT ARE FUTURES" });
  OV.push(sc2.watch);

  // ═══ S3 19.12–29.32: flat booked today at Rs 50 lakh, possession in 6 months; price fixed now, profit/loss on the later price ═══
  const s3 = scene(19.12, 29.32);
  const h3 = kin(s3, "AAJ *FLAT* BOOK", { y: 150, size: 100 }); charsIn.rise(h3, 19.6, 0.02);
  const flat = art(s3, { left: 60, top: 320, width: 400, height: 420 }, 200, 210,
    `<rect x="30" y="20" width="140" height="180" rx="8" fill="#fff" ${S}/><rect x="20" y="192" width="160" height="14" rx="4" fill="#0B0F14"/>
     ${[0, 1, 2, 3].map((r) => [0, 1, 2].map((c) => `<rect x="${48 + c * 38}" y="${36 + r * 36}" width="26" height="22" rx="3" fill="${r === 1 && c === 1 ? C.g : "#E3F1F4"}" stroke="#0B0F14" stroke-width="4"/>`).join("")).join("")}
     <rect x="86" y="168" width="28" height="32" rx="3" fill="#C98A4B" stroke="#0B0F14" stroke-width="4"/>`);
  fadeUp(flat, 20.96, 0.45, 30);
  const bk = card(s3, { left: 500, top: 330, width: 520, height: 400 });
  txt(bk, { left: 40, top: 34, font: "800 30px Manrope", color: C.mute, letterSpacing: ".06em" }, "BOOKING · AAJ");
  txt(bk, { left: 40, top: 90, font: "700 84px 'IBM Plex Mono'" }, "50 LAKH");
  txt(bk, { left: 40, top: 196, font: "600 28px Inter", color: C.mute }, "flat · possession baad mein");
  const fixed = el(bk, { left: 40, top: 280, padding: "10px 22px", borderRadius: 14, background: C.ink, color: "#fff", font: "800 32px Manrope", whiteSpace: "nowrap" },
    `<svg viewBox="0 0 40 46" width="28" height="32" style="vertical-align:-5px;margin-right:12px"><path d="M10,20 V14 a10,10 0 0 1 20,0 V20" fill="none" stroke="#fff" stroke-width="5"/><rect x="4" y="20" width="32" height="24" rx="5" fill="${C.g}"/></svg>PRICE FIXED`);
  fadeUp(bk, 20.18, 0.45, 30);
  tl.fromTo(fixed, { scale: 0.7, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.35, ease: "power2.out", immediateRender: false }, 25.62); tl.set(fixed, { opacity: 0 }, 0);
  const tlb = art(s3, { left: 60, top: 790, width: 960, height: 150 }, 960, 150,
    `<path d="M40,60 H900" ${S}/><path d="M890,44 L906,60 L890,76" ${S}/><circle cx="40" cy="60" r="18" fill="${C.g}" ${S}/><circle cx="880" cy="60" r="18" fill="#fff" ${S}/>
     <text x="40" y="128" text-anchor="middle" font-family="Manrope" font-weight="800" font-size="30" fill="#0B0F14">AAJ</text>
     <text x="800" y="128" text-anchor="middle" font-family="Manrope" font-weight="800" font-size="30" fill="#0B0F14">6 MAHINE BAAD</text>`);
  fadeUp(tlb, 22.46, 0.4, 20);
  const f1 = card(s3, { left: 60, top: 990, width: 460, height: 230, border: `4px solid ${C.g}` });
  txt(f1, { left: 34, top: 30, font: "600 28px Inter", color: C.mute }, "baad mein 55 lakh");
  txt(f1, { left: 34, top: 80, font: "800 44px Manrope", color: C.gt }, "FAIDA");
  txt(f1, { left: 34, top: 140, font: "700 48px 'IBM Plex Mono'", color: C.gt }, "+5 lakh");
  const f2 = card(s3, { left: 560, top: 990, width: 460, height: 230, border: `4px solid ${C.red}` });
  txt(f2, { left: 34, top: 30, font: "600 28px Inter", color: C.mute }, "baad mein 45 lakh");
  txt(f2, { left: 34, top: 80, font: "800 44px Manrope", color: C.red }, "NUQSAN");
  txt(f2, { left: 34, top: 140, font: "700 48px 'IBM Plex Mono'", color: C.red }, "−5 lakh");
  fadeUp(f1, 26.78, 0.4, 24); fadeUp(f2, 27.2, 0.4, 24);
  const dep = bigChip(s3, 1290, "BAAD KI PRICE PAR DEPEND", { background: C.ink, borderColor: C.ink, color: "#fff" });
  fadeUp(dep, 28.5, 0.35, 16);
  const eg3 = el(s3, { left: 0, top: 1420, width: 1080, textAlign: "center", font: "500 26px Inter", color: C.mute }, "misaal ke numbers");
  fadeUp(eg3, 27.4, 0.3, 10);
  OV.push(bk, tlb, f1, f2, dep);

  // ═══ S4 29.32–31.12: "stock futures bhi yehi hain" ═══
  const s4 = scene(29.32, 31.12);
  const h4 = kin(s4, "STOCK *FUTURES* | BHI YEHI HAIN", { y: 360, size: 96 }); charsIn.rise(h4, 29.36, 0.02);
  const fc = card(s4, { left: 240, top: 720, width: 600, height: 420 });
  art(fc, { left: 40, top: 60, width: 200, height: 220 }, 160, 170, DOC);
  txt(fc, { left: 260, top: 80, font: "800 40px Manrope" }, "SHARE KA");
  txt(fc, { left: 260, top: 132, font: "800 40px Manrope", color: C.gt }, "SAUDA AAJ");
  txt(fc, { left: 260, top: 200, font: "600 28px Inter", color: C.mute }, "price aaj fix");
  txt(fc, { left: 260, top: 240, font: "600 28px Inter", color: C.mute }, "hisaab baad mein");
  fadeUp(fc, 29.76, 0.4, 30);
  OV.push(fc);

  // ═══ S5 31.12–40.52: share at Rs 100 today, you expect 110 by month-end → buy a future contract at Rs 100 ═══
  const s5 = scene(31.12, 40.52);
  const h5 = kin(s5, "MISAAL", { y: 150, size: 100 }); charsIn.rise(h5, 31.2, 0.02);
  const pc = card(s5, { left: 60, top: 320, width: 960, height: 560 });
  txt(pc, { left: 40, top: 30, font: "800 30px Manrope", color: C.mute, letterSpacing: ".06em" }, "SHARE PRICE");
  const now = txt(pc, { left: 40, top: 76, font: "700 64px 'IBM Plex Mono'" }, "Rs 100");
  const pl = line(pc, [[0, 0.3], [0.12, 0.36], [0.24, 0.32], [0.36, 0.42], [0.48, 0.38], [0.6, 0.45]], { x: 40, y: 190, w: 760, h: 300, n: 60, noise: 0.03, color: C.g2, grid: true, rows: 3, axis: ["Rs 115", "Rs 110", "Rs 105", "Rs 100"] });
  fadeUp(pc, 31.98, 0.4, 30); pl.draw(32.6, 0.9);
  const proj = art(pc, { left: 40 + 0.6 * 760, top: 190, width: 304, height: 300 }, 304, 300,
    `<path class="pj" d="M0,${300 * (1 - 0.45)} L304,${300 * (1 - 0.82)}" fill="none" stroke="${C.g2}" stroke-width="7" stroke-dasharray="14 12" stroke-linecap="round"/>
     <circle cx="304" cy="${300 * (1 - 0.82)}" r="14" fill="#fff" stroke="${C.g2}" stroke-width="6"/>`);
  const guess = el(pc, { left: 610, top: 118, padding: "8px 18px", borderRadius: 14, background: "#E8F8DF", border: `3px solid ${C.g2}`, font: "800 30px Manrope", color: C.gt, whiteSpace: "nowrap" }, "MAHINE KE END: 110?");
  tl.fromTo(proj, { opacity: 0 }, { opacity: 1, duration: 0.4, immediateRender: false }, 35.72); tl.set(proj, { opacity: 0 }, 0);
  fadeUp(guess, 35.72, 0.35, 14);
  const tk = card(s5, { left: 160, top: 940, width: 760, height: 300, border: `5px solid ${C.g}` });
  art(tk, { left: 40, top: 50, width: 160, height: 190 }, 160, 170, DOC);
  txt(tk, { left: 230, top: 50, font: "800 36px Manrope", color: C.mute }, "FUTURE CONTRACT");
  txt(tk, { left: 230, top: 104, font: "700 64px 'IBM Plex Mono'", color: C.gt }, "BUY @ Rs 100");
  txt(tk, { left: 230, top: 196, font: "600 28px Inter", color: C.mute }, "hisaab: mahine ke end par");
  fadeUp(tk, 38.84, 0.45, 30);
  OV.push(pc, tk);

  // ═══ S6 40.52–44.82: only margin — a small part instead of the full amount ═══
  const s6 = scene(40.52, 44.82);
  const h6 = kin(s6, "SIRF *MARGIN*", { y: 150, size: 110 }); charsIn.rise(h6, 41.74, 0.02);
  const mg = card(s6, { left: 60, top: 400, width: 960, height: 520 });
  txt(mg, { left: 40, top: 40, font: "800 34px Manrope", color: C.mute }, "POORI RAQAM");
  const full = el(mg, { left: 40, top: 100, width: 880, height: 110, borderRadius: 18, border: `4px dashed #9AA8A0`, background: "#F1F4F2" });
  txt(full, { left: 30, top: 28, font: "700 44px 'IBM Plex Mono'", color: "#9AA8A0" }, "Rs 100");
  txt(mg, { left: 0, top: 270, width: 960, textAlign: "center", font: "800 34px Manrope", color: C.gt }, "AAP JAMA KARATE HAIN");
  const part = el(mg, { left: 370, top: 330, width: 220, height: 110, borderRadius: 18, border: `4px solid ${C.ink}`, background: C.g, transformOrigin: "50% 50%" });
  txt(part, { left: 0, top: 28, width: 212, textAlign: "center", font: "800 40px Manrope", color: C.ink }, "MARGIN");
  fadeUp(mg, 40.78, 0.4, 30);
  tl.set(part, { scaleX: 0 }, 0); tl.to(part, { scaleX: 1, duration: 0.5, ease: "power2.out" }, 42.08);
  const small = bigChip(s6, 1000, "CHHOTA SA HISSA JAMA", { background: C.g, borderColor: C.g });
  fadeUp(small, 43.12, 0.35, 16);
  OV.push(mg, small);

  // ═══ S7 44.82–52.38: month-end — 110 → +Rs 10 per share; 90 → −Rs 10 per share ═══
  const s7 = scene(44.82, 52.38);
  const h7 = kin(s7, "MAHINE KE *END* PAR", { y: 150, size: 96 }); charsIn.rise(h7, 44.86, 0.02);
  const oc = card(s7, { left: 60, top: 320, width: 960, height: 600 });
  const W = 760, H = 460, yv = (v) => H * (1 - (v - 85) / 30);   // Rs 85..115
  const ocs = art(oc, { left: 40, top: 70, width: W, height: H }, W, H,
    [115, 110, 100, 90, 85].map((v) => `<line x1="0" x2="${W}" y1="${yv(v)}" y2="${yv(v)}" stroke="#D9E3DC" stroke-width="2" stroke-dasharray="${v === 85 ? 0 : "6 8"}"/><text x="${W + 14}" y="${yv(v) + 9}" font-family="IBM Plex Mono" font-weight="600" font-size="24" fill="#8A948F">Rs ${v}</text>`).join("") +
    `<path d="M0,${yv(100)} H${W * 0.45}" stroke="${C.ink}" stroke-width="5" stroke-dasharray="12 10"/>
     <circle cx="${W * 0.45}" cy="${yv(100)}" r="14" fill="${C.ink}"/>
     <path class="upP" d="M${W * 0.45},${yv(100)} L${W * 0.55},${yv(103)} L${W * 0.65},${yv(101.5)} L${W * 0.77},${yv(106)} L${W * 0.88},${yv(105)} L${W},${yv(110)}" fill="none" stroke="${C.g2}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" opacity="0"/>
     <path class="dnP" d="M${W * 0.45},${yv(100)} L${W * 0.55},${yv(97.5)} L${W * 0.65},${yv(99)} L${W * 0.77},${yv(94)} L${W * 0.88},${yv(95)} L${W},${yv(90)}" fill="none" stroke="${C.red}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" opacity="0"/>`);
  txt(oc, { left: 40, top: 26, font: "800 28px Manrope", color: C.mute }, "ENTRY Rs 100 · AAJ");
  txt(oc, { left: 40 + W * 0.45 - 40, top: 70 + yv(100) + 24, font: "700 24px 'IBM Plex Mono'", color: C.ink }, "ENTRY");
  fadeUp(oc, 44.9, 0.4, 30);
  tl.fromTo(ocs.querySelector(".upP"), { opacity: 0 }, { opacity: 1, duration: 0.7, ease: "power1.inOut", immediateRender: false }, 46.24);
  tl.fromTo(ocs.querySelector(".dnP"), { opacity: 0 }, { opacity: 1, duration: 0.7, ease: "power1.inOut", immediateRender: false }, 50.26);
  const gain = bigChip(s7, 990, "110 → +Rs 10 FAIDA / share", { borderColor: C.g, color: C.gt });
  const loss = bigChip(s7, 1110, "90 → −Rs 10 NUQSAN / share", { borderColor: C.red, color: C.red });
  fadeUp(gain, 49.36, 0.35, 16); fadeUp(loss, 51.82, 0.35, 16);
  OV.push(oc, gain, loss);

  // ═══ S8 52.38–59.26: margin makes the gain bigger — and the loss too; understand the risk first ═══
  const s8 = scene(52.38, 59.26);
  const h8 = kin(s8, "YAAD *RAHE*", { y: 150, size: 110, accent: C.red }); charsIn.rise(h8, 52.76, 0.02);
  const mc = card(s8, { left: 60, top: 340, width: 960, height: 150 });
  txt(mc, { left: 40, top: 46, font: "800 38px Manrope" }, "MARGIN");
  txt(mc, { left: 260, top: 38, font: "700 60px 'IBM Plex Mono'", color: C.gt }, "Rs 20");
  txt(mc, { left: 480, top: 56, font: "500 26px Inter", color: C.mute }, "(misaal)");
  fadeUp(mc, 53.48, 0.4, 24);
  const up = card(s8, { left: 60, top: 540, width: 460, height: 400, border: `4px solid ${C.g}` });
  art(up, { left: 160, top: 30, width: 140, height: 140 }, 100, 100, `<path d="M50,8 L92,58 H66 V92 H34 V58 H8Z" fill="${C.g}" ${S}/>`);
  txt(up, { left: 0, top: 190, width: 460, textAlign: "center", font: "700 40px 'IBM Plex Mono'", color: C.gt }, "+Rs 10");
  txt(up, { left: 0, top: 250, width: 460, textAlign: "center", font: "800 56px Manrope", color: C.gt }, "+50%");
  txt(up, { left: 0, top: 330, width: 460, textAlign: "center", font: "600 26px Inter", color: C.mute }, "faida bhi bara");
  const dn = card(s8, { left: 560, top: 540, width: 460, height: 400, border: `4px solid ${C.red}` });
  art(dn, { left: 160, top: 30, width: 140, height: 140 }, 100, 100, `<path d="M50,92 L92,42 H66 V8 H34 V42 H8Z" fill="${C.red}" ${S}/>`);
  txt(dn, { left: 0, top: 190, width: 460, textAlign: "center", font: "700 40px 'IBM Plex Mono'", color: C.red }, "−Rs 10");
  txt(dn, { left: 0, top: 250, width: 460, textAlign: "center", font: "800 56px Manrope", color: C.red }, "−50%");
  txt(dn, { left: 0, top: 330, width: 460, textAlign: "center", font: "600 26px Inter", color: C.mute }, "nuqsan bhi bara");
  fadeUp(up, 54.1, 0.4, 24); fadeUp(dn, 55.88, 0.4, 24);
  const risk = bigChip(s8, 1010, `<svg viewBox="0 0 48 44" width="66" height="60" style="display:block"><path d="M24,3 L46,41 H2Z" fill="#FFD95A" stroke="#0B0F14" stroke-width="4" stroke-linejoin="round"/><path d="M24,16 V28 M24,34 V35" stroke="#0B0F14" stroke-width="5" stroke-linecap="round"/></svg>PEHLE RISK SAMJHEIN`, { background: C.ink, borderColor: C.ink, color: "#fff", display: "flex", alignItems: "center", gap: "18px", padding: "14px 44px" });
  fadeUp(risk, 57.72, 0.35, 16);
  OV.push(mc, up, dn, risk);

  // ═══ S9 59.26–69: CTA → FloStocks icon → logo → disclaimer ═══
  const s9 = scene(59.26, 69, { push: false });
  const t1 = kin(s9, "MARKET KE TERMS", { y: 560, size: 100 }); const t2 = kin(s9, "*AASAAN* ZUBAAN MEIN", { y: 700, size: 86 });
  charsIn.rise(t1, 59.36, 0.02); charsIn.rise(t2, 60.6, 0.02);
  tl.to([t1, t2], { y: -40, opacity: 0, duration: 0.3, ease: "power2.in" }, 62.6);
  const cta = ctaLogo(s9, 63.0, { tDisc: 64.6 });
  OV.push(cta.fl);

  K.linkScenes();
  window.__sceneCuts = (window.__sceneCuts || []).map(R);
  OV.forEach((e) => e && e.setAttribute("data-ov", ""));
  tl.seek(0);
})();
