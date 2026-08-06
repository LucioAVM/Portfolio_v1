import type { Locale } from '../i18n/config';
import { socialLinks } from './links';

/**
 * Contenido de la sección About (home). Bilingüe y estructurado en tokens para
 * aplicar "syntax highlighting" dentro de las ventanas estilo editor.
 *
 * `aboutMe` = JSON gracioso (chistes de código, ciber e impresión 3D). Sin `$ref`.
 *
 * NOTA: `hobbies` son placeholders neutrales; reemplazar por los reales de Lucio.
 */

export type TokenColor = 'green' | 'cyan' | 'amber' | 'purple' | 'red';

export interface Token {
  text: string;
  color?: TokenColor;
  /** Si está, el token se renderiza como link. */
  href?: string;
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
  aboutMe: 'about-me.json',
  portrait: 'portrait',
  where: 'where-i-work',
  hobbies: 'hobbies',
  meOnline: 'me-online',
} as const;

const punct = (text: string): Token => ({ text });
const key = (text: string): Token => ({ text: `"${text}"`, color: 'cyan' });
const str = (text: string): Token => ({ text: `"${text}"`, color: 'green' });
const bool = (v: boolean): Token => ({ text: String(v), color: 'purple' });
const num = (v: number | string): Token => ({ text: String(v), color: 'amber' });
const nil = (): Token => ({ text: 'null', color: 'purple' });
const comment = (text: string): Token => ({ text, color: 'amber' });

/** JSON de chistes — sin links ni `$ref`. */
function aboutMeJson(locale: Locale): Token[][] {
  if (locale === 'es') {
    return [
      [punct('{')],
      [punct('  '), key('name'), punct(': '), str('Lucio Monsalbo'), punct(',')],
      [punct('  '), key('role'), punct(': '), str('solucionador de quilombos (con teclado)'), punct(',')],
      [punct('  '), key('works'), punct(': '), bool(true), comment(' // en mi máquina'), punct(',')],
      [punct('  '), key('bugs'), punct(': '), str('features no documentadas'), punct(',')],
      [punct('  '), key('stack'), punct(': {')],
      [
        punct('    '),
        key('dev'),
        punct(': '),
        str('hello world → hello production'),
        punct(','),
      ],
      [
        punct('    '),
        key('cyber'),
        punct(': '),
        str('sudo make me a sandwich'),
        punct(','),
      ],
      [
        punct('    '),
        key('print3d'),
        punct(': '),
        str('benchy o spaghetti, no hay punto medio'),
      ],
      [punct('  },')],
      [punct('  '), key('debugging'), punct(': {')],
      [punct('    '), key('step_1'), punct(': '), str('¿está enchufado?'), punct(',')],
      [punct('    '), key('step_2'), punct(': '), str('reiniciar'), punct(',')],
      [punct('    '), key('step_3'), punct(': '), str('Culpar a DNS'), punct(',')],
      [punct('    '), key('step_4'), punct(': '), str('funciona, no tocar')],
      [punct('  },')],
      [punct('  '), key('security'), punct(': {')],
      [
        punct('    '),
        key('admin'),
        punct(': '),
        bool(true),
        comment(' // confiá en mí bro'),
        punct(','),
      ],
      [
        punct('    '),
        key('sql'),
        punct(': '),
        str("'; DROP TABLE problemas;--"),
        punct(','),
      ],
      [
        punct('    '),
        key('firewall'),
        punct(': '),
        str('prendido (excepto cuando me bloquea a mí)'),
        punct(','),
      ],
      [
        punct('    '),
        key('flag'),
        punct(': '),
        str('HTB{casi_legit_esta_vez}'),
      ],
      [punct('  },')],
      [punct('  '), key('printer'), punct(': {')],
      [punct('    '), key('first_layer'), punct(': '), str('ansiedad'), punct(',')],
      [punct('    '), key('bed_level'), punct(': '), str('mentira consensuada'), punct(',')],
      [punct('    '), key('failed_prints'), punct(': '), num(99), punct(',')],
      [punct('    '), key('successful_prints'), punct(': '), num(1), comment(' // el benchy')],
      [punct('  },')],
      [punct('  '), key('todo'), punct(': [')],
      [punct('    '), str('arreglar esto después'), punct(',')],
      [punct('    '), str('borrar este TODO'), punct(',')],
      [punct('    '), str('dormir (deprecated)')],
      [punct('  ],')],
      [punct('  '), key('coca_level'), punct(': '), num('NaN'), comment(' // coca.exe missing'), punct(',')],
      [punct('  '), key('sleep'), punct(': '), nil(), punct(',')],
      [
        punct('  '),
        key('motto'),
        punct(': '),
        str('si compila, shippeamos. si no, también.'),
      ],
      [punct('}')],
    ];
  }

  return [
    [punct('{')],
    [punct('  '), key('name'), punct(': '), str('Lucio Monsalbo'), punct(',')],
    [punct('  '), key('role'), punct(': '), str('professional mess → solution pipeline'), punct(',')],
    [punct('  '), key('works'), punct(': '), bool(true), comment(' // on my machine'), punct(',')],
    [punct('  '), key('bugs'), punct(': '), str('undocumented features'), punct(',')],
    [punct('  '), key('stack'), punct(': {')],
    [
      punct('    '),
      key('dev'),
      punct(': '),
      str('hello world → hello production'),
      punct(','),
    ],
    [
      punct('    '),
      key('cyber'),
      punct(': '),
      str('sudo make me a sandwich'),
      punct(','),
    ],
    [
      punct('    '),
      key('print3d'),
      punct(': '),
      str('benchy or spaghetti — no in-between'),
    ],
    [punct('  },')],
    [punct('  '), key('debugging'), punct(': {')],
    [punct('    '), key('step_1'), punct(': '), str('is it plugged in?'), punct(',')],
    [punct('    '), key('step_2'), punct(': '), str('reboot'), punct(',')],
    [punct('    '), key('step_3'), punct(': '), str('blame DNS'), punct(',')],
    [punct('    '), key('step_4'), punct(': '), str("it works, don't touch")],
    [punct('  },')],
    [punct('  '), key('security'), punct(': {')],
    [
      punct('    '),
      key('admin'),
      punct(': '),
      bool(true),
      comment(' // trust me bro'),
      punct(','),
    ],
    [
      punct('    '),
      key('sql'),
      punct(': '),
      str("'; DROP TABLE problems;--"),
      punct(','),
    ],
    [
      punct('    '),
      key('firewall'),
      punct(': '),
      str('on (except when it blocks me)'),
      punct(','),
    ],
    [
      punct('    '),
      key('flag'),
      punct(': '),
      str('HTB{almost_legit_this_time}'),
    ],
    [punct('  },')],
    [punct('  '), key('printer'), punct(': {')],
    [punct('    '), key('first_layer'), punct(': '), str('anxiety'), punct(',')],
    [punct('    '), key('bed_level'), punct(': '), str('consensual lie'), punct(',')],
    [punct('    '), key('failed_prints'), punct(': '), num(99), punct(',')],
    [punct('    '), key('successful_prints'), punct(': '), num(1), comment(' // the benchy')],
    [punct('  },')],
    [punct('  '), key('todo'), punct(': [')],
    [punct('    '), str('fix this later'), punct(',')],
    [punct('    '), str('delete this TODO'), punct(',')],
    [punct('    '), str('sleep (deprecated)')],
    [punct('  ],')],
    [punct('  '), key('coca_level'), punct(': '), num('NaN'), comment(' // coca.exe missing'), punct(',')],
    [punct('  '), key('sleep'), punct(': '), nil(), punct(',')],
    [
      punct('  '),
      key('motto'),
      punct(': '),
      str("if it compiles, we ship. if it doesn't, we ship anyway."),
    ],
    [punct('}')],
  ];
}

export const aboutContent: Record<Locale, AboutContent> = {
  es: {
    heading: [
      { text: 'De problemas a' },
      { text: 'soluciones', color: 'green' },
      { text: 'que funcionan' },
    ],
    aboutMe: aboutMeJson('es'),
    where: [
      'Hecho en Argentina 📍',
      'Disponible para colaboraciones remotas en América 🌎, Europa 🇪🇺 y todo el mundo 🌐',
    ],
    hobbies: ['📚 Lectura', '🎮 Gaming', '🥾 Senderismo', '🎧 Música'],
    portraitAlt: 'Lucio Monsalbo',
  },
  en: {
    heading: [
      { text: 'From problems to' },
      { text: 'solutions', color: 'green' },
      { text: 'that work' },
    ],
    aboutMe: aboutMeJson('en'),
    where: [
      'Made in Argentina 📍',
      'Available for remote collaborations across the Americas 🌎, Europe 🇪🇺 and worldwide 🌐',
    ],
    hobbies: ['📚 Reading', '🎮 Gaming', '🥾 Hiking', '🎧 Music'],
    portraitAlt: 'Lucio Monsalbo',
  },
};
