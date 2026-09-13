type Item = { name: string; docs: number };

export function OssDocsCoverage({ items, locale }: { items: Item[]; locale: 'ko' | 'en' }) {
  const en = locale === 'en';
  const max = Math.max(...items.map((item) => item.docs), 1);
  return <section className="mt-14"><div className="font-mono text-[10px] font-semibold uppercase tracking-[0.14em]" style={{ color:'var(--accent)' }}>{en ? 'DOCUMENTATION COVERAGE' : 'DOCUMENTATION COVERAGE'}</div><h2 className="mt-3 text-2xl font-semibold">{en ? 'Code evolves with documentation.' : '코드만 늘지 않고 문서도 함께 확장됩니다.'}</h2><div className="mt-6 space-y-3">{items.map((item)=><div key={item.name} className="grid grid-cols-[150px_1fr_54px] items-center gap-3"><div className="truncate text-sm font-medium">{item.name}</div><div className="h-2 overflow-hidden rounded-full" style={{ backgroundColor:'var(--surface-hi)' }}><div className="h-full rounded-full" style={{ width:`${Math.max(6,(item.docs/max)*100)}%`, backgroundColor:'var(--accent)' }}/></div><div className="text-right font-mono text-[10px]" style={{ color:'var(--text-faint)' }}>{item.docs} docs</div></div>)}</div></section>;
}
