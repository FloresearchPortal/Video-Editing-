// Line-art props for the dark kinetic world: white fills + ink strokes, shown as stickers (white
// outline + drop shadow) so they match the Notionists cast. K.icon(parent, name, x, y, w, h, ...args)
(function () {
  const { C, el } = K;
  const S = `stroke="#0B0F14" stroke-width="8" stroke-linejoin="round" stroke-linecap="round"`;
  const STK = "drop-shadow(0 16px 20px rgba(20,40,20,.18))";
  const W = "#FFFFFF", WASH = "#DDF3D2";
  const I = {
    stall: (sign = "AHMED CHAI", part) => part === "back" ? `<svg viewBox="0 0 800 640"><rect x="70" y="150" width="660" height="440" fill="${W}" ${S}/></svg>` : `<svg viewBox="0 0 800 640">
      ${part === "front" ? "" : `<rect x="70" y="150" width="660" height="440" fill="${W}" ${S}/>`}
      <rect x="110" y="70" width="580" height="96" rx="16" fill="#0B0F14"/>
      <text x="400" y="136" text-anchor="middle" font-family="Manrope" font-weight="800" font-size="54" fill="${C.g}" letter-spacing="3">${sign}</text>
      <g class="awning">${[0, 1, 2, 3, 4, 5, 6, 7].map((i) => `<path d="M${40 + i * 90},180 h90 v74 a45,45 0 0 1 -90,0Z" fill="${i % 2 ? W : C.g}" ${S}/>`).join("")}</g>
      <rect x="40" y="170" width="720" height="18" fill="#0B0F14"/>
      <g class="counter"><rect x="40" y="430" width="720" height="170" rx="12" fill="${W}" ${S}/><path d="M40,472 h720" ${S}/>
      <rect x="290" y="500" width="220" height="64" rx="12" fill="${C.g}" ${S}/>
      <text x="400" y="544" text-anchor="middle" font-family="Manrope" font-weight="800" font-size="32" fill="#0B0F14">CHAI ☕</text></g>
      <g class="cups">${[590, 655].map((x) => `<path d="M${x},378 h46 l-6,52 h-34Z" fill="${W}" ${S}/><path class="steam" d="M${x + 12},356 q-10,-16 0,-32 q10,-16 0,-32" fill="none" stroke="#C9D3CD" stroke-width="7" stroke-linecap="round"/>`).join("")}
      <path d="M120,380 h120 l-10,50 h-100Z" fill="${WASH}" ${S}/><path d="M142,380 q-10,-44 38,-44 q48,0 38,44" fill="${W}" ${S}/></g></svg>`,
    miniStall: () => `<svg viewBox="0 0 200 180"><rect x="20" y="50" width="160" height="120" fill="${W}" ${S}/>
      ${[0, 1, 2, 3].map((i) => `<path d="M${14 + i * 43},44 h43 v28 a21.5,21.5 0 0 1 -43,0Z" fill="${i % 2 ? W : C.g}" ${S}/>`).join("")}
      <rect x="30" y="118" width="140" height="52" fill="${W}" ${S}/><rect x="40" y="6" width="120" height="32" rx="7" fill="#0B0F14"/>
      <text x="100" y="30" text-anchor="middle" font-family="Manrope" font-weight="800" font-size="18" fill="${C.g}">CHAI</text></svg>`,
    wallet: () => `<svg viewBox="0 0 420 300"><rect x="20" y="60" width="380" height="220" rx="28" fill="${W}" ${S}/><path d="M20,112 h380" ${S}/>
      <rect x="300" y="140" width="100" height="72" rx="16" fill="${WASH}" ${S}/><circle cx="336" cy="176" r="11" fill="#0B0F14"/>
      <g class="moth"><path d="M150,170 q-30,-30 -40,0 q10,25 40,0 q30,-30 40,0 q-10,25 -40,0" fill="${W}" ${S}/></g></svg>`,
    bank: () => `<svg viewBox="0 0 360 320"><path d="M20,112 L180,24 L340,112Z" fill="${W}" ${S}/>
      ${[60, 130, 200, 270].map((x) => `<rect x="${x}" y="122" width="30" height="138" fill="${W}" ${S}/>`).join("")}
      <rect x="20" y="260" width="320" height="42" fill="${W}" ${S}/><text x="180" y="98" text-anchor="middle" font-family="Manrope" font-weight="800" font-size="36" fill="#0B0F14">BANK</text></svg>`,
    crate: () => `<svg viewBox="0 0 460 340"><rect x="20" y="40" width="420" height="280" rx="20" fill="${W}" ${S}/>
      ${[0, 1, 2, 3, 4].map((r) => [0, 1, 2, 3, 4, 5, 6, 7].map((c) => `<rect x="${52 + c * 46}" y="${70 + r * 46}" width="34" height="34" rx="7" fill="${(r + c) % 3 ? WASH : C.g}" stroke="#0B0F14" stroke-width="4"/>`).join("")).join("")}</svg>`,
    lock: () => `<svg viewBox="0 0 160 190"><path d="M40,82 V56 a40,40 0 0 1 80,0 V82" fill="none" stroke="#0B0F14" stroke-width="14"/><rect x="14" y="80" width="132" height="98" rx="18" fill="${C.g}" ${S}/><circle cx="80" cy="122" r="13" fill="#0B0F14"/><path d="M80,128 v24" ${S}/></svg>`,
    phone: () => `<svg viewBox="0 0 400 640"><rect x="10" y="10" width="380" height="620" rx="56" fill="#0B0F14" stroke="#0B0F14" stroke-width="8"/><rect x="30" y="34" width="340" height="572" rx="38" fill="#F7F8F7"/>
      <rect x="150" y="50" width="100" height="22" rx="11" fill="#000"/></svg>`,
    coin: () => `<svg viewBox="0 0 100 100"><circle cx="50" cy="50" r="44" fill="#FFD95A" ${S}/><circle cx="50" cy="50" r="30" fill="#F2B526"/><text x="50" y="62" text-anchor="middle" font-family="Manrope" font-weight="800" font-size="32" fill="#5A3B00">Rs</text></svg>`,
    ticket: (t = "SHARE") => `<svg viewBox="0 0 240 140"><rect x="8" y="8" width="224" height="124" rx="20" fill="${C.g}" ${S}/>
      <circle cx="8" cy="70" r="18" fill="#F7F8F7"/><circle cx="232" cy="70" r="18" fill="#F7F8F7"/>
      <text x="120" y="86" text-anchor="middle" font-family="Manrope" font-weight="800" font-size="42" fill="#0B0F14">${t}</text></svg>`,
    clock: () => `<svg viewBox="0 0 300 300"><circle cx="150" cy="150" r="130" fill="${W}" ${S}/>${Array.from({ length: 12 }, (_, i) => { const a = i / 12 * Math.PI * 2; return `<line x1="${150 + Math.cos(a) * 104}" y1="${150 + Math.sin(a) * 104}" x2="${150 + Math.cos(a) * 118}" y2="${150 + Math.sin(a) * 118}" ${S}/>`; }).join("")}
      <g class="hh"><line x1="150" y1="150" x2="150" y2="84" stroke="#0B0F14" stroke-width="12" stroke-linecap="round"/></g><g class="mh"><line x1="150" y1="150" x2="150" y2="50" stroke="${C.g3}" stroke-width="9" stroke-linecap="round"/></g><circle cx="150" cy="150" r="12" fill="#0B0F14"/></svg>`,
    sofa: () => `<svg viewBox="0 0 800 300"><rect x="40" y="70" width="720" height="150" rx="40" fill="${WASH}" ${S}/>
      <rect x="10" y="120" width="110" height="150" rx="34" fill="${W}" ${S}/><rect x="680" y="120" width="110" height="150" rx="34" fill="${W}" ${S}/>
      <rect x="110" y="170" width="580" height="90" rx="22" fill="${W}" ${S}/><path d="M120,262 v30 M680,262 v30" ${S}/></svg>`,
    shield: () => `<svg viewBox="0 0 200 230"><path d="M100,12 L184,44 V112 C184,170 146,206 100,222 C54,206 16,170 16,112 V44Z" fill="${C.g}" ${S}/>
      <path d="M60,116 l28,28 l54,-60" fill="none" stroke="#0B0F14" stroke-width="16" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    bulb: () => `<svg viewBox="0 0 240 300"><path d="M120,20 a90,90 0 0 1 56,160 v38 h-112 v-38 a90,90 0 0 1 56,-160Z" fill="${C.g}" ${S}/><path d="M78,240 h84 M86,268 h68" ${S}/></svg>`,
    water: () => `<svg viewBox="0 0 900 220"><path class="wv" d="M0,60 q56,-40 112,0 t112,0 t112,0 t112,0 t112,0 t112,0 t112,0 t112,0 t112,0 V220 H0Z" fill="#4DA3E0" stroke="#0B0F14" stroke-width="7"/></svg>`,
    skyline: () => `<svg viewBox="0 0 900 380">${[[20, 150, 110], [140, 70, 100], [250, 190, 90], [350, 30, 130], [490, 130, 100], [600, 80, 110], [720, 170, 140]]
      .map(([x, y, w]) => `<rect class="bld" x="${x}" y="${y}" width="${w}" height="${380 - y}" fill="none" stroke="${C.g}" stroke-width="6" pathLength="100" stroke-dasharray="100" stroke-dashoffset="100"/>${[0, 1, 2, 3].map((r) => `<rect class="win" x="${x + 20}" y="${y + 30 + r * 50}" width="18" height="24" fill="${C.g}" opacity="0"/><rect class="win" x="${x + w - 38}" y="${y + 30 + r * 50}" width="18" height="24" fill="${C.g}" opacity="0"/>`).join("")}`).join("")}
      <line x1="0" y1="378" x2="900" y2="378" stroke="${C.g}" stroke-width="6"/></svg>`,
  };
  K.ICON = I;
  K.icon = (parent, name, x, y, w, h, a, b, flat) => {
    const d = el(parent, { left: x, top: y, width: w, height: h }, I[name](a, b), "icon");
    if (!flat) d.style.filter = STK;
    return d;
  };
})();
