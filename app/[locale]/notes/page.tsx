import Link from 'next/link';
import { Rss, ArrowUpRight } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { getNotes } from '@/lib/content';
import { routing } from '@/i18n/routing';

export function generateStaticParams() {
  return routing.locales.map(locale => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'notes' });
  return { title: t('title'), description: t('subtitle') };
}

export default async function NotesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const lang = locale as 'ko' | 'en';
  const posts = getNotes(lang);
  const base = lang === 'en' ? '/en' : '/ko';
  const rss = lang === 'en' ? '/rss-en.xml' : '/rss.xml';
  const featured = posts[0];
  const rest = posts.slice(1);

  return (
    <main>
      <section className="border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="mx-auto max-w-[1440px] px-5 py-12 sm:px-8 sm:py-14 lg:px-16 lg:py-16">
          <div className="flex items-center justify-between gap-4">
            <div className="font-mono text-xs font-medium tracking-[0.12em]" style={{ color: 'var(--accent)' }}>ENGINEERING NOTES</div>
            <Link href={rss} className="inline-flex items-center gap-2 rounded-full border px-3 py-2 font-mono text-[10px]" style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}><Rss className="h-3.5 w-3.5" /> RSS</Link>
          </div>
          <h1 className="mt-4 max-w-5xl text-4xl font-semibold tracking-[-0.05em] sm:text-5xl" style={{ color: 'var(--text)' }}>
            {lang === 'en' ? 'Notes from the workbench.' : '작업하면서 배운 것을 기록합니다.'}
          </h1>
          <p className="mt-5 max-w-5xl text-base leading-7 sm:text-lg" style={{ color: 'var(--text-muted)' }}>
            Architecture decisions, OSS development, platform engineering, AI-assisted coding, operational lessons, and retrospectives.
          </p>
        </div>
      </section>

      {featured && (
        <section className="mx-auto max-w-[1440px] px-5 py-10 sm:px-8 lg:px-16">
          <div className="font-mono text-[11px] tracking-[0.1em]" style={{ color: 'var(--accent)' }}>FEATURED / RECENT</div>
          <Link href={`${base}/posts/${featured.slug}`} className="group mt-4 block rounded-2xl border p-5 sm:p-6" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}>
            <div className="font-mono text-[10px]" style={{ color: 'var(--text-faint)' }}>{featured.pubDate.slice(0, 10)} · {featured.tags.slice(0, 3).join(' · ')}</div>
            <h2 className="mt-2 text-xl font-semibold group-hover:text-[var(--accent)] sm:text-2xl" style={{ color: 'var(--text)' }}>{featured.title}</h2>
            {featured.description && <p className="mt-2 max-w-5xl text-sm leading-6" style={{ color: 'var(--text-muted)' }}>{featured.description}</p>}
          </Link>
        </section>
      )}

      <section className="border-y" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface-hi)' }}>
        <div className="mx-auto max-w-[1440px] px-5 py-10 sm:px-8 lg:px-16">
          <div className="font-mono text-[11px] tracking-[0.1em]" style={{ color: 'var(--accent)' }}>ALL NOTES</div>
          <div className="mt-4 space-y-3">
            {rest.map(post => (
              <Link key={post.slug} href={`${base}/posts/${post.slug}`} className="group flex items-start justify-between gap-4 rounded-2xl border p-5" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}>
                <div className="min-w-0">
                  <div className="font-mono text-[10px]" style={{ color: 'var(--text-faint)' }}>{post.pubDate.slice(0, 10)} · {post.tags.slice(0, 3).join(' · ')}</div>
                  <h2 className="mt-2 text-lg font-semibold group-hover:text-[var(--accent)]" style={{ color: 'var(--text)' }}>{post.title}</h2>
                  {post.description && <p className="mt-2 line-clamp-2 text-sm leading-6" style={{ color: 'var(--text-muted)' }}>{post.description}</p>}
                </div>
                <ArrowUpRight className="mt-1 h-4 w-4 shrink-0" style={{ color: 'var(--text-faint)' }} />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 py-8 sm:px-8 lg:px-16">
        <div className="font-mono text-[11px] tracking-[0.1em]" style={{ color: 'var(--accent)' }}>TOPICS</div>
        <p className="mt-2 text-sm leading-6" style={{ color: 'var(--text-muted)' }}>Kubernetes · Platform Engineering · Open Source · AI-assisted Development · Reliability · Design System</p>
      </section>
    </main>
  );
}
