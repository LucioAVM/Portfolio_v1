import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';
import { isProjectTag } from '../data/project-tags';
import type { Locale } from '../i18n/config';

export type ProjectEntry = CollectionEntry<'projects'>;

export function getContentLocale(entry: ProjectEntry): Locale {
  if (entry.id.startsWith('en/')) return 'en';
  if (entry.id.startsWith('es/')) return 'es';
  return 'es';
}

export async function getProjects(locale: Locale, options?: { includeDrafts?: boolean }) {
  const includeDrafts = options?.includeDrafts ?? import.meta.env.DEV;
  const all = await getCollection('projects');
  return all
    .filter((entry) => getContentLocale(entry) === locale)
    .filter((entry) => includeDrafts || !entry.data.draft)
    .sort(compareProjects);
}

export function compareProjects(a: ProjectEntry, b: ProjectEntry): number {
  const orderA = a.data.order ?? 999;
  const orderB = b.data.order ?? 999;
  if (orderA !== orderB) return orderA - orderB;
  return b.data.date.getTime() - a.data.date.getTime();
}

export function getProjectBySlug(projects: ProjectEntry[], slug: string) {
  return projects.find((p) => p.data.slug === slug);
}

export function filterProjects(
  projects: ProjectEntry[],
  filters: { category?: string; tag?: string },
) {
  return projects.filter((p) => {
    if (filters.category && p.data.category !== filters.category) return false;
    if (filters.tag && !p.data.tags.includes(filters.tag)) return false;
    return true;
  });
}

export function getUniqueTags(projects: ProjectEntry[]): string[] {
  const tags = new Set<string>();
  for (const p of projects) {
    for (const tag of p.data.tags) tags.add(tag);
  }
  return [...tags].sort();
}

const ALLOWED_CATEGORIES = ['dev', 'ciberseguridad', 'impresion3d'] as const;

export function sanitizeCategory(value: string | null): string | undefined {
  if (!value) return undefined;
  return ALLOWED_CATEGORIES.includes(value as (typeof ALLOWED_CATEGORIES)[number])
    ? value
    : undefined;
}

export function sanitizeTag(value: string | null): string | undefined {
  if (!value) return undefined;
  return isProjectTag(value) ? value : undefined;
}

export function projectDetailPath(locale: Locale, slug: string): string {
  return locale === 'es' ? `/proyectos/${slug}` : `/en/projects/${slug}`;
}
