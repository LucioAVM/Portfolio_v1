import { prefersReducedMotion } from './prefers-reduced-motion';
import { lerp } from './lerp';

/**
 * Watermark estilo Stefano:
 * - marquee horizontal continuo
 * - drift lateral por scroll (suavizado)
 */
export function initWatermarkMarquee(): void {
  const shell = document.querySelector<HTMLElement>('[data-watermark-marquee]');
  const track = document.querySelector<HTMLElement>('[data-watermark-track]');
  if (!shell || !track) return;

  const firstSpan = track.querySelector<HTMLElement>('[data-watermark-span]');
  if (!firstSpan) return;

  const boot = () => {
    const width = firstSpan.getBoundingClientRect().width;
    if (width < 8) {
      requestAnimationFrame(boot);
      return;
    }

    if (prefersReducedMotion()) {
      track.style.transform = 'none';
      return;
    }

    let marqueeX = 0;
    let scrollDrift = 0;
    let targetDrift = 0;
    let lastScroll = 0;
    const speed = 22;

    const scroller = document.querySelector<HTMLElement>('#app-scroll');
    lastScroll = scroller?.scrollTop ?? 0;

    if (scroller) {
      scroller.addEventListener(
        'scroll',
        () => {
          const top = scroller.scrollTop;
          const delta = top - lastScroll;
          lastScroll = top;
          targetDrift += delta * -0.28;
        },
        { passive: true },
      );
    }

    let lastTs = performance.now();

    const tick = (ts: number) => {
      const dt = Math.min(0.05, (ts - lastTs) / 1000);
      lastTs = ts;

      if (speed > 0) {
        marqueeX -= speed * dt;
        if (marqueeX <= -width) marqueeX += width;
        if (marqueeX > 0) marqueeX -= width;
      }

      // Drift con inercia (no sigue el scroll 1:1)
      scrollDrift = lerp(scrollDrift, targetDrift, 0.06);

      const x = marqueeX + scrollDrift;
      track.style.transform = `translate3d(${x.toFixed(2)}px, 0, 0)`;
      requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  };

  requestAnimationFrame(boot);
}
