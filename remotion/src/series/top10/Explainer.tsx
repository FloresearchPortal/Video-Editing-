// The basis of the ranking, as one simple formula: A (op) B = RESULT, with a worked example.
// Cards slide in on the beat, values land on split-flap tiles, then the one-line takeaway.
// 192 frames (16 beats): A 16, op 38, B 44, = 76, result 82, example 98, takeaway 112, full hold from ~125.
import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { Backdrop } from '../flostocks/Backdrop';
import { E, FONT, MBlur, SHADOW, T, fitSize, mix, pop, ramp, speedBlur, textW, whip } from './kit';
import { FlapTile } from './SplitFlap';
import { KLine, segText } from './TopicTitle';
import type { Explainer as Ex, Term } from './types';

const FlapValue: React.FC<{ term: Term; at: number; dark?: boolean; h: number }> = ({ term, at, dark, h }) => {
  const w = h * 0.68;
  const unit: React.CSSProperties = { fontFamily: FONT, fontWeight: 800, fontSize: h * 0.5, color: dark ? '#FFFFFF' : T.ink, margin: '0 10px' };
  let k = 0;
  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {term.pre && <span style={unit}>{term.pre}</span>}
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 5 }}>
        {[...term.value].map((ch, i) => (/[0-9]/.test(ch)
          ? <FlapTile key={i} tile={{ ch, bg: T.ink }} start={at + (k++) * 2} flips={3} seed={i * 7 + at} w={w} h={h} />
          : <span key={i} style={{ fontFamily: FONT, fontWeight: 900, fontSize: h * 0.62, lineHeight: `${h}px`, color: dark ? '#FFFFFF' : T.ink, width: h * 0.24, textAlign: 'center' }}>{ch}</span>))}
      </div>
      {term.post && <span style={unit}>{term.post}</span>}
    </div>
  );
};

const Chips: React.FC<{ n: number; at: number; dur: number }> = ({ n, at, dur }) => {
  const f = useCurrentFrame();
  return (
    <div style={{ display: 'flex', gap: 9 }}>
      {Array.from({ length: n }, (_, i) => {
        const t = pop(f, at + (i / n) * dur, 6, 2);
        return <div key={i} style={{ width: 24, height: 34, borderRadius: 5, background: n === 1 || i === 0 ? T.lime : T.mint2, transform: `skewX(-10deg) scale(${Math.max(0, t)})` }} />;
      })}
    </div>
  );
};

const Card: React.FC<{ term: Term; at: number; top: number; h: number; result?: boolean }> = ({ term, at, top, h, result }) => {
  const f = useCurrentFrame();
  const xf = (fr: number) => (1 - whip(fr, at, 10)) * 1200;
  const s = result ? Math.max(0, pop(f, at, 11, 1.6)) : 1;
  // the note gets whatever width the value leaves free
  const vh = result ? 96 : 82, digits = [...term.value].filter((c) => /[0-9]/.test(c)).length;
  const valueW = digits * (vh * 0.68 + 5) + (term.value.length - digits) * vh * 0.24 + (term.pre ? textW(term.pre, vh * 0.5, '800', 0) + 20 : 0) + (term.post ? textW(term.post, vh * 0.5, '800', 0) + 20 : 0);
  const noteW = 952 - 52 - 44 - valueW - 36;
  return (
    <MBlur id={`card${at}`} x={result ? 0 : speedBlur(xf, f, 0.35)} style={{ position: 'absolute', left: 64, top, width: 952, height: h, transform: `translateX(${result ? 0 : xf(f)}px) scale(${s})`, opacity: f >= at ? 1 : 0 }}>
      <div style={{ position: 'absolute', inset: 0, borderRadius: 30, background: result ? `linear-gradient(120deg, ${T.deep}, ${T.green} 55%, ${T.lime})` : '#FFFFFF', boxShadow: result ? '0 24px 60px rgba(44,156,0,0.30)' : SHADOW.md, border: result ? undefined : `2px solid ${T.line}` }} />
      {!result && <div style={{ position: 'absolute', left: 0, top: 36, width: 10, height: h - 72, borderRadius: 5, background: T.lime }} />}
      <div style={{ position: 'absolute', left: 52, top: 40, fontFamily: FONT, fontWeight: 800, fontSize: 38, letterSpacing: '0.06em', color: result ? '#FFFFFF' : T.ink }}>{term.label}</div>
      <div style={{ position: 'absolute', left: 52, top: 96, width: noteW, fontFamily: FONT, fontWeight: 500, fontSize: 26, lineHeight: '34px', color: result ? 'rgba(255,255,255,0.88)' : T.grey }}>{term.note}</div>
      {term.visual && <div style={{ position: 'absolute', left: 56, bottom: 30 }}><Chips n={term.visual === 'one' ? 1 : 26} at={at + 6} dur={30} /></div>}
      <div style={{ position: 'absolute', right: 44, top: 0, height: term.visual ? h - 64 : h, display: 'flex', alignItems: 'center' }}>
        <FlapValue term={term} at={at + 4} dark={result} h={vh} />
      </div>
    </MBlur>
  );
};

const Op: React.FC<{ ch: string; at: number; top: number }> = ({ ch, at, top }) => {
  const f = useCurrentFrame();
  const s = Math.max(0, pop(f, at, 9, 2.4));
  return (
    <div style={{ position: 'absolute', left: 540 - 38, top, width: 76, height: 76, borderRadius: 38, background: T.ink, color: T.lime, display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: FONT, fontWeight: 800, fontSize: 52, lineHeight: 1, transform: `scale(${s}) rotate(${mix(-90, 0, ramp(f, at, at + 9, E.out))}deg)` }}>{ch}</div>
  );
};

export const Explainer: React.FC<{ ex: Ex }> = ({ ex }) => {
  const f = useCurrentFrame();
  const qs = ex.question.map((q, i) => fitSize(segText(q), 940, i === ex.question.length - 1 ? 116 : 84));
  const ts = ex.takeaway.map((q) => fitSize(segText(q), 940, 62));
  const kick = ramp(f, 0, 8, E.out);
  return (
    <AbsoluteFill>
      <Backdrop />
      <div style={{ position: 'absolute', left: 0, right: 0, top: 262, display: 'flex', justifyContent: 'center', opacity: kick, transform: `translateY(${(1 - kick) * -20}px)` }}>
        <div style={{ padding: '10px 26px', borderRadius: 26, border: `3px solid ${T.lime}`, fontFamily: FONT, fontWeight: 700, fontSize: 24, letterSpacing: '0.16em', color: T.green }}>{ex.kicker}</div>
      </div>
      {ex.question.map((q, i) => {
        const at = 2 + i * 4, xf = (fr: number) => (i % 2 ? 1 : -1) * (1 - whip(fr, at, 10)) * 1200;
        const top = i === 0 ? 338 : 338 + qs[0] * 1.08;
        return (
          <MBlur key={i} id={`q${i}`} x={speedBlur(xf, f, 0.4)} style={{ position: 'absolute', left: 0, right: 0, top, transform: `translateX(${xf(f)}px)`, opacity: f >= at ? 1 : 0 }}>
            <KLine segs={q} size={qs[i]} />
          </MBlur>
        );
      })}
      <Card term={ex.a} at={16} top={590} h={196} />
      <Op ch={ex.op} at={38} top={800} />
      <Card term={ex.b} at={44} top={890} h={216} />
      <Op ch="=" at={76} top={1120} />
      <Card term={ex.result} at={82} top={1210} h={196} result />
      <div style={{ position: 'absolute', left: 0, right: 0, top: 1424, textAlign: 'center', fontFamily: FONT, fontWeight: 500, fontSize: 25, color: T.grey, opacity: ramp(f, 98, 106) }}>{ex.example}</div>
      {ex.takeaway.map((q, i) => {
        const at = 112 + i * 5, t = whip(f, at, 9);
        return (
          <div key={i} style={{ position: 'absolute', left: 0, right: 0, top: 1478 + i * ts[0] * 1.1, transform: `translateY(${(1 - t) * 40}px)`, opacity: t }}>
            <KLine segs={q} size={ts[i]} />
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
