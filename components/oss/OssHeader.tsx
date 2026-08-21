import Link from 'next/link';

export default function OssHeader({ english = false }: { english?: boolean }) {
  const home = english ? '/oss/en/' : '/oss/';
  const switchTo = english ? '/oss/' : '/oss/en/';
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/90 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-6">
        <Link href={home} className="flex items-center gap-2.5 font-semibold tracking-tight text-slate-950">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-slate-950 text-xs font-bold text-white">OSS</span>
          <span>Engineering Docs</span>
        </Link>
        <nav className="flex items-center gap-1 text-sm">
          <Link href={home} className="rounded-md px-3 py-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-950">Projects</Link>
          <Link href={switchTo} className="rounded-md border border-slate-300 bg-white px-3 py-2 font-mono text-xs font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50">{english ? 'KO' : 'EN'}</Link>
          <a href="https://github.com/dasomel/openforge" target="_blank" rel="noreferrer" className="hidden rounded-md px-3 py-2 text-slate-600 transition hover:bg-slate-100 hover:text-slate-950 sm:block">GitHub ↗</a>
          <Link href="/" className="hidden rounded-md px-3 py-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-950 sm:block">cne.io.kr</Link>
        </nav>
      </div>
    </header>
  );
}
