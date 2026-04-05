import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: { default: 'dasomel', template: '%s | dasomel' },
  description: 'Cloud & DevOps Engineer - K-PaaS, Kubernetes, DevOps 기술 블로그',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
