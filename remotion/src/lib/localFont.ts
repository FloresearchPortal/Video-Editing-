// Offline font loading: serve TTFs from media/fonts/ (the publicDir) via the FontFace API.
// Replaces @remotion/google-fonts network fetches, which fail behind TLS-intercepting
// egress proxies and on offline renders. Variable fonts take a weight range ('300 800').
import { continueRender, delayRender, staticFile } from 'remotion';

export const loadLocalFont = (family: string, file: string, weight: string, style = 'normal'): string => {
  if (typeof document !== 'undefined') {
    const handle = delayRender(`load font ${family} ${weight}`);
    const face = new FontFace(family, `url('${staticFile(`fonts/${file}`)}') format('truetype')`, {
      weight,
      style,
    });
    face
      .load()
      .then(() => {
        (document.fonts as unknown as { add: (f: FontFace) => void }).add(face);
        continueRender(handle);
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.error(`font ${family} (${file}) failed to load`, err);
        continueRender(handle);
      });
  }
  return family;
};
