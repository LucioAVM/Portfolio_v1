import { animate } from 'animejs';
import { createHandle, type MinimiAnimFactory } from './types';

export const blinkAnim: MinimiAnimFactory = (parts) => {
  const blinkLeft = animate(parts.eyeL, {
    scaleY: [1, 0.12, 1],
    duration: 140,
    ease: 'inOutQuad',
    loop: true,
    loopDelay: 4200,
  });

  const blinkRight = animate(parts.eyeR, {
    opacity: [1, 0.15, 1],
    scaleX: [1, 0.35, 1],
    duration: 100,
    ease: 'steps(2)',
    loop: true,
    loopDelay: 3800,
    delay: 120,
  });

  return createHandle([blinkLeft, blinkRight]);
};
