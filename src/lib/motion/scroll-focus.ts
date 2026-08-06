import { prefersReducedMotion } from './prefers-reduced-motion';
import { lerp, nearlyEqual } from './lerp';

/** Banda central nítida (0–1 relativo al viewport del scroller). */
const FOCUS_START = 0.1;
const FOCUS_END = 0.9;
const MAX_BLUR = 0.85;
const FOCUS_LERP = 0.1;

const HEADING_SEL =
  'h1, h2, h3, .section-title, .section-label, .about-heading, .projects-highlight-title, .pillar-ctas-title, .pillar-card-title';
const COMPONENT_SEL = '.project-row, .card, .pillar-card';
const BLOCK_SEL = 'p, ul, ol, img, .prose-content > *, .projects-highlight-cta-wrap';

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.min(Math.max((x - edge0) / (edge1 - edge0), 0), 1);
  return t * t * (3 - 2 * t);
}

function focusAmount(centerRatio: number): { opacity: number; blur: number } {
  if (centerRatio >= FOCUS_START && centerRatio <= FOCUS_END) {
    return { opacity: 1, blur: 0 };
  }

  if (centerRatio < FOCUS_START) {
    const t = smoothstep(0, FOCUS_START, centerRatio);
    return { opacity: Math.max(0.45, t), blur: (1 - t) * MAX_BLUR };
  }

  const t = smoothstep(1, FOCUS_END, centerRatio);
  return { opacity: Math.max(0.45, t), blur: (1 - t) * MAX_BLUR };
}

function getRegions(): HTMLElement[] {
  const variant = document.body.dataset.layoutVariant ?? 'document';

  if (variant === 'panels') {
    return Array.from(
      document.querySelectorAll<HTMLElement>('[data-panel]:not([data-panel-fade-content]) .panel-inner'),
    );
  }

  const main = document.querySelector<HTMLElement>('.app-main');
  return main ? [main] : [];
}

function isHeading(el: HTMLElement): boolean {
  return Boolean(el.matches(HEADING_SEL) || el.closest(HEADING_SEL) === el);
}

function tagRegion(region: HTMLElement): void {
  region.querySelectorAll<HTMLElement>(COMPONENT_SEL).forEach((component) => {
    component.setAttribute('data-scroll-fade', '');
  });

  region.querySelectorAll<HTMLElement>(BLOCK_SEL).forEach((block) => {
    if (block.closest(COMPONENT_SEL)) return;
    if (block.closest('.win')) return;
    if (block.closest(HEADING_SEL)) return;
    if (block.closest('#hero')) return;
    if (block.hasAttribute('data-scroll-fade')) return;
    block.setAttribute('data-scroll-fade', '');
  });
}

function tagElements(): void {
  for (const region of getRegions()) {
    tagRegion(region);
  }
}

type FocusState = { opacity: number; blur: number; targetO: number; targetB: number };

export function initScrollFocus(): void {
  if (prefersReducedMotion()) return;

  const scroller = document.getElementById('app-scroll');
  if (!scroller) return;

  tagElements();

  document.querySelectorAll<HTMLElement>(HEADING_SEL).forEach((el) => {
    el.style.filter = '';
    el.style.opacity = '';
    el.removeAttribute('data-scroll-fade');
  });

  const tracked = Array.from(document.querySelectorAll<HTMLElement>('[data-scroll-fade]'));
  if (!tracked.length) return;

  const state = new Map<HTMLElement, FocusState>();
  for (const el of tracked) {
    state.set(el, { opacity: 1, blur: 0, targetO: 1, targetB: 0 });
  }

  let rafId = 0;

  const sampleTargets = () => {
    const viewportH = scroller.clientHeight || 1;
    const scrollerRect = scroller.getBoundingClientRect();

    for (const el of tracked) {
      if (isHeading(el)) {
        const s = state.get(el);
        if (s) {
          s.targetO = 1;
          s.targetB = 0;
        }
        continue;
      }

      const rect = el.getBoundingClientRect();
      const centerInViewport = rect.top - scrollerRect.top + rect.height / 2;
      const ratio = centerInViewport / viewportH;
      const { opacity, blur } = focusAmount(ratio);
      const s = state.get(el);
      if (s) {
        s.targetO = opacity;
        s.targetB = blur;
      }
    }
  };

  const tick = () => {
    let moving = false;

    for (const el of tracked) {
      const s = state.get(el);
      if (!s) continue;

      s.opacity = lerp(s.opacity, s.targetO, FOCUS_LERP);
      s.blur = lerp(s.blur, s.targetB, FOCUS_LERP);

      if (!nearlyEqual(s.opacity, s.targetO, 0.002) || !nearlyEqual(s.blur, s.targetB, 0.02)) {
        moving = true;
      } else {
        s.opacity = s.targetO;
        s.blur = s.targetB;
      }

      el.style.opacity = String(s.opacity);
      el.style.filter = s.blur > 0.04 ? `blur(${s.blur.toFixed(2)}px)` : 'none';
    }

    if (moving) {
      rafId = requestAnimationFrame(tick);
    } else {
      rafId = 0;
    }
  };

  const kick = () => {
    sampleTargets();
    if (!rafId) rafId = requestAnimationFrame(tick);
  };

  scroller.addEventListener('scroll', kick, { passive: true });
  window.addEventListener('resize', kick, { passive: true });
  kick();
}
