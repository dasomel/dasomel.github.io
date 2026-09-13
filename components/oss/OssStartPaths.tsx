import Link from 'next/link';

export function OssStartPaths({ locale }: { locale: 'ko' | 'en' }) {
  const en = locale === 'en';
  const cards = [
    { no:'01', title: en ? 'Understand the practice' : '왜 만드는지 이해하기', body: en ? 'Why OSS explains the engineering practice behind the repositories.' : 'Why OSS에서 저장소 뒤에 있는 engineering practice를 먼저 설명합니다.', href:`/${locale}/oss/why/`, cta: en ? 'Why OSS' : '왜 OSS인가' },
    { no:'02', title: en ? 'Explore the systems' : '시스템 살펴보기', body: en ? 'Browse standards, platform, capabilities, data and AI/edge projects.' : 'Standards, Platform, Capability, Data, AI/Edge 프로젝트를 직접 살펴봅니다.', href: en ? '/oss/en/' : '/oss/', cta: en ? 'Browse systems' : 'OSS 살펴보기' },
    { no:'03', title: en ? 'Follow the evolution' : '판단의 변화 따라가기', body: en ? 'Engineering Story shows how the judgement evolved over time.' : 'Engineering Story에서 Framework부터 AI-assisted Engineering까지 판단의 변화를 봅니다.', href:`/${locale}/oss/story/`, cta:'Engineering Story' },
  ];
  return <section className="mt-10 grid gap-4 md:grid-cols-3">
    {cards.map(card => <Link key={card.no} href={card.href} className="group rounded-2xl p-6 transition hover:-translate-y-0.5" style={{ border:'1px solid var(--border)', backgroundColor:'var(--surface)' }}><div className="font-mono text-[10px] font-semibold tracking-[0.14em]" style={{ color:'var(--accent)' }}>{card.no}</div><h3 className="mt-3 text-xl font-semibold">{card.title}</h3><p className="mt-3 text-sm leading-6" style={{ color:'var(--text-muted)' }}>{card.body}</p><div className="mt-5 text-sm font-semibold" style={{ color:'var(--accent)' }}>{card.cta} →</div></Link>)}
  </section>;
}
