import { animate } from 'animejs';
import { prefersReducedMotion } from './prefers-reduced-motion';

/**
 * Boot de la ventana (metáfora escritorio):
 * 1) pill centrada aparece
 * 2) se estira a lo ancho (barra completa en el medio)
 * 3) crece a lo largo hasta el tamaño del shell
 * 4) las dos luces se separan
 * 5) fade para revelar la app
 * Solo se reproduce una vez por sesión.
 */
export function initPreloader(): void {
  const pre = document.getElementById('preloader');
  if (!pre) return;

  const finish = (): void => {
    pre.classList.add('is-done');
  };

  const bar = document.getElementById('preloader-bar');
  const brand = pre.querySelector<HTMLElement>('.preloader-brand');
  const spin = pre.querySelector<HTMLElement>('.preloader-spin');
  const glow1 = pre.querySelector<HTMLElement>('.preloader-glow-1');
  const glow2 = pre.querySelector<HTMLElement>('.preloader-glow-2');

  let alreadyBooted = false;
  try {
    alreadyBooted = sessionStorage.getItem('lm-booted') === '1';
    sessionStorage.setItem('lm-booted', '1');
  } catch {
    alreadyBooted = false;
  }

  if (alreadyBooted || prefersReducedMotion() || !bar) {
    finish();
    return;
  }

  try {
    const shell = document.querySelector<HTMLElement>('.app-shell-inner');
    const shellRect = shell?.getBoundingClientRect();
    const targetW = shellRect?.width ?? window.innerWidth - 24;
    const targetH = shellRect?.height ?? window.innerHeight - 24;

    const startW = bar.getBoundingClientRect().width;
    const startH = bar.getBoundingClientRect().height;

    animate(bar, { opacity: [0, 1], translateY: [10, 0], duration: 450, ease: 'outExpo' });
    if (spin) animate(spin, { opacity: [0, 1], duration: 300, delay: 150 });
    if (glow1) animate(glow1, { opacity: [0, 0.95], duration: 600, delay: 600 });
    if (glow2) animate(glow2, { opacity: [0, 0.85], duration: 600, delay: 600 });

    // 2) a lo ancho
    animate(bar, { width: [startW, targetW], duration: 750, delay: 800, ease: 'inOutExpo' });
    if (spin) animate(spin, { opacity: [1, 0], duration: 250, delay: 850 });
    if (brand) animate(brand, { opacity: [1, 0], duration: 320, delay: 1320 });

    // 4) las luces se separan
    if (glow1)
      animate(glow1, { translateX: [0, 260], translateY: [0, -190], duration: 950, delay: 1350, ease: 'inOutQuad' });
    if (glow2)
      animate(glow2, { translateX: [0, -260], translateY: [0, 190], duration: 950, delay: 1350, ease: 'inOutQuad' });

    // 3) a lo largo
    animate(bar, { height: [startH, targetH], duration: 800, delay: 1550, ease: 'inOutExpo' });

    // 5) revelar
    animate(pre, { opacity: [1, 0], duration: 500, delay: 2350, ease: 'outQuad', onComplete: finish });
  } catch {
    finish();
  }
}
