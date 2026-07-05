import type { Locale } from '../i18n/config';
import { routeMap } from '../i18n/config';
import { useTranslations } from '../i18n';

/** Clave de sección que define el acento y el item activo del dock. */
export type SectionKey =
  | 'home'
  | 'projects'
  | 'cyber'
  | 'printing'
  | 'about'
  | 'contact'
  | 'links'
  | 'cv';

export interface SectionAccent {
  accent: string;
  secondary: string;
}

/**
 * Acento por sección (firma visual tomada de stefanobartoletti.it, adaptada a
 * la paleta ciber de Lucio). Cada sección tiñe H1, símbolos, glow, dock activo
 * y barra de progreso vía `--color-accent`.
 */
export const sectionAccents: Record<SectionKey, SectionAccent> = {
  home: { accent: '#34d399', secondary: '#22d3ee' },
  projects: { accent: '#22d3ee', secondary: '#34d399' },
  cyber: { accent: '#a78bfa', secondary: '#22d3ee' },
  printing: { accent: '#f59e0b', secondary: '#f97316' },
  about: { accent: '#4d81ee', secondary: '#22d3ee' },
  contact: { accent: '#2dd4bf', secondary: '#34d399' },
  links: { accent: '#34d399', secondary: '#22d3ee' },
  cv: { accent: '#34d399', secondary: '#22d3ee' },
};

export function getSectionAccent(section: SectionKey): SectionAccent {
  return sectionAccents[section] ?? sectionAccents.home;
}

/**
 * Iconos del dock (paths outline 24x24, stroke=currentColor).
 * SVG inline: sin scripts, compatible con CSP grado A.
 */
export const sectionIcons: Record<SectionKey, string> = {
  home: 'M2.25 12l8.955-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75',
  projects:
    'M2.25 12.75V12a2.25 2.25 0 012.25-2.25h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z',
  cyber:
    'M9 12.75L11.25 15 15 9.75M21 12c0 5.591-3.824 10.29-9 11.622C6.824 22.29 3 17.591 3 12c0-1.31.211-2.571.601-3.751A11.959 11.959 0 0112 2.714a11.959 11.959 0 018.4 5.535c.389 1.18.6 2.44.6 3.751z',
  printing:
    'M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9',
  about:
    'M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z',
  contact:
    'M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75',
  links:
    'M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244',
  cv: 'M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z',
};

/** Icono de búsqueda del dock (pie). */
export const searchIcon =
  'M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z';

export interface DockItem {
  key: SectionKey;
  label: string;
  href: string;
  icon: string;
}

/** Orden del dock lateral (izquierda). Home primero, resto según nav. */
const DOCK_ORDER: SectionKey[] = ['home', 'projects', 'cyber', 'printing', 'about', 'contact'];

const dockLabelKey: Record<SectionKey, Parameters<ReturnType<typeof useTranslations>>[0]> = {
  home: 'nav.home',
  projects: 'nav.projects',
  cyber: 'nav.cyber',
  printing: 'nav.printing',
  about: 'nav.about',
  contact: 'nav.contact',
  links: 'nav.links',
  cv: 'nav.cv',
};

const routeKeyForSection: Record<SectionKey, keyof typeof routeMap> = {
  home: 'home',
  projects: 'projects',
  cyber: 'cyber',
  printing: 'printing',
  about: 'about',
  contact: 'contact',
  links: 'links',
  cv: 'cv',
};

export function getDockItems(locale: Locale): DockItem[] {
  const t = useTranslations(locale);
  return DOCK_ORDER.map((key) => ({
    key,
    label: t(dockLabelKey[key]),
    href: routeMap[routeKeyForSection[key]][locale],
    icon: sectionIcons[key],
  }));
}

export function getSectionLabel(locale: Locale, section: SectionKey): string {
  const t = useTranslations(locale);
  return t(dockLabelKey[section]);
}

/** Deriva la sección activa desde el pathname (para páginas que no la declaran). */
export function sectionFromPath(path: string): SectionKey {
  const p = path.length > 1 && path.endsWith('/') ? path.slice(0, -1) : path;
  if (p === '' || p === '/' || p === '/en') return 'home';

  let best: SectionKey = 'home';
  let bestLen = -1;

  (Object.keys(routeKeyForSection) as SectionKey[]).forEach((key) => {
    if (key === 'home') return;
    const routes = [routeMap[routeKeyForSection[key]].es, routeMap[routeKeyForSection[key]].en];
    for (const route of routes) {
      const r = route.length > 1 && route.endsWith('/') ? route.slice(0, -1) : route;
      if ((p === r || p.startsWith(r + '/')) && r.length > bestLen) {
        best = key;
        bestLen = r.length;
      }
    }
  });

  return best;
}
