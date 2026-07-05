import type { JSAnimation } from 'animejs';

export type MinimiParts = {
  root: SVGElement;
  body: SVGElement;
  head: SVGElement;
  armL: SVGElement;
  armR: SVGElement;
  eyeL: SVGElement;
  eyeR: SVGElement;
  eyeAccent?: SVGElement;
};

export type AnimationHandle = {
  stop: () => void;
  pause: () => void;
  resume: () => void;
};

export type MinimiAnimFactory = (parts: MinimiParts) => AnimationHandle;

export function createHandle(anims: JSAnimation[]): AnimationHandle {
  return {
    stop: () => {
      for (const anim of anims) anim.revert();
    },
    pause: () => {
      for (const anim of anims) anim.pause();
    },
    resume: () => {
      for (const anim of anims) anim.resume();
    },
  };
}

export function queryMinimiParts(root: ParentNode): MinimiParts | null {
  const required = {
    root: root.querySelector<SVGElement>('#minimi-root'),
    body: root.querySelector<SVGElement>('#minimi-body'),
    head: root.querySelector<SVGElement>('#minimi-head'),
    armL: root.querySelector<SVGElement>('#minimi-arm-l'),
    armR: root.querySelector<SVGElement>('#minimi-arm-r'),
    eyeL: root.querySelector<SVGElement>('#minimi-eye-l'),
    eyeR: root.querySelector<SVGElement>('#minimi-eye-r'),
  };

  if (Object.values(required).some((el) => !el)) return null;

  const eyeAccent = root.querySelector<SVGElement>('#minimi-eye-accent') ?? undefined;

  return { ...required, eyeAccent } as MinimiParts;
}
