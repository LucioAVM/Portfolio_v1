import { animate } from 'animejs';
import { createHandle, type MinimiAnimFactory } from './types';

export const blinkAnim: MinimiAnimFactory = (parts) => {
  const anims = [
    animate(parts.eyeL, {
      scaleY: [1, 0.12, 1],
      duration: 140,
      ease: 'inOutQuad',
      loop: true,
      loopDelay: 4200,
    }),
    animate(parts.eyeR, {
      scaleY: [1, 0.12, 1],
      duration: 140,
      ease: 'inOutQuad',
      loop: true,
      loopDelay: 4200,
      delay: 80,
    }),
  ];

  if (parts.eyeAccent) {
    anims.push(
      animate(parts.eyeAccent, {
        opacity: [1, 0, 1],
        duration: 120,
        ease: 'steps(2)',
        loop: true,
        loopDelay: 3000,
        delay: 200,
      }),
    );
  }

  return createHandle(anims);
};
