export interface Post {
  slug: string;
  title: string;
  description?: string;
  pubDate: string;
  updatedDate?: string;
  tags: string[];
  image?: string;
  draft: boolean;
  lang: 'ko' | 'en';
  featured?: boolean;
}

export interface Seminar {
  slug: string;
  title: string;
  event: string;
  date: string;
  location?: string;
  slides?: string;
  video?: string;
  tags: string[];
  lang: 'ko' | 'en';
  featured?: boolean;
}

export interface Project {
  slug: string;
  title: string;
  description: string;
  github: string;
  tags: string[];
  order?: number;
  type?: 'own' | 'fork';
  lang: 'ko' | 'en';
  featured?: boolean;
  problem?: string;
  solution?: string;
}

export interface Doc {
  slug: string;
  title: string;
  description?: string;
  order?: number;
  date?: string;
  lastModified?: string;
  lang: 'ko' | 'en';
}
