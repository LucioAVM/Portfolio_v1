import type { Locale } from '../i18n/config';
import { socialLinks } from './links';

/**
 * Contenido de la sección About (home). Bilingüe y estructurado en tokens para
 * aplicar "syntax highlighting" dentro de las ventanas estilo editor.
 *
 * NOTA: `hobbies` son placeholders neutrales; reemplazar por los reales de Lucio.
 */

export type TokenColor = 'green' | 'cyan' | 'amber' | 'purple' | 'red';

export interface Token {
  text: string;
  color?: TokenColor;
}

export interface OnlineLink {
  label: string;
  url: string;
}

export interface AboutContent {
  heading: Token[];
  aboutMe: Token[][];
  where: string[];
  hobbies: string[];
  portraitAlt: string;
}

const urlById = (id: string): string => socialLinks.find((l) => l.id === id)?.url ?? '#';

/** Enlaces reales de Lucio (sin inventar redes que no tiene). */
export const meOnline: OnlineLink[] = [
  { label: 'linkedin', url: urlById('linkedin') },
  { label: 'github', url: urlById('github') },
  { label: 'tryhackme', url: urlById('tryhackme') },
  { label: 'hackthebox', url: urlById('hackthebox') },
  { label: 'portfolio', url: urlById('portfolio-repo') },
];

export const windowTitles = {
  aboutMe: 'about-me',
  portrait: 'portrait',
  where: 'where-i-work',
  hobbies: 'hobbies',
  meOnline: 'me-online',
} as const;

export const aboutContent: Record<Locale, AboutContent> = {
  es: {
    heading: [
      { text: 'Tu ' },
      { text: 'ciber & dev ' },
      { text: 'creativo', color: 'green' },
    ],
    aboutMe: [
      [{ text: 'Desarrollador de Ciberseguridad y Software', color: 'green' }],
      [
        { text: 'Me especializo en ' },
        { text: 'ciberseguridad', color: 'cyan' },
        { text: ', ' },
        { text: 'desarrollo de software', color: 'cyan' },
        { text: ' y ' },
        { text: 'apps web y móviles seguras', color: 'amber' },
        { text: ', combinando lo ' },
        { text: 'técnico', color: 'purple' },
        { text: ' y lo ' },
        { text: 'creativo', color: 'purple' },
        { text: '.' },
      ],
      [
        { text: 'Pongo mi ' },
        { text: 'experiencia', color: 'red' },
        { text: ' al servicio de ' },
        { text: 'startups, laboratorios y equipos', color: 'red' },
        { text: ' y ' },
        { text: 'clientes independientes', color: 'red' },
        { text: '.' },
      ],
      [
        { text: 'Siempre ' },
        { text: 'programando', color: 'amber' },
        { text: ', ' },
        { text: 'experimentando', color: 'red' },
        { text: ' con nuevas ' },
        { text: 'tecnologías', color: 'cyan' },
        { text: ' en ' },
        { text: 'proyectos personales', color: 'cyan' },
        { text: ' y ' },
        { text: 'open-source', color: 'green' },
        { text: '.' },
      ],
    ],
    where: [
      'Actualmente en Argentina 📍',
      'Disponible para colaboraciones remotas en América 🌎, Europa 🇪🇺 y todo el mundo 🌐',
    ],
    hobbies: ['📚 Lectura', '🎮 Gaming', '🥾 Senderismo', '🎧 Música'],
    portraitAlt: 'Lucio Monsalbo',
  },
  en: {
    heading: [
      { text: 'Your ' },
      { text: 'creative ', color: 'green' },
      { text: 'cyber & dev' },
    ],
    aboutMe: [
      [{ text: 'Cybersecurity & Software Developer', color: 'green' }],
      [
        { text: 'I specialise in ' },
        { text: 'cybersecurity', color: 'cyan' },
        { text: ', ' },
        { text: 'software development', color: 'cyan' },
        { text: ' and ' },
        { text: 'secure web & mobile apps', color: 'amber' },
        { text: ', blending ' },
        { text: 'technical', color: 'purple' },
        { text: ' and ' },
        { text: 'creative', color: 'purple' },
        { text: ' work.' },
      ],
      [
        { text: 'I bring my ' },
        { text: 'expertise', color: 'red' },
        { text: ' to ' },
        { text: 'startups, labs and teams', color: 'red' },
        { text: ' and ' },
        { text: 'independent clients', color: 'red' },
        { text: '.' },
      ],
      [
        { text: 'Always ' },
        { text: 'coding', color: 'amber' },
        { text: ', ' },
        { text: 'experimenting', color: 'red' },
        { text: ' with new ' },
        { text: 'technologies', color: 'cyan' },
        { text: ' through ' },
        { text: 'personal projects', color: 'cyan' },
        { text: ' and ' },
        { text: 'open-source', color: 'green' },
        { text: '.' },
      ],
    ],
    where: [
      'Currently based in Argentina 📍',
      'Available for remote collaborations across the Americas 🌎, Europe 🇪🇺 and worldwide 🌐',
    ],
    hobbies: ['📚 Reading', '🎮 Gaming', '🥾 Hiking', '🎧 Music'],
    portraitAlt: 'Lucio Monsalbo',
  },
};
