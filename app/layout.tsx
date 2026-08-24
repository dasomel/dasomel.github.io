import type { Metadata } from 'next';
import '@/app/globals.css';
import './about-identity.css';
import './content-typography.css';
import './reduced-motion.css';
import { StructuredData } from '@/components/seo/StructuredData';

const APP_ICON = '/icon-v2.svg';

export const metadata: Metadata = {
  metadataBase: new URL('https://cne.io.kr'),
  title: { default: 'dasomel — OSS Workbench', template: '%s | dasomel' },
  description: 'Cloud Native와 OSS를 직접 만들고 검증하며 배우는 엔지니어링 작업 기록. Kubernetes, Platform Engineering, AI-assisted Development.',
  icons: {
    icon: [{ url: APP_ICON, type: 'image/svg+xml' }],
    shortcut: APP_ICON,
    apple: [{ url: APP_ICON, type: 'image/svg+xml' }],
  },
  appleWebApp: {
    capable: true,
    title: 'dasomel OSS Workbench',
    statusBarStyle: 'black-translucent',
  },
  applicationName: 'dasomel OSS Workbench',
  openGraph: {
    type: 'website',
    siteName: 'dasomel OSS Workbench',
    title: 'dasomel — OSS Workbench',
    description: 'Cloud Native와 OSS를 직접 만들고 검증하며 배우는 엔지니어링 작업 기록.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'dasomel — OSS Workbench',
    description: 'Cloud Native와 OSS를 직접 만들고 검증하며 배우는 엔지니어링 작업 기록.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': 'https://cne.io.kr/#website',
        url: 'https://cne.io.kr/',
        name: 'dasomel OSS Workbench',
        description: 'Cloud Native와 OSS를 직접 만들고 검증하며 배우는 엔지니어링 작업 기록.',
        inLanguage: ['ko-KR', 'en-US'],
      },
      {
        '@type': 'Person',
        '@id': 'https://cne.io.kr/#person',
        name: 'Kiha Lee',
        url: 'https://cne.io.kr/ko/about',
        sameAs: ['https://github.com/dasomel'],
      },
    ],
  };

  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(() => { try { const stored = localStorage.getItem('cne-theme'); const theme = stored === 'dark' || stored === 'light' ? stored : (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'); document.documentElement.dataset.theme = theme; document.documentElement.style.colorScheme = theme; } catch (_) {} })();`,
          }}
        />
        <StructuredData data={schema} />
        <link rel="icon" href={APP_ICON} type="image/svg+xml" />
        <link rel="shortcut icon" href={APP_ICON} type="image/svg+xml" />
        <link rel="apple-touch-icon" href={APP_ICON} />
        <link rel="apple-touch-startup-image" href={APP_ICON} />
        <link rel="manifest" href="/manifest.json" />
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
        <meta name="theme-color" content="#0B1220" />
        <meta name="application-name" content="dasomel OSS Workbench" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body className="min-h-screen flex flex-col font-sans" style={{ backgroundColor: 'var(--bg)', color: 'var(--text)', minHeight: '100svh' }}>
        {children}
      </body>
    </html>
  );
}
