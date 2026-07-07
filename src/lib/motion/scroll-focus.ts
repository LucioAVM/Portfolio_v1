import { prefersReducedMotion } from './prefers-reduced-motion';

/** Banda central nítida (0–1 relativo al viewport del scroller). */
const FOCUS_START = 0.42;
const FOCUS_END = 0.58;
const MAX_BLUR = 10;
const STAGGER_STEP = 0.09;

const HEADING_SEL =
  'h1, h2, h3, .section-title, .section-label, .about-heading, .projects-highlight-title';
const COMPONENT_SEL = '.win, .project-row, .card';
const BLOCK_SEL = 'p, ul, ol, img, .prose-content > *, .projects-highlight-cta-wrap, div.flex';

function smoothstep(edge0: number, edge1: number, x: number): number {
  const t = Math.min(Math.max((x - edge0) / (edge1 - edge0), 0), 1);
  return t * t * (3 - 2 * t);
}

function focusAmount(
  centerRatio: number,
  options?: { skipTopFade?: boolean },
): { opacity: number; blur: number } {
  if (centerRatio >= FOCUS_START && centerRatio <= FOCUS_END) {
    return { opacity: 1, blur: 0 };
  }

  if (centerRatio < FOCUS_START) {
    if (options?.skipTopFade) {
      return { opacity: 1, blur: 0 };
    }
    const t = smoothstep(0, FOCUS_START, centerRatio);
    return { opacity: t, blur: (1 - t) * MAX_BLUR };
  }

  const t = smoothstep(1, FOCUS_END, centerRatio);
  return { opacity: t, blur: (1 - t) * MAX_BLUR };
}

function splitHeadingWords(heading: HTMLElement): void {
  const words: HTMLElement[] = [];

  const processNode = (node: Node, parent: HTMLElement | DocumentFragment): void => {
    if (node.nodeType === Node.TEXT_NODE) {
      const tokens = (node.textContent ?? '').trim().split(/\s+/).filter(Boolean);
      for (let i = 0; i < tokens.length; i += 1) {
        if (i > 0) parent.appendChild(document.createTextNode(' '));
        const span = document.createElement('span');
        span.className = 'fade-word';
        span.textContent = tokens[i];
        span.setAttribute('data-scroll-fade', '');
        words.push(span);
        parent.appendChild(span);
      }
      return;
    }

    if (node.nodeType !== Node.ELEMENT_NODE) return;

    const el = node as HTMLElement;
    const wrapper = el.cloneNode(false) as HTMLElement;
    parent.appendChild(wrapper);

    for (const child of Array.from(el.childNodes)) {
      processNode(child, wrapper);
    }

    if (!wrapper.hasChildNodes()) {
      parent.removeChild(wrapper);
    }
  };

  const frag = document.createDocumentFragment();
  for (const child of Array.from(heading.childNodes)) {
    processNode(child, frag);
  }
  heading.replaceChildren(frag);

  const count = words.length;
  words.forEach((word, index) => {
    word.dataset.fadeStagger = String((index - (count - 1) / 2) * STAGGER_STEP);
  });
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

function tagRegion(region: HTMLElement): void {
  region.querySelectorAll<HTMLElement>(HEADING_SEL).forEach((heading) => {
    if (heading.closest(COMPONENT_SEL)) return;
    splitHeadingWords(heading);
  });

  region.querySelectorAll<HTMLElement>(COMPONENT_SEL).forEach((component) => {
    component.setAttribute('data-scroll-fade', '');
  });

  region.querySelectorAll<HTMLElement>(BLOCK_SEL).forEach((block) => {
    if (block.closest(COMPONENT_SEL)) return;
    if (block.closest(HEADING_SEL)) return;
    if (block.hasAttribute('data-scroll-fade')) return;
    block.setAttribute('data-scroll-fade', '');
  });
}

function tagElements(): void {
  for (const region of getRegions()) {
    tagRegion(region);
  }
}

export function initScrollFocus(): void {
  if (prefersReducedMotion()) return;

  const scroller = document.getElementById('app-scroll');
  if (!scroller) return;

  tagElements();

  const tracked = Array.from(document.querySelectorAll<HTMLElement>('[data-scroll-fade]'));
  if (!tracked.length) return;

  let ticking = false;

  const update = () => {
    ticking = false;
    const viewportH = scroller.clientHeight || 1;
    const scrollerRect = scroller.getBoundingClientRect();

    for (const el of tracked) {
      const isFadeWord = el.classList.contains('fade-word');
      const heading = isFadeWord ? el.closest<HTMLElement>(HEADING_SEL) : null;
      const anchor = heading ?? el;
      const rect = anchor.getBoundingClientRect();
      const centerInViewport = rect.top - scrollerRect.top + rect.height / 2;
      let ratio = centerInViewport / viewportH;

      if (heading) {
        ratio += Number(el.dataset.fadeStagger ?? 0);
      }

      const { opacity, blur } = focusAmount(ratio, { skipTopFade: isFadeWord });

      el.style.opacity = String(opacity);
      el.style.filter = blur > 0.05 ? `blur(${blur}px)` : 'none';
    }
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
