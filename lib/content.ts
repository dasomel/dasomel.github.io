import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import type { Post, Seminar, Project, Doc, SeoulEventsData } from './types';

const contentDir = path.join(process.cwd(), 'src/content');

type FrontMatter = Record<string, unknown>;
type PostFrontMatter = FrontMatter & {
  title: string;
  description?: string;
  pubDate: string | Date;
  updatedDate?: string | Date;
  tags?: string[];
  projects?: string[];
  image?: string;
  draft?: boolean;
  featured?: boolean;
};
type SeminarFrontMatter = FrontMatter & {
  title: string;
  event: string;
  date: string | Date;
  location?: string;
  slides?: string;
  video?: string;
  tags?: string[];
  featured?: boolean;
};
type ProjectFrontMatter = FrontMatter & {
  title: string;
  description: string;
  github: string;
  tags?: string[];
  order?: number;
  type?: 'own' | 'fork';
  featured?: boolean;
  problem?: string;
  solution?: string;
};
type DocFrontMatter = FrontMatter & {
  title: string;
  description?: string;
  project?: string;
  order?: number;
  date?: string | Date;
  lastModified?: string | Date;
};

const fileListCache = new Map<string, string[]>();
const rawFileCache = new Map<string, string>();
const frontMatterCache = new Map<string, { data: FrontMatter; content: string }>();

function getFiles(collection: string): string[] {
  const cached = fileListCache.get(collection);
  if (cached) return cached;
  const dir = path.join(contentDir, collection);
  const files = fs.existsSync(dir)
    ? fs.readdirSync(dir).filter(f => f.endsWith('.md') || f.endsWith('.mdx'))
    : [];
  fileListCache.set(collection, files);
  return files;
}

function readParsedFile<T extends FrontMatter>(collection: string, filename: string): { data: T; content: string } | null {
  const cacheKey = `${collection}/${filename}`;
  const cached = frontMatterCache.get(cacheKey);
  if (cached) return cached as { data: T; content: string };
  const filePath = path.join(contentDir, collection, filename);
  if (!fs.existsSync(filePath)) return null;
  const raw = readRawFile(collection, filename);
  const parsed = matter(raw);
  const result = { data: parsed.data as T, content: parsed.content };
  frontMatterCache.set(cacheKey, result);
  return result;
}

function readRawFile(collection: string, filename: string): string {
  const cacheKey = `${collection}/${filename}`;
  const cached = rawFileCache.get(cacheKey);
  if (cached !== undefined) return cached;
  const filePath = path.join(contentDir, collection, filename);
  const raw = fs.readFileSync(filePath, 'utf-8');
  rawFileCache.set(cacheKey, raw);
  return raw;
}

function isEnglish(filename: string): boolean {
  return filename.replace(/\.(md|mdx)$/, '').endsWith('-en');
}

function getLang(filename: string): 'ko' | 'en' {
  return isEnglish(filename) ? 'en' : 'ko';
}

function getSlug(filename: string, lang: 'ko' | 'en'): string {
  const base = filename.replace(/\.(md|mdx)$/, '');
  return lang === 'en' ? base.replace(/-en$/, '') : base;
}

function isTechDigest(post: Post): boolean {
  return post.slug.startsWith('daily-digest-');
}

export function getPosts(lang: 'ko' | 'en' = 'ko'): Post[] {
  return getFiles('posts')
    .filter(f => getLang(f) === lang)
    .map(f => {
      const { data } = readParsedFile<PostFrontMatter>('posts', f)!;
      const slug = getSlug(f, lang);
      return {
        slug,
        title: data.title,
        description: data.description,
        pubDate: data.pubDate instanceof Date ? data.pubDate.toISOString() : String(data.pubDate),
        updatedDate: data.updatedDate ? (data.updatedDate instanceof Date ? data.updatedDate.toISOString() : String(data.updatedDate)) : undefined,
        tags: data.tags ?? [],
        projects: data.projects ?? [],
        image: data.image,
        draft: data.draft ?? false,
        featured: data.featured ?? false,
        lang,
      };
    })
    .filter(p => !p.draft)
    .sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());
}

export function getNotes(lang: 'ko' | 'en' = 'ko'): Post[] {
  return getPosts(lang).filter(post => !isTechDigest(post));
}

export function getTechDigests(lang: 'ko' | 'en' = 'ko'): Post[] {
  return getPosts(lang).filter(isTechDigest);
}

export function getPostBySlug(slug: string, lang: 'ko' | 'en' = 'ko'): { meta: Post; content: string } | null {
  const filename = lang === 'en' ? `${slug}-en.md` : `${slug}.md`;
  const parsed = readParsedFile<PostFrontMatter>('posts', filename);
  if (!parsed) return null;
  const { data, content } = parsed;
  return {
    meta: {
      slug,
      title: data.title,
      description: data.description,
      pubDate: data.pubDate instanceof Date ? data.pubDate.toISOString() : String(data.pubDate),
      updatedDate: data.updatedDate ? (data.updatedDate instanceof Date ? data.updatedDate.toISOString() : String(data.updatedDate)) : undefined,
      tags: data.tags ?? [],
      projects: data.projects ?? [],
      image: data.image,
      draft: data.draft ?? false,
      lang,
    },
    content,
  };
}

export function getSeminars(lang: 'ko' | 'en' = 'ko'): Seminar[] {
  return getFiles('seminars')
    .filter(f => getLang(f) === lang)
    .map(f => {
      const { data } = readParsedFile<SeminarFrontMatter>('seminars', f)!;
      const slug = getSlug(f, lang);
      return {
        slug,
        title: data.title,
        event: data.event,
        date: data.date instanceof Date ? data.date.toISOString() : String(data.date),
        location: data.location,
        slides: data.slides,
        video: data.video,
        tags: data.tags ?? [],
        featured: data.featured ?? false,
        lang,
      };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getSeminarBySlug(slug: string, lang: 'ko' | 'en' = 'ko'): { meta: Seminar; content: string } | null {
  const filename = lang === 'en' ? `${slug}-en.md` : `${slug}.md`;
  const parsed = readParsedFile<SeminarFrontMatter>('seminars', filename);
  if (!parsed) return null;
  const { data, content } = parsed;
  return {
    meta: {
      slug,
      title: data.title,
      event: data.event,
      date: data.date instanceof Date ? data.date.toISOString() : String(data.date),
      location: data.location,
      slides: data.slides,
      video: data.video,
      tags: data.tags ?? [],
      lang,
    },
    content,
  };
}

export function getProjects(lang: 'ko' | 'en' = 'ko'): Project[] {
  return getFiles('projects')
    .filter(f => getLang(f) === lang)
    .map(f => {
      const { data } = readParsedFile<ProjectFrontMatter>('projects', f)!;
      const slug = getSlug(f, lang);
      return {
        slug,
        title: data.title,
        description: data.description,
        github: data.github,
        tags: data.tags ?? [],
        order: data.order,
        type: data.type,
        featured: data.featured ?? false,
        problem: data.problem,
        solution: data.solution,
        lang,
      };
    })
    .sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
}

export function getProjectBySlug(slug: string, lang: 'ko' | 'en' = 'ko'): { meta: Project; content: string } | null {
  const filename = lang === 'en' ? `${slug}-en.md` : `${slug}.md`;
  const parsed = readParsedFile<ProjectFrontMatter>('projects', filename);
  if (!parsed) return null;
  const { data, content } = parsed;
  return {
    meta: {
      slug,
      title: data.title,
      description: data.description,
      github: data.github,
      tags: data.tags ?? [],
      order: data.order,
      type: data.type,
      featured: data.featured ?? false,
      problem: data.problem,
      solution: data.solution,
      lang,
    },
    content,
  };
}

export function getDocs(lang: 'ko' | 'en' = 'ko'): Doc[] {
  return getFiles('docs')
    .filter(f => getLang(f) === lang)
    .map(f => {
      const { data } = readParsedFile<DocFrontMatter>('docs', f)!;
      const slug = getSlug(f, lang);
      return {
        slug,
        title: data.title,
        description: data.description,
        project: data.project ?? 'General',
        order: data.order,
        date: data.date ? (data.date instanceof Date ? data.date.toISOString() : String(data.date)) : undefined,
        lastModified: data.lastModified ? (data.lastModified instanceof Date ? data.lastModified.toISOString() : String(data.lastModified)) : undefined,
        lang,
      };
    })
    .sort((a, b) => (a.order ?? 99) - (b.order ?? 99));
}

export function getDocBySlug(slug: string, lang: 'ko' | 'en' = 'ko'): { meta: Doc; content: string } | null {
  const filename = lang === 'en' ? `${slug}-en.md` : `${slug}.md`;
  const parsed = readParsedFile<DocFrontMatter>('docs', filename);
  if (!parsed) return null;
  const { data, content } = parsed;
  return {
    meta: {
      slug,
      title: data.title,
      description: data.description,
      project: data.project ?? 'General',
      order: data.order,
      date: data.date ? (data.date instanceof Date ? data.date.toISOString() : String(data.date)) : undefined,
      lastModified: data.lastModified ? (data.lastModified instanceof Date ? data.lastModified.toISOString() : String(data.lastModified)) : undefined,
      lang,
    },
    content,
  };
}

export function getSeoulEvents(): SeoulEventsData {
  const filePath = path.join(contentDir, 'events', 'data.json');
  if (!fs.existsSync(filePath)) return { updatedAt: '', events: [] };
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8')) as SeoulEventsData;
  } catch {
    return { updatedAt: '', events: [] };
  }
}
