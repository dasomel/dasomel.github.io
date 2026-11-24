import type { OssPortfolioGroup } from '@/lib/oss';

export function OssGroupIntro({ group, locale, docs }: { group: OssPortfolioGroup; locale: 'ko' | 'en'; docs: number }) {
  const en = locale === 'en';
  const count = group.projects.length;
  return <div>
    <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
      <div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="text-xs font-semibold uppercase tracking-[0.16em]" style={{ color:'var(--accent)' }}>{group.label}</div>
          <div className="font-mono text-[10px]" style={{ color:'var(--text-faint)' }}>{count} {count===1?'project':'projects'} · {docs} docs</div>
        </div>
        <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">{group.headline[locale]}</h2>
        <p className="mt-3 text-sm leading-7" style={{ color:'var(--text-muted)' }}>{group.description[locale]}</p>
        <div className="mt-5 border-l-2 pl-4" style={{ borderColor:'var(--signal)' }}>
          <div className="text-[10px] font-semibold uppercase tracking-[0.14em]" style={{ color:'var(--text-faint)' }}>{en?'Question this area answers':'이 분야가 답하는 질문'}</div>
          <p className="mt-2 text-sm leading-6">{group.question[locale]}</p>
        </div>
      </div>
      <ul className="space-y-3">
        {group.focus.map((item) => <li key={item.title.en} className="rounded-xl p-4" style={{ border:'1px solid var(--border)', backgroundColor:'var(--bg-subtle)' }}>
          <div className="text-sm font-semibold">{item.title[locale]}</div>
          <p className="mt-1.5 text-sm leading-6" style={{ color:'var(--text-muted)' }}>{item.body[locale]}</p>
        </li>)}
      </ul>
    </div>
  </div>;
}
