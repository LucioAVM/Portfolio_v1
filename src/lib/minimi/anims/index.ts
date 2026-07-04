import { blinkAnim } from './blink';
import { idleAnim } from './idle';
import { waveAnim } from './wave';
import type { MinimiAnimFactory } from './types';

export type MinimiIdlePreset = 'float';
export type MinimiExpandPreset = 'wave';

export const idlePresets: Record<MinimiIdlePreset, MinimiAnimFactory> = {
  float: idleAnim,
};

export const expandPresets: Record<MinimiExpandPreset, MinimiAnimFactory> = {
  wave: waveAnim,
};

export { blinkAnim, idleAnim, waveAnim };
export type { AnimationHandle, MinimiAnimFactory, MinimiParts } from './types';
export { queryMinimiParts } from './types';
