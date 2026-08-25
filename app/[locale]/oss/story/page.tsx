import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';

const timelineKo = [
  ['2013', 'eGovFrame community', '커뮤니티 활동을 시작하며 공개적인 기술 공유와 기여를 본격화.'],
  ['2015', 'OPDC', 'Open Platform Developer Community에서 장기 커뮤니티 활동 시작.'],
  ['2021', 'Cloud Native + Recognition', 'Cloud Native DevOps 학습조직 활동, 행정안전부장관 표창, OPDC 공로상.'],
  ['2022', 'OPA', 'Open Platform Alliance 리더 활동 시작. 민간 주도 개방형 클라우드 생태계 활동 확대.'],
  ['2024', 'AI + Research', '표준프레임워크에서의 AI 활용방안 연구, OPA 우수기여자 수상.'],
  ['2025', 'OSS portfolio', 'CloudBro AI, OPA Community Hero, 다수 OSS 프로젝트를 하나의 workbench로 운영.'],
  ['2026', 'Teaching + Advisory', '한국공학대학교 겸임교수, NIA 차세대 표준프레임워크 전문가 자문.'],
] as const;

const timelineEn = [
  ['2013', 'eGovFrame community', 'Started community work and made public technical sharing and contribution a regular practice.'],
  ['2015', 'OPDC', 'Began a long-running contribution to the Open Platform Developer Community.'],
  ['2021', 'Cloud Native + Recognition', 'Expanded Cloud Native DevOps work and received public and community recognition.'],
  ['2022', 'OPA', 'Started serving as a leader in the Open Platform Alliance and broadened ecosystem work.'],
  ['2024', 'AI + Research', 'Worked on AI adoption research for eGovFrame and received an OPA contributor award.'],
  ['2025', 'OSS portfolio', 'Operated multiple OSS projects as one engineering workbench and expanded community activity.'],
  ['2026', 'Teaching + Advisory', 'Teaching at Tech University of Korea while continuing expert advisory work.'],
] as const;

const principlesKo = [
  ['Build', '직접 만들고 운영하면서 판단한다.'],
  ['Verify', '완료보다 검증 가능한 evidence를 남긴다.'],
  ['Share', '배운 것과 실패를 문서와 발표로 공개한다.'],
] as const;

const principlesEn = [
  ['Build', 'Judge ideas by building and operating them directly.'],
  ['Verify', 'Leave verifiable evidence, not just a claim of completion.'],
  ['Share', 'Publish what worked, what failed, and what changed my mind.'],
] as const;

export default async function OssStoryPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as 'ko' | 'en')) notFound();
  const en = locale === 'en';
  const timeline = en ? timelineEn : timelineKo;
  const principles = en ? principlesEn : principlesKo;

  return (
    <main>
      <section className="border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="mx-auto max-w-[1440px] px-5 py-12 sm:px-8 sm:py-16 lg:px-16 lg:py-20">
          <div className="font-mono text-xs font-medium tracking-[0.12em]" style={{ color: 'var(--accent)' }}>ENGINEERING JOURNEY</div>
          <h1 className="mt-5 max-w-5xl text-4xl font-semibold tracking-[-0.05em] sm:text-6xl lg:text-[3.75rem] lg:leading-[1.08]" style={{ color: 'var(--text)' }}>
            {en ? <>From community work,<br />to an OSS workbench.</> : <>커뮤니티에서 시작해,<br />OSS Workbench까지.</>}
          </h1>
          <p className="mt-6 max-w-5xl text-base leading-7 sm:text-lg sm:leading-8" style={{ color: 'var(--text-muted)' }}>
            {en
              ? 'A public engineering journey that grew from the eGovFrame community into Cloud Native infrastructure, open source, mentoring, advisory work, and teaching.'
              : '2013년 eGovFrame 커뮤니티에서 시작해 Cloud Native 인프라, 오픈소스, 멘토링, 자문, 강의까지 확장된 공개적인 엔지니어링 여정.'}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 py-12 sm:px-8 sm:py-14 lg:px-16">
        <div className="font-mono text-xs font-medium tracking-[0.12em]" style={{ color: 'var(--accent)' }}>TIMELINE / EVIDENCE</div>
        <h2 className="mt-3 text-2xl font-semibold tracking-[-0.03em] sm:text-3xl" style={{ color: 'var(--text)' }}>
          {en ? 'The reasons behind the transitions matter more than the technologies' : '기술보다 중요한 것은 전환의 이유'}
        </h2>
        <div className="mt-8 divide-y" style={{ borderColor: 'var(--border)' }}>
          {timeline.map(([year, title, description]) => (
            <article key={year} className="grid gap-3 py-5 sm:grid-cols-[90px_1fr] sm:gap-6">
              <div className="font-mono text-xs font-medium" style={{ color: 'var(--accent)' }}>{year}</div>
              <div>
                <h3 className="text-lg font-semibold sm:text-xl" style={{ color: 'var(--text)' }}>{title}</h3>
                <p className="mt-1 text-sm leading-6" style={{ color: 'var(--text-muted)' }}>{description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="border-y" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface-hi)' }}>
        <div className="mx-auto max-w-[1440px] px-5 py-12 sm:px-8 sm:py-14 lg:px-16">
          <div className="font-mono text-xs font-medium tracking-[0.12em]" style={{ color: 'var(--accent)' }}>WHAT REMAINS</div>
          <h2 className="mt-3 text-2xl font-semibold tracking-[-0.03em] sm:text-3xl" style={{ color: 'var(--text)' }}>Build → Verify → Share</h2>
          <div className="mt-7 grid gap-4 lg:grid-cols-3">
            {principles.map(([title, description]) => (
              <div key={title} className="rounded-2xl border p-5" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}>
                <h3 className="text-xl font-semibold" style={{ color: 'var(--text)' }}>{title}</h3>
                <p className="mt-2 text-sm leading-6" style={{ color: 'var(--text-muted)' }}>{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
