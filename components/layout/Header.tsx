'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Github, Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

interface HeaderProps { locale: 'ko' | 'en'; }

const focusRing = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--header-bg)]';

export default function Header({ locale }: HeaderProps) {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  const base = locale === 'en' ? '/en' : '/ko';
  const langSwitch = locale === 'en' ? pathname.replace(/^\/en/, '/ko') || '/ko/' : pathname.replace(/^\/ko/, '/en') || '/en/';
  const primary = [
    { href: `${base}/projects`, label: 'Work' },
    { href: `${base}/oss/story`, label: 'Story' },
    { href: `${base}/notes`, label: t('notes') },
    { href: `${base}/seminars`, label: t('talks') },
    { href: `${base}/about`, label: t('about') },
  ];
  const mobileExtra = [
    { href: `${base}/oss`, label: 'OSS' },
    { href: `${base}/tech-digest`, label: t('tech_digest') },
    { href: `${base}/docs`, label: t('docs') },
    { href: `${base}/events`, label: 'Events' },
  ];
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header
      className="sticky top-0 z-50 border-b transition-all duration-300"
      style={{
        backgroundColor: 'var(--header-bg)',
        backdropFilter: 'blur(18px) saturate(180%)',
        borderBottomColor: scrolled ? 'var(--border)' : 'var(--border-soft)',
        boxShadow: scrolled ? '0 10px 30px -26px var(--accent-glow)' : 'none',
      }}
    >
      <div className="mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-16">
        <div className="flex h-14 items-center justify-between sm:h-16">
          <Link href={`${base}/`} className={`inline-flex items-center gap-2 ${focusRing}`} aria-label="dasomel OSS Workbench">
            <span className="font-mono text-sm font-semibold tracking-tight" style={{ color: 'var(--text)' }}>dasomel</span>
            <span className="hidden font-mono text-[10px] tracking-[0.12em] sm:inline" style={{ color: 'var(--text-faint)' }}>/ OSS WORKBENCH</span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Primary navigation">
            {primary.map(item => (
              <Link key={item.href} href={item.href} className={`rounded-lg px-3 py-1.5 text-sm transition-colors ${focusRing}`} style={{ color: isActive(item.href) ? 'var(--accent)' : 'var(--text-muted)', fontWeight: isActive(item.href) ? 600 : 400 }}>
                {item.label}
              </Link>
            ))}
            <a href="https://github.com/dasomel" target="_blank" rel="noreferrer" aria-label="GitHub" className={`ml-2 rounded-lg p-2 transition-opacity hover:opacity-60 ${focusRing}`} style={{ color: 'var(--text-muted)' }}><Github className="h-4 w-4" /></a>
            <div className="mx-1 h-4 w-px" style={{ backgroundColor: 'var(--border-hi)' }} />
            <ThemeToggle />
            <Link href={langSwitch} className={`rounded-lg border px-2.5 py-1 font-mono text-xs ${focusRing}`} style={{ color: 'var(--text-muted)', borderColor: 'var(--border)' }}>{t('lang')}</Link>
          </nav>

          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <Link href={langSwitch} className={`rounded-md border px-2.5 py-1.5 font-mono text-xs ${focusRing}`} style={{ color: 'var(--text-muted)', borderColor: 'var(--border)' }}>{t('lang')}</Link>
            <button type="button" onClick={() => setOpen(value => !value)} className={`rounded-lg p-2 ${focusRing}`} style={{ color: 'var(--text-muted)', backgroundColor: open ? 'var(--surface-hi)' : 'transparent' }} aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="mobile-navigation">
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div id="mobile-navigation" className="border-t md:hidden" style={{ borderTopColor: 'var(--border)', backgroundColor: 'var(--bg)' }}>
          <nav className="mx-auto max-w-[1440px] px-5 py-4 sm:px-8" aria-label="Mobile navigation">
            <div className="grid gap-1">
              {[...primary, ...mobileExtra].map(item => (
                <Link key={item.href} href={item.href} className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm ${focusRing}`} style={{ color: isActive(item.href) ? 'var(--accent)' : 'var(--text-muted)', backgroundColor: isActive(item.href) ? 'var(--accent-dim)' : 'transparent', fontWeight: isActive(item.href) ? 600 : 400 }}>
                  <span>{item.label}</span>
                  {isActive(item.href) && <span className="font-mono text-[9px] tracking-[0.12em]">ACTIVE</span>}
                </Link>
              ))}
              <a href="https://github.com/dasomel" target="_blank" rel="noreferrer" className={`mt-2 flex items-center gap-2 rounded-xl border px-4 py-3 text-sm ${focusRing}`} style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}><Github className="h-4 w-4" /> GitHub</a>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
