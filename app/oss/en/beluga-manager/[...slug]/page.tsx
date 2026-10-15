import { LegacyRedirect } from '@/components/LegacyRedirect';
import { legacyManagerDocParams, movedManagerDocPath } from '@/lib/legacy-beluga-manager';

export const generateStaticParams = legacyManagerDocParams;

export default async function LegacyBelugaManagerEnDocPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  return <LegacyRedirect to={`/oss/en/${movedManagerDocPath(slug)}/`} locale="en" ko="Beluga Manager는 Beluga의 manager/ 로 통합되었습니다. 새 위치로 이동합니다." en="Beluga Manager has been consolidated into Beluga (manager/). Redirecting to the new location." />;
}
