import Link from 'next/link';
import { Rss, ArrowUpRight } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { getTechDigests } from '@/lib/content';
import { routing } from '@/i18n/routing';

export function generateStaticParams() {
  return routing.locales.map(locale => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'tech_digest' });
  return { title: t('title'), description: t('subtitle') };
}

const pipeline = [
  'RSS collection',
  'Korean + English digest generation',
  'AI enrichment / validation',
  'Draft PR',
  'Fallback publication when needed',
  'GitHub Pages deployment',
] as const;

const guardrails = [
  'Duplicate-publication guards',
  'Fallback handling',
  'Enrichment validation',
  'Explicit separation from original Notes',
  'Bilingual generation',
] as const;

export default async function TechDigestPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const lang = locale as 'ko' | 'en';
  const posts = getTechDigests(lang);
  const base = lang === 'en' ? '/en' : '/ko';
  const rss = lang === 'en' ? '/tech-digest-en.xml' : '/tech-digest.xml';

  return (
    <main>
      <section className="border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="mx-auto max-w-[1440px] px-5 py-12 sm:px-8 sm:py-14 lg:px-16 lg:py-16">
          <div className="flex items-center justify-between gap-4">
            <div className="font-mono text-xs font-medium tracking-[0.12em]" style={{ color: 'var(--signal)' }}>TECH SIGNAL / AUTOMATED</div>
            <Link href={rss} className="inline-flex items-center gap-2 rounded-full border px-3 py-2 font-mono text-[10px]" style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}><Rss className="h-3.5 w-3.5" /> RSS</Link>
          </div>
          <h1 className="mt-4 max-w-5xl text-4xl font-semibold tracking-[-0.05em] sm:text-5xl" style={{ color: 'var(--text)' }}>
            {lang === 'en' ? 'Keep only the signals worth reading.' : '읽을 가치가 있는 신호만 남깁니다.'}
          </h1>
          <p className="mt-5 max-w-5xl text-base leading-7 sm:text-lg" style={{ color: 'var(--text-muted)' }}>
            {lang === 'en'
              ? 'Daily Tech Digest is an automated content lane separated from original Notes. RSS collection → bilingual generation → AI enrichment / validation → Draft PR → fallback publication.'
              : 'Daily Tech Digest는 original Notes와 분리된 자동화 콘텐츠 lane입니다. RSS 수집 → bilingual 생성 → AI enrichment / validation → Draft PR → fallback publication 흐름으로 운영됩니다.'}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 py-10 sm:px-8 lg:px-16">
        <div className="font-mono text-[11px] tracking-[0.1em]" style={{ color: 'var(--signal)' }}>PUBLICATION PIPELINE</div>
        <div className="mt-4 divide-y" style={{ borderColor: 'var(--border)' }}>
          {pipeline.map((step, index) => (
            <div key={step} className="grid grid-cols-[32px_1fr] gap-3 py-3">
              <span className="font-mono text-[10px]" style={{ color: 'var(--text-faint)' }}>{String(index + 1).padStart(2, '0')}</span>
              <span className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{step}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface-hi)' }}>
        <div className="mx-auto max-w-[1440px] px-5 py-10 sm:px-8 lg:px-16">
          <div className="font-mono text-[11px] tracking-[0.1em]" style={{ color: 'var(--signal)' }}>ARCHIVE / LATEST</div>
          <div className="mt-4 space-y-3">
            {posts.map(post => (
              <Link key={post.slug} href={`${base}/posts/${post.slug}`} className="group flex items-start justify-between gap-4 rounded-2xl border p-5" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}>
                <div className="min-w-0">
                  <div className="font-mono text-[10px]" style={{ color: 'var(--text-faint)' }}>{post.pubDate.slice(0, 10)} · {post.tags.slice(0, 3).join(' · ')}</div>
                  <h2 className="mt-2 text-lg font-semibold group-hover:text-[var(--signal)]" style={{ color: 'var(--text)' }}>{post.title}</h2>
                  {post.description && <p className="mt-2 line-clamp-2 text-sm leading-6" style={{ color: 'var(--text-muted)' }}>{post.description}</p>}
                </div>
                <ArrowUpRight className="mt-1 h-4 w-4 shrink-0" style={{ color: 'var(--text-faint)' }} />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 py-8 sm:px-8 lg:px-16">
        <div className="font-mono text-[11px] tracking-[0.1em]" style={{ color: 'var(--signal)' }}>QUALITY GUARDRAILS</div>
        <ul className="mt-3 grid gap-2 text-sm sm:grid-cols-2" style={{ color: 'var(--text-muted)' }}>
          {guardrails.map(item => <li key={item}>• {item}</li>)}
        </ul>
      </section>
    </main>
  );
}
