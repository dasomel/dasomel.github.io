import { notFound } from 'next/navigation';
import OssStoryInfographic from '@/components/oss/OssStoryInfographic';
import OssStoryMobileInfographic from '@/components/oss/OssStoryMobileInfographic';
import { OssSubnav } from '@/components/oss/OssSubnav';
import styles from './oss-story.module.css';
import { routing } from '@/i18n/routing';

export default async function OssStoryPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as 'ko' | 'en')) notFound();
  const currentLocale = locale as 'ko' | 'en';
  const en = currentLocale === 'en';
  const eras = ['Framework', 'DevOps', 'Cloud Native', 'Platform', 'OSS', 'AI-assisted Engineering'];
  return (
    <main>
      <OssSubnav locale={currentLocale} active="story" />
      <section className="border-b" style={{borderColor:'var(--border)'}}>
        <div className="mx-auto max-w-[1440px] px-5 py-12 sm:px-8 lg:px-16 lg:py-16">
          <div className="font-mono text-xs font-semibold tracking-[0.14em]" style={{color:'var(--accent)'}}>STORY / ENGINEERING EVOLUTION</div>
          <h1 className="mt-5 max-w-5xl text-4xl font-semibold tracking-[-0.055em] sm:text-6xl" style={{color:'var(--text)'}}>{en?<>Tools changed.<br/>The judgement became clearer.</>:<>도구는 바뀌었고,<br/>판단 기준은 더 선명해졌습니다.</>}</h1>
          <p className="mt-6 max-w-4xl text-base leading-8 sm:text-lg" style={{color:'var(--text-muted)'}}>{en?'This story follows the constraints, systems, decisions and evidence that changed how I approach engineering. It is a timeline of judgement rather than a career brochure.':'이 Story는 경력 홍보보다 어떤 제약·시스템·의사결정·검증 경험이 엔지니어링 판단을 바꿨는지 따라가는 timeline입니다.'}</p>
        </div>
      </section>
      <section className="border-b" style={{borderColor:'var(--border)',backgroundColor:'var(--surface-hi)'}}>
        <div className="mx-auto max-w-[1440px] px-5 py-5 sm:px-8 lg:px-16">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-[9px] uppercase tracking-[0.09em]" style={{color:'var(--text-faint)'}}>{eras.map((era,i)=><span key={era} className="inline-flex items-center gap-3"><span style={{color:i===eras.length-1?'var(--signal)':i===3?'var(--accent)':'var(--text-faint)'}}>{String(i+1).padStart(2,'0')} / {era}</span>{i<eras.length-1&&<span>→</span>}</span>)}</div>
        </div>
      </section>
      <div className={styles.scope}>
        <div className="hidden min-[761px]:block"><OssStoryInfographic locale={currentLocale} /></div>
        <div className="min-[761px]:hidden"><OssStoryMobileInfographic locale={currentLocale} /></div>
      </div>
    </main>
  );
}
