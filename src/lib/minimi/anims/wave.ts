import { animate } from 'animejs';
import { createHandle, type MinimiAnimFactory } from './types';

export const waveAnim: MinimiAnimFactory = (parts) => {
  const wave = animate(parts.armR, {
    rotate: [0, -38, 0, -38, 0],
    duration: 900,
    ease: 'inOutQuad',
  });

  return createHandle([wave]);
};
