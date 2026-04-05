'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Menu, X, Terminal } from 'lucide-react';
import { useState, useEffect } from 'react';

interface HeaderProps { locale: 'ko' | 'en'; }

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

  const base = locale === 'en' ? '/en' : '/ko';
  const langSwitch = locale === 'en'
    ? pathname.replace(/^\/en/, '/ko') || '/ko/'
    : pathname.replace(/^\/ko/, '/en') || '/en/';

  const navItems = [
    { href: `${base}/projects`, label: t('projects') },
    { href: `${base}/seminars`, label: t('seminars') },
    { href: `${base}/docs/about`, label: t('docs') },
    { href: `${base}/posts`, label: t('posts') },
    { href: `${base}/about`, label: t('about') },
  ];

  const isActive = (href: string) => pathname.startsWith(href);

  return (
    <header className={`sticky top-0 z-50 transition-all duration-200 ${
      scrolled
        ? 'bg-white/90 backdrop-blur-xl shadow-sm border-b border-gray-100/80'
        : 'bg-white/70 backdrop-blur-md border-b border-transparent'
    }`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href={locale === 'en' ? '/en/' : '/ko/'}
            className="group flex items-center gap-2 font-mono text-sm font-semibold text-gray-900 hover:text-emerald-600 transition-colors"
          >
            <span className="flex items-center justify-center w-7 h-7 rounded-md bg-emerald-50 border border-emerald-100 group-hover:bg-emerald-100 transition-colors">
              <Terminal className="w-3.5 h-3.5 text-emerald-600" />
            </span>
            <span>dasomel</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-0.5">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`relative px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive(item.href)
                    ? 'text-emerald-700 bg-emerald-50'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {isActive(item.href) && (
                  <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-emerald-500" />
                )}
                {item.label}
              </Link>
            ))}
            <div className="w-px h-4 bg-gray-200 mx-2" />
            <Link
              href={langSwitch}
              className="px-3 py-1.5 font-mono text-xs font-medium text-gray-400 hover:text-emerald-600 border border-gray-200 hover:border-emerald-200 rounded-full transition-all hover:bg-emerald-50"
            >
              {t('lang')}
            </Link>
          </nav>

          {/* Mobile controls */}
          <div className="flex items-center gap-2 md:hidden">
            <Link
              href={langSwitch}
              className="px-2.5 py-1 font-mono text-xs text-gray-400 border border-gray-200 rounded-full hover:border-emerald-300 transition-colors"
            >
              {t('lang')}
            </Link>
            <button
              onClick={() => setOpen(!open)}
              className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="메뉴"
            >
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden border-t border-gray-100 bg-white/95 backdrop-blur-xl animate-fade-up">
          <nav className="px-4 py-3 space-y-0.5">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive(item.href)
                    ? 'text-emerald-700 bg-emerald-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {isActive(item.href) && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2.5" />
                )}
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
