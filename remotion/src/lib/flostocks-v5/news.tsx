// The "THEY ARE NOW IN STOCKS TOO!" block: the last frame of the chat flood and the
// first frame of the showreel share this exact layout, so the hand-off is seamless.
import React from 'react';
import { disp } from './mkit';

export const NEWS_SIZE = 150;
export const NEWS_X = 70;
export const NEWS_Y = 600;
export const NEWS_LINES = ['THEY ARE', 'NOW IN', 'STOCKS', 'TOO!'];

export const NewsBlock: React.FC<{ color: string; render?: (line: string, i: number) => React.ReactNode }> = ({ color, render }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
    {NEWS_LINES.map((l, i) => (
      <div key={l}>{render ? render(l, i) : <p style={disp(NEWS_SIZE, color, 100, 900)}>{l}</p>}</div>
    ))}
  </div>
);
