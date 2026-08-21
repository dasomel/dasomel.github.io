import Link from 'next/link';
import { getDocs, getProjects } from '@/lib/content';

function catalog(lang: 'ko' | 'en') {
  const docs = getDocs(lang).filter((d) => d.slug.includes('/'));
  const names = [...new Set(docs.map((d) => d.slug.split('/')[0]))];
  const projects = getProjects(lang);
  return names.map((slug) => {
    const project = projects.find((p) => p.slug === slug);
    const pages = docs.filter((d) => d.slug.startsWith(`${slug}/`));
    return { slug, project, pages };
  });
}

export default function OssHubKo() {
  const items = catalog('ko');
  return (
    <div className="mx-auto max-w-7xl px-5 py-16">
      <section className="max-w-3xl mb-14">
        <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-cyan-300">Open Source Documentation Hub</p>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">오픈소스 프로젝트 문서</h1>
        <p className="mt-5 text-lg leading-8 text-slate-300">실제 개발·배포·운영 중인 OSS의 개념, 설치, 아키텍처, 운영, 보안, 트러블슈팅과 설계 결정을 프로젝트별로 독립된 문서 공간에서 제공합니다.</p>
      </section>
      <div className="grid gap-5 md:grid-cols-2">
        {items.map(({ slug, project, pages }) => (
          <Link key={slug} href={`/oss/${slug}/`} className="group rounded-2xl border border-white/10 bg-white/[0.04] p-7 transition hover:-translate-y-0.5 hover:border-cyan-300/40 hover:bg-white/[0.07]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold group-hover:text-cyan-200">{project?.title ?? slug}</h2>
                <p className="mt-3 text-sm leading-6 text-slate-400">{project?.description ?? 'Open source project documentation'}</p>
              </div>
              <span className="rounded-full border border-white/10 px-3 py-1 text-xs text-slate-400">{pages.length} pages</span>
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              {pages.slice(0, 6).map((page) => (
                <span key={page.slug} className="rounded-md bg-black/20 px-2.5 py-1 text-xs text-slate-300">{page.title}</span>
              ))}
            </div>
          </Link>
        ))}
      </div>
      <p className="mt-12 text-sm text-slate-500">새 OSS가 문서화되면 이 허브에 프로젝트 단위로 추가합니다.</p>
    </div>
  );
}
