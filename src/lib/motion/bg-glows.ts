import { prefersReducedMotion } from './prefers-reduced-motion';

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Desplaza las 2 luces del fondo verticalmente según el scroll global.
 * glow-a (arriba-derecha) baja; glow-b (abajo-izquierda) sube.
 */
export function initBgGlows(): void {
  if (prefersReducedMotion()) return;

  const scroller = document.getElementById('app-scroll');
  const bg = document.querySelector<HTMLElement>('.app-bg');
  if (!scroller || !bg) return;

  let ticking = false;

  const update = () => {
    ticking = false;
    const docHeight = scroller.scrollHeight - scroller.clientHeight;
    const progress = docHeight > 0 ? clamp(scroller.scrollTop / docHeight, 0, 1) : 0;
    bg.style.setProperty('--bg-glow-progress', String(progress));
  };

  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  };

  scroller.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  update();
}
