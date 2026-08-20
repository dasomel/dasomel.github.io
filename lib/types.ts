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

export interface ProjectRepositoryMeta {
  repo: string;
  htmlUrl: string;
  description?: string;
  stars: number;
  forks: number;
  openIssues: number;
  language?: string;
  license?: string;
  pushedAt?: string;
  latestRelease?: {
    tag: string;
    name?: string;
    publishedAt?: string;
    url: string;
  };
  latestTag?: {
    name: string;
    commitSha?: string;
    url?: string;
  };
}

export interface Project {
  slug: string;
  title: string;
  description: string;
  github: string;
  tags: string[];
  order?: number;
  type?: 'own' | 'fork';
  status?: 'active' | 'maintained' | 'experimental' | 'archived';
  repoMeta?: ProjectRepositoryMeta;
  lang: 'ko' | 'en';
  featured?: boolean;
  problem?: string;
  solution?: string;
}

export interface Doc {
  slug: string;
  title: string;
  description?: string;
  project: string;
  order?: number;
  date?: string;
  lastModified?: string;
  lang: 'ko' | 'en';
}

export interface SeoulEvent {
  id: string;
  title: string;
  category: string;
  place: string;
  guName: string;
  startDate: string;
  endDate: string;
  dateRange: string;
  isFree: boolean;
  link: string;
  imageUrl: string;
  organizer: string;
  thema: string;
}

export interface SeoulEventsData {
  updatedAt: string;
  events: SeoulEvent[];
}
