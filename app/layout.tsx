import type { Metadata } from 'next';
import '@/app/globals.css';

export const metadata: Metadata = {
  metadataBase: new URL('https://cne.io.kr'),
  title: { default: 'dasomel — OSS Workbench', template: '%s | dasomel' },
  description: 'Cloud Native와 OSS를 직접 만들고 검증하며 배우는 엔지니어링 작업 기록. Kubernetes, Platform Engineering, AI-assisted Development.',
  alternates: { canonical: 'https://cne.io.kr/ko' },
  openGraph: {
    type: 'website',
    siteName: 'dasomel OSS Workbench',
    url: 'https://cne.io.kr/ko',
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
        <meta name="theme-color" content="#047857" />
      </head>
      <body className="min-h-screen flex flex-col font-sans" style={{ backgroundColor: 'var(--bg)', color: 'var(--text)', minHeight: '100svh' }}>
        {children}
      </body>
    </html>
  );
}
