import type { MinimiExpandPreset, MinimiIdlePreset } from './anims';
import { routeMap } from '../../i18n/config';

export type MinimiPreset = {
  idle: MinimiIdlePreset;
  onExpand: MinimiExpandPreset;
  quoteTags?: string[];
};

export const DEFAULT_PRESET: MinimiPreset = {
  idle: 'float',
  onExpand: 'wave',
};

/** Route prefixes → preset overrides. Longest match wins. */
export const minimiRoutePresets: Record<string, Partial<MinimiPreset>> = {
  [routeMap.home.es]: {},
  [routeMap.home.en]: {},
  [routeMap.projects.es]: {},
  [routeMap.projects.en]: {},
  [routeMap.cyber.es]: {},
  [routeMap.cyber.en]: {},
  [routeMap.printing.es]: {},
  [routeMap.printing.en]: {},
  [routeMap.about.es]: {},
  [routeMap.about.en]: {},
  [routeMap.contact.es]: {},
  [routeMap.contact.en]: {},
  [routeMap.links.es]: {},
  [routeMap.links.en]: {},
  [routeMap.cv.es]: {},
  [routeMap.cv.en]: {},
};

export function resolveMinimiPreset(pathname: string): MinimiPreset {
  const routes = Object.entries(minimiRoutePresets).sort(
    (a, b) => b[0].length - a[0].length,
  );

  for (const [route, partial] of routes) {
    if (pathname === route || pathname.startsWith(`${route}/`)) {
      return { ...DEFAULT_PRESET, ...partial };
    }
  }

  return DEFAULT_PRESET;
}
