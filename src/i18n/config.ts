export type Locale = 'es' | 'en';

export const routeMap = {
  home: { es: '/', en: '/en/' },
  projects: { es: '/proyectos', en: '/en/projects' },
  projectDetail: { es: '/proyectos', en: '/en/projects' },
  cyber: { es: '/ciberseguridad', en: '/en/cybersecurity' },
  printing: { es: '/impresion-3d', en: '/en/3d-printing' },
  about: { es: '/sobre-mi', en: '/en/about' },
  contact: { es: '/contacto', en: '/en/contact' },
  links: { es: '/links', en: '/en/links' },
  cv: { es: '/cv', en: '/en/cv' },
} as const;

export type RouteKey = keyof typeof routeMap;

export function getLocalizedPath(key: RouteKey, locale: Locale): string {
  return routeMap[key][locale];
}

export function getAlternateLocale(locale: Locale): Locale {
  return locale === 'es' ? 'en' : 'es';
}

export function swapLocalePath(pathname: string, to: Locale): string {
  const from = getAlternateLocale(to);
  const detailFrom = routeMap.projectDetail[from];
  const detailTo = routeMap.projectDetail[to];

  if (pathname === detailFrom || pathname.startsWith(`${detailFrom}/`)) {
    return `${detailTo}${pathname.slice(detailFrom.length)}`;
  }

  for (const paths of Object.values(routeMap)) {
    if (pathname === paths[from]) return paths[to];
  }

  if (to === 'en') {
    return pathname.startsWith('/en') ? pathname : `/en${pathname === '/' ? '/' : pathname}`;
  }

  return pathname.replace(/^\/en(?=\/|$)/, '') || '/';
}

export function localeFromPath(pathname: string): Locale {
  return pathname.startsWith('/en') ? 'en' : 'es';
}
