/** Whitelist — ampliar solo con cambio en docs/modelo-contenido.md */
export const PROJECT_TAGS = [
  'C',
  'CLI',
  'Android',
  'Kotlin',
  'iOS',
  'Desktop',
  'Web',
  'Python',
  'Rust',
  'Go',
  'Java',
  'XSS',
  'CTF',
  'Writeup',
  'Lab',
  'Pentest',
  'OWASP',
  'PETG',
  'PLA',
  'Resina',
  'Functional',
  'Decorative',
  'Prototype',
] as const;

export type ProjectTag = (typeof PROJECT_TAGS)[number];

export function isProjectTag(value: string): value is ProjectTag {
  return (PROJECT_TAGS as readonly string[]).includes(value);
}
