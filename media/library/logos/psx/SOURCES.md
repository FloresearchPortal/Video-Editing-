# PSX company logos — sources

Collected 2026-11-03 from each company's own official website only (no Wikipedia, no
logo aggregators, no image search). Files are unaltered except for trimming empty
transparent margins (and, for UBL, cutting the logo's own region out of the site's CSS
sprite sheet, at the exact position the site's stylesheet uses).

**Licence:** every file here is a trademark of its company; used only to identify the
company in FloStocks editorial content. Not free-licensed.

| Ticker | Company | File | Downloaded from (exact URL) | Found on page | Date | Note |
|---|---|---|---|---|---|---|
| UBL | United Bank Limited | `UBL.png` (232×139, transparent) | https://www.ubldigital.com/Portals/_default/skins/ubldigital/NewHome/imgs/ubl-base-sprite.png (sprite region 0,0 — the colour header logo, CSS class `.ubl-logo` in `NewHome/css/mobile.css`) | https://www.ubldigital.com/ | 2026-11-03 | Trademark of United Bank Limited; used only to identify the company in FloStocks editorial content. Not free-licensed. |
| LUCK | Lucky Cement Limited | `LUCK.png` (352×129, transparent) | https://assets.lucky-cement.com/frontend/images/logo.png | https://lucky-cement.com/en (header logo) | 2026-11-03 | Trademark of Lucky Cement Limited; used only to identify the company in FloStocks editorial content. Not free-licensed. |
| HBL | Habib Bank Limited | `HBL.png` (338×66, transparent) | https://www.hbl.com/assets/theme_images/logo-1920-new.png | https://www.hbl.com/ (header `#mainLogo`, light-mode version) | 2026-11-03 | Trademark of Habib Bank Limited; used only to identify the company in FloStocks editorial content. Not free-licensed. |
| PAKT | Pakistan Tobacco Company Limited | `PAKT.png` (308×157, transparent) | https://www.ptc.com.pk/experience-fragments/endmarkets/pk/en/header/master/_jcr_content/root/container/batcom_header_copy_c/image.coreimg.png/1730706644846/pk.png | https://www.ptc.com.pk/ (header logo) | 2026-11-03 | Trademark of Pakistan Tobacco Company Limited; used only to identify the company in FloStocks editorial content. Not free-licensed. |

## Not collected (official site not reachable from the build environment on 2026-11-03)

| Ticker | Company | Official site | Why missing |
|---|---|---|---|
| OGDC | Oil & Gas Development Company Ltd | ogdcl.com | Site serves a Cloudflare bot challenge ("Just a moment…", HTTP 403) |
| MEBL | Meezan Bank Limited | meezanbank.com | Cloudflare bot challenge (HTTP 403) |
| FFC | Fauji Fertilizer Company Ltd | ffc.com.pk | Cloudflare bot challenge (HTTP 403) |
| PPL | Pakistan Petroleum Limited | ppl.com.pk | Cloudflare bot challenge (HTTP 403); bare domain resets the connection |
| MCB | MCB Bank Limited | mcb.com.pk | Cloudflare bot challenge (HTTP 403) |
| MARI | Mari Energies Limited | mari.com.pk | Egress proxy returned 502 on CONNECT (www and bare domain) |

To add these, download the header logo by hand from the official site in a normal
browser, save it here as `<TICKER>.<svg|png|webp|jpg>`, and add a row above.
