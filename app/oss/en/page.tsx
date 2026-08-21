import Link from 'next/link';
import { getDocs, getProjects } from '@/lib/content';

function catalog(lang: 'ko' | 'en') {
  const docs = getDocs(lang).filter((d) => d.slug.includes('/'));
  const names = [...new Set(docs.map((d) => d.slug.split('/')[0]))];
  const projects = getProjects(lang);
  return names.map((slug) => ({ slug, project: projects.find((p) => p.slug === slug), pages: docs.filter((d) => d.slug.startsWith(`${slug}/`)) }));
}

export default function OssHubEn() {
  const items = catalog('en');
  return (
    <div className="mx-auto max-w-[1180px] px-5 py-14 sm:px-7 lg:py-20" style={{ color: 'var(--text)' }}>
      <section className="max-w-4xl">
        <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.16em]" style={{ color: 'var(--accent)' }}><span className="h-px w-8" style={{ backgroundColor: 'var(--accent)' }} /> OSS Documentation</div>
        <h1 className="mt-5 text-4xl font-semibold tracking-[-0.03em] sm:text-5xl" style={{ color: 'var(--text)' }}>Open Source Project Documentation</h1>
        <p className="mt-5 max-w-3xl text-lg leading-8" style={{ color: 'var(--text-muted)' }}>Independent documentation spaces for OSS projects covering concepts, installation, architecture, operations, security, troubleshooting, and engineering decisions.</p>
      </section>
      <section className="mt-14 grid gap-5 md:grid-cols-2">
        {items.map(({ slug, project, pages }) => (
          <Link key={slug} href={`/oss/en/${slug}/`} className="group rounded-2xl p-7 transition duration-200" style={{ border: '1px solid var(--border)', backgroundColor: 'var(--surface)' }}>
            <div className="flex items-start justify-between gap-6"><div className="min-w-0"><div className="text-[10px] font-semibold uppercase tracking-[0.16em]" style={{ color: 'var(--text-faint)' }}>Open Source Project</div><h2 className="mt-2 text-2xl font-semibold tracking-tight" style={{ color: 'var(--text)' }}>{project?.title ?? slug}</h2><p className="mt-3 text-sm leading-6" style={{ color: 'var(--text-muted)' }}>{project?.description ?? 'Open source project documentation'}</p></div><span className="shrink-0 rounded-full px-3 py-1.5 text-[11px] font-medium" style={{ border: '1px solid var(--border)', backgroundColor: 'var(--surface-hi)', color: 'var(--text-faint)' }}>{pages.length} pages</span></div>
            <div className="mt-7 flex flex-wrap gap-2">{pages.slice(0, 7).map((page) => <span key={page.slug} className="rounded-md px-2.5 py-1.5 text-[11px]" style={{ backgroundColor: 'var(--surface-hi)', color: 'var(--text-muted)' }}>{page.title}</span>)}</div>
            <div className="mt-7 text-sm font-medium" style={{ color: 'var(--accent)' }}>View documentation →</div>
          </Link>
        ))}
      </section>
      <p className="mt-10 text-xs" style={{ color: 'var(--text-faint)' }}>New OSS projects are added as independent documentation spaces in this hub.</p>
    </div>
  );
}
