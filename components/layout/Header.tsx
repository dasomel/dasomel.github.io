'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';

interface HeaderProps { locale: 'ko' | 'en'; }

export default function Header({ locale }: HeaderProps) {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const base = locale === 'en' ? '/en' : '/ko';
  const langSwitch = locale === 'en'
    ? pathname.replace(/^\/en/, '/ko') || '/ko/'
    : pathname.replace(/^\/ko/, '/en') || '/en/';

  const navItems = [
    { href: `${base}/projects`, label: t('work') },
    { href: `${base}/seminars`, label: t('speaking') },
    { href: `${base}/docs/about`, label: t('docs') },
    { href: `${base}/posts`, label: t('blog') },
    { href: `${base}/events`, label: t('events') },
    { href: `${base}/about`, label: t('about') },
  ];

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  return (
    <header
      className="sticky top-0 z-50 transition-all duration-300"
      style={{
        backgroundColor: scrolled ? 'rgba(255,255,255,0.85)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px) saturate(180%)' : 'none',
        borderBottom: `1px solid ${scrolled ? 'var(--border)' : 'transparent'}`,
      }}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link
            href={locale === 'en' ? '/en/' : '/ko/'}
            className="font-mono text-sm font-medium transition-opacity hover:opacity-60"
            style={{ color: 'var(--text)' }}
          >
            <span style={{ color: 'var(--accent)' }}>~/</span>dasomel
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-0.5">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-3 py-1.5 text-sm rounded-lg transition-all"
                style={{
                  color: isActive(item.href) ? 'var(--text)' : 'var(--text-muted)',
                  fontWeight: isActive(item.href) ? 500 : 400,
                  backgroundColor: isActive(item.href) ? 'var(--surface)' : 'transparent',
                }}
              >
                {item.label}
              </Link>
            ))}
            <div className="w-px h-3.5 mx-2" style={{ backgroundColor: 'var(--border-hi)' }} />
            <Link
              href={langSwitch}
              className="px-2.5 py-1 font-mono text-xs rounded-lg border transition-opacity hover:opacity-70"
              style={{ color: 'var(--text-muted)', borderColor: 'var(--border)' }}
            >
              {t('lang')}
            </Link>
          </nav>

          {/* Mobile */}
          <div className="flex items-center gap-3 md:hidden">
            <Link href={langSwitch}
              className="font-mono text-xs px-2 py-1 border rounded-md"
              style={{ color: 'var(--text-muted)', borderColor: 'var(--border)' }}>
              {t('lang')}
            </Link>
            <button onClick={() => setOpen(!open)}
              className="p-1.5 rounded-md transition-opacity hover:opacity-70"
              style={{ color: 'var(--text-muted)' }}
              aria-label="메뉴">
              {open ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden" style={{ backgroundColor: 'var(--bg-subtle)', borderTop: '1px solid var(--border)' }}>
          <nav className="max-w-4xl mx-auto px-4 py-3 flex flex-col gap-0.5">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}
                onClick={() => setOpen(false)}
                className="px-3 py-2.5 text-sm rounded-lg transition-all"
                style={{
                  color: isActive(item.href) ? 'var(--text)' : 'var(--text-muted)',
                  backgroundColor: isActive(item.href) ? 'var(--surface)' : 'transparent',
                  fontWeight: isActive(item.href) ? 500 : 400,
                }}>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
