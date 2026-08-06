import { prefersReducedMotion } from './prefers-reduced-motion';
import { initHeroSymbolParallax, readParallaxFromLayer } from './hero-symbol-parallax';
import { updateSymbolLights, type Corner } from './hero-symbol-light';
import { lerp, nearlyEqual } from './lerp';

const CORNER_VECTORS: Record<Corner, { x: number; y: number; rotZ: number; rotX: number }> = {
  tl: { x: -1, y: -1, rotZ: -18, rotX: 14 },
  tr: { x: 1, y: -1, rotZ: 16, rotX: 12 },
  bl: { x: -1, y: 1, rotZ: 14, rotX: -12 },
  br: { x: 1, y: 1, rotZ: -16, rotX: -11 },
};

const FADE_SPAN = 0.5;
const MAX_SCALE = 2.45;
const SPREAD = 36;
/** Inercia del progreso de scroll del hero (más bajo = más suave). */
const SCROLL_LERP = 0.09;

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function blurEase(progress: number): number {
  if (progress <= 0) return 0;
  return Math.pow(progress, 2.1) * 3.2;
}

/**
 * Coreografía Hero: dispersión suave + blur progresivo + luces.
 */
export function initHeroScroll(): void {
  const hero = document.querySelector<HTMLElement>('#hero');
  const container = document.querySelector<HTMLElement>('#app-scroll');
  if (!hero || !container) return;

  const symbolLayer = hero.querySelector<HTMLElement>('.hero-symbol-layer');
  const innerFrame = hero.querySelector<HTMLElement>('.hero-inner-frame');
  const symbols = Array.from(hero.querySelectorAll<HTMLElement>('[data-hero-symbol]'));
  const fadeTargets = Array.from(hero.querySelectorAll<HTMLElement>('[data-fade-order]'));
  const fadeCount = fadeTargets.length || 1;

  initHeroSymbolParallax();

  if (prefersReducedMotion()) {
    for (const el of symbols) {
      const corner = (el.dataset.corner ?? 'tl') as Corner;
      updateSymbolLights(el, { corner, progress: 0, tx: 0, ty: 0, rotX: 0, rotZ: 0 });
    }
    return;
  }

  let targetProgress = 0;
  let smoothProgress = 0;
  let rafId = 0;

  const apply = (progress: number) => {
    const scale = 1 + progress * (MAX_SCALE - 1);
    const mouse = readParallaxFromLayer(symbolLayer);
    const blur = blurEase(progress);

    if (innerFrame) {
      innerFrame.style.opacity = String(clamp(1 - progress * 0.8, 0, 1));
    }

    for (const el of symbols) {
      const corner = (el.dataset.corner ?? 'tl') as Corner;
      const vec = CORNER_VECTORS[corner] ?? CORNER_VECTORS.tl;
      const tx = vec.x * progress * SPREAD;
      const ty = vec.y * progress * SPREAD;
      const rotZ = vec.rotZ * progress;
      const rotX = vec.rotX * progress;
      const symOpacity = clamp(1 - progress * 1.25, 0, 1);

      el.style.transform = `translate(${tx}vw, ${ty}vh) scale(${scale}) rotateX(${rotX}deg) rotateZ(${rotZ}deg)`;
      el.style.opacity = String(symOpacity);
      el.style.filter = blur > 0.05 ? `blur(${blur.toFixed(2)}px)` : 'none';
      el.style.visibility = symOpacity < 0.02 ? 'hidden' : 'visible';

      updateSymbolLights(el, {
        corner,
        progress,
        tx,
        ty,
        rotX,
        rotZ,
        mouseX: mouse.x,
        mouseY: mouse.y,
      });
    }

    for (const el of fadeTargets) {
      const order = Number(el.dataset.fadeOrder ?? 0);
      const start = (order / fadeCount) * (1 - FADE_SPAN);
      const t = (progress - start) / FADE_SPAN;
      const opacity = clamp(1 - t, 0, 1);
      el.style.opacity = String(opacity);
      el.style.filter = opacity < 0.97 ? `blur(${((1 - opacity) * 1.6).toFixed(2)}px)` : 'none';
    }
  };

  const tick = () => {
    smoothProgress = lerp(smoothProgress, targetProgress, SCROLL_LERP);
    apply(smoothProgress);

    if (!nearlyEqual(smoothProgress, targetProgress)) {
      rafId = requestAnimationFrame(tick);
    } else {
      smoothProgress = targetProgress;
      apply(smoothProgress);
      rafId = 0;
    }
  };

  const onScroll = () => {
    const heroHeight = hero.offsetHeight || 1;
    targetProgress = clamp(container.scrollTop / heroHeight, 0, 1);
    if (!rafId) rafId = requestAnimationFrame(tick);
  };

  container.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}
