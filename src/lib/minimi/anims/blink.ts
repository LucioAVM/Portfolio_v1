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
    scaleY: [1, 0.12, 1],
    duration: 140,
    ease: 'inOutQuad',
    loop: true,
    loopDelay: 4200,
    delay: 80,
  });

  return createHandle([blinkLeft, blinkRight]);
};
