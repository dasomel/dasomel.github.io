import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { StorySlides } from '@/components/visual/StorySlides';

const timelineKo=[['2013','eGovFrame community','커뮤니티 활동을 시작하며 공개적인 기술 공유와 기여를 본격화.'],['2015','OPDC','Open Platform Developer Community에서 장기 커뮤니티 활동 시작.'],['2021','Cloud Native + Recognition','Cloud Native DevOps 학습조직 활동, 행정안전부장관 표창, OPDC 공로상.'],['2022','OPA','Open Platform Alliance 리더 활동 시작. 민간 주도 개방형 클라우드 생태계 활동 확대.'],['2024','AI + Research','표준프레임워크에서의 AI 활용방안 연구, OPA 우수기여자 수상.'],['2025','OSS portfolio','CloudBro AI, OPA Community Hero, 다수 OSS 프로젝트를 하나의 workbench로 운영.'],['2026','Teaching + Advisory','한국공학대학교 겸임교수, NIA 차세대 표준프레임워크 전문가 자문.']] as const;
const timelineEn=[['2013','eGovFrame community','Started community work and made public technical sharing and contribution a regular practice.'],['2015','OPDC','Began a long-running contribution to the Open Platform Developer Community.'],['2021','Cloud Native + Recognition','Expanded Cloud Native DevOps work and received public and community recognition.'],['2022','OPA','Started serving as a leader in the Open Platform Alliance and broadened ecosystem work.'],['2024','AI + Research','Worked on AI adoption research for eGovFrame and received an OPA contributor award.'],['2025','OSS portfolio','Operated multiple OSS projects as one engineering workbench and expanded community activity.'],['2026','Teaching + Advisory','Teaching at Tech University of Korea while continuing expert advisory work.']] as const;
const principlesKo=[['Build','직접 만들고 운영하면서 판단한다.'],['Verify','완료보다 검증 가능한 evidence를 남긴다.'],['Share','배운 것과 실패를 문서와 발표로 공개한다.']] as const;
const principlesEn=[['Build','Judge ideas by building and operating them directly.'],['Verify','Leave verifiable evidence, not just a claim of completion.'],['Share','Publish what worked, what failed, and what changed my mind.']] as const;

export default async function OssStoryPage({params}:{params:Promise<{locale:string}>}){
  const {locale}=await params;
  if(!routing.locales.includes(locale as 'ko'|'en')) notFound();
  const en=locale==='en';
  const timeline=en?timelineEn:timelineKo;
  const principles=en?principlesEn:principlesKo;
  return <main>
    <section className="border-b" style={{borderColor:'var(--border)'}}><div className="mx-auto max-w-[1440px] px-5 py-12 sm:px-8 lg:px-16 lg:py-16"><div className="font-mono text-xs tracking-[0.14em]" style={{color:'var(--accent)'}}>ENGINEERING JOURNEY / SLIDES</div><h1 className="mt-5 text-4xl font-semibold tracking-[-0.055em] sm:text-6xl" style={{color:'var(--text)'}}>{en?<>From community work,<br/>to an OSS workbench.</>:<>커뮤니티에서 시작해,<br/>OSS Workbench까지.</>}</h1><p className="mt-6 max-w-4xl text-base leading-7 sm:text-lg" style={{color:'var(--text-muted)'}}>{en?'Move through the journey one chapter at a time. Scroll, swipe, or use the controls to navigate the turning points.':'한 번에 하나의 장면에 집중하도록 다시 슬라이드형 Story로 구성했습니다. 스크롤·스와이프 또는 하단 컨트롤로 전환점을 따라갑니다.'}</p></div></section>
    <section className="mx-auto max-w-[1440px] px-3 py-5 sm:px-8 sm:py-8 lg:px-16"><StorySlides items={timeline} lang={en?'en':'ko'}/></section>
    <section className="border-y" style={{borderColor:'var(--border)',backgroundColor:'var(--surface-hi)'}}><div className="mx-auto max-w-[1440px] px-5 py-12 sm:px-8 lg:px-16"><div className="font-mono text-xs tracking-[0.12em]" style={{color:'var(--accent)'}}>WHAT STAYED CONSTANT</div><h2 className="mt-3 text-2xl font-semibold sm:text-3xl" style={{color:'var(--text)'}}>Build → Verify → Share</h2><div className="mt-7 grid gap-4 lg:grid-cols-3">{principles.map(([title,description])=><div key={title} className="rounded-2xl border p-5" style={{borderColor:'var(--border)',backgroundColor:'var(--surface)'}}><h3 className="text-xl font-semibold" style={{color:'var(--text)'}}>{title}</h3><p className="mt-2 text-sm leading-6" style={{color:'var(--text-muted)'}}>{description}</p></div>)}</div></div></section>
  </main>;
}
