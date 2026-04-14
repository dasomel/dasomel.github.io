import type { Metadata } from 'next';
import '@/app/globals.css';

export const metadata: Metadata = {
  title: { default: 'dasomel', template: '%s | dasomel' },
  description: 'Cloud & DevOps Engineer - K-PaaS, Kubernetes, DevOps 기술 블로그',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#059669" />
      </head>
      <body
        className="min-h-screen flex flex-col font-sans"
        style={{ backgroundColor: 'var(--bg)', color: 'var(--text)', minHeight: '100svh' }}
      >
        {children}
      </body>
    </html>
  );
}
