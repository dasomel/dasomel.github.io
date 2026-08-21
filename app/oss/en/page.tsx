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
    <div className="mx-auto max-w-7xl px-5 py-16">
      <section className="max-w-3xl mb-14">
        <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-cyan-300">Open Source Documentation Hub</p>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Open Source Project Documentation</h1>
        <p className="mt-5 text-lg leading-8 text-slate-300">Independent documentation spaces for OSS projects covering concepts, installation, architecture, operations, security, troubleshooting, and engineering decisions.</p>
      </section>
      <div className="grid gap-5 md:grid-cols-2">
        {items.map(({ slug, project, pages }) => (
          <Link key={slug} href={`/oss/en/${slug}/`} className="group rounded-2xl border border-white/10 bg-white/[0.04] p-7 transition hover:-translate-y-0.5 hover:border-cyan-300/40 hover:bg-white/[0.07]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold group-hover:text-cyan-200">{project?.title ?? slug}</h2>
                <p className="mt-3 text-sm leading-6 text-slate-400">{project?.description ?? 'Open source project documentation'}</p>
              </div>
              <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-400">{pages.length} pages</span>
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              {pages.slice(0, 6).map((page) => <span key={page.slug} className="rounded-md bg-black/20 px-2.5 py-1 text-xs text-slate-300">{page.title}</span>)}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
