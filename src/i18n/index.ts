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
