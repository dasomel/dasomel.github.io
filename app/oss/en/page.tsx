import Link from 'next/link';
import { getDocs, getProjects } from '@/lib/content';

function catalog(lang: 'ko' | 'en') {
  const docs = getDocs(lang).filter((d) => d.slug.includes('/'));
  const names = [...new Set(docs.map((d) => d.slug.split('/')[0]))];
  const projects = getProjects(lang);
  return names.map((slug) => ({
    slug,
    project: projects.find((p) => p.slug === slug),
    pages: docs.filter((d) => d.slug.startsWith(`${slug}/`)),
  }));
}

export default function OssHubEn() {
  const items = catalog('en');
  return (
    <div className="mx-auto max-w-[1180px] px-5 py-14 sm:px-7 lg:py-20">
      <section className="max-w-4xl">
        <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.16em] text-[#6d8f93]">
          <span className="h-px w-8 bg-[#6d8f93]" /> OSS Documentation
        </div>
        <h1 className="mt-5 text-4xl font-semibold tracking-[-0.03em] text-[#171717] sm:text-5xl">Open Source Project Documentation</h1>
        <p className="mt-5 max-w-3xl text-lg leading-8 text-[#66665f]">Independent documentation spaces for OSS projects covering concepts, installation, architecture, operations, security, troubleshooting, and engineering decisions.</p>
      </section>

      <section className="mt-14 grid gap-5 md:grid-cols-2">
        {items.map(({ slug, project, pages }) => (
          <Link key={slug} href={`/oss/en/${slug}/`} className="group rounded-2xl border border-[#deded8] bg-white p-7 transition duration-200 hover:-translate-y-0.5 hover:border-[#b8c9cb] hover:shadow-[0_10px_30px_rgba(23,23,23,0.06)]">
            <div className="flex items-start justify-between gap-6">
              <div className="min-w-0">
                <div className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#999990]">Open Source Project</div>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[#171717] group-hover:text-[#4d7378]">{project?.title ?? slug}</h2>
                <p className="mt-3 text-sm leading-6 text-[#686861]">{project?.description ?? 'Open source project documentation'}</p>
              </div>
              <span className="shrink-0 rounded-full border border-[#dfdfd9] bg-[#f7f7f4] px-3 py-1.5 text-[11px] font-medium text-[#77776f]">{pages.length} pages</span>
            </div>
            <div className="mt-7 flex flex-wrap gap-2">
              {pages.slice(0, 7).map((page) => <span key={page.slug} className="rounded-md bg-[#f2f2ee] px-2.5 py-1.5 text-[11px] text-[#65655e]">{page.title}</span>)}
            </div>
            <div className="mt-7 text-sm font-medium text-[#4d7378]">View documentation →</div>
          </Link>
        ))}
      </section>
      <p className="mt-10 text-xs text-[#999990]">New OSS projects are added as independent documentation spaces in this hub.</p>
    </div>
  );
}
