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
    url: 'https://github.com/LucioAVM',
    icon: 'github',
    featured: true,
  },
  {
    id: 'linkedin',
    label: { es: 'LinkedIn', en: 'LinkedIn' },
    url: 'https://www.linkedin.com/in/monsalbolucio/',
    icon: 'linkedin',
    featured: true,
  },
  {
    id: 'tryhackme',
    label: { es: 'TryHackMe', en: 'TryHackMe' },
    url: 'https://tryhackme.com/p/lucioavm8',
    icon: 'shield',
    featured: true,
  },
  {
    id: 'hackthebox',
    label: { es: 'Hack The Box', en: 'Hack The Box' },
    url: 'https://profile.hackthebox.com/profile/019cd9a8-fd2d-7125-949e-18af9ba01819',
    icon: 'shield',
  },
  {
    id: 'portfolio-repo',
    label: { es: 'Código del portfolio', en: 'Portfolio source' },
    url: 'https://github.com/LucioAVM/Portfolio_v1',
    icon: 'code',
  },
];

export const LINKEDIN_URL = 'https://www.linkedin.com/in/monsalbolucio/';
