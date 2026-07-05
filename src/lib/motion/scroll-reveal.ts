import { animate, stagger } from 'animejs';
import { prefersReducedMotion } from './prefers-reduced-motion';

export function initScrollReveal(): void {
  if (prefersReducedMotion()) return;

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;

        const target = entry.target as HTMLElement;

        if (target.hasAttribute('data-reveal-stagger')) {
          const items = target.querySelectorAll('[data-reveal-item]');
          animate(items, {
            opacity: [0, 1],
            translateY: [24, 0],
            duration: 700,
            delay: stagger(90),
            ease: 'outExpo',
          });
        } else {
          const items = target.querySelectorAll(':scope > [data-reveal-item]');
          animate(items, {
            opacity: [0, 1],
            translateY: [20, 0],
            duration: 650,
            delay: stagger(60),
            ease: 'outExpo',
          });
        }

        observer.unobserve(target);
      }
    },
    { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
  );

  document.querySelectorAll('[data-reveal], [data-reveal-stagger]').forEach((el) => {
    observer.observe(el);
  });
}

export function initScrollProgress(): void {
  const bar = document.getElementById('scroll-progress-fill');
  if (!bar || prefersReducedMotion()) return;

  const scroller = document.getElementById('app-scroll');

  const update = (): void => {
    const scrollTop = scroller ? scroller.scrollTop : window.scrollY;
    const docHeight = scroller
      ? scroller.scrollHeight - scroller.clientHeight
      : document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? scrollTop / docHeight : 0;
    bar.style.transform = `scaleY(${Math.min(1, Math.max(0, progress))})`;
  };

  update();
  (scroller ?? window).addEventListener('scroll', update, { passive: true });
}
