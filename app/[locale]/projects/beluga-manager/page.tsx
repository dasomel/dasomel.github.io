import { LegacyRedirect } from '@/components/LegacyRedirect';

export default async function LegacyBelugaManagerProjectPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  return <LegacyRedirect to={`/${locale}/projects/beluga/`} locale={locale === 'en' ? 'en' : 'ko'} ko="Beluga Manager는 Beluga의 manager/ 로 통합되었습니다. 새 위치로 이동합니다." en="Beluga Manager has been consolidated into Beluga (manager/). Redirecting to the new location." />;
}
