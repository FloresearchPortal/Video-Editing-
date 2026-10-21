# media/fonts — fonts served to Remotion shots (offline)

Remotion's `publicDir` is `media/`, so shots load these via `staticFile('fonts/…')` through
`remotion/src/lib/localFont.ts` instead of fetching Google Fonts at render time (render-time
fetches fail behind TLS-intercepting egress proxies and on offline machines).

All families are licensed under the SIL Open Font License 1.1:

| File | Family | Source |
|---|---|---|
| Manrope-ExtraBold.ttf, Manrope-Bold.ttf | Manrope | copied from `assets/fonts/` (OFL — see `assets/fonts/OFL-Manrope.txt`) |
| Inter-Bold.ttf, Inter-Light.ttf, Inter-ExtraLight.ttf | Inter | copied from `assets/fonts/` (OFL — see `assets/fonts/OFL-Inter.txt`) |
| IBMPlexMono-SemiBold.ttf | IBM Plex Mono | copied from `assets/fonts/` (OFL — see `assets/fonts/OFL-IBMPlexMono.txt`) |
| Inter-opsz-wght.ttf | Inter (variable) | github.com/google/fonts `ofl/inter` (OFL 1.1) |
| SpaceGrotesk-wght.ttf | Space Grotesk (variable) | github.com/google/fonts `ofl/spacegrotesk` (OFL 1.1) |
| JetBrainsMono-wght.ttf | JetBrains Mono (variable) | github.com/google/fonts `ofl/jetbrainsmono` (OFL 1.1) |
| Spectral-Medium.ttf, Spectral-SemiBold.ttf | Spectral | github.com/google/fonts `ofl/spectral` (OFL 1.1) |
