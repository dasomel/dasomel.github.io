import { LegacyRedirect } from '@/components/LegacyRedirect';

export default function LegacyBelugaManagerPage() {
  return <LegacyRedirect to="/oss/beluga/" locale="ko" ko="Beluga Manager는 Beluga의 manager/ 로 통합되었습니다. 새 위치로 이동합니다." en="Beluga Manager has been consolidated into Beluga (manager/). Redirecting to the new location." />;
}
