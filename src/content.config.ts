import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { PROJECT_TAGS } from './data/project-tags';

const httpsUrl = z
  .string()
  .url()
  .refine((url) => url.startsWith('https://'), {
    message: 'URLs must use HTTPS',
  });

const slugSchema = z
  .string()
  .regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens');

const projectLinksSchema = z
  .object({
    github: httpsUrl.optional(),
    demo: httpsUrl.optional(),
    download: httpsUrl.optional(),
    video: httpsUrl.optional(),
  })
  .optional();

/** @see docs/modelo-contenido.md */
const projectTagSchema = z.enum(PROJECT_TAGS);

const mediaSchema = z
  .object({
    cover: z.string().optional(),
    screenshots: z.array(z.string()).optional(),
    gallery: z.array(z.string()).optional(),
  })
  .optional();

const projectSchema = z.object({
  title: z.string().min(1),
  summary: z.string().min(1),
  description: z.string().optional(),
  slug: slugSchema,
  category: z.enum(['dev', 'ciberseguridad', 'impresion3d']),
  tags: z.array(projectTagSchema).default([]),
  media: mediaSchema,
  tech: z.array(z.string()).default([]),
  links: projectLinksSchema,
  featured: z.boolean().default(false),
  order: z.number().optional(),
  date: z.coerce.date(),
  draft: z.boolean().default(false),
  monolingual: z.boolean().default(false),
});

const minimiQuoteSchema = z.object({
  text: z.string().min(1),
  context: z.enum(['general', 'ciber', 'dev', '3d']).default('general'),
  order: z.number().optional(),
});

const projects = defineCollection({
  loader: glob({
    pattern: '**/*.{md,mdx}',
    base: './src/content/projects',
    generateId: ({ entry }) => entry.replace(/\.(md|mdx)$/, '').replace(/\\/g, '/'),
  }),
  schema: projectSchema,
});

const minimiQuotes = defineCollection({
  loader: glob({
    pattern: '**/*.{md,mdx}',
    base: './src/content/minimi-quotes',
    generateId: ({ entry }) => entry.replace(/\.(md|mdx)$/, '').replace(/\\/g, '/'),
  }),
  schema: minimiQuoteSchema,
});

export const collections = { projects, minimiQuotes };
