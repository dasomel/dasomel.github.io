'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Menu, X, Github } from 'lucide-react';
import { useState, useEffect } from 'react';
import { ThemeToggle } from '@/components/ui/ThemeToggle';

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
  const langSwitch = locale === 'en' ? pathname.replace(/^\/en/, '/ko') || '/ko/' : pathname.replace(/^\/ko/, '/en') || '/en/';
  const navItems = [
    { href: `${base}/projects`, label: t('projects') },
    { href: `${base}/notes`, label: t('notes') },
    { href: `${base}/tech-digest`, label: t('tech_digest') },
    { href: `${base}/seminars`, label: t('talks') },
    { href: `${base}/about`, label: t('about') },
  ];
  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  return <header className="sticky top-0 z-50 border-b transition-all duration-300" style={{ backgroundColor:'var(--header-bg)', backdropFilter:'blur(18px) saturate(180%)', borderBottomColor:scrolled ? 'var(--border)' : 'var(--border-soft)', boxShadow:scrolled ? '0 10px 30px -26px var(--accent-glow)' : 'none' }}>
    <div className="max-w-6xl mx-auto px-4 sm:px-6">
      <div className="flex items-center justify-between h-14 sm:h-16">
        <Link href={base + '/'} className="font-mono text-sm font-semibold tracking-tight" style={{ color:'var(--text)' }}>
          <span style={{ color:'var(--accent)' }}>~/</span>dasomel
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navItems.map(item => <Link key={item.href} href={item.href} className="relative px-3 py-1.5 text-sm rounded-lg transition-colors" style={{ color:isActive(item.href) ? 'var(--text)' : 'var(--text-muted)', fontWeight:isActive(item.href) ? 600 : 400, backgroundColor:isActive(item.href) ? 'var(--surface-hi)' : 'transparent' }}>{item.label}{isActive(item.href) && <span className="absolute inset-x-3 -bottom-[0.35rem] h-px" style={{ backgroundColor:'var(--accent)' }} />}</Link>)}
          <a href="https://github.com/dasomel" target="_blank" rel="noreferrer" aria-label="GitHub" className="ml-2 p-2 rounded-lg transition-opacity hover:opacity-60" style={{ color:'var(--text-muted)' }}><Github className="w-4 h-4" /></a>
          <div className="w-px h-4 mx-1" style={{ backgroundColor:'var(--border-hi)' }} />
          <ThemeToggle />
          <Link href={langSwitch} className="px-2.5 py-1 font-mono text-xs rounded-lg border" style={{ color:'var(--text-muted)', borderColor:'var(--border)' }}>{t('lang')}</Link>
        </nav>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <Link href={langSwitch} className="font-mono text-xs px-2.5 py-1.5 border rounded-md" style={{ color:'var(--text-muted)', borderColor:'var(--border)' }}>{t('lang')}</Link>
          <button onClick={() => setOpen(!open)} className="p-2 rounded-lg transition-colors" style={{ color:'var(--text-muted)', backgroundColor:open ? 'var(--surface-hi)' : 'transparent' }} aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="mobile-navigation">
            {open ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>

    {open && <div id="mobile-navigation" className="md:hidden border-t" style={{ backgroundColor:'color-mix(in srgb, var(--bg-subtle) 94%, var(--accent-dim))', borderTopColor:'var(--border)' }}>
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 py-3" aria-label="Mobile navigation">
        <div className="rounded-xl border overflow-hidden" style={{ borderColor:'var(--border)', backgroundColor:'var(--surface)' }}>
          {navItems.map((item, index) => <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className={`flex items-center justify-between px-4 py-3.5 text-sm transition-colors ${index < navItems.length - 1 ? 'border-b' : ''}`} style={{ borderBottomColor:'var(--border-soft)', color:isActive(item.href) ? 'var(--text)' : 'var(--text-muted)', backgroundColor:isActive(item.href) ? 'var(--accent-dim)' : 'transparent', fontWeight:isActive(item.href) ? 600 : 400 }}><span className="flex items-center gap-2.5">{isActive(item.href) && <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor:'var(--accent)' }} />}{item.label}</span>{isActive(item.href) && <span className="font-mono text-[10px] uppercase tracking-wider" style={{ color:'var(--accent)' }}>active</span>}</Link>)}
          <a href="https://github.com/dasomel" target="_blank" rel="noreferrer" className="flex items-center gap-2.5 px-4 py-3.5 text-sm" style={{ color:'var(--text-muted)', borderTop:'1px solid var(--border)' }}><Github className="w-4 h-4" />GitHub</a>
        </div>
      </nav>
    </div>}
  </header>;
}
