// EP 01 hook (beats 0-4): the brand bars sweep off on frame 1, then the question punches in line by line.
import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { C } from '../../series/flostocks/theme';
import { Punch } from '../../series/flostocks/Kinetic';
import { bf, S, WIPES } from './timeline';
import { SWAP } from '../../series/flostocks/BrandWipe';

export const Hook: React.FC = () => {
  const f = useCurrentFrame();
  if (f >= bf(WIPES[0]) + SWAP) return null;
  const [a, b, c] = S.hook.lines.map(bf);
  return (
    <AbsoluteFill>
      <Punch at={a} top={760} size={136} color={C.ink} from="left">WHO ARE</Punch>
      <Punch at={b} top={910} size={136} color={C.green} from="right">THE BIGGEST</Punch>
      <Punch at={c} top={1060} size={136} color={C.ink} from="left">ON THE PSX?</Punch>
    </AbsoluteFill>
  );
};
