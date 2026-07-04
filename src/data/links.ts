export interface LinkItem {
  id: string;
  label: { es: string; en: string };
  url: string;
  icon?: string;
  featured?: boolean;
}

/** Enlaces públicos — sin PII. Solo HTTPS. */
export const socialLinks: LinkItem[] = [
  {
    id: 'github',
    label: { es: 'GitHub', en: 'GitHub' },
    url: 'https://github.com/',
    icon: 'github',
    featured: true,
  },
  {
    id: 'linkedin',
    label: { es: 'LinkedIn', en: 'LinkedIn' },
    url: 'https://www.linkedin.com/',
    icon: 'linkedin',
    featured: true,
  },
  {
    id: 'ctf',
    label: { es: 'Perfil CTF', en: 'CTF Profile' },
    url: 'https://www.hackthebox.com/',
    icon: 'shield',
  },
  {
    id: 'portfolio-repo',
    label: { es: 'Código del portfolio', en: 'Portfolio source' },
    url: 'https://github.com/',
    icon: 'code',
  },
];

export const LINKEDIN_URL = 'https://www.linkedin.com/';
