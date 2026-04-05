import { useTranslations } from 'next-intl';
import { Github, Linkedin, Rss } from 'lucide-react';

export default function Footer() {
  const t = useTranslations('footer');
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-gray-100 mt-auto">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-1">
            <p className="font-mono text-xs text-gray-400">© {year} dasomel</p>
            <span className="hidden sm:inline font-mono text-xs text-gray-200 mx-1">·</span>
            <p className="font-mono text-xs text-gray-300">{t('built_with')}</p>
          </div>
          <div className="flex items-center gap-5">
            <a href="https://github.com/dasomel" target="_blank" rel="noopener noreferrer"
               className="text-gray-300 hover:text-gray-900 transition-colors" aria-label="GitHub">
              <Github className="w-5 h-5" />
            </a>
            <a href="https://www.linkedin.com/in/ba909924" target="_blank" rel="noopener noreferrer"
               className="text-gray-300 hover:text-gray-900 transition-colors" aria-label="LinkedIn">
              <Linkedin className="w-5 h-5" />
            </a>
            <a href="/rss.xml" className="text-gray-300 hover:text-gray-900 transition-colors" aria-label="RSS">
              <Rss className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
