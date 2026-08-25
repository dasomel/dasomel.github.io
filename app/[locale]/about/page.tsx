import { getTranslations } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { communityActivities, awards, researchReports, expertActivities } from '@/lib/data/about';

export function generateStaticParams() {
  return routing.locales.map(locale => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'about' });
  return {
    title: t('title'),
    description: locale === 'en'
      ? 'OSS Workbench — how I build, verify, document, and share Cloud Native systems.'
      : 'OSS Workbench — Cloud Native 시스템을 만들고, 검증하고, 기록하고, 공유하는 작업 방식.',
  };
}

function Card({ title, meta, description }: { title: string; meta?: string; description: string }) {
  return (
    <div className="rounded-2xl border p-5" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}>
      <h3 className="text-lg font-semibold" style={{ color: 'var(--text)' }}>{title}</h3>
      {meta && <div className="mt-1 font-mono text-[10px] tracking-[0.06em]" style={{ color: 'var(--text-faint)' }}>{meta}</div>}
      <p className="mt-2 text-sm leading-6" style={{ color: 'var(--text-muted)' }}>{description}</p>
    </div>
  );
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const en = locale === 'en';
  const sortedAwards = [...awards].sort((a, b) => b.year - a.year);
  const advisory = [...expertActivities].sort((a, b) => b.year - a.year)[0];

  const roles = en
    ? [
        ['Cloud & DevOps Engineer', '2013 — Present', 'K-PaaS Lite · Kubernetes platform engineering · OSS development'],
        ['Adjunct Professor · Tech University of Korea', '2026 — Present', 'Teaching software framework engineering'],
        ['Community Leader', '2015 — Present', 'CloudBro AI · OPA · OPDC'],
      ]
    : [
        ['Cloud & DevOps Engineer', '2013 — 현재', 'K-PaaS Lite · Kubernetes platform engineering · OSS development'],
        ['겸임교수 · 한국공학대학교', '2026 — 현재', 'SW 프레임워크 엔지니어링 강의'],
        ['Community Leader', '2015 — 현재', 'CloudBro AI · OPA · OPDC'],
      ];

  const philosophy = en
    ? [
        ['01', 'Define the problem first.', 'Build · Verify · Document · Share'],
        ['02', 'Write while learning.', 'Build · Verify · Document · Share'],
        ['03', 'Use AI to accelerate exploration, but keep judgment and verification human.', 'Build · Verify · Document · Share'],
      ]
    : [
        ['01', '문제를 먼저 정의한다.', 'Build · Verify · Document · Share'],
        ['02', '배우면서 쓴다.', 'Build · Verify · Document · Share'],
        ['03', 'AI는 탐색과 구현을 가속하지만 판단과 검증은 직접 한다.', 'Build · Verify · Document · Share'],
      ];

  return (
    <main>
      <section className="border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="mx-auto max-w-[1440px] px-5 py-12 sm:px-8 sm:py-16 lg:px-16 lg:py-20">
          <div className="font-mono text-xs font-medium tracking-[0.12em]" style={{ color: 'var(--accent)' }}>OSS WORKBENCH / ABOUT</div>
          <h1 className="mt-5 max-w-5xl text-4xl font-semibold tracking-[-0.05em] sm:text-6xl lg:text-[3.65rem]" style={{ color: 'var(--text)' }}>
            {en ? 'I build infrastructure in public.' : '인프라를 공개적으로 만듭니다.'}
          </h1>
          <p className="mt-6 max-w-5xl text-base leading-7 sm:text-lg sm:leading-8" style={{ color: 'var(--text-muted)' }}>
            {en
              ? 'I build Cloud Native platforms and OSS, then use writing to verify what I think I understand. This site is a workbench for projects, experiments, notes, failures, and the questions that remain.'
              : 'Cloud Native 플랫폼과 OSS를 만들고, 글쓰기를 통해 이해를 검증합니다. 이 사이트는 프로젝트, 실험, 기록, 실패, 그리고 남은 질문을 모은 작업장입니다.'}
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 py-12 sm:px-8 sm:py-14 lg:px-16">
        <div className="font-mono text-[11px] tracking-[0.1em]" style={{ color: 'var(--accent)' }}>CURRENT ROLES</div>
        <h2 className="mt-3 text-2xl font-semibold sm:text-3xl" style={{ color: 'var(--text)' }}>{en ? 'Three roles I hold today' : '현재의 세 가지 역할'}</h2>
        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          {roles.map(([title, meta, description]) => <Card key={title} title={title} meta={meta} description={description} />)}
        </div>
      </section>

      <section className="border-y" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface-hi)' }}>
        <div className="mx-auto max-w-[1440px] px-5 py-12 sm:px-8 sm:py-14 lg:px-16">
          <div className="font-mono text-[11px] tracking-[0.1em]" style={{ color: 'var(--accent)' }}>COMMUNITY</div>
          <h2 className="mt-3 text-2xl font-semibold sm:text-3xl" style={{ color: 'var(--text)' }}>{en ? 'Long-running public work' : '오랫동안 이어온 공개 활동'}</h2>
          <div className="mt-6 grid gap-4 lg:grid-cols-3">
            {communityActivities.slice(0, 3).map(item => <Card key={item.org} title={`${item.org} · ${item.role}`} meta={item.period} description={item.desc} />)}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 py-12 sm:px-8 sm:py-14 lg:px-16">
        <div className="font-mono text-[11px] tracking-[0.1em]" style={{ color: 'var(--accent)' }}>RECOGNITION</div>
        <h2 className="mt-3 text-2xl font-semibold sm:text-3xl" style={{ color: 'var(--text)' }}>Recognition & awards</h2>
        <div className="mt-6 divide-y" style={{ borderColor: 'var(--border)' }}>
          {sortedAwards.slice(0, 5).map(item => (
            <div key={`${item.year}-${item.title}`} className="grid gap-2 py-4 sm:grid-cols-[70px_1fr] sm:gap-4">
              <div className="font-mono text-xs" style={{ color: 'var(--text-faint)' }}>{item.year}</div>
              <div className={item.highlight ? 'font-semibold' : ''} style={{ color: item.highlight ? 'var(--accent)' : 'var(--text)' }}>{item.title}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface-hi)' }}>
        <div className="mx-auto max-w-[1440px] px-5 py-12 sm:px-8 sm:py-14 lg:px-16">
          <div className="font-mono text-[11px] tracking-[0.1em]" style={{ color: 'var(--accent)' }}>RESEARCH</div>
          <h2 className="mt-3 text-2xl font-semibold sm:text-3xl" style={{ color: 'var(--text)' }}>Research & advisory</h2>
          <div className="mt-6 space-y-3">
            {advisory && <Card title={advisory.title} meta={String(advisory.year)} description={en ? 'Connecting research and advisory work back to engineering practice.' : '연구·자문 활동을 engineering practice와 연결해 기록.'} />}
            {researchReports.slice(0, 3).map(item => <Card key={`${item.year}-${item.title}`} title={item.title} meta={String(item.year)} description={en ? 'Connecting research and advisory work back to engineering practice.' : '연구·자문 활동을 engineering practice와 연결해 기록.'} />)}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-5 py-12 sm:px-8 sm:py-14 lg:px-16">
        <div className="font-mono text-[11px] tracking-[0.1em]" style={{ color: 'var(--accent)' }}>HOW I WORK</div>
        <h2 className="mt-3 text-2xl font-semibold sm:text-3xl" style={{ color: 'var(--text)' }}>Engineering philosophy</h2>
        <div className="mt-6 space-y-3">
          {philosophy.map(([index, title, description]) => (
            <div key={index} className="rounded-2xl border p-5" style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)' }}>
              <div className="font-mono text-[10px]" style={{ color: 'var(--accent)' }}>{index}</div>
              <div className="mt-2 text-lg font-semibold" style={{ color: 'var(--text)' }}>{title}</div>
              <div className="mt-2 text-sm" style={{ color: 'var(--text-muted)' }}>{description}</div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
