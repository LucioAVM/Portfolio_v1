import { animate } from 'animejs';
import { createHandle, type MinimiAnimFactory } from './types';

export const idleAnim: MinimiAnimFactory = (parts) => {
  const floatAnim = animate(parts.root, {
    translateY: [-3, 3],
    duration: 2200,
    ease: 'inOutSine',
    alternate: true,
    loop: true,
  });

  const breatheAnim = animate(parts.body, {
    scaleY: [1, 1.015],
    duration: 2800,
    ease: 'inOutSine',
    alternate: true,
    loop: true,
  });

  const headTiltAnim = animate(parts.head, {
    rotate: [-1, 1],
    duration: 3600,
    ease: 'inOutSine',
    alternate: true,
    loop: true,
  });

  return createHandle([floatAnim, breatheAnim, headTiltAnim]);
};
