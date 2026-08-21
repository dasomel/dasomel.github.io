'use client';

import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

const STORAGE_KEY = 'cne-theme';

type Theme = 'light' | 'dark';

function resolveTheme(): Theme {
  const stored = window.localStorage.getItem(STORAGE_KEY) as Theme | null;
  if (stored === 'dark' || stored === 'light') return stored;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const initial = resolveTheme();
      setTheme(initial);
      applyTheme(initial);
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  const toggle = () => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    window.localStorage.setItem(STORAGE_KEY, next);
    applyTheme(next);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme === 'dark' ? 'Light mode' : 'Dark mode'}
      title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
      className="inline-flex h-8 w-8 items-center justify-center rounded-lg border transition-colors"
      style={{ color: 'var(--text-muted)', borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}
    >
      {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </button>
  );
}
