# PSX TOP 10 — what to send for a new episode

Send these **4 things** (plain text is fine; the bot turns them into `brief.json`). Everything else
(white FloStocks theme, Poppins, intro, layout, motion, transitions, music, the KNOW THE MARKET,
INVEST SMARTER. end card and the risk disclaimer) is locked and comes out the same every time.

| # | Send | Example (EP 01) | Limits |
|---|---|---|---|
| 1 | **Episode number** | EP 01 | |
| 2 | **Title**: 2–3 short lines + pill label | TOP 10 COMPANIES / BY MARKET / CAPITALIZATION · pill: IN PSX | each line ≤ ~17 characters; pill ≤ ~10 |
| 3 | **The top 10**: rank, PSX ticker, value (+ unit and decimals) | 1 OGDC 1,289.16 · 2 UBL 1,025.71 … 10 PAKT 357.90 (Rs … bn, 2 decimals) | exactly 10 rows, positive values |
| 4 | **Source + date** of the numbers, and an optional total/average line | PSX Data Portal, close 14 Oct 2026 · TOP 10 TOTAL Rs 7.23 trillion | source is required |

Optional: the chart heading (default: "TOP 10 BY / <METRIC>").

**Data:** for metrics on the PSX Data Portal (market cap, price, shares) the bot can fetch the numbers
itself (`videos/psx-top10/data/fetch_psx.py`); just give the date. For anything else (dividend yield,
P/E, profit, volume over a period…) send the 10 values with their source.

**Company logos:** upload each official logo once as `media/library/logos/psx/<TICKER>.png` (or .svg).
They are reused automatically in every later episode. A missing logo just shows no logo. Logos are
never redrawn.

**Finance rule:** no promises of returns (the bot rejects words like "guaranteed", "risk-free",
"will double", "buy now").

## The same thing as JSON (`videos/top10/<slug>/brief.json`)

```json
{
 "episode": "EP 02",
 "slug": "ep02-dividend-yield",
 "title": ["TOP 10 COMPANIES", "BY DIVIDEND", "YIELD"],
 "pill": "IN PSX",
 "rankings": {
  "heading": ["TOP 10 BY", "DIVIDEND YIELD"],
  "subtitle": "% · trailing 12 months · PSX close <date>",
  "value_format": {"pre": "", "post": "%", "decimals": 1},
  "items": [{"rank": 1, "ticker": "XXXX", "name": "Company name", "value": 12.3}, "… 10 rows …"],
  "total": {"label": "TOP 10 AVERAGE", "value": "9.4%"},
  "source": "Source: <where the numbers come from>"
 }
}
```
(The numbers above are placeholders for the format, not data.) EP 01's real brief:
`videos/top10/ep01-market-cap/brief.json`.
