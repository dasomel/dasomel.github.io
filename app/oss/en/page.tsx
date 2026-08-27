import Link from 'next/link';
import { getProjects, getDocs } from '@/lib/content';
import { OSS_PORTFOLIO_GROUPS } from '@/lib/oss';

const groups = OSS_PORTFOLIO_GROUPS;

export default function OssHubEn() {
  const projects = getProjects('en');
  const docs = getDocs('en');
  const bySlug = new Map(projects.map((project) => [project.slug, project]));
  const docsByProject = new Map<string, number>();

  for (const doc of docs) {
    const root = doc.slug.split('/')[0];
    docsByProject.set(root, (docsByProject.get(root) ?? 0) + 1);
  }

  const allSlugs = groups.flatMap((group) => group.projects);
  const portfolio = allSlugs.map((slug) => bySlug.get(slug)).filter(Boolean);

  return (
    <div className="mx-auto max-w-[1180px] px-5 py-14 sm:px-7 lg:py-20" style={{ color: 'var(--text)' }}>
      <section className="max-w-5xl">
        <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.16em]" style={{ color: 'var(--accent)' }}><span className="h-px w-8" style={{ backgroundColor: 'var(--accent)' }} /> OSS Portfolio</div>
        <h1 className="mt-5 text-4xl font-semibold tracking-[-0.035em] sm:text-6xl">Open Source Projects</h1>
        <p className="mt-5 max-w-4xl text-lg leading-8" style={{ color: 'var(--text-muted)' }}>This is not just a project list. It documents how real Kubernetes platforms, storage infrastructure, data platforms, and local AI environments were designed, verified, and operated as a connected OSS portfolio.</p>
      </section>

      <section className="mt-8 rounded-3xl p-7 sm:p-9" style={{ border: '1px solid var(--accent)', backgroundColor: 'var(--surface)' }}>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-3xl"><div className="text-xs font-semibold uppercase tracking-[0.16em]" style={{ color: 'var(--accent)' }}>Start here</div><h2 className="mt-2 text-2xl font-semibold sm:text-3xl">Why were these OSS projects built?</h2><p className="mt-3 text-sm leading-7 sm:text-base" style={{ color: 'var(--text-muted)' }}>From real platform problems to reproducible implementation, verification, continuous evolution, and reusable engineering knowledge.</p></div>
          <Link href="/en/oss/why/" className="inline-flex shrink-0 items-center justify-center rounded-full px-5 py-3 text-sm font-semibold" style={{ backgroundColor: 'var(--accent)', color: 'var(--accent-fg)' }}>Why OSS? →</Link>
        </div>
      </section>

      <section className="mt-10 grid gap-3 sm:grid-cols-4">
        <Metric label="Projects" value={String(portfolio.length)} note="curated OSS portfolio" />
        <Metric label="Domains" value="4" note="foundation → platform → data → AI" />
        <Metric label="Documentation" value={String(portfolio.reduce((sum, p) => sum + (docsByProject.get(p!.slug) ?? 0), 0))} note="project documentation pages" />
        <Metric label="Model" value="Problem → Design → Evidence" note="document implementation and operational learning" wide />
      </section>

      <section className="mt-14 rounded-3xl p-7 sm:p-10" style={{ border: '1px solid var(--border)', backgroundColor: 'var(--surface)' }}>
        <div className="text-xs font-semibold uppercase tracking-[0.16em]" style={{ color: 'var(--accent)' }}>Portfolio Architecture</div>
        <h2 className="mt-3 text-2xl font-semibold">The projects remain independent, but connect through shared engineering practice and real usage paths.</h2>
        <pre className="mt-8 overflow-x-auto rounded-2xl p-6 text-xs leading-6" style={{ backgroundColor: 'var(--surface-hi)', color: 'var(--text-muted)' }}>{`OpenForge\n    │ engineering standards / supply-chain / reusable templates\n    │\n    ├── kube-ready-box ──→ local Kubernetes node baseline\n    │                         │\n    │                         ├── Narwhal ──→ Narwhal Portal\n    │                         │       │\n    │                         │       ├── nfs-quota-agent\n    │                         │       └── ldapium\n    │                         │\n    │                         └── Beluga ──→ Beluga Manager\n    │\n    └── KubeMetal ──→ Apple Silicon / host-native MLX MLOps`}</pre>
        <p className="mt-5 max-w-4xl text-sm leading-7" style={{ color: 'var(--text-muted)' }}>The relationship map does not imply runtime dependency. Each repository remains an independent OSS project; the relationship represents shared engineering patterns and practical usage scenarios.</p>
      </section>

      <div className="mt-14 space-y-12">
        {groups.map((group) => (
          <section key={group.label}>
            <div className="max-w-3xl"><div className="text-xs font-semibold uppercase tracking-[0.16em]" style={{ color: 'var(--accent)' }}>{group.label}</div><p className="mt-2 text-sm leading-6" style={{ color: 'var(--text-muted)' }}>{group.description}</p></div>
            <div className="mt-5 grid gap-5 md:grid-cols-2">
              {group.projects.map((slug) => {
                const project = bySlug.get(slug);
                if (!project) return null;
                const pageCount = docsByProject.get(slug) ?? 0;
                return <Link key={slug} href={`/oss/en/${slug}/`} className="group rounded-2xl p-7 transition duration-200" style={{ border: '1px solid var(--border)', backgroundColor: 'var(--surface)' }}><div className="flex items-start justify-between gap-5"><div><div className="text-[10px] font-semibold uppercase tracking-[0.16em]" style={{ color: 'var(--text-faint)' }}>Open Source Project</div><h3 className="mt-2 text-2xl font-semibold tracking-tight">{project.title}</h3><p className="mt-3 text-sm leading-6" style={{ color: 'var(--text-muted)' }}>{project.description}</p></div><div className="shrink-0 rounded-full px-3 py-1.5 text-[11px]" style={{ border: '1px solid var(--border)', color: 'var(--text-faint)' }}>{pageCount} docs</div></div>{project.problem && <div className="mt-6 rounded-xl p-4" style={{ backgroundColor: 'var(--surface-hi)' }}><div className="text-[10px] font-semibold uppercase tracking-[0.14em]" style={{ color: 'var(--text-faint)' }}>Problem</div><p className="mt-2 text-sm leading-6" style={{ color: 'var(--text-muted)' }}>{project.problem}</p></div>}{project.solution && <div className="mt-3 rounded-xl p-4" style={{ backgroundColor: 'var(--surface-hi)' }}><div className="text-[10px] font-semibold uppercase tracking-[0.14em]" style={{ color: 'var(--text-faint)' }}>Approach</div><p className="mt-2 text-sm leading-6" style={{ color: 'var(--text-muted)' }}>{project.solution}</p></div>}<div className="mt-6 flex flex-wrap gap-2">{project.tags.slice(0, 6).map((tag) => <span key={tag} className="rounded-md px-2.5 py-1.5 text-[11px]" style={{ backgroundColor: 'var(--surface-hi)', color: 'var(--text-faint)' }}>{tag}</span>)}</div><div className="mt-7 text-sm font-medium" style={{ color: 'var(--accent)' }}>View project documentation →</div></Link>;
              })}
            </div>
          </section>
        ))}
      </div>

      <section className="mt-16 border-t pt-10" style={{ borderColor: 'var(--border)' }}><h2 className="text-2xl font-semibold">Documentation Standard</h2><p className="mt-3 max-w-4xl text-sm leading-7" style={{ color: 'var(--text-muted)' }}>Each project profile covers problem definition, design principles, architecture, key technologies, operational model, verification, current status, and portfolio relationships. Detailed documents are then split into Overview, Architecture, Getting Started, Operations, Troubleshooting, and ADR topics where applicable.</p><div className="mt-6 flex flex-wrap gap-3"><Link href="/en/oss/why/" className="rounded-full px-4 py-2 text-sm font-medium" style={{ border: '1px solid var(--accent)', backgroundColor: 'var(--surface)', color: 'var(--accent)' }}>Why OSS? →</Link><Link href="/en/oss/story/" className="rounded-full px-4 py-2 text-sm font-medium" style={{ border: '1px solid var(--border)', backgroundColor: 'var(--surface)', color: 'var(--text)' }}>Engineering Story →</Link><Link href="/oss/en/openforge/" className="rounded-full px-4 py-2 text-sm font-medium" style={{ border: '1px solid var(--border)', backgroundColor: 'var(--surface)', color: 'var(--text)' }}>OpenForge documentation baseline →</Link><Link href="/en/projects/" className="rounded-full px-4 py-2 text-sm font-medium" style={{ border: '1px solid var(--border)', backgroundColor: 'var(--surface)', color: 'var(--text)' }}>All Projects →</Link></div></section>
    </div>
  );
}

function Metric({ label, value, note, wide = false }: { label: string; value: string; note: string; wide?: boolean }) { return <div className="rounded-2xl p-5" style={{ border: '1px solid var(--border)', backgroundColor: 'var(--surface)' }}><div className="text-xs uppercase tracking-[0.14em]" style={{ color: 'var(--text-faint)' }}>{label}</div><div className={wide ? 'mt-2 text-xl font-semibold' : 'mt-2 text-3xl font-semibold'}>{value}</div><div className="mt-1 text-sm" style={{ color: 'var(--text-muted)' }}>{note}</div></div>; }