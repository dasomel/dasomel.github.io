import { defineCollection, z } from 'astro:content';

const docsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    order: z.number().optional(),
    date: z.coerce.date().optional(),
    lastModified: z.coerce.date().optional(),
  }),
});

const postsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    image: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

const seminarsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    event: z.string(),
    date: z.coerce.date(),
    location: z.string().optional(),
    slides: z.string().optional(),
    video: z.string().optional(),
    tags: z.array(z.string()).default([]),
  }),
});

const projectsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    github: z.string(),
    tags: z.array(z.string()).default([]),
    order: z.number().optional(),
    type: z.enum(['own', 'contributing']).optional(),
  }),
});

export const collections = {
  docs: docsCollection,
  posts: postsCollection,
  seminars: seminarsCollection,
  projects: projectsCollection,
};
