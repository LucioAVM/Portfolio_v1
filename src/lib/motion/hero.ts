import { animate, stagger } from 'animejs';
import { prefersReducedMotion } from './prefers-reduced-motion';

function splitIntoChars(el: HTMLElement): HTMLElement[] {
  if (el.dataset.charsSplit === '1') {
    el.style.opacity = '1';
    return Array.from(el.querySelectorAll<HTMLElement>('[data-hero-char]'));
  }

  const text = el.textContent ?? '';
  el.textContent = '';
  el.dataset.charsSplit = '1';
  // El contenedor queda visible; la entrada la hacen los caracteres
  el.style.opacity = '1';
  el.style.visibility = 'visible';
  el.style.transform = 'none';
  el.style.filter = 'none';

  const chars: HTMLElement[] = [];
  for (const ch of text) {
    const span = document.createElement('span');
    span.dataset.heroChar = '';
    span.className = 'hero-char';
    span.textContent = ch === ' ' ? '\u00A0' : ch;
    el.appendChild(span);
    chars.push(span);
  }
  return chars;
}

function runHeroEntrance(root: HTMLElement): void {
  if (root.dataset.heroEntered === '1') return;
  root.dataset.heroEntered = '1';

  const supertitle = root.querySelector<HTMLElement>('[data-hero-supertitle]');
  const wordEls = Array.from(root.querySelectorAll<HTMLElement>('[data-hero-word]'));
  const subtitle = root.querySelector<HTMLElement>('[data-hero-subtitle]');
  const streak = root.querySelector<HTMLElement>('[data-hero-streak]');
  const symbols = root.querySelectorAll<HTMLElement>('[data-hero-symbol]');

  if (supertitle) {
    const chars = splitIntoChars(supertitle);
    animate(chars, {
      opacity: [0, 1],
      translateY: [10, 0],
      duration: 780,
      delay: stagger(22, { start: 40 }),
      ease: 'outCubic',
    });
  }

  if (wordEls.length) {
    const allChars: HTMLElement[] = [];
    for (const word of wordEls) {
      allChars.push(...splitIntoChars(word));
    }

    // Asegurar que el h1 (frase) también esté visible como bloque
    const title = root.querySelector<HTMLElement>('.hero-h1');
    if (title) {
      title.style.opacity = '1';
      title.style.visibility = 'visible';
    }

    animate(allChars, {
      opacity: [0, 1],
      translateY: [18, 0],
      filter: ['blur(4px)', 'blur(0px)'],
      duration: 920,
      delay: stagger(28, { start: 180 }),
      ease: 'outCubic',
    });
  }

  if (subtitle) {
    const chars = splitIntoChars(subtitle);
    animate(chars, {
      opacity: [0, 1],
      translateY: [8, 0],
      duration: 700,
      delay: stagger(12, { start: 520 }),
      ease: 'outCubic',
    });
  }

  if (streak) {
    streak.style.opacity = '1';
    streak.classList.add('is-falling');
  }

  if (symbols.length) {
    animate(symbols, {
      opacity: [0, 1],
      duration: 1400,
      delay: stagger(180, { start: 280 }),
      ease: 'outCubic',
    });
  }

  const symbolFaces = root.querySelectorAll<HTMLElement>('.hero-symbol-3d');
  if (symbolFaces.length) {
    animate(symbolFaces, {
      scale: [0.78, 1],
      duration: 1400,
      delay: stagger(180, { start: 280 }),
      ease: 'outCubic',
    });
  }
}

/**
 * Espera `lm:reveal` (preloader) para una sola entrada, sin re-flash.
 */
export function initHero(root: HTMLElement): void {
  if (prefersReducedMotion()) {
    root.dataset.heroEntered = '1';
    root.querySelectorAll<HTMLElement>('.motion-enter, [data-hero-streak]').forEach((el) => {
      el.style.opacity = '1';
      el.style.transform = 'none';
      el.style.filter = 'none';
    });
    return;
  }

  const start = () => runHeroEntrance(root);

  if (document.documentElement.dataset.lmReveal === '1' || document.documentElement.dataset.lmBooted === '1') {
    start();
    return;
  }

  document.addEventListener('lm:reveal', start, { once: true });

  window.setTimeout(() => {
    if (root.dataset.heroEntered === '1') return;
    document.documentElement.dataset.lmReveal = '1';
    document.dispatchEvent(new CustomEvent('lm:reveal'));
  }, 4500);
}
