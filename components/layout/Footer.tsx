import { Github, Linkedin, Rss } from 'lucide-react';

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-auto" style={{ borderTop: '1px solid var(--border)' }}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 flex items-center justify-between gap-4">
        <p className="font-mono text-xs" style={{ color: 'var(--text-faint)' }}>
          © {year} dasomel
        </p>
        <div className="flex items-center gap-4">
          <a href="https://github.com/dasomel" target="_blank" rel="noopener noreferrer"
             className="transition-opacity hover:opacity-60" aria-label="GitHub"
             style={{ color: 'var(--text-faint)' }}>
            <Github className="w-4 h-4" />
          </a>
          <a href="https://www.linkedin.com/in/ba909924" target="_blank" rel="noopener noreferrer"
             className="transition-opacity hover:opacity-60" aria-label="LinkedIn"
             style={{ color: 'var(--text-faint)' }}>
            <Linkedin className="w-4 h-4" />
          </a>
          <a href="/rss.xml" className="transition-opacity hover:opacity-60" aria-label="RSS"
             style={{ color: 'var(--text-faint)' }}>
            <Rss className="w-4 h-4" />
          </a>
        </div>
      </div>
    </footer>
  );
}
