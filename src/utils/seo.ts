import type { Locale } from '../i18n/config';
import { getAlternateLocale, getLocalizedPath, type RouteKey } from '../i18n/config';

export function absoluteUrl(path: string, site: string): string {
  const base = site.replace(/\/$/, '');
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return `${base}${normalized}`;
}

export function buildHreflangAlternates(
  locale: Locale,
  currentPath: string,
  site: string,
): { hreflang: string; href: string }[] {
  const alt = getAlternateLocale(locale);
  const altPath = swapLocalePath(currentPath, locale, alt);
  return [
    { hreflang: locale, href: absoluteUrl(currentPath, site) },
    { hreflang: alt, href: absoluteUrl(altPath, site) },
    { hreflang: 'x-default', href: absoluteUrl(swapLocalePath(currentPath, locale, 'es'), site) },
  ];
}

/** Mapeo simplificado ES ↔ EN para hreflang */
function swapLocalePath(path: string, from: Locale, to: Locale): string {
  if (from === to) return path;

  const pairs: [string, string][] = [
    ['/proyectos/', '/en/projects/'],
    ['/proyectos', '/en/projects'],
    ['/ciberseguridad', '/en/cybersecurity'],
    ['/impresion-3d', '/en/3d-printing'],
    ['/sobre-mi', '/en/about'],
    ['/contacto', '/en/contact'],
    ['/links', '/en/links'],
    ['/cv', '/en/cv'],
    ['/', '/en/'],
    ['/en/projects/', '/proyectos/'],
    ['/en/projects', '/proyectos'],
    ['/en/cybersecurity', '/ciberseguridad'],
    ['/en/3d-printing', '/impresion-3d'],
    ['/en/about', '/sobre-mi'],
    ['/en/contact', '/contacto'],
    ['/en/links', '/links'],
    ['/en/cv', '/cv'],
    ['/en/', '/'],
  ];

  let result = path;
  for (const [a, b] of pairs) {
    if (to === 'en' && result.startsWith(a) && !result.startsWith('/en')) {
      result = b + result.slice(a.length);
      return result;
    }
    if (to === 'es' && result.startsWith(a)) {
      result = b + result.slice(a.length);
      return result;
    }
  }

  return to === 'en' ? `/en${path === '/' ? '/' : path}` : path.replace(/^\/en/, '') || '/';
}

export function canonicalFor(locale: Locale, key: RouteKey, site: string): string {
  return absoluteUrl(getLocalizedPath(key, locale), site);
}
