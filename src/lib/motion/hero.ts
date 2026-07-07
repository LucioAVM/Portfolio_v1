import { animate, stagger } from 'animejs';
import { prefersReducedMotion } from './prefers-reduced-motion';

export function initHero(root: HTMLElement): void {
  if (prefersReducedMotion()) return;

  const supertitle = root.querySelector('[data-hero-supertitle]');
  const words = root.querySelectorAll('[data-hero-word]');
  const subtitle = root.querySelector('[data-hero-subtitle]');
  const ctas = root.querySelectorAll('[data-hero-cta]');
  const symbols = root.querySelectorAll<HTMLElement>('[data-hero-symbol]');
  const floats = root.querySelectorAll<HTMLElement>('.hero-symbol-float');

  if (supertitle) {
    animate(supertitle, {
      opacity: [0, 1],
      translateY: [12, 0],
      duration: 600,
      ease: 'outExpo',
    });
  }

  if (words.length) {
    animate(words, {
      opacity: [0, 1],
      translateY: [28, 0],
      duration: 900,
      delay: stagger(70, { start: 120 }),
      ease: 'outExpo',
    });
  }

  if (subtitle) {
    animate(subtitle, {
      opacity: [0, 1],
      translateY: [16, 0],
      duration: 700,
      delay: 480,
      ease: 'outExpo',
    });
  }

  if (ctas.length) {
    animate(ctas, {
      opacity: [0, 1],
      translateY: [12, 0],
      duration: 600,
      delay: stagger(80, { start: 620 }),
      ease: 'outExpo',
    });
  }

  if (symbols.length) {
    animate(symbols, {
      opacity: [0, 1],
      duration: 1200,
      delay: stagger(150, { start: 300 }),
      ease: 'outExpo',
    });
  }

  const symbolFaces = root.querySelectorAll<HTMLElement>('.hero-symbol-3d');
  if (symbolFaces.length) {
    animate(symbolFaces, {
      scale: [0.6, 1],
      duration: 1200,
      delay: stagger(150, { start: 300 }),
      ease: 'outExpo',
    });
  }

  if (floats.length) {
    floats.forEach((el, index) => {
      animate(el, {
        translateY: [-10, 10],
        rotate: [-2, 2],
        duration: 3200 + index * 500,
        delay: index * 260,
        ease: 'inOutSine',
        loop: true,
        alternate: true,
      });
    });
  }
}
