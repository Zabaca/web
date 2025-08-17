import { defineCollection, z } from 'astro:content';

const press = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    publishedAt: z.coerce.date(),
    description: z.string(),
    category: z.enum(['Product Launch', 'Partnership', 'Funding', 'Industry Report']),
    featured: z.boolean().optional(),
    icon: z.object({
      type: z.enum(['dollar', 'layers', 'chart', 'rocket', 'brain', 'meeting']),
      gradient: z.string()
    }).optional(),
  })
});

export const collections = {
  press
};