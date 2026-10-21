import React from 'react';
import { AbsoluteFill, Img } from 'remotion';
import { FS, FS_BODY, FS_MONO, LOGO } from '../../lib/flostocks';

// =============================================================================
// COMPOSITION CONFIG — static light end card, rendered to brand/endcard-light.png
// =============================================================================
export const compositionConfig = {
  id: 'FsEndcardLight',
  durationInSeconds: 1,
  fps: 30,
  width: 1080,
  height: 1920,
};

const DISCLAIMER =
  'Investments in securities are subject to market risks. Please read all relevant documents carefully before investing.';

const FsEndcardLight: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: FS.paper }}>
    <AbsoluteFill style={{ background: 'radial-gradient(900px 900px at 50% 40%, rgba(56,209,0,0.14), transparent 70%)' }} />
    <AbsoluteFill style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 90px' }}>
      <Img src={LOGO.fullOnLight} style={{ width: 760 }} />
      <p style={{ margin: '40px 0 0', fontFamily: FS_BODY, fontWeight: 300, fontSize: 42, color: FS.gray, textAlign: 'center' }}>
        Pakistan&apos;s modern gateway to the stock market
      </p>
      <div
        style={{
          marginTop: 80,
          padding: '34px 70px',
          borderRadius: 999,
          backgroundColor: FS.green,
          boxShadow: '0 22px 60px rgba(31,122,0,0.3)',
        }}
      >
        <span style={{ fontFamily: FS_BODY, fontWeight: 700, fontSize: 50, color: FS.ink }}>Open your PSX account →</span>
      </div>
      <p style={{ margin: '64px 0 0', fontFamily: FS_MONO, fontWeight: 600, fontSize: 60, color: FS.ink }}>flostocks.com</p>
      <p style={{ margin: '18px 0 0', fontFamily: FS_BODY, fontWeight: 600, fontSize: 36, color: FS.gray }}>@floretcapitals</p>
    </AbsoluteFill>
    <p
      style={{
        position: 'absolute',
        left: 110,
        right: 110,
        bottom: 330,
        margin: 0,
        textAlign: 'center',
        fontFamily: FS_BODY,
        fontWeight: 400,
        fontSize: 26,
        lineHeight: 1.45,
        color: FS.gray,
      }}
    >
      {DISCLAIMER}
    </p>
  </AbsoluteFill>
);

export default FsEndcardLight;
