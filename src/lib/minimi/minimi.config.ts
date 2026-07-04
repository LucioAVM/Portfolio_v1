import type { MinimiExpandPreset, MinimiIdlePreset } from './anims';

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
  '/': {},
  '/en': {},
  '/proyectos': {},
  '/en/projects': {},
  '/ciber': {},
  '/en/cyber': {},
  '/3d': {},
  '/en/3d': {},
  '/sobre-mi': {},
  '/en/about': {},
  '/contacto': {},
  '/en/contact': {},
  '/links': {},
  '/en/links': {},
  '/cv': {},
  '/en/cv': {},
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
