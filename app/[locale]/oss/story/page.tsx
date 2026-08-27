import { notFound } from 'next/navigation';
import OssStoryInfographic from '@/components/oss/OssStoryInfographic';
import OssStoryMobileInfographic from '@/components/oss/OssStoryMobileInfographic';
import styles from './oss-story.module.css';
import { routing } from '@/i18n/routing';

export default async function OssStoryPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as 'ko' | 'en')) notFound();
  const currentLocale = locale as 'ko' | 'en';
  const en = currentLocale === 'en';
  const principles = en
    ? ['Problem', 'Reproducibility', 'Integration', 'Verification', 'Governance', 'Learning']
    : ['문제 정의', '재현성', '통합', '검증', '운영 규칙', '학습'];

  return (
    <main>
      <section className="border-b" style={{borderColor:'var(--border)'}}>
        <div className="mx-auto max-w-[1440px] px-5 py-12 sm:px-8 lg:px-16 lg:py-16">
          <div className="font-mono text-xs font-semibold tracking-[0.14em]" style={{color:'var(--accent)'}}>
            {en ? 'WHY OSS / ENGINEERING PRINCIPLES' : 'WHY OSS / ENGINEERING PRINCIPLES'}
          </div>
          <h1 className="mt-5 max-w-5xl text-4xl font-semibold tracking-[-0.055em] sm:text-6xl" style={{color:'var(--text)'}}>
            {en ? <>Why I build<br/>open source.</> : <>왜 OSS를<br/>만드는가.</>}
          </h1>
          <p className="mt-6 max-w-4xl text-base leading-8 sm:text-lg" style={{color:'var(--text-muted)'}}>
            {en
              ? 'Open source is where an engineering decision can be inspected, reproduced, challenged and improved by someone else. This page explains the principles behind the workbench rather than retelling a career timeline.'
              : 'OSS는 엔지니어링 판단을 다른 사람이 확인하고, 재현하고, 반박하고, 개선할 수 있게 만드는 공간입니다. 이 페이지는 경력 연대기를 다시 보여주기보다 OSS Workbench를 만드는 이유와 판단 기준을 설명합니다.'}
          </p>
        </div>
      </section>

      <section className="border-b" style={{borderColor:'var(--border)',backgroundColor:'var(--surface-hi)'}}>
        <div className="mx-auto max-w-[1440px] px-5 py-5 sm:px-8 lg:px-16">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-[9px] uppercase tracking-[0.09em]" style={{color:'var(--text-faint)'}}>
            {principles.map((principle,i)=><span key={principle} className="inline-flex items-center gap-3"><span style={{color:i===0?'var(--accent)':'var(--text-faint)'}}>{String(i+1).padStart(2,'0')} / {principle}</span>{i<principles.length-1&&<span>→</span>}</span>)}
          </div>
        </div>
      </section>

      <div className={styles.scope}>
        <div className="hidden min-[761px]:block"><OssStoryInfographic locale={currentLocale} /></div>
        <div className="min-[761px]:hidden"><OssStoryMobileInfographic locale={currentLocale} /></div>
      </div>
    </main>
  );
}
