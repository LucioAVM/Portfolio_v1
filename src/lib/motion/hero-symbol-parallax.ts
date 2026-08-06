import { prefersReducedMotion } from './prefers-reduced-motion';

export type ParallaxPoint = { x: number; y: number };

/** Más inercia (tipo Stefano ~5s) y desplazamiento visible. */
const SMOOTHING = 0.032;
const PARALLAX_SCALE = 24;
const REST_EPSILON = 0.001;

const WRAP_FACTORS = [
  { x: -1.15, y: -0.35 },
  { x: 1.15, y: -0.4 },
  { x: -0.9, y: 1.1 },
  { x: 0.95, y: 1.05 },
] as const;

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Parallax suave: las 4 figuras acompañan el mouse en todo el viewport.
 */
export function initHeroSymbolParallax(): () => void {
  if (prefersReducedMotion()) return () => {};

  const hero = document.getElementById('hero');
  const layer = hero?.querySelector<HTMLElement>('.hero-symbol-layer');
  if (!hero || !layer) return () => {};

  const wraps = Array.from(layer.querySelectorAll<HTMLElement>('.hero-symbol-wrap'));
  const target: ParallaxPoint = { x: 0, y: 0 };
  const smooth: ParallaxPoint = { x: 0, y: 0 };
  let rafId = 0;

  const kick = () => {
    if (!rafId) rafId = requestAnimationFrame(tick);
  };

  const onMove = (event: MouseEvent) => {
    const rect = hero.getBoundingClientRect();
    // Si el hero ya scrolleó fuera, usar viewport
    const w = rect.width > 40 ? rect.width : window.innerWidth;
    const h = rect.height > 40 ? rect.height : window.innerHeight;
    const cx = rect.width > 40 ? rect.left + rect.width / 2 : window.innerWidth / 2;
    const cy = rect.height > 40 ? rect.top + rect.height / 2 : window.innerHeight / 2;

    target.x = clamp((event.clientX - cx) / (w / 2), -1, 1);
    target.y = clamp((event.clientY - cy) / (h / 2), -1, 1);
    kick();
  };

  const onLeave = () => {
    target.x = 0;
    target.y = 0;
    kick();
  };

  function tick(): void {
    smooth.x += (target.x - smooth.x) * SMOOTHING;
    smooth.y += (target.y - smooth.y) * SMOOTHING;

    const rotY = smooth.x * 7.5;
    const rotX = smooth.y * -7.5;
    layer.style.setProperty('--sym-parallax-rx', `${rotX.toFixed(3)}deg`);
    layer.style.setProperty('--sym-parallax-ry', `${rotY.toFixed(3)}deg`);

    const px = smooth.x * 0.5 * PARALLAX_SCALE;
    const py = smooth.y * 0.5 * PARALLAX_SCALE;

    wraps.forEach((wrap, index) => {
      const factor = WRAP_FACTORS[index] ?? WRAP_FACTORS[0];
      wrap.style.setProperty('--sym-wrap-x', String(factor.x * px));
      wrap.style.setProperty('--sym-wrap-y', String(factor.y * py));
    });

    if (
      Math.abs(target.x - smooth.x) > REST_EPSILON ||
      Math.abs(target.y - smooth.y) > REST_EPSILON
    ) {
      rafId = requestAnimationFrame(tick);
    } else {
      smooth.x = target.x;
      smooth.y = target.y;
      rafId = 0;
    }
  }

  window.addEventListener('mousemove', onMove, { passive: true });
  document.documentElement.addEventListener('mouseleave', onLeave, { passive: true });

  return () => {
    window.removeEventListener('mousemove', onMove);
    document.documentElement.removeEventListener('mouseleave', onLeave);
    cancelAnimationFrame(rafId);
  };
}

export function readParallaxFromLayer(layer: HTMLElement | null): ParallaxPoint {
  if (!layer) return { x: 0, y: 0 };

  const ry = layer.style.getPropertyValue('--sym-parallax-ry');
  const rx = layer.style.getPropertyValue('--sym-parallax-rx');
  const rotY = Number.parseFloat(ry) || 0;
  const rotX = Number.parseFloat(rx) || 0;

  return {
    x: rotY / 7.5,
    y: -rotX / 7.5,
  };
}
