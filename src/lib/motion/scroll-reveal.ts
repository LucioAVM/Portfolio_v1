import { animate, stagger } from 'animejs';
import { prefersReducedMotion } from './prefers-reduced-motion';

export function initScrollReveal(): void {
  if (prefersReducedMotion()) return;
  if (document.body.dataset.layoutVariant === 'panels') return;

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;

        const target = entry.target as HTMLElement;

        if (target.hasAttribute('data-reveal-stagger')) {
          const items = target.querySelectorAll('[data-reveal-item]');
          animate(items, {
            opacity: [0, 1],
            translateY: [18, 0],
            duration: 900,
            delay: stagger(110),
            ease: 'outCubic',
          });
        } else {
          const items = target.querySelectorAll(':scope > [data-reveal-item]');
          animate(items, {
            opacity: [0, 1],
            translateY: [14, 0],
            duration: 850,
            delay: stagger(80),
            ease: 'outCubic',
          });
        }

        observer.unobserve(target);
      }
    },
    { threshold: 0.1, rootMargin: '0px 0px -6% 0px' },
  );

  document.querySelectorAll('[data-reveal], [data-reveal-stagger]').forEach((el) => {
    observer.observe(el);
  });
}
