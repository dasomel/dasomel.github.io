import Link from 'next/link';
import { Github, Linkedin, Rss } from 'lucide-react';

export default function Footer({ locale }: { locale: 'ko' | 'en' }) {
  const year = new Date().getFullYear();
  const base = locale === 'en' ? '/en' : '/ko';
  const rss = locale === 'en' ? '/rss-en.xml' : '/rss.xml';

  return (
    <footer className="mt-auto border-t" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}>
      <div className="mx-auto grid max-w-[1440px] gap-8 px-5 py-9 sm:px-8 md:grid-cols-[1fr_auto] md:items-end lg:px-16">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.16em]" style={{ color: 'var(--accent)' }}>DASOMEL / OSS WORKBENCH</div>
          <p className="mt-2 text-sm" style={{ color: 'var(--text-muted)' }}>Build in public. Document the decisions.</p>
          <p className="mt-3 font-mono text-[10px]" style={{ color: 'var(--text-faint)' }}>© {year} dasomel</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link href={`${base}/docs`} className="rounded-lg border px-3 py-2 font-mono text-[10px] transition-colors hover:bg-[var(--surface-hi)]" style={{ color: 'var(--text-muted)', borderColor: 'var(--border)' }}>DOCS</Link>
          <Link href={`${base}/tech-digest`} className="rounded-lg border px-3 py-2 font-mono text-[10px] transition-colors hover:bg-[var(--surface-hi)]" style={{ color: 'var(--text-muted)', borderColor: 'var(--border)' }}>DIGEST</Link>
          <Link href={`${base}/events`} className="rounded-lg border px-3 py-2 font-mono text-[10px] transition-colors hover:bg-[var(--surface-hi)]" style={{ color: 'var(--text-muted)', borderColor: 'var(--border)' }}>EVENTS</Link>
          <a href="https://github.com/dasomel" target="_blank" rel="noopener noreferrer" className="rounded-lg border p-2 transition-colors hover:bg-[var(--surface-hi)]" aria-label="GitHub" style={{ color: 'var(--text-faint)', borderColor: 'var(--border)' }}><Github className="h-4 w-4" /></a>
          <a href="https://www.linkedin.com/in/ba909924" target="_blank" rel="noopener noreferrer" className="rounded-lg border p-2 transition-colors hover:bg-[var(--surface-hi)]" aria-label="LinkedIn" style={{ color: 'var(--text-faint)', borderColor: 'var(--border)' }}><Linkedin className="h-4 w-4" /></a>
          <a href={rss} className="rounded-lg border p-2 transition-colors hover:bg-[var(--surface-hi)]" aria-label="RSS" style={{ color: 'var(--text-faint)', borderColor: 'var(--border)' }}><Rss className="h-4 w-4" /></a>
        </div>
      </div>
    </footer>
  );
}
