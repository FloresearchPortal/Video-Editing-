// FloStocks app UI (from the user's app screenshot), built as an animatable phone mockup.
// K.app(parent, x, y, scale) → refs for the timeline: value, allTime, today, buy (button), sheet, qty,
// total, buyBtn, toast, empty, card + card fields, finger.
(function () {
  const { el } = K;
  const G = "#2FA80C", GL = "#E6F4E0", RED = "#C62828", TX = "#111", SUB = "#6B6F6C", LINE = "#E9ECEA", BG = "#F7F8F7";
  const F = "Inter, sans-serif";
  const ico = {
    plus: `<svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" stroke="#111" stroke-width="2" stroke-linecap="round"/></svg>`,
    up: `<svg viewBox="0 0 24 24"><path d="M12 19V5M6 11l6-6 6 6" stroke="#111" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    down: `<svg viewBox="0 0 24 24"><path d="M12 5v14M6 13l6 6 6-6" stroke="#111" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    wd: `<svg viewBox="0 0 24 24"><path d="M12 4v11M7 10l5 5 5-5M5 20h14" stroke="#111" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    bag: `<svg viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="13" rx="3" fill="none" stroke="${G}" stroke-width="2"/><path d="M9 7V5h6v2M3 12h18" stroke="${G}" stroke-width="2" fill="none"/></svg>`,
    mark: `<svg viewBox="0 0 24 24"><path d="M6 3h12v18l-6-4-6 4z" fill="none" stroke="#111" stroke-width="2" stroke-linejoin="round"/></svg>`,
    mkt: `<svg viewBox="0 0 24 24"><path d="M3 20h18M6 16v-3M10 16v-6M14 16v-4M18 16V7M4 10l5-4 4 3 7-6" stroke="#111" stroke-width="1.8" fill="none" stroke-linecap="round"/></svg>`,
    disc: `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="none" stroke="#111" stroke-width="2"/><path d="M15.5 8.5l-2 5-5 2 2-5z" fill="none" stroke="#111" stroke-width="1.8"/></svg>`,
    bell: `<svg viewBox="0 0 24 24"><path d="M6 16V11a6 6 0 0 1 12 0v5l2 2H4z M10 20a2 2 0 0 0 4 0" fill="none" stroke="#111" stroke-width="2"/></svg>`,
    search: `<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7" fill="none" stroke="#111" stroke-width="2"/><path d="M16 16l5 5" stroke="#111" stroke-width="2" stroke-linecap="round"/></svg>`,
    coin: `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="${GL}" stroke="${G}" stroke-width="2"/><text x="12" y="16" text-anchor="middle" font-family="Inter" font-weight="700" font-size="10" fill="${G}">₨</text></svg>`,
  };
  const t = (p, css, html) => el(p, { fontFamily: F, color: TX, ...css }, html);

  K.app = function (parent, x, y, scale = 0.82) {
    const W = 590, H = 1280;
    const phone = el(parent, { left: x, top: y, width: W + 36, height: H + 36, background: "#0B0F14", borderRadius: 78, boxShadow: "0 40px 90px rgba(0,0,0,.6), 0 0 0 4px #2A332E" });
    gsap.set(phone, { scale, transformOrigin: "0% 0%" });
    const scr = el(phone, { left: 18, top: 18, width: W, height: H, background: BG, borderRadius: 62, overflow: "hidden" });
    const r = { phone, scr };
    // status bar + header
    t(scr, { left: 70, top: 26, font: `700 30px ${F}` }, "12:44");
    t(scr, { left: 470, top: 30, font: `700 22px ${F}` }, "▂▄▆ ◔");
    el(scr, { left: 25, top: 92, width: 66, height: 66, borderRadius: 33, background: G, font: `700 28px/66px ${F}`, color: "#fff", textAlign: "center" }, "A");
    t(scr, { left: 104, top: 94, font: `500 22px ${F}`, color: SUB }, "FloStocks");
    t(scr, { left: 104, top: 120, font: `700 25px ${F}` }, "Good Afternoon");
    el(scr, { left: 480, top: 104, width: 34, height: 34 }, ico.bell); el(scr, { left: 530, top: 104, width: 34, height: 34 }, ico.search);
    el(scr, { left: 0, top: 176, width: W, height: 2, background: LINE });
    t(scr, { left: 26, top: 196, font: `600 21px ${F}`, color: SUB }, "Current Value");
    r.value = t(scr, { left: 24, top: 222, font: `700 58px ${F}`, letterSpacing: "-0.02em" }, "0.00");
    t(scr, { left: 420, top: 196, font: `600 19px ${F}`, color: SUB }, "All time");
    r.allTime = t(scr, { left: 500, top: 196, font: `700 19px ${F}`, color: SUB }, "0.00");
    t(scr, { left: 436, top: 230, font: `600 19px ${F}`, color: SUB }, "Today");
    r.today = t(scr, { left: 500, top: 230, font: `700 19px ${F}`, color: SUB }, "0.00");
    // balance pills
    [["Account Balance", 26], ["Cash Balance", 256]].forEach(([l, px]) => {
      const p = el(scr, { left: px, top: 312, width: 218, height: 60, borderRadius: 30, background: "#fff", border: `2px solid ${LINE}` });
      el(p, { left: 8, top: 10, width: 40, height: 40 }, ico.coin);
      t(p, { left: 56, top: 8, font: `600 15px ${F}`, color: SUB }, l);
      t(p, { left: 56, top: 28, font: `700 18px ${F}` }, "5,000.00");
    });
    el(scr, { left: 486, top: 312, width: 80, height: 60, borderRadius: 30, background: GL, font: `700 16px/60px ${F}`, color: G, textAlign: "center" }, "More ›");
    // actions
    r.actions = {};
    [["Deposit", ico.plus], ["Sell", ico.up], ["Buy", ico.down], ["Withdraw", ico.wd]].forEach(([l, ic], i) => {
      const cx = 67 + i * 148;
      const b = el(scr, { left: cx - 30, top: 424, width: 60, height: 60, borderRadius: 30, background: "#EDEFEE" });
      el(b, { left: 15, top: 15, width: 30, height: 30 }, ic);
      t(scr, { left: cx - 60, top: 494, width: 120, textAlign: "center", font: `500 19px ${F}` }, l);
      r.actions[l] = b;
    });
    [["▥ Today's orders", 26, 260], ["◫ Weightage", 296, 166]].forEach(([l, px, w]) => {
      el(scr, { left: px, top: 548, width: w, height: 58, borderRadius: 29, background: "#fff", border: `2px solid ${LINE}`, font: `700 19px/54px ${F}`, color: TX, textAlign: "center" }, l);
    });
    t(scr, { left: 26, top: 646, font: `700 28px ${F}` }, "Holdings");
    const tog = el(scr, { left: 320, top: 642, width: 244, height: 40, borderRadius: 10, background: "#fff", border: `2px solid ${LINE}` });
    el(tog, { left: 0, top: 0, width: 122, height: 36, borderRadius: 9, background: "#000", font: `700 18px/36px ${F}`, color: "#fff", textAlign: "center" }, "Current");
    t(tog, { left: 122, top: 0, width: 122, textAlign: "center", font: `500 18px/36px ${F}`, color: SUB }, "All-time");
    r.empty = t(scr, { left: 0, top: 760, width: W, textAlign: "center", font: `500 21px ${F}`, color: SUB }, "No holdings yet");
    // holding card
    const card = el(scr, { left: 26, top: 704, width: 538, height: 164, borderRadius: 14, background: "#fff", border: `2px solid ${LINE}` });
    el(card, { left: 18, top: 24, width: 46, height: 46, borderRadius: 23, background: GL, font: `800 15px/46px Manrope`, color: G, textAlign: "center" }, "☕");
    t(card, { left: 76, top: 22, font: `700 22px ${F}` }, "ACHAI");
    t(card, { left: 76, top: 48, font: `500 17px ${F}`, color: SUB }, "Ahmed Chai");
    r.price = t(card, { left: 330, top: 22, width: 190, textAlign: "right", font: `500 22px ${F}` }, "100.00");
    r.chg = t(card, { left: 270, top: 50, width: 250, textAlign: "right", font: `600 17px ${F}`, color: SUB }, "0.00 (0.00%)");
    [["Shares", "5"], ["Cost", "100.00"], ["Value", "500"], ["P&L %", "0.00%"]].forEach(([l, v], i) => {
      t(card, { left: 14 + i * 130, top: 94, width: 120, textAlign: "center", font: `500 17px ${F}`, color: SUB }, l);
      r["c" + l] = t(card, { left: 14 + i * 130, top: 120, width: 120, textAlign: "center", font: `700 18px ${F}` }, v);
    });
    r.card = card;
    // bottom nav
    const nav = el(scr, { left: 22, top: 1166, width: 546, height: 84, borderRadius: 42, background: "#fff", border: `2px solid ${LINE}` });
    el(nav, { left: 10, top: 6, width: 124, height: 68, borderRadius: 34, background: GL });
    [["Portfolio", ico.bag, G], ["Watchlist", ico.mark, TX], ["Market", ico.mkt, TX], ["Discover", ico.disc, TX]].forEach(([l, ic, c], i) => {
      el(nav, { left: 54 + i * 132, top: 12, width: 30, height: 30 }, ic);
      t(nav, { left: 9 + i * 132, top: 46, width: 120, textAlign: "center", font: `600 15px ${F}`, color: c }, l);
    });
    // buy sheet
    const sheet = el(scr, { left: 0, top: 560, width: W, height: 720, background: "#fff", borderRadius: "36px 36px 0 0", boxShadow: "0 -20px 50px rgba(0,0,0,.18)" });
    el(scr, { left: 0, top: 0, width: W, height: H, background: "rgba(0,0,0,.28)" }, "", "dim");
    r.dim = scr.lastChild; scr.appendChild(sheet);
    el(sheet, { left: 255, top: 14, width: 80, height: 8, borderRadius: 4, background: LINE });
    t(sheet, { left: 32, top: 46, font: `700 32px ${F}` }, "Buy ACHAI");
    t(sheet, { left: 32, top: 92, font: `500 20px ${F}`, color: SUB }, "Ahmed Chai · PSX");
    t(sheet, { left: 32, top: 160, font: `600 20px ${F}`, color: SUB }, "Market price");
    t(sheet, { left: 360, top: 156, width: 200, textAlign: "right", font: `700 26px ${F}` }, "100.00");
    el(sheet, { left: 32, top: 210, width: 526, height: 2, background: LINE });
    t(sheet, { left: 32, top: 248, font: `600 20px ${F}`, color: SUB }, "Quantity");
    const step = el(sheet, { left: 330, top: 232, width: 228, height: 64, borderRadius: 32, border: `2px solid ${LINE}` });
    t(step, { left: 22, top: 10, font: `500 32px ${F}`, color: SUB }, "–");
    r.plus = el(step, { left: 164, top: 6, width: 52, height: 52, borderRadius: 26, background: GL, font: `600 32px/50px ${F}`, color: G, textAlign: "center" }, "+");
    r.qty = t(step, { left: 64, top: 12, width: 100, textAlign: "center", font: `700 30px ${F}` }, "0");
    el(sheet, { left: 32, top: 326, width: 526, height: 2, background: LINE });
    t(sheet, { left: 32, top: 362, font: `600 22px ${F}`, color: SUB }, "Total amount");
    r.total = t(sheet, { left: 300, top: 352, width: 258, textAlign: "right", font: `700 40px ${F}` }, "Rs 0");
    r.buyBtn = el(sheet, { left: 32, top: 450, width: 526, height: 86, borderRadius: 43, background: G, font: `700 30px/86px ${F}`, color: "#fff", textAlign: "center" }, "Buy");
    r.sheet = sheet;
    // toast
    r.toast = el(scr, { left: 70, top: 470, width: 450, height: 90, borderRadius: 45, background: "#111", font: `700 26px/90px ${F}`, color: "#fff", textAlign: "center" },
      `<span style="color:#38D100">✓</span> Order placed · 5 ACHAI`);
    // finger
    r.finger = el(phone, { left: 300, top: 1400, width: 110, height: 110 },
      `<svg viewBox="0 0 110 110"><circle cx="55" cy="55" r="34" fill="rgba(255,255,255,.75)" stroke="#0B0F14" stroke-width="5"/><circle cx="55" cy="55" r="12" fill="#0B0F14"/></svg>`);
    gsap.set([sheet], { yPercent: 105 }); gsap.set([r.dim, r.toast, card], { opacity: 0 });
    return r;
  };

  // tap: finger moves to (fx, fy) in phone coords and presses `target`
  K.tap = function (r, fx, fy, t, target) {
    const { tl } = K;
    tl.to(r.finger, { left: fx - 55, top: fy - 55, duration: 0.32, ease: "power3.inOut" }, t - 0.32)
      .to(r.finger, { scale: 0.8, duration: 0.07 }, t).to(r.finger, { scale: 1, duration: 0.15 }, t + 0.07);
    if (target) tl.to(target, { scale: 0.9, duration: 0.07 }, t).to(target, { scale: 1, duration: 0.2, ease: "back.out(3)" }, t + 0.07);
    const rip = el(r.phone, { left: fx - 50, top: fy - 50, width: 100, height: 100, borderRadius: "50%", border: "6px solid #38D100", opacity: 0 });
    tl.fromTo(rip, { scale: 0.3, opacity: 1 }, { scale: 1.8, opacity: 0, duration: 0.45, ease: "power2.out" }, t);
  };
})();
