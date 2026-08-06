import { prefersReducedMotion } from './prefers-reduced-motion';
import { lerp, nearlyEqual } from './lerp';

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

const MIN_THUMB_RATIO = 0.08;
const MAX_THUMB_RATIO = 0.28;
const THUMB_LERP = 0.14;

/**
 * Indicador de scroll vertical (derecha): thumb con inercia suave.
 */
export function initScrollProgress(): void {
  const thumb = document.querySelector<HTMLElement>('[data-scroll-progress]');
  const track = thumb?.parentElement;
  const scroller = document.getElementById('app-scroll');
  if (!thumb || !track || !scroller) return;

  let targetY = 0;
  let smoothY = 0;
  let thumbH = 24;
  let rafId = 0;

  const measure = () => {
    const view = scroller.clientHeight;
    const total = scroller.scrollHeight;
    const max = Math.max(0, total - view);
    const trackH = track.clientHeight;

    if (max <= 0 || trackH <= 0) {
      thumb.style.height = '100%';
      targetY = 0;
      return;
    }

    const ratio = clamp(view / total, MIN_THUMB_RATIO, MAX_THUMB_RATIO);
    thumbH = Math.max(18, trackH * ratio);
    const travel = Math.max(0, trackH - thumbH);
    const progress = clamp(scroller.scrollTop / max, 0, 1);
    targetY = travel * progress;
    thumb.style.height = `${thumbH}px`;
  };

  const tick = () => {
    measure();
    smoothY = lerp(smoothY, targetY, THUMB_LERP);
    thumb.style.transform = `translate3d(0, ${smoothY.toFixed(2)}px, 0)`;

    if (!nearlyEqual(smoothY, targetY, 0.15)) {
      rafId = requestAnimationFrame(tick);
    } else {
      smoothY = targetY;
      thumb.style.transform = `translate3d(0, ${smoothY}px, 0)`;
      rafId = 0;
    }
  };

  const kick = () => {
    if (!rafId) rafId = requestAnimationFrame(tick);
  };

  scroller.addEventListener('scroll', kick, { passive: true });
  window.addEventListener('resize', kick, { passive: true });
  kick();

  if (prefersReducedMotion()) {
    thumb.style.transition = 'none';
  }
}
