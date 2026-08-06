import { animate } from 'animejs';
import { prefersReducedMotion } from './prefers-reduced-motion';

const SESSION_KEY = 'lm-booted';

function reveal(): void {
  document.documentElement.dataset.lmReveal = '1';
  document.dispatchEvent(new CustomEvent('lm:reveal'));
}

function finish(pre: HTMLElement | null): void {
  pre?.classList.add('is-done');
  document.documentElement.dataset.lmBooted = '1';
  document.dispatchEvent(new CustomEvent('lm:booted'));
  try {
    sessionStorage.setItem(SESSION_KEY, '1');
  } catch {
    /* ignore */
  }
}

function alreadyBootedThisSession(): boolean {
  try {
    return sessionStorage.getItem(SESSION_KEY) === '1';
  } catch {
    return false;
  }
}

/** Navegación interna: transición corta “abrir ventana”. */
function runNavWindowOpen(pre: HTMLElement, bar: HTMLElement): void {
  pre.classList.add('preloader--nav');
  reveal();

  if (prefersReducedMotion()) {
    finish(pre);
    return;
  }

  const shell = document.querySelector<HTMLElement>('.app-shell-inner');
  const shellRect = shell?.getBoundingClientRect();
  const targetW = shellRect?.width ?? window.innerWidth - 24;
  const targetH = shellRect?.height ?? window.innerHeight - 24;
  const startW = Math.min(280, targetW * 0.35);
  const startH = 44;

  bar.style.width = `${startW}px`;
  bar.style.height = `${startH}px`;
  bar.style.opacity = '1';

  animate(bar, {
    width: [startW, targetW],
    height: [startH, targetH],
    duration: 620,
    ease: 'inOutCubic',
  });

  animate(pre, {
    opacity: [1, 0],
    duration: 420,
    delay: 480,
    ease: 'outQuad',
    onComplete: () => finish(pre),
  });
}

/**
 * Primera visita: logo de carga (cubito + brand + spin), sin expandir a ventana.
 * Luego fade out y reveal del contenido.
 */
function runLogoBoot(pre: HTMLElement, bar: HTMLElement): void {
  pre.classList.add('preloader--boot');
  const brand = pre.querySelector<HTMLElement>('.preloader-brand');
  const spin = pre.querySelector<HTMLElement>('.preloader-spin');
  const mono = pre.querySelector<HTMLElement>('.preloader-mono');
  const glow1 = pre.querySelector<HTMLElement>('.preloader-glow-1');
  const glow2 = pre.querySelector<HTMLElement>('.preloader-glow-2');

  if (prefersReducedMotion()) {
    reveal();
    finish(pre);
    return;
  }

  try {
    animate(bar, {
      opacity: [0, 1],
      translateY: [14, 0],
      scale: [0.96, 1],
      duration: 700,
      ease: 'outCubic',
    });

    if (mono) animate(mono, { opacity: [0, 1], duration: 500, delay: 80, ease: 'outCubic' });
    if (brand) animate(brand, { opacity: [0, 1], duration: 560, delay: 140, ease: 'outCubic' });
    if (spin) animate(spin, { opacity: [0, 1], duration: 400, delay: 220, ease: 'outCubic' });
    if (glow1) animate(glow1, { opacity: [0, 0.9], duration: 900, delay: 200, ease: 'outQuad' });
    if (glow2) animate(glow2, { opacity: [0, 0.75], duration: 900, delay: 320, ease: 'outQuad' });

    // Hold logo a bit, then soft fade
    window.setTimeout(reveal, 1450);

    animate(pre, {
      opacity: [1, 0],
      duration: 650,
      delay: 1550,
      ease: 'outQuad',
      onComplete: () => finish(pre),
    });
  } catch {
    reveal();
    finish(pre);
  }
}

/**
 * - Primera visita de la sesión → logo de carga
 * - Navegación interna → “abrir ventana”
 */
export function initPreloader(): void {
  const pre = document.getElementById('preloader');
  const bar = document.getElementById('preloader-bar');

  if (!pre || !bar) {
    reveal();
    finish(null);
    return;
  }

  if (alreadyBootedThisSession()) {
    runNavWindowOpen(pre, bar);
  } else {
    runLogoBoot(pre, bar);
  }
}
