# FloStocks brand kit

Gathered from https://www.flostocks.com (site CSS `:root` tokens, logo, headline copy), 2026-10-12.
Machine-readable source of truth: `brand.json`. Used by `reelkit.brand`, the captions stage
(`"brand": true` in a timeline) and the `quality-gate` brand checks.

| | |
|---|---|
| Name | **FloStocks** by Floret Capitals |
| Tagline | Pakistan's modern gateway to the stock market. |
| Headline | The fastest way to learn Pakistan's stock market. |
| CTAs | Open your PSX account · Explore the PSX Bootcamp · Analyze stocks with the PSX Analyzer |
| Socials | Instagram / Facebook / YouTube: @floretcapitals |
| Voice | Clear, confident, educational, trustworthy (regulated brokerage); no hype, never promise returns |

## Colours (site tokens)
| Token | Hex | Use |
|---|---|---|
| green | `#38d100` | primary accent, CTA buttons, keyword captions |
| green_deep | `#1f7a00` | text on light backgrounds |
| logo_green | `#2f9f00` | wordmark "STOCKS" |
| lime | `#45e01f` | highlights |
| mint | `#7edca8` | secondary caption accent |
| ink | `#0a0e0a` | dark backgrounds, end card |
| paper / mist | `#ffffff` / `#f5f7fa` | light backgrounds |
| rise / fall | `#17971e` / `#e23b2e` | market up / down numbers |
| amber | `#c4820e` | warnings |

## Type (all SIL Open Font License, in `assets/fonts/`)
- **Manrope** ExtraBold/Bold: display, caption keywords (slanted 10° to echo the italic wordmark)
- **Inter** Bold / Light / ExtraLight: body, caption words
- **IBM Plex Mono** SemiBold: prices, %, tickers, URLs

## Logos (`logo/`)
- `flostocks-logo-full.png`: on light backgrounds (original)
- `flostocks-logo-full-light.png`: on dark video / ink (ink parts turned white)
- `flostocks-icon.png` / `flostocks-icon-light.png`: mark only (watermark)

## Video rules
- Watermark: light icon, top-right, 11 % of width, 85 % opacity.
- End card (2.5 s, last clip): ink background, green glow, light logo, tagline, green CTA button,
  flostocks.com, @floretcapitals, market-risk disclaimer. Generate: `python -m reelkit.brand endcard`.
- Disclaimer text is a standard market-risk line. Confirm the exact wording with Floret
  Capitals' compliance before publishing.
