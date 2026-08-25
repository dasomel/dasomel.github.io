import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { routing } from '@/i18n/routing';
import { getProjects } from '@/lib/content';

export function generateStaticParams() {
  return routing.locales.map(locale => ({ locale }));
}

const layers = [
  ['BASELINE', 'kube-ready-box · ldapium · nfs-quota-agent'],
  ['PLATFORM', 'Narwhal · Narwhal Portal'],
  ['DATA', 'Beluga · Beluga Manager'],
  ['AI / EDGE', 'KubeMetal'],
  ['STANDARDS', 'OpenForge'],
] as const;

const featured = [
  ['narwhal', 'INTEGRATION'],
  ['narwhal-portal', 'EXPERIENCE'],
  ['beluga', 'DATA'],
  ['kubemetal', 'AI / EDGE'],
  ['kube-ready-box', 'BASELINE'],
  ['ldapium', 'IDENTITY'],
  ['nfs-quota-agent', 'STORAGE'],
  ['openforge', 'STANDARDS'],
] as const;

const principles = [
  'Repository as source of truth',
  'Integration is a product feature',
  'Evidence-based completion',
  'Failure becomes durable knowledge',
  'Static where possible',
  'Bilingual parity',
] as const;

export default async function LocalizedOssPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const lang = routing.locales.includes(locale as 'ko' | 'en') ? (locale as 'ko' | 'en') : 'ko';
  const base = lang === 'en' ? '/en' : '/ko';
  const projects = getProjects(lang);

  const items = featured.map(([slug, label]) => {
    const project = projects.find(item => item.slug === slug);
    return project ? { project, label } : null;
  }).filter((item): item is { project: (typeof projects)[number]; label: string } => Boolean(item));

  return (
    <main>
      <section className="border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="mx-auto max-w-[1440px] px-5 py-12 sm:px-8 sm:py-16 lg:px-16 lg:py-20">
          <div className="font-mono text-xs font-medium tracking-[0.12em]" style={{ color: 'var(--accent)' }}>DASOMEL / OSS ECOSYSTEM</div>
          <h1 className="mt-5 max-w-5xl text-4xl font-semibold tracking-[-0.05em] sm:text-6xl lg:text-[3.5rem]" style={{ color: 'var(--text)' }}>
            {lang === 'en' ? 'Open source as one engineering system.' : '오픈소스를 하나의 엔지니어링 시스템으로.'}
          </h1>
          <p className="mt-6 max-w-5xl text-base leading-7 sm:text-lg sm:leading-8" style={{ color: 'var(--text-muted)' }}>
            Projects are connected by common principles: reproducibility, integration, evidence, documentation, and long-lived engineering knowledge.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 py-12 sm:px-8 sm:py-14 lg:px-16">
        <div className="font-mono text-[11px] tracking-[0.1em]" style={{ color: 'var(--accent)' }}>ECOSYSTEM / LAYERS</div>
        <h2 className="mt-3 text-2xl font-semibold sm:text-3xl" style={{ color: 'var(--text)' }}>Baseline → Platform → Data → AI → Experience</h2>
        <div className="mt-6 space-y-3">
          {layers.map(([label, value]) => (
            <div key={label} className="rounded-xl border px-4 py-3" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}>
              <div className="font-mono text-[10px] tracking-[0.08em]" style={{ color: 'var(--accent)' }}>{label}</div>
              <div className="mt-1 text-sm font-semibold" style={{ color: 'var(--text)' }}>{value}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface-hi)' }}>
        <div className="mx-auto max-w-[1440px] px-5 py-12 sm:px-8 sm:py-14 lg:px-16">
          <div className="font-mono text-[11px] tracking-[0.1em]" style={{ color: 'var(--accent)' }}>FEATURED OSS</div>
          <h2 className="mt-3 text-2xl font-semibold sm:text-3xl" style={{ color: 'var(--text)' }}>{lang === 'en' ? 'Core projects in the workbench' : '현재 Workbench의 핵심 프로젝트'}</h2>
          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            {items.map(({ project, label }) => (
              <Link key={project.slug} href={`${base}/projects/${project.slug}`} className="group rounded-2xl border p-5 transition-transform hover:-translate-y-1" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}>
                <div className="font-mono text-[10px] tracking-[0.08em]" style={{ color: 'var(--accent)' }}>{label}</div>
                <h3 className="mt-2 text-xl font-semibold group-hover:text-[var(--accent)]" style={{ color: 'var(--text)' }}>{project.title}</h3>
                <p className="mt-2 text-sm leading-6" style={{ color: 'var(--text-muted)' }}>{project.description || project.problem}</p>
                <div className="mt-4 inline-flex items-center gap-1 font-mono text-[10px] tracking-[0.08em]" style={{ color: 'var(--accent)' }}>VIEW PROJECT <ArrowUpRight className="h-3 w-3" /></div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 py-12 sm:px-8 sm:py-14 lg:px-16">
        <div className="font-mono text-[11px] tracking-[0.1em]" style={{ color: 'var(--accent)' }}>ENGINEERING PRINCIPLES</div>
        <div className="mt-5 divide-y" style={{ borderColor: 'var(--border)' }}>
          {principles.map((principle, index) => (
            <div key={principle} className="grid grid-cols-[32px_1fr] gap-3 py-3">
              <span className="font-mono text-[10px]" style={{ color: 'var(--text-faint)' }}>{String(index + 1).padStart(2, '0')}</span>
              <span className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{principle}</span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
