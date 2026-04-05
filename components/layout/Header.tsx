'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

interface HeaderProps { locale: 'ko' | 'en'; }

export default function Header({ locale }: HeaderProps) {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const base = locale === 'en' ? '/en' : '';
  const langSwitch = locale === 'en'
    ? pathname.replace(/^\/en/, '') || '/'
    : `/en${pathname}`;

  const navItems = [
    { href: `${base}/projects`, label: t('projects') },
    { href: `${base}/seminars`, label: t('seminars') },
    { href: `${base}/docs/about`, label: t('docs') },
    { href: `${base}/posts`, label: t('posts') },
    { href: `${base}/about`, label: t('about') },
  ];

  const isActive = (href: string) =>
    pathname.startsWith(href) && href !== `${base}/`;

  return (
    <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href={locale === 'en' ? '/en' : '/'}
            className="font-mono text-lg text-gray-900 hover:opacity-80 transition-all group flex items-center gap-1"
          >
            <span className="text-emerald-600 group-hover:text-emerald-500 font-bold transition-colors">$</span>
            <span className="font-medium">dasomel</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  isActive(item.href)
                    ? 'text-gray-900 bg-gray-100'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href={langSwitch}
              className="ml-2 px-3 py-1.5 font-mono text-xs text-gray-400 hover:text-gray-900 border border-gray-200 rounded-full hover:border-gray-300 transition-all"
            >
              {t('lang')}
            </Link>
          </nav>

          {/* Mobile */}
          <div className="flex items-center gap-2 md:hidden">
            <Link
              href={langSwitch}
              className="px-2 py-1 font-mono text-xs text-gray-400 border border-gray-200 rounded-full"
            >
              {t('lang')}
            </Link>
            <button
              onClick={() => setOpen(!open)}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
              aria-label="메뉴"
            >
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden border-t border-gray-100 bg-white/90 backdrop-blur-xl">
          <nav className="px-4 py-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`block px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive(item.href)
                    ? 'text-gray-900 bg-gray-50'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
