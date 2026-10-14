// Standalone entry for the PSX Top 10 reel: registers only this composition, so a render never
// loads the other shots' network fonts (this reel ships its own font files).
import { registerRoot } from 'remotion';
import { Root } from './Root';

registerRoot(Root);
