import type { Locale } from './config';
import es from './ui.es.json';
import en from './ui.en.json';

const dictionaries = { es, en } as const;

export type UiKey = keyof typeof es;

export function useTranslations(locale: Locale) {
  const dict = dictionaries[locale];
  return function t(key: UiKey): string {
    return dict[key] ?? key;
  };
}

export function getNavItems(locale: Locale) {
  const t = useTranslations(locale);
  const prefix = locale === 'en' ? '/en' : '';
  return [
    { label: t('nav.projects'), href: locale === 'es' ? '/proyectos' : '/en/projects' },
    { label: t('nav.cyber'), href: locale === 'es' ? '/ciberseguridad' : '/en/cybersecurity' },
    { label: t('nav.printing'), href: locale === 'es' ? '/impresion-3d' : '/en/3d-printing' },
    { label: t('nav.about'), href: locale === 'es' ? '/sobre-mi' : '/en/about' },
    { label: t('nav.contact'), href: locale === 'es' ? '/contacto' : '/en/contact' },
    { label: t('nav.links'), href: `${prefix}/links` },
  ];
}
