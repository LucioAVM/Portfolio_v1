import type { Locale } from '../i18n/config';
import { getAlternateLocale, swapLocalePath } from '../i18n/config';

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
  const altPath = swapLocalePath(currentPath, alt);
  return [
    { hreflang: locale, href: absoluteUrl(currentPath, site) },
    { hreflang: alt, href: absoluteUrl(altPath, site) },
    { hreflang: 'x-default', href: absoluteUrl(swapLocalePath(currentPath, 'es'), site) },
  ];
}
