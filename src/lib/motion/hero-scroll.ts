import { prefersReducedMotion } from './prefers-reduced-motion';
import { updateSymbolLights, type Corner } from './hero-symbol-light';

const CORNER_VECTORS: Record<Corner, { x: number; y: number; rotZ: number; rotX: number }> = {
  tl: { x: -1, y: -1, rotZ: -18, rotX: 14 },
  tr: { x: 1, y: -1, rotZ: 16, rotX: 12 },
  bl: { x: -1, y: 1, rotZ: 14, rotX: -12 },
  br: { x: 1, y: 1, rotZ: -16, rotX: -11 },
};

const FADE_SPAN = 0.5;

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
/**
 * Coreografía Hero estilo Stefano: símbolos con zoom + dispersión radial,
 * texto con fade escalonado.
 */
export function initHeroScroll(): void {
  const hero = document.querySelector<HTMLElement>('#hero');
  const container = document.querySelector<HTMLElement>('#app-scroll');
  if (!hero || !container) return;

  const symbols = Array.from(hero.querySelectorAll<HTMLElement>('[data-hero-symbol]'));
  const fadeTargets = Array.from(hero.querySelectorAll<HTMLElement>('[data-fade-order]'));
  const fadeCount = fadeTargets.length || 1;

  if (prefersReducedMotion()) {
    for (const el of symbols) {
      const corner = (el.dataset.corner ?? 'tl') as Corner;
      updateSymbolLights(el, { corner, progress: 0, tx: 0, ty: 0, rotX: 0, rotZ: 0 });
    }
    return;
  }

  const MAX_SCALE = 4.5;
  const SPREAD = 45;
  let ticking = false;

  const update = () => {
    ticking = false;
    const heroHeight = hero.offsetHeight || 1;
    const progress = clamp(container.scrollTop / heroHeight, 0, 1);
    const scale = 1 + progress * (MAX_SCALE - 1);
    const opacity = 1 - progress * 0.95;

    for (const el of symbols) {
      const corner = (el.dataset.corner ?? 'tl') as Corner;
      const vec = CORNER_VECTORS[corner] ?? CORNER_VECTORS.tl;
      const tx = vec.x * progress * SPREAD;
      const ty = vec.y * progress * SPREAD;
      const rotZ = vec.rotZ * progress;
      const rotX = vec.rotX * progress;

      el.style.transform = `translate(${tx}vw, ${ty}vh) scale(${scale}) rotateX(${rotX}deg) rotateZ(${rotZ}deg)`;
      el.style.opacity = String(opacity);

      updateSymbolLights(el, { corner, progress, tx, ty, rotX, rotZ });
    }

    for (const el of fadeTargets) {
      const order = Number(el.dataset.fadeOrder ?? 0);
      const start = (order / fadeCount) * (1 - FADE_SPAN);
      const t = (progress - start) / FADE_SPAN;
      el.style.opacity = String(clamp(1 - t, 0, 1));
      el.style.filter = 'none';
    }
  };

  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  };

  container.addEventListener('scroll', onScroll, { passive: true });
  update();
}
