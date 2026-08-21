'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

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
    <header className="sticky top-0 z-50 border-b border-[#deded8] bg-[#f7f7f5]/95 backdrop-blur">
      <div className="mx-auto flex h-[60px] max-w-[1440px] items-center justify-between px-5 sm:px-7">
        <div className="flex items-center gap-7">
          <Link href={home} className="flex items-center gap-2.5 font-semibold tracking-tight text-[#171717]">
            <span className="grid h-7 w-7 place-items-center rounded-md bg-[#171717] text-[9px] font-bold tracking-tight text-white">OSS</span>
            <span className="hidden sm:inline">Engineering Docs</span>
          </Link>
          <nav className="hidden items-center gap-1 text-sm md:flex">
            <Link href={home} className="rounded-md px-3 py-2 text-[#55554f] transition hover:bg-[#ecece6] hover:text-[#171717]">
              {english ? 'Projects' : '프로젝트'}
            </Link>
          </nav>
        </div>
        <nav className="flex items-center gap-1 text-sm">
          <Link href={switchTo} aria-label={english ? '한국어' : 'English'} className="rounded-md border border-[#d4d4ce] bg-white px-2.5 py-1.5 font-mono text-[11px] font-semibold tracking-wide text-[#34342f] transition hover:border-[#bdbdb6] hover:bg-[#f1f1ec]">
            {english ? 'KO' : 'EN'}
          </Link>
          <a href="https://github.com/dasomel/openforge" target="_blank" rel="noreferrer" className="hidden rounded-md px-3 py-2 text-[#55554f] transition hover:bg-[#ecece6] hover:text-[#171717] sm:block">GitHub ↗</a>
          <Link href="/" className="hidden rounded-md px-3 py-2 text-[#77776f] transition hover:bg-[#ecece6] hover:text-[#171717] sm:block">cne.io.kr</Link>
        </nav>
      </div>
    </header>
  );
}
