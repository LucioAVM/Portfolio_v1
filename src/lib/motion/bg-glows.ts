import { prefersReducedMotion } from './prefers-reduced-motion';
import { lerp, nearlyEqual } from './lerp';

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

const GLOW_LERP = 0.07;

/**
 * Luces:
 * - Split: a → borde derecho / arriba ; b → borde izquierdo / abajo
 * - Scroll: SOLO vertical (a baja, b sube). Con inercia.
 */
export function initBgGlows(): void {
  const bg = document.querySelector<HTMLElement>('.app-bg');
  const boxA = document.querySelector<HTMLElement>('.app-bg-glow-box-a');
  const boxB = document.querySelector<HTMLElement>('.app-bg-glow-box-b');
  const scroller = document.getElementById('app-scroll');
  if (!bg || !boxA || !boxB || !scroller) return;

  bg.dataset.glowPhase = 'center';
  bg.style.setProperty('--bg-glow-split', '0');
  bg.style.setProperty('--bg-glow-progress', '0');

  const animateSplit = () => {
    bg.dataset.glowPhase = 'split';
    if (prefersReducedMotion()) {
      bg.style.setProperty('--bg-glow-split', '1');
      return;
    }

    const start = performance.now();
    const dur = 1800;
    const tick = (now: number) => {
      const t = clamp((now - start) / dur, 0, 1);
      const e = 1 - Math.pow(1 - t, 3.2);
      bg.style.setProperty('--bg-glow-split', e.toFixed(4));
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  if (document.documentElement.dataset.lmBooted === '1' || document.documentElement.dataset.lmReveal === '1') {
    bg.dataset.glowPhase = 'split';
    bg.style.setProperty('--bg-glow-split', '1');
  } else {
    document.addEventListener('lm:reveal', animateSplit, { once: true });
  }

  if (prefersReducedMotion()) return;

  let targetProgress = 0;
  let smoothProgress = 0;
  let rafId = 0;

  const tick = () => {
    smoothProgress = lerp(smoothProgress, targetProgress, GLOW_LERP);
    bg.style.setProperty('--bg-glow-progress', smoothProgress.toFixed(4));

    if (!nearlyEqual(smoothProgress, targetProgress, 0.0008)) {
      rafId = requestAnimationFrame(tick);
    } else {
      smoothProgress = targetProgress;
      bg.style.setProperty('--bg-glow-progress', String(smoothProgress));
      rafId = 0;
    }
  };

  const onScroll = () => {
    const docHeight = scroller.scrollHeight - scroller.clientHeight;
    targetProgress = docHeight > 0 ? clamp(scroller.scrollTop / docHeight, 0, 1) : 0;
    if (!rafId) rafId = requestAnimationFrame(tick);
  };

  scroller.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  onScroll();
}
