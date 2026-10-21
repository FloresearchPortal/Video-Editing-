// Brand 3-font system, loaded OFFLINE from media/fonts/ (all SIL OFL — see assets/fonts/OFL*.txt).
// Previously fetched from Google Fonts at render time; that breaks behind TLS-intercepting
// egress proxies, so the same families now ship as local TTFs. Swap a family here and every
// shot follows. `/brand-setup` rewrites this file alongside brand.ts and brand.md; keep all
// three in sync if you edit by hand.
import { loadLocalFont } from './lib/localFont';

export const FONT_DISPLAY = loadLocalFont('Space Grotesk', 'SpaceGrotesk-wght.ttf', '300 700');
export const FONT_BODY = loadLocalFont('Inter', 'Inter-opsz-wght.ttf', '100 900');
export const FONT_MONO = loadLocalFont('JetBrains Mono', 'JetBrainsMono-wght.ttf', '100 800');
// serif for the Claude Code wordmark clone (close match to the app's serif) — not a brand font
export const FONT_SERIF = ((): string => {
  loadLocalFont('Spectral', 'Spectral-Medium.ttf', '500');
  return loadLocalFont('Spectral', 'Spectral-SemiBold.ttf', '600');
})();
