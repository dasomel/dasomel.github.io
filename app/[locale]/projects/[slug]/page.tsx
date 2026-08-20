import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getProjects, getProjectBySlug } from '@/lib/content';
import { MDXContent } from '@/components/MDXContent';
import { routing } from '@/i18n/routing';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Github, GitFork, ArrowUpRight } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

export function generateStaticParams() {
  const params: { locale: string; slug: string }[] = [];
  routing.locales.forEach(locale => {
    getProjects(locale as 'ko' | 'en').forEach(p => params.push({ locale, slug: p.slug }));
  });
  return params;
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const lang = locale as 'ko' | 'en';
  const result = getProjectBySlug(slug, lang);
  if (!result) return {};
  const { meta } = result;
  const url = `https://cne.io.kr/${lang}/projects/${slug}`;
  const image = `/images/projects/${['narwhal', 'beluga', 'kubemetal', 'kube-ready-box', 'ldapium', 'nfs-quota-agent', 'egovframe-launcher'].includes(slug) ? slug : 'default'}.svg`;
  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical: url },
    openGraph: { type: 'article', url, title: meta.title, description: meta.description, images: [{ url: image, alt: `${meta.title} project visual` }] },
    twitter: { card: 'summary_large_image', title: meta.title, description: meta.description, images: [image] },
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const lang = locale as 'ko' | 'en';
  const result = getProjectBySlug(slug, lang);
  if (!result) notFound();
  const { meta, content } = result;
  const tc = await getTranslations({ locale, namespace: 'common' });
  const base = lang === 'en' ? '/en' : '/ko';
  const visualProjects = new Set(['narwhal', 'beluga', 'kubemetal', 'kube-ready-box', 'ldapium', 'nfs-quota-agent', 'egovframe-launcher']);
  const image = `/images/projects/${visualProjects.has(slug) ? slug : 'default'}.svg`;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      <Link href={`${base}/projects`} className="inline-flex items-center gap-2 text-sm mb-8 transition-colors" style={{ color: 'var(--text-muted)' }}>
        <ArrowLeft className="w-4 h-4" aria-hidden="true" />{tc('back')}
      </Link>
      <header className="mb-10">
        <div className="overflow-hidden rounded-2xl mb-7" style={{ border: '1px solid var(--border)', backgroundColor: 'var(--surface)' }}><img src={image} alt="" aria-hidden="true" className="block w-full h-auto" loading="eager" /></div>
        <div className="flex flex-wrap items-center gap-2 mb-3">
          {meta.type === 'fork' && <span className="inline-flex items-center gap-1 text-xs font-mono px-2 py-1 rounded-full" style={{ backgroundColor: 'var(--surface)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}><GitFork className="w-3 h-3" aria-hidden="true" />Fork</span>}
          {meta.featured && <span className="text-xs font-mono px-2 py-1 rounded-full" style={{ backgroundColor: 'var(--accent-dim)', color: 'var(--accent)', border: '1px solid var(--accent)' }}>Active</span>}
        </div>
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight mb-4" style={{ color: 'var(--text)' }}>{meta.title}</h1>
        <p className="text-base sm:text-lg max-w-3xl leading-relaxed mb-5" style={{ color: 'var(--text-muted)' }}>{meta.description}</p>
        <div className="flex items-center gap-3 flex-wrap">
          {meta.github && <Button asChild size="sm"><a href={meta.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2"><Github className="w-4 h-4" aria-hidden="true" />{tc('github')}<ArrowUpRight className="w-3 h-3" aria-hidden="true" /></a></Button>}
          {meta.tags.map(tag => <Badge key={tag}>{tag}</Badge>)}
        </div>
      </header>
      {(meta.problem || meta.solution) && <section className="grid md:grid-cols-2 gap-3 mb-10" aria-label="Project summary">
        {meta.problem && <div className="rounded-2xl p-5" style={{ border: '1px solid var(--border)', backgroundColor: 'var(--surface)' }}><div className="text-xs font-mono uppercase tracking-wider mb-2" style={{ color: 'var(--text-faint)' }}>Problem</div><p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{meta.problem}</p></div>}
        {meta.solution && <div className="rounded-2xl p-5" style={{ border: '1px solid var(--accent-glow)', backgroundColor: 'var(--accent-dim)' }}><div className="text-xs font-mono uppercase tracking-wider mb-2" style={{ color: 'var(--accent)' }}>Response</div><p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{meta.solution}</p></div>}
      </section>}
      <article className="prose prose-lg prose-gray max-w-none prose-headings:font-bold prose-a:text-emerald-600"><MDXContent source={content} /></article>
    </div>
  );
}
