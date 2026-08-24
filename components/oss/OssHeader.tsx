'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

export default function OssHeader() {
  const pathname = usePathname();
  const english = pathname === '/oss/en' || pathname.startsWith('/oss/en/');
  const home = english ? '/oss/en/' : '/oss/';
  const switchTo = english
    ? pathname.replace(/^\/oss\/en/, '/oss') || '/oss/'
    : pathname.startsWith('/oss/')
      ? `/oss/en${pathname.slice('/oss'.length)}`
      : '/oss/en/';

  return (
    <header className="sticky top-0 z-50 border-b" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--header-bg)', backdropFilter: 'blur(14px) saturate(160%)' }}>
      <div className="mx-auto flex h-[60px] max-w-[1440px] items-center justify-between px-5 sm:px-7">
        <div className="flex items-center gap-7">
          <Link href={home} className="flex items-center gap-2.5 font-semibold tracking-tight" style={{ color: 'var(--text)' }}>
            <span className="grid h-7 w-7 place-items-center rounded-md text-[9px] font-bold tracking-tight font-mono" style={{ backgroundColor: 'var(--surface-hi)', color: 'var(--accent)', border: '1px solid var(--border)' }}>OSS</span>
            <span className="hidden sm:inline">Engineering Docs</span>
          </Link>
          <nav className="hidden items-center gap-1 text-sm md:flex">
            <Link href={home} className="rounded-md px-3 py-2 transition" style={{ color: 'var(--text-muted)' }}>
              {english ? 'Projects' : '프로젝트'}
            </Link>
            <Link href="/oss-story/" className="rounded-md px-3 py-2 font-medium transition" style={{ color: 'var(--accent)' }}>
              {english ? 'Why OSS?' : '왜 OSS인가?'}
            </Link>
          </nav>
        </div>
        <nav className="flex items-center gap-2 text-sm">
          <ThemeToggle />
          <Link href={switchTo} aria-label={english ? '한국어' : 'English'} className="rounded-md border px-2.5 py-1.5 font-mono text-[11px] font-semibold tracking-wide transition" style={{ color: 'var(--text-muted)', borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}>
            {english ? 'KO' : 'EN'}
          </Link>
          <a href="https://github.com/dasomel/openforge" target="_blank" rel="noreferrer" className="hidden rounded-md px-3 py-2 transition sm:block" style={{ color: 'var(--text-muted)' }}>GitHub ↗</a>
          <Link href="/" className="hidden rounded-md px-3 py-2 transition sm:block" style={{ color: 'var(--text-faint)' }}>cne.io.kr</Link>
        </nav>
      </div>
    </header>
  );
}
