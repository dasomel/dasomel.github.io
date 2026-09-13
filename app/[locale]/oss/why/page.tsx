import Link from 'next/link';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { OssSubnav } from '@/components/oss/OssSubnav';

const steps = [
  ['01', 'Problem', '실제 운영 문제에서 시작합니다.', 'Start from an operational problem.'],
  ['02', 'Build', '설명보다 재현 가능한 구현을 남깁니다.', 'Leave a reproducible implementation, not just an explanation.'],
  ['03', 'Verify', '통합 경계와 실패 지점을 반복 검증합니다.', 'Continuously verify integration seams and failure points.'],
  ['04', 'Evolve', '릴리스와 변경 이력을 통해 계속 발전시킵니다.', 'Evolve through releases and visible development history.'],
  ['05', 'Share', '문서와 기준을 다시 사용할 수 있는 형태로 공개합니다.', 'Publish reusable documentation and engineering standards.'],
] as const;

export default async function WhyOssPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as 'ko' | 'en')) notFound();
  const currentLocale = locale as 'ko' | 'en';
  const en = currentLocale === 'en';
  const base = en ? '/en' : '/ko';
  const principles = en
    ? [['Reproducible','Someone else should be able to rebuild it.'],['Observable','Success and failure need visible signals.'],['Evolvable','Commits and releases should show change over time.'],['Reusable','Lessons should survive beyond one repository.']]
    : [['Reproducible','다른 사람도 같은 환경을 다시 만들 수 있어야 합니다.'],['Observable','성공과 실패를 확인할 수 있는 신호가 있어야 합니다.'],['Evolvable','Commit과 Release로 변화가 시간축에 남아야 합니다.'],['Reusable','한 저장소의 교훈이 다른 프로젝트에서도 재사용되어야 합니다.']];

  return (
    <main style={{ color: 'var(--text)' }}>
      <OssSubnav locale={currentLocale} active="why" />
      <div className="mx-auto max-w-[1180px] px-5 py-14 sm:px-8 lg:py-20">
        <section className="max-w-5xl">
          <div className="font-mono text-xs font-semibold uppercase tracking-[0.16em]" style={{ color: 'var(--accent)' }}>WHY OSS / ENGINEERING PRACTICE</div>
          <h1 className="mt-5 text-4xl font-semibold tracking-[-0.05em] sm:text-6xl">{en ? <>Why build OSS<br/>as an engineering practice?</> : <>왜 OSS를<br/>계속 만드는가?</>}</h1>
          <p className="mt-6 max-w-4xl text-lg leading-8" style={{ color: 'var(--text-muted)' }}>{en ? 'The goal is not to collect repositories. OSS is a way to turn real platform problems into reproducible systems, verify them in public, and keep the lessons reusable.' : '목표는 저장소 수를 늘리는 것이 아닙니다. 실제 플랫폼 문제를 재현 가능한 시스템으로 만들고, 검증하고, 그 과정에서 얻은 판단과 기준을 다시 사용할 수 있게 남기기 위해 OSS를 만듭니다.'}</p>
        </section>

        <section className="mt-14 border-y py-10" style={{ borderColor: 'var(--border)' }}>
          <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
            <div><div className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: 'var(--text-faint)' }}>{en ? 'THE PREMISE' : '출발점'}</div><h2 className="mt-3 text-3xl font-semibold">{en ? 'Software becomes useful when the seams survive.' : '기능보다 경계가 살아남아야 합니다.'}</h2></div>
            <div className="space-y-5 text-base leading-8" style={{ color: 'var(--text-muted)' }}><p>{en ? 'Platform engineering problems rarely live inside one tool. They appear between identity and RBAC, Git and runtime, PVC and storage, ingress and service mesh.' : 'Platform Engineering의 문제는 하나의 도구 안에서 끝나지 않습니다. Identity와 RBAC, Git과 Runtime, PVC와 Storage, Ingress와 Service Mesh 사이의 경계에서 실제 문제가 생깁니다.'}</p><p>{en ? 'OSS makes those boundaries visible: the code is inspectable, the setup can be reproduced, failures can be recorded, and design choices can be compared over time.' : 'OSS로 만들면 이 경계를 공개적으로 확인할 수 있습니다. 코드를 검토할 수 있고, 환경을 재현할 수 있으며, 실패를 기록하고, 설계 판단이 시간에 따라 어떻게 바뀌었는지도 남길 수 있습니다.'}</p></div>
          </div>
        </section>

        <section className="mt-14">
          <div className="font-mono text-[11px] font-semibold uppercase tracking-[0.14em]" style={{ color: 'var(--accent)' }}>ENGINEERING LOOP</div>
          <div className="mt-6 divide-y" style={{ borderColor: 'var(--border-soft)' }}>{steps.map(([no,title,ko,english]) => <div key={no} className="grid gap-3 py-6 sm:grid-cols-[70px_170px_1fr] sm:items-baseline"><div className="font-mono text-xs" style={{ color: 'var(--text-faint)' }}>{no}</div><div className="text-lg font-semibold">{title}</div><p className="text-sm leading-7" style={{ color: 'var(--text-muted)' }}>{en ? english : ko}</p></div>)}</div>
        </section>

        <section className="mt-16 border-y py-10" style={{ borderColor:'var(--border)' }}>
          <div className="grid gap-8 lg:grid-cols-[0.75fr_1.25fr]">
            <div><div className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em]" style={{ color:'var(--signal)' }}>{en?'DESIGN PRINCIPLES':'설계 원칙'}</div><h2 className="mt-3 text-3xl font-semibold">{en?'What the work optimizes for':'무엇을 최적화하는가'}</h2><p className="mt-4 text-sm leading-7" style={{ color:'var(--text-muted)' }}>{en?'Not stars, repository count, or technology breadth. The target is durable engineering evidence.':'Star 수, 저장소 수, 기술 개수보다 오래 남는 engineering evidence를 우선합니다.'}</p><Link href={`/${currentLocale}/oss/evidence/`} className="mt-5 inline-flex rounded-full px-4 py-2 text-sm font-semibold" style={{ border:'1px solid var(--signal)', color:'var(--signal)' }}>{en?'How evidence is measured →':'Evidence 측정 기준 보기 →'}</Link></div>
            <div className="grid gap-4 sm:grid-cols-2">{principles.map(([title,body]) => <div key={title} className="rounded-2xl p-5" style={{ backgroundColor:'var(--surface-hi)', border:'1px solid var(--border)' }}><div className="text-lg font-semibold">{title}</div><p className="mt-2 text-sm leading-6" style={{ color:'var(--text-muted)' }}>{body}</p></div>)}</div>
          </div>
        </section>

        <section className="mt-16 grid gap-5 md:grid-cols-3">
          {[['Standards','OpenForge',en?'Turn repeated OSS decisions into reusable standards.':'반복되는 OSS 의사결정을 재사용 가능한 표준으로 정리합니다.'],['Platform','Narwhal',en?'Integrate identity, delivery, networking, observability and storage as one system.':'Identity, Delivery, Network, Observability, Storage를 하나의 시스템으로 통합하고 검증합니다.'],['Workloads','Beluga · KubeMetal',en?'Test the platform against data and AI/edge constraints.':'Data와 AI/Edge workload 제약을 통해 플랫폼을 다시 검증합니다.']].map(([role,name,body]) => <div key={role} className="rounded-2xl p-6" style={{ border:'1px solid var(--border)', backgroundColor:'var(--surface)' }}><div className="font-mono text-[10px] uppercase tracking-[0.14em]" style={{ color:'var(--text-faint)' }}>{role}</div><h3 className="mt-3 text-xl font-semibold">{name}</h3><p className="mt-3 text-sm leading-6" style={{ color:'var(--text-muted)' }}>{body}</p></div>)}
        </section>

        <section className="mt-16 rounded-3xl p-7 sm:p-9" style={{ border: '1px solid var(--accent)', backgroundColor: 'var(--accent-dim)' }}>
          <div className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em]" style={{ color: 'var(--accent)' }}>{en ? 'TWO DIFFERENT STORIES' : '두 페이지의 역할을 분리합니다'}</div>
          <h2 className="mt-3 text-2xl font-semibold">{en ? 'Why OSS explains the practice. Story explains the evolution.' : 'Why OSS는 이유를, Story는 변화 과정을 설명합니다.'}</h2>
          <p className="mt-3 max-w-3xl text-sm leading-7" style={{ color: 'var(--text-muted)' }}>{en ? 'If you want to see how my engineering judgement evolved from framework work to platform engineering, OSS, and AI-assisted development, continue to the Engineering Story.' : 'Framework에서 DevOps, Cloud Native, Platform, OSS, AI-assisted Engineering으로 판단 기준이 어떻게 바뀌었는지는 Engineering Story에서 이어집니다.'}</p>
          <div className="mt-6 flex flex-wrap gap-3"><Link href={en ? '/oss/en/' : '/oss/'} className="rounded-full px-4 py-2 text-sm font-semibold" style={{ backgroundColor:'var(--accent)', color:'var(--accent-fg)' }}>{en?'Browse OSS →':'OSS 프로젝트 보기 →'}</Link><Link href={`${base}/oss/story/`} className="rounded-full px-4 py-2 text-sm font-semibold" style={{ border:'1px solid var(--border)', color:'var(--text)' }}>Engineering Story →</Link></div>
        </section>
      </div>
    </main>
  );
}
