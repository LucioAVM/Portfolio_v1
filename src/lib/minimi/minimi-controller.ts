import {
  blinkAnim,
  expandPresets,
  idlePresets,
  queryMinimiParts,
  type AnimationHandle,
  type MinimiParts,
} from './anims';
import { resolveMinimiPreset, type MinimiPreset } from './minimi.config';

const STORAGE_MINIMIZED = 'minimi-minimized';
const STORAGE_DISMISSED_LEGACY = 'minimi-dismissed';
const QUOTE_INTERVAL_MS = 8000;

export type MinimiLabels = {
  minimize: string;
  expand: string;
  avatarExpand: string;
  mascot: string;
};

type MinimiElements = {
  bubble: HTMLElement;
  quoteEl: HTMLElement;
  toggleBtn: HTMLButtonElement;
  avatarBtn: HTMLButtonElement;
  characterWrap: HTMLElement;
};

function migrateStorage(): boolean {
  const legacy = localStorage.getItem(STORAGE_DISMISSED_LEGACY);
  if (legacy === '1') {
    localStorage.removeItem(STORAGE_DISMISSED_LEGACY);
    localStorage.setItem(STORAGE_MINIMIZED, '1');
    return true;
  }
  return localStorage.getItem(STORAGE_MINIMIZED) === '1';
}

function queryElements(slot: HTMLElement): MinimiElements | null {
  const bubble = slot.querySelector<HTMLElement>('#minimi-bubble');
  const quoteEl = slot.querySelector<HTMLElement>('#minimi-quote');
  const toggleBtn = slot.querySelector<HTMLButtonElement>('#minimi-toggle');
  const avatarBtn = slot.querySelector<HTMLButtonElement>('#minimi-avatar-btn');
  const characterWrap = slot.querySelector<HTMLElement>('#minimi-character-wrap');

  if (!bubble || !quoteEl || !toggleBtn || !avatarBtn || !characterWrap) return null;
  return { bubble, quoteEl, toggleBtn, avatarBtn, characterWrap };
}

class MinimiAnimationController {
  private handles: AnimationHandle[] = [];
  private enabled = false;

  constructor(
    private parts: MinimiParts,
    private preset: MinimiPreset,
    private reducedMotion: boolean,
  ) {}

  private canAnimate(): boolean {
    return !this.reducedMotion && this.enabled && !document.hidden;
  }

  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
    if (!enabled) this.stopAll();
  }

  stopAll(): void {
    for (const handle of this.handles) handle.stop();
    this.handles = [];
  }

  pauseAll(): void {
    for (const handle of this.handles) handle.pause();
  }

  resumeAll(): void {
    if (!this.canAnimate()) return;
    for (const handle of this.handles) handle.resume();
  }

  startIdle(): void {
    if (!this.canAnimate()) return;
    this.stopAll();
    const idleFactory = idlePresets[this.preset.idle];
    if (idleFactory) this.handles.push(idleFactory(this.parts));
    this.handles.push(blinkAnim(this.parts));
  }

  async playExpand(): Promise<void> {
    if (!this.canAnimate()) return;
    this.stopAll();
    const expandFactory = expandPresets[this.preset.onExpand];
    if (expandFactory) {
      const handle = expandFactory(this.parts);
      this.handles.push(handle);
      await new Promise<void>((resolve) => window.setTimeout(resolve, 900));
      handle.stop();
    }
    this.startIdle();
  }

  /** Hook for future one-shot animations (e.g. konami, section reactions). */
  async play(name: keyof typeof expandPresets): Promise<void> {
    if (!this.canAnimate()) return;
    this.stopAll();
    const factory = expandPresets[name];
    if (!factory) {
      this.startIdle();
      return;
    }
    const handle = factory(this.parts);
    this.handles.push(handle);
    await new Promise<void>((resolve) => window.setTimeout(resolve, 900));
    handle.stop();
    this.startIdle();
  }
}

export function initMinimi(slot: HTMLElement, labels: MinimiLabels): void {
  const elements = queryElements(slot);
  const parts = queryMinimiParts(slot);
  if (!elements || !parts) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const preset = resolveMinimiPreset(window.location.pathname);
  const quotes: string[] = JSON.parse(slot.dataset.quotes ?? '[]');
  let quoteIndex = 0;
  let quoteTimer: number | undefined;
  let minimized = migrateStorage();

  const anim = new MinimiAnimationController(parts, preset, reducedMotion);

  const stopQuoteRotation = (): void => {
    if (quoteTimer !== undefined) {
      window.clearInterval(quoteTimer);
      quoteTimer = undefined;
    }
  };

  const startQuoteRotation = (): void => {
    stopQuoteRotation();
    if (quotes.length <= 1 || reducedMotion || minimized) return;
    quoteTimer = window.setInterval(() => {
      quoteIndex = (quoteIndex + 1) % quotes.length;
      elements.quoteEl.textContent = quotes[quoteIndex];
    }, QUOTE_INTERVAL_MS);
  };

  const applyMinimizedUi = (next: boolean, playWave = false): void => {
    minimized = next;
    localStorage.setItem(STORAGE_MINIMIZED, next ? '1' : '0');

    elements.bubble.classList.toggle('hidden', next);
    elements.bubble.setAttribute('aria-hidden', String(next));
    elements.toggleBtn.setAttribute('aria-expanded', String(!next));
    elements.toggleBtn.textContent = next ? labels.expand : labels.minimize;
    elements.avatarBtn.setAttribute('aria-label', next ? labels.avatarExpand : labels.mascot);
    elements.avatarBtn.tabIndex = next ? 0 : -1;
    elements.characterWrap.dataset.compact = next ? 'true' : 'false';
    elements.characterWrap.classList.toggle('scale-90', next);
    elements.characterWrap.classList.toggle('opacity-90', next);

    if (next) {
      anim.setEnabled(false);
      stopQuoteRotation();
      return;
    }

    anim.setEnabled(true);
    if (playWave) {
      void anim.playExpand().then(startQuoteRotation);
    } else {
      anim.startIdle();
      startQuoteRotation();
    }
  };

  elements.toggleBtn.addEventListener('click', () => {
    applyMinimizedUi(true, false);
  });

  elements.avatarBtn.addEventListener('click', () => {
    if (minimized) applyMinimizedUi(false, true);
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      anim.pauseAll();
      return;
    }
    if (!minimized && !reducedMotion) anim.resumeAll();
  });

  slot.classList.remove('hidden');
  applyMinimizedUi(minimized, false);

  (window as Window & { minimi?: { play: (name: 'wave') => Promise<void> } }).minimi = {
    play: (name) => anim.play(name),
  };
}
