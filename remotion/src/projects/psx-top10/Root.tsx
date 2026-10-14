import React from 'react';
import { Composition } from 'remotion';
import PsxTop10, { compositionConfig as c } from '../../shots/psx-top10/PsxTop10';

export const Root: React.FC = () => (
  <Composition id={c.id} component={PsxTop10} durationInFrames={Math.round(c.durationInSeconds * c.fps)} fps={c.fps} width={c.width} height={c.height} />
);
