import { LegacyRedirect } from '@/components/LegacyRedirect';
import { routing } from '@/i18n/routing';
import { legacyManagerDocParams, movedManagerDocPath } from '@/lib/legacy-beluga-manager';

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => legacyManagerDocParams().map((p) => ({ locale, ...p })));
}

export default async function LegacyBelugaManagerDocsPage({ params }: { params: Promise<{ locale: string; slug: string[] }> }) {
  const { locale, slug } = await params;
  return <LegacyRedirect to={`/${locale}/docs/${movedManagerDocPath(slug)}/`} locale={locale === 'en' ? 'en' : 'ko'} ko="Beluga Manager는 Beluga의 manager/ 로 통합되었습니다. 새 위치로 이동합니다." en="Beluga Manager has been consolidated into Beluga (manager/). Redirecting to the new location." />;
}
