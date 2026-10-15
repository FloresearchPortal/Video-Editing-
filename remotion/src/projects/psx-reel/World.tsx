// The 3D world of the showreel: one scene, one camera, frame-deterministic.
import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { useThree } from '@react-three/fiber';
import { continueRender, delayRender, useCurrentFrame } from 'remotion';
import {
  bf, camAt, CL, EZ, headPassFrame, headX, IGNITE_END, LINE_X0, LINE_X1, lineY, mx, riseFrame, rp, S, TOP,
  TOWER_MAX_H, TOWER_Z, towerH, towerX,
} from './timeline';

const GREEN = new THREE.Color('#2C9C00'), LIME = new THREE.Color('#3ACC00'), INK = new THREE.Color('#0B0F14');
const rng = (seed: number) => () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };

// ---------------------------------------------------------------- camera
export const CameraRig: React.FC = () => {
  const f = useCurrentFrame();
  const { camera } = useThree();
  useLayoutEffect(() => {
    const c = camAt(f);
    const cam = camera as THREE.PerspectiveCamera;
    cam.position.set(...c.pos);
    cam.fov = c.fov;
    cam.near = 0.1; cam.far = 400;
    cam.lookAt(...c.look);
    cam.updateProjectionMatrix();
  }, [f, camera]);
  return null;
};

// ---------------------------------------------------------------- ground: dark floor + fine grid
export const Ground: React.FC = () => {
  const grid = useMemo(() => {
    const pts: number[] = [];
    for (let x = -80; x <= 80; x += 2) pts.push(x, 0.002, -80, x, 0.002, 40);
    for (let z = -80; z <= 40; z += 2) pts.push(-80, 0.002, z, 80, 0.002, z);
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
    return g;
  }, []);
  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -20]}>
        <planeGeometry args={[400, 400]} />
        <meshStandardMaterial color="#06090C" roughness={0.55} metalness={0.4} />
      </mesh>
      <lineSegments geometry={grid}>
        <lineBasicMaterial color="#1F6E00" transparent opacity={0.22} />
      </lineSegments>
    </>
  );
};

// ---------------------------------------------------------------- the price line (draws with a glowing head)
const SEG = 900;
export const PriceLine: React.FC = () => {
  const f = useCurrentFrame();
  const geo = useMemo(() => {
    const pts: THREE.Vector3[] = [];
    for (let x = LINE_X0; x <= LINE_X1; x += 0.2) pts.push(new THREE.Vector3(x, lineY(x), 0));
    return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), SEG, 0.055, 8, false);
  }, []);
  const hx = headX(f), hy = lineY(hx);
  const u = (x: number) => (x - LINE_X0) / (LINE_X1 - LINE_X0);
  const start = Math.floor(u(headX(0)) * SEG) * 8 * 6;
  const end = Math.floor(u(hx) * SEG) * 8 * 6;
  geo.setDrawRange(start, Math.max(0, end - start));
  const pulse = 1 + 0.25 * Math.sin(f * 0.9);
  const fade = 1 - rp(f, bf(13), bf(14.6)); // the line steps back once we dive to the coin
  return (
    <group visible={fade > 0.01}>
      <mesh geometry={geo}>
        <meshStandardMaterial color="#3ACC00" emissive="#3ACC00" emissiveIntensity={2.2 * fade} transparent opacity={fade} />
      </mesh>
      <mesh position={[hx, hy, 0]} scale={0.22 * pulse}>
        <sphereGeometry args={[1, 24, 24]} />
        <meshBasicMaterial color="#E9FFD9" transparent opacity={fade} />
      </mesh>
      <mesh position={[hx, hy, 0]} scale={0.6 * pulse}>
        <sphereGeometry args={[1, 24, 24]} />
        <meshBasicMaterial color="#3ACC00" transparent opacity={0.35 * fade} />
      </mesh>
      <pointLight position={[hx, hy + 0.4, 1.2]} color="#7CFF3A" intensity={60 * fade} distance={16} decay={2} />
    </group>
  );
};

// ---------------------------------------------------------------- candlestick field (instanced)
const COLS = 81, ROWS = 18;
export const CandleField: React.FC = () => {
  const f = useCurrentFrame();
  const bodies = useRef<THREE.InstancedMesh>(null!);
  const wicks = useRef<THREE.InstancedMesh>(null!);
  const data = useMemo(() => {
    const r = rng(1410);
    const out: { x: number; z: number; h: number; base: number; up: boolean; delay: number }[] = [];
    for (let j = 0; j < ROWS; j++) {
      let v = 1.4 + r();
      for (let i = 0; i < COLS; i++) {
        const nv = Math.max(0.3, v + (r() - 0.47) * 0.9);
        out.push({ x: LINE_X0 + i, z: -2.6 - j * 1.55, h: Math.abs(nv - v) + 0.25, base: Math.min(v, nv), up: nv >= v, delay: j * 0.7 + r() * 3 });
        v = nv;
      }
    }
    return out;
  }, []);
  const tmp = useMemo(() => new THREE.Object3D(), []);
  useLayoutEffect(() => {
    data.forEach((d, i) => {
      const t0 = headPassFrame(d.x) + d.delay;
      const k = rp(f, t0, t0 + 14, EZ.back);
      tmp.position.set(d.x, (d.base + d.h / 2) * k, d.z);
      const w = 0.46 * Math.min(1, k * 4);
      tmp.scale.set(Math.max(0.0001, w), Math.max(0.0001, d.h * k), Math.max(0.0001, w));
      tmp.updateMatrix();
      bodies.current.setMatrixAt(i, tmp.matrix);
      tmp.position.set(d.x, (d.base + d.h / 2) * k, d.z);
      tmp.scale.set(Math.max(0.0001, 0.06 * Math.min(1, k * 4)), Math.max(0.0001, (d.h + 0.9) * k), Math.max(0.0001, 0.06 * Math.min(1, k * 4)));
      tmp.updateMatrix();
      wicks.current.setMatrixAt(i, tmp.matrix);
    });
    bodies.current.instanceMatrix.needsUpdate = true;
    wicks.current.instanceMatrix.needsUpdate = true;
  }, [f, data, tmp]);
  useLayoutEffect(() => {
    const c = new THREE.Color();
    data.forEach((d, i) => { c.set(d.up ? '#2C9C00' : '#1C252D'); bodies.current.setColorAt(i, c); wicks.current.setColorAt(i, c); });
    bodies.current.instanceColor!.needsUpdate = true; wicks.current.instanceColor!.needsUpdate = true;
  }, [data]);
  const dim = mx(1, 0.35, rp(f, bf(13), bf(15)));
  return (
    <>
      <instancedMesh ref={bodies} args={[undefined, undefined, data.length]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#ffffff" emissive="#2C9C00" emissiveIntensity={0.28 * dim} roughness={0.4} metalness={0.2} />
      </instancedMesh>
      <instancedMesh ref={wicks} args={[undefined, undefined, data.length]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="#ffffff" emissive="#2C9C00" emissiveIntensity={0.2 * dim} roughness={0.5} />
      </instancedMesh>
    </>
  );
};

// ---------------------------------------------------------------- Poppins canvas textures
// The WebGL canvas only redraws when the frame changes (@remotion/three, frameloop "never"), so once the
// font has loaded and the textures exist we draw once more ourselves before releasing the frame.
const canvasTex = (w: number, h: number, draw: (g: CanvasRenderingContext2D) => void) => {
  const cv = document.createElement('canvas'); cv.width = w; cv.height = h;
  const g = cv.getContext('2d')!; draw(g);
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; t.needsUpdate = true;
  return t;
};
function useFontTextures<T>(build: () => T): T | null {
  const [value, setValue] = useState<T | null>(null);
  const [handle] = useState(() => delayRender('poppins canvas textures', { timeoutInMilliseconds: 120000 }));
  const advance = useThree((st) => st.advance);
  useEffect(() => {
    const wait = new Promise((r) => setTimeout(r, 30000));
    Promise.race([Promise.all(['900 italic 80px Poppins', '800 60px Poppins', '600 40px Poppins'].map((q) => document.fonts.load(q))), wait])
      .catch(() => null).then(() => setValue(build()));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useLayoutEffect(() => {
    if (value) { advance(performance.now()); continueRender(handle); }
  }, [value, advance, handle]);
  return value;
}

// ---------------------------------------------------------------- one share -> the stack -> the monolith
const N_COIN = 80, HERO = 31, COIN_H = 0.19;
export const Coins: React.FC = () => {
  const f = useCurrentFrame();
  const stack = useRef<THREE.InstancedMesh>(null!);
  const face = useFontTextures(() => canvasTex(512, 512, (g) => {
    g.fillStyle = '#2C9C00'; g.beginPath(); g.arc(256, 256, 250, 0, Math.PI * 2); g.fill();
    g.strokeStyle = '#3ACC00'; g.lineWidth = 16; g.beginPath(); g.arc(256, 256, 214, 0, Math.PI * 2); g.stroke();
    g.fillStyle = '#ffffff'; g.textAlign = 'center';
    g.font = '900 italic 150px Poppins'; g.fillText('Rs', 256, 270);
    g.font = '600 46px Poppins'; g.fillText('1 SHARE', 256, 350);
  }));
  const sh = S.share;
  const appear = rp(f, bf(sh.coin), bf(sh.coin) + 12, EZ.back);
  const flip = rp(f, bf(sh.flip), bf(sh.flip) + 9, EZ.inOut);
  const cap = rp(f, bf(sh.cap) - 2, bf(sh.cap) + 6, EZ.inOut);
  const start = bf(sh.stack);
  const tmp = useMemo(() => new THREE.Object3D(), []);
  const dirs = useMemo(() => { const r = rng(77); return Array.from({ length: N_COIN }, () => { const a = r() * Math.PI * 2, b = (r() - 0.3) * 1.4; return [Math.cos(a) * Math.cos(b) * 18, Math.sin(b) * 14 + 8, Math.sin(a) * Math.cos(b) * 18 + 4, r() * 6] as const; }); }, []);
  useLayoutEffect(() => {
    if (!stack.current) return;
    for (let i = 0; i < N_COIN; i++) {
      const t = i === HERO ? 1 : rp(f, start + i * 0.35, start + i * 0.35 + 12, EZ.out);
      const [sx, sy, sz, spin] = dirs[i];
      const ty = 0.1 + i * COIN_H;
      tmp.position.set(mx(sx, 0, t), mx(sy, ty, t), mx(sz, TOWER_Z, t));
      tmp.rotation.set((1 - t) * spin, (1 - t) * spin * 0.7, 0);
      const vis = i === HERO ? 0 : (f >= start + i * 0.35 ? 1 : 0);
      tmp.scale.setScalar(vis * 1);
      tmp.updateMatrix();
      stack.current.setMatrixAt(i, tmp.matrix);
    }
    stack.current.instanceMatrix.needsUpdate = true;
  }, [f, dirs, start, tmp]);
  if (f < bf(sh.coin) - 1 || f > bf(S.towers.start) + 10) return null;
  const heroY = 0.1 + HERO * COIN_H;
  return (
    <group>
      {/* the hero share: faces the camera, spins, then flips flat into its slot in the stack */}
      <group position={[0, heroY, TOWER_Z]} rotation={[mx(Math.PI / 2, 0, flip), (1 - flip) * Math.sin(f * 0.12) * 0.5, 0]} scale={appear * (1 - cap)}>
        <mesh>
          <cylinderGeometry args={[0.85, 0.85, 0.16, 64]} />
          <meshStandardMaterial color="#2C9C00" emissive="#2C9C00" emissiveIntensity={0.5} metalness={0.7} roughness={0.25} />
        </mesh>
        {face && <mesh position={[0, 0.0805, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.85, 64]} /><meshBasicMaterial map={face} toneMapped={false} /></mesh>}
      </group>
      <instancedMesh ref={stack} args={[undefined, undefined, N_COIN]}>
        <cylinderGeometry args={[0.85, 0.85, 0.15, 48]} />
        <meshStandardMaterial color="#2C9C00" emissive="#3ACC00" emissiveIntensity={0.35} metalness={0.65} roughness={0.3} transparent opacity={1 - cap} />
      </instancedMesh>
    </group>
  );
};

// ---------------------------------------------------------------- the ten towers
const edgeGeo = new THREE.EdgesGeometry(new THREE.BoxGeometry(1, 1, 1));
export const Towers: React.FC = () => {
  const f = useCurrentFrame();
  const labels = useFontTextures(() => TOP.map((c) => canvasTex(640, 300, (g) => {
    g.textAlign = 'center';
    g.fillStyle = c.rank <= 3 ? '#3ACC00' : 'rgba(255,255,255,0.65)'; g.font = '800 46px Poppins'; g.fillText(`#${c.rank}`, 320, 58);
    g.fillStyle = '#ffffff'; g.font = '900 italic 118px Poppins'; g.fillText(c.ticker, 320, 178);
    g.fillStyle = 'rgba(255,255,255,0.82)'; g.font = '600 44px Poppins'; g.fillText(`Rs ${c.mcap_bn.toLocaleString('en-US', { minimumFractionDigits: 2 })} bn`, 320, 250);
  })));
  const cap = rp(f, bf(S.share.cap) - 2, bf(S.share.cap) + 6, EZ.inOut);
  if (f < bf(S.share.cap) - 3) return null;
  const sink = (r: number) => rp(f, bf(S.logo.start) + (10 - r) * 0.8, bf(S.logo.start) + (10 - r) * 0.8 + 12, EZ.in);
  return (
    <group>
      {TOP.map((c, idx) => {
        const r = c.rank;
        const H = towerH(c.mcap_bn);
        const k = r === 1 ? cap : rp(f, riseFrame(r) - 2, riseFrame(r) + 12, EZ.back);
        const s = Math.max(0.0001, k * (1 - sink(r)));
        const x = towerX(r);
        const hero = r === 1;
        const top3 = r <= 3;
        const lab = r === 1 ? rp(f, bf(S.towers.start), bf(S.towers.start) + 10) : rp(f, riseFrame(r) + 4, riseFrame(r) + 12);
        if (k <= 0.002 || s <= 0.002) return null;
        return (
          <group key={c.ticker} position={[x, 0, TOWER_Z]}>
            <mesh position={[0, (H * s) / 2, 0]} scale={[1.7, H * s, 1.7]}>
              <boxGeometry args={[1, 1, 1]} />
              <meshStandardMaterial color={hero ? '#2C9C00' : '#07100B'} emissive={hero ? '#3ACC00' : '#2C9C00'} emissiveIntensity={hero ? 0.55 : top3 ? 0.14 : 0.05} metalness={0.7} roughness={0.22} transparent opacity={hero ? cap : 0.94} />
            </mesh>
            <lineSegments geometry={edgeGeo} position={[0, (H * s) / 2, 0]} scale={[1.71, H * s, 1.71]}>
              <lineBasicMaterial color={top3 ? '#7CFF3A' : '#3ACC00'} transparent opacity={Math.min(1, k * 3) * (1 - sink(r))} toneMapped={false} />
            </lineSegments>
            <mesh position={[0, H * s + 0.04, 0]} scale={[1.72, 0.08, 1.72]}>
              <boxGeometry args={[1, 1, 1]} />
              <meshBasicMaterial color={top3 ? '#7CFF3A' : '#3ACC00'} toneMapped={false} transparent opacity={Math.min(1, k * 3) * (1 - sink(r))} />
            </mesh>
            {labels && <mesh position={[0, 1.05, 0.9]} scale={[2.72, 1.275, 1]}>
              <planeGeometry args={[1, 1]} />
              <meshBasicMaterial map={labels[idx]} transparent opacity={lab * (1 - sink(r))} toneMapped={false} depthWrite={false} />
            </mesh>}
          </group>
        );
      })}
    </group>
  );
};

// ---------------------------------------------------------------- the logo mark: three slanted bars
const barGeo = (() => {
  const g = new THREE.BoxGeometry(2.3, 13, 0.7);
  g.translate(0, 6.5, 0);
  g.applyMatrix4(new THREE.Matrix4().set(1, 0.2, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1)); // shear: x += 0.2 y
  g.translate(-1.3, 0, 0);
  return g;
})();
export const LOGO_X = -4, LOGO_Z = 9;
export const LogoBars: React.FC = () => {
  const f = useCurrentFrame();
  const a = bf(S.logo.start);
  if (f < a - 1) return null;
  const cols = ['#2C9C00', '#3ACC00', '#F4FFF0'];
  return (
    <group position={[LOGO_X, 0, LOGO_Z]}>
      {cols.map((c, i) => {
        const k = rp(f, a + 4 + i * 2.5, a + 18 + i * 2.5, EZ.out);
        return (
          <mesh key={i} geometry={barGeo} position={[(i - 1) * 2.9, mx(-14, 0, k), 0]}>
            <meshStandardMaterial color={c} emissive={c} emissiveIntensity={i === 2 ? 0.35 : 0.6} metalness={0.3} roughness={0.35} />
          </mesh>
        );
      })}
    </group>
  );
};

// ---------------------------------------------------------------- lights + atmosphere
export const Atmosphere: React.FC = () => {
  const f = useCurrentFrame();
  const far = mx(mx(80, 46, rp(f, bf(13), bf(15))), 120, rp(f, bf(34.4), bf(36.5)));
  return (
    <>
      <color attach="background" args={['#04070A']} />
      <fog attach="fog" args={['#04070A', 10, far]} />
      <ambientLight intensity={0.35} />
      <hemisphereLight args={['#BFFFA0', '#04070A', 0.35]} />
      <directionalLight position={[12, 30, 18]} intensity={1.6} color="#ffffff" />
      <directionalLight position={[-20, 10, -30]} intensity={1.1} color="#3ACC00" />
      <pointLight position={[0, 18, 10]} intensity={f > bf(S.share.coin) ? 140 : 0} distance={40} color="#ffffff" />
    </>
  );
};
