import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import type { Post, Seminar, Project, Doc, SeoulEventsData } from './types';

const contentDir = path.join(process.cwd(), 'src/content');

function getFiles(collection: string): string[] {
  const dir = path.join(contentDir, collection);
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter(f => f.endsWith('.md') || f.endsWith('.mdx'));
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

export function getPosts(lang: 'ko' | 'en' = 'ko'): Post[] {
  return getFiles('posts')
    .filter(f => getLang(f) === lang)
    .map(f => {
      const raw = fs.readFileSync(path.join(contentDir, 'posts', f), 'utf-8');
      const { data } = matter(raw);
      const slug = getSlug(f, lang);
      return {
        slug,
        title: data.title,
        description: data.description,
        pubDate: data.pubDate instanceof Date ? data.pubDate.toISOString() : String(data.pubDate),
        updatedDate: data.updatedDate ? (data.updatedDate instanceof Date ? data.updatedDate.toISOString() : String(data.updatedDate)) : undefined,
        tags: data.tags ?? [],
        image: data.image,
        draft: data.draft ?? false,
        featured: data.featured ?? false,
        lang,
      };
    })
    .filter(p => !p.draft)
    .sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());
}

export function getPostBySlug(slug: string, lang: 'ko' | 'en' = 'ko'): { meta: Post; content: string } | null {
  const filename = lang === 'en' ? `${slug}-en.md` : `${slug}.md`;
  const filePath = path.join(contentDir, 'posts', filename);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(raw);
  return {
    meta: {
      slug,
      title: data.title,
      description: data.description,
      pubDate: data.pubDate instanceof Date ? data.pubDate.toISOString() : String(data.pubDate),
      updatedDate: data.updatedDate ? (data.updatedDate instanceof Date ? data.updatedDate.toISOString() : String(data.updatedDate)) : undefined,
      tags: data.tags ?? [],
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
      const raw = fs.readFileSync(path.join(contentDir, 'seminars', f), 'utf-8');
      const { data } = matter(raw);
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
  const filePath = path.join(contentDir, 'seminars', filename);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(raw);
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
      const raw = fs.readFileSync(path.join(contentDir, 'projects', f), 'utf-8');
      const { data } = matter(raw);
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
  const filePath = path.join(contentDir, 'projects', filename);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(raw);
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
      const raw = fs.readFileSync(path.join(contentDir, 'docs', f), 'utf-8');
      const { data } = matter(raw);
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
  const filePath = path.join(contentDir, 'docs', filename);
  if (!fs.existsSync(filePath)) return null;
  const raw = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(raw);
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
