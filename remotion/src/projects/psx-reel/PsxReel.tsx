// FLOSTOCKS EXPLAINS · EP 01, showreel cut: one continuous camera through a 3D market made of light.
import React from 'react';
import { AbsoluteFill, useCurrentFrame, useVideoConfig } from 'remotion';
import { ThreeCanvas } from '@remotion/three';
import { EffectComposer, Bloom, Vignette, Noise } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import { EndCard } from '../../series/flostocks/EndCard';
import { Backdrop } from '../../series/flostocks/Backdrop';
import { Atmosphere, CameraRig, CandleField, Coins, Ground, LogoBars, PriceLine, Towers } from './World';
import { Overlay } from './Overlay';
import { bf, CTA_STATIC, rp, S } from './timeline';

export const PsxReel: React.FC = () => {
  const f = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const end = bf(S.cta.start);
  const flash = rp(f, end - 7, end) * (1 - rp(f, end + 2, end + 10));
  return (
    <AbsoluteFill style={{ background: '#04070A' }}>
      {f < end + 2 && (
        <ThreeCanvas width={width} height={height} camera={{ position: [0, 2, 10], fov: 42 }} gl={{ antialias: true, preserveDrawingBuffer: true }}>
          <Atmosphere />
          <CameraRig />
          <Ground />
          <CandleField />
          <PriceLine />
          <Coins />
          <Towers />
          <LogoBars />
          <EffectComposer multisampling={4}>
            <Bloom intensity={0.95} luminanceThreshold={0.32} luminanceSmoothing={0.35} mipmapBlur />
            <Vignette offset={0.28} darkness={0.7} />
            <Noise opacity={0.06} blendFunction={BlendFunction.SOFT_LIGHT} />
          </EffectComposer>
        </ThreeCanvas>
      )}
      {f < end + 2 && <Overlay />}
      {f >= end - 1 && <AbsoluteFill><Backdrop /><EndCard from={end} settle={CTA_STATIC} /></AbsoluteFill>}
      {flash > 0 && <AbsoluteFill style={{ background: '#fff', opacity: flash }} />}
    </AbsoluteFill>
  );
};
