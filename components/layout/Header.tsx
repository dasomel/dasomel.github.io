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
  useEffect(() => { const fn = () => setScrolled(window.scrollY > 8); window.addEventListener('scroll', fn, { passive: true }); return () => window.removeEventListener('scroll', fn); }, []);
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
  return <header className="sticky top-0 z-50 border-b transition-all duration-300" style={{ backgroundColor:'var(--header-bg)', backdropFilter:'blur(18px) saturate(180%)', borderBottomColor:scrolled ? 'var(--border)' : 'var(--border-soft)', boxShadow:scrolled ? '0 10px 30px -26px var(--accent-glow)' : 'none' }}><div className="max-w-6xl mx-auto px-4 sm:px-6"><div className="flex items-center justify-between h-14"><Link href={base + '/'} className="font-mono text-sm font-semibold tracking-tight" style={{ color:'var(--text)' }}><span style={{ color:'var(--accent)' }}>~/</span>dasomel</Link><nav className="hidden md:flex items-center gap-1">{navItems.map(item => <Link key={item.href} href={item.href} className="relative px-3 py-1.5 text-sm rounded-lg transition-colors" style={{ color:isActive(item.href) ? 'var(--text)' : 'var(--text-muted)', fontWeight:isActive(item.href) ? 600 : 400, backgroundColor:isActive(item.href) ? 'var(--surface-hi)' : 'transparent' }}>{item.label}{isActive(item.href) && <span className="absolute inset-x-3 -bottom-[0.35rem] h-px" style={{ backgroundColor:'var(--accent)' }} />}</Link>)}<a href="https://github.com/dasomel" target="_blank" rel="noreferrer" aria-label="GitHub" className="ml-2 p-2 rounded-lg transition-opacity hover:opacity-60" style={{ color:'var(--text-muted)' }}><Github className="w-4 h-4" /></a><div className="w-px h-4 mx-1" style={{ backgroundColor:'var(--border-hi)' }} /><ThemeToggle /><Link href={langSwitch} className="px-2.5 py-1 font-mono text-xs rounded-lg border" style={{ color:'var(--text-muted)', borderColor:'var(--border)' }}>{t('lang')}</Link></nav><div className="flex items-center gap-2 md:hidden"><ThemeToggle /><Link href={langSwitch} className="font-mono text-xs px-2 py-1 border rounded-md" style={{ color:'var(--text-muted)', borderColor:'var(--border)' }}>{t('lang')}</Link><button onClick={() => setOpen(!open)} className="p-1.5 rounded-md" style={{ color:'var(--text-muted)' }} aria-label="Menu">{open ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}</button></div></div></div>{open && <div className="md:hidden" style={{ backgroundColor:'var(--bg-subtle)', borderTop:'1px solid var(--border)' }}><nav className="max-w-6xl mx-auto px-4 py-3 flex flex-col gap-1">{navItems.map(item => <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className="px-3 py-2.5 text-sm rounded-lg" style={{ color:isActive(item.href) ? 'var(--text)' : 'var(--text-muted)', backgroundColor:isActive(item.href) ? 'var(--surface-hi)' : 'transparent' }}>{item.label}</Link>)}<a href="https://github.com/dasomel" target="_blank" rel="noreferrer" className="px-3 py-2.5 text-sm rounded-lg" style={{ color:'var(--text-muted)' }}>GitHub</a></nav></div>}</header>;
}
